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
    // jsCommon.CssConstants
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    import createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;

    export class VerticalLineComponent extends BaseComponent<VisualComponentConstructorOptions, VisualComponentRenderOptions> {
        private className: string = "verticalLineComponent";
        private lineSelector: ClassAndSelector = createClassAndSelector("verticalLine");

        constructor(options: VisualComponentConstructorOptions) {
            super();

            this.initElement(
                options.element,
                this.className,
                "g"
            );
        }

        public render(options: VisualComponentRenderOptions): void {
            const { series, viewport, x } = options.data;

            const xScale: DataRepresentationScale = x.scale
                .copy()
                .range([0, viewport.width]);

            const points: DataRepresentationPoint[] = series
                && series[0]
                && series[0].points
                || [];

            const lineSelection: D3.UpdateSelection = this.element
                .selectAll(this.lineSelector.selector)
                .data(points);

            lineSelection
                .enter()
                .append("line")
                .classed(this.lineSelector.class, true);

            lineSelection
                .attr({
                    x1: (point: DataRepresentationPoint) => xScale.scale(point.x),
                    y1: 0,
                    x2: (point: DataRepresentationPoint) => xScale.scale(point.x),
                    y2: viewport.height
                });

            lineSelection
                .exit()
                .remove();
        }

        public clear(): void {
            this.element
                .selectAll("*")
                .remove();
        }

        public destroy(): void {
            this.element = null;
        }
    }
}
