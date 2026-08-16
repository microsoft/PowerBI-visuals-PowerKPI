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
import { dispatch, Dispatch } from "d3-dispatch";
import { select as d3Select } from "d3-selection";
import { Selection } from "d3-selection";

import { testDom } from "powerbi-visuals-utils-testutils";

import { EventName } from "../src/event/eventName";
import { Settings } from "../src/settings/settings";
import { ZoomSliderAxis, ZoomSliderComponent } from "../src/visualComponent/zoomSliderComponent";

import { DataRepresentationTypeEnum } from "../src/dataRepresentation/dataRepresentationType";

import {
    applyZoomToInterval,
    createDefaultZoom,
    isFullRange,
    isZoomableAxisType,
    IDataRepresentationZoomRange,
} from "../src/dataRepresentation/dataRepresentationZoom";

const viewport: powerbi.IViewport = { width: 400, height: 300 };

interface IRenderedSlider {
    component: ZoomSliderComponent;
    eventDispatcher: Dispatch<any>;
    svgElement: SVGSVGElement;
}

/**
 * The track is inset by one handle radius at each end so a handle at an extreme stays
 * inside the slider; the expected pixel positions below account for that inset.
 */
const handleRadius: number = 5;

function expectedPosition(fraction: number, length: number, isMirrored: boolean = false): number {
    const positionAlongTrack: number = handleRadius + (fraction * (length - (2 * handleRadius)));

    return isMirrored
        ? length - positionAlongTrack
        : positionAlongTrack;
}

function renderSlider(
    axis: ZoomSliderAxis,
    range: IDataRepresentationZoomRange,
    isShown: boolean = true,
    offset: number = 0,
): IRenderedSlider {
    const rootElement: HTMLElement = testDom(viewport.height.toString(), viewport.width.toString());
    const element: Selection<HTMLElement, any, any, any> = d3Select(rootElement);

    const eventDispatcher: Dispatch<any> = dispatch(...Object.keys(EventName));

    const component: ZoomSliderComponent = new ZoomSliderComponent({ element, eventDispatcher });

    component.render({ axis, isShown, offset, range, viewport });

    return {
        component,
        eventDispatcher,
        svgElement: rootElement.querySelector("svg"),
    };
}

function getHandles(svgElement: SVGSVGElement): SVGCircleElement[] {
    return Array.from(svgElement.querySelectorAll("circle"));
}

