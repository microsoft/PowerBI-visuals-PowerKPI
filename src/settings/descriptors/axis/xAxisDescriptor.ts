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

import { DataRepresentationAxisValueType } from "../../../dataRepresentation/dataRepresentationAxisValueType";
import { DataRepresentationTypeEnum } from "../../../dataRepresentation/dataRepresentationType";

import {
    AxisDescriptor,
    AxisType,
} from "./axisDescriptor";

const typeOptions = [
    {
        value: AxisType.continuous,
        displayName: "Continuous",
        displayNameKey: "Visual_Continuous"
    },
    {
        value: AxisType.categorical,
        displayName: "Categorical",
        displayNameKey: "Visual_Categorical"
    }
]

export class XAxisDescriptor extends AxisDescriptor {
    public type = new formattingSettings.ItemDropdown({
        name: "type",
        displayNameKey: "Visual_Type",
        items: typeOptions,
        value: typeOptions[0]
    });

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

    // The formatting API exposes no date property type, so date boundaries are typed
    // as text and parsed here. Numeric axes keep the numeric inputs above.
    public minDate = new formattingSettings.TextInput({
        name: "minDate",
        displayNameKey: "Visual_Min",
        descriptionKey: "Visual_Axis_Date_Boundary_Description",
        value: "",
        placeholder: ""
    });
    public maxDate = new formattingSettings.TextInput({
        name: "maxDate",
        displayNameKey: "Visual_Max",
        descriptionKey: "Visual_Axis_Date_Boundary_Description",
        value: "",
        placeholder: ""
    });

    constructor(
        viewportToBeHidden: powerbi.IViewport,
        viewportToIncreaseDensity: powerbi.IViewport
    ) {
        super(viewportToBeHidden, viewportToIncreaseDensity, true)

        this.slices = [
            this.font,
            this.fontColor,
            this.displayUnits,
            this.percentile,
            this.type,
            this.min,
            this.max,
            this.minDate,
            this.maxDate
        ]
        this.name = "xAxis";
        this.displayNameKey = "Visual_X_Axis";
    }

    public getMin(type: DataRepresentationTypeEnum): DataRepresentationAxisValueType {
        return this.getBoundary(type, this.min.value, this.minDate.value);
    }

    public getMax(type: DataRepresentationTypeEnum): DataRepresentationAxisValueType {
        return this.getBoundary(type, this.max.value, this.maxDate.value);
    }

    /**
     * Returns the boundary the author pinned for the current axis type, or undefined
     * when it is left empty - in which case the axis keeps its data driven bound.
     */
    private getBoundary(
        type: DataRepresentationTypeEnum,
        numericValue: number,
        dateValue: string,
    ): DataRepresentationAxisValueType {
        switch (type) {
            case DataRepresentationTypeEnum.NumberType: {
                return numericValue === null || isNaN(numericValue)
                    ? undefined
                    : numericValue;
            }
            case DataRepresentationTypeEnum.DateType: {
                return this.parseDate(dateValue);
            }
            default: {
                // A categorical axis is a list of categories rather than a range,
                // so it has no boundary to pin
                return undefined;
            }
        }
    }

    /**
     * An entry that is empty or cannot be read as a date is ignored, so a typo never
     * collapses the axis - it simply falls back to the computed boundary.
     */
    private parseDate(value: string): Date {
        if (!value) {
            return undefined;
        }

        const date: Date = new Date(value);

        return isNaN(date.getTime())
            ? undefined
            : date;
    }

    public getNewType(value: AxisType) {
        return this.getNewComplexValue(value, typeOptions)
    }
    
    public setLocalizedDisplayName(localizationManager: ILocalizationManager) {
        super.setLocalizedDisplayName(localizationManager);
        typeOptions.forEach(option => {
            option.displayName = localizationManager.getDisplayName(option.displayNameKey)
        })
    }
}
