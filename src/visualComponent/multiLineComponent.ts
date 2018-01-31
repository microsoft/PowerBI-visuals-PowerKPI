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

    export class MultiLineComponent implements VisualComponent {
        private static ClassName: string = "multiLineComponent";
        private static ComponentClassName: ClassAndSelector = createClassAndSelector("multiLine");

        private element: d3.Selection<any>;
        private lineComponents: VisualComponent[] = [];

        constructor(options: VisualComponentConstructorOptions) {
            this.element = options.element
                .append("g")
                .classed(MultiLineComponent.ClassName, true);
        }

        public render(options: VisualComponentOptions): void {
            const { series } = options.data;
            const multiLineSelection: d3.selection.Update<any> = this.element
                .selectAll(MultiLineComponent.ComponentClassName.selectorName)
                .data(series);

            multiLineSelection.enter()
                .append("g")
                .call((selection: d3.Selection<any>) => {
                    if (!selection || !selection[0]) {
                        return;
                    }

                    (<any>selection[0] as Element[]).forEach((element: Element) => {
                        if (!element) {
                            return;
                        }

                        this.initComponent(d3.select(element));
                    });

                    const selectionLength: number = (<any>selection[0] as Element[]).length;

                    if (selectionLength < this.lineComponents.length) {
                        this.lineComponents
                            .slice(selectionLength)
                            .forEach((component: VisualComponent) => {
                                component.clear();
                                component.destroy();
                            });

                        this.lineComponents = this.lineComponents.slice(0, selectionLength);
                    }
                })
                .classed(MultiLineComponent.ComponentClassName.className, true);

            series.forEach((dataSeries: DataRepresentationSeries, index: number) => {
                const data: DataRepresentation = _.clone(options.data);

                data.series = [dataSeries];

                this.lineComponents[index].render({ data });
            });

            multiLineSelection
                .exit()
                .remove();
        }

        private initComponent(element: d3.Selection<SVGAElement>): void {
            this.lineComponents.push(new LineComponent({ element }));
        }

        public clear(): void {
            this.lineComponents.forEach((lineComponent: VisualComponent) => {
                lineComponent.clear();
            });
        }

        public destroy(): void {
            this.lineComponents.forEach((lineComponent: VisualComponent) => {
                lineComponent.destroy();
            });

            this.element = null;
            this.lineComponents = null;
        }
    }
}
