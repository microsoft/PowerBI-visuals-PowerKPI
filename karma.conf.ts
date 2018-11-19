/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

"use strict";

process.env.CHROME_BIN = require("puppeteer").executablePath();

const path = require("path");

const webpackConfig = require("./test.webpack.config.js");
const tsconfig = require("./tsconfig.json");

import { Config, ConfigOptions } from "karma";

const testRecursivePath = "specs/*.spec.ts";
const coverageFolder = "coverage";

module.exports = (config: Config) => {
    config.set({
        browsers: ["ChromeHeadless"],
        colors: true,
        coverageIstanbulReporter: {
            "combineBrowserReports": true,
            "dir": path.join(__dirname, coverageFolder),
            "fixWebpackSourcePaths": true,
            "report-config": {
                html: {
                    subdir: "html-report",
                },
            },
            "reports": ["html", "lcovonly", "text-summary", "cobertura"],
            "verbose": false,
        },
        coverageReporter: {
            dir: path.join(__dirname, coverageFolder),
            reporters: [
                { type: "html", subdir: "html-report" },
                { type: "lcov", subdir: "lcov" },
                { type: "cobertura", subdir: ".", file: "cobertura-coverage.xml" },
                { type: "lcovonly", subdir: ".", file: "report-lcovonly.txt" },
                { type: "text-summary", subdir: ".", file: "text-summary.txt" },
            ],
        },
        files: [
            testRecursivePath,
        ],
        frameworks: ["jasmine"],
        junitReporter: {
            outputDir: path.join(__dirname, coverageFolder),
            outputFile: "TESTS-report.xml",
            useBrowserName: false,
        },
        mime: {
            "text/x-typescript": ["ts", "tsx"],
        },
        reporters: [
            "progress",
            "junit",
            "coverage-istanbul",
        ],
        preprocessors: {
            [testRecursivePath]: ["webpack", "sourcemap"],
        },
        singleRun: true,
        typescriptPreprocessor: {
            options: tsconfig.compilerOptions,
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true,
        },
    } as ConfigOptions);
};
