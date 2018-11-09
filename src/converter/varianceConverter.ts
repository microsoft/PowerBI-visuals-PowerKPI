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

import { DataRepresentationSeries } from "../dataRepresentation/dataRepresentationSeries";
import { DataRepresentationPointFilter } from "../dataRepresentation/dataRepresentationPointFilter";
import { DataRepresentationPoint } from "../dataRepresentation/dataRepresentationPoint";
import { DataRepresentationPointIndexed } from "../dataRepresentation/dataRepresentationPointIndexed";

export class VarianceConverter {
    protected pointFilter: DataRepresentationPointFilter = new DataRepresentationPointFilter();

    public getVarianceByCurrentPointsOfSeries(
        firstSeries: DataRepresentationSeries,
        secondSeries: DataRepresentationSeries
    ): number {
        if (!this.isSeriesValid(firstSeries) || !this.isSeriesValid(secondSeries)) {
            return NaN;
        }

        const firstPoint: DataRepresentationPointIndexed = firstSeries.current;
        const index: number = firstPoint.index;
        const secondPoint: DataRepresentationPoint = !isNaN(index) && secondSeries.points[index];

        return this.getVarianceByPoints(firstPoint, secondPoint);
    }

    private isSeriesValid(series: DataRepresentationSeries): boolean {
        return series && series.current && series.current.y !== null;
    }

    public getVarianceByPoints(firstPoint: DataRepresentationPoint, secondePoint: DataRepresentationPoint): number {
        if (!this.pointFilter.isPointValid(firstPoint) || !this.pointFilter.isPointValid(secondePoint)) {
            return NaN;
        }

        return this.getVariance(firstPoint.y, secondePoint.y);
    }

    public getVariance(firstValue: number, secondValue: number): number {
        return firstValue / secondValue - 1;
    }
}
