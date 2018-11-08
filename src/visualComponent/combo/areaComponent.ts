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
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;

    export interface AreaComponentRenderOptions extends LineComponentRenderOptions {
        areaOpacity: number;
    }

    export class AreaComponent
        extends LineComponent
        implements VisualComponent<LineComponentRenderOptions> {

        private additionalClassName: string = "areaComponent";
        private areaSelector: ClassAndSelector = this.getSelectorWithPrefix(`${this.additionalClassName}_area`);

        private areaSelection: D3.UpdateSelection;

        constructor(options: VisualComponentConstructorOptions) {
            super(options);

            this.element.classed(this.additionalClassName, true);

            this.constructorOptions = {
                ...options,
                element: this.element,
            };
        }

        public render(options: AreaComponentRenderOptions): void {
            this.renderArea(options);
            super.render(options);
        }

        public renderArea(options: AreaComponentRenderOptions): void {
            const {
                x,
                y,
                viewport,
                interpolation,
                gradientPoints,
                areaOpacity,
                series,
            } = options;

            this.renderOptions = options;

            const xScale: DataRepresentationScale = x
                .copy()
                .range([0, viewport.width]);

            const yScale: DataRepresentationScale = y
                .copy()
                .range([viewport.height, 0]);

            this.areaSelection = this.element
                .selectAll(this.areaSelector.selector)
                .data(gradientPoints);

            this.areaSelection.enter()
                .append("svg:path")
                .classed(this.areaSelector.class, true)
                .on("click", this.clickHandler.bind(this));

            this.areaSelection
                .attr({
                    d: (gradientGroup: DataRepresentationPointGradientColor) => {
                        return this.getArea(
                            xScale,
                            yScale,
                            viewport,
                            interpolation
                        )(gradientGroup.points);
                    },
                })
                .style("fill", (gradientGroup: DataRepresentationPointGradientColor) => gradientGroup.color);

            this.highlight(series && series.hasSelection);

            this.areaSelection
                .exit()
                .remove();
        }

        private getArea(
            xScale: DataRepresentationScale,
            yScale: DataRepresentationScale,
            viewport: IViewport,
            interpolation: LineInterpolation,
        ): D3.Svg.Area {
            return d3.svg.area()
                .x((dataPoint: DataRepresentationPoint) => {
                    return xScale.scale(dataPoint.x);
                })
                .y0(viewport.height)
                .y1((dataPoint: DataRepresentationPoint) => {
                    return yScale.scale(dataPoint.y);
                })
                .interpolate(interpolation);
        }

        public destroy(): void {
            this.areaSelection = null;

            super.destroy();
        }

        public highlight(hasSelection: boolean): void {
            this.updateElementOpacity(
                this.areaSelection,
                this.renderOptions && (this.renderOptions as AreaComponentRenderOptions).areaOpacity,
                this.renderOptions && this.renderOptions.series && this.renderOptions.series.selected,
                hasSelection,
            );

            super.highlight(hasSelection);
        }
    }
}