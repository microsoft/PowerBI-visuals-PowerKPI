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
    export class AxesComponent implements VisualComponent {
        private element: d3.Selection<any>;
        private components: VisualComponent[];

        constructor(options: VisualComponentConstructorOptions) {
            this.element = options.element;

            this.components = [
                new YAxisComponent({ element: this.element }),
                new XAxisComponent({ element: this.element }),
            ];
        }

        public render(options: VisualComponentOptions): void {
            const viewport: IViewport = _.clone<IViewport>(options.data.viewport);

            this.components.forEach((component: VisualComponent) => {
                const componentOptions: VisualComponentOptions = {
                    data: _.clone(options.data)
                };

                componentOptions.data.viewport = viewport;

                component.render(componentOptions);
                if (component.getMargins) {
                    const margins: IViewport = component.getMargins();

                    viewport.height -= margins.height;
                    viewport.width -= margins.width;
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

        public getMargins(): IViewport {
            return this.components.reduce((previous: IViewport, component: VisualComponent) => {
                if (component.getMargins) {
                    const margins: IViewport = component.getMargins();

                    previous.height += margins.height;
                    previous.width += margins.width;
                }

                return previous;
            }, { width: 0, height: 0 });
        }
    }
}
