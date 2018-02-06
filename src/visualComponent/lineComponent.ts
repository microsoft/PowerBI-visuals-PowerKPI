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
    import PixelConverter = powerbi.extensibility.utils.type.PixelConverter;
    import ClassAndSelector = powerbi.extensibility.utils.svg.CssConstants.ClassAndSelector;
    import createClassAndSelector = powerbi.extensibility.utils.svg.CssConstants.createClassAndSelector;

    export class LineComponent
        extends DataRepresentationPointFilter
        implements VisualComponent {

        private static ElementClassName: ClassAndSelector = createClassAndSelector("line");

        private element: d3.Selection<any>;

        constructor(options: VisualComponentConstructorOptions) {
            super();

            this.element = options.element;
        } 

        public render(options: VisualComponentOptions): void {
            const { data } = options;

            const { series, scale } = options.data
            const firstSeries: DataRepresentationSeries = series[0];

            const xScale: DataRepresentationScale = scale.x
                .copy()
                .range([0, data.viewport.width]);

            const yScale: DataRepresentationScale = scale.y
                .copy()
                .range([data.viewport.height, 0]);

            const line: d3.svg.Line<DataRepresentationPoint> = this.getLine(xScale, yScale);

            const lineSelection: d3.selection.Update<any> = this.element
                .selectAll(LineComponent.ElementClassName.selectorName)
                .data([firstSeries]);

            lineSelection
                .enter()
                .append("svg:path")
                .classed(LineComponent.ElementClassName.className, true);

            lineSelection
                .attr({
                    d: (series: DataRepresentationSeries) => {
                        const points: DataRepresentationPoint[] = this.filter(series.points);
                        return line(points);
                    },
                    "class": (series: DataRepresentationSeries) => {
                        return `${LineComponent.ElementClassName.className} ${series.lineStyle}`;
                    }
                })
                .style({
                    "stroke": (series: DataRepresentationSeries) => series.color,
                    "stroke-width": (series: DataRepresentationSeries) => PixelConverter.toString(series.thickness)
                });

            lineSelection
                .exit()
                .remove();
        }

        private getLine(
            xScale: DataRepresentationScale,
            yScale: DataRepresentationScale
        ): d3.svg.Line<DataRepresentationPoint> {
            let r = d3.svg.line<DataRepresentationPoint>()
                .x((data: DataRepresentationPoint) => {
                    let result = xScale.scale(data.axisValue)
                    return result;
                })
                .y((data: DataRepresentationPoint) => {
                    let result = yScale.scale(data.value)
                    return result;
                });
            return r;
        }

        public clear(): void {
            this.element
                .selectAll(LineComponent.ElementClassName.selectorName)
                .remove();
        }

        public destroy(): void {
            this.element = null;
        }
    }
}
