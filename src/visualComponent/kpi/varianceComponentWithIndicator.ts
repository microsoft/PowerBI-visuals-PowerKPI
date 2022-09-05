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

import { HorizontalLayoutEnum } from "../../layout/horizontalLayoutEnum";
import { IKPIIndicatorSettings } from "../../settings/descriptors/kpi/kpiIndicatorsListDescriptor";
import { KPIIndicatorDescriptor } from "../../settings/descriptors/kpi/kpiIndicatorDescriptor";
import { IVisualComponentRenderOptions } from "../base/visualComponentRenderOptions";
import { AlignEnum } from "./alignEnum";
import { ICaptionKPIComponentOptionsValueSettings } from "./captionKPIComponentOptions";
import { IKPIComponentConstructorOptionsWithClassName } from "./kpiComponentConstructorOptionsWithClassName";
import { IKPIVisualComponent } from "./kpiVisualComponent";
import { VarianceBaseComponent } from "./varianceBaseComponent";

export class VarianceComponentWithIndicator
    extends VarianceBaseComponent
    implements IKPIVisualComponent<IVisualComponentRenderOptions> {

    private componentClassName: string = "varianceComponentWithSymbol";
    private indicatorClassName: string = "kpiIndicator";
    private indicatorValueClassName: string = "kpiIndicatorValueCaption";
    private hiddenElementClassName: string = "hiddenElement";
    private fakedKPIIndicatorClassName: string = "fakedKPIIndicator";

    private glyphClassName: string = "powerKPI_glyphIcon";

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
            settings: {
                dateLabelKPI,
                dateValueKPI,
                actualValueKPI,
                actualLabelKPI,
                secondKPIIndicatorValue,
                secondKPIIndicatorLabel,
                kpiIndicatorValue,
                kpiIndicatorLabel,
                kpiIndicator,
            },
            variance,
        } = options.data;
        
        const { current } = series && series.length > 0 && series[0];
        let kpiIndex: number = NaN;

        if (current) {
            kpiIndex = current.kpiIndex;
        }

        const kpiIndicatorSettings: IKPIIndicatorSettings = kpiIndicator.getCurrentKPI(kpiIndex);

        const varianceSettings: KPIIndicatorDescriptor = this.cloneClass<KPIIndicatorDescriptor>(kpiIndicatorValue);
        const kpiLabelSettings: KPIIndicatorDescriptor = this.cloneClass<KPIIndicatorDescriptor>(kpiIndicatorLabel);

        kpiLabelSettings.show.value = kpiIndicatorLabel.isShown();

        if(varianceSettings.fontColor){
            varianceSettings.fontColor.value.value = kpiIndicatorValue.matchKPIColor.value
                && kpiIndicatorSettings
                && kpiIndicatorSettings.color.value.value
                ? kpiIndicatorSettings.color.value.value
                : kpiIndicatorValue.fontColor.value.value;
        } else {
            varianceSettings.fontColor = kpiIndicatorValue.fontColor;
        }

        if (isNaN(variance[0])) {
            varianceSettings.show.value = false;
        }

        const indicatorSettings: KPIIndicatorDescriptor = new KPIIndicatorDescriptor();

        indicatorSettings.fontColor.value.value = kpiIndicatorSettings.color.value.value;
        indicatorSettings.show.value = kpiIndicator.isElementShown();
        indicatorSettings.font.bold.value = false; // This options doesn't make any sense for symbol
        indicatorSettings.font.fontSize.value = kpiIndicator.font.fontSize.value;
        indicatorSettings.font.fontFamily.value = null;

        if (isNaN(kpiIndex)) {
            indicatorSettings.show.value = false;
        }

        if (isNaN(variance[0]) && isNaN(kpiIndex)) {
            kpiLabelSettings.show.value = false;
        }

        let currentAlign: AlignEnum = AlignEnum.alignRight;
        if (!dateLabelKPI.isElementShown()
            && !dateValueKPI.isElementShown()
            && !actualLabelKPI.isElementShown()
            && (!actualValueKPI.isElementShown() || series[0] && series[0].current && isNaN(series[0] && series[0].current.y))
            && (!secondKPIIndicatorValue.isElementShown() && !secondKPIIndicatorLabel.isShown() || isNaN(variance[1]))) {
            currentAlign = AlignEnum.alignLeft;
        } else if (!varianceSettings.isElementShown() && !kpiLabelSettings.isElementShown()) {
            currentAlign = AlignEnum.alignCenter;
        }

        const className: string = kpiIndicatorSettings.shape
            ? `${this.indicatorClassName} ${this.glyphClassName} ${kpiIndicatorSettings.shape}`
            : undefined;

        const title: string = kpiIndicatorLabel.label.value || `${variance[0]}`;

        const indicatorCaption: ICaptionKPIComponentOptionsValueSettings = {
            className,
            settings: indicatorSettings,
            title,
            value: "",
        };

        const fakedIndicatorSettings: KPIIndicatorDescriptor = new KPIIndicatorDescriptor();

        // We should implement a copy method for settings
        fakedIndicatorSettings.fontColor.value.value = indicatorSettings.fontColor.value.value;
        fakedIndicatorSettings.show.value = indicatorSettings.isElementShown();
        fakedIndicatorSettings.font.bold.value = indicatorSettings.font.bold.value;
        fakedIndicatorSettings.font.fontSize.value = indicatorSettings.font.fontSize.value;

        fakedIndicatorSettings.show.value = fakedIndicatorSettings.isElementShown()
            && varianceSettings.isElementShown()
            && kpiLabelSettings.isElementShown()
            && !!kpiIndicatorLabel.label.value;

        const fakedIndicatorCaption: ICaptionKPIComponentOptionsValueSettings = {
            className: className
                ? `${className} ${this.hiddenElementClassName} ${this.fakedKPIIndicatorClassName}`
                : `${this.hiddenElementClassName} ${this.fakedKPIIndicatorClassName}`,
            settings: fakedIndicatorSettings,
            title,
            value: "",
        };

        const formatter: valueFormatter.IValueFormatter = this.getValueFormatter(
            varianceSettings.displayUnits.value.value as number,
            varianceSettings.precision.value,
            kpiIndicatorValue.getFormat(),
        );

        const valueCaption: ICaptionKPIComponentOptionsValueSettings = {
            settings: varianceSettings,
            title,
            value: formatter.format(variance[0]),
        };

        const labelCaption: ICaptionKPIComponentOptionsValueSettings = {
            className: this.indicatorValueClassName,
            settings: kpiLabelSettings,
            value: kpiIndicatorLabel.label.value,
        };

        const captions: ICaptionKPIComponentOptionsValueSettings[][] = [];

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
            align: currentAlign,
            captions,
            data: options.data,
        });
    }

    private cloneClass<T>(instance: T): T {
        const copy = new (instance.constructor as { new (): T })();
        Object.assign(copy, instance);
        return copy;
    }
}
