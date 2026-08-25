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

import { DataBuilder } from "./dataBuilder";
import { VisualBuilder } from "./visualBuilder";

/**
 * Guards the plot layout: whatever is turned on in the formatting pane, the plot must
 * lay its parts out side by side inside its own box. A regression here shows up in a
 * report as axis labels sitting on top of the chart, or as parts spilling out of the
 * visual, which no unit test on a single component would catch.
 */

// Anti aliasing and sub pixel rounding make exact comparisons brittle; a tolerance of
// one pixel is small enough that a real overlap still fails.
const tolerance: number = 1;

function getPlotElement(root: HTMLElement): HTMLElement {
    return root.querySelector(".powerKpi_plot");
}

function getRects(plotElement: HTMLElement): { [name: string]: DOMRect } {
    const selectors: { [name: string]: string } = {
        chart: "svg.powerKpi_svgComponent",
        xAxis: ".visualXAxis",
        yAxis: "svg.powerKpi_visualYAxis",
    };

    const rects: { [name: string]: DOMRect } = {};

    Object.keys(selectors).forEach((name: string) => {
        const element: Element = plotElement.querySelector(selectors[name]);

        if (element) {
            rects[name] = element.getBoundingClientRect();
        }
    });

    return rects;
}

function expectWithin(child: DOMRect, container: DOMRect, label: string): void {
    expect(`${label} left: ${child.left >= container.left - tolerance}`).toBe(`${label} left: true`);
    expect(`${label} right: ${child.right <= container.right + tolerance}`).toBe(`${label} right: true`);
    expect(`${label} top: ${child.top >= container.top - tolerance}`).toBe(`${label} top: true`);
    expect(`${label} bottom: ${child.bottom <= container.bottom + tolerance}`).toBe(`${label} bottom: true`);
}

function runLayoutChecks(root: HTMLElement): void {
    const plotElement: HTMLElement = getPlotElement(root);

    expect(plotElement).not.toBeNull();

    const plotRect: DOMRect = plotElement.getBoundingClientRect();
    const rects = getRects(plotElement);

    expect(rects.chart).toBeDefined();
    expect(rects.chart.width).toBeGreaterThan(0);
    expect(rects.chart.height).toBeGreaterThan(0);

    Object.keys(rects).forEach((name: string) => {
        expectWithin(rects[name], plotRect, name);
    });

    // The Y axis must sit to the left of the chart, never on top of it
    if (rects.yAxis && rects.yAxis.width > 0) {
        expect(`yAxis before chart: ${rects.yAxis.right <= rects.chart.left + tolerance}`)
            .toBe("yAxis before chart: true");
    }
}

