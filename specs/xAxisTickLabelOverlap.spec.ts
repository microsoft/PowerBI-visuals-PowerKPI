/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
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

import powerbi from "powerbi-visuals-api";
import { select as d3Select } from "d3-selection";
import { Selection } from "d3-selection";

import { testDom, createColorPalette } from "powerbi-visuals-utils-testutils";
import { valueType } from "powerbi-visuals-utils-typeutils";
import { IMargin } from "powerbi-visuals-utils-svgutils";

import { XAxisComponent, IXAxisComponentRenderOptions } from "../src/visualComponent/axes/xAxisComponent";
import { IDataRepresentationX } from "../src/dataRepresentation/dataRepresentationAxis";
import { DataRepresentationScale } from "../src/dataRepresentation/dataRepresentationScale";
import { DataRepresentationTypeEnum } from "../src/dataRepresentation/dataRepresentationType";
import { Settings } from "../src/settings/settings";
import { getDateRange } from "./helpers";

/**
 * Builds an X axis representation for a date range spanning several months, matching the kind
 * of dataset that renders "MMM yyyy" tick labels (e.g. "Jan 2017", "Feb 2017", ... "Jun 2017").
 */
function buildDateAxis(minDate: Date, maxDate: Date): IDataRepresentationX {
    const scale: DataRepresentationScale = DataRepresentationScale
        .create()
        .domain([minDate, maxDate], DataRepresentationTypeEnum.DateType);

    return {
        axisType: DataRepresentationTypeEnum.DateType,
        format: null,
        max: maxDate,
        metadata: {
            displayName: "Axis",
            type: valueType.ValueType.fromDescriptor({ dateTime: true }),
        } as powerbi.DataViewMetadataColumn,
        min: minDate,
        name: "Axis",
        scale,
        values: getDateRange(minDate, maxDate, 24 * 3600 * 1000),
    };
}

/**
 * Builds a purely numeric X axis (e.g. a scatter/line chart plotted against a numeric measure
 * rather than a date or category). Unlike date axes, the numeric branch of createScale() in
 * axisHelper.ts has no floor on the computed tick count - it can legitimately be driven to 0.
 */
function buildNumberAxis(min: number, max: number): IDataRepresentationX {
    const scale: DataRepresentationScale = DataRepresentationScale
        .create()
        .domain([min, max], DataRepresentationTypeEnum.NumberType);

    return {
        axisType: DataRepresentationTypeEnum.NumberType,
        format: null,
        max,
        metadata: {
            displayName: "Axis",
            type: valueType.ValueType.fromDescriptor({ numeric: true }),
        } as powerbi.DataViewMetadataColumn,
        min,
        name: "Axis",
        scale,
        values: [min, max],
    };
}

/**
 * Builds a categorical (string) X axis - e.g. a bar/line chart plotted against a text category.
 */
function buildStringAxis(categories: string[]): IDataRepresentationX {
    const scale: DataRepresentationScale = DataRepresentationScale
        .create()
        .domain(categories, DataRepresentationTypeEnum.StringType);

    return {
        axisType: DataRepresentationTypeEnum.StringType,
        format: null,
        max: categories[categories.length - 1],
        metadata: {
            displayName: "Axis",
            type: valueType.ValueType.fromDescriptor({ text: true }),
        } as powerbi.DataViewMetadataColumn,
        min: categories[0],
        name: "Axis",
        scale,
        values: categories,
    };
}

function createRenderOptions(
    viewport: powerbi.IViewport,
    fontSize: number,
    density: number,
    axis: IDataRepresentationX,
): IXAxisComponentRenderOptions {
    const settings: Settings = new Settings();

    settings.xAxis.fontSize.value = fontSize;
    settings.xAxis.percentile.value = density;

    const margin: IMargin = { top: 0, right: 0, bottom: 0, left: 0 };

    return {
        additionalMargin: margin,
        axis,
        colorPalette: createColorPalette(),
        margin,
        settings: settings.xAxis,
        viewport,
    };
}

