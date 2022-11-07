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
import IColorPalette = powerbi.extensibility.IColorPalette;
import DataViewObjects = powerbi.DataViewObjects
import IEnumMember = powerbi.IEnumMember

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import ContainerItem = formattingSettings.ContainerItem;
import Container = formattingSettings.Container;
import SimpleSlice = formattingSettings.SimpleSlice;
import ToggleSwitch = formattingSettings.ToggleSwitch;
import ColorPicker = formattingSettings.ColorPicker;
import ItemDropdown = formattingSettings.ItemDropdown;
import Slider = formattingSettings.Slider;
import NumUpDown = formattingSettings.NumUpDown;

import { LineDataPoint } from "../../../converter/dataConverter";
import { BaseDescriptor } from "../baseDescriptor";
import { LineStyle, LineType, LineInterpolation, SimpleLineSetting } from "./lineTypes"

const lineStyleOptions: IEnumMember[] = [
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

const interpolationWithColorizedLineOptions: IEnumMember[] = [
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

const lineTypeOptions: IEnumMember[] = [
    {
        value: LineType.line,
        displayName: "Line"
    },
    {
        value: LineType.area,
        displayName: "Area"
    }
]

const interpolationOptions: IEnumMember[] = [
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

export class LineDescriptor extends BaseDescriptor {

    public fillColor = new ColorPicker({
        name: "fillColor",
        displayName: "Color",
        value: { value: null }
    });

    public shouldMatchKpiColor = new ToggleSwitch({
        name: "shouldMatchKpiColor",
        displayName: "Match KPI Color",
        value: false
    });

    public dataPointStartsKpiColorSegment = new ToggleSwitch({
        name: "dataPointStartsKpiColorSegment",
        displayName: "Data Point Starts KPI Color Segment",
        value: true
    });

    public lineType = new ItemDropdown({
        name: "lineType",
        displayName: "Type",
        items: lineTypeOptions,
        value: lineTypeOptions[0]
    });

    private minThickness: number = 0.25;
    private maxThickness: number = 10;
    public thickness = new Slider({
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
    public rawOpacity = new NumUpDown({
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

    public rawAreaOpacity = new NumUpDown({
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

    public lineStyle = new ItemDropdown({
        name: "lineStyle",
        displayName: "Style",
        items: lineStyleOptions,
        value: lineStyleOptions[0]
    });

    public interpolation = new ItemDropdown({
        name: "interpolation",
        displayName: "Interpolation",
        items: interpolationOptions,
        value: interpolationOptions[0]
    });

    public interpolationWithColorizedLine = new ItemDropdown({
        name: `interpolationWithColorizedLine`,
        displayName: "Interpolation",
        items: interpolationWithColorizedLineOptions,
        value: interpolationWithColorizedLineOptions[0]
    });

    public defaultSlices = [
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

    public container: Container = {
        containerItems: [{
            displayName: "[ALL]",
            slices: [...this.defaultSlices]
        }]
    };

    constructor() {
        super()

        this.slices = undefined
        this.name = "line"
        this.displayName = "Line"
    }

    public populateContainer(dataPoint: LineDataPoint, colorPalette: IColorPalette) {
        const { containerName, selectionId, objects } = dataPoint
        const existingContainer = this.getCurrentSettings(containerName)
        if(Object.keys(existingContainer).length) {
            return existingContainer
        }

        const containerItem: ContainerItem = {
            displayName: containerName,
            slices: []
        }
        // color by index of container
        const seriesColor = colorPalette.getColor(`${this.container.containerItems.length}`).value
        const sliceValues = this.parseContainer(objects, seriesColor)

        // cloning all slices
        this.defaultSlices.forEach(slice => {
            let clonedSlice = Object.create(slice);
            if(sliceValues[slice.name] !== undefined) {
                clonedSlice.value = clonedSlice.value.value !== undefined 
                    ? this.getNewComplexValue(sliceValues[slice.name], clonedSlice.items) 
                    : sliceValues[slice.name]
            }
            clonedSlice.selector = selectionId;
            containerItem.slices.push(clonedSlice);
        });
        this.container.containerItems.push(containerItem);

        return this.getCurrentSettings(containerName)
    }

    public parseContainer(objects: DataViewObjects, defaultColor: string) {
        const lineObject = objects?.line as any || {};
        // `userGeneralColor` is manually set color for all lines
        const { lineStyle, thickness, fillColor: userGeneralColor } = this.getCurrentSettings("[ALL]")

        const oldAPIColor: string = this.getColorFromOldAPI(objects?.series?.fillColor)
        const userColor: string | undefined = lineObject.fillColor?.solid?.color // maunally set color for current line
        lineObject.fillColor = userColor || oldAPIColor || userGeneralColor || defaultColor;

        const newLineStyle = objects?.lineStyle?.lineStyle || lineStyle
        if (!lineObject.lineStyle) {
            lineObject.lineStyle = newLineStyle;
        }

        const newThickness = objects?.lineThickness?.thickness || thickness
        if (!lineObject.thickness) {
            lineObject.thickness = newThickness;
        }

        return lineObject
    }

    public getCurrentSettings(containerName: string): SimpleLineSetting {
        const currentContainer = this.container.containerItems.filter(el => el.displayName === containerName)[0];

        let interpolationWithColorizedLine;
        let currentLineSettings: SimpleLineSetting = {} as SimpleLineSetting
        if(currentContainer){
            currentContainer.slices.forEach((slice: SimpleSlice) => {
                switch (slice.name) {
                    case "rawOpacity":
                        currentLineSettings.opacity = this.getConvertedOpacity(this.getSliceValue(slice))
                        break;
                    case "rawAreaOpacity":
                        currentLineSettings.areaOpacity = this.getConvertedOpacity(this.getSliceValue(slice))
                        break;
                    case "interpolationWithColorizedLine":
                        interpolationWithColorizedLine = this.getSliceValue(slice)
                        break;
                    default:
                        currentLineSettings[slice.name] = this.getSliceValue(slice)
                        break;
                }
            })
            if(currentLineSettings.shouldMatchKpiColor){
                currentLineSettings.interpolation = interpolationWithColorizedLine
            }
        }
        return currentLineSettings
    }

    private getSliceValue(slice: SimpleSlice) {
        return slice?.value?.value !== undefined ? slice.value.value : slice.value
    }

    private getConvertedOpacity(opacity: number): number {
        return opacity / 100;
    }

    private getColorFromOldAPI(fillColor) {
        return ((fillColor as any)?.solid?.color || fillColor) as string
    }
}
