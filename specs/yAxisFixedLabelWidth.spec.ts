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
import { IMargin } from "powerbi-visuals-utils-svgutils";

import { YAxisComponent, IYAxisComponentRenderOptions } from "../src/visualComponent/axes/yAxisComponent";
import { IDataRepresentationAxis } from "../src/dataRepresentation/dataRepresentationAxis";
import { DataRepresentationScale } from "../src/dataRepresentation/dataRepresentationScale";
import { DataRepresentationTypeEnum } from "../src/dataRepresentation/dataRepresentationType";
import { Settings } from "../src/settings/settings";
import { FixedLabelWidthMode, YAxisDescriptor } from "../src/settings/descriptors/axis/yAxisDescriptor";
import { DisplayUnitsType } from "../src/settings/descriptors/numberDescriptorBase";

/**
 * Builds a numeric Y axis for the [min, max] range - the kind of axis whose rendered
 * label width depends directly on the magnitude of the displayed values.
 */
function buildAxis(min: number, max: number): IDataRepresentationAxis {
    const scale: DataRepresentationScale = DataRepresentationScale
        .create()
        .domain([min, max], DataRepresentationTypeEnum.NumberType);

    return {
        format: null,
        max,
        min,
        scale,
    };
}

/**
 * Applies the Fixed label area sizing with the given pixel width to a Y-axis card.
 */
function applyFixedLabelWidth(axisSettings: YAxisDescriptor, width: number): void {
    axisSettings.fixedLabelWidthMode.value = axisSettings.getNewComplexValue(
        FixedLabelWidthMode.fixed,
        axisSettings.fixedLabelWidthMode.items,
    );

    axisSettings.fixedLabelWidth.value = width;
}

function renderYAxis(
    viewport: powerbi.IViewport,
    axis: IDataRepresentationAxis,
    configureSettings?: (axisSettings: YAxisDescriptor) => void,
): { component: YAxisComponent; rootElement: Element } {
    const settings: Settings = new Settings();

    // Display units are disabled so the full-length numbers drive the measured label width
    settings.yAxis.displayUnits.value = DisplayUnitsType.None;

    if (configureSettings) {
        configureSettings(settings.yAxis);
    }

    const rootElement: HTMLElement = testDom(viewport.height.toString(), viewport.width.toString());
    const element: Selection<HTMLElement, any, any, any> = d3Select(rootElement);

    const component: YAxisComponent = new YAxisComponent({ element });

    const margin: IMargin = { top: 0, right: 0, bottom: 0, left: 0 };

    const options: IYAxisComponentRenderOptions = {
        axis,
        colorPalette: createColorPalette(),
        locale: "en-US",
        margin,
        settings: settings.yAxis,
        viewport,
    };

    component.preRender(options);
    component.render(options);

    return { component, rootElement };
}

/**
 * getTailoredTextOrDefault marks truncated labels with a "..." suffix.
 */
function isTruncated(text: string): boolean {
    return text.indexOf("...") !== -1;
}

function getRenderedTickTexts(rootElement: Element): Array<{ text: string; textWidth: number }> {
    // The Y-axis svg element is class-prefixed by BaseComponent (powerKpi_visualYAxis) and is the
    // only rendered component under the test DOM root, so the ticks can be queried directly
    const textElements: NodeListOf<SVGTextElement> = rootElement.querySelectorAll(".tick text");

    return Array.from(textElements).map((textElement: SVGTextElement) => ({
        text: textElement.textContent || "",
        textWidth: textElement.getBoundingClientRect().width,
    }));
}

