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

import { Selection } from "d3-selection";
import { CssConstants } from "powerbi-visuals-utils-svgutils";

import { DataRepresentationScale } from "../../dataRepresentation/dataRepresentationScale";
import { BaseComponent } from "../base/baseComponent";
import { IVisualComponentConstructorOptions } from "../base/visualComponentConstructorOptions";

import { IDataRepresentationPoint } from "../../dataRepresentation/dataRepresentationPoint";

import { ILineComponentRenderOptions } from "./lineComponent";

export interface IScatterComponentRenderOptions extends ILineComponentRenderOptions {
    radiusFactor: number;
}

export class ScatterComponent extends BaseComponent<IVisualComponentConstructorOptions, IScatterComponentRenderOptions> {
    private className: string = "scatterComponent";
    private pointSelector: CssConstants.ClassAndSelector = this.getSelectorWithPrefix(`${this.className}_point`);

    private pointSelection: Selection<any, IDataRepresentationPoint, any, any>;

    constructor(options: IVisualComponentConstructorOptions) {
        super();

        this.initElement(
            options.element,
            this.className,
            "g",
        );

        this.constructorOptions = {
            ...options,
            element: this.element,
        };
    }

    public render(options: IScatterComponentRenderOptions): void {
        const {
            x,
            y,
            viewport,
            thickness,
            radiusFactor,
            series,
            colorPalette
        } = options;

        this.renderOptions = options;

        const xScale: DataRepresentationScale = x
            .copy()
            .range([0, viewport.width]);

        const yScale: DataRepresentationScale = y
            .copy()
            .range([viewport.height, 0]);

        // Scatter draws one circle per data point instead of a connecting path, so
        // points without a value are dropped rather than interpolated over - keeping
        // them would place circles at NaN coordinates.
        const points: IDataRepresentationPoint[] = series
            && series.points.filter((point: IDataRepresentationPoint) => {
                return point.y !== null && !isNaN(point.y);
            })
            || [];

        const pointSelection: Selection<any, IDataRepresentationPoint, any, any> = this.element
            .selectAll(this.pointSelector.selectorName)
            .data(points);

        pointSelection
            .exit()
            .remove();

        const isHighContrast: boolean = colorPalette.isHighContrast;

        this.pointSelection = pointSelection.enter()
            .append("svg:circle")
            .classed(this.pointSelector.className, true)
            .on("click", (event) => this.clickHandler(event))
            .merge(pointSelection)
            .attr("cx", (point: IDataRepresentationPoint) => xScale.scale(point.x))
            .attr("cy", (point: IDataRepresentationPoint) => yScale.scale(point.y))
            // The same radius formula as the current value dot, so both are sized
            // consistently by the line thickness and the dots radius factor.
            .attr("r", thickness * radiusFactor)
            .style("fill", (point: IDataRepresentationPoint) => isHighContrast ? colorPalette.foreground.value : point.color);

        this.highlight(series && series.hasSelection);
    }

    public destroy(): void {
        this.pointSelection = null;

        super.destroy();
    }

    public highlight(hasSelection: boolean): void {
        this.updateElementOpacity(
            this.pointSelection,
            this.renderOptions && this.renderOptions.opacity,
            this.renderOptions && this.renderOptions.series && this.renderOptions.series.selected,
            hasSelection,
        );
    }
}