/**
 * Reads every rendered X-axis tick as { x: <center position>, textWidth: <rendered width> }.
 * Ticks are rendered by d3-axis as `<g class="tick">` containing a centered `<text>`.
 */
function getRenderedTicks(rootElement: Element): Array<{ x: number; textWidth: number; text: string }> {
    const tickGroups: NodeListOf<Element> = rootElement.querySelectorAll(".visualXAxisContainer .tick");

    return Array.from(tickGroups).map((tickGroup: Element) => {
        const transform: string = tickGroup.getAttribute("transform") || "";
        const match: RegExpMatchArray | null = transform.match(/translate\(\s*([\d.-]+)/);
        const x: number = match ? parseFloat(match[1]) : 0;

        const textElement: SVGTextElement | null = tickGroup.querySelector("text");
        const text: string = textElement ? (textElement.textContent || "") : "";
        const textWidth: number = textElement ? textElement.getBoundingClientRect().width : 0;

        return { x, textWidth, text };
    });
}

describe("XAxisComponent tick label overlap", () => {
    const minDate: Date = new Date(2017, 0, 1);
    const maxDate: Date = new Date(2017, 6, 1);

    function renderAxis(
        viewport: powerbi.IViewport,
        fontSize: number,
        density: number = 100,
        axis: IDataRepresentationX = buildDateAxis(minDate, maxDate),
    ): Element {
        const rootElement: HTMLElement = testDom(viewport.height.toString(), viewport.width.toString());
        const element: Selection<HTMLElement, any, any, any> = d3Select(rootElement);

        const xAxisComponent: XAxisComponent = new XAxisComponent({ element });

        const options: IXAxisComponentRenderOptions = createRenderOptions(viewport, fontSize, density, axis);

        xAxisComponent.preRender(options);
        xAxisComponent.render(options);

        return rootElement;
    }

    it("should not render overlapping tick labels when the visual is narrow and the font size is large", () => {
        const rootElement: Element = renderAxis({ width: 300, height: 250 }, 24);

        const ticks = getRenderedTicks(rootElement);

        // Sanity check: the axis actually rendered some ticks with text - otherwise this test
        // would trivially (and falsely) pass.
        expect(ticks.length).toBeGreaterThan(0);

        const sortedTicks = ticks.slice().sort((a, b) => a.x - b.x);

        for (let i = 0; i < sortedTicks.length - 1; i++) {
            const current = sortedTicks[i];
            const next = sortedTicks[i + 1];

            const gap: number = next.x - current.x;
            const requiredGap: number = (current.textWidth / 2) + (next.textWidth / 2);

            // A small tolerance accounts for anti-aliasing/measurement rounding - it must not be
            // large enough to hide a real overlap regression.
            const tolerance: number = 1;

            expect(gap + tolerance).toBeGreaterThanOrEqual(requiredGap);
        }
    });

    it("should not truncate every tick label with an ellipsis when ticks can instead be thinned out", () => {
        const rootElement: Element = renderAxis({ width: 300, height: 250 }, 24);

        const ticks = getRenderedTicks(rootElement);

        expect(ticks.length).toBeGreaterThan(0);

        const truncatedTickCount: number = ticks.filter((tick) => tick.text.indexOf("…") !== -1).length;

        // It is acceptable for a single remaining tick to still be truncated if there truly is
        // no room left (the last-resort safety net) - but it must not be the *default* strategy
        // used for every tick, which produces an unreadable "Jan …", "Feb …", "Mar …" axis.
        expect(truncatedTickCount).toBeLessThan(ticks.length);
    });

    it("should still render full, untruncated labels when there is plenty of space", () => {
        const rootElement: Element = renderAxis({ width: 1200, height: 400 }, 9);

        const ticks = getRenderedTicks(rootElement);

        expect(ticks.length).toBeGreaterThan(0);

        ticks.forEach((tick) => {
            expect(tick.text.indexOf("…")).toBe(-1);
            expect(tick.text.length).toBeGreaterThan(0);
        });
    });

    it("should not throw and should not divide by zero when only a single tick can be shown", () => {
        expect(() => {
            renderAxis({ width: 40, height: 150 }, 24);
        }).not.toThrow();
    });

    describe("tick density slider sweep", () => {
        // The density slider (settings.xAxis.percentile) ranges from 0 to 100 and directly
        // feeds getAmountOfTicksByDensity(). The refit loop mutates this.maxElementWidth and
        // recreates the axis, so it must keep producing a sane (non-zero, non-NaN, finite)
        // tick count and valid tick transforms across the whole density range, for both a
        // narrow/large-font scenario (where refits are expected to happen) and a wide/small-font
        // scenario (where refits should be a no-op).
        const densities: number[] = [0, 1, 10, 25, 50, 75, 90, 99, 100];

        densities.forEach((density: number) => {
            it(`should render a sane, finite tick count at density=${density} when narrow with a large font`, () => {
                const rootElement: Element = renderAxis({ width: 300, height: 250 }, 24, density);
                const ticks = getRenderedTicks(rootElement);

                expect(ticks.length).toBeGreaterThan(0);

                ticks.forEach((tick) => {
                    expect(isNaN(tick.x)).toBe(false);
                    expect(isFinite(tick.x)).toBe(true);
                });
            });

            it(`should render a sane, finite tick count at density=${density} when wide with a small font`, () => {
                const rootElement: Element = renderAxis({ width: 1200, height: 400 }, 9, density);
                const ticks = getRenderedTicks(rootElement);

                expect(ticks.length).toBeGreaterThan(0);

                ticks.forEach((tick) => {
                    expect(isNaN(tick.x)).toBe(false);
                    expect(isFinite(tick.x)).toBe(true);
                });
            });
        });
    });

    describe("axis types other than Date", () => {
        it("should not overlap tick labels for a categorical (string) X axis when narrow with a large font", () => {
            const categories: string[] = [
                "Category Alpha", "Category Beta", "Category Gamma",
                "Category Delta", "Category Epsilon", "Category Zeta",
            ];
            const axis: IDataRepresentationX = buildStringAxis(categories);

            const rootElement: Element = renderAxis({ width: 300, height: 250 }, 24, 100, axis);
            const ticks = getRenderedTicks(rootElement);

            expect(ticks.length).toBeGreaterThan(0);

            const sortedTicks = ticks.slice().sort((a, b) => a.x - b.x);

            for (let i = 0; i < sortedTicks.length - 1; i++) {
                const current = sortedTicks[i];
                const next = sortedTicks[i + 1];

                const gap: number = next.x - current.x;
                const requiredGap: number = (current.textWidth / 2) + (next.textWidth / 2);
                const tolerance: number = 1;

                expect(gap + tolerance).toBeGreaterThanOrEqual(requiredGap);
            }
        });

        it("should never render zero tick labels for a numeric X axis even when the refit loop is forced to grow past the available width", () => {
            // Unlike DateType axes (floored at MinAmountOfTicksForDates in axisHelper.ts),
            // the NumberType branch of createScale() has no floor on the computed tick count -
            // it can legitimately be driven to 0 if minOrdinalRectThickness grows past the
            // available pixel span. Forcing the measured label width to be huge reproduces the
            // exact condition that used to cause this regression, deterministically.
            const axis: IDataRepresentationX = buildNumberAxis(0, 100);
            const viewport: powerbi.IViewport = { width: 120, height: 150 };

            const rootElement: HTMLElement = testDom(viewport.height.toString(), viewport.width.toString());
            const element: Selection<HTMLElement, any, any, any> = d3Select(rootElement);

            const xAxisComponent: XAxisComponent = new XAxisComponent({ element });

            spyOn(xAxisComponent as any, "getActualMaxTickLabelWidth").and.returnValue(100000);

            const options: IXAxisComponentRenderOptions = createRenderOptions(viewport, 24, 100, axis);

            expect(() => {
                xAxisComponent.preRender(options);
                xAxisComponent.render(options);
            }).not.toThrow();

            const ticks = getRenderedTicks(rootElement);

            expect(ticks.length).toBeGreaterThan(0);
        });
    });
});
