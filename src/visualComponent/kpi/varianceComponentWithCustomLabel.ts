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
    import IValueFormatter = powerbi.extensibility.utils.formatting.IValueFormatter;
    
    export class VarianceComponentWithCustomLabel
        extends VarianceBaseComponent
        implements KPIVisualComponent {

        private componentClassName: string = "varianceComponentWithCustomLabel";

        constructor(options: KPIComponentConstructorOptionsWithClassName) {
            super({
                element: options.element,
                className: options.className
            });

            this.element.classed(this.componentClassName, true);
        }

        public render(options: VisualComponentOptions): void {
            const {
                series,
                variance,
                settings: {
                    dateLabelKPI,
                    dateValueKPI,
                    actualValueKPI,
                    actualLabelKPI,
                    kpiIndicatorValue,
                    kpiIndicatorLabel,
                    secondKPIIndicatorValue,
                    secondKPIIndicatorLabel,
                    kpiIndicator
                }
            } = options.data;

            const varianceSettings: KPIIndicatorValueSettings = _.clone(secondKPIIndicatorValue)
                , labelSettings: KPIIndicatorValueSettings = _.clone(secondKPIIndicatorLabel);

            labelSettings.show = secondKPIIndicatorLabel.isShown();

            if (isNaN(variance[1])) {
                varianceSettings.show = false;
                labelSettings.show = false;
            }

            const isVarianceKPIAvailable: boolean = series
                && series.length > 0
                && series[0]
                && series[0].current
                && !isNaN(series[0].current.kpiIndex);

            let currentAlign: AlignEnum = AlignEnum.alignCenter;

            if (!dateLabelKPI.show
                && !dateValueKPI.show
                && (!actualValueKPI.show || series[0] && series[0].current && isNaN(series[0] && series[0].current.value))
                && !actualLabelKPI.show
            ) {
                currentAlign = AlignEnum.alignLeft;
            } else if ((!kpiIndicatorValue.show || isNaN(variance[0]))
                && (!kpiIndicatorLabel.isShown() || (isNaN(variance[0]) && series[0] && series[0].current && isNaN(series[0].current.kpiIndex)))
                && (!isVarianceKPIAvailable || !kpiIndicator.show)) {
                currentAlign = AlignEnum.alignRight;
            }

            const formatter: IValueFormatter = this.getValueFormatter(
                varianceSettings.displayUnits,
                varianceSettings.precision);

            const valueCaption: CaptionKPIComponentOptionsValueSettings = {
                value: formatter.format(variance[1]),
                title: secondKPIIndicatorLabel.label || `${variance[1]}`,
                settings: varianceSettings
            };

            const labelCaption: CaptionKPIComponentOptionsValueSettings = {
                value: secondKPIIndicatorLabel.label,
                settings: labelSettings
            };

            super.render({
                captions: [
                    [valueCaption],
                    [labelCaption]
                ],
                data: options.data,
                align: currentAlign
            });
        }
    }
}