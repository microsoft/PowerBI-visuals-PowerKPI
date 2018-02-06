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

namespace powerbi.extensibility.visual.powerKPI {
    import ClassAndSelector = powerbi.extensibility.utils.svg.CssConstants.ClassAndSelector;
    import createClassAndSelector = powerbi.extensibility.utils.svg.CssConstants.createClassAndSelector;

    interface PointWithThickness {
        point: DataRepresentationPoint;
        thickness: number;
    }

    export class DotsComponent implements VisualComponent {
        private className: string = "dotsComponent";
        private dotsSelector: ClassAndSelector = createClassAndSelector("dots");
        private dotSelector: ClassAndSelector = createClassAndSelector("dot");

        private element: d3.Selection<SVGAElement>;

        constructor(options: VisualComponentConstructorOptions) {
            this.element = options.element
                .append("g")
                .classed(this.className, true);
        }

        public render(options: VisualComponentOptions): void {
            const {
                series,
                viewport,
                scale,
                settings: { dots }
            } = options.data;

            const xScale: DataRepresentationScale = scale.x
                .copy()
                .range([0, viewport.width]);

            const yScale: DataRepresentationScale = scale.y
                .copy()
                .range([viewport.height, 0]);

            const dotsSelection: d3.selection.Update<any> = this.element
                .selectAll(this.dotsSelector.selectorName)
                .data(series);

            dotsSelection
                .enter()
                .append("g")
                .classed(this.dotsSelector.className, true);

            dotsSelection
                .style({
                    fill: (series: DataRepresentationSeries) => series.color
                });

            const dotSelection: d3.selection.Update<any> = dotsSelection
                .selectAll(this.dotSelector.selectorName)
                .data((series: DataRepresentationSeries) => {
                    return series.points
                        .filter((point: DataRepresentationPoint) => {
                            return point.value !== null && !isNaN(point.value);
                        })
                        .map((point: DataRepresentationPoint) => {
                            return {
                                point,
                                thickness: series.thickness
                            } as PointWithThickness;
                        });
                });

            dotSelection
                .enter()
                .append("circle")
                .classed(this.dotSelector.className, true);

            dotSelection
                .attr({
                    cx: (point: PointWithThickness) => xScale.scale(point.point.axisValue),
                    cy: (point: PointWithThickness) => yScale.scale(point.point.value),
                    r: (point: PointWithThickness) => point.thickness * dots.radiusFactor
                });

            dotSelection
                .exit()
                .remove();

            dotsSelection
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
