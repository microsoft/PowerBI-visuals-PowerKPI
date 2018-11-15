/*
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
    Axis,
    axisBottom,
    axisLeft,
    range as d3Range,
    ScaleLinear,
    scaleLinear,
    ScaleOrdinal,
    scaleOrdinal,
} from "d3";

import powerbi from "powerbi-visuals-api";

import {
    dateTimeSequence,
    formattingService,
    valueFormatter,
} from "powerbi-visuals-utils-formattingutils";

import { valueType } from "powerbi-visuals-utils-typeutils";

import {
    axis as axisModule,
    axisInterfaces,
    axisScale,
} from "powerbi-visuals-utils-chartutils";

const DefaultOuterPadding: number = 0;

const DefaultInnerTickSize: number = 6;
const DefaultOuterTickSize: number = 0;

const DefaultXLabelMaxWidth: number = 1;
const DefaultXLabelFactor: number = 2;

const DefaultMinInterval: number = 0;
const MinTickInterval100Pct: number = 0.01;
const MinTickIntervalInteger: number = 1;

const RecommendedNumberOfTicksSmall: number = 3;
const RecommendedNumberOfTicksMiddle: number = 5;
const RecommendedNumberOfTicksLarge: number = 8;

const AvailableWidthYAxisSmall: number = 150;
const AvailableWidthYAxisMiddle: number = 300;

const MinAmountOfTicksForDates: number = 1;
const MinAmountOfTicks: number = 0;

/**
 * Default ranges are for when we have a field chosen for the axis,
 * but no values are returned by the query.
 */
export let emptyDomain = [0, 0];

const TickLabelPadding: number = 2; // between text labels, used by AxisHelper
const MinOrdinalRectThickness: number = 20;

const ScalarTickLabelPadding: number = 3;
const MinTickCount: number = 2;
const DefaultBestTickCount: number = 3;

export interface ICreateScaleResult {
    scale: ScaleLinear<any, any>;
    bestTickCount: number;
    usingDefaultDomain?: boolean;
}

export interface ICreateAxisOptions extends axisInterfaces.CreateAxisOptions {
    innerPaddingRatio: number;
    tickLabelPadding: number;
    minOrdinalRectThickness: number;
    density: number;
    shouldTheMinValueBeIncluded?: boolean;
}

/**
 * Create a D3 axis including scale. Can be vertical or horizontal, and either datetime, numeric, or text.
 * @param options The properties used to create the axis.
 */
