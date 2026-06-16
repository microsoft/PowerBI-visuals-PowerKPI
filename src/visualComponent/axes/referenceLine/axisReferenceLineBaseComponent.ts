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
    line as d3Line,
    Line as D3Line
} from "d3-shape";
import { Selection } from "d3-selection";

import powerbi from "powerbi-visuals-api";
import { CssConstants } from "powerbi-visuals-utils-svgutils";
import ISandboxExtendedColorPalette = powerbi.extensibility.ISandboxExtendedColorPalette;

import { DataRepresentationAxisValueType } from "../../../dataRepresentation/dataRepresentationAxisValueType";
import { DataRepresentationScale } from "../../../dataRepresentation/dataRepresentationScale";
import { AxisReferenceLineDescriptor } from "../../../settings/descriptors/axis/referenceLine/axisReferenceLineDescriptor";
import { BaseComponent } from "../../base/baseComponent";
import { IVisualComponentConstructorOptions } from "../../base/visualComponentConstructorOptions";
import { IAxisReferenceLineGetPointsFunction } from "./axisReferenceLineGetPointsFunction";

export interface IAxisReferenceLineBaseComponentRenderOptions {
    settings: AxisReferenceLineDescriptor;
    ticks: DataRepresentationAxisValueType[];
    scale: DataRepresentationScale;
    viewport: powerbi.IViewport;
    colorPalette: ISandboxExtendedColorPalette;
}

export abstract class AxisReferenceLineBaseComponent
    extends BaseComponent<IVisualComponentConstructorOptions, IAxisReferenceLineBaseComponentRenderOptions> {
    private className: string = "axisReferenceLineComponent";

    private lineSelector: CssConstants.ClassAndSelector = CssConstants.createClassAndSelector("axisReferenceLine");

    constructor(options: IVisualComponentConstructorOptions) {
        super();

        this.initElement(
            options.element,
            this.className,
            "g",
        );
    }

    public render(options: IAxisReferenceLineBaseComponentRenderOptions): void {
        const {
            ticks,
            scale,
            settings,
            colorPalette
        } = options;

        if (!ticks || !scale || !settings || !ticks.length) {
            this.hide();

            return;
        }

        this.show();

        const lineSelection: Selection<any, DataRepresentationAxisValueType, any, any> = this.element
            .selectAll(this.lineSelector.selectorName)
            .data(settings.show.value ? ticks : []);

        const line: D3Line<[number, number]> = d3Line()
            .x((positions: number[]) => {
                return positions[0] || 0;
            })
            .y((positions: number[]) => {
                return positions[1] || 0;
            });

        const getPoints: IAxisReferenceLineGetPointsFunction = this.getPoints(options);
        const isHighContrast: boolean = colorPalette.isHighContrast;

        lineSelection
            .enter()
            .append("svg:path")
            .classed(this.lineSelector.className, true)
            .merge(lineSelection)
            .attr("d", (value: DataRepresentationAxisValueType) => {
                return line(getPoints(value));
            })
            .style("stroke", isHighContrast ? colorPalette.foreground.value :settings.color.value.value)
            .style("stroke-width", settings.thickness.value);

        lineSelection
            .exit()
            .remove();
    }

    protected abstract getPoints(options: IAxisReferenceLineBaseComponentRenderOptions): IAxisReferenceLineGetPointsFunction;
}