describe("Zoom slider", () => {
    describe("zoom range arithmetic", () => {
        it("should leave an interval untouched for the full range", () => {
            expect(applyZoomToInterval(0, 100, { start: 0, end: 1 })).toEqual({ min: 0, max: 100 });
        });

        it("should keep the requested fraction of the interval", () => {
            expect(applyZoomToInterval(0, 100, { start: 0.25, end: 0.75 })).toEqual({ min: 25, max: 75 });
        });

        it("should reorder an inverted range instead of returning a reversed interval", () => {
            expect(applyZoomToInterval(0, 100, { start: 0.75, end: 0.25 })).toEqual({ min: 25, max: 75 });
        });

        it("should leave a degenerate interval untouched", () => {
            expect(applyZoomToInterval(10, 10, { start: 0.25, end: 0.75 })).toEqual({ min: 10, max: 10 });
            expect(applyZoomToInterval(NaN, 100, { start: 0.25, end: 0.75 })).toEqual({ min: NaN, max: 100 } as any);
        });

        it("should recognise a missing or full range", () => {
            expect(isFullRange(null)).toBe(true);
            expect(isFullRange({ start: 0, end: 1 })).toBe(true);
            expect(isFullRange({ start: 0.1, end: 1 })).toBe(false);
        });

        it("should default to the full range on both axes", () => {
            expect(createDefaultZoom()).toEqual({ x: { start: 0, end: 1 }, y: { start: 0, end: 1 } });
        });
    });

    describe("formatting card", () => {
        it("should be off by default, so an existing report renders unchanged", () => {
            const settings: Settings = new Settings();

            expect(settings.zoomSlider.show.value).toBe(false);
            expect(settings.zoomSlider.isShownForXAxis()).toBe(false);
            expect(settings.zoomSlider.isShownForYAxis()).toBe(false);
        });

        it("should let each axis be toggled independently once the card is on", () => {
            const settings: Settings = new Settings();

            settings.zoomSlider.show.value = true;

            // The X axis is the one enabled by default within the card
            expect(settings.zoomSlider.isShownForXAxis()).toBe(true);
            expect(settings.zoomSlider.isShownForYAxis()).toBe(false);

            settings.zoomSlider.showForYAxis.value = true;

            expect(settings.zoomSlider.isShownForYAxis()).toBe(true);
        });
    });

    describe("axis types a zoom slider applies to", () => {
        it("should accept a date or a numeric axis", () => {
            expect(isZoomableAxisType(DataRepresentationTypeEnum.DateType)).toBe(true);
            expect(isZoomableAxisType(DataRepresentationTypeEnum.NumberType)).toBe(true);
        });

        it("should refuse a categorical axis, which has no range to narrow", () => {
            expect(isZoomableAxisType(DataRepresentationTypeEnum.StringType)).toBe(false);
            expect(isZoomableAxisType(DataRepresentationTypeEnum.None)).toBe(false);
        });

        it("should hide the X axis toggle from the pane on a categorical axis", () => {
            const settings: Settings = new Settings();

            settings.filterFormattingProperties(
                null,
                DataRepresentationTypeEnum.StringType,
                { getDisplayName: (key: string) => key } as any,
                false,
            );

            expect(settings.zoomSlider.showForXAxis.visible).toBe(false);
            // The Y axis is always numeric, so its toggle stays available
            expect(settings.zoomSlider.showForYAxis.visible).not.toBe(false);
        });

        it("should keep the X axis toggle on a date axis", () => {
            const settings: Settings = new Settings();

            settings.filterFormattingProperties(
                null,
                DataRepresentationTypeEnum.DateType,
                { getDisplayName: (key: string) => key } as any,
                false,
            );

            expect(settings.zoomSlider.showForXAxis.visible).toBe(true);
        });
    });

    describe("rendering", () => {
        it("should place the horizontal handles at the ends of the kept range", () => {
            const { svgElement } = renderSlider(ZoomSliderAxis.x, { start: 0.25, end: 0.75 });

            const [startHandle, endHandle] = getHandles(svgElement);

            expect(parseFloat(startHandle.getAttribute("cx"))).toBeCloseTo(expectedPosition(0.25, viewport.width), 1);
            expect(parseFloat(endHandle.getAttribute("cx"))).toBeCloseTo(expectedPosition(0.75, viewport.width), 1);
        });

        it("should mirror the vertical handles, the start of the axis being its bottom", () => {
            const { svgElement } = renderSlider(ZoomSliderAxis.y, { start: 0.25, end: 0.75 });

            const [startHandle, endHandle] = getHandles(svgElement);

            expect(parseFloat(startHandle.getAttribute("cy"))).toBeCloseTo(expectedPosition(0.25, viewport.height, true), 1);
            expect(parseFloat(endHandle.getAttribute("cy"))).toBeCloseTo(expectedPosition(0.75, viewport.height, true), 1);
        });

        it("should keep the handles inside the slider at both ends of the range", () => {
            [ZoomSliderAxis.x, ZoomSliderAxis.y].forEach((axis: ZoomSliderAxis) => {
                const { svgElement } = renderSlider(axis, { start: 0, end: 1 });

                const isHorizontal: boolean = axis === ZoomSliderAxis.x;
                const length: number = isHorizontal ? viewport.width : viewport.height;

                getHandles(svgElement).forEach((handle: SVGCircleElement) => {
                    const position: number = parseFloat(handle.getAttribute(isHorizontal ? "cx" : "cy"));

                    expect(position - handleRadius).toBeGreaterThanOrEqual(0);
                    expect(position + handleRadius).toBeLessThanOrEqual(length);
                });
            });
        });

        it("should shift itself by the offset so it lines up with the drawing area", () => {
            const horizontal = renderSlider(ZoomSliderAxis.x, { start: 0, end: 1 }, true, 42);
            const vertical = renderSlider(ZoomSliderAxis.y, { start: 0, end: 1 }, true, 17);

            expect(horizontal.svgElement.style.marginLeft).toBe("42px");
            expect(horizontal.svgElement.style.marginTop).toBe("");

            expect(vertical.svgElement.style.marginTop).toBe("17px");
            expect(vertical.svgElement.style.marginLeft).toBe("");
        });

        it("should render a track and the kept range", () => {
            const { svgElement } = renderSlider(ZoomSliderAxis.x, { start: 0, end: 1 });

            expect(svgElement.querySelectorAll("line").length).toBe(2);
            expect(getHandles(svgElement).length).toBe(2);
        });

        it("should reserve its band only on the axis it belongs to", () => {
            const horizontal = renderSlider(ZoomSliderAxis.x, { start: 0, end: 1 });
            const vertical = renderSlider(ZoomSliderAxis.y, { start: 0, end: 1 });

            expect(horizontal.component.getViewport().height).toBe(ZoomSliderComponent.Thickness);
            expect(horizontal.component.getViewport().width).toBe(0);

            expect(vertical.component.getViewport().width).toBe(ZoomSliderComponent.Thickness);
            expect(vertical.component.getViewport().height).toBe(0);
        });

        it("should reserve nothing while it is turned off", () => {
            const { component } = renderSlider(ZoomSliderAxis.x, { start: 0, end: 1 }, false);

            expect(component.getViewport()).toEqual({ height: 0, width: 0 });
        });
    });

    describe("dragging", () => {
        function drag(rendered: IRenderedSlider, handleIndex: number, targetFraction: number): void {
            const handle: SVGCircleElement = getHandles(rendered.svgElement)[handleIndex];
            const bounds: DOMRect = rendered.svgElement.getBoundingClientRect();

            handle.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));

            window.dispatchEvent(new PointerEvent("pointermove", {
                bubbles: true,
                clientX: bounds.left + (bounds.width * targetFraction),
                clientY: bounds.top + (bounds.height * (1 - targetFraction)),
            }));

            window.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
        }

        it("should report the new range once the drag ends", () => {
            const rendered: IRenderedSlider = renderSlider(ZoomSliderAxis.x, { start: 0, end: 1 });

            let reportedAxis: ZoomSliderAxis = null;
            let reportedRange: IDataRepresentationZoomRange = null;

            rendered.eventDispatcher.on(EventName.onZoom, (axis, range) => {
                reportedAxis = axis;
                reportedRange = range;
            });

            drag(rendered, 0, 0.4);

            expect(reportedAxis).toBe(ZoomSliderAxis.x);
            expect(reportedRange.start).toBeCloseTo(0.4, 1);
            expect(reportedRange.end).toBe(1);
        });

        it("should not report anything before the drag ends", () => {
            const rendered: IRenderedSlider = renderSlider(ZoomSliderAxis.x, { start: 0, end: 1 });

            let reportCount: number = 0;

            rendered.eventDispatcher.on(EventName.onZoom, () => { reportCount += 1; });

            const handle: SVGCircleElement = getHandles(rendered.svgElement)[0];
            const bounds: DOMRect = rendered.svgElement.getBoundingClientRect();

            handle.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
            window.dispatchEvent(new PointerEvent("pointermove", {
                bubbles: true,
                clientX: bounds.left + (bounds.width * 0.4),
            }));

            // The handle has moved, but the chart is only rebuilt on pointer up
            expect(reportCount).toBe(0);
            expect(parseFloat(getHandles(rendered.svgElement)[0].getAttribute("cx"))).toBeGreaterThan(0);

            window.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));

            expect(reportCount).toBe(1);
        });

        it("should keep the handles from crossing", () => {
            const rendered: IRenderedSlider = renderSlider(ZoomSliderAxis.x, { start: 0, end: 0.5 });

            let reportedRange: IDataRepresentationZoomRange = null;

            rendered.eventDispatcher.on(EventName.onZoom, (_, range) => { reportedRange = range; });

            // Drags the start handle well past the end handle
            drag(rendered, 0, 0.9);

            expect(reportedRange.start).toBeLessThan(reportedRange.end);
        });
    });
});
