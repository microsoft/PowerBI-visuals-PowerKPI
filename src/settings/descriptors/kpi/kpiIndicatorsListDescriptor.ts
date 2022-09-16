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

import { HorizontalLayoutEnum } from "../../../layout/horizontalLayoutEnum";

import { FontSizeDescriptor } from "../autoHiding/fontSizeDescriptor";
import { IDescriptor } from "../descriptor";

enum PropertyType {
    ColorPicker,
    DropDown,
    NumUpDown
}

interface IPropertyConfiguration {
    type: PropertyType;
    name: string;
    defaultValue: (index: number) => any;
    items?: powerbi.IEnumMember[];
}

export interface IKPIIndicatorSettings { // This should be synchronized with _properties
    color?: formattingSettings.ColorPicker;
    shape?: formattingSettings.ItemDropdown;
}

const positionOptions = [
    {
        value: HorizontalLayoutEnum.Left,
        displayName: "Left"
      },
      {
        value: HorizontalLayoutEnum.Right,
        displayName: "Right"
      }
]
export class KPIIndicatorsListDescriptor extends FontSizeDescriptor implements IDescriptor {
    public position = new formattingSettings.ItemDropdown({
        name: "position",
        displayName: "Position",
        value: positionOptions[0],
        items: positionOptions
    });

    public shouldBackgroundColorMatchKpiColor = new formattingSettings.ToggleSwitch({
        name: "shouldBackgroundColorMatchKpiColor",
        displayName: "Background Match KPI Color",
        value: false
    });

    private defaultSlices = [this.show, this.font, this.position, this.shouldBackgroundColorMatchKpiColor]
    private _maxAmountOfKPIs: number = 5;

    private _default: IKPIIndicatorSettings = {
        color: {
            name: "default",
            displayName: "default",
            value : {value: null}
        },
        shape: {
            name: "default",
            displayName: "default",
            items: [],
            value: null
        },
    };

    private kpiIndexPropertyName: string = "kpiIndex";

    private _colors: string[] = [
        "#01b7a8",
        "#f2c80f",
        "#fd625e",
        "#a66999",
        "#374649",
    ];

    private _shapes: powerbi.IEnumMember[] = [
        { value: "circle-full", displayName: "Circle" },
        { value: "triangle", displayName: "Triangle" },
        { value: "rhombus", displayName: "Diamond" },
        { value: "square", displayName: "Square" },
        { value: "flag", displayName: "Flag" },
        { value: "exclamation", displayName: "Exclamation" },
        { value: "checkmark", displayName: "Checkmark" },
        { value: "arrow-up", displayName: "Arrow Up" },
        { value: "arrow-right-up", displayName: "Arrow Right Up" },
        { value: "arrow-right-down", displayName: "Arrow Right Down" },
        { value: "arrow-down", displayName: "Arrow Down" },
        { value: "caret-up", displayName: "Caret Up" },
        { value: "caret-down", displayName: "Caret Down" },
        { value: "circle-empty", displayName: "Circle Empty" },
        { value: "circle-x", displayName: "Circle X" },
        { value: "circle-exclamation", displayName: "Circle Exclamation" },
        { value: "circle-checkmark", displayName: "Circle Checkmark" },
        { value: "x", displayName: "X" },
        { value: "star-empty", displayName: "Star Empty" },
        { value: "star-full", displayName: "Star Full" },
    ];

    private _properties: IPropertyConfiguration[] = [
        {
            type: PropertyType.ColorPicker,
            defaultValue: (index: number) => {
                const color: string = this.getElementByIndex<string>(this._colors, index);

                return {
                    value :color || this._colors[0]
                }
            },
            name: "color",
        },
        {
            type: PropertyType.DropDown,
            defaultValue: (index: number) => {
                const shape: powerbi.IEnumMember =
                    this.getElementByIndex<powerbi.IEnumMember>(this._shapes, index);

                return shape ? shape : this._shapes[0];
            },
            name: "shape",
            items: this._shapes
        },
        {
            type: PropertyType.NumUpDown,
            defaultValue: (index: number) => index + 1,
            name: this.kpiIndexPropertyName,
        },
    ];

    constructor(viewport?: powerbi.IViewport) {
        super(viewport);


        this.name = "kpiIndicator"
        this.displayName = "KPI Indicator"
        this.show.value = true;
        this.font.fontSize.value = 12;
        this.slices = this.getContextProperties();
    }

    public getElementByIndex<T>(setOfValues: T[], index: number): T {
        const amountOfValues: number = setOfValues.length;

        const currentIndex: number = index < amountOfValues
            ? index
            : Math.round(index / amountOfValues);

        return setOfValues[currentIndex];
    }

    public getCurrentKPI(kpiIndex: number): IKPIIndicatorSettings {
        if (isNaN(kpiIndex) || kpiIndex === null) {
            return this._default;
        }

        for (let index: number = 0; index < this._maxAmountOfKPIs; index++) {
            const currentKPIIndex: number = this[this.getPropertyName(this.kpiIndexPropertyName, index)];

            if (currentKPIIndex === kpiIndex) {
                return this._properties.reduce((
                    current: IKPIIndicatorSettings,
                    property: IPropertyConfiguration,
                ) => {
                    const indexedName: string = this.getPropertyName(property.name, index);
                    current[property.name] = this[indexedName];

                    return current;
                }, {});
            }
        }
    }

    public getContextProperties() {
        let newSlices = this.defaultSlices
        for (let index: number = 0; index < this._maxAmountOfKPIs; index++) {
            this._properties.forEach((property: IPropertyConfiguration) => {
                const indexedName: string = this.getPropertyName(property.name, index);

                this[indexedName] = this.getProperty(property, indexedName, index)
                newSlices.push(this[indexedName])
            });
        }
        return newSlices
    }

    private getProperty(currentProperty: IPropertyConfiguration, indexedName: string, index: number){
        switch(currentProperty.type){ 
            case PropertyType.ColorPicker: {
                return new formattingSettings.ColorPicker({
                    name: indexedName,
                    displayName: `KPI ${index + 1}`,
                    value: currentProperty.defaultValue(index)
                });
            } case PropertyType.DropDown: {
                return new formattingSettings.ItemDropdown({
                    name: indexedName,
                    displayName: "    Indicator",
                    value: currentProperty.defaultValue(index),
                    items: currentProperty.items
                });
            } case PropertyType.NumUpDown: {
                return new formattingSettings.NumUpDown({
                    name: indexedName,
                    displayName: "    Value",
                    value: currentProperty.defaultValue(index)
                });
            }
        }
    }

    private getPropertyName(name: string, index: number): string {
        return `${name}_${index}`;
    }
}
