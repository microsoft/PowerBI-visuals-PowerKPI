#!/usr/bin/env node
// Repoint an npm package-lock.json at the public npm registry, restoring proper
// sha512 integrity - with proof that the artifact is byte-identical to the one the
// internal source served.
//
// Detection is an ALLOWLIST, not a denylist: every entry whose `resolved` host is
// not the configured public registry (or an explicit --allow-host) is treated as
// non-public. That way an unknown internal mirror is flagged instead of leaking.
//
// Node 18+ (built-in fetch, AbortSignal.timeout). Zero dependencies.
//
// Usage:
//   node sanitize-lockfile.mjs [options]
//
// Options:
//   --path <file>        Lock file path                  (default: package-lock.json)
//   --registry <url>     Public registry base URL        (default: https://registry.npmjs.org)
//   --check              Offline scan only, no network, no write. Exit 1 if dirty.
//   --dry-run            Resolve + verify, print the plan, do NOT write.
//   --verify-all         Re-check EVERY entry already pointing at the public registry
//                        against it, not just the poisoned ones. Use after a lock file
//                        was touched by hand or by an older tool. Slow.
//   --verify-tarball     Download every tarball and hash it locally (slow, paranoid).
//   --concurrency <n>    Parallel registry requests       (default: 8)
//   --json               Machine-readable report on stdout (for CI).
//   -h, --help           Show this help.
//
// Exit codes: 0 = clean / fixed, 1 = dirty (--check) or failure, 2 = usage error.
//
// Why this is safe:
//   The feed rewrites `integrity` to `sha1-<base64>`, which is the SAME digest the
//   public registry publishes as `dist.shasum` (hex). We decode the recorded sha1 and
//   require it to equal `dist.shasum` before adopting the public `dist.integrity`.
//   A mismatch means the tarballs differ - the script aborts instead of guessing.
//   Entries that already carry sha512 must match the public sha512 exactly.
//
// The file is edited in a single pass scoped to the `resolved` / `integrity` JSON
// values (never re-serialized), so key order and formatting stay intact, no other
// part of the file can be touched, and the diff stays minimal.

