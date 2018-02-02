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
    export class MultiShapeComponent implements VisualComponent {
        private className: string = "multiShapeComponent";

        private amountOfDataPointsForFallbackComponents: number = 1;

        private element: d3.Selection<any>;
        private mainComponents: VisualComponent[] = [];
        private fallbackComponents: VisualComponent[] = [];

        constructor(options: VisualComponentConstructorOptions) {
            this.element = options.element
                .append("g")
                .classed(this.className, true);

            this.mainComponents = [
                new MultiLineComponent({
                    element: this.element
                })
            ];

            this.fallbackComponents = [
                new DotsComponent({
                    element: this.element
                })
            ];
        }

        public render(options: VisualComponentOptions): void {
            const { data: { series } } = options;

            if (series
                && series[0]
                && series[0].points
                && series[0].points.length === this.amountOfDataPointsForFallbackComponents
            ) {
                this.clearComponents(this.mainComponents);
                this.renderComponents(this.fallbackComponents, options);
            } else {
                this.clearComponents(this.fallbackComponents);
                this.renderComponents(this.mainComponents, options);
            }
        }

        private renderComponents(
            components: VisualComponent[],
            options: VisualComponentOptions
        ): void {
            components.forEach((component: VisualComponent) => {
                component.render(options);
            });
        }

        public clear(): void {
            this.clearComponents(this.getComponents());
        }

        private getComponents(): VisualComponent[] {
            return [...this.mainComponents, ...this.fallbackComponents];
        }

        private clearComponents(components: VisualComponent[]): void {
            components.forEach((component: VisualComponent) => {
                component.clear();
            });
        }

        public destroy(): void {
            this.getComponents()
                .forEach((component: VisualComponent) => {
                    component.destroy();
                });

            this.mainComponents = [];
            this.fallbackComponents = [];
            this.element = null;
        }
    }
}