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

namespace powerbi.visuals.samples.powerKpi {
    export enum LegendStyle {
        circle = "circle",
        box = "box",
        line = "line",
        styledLine = "styledLine",
    }

    export const legendStyleEnum: IEnumType = createEnumType([
        { value: LegendStyle.circle, displayName: "Circle" },
        { value: LegendStyle.box, displayName: "Box" },
        { value: LegendStyle.line, displayName: "Line" },
        { value: LegendStyle.styledLine, displayName: "Styled Line" },
    ]);

    export enum LegendMarkerShape {
        square = "square",
        none = "none",
        circle = "circle",
    }

    export enum LegendLineStyle {
        dotted = "dotted",
        dashed = "dashed",
        solid = "solid",
    }

    export class LegendDescriptor extends FontSizeDescriptor {
        public position: string = "BottomCenter";
        public showTitle: boolean = true;
        public titleText: string = undefined;
        public labelColor: string = "rgb(102, 102, 102)";
        public fontFamily: string = "'Segoe UI Light', wf_segoe-ui_light, helvetica, arial, sans-serif";
        public style: LegendStyle = LegendStyle.circle;

        public getLegendMarkerShape(): LegendMarkerShape {
            switch (this.style) {
                case LegendStyle.box: {
                    return LegendMarkerShape.square;
                }
                case LegendStyle.line:
                case LegendStyle.styledLine: {
                    return LegendMarkerShape.none;
                }
                case LegendStyle.circle:
                default: {
                    return LegendMarkerShape.circle;
                }
            }
        }

        public getLegendLineStyle(lineStyle: LineStyle): LegendLineStyle {
            switch (this.style) {
                case LegendStyle.styledLine: {
                    switch (lineStyle) {
                        case LineStyle.dottedLine: {
                            return LegendLineStyle.dotted;
                        }
                        case LineStyle.dashedLine:
                        case LineStyle.dotDashedLine: {
                            return LegendLineStyle.dashed;
                        }
                        case LineStyle.solidLine:
                        default: {
                            return LegendLineStyle.solid;
                        }
                    }
                }
                case LegendStyle.line: {
                    return LegendLineStyle.solid;
                }
            }

            return undefined;
        }
    }
}
