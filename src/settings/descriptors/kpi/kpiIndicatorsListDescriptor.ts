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
import { IDescriptor } from "../baseDescriptor";

enum PropertyType {
    ColorPicker,
    DropDown,
    NumUpDown
}

enum ShapeType {
    CircleFull = "circle-full",
    Triangle = "triangle",
    Rhombus = "rhombus",
    Square = "square",
    Flag = "flag",
    Exclamation = "exclamation",
    Checkmark = "checkmark",
    ArrowUp = "arrow-up",
    ArrowRightUp = "arrow-right-up",
    ArrowRightDown = "arrow-right-down",
    ArrowDown = "arrow-down",
    CaretUp = "caret-up",
    CaretDown = "caret-down",
    CircleEmpty = "circle-empty",
    CircleX = "circle-x",
    CircleExclamation = "circle-exclamation",
    CircleCheckmark = "circle-checkmark",
    X = "x",
    StarEmpty = "star-empty",
    StarFull = "star-full"
}

enum DefaultColor {
    Green = "#01b7a8",
    Yellow = "#f2c80f",
    Red = "#fd625e",
    Purple = "#a66999",
    Black = "#374649",
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
            value: {
                value: null,
                displayName: "default"
            }
        },
    };

    private kpiIndexPropertyName: string = "kpiIndex";

    private _colors: DefaultColor[] = [
        DefaultColor.Green,
        DefaultColor.Yellow,
        DefaultColor.Red,
        DefaultColor.Purple,
        DefaultColor.Black,
    ];

    private _shapes: powerbi.IEnumMember[] = [
        { value: ShapeType.CircleFull, displayName: "Circle" },
        { value: ShapeType.Triangle, displayName: "Triangle" },
        { value: ShapeType.Rhombus, displayName: "Diamond" },
        { value: ShapeType.Square, displayName: "Square" },
        { value: ShapeType.Flag, displayName: "Flag" },
        { value: ShapeType.Exclamation, displayName: "Exclamation" },
        { value: ShapeType.Checkmark, displayName: "Checkmark" },
        { value: ShapeType.ArrowUp, displayName: "Arrow Up" },
        { value: ShapeType.ArrowRightUp, displayName: "Arrow Right Up" },
        { value: ShapeType.ArrowRightDown, displayName: "Arrow Right Down" },
        { value: ShapeType.ArrowDown, displayName: "Arrow Down" },
        { value: ShapeType.CaretUp, displayName: "Caret Up" },
        { value: ShapeType.CaretDown, displayName: "Caret Down" },
        { value: ShapeType.CircleEmpty, displayName: "Circle Empty" },
        { value: ShapeType.CircleX, displayName: "Circle X" },
        { value: ShapeType.CircleExclamation, displayName: "Circle Exclamation" },
        { value: ShapeType.CircleCheckmark, displayName: "Circle Checkmark" },
        { value: ShapeType.X, displayName: "X" },
        { value: ShapeType.StarEmpty, displayName: "Star Empty" },
        { value: ShapeType.StarFull, displayName: "Star Full" },
    ];

    private _properties: IPropertyConfiguration[] = [
        {
            type: PropertyType.ColorPicker,
            defaultValue: (index: number) => {
                const color: DefaultColor = this.getElementByIndex<DefaultColor>(this._colors, index);

                return {
                    value: color || this._colors[0]
                }
            },
            name: "color",
        },
        {
            type: PropertyType.DropDown,
            defaultValue: (index: number) => {
                const shape: powerbi.IEnumMember =
                    this.getElementByIndex<powerbi.IEnumMember>(this._shapes, index);

                return shape ? shape : this._shapes.filter(el => el.value === ShapeType.CircleFull)[0];
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


        this.show.value = true;
        this.font.fontSize.value = 12;

        this.slices = this.getContextProperties();
        this.name = "kpiIndicator"
        this.displayName = "KPI Indicator"
    }

    public getElementByIndex<T>(setOfValues: T[], index: number): T {
        const amountOfValues: number = setOfValues.length;

        const currentIndex: number = index < amountOfValues
            ? index
            : Math.round(index / amountOfValues);

        return setOfValues[currentIndex];
    }

    public getCurrentKPI(kpiIndex: number): IKPIIndicatorSettings {
        if (!isNaN(kpiIndex) && kpiIndex !== null) {
            for (let index: number = 0; index < this._maxAmountOfKPIs; index++) {
                const currentKPI: formattingSettings.NumUpDown  = this[this.getPropertyName(this.kpiIndexPropertyName, index)];

                if (currentKPI.value === kpiIndex) {
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
        return this._default;
    }

    public getContextProperties() {
        let newSlices = [...this.defaultSlices]
        for (let index: number = 0; index < this._maxAmountOfKPIs; index++) {
            this._properties.forEach((property: IPropertyConfiguration) => {
                const indexedName: string = this.getPropertyName(property.name, index);

                if(this[indexedName] === undefined){
                    this[indexedName] = this.getProperty(property, indexedName, index, property.defaultValue(index));
                }
                newSlices.push(this[indexedName]);
            });
        }
        return newSlices
    }

    private getProperty(currentProperty: IPropertyConfiguration, name: string, index: number, value: any) {
        switch(currentProperty.type){ 
            case PropertyType.ColorPicker: {
                return new formattingSettings.ColorPicker({
                    name,
                    displayName: `KPI ${index + 1}`,
                    value
                });
            } case PropertyType.DropDown: {
                return new formattingSettings.ItemDropdown({
                    name,
                    displayName: "    Indicator",
                    value,
                    items: currentProperty.items
                });
            } case PropertyType.NumUpDown: {
                return new formattingSettings.NumUpDown({
                    name,
                    displayName: "    Value",
                    value
                });
            }
        }
    }

    private getPropertyName(name: string, index: number): string {
        return `${name}_${index}`;
    }
}
