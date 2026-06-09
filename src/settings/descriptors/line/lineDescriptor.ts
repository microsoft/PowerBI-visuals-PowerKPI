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
import DataViewObjects = powerbi.DataViewObjects


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
import { LineStyle, LineType, LineInterpolation, LineColorMode, SimpleLineSetting } from "./lineTypes"

const lineStyleOptions = [
    {
        value: LineStyle.solidLine,
        displayName: "Solid",
        displayNameKey: "Visual_Solid"
    },
    {
        value: LineStyle.dottedLine,
        displayName: "Dotted",
        displayNameKey: "Visual_Dotted"
    },
    {
        value: LineStyle.dashedLine,
        displayName: "Dashed",
        displayNameKey: "Visual_Dashed"
    },
    {
        value: LineStyle.dotDashedLine,
        displayName: "Dot-dashed",
        displayNameKey: "Visual_Dot-dashed"
    }
]

const interpolationWithColorizedLineOptions = [
    {
      value: LineInterpolation.linear,
      displayName: "Linear",
      displayNameKey: "Visual_Linear"
    },
    {
      value: LineInterpolation.stepBefore,
      displayName: "Step-before",
      displayNameKey: "Visual_Step-before"
    },
    {
      value: LineInterpolation.stepAfter,
      displayName: "Step-after",
      displayNameKey: "Visual_Step-after"
    }
]

const lineTypeOptions = [
    {
        value: LineType.line,
        displayName: "Line",
        displayNameKey: "Visual_Line"
    },
    {
        value: LineType.area,
        displayName: "Area",
        displayNameKey: "Visual_Area"
    }
]

const interpolationOptions = [
    {
        value: LineInterpolation.linear,
        displayName: "Linear",
        displayNameKey: "Visual_Linear"
    },
    {
        value: LineInterpolation.stepBefore,
        displayName: "Step-before",
        displayNameKey: "Visual_Step-before"
    },
    {
        value: LineInterpolation.stepAfter,
        displayName: "Step-after",
        displayNameKey: "Visual_Step-after"
    },
    {
        value: LineInterpolation.basis,
        displayName: "Basis",
        displayNameKey: "Visual_Basis"
    },
    {
        value: LineInterpolation.basisOpen,
        displayName: "Basis-open",
        displayNameKey: "Visual_Basis-open"
    },
    {
        value: LineInterpolation.basisClosed,
        displayName: "Basis-closed",
        displayNameKey: "Visual_Basis-closed"
    },
    {
        value: LineInterpolation.cardinal,
        displayName: "Cardinal",
        displayNameKey: "Visual_Cardinal"
    },
    {
        value: LineInterpolation.cardinalOpen,
        displayName: "Cardinal-open",
        displayNameKey: "Visual_Cardinal-open"
    },
    {
        value: LineInterpolation.cardinalClosed,
        displayName: "Cardinal-closed",
        displayNameKey: "Visual_Cardinal-closed"
    },
    {
        value: LineInterpolation.monotone,
        displayName: "Monotone",
        displayNameKey: "Visual_Monotone"
    }
]

const lineColorModeOptions = [
    {
        value: LineColorMode.joint,
        displayName: "Joint",
        displayNameKey: "Visual_Line_Mode_Joint"
    },
    {
        value: LineColorMode.granular,
        displayName: "Granular",
        displayNameKey: "Visual_Line_Mode_Granular"
    }
]

export class LineDescriptor extends BaseDescriptor {

    public mode = new ItemDropdown({
        name: "mode",
        displayNameKey: "Visual_Line_Mode",
        descriptionKey: "Visual_Line_Mode_Description",
        items: lineColorModeOptions,
        value: lineColorModeOptions[0]
    });

    public fillColor = new ColorPicker({
        name: "fillColor",
        displayNameKey: "Visual_Color",
        value: { value: null }
    });

