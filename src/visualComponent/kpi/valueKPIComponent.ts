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

import {
    displayUnitSystemType,
    valueFormatter,
} from "powerbi-visuals-utils-formattingutils";

import { IVisualComponentRenderOptions } from "../base/visualComponentRenderOptions";
import { AlignEnum } from "./alignEnum";
import { CaptionKPIComponent } from "./captionKPIComponent";
import { ICaptionKPIComponentOptions, ICaptionKPIComponentOptionsValueSettings } from "./captionKPIComponentOptions";
import { IKPIComponentConstructorOptionsWithClassName } from "./kpiComponentConstructorOptionsWithClassName";
import { IKPIVisualComponent } from "./kpiVisualComponent";

export class ValueKPIComponent
    extends CaptionKPIComponent
    implements IKPIVisualComponent<IVisualComponentRenderOptions> {

    private extraClassName: string = "valueKPIComponent";

    private valueFormat: string;

    constructor(options: IKPIComponentConstructorOptionsWithClassName) {
        super({
            className: options.className,
            element: options.element,
        });

        this.element.classed(this.extraClassName, true);

        this.valueFormat = valueFormatter.DefaultNumericFormat;
    }

    public render(options: IVisualComponentRenderOptions): void {
        const { series, settings, variance } = options.data;
        const captionDetailsKPIComponentOptions: ICaptionKPIComponentOptions = { ...options } as ICaptionKPIComponentOptions;

        let caption: string = "";
        let details: string = "";
        let title: string = "";

        if (options.data.series
            && options.data.series[0]
            && options.data.series[0].current
            && !isNaN(options.data.series[0].current.y)
        ) {
            const formatter: valueFormatter.IValueFormatter = valueFormatter.create({
                displayUnitSystemType: displayUnitSystemType.DisplayUnitSystemType.WholeUnits,
                format: options.data.series[0].format || this.valueFormat,
                precision: settings.actualValueKPI.precision.value,
                value: settings.actualValueKPI.displayUnits.value?.value || series[0].domain.max,
            });

            const value: number = options.data.series[0].current.y;

            title = `${value}`;
            caption = formatter.format(value);
            details = options.data.series[0].name;
        }
        const valueCaption: ICaptionKPIComponentOptionsValueSettings = {
            settings: settings.actualValueKPI,
            title: details || title,
            value: caption,
        };

        const labelCaption: ICaptionKPIComponentOptionsValueSettings = {
            settings: settings.actualLabelKPI,
            value: details,
        };

        captionDetailsKPIComponentOptions.captions = [
            [valueCaption],
            [labelCaption],
        ];

        const isVarianceKPIAvailable: boolean = series
            && series.length > 0
            && series[0]
            && series[0].current
            && !isNaN(series[0].current.kpiIndex);

        let currentAlign: AlignEnum = AlignEnum.alignCenter;
        if (!settings.dateLabelKPI.isElementShown() && !settings.dateValueKPI.isElementShown()) {
            currentAlign = AlignEnum.alignLeft;
        } else if ((
            (!settings.kpiIndicatorValue.isElementShown() || isNaN(variance[0])) && 
            (!settings.kpiIndicatorLabel.isShown() || (isNaN(variance[0]) && series[0] && series[0].current && isNaN(series[0].current.kpiIndex))) && 
            (!isVarianceKPIAvailable || !settings.kpiIndicator.isElementShown())
        ) && (
            !settings.secondKPIIndicatorValue.isElementShown() && 
            !settings.secondKPIIndicatorLabel.isShown() ||
            isNaN(variance[1])
        )) {
            currentAlign = AlignEnum.alignRight;
        }

        captionDetailsKPIComponentOptions.align = currentAlign;

        super.render(captionDetailsKPIComponentOptions);
    }
}
