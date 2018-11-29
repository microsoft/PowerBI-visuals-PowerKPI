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

import { IDataRepresentationPoint } from "../dataRepresentation/dataRepresentationPoint";
import { DataRepresentationScale } from "../dataRepresentation/dataRepresentationScale";
import { BaseComponent } from "./base/baseComponent";
import { IVisualComponentConstructorOptions } from "./base/visualComponentConstructorOptions";
import { IVisualComponentRenderOptionsBase } from "./base/visualComponentRenderOptions";

export interface IDotComponentRenderOptions extends IVisualComponentRenderOptionsBase {
    thickness: number;
    viewport: powerbi.IViewport;
    x: DataRepresentationScale;
    y: DataRepresentationScale;
    point: IDataRepresentationPoint;
    radiusFactor: number;
}

export class DotComponent extends BaseComponent<IVisualComponentConstructorOptions, IDotComponentRenderOptions> {
    constructor(options: IVisualComponentConstructorOptions) {
        super();

        this.initElement(
            options.element,
            "dotComponent",
            "circle",
        );

        this.element.on("click", this.clickHandler.bind(this));

        this.constructorOptions = {
            ...options,
            element: this.element,
        };
    }

    public render(options: IDotComponentRenderOptions): void {
        const {
            x,
            y,
            point,
            viewport,
            thickness,
            radiusFactor,
        } = options;

        this.renderOptions = options;

        const xScale: DataRepresentationScale = x
            .copy()
            .range([0, viewport.width]);

        const yScale: DataRepresentationScale = y
            .copy()
            .range([viewport.height, 0]);

        this.element
            .attr("cx", xScale.scale(point.x))
            .attr("cy", yScale.scale(point.y))
            .attr("r", thickness * radiusFactor)
            .style("fill", point.color);
    }
}
