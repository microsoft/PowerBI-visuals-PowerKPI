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

import { legendInterfaces } from "powerbi-visuals-utils-chartutils";

import { FontSizeDescriptor } from "./autoHiding/fontSizeDescriptor";
import { LineStyle } from "./lineDescriptor";

export enum LegendStyle {
    circle = "circle",
    box = "box",
    line = "line",
    styledLine = "styledLine",
}

export class LegendDescriptor extends FontSizeDescriptor {
    public position: string = "BottomCenter";
    public showTitle: boolean = true;
    public titleText: string = "";
    public labelColor: string = "rgb(102, 102, 102)";
    public fontFamily: string = "'Segoe UI Light', wf_segoe-ui_light, helvetica, arial, sans-serif";
    public style: LegendStyle = LegendStyle.circle;

    constructor(viewport: powerbi.IViewport) {
        super(viewport)

        this.name = "legend"
        this.displayName = "Legend"
    }
    public getLegendMarkerShape(): legendInterfaces.MarkerShape {
        switch (this.style) {
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
        switch (this.style) {
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
}
