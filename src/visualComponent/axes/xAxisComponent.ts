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
    import PixelConverter = jsCommon.PixelConverter;

    // powerbi
    import IViewport = powerbi.IViewport;
    import TextMeasurementService = powerbi.TextMeasurementService;
    import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;

    // powerbi.visuals
    import SVGUtil = powerbi.visuals.SVGUtil;
    import IAxisProperties = powerbi.visuals.IAxisProperties;

    export interface XAxisComponentRenderOptions {
        axis: DataRepresentationX;
        settings: AxisDescriptor;
        viewport: IViewport;
        margin: IMargin;
        additionalMargin: IMargin;
    }

    export class XAxisComponent
        extends AxisBaseComponent<VisualComponentConstructorOptions, XAxisComponentRenderOptions>
        implements AxisComponent<XAxisComponentRenderOptions>{

        private labelPadding: number = 8;

        private className: string = "visualXAxis";
        private elementClassNameContainer: string = "visualXAxisContainer";

        private maxElementHeight: number = 0;
        private maxElementWidth: number = 0;

        private firstLabelWidth: number = 0;
        private latestLabelWidth: number = 0;

        private mainElementYOffset: number = -7.5;

        private defaultTickNumber: number = 50;

        private additionalLabelHeight: number = 5;
        private additionalLabelWidth: number = 8;

        constructor(options: VisualComponentConstructorOptions) {
            super();

            this.element = options.element
                .append("div")
                .classed(this.className, true)
                .append("svg")
                .classed(this.elementClassNameContainer, true);

            this.gElement = this.element
                .append("g")
                .attr({
                    transform: SVGUtil.translate(0, this.mainElementYOffset)
                });
        }

        public preRender(options: XAxisComponentRenderOptions): void {
            if (!this.areRenderOptionsValid(options)) {
                return;
            }

            const {
                axis,
                settings,
            } = options;

            if (settings.show) {
                this.show();
            } else {
                this.hide();
            }

            const fontSize: number = settings.fontSizeInPx;

            this.formatter = this.getValueFormatterOfXAxis(axis, settings);

            const domain: any[] = axis.scale.getDomain();

            this.maxElementHeight = this.getLabelHeight(
                axis.max,
                this.formatter,
                fontSize,
                settings.fontFamily
            );

            this.maxElementWidth = this.getLabelWidth(
                [axis.min, axis.max],
                this.formatter,
                fontSize,
                settings.fontFamily
            );

            this.firstLabelWidth = this.getLabelWidthWithAdditionalOffset(
                [domain[0] || ""],
                this.formatter,
                fontSize,
                settings.fontFamily
            ) / 2;

            this.latestLabelWidth = this.getLabelWidthWithAdditionalOffset(
                [domain.slice(-1)[0] || ""],
                this.formatter,
                fontSize,
                settings.fontFamily
            ) / 2;
        }

        public render(options: XAxisComponentRenderOptions): void {
            if (!this.areRenderOptionsValid(options)) {
                this.hide();

                this.axisProperties = null;

                return;
            }

            const {
                axis,
                settings,
                viewport,
                margin,
                additionalMargin,
            } = options;

            const fontSize: number = settings.fontSizeInPx;

            const width: number = Math.max(0, viewport.width - margin.left - margin.right);

            this.axisProperties = this.getAxisProperties(
                width,
                axis.scale.getDomain(),
                axis.metadata,
                !axis.scale.isOrdinal,
                settings.density
            );

            if (!this.isShown) {
                return;
            }

            this.element.style({
                "font-family": settings.fontFamily,
                "font-size": PixelConverter.toString(fontSize),
                fill: settings.fontColor
            });

            this.updateViewport({
                width,
                height: this.maxElementHeight
            });

            this.element.style(
                "margin-left",
                PixelConverter.toString(margin.left + additionalMargin.left));

            this.gElement.attr("transform", SVGUtil.translate(0, 0));

            this.axisProperties.axis
                .orient("bottom")
                .tickFormat((item: number, index: number) => {
                    const currentValue: any = axis.type === DataRepresentationTypeEnum.DateType
                        ? new Date(item)
                        : item;

                    const formattedLabel: string = axis.type === DataRepresentationTypeEnum.DateType
                        ? this.axisProperties.formatter.format(currentValue)
                        : this.formatter.format(currentValue);

                    let availableWidth: number = NaN;

                    if (this.maxElementWidth > width) {
                        availableWidth = width;
                    }

                    if (!isNaN(availableWidth)) {
                        return TextMeasurementService.getTailoredTextOrDefault(
                            this.getTextProperties(formattedLabel, fontSize, settings.fontFamily),
                            availableWidth
                        );
                    }

                    return formattedLabel;
                });

            this.gElement.call(this.axisProperties.axis);
        }

        private getAxisProperties(
            pixelSpan: number,
            dataDomain: any[],
            metaDataColumn: DataViewMetadataColumn,
            isScalar: boolean,
            density: number,
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
                outerPaddingRatio: 0,
                innerPaddingRatio: 1,
                tickLabelPadding: undefined,
                minOrdinalRectThickness: this.maxElementWidth + this.labelPadding
            });
        }

        public getViewport(): VisualComponentViewport {
            if (!this.isShown) {
                return {
                    width: 0,
                    height: 0,
                    height2: 0,
                    width2: 0,
                };
            }

            const height: number = this.maxElementHeight + this.additionalLabelHeight;

            return {
                width: this.firstLabelWidth,
                width2: this.latestLabelWidth,
                height,
                height2: 0,
            };
        }

        private areRenderOptionsValid(options: XAxisComponentRenderOptions): boolean {
            return !!(options && options.axis && options.settings);
        }

        private getValueFormatterOfXAxis(x: DataRepresentationX, xAxis: AxisDescriptor): IValueFormatter {
            let minValue: DataRepresentationAxisValueType;
            let maxValue: DataRepresentationAxisValueType;
            let precision: number;

            if (x.type === DataRepresentationTypeEnum.NumberType) {
                minValue = xAxis.displayUnits || x.max;
                precision = xAxis.precision;
            } else {
                minValue = x.min;
                maxValue = x.max;
            }

            const tickNumber: number = x.type === DataRepresentationTypeEnum.StringType
                ? undefined
                : this.defaultTickNumber;

            return this.getValueFormatter(
                minValue,
                maxValue,
                x.metadata,
                tickNumber,
                precision,
                x.format || undefined
            );
        }

        protected getLabelWidthWithAdditionalOffset(
            values: DataRepresentationAxisValueType[],
            formatter: IValueFormatter,
            fontSize: number,
            fontFamily: string
        ): number {
            const width: number = this.getLabelWidth(
                values,
                formatter,
                fontSize,
                fontFamily
            );

            return width > 0
                ? width + this.additionalLabelWidth
                : 0;
        }
    }
}