export function createAxis(options: ICreateAxisOptions): axisInterfaces.IAxisProperties {
    const pixelSpan: number = options.pixelSpan;
    const dataDomain: number[] = options.dataDomain;
    const metaDataColumn: powerbi.DataViewMetadataColumn = options.metaDataColumn as powerbi.DataViewMetadataColumn;
    const formatString: string = options.formatString;
    const outerPadding: number = options.outerPadding || DefaultOuterPadding;
    const isCategoryAxis: boolean = !!options.isCategoryAxis;
    const isScalar: boolean = !!options.isScalar;
    const isVertical: boolean = !!options.isVertical;
    const useTickIntervalForDisplayUnits: boolean = !!options.useTickIntervalForDisplayUnits;
    const getValueFn: (index: number, type: powerbi.ValueTypeDescriptor) => any = options.getValueFn;
    let categoryThickness: number = options.categoryThickness;
    const axisDisplayUnits: number = options.axisDisplayUnits;
    const axisPrecision: number = options.axisPrecision;
    const is100Pct: boolean = !!options.is100Pct;
    const tickLabelPadding: number = options.tickLabelPadding || TickLabelPadding;

    const dataType: powerbi.ValueTypeDescriptor = getCategoryValueType(metaDataColumn, isScalar);

    // Create the Scale
    const scaleResult: ICreateScaleResult = createScale(options);
    const scale: ScaleLinear<any, any> = scaleResult.scale;
    const bestTickCount: number = scaleResult.bestTickCount;
    const scaleDomain: number[] = scale.domain();
    const isLogScaleAllowed: boolean = isLogScalePossible(dataDomain, dataType);

    // fix categoryThickness if scalar and the domain was adjusted when making the scale "nice"
    if (categoryThickness && isScalar && dataDomain && dataDomain.length === 2) {
        const oldSpan: number = dataDomain[1] - dataDomain[0];
        const newSpan: number = scaleDomain[1] - scaleDomain[0];

        if (oldSpan > 0 && newSpan > 0) {
            categoryThickness = categoryThickness * oldSpan / newSpan;
        }
    }

    const minTickInterval: number = isScalar
        ? getMinTickValueInterval(formatString, dataType, is100Pct)
        : undefined;

    let tickValues: any[] = getRecommendedTickValues(
        bestTickCount,
        scale,
        dataType,
        isScalar,
        minTickInterval,
        options.shouldTheMinValueBeIncluded);

    if (isScalar
        && bestTickCount === 1
        && tickValues
        && tickValues.length > 1
    ) {
        tickValues = [tickValues[0]];
    }

    if (options.scaleType && options.scaleType === axisScale.log && isLogScaleAllowed) {
        tickValues = tickValues.filter((d: any) => {
            return powerOfTen(d);
        });
    }

    const formatter: valueFormatter.IValueFormatter = createFormatter(
        scaleDomain,
        dataDomain,
        dataType,
        isScalar,
        formatString,
        bestTickCount,
        tickValues,
        getValueFn,
        useTickIntervalForDisplayUnits,
        axisDisplayUnits,
        axisPrecision);

    const axisInstance = isVertical
        ? axisLeft(scale)
        : axisBottom(scale);

    const axis = axisInstance
        .tickSizeInner(DefaultInnerTickSize)
        .tickSizeOuter(DefaultOuterTickSize)
        .ticks(bestTickCount)
        .tickValues(tickValues);

    let formattedTickValues: any[] = [];
    if (metaDataColumn) {
        formattedTickValues = formatAxisTickValues(axis, tickValues, formatter, dataType, getValueFn);
    }

    let xLabelMaxWidth: number;
    // Use category layout of labels if specified, otherwise use scalar layout of labels
    if (!isScalar && categoryThickness) {
        xLabelMaxWidth = Math.max(
            DefaultXLabelMaxWidth,
            categoryThickness - tickLabelPadding * DefaultXLabelFactor);
    }
    else {
        // When there are 0 or 1 ticks, then xLabelMaxWidth = pixelSpan
        xLabelMaxWidth = tickValues.length > DefaultXLabelMaxWidth
            ? getScalarLabelMaxWidth(scale, tickValues)
            : pixelSpan;

        xLabelMaxWidth = xLabelMaxWidth - ScalarTickLabelPadding * DefaultXLabelFactor;
    }

    return {
        axis,
        axisLabel: null,
        axisType: dataType as unknown as valueType.ValueType,
        categoryThickness,
        dataDomain,
        formatter,
        isCategoryAxis,
        isLogScaleAllowed,
        outerPadding,
        scale,
        usingDefaultDomain: scaleResult.usingDefaultDomain,
        values: formattedTickValues,
        xLabelMaxWidth,
    };
}

/**
 * Indicates whether the number is power of 10.
 */
export function powerOfTen(d: any): boolean {
    const value: number = Math.abs(d);
    // formula log2(Y)/log2(10) = log10(Y)
    // because double issues this won"t return exact value
    // we need to ceil it to nearest number.
    let log10: number = Math.log(value) / Math.LN10;
    log10 = Math.ceil(log10 - 1e-12);

    return value / Math.pow(10, log10) === 1;
}

function getScalarLabelMaxWidth(scale: ScaleLinear<number, number>, tickValues: number[]): number {
    // find the distance between two ticks. scalar ticks can be anywhere, such as:
    // |---50----------100--------|
    if (scale && tickValues && tickValues.length) {
        return Math.abs(scale(tickValues[1]) - scale(tickValues[0]));
    }

    return DefaultXLabelMaxWidth;
}

