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

import {
    BaseDescriptor,
    Descriptor,
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
