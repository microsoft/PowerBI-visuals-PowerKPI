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
    AxisReferenceLineBaseComponent,
    AxisReferenceLineBaseComponentRenderOptions,
} from "./axisReferenceLineBaseComponent";

import { AxisReferenceLineGetPointsFunction } from "./axisReferenceLineGetPointsFunction";
import { DataRepresentationScale } from "../../../dataRepresentation/dataRepresentationScale";
import { DataRepresentationAxisValueType } from "../../../dataRepresentation/dataRepresentationAxisValueType";

export class XAxisReferenceLineComponent extends AxisReferenceLineBaseComponent {

    protected getPoints(options: AxisReferenceLineBaseComponentRenderOptions): AxisReferenceLineGetPointsFunction {
        const { scale, viewport, } = options;

        const xScale: DataRepresentationScale = scale
            .copy()
            .range([0, viewport.width]);

        return (value: DataRepresentationAxisValueType) => {
            const x: number = xScale.scale(value);

            return [
                [x, 0],
                [x, viewport.height]
            ];
        };
    }
}