export function createFormatter(
    scaleDomain: any[],
    dataDomain: any[],
    dataType: any,
    isScalar: boolean,
    formatString: string,
    bestTickCount: number,
    tickValues: any[],
    getValueFn: any,
    useTickIntervalForDisplayUnits: boolean = false,
    axisDisplayUnits?: number,
    axisPrecision?: number): valueFormatter.IValueFormatter {

    let formatter: valueFormatter.IValueFormatter;
    if (dataType.dateTime) {
        if (isScalar) {
            let value: Date = new Date(scaleDomain[0]);
            let value2: Date = new Date(scaleDomain[1]);
            // datetime with only one value needs to pass the same value
            // (from the original dataDomain value, not the adjusted scaleDomain)
            // so formatting works correctly.
            if (bestTickCount === 1) {
                value = value2 = new Date(dataDomain[0]);
            }

            // this will ignore the formatString and create one based on the smallest non-zero portion of the values supplied.
            formatter = valueFormatter.valueFormatter.create({
                format: formatString,
                tickCount: bestTickCount,
                value,
                value2,
            });
        }
        else {
            // Use the model formatString for ordinal datetime
            formatter = valueFormatter.valueFormatter.createDefaultFormatter(formatString, true);
        }
    }
    else {
        if (useTickIntervalForDisplayUnits && isScalar && tickValues.length > 1) {
            const value1: number = axisDisplayUnits
                ? axisDisplayUnits
                : tickValues[1] - tickValues[0];

            const options: valueFormatter.ValueFormatterOptions = {
                allowFormatBeautification: true,
                format: formatString,
                value: value1,
                value2: 0, // force tickInterval or display unit to be used
            };

            if (axisPrecision) {
                options.precision = axisPrecision;
            } else {
                options.precision = axisModule.calculateAxisPrecision(
                    tickValues[0],
                    tickValues[1],
                    axisDisplayUnits,
                    formatString,
                );
            }

            formatter = valueFormatter.valueFormatter.create(options);
        }
        else {
            // do not use display units, just the basic value formatter
            // datetime is handled above, so we are ordinal and either boolean, numeric, or text.
            formatter = valueFormatter.valueFormatter.createDefaultFormatter(formatString, true);
        }
    }

    return formatter;
}

export function getMinTickValueInterval(formatString: string, columnType: powerbi.ValueTypeDescriptor, is100Pct?: boolean): number {
    const isCustomFormat: boolean = formatString && !formattingService.numberFormat.isStandardFormat(formatString);

    if (isCustomFormat) {
        let precision: number = formattingService.numberFormat.getCustomFormatMetadata(formatString, true).precision;

        if (formatString.indexOf("%") > -1) {
            precision += 2; // percent values are multiplied by 100 during formatting
        }

        return Math.pow(10, -precision);
    }
    else if (is100Pct) {
        return MinTickInterval100Pct;
    }
    else if (columnType.integer) {
        return MinTickIntervalInteger;
    }

    return DefaultMinInterval;
}

/**
 * Format the linear tick labels or the category labels.
 */
function formatAxisTickValues(
    axis: Axis<any>,
    tickValues: any[],
    formatter: valueFormatter.IValueFormatter,
    dataType: powerbi.ValueTypeDescriptor,
    getValueFn?: (index: number, type: powerbi.ValueTypeDescriptor) => any): any[] {

    let formattedTickValues: any[] = [];

    if (!getValueFn) {
        getValueFn = (data) => data;
    }

    if (formatter) {
        axis.tickFormat((d) => formatter.format(getValueFn(d, dataType)));
        formattedTickValues = tickValues.map((d) => formatter.format(getValueFn(d, dataType)));
    }
    else {
        formattedTickValues = tickValues.map((d) => getValueFn(d, dataType));
    }

    return formattedTickValues;
}

export function isLogScalePossible(domain: any[], axisType?: powerbi.ValueTypeDescriptor): boolean {
    if (domain == null || domain.length < 2 || isDateTime(axisType)) {
        return false;
    }

    return (domain[0] > 0 && domain[1] > 0)
        || (domain[0] < 0 && domain[1] < 0); // domain must exclude 0
}

export function isDateTime(type: powerbi.ValueTypeDescriptor): boolean {
    return !!(type && type.dateTime);
}

