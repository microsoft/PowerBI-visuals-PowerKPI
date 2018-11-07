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
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    import createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;

    export interface AxisReferenceLineBaseComponentRenderOptions {
        settings: AxisReferenceLineDescriptor;
        ticks: DataRepresentationAxisValueType[];
        scale: DataRepresentationScale;
        viewport: IViewport;
    }

    export abstract class AxisReferenceLineBaseComponent extends BaseComponent<VisualComponentConstructorOptions, AxisReferenceLineBaseComponentRenderOptions> {
        private className: string = "axisReferenceLineComponent";

        private lineSelector: ClassAndSelector = createClassAndSelector("axisReferenceLine");

        constructor(options: VisualComponentConstructorOptions) {
            super();

            this.initElement(
                options.element,
                this.className,
                "g"
            );
        }

        public render(options: AxisReferenceLineBaseComponentRenderOptions): void {
            const {
                ticks,
                scale,
                settings,
            } = options;

            if (!ticks || !scale || !settings || !ticks.length) {
                this.hide();

                return;
            }

            this.show();

            const lineSelection: D3.UpdateSelection = this.element
                .selectAll(this.lineSelector.selector)
                .data(settings.show ? ticks : []);

            const line: D3.Svg.Line = d3.svg.line()
                .x((positions: number[]) => {
                    return positions[0] || 0;
                })
                .y((positions: number[]) => {
                    return positions[1] || 0;
                });

            const getPoints: AxisReferenceLineGetPointsFunction = this.getPoints(options);

            lineSelection
                .enter()
                .append("svg:path")
                .classed(this.lineSelector.class, true);

            lineSelection
                .attr({
                    d: (value: DataRepresentationAxisValueType) => {
                        return line(getPoints(value));
                    }
                })
                .style({
                    "stroke": settings.color,
                    "stroke-width": settings.thickness
                });

            lineSelection
                .exit()
                .remove();
        }

        protected abstract getPoints(options: AxisReferenceLineBaseComponentRenderOptions): AxisReferenceLineGetPointsFunction;
    }
}
