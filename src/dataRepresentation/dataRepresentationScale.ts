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
    export class DataRepresentationScale {
        private isOrdinalScale: boolean = false;
        private baseScale: DataRepresentationAxisScale;

        private constructor(
            scale: DataRepresentationAxisScale = null,
            isOrdinal: boolean = false
        ) {
            this.baseScale = scale;
            this.isOrdinalScale = isOrdinal;
        }

        public static create(): DataRepresentationScale {
            return new DataRepresentationScale();
        }

        public domain(
            values: DataRepresentationAxisValueType[],
            type: DataRepresentationTypeEnum
        ): DataRepresentationScale {
            let scale: DataRepresentationAxisScale;

            if (values && values.length) {
                switch (type) {
                    case DataRepresentationTypeEnum.DateType: {
                        scale = d3.time.scale();
                        break;
                    }
                    case DataRepresentationTypeEnum.NumberType: {
                        scale = d3.scale.linear();
                        break;
                    }
                    case DataRepresentationTypeEnum.StringType: {
                        scale = d3.scale.ordinal();
                        this.isOrdinalScale = true;
                        break;
                    }
                }
            }

            if (scale) {
                scale.domain(values);
            }

            this.baseScale = scale;

            return this;
        }

        public getDomain(): DataRepresentationAxisValueType[] {
            if (!this.baseScale) {
                return [];
            }

            return this.baseScale.domain() || [];
        }

        public scale(value: DataRepresentationAxisValueType): number {
            if (!this.baseScale) {
                return 0;
            }

            return this.baseScale(value);
        }

        public copy(): DataRepresentationScale {
            return new DataRepresentationScale(
                this.baseScale && this.baseScale.copy(),
                this.isOrdinalScale);
        }

        public range(rangeValues): DataRepresentationScale {
            if (this.baseScale) {
                if (this.isOrdinalScale) {
                    (this.baseScale as D3.Scale.OrdinalScale).rangePoints(rangeValues);
                }
                else {
                    this.baseScale.range(rangeValues);
                }
            }

            return this;
        }

        public get isOrdinal(): boolean {
            return this.isOrdinalScale;
        }
    }
}
