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
    // powerbi
    import TooltipDataItem = powerbi.visuals.TooltipDataItem;

    // powerbi.visuals
    import valueFormatter = powerbi.visuals.valueFormatter;
    import IValueFormatter = powerbi.visuals.IValueFormatter;
    import ToolTipComponent = powerbi.visuals.ToolTipComponent;

    // powerbi.visuals.controls
    import Rectangle = powerbi.visuals.controls.TouchUtils.Rectangle;

    enum TooltipMarkerShapeEnum {
        circle,
        none
    }

    export class TooltipComponent
        extends VarianceConverter
        implements VisualComponent<EventPositionVisualComponentOptions> {

        public tooltipComponent: ToolTipComponent;

        private varianceDisplayName: string = "Variance";
        private secondVarianceDisplayName: string = `${this.varianceDisplayName} 2`;

        private numberFormat: string = valueFormatter.DefaultNumericFormat;

        private transparentColor: string = "rgba(0,0,0,0)";

        constructor() {
            super();

            /**
             * TODO:
             * We use ToolTipComponent instead of Tooltip API due to inability to use it on dashboard page.
             * Let's revisit it once the issue is fixed
             */
            try {
                this.tooltipComponent = new ToolTipComponent();
            } catch (err) {
                this.tooltipComponent = null;
            }
        }

        public render(options: EventPositionVisualComponentOptions): void {
            if (!options.position || !this.tooltipComponent) {
                return;
            }

            this.showTooltip(options);
        }

        private showTooltip(options: EventPositionVisualComponentOptions): void {
            const {
                position,
                data: {
                    x,
                    series,
                    settings: {
                        kpiIndicator,
                        tooltipLabel,
                        tooltipVariance,
                        secondTooltipVariance,
                        tooltipValues,
                        legend,
                    },
                    variances
                }
            } = options;

            if (!tooltipLabel.show
                && !tooltipVariance.show
                && !tooltipValues.show
                && !secondTooltipVariance.show
            ) {
                this.clear();

                return;
            }

            let dataItems: TooltipDataItem[] = [];

            const firstVariance: TooltipDataItem = this.getVarianceTooltip(
                series[0] && series[0].points[0],
                series[1] && series[1].points[0],
                tooltipVariance,
                this.varianceDisplayName,
                kpiIndicator.getCurrentKPI(
                    series[0]
                    && series[0].points[0]
                    && series[0].points[0].kpiIndex),
                (variances[0] || [])[0],
                legend,
                series[0] && series[0].settings,
            );

            if (firstVariance) {
                dataItems.push(firstVariance);
            }

            const secondVariance: TooltipDataItem = this.getVarianceTooltip(
                series[0] && series[0].points[0],
                series[2] && series[2].points[0],
                secondTooltipVariance,
                this.secondVarianceDisplayName,
                undefined,
                (variances[1] || [])[0]
            );

            if (secondVariance) {
                dataItems.push(secondVariance);
            }

            if (dataItems.length) {
                dataItems.push(
                    this.getTooltipSeparator(),
                    this.getTooltipSeparator(),
                );
            }

            if (tooltipValues.show) {
                series.forEach((dataSeries: DataRepresentationSeries) => {
                    const valueFormatter: IValueFormatter = this.getValueFormatterByFormat(
                        dataSeries.format || this.numberFormat,
                        tooltipValues.displayUnits,
                        tooltipValues.precision
                    );

                    const point: DataRepresentationPoint = dataSeries
                        && dataSeries.points
                        && dataSeries.points[0];

                    if (point
                        && point.y !== null
                        && point.y !== undefined
                        && !isNaN(point.y)
                    ) {
                        dataItems.push({
                            displayName: `${dataSeries.name}`,
                            value: valueFormatter.format(point.y),
                            color: dataSeries.settings.line.fillColor,
                            lineStyle: legend.getLegendLineStyle(dataSeries.settings.line.lineStyle),
                            markerShape: legend.getLegendMarkerShape(),
                            lineColor: dataSeries.settings.line.fillColor,
                        });
                    }
                });
            }

            const point: DataRepresentationPoint = series
                && series[0]
                && series[0].points
                && series[0].points[0];

            if (tooltipLabel.show
                && point
                && point.x !== undefined
                && point.x !== null
            ) {
                const formatter: IValueFormatter = this.getValueFormatterByFormat(
                    tooltipLabel.getFormat(),
                    x.type === DataRepresentationTypeEnum.NumberType
                        ? tooltipLabel.displayUnits
                        : undefined,
                    x.type === DataRepresentationTypeEnum.NumberType
                        ? tooltipLabel.precision
                        : undefined);

                const text: string = formatter
                    ? formatter.format(point.x)
                    : point.x as string;

                dataItems = [
                    {
                        displayName: "",
                        value: text,
                        color: this.transparentColor,
                        markerShape: this.getTooltipMarkerShape(TooltipMarkerShapeEnum.circle)
                    },
                    ...dataItems,
                ];
            }

            const rect: Rectangle = new Rectangle(
                position.x,
                position.y,
                0,
                0
            );

            if (dataItems.length) {
                this.tooltipComponent.show(dataItems, rect);
            } else {
                this.clear();
            }
        }

        private getTooltipSeparator(): TooltipDataItem {
            return {
                displayName: "   ",
                value: "",
                color: this.transparentColor,
                markerShape: this.getTooltipMarkerShape(TooltipMarkerShapeEnum.none)
            };
        }

        private getVarianceTooltip(
            firstPoint: DataRepresentationPoint,
            secondPoint: DataRepresentationPoint,
            settings: TooltipLabelDescriptor,
            displayName: string,
            commonKPISettings: IKPIIndicatorSettings = {},
            kpiIndicatorVariance: number,
            legendDescriptor?: LegendDescriptor,
            seriesSetting?: SeriesSettings,
        ): TooltipDataItem {
            if (!settings.show) {
                return null;
            }

            const variance: number = !isNaN(kpiIndicatorVariance) && kpiIndicatorVariance !== null
                ? kpiIndicatorVariance
                : this.getVarianceByPoints(firstPoint, secondPoint);

            if (isNaN(variance)) {
                return null;
            }

            const varianceFormatter: IValueFormatter = this.getValueFormatterByFormat(
                settings.getFormat(),
                settings.displayUnits,
                settings.precision,
            );

            const lineStyle: string = legendDescriptor && seriesSetting
                ? legendDescriptor.getLegendLineStyle(seriesSetting.line.lineStyle)
                : undefined;

            const markerShape: string = legendDescriptor
                ? legendDescriptor.getLegendMarkerShape()
                : this.getTooltipMarkerShape(TooltipMarkerShapeEnum.circle);

            const color: string = commonKPISettings.color || this.transparentColor;

            const lineColor: string = seriesSetting
                ? color
                : undefined;

            return {
                color,
                lineStyle,
                markerShape,
                lineColor,
                displayName: `${settings.label}` || `${displayName}`,
                value: varianceFormatter.format(variance),
            };
        }

        private getValueFormatterByFormat(
            format?: string,
            displayUnits?: number,
            precision?: number
        ): IValueFormatter {
            return valueFormatter.create({
                format,
                precision,
                value: displayUnits
            });
        }

        private getTooltipMarkerShape(markerShape: TooltipMarkerShapeEnum): string {
            return TooltipMarkerShapeEnum[markerShape];
        }

        public clear(): void {
            if (!this.tooltipComponent || !this.tooltipComponent.isTooltipComponentVisible) {
                return;
            }

            this.tooltipComponent.hide();
        }

        public destroy(): void {
            this.clear();
            this.tooltipComponent = null;
        }

        public hide(): void {
            this.clear();
        }
    }
}