export function getRecommendedTickValues(
    maxTicks: number,
    scale: ScaleLinear<number, number>,
    axisType: powerbi.ValueTypeDescriptor,
    isScalar: boolean,
    minTickInterval?: number,
    shouldTheMinValueBeIncluded: boolean = false): any[] {

    if (!isScalar || isOrdinalScale(scale)) {
        return getRecommendedTickValuesForAnOrdinalRange(maxTicks, scale.domain() as any);
    }
    else if (isDateTime(axisType)) {
        return getRecommendedTickValuesForADateTimeRange(maxTicks, scale.domain());
    }

    return getRecommendedTickValuesForAQuantitativeRange(
        maxTicks,
        scale,
        minTickInterval,
        shouldTheMinValueBeIncluded);
}

export function getRecommendedTickValuesForAnOrdinalRange(maxTicks: number, labels: string[]): string[] {
    const tickLabels: string[] = [];

    // return no ticks in this case
    if (maxTicks <= 0) {
        return tickLabels;
    }

    const len: number = labels.length;

    if (maxTicks > len) {
        return labels;
    }

    for (let i: number = 0, step = Math.ceil(len / maxTicks); i < len; i += step) {
        tickLabels.push(labels[i]);
    }

    return tickLabels;
}

export function getRecommendedTickValuesForAQuantitativeRange(
    maxTicks: number,
    scale: ScaleLinear<number, number>,
    minInterval?: number,
    shouldTheMinValueBeIncluded: boolean = false): number[] {

    let tickLabels: number[] = [];

    // if maxticks is zero return none
    if (maxTicks === 0) {
        return tickLabels;
    }

    if (scale.ticks) {
        if (shouldTheMinValueBeIncluded && scale.domain) {
            const domain: number[] = scale.domain();

            const minValue: number = domain[0];
            const maxValue: number = domain[1] !== undefined && domain[1] !== null
                ? domain[1]
                : minValue;

            const span: number = Math.abs(maxValue - minValue);

            let step: number = Math.pow(10, Math.floor(Math.log(span / maxTicks) / Math.LN10));

            const err: number = maxTicks / span * step;

            if (err <= .15) {
                step *= 10;
            } else if (err <= .35) {
                step *= 5;
            } else if (err <= .75) {
                step *= 2;
            }

            if (!isNaN(step) && isFinite(step)) {
                tickLabels = d3Range(minValue, maxValue, step);
            }
        } else {

            tickLabels = scale.ticks(maxTicks);

            if (tickLabels.length > maxTicks && maxTicks > 1) {
                tickLabels = scale.ticks(maxTicks - 1);
            }

            if (tickLabels.length < MinTickCount) {
                tickLabels = scale.ticks(maxTicks + 1);
            }
        }

        tickLabels = createTrueZeroTickLabel(tickLabels);

        if (minInterval && tickLabels.length > 1) {
            let tickInterval: number = tickLabels[1] - tickLabels[0];

            while (tickInterval > 0 && tickInterval < minInterval) {
                for (let i = 1; i < tickLabels.length; i++) {
                    tickLabels.splice(i, 1);
                }

                tickInterval = tickInterval * 2;
            }

            if (tickLabels.length === 1) {
                tickLabels.push(tickLabels[0] + minInterval);
            }
        }

        return tickLabels;
    }

    return tickLabels;
}

function getRecommendedTickValuesForADateTimeRange(maxTicks: number, dataDomain: number[]): number[] {
    let tickLabels: number[] = [];

    if (dataDomain[0] === 0 && dataDomain[1] === 0) {
        return [];
    }

    const dateTimeTickLabels: Date[] = dateTimeSequence.DateTimeSequence.calculate(
        new Date(dataDomain[0]),
        new Date(dataDomain[1]), maxTicks).sequence;

    tickLabels = dateTimeTickLabels.map((d) => d.getTime());
    tickLabels = ensureValuesInRange(tickLabels, dataDomain[0], dataDomain[1]);

    return tickLabels;
}

export function isOrdinalScale(scale: any): boolean {
    return typeof scale.invert === "undefined";
}

/**
 * Gets the ValueType of a category column, defaults to Text if the type is not present.
 */
export function getCategoryValueType(metadataColumn: powerbi.DataViewMetadataColumn, isScalar?: boolean): powerbi.ValueTypeDescriptor {
    if (metadataColumn && columnDataTypeHasValue(metadataColumn.type)) {
        return metadataColumn.type;
    }

    if (isScalar) {
        return valueType.ValueType.fromDescriptor({ numeric: true });
    }

    return valueType.ValueType.fromDescriptor({ text: true });
}

