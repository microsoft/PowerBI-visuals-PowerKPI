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
    export enum LineInterpolation {
        linear = "linear",
        stepBefore = "step-before",
        stepAfter = "step-after",
        basis = "basis",
        basisOpen = "basis-open",
        basisClosed = "basis-closed",
        bundle = "bundle",
        cardinal = "cardinal",
        cardinalOpen = "cardinal-open",
        cardinalClosed = "cardinal-closed",
        monotone = "monotone",
    }

    export const lineInterpolationEnumType: IEnumType = createEnumType([
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
            value: LineInterpolation.bundle,
            displayName: "Bundle"
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
        },
    ]);

    export const lineInterpolationWithColorizedLineEnumType: IEnumType = createEnumType([
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
    ]);

    export enum LineStyle {
        solidLine = "solidLine",
        dottedLine = "dottedLine",
        dashedLine = "dashedLine",
        dotDashedLine = "dotDashedLine",
    }

    export const lineStyleEnumType: IEnumType = createEnumType([
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
        },
    ]);

    export enum LineType {
        line = "line",
        area = "area",
        column = "column",
    }

    export const lineTypeEnumType: IEnumType = createEnumType([
        {
            value: LineType.line,
            displayName: "Line",
        },
        {
            value: LineType.area,
            displayName: "Area",
        },
    ]);

    export interface LineDescriptorBase {
        fillColor: string;
        shouldMatchKpiColor: boolean;
        dataPointStartsKpiColorSegment: boolean;
        lineStyle: LineStyle;
        thickness: number;
        interpolation: LineInterpolation;
    }

    export class LineDescriptor
        extends BaseDescriptor
        implements Descriptor, LineDescriptorBase {

        private minThickness: number = 0.25;
        private maxThickness: number = 10;

        private minOpacity: number = 15;
        private maxOpacity: number = 100;

        public fillColor: string = undefined;
        public shouldMatchKpiColor: boolean = false;
        public dataPointStartsKpiColorSegment: boolean = true;
        public lineType: LineType = LineType.line;
        public thickness: number = 2;
        public rawOpacity: number = 100;
        public rawAreaOpacity: number = 50;
        public lineStyle: LineStyle = LineStyle.solidLine;
        public interpolation: LineInterpolation = LineInterpolation.linear;
        public interpolationWithColorizedLine: LineInterpolation = LineInterpolation.linear;

        public get opacity(): number {
            return this.convertOpacityToCssFormat(this.rawOpacity);
        }

        public get areaOpacity(): number {
            return this.convertOpacityToCssFormat(this.rawAreaOpacity);
        }

        public convertOpacityToCssFormat(opacity: number): number {
            return opacity / 100;
        }

        public getInterpolation(): LineInterpolation {
            return this.shouldMatchKpiColor
                ? this.interpolationWithColorizedLine
                : this.interpolation;
        }

        public parse(): void {
            this.thickness = Math.min(
                Math.max(
                    this.minThickness,
                    this.thickness,
                ),
                this.maxThickness
            );

            this.rawOpacity = this.getOpacity(this.rawOpacity);
            this.rawAreaOpacity = this.getOpacity(this.rawAreaOpacity);
        }

        private getOpacity(opacity: number): number {
            return Math.min(
                this.maxOpacity,
                Math.max(
                    this.minOpacity,
                    opacity
                )
            );
        }

        public shouldKeyBeEnumerated?(key: string): boolean {
            if (key === "interpolation" && this.shouldMatchKpiColor) {
                return false;
            }

            if (key === "interpolationWithColorizedLine" && !this.shouldMatchKpiColor) {
                return false;
            }

            if (key === "rawAreaOpacity" && this.lineType !== LineType.area) {
                return false;
            }

            if (key === "dataPointStartsKpiColorSegment" && !this.shouldMatchKpiColor) {
                return false;
            }

            return this.hasOwnProperty(key);
        }
    }
}
