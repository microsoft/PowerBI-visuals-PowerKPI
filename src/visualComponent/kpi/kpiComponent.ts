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
    // jsCommon
    import PixelConverter = jsCommon.PixelConverter;
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    import createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;

    // powerbi.visuals
    import LegendPosition = powerbi.visuals.LegendPosition;

    enum KPIComponentLayoutEnum {
        kpiComponentRow,
        kpiComponentColumn
    }

    export class KPIComponent extends BaseContainerComponent<VisualComponentConstructorOptions, VisualComponentRenderOptions, VisualComponentRenderOptions> {
        private className: string = "kpiComponent";

        private layout: LayoutEnum = LayoutEnum.Top;

        private childSelector: ClassAndSelector = createClassAndSelector("kpiComponentChild");

        constructor(options: VisualComponentConstructorOptions) {
            super();

            this.initElement(
                options.element,
                this.className
            );

            const className: string = this.childSelector.class;

            const constructorOptions: KPIComponentConstructorOptionsWithClassName = {
                ...options,
                className,
                element: this.element,
            };

            this.components = [
                new VarianceComponentWithIndicator(constructorOptions),
                new DateKPIComponent(constructorOptions),
                new ValueKPIComponent(constructorOptions),
                new VarianceComponentWithCustomLabel(constructorOptions),
            ];
        }

        public render(options: VisualComponentRenderOptions): void {
            const { viewport: { width, height }, settings: { layout, legend } } = options.data;

            const viewport: IViewport = { width, height };

            this.layout = LayoutEnum[layout.getLayout()];

            this.applyStyleBasedOnLayout(layout, legend, viewport);

            let howManyComponentsWasRendered: number = 0;
            this.components.forEach((component: KPIVisualComponent<VisualComponentRenderOptions>) => {

                component.render(options);

                if (component.isRendered()) {
                    howManyComponentsWasRendered++;
                }

                if (component.getViewport) {
                    const margins: VisualComponentViewport = component.getViewport();

                    switch (this.layout) {
                        case LayoutEnum.Left:
                        case LayoutEnum.Right: {
                            options.data.viewport.height -= margins.height;
                            break;
                        }
                        case LayoutEnum.Bottom:
                        case LayoutEnum.Top:
                        default: {
                            options.data.viewport.width -= margins.width;
                            break;
                        }
                    }
                }
            });

            options.data.viewport = viewport;

            this.applyWidthToChildren(howManyComponentsWasRendered);
        }

        private applyStyleBasedOnLayout(
            layoutSettings: LayoutDescriptor,
            legend: LegendDescriptor,
            viewport: IViewport
        ): void {
            let currentLayout: LayoutToStyleEnum
                , kpiLayout: KPIComponentLayoutEnum
                , maxWidth: string;

            switch (LayoutEnum[layoutSettings.getLayout()]) {
                case LayoutEnum.Left:
                case LayoutEnum.Right: {
                    kpiLayout = KPIComponentLayoutEnum.kpiComponentColumn;
                    maxWidth = null;

                    if (!legend.show
                        || (LegendPosition[legend.position]
                            && (LegendPosition[legend.position] === LegendPosition.Bottom
                                || LegendPosition[legend.position] === LegendPosition.BottomCenter))
                    ) {
                        currentLayout = LayoutToStyleEnum.columnReversedLayout;
                    } else {
                        currentLayout = LayoutToStyleEnum.columnLayout;
                    }

                    break;
                }
                case LayoutEnum.Bottom:
                case LayoutEnum.Top:
                default: {
                    currentLayout = LayoutToStyleEnum.rowLayout;
                    kpiLayout = KPIComponentLayoutEnum.kpiComponentRow;
                    maxWidth = PixelConverter.toString(Math.floor(viewport.width));

                    break;
                }
            }

            this.element
                .style({
                    "max-width": maxWidth
                })
                .attr({
                    "class": `${this.className} ${LayoutToStyleEnum[currentLayout]} ${KPIComponentLayoutEnum[kpiLayout]}`
                });
        }

        private applyWidthToChildren(howManyComponentsWasRendered: number): void {
            let width: number = 100;

            if (this.layout === LayoutEnum.Top || this.layout === LayoutEnum.Bottom) {
                width = width / howManyComponentsWasRendered;
            }

            const widthInPercentage: string = `${width}%`;

            this.element
                .selectAll(this.childSelector.selector)
                .style({
                    width: widthInPercentage,
                    "max-width": widthInPercentage
                });
        }

        /**
         * The clientHeight and clientWidth might return invalid values if some DOM elements force this element to squash.
         * Such issue often occurs if flex layout is used
         *
         * To fix this issue plotComponent is hidden by default.
         */
        public getViewport(): VisualComponentViewport {
            const viewport: VisualComponentViewport = {
                height: 0,
                width: 0
            };

            if (this.element) {
                const element: HTMLDivElement = this.element.node<HTMLDivElement>();

                switch (this.layout) {
                    case LayoutEnum.Left:
                    case LayoutEnum.Right: {
                        viewport.width = element.clientWidth;
                        break;
                    }
                    case LayoutEnum.Top:
                    case LayoutEnum.Bottom:
                    default: {
                        viewport.height = element.clientHeight;
                        break;
                    }
                }
            }

            return viewport;
        }
    }
}
