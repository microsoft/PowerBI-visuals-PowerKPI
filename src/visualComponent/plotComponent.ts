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
    export class PlotComponent implements VisualComponent {
        private static ClassName: string = "plot";

        private element: d3.Selection<any>;
        private components: VisualComponent[] = [];

        constructor(options: VisualComponentConstructorOptions) {
            this.element = options.element
                .append("div")
                .classed(PlotComponent.ClassName, true);

            this.components = [
                new AxesComponent({
                    element: this.element
                }),
                new SvgComponent({
                    element: this.element,
                    tooltipService: options.tooltipService
                })
            ];
        }

        public render(options: VisualComponentOptions): void {
            const { viewport, margin } = options.data;

            this.updateViewport(viewport);

            viewport.width -= margin.left + margin.right;
            viewport.height -= margin.top + margin.bottom;

            this.components.forEach((component: VisualComponent) => {
                component.render(options);

                if (component.getMargins) {
                    const margins: IViewport = component.getMargins();

                    viewport.width -= margins.width;
                    viewport.height -= margins.height;
                }
            });
        }

        public clear(): void {
            this.components.forEach((component: VisualComponent) => {
                component.clear();
            });
        }

        public destroy(): void {
            this.components.forEach((component: VisualComponent) => {
                component.destroy();
            });

            this.components = null;
            this.element = null;
        }

        private updateViewport(viewport: IViewport): void {
            this.element.style({
                width: viewport.width,
                height: viewport.height
            });
        }
    }
}
