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
    import PixelConverter = jsCommon.PixelConverter;

    export class MainComponent extends BaseContainerComponent<VisualComponentConstructorOptions, VisualComponentRenderOptions, VisualComponentRenderOptions> {

        private className: string = "powerKPI";
        private classNameForPhantomJs: string = "powerKPI_phantom_js";

        constructor(options: VisualComponentConstructorOptions) {
            super();

            this.initElement(
                options.element,
                this.className
            );

            this.element.classed(this.classNameForPhantomJs, this.isExecutedInPhantomJs());

            this.constructorOptions = {
                ...options,
                element: this.element,
            };

            this.components = [
                new SubtitleComponent(this.constructorOptions),
                new CommonComponent(this.constructorOptions),
            ];
        }

        /**
         * We detect Phantom JS in order to detect PBI Snapshot Service
         * This is required as phantom js does not support CSS Flex Box well
         *
         * This code must be removed once PBI Snapshot Service is updated to Chromium
         */
        private isExecutedInPhantomJs(): boolean {
            try {
                return /PhantomJS/.test(window.navigator.userAgent);
            } catch (_) {
                return false;
            }
        }

        public render(options: VisualComponentRenderOptions): void {
            const {
                data: {
                    series,
                    viewport,
                    settings: {
                        kpiIndicator
                    }
                }
            } = options;

            let backgroundColor: string = null;

            if (kpiIndicator.shouldBackgroundColorMatchKpiColor
                && series
                && series.length > 0
                && series[0]
                && series[0].current
            ) {
                const kpiIndicatorSettings: IKPIIndicatorSettings = kpiIndicator.getCurrentKPI(series[0].current.kpiIndex);

                if (kpiIndicatorSettings && kpiIndicatorSettings.color) {
                    backgroundColor = kpiIndicatorSettings.color;
                }
            }

            this.element.style({
                width: PixelConverter.toString(viewport.width),
                height: PixelConverter.toString(viewport.height),
                "background-color": backgroundColor,
            });

            this.forEach(
                this.components,
                (component: VisualComponent<VisualComponentRenderOptions>) => {
                    component.render(options);

                    if (component.getViewport) {
                        const margins: VisualComponentViewport = component.getViewport();

                        options.data.viewport.height -= margins.height;
                        options.data.viewport.width -= margins.width;
                    }
                }
            );
        }
    }
}
