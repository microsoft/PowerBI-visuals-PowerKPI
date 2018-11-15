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

import { Selection } from "d3";

import { CssConstants } from "powerbi-visuals-utils-svgutils";

import { BaseComponent } from "./base/baseComponent";
import { VisualComponentConstructorOptions } from "./base/visualComponentConstructorOptions";
import { VisualComponentRenderOptions } from "./base/visualComponentRenderOptions";
import { DataRepresentationScale } from "../dataRepresentation/dataRepresentationScale";
import { DataRepresentationPoint } from "../dataRepresentation/dataRepresentationPoint";

export class VerticalLineComponent extends BaseComponent<VisualComponentConstructorOptions, VisualComponentRenderOptions> {
    private className: string = "verticalLineComponent";
    private lineSelector: CssConstants.ClassAndSelector = CssConstants.createClassAndSelector("verticalLine");

    constructor(options: VisualComponentConstructorOptions) {
        super();

        this.initElement(
            options.element,
            this.className,
            "g"
        );
    }

    public render(options: VisualComponentRenderOptions): void {
        const { series, viewport, x } = options.data;

        const xScale: DataRepresentationScale = x.scale
            .copy()
            .range([0, viewport.width]);

        const points: DataRepresentationPoint[] = series
            && series[0]
            && series[0].points
            || [];

        const lineSelection: Selection<any, DataRepresentationPoint, any, any> = this.element
            .selectAll(this.lineSelector.selectorName)
            .data(points);

        lineSelection
            .enter()
            .append("line")
            .classed(this.lineSelector.className, true)
            .merge(lineSelection)
            .attr("x1", (point: DataRepresentationPoint) => xScale.scale(point.x))
            .attr("y1", 0)
            .attr("x2", (point: DataRepresentationPoint) => xScale.scale(point.x))
            .attr("y2", viewport.height);

        lineSelection
            .exit()
            .remove();
    }

    public clear(): void {
        this.element
            .selectAll("*")
            .remove();
    }

    public destroy(): void {
        this.element = null;
    }
}
