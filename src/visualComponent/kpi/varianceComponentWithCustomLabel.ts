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

import { valueFormatter } from "powerbi-visuals-utils-formattingutils";

import { KPIIndicatorDescriptor } from "../../settings/descriptors/kpi/kpiIndicatorDescriptor";
import { IVisualComponentRenderOptions } from "../base/visualComponentRenderOptions";
import { AlignEnum } from "./alignEnum";
import { ICaptionKPIComponentOptionsValueSettings } from "./captionKPIComponentOptions";
import { IKPIComponentConstructorOptionsWithClassName } from "./kpiComponentConstructorOptionsWithClassName";
import { IKPIVisualComponent } from "./kpiVisualComponent";
import { VarianceBaseComponent } from "./varianceBaseComponent";

export class VarianceComponentWithCustomLabel
    extends VarianceBaseComponent
    implements IKPIVisualComponent<IVisualComponentRenderOptions> {

    private componentClassName: string = "varianceComponentWithCustomLabel";

    constructor(options: IKPIComponentConstructorOptionsWithClassName) {
        super({
            className: options.className,
            element: options.element,
        });

        this.element.classed(this.componentClassName, true);
    }

    public render(options: IVisualComponentRenderOptions): void {
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
                kpiIndicator,
            },
        } = options.data;

        const varianceSettings: KPIIndicatorDescriptor = this.cloneClass(secondKPIIndicatorValue);

        const labelSettings: KPIIndicatorDescriptor = this.cloneClass(secondKPIIndicatorLabel);

        if (isNaN(variance[1])) {
            varianceSettings.show.value = false;
            labelSettings.show.value = false;
        }

        const isVarianceKPIAvailable: boolean = series
            && series.length > 0
            && series[0]
            && series[0].current
            && !isNaN(series[0].current.kpiIndex);

        let currentAlign: AlignEnum = AlignEnum.alignCenter;

        if (!dateLabelKPI.isElementShown()
            && !dateValueKPI.isElementShown()
            && (!actualValueKPI.isElementShown() || series[0] && series[0].current && isNaN(series[0] && series[0].current.y))
            && !actualLabelKPI.isElementShown()
        ) {
            currentAlign = AlignEnum.alignLeft;
        } else if ((!kpiIndicatorValue.isElementShown() || isNaN(variance[0]))
            && (!kpiIndicatorLabel.isShown() || (isNaN(variance[0]) && series[0] && series[0].current && isNaN(series[0].current.kpiIndex)))
            && (!isVarianceKPIAvailable || !kpiIndicator.isElementShown())) {
            currentAlign = AlignEnum.alignRight;
        }

        const formatter: valueFormatter.IValueFormatter = this.getValueFormatter(
            varianceSettings.displayUnits.value.value as number,
            varianceSettings.precision.value,
            secondKPIIndicatorValue.getFormat(),
        );

        const valueCaption: ICaptionKPIComponentOptionsValueSettings = {
            settings: varianceSettings,
            title: secondKPIIndicatorLabel.label.value || `${variance[1]}`,
            value: formatter.format(variance[1]),
        };

        const labelCaption: ICaptionKPIComponentOptionsValueSettings = {
            settings: labelSettings,
            value: secondKPIIndicatorLabel.label.value,
        };

        super.render({
            align: currentAlign,
            captions: [
                [valueCaption],
                [labelCaption],
            ],
            data: options.data,
        });
    }

    private cloneClass<T>(instance: T): T {
        const copy = new (instance.constructor as { new (): T })();
        Object.assign(copy, instance);
        return copy;
    }
}
