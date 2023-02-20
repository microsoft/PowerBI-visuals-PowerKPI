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

import { legendInterfaces } from "powerbi-visuals-utils-chartutils";
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import { FontSizeDescriptor } from "./autoHiding/fontSizeDescriptor";
import { LineStyle } from "./line/lineTypes";

export enum LegendStyle {
    circle = "circle",
    box = "box",
    line = "line",
    styledLine = "styledLine",
}

const styleOptions = [
    {
        value: LegendStyle.circle,
        displayName: "Visual_Circle"
    },
    {
        value: LegendStyle.box,
        displayName: "Visual_Box"
    },
    {
        value: LegendStyle.line,
        displayName: "Visual_Line"
    },
    {
        value: LegendStyle.styledLine,
        displayName: "Visual_Styled_Line"
    }
]

export enum LegendPosition {
    Top = "Top",
    Bottom = "Bottom",
    Right = "Right",
    Left = "Left",
    TopCenter = "TopCenter",
    BottomCenter = "BottomCenter",
    RightCenter = "RightCenter",
    LeftCenter = "LeftCenter"
}

const positionOptions = [
    {
        value: LegendPosition.Top,
        displayName: "Visual_Top"
    },
    {
        value: LegendPosition.Bottom,
        displayName: "Visual_Bottom"
    },
    {
        value: LegendPosition.Left,
        displayName: "Visual_Left"
    },
    {
        value: LegendPosition.Right,
        displayName: "Visual_Right"
    },
    {
        value: LegendPosition.TopCenter,
        displayName: "Visual_Top_Center"
    },
    {
        value: LegendPosition.BottomCenter,
        displayName: "Visual_Bottom_Center"
    },
    {
        value: LegendPosition.LeftCenter,
        displayName: "Visual_Left_Center"
    },
    {
        value: LegendPosition.RightCenter,
        displayName: "Visual_Right_Center"
    }
]
export class LegendDescriptor extends FontSizeDescriptor {
    public position = new formattingSettings.ItemDropdown({
        name: "position",
        displayNameKey: "Visual_Position",
        items: positionOptions,
        value: positionOptions.filter(el => el.value === LegendPosition.BottomCenter)[0]
    });

    public showTitle = new formattingSettings.ToggleSwitch({
        name: "showTitle",
        displayNameKey: "Visual_Title",
        value: true,
    });

    public titleText = new formattingSettings.TextInput({
        name: "titleText",
        displayNameKey: "Visual_Legend_Name",
        value: null,
        placeholder: ""
    });

    public labelColor = new formattingSettings.ColorPicker({
        name: "labelColor",
        displayNameKey: "Visual_Color",
        value: { value: "rgb(102, 102, 102)" }
    });

    public style = new formattingSettings.ItemDropdown({
        name: "style",
        displayNameKey: "Visual_Style",
        items: styleOptions,
        value: styleOptions.filter(el => el.value === LegendStyle.circle)[0]
    });;

    constructor(viewport: powerbi.IViewport) {
        super(viewport)

        this.name = "legend"
        this.displayNameKey = "Visual_Legend"
        this.font.fontFamily.value = "Segoe UI Light, wf_segoe-ui_light, helvetica, arial, sans-serif"
        this.slices = [
            this.show,
            this.font,
            this.position,
            this.showTitle,
            this.titleText,
            this.labelColor,
            this.style
        ]
    }

    public getLegendMarkerShape(): legendInterfaces.MarkerShape {
        switch (this.style.value.value) {
            case LegendStyle.box: {
                return legendInterfaces.MarkerShape.square;
            }
            case LegendStyle.line:
            case LegendStyle.styledLine: {
                return legendInterfaces.MarkerShape.longDash;
            }
            case LegendStyle.circle:
            default: {
                return legendInterfaces.MarkerShape.circle;
            }
        }
    }

    public getLegendLineStyle(lineStyle: LineStyle): legendInterfaces.LineStyle {
        switch (this.style.value.value) {
            case LegendStyle.styledLine: {
                switch (lineStyle) {
                    case LineStyle.dottedLine: {
                        return legendInterfaces.LineStyle.dotted;
                    }
                    case LineStyle.dashedLine:
                    case LineStyle.dotDashedLine: {
                        return legendInterfaces.LineStyle.dashed;
                    }
                    case LineStyle.solidLine:
                    default: {
                        return legendInterfaces.LineStyle.solid;
                    }
                }
            }
            case LegendStyle.line: {
                return legendInterfaces.LineStyle.solid;
            }
        }

        return undefined;
    }
    
    public setLocalizedDisplayName(localizationManager: ILocalizationManager) {
        super.setLocalizedDisplayName(localizationManager);
        styleOptions.forEach(option => {
            option.displayName = localizationManager.getDisplayName(option.displayName)
        });
        positionOptions.forEach(option => {
            option.displayName = localizationManager.getDisplayName(option.displayName)
        });
    }
}
