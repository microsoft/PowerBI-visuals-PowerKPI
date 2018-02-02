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

namespace powerbi.extensibility.visual {
    import ClassAndSelector = powerbi.extensibility.utils.svg.CssConstants.ClassAndSelector;
    import createClassAndSelector = powerbi.extensibility.utils.svg.CssConstants.createClassAndSelector;

    export class VerticalLineComponent implements VisualComponent {
        private className: string = "verticalLineComponent";
        private lineSelector: ClassAndSelector = createClassAndSelector("verticalLine");

        private element: d3.Selection<SVGAElement>;

        constructor(options: VisualComponentConstructorOptions) {
            this.element = options.element
                .append("g")
                .classed(this.className, true);
        }

        public render(options: VisualComponentOptions): void {
            const { series, viewport, scale } = options.data;

            const xScale: DataRepresentationScale = scale.x
                .copy()
                .range([0, viewport.width]);

            const points: DataRepresentationPoint[] = series
                && series[0]
                && series[0].points
                || [];

            const lineSelection: d3.selection.Update<any> = this.element
                .selectAll(this.lineSelector.selectorName)
                .data(points);

            lineSelection
                .enter()
                .append("line")
                .classed(this.lineSelector.className, true);

            lineSelection
                .attr({
                    x1: (point: DataRepresentationPoint) => xScale.scale(point.axisValue),
                    y1: 0,
                    x2: (point: DataRepresentationPoint) => xScale.scale(point.axisValue),
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
