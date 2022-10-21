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

import { BaseDescriptor } from "../../baseDescriptor";

export class AxisReferenceLineDescriptor
    extends BaseDescriptor {

    public show = new formattingSettings.ToggleSwitch({
        name: "show",
        displayName: "Show",
        value: true,
        topLevelToggle: true
    });

    public color = new formattingSettings.ColorPicker({
        name: "color",
        displayName: "Color",
        value: { value: "#e9e9e9" }
    });

    private _minThickness: number = 0.2;
    private _maxThickness: number = 5;
    public thickness = new formattingSettings.Slider({
        name: "thickness",
        displayName: "Thickness",
        value: 1,
        options: {
            minValue: {
                type: powerbi.visuals.ValidatorType.Min,
                value: this._minThickness,
            },
            maxValue: {
                type: powerbi.visuals.ValidatorType.Max,
                value: this._maxThickness,
            }
        }
    });

    constructor(name: string, displayName: string, isShown: boolean = true) {
        super();

        this.show.value = isShown;

        this.slices = [this.show, this.color, this.thickness]
        this.name = name;
        this.displayName = displayName;
    }

}