    public shouldMatchKpiColor = new ToggleSwitch({
        name: "shouldMatchKpiColor",
        displayNameKey: "Visual_Match_KPI_Color",
        value: false
    });

    public dataPointStartsKpiColorSegment = new ToggleSwitch({
        name: "dataPointStartsKpiColorSegment",
        displayNameKey: "Visual_KPI_Color_Segment",
        value: true
    });

    public lineType = new ItemDropdown({
        name: "lineType",
        displayNameKey: "Visual_Type",
        items: lineTypeOptions,
        value: lineTypeOptions[0]
    });

    private minThickness: number = 0.25;
    private maxThickness: number = 10;
    public thickness = new Slider({
        name: "thickness",
        displayNameKey: "Visual_Thickness",
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
        displayNameKey: "Visual_Opacity",
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
        displayNameKey: "Visual_Area_Opacity",
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
        displayNameKey: "Visual_Style",
        items: lineStyleOptions,
        value: lineStyleOptions[0]
    });

    public interpolation = new ItemDropdown({
        name: "interpolation",
        displayNameKey: "Visual_Interpolation",
        items: interpolationOptions,
        value: interpolationOptions[0]
    });

    public interpolationWithColorizedLine = new ItemDropdown({
        name: `interpolationWithColorizedLine`,
        displayNameKey: "Visual_Interpolation",
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

    // `displayName` is a stable internal key used only for container lookup in
    // `getCurrentSettings`; it is intentionally NOT localized to avoid colliding
    // with a real series/group name. `displayNameKey` drives the localized label
    // shown in the formatting pane.
    public allLinesContainerItem: ContainerItem = {
        displayName: "[ALL]",
        displayNameKey: "Visual_Line_All_Default",
        slices: [...this.defaultSlices]
    };

    public container: Container = {
        displayNameKey: "Visual_Line_Apply_To",
        descriptionKey: "Visual_Line_Apply_To_Description",
        containerItems: [this.allLinesContainerItem]
    };

    constructor() {
        super()

        this.slices = [this.mode]
        this.name = "line"
        this.displayNameKey = "Visual_Line"
    }

    public populateContainer(dataPoint: LineDataPoint) {
        const { containerName, selectionId, objects } = dataPoint
        const existingContainer = this.getCurrentSettings(containerName)
        if(Object.keys(existingContainer).length) {
            return existingContainer
        }

        const containerItem: ContainerItem = {
            displayName: containerName,
            slices: []
        }
        // Container stores only the explicit user override. The default per-series
        // palette color is resolved later in the converter, so that lines sharing
        // a joint container still each get a unique default color.
        const sliceValues = this.parseContainer(objects)

        // cloning all slices
        this.defaultSlices.forEach(slice => {
            const clonedSlice = Object.create(slice);
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

    public parseContainer(objects: DataViewObjects) {
        const lineObject = objects?.line as any || {};
        // `userGeneralColor` is manually set color for all lines
        const { lineStyle, thickness, fillColor: userGeneralColor } = this.getCurrentSettings(this.allLinesContainerItem.displayName)

        const oldAPIColor: string = this.getColorFromOldAPI(objects?.series?.fillColor)
        const userColor: string | undefined = lineObject.fillColor?.solid?.color // manually set color for current line
        // Only the explicit override is kept here; when none is set the value stays
        // null and the converter falls back to a unique per-series palette color.
        lineObject.fillColor = userColor || oldAPIColor || userGeneralColor || null;

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
        const currentLineSettings: SimpleLineSetting = {} as SimpleLineSetting
        let interpolationWithColorizedLine;

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

    public setLocalizedDisplayName(localizationManager: ILocalizationManager) {
        super.setLocalizedDisplayName(localizationManager);
        [lineStyleOptions, interpolationWithColorizedLineOptions, lineTypeOptions, interpolationOptions, lineColorModeOptions].forEach(list => 
            list.forEach(option => {
                option.displayName = localizationManager.getDisplayName(option.displayNameKey)
            })
        )
    }
}
