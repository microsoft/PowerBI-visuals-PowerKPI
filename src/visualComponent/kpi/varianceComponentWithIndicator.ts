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

import { VisualComponentRenderOptions } from "../base/visualComponentRenderOptions";
import { VarianceBaseComponent } from "./varianceBaseComponent";
import { KPIVisualComponent } from "./kpiVisualComponent";
import { AlignEnum } from "./alignEnum";
import { KPIComponentConstructorOptionsWithClassName } from "./kpiComponentConstructorOptionsWithClassName";
import { CaptionKPIComponentOptionsValueSettings } from "./captionKPIComponentOptions";
import { IKPIIndicatorSettings } from "../../settings/descriptors/kpi/kpiIndicatorDescriptor";
import { KPIIndicatorValueDescriptor } from "../../settings/descriptors/kpi/kpiIndicatorValueDescriptor";
import { HorizontalLayoutEnum } from "../../layout/horizontalLayoutEnum";

export class VarianceComponentWithIndicator
    extends VarianceBaseComponent
    implements KPIVisualComponent<VisualComponentRenderOptions> {

    private componentClassName: string = "varianceComponentWithSymbol";
    private indicatorClassName: string = "kpiIndicator";
    private indicatorValueClassName: string = "kpiIndicatorValueCaption";
    private hiddenElementClassName: string = "hiddenElement";
    private fakedKPIIndicatorClassName: string = "fakedKPIIndicator";

    private glyphClassName: string = "powerKPI_glyphIcon";

    constructor(options: KPIComponentConstructorOptionsWithClassName) {
        super({
            element: options.element,
            className: options.className
        });

        this.element.classed(this.componentClassName, true);
    }

    public render(options: VisualComponentRenderOptions): void {
        const {
            series,
            settings: {
                dateLabelKPI,
                dateValueKPI,
                actualValueKPI,
                actualLabelKPI,
                secondKPIIndicatorValue,
                secondKPIIndicatorLabel,
                kpiIndicatorValue,
                kpiIndicatorLabel,
                kpiIndicator
            },
            variance
        } = options.data;

        let { current } = series && series.length > 0 && series[0]
            , kpiIndex: number = NaN;

        if (current) {
            kpiIndex = current.kpiIndex;
        }

        const kpiIndicatorSettings: IKPIIndicatorSettings = kpiIndicator.getCurrentKPI(kpiIndex);

        const varianceSettings: KPIIndicatorValueDescriptor = { ...kpiIndicatorValue } as unknown as KPIIndicatorValueDescriptor;
        const kpiLabelSettings: KPIIndicatorValueDescriptor = { ...kpiIndicatorLabel } as unknown as KPIIndicatorValueDescriptor;

        kpiLabelSettings.show = kpiIndicatorLabel.isShown();

        varianceSettings.fontColor = kpiIndicatorValue.matchKPIColor
            && kpiIndicatorSettings
            && kpiIndicatorSettings.color
            ? kpiIndicatorSettings.color
            : kpiIndicatorValue.fontColor;

        if (isNaN(variance[0])) {
            varianceSettings.show = false;
        }

        const indicatorSettings: KPIIndicatorValueDescriptor = new KPIIndicatorValueDescriptor();

        indicatorSettings.fontColor = kpiIndicatorSettings.color;
        indicatorSettings.show = kpiIndicator.show;
        indicatorSettings.isBold = false; // This options doesn't make any sense for symbol
        indicatorSettings.fontSize = kpiIndicator.fontSize;
        indicatorSettings.fontFamily = null;

        if (isNaN(kpiIndex)) {
            indicatorSettings.show = false;
        }

        if (isNaN(variance[0]) && isNaN(kpiIndex)) {
            kpiLabelSettings.show = false;
        }

        let currentAlign: AlignEnum = AlignEnum.alignRight;

        if (!dateLabelKPI.show
            && !dateValueKPI.show
            && !actualLabelKPI.show
            && (!actualValueKPI.show || series[0] && series[0].current && isNaN(series[0] && series[0].current.y))
            && (!secondKPIIndicatorValue.show && !secondKPIIndicatorLabel.isShown() || isNaN(variance[1]))) {
            currentAlign = AlignEnum.alignLeft;
        } else if (!varianceSettings.show && !kpiLabelSettings.show) {
            currentAlign = AlignEnum.alignCenter;
        }

        const className: string = kpiIndicatorSettings.shape
            ? `${this.indicatorClassName} ${this.glyphClassName} ${kpiIndicatorSettings.shape}`
            : undefined;

        const title: string = kpiIndicatorLabel.label || `${variance[0]}`;

        const indicatorCaption: CaptionKPIComponentOptionsValueSettings = {
            title,
            value: "",
            settings: indicatorSettings,
            className: className
        };

        const fakedIndicatorSettings: KPIIndicatorValueDescriptor = new KPIIndicatorValueDescriptor();

        // We should implement a copy method for settings
        fakedIndicatorSettings.fontColor = indicatorSettings.fontColor;
        fakedIndicatorSettings.show = indicatorSettings.show;
        fakedIndicatorSettings.isBold = indicatorSettings.isBold;
        fakedIndicatorSettings.fontSize = indicatorSettings.fontSize;

        fakedIndicatorSettings.show = fakedIndicatorSettings.show
            && varianceSettings.show
            && kpiLabelSettings.show
            && !!kpiIndicatorLabel.label;

        const fakedIndicatorCaption: CaptionKPIComponentOptionsValueSettings = {
            title,
            value: "",
            settings: fakedIndicatorSettings,
            className: className
                ? `${className} ${this.hiddenElementClassName} ${this.fakedKPIIndicatorClassName}`
                : `${this.hiddenElementClassName} ${this.fakedKPIIndicatorClassName}`
        };

        const formatter: valueFormatter.IValueFormatter = this.getValueFormatter(
            varianceSettings.displayUnits,
            varianceSettings.precision,
            kpiIndicatorValue.getFormat(),
        );

        const valueCaption: CaptionKPIComponentOptionsValueSettings = {
            title,
            value: formatter.format(variance[0]),
            settings: varianceSettings
        };

        const labelCaption: CaptionKPIComponentOptionsValueSettings = {
            value: kpiIndicatorLabel.label,
            settings: kpiLabelSettings,
            className: this.indicatorValueClassName
        };

        let captions: CaptionKPIComponentOptionsValueSettings[][] = [];

        switch (HorizontalLayoutEnum[kpiIndicator.position]) {
            case HorizontalLayoutEnum.Right: {
                captions.push(
                    [valueCaption, indicatorCaption],
                    [labelCaption, fakedIndicatorCaption]);

                break;
            }
            case HorizontalLayoutEnum.Left:
            default: {
                captions.push(
                    [indicatorCaption, valueCaption],
                    [fakedIndicatorCaption, labelCaption]);

                break;
            }
        }

        super.render({
            captions,
            data: options.data,
            align: currentAlign
        });
    }
}