describe("Plot layout", () => {
    /**
     * The shared DataBuilder fills its series with getRandomNumbers between -MAX_VALUE
     * and +MAX_VALUE. Those collapse every chart path to a zero sized box and leave the
     * Y axis without ticks, which silently makes any assertion on rendered marks vacuous.
     * A realistic ramp is built here instead, leaving the shared builder alone for the
     * specs that rely on its current shape.
     */
    function createDataView(): powerbi.DataView {
        const dataBuilder: DataBuilder = new DataBuilder();

        dataBuilder.seriesValues = [
            dataBuilder.dates.map((unused: Date, index: number) => index * 1.3),
        ];

        // The plot hides itself when no group is bound, so both roles are requested
        return dataBuilder.getDataView(["Axis", "Values"]);
    }

    function update(
        objects: powerbi.DataViewObjects,
        callback: (root: HTMLElement, visualBuilder: VisualBuilder) => void,
        done: DoneFn,
        width: number = 1024,
        height: number = 768,
    ): void {
        const visualBuilder: VisualBuilder = new VisualBuilder(width, height);

        const dataView: powerbi.DataView = createDataView();

        dataView.metadata.objects = objects;

        visualBuilder.updateRenderTimeout(
            dataView,
            () => {
                callback(visualBuilder.element, visualBuilder);

                done();
            },
        );
    }

    // A report tile is often far smaller than the design surface, and that is where the
    // space each part reserves stops adding up, so every size is exercised.
    const sizes: Array<{ width: number; height: number }> = [
        { width: 1024, height: 768 },
        { width: 640, height: 480 },
        { width: 400, height: 300 },
        { width: 300, height: 200 },
        { width: 200, height: 150 },
    ];

    const configurations: Array<{ name: string; objects: powerbi.DataViewObjects }> = [
        { name: "the default settings", objects: {} },
        {
            name: "the X zoom slider on",
            objects: { zoomSlider: { show: true, showForXAxis: true, showForYAxis: false } },
        },
        {
            name: "the Y zoom slider on",
            objects: { zoomSlider: { show: true, showForXAxis: false, showForYAxis: true } },
        },
        {
            name: "both zoom sliders on",
            objects: { zoomSlider: { show: true, showForXAxis: true, showForYAxis: true } },
        },
    ];

    configurations.forEach((configuration) => {
        sizes.forEach((size) => {
            it(`should lay the plot out inside the visual with ${configuration.name} at ${size.width}x${size.height}`, (done) => {
                update(configuration.objects, runLayoutChecks, done, size.width, size.height);
            });
        });
    });

    /**
     * Narrowing the domain - a pinned Min/Max or a zoom range - leaves every point outside
     * the range mapped through the scale all the same, so it lands far outside the drawing
     * area. Only the clip stops it from being painted over the Y axis labels and past the
     * edge of the tile.
     *
     * The invariant is checked on the clip itself rather than on the marks: a clip changes
     * what is painted, but neither getBoundingClientRect nor a hit test reports it - boxes
     * ignore clipping outright, and a thin line stroke is almost never sampled by a grid.
     */
    function expectChartClippedToDrawingArea(root: HTMLElement): void {
        const plotElement: HTMLElement = getPlotElement(root);

        const chartGroup: Element = plotElement.querySelector(".powerKpi_multiShapeComponent");
        const chartSvg: Element = plotElement.querySelector("svg.powerKpi_svgComponent");

        const clipReference: string = chartGroup.getAttribute("clip-path") || "";

        expect(clipReference).toMatch(/^url\(#powerKpi_chartClip_\d+\)$/);

        // "url(#id)" -> "#id"
        const clipRect: Element = plotElement.querySelector(`${clipReference.slice(4, -1)} rect`);

        expect(clipRect).not.toBeNull();

        // The clip rect lives in the SVG user space, whose origin is the content box
        const svgRect: DOMRect = chartSvg.getBoundingClientRect();
        const paddingLeft: number = parseFloat(window.getComputedStyle(chartSvg).paddingLeft) || 0;

        const clipLeft: number = svgRect.left + paddingLeft + parseFloat(clipRect.getAttribute("x"));
        const clipRight: number = clipLeft + parseFloat(clipRect.getAttribute("width"));

        expect(`clip starts inside the chart: ${clipLeft >= svgRect.left - tolerance}`)
            .toBe("clip starts inside the chart: true");
        expect(`clip ends inside the chart: ${clipRight <= svgRect.right + tolerance}`)
            .toBe("clip ends inside the chart: true");

        // Which means nothing the chart paints can ever reach the Y axis strip
        const yAxisRect: DOMRect = plotElement
            .querySelector("svg.powerKpi_visualYAxis")
            .getBoundingClientRect();

        if (yAxisRect.width > 0) {
            expect(`Y axis clear of the chart clip: ${yAxisRect.right <= clipLeft + tolerance}`)
                .toBe("Y axis clear of the chart clip: true");
        }
    }

    [
        { width: 1024, height: 768 },
        { width: 400, height: 300 },
        { width: 300, height: 200 },
        { width: 250, height: 180 },
    ].forEach((size) => {
        it(`should confine the chart to the drawing area when the X axis is pinned at ${size.width}x${size.height}`, (done) => {
            update(
                // The data spans 2016-01-01 to 2016-01-10; this keeps the middle only
                { xAxis: { minDate: "2016-01-04", maxDate: "2016-01-06" } },
                expectChartClippedToDrawingArea,
                done,
                size.width,
                size.height,
            );
        });

        it(`should confine the chart to the drawing area after a zoom at ${size.width}x${size.height}`, (done) => {
            update(
                { zoomSlider: { show: true, showForXAxis: true, showForYAxis: false } },
                (root: HTMLElement, visualBuilder: VisualBuilder) => {
                    // Drives the visual's own zoom entry point, the one a finished drag calls
                    (visualBuilder.instance as any).applyZoom("x", { start: 0.4, end: 0.6 });

                    expectChartClippedToDrawingArea(root);
                },
                done,
                size.width,
                size.height,
            );
        });
    });

    it("should actually narrow the axis when boundaries are set, so the check above is not vacuous", (done) => {
        update(
            { xAxis: { minDate: "2016-01-04", maxDate: "2016-01-06" } },
            (root: HTMLElement) => {
                const labels: string[] = Array
                    .from(getPlotElement(root).querySelectorAll(".visualXAxisContainer .tick text"))
                    .map((element: Element) => element.textContent);

                expect(labels.length).toBeGreaterThan(0);

                // The data spans the 1st to the 10th; none of the days outside the
                // requested range may still be labelled
                ["1 ", "2 ", "8 ", "9 "].forEach((excludedDay: string) => {
                    expect(`${excludedDay}labelled: ${labels.some((label) => label.startsWith(excludedDay))}`)
                        .toBe(`${excludedDay}labelled: false`);
                });
            },
            done,
            400,
            300,
        );
    });

    it("should keep each zoom slider inside the plot", (done) => {
        update(
            { zoomSlider: { show: true, showForXAxis: true, showForYAxis: true } },
            (root: HTMLElement) => {
                const plotElement: HTMLElement = getPlotElement(root);
                const plotRect: DOMRect = plotElement.getBoundingClientRect();

                const sliders: Element[] = Array.from(
                    plotElement.querySelectorAll("svg.powerKpi_zoomSliderComponent"),
                );

                expect(sliders.length).toBe(2);

                sliders.forEach((slider: Element, index: number) => {
                    expectWithin(slider.getBoundingClientRect(), plotRect, `slider ${index}`);
                });
            },
            done,
        );
    });
});
