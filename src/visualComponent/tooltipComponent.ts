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
    // powerbi
    import VisualTooltipDataItem = powerbi.extensibility.VisualTooltipDataItem;

    // powerbi.visuals
    import valueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;
    import IValueFormatter = powerbi.extensibility.utils.formatting.IValueFormatter;

    export class TooltipComponent
        extends VarianceConverter
        implements VisualComponent {

        private varianceDisplayName: string = "Variance";
        private secondVarianceDisplayName: string = `${this.varianceDisplayName} 2`;

        private percentageFormat: string = "+0.00 %;-0.00 %;0.00 %";
        private numberFormat: string = valueFormatter.DefaultNumericFormat;

        constructor(public tooltipService: ITooltipService) {
            super();
        }

        public render(options: EventPositionVisualComponentOptions): void {
            if (!options.position || !this.tooltipService) {
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
                        tooltipValues
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

            let dataItems: VisualTooltipDataItem[] = [];

            const firstVariance: VisualTooltipDataItem = this.getVarianceTooltip(
                series[0] && series[0].points[0],
                series[1] && series[1].points[0],
                tooltipVariance,
                this.varianceDisplayName,
                kpiIndicator.getCurrentKPI(
                    series[0]
                    && series[0].points[0]
                    && series[0].points[0].kpiIndex),
                (variances[0] || [])[0]);

            if (firstVariance) {
                dataItems.push(firstVariance);
            }

            const secondVariance: VisualTooltipDataItem = this.getVarianceTooltip(
                series[0] && series[0].points[0],
                series[2] && series[2].points[0],
                secondTooltipVariance,
                this.secondVarianceDisplayName,
                undefined,
                (variances[1] || [])[0]);

            if (secondVariance) {
                dataItems.push(secondVariance);
            }

            if (dataItems.length) {
                dataItems.push(
                    {
                        displayName: "   ",
                        value: ""
                    }, {
                        displayName: "   ",
                        value: "",
                    });
            }

            if (tooltipValues.show) {
                series.forEach((dataSeries: DataRepresentationSeries) => {
                    const valueFormatter: IValueFormatter = this.getValueFormatterByFormat(
                        dataSeries.format || this.numberFormat,
                        tooltipValues.displayUnits,
                        tooltipValues.precision);

                    const point: DataRepresentationPoint = dataSeries
                        && dataSeries.points
                        && dataSeries.points[0];

                    if (point
                        && point.value !== null
                        && point.value !== undefined
                        && !isNaN(point.value)
                    ) {
                        dataItems.push({
                            displayName: dataSeries.name,
                            value: valueFormatter.format(point.value),
                            color: dataSeries.color
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
                && point.axisValue !== undefined
                && point.axisValue !== null
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
                    ? formatter.format(point.axisValue)
                    : point.axisValue as string;

                dataItems = [
                    {
                        displayName: "",
                        value: text
                    },
                    ...dataItems
                ];
            }

            if (dataItems.length) {
                this.tooltipService.show({
                    dataItems,
                    coordinates: [position.x, position.y, 0, 0],
                    identities: [],
                    isTouchEvent: false
                });
            } else {
                this.clear();
            }
        }

        private getVarianceTooltip(
            firstPoint: DataRepresentationPoint,
            secondPoint: DataRepresentationPoint,
            settings: TooltipLabelSettings,
            displayName: string,
            commonKPISettings: IKPIIndicatorSettings = {},
            kpiIndicatorVariance: number
        ): VisualTooltipDataItem {

            if (!settings.show) {
                return null;
            }

            let variance: number = !isNaN(kpiIndicatorVariance) && kpiIndicatorVariance !== null
                ? kpiIndicatorVariance
                : this.getVarianceByPoints(firstPoint, secondPoint);

            if (isNaN(variance)) {
                return null;
            }

            const varianceFormatter: IValueFormatter = this.getValueFormatterByFormat(
                this.percentageFormat,
                settings.displayUnits,
                settings.precision);

            return {
                displayName: settings.label || displayName,
                value: varianceFormatter.format(variance),
                color: commonKPISettings.color || "rgba(0,0,0,0)"
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

        public clear(): void {
            if (!this.tooltipService || !this.tooltipService.enabled()) {
                return;
            }
            this.tooltipService.hide({ immediately: true, isTouchEvent: false });
        }

        public destroy(): void {
            this.clear();
            this.tooltipService = null;
        }
    }
}