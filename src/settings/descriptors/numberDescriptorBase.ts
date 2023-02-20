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

import { IDescriptor } from "./baseDescriptor";

import { FontSizeDescriptor } from "./autoHiding/fontSizeDescriptor";

import {
    DataRepresentationTypeEnum,
} from "../../dataRepresentation/dataRepresentationType";

export enum DisplayUnitsType {
    Auto = 0,
    None = 1,
    Thousands = 1000,
    Millions = 1000000,
    Billions = 1000000000,
    Trillions = 1000000000000
}

export const displayUnitsOptions = [
    {
        value: DisplayUnitsType.Auto,
        displayName: "Visual_Auto"
    },
    {
        value: DisplayUnitsType.None,
        displayName: "Visual_None"
    },
    {
        value: DisplayUnitsType.Thousands,
        displayName: "Visual_Thousands"
    },
    {
        value: DisplayUnitsType.Millions,
        displayName: "Visual_Millions"
    },
    {
        value: DisplayUnitsType.Billions,
        displayName: "Visual_Billions"
    },
    {
        value: DisplayUnitsType.Trillions,
        displayName: "Visual_Trillions"
    }
]
export class NumberDescriptorBase
    extends FontSizeDescriptor
    implements IDescriptor {

    public defaultFormat: string = null;
    public columnFormat: string = null;

    public displayUnits = new formattingSettings.ItemDropdown({
        name: "displayUnits",
        displayNameKey: "Visual_Display_Units",
        items: displayUnitsOptions,
        value: this.getNewDisplayUnitsValue(DisplayUnitsType.Auto)
    });

    public percentile = new formattingSettings.Slider({
        name: "percentile",
        displayNameKey: "Visual_Label_Density",
        value: 100,
        options: {
            maxValue: {
                type: powerbi.visuals.ValidatorType.Max,
                value: 100,
            }
        }
    });

    public format = new formattingSettings.TextInput({
        name: "format",
        displayNameKey: "Visual_Format",
        value: this.defaultFormat,
        placeholder: ""
    });

    protected minPrecision: number = 0;
    protected maxPrecision: number = 17;
    public precision = new formattingSettings.NumUpDown({
        name: "precision",
        displayNameKey: "Visual_Decimal_Places",
        value: null,
        options: {
            minValue: {
                type: powerbi.visuals.ValidatorType.Min,
                value: this.minPrecision,
            },
            maxValue: {
                type: powerbi.visuals.ValidatorType.Max,
                value: this.maxPrecision,
            },
        }
    }); // precision = -21 in tooltips

    public shouldNumericPropertiesBeHiddenByType: boolean;

    constructor(viewport?: powerbi.IViewport, shouldPropertiesBeHiddenByType: boolean = false) {
        super(viewport);

        this.shouldNumericPropertiesBeHiddenByType = shouldPropertiesBeHiddenByType;
    }

    public getFormat(): string {
        return this.format.value || this.columnFormat || this.defaultFormat;
    }

    public setColumnFormat(format: string) {
        if (!format) {
            return;
        }
        this.columnFormat = format;
    }
    
    public applyDefaultFormatByType(type: DataRepresentationTypeEnum): void {
        if (this.defaultFormat) {
            if (this.format.value == null) {
                this.format.value = this.defaultFormat;
            }
            return;
        }

        switch (type) {
            case DataRepresentationTypeEnum.DateType: {
                this.defaultFormat = "%M/%d/yyyy";

                if (this.format.value == null) {
                    this.format.value = this.defaultFormat;
                }

                break;
            }
            case DataRepresentationTypeEnum.NumberType: {
                this.defaultFormat = "#,0.00";

                break;
            }
            default: {
                this.defaultFormat = undefined;
            }
        }
    }

    public getNewDisplayUnitsValue(value: DisplayUnitsType) {
        return this.getNewComplexValue(value, displayUnitsOptions)
    }

    public setLocalizedDisplayName(localizationManager: ILocalizationManager) {
        super.setLocalizedDisplayName(localizationManager);
        displayUnitsOptions.forEach(option => {
            option.displayName = localizationManager.getDisplayName(option.displayName)
        })
    }
}
