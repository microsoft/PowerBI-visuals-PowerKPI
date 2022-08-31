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
    lineType: formattingSettings.ItemDropdown;
    lineStyle: formattingSettings.ItemDropdown;
    thickness: formattingSettings.Slider;
    interpolation: formattingSettings.ItemDropdown;
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
    extends BaseDescriptor
    implements ILineDescriptorBase {

    public get opacity(): number {
        return this.convertOpacityToCssFormat(this.rawOpacity.value);
    }

    public get areaOpacity(): number {
        return this.convertOpacityToCssFormat(this.rawAreaOpacity.value);
    }

    public fillColor = new formattingSettings.ColorPicker({
        name: "fillColor",
        displayName: "Color",
        value: { value: null }
    });

    public shouldMatchKpiColor = new formattingSettings.ToggleSwitch({
        name: "shouldMatchKpiColor",
        displayName: "Match KPI Color",
        value: false
    });

    public dataPointStartsKpiColorSegment = new formattingSettings.ToggleSwitch({
        name: "dataPointStartsKpiColorSegment",
        displayName: "Data Point Starts KPI Color Segment",
        value: true
    });

    public lineType = new formattingSettings.ItemDropdown({
        name: "lineType",
        displayName: "Type",
        items: lineTypeOptions,
        value: lineTypeOptions[0]
    });

    private minThickness: number = 0.25;
    private maxThickness: number = 10;
    public thickness = new formattingSettings.Slider({
        name: "thickness",
        displayName: "Thickness",
        value: 2,
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
    });

    private minOpacity: number = 15;
    private maxOpacity: number = 100;
    public rawOpacity = new formattingSettings.NumUpDown({
        name: "rawOpacity",
        displayName: "Opacity",
        value: 100,
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
    });

    public rawAreaOpacity = new formattingSettings.NumUpDown({
        name: "areaOpacity",
        displayName: "Area Opacity",
        value: 50,
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
    });

    public lineStyle = new formattingSettings.ItemDropdown({
        name: "lineStyle",
        displayName: "Style",
        items: lineStyleOptions,
        value: lineStyleOptions[0]
    });

    public interpolation = new formattingSettings.ItemDropdown({
        name: "interpolation",
        displayName: "Interpolation",
        items: interpolationOptions,
        value: interpolationOptions[0]
    });
    public interpolationWithColorizedLine: LineInterpolation = LineInterpolation.linear;

    constructor() {
        super()

        this.name = "line"
        this.displayName = "Line"
        this.slices = [
            this.fillColor, 
            this.shouldMatchKpiColor, 
            this.dataPointStartsKpiColorSegment, 
            this.lineType, 
            this.thickness, 
            this.rawOpacity, 
            this.rawAreaOpacity, 
            this.lineStyle, 
            this.interpolation
        ]
    }

    public convertOpacityToCssFormat(opacity: number): number {
        return opacity / 100;
    }

    public getInterpolation(): LineInterpolation {
        return this.shouldMatchKpiColor.value
            ? this.interpolationWithColorizedLine
            : this.interpolation.value.value as LineInterpolation;
    }
}
