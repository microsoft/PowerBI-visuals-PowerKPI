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
            // For a categorical (string) axis, axis.scale.getDomain() already contains
            // every category label the axis can show - not just the endpoints - so any
            // one of them (e.g. a longer middle category) can be the widest rendered
            // label. Measuring only [axis.min, axis.max] under-estimated label width in
            // that case, which fed an under-estimated minOrdinalRectThickness into the
            // tick-count/density calculation and let too many ticks be selected.
            // Scalar (numeric/date) axes don't have discrete categories to sample - the
            // domain is just [min, max] - so behavior there is unchanged.
            axis.scale.isCategorical && domain.length
                ? domain
                : [axis.min, axis.max],
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
        const domain: any[] = axis.scale.getDomain();
        const isScalar: boolean = !axis.scale.isCategorical;

        this.axisProperties = this.getAxisProperties(
            width,
            domain,
            axis.metadata,
            isScalar,
            settings.percentile.value,
        );

        this.refitAxisPropertiesToActualLabelWidth(width, domain, axis, settings, isScalar);

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

        this.axisProperties.axis
            .tickFormat((item: number) => this.getFormattedAndFittedTickLabel(item, axis, settings, width));

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
        dataDomain: any[],
        metaDataColumn: powerbi.DataViewMetadataColumn,
        isScalar: boolean,
        density: number,
    ) {
        return createAxis({
            dataDomain,
            density,
            formatString: undefined,
            innerPaddingRatio: 1,
            isCategoryAxis: true,
            isScalar,
            isVertical: false,
            metaDataColumn,
            minOrdinalRectThickness: this.maxElementWidth + this.labelPadding,
            outerPadding: 0,
            pixelSpan,
            shouldClamp: false,
            tickLabelPadding: undefined,
            useTickIntervalForDisplayUnits: true,
        });
    }

    /**
     * The label width used to pick the tick count (this.maxElementWidth, computed in
     * preRender()) is only an estimate - the formatter that actually renders date-axis labels
     * (this.axisProperties.formatter) is only resolved *after* createAxis() picks
     * tickValues/bestTickCount, so it can legitimately produce wider text than assumed.
     * If the real widest label doesn't fit in its own tick slot (xLabelMaxWidth), recreate the
     * axis with a bigger thickness estimate so *fewer, wider-spaced* ticks are chosen - instead
     * of keeping the original tick count and truncating every single label down to an
     * unreadable "Jan …", "Feb …", "Mar …" run.
     */
    private refitAxisPropertiesToActualLabelWidth(
        width: number,
        domain: any[],
        axis: IDataRepresentationX,
        settings: AxisDescriptor,
        isScalar: boolean,
    ): void {
        const maxRefitAttempts: number = 4;

        for (let attempt: number = 0; attempt < maxRefitAttempts; attempt++) {
            const actualMaxLabelWidth: number = this.getActualMaxTickLabelWidth(axis, settings);
            const perTickWidth: number = this.axisProperties.xLabelMaxWidth;
            const tickCount: number = this.getTicks().length;

            const labelDoesNotFit: boolean =
                !isNaN(actualMaxLabelWidth)
                && actualMaxLabelWidth > 0
                && !isNaN(perTickWidth)
                && perTickWidth > 0
                && actualMaxLabelWidth > perTickWidth;

            // Once we are down to a single tick, xLabelMaxWidth already equals the full
            // available width - there is no more room to gain by asking for even fewer
            // ticks, so stop iterating and let the render-time truncation guard handle the
            // (now unavoidable) case where a single label still doesn't fit.
            if (!labelDoesNotFit || tickCount <= 1 || actualMaxLabelWidth <= this.maxElementWidth) {
                break;
            }

            const previousAxisProperties = this.axisProperties;
            const previousMaxElementWidth: number = this.maxElementWidth;

            this.maxElementWidth = actualMaxLabelWidth;

            this.axisProperties = this.getAxisProperties(
                width,
                domain,
                axis.metadata,
                isScalar,
                settings.percentile.value,
            );

            // Not every axis type floors its tick count at 1 the way date axes do (see
            // MinAmountOfTicksForDates in axisHelper.ts) - e.g. a purely numeric axis can have
            // its tick count computed straight down to 0 once minOrdinalRectThickness exceeds
            // the available pixel span. Rendering zero tick labels is worse than the
            // overlap/truncation this loop exists to avoid, so undo this attempt and stop.
            if (this.getTicks().length === 0) {
                this.axisProperties = previousAxisProperties;
                this.maxElementWidth = previousMaxElementWidth;

                break;
            }
        }
    }

    /**
     * Formats a tick value the way render() will draw it, then shortens it with an ellipsis
     * only if it still doesn't fit the space actually available to it - its own tick slot
     * (xLabelMaxWidth) first, falling back to the whole axis width as a last resort. Comparing
     * against the whole axis width alone almost never triggers for categorical/date labels,
     * which is why labels used to overlap instead of being shortened when the visual got
     * narrower and/or the font got larger.
     */
    private getFormattedAndFittedTickLabel(
        item: number,
        axis: IDataRepresentationX,
        settings: AxisDescriptor,
        width: number,
    ): string {
        const formattedLabel: string = this.formatTickValue(item, axis);

        const formattedLabelWidth: number = labelMeasurementService.getTextWidth(
            formattedLabel,
            settings.fontSizeInPx,
            settings.font.fontFamily.value,
        );

        const perTickWidth: number = this.axisProperties.xLabelMaxWidth;

        let availableWidth: number = NaN;

        if (!isNaN(perTickWidth) && perTickWidth > 0 && formattedLabelWidth > perTickWidth) {
            availableWidth = perTickWidth;
        } else if (formattedLabelWidth > width) {
            availableWidth = width;
        }

        if (!isNaN(availableWidth)) {
            return textMeasurementService.getTailoredTextOrDefault(
                labelMeasurementService.getTextProperties(formattedLabel, settings.fontSizeInPx, settings.font.fontFamily.value),
                availableWidth,
            );
        }

        return formattedLabel;
    }

    /**
     * Formats a raw tick value the same way it will be rendered on the axis. For date axes the
     * label is produced by this.axisProperties.formatter, which is only resolved once
     * createAxis() has picked the tick count/interval - it is not known ahead of time (see
     * this.getValueFormatterOfXAxis() for why the preRender() estimate can differ).
     */
    private formatTickValue(item: number, axis: IDataRepresentationX): string {
        const currentValue: any = axis.axisType === DataRepresentationTypeEnum.DateType
            ? new Date(item)
            : item;

        return axis.axisType === DataRepresentationTypeEnum.DateType
            ? this.axisProperties.formatter.format(currentValue)
            : this.formatter.format(currentValue);
    }

    /**
     * Measures the widest label among the ticks currently selected by this.axisProperties
     * (i.e. the labels that will actually be drawn at the current tick count), using the same
     * formatter/font that render() will use. Used to detect when the tick-count estimate from
     * preRender() under-shot the real label width, so the axis can be recreated with fewer,
     * wider-spaced ticks instead of truncating every label.
     */
    private getActualMaxTickLabelWidth(axis: IDataRepresentationX, settings: AxisDescriptor): number {
        const tickValues: any[] = (this.axisProperties && this.axisProperties.axis.tickValues()) || [];

        if (!tickValues.length) {
            return NaN;
        }

        return tickValues.reduce((maxWidth: number, tickValue: any) => {
            const formattedLabel: string = this.formatTickValue(tickValue, axis);

            const labelWidth: number = labelMeasurementService.getTextWidth(
                formattedLabel,
                settings.fontSizeInPx,
                settings.font.fontFamily.value,
            );

            return Math.max(maxWidth, labelWidth);
        }, 0);
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
