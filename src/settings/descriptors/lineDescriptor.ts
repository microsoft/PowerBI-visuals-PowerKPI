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
import {
    BaseDescriptor,
    IDescriptor,
    IDescriptorParserOptions,
} from "./descriptor";

export enum LineInterpolation {
    linear = "linear",
    stepBefore = "step-before",
    stepAfter = "step-after",
    basis = "basis",
    basisOpen = "basis-open",
    basisClosed = "basis-closed",
    cardinal = "cardinal",
    cardinalOpen = "cardinal-open",
    cardinalClosed = "cardinal-closed",
    monotone = "monotone",
}

export enum LineStyle {
    solidLine = "solidLine",
    dottedLine = "dottedLine",
    dashedLine = "dashedLine",
    dotDashedLine = "dotDashedLine",
}

export enum LineType {
    line = "line",
    area = "area",
    column = "column",
}

export interface ILineDescriptorBase {
    fillColor: formattingSettings.ColorPicker;
    shouldMatchKpiColor: formattingSettings.ToggleSwitch;
    dataPointStartsKpiColorSegment: formattingSettings.ToggleSwitch;
    lineStyle: formattingSettings.ItemDropdown;
    thickness: formattingSettings.Slider;
    interpolation: formattingSettings.ItemDropdown;
}

export interface ILineDescriptor extends ILineDescriptorBase {
    lineType: formattingSettings.ItemDropdown;
    rawOpacity: formattingSettings.NumUpDown;
    rawAreaOpacity: formattingSettings.NumUpDown;
    interpolationWithColorizedLine: formattingSettings.ItemDropdown;
}

export const lineStyleOptions: powerbi.IEnumMember[] = [
    {
        value: LineStyle.solidLine,
        displayName: "Solid"
    },
    {
        value: LineStyle.dottedLine,
        displayName: "Dotted"
    },
    {
        value: LineStyle.dashedLine,
        displayName: "Dashed"
    },
    {
        value: LineStyle.dotDashedLine,
        displayName: "Dot-dashed"
    }
]

const interpolationWithColorizedLineOptions = [
    {
      value: LineInterpolation.linear,
      displayName: "Linear"
    },
    {
      value: LineInterpolation.stepBefore,
      displayName: "Step-before"
    },
    {
      value: LineInterpolation.stepAfter,
      displayName: "Step-after"
    }
]

enum PropertyType {
    ColorPicker,
    ToggleSwitch,
    DropDown,
    NumUpDown,
    Slider
}

interface IPropertyConfiguration {
    type: PropertyType;
    name: string;
    displayName: string;
    defaultValue: any;
    items?: powerbi.IEnumMember[];
    options?: powerbi.visuals.NumUpDownFormat;
}

const lineTypeOptions: powerbi.IEnumMember[] = [
    {
        value: LineType.line,
        displayName: "Line"
    },
    {
        value: LineType.area,
        displayName: "Area"
    }
]

const interpolationOptions: powerbi.IEnumMember[] = [
    {
        value: LineInterpolation.linear,
        displayName: "Linear"
    },
    {
        value: LineInterpolation.stepBefore,
        displayName: "Step-before"
    },
    {
        value: LineInterpolation.stepAfter,
        displayName: "Step-after"
    },
    {
        value: LineInterpolation.basis,
        displayName: "Basis"
    },
    {
        value: LineInterpolation.basisOpen,
        displayName: "Basis-open"
    },
    {
        value: LineInterpolation.basisClosed,
        displayName: "Basis-closed"
    },
    {
        value: LineInterpolation.cardinal,
        displayName: "Cardinal"
    },
    {
        value: LineInterpolation.cardinalOpen,
        displayName: "Cardinal-open"
    },
    {
        value: LineInterpolation.cardinalClosed,
        displayName: "Cardinal-closed"
    },
    {
        value: LineInterpolation.monotone,
        displayName: "Monotone"
    }
]

