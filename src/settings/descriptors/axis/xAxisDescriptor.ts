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
import ILocalizationManager = powerbi.extensibility.ILocalizationManager;

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import {
    AxisDescriptor,
    AxisType,
} from "./axisDescriptor";

const typeOptions = [
    {
        value: AxisType.continuous,
        displayName: "Visual_Continuous"
    },
    {
        value: AxisType.categorical,
        displayName: "Visual_Categorical"
    }
]

export class XAxisDescriptor extends AxisDescriptor {
    public type = new formattingSettings.ItemDropdown({
        name: "type",
        displayNameKey: "Visual_Type",
        items: typeOptions,
        value: typeOptions[0]
    });

    constructor(
        viewportToBeHidden: powerbi.IViewport, 
        viewportToIncreaseDensity: powerbi.IViewport
    ) {
        super(viewportToBeHidden, viewportToIncreaseDensity, true)

        this.slices = [this.font, this.fontColor, this.displayUnits, this.percentile, this.type]
        this.name = "xAxis";
        this.displayNameKey = "Visual_X_Axis";
    }

    public getNewType(value: AxisType) {
        return this.getNewComplexValue(value, typeOptions)
    }
    
    public setLocalizedDisplayName(localizationManager: ILocalizationManager) {
        super.setLocalizedDisplayName(localizationManager);
        typeOptions.forEach(option => {
            option.displayName = localizationManager.getDisplayName(option.displayName)
        })
    }
}