import { lstat, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";

// ---------------------------------------------------------------- constants --

// Detection is an ALLOWLIST: anything whose `resolved` host is not the public
// registry counts as non-public. A denylist of known feed hosts would silently miss
// any other internal mirror (Artifactory, another ADO org, a corporate proxy...).
// These hosts are only used to phrase the diagnosis and to scan .npmrc.
const KNOWN_FEED_HOSTS = [
  "pkgs.visualstudio.com",
  "pkgs.dev.azure.com",
  "packagefeedproxy.microsoft.io",
];
// Supplementary net: catches a known feed host anywhere in the file, including
// fields this script does not model (funding URLs, comments, stray metadata).
const FEED_TEXT_RE = new RegExp(KNOWN_FEED_HOSTS.map((h) => h.replace(/\./g, "\\.")).join("|"), "g");
const SHA1_RE = /"integrity":\s*"sha1-/g;
// The only two fields we are ever allowed to touch, matched as whole JSON values.
const FIELD_RE = /("(?:resolved|integrity)":\s*")([^"\\]*)(")/g;
const BOM = "\uFEFF";
const DEFAULT_PATH = "package-lock.json";

const HELP = `sanitize-lockfile - repoint an npm package-lock.json at registry.npmjs.org

  node sanitize-lockfile.mjs [--path package-lock.json] [--registry https://registry.npmjs.org]
                             [--check | --dry-run] [--verify-all] [--verify-tarball]
                             [--allow-host <host>] [--concurrency 8] [--json]

  --check        offline, no write, exit 1 when the lock file resolves anything from
                 a non-public host or carries sha1 integrity (CI / pre-commit hooks)
  --verify-all   audit every entry that claims to come from the public registry and
                 restore any value that does not match it (needs network)
  --allow-host   treat this host as legitimate too (repeatable); use for a package
                 genuinely published outside the registry
`;

/** Thrown to unwind out of main() with an exit code, instead of process.exit(). */
class Halt extends Error {
  constructor(code) {
    super(`halt:${code}`);
    this.code = code;
  }
}

// ------------------------------------------------------------------- args ----

function parseArgs(argv) {
  const o = {
    path: DEFAULT_PATH,
    registry: "https://registry.npmjs.org",
    mode: "fix",
    verifyTarball: false,
    verifyAll: false,
    allowHosts: [],
    concurrency: 8,
    json: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      const v = argv[++i];
      if (v === undefined) throw new UsageError(`Missing value for ${a}`);
      return v;
    };
    switch (a) {
      case "--path": o.path = next(); break;
      case "--registry": o.registry = next().replace(/\/+$/, ""); break;
      case "--check": o.mode = "check"; break;
      case "--dry-run": o.mode = "dry-run"; break;
      case "--verify-all": o.verifyAll = true; break;
      case "--verify-tarball": o.verifyTarball = true; break;
      case "--allow-host": o.allowHosts.push(next().replace(/^https?:\/\//, "").replace(/\/.*$/, "")); break;
      case "--concurrency": o.concurrency = Math.max(1, Number(next()) || 1); break;
      case "--json": o.json = true; break;
      case "-h":
      case "--help": o.help = true; break;
      default: throw new UsageError(`Unknown argument: ${a}`);
    }
  }
  if (o.verifyAll && o.mode === "check") {
    throw new UsageError("--verify-all needs the network; use it without --check (add --dry-run to avoid writing).");
  }
  return o;
}

class UsageError extends Error {}

// ------------------------------------------------------------ lock parsing ---

/** Flatten every dependency record that can carry `resolved` / `integrity`. */
function collectEntries(lock) {
  const out = [];
  for (const [key, val] of Object.entries(lock.packages ?? {})) {
    if (!val || typeof val !== "object") continue;
    if (key === "" || val.link === true) continue;
    out.push({
      section: "packages",
      key,
      name: val.name ?? key.replace(/.*node_modules\//, ""),
      version: val.version,
      resolved: val.resolved,
      integrity: val.integrity,
    });
  }
  // lockfileVersion 2 keeps a legacy `dependencies` mirror that npm still reads.
  // Aliases are recorded there as `"version": "npm:<realName>@<realVersion>"`.
  const walk = (deps, prefix) => {
    for (const [name, val] of Object.entries(deps ?? {})) {
      if (!val || typeof val !== "object") continue;
      const alias = /^npm:(.+)@([^@]+)$/.exec(val.version ?? "");
      out.push({
        section: "dependencies",
        key: `${prefix}${name}`,
        name: alias ? alias[1] : name,
        version: alias ? alias[2] : val.version,
        resolved: val.resolved,
        integrity: val.integrity,
      });
      if (val.dependencies) walk(val.dependencies, `${prefix}${name}/`);
    }
  };
  walk(lock.dependencies, "");
  return out;
}

const isSha1 = (s) => typeof s === "string" && s.startsWith("sha1-");
const looksLikeKnownFeed = (s) =>
  typeof s === "string" && KNOWN_FEED_HOSTS.some((h) => s.includes(h));

/** Host of an http(s) `resolved` URL, or undefined for file:/link:/git+ssh:/... */
function resolvedHost(resolved) {
  if (typeof resolved !== "string" || !/^https?:\/\//.test(resolved)) return undefined;
  try {
    return new URL(resolved).host;
  } catch {
    return undefined;
  }
}

/**
 * Allowlist classification. Everything that is not demonstrably the public registry
 * is treated as non-public and has to be swapped or explicitly allowed.
 */
function makeClassifier(registryHost, allowHosts) {
  const allowed = new Set([registryHost, ...allowHosts]);
  return (e) => {
    const host = resolvedHost(e.resolved);
    if (host === undefined) return "local"; // file:, link:, git+ssh:, workspace, absent
    return allowed.has(host) ? "public" : "non-public";
  };
}

/** Registry-hosted deps that lost their `resolved` field entirely (informational). */
function findMissingResolved(entries) {
  return entries.filter(
    (e) =>
      e.section === "packages" &&
      // workspace roots live outside node_modules and legitimately have no `resolved`
      e.key.startsWith("node_modules/") &&
      !e.resolved &&
      e.version &&
      !/^(file|git|https?|link|npm):/.test(e.version)
  );
}

/** A committed .npmrc can break or endanger a public repo just as much as the lock. */
async function scanNpmrc(lockPath) {
  const warnings = [];
  let text;
  try {
    text = await readFile(join(dirname(resolve(lockPath)), ".npmrc"), "utf8");
  } catch {
    return warnings;
  }
  if (KNOWN_FEED_HOSTS.some((h) => text.includes(h))) {
    warnings.push(".npmrc next to the lock file points at a corporate feed - it must not be committed to a public repo");
  }
  if (/^[^#\n]*(_auth|_authToken|_password)\s*=/m.test(text)) {
    warnings.push(".npmrc next to the lock file contains credentials - never commit it, rotate the token if it was pushed");
  }
  return warnings;
}

/** Pick the sha512 token out of an SRI string that may hold several digests. */
function sha512Of(integrity) {
  if (typeof integrity !== "string") return undefined;
  return integrity.trim().split(/\s+/).find((t) => t.startsWith("sha512-"));
}

// ------------------------------------------------------------------- http ----

async function fetchWithRetry(url, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
      // Retry throttling and server-side failures only; other 4xx are final.
      if (res.status !== 429 && res.status < 500) return res;
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (e) {
      lastErr = e;
    }
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, 300 * 3 ** i));
  }
  throw lastErr;
}

/** Download a tarball and compute both digests locally. */
async function hashTarball(url) {
  const res = await fetchWithRetry(url);
  if (!res.ok) throw new Error(`tarball HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return {
    sha1: createHash("sha1").update(buf).digest("hex"),
    sha512: `sha512-${createHash("sha512").update(buf).digest("base64")}`,
  };
}

async function pool(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await worker(items[i]);
    }
  });
  await Promise.all(runners);
  return results;
}

// --------------------------------------------------------------- resolution --

/**
 * Ask the public registry for the canonical tarball + integrity of name@version
 * and PROVE it is the same artifact the lock file already pinned.
 */
async function resolvePackage({ name, version, sha1s, sha512s, canonical }, opts) {
  const registryHost = new URL(opts.registry).host;
  const encoded = name.split("/").map(encodeURIComponent).join("/");
  const metaUrl = `${opts.registry}/${encoded}/${encodeURIComponent(version)}`;
  const res = await fetchWithRetry(metaUrl);
  if (!res.ok) throw new Error(`metadata HTTP ${res.status} for ${metaUrl}`);
  const meta = await res.json();

  if (meta.name !== name || meta.version !== version) {
    throw new Error(`registry returned ${meta.name}@${meta.version}, expected ${name}@${version}`);
  }
  const tarball = meta?.dist?.tarball;
  if (!tarball) throw new Error("registry metadata has no dist.tarball");

  const tUrl = new URL(tarball);
  if (tUrl.host !== registryHost) {
    throw new Error(`dist.tarball host is ${tUrl.host}, expected ${registryHost} (proxy interference?)`);
  }
  if (!decodeURIComponent(tUrl.pathname).includes(`/${name}/-/`)) {
    throw new Error(`dist.tarball path ${tUrl.pathname} does not belong to ${name}`);
  }

  let publicSha512 = sha512Of(meta?.dist?.integrity);
  let publicSha1 = meta?.dist?.shasum;
  let proof;

  // Old packages may predate SRI; then the only way to get a sha512 is to hash it.
  if (opts.verifyTarball || !publicSha512) {
    const hashed = await hashTarball(tarball);
    if (publicSha512 && hashed.sha512 !== publicSha512) {
      throw new Error("downloaded tarball does not match the registry's own sha512");
    }
    if (publicSha1 && hashed.sha1 !== publicSha1) {
      throw new Error("downloaded tarball does not match the registry's own shasum");
    }
    publicSha512 = hashed.sha512;
    publicSha1 = hashed.sha1;
    proof = "tarball-hashed";
  }
  if (!publicSha512) throw new Error("could not obtain a sha512 for this version");

  // --- the actual anti-mistake guarantee -----------------------------------
  // The lock file may hold several digests for one name@version (a failed install or
  // a hand edit corrupts some copies). Exactly one artifact is published for a given
  // version, so the registry adjudicates: if any recorded digest matches it, the
  // artifact is proven and the divergent copies are corrupt and get repaired.
  const warnings = [];
  const sha1Hex = (sri) => Buffer.from(sri.slice("sha1-".length), "base64").toString("hex");
  const conflicted = sha512s.size + sha1s.size > 1;

  if (sha512s.size) {
    if (sha512s.has(publicSha512)) {
      proof ??= conflicted ? "conflict-resolved" : "sha512-match";
    } else if (canonical) {
      proof ??= "canonical-repair";
    } else {
      throw new Error(
        `sha512 mismatch: lock has ${[...sha512s].map((s) => `${s.slice(0, 24)}...`).join(", ")}, registry has ${publicSha512.slice(0, 24)}... - no recorded digest matches the published artifact`
      );
    }
    for (const s1 of sha1s) {
      if (publicSha1 && sha1Hex(s1) !== publicSha1) {
        warnings.push(`${name}@${version}: an entry recorded sha1 ${sha1Hex(s1)}, which is not the published tarball - replaced`);
      }
    }
  } else if (sha1s.size) {
    if (!publicSha1) throw new Error("registry metadata has no shasum to compare the recorded sha1 against");
    if ([...sha1s].some((s1) => sha1Hex(s1) === publicSha1)) {
      proof ??= conflicted ? "conflict-resolved" : "sha1-shasum-match";
    } else {
      throw new Error(
        `sha1 mismatch: lock has ${[...sha1s].map(sha1Hex).join(", ")}, registry has ${publicSha1} - no recorded digest matches the published artifact`
      );
    }
  } else {
    throw new Error("entry has no integrity to verify against");
  }

  return { tarball, integrity: publicSha512, proof, warnings };
}

// -------------------------------------------------------------------- main ---

async function main(opts, report, log) {
  const fatal = (message) => {
    report.status = "failed";
    report.error = message;
    if (!opts.json && report.failures.length) {
      console.error(`\nFAILURES (${report.failures.length}):`);
      for (const f of report.failures) console.error(`  - ${f}`);
    }
    if (!opts.json) console.error(`\n${message}`);
    throw new Halt(1);
  };

  let file;
  try {
    const stats = await lstat(opts.path);
    if (!stats.isFile() || stats.isSymbolicLink()) {
      fatal(`Lock file '${opts.path}' must be a regular file, not a symbolic link.`);
    }
    file = await readFile(opts.path, "utf8");
  } catch (e) {
    if (e instanceof Halt) throw e;
    fatal(`Cannot read lock file '${opts.path}': ${e.message}`);
  }
  // A stray BOM would break JSON.parse; keep it so the diff stays minimal.
  const bom = file.startsWith(BOM) ? BOM : "";
  const raw = bom ? file.slice(BOM.length) : file;

  let lock;
  try {
    lock = JSON.parse(raw);
  } catch (e) {
    fatal(`'${opts.path}' is not valid JSON: ${e.message}`);
  }
  if (!lock.packages && !lock.dependencies) {
    fatal(`No 'packages' or 'dependencies' section in '${opts.path}'.`);
  }

  report.warnings.push(...(await scanNpmrc(opts.path)));

  const entries = collectEntries(lock);
  const registryHost = new URL(opts.registry).host;
  const classify = makeClassifier(registryHost, opts.allowHosts);
  const isSuspect = (e) => classify(e) === "non-public" || isSha1(e.integrity);

  const suspects = entries.filter(isSuspect);
  report.suspects = suspects.length;

  // Group the offending hosts so an unknown internal mirror is named, not just counted.
  const hosts = new Map();
  for (const e of entries) {
    if (classify(e) !== "non-public") continue;
    const host = resolvedHost(e.resolved);
    hosts.set(host, (hosts.get(host) ?? 0) + 1);
  }
  report.nonPublicHosts = Object.fromEntries(hosts);

  // A VCS/ssh dependency cannot be swapped, but it can still leak or break outsiders.
  for (const e of entries) {
    if (classify(e) !== "local" || !e.resolved) continue;
    if (looksLikeKnownFeed(e.resolved) || e.resolved.startsWith("git+ssh://")) {
      report.warnings.push(
        `${e.key} resolves to '${e.resolved}' - not reachable by external contributors and cannot be swapped automatically`
      );
    }
  }

  // --verify-all also re-checks entries that already claim to come from the public
  // registry - the only way to catch a value someone edited by hand.
  const claimsPublic = (e) => Boolean(e.integrity) && !isSuspect(e) && classify(e) === "public";
  const targets = opts.verifyAll ? [...suspects, ...entries.filter(claimsPublic)] : suspects;

  for (const e of findMissingResolved(entries)) {
    report.warnings.push(`${e.key} has no 'resolved' field - npm ci may fall back to the configured registry`);
  }

  const sha1Hits = (raw.match(SHA1_RE) || []).length;
  const feedTextHits = (raw.match(FEED_TEXT_RE) || []).length;

  // ---- check mode: offline gate ---------------------------------------------

  if (opts.mode === "check") {
    log(`Non-public resolved URLs : ${[...hosts.values()].reduce((a, b) => a + b, 0)}`);
    for (const [host, count] of hosts) {
      log(`  ${host}: ${count}${looksLikeKnownFeed(host) ? " (known corporate feed)" : " (unknown non-public host)"}`);
    }
    log(`sha1 integrity           : ${sha1Hits}`);
    log(`Suspect entries          : ${suspects.length}`);
    log(`Known feed host mentions : ${feedTextHits}`);
    for (const w of report.warnings) log(`WARNING: ${w}`);
    if (sha1Hits || suspects.length || feedTextHits) {
      report.status = "dirty";
      if (!opts.json) {
        console.error("\nLock file is NOT safe for a public repository.");
        // A caller that passed an explicit --path (CI, a git hook) prints its own,
        // better-targeted instructions; do not echo an internal temp path back.
        console.error(
          opts.path === DEFAULT_PATH
            ? "Fix it with: node sanitize-lockfile.mjs"
            : "Fix it by running sanitize-lockfile.mjs on this lock file."
        );
      }
      throw new Halt(1);
    }
    log("Lock file is clean.");
    return;
  }

  // ---- fix / dry-run ---------------------------------------------------------

  log(`Suspect entries found: ${suspects.length}`);
  for (const [host, count] of hosts) {
    log(`  from ${host}: ${count}${looksLikeKnownFeed(host) ? " (known corporate feed)" : " (UNKNOWN non-public host)"}`);
  }
  if (targets.length === 0) {
    if (sha1Hits || feedTextHits) {
      fatal(
        `Text scan still shows ${feedTextHits} feed host mention(s) and ${sha1Hits} sha1 hash(es) outside of any dependency entry - inspect manually.`
      );
    }
    for (const w of report.warnings) log(`WARNING: ${w}`);
    log("Nothing to do - lock file already clean.");
    return;
  }

  // One registry round-trip per unique name@version, even if it appears many times.
  const unique = new Map();
  for (const e of targets) {
    if (!e.name || !e.version) {
      report.failures.push(`${e.section}:${e.key} (missing name or version)`);
      continue;
    }
    const id = `${e.name}@${e.version}`;
    let u = unique.get(id);
    if (!u) {
      u = { id, name: e.name, version: e.version, sha1s: new Set(), sha512s: new Set(), canonical: true, entries: [] };
      unique.set(id, u);
    }
    // A version that appears poisoned anywhere must be proven, not canonicalised.
    if (isSuspect(e)) u.canonical = false;
    u.entries.push(e);
    const s512 = sha512Of(e.integrity);
    if (s512) u.sha512s.add(s512);
    else if (isSha1(e.integrity)) u.sha1s.add(e.integrity);
  }
  if (report.failures.length) fatal("Aborting without writing - the lock file is inconsistent.");

  const jobs = [...unique.values()];
  report.checked = jobs.length;
  log(
    `Unique packages to resolve: ${jobs.length} (concurrency ${opts.concurrency}${opts.verifyTarball ? ", tarball verification ON" : ""}${opts.verifyAll ? ", auditing every public entry" : ""})`
  );

  const resolved = await pool(jobs, opts.concurrency, async (job) => {
    try {
      return { job, ...(await resolvePackage(job, opts)) };
    } catch (e) {
      report.failures.push(`${job.id} :: ${e.message}`);
      return null;
    }
  });

  if (report.failures.length) {
    if ([...hosts.keys()].some((h) => !looksLikeKnownFeed(h))) {
      report.failures.push(
        `Hint: if a package is legitimately published outside ${registryHost}, re-run with --allow-host <host>.`
      );
    }
    fatal("Aborting without writing - resolve the failures above first. Do NOT edit these fields by hand.");
  }

  // Build old -> new string replacements, refusing any ambiguous mapping.
  const map = new Map();
  const addReplacement = (oldStr, newStr, ctx) => {
    if (!oldStr || oldStr === newStr) return;
    const prev = map.get(oldStr);
    if (prev !== undefined && prev !== newStr) {
      report.failures.push(`${ctx}: '${oldStr}' would map to two different values`);
      return;
    }
    if (!raw.includes(oldStr)) {
      report.failures.push(`${ctx}: '${oldStr}' not found in the raw lock file text`);
      return;
    }
    map.set(oldStr, newStr);
  };

  for (const { job, tarball, integrity, proof, warnings } of resolved) {
    report.warnings.push(...warnings);
    let changed = false;
    for (const e of job.entries) {
      if ((e.resolved && e.resolved !== tarball) || (e.integrity && e.integrity !== integrity)) changed = true;
      addReplacement(e.resolved, tarball, job.id);
      if (e.integrity) addReplacement(e.integrity, integrity, job.id);
    }
    if (!changed) continue;
    report.packages.push({
      name: job.name,
      version: job.version,
      occurrences: job.entries.length,
      resolved: tarball,
      integrity,
      verifiedBy: proof,
    });
  }
  if (report.failures.length) fatal("Aborting without writing - ambiguous replacement detected.");

  log(`Replacement pairs prepared: ${map.size}`);
  for (const p of report.packages) {
    const prefix =
      p.verifiedBy === "canonical-repair"
        ? "REPAIRED (value did not match the registry) "
        : p.verifiedBy === "conflict-resolved"
          ? "REPAIRED (lock held several digests for one version) "
          : "";
    log(`  ${prefix}${p.name}@${p.version}  [${p.verifiedBy}]`);
  }

  if (map.size === 0) {
    for (const w of report.warnings) log(`WARNING: ${w}`);
    log("Every checked entry already matches the public registry - nothing to write.");
    return;
  }

  if (opts.mode === "dry-run") {
    report.status = "dry-run";
    log("\nDry run - nothing written.");
    return;
  }

  // Single pass, scoped to the `resolved` / `integrity` values only: nothing else in
  // the file can be touched, and cost stays linear no matter how many packages.
  const applied = new Map();
  const next = raw.replace(FIELD_RE, (match, head, value, tail) => {
    const replacement = map.get(value);
    if (replacement === undefined) return match;
    applied.set(value, (applied.get(value) ?? 0) + 1);
    return head + replacement + tail;
  });
  for (const oldStr of map.keys()) {
    if (!applied.has(oldStr)) report.failures.push(`'${oldStr}' was never applied - unexpected lock file layout`);
  }
  if (report.failures.length) fatal("Aborting - the rewrite did not cover every value.");

  await writeFile(opts.path, bom + next); // utf8, no BOM added

  // ---- post-write verification -----------------------------------------------

  const written = await readFile(opts.path, "utf8");
  const check = written.startsWith(BOM) ? written.slice(BOM.length) : written;
  let verified;
  try {
    verified = JSON.parse(check);
  } catch (e) {
    fatal(`Wrote '${opts.path}' but it no longer parses as JSON: ${e.message}. Restore it from git.`);
  }

  const writtenEntries = collectEntries(verified);
  const remainNonPublic = writtenEntries.filter((e) => classify(e) === "non-public").length;
  const remainSha1 = (check.match(SHA1_RE) || []).length;
  const remainFeedText = (check.match(FEED_TEXT_RE) || []).length;
  const expected = new Map(report.packages.map((p) => [`${p.name}@${p.version}`, p]));
  for (const e of writtenEntries) {
    const exp = expected.get(`${e.name}@${e.version}`);
    if (!exp) continue;
    if (e.resolved && e.resolved !== exp.resolved) {
      report.failures.push(`${e.section}:${e.key} resolved is '${e.resolved}', expected '${exp.resolved}'`);
    }
    if (e.integrity && e.integrity !== exp.integrity) {
      report.failures.push(`${e.section}:${e.key} integrity does not match the verified sha512`);
    }
  }

  log("");
  log(`Remaining non-public URLs: ${remainNonPublic}`);
  log(`Remaining sha1 hashes    : ${remainSha1}`);
  log(`Remaining feed mentions  : ${remainFeedText}`);
  for (const w of report.warnings) log(`WARNING: ${w}`);

  if (remainNonPublic !== 0 || remainSha1 !== 0 || remainFeedText !== 0 || report.failures.length) {
    fatal("Post-write verification FAILED - restore the lock file from git and re-run.");
  }

  report.status = "fixed";
  log(`\n${report.packages.length} package(s) repointed to ${opts.registry}. Validate with: npm ci`);
}

// ------------------------------------------------------------------ runner ---

let opts;
try {
  opts = parseArgs(process.argv.slice(2));
} catch (e) {
  if (!(e instanceof UsageError)) throw e;
  process.stderr.write(`${e.message}\n\n${HELP}`);
  process.exitCode = 2;
}

if (opts) {
  if (opts.help) {
    process.stdout.write(HELP);
  } else if (Number(process.versions.node.split(".")[0]) < 18) {
    process.stderr.write(`Node 18+ required (found ${process.versions.node}).\n`);
    process.exitCode = 2;
  } else {
    const report = {
      status: "ok",
      mode: opts.mode,
      path: opts.path,
      registry: opts.registry,
      suspects: 0,
      checked: 0,
      nonPublicHosts: {},
      packages: [],
      warnings: [],
      failures: [],
    };
    const log = opts.json ? () => {} : (...a) => console.log(...a);

    try {
      await main(opts, report, log);
    } catch (e) {
      if (e instanceof Halt) {
        process.exitCode = e.code;
      } else {
        report.status = "failed";
        report.error = e?.message ?? String(e);
        process.exitCode = 1;
        if (!opts.json) console.error(e?.stack ?? String(e));
      }
    }
    // process.exit() is deliberately NOT used: it can abort Node mid-teardown while
    // fetch sockets are still closing (UV_HANDLE_CLOSING assertion on Windows).
    // For the same reason the keep-alive pool is drained explicitly - letting the
    // event loop tear it down races with libuv and fast-fails once in a while.
    try {
      await globalThis[Symbol.for("undici.globalDispatcher.1")]?.close?.();
    } catch {
      /* nothing to drain */
    }
    if (opts.json) process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  }
}
