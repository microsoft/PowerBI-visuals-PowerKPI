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
    // powerbi.visuals
    import valueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;
    import IValueFormatter = powerbi.extensibility.utils.formatting.IValueFormatter;
    import DisplayUnitSystemType = powerbi.extensibility.utils.formatting.DisplayUnitSystemType;
    
    export class ValueKPIComponent
        extends CaptionKPIComponent
        implements KPIVisualComponent {

        private extraClassName: string = "valueKPIComponent";

        private valueFormat: string;

        constructor(options: KPIComponentConstructorOptionsWithClassName) {
            super({
                element: options.element,
                className: options.className
            });

            this.element.classed(this.extraClassName, true);

            this.valueFormat = valueFormatter.DefaultNumericFormat;
        }

        public render(options: VisualComponentOptions): void {
            const { series, settings, variance } = options.data
                , captionDetailsKPIComponentOptions: CaptionKPIComponentOptions = _.clone(options as CaptionKPIComponentOptions);

            let caption: string = ""
                , details: string = ""
                , title: string = "";

            if (options.data.series
                && options.data.series[0]
                && options.data.series[0].current
                && !isNaN(options.data.series[0].current.value)
            ) {
                const formatter: IValueFormatter = valueFormatter.create({
                    format: options.data.series[0].format || this.valueFormat,
                    precision: settings.actualValueKPI.precision,
                    value: settings.actualValueKPI.displayUnits || options.data.y.max,
                    displayUnitSystemType: DisplayUnitSystemType.WholeUnits,
                });

                const value: number = options.data.series[0].current.value;

                title = `${value}`;
                caption = formatter.format(value);
                details = options.data.series[0].name;
            }

            const valueCaption: CaptionKPIComponentOptionsValueSettings = {
                title: details || title,
                value: caption,
                settings: settings.actualValueKPI
            };

            const labelCaption: CaptionKPIComponentOptionsValueSettings = {
                value: details,
                settings: settings.actualLabelKPI
            };

            captionDetailsKPIComponentOptions.captions = [
                [valueCaption],
                [labelCaption]
            ];

            const isVarianceKPIAvailable: boolean = series
                && series.length > 0
                && series[0]
                && series[0].current
                && !isNaN(series[0].current.kpiIndex);

            let currentAlign: AlignEnum = AlignEnum.alignCenter;

            if (!settings.dateLabelKPI.show && !settings.dateValueKPI.show) {
                currentAlign = AlignEnum.alignLeft;
            } else if (((!settings.kpiIndicatorValue.show || isNaN(variance[0]))
                && (!settings.kpiIndicatorLabel.isShown() || (isNaN(variance[0]) && series[0] && series[0].current && isNaN(series[0].current.kpiIndex)))
                && (!isVarianceKPIAvailable || !settings.kpiIndicator.show))
                && (!settings.secondKPIIndicatorValue.show && !settings.secondKPIIndicatorLabel.isShown()
                    || isNaN(variance[1]))
            ) {
                currentAlign = AlignEnum.alignRight;
            }

            captionDetailsKPIComponentOptions.align = currentAlign;

            super.render(captionDetailsKPIComponentOptions);
        }
    }
}
