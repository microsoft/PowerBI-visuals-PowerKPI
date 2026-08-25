
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
import ILocalizationManager = powerbi.extensibility.ILocalizationManager;

import { IDescriptorParserOptions } from "../baseDescriptor";
import { AxisDescriptor } from "./axisDescriptor";

export enum FixedLabelWidthMode {
    auto = "auto",
    fixed = "fixed",
}

const fixedLabelWidthModeOptions = [
    {
        value: FixedLabelWidthMode.auto,
        displayName: "Auto",
        displayNameKey: "Visual_Auto"
    },
    {
        value: FixedLabelWidthMode.fixed,
        displayName: "Fixed",
        displayNameKey: "Visual_Fixed"
    }
]

export class YAxisDescriptor extends AxisDescriptor {
    public min = new formattingSettings.NumUpDown({
        name: "min",
        displayNameKey: "Visual_Min",
        value: NaN,
    });
    public max = new formattingSettings.NumUpDown({
        name: "max",
        displayNameKey: "Visual_Max",
        value: NaN,
    });

    public fixedLabelWidthMode = new formattingSettings.ItemDropdown({
        name: "fixedLabelWidthMode",
        displayNameKey: "Visual_Label_Area_Sizing",
        descriptionKey: "Visual_Label_Area_Sizing_Description",
        items: fixedLabelWidthModeOptions,
        value: fixedLabelWidthModeOptions.filter(el => el.value === FixedLabelWidthMode.auto)[0]
    });

    protected minFixedLabelWidth: number = 0;
    protected maxFixedLabelWidth: number = 400;
    public fixedLabelWidth = new formattingSettings.NumUpDown({
        name: "fixedLabelWidth",
        displayNameKey: "Visual_Label_Area_Width",
        value: 60,
        options: {
            minValue: {
                type: powerbi.visuals.ValidatorType.Min,
                value: this.minFixedLabelWidth,
            },
            maxValue: {
                type: powerbi.visuals.ValidatorType.Max,
                value: this.maxFixedLabelWidth,
            },
        }
    });

    constructor(
        name: string, 
        displayNameKey: string,
        viewportToBeHidden: powerbi.IViewport,
        viewportToIncreaseDensity: powerbi.IViewport,
    ) {
        super(viewportToBeHidden, viewportToIncreaseDensity)

        this.slices = [
            this.font,
            this.displayUnits,
            this.precision,
            this.fontColor,
            this.percentile,
            this.min,
            this.max,
            this.fixedLabelWidthMode,
            this.fixedLabelWidth
        ]
        this.name = name;
        this.displayNameKey = displayNameKey;
    }

    public parse(options: IDescriptorParserOptions) {
        super.parse(options);

        // The formatting pane validators only guard UI input, so values persisted by
        // older reports or set through the API are clamped here, the same way
        // NumberDescriptorBase clamps precision
        if (this.fixedLabelWidth.value < this.fixedLabelWidth.options.minValue.value) {
            this.fixedLabelWidth.value = this.fixedLabelWidth.options.minValue.value;
        }
        if (this.fixedLabelWidth.value > this.fixedLabelWidth.options.maxValue.value) {
            this.fixedLabelWidth.value = this.fixedLabelWidth.options.maxValue.value;
        }
    }

    public isLabelWidthFixed(): boolean {
        return this.fixedLabelWidthMode.value.value === FixedLabelWidthMode.fixed;
    }

    public setLocalizedDisplayName(localizationManager: ILocalizationManager) {
        super.setLocalizedDisplayName(localizationManager);
        fixedLabelWidthModeOptions.forEach(option => {
            option.displayName = localizationManager.getDisplayName(option.displayNameKey)
        });
    }
}
