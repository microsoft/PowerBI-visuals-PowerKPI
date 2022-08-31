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

import powerbi from "powerbi-visuals-api";

import {
    IMargin,
    manipulation as svgManipulation,
} from "powerbi-visuals-utils-svgutils";

import {
    textMeasurementService,
    valueFormatter,
} from "powerbi-visuals-utils-formattingutils";
import { pixelConverter } from "powerbi-visuals-utils-typeutils";

import { IDataRepresentationAxis } from "../../dataRepresentation/dataRepresentationAxis";
import { YAxisDescriptor } from "../../settings/descriptors/axis/yAxisDescriptor";
import { IVisualComponentViewport } from "../base/visualComponent";
import { IVisualComponentConstructorOptions } from "../base/visualComponentConstructorOptions";

import { createAxis } from "./helpers/axisHelper";

import {
    AxisBaseComponent,
    IAxisComponent,
} from "./axisBaseComponent";

import { labelMeasurementService } from "../../services/labelMeasurementService";

export interface IYAxisComponentRenderOptions {
    settings: YAxisDescriptor;
    axis: IDataRepresentationAxis;
    viewport: powerbi.IViewport;
    margin: IMargin;
}

export class YAxisComponent
    extends AxisBaseComponent<IVisualComponentConstructorOptions, IYAxisComponentRenderOptions>
    implements IAxisComponent<IYAxisComponentRenderOptions> {

    private className: string = "visualYAxis";

    private additionalOffset: number = 10;

    private labelOffset: number = 12;

    private maxLabelWidth: number = 0;
    private maxLabelHeight: number = 0;

    private valueFormat: string = valueFormatter.valueFormatter.DefaultNumericFormat;

    constructor(options: IVisualComponentConstructorOptions) {
        super();

        this.initElement(
            options.element,
            this.className,
            "svg",
        );

        this.gElement = this.element.append("g");
    }

    public preRender(options: IYAxisComponentRenderOptions): void {
        if (!this.areRenderOptionsValid(options)) {
            return;
        }

        const {
            axis,
            settings,
        } = options;

        if (settings.isElementShown()) {
            this.show();
        } else {
            this.hide();
        }

        const fontSize: number = settings.fontSizeInPx;

        this.formatter = labelMeasurementService.getValueFormatter(
            Number(settings.displayUnits.value.value) || axis.max,
            undefined,
            undefined,
            undefined,
            settings.precision.value,
            axis.format || this.valueFormat,
        );

        this.maxLabelHeight = labelMeasurementService.getLabelHeight(
            axis.max,
            this.formatter,
            fontSize,
            settings.font.fontFamily.value,
        );
    }

    public render(options: IYAxisComponentRenderOptions): void {
        if (!this.areRenderOptionsValid(options)) {
            this.hide();

            this.axisProperties = null;

            return;
        }

        const {
            axis,
            margin,
            settings,
            viewport,
        } = options;

        const height: number = Math.max(0, viewport.height - margin.top - margin.bottom);

        this.axisProperties = this.getAxisProperties(
            height,
            [axis.min, axis.max],
            settings.density.value,
            settings.density.value === settings.maxDensity,
        );

        if (!this.isShown) {
            return;
        }

        this.maxLabelWidth = settings.isElementShown()
            ? labelMeasurementService.getLabelWidth(
                this.getTicks(),
                this.formatter,
                settings.fontSizeInPx,
                settings.font.fontFamily.value,
            )
            : 0;

        const availableWidth: number = viewport.width / 2;

        let shouldLabelsBeTruncated: boolean = false;

        if (this.maxLabelWidth > availableWidth) {
            this.maxLabelWidth = availableWidth;

            shouldLabelsBeTruncated = true;
        }

        this.element
            .style("padding", `${pixelConverter.toString(margin.top)} 0 ${pixelConverter.toString(this.maxLabelHeight / 2)} 0`);

        this.updateViewport({
            height,
            width: this.getTickWidth(),
        });

        this.gElement.attr("transform", svgManipulation.translate(
            this.maxLabelWidth + this.labelOffset,
            this.maxLabelHeight / 2,
        ));

        this.axisProperties.axis.tickFormat((item: number) => {
            const formattedLabel: string = this.formatter.format(item);

            if (shouldLabelsBeTruncated) {
                return textMeasurementService.textMeasurementService.getTailoredTextOrDefault(
                    labelMeasurementService.getTextProperties(formattedLabel, settings.fontSizeInPx, settings.font.fontFamily.value),
                    availableWidth,
                );
            }

            return formattedLabel;
        });

        this.gElement
            .call(this.axisProperties.axis)
            .attr("font-family", settings.font.fontFamily.value)
            .attr("font-size", settings.fontSizeInPx)
            .attr("fill", settings.fontColor.value.value)
            .attr("color", settings.fontColor.value.value);
    }

    public getViewport(): IVisualComponentViewport {
        if (!this.isShown) {
            return {
                height: 0,
                width: 0,
            };
        }

        return {
            height: this.maxLabelHeight / 2,
            width: this.getTickWidth(),
        };
    }

    private getAxisProperties(
        pixelSpan: number,
        dataDomain: any[],
        density: number,
        isDensityAtMax: boolean,
    ) {
        return createAxis({
            dataDomain,
            density,
            formatString: undefined,
            innerPaddingRatio: 1,
            is100Pct: true,
            isCategoryAxis: false,
            isScalar: true,
            isVertical: true,
            metaDataColumn: null,
            minOrdinalRectThickness: this.maxLabelHeight,
            outerPadding: this.maxLabelHeight / 2,
            pixelSpan,
            shouldClamp: false,
            shouldTheMinValueBeIncluded: isDensityAtMax,
            tickLabelPadding: undefined,
            useTickIntervalForDisplayUnits: true,
        });
    }

    private getTickWidth(): number {
        return this.maxLabelWidth + this.additionalOffset;
    }

    private areRenderOptionsValid(options: IYAxisComponentRenderOptions): boolean {
        return !!(options && options.axis && options.settings);
    }
}
