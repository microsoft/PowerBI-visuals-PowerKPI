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
    DataRepresentationPoint,
    DataRepresentationPointGradientColor,
} from "./dataRepresentationPoint";

export class DataRepresentationPointFilter {
    public isPointValid(point: DataRepresentationPoint): boolean {
        return point
            && point.y !== null
            && point.y !== undefined
            && !isNaN(point.y);
    }

    public groupPointByColor(
        gradientPoints: DataRepresentationPointGradientColor[],
        point: DataRepresentationPoint,
        dataPointEndsKpiColorSegment: boolean
    ): void {
        if (!this.isPointValid(point) || !gradientPoints) {
            return;
        }

        const currentGradient: DataRepresentationPointGradientColor = gradientPoints.slice(-1)[0];

        if (!currentGradient) {
            gradientPoints.push({
                color: point.color,
                points: [point],
            });
        } else if (currentGradient && currentGradient.color === point.color) {
            currentGradient.points.push(point);
        } else if (currentGradient && currentGradient.color !== point.color) {
            currentGradient.points.push(point);

            if (dataPointEndsKpiColorSegment) {
                currentGradient.points.reverse();
            }

            gradientPoints.push({
                color: point.color,
                points: [point],
            });
        }
    }
}
