/**
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
import { Selection } from "d3-selection";
import { pixelConverter } from "powerbi-visuals-utils-typeutils";

import { EventName } from "../event/eventName";
import { BaseComponent } from "./base/baseComponent";
import { IVisualComponentConstructorOptions } from "./base/visualComponentConstructorOptions";
import { IVisualComponentViewport } from "./base/visualComponent";

import {
    IDataRepresentationZoomRange,
    fullZoomRange,
} from "../dataRepresentation/dataRepresentationZoom";

export enum ZoomSliderAxis {
    x = "x",
    y = "y",
}

export interface IZoomSliderComponentRenderOptions {
    axis: ZoomSliderAxis;
    isShown: boolean;
    range: IDataRepresentationZoomRange;
    viewport: powerbi.IViewport;
    // Distance between the start of the plot and the start of the drawing area, so the
    // slider lines up with the axis it drives rather than with the plot container
    offset: number;
}

type Handle = "start" | "end";

export class ZoomSliderComponent extends BaseComponent<
    IVisualComponentConstructorOptions,
    IZoomSliderComponentRenderOptions
> {
    /**
     * The band the slider occupies across the axis it belongs to. It matches the
     * footprint the built in visuals reserve for their zoom slider.
     */
    public static readonly Thickness: number = 20;

    private static readonly HandleRadius: number = 5;
    private static readonly TrackThickness: number = 2;

    /**
     * The two handles may not cross, and a fully collapsed range would leave the
     * chart with an empty domain, so they keep this much of the axis between them.
     */
    private static readonly MinimumRange: number = 0.02;

    private className: string = "zoomSliderComponent";

    private trackElement: Selection<any, any, any, any>;
    private rangeElement: Selection<any, any, any, any>;
    private startHandleElement: Selection<any, any, any, any>;
    private endHandleElement: Selection<any, any, any, any>;

    private currentRange: IDataRepresentationZoomRange = { ...fullZoomRange };
    private axis: ZoomSliderAxis = ZoomSliderAxis.x;
    private length: number = 0;

    private draggedHandle: Handle = null;
    private readonly onPointerMove = (event: PointerEvent) => this.handlePointerMove(event);
    private readonly onPointerUp = () => this.handlePointerUp();

    constructor(options: IVisualComponentConstructorOptions) {
        super();

        this.initElement(
            options.element,
            this.className,
            "svg",
        );

        this.constructorOptions = {
            ...options,
            element: this.element,
        };

        this.trackElement = this.element.append("line").classed(this.getClassNameWithPrefix("zoomSlider_track"), true);
        this.rangeElement = this.element.append("line").classed(this.getClassNameWithPrefix("zoomSlider_range"), true);

        this.startHandleElement = this.appendHandle("start");
        this.endHandleElement = this.appendHandle("end");
    }

    public render(options: IZoomSliderComponentRenderOptions): void {
        const { axis, isShown, range, viewport, offset } = options;

        this.renderOptions = options;

        if (!isShown) {
            this.hide();

            return;
        }

        this.show();

        this.axis = axis;
        this.currentRange = { ...range };

        const isHorizontal: boolean = axis === ZoomSliderAxis.x;

        this.length = Math.max(0, isHorizontal ? viewport.width : viewport.height);

        this.updateViewport({
            height: isHorizontal ? ZoomSliderComponent.Thickness : this.length,
            width: isHorizontal ? this.length : ZoomSliderComponent.Thickness,
        });

        // The slider is a plain flex item, so it is shifted into place with a margin on
        // the side it runs along, leaving the other side untouched
        this.element
            .style("margin-left", isHorizontal ? pixelConverter.toString(offset) : null)
            .style("margin-top", isHorizontal ? null : pixelConverter.toString(offset));

        this.updateGeometry();
    }

    public getViewport(): IVisualComponentViewport {
        const isHorizontal: boolean = this.axis === ZoomSliderAxis.x;

        if (!this.isShown) {
            return { height: 0, width: 0 };
        }

        return {
            height: isHorizontal ? ZoomSliderComponent.Thickness : 0,
            width: isHorizontal ? 0 : ZoomSliderComponent.Thickness,
        };
    }

    public destroy(): void {
        this.detachDragListeners();

        this.trackElement = null;
        this.rangeElement = null;
        this.startHandleElement = null;
        this.endHandleElement = null;

        super.destroy();
    }

    private appendHandle(handle: Handle): Selection<any, any, any, any> {
        return this.element
            .append("circle")
            .classed(this.getClassNameWithPrefix("zoomSlider_handle"), true)
            .attr("r", ZoomSliderComponent.HandleRadius)
            .on("pointerdown", (event: PointerEvent) => this.handlePointerDown(event, handle));
    }

    /**
     * Places the track, the kept range and both handles. A fraction of 0 is the start
     * of the axis; on a vertical slider that is the bottom, so the pixel position is
     * mirrored to match the direction the Y axis grows in.
     */
    private updateGeometry(): void {
        const isHorizontal: boolean = this.axis === ZoomSliderAxis.x;
        const center: number = ZoomSliderComponent.Thickness / 2;

        const trackStart: number = this.getPosition(0);
        const trackEnd: number = this.getPosition(1);

        const startPosition: number = this.getPosition(this.currentRange.start);
        const endPosition: number = this.getPosition(this.currentRange.end);

        if (isHorizontal) {
            this.setLine(this.trackElement, trackStart, center, trackEnd, center);
            this.setLine(this.rangeElement, startPosition, center, endPosition, center);

            this.startHandleElement.attr("cx", startPosition).attr("cy", center);
            this.endHandleElement.attr("cx", endPosition).attr("cy", center);
        } else {
            this.setLine(this.trackElement, center, trackStart, center, trackEnd);
            this.setLine(this.rangeElement, center, startPosition, center, endPosition);

            this.startHandleElement.attr("cx", center).attr("cy", startPosition);
            this.endHandleElement.attr("cx", center).attr("cy", endPosition);
        }

        this.element
            .attr("stroke-width", ZoomSliderComponent.TrackThickness);
    }

    private setLine(
        element: Selection<any, any, any, any>,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
    ): void {
        element
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2);
    }

    /**
     * The track is inset by one handle radius at each end: a handle sitting on the very
     * first or last position would otherwise be drawn half outside the slider.
     */
    private getUsableLength(length: number): number {
        return Math.max(0, length - (2 * ZoomSliderComponent.HandleRadius));
    }

    private getPosition(fraction: number): number {
        const clamped: number = Math.max(0, Math.min(1, fraction));

        const positionAlongTrack: number = ZoomSliderComponent.HandleRadius
            + (clamped * this.getUsableLength(this.length));

        return this.axis === ZoomSliderAxis.x
            ? positionAlongTrack
            : this.length - positionAlongTrack;
    }

    private getFraction(event: PointerEvent): number {
        const bounds: DOMRect = (this.element.node() as SVGElement).getBoundingClientRect();

        const isHorizontal: boolean = this.axis === ZoomSliderAxis.x;

        const usableLength: number = this.getUsableLength(isHorizontal ? bounds.width : bounds.height);

        if (usableLength <= 0) {
            return 0;
        }

        const positionAlongTrack: number = isHorizontal
            ? event.clientX - bounds.left - ZoomSliderComponent.HandleRadius
            : bounds.bottom - event.clientY - ZoomSliderComponent.HandleRadius;

        return positionAlongTrack / usableLength;
    }

    private handlePointerDown(event: PointerEvent, handle: Handle): void {
        event.preventDefault();
        event.stopPropagation();

        this.draggedHandle = handle;

        window.addEventListener("pointermove", this.onPointerMove);
        window.addEventListener("pointerup", this.onPointerUp);
    }

    /**
     * The handle follows the pointer straight away, but the chart itself is only
     * rebuilt once the drag ends: rebuilding it on every move would re-run the whole
     * data pipeline for each frame.
     */
    private handlePointerMove(event: PointerEvent): void {
        if (!this.draggedHandle) {
            return;
        }

        const fraction: number = this.getFraction(event);

        if (this.draggedHandle === "start") {
            this.currentRange.start = Math.max(
                0,
                Math.min(fraction, this.currentRange.end - ZoomSliderComponent.MinimumRange),
            );
        } else {
            this.currentRange.end = Math.min(
                1,
                Math.max(fraction, this.currentRange.start + ZoomSliderComponent.MinimumRange),
            );
        }

        this.updateGeometry();
    }

    private handlePointerUp(): void {
        if (!this.draggedHandle) {
            return;
        }

        this.draggedHandle = null;

        this.detachDragListeners();

        if (this.constructorOptions && this.constructorOptions.eventDispatcher) {
            this.constructorOptions.eventDispatcher.call(
                EventName.onZoom,
                undefined,
                this.axis,
                { ...this.currentRange },
            );
        }
    }

    private detachDragListeners(): void {
        window.removeEventListener("pointermove", this.onPointerMove);
        window.removeEventListener("pointerup", this.onPointerUp);
    }
}
