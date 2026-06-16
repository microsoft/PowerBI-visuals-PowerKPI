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

import { valueFormatter } from "powerbi-visuals-utils-formattingutils";

import {
    axisInterfaces,
} from "powerbi-visuals-utils-chartutils";

import { DataRepresentationAxisValueType } from "../../dataRepresentation/dataRepresentationAxisValueType";
import { BaseComponent } from "../base/baseComponent";
import { IVisualComponent } from "../base/visualComponent";

export interface IAxisComponent<RenderOptions> extends IVisualComponent<RenderOptions> {
    getTicks(): DataRepresentationAxisValueType[];
    preRender(options: RenderOptions); // Preestimates size of a component as X Axis depends on Y Axis and vice versa
}

export abstract class AxisBaseComponent<VisualComponentConstructorOptions, VisualComponentRenderOptions>
    extends BaseComponent<VisualComponentConstructorOptions, VisualComponentRenderOptions> {
    protected gElement: Selection<any, any, any, any>;

    protected formatter: valueFormatter.IValueFormatter;
    protected axisProperties: axisInterfaces.IAxisProperties;

    public abstract render(options: VisualComponentRenderOptions): void;

    public getTicks(): DataRepresentationAxisValueType[] {
        return this.axisProperties
            && this.axisProperties.axis
            && this.axisProperties.axis.tickValues
            && this.axisProperties.axis.tickValues() || [];
    }

    public destroy(): void {
        super.destroy();

        this.element = null;
        this.gElement = null;
    }
}