describe("YAxisComponent fixed label width", () => {
    const viewport: powerbi.IViewport = { width: 600, height: 300 };

    const smallMagnitudeAxis: IDataRepresentationAxis = buildAxis(0, 10);
    const largeMagnitudeAxis: IDataRepresentationAxis = buildAxis(0, 8888888888);

    describe("Auto sizing (default)", () => {
        it("should reserve different widths for labels of different magnitudes", () => {
            const smallWidth: number = renderYAxis(viewport, smallMagnitudeAxis).component.getViewport().width;
            const largeWidth: number = renderYAxis(viewport, largeMagnitudeAxis).component.getViewport().width;

            // Sanity baseline: without the feature the reserved width follows the data,
            // which is exactly the movement the Fixed mode is meant to eliminate
            expect(smallWidth).toBeGreaterThan(0);
            expect(largeWidth).toBeGreaterThan(smallWidth);
        });

        it("should not truncate labels when there is enough space", () => {
            const { rootElement } = renderYAxis(viewport, largeMagnitudeAxis);

            const ticks = getRenderedTickTexts(rootElement);

            expect(ticks.length).toBeGreaterThan(0);

            ticks.forEach((tick) => {
                expect(isTruncated(tick.text)).toBe(false);
            });
        });
    });

    describe("Fixed sizing", () => {
        it("should reserve the same width regardless of the label magnitude", () => {
            const smallWidth: number = renderYAxis(
                viewport,
                smallMagnitudeAxis,
                (axisSettings: YAxisDescriptor) => applyFixedLabelWidth(axisSettings, 80),
            ).component.getViewport().width;

            const largeWidth: number = renderYAxis(
                viewport,
                largeMagnitudeAxis,
                (axisSettings: YAxisDescriptor) => applyFixedLabelWidth(axisSettings, 80),
            ).component.getViewport().width;

            expect(smallWidth).toBe(largeWidth);
        });

        it("should reserve exactly the configured width - a delta in the setting is a delta in the reserved width", () => {
            const width80: number = renderYAxis(
                viewport,
                largeMagnitudeAxis,
                (axisSettings: YAxisDescriptor) => applyFixedLabelWidth(axisSettings, 80),
            ).component.getViewport().width;

            const width100: number = renderYAxis(
                viewport,
                largeMagnitudeAxis,
                (axisSettings: YAxisDescriptor) => applyFixedLabelWidth(axisSettings, 100),
            ).component.getViewport().width;

            expect(width100 - width80).toBe(20);
        });

        it("should not shrink the reserved width when labels are short", () => {
            const autoWidth: number = renderYAxis(viewport, smallMagnitudeAxis).component.getViewport().width;

            const fixedWidth: number = renderYAxis(
                viewport,
                smallMagnitudeAxis,
                (axisSettings: YAxisDescriptor) => applyFixedLabelWidth(axisSettings, 150),
            ).component.getViewport().width;

            expect(fixedWidth).toBeGreaterThan(autoWidth);
        });

        it("should ellipsis labels wider than the reserved width and keep them inside it", () => {
            const fixedWidth: number = 30;

            const { rootElement } = renderYAxis(
                viewport,
                largeMagnitudeAxis,
                (axisSettings: YAxisDescriptor) => applyFixedLabelWidth(axisSettings, fixedWidth),
            );

            const ticks = getRenderedTickTexts(rootElement);

            expect(ticks.length).toBeGreaterThan(0);

            const truncatedTickCount: number = ticks.filter((tick) => isTruncated(tick.text)).length;

            expect(truncatedTickCount).toBeGreaterThan(0);

            ticks.forEach((tick) => {
                // A small tolerance accounts for anti-aliasing/measurement rounding
                const tolerance: number = 2;

                expect(tick.textWidth).toBeLessThanOrEqual(fixedWidth + tolerance);
            });
        });

        it("should clamp the reserved width to half of the viewport on small tiles", () => {
            const smallViewport: powerbi.IViewport = { width: 100, height: 90 };

            const clampedWidth: number = renderYAxis(
                smallViewport,
                largeMagnitudeAxis,
                (axisSettings: YAxisDescriptor) => applyFixedLabelWidth(axisSettings, 400),
            ).component.getViewport().width;

            // min(400, 100 / 2) and min(50, 100 / 2) both reserve exactly half of the viewport
            const halfViewportWidth: number = renderYAxis(
                smallViewport,
                largeMagnitudeAxis,
                (axisSettings: YAxisDescriptor) => applyFixedLabelWidth(axisSettings, smallViewport.width / 2),
            ).component.getViewport().width;

            expect(clampedWidth).toBe(halfViewportWidth);
            expect(isFinite(clampedWidth)).toBe(true);
            expect(clampedWidth).toBeLessThan(smallViewport.width);
        });

        it("should not produce NaN transforms on small tiles", () => {
            const smallViewport: powerbi.IViewport = { width: 100, height: 90 };

            const { rootElement } = renderYAxis(
                smallViewport,
                largeMagnitudeAxis,
                (axisSettings: YAxisDescriptor) => applyFixedLabelWidth(axisSettings, 400),
            );

            const transformedElements: NodeListOf<Element> = rootElement.querySelectorAll("[transform]");

            expect(transformedElements.length).toBeGreaterThan(0);

            Array.from(transformedElements).forEach((transformedElement: Element) => {
                expect(transformedElement.getAttribute("transform")).not.toContain("NaN");
            });
        });

        it("should reserve no width when the axis is hidden", () => {
            const hiddenWidth: number = renderYAxis(
                viewport,
                largeMagnitudeAxis,
                (axisSettings: YAxisDescriptor) => {
                    applyFixedLabelWidth(axisSettings, 80);

                    axisSettings.show.value = false;
                },
            ).component.getViewport().width;

            expect(hiddenWidth).toBe(0);
        });
    });

    describe("YAxisDescriptor parse", () => {
        function parseFixedLabelWidth(value: number): number {
            const settings: Settings = new Settings();

            settings.yAxis.fixedLabelWidth.value = value;

            settings.parseSettings({ width: 600, height: 400 });

            return settings.yAxis.fixedLabelWidth.value;
        }

        it("should clamp a persisted width above the maximum down to the maximum", () => {
            expect(parseFixedLabelWidth(1000)).toBe(400);
        });

        it("should clamp a persisted negative width up to the minimum", () => {
            expect(parseFixedLabelWidth(-5)).toBe(0);
        });
    });

    describe("secondary Y axis", () => {
        it("should be configurable independently from the primary Y axis", () => {
            const settings: Settings = new Settings();

            applyFixedLabelWidth(settings.yAxis, 60);
            applyFixedLabelWidth(settings.secondaryYAxis, 120);

            expect(settings.yAxis.fixedLabelWidth.value).toBe(60);
            expect(settings.secondaryYAxis.fixedLabelWidth.value).toBe(120);
            expect(settings.yAxis.isLabelWidthFixed()).toBe(true);
            expect(settings.secondaryYAxis.isLabelWidthFixed()).toBe(true);
        });
    });
});
