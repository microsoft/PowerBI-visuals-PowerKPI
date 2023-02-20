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

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import { IMargin } from "powerbi-visuals-utils-svgutils";

import { BaseDescriptor } from "../descriptors/baseDescriptor";

import Slider = formattingSettings.Slider;
export class DotsDescriptor extends BaseDescriptor {
    public radiusFactor = new Slider({
        name: "thickness",
        displayName: "Thickness",
        value: 1.4,
        options: {
            minValue: {
                type: powerbi.visuals.ValidatorType.Min,
                value: 0,
            },
            maxValue: {
                type: powerbi.visuals.ValidatorType.Max,
                value: 100,
            }
        }
    });

    constructor() {
        super()

        this.name = "dots";
        this.displayNameKey = "Visual_Dots";
    }

    public getMarginByThickness(
        thickness: number,
        defaultMargin: IMargin,
    ): IMargin {
        if (isNaN(thickness)) {
            return defaultMargin;
        }

        const currentThickness: number = thickness * this.radiusFactor.value;

        return {
            bottom: currentThickness,
            left: currentThickness,
            right: currentThickness,
            top: currentThickness,
        };
    }
}
