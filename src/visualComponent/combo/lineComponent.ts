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

import {
    Selection,
    line,
    Line
} from "d3";

import powerbi from "powerbi-visuals-api";
import { CssConstants } from "powerbi-visuals-utils-svgutils";
import { pixelConverter } from "powerbi-visuals-utils-typeutils";

import { BaseComponent } from "../base/baseComponent";
import { VisualComponentRenderOptionsBase } from "../base/visualComponentRenderOptions";
import { VisualComponentConstructorOptions } from "../base/visualComponentConstructorOptions";
import { DataRepresentationScale } from "../../dataRepresentation/dataRepresentationScale";

import {
    DataRepresentationPoint,
    DataRepresentationPointGradientColor
} from "../../dataRepresentation/dataRepresentationPoint";

import {
    LineInterpolation,
    LineStyle
} from "../../settings/descriptors/lineDescriptor";

export interface LineComponentRenderOptions extends VisualComponentRenderOptionsBase {
    thickness: number;
    viewport: powerbi.IViewport;
    x: DataRepresentationScale;
    y: DataRepresentationScale;
    interpolation: LineInterpolation;
    lineStyle: LineStyle;
    gradientPoints: DataRepresentationPointGradientColor[];
    opacity: number;
}

export class LineComponent extends BaseComponent<VisualComponentConstructorOptions, LineComponentRenderOptions> {
    private className: string = "lineComponent";
    private lineSelector: CssConstants.ClassAndSelector = this.getSelectorWithPrefix(`${this.className}_line`);

    private lineSelection: Selection<any, DataRepresentationPointGradientColor, any, any>;

    constructor(options: VisualComponentConstructorOptions) {
        super();

        this.initElement(
            options.element,
            this.className,
            "g"
        );

        this.constructorOptions = {
            ...options,
            element: this.element,
        };
    }

    public render(options: LineComponentRenderOptions): void {
        const {
            x,
            y,
            viewport,
            thickness,
            interpolation,
            gradientPoints,
            lineStyle,
            series,
        } = options;

        this.renderOptions = options;

        const xScale: DataRepresentationScale = x
            .copy()
            .range([0, viewport.width]);

        const yScale: DataRepresentationScale = y
            .copy()
            .range([viewport.height, 0]);

        this.lineSelection = this.element
            .selectAll(this.lineSelector.selectorName)
            .data(gradientPoints);

        this.lineSelection.enter()
            .append("svg:path")
            .classed(this.lineSelector.className, true)
            .on("click", this.clickHandler.bind(this))
            .merge(this.lineSelection)
            .attr("d", (gradientGroup: DataRepresentationPointGradientColor) => {
                return this.getLine(
                    xScale,
                    yScale,
                    interpolation
                )(gradientGroup.points);
            })
            .attr("class", `${this.lineSelector.className} ${lineStyle}`)
            .style("stroke", (gradientGroup: DataRepresentationPointGradientColor) => gradientGroup.color)
            .style("stroke-width", () => pixelConverter.toString(thickness));

        this.highlight(series && series.hasSelection);

        this.lineSelection
            .exit()
            .remove();
    }

    private getLine(
        xScale: DataRepresentationScale,
        yScale: DataRepresentationScale,
        interpolation: LineInterpolation,
    ): Line<DataRepresentationPoint> {
        return line<DataRepresentationPoint>()
            .x((data: DataRepresentationPoint) => {
                return xScale.scale(data.x);
            })
            .y((data: DataRepresentationPoint) => {
                return yScale.scale(data.y);
            });
            // .interpolate(interpolation); // TODO: fix interpolation https://github.com/d3/d3-shape/blob/master/README.md#curves
    }

    public destroy(): void {
        this.lineSelection = null;

        super.destroy();
    }

    public highlight(hasSelection: boolean): void {
        this.updateElementOpacity(
            this.lineSelection,
            this.renderOptions && this.renderOptions.opacity,
            this.renderOptions && this.renderOptions.series && this.renderOptions.series.selected,
            hasSelection,
        );
    }
}
