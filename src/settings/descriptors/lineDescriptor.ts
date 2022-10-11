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
import { dataViewWildcard } from "powerbi-visuals-utils-dataviewutils";
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import { SimpleSlice } from "powerbi-visuals-utils-formattingmodel/lib/FormattingSettingsComponents";
import { LineDataPoint } from "../../converter/dataConverter";
import { BaseDescriptor } from "./baseDescriptor";

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

export interface SimpleLineSetting {
    fillColor: string;
    shouldMatchKpiColor: boolean;
    dataPointStartsKpiColorSegment: boolean;
    lineStyle: LineStyle;
    thickness: number;
    interpolation: LineInterpolation;
    lineType: LineType;
    rawOpacity: number;
    rawAreaOpacity: number;
    interpolationWithColorizedLine: LineInterpolation;
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
        return this.convertOpacityToCssFormat(this.getCurrentSettings(containerName).rawOpacity);
    }

    public getAreaOpacity(containerName: string): number {
        return this.convertOpacityToCssFormat(this.getCurrentSettings(containerName).rawAreaOpacity);
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
        name: "rawAreaOpacity",
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

    public interpolationWithColorizedLine = new formattingSettings.ItemDropdown({
        name: `interpolationWithColorizedLine`,
        displayName: "Interpolation",
        items: interpolationWithColorizedLineOptions,
        value: interpolationWithColorizedLineOptions[0]
    });

    public container: formattingSettings.Container = {
        containerItems: [{
            displayName: "[ALL]",
            slices: [
                this.fillColor, 
                this.shouldMatchKpiColor, 
                this.dataPointStartsKpiColorSegment, 
                this.lineType, 
                this.thickness, 
                this.rawOpacity, 
                this.rawAreaOpacity, 
                this.lineStyle, 
                this.interpolation,
                this.interpolationWithColorizedLine
            ]
        }]
    };

    private containerItemName = {
        "default": "[ALL]"
    }

    constructor() {
        super()

        this.slices = undefined
        this.name = "line"
        this.displayName = "Line"
    }

    public convertOpacityToCssFormat(opacity: number): number {
        return opacity / 100;
    }

    public getInterpolation(containerName: string): LineInterpolation {
        const {
            shouldMatchKpiColor, 
            interpolationWithColorizedLine, 
            interpolation
        } = this.getCurrentSettings(containerName)

        return (shouldMatchKpiColor 
            ? interpolationWithColorizedLine 
            : interpolation) as LineInterpolation;
    }

    public populateContainer(dataPoint: LineDataPoint) {
        const { containerName, containerGroupName } = dataPoint
        let existingContainer = this.getCurrentSettings(containerGroupName) 

        if(Object.keys(existingContainer).length) {
            if(this.containerItemName[containerName] === undefined) {
                this.containerItemName[containerName] = containerGroupName
            }
            return existingContainer
        }

        let defaultContainerSlices = this.container.containerItems[0].slices;
        if(containerGroupName !== undefined){
            this.containerItemName[containerName] = containerGroupName
        }
        let containerItem: formattingSettings.ContainerItem = {
            displayName: containerGroupName ?? containerName,
            slices: []
        }

        defaultContainerSlices.forEach(slice => {
            let clonedSlice: formattingSettings.SimpleSlice = Object.create(slice);
            clonedSlice.value = dataPoint[slice.name] ? dataPoint[slice.name] : clonedSlice.value;
            containerItem.slices.push(clonedSlice);
        });

        this.container.containerItems.push(containerItem);
        return this.getCurrentSettings(containerName)
    }

    public getCurrentSettings(containerName: string): SimpleLineSetting {
        const currentContainerName = this.containerItemName[containerName] ?? containerName
        const currentContainer = this.container.containerItems.filter(el => el.displayName === currentContainerName)[0];

        let currentLineSettings = {}
        if(currentContainer){
            currentContainer.slices.forEach(slice => currentLineSettings[slice.name] = this.getSliceValue(slice as SimpleSlice))
        }
        return currentLineSettings as SimpleLineSetting
    }

    private getSliceValue(slice: SimpleSlice) {
        return slice?.value?.value != undefined ? slice.value.value : slice.value
    }
}
