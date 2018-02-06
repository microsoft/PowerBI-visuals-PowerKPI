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
    // powerbi.visuals
    import LegendPosition = powerbi.extensibility.utils.chart.legend.LegendPosition;

    export class CommonComponent
        extends ComponentContainer
        implements VisualComponent {

        private className: string = "commonComponent";

        constructor(options: VisualComponentConstructorOptions) {
            super(options);

            this.element.classed(this.className, true);

            this.components = [
                new LegendComponent({
                    ...options,
                    element: this.element,
                }),
                new LayoutComponent({
                    element: this.element,
                    tooltipService: options.tooltipService
                })
            ];
        }

        public render(options: VisualComponentOptions): void {
            let legendComponent = this.components;

            if (!options.data.settings.legend.show) {
                this.components = this.components.filter(x => !(x instanceof LegendComponent))
            }

            super.render(options);

            this.components = legendComponent;

            const { data: { settings: { legend } } } = options
                , layout: LayoutToStyleEnum = this.getLayout(legend.position);

            this.element.attr({
                "class": `${this.baseClassName} ${this.className} ${LayoutToStyleEnum[layout]}`
            });
        }

        private getLayout(position: string): LayoutToStyleEnum {
            switch (LegendPosition[position]) {
                case LegendPosition.Left:
                case LegendPosition.LeftCenter: {
                    return LayoutToStyleEnum.rowLayout;
                }
                case LegendPosition.Right:
                case LegendPosition.RightCenter: {
                    return LayoutToStyleEnum.rowReversedLayout;
                }
                case LegendPosition.Top:
                case LegendPosition.TopCenter: {
                    return LayoutToStyleEnum.columnLayout;
                }
                case LegendPosition.Bottom:
                case LegendPosition.BottomCenter:
                default: {
                    return LayoutToStyleEnum.columnReversedLayout;
                }
            }
        }
    }
}
