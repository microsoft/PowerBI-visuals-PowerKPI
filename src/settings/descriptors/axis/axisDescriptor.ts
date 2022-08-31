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
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import {
    IDescriptor,
    IDescriptorParserOptions,
} from "../descriptor";

import { NumberDescriptorBase } from "../numberDescriptorBase";

export enum AxisType {
    continuous,
    categorical,
}

export class AxisDescriptor
    extends NumberDescriptorBase
    implements IDescriptor {

    public maxDensity: number = 100;

    public fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Font Color",
        value: { value: "rgb(0,0,0)" }
    });

    private shouldDensityBeAtMax: boolean = false;
    private viewportToIncreaseDensity: powerbi.IViewport;

    constructor(
        viewportToBeHidden: powerbi.IViewport,
        viewportToIncreaseDensity: powerbi.IViewport,
    ) {
        super(viewportToBeHidden);

        this.viewportToIncreaseDensity = viewportToIncreaseDensity;
        this.font.fontFamily.value = "Segoe UI Light, wf_segoe-ui_light, helvetica, arial, sans-serif"
        this.density.options.maxValue.value = this.maxDensity
    }

    public parse(options: IDescriptorParserOptions) {
        super.parse(options);

        if (this.shouldDensityBeAtMax) {
            this.density.value = this.maxDensity;
        }

        this.shouldDensityBeAtMax = options.isAutoHideBehaviorEnabled
            && this.viewportToIncreaseDensity
            && options.viewport
            && (options.viewport.width <= this.viewportToIncreaseDensity.width
                ||
                options.viewport.height <= this.viewportToIncreaseDensity.height);
    }
}
