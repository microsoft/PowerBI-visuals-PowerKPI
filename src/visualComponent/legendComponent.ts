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
    import PixelConverter = powerbi.extensibility.utils.type.PixelConverter;

    // powerbi    
    import TextProperties = powerbi.extensibility.utils.formatting.TextProperties;

    // powerbi.visuals    
    import ILegend = utils.chart.legend.ILegend;
    import LegendData = utils.chart.legend.LegendData;
    import LegendIcon = utils.chart.legend.LegendIcon;
    import createLegend = utils.chart.legend.createLegend;

    import LegendPosition = utils.chart.legend.LegendPosition;
    import LegendDataPoint = utils.chart.legend.LegendDataPoint;

    export class LegendComponent implements VisualComponent {
        private className: string = "legendComponent";

        private element: d3.Selection<any>;
        private legend: ILegend;

        constructor(options: VisualComponentConstructorOptions) {
            this.element = options.element
                .append("div")
                .classed(this.className, true);

            this.legend = createLegend(
                <HTMLElement>this.element.node(),
                true,
                null,
                true
            );
        }

        public render(options: VisualComponentOptions): void {
            const { data: { settings: { legend } } } = options;

            if (!legend.show) {
                return;
            }

            const legendData: LegendData = this.createLegendData(options.data, legend);
            
            this.legend.changeOrientation(this.getLegendPosition(legend.position));
            
            this.legend.drawLegend(legendData, options.data.viewport);
        }

        private createLegendData(data: DataRepresentation, settings: LegendSettings): LegendData {
            const legendDataPoints: LegendDataPoint[] = data.series
                .map((series: DataRepresentationSeries) => {
                    return {
                        color: series.color,
                        icon: LegendIcon.Circle,
                        label: series.name,
                        identity: series.selectionId,
                        selected: false
                    } as LegendDataPoint;
                });

            return {
                title: settings.titleText,
                dataPoints: legendDataPoints,
                grouped: false,
                fontSize: settings.fontSize,
                labelColor: settings.labelColor
            };
        }

        private getLegendPosition(position: string): number {
            const positionIndex: number = LegendPosition[position];

            return positionIndex === undefined
                ? LegendPosition.BottomCenter
                : positionIndex;
        }

        public clear(): void {
            this.element.remove();
        }

        public destroy(): void {
            this.element = null;
            this.legend = null;
        }

        public getMargins(): IViewport {
            if (!this.legend) {
                return {
                    width: 0,
                    height: 0
                };
            }

            return this.legend.getMargins();
        }
    }
}
