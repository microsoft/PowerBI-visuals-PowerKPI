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
import ISandboxExtendedColorPalette = powerbi.extensibility.ISandboxExtendedColorPalette;

import { IDataRepresentationX } from "../../dataRepresentation/dataRepresentationAxis";
import { DataRepresentationAxisValueType } from "../../dataRepresentation/dataRepresentationAxisValueType";
import { DataRepresentationTypeEnum } from "../../dataRepresentation/dataRepresentationType";
import { AxisDescriptor } from "../../settings/descriptors/axis/axisDescriptor";
import { IVisualComponentViewport } from "../base/visualComponent";
import { IVisualComponentConstructorOptions } from "../base/visualComponentConstructorOptions";

import { createAxis } from "./helpers/axisHelper";

import {
    AxisBaseComponent,
    IAxisComponent,
} from "./axisBaseComponent";

import { labelMeasurementService } from "../../services/labelMeasurementService";

export interface IXAxisComponentRenderOptions {
    axis: IDataRepresentationX;
    settings: AxisDescriptor;
    viewport: powerbi.IViewport;
    margin: IMargin;
    additionalMargin: IMargin;
    colorPalette: ISandboxExtendedColorPalette;
}

export class XAxisComponent
    extends AxisBaseComponent<IVisualComponentConstructorOptions, IXAxisComponentRenderOptions>
    implements IAxisComponent<IXAxisComponentRenderOptions> {

    private labelPadding: number = 8;

    private className: string = "visualXAxis";
    private elementClassNameContainer: string = "visualXAxisContainer";

    private maxElementHeight: number = 0;
    private maxElementWidth: number = 0;

    private firstLabelWidth: number = 0;
    private latestLabelWidth: number = 0;

    private mainElementYOffset: number = -7.5;

    private defaultTickNumber: number = 50;

    private additionalLabelHeight: number = 5;
    private additionalLabelWidth: number = 8;

    constructor(options: IVisualComponentConstructorOptions) {
        super();

        this.element = options.element
            .append("div")
            .classed(this.className, true)
            .append("svg")
            .classed(this.elementClassNameContainer, true);

        this.gElement = this.element
            .append("g")
            .attr("transform", svgManipulation.translate(0, this.mainElementYOffset));
    }

    public preRender(options: IXAxisComponentRenderOptions): void {
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

        this.formatter = this.getValueFormatterOfXAxis(axis, settings);

        const domain: any[] = axis.scale.getDomain();

        this.maxElementHeight = labelMeasurementService.getLabelHeight(
            axis.max,
            this.formatter,
            fontSize,
            settings.font.fontFamily.value,
        );

        this.maxElementWidth = labelMeasurementService.getLabelWidth(
            [axis.min, axis.max],
            this.formatter,
            fontSize,
            settings.font.fontFamily.value,
        );

        this.firstLabelWidth = this.getLabelWidthWithAdditionalOffset(
            [domain[0] || ""],
            this.formatter,
            fontSize,
            settings.font.fontFamily.value,
        ) / 2;

        this.latestLabelWidth = this.getLabelWidthWithAdditionalOffset(
            [domain.slice(-1)[0] || ""],
            this.formatter,
            fontSize,
            settings.font.fontFamily.value,
        ) / 2;
    }

    public render(options: IXAxisComponentRenderOptions): void {
        if (!this.areRenderOptionsValid(options)) {
            this.hide();

            this.axisProperties = null;

            return;
        }

        const {
            axis,
            settings,
            viewport,
            margin,
            additionalMargin,
            colorPalette
        } = options;

        const width: number = Math.max(0, viewport.width - margin.left - margin.right);

        this.axisProperties = this.getAxisProperties(
            width,
            axis.scale.getDomain(),
            axis.metadata,
            !axis.scale.isCategorical,
            settings.percentile.value,
        );

        if (!this.isShown) {
            return;
        }

        this.updateViewport({
            height: this.maxElementHeight,
            width,
        });

        this.element.style(
            "margin-left",
            pixelConverter.toString(margin.left + additionalMargin.left),
        );

        this.gElement.attr("transform", svgManipulation.translate(0, 0));

        this.thinAxisIfLabelsOverflow(
            axis,
            settings,
            width,
            axis.scale.getDomain(),
            axis.metadata,
            !axis.scale.isCategorical,
            settings.percentile.value,
        );

        this.axisProperties.axis
            .tickFormat((item: number | Date | string) => {
                const formattedLabel: string = this.formatTickLabel(item, axis);

                let availableWidth: number = NaN;

                if (this.maxElementWidth > width) {
                    availableWidth = width;
                }

                if (!isNaN(availableWidth)) {
                    return textMeasurementService.getTailoredTextOrDefault(
                        labelMeasurementService.getTextProperties(formattedLabel, settings.fontSizeInPx, settings.font.fontFamily.value),
                        availableWidth,
                    );
                }

                return formattedLabel;
            });

        const isHighContrast: boolean = colorPalette.isHighContrast;
        
        this.gElement
            .call(this.axisProperties.axis)
            .attr("font-family", settings.font.fontFamily.value)
            .attr("font-size", settings.fontSizeInPx)
            .attr("fill", isHighContrast ? colorPalette.background.value : settings.fontColor.value.value)
            .attr("color", isHighContrast ? colorPalette.foreground.value :  settings.fontColor.value.value);
    }

    public getViewport(): IVisualComponentViewport {
        if (!this.isShown) {
            return {
                height: 0,
                height2: 0,
                width: 0,
                width2: 0,
            };
        }

        const height: number = this.maxElementHeight + this.additionalLabelHeight;

        return {
            height,
            height2: 0,
            width: this.firstLabelWidth,
            width2: this.latestLabelWidth,
        };
    }

    private formatTickLabel(item: number | Date | string, axis: IDataRepresentationX): string {
        if (axis.axisType === DataRepresentationTypeEnum.DateType) {
            // Handles number (ms timestamp), Date object, or ISO date string.
            // Falls back to String(item) when the value cannot be parsed as a valid date
            // (e.g. a pre-formatted label string) to avoid passing Invalid Date to the formatter.
            const date: Date = item instanceof Date ? item : new Date(item);
            if (!isNaN(date.getTime())) {
                return this.axisProperties.formatter.format(date);
            }
            return String(item);
        }
        if (typeof item === "string") {
            return item;  // categorical string — return verbatim
        }
        return this.formatter.format(item);
    }

    private thinAxisIfLabelsOverflow(
        axis: IDataRepresentationX,
        settings: AxisDescriptor,
        width: number,
        dataDomain: DataRepresentationAxisValueType[],
        metaDataColumn: powerbi.DataViewMetadataColumn,
        isScalar: boolean,
        density: number,
    ): void {
        if (width <= 0) {
            return;
        }

        const rawTickValues: Array<number | Date | string> | null =
            this.axisProperties.axis.tickValues();

        if (!rawTickValues || rawTickValues.length <= 1) {
            return;
        }

        let actualMaxLabelWidth: number = 0;
        for (const tickValue of rawTickValues) {
            const label: string = this.formatTickLabel(tickValue, axis);
            const labelWidth: number = labelMeasurementService.getTextWidth(
                label,
                settings.fontSizeInPx,
                settings.font.fontFamily.value,
            );

            if (labelWidth > actualMaxLabelWidth) {
                actualMaxLabelWidth = labelWidth;
            }
        }

        if (actualMaxLabelWidth <= this.maxElementWidth) {
            // The original assumption already covers the actual label width — no thinning needed.
            return;
        }

        this.axisProperties = this.getAxisProperties(
            width,
            dataDomain,
            metaDataColumn,
            isScalar,
            density,
            actualMaxLabelWidth + this.labelPadding,
        );

        const thinnedTickValues: Array<number | Date | string> | null =
            this.axisProperties.axis.tickValues();

        if (thinnedTickValues && thinnedTickValues.length === 1 && thinnedTickValues[0] !== rawTickValues[0]) {
            this.axisProperties.axis.tickValues([rawTickValues[0]]);
        }
    }

    protected getLabelWidthWithAdditionalOffset(
        values: DataRepresentationAxisValueType[],
        formatter: valueFormatter.IValueFormatter,
        fontSize: number,
        fontFamily: string,
    ): number {
        const width: number = labelMeasurementService.getLabelWidth(
            values,
            formatter,
            fontSize,
            fontFamily,
        );

        return width > 0
            ? width + this.additionalLabelWidth
            : 0;
    }

    private getAxisProperties(
        pixelSpan: number,
        dataDomain: DataRepresentationAxisValueType[],
        metaDataColumn: powerbi.DataViewMetadataColumn,
        isScalar: boolean,
        density: number,
        minOrdinalRectThickness: number = this.maxElementWidth + this.labelPadding,
    ) {
        return createAxis({
            dataDomain: dataDomain as number[],
            density,
            formatString: undefined,
            innerPaddingRatio: 1,
            isCategoryAxis: true,
            isScalar,
            isVertical: false,
            metaDataColumn,
            minOrdinalRectThickness,
            outerPadding: 0,
            pixelSpan,
            shouldClamp: false,
            tickLabelPadding: undefined,
            useTickIntervalForDisplayUnits: true,
        });
    }

    private areRenderOptionsValid(options: IXAxisComponentRenderOptions): boolean {
        return !!(options && options.axis && options.settings);
    }

    private getValueFormatterOfXAxis(x: IDataRepresentationX, xAxis: AxisDescriptor): valueFormatter.IValueFormatter {
        let minValue: DataRepresentationAxisValueType;
        let maxValue: DataRepresentationAxisValueType;
        let precision: number;

        if (x.axisType === DataRepresentationTypeEnum.NumberType) {
            minValue = xAxis.displayUnits.value || x.max;
            precision = xAxis.precision.value;
        } else {
            minValue = x.min;
            maxValue = x.max;
        }

        const tickNumber: number = x.axisType === DataRepresentationTypeEnum.StringType
            ? undefined
            : this.defaultTickNumber;

        return labelMeasurementService.getValueFormatter(
            minValue,
            maxValue,
            x.metadata,
            tickNumber,
            precision,
            x.format || undefined,
        );
    }
}
