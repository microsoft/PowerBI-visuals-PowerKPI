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
import { area, Area } from "d3-shape";

import { CssConstants } from "powerbi-visuals-utils-svgutils";

import { DataRepresentationScale } from "../../dataRepresentation/dataRepresentationScale";
import { IVisualComponent } from "../base/visualComponent";
import { IVisualComponentConstructorOptions } from "../base/visualComponentConstructorOptions";

import {
    IDataRepresentationPoint,
    IDataRepresentationPointGradientColor,
} from "../../dataRepresentation/dataRepresentationPoint";

import { LineInterpolation } from "../../settings/descriptors/line/lineTypes";
import {
    ILineComponentRenderOptions,
    LineComponent,
} from "./lineComponent";

export interface IAreaComponentRenderOptions extends ILineComponentRenderOptions {
    areaOpacity: number;
}

export class AreaComponent
    extends LineComponent
    implements IVisualComponent<ILineComponentRenderOptions> {

    private additionalClassName: string = "areaComponent";
    private areaSelector: CssConstants.ClassAndSelector = this.getSelectorWithPrefix(`${this.additionalClassName}_area`);

    private areaSelection: Selection<any, IDataRepresentationPointGradientColor, any, any>;

    constructor(options: IVisualComponentConstructorOptions) {
        super(options);

        this.element.classed(this.additionalClassName, true);

        this.constructorOptions = {
            ...options,
            element: this.element,
        };
    }

    public render(options: IAreaComponentRenderOptions): void {
        this.renderArea(options);
        super.render(options);
    }

    public renderArea(options: IAreaComponentRenderOptions): void {
        const {
            x,
            y,
            viewport,
            interpolation,
            gradientPoints,
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

        const areaSelection: Selection<any, IDataRepresentationPointGradientColor, any, any> = this.element
            .selectAll(this.areaSelector.selectorName)
            .data(gradientPoints);

        areaSelection
            .exit()
            .remove();

        const isHighContrast: boolean = colorPalette.isHighContrast;
        this.areaSelection = areaSelection.enter()
            .append("svg:path")
            .classed(this.areaSelector.className, true)
            .on("click", (event) => this.clickHandler(event))
            .merge(areaSelection)
            .attr("d", (gradientGroup: IDataRepresentationPointGradientColor) => {
                return this.getArea(
                    xScale,
                    yScale,
                    viewport,
                    interpolation,
                )(gradientGroup.points);
            })
            .style("fill", (gradientGroup: IDataRepresentationPointGradientColor) => isHighContrast ? colorPalette.foreground.value : gradientGroup.color);

        this.highlight(series && series.hasSelection);
    }

    public destroy(): void {
        this.areaSelection = null;

        super.destroy();
    }

    public highlight(hasSelection: boolean): void {
        this.updateElementOpacity(
            this.areaSelection,
            this.renderOptions && (this.renderOptions as IAreaComponentRenderOptions).areaOpacity,
            this.renderOptions && this.renderOptions.series && this.renderOptions.series.selected,
            hasSelection,
        );

        super.highlight(hasSelection);
    }

    private getArea(
        xScale: DataRepresentationScale,
        yScale: DataRepresentationScale,
        viewport: powerbi.IViewport,
        interpolation: LineInterpolation,
    ): Area<IDataRepresentationPoint> {
        return area<IDataRepresentationPoint>()
            .x((dataPoint: IDataRepresentationPoint) => {
                return xScale.scale(dataPoint.x);
            })
            .y0(viewport.height)
            .y1((dataPoint: IDataRepresentationPoint) => {
                return yScale.scale(dataPoint.y);
            })
            .curve(this.getInterpolator(interpolation));
    }
}
