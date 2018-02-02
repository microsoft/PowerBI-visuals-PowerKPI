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
    import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;

    // powerbi.visuals
    import SVGUtil = utils.svg;
    import IAxisProperties = utils.chart.axis.IAxisProperties;

    export class XAxisComponent
        extends AxisBaseComponent
        implements VisualComponent {

        private labelPadding: number = 8;

        private elementClassName: string = "visualXAxis";
        private elementClassNameContainer: string = "visualXAxisContainer";

        private maxElementHeight: number = 0;
        private maxElementWidth: number = 0;
        private widthOfTheLatestLabel: number = 0;

        private mainElementYOffset: number = -7.5;

        constructor(options: VisualComponentConstructorOptions) {
            super();

            this.svgElement = options.element
                .append("div")
                .classed(this.elementClassName, true)
                .append("svg")
                .classed(this.elementClassNameContainer, true);

            this.element = this.svgElement
                .append("g")
                .attr({
                    transform: SVGUtil.translate(0, this.mainElementYOffset)
                });
        }

        public render(options: VisualComponentOptions): void {
            const { settings: { xAxis } } = options.data;

            this.isEnabled = xAxis.show;

            this.hide(this.isEnabled);

            this.renderComponent(options);
        }

        private renderComponent(options: VisualComponentOptions): void {
            const {
                viewport: {
                    width
                },
                margin,
                settings: {
                    xAxis
                },
                y,
                x,
                x: {
                    min,
                    max,
                    metadata,
                    type,
                },
                scale
            } = options.data;
            this.fontSize = PixelConverter.fromPointToPixel(xAxis.fontSize);

            const formatter = this.getValueFormatterOfXAxis(x, xAxis);

            const domain: any[] = scale.x.getDomain();

            this.maxElementHeight = this.getLabelHeight(
                max,
                formatter,
                this.fontSize,
                xAxis.fontFamily);

            this.maxElementWidth = this.getLabelWidth(
                [min, max],
                formatter,
                this.fontSize,
                xAxis.fontFamily);

            this.widthOfTheLatestLabel = this.getLabelWidth(
                [domain.slice(-1)[0] || ""],
                formatter,
                this.fontSize,
                xAxis.fontFamily);

            const axisProperties: IAxisProperties = this.getAxisProperties(
                width - this.getWidthOffsetBasedOnLabelWidth(),
                domain,
                metadata,
                !scale.x.isOrdinal,
                xAxis.density);

            const { axis } = axisProperties;

            x.ticks = axis.tickValues();

            this.svgElement.style({
                "font-family": xAxis.fontFamily,
                "font-size": PixelConverter.toString(this.fontSize),
                fill: xAxis.fontColor
            });

            this.updateSvgViewport({
                width: width + margin.left,
                height: this.maxElementHeight
            });

            this.element.attr({
                transform: SVGUtil.translate(0, 0)
            });
            
            let i = 0;
            axis
                .orient("bottom")
                .tickFormat((item: number) => {
                    let index = i ++;
                    const currentValue: any = type === DataRepresentationTypeEnum.DateType
                        ? new Date(item)
                        : item;

                    const formattedLabel: string = metadata && metadata.type && metadata.type.dateTime
                        ? axisProperties.formatter.format(currentValue)
                        : formatter.format(currentValue);

                    let availableWidth: number = NaN;

                    if (this.maxElementWidth > width) {
                        availableWidth = width;
                    }

                    if (index === 0 && this.maxElementWidth / 2 > y.maxTickWidth) {
                        availableWidth = y.maxTickWidth * 2;
                    }

                    if (!isNaN(availableWidth)) {
                        return TextMeasurementService.getTailoredTextOrDefault(
                            this.getTextProperties(formattedLabel, this.fontSize, xAxis.fontFamily),
                            availableWidth);
                    }

                    return formattedLabel;
                });

            this.element.call(axis);
        }

        private getWidthOffsetBasedOnLabelWidth(): number {
            return this.widthOfTheLatestLabel / 2;
        }

        private getAxisProperties(
            pixelSpan: number,
            dataDomain: any[],
            metaDataColumn: DataViewMetadataColumn,
            isScalar: boolean,
            density: number
        ): IAxisProperties {

            return PowerKPIAxisHelper.createAxis({
                pixelSpan,
                dataDomain,
                isScalar,
                density,
                metaDataColumn,
                isVertical: false,
                isCategoryAxis: true,
                formatString: undefined,
                outerPadding: 0,
                useTickIntervalForDisplayUnits: true,
                shouldClamp: false,
                // outerPaddingRatio: 0,
                innerPaddingRatio: 1,
                tickLabelPadding: undefined,
                minOrdinalRectThickness: this.maxElementWidth + this.labelPadding
            });
        }

        public getMargins(): IViewport {
            if (!this.isEnabled) {
                return {
                    width: 0,
                    height: 0
                };
            }

            return {
                width: this.getWidthOffsetBasedOnLabelWidth(),
                height: this.maxElementHeight + this.additionalXAxisOffset
            };
        }
    }
}