export function columnDataTypeHasValue(dataType: powerbi.ValueTypeDescriptor) {
    return dataType && (dataType.bool || dataType.numeric || dataType.text || dataType.dateTime);
}

export function createScale(options: ICreateAxisOptions): ICreateScaleResult {
    const {
        pixelSpan,
        metaDataColumn,
        isScalar,
        isVertical,
        forcedTickCount,
        shouldClamp,
        maxTickCount,
        density,
    } = options;

    let { dataDomain } = options;

    const outerPadding: number = options.outerPadding || DefaultOuterPadding;
    const minOrdinalRectThickness: number = options.minOrdinalRectThickness || MinOrdinalRectThickness;

    const dataType: powerbi.ValueTypeDescriptor = getCategoryValueType(metaDataColumn as powerbi.DataViewMetadataColumn, isScalar);

    let maxTicks: number = isVertical
        ? getRecommendedNumberOfTicksForYAxis(pixelSpan)
        : getRecommendedNumberOfTicksForXAxis(pixelSpan, minOrdinalRectThickness);

    if (maxTickCount &&
        maxTicks > maxTickCount) {

        maxTicks = maxTickCount;
    }

    let scalarDomain: number[] = dataDomain
        ? dataDomain.slice()
        : null;

    let bestTickCount: number = maxTicks;
    let scale: ScaleLinear<number, number> | ScaleOrdinal<any, any>;
    let usingDefaultDomain: boolean = false;

    if (dataDomain == null
        || (dataDomain.length === 2 && dataDomain[0] == null && dataDomain[1] == null)
        || (dataDomain.length !== 2 && isScalar)) {

        usingDefaultDomain = true;

        if (dataType.dateTime || !isOrdinal(dataType)) {
            dataDomain = emptyDomain;
        }
        else { // ordinal
            dataDomain = [];
        }

        if (isOrdinal(dataType)) {
            scale = createOrdinalScale(pixelSpan, dataDomain);
        }
        else {
            scale = createNumericalScale(
                pixelSpan,
                dataDomain,
                outerPadding,
                bestTickCount,
            );
        }
    }
    else {
        if (isScalar && dataDomain.length > 0) {
            bestTickCount = forcedTickCount !== undefined
                ? (maxTicks !== 0 ? forcedTickCount : 0)
                : getBestNumberOfTicks(
                    dataDomain[0],
                    dataDomain[dataDomain.length - 1],
                    [metaDataColumn as powerbi.DataViewMetadataColumn],
                    maxTicks,
                    dataType.dateTime);

            const normalizedRange = normalizeLinearDomain({
                max: dataDomain[dataDomain.length - 1],
                min: dataDomain[0],
            });

            scalarDomain = [
                normalizedRange.min,
                normalizedRange.max,
            ];
        }

        if (isScalar && dataType.numeric && !dataType.dateTime) {
            // Note: Don't pass bestTickCount to createNumericalScale, because it overrides boundaries of the domain.
            scale = createNumericalScale(
                pixelSpan,
                scalarDomain,
                outerPadding,
                null,
                shouldClamp,
            );

            bestTickCount = maxTicks === 0
                ? 0
                : getAmountOfTicksByDensity(Math.floor((pixelSpan - outerPadding) / minOrdinalRectThickness), density);
        }
        else if (isScalar && dataType.dateTime) {
            // Use of a linear scale, instead of a D3.time.scale, is intentional since we want
            // to control the formatting of the time values, since d3"s implementation isn"t
            // in accordance to our design.
            // scalarDomain: should already be in long-int time (via category.values[0].getTime())
            scale = createLinearScale(pixelSpan, scalarDomain, outerPadding, null, shouldClamp); // DO NOT PASS TICKCOUNT

            bestTickCount = maxTicks === 0 ? 0
                : getAmountOfTicksByDensity((Math.max(
                    MinAmountOfTicksForDates,
                    (pixelSpan - outerPadding) / minOrdinalRectThickness)), density);

            bestTickCount = bestTickCount < MinAmountOfTicksForDates
                ? MinAmountOfTicksForDates
                : bestTickCount;
        }
        else if (dataType.text || dataType.dateTime || dataType.numeric || dataType.bool) {
            scale = createOrdinalScale(pixelSpan, scalarDomain);

            bestTickCount = maxTicks === 0
                ? 0
                : getAmountOfTicksByDensity((Math.min(
                    scalarDomain.length,
                    (pixelSpan - outerPadding) / minOrdinalRectThickness)), density);
        }
    }

    // vertical ordinal axis (e.g. categorical bar chart) does not need to reverse
    if (isVertical && isScalar) {
        (scale as ScaleLinear<number, number>).range(scale.range().reverse()); // TODO: check it
    }

    normalizeInfinityInScale(scale as ScaleLinear<number, number>);

    return {
        bestTickCount,
        scale: scale as ScaleLinear<number, number>,
        usingDefaultDomain,
    };
}

