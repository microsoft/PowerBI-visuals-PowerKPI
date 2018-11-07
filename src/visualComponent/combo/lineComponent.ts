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
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;

    export interface LineComponentRenderOptions extends VisualComponentRenderOptionsBase {
        thickness: number;
        viewport: IViewport;
        x: DataRepresentationScale;
        y: DataRepresentationScale;
        interpolation: LineInterpolation;
        lineStyle: LineStyle;
        gradientPoints: DataRepresentationPointGradientColor[];
        opacity: number;
    }

    export class LineComponent extends BaseComponent<VisualComponentConstructorOptions, LineComponentRenderOptions> {
        private className: string = "lineComponent";
        private lineSelector: ClassAndSelector = this.getSelectorWithPrefix(`${this.className}_line`);

        private lineSelection: D3.UpdateSelection;

        constructor(options: VisualComponentConstructorOptions) {
            super();

            this.initElement(
                options.element,
                this.className,
                "g"
            );

            this.constructorOptions = {
                ...options,
                element: this.element,
            };
        }

        public render(options: LineComponentRenderOptions): void {
            const {
                x,
                y,
                viewport,
                thickness,
                interpolation,
                gradientPoints,
                lineStyle,
                series,
            } = options;

            this.renderOptions = options;

            const xScale: DataRepresentationScale = x
                .copy()
                .range([0, viewport.width]);

            const yScale: DataRepresentationScale = y
                .copy()
                .range([viewport.height, 0]);

            this.lineSelection = this.element
                .selectAll(this.lineSelector.selector)
                .data(gradientPoints);

            this.lineSelection.enter()
                .append("svg:path")
                .classed(this.lineSelector.class, true)
                .on("click", this.clickHandler.bind(this));

            this.lineSelection
                .attr({
                    d: (gradientGroup: DataRepresentationPointGradientColor) => {
                        return this.getLine(
                            xScale,
                            yScale,
                            interpolation
                        )(gradientGroup.points);
                    },
                    "class": `${this.lineSelector.class} ${lineStyle}`,
                })
                .style({
                    "stroke": (gradientGroup: DataRepresentationPointGradientColor) => gradientGroup.color,
                    "stroke-width": () => PixelConverter.toString(thickness),
                });

            this.highlight(series && series.hasSelection);

            this.lineSelection
                .exit()
                .remove();
        }

        private getLine(
            xScale: DataRepresentationScale,
            yScale: DataRepresentationScale,
            interpolation: LineInterpolation,
        ): D3.Svg.Line {
            return d3.svg.line()
                .x((data: DataRepresentationPoint) => {
                    return xScale.scale(data.x);
                })
                .y((data: DataRepresentationPoint) => {
                    return yScale.scale(data.y);
                })
                .interpolate(interpolation);
        }

        public destroy(): void {
            this.lineSelection = null;

            super.destroy();
        }

        public highlight(hasSelection: boolean): void {
            this.updateElementOpacity(
                this.lineSelection,
                this.renderOptions && this.renderOptions.opacity,
                this.renderOptions && this.renderOptions.series && this.renderOptions.series.selected,
                hasSelection,
            );
        }
    }
}