export class LineDescriptor
    extends BaseDescriptor {

    public getOpacity(containerName: string): number {
        return this.convertOpacityToCssFormat(this[containerName].rawOpacity.value);
    }

    public getAreaOpacity(containerName: string): number {
        return this.convertOpacityToCssFormat(this[containerName].rawAreaOpacity.value);
    }

    private minThickness: number = 0.25;
    private maxThickness: number = 10;

    private minOpacity: number = 15;
    private maxOpacity: number = 100;

    private defaultSlices: IPropertyConfiguration[] = [
        {
            name: `fillColor`,
            displayName: "Color",
            type: PropertyType.ColorPicker,
            defaultValue: { value: null }
        },
        {
            name: `shouldMatchKpiColor`,
            displayName: "Match KPI Color",
            type: PropertyType.ToggleSwitch,
            defaultValue: false
        },
        {
            name: `dataPointStartsKpiColorSegment`,
            displayName: "Data Point Starts KPI Color Segment",
            type: PropertyType.ToggleSwitch,
            defaultValue: true
        },
        {
            name: `lineType`,
            displayName: "Type",
            type: PropertyType.DropDown,
            defaultValue: lineTypeOptions[0],
            items: lineTypeOptions
        },
        {
            name: `thickness`,
            displayName: "Thickness",
            type: PropertyType.Slider,
            defaultValue: 2,
            options: {
                minValue: {
                    type: powerbi.visuals.ValidatorType.Min,
                    value: this.minThickness,
                },
                maxValue: {
                    type: powerbi.visuals.ValidatorType.Max,
                    value: this.maxThickness,
                }
            }
        },
        {
            name: `rawOpacity`,
            displayName: "Opacity",
            type: PropertyType.NumUpDown,
            defaultValue: 100,
            options: {
                minValue: {
                    type: powerbi.visuals.ValidatorType.Min,
                    value: this.minOpacity,
                },
                maxValue: {
                    type: powerbi.visuals.ValidatorType.Max,
                    value: this.maxOpacity,
                }
            }
        },
        {
            name: `rawAreaOpacity`,
            displayName: "Area Opacity",
            type: PropertyType.NumUpDown,
            defaultValue: 50,
            options: {
                minValue: {
                    type: powerbi.visuals.ValidatorType.Min,
                    value: this.minOpacity,
                },
                maxValue: {
                    type: powerbi.visuals.ValidatorType.Max,
                    value: this.maxOpacity,
                }
            }
        },
        {
            name: `lineStyle`,
            displayName: "Style",
            type: PropertyType.DropDown,
            defaultValue: lineStyleOptions[0],
            items: lineStyleOptions
        },
        {
            name: `interpolation`,
            displayName: "Interpolation",
            type: PropertyType.DropDown,
            defaultValue: interpolationOptions[0],
            items: interpolationOptions
        },
        {
            name: `interpolationWithColorizedLine`,
            displayName: "Interpolation",
            type: PropertyType.DropDown,
            defaultValue: interpolationWithColorizedLineOptions[0],
            items: interpolationWithColorizedLineOptions
        },
    ]

    public container: formattingSettings.Container = {
        containerItems: [{
            displayName: "[ALL]",
            slices: this.generateProperties("[ALL]")
        }]
    };

    constructor() {
        super()

        this.name = "line"
        this.displayName = "Line"
        this.slices = undefined
    }

    public convertOpacityToCssFormat(opacity: number): number {
        return opacity / 100;
    }

    public getInterpolation(containerName: string): LineInterpolation {
        const {
            shouldMatchKpiColor, 
            interpolationWithColorizedLine, 
            interpolation
        } = this[containerName] as ILineDescriptor

        return (shouldMatchKpiColor.value 
            ? interpolationWithColorizedLine.value?.value 
            : interpolation.value?.value) as LineInterpolation;
    }

    public addContainerItem(displayName: string){
        this.container.containerItems.push({
            displayName,
            slices: this.generateProperties(displayName)
        })
    }

    private generateProperties(containerName: string) {
        const globalThis = this

        if(this[containerName] == undefined){
            this[containerName] = {}
        }
        return this.defaultSlices.map(slice => {
            const { displayName, defaultValue: value, items, options, name } = slice

            let newProperty;
            switch(slice.type){ 
                case PropertyType.ColorPicker: {
                    newProperty = new formattingSettings.ColorPicker({
                        name,
                        displayName,
                        value
                    });
                    break;
                } case PropertyType.ToggleSwitch: {
                    newProperty = new formattingSettings.ToggleSwitch({
                        name,
                        displayName,
                        value,
                    });
                    break;
                } case PropertyType.DropDown: {
                    newProperty = new formattingSettings.ItemDropdown({
                        name,
                        displayName,
                        value,
                        items
                    });
                    break;
                } case PropertyType.NumUpDown: {
                    newProperty = new formattingSettings.NumUpDown({
                        name,
                        displayName,
                        value,
                        options
                    });
                    break;
                } case PropertyType.Slider: {
                    newProperty = new formattingSettings.Slider({
                        name,
                        displayName,
                        value,
                        options
                    });
                    break;
                }
            }
            globalThis[containerName][name] = newProperty
            return newProperty
        })
    }
}