function getAmountOfTicksByDensity(amountOfTicks: number, density: number): number {
    return Math.floor(Math.max(amountOfTicks, MinAmountOfTicks) * density / 100);
}

export function normalizeInfinityInScale(scale: ScaleLinear<number, number>): void {
    // When large values (eg Number.MAX_VALUE) are involved, a call to scale.nice occasionally
    // results in infinite values being included in the domain. To correct for that, we need to
    // re-normalize the domain now to not include infinities.
    const scaledDomain: number[] = scale.domain();

    for (let i: number = 0, len = scaledDomain.length; i < len; ++i) {
        if (scaledDomain[i] === Number.POSITIVE_INFINITY) {
            scaledDomain[i] = Number.MAX_VALUE;
        }
        else if (scaledDomain[i] === Number.NEGATIVE_INFINITY) {
            scaledDomain[i] = -Number.MAX_VALUE;
        }
    }

    scale.domain(scaledDomain);
}

export function createOrdinalScale(
    pixelSpan: number,
    dataDomain: any[]): ScaleOrdinal<any, any> {

    return scaleOrdinal()
        .range([0, pixelSpan])
        .domain(dataDomain);
}

// TODO: Types have been removed
function normalizeLinearDomain(domain) {
    if (isNaN(domain.min) || isNaN(domain.max)) {
        domain.min = emptyDomain[0];
        domain.max = emptyDomain[1];
    }
    else if (domain.min === domain.max) {
        // d3 linear scale will give zero tickValues if max === min, so extend a little
        domain.min = domain.min < 0 ? domain.min * 1.2 : domain.min * 0.8;
        domain.max = domain.max < 0 ? domain.max * 0.8 : domain.max * 1.2;
    }
    else {
        // Check that min is very small and is a negligable portion of the whole domain.
        // (fix floating pt precision bugs)
        // sometimes highlight value math causes small negative numbers which makes the axis add
        // a large tick interval instead of just rendering at zero.
        if (Math.abs(domain.min) < 0.0001 && domain.min / (domain.max - domain.min) < 0.0001) {
            domain.min = 0;
        }
    }

    return domain;
}

// this function can return different scales e.g. log, linear
// NOTE: export only for testing, do not access directly
export function createNumericalScale(
    pixelSpan: number,
    dataDomain: any[],
    outerPadding: number = 0,
    niceCount?: number,
    shouldClamp?: boolean,
): ScaleLinear<number, number> {

    return createLinearScale(pixelSpan, dataDomain, outerPadding, niceCount, shouldClamp);
}

// NOTE: export only for testing, do not access directly
export function createLinearScale(
    pixelSpan: number,
    dataDomain: Array<number | Date>,
    outerPadding: number = 0,
    niceCount?: number,
    shouldClamp?: boolean,
): ScaleLinear<any, number> {
    const originalScale: ScaleLinear<number, number> = scaleLinear()
        .range([
            convertToNumber(dataDomain[0]),
            convertToNumber(dataDomain[1]),
        ],
        )
        .domain([0, pixelSpan])
        .clamp(false);

    const end: number = pixelSpan - outerPadding;

    const scale: ScaleLinear<number, number> = scaleLinear()
        .range([0, end])
        .domain([originalScale(0), originalScale(end)])
        .clamp(shouldClamp);

    // we use millisecond ticks since epoch for datetime, so we don"t want any "nice" with numbers like 17398203392.
    if (niceCount) {
        scale.nice(niceCount);
    }

    return scale;
}

