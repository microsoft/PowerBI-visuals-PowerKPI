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

import { DataRepresentationAxisValueType } from "../../dataRepresentation/dataRepresentationAxisValueType";
import { DataRepresentationTypeEnum } from "../../dataRepresentation/dataRepresentationType";
import { IVisualComponentRenderOptions } from "../base/visualComponentRenderOptions";
import { AlignEnum } from "./alignEnum";
import { CaptionKPIComponent } from "./captionKPIComponent";
import { IKPIComponentConstructorOptionsWithClassName } from "./kpiComponentConstructorOptionsWithClassName";
import { IKPIVisualComponent } from "./kpiVisualComponent";

import {
    ICaptionKPIComponentOptions,
    ICaptionKPIComponentOptionsValueSettings,
} from "./captionKPIComponentOptions";

export class DateKPIComponent
    extends CaptionKPIComponent
    implements IKPIVisualComponent<IVisualComponentRenderOptions> {

    private extraClassName: string = "dateKPIComponent";

    constructor(options: IKPIComponentConstructorOptionsWithClassName) {
        super({
            className: options.className,
            element: options.element,
        });

        this.element.classed(this.extraClassName, true);
    }

    public render(options: IVisualComponentRenderOptions): void {
        const { settings, x } = options.data;

        const captionDetailsKPIComponentOptions: ICaptionKPIComponentOptions = {
            ...options,
        } as ICaptionKPIComponentOptions;

        const axisValue: DataRepresentationAxisValueType = options.data.series
            && options.data.series[0]
            && options.data.series[0].current.x;

        let formattedValue: string = "";

        if (axisValue) {
            const formatter: valueFormatter.IValueFormatter = this.getValueFormatter(
                x.axisType,
                settings.dateValueKPI.getFormat(),
                settings.dateValueKPI.displayUnits || x.max,
                settings.dateValueKPI.precision.value);

            if (formatter) {
                formattedValue = formatter.format(axisValue);
            } else {
                formattedValue = `${axisValue}`;
            }
        }

        const valueCaption: ICaptionKPIComponentOptionsValueSettings = {
            settings: settings.dateValueKPI,
            title: options.data.x.name || formattedValue,
            value: formattedValue,
        };

        const labelCaption: ICaptionKPIComponentOptionsValueSettings = {
            settings: settings.dateLabelKPI,
            value: options.data.x.name,
        };

        captionDetailsKPIComponentOptions.captions = [
            [valueCaption],
            [labelCaption],
        ];

        captionDetailsKPIComponentOptions.align = AlignEnum.alignLeft;

        super.render(captionDetailsKPIComponentOptions);
    }

    private getValueFormatter(
        type: DataRepresentationTypeEnum,
        format: string,
        value: DataRepresentationAxisValueType,
        precision: number,
    ): valueFormatter.IValueFormatter {
        let currentValue: DataRepresentationAxisValueType;
        let currentPrecision: number;

        if (type === DataRepresentationTypeEnum.NumberType) {
            currentValue = value;
            currentPrecision = precision;
        }

        return this.getValueFormatterByFormat(format, currentValue, currentPrecision);
    }

    private getValueFormatterByFormat(
        format: string,
        value: DataRepresentationAxisValueType,
        precision: number,
    ): valueFormatter.IValueFormatter {
        return valueFormatter.valueFormatter.create({
            format,
            precision,
            value,
        });
    }
}
