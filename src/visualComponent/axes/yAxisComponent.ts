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
    import PixelConverter = powerbi.extensibility.utils.type.PixelConverter;

    // powerbi
    import IViewport = powerbi.IViewport;
    import TextMeasurementService = powerbi.extensibility.utils.formatting.textMeasurementService;

    // powerbi.visuals
    import IMargin = powerbi.extensibility.utils.svg.IMargin;
    import SVGUtil = utils.svg;
    import valueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;
    import IValueFormatter = powerbi.extensibility.utils.formatting.IValueFormatter;
    import IAxisProperties = utils.chart.axis.IAxisProperties;

    export class YAxisComponent
        extends AxisBaseComponent
        implements VisualComponent {
        private elementClassName: string = "visualYAxis";

        private additionalOffset: number = 16;

        private labelOffset: number = 12;

        private maxLabelWidth: number = 0;
        private maxLabelHeight: number = 0;

        private maxXAxisLabelWidth: number = 100;

        private valueFormat: string = valueFormatter.DefaultNumericFormat;

        constructor(options: VisualComponentConstructorOptions) {
            super();

            this.svgElement = options.element
                .append("svg")
                .style({
                    "font-size": PixelConverter.toString(this.fontSize)
                })
                .classed(this.elementClassName, true);

            this.element = this.svgElement.append("g");
        }

        public render(options: VisualComponentOptions): void {
            const { settings: { yAxis } } = options.data;

            this.isEnabled = yAxis.show;

            this.hide(this.isEnabled);

            this.renderComponent(options);
        }

        private renderComponent(options: VisualComponentOptions): void {
            const { viewport, settings: { yAxis }, y, margin } = options.data
                , { min, max } = y;

            let {
                width,
                height
            } = viewport;

            const xAxisTickHight: number = this.computeXAxisTickHeight(options);

            height -= xAxisTickHight;

            this.fontSize = PixelConverter.fromPointToPixel(yAxis.fontSize);

            const formatter: IValueFormatter = this.getValueFormatter(
                yAxis.displayUnits || max,
                undefined,
                undefined,
                undefined,
                yAxis.precision,
                y.format || this.valueFormat);

            this.maxLabelHeight = this.getLabelHeight(
                max,
                formatter,
                this.fontSize,
                yAxis.fontFamily);

            const availableWidth: number = width / 2;

            const axisProperties: IAxisProperties = this.getAxisProperties(
                height,
                [min, max],
                yAxis.density,
                yAxis.density === yAxis.maxDensity);

            const { axis } = axisProperties;

            y.ticks = axis.tickValues();

            const ticks: number[] = yAxis.show && y.ticks && y.ticks.length
                ? y.ticks
                : [];

            this.maxLabelWidth = yAxis.show
                ? this.getLabelWidth(
                    ticks,
                    formatter,
                    this.fontSize,
                    yAxis.fontFamily)
                : this.computeXAxisTickWidth(options);

            y.maxTickWidth = this.getTickWidth();

            let shouldLabelsBeTruncated: boolean = false;

            if (this.maxLabelWidth > availableWidth) {
                this.maxLabelWidth = availableWidth;

                shouldLabelsBeTruncated = true;
            }

            this.svgElement.style({
                "font-family": yAxis.fontFamily,
                "font-size": PixelConverter.toString(this.fontSize),
                fill: yAxis.fontColor
            });

            this.updateSvgViewport({
                width: this.getMargins().width,
                height: height - margin.top
            });

            this.updateMargin(margin);

            this.element.attr({
                transform: SVGUtil.translate(
                    this.maxLabelWidth + this.labelOffset,
                    this.maxLabelHeight / 2)
            });

            axis.tickFormat((item: number) => {
                const formattedLabel: string = formatter.format(item);

                if (shouldLabelsBeTruncated) {
                    return TextMeasurementService.getTailoredTextOrDefault(
                        this.getTextProperties(formattedLabel, this.fontSize, yAxis.fontFamily),
                        availableWidth);
                }

                return formattedLabel;
            });

            this.element.call(axis);
        }

        private computeXAxisTickHeight(options: VisualComponentOptions): number {
            const {
                x,
                settings: {
                    xAxis
                }
            } = options.data;

            if (!xAxis.show) {
                return 0;
            }

            const formatter = this.getValueFormatterOfXAxis(x, xAxis);

            return this.getLabelHeight(
                x.max,
                formatter,
                PixelConverter.fromPointToPixel(xAxis.fontSize),
                xAxis.fontFamily
            ) + this.additionalXAxisOffset;
        }

        private computeXAxisTickWidth(options: VisualComponentOptions): number {
            const {
                x,
                settings: {
                    xAxis
                }
            } = options.data;

            if (!xAxis.show) {
                return 0;
            }

            const formatter = this.getValueFormatterOfXAxis(x, xAxis);

            const width: number = this.getLabelWidth(
                [x.min, x.max],
                formatter,
                PixelConverter.fromPointToPixel(xAxis.fontSize),
                xAxis.fontFamily);

            return Math.min(this.maxXAxisLabelWidth, width / 2);
        }

        private updateMargin(margin: IMargin): void {
            this.svgElement.style({
                "padding-top": PixelConverter.toString(margin.top)
            });
        }

        private getAxisProperties(
            pixelSpan: number,
            dataDomain: any[],
            density: number,
            isDensityAtMax: boolean
        ): IAxisProperties {
            return PowerKPIAxisHelper.createAxis({
                pixelSpan: pixelSpan - this.maxLabelHeight / 2,
                dataDomain,
                density,
                isVertical: true,
                isScalar: true,
                isCategoryAxis: false,
                metaDataColumn: null,
                formatString: undefined,
                outerPadding: this.maxLabelHeight / 2,
                useTickIntervalForDisplayUnits: true,
                shouldClamp: false,
                // outerPaddingRatio: 0,
                is100Pct: true,
                innerPaddingRatio: 1,
                tickLabelPadding: undefined,
                minOrdinalRectThickness: this.maxLabelHeight,
                shouldTheMinValueBeIncluded: isDensityAtMax
            });
        }

        public getMargins(): IViewport {
            return {
                width: this.getTickWidth(),
                height: this.isEnabled
                    ? this.maxLabelHeight / 2
                    : 0
            };
        }

        private getTickWidth(): number {
            return this.maxLabelWidth + this.additionalOffset;
        }
    }
}
