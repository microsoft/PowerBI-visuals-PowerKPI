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
    export class SeriesSettings extends SettingsBase {
        public line: LineDescriptor = new LineDescriptor();

        public parseObjects(objects: DataViewObjects): SettingsBase {
            if (objects) {
                let lineObject: LineDescriptorBase = (objects.line as any || {}) as LineDescriptorBase;

                if (!lineObject.fillColor
                    && objects.series
                    && objects.series.fillColor
                ) {
                    lineObject.fillColor = objects.series.fillColor as string;
                }

                if (!lineObject.lineStyle
                    && objects.lineStyle
                    && objects.lineStyle.lineStyle !== undefined
                    && objects.lineStyle.lineStyle !== null
                ) {
                    lineObject.lineStyle = objects.lineStyle.lineStyle as LineStyle;
                }

                if (!lineObject.thickness
                    && objects.lineThickness
                    && objects.lineThickness.thickness !== undefined
                    && objects.lineThickness.thickness !== null
                ) {
                    lineObject.thickness = objects.lineThickness.thickness as number;
                }

                return super.parseObjects({
                    ...objects,
                    line: lineObject as any
                });
            }

            return super.parseObjects(objects);
        }
    }
}
