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

import { DataRepresentationTypeEnum } from "./dataRepresentationType";

/**
 * The range a zoom slider keeps, as fractions of the full axis range: 0 is the
 * start of the axis and 1 its end. It is view state rather than data, so it is
 * held by the visual for the lifetime of the session and never persisted.
 */
export interface IDataRepresentationZoomRange {
    start: number;
    end: number;
}

export interface IDataRepresentationZoom {
    x: IDataRepresentationZoomRange;
    y: IDataRepresentationZoomRange;
}

export const fullZoomRange: IDataRepresentationZoomRange = {
    end: 1,
    start: 0,
};

export function createDefaultZoom(): IDataRepresentationZoom {
    return {
        x: { ...fullZoomRange },
        y: { ...fullZoomRange },
    };
}

/**
 * A zoom slider narrows a continuous range, so it only applies to a date or numeric axis.
 * A categorical axis has no range to narrow - its domain is the list of categories.
 */
export function isZoomableAxisType(type: DataRepresentationTypeEnum): boolean {
    return type === DataRepresentationTypeEnum.DateType
        || type === DataRepresentationTypeEnum.NumberType;
}

export function isFullRange(range: IDataRepresentationZoomRange): boolean {
    return !range
        || (range.start <= fullZoomRange.start && range.end >= fullZoomRange.end);
}

/**
 * Applies a zoom range to a numeric interval. Dates are handled by their numeric
 * time value, so the same arithmetic covers both continuous axis types.
 */
export function applyZoomToInterval(
    min: number,
    max: number,
    range: IDataRepresentationZoomRange,
): { min: number; max: number } {
    if (isFullRange(range) || !isFinite(min) || !isFinite(max) || max <= min) {
        return { max, min };
    }

    const span: number = max - min;

    return {
        max: min + (span * Math.min(1, Math.max(range.start, range.end))),
        min: min + (span * Math.max(0, Math.min(range.start, range.end))),
    };
}