export function convertToNumber(value: Date | number): number {
    return Number(value);
}

export function getRecommendedNumberOfTicksForXAxis(availableWidth: number, minOrdinalRectThickness: number): number {
    let numberOfTicks: number = RecommendedNumberOfTicksLarge;

    for (; numberOfTicks > 1; numberOfTicks--) {
        if (numberOfTicks * minOrdinalRectThickness < availableWidth) {
            break;
        }
    }

    return numberOfTicks;
}

export function getRecommendedNumberOfTicksForYAxis(availableWidth: number): number {
    if (availableWidth < AvailableWidthYAxisSmall) {
        return RecommendedNumberOfTicksSmall;
    }

    if (availableWidth < AvailableWidthYAxisMiddle) {
        return RecommendedNumberOfTicksMiddle;
    }

    return RecommendedNumberOfTicksLarge;
}

export function isOrdinal(type: powerbi.ValueTypeDescriptor): boolean {
    return !!(type
        && (type.text
            || type.bool
            || (type.misc && type.misc.barcode)
            || (type.geography && type.geography.postalCode)));
}

/**
 * Get the best number of ticks based on minimum value, maximum value,
 * measure metadata and max tick count.
 *
 * @param min The minimum of the data domain.
 * @param max The maximum of the data domain.
 * @param valuesMetadata The measure metadata array.
 * @param maxTickCount The max count of intervals.
 * @param isDateTimeType - flag to show single tick when min is equal to max.
 */
export function getBestNumberOfTicks(
    min: number,
    max: number,
    valuesMetadata: powerbi.DataViewMetadataColumn[],
    maxTickCount: number,
    isDateTimeType?: boolean,
): number {

    if (isNaN(min) || isNaN(max)) {
        return DefaultBestTickCount;
    }

    if (maxTickCount <= 1 || (max <= 1 && min >= -1)) {
        return maxTickCount;
    }

    if (min === max) {
        // datetime needs to only show one tick value in this case so formatting works correctly
        if (!!isDateTimeType) {
            return 1;
        }

        return DefaultBestTickCount;
    }

    if (hasNonIntegerData(valuesMetadata)) {
        return maxTickCount;
    }

    // e.g. 5 - 2 + 1 = 4, => [2,3,4,5]
    return Math.min(max - min + 1, maxTickCount);
}

export function ensureValuesInRange(values: number[], min: number, max: number): number[] {
    let filteredValues: number[] = values.filter((v) => v >= min && v <= max);

    if (filteredValues.length < 2) {
        filteredValues = [min, max];
    }

    return filteredValues;
}

export function hasNonIntegerData(valuesMetadata: powerbi.DataViewMetadataColumn[]): boolean {
    for (let i: number = 0, len = valuesMetadata.length; i < len; i++) {
        const currentMetadata: powerbi.DataViewMetadataColumn = valuesMetadata[i];

        if (currentMetadata && currentMetadata.type && !currentMetadata.type.integer) {
            return true;
        }
    }

    return false;
}

/**
 * Round out very small zero tick values (e.g. -1e-33 becomes 0).
 *
 * @param ticks Array of numbers (from d3.scale.ticks([maxTicks])).
 * @param epsilon Max ratio of calculated tick interval which we will recognize as zero.
 *
 * e.g.
 *     ticks = [-2, -1, 1e-10, 3, 4]; epsilon = 1e-5;
 *     closeZero = 1e-5 * | 2 - 1 | = 1e-5
 *     // Tick values <= 1e-5 replaced with 0
 *     return [-2, -1, 0, 3, 4];
 */
function createTrueZeroTickLabel(ticks: number[], epsilon: number = 1e-5): number[] {
    if (!ticks || ticks.length < 2) {
        return ticks;
    }

    const closeZero: number = epsilon * Math.abs(ticks[1] - ticks[0]);

    return ticks.map((tick) => Math.abs(tick) <= closeZero ? 0 : tick);
}
