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
import { valueFormatter } from "powerbi-visuals-utils-formattingutils";
import { ColorHelper } from "powerbi-visuals-utils-colorutils";

import {
    kpiColumn,
    kpiIndicatorValueColumn,
    secondaryValuesColumn,
    secondKPIIndicatorValueColumn,
    valuesColumn,

} from "../capabilities/columns";

import { IDataRepresentation } from "../dataRepresentation/dataRepresentation";
import { IDataRepresentationPointIndexed } from "../dataRepresentation/dataRepresentationPointIndexed";
import { DataRepresentationScale } from "../dataRepresentation/dataRepresentationScale";
import { DataRepresentationTypeEnum } from "../dataRepresentation/dataRepresentationType";
import { AxisType } from "../settings/descriptors/axis/axisDescriptor";
import { YAxisDescriptor } from "../settings/descriptors/axis/yAxisDescriptor";
import { IKPIIndicatorSettings } from "../settings/descriptors/kpi/kpiIndicatorsListDescriptor";
import { Settings } from "../settings/settings";
import { IConverter } from "./converter";
import { AxisOptions, ConverterOptions } from "./converterOptions";
import { VarianceConverter } from "./varianceConverter";

import {
    IDataRepresentationSeries,
    IDataRepresentationSeriesGroup,
} from "../dataRepresentation/dataRepresentationSeries";
import {
    IDataRepresentationPoint,
    IDataRepresentationPointGradientColor,
} from "../dataRepresentation/dataRepresentationPoint";

import { IDataRepresentationAxisBase } from "../dataRepresentation/dataRepresentationAxis";
import { DataRepresentationAxisValueType } from "../dataRepresentation/dataRepresentationAxisValueType";

import DataViewObjects = powerbi.DataViewObjects;
import ISelectionId = powerbi.visuals.ISelectionId;
import IColorPalette = powerbi.extensibility.IColorPalette;
import ISelectionIdBuilder = powerbi.visuals.ISelectionIdBuilder;
import Selector = powerbi.data.Selector;

export interface IDataConverterConstructorOptions {
    colorPalette: IColorPalette;
    createSelectionIdBuilder: () => ISelectionIdBuilder;
}

export interface LineDataPoint {
    containerName: string;
    selectionId: Selector;
    objects: DataViewObjects;
}

export interface AxisInfo {
    axisType: DataRepresentationTypeEnum;
    metadata: powerbi.DataViewMetadataColumn;
    name: string;
}

export class DataConverter extends VarianceConverter implements IConverter {

    private axisInfo: AxisInfo;

    constructor(private constructorOptions: IDataConverterConstructorOptions) {
        super();
    }

    public convert(options: ConverterOptions): IDataRepresentation {
        const dataRepresentation: IDataRepresentation = this.process(options);

        this.postProcess(dataRepresentation);

        return dataRepresentation;
    }

    public getAxisType(options: AxisOptions) {
        const { dataView, xAxisType } = options
        let axisType: DataRepresentationTypeEnum = DataRepresentationTypeEnum.None;
        const axisCategory: powerbi.DataViewCategoryColumn = dataView?.categorical?.categories?.[0];
        const axisCategoryType: powerbi.ValueTypeDescriptor = axisCategory?.source?.type;

        if (axisCategoryType?.text || xAxisType === AxisType.categorical) {
            axisType = DataRepresentationTypeEnum.StringType;
        } else if (axisCategoryType?.dateTime) {
            axisType = DataRepresentationTypeEnum.DateType;
        } else if (axisCategoryType?.integer || axisCategoryType?.numeric) {
            axisType = DataRepresentationTypeEnum.NumberType;
        }

        this.axisInfo = {
            axisType,
            metadata: axisCategory?.source,
            name: axisCategory?.source.displayName
        }
        return axisType
    }

    // eslint-disable-next-line max-lines-per-function
    public process(options: ConverterOptions): IDataRepresentation {
        const {
            dataView,
            viewport,
            hasSelection,
            settings
        } = options;

        const {
            colorPalette,
            createSelectionIdBuilder,
        } = this.constructorOptions;

        const axisType: DataRepresentationTypeEnum = this.axisInfo.axisType ?? DataRepresentationTypeEnum.None;

        const dataRepresentation: IDataRepresentation = {
            groups: [],
            isGrouped: false,
            margin: {
                bottom: 0,
                left: 0,
                right: 0,
                top: 0,
            },
            series: [],
            settings,
            sortedSeries: [],
            variance: [],
            variances: [],
            viewport,
            x: {
                axisType,
                format: undefined,
                max: undefined,
                metadata: undefined,
                min: undefined,
                name: undefined,
                scale: DataRepresentationScale.create(),
                values: [],
            },
        };

        if (!dataView
            || !dataView.categorical
            || !dataView.categorical.categories
            || !dataView.categorical.categories[0]
            || !dataView.categorical.categories[0].values
            || !dataView.categorical.values
            || !dataView.categorical.values.grouped
        ) {
            return dataRepresentation;
        }

        dataRepresentation.x.metadata = this.axisInfo.metadata;
        dataRepresentation.x.name = this.axisInfo.name;
        dataRepresentation.x.axisType = this.axisInfo.axisType;

        const axisCategory: powerbi.DataViewCategoryColumn = dataView.categorical.categories[0];
        const axisCategoryType: powerbi.ValueTypeDescriptor = axisCategory.source.type;

        if (axisCategoryType.text) {
            settings.xAxis.type.value = settings.xAxis.getNewType(AxisType.categorical);
        }

        settings.parseSettings(viewport);

        let maxThickness: number = NaN;

        if (dataView.categorical.values
            && dataView.categorical.values.source
            && dataView.categorical.values.source.displayName
            && settings.legend.titleText.value === undefined
        ) {
            settings.legend.titleText.value = dataView.categorical.values.source.displayName;
        }

        const axisCategoryFormat: string = this.getFormatStringByColumn(axisCategory && axisCategory.source);

        dataRepresentation.settings.dateValueKPI.setColumnFormat(axisCategoryFormat);
        dataRepresentation.settings.tooltipLabel.setColumnFormat(axisCategoryFormat);

        // Applies series formats
        dataRepresentation.x.format = dataRepresentation.settings.dateValueKPI.getFormat();

        // eslint-disable-next-line max-lines-per-function
        dataView.categorical.values.grouped().forEach((columnGroup: powerbi.DataViewValueColumnGroup) => {
            const groupedValues: powerbi.DataViewValueColumn[] = columnGroup.values;

            const currentKPIColumn: powerbi.DataViewValueColumn[] = groupedValues
                .filter((groupedValue: powerbi.DataViewValueColumn) => {
                    return groupedValue.source.roles[kpiColumn.name];
                });

            const kpiIndexes: number[] = (currentKPIColumn?.[0]?.values as number[]) || [];

            groupedValues.forEach((groupedValue: powerbi.DataViewValueColumn) => {
                const format: string = this.getFormatStringByColumn(groupedValue.source);

                if (groupedValue.source.roles[kpiIndicatorValueColumn.name]) {
                    dataRepresentation.variances[0] = groupedValue.values as number[];

                    settings.kpiIndicatorValue.setColumnFormat(format);
                    settings.tooltipVariance.setColumnFormat(format);
                }

                if (groupedValue.source.roles[secondKPIIndicatorValueColumn.name]) {
                    dataRepresentation.variances[1] = groupedValue.values as number[];

                    settings.secondKPIIndicatorValue.setColumnFormat(format);
                    settings.secondTooltipVariance.setColumnFormat(format);
                }

                let groupIndex: number = -1;
                if (groupedValue.source.roles[valuesColumn.name]) {
                    groupIndex = 0;
                } else if (groupedValue.source.roles[secondaryValuesColumn.name]) {
                    groupIndex = 1;
                }

                if (groupIndex !== -1) {
                    if (!dataRepresentation.groups[groupIndex]) {
                        dataRepresentation.groups[groupIndex] = {
                            series: [],
                            y: {
                                format,
                                max: undefined,
                                min: undefined,
                                scale: DataRepresentationScale.create(),
                            },
                        };
                    }

                    const seriesGroup: IDataRepresentationSeriesGroup = dataRepresentation.groups[groupIndex];

                    const currentPoint: IDataRepresentationPointIndexed = {
                        color: undefined,
                        index: NaN,
                        kpiIndex: NaN,
                        x: null,
                        y: NaN,
                    };

                    const isGrouped: boolean = columnGroup && !!columnGroup.identity;
                    if (isGrouped) {
                        dataRepresentation.isGrouped = isGrouped;
                    }

                    const name: string = isGrouped && columnGroup.name
                        ? `${columnGroup.name} - ${groupedValue.source.displayName}`
                        : groupedValue.source.displayName;
                    const groupName: string = isGrouped && columnGroup.name
                        ? `${columnGroup.name}`
                        : undefined;
                    const containerName = groupName || name

                    const identity: ISelectionId = createSelectionIdBuilder()
                        .withSeries(
                            dataView.categorical.values,
                            isGrouped
                                ? columnGroup
                                : groupedValue,
                        )
                        .withMeasure(groupedValue.source.queryName)
                        .createSelectionId();

                    const dataPoint: LineDataPoint = {
                        containerName,
                        selectionId: ColorHelper.normalizeSelector(identity.getSelector()),
                        objects: columnGroup.objects || groupedValue.source.objects
                    }

                    const currentSettings = settings.line.populateContainer(dataPoint, colorPalette)

                    if (isNaN(maxThickness) || currentSettings.thickness > maxThickness) {
                        maxThickness = currentSettings.thickness;
                    }

                    const seriesY: IDataRepresentationAxisBase = {
                        max: undefined,
                        min: undefined,
                    };

                    const { points, gradientPoints } = this.getGradientPoints(
                        axisCategory.values as DataRepresentationAxisValueType[],
                        dataRepresentation,
                        seriesGroup,
                        groupedValue,
                        seriesY,
                        kpiIndexes,
                        containerName,
                        settings,
                        currentPoint,
                    );

                    seriesGroup.series.push({
                        current: currentPoint,
                        domain: seriesY,
                        format,
                        gradientPoints,
                        groupName,
                        hasSelection,
                        identity,
                        containerName,
                        name,
                        points,
                        selected: false,
                        y: seriesGroup.y,
                    });
                }
            });
        });

        dataRepresentation.x.values = axisCategory.values as DataRepresentationAxisValueType[];

        this.getXAxisScale(
            dataRepresentation.x.scale,
            dataRepresentation.x.min,
            dataRepresentation.x.max,
            dataRepresentation.x.axisType,
            axisCategory.values,
        );

        dataRepresentation.margin = settings.dots.getMarginByThickness(
            maxThickness,
            dataRepresentation.margin,
        );

        const group: IDataRepresentationSeriesGroup = dataRepresentation.groups
            && (dataRepresentation.groups[0] || dataRepresentation.groups[1]);

        if (dataRepresentation.variances[0]) {
            dataRepresentation.variance.push(dataRepresentation.variances[0]
                && dataRepresentation.variances[0].length
                && dataRepresentation.variances[0].slice(-1)[0] || NaN);
        } else {
            dataRepresentation.variance.push(this.getVarianceByCurrentPointsOfSeries(
                group && group.series[0],
                group && group.series[1],
            ));
        }

        if (dataRepresentation.variances[1]) {
            dataRepresentation.variance.push(dataRepresentation.variances[1]
                && dataRepresentation.variances[1].length
                && dataRepresentation.variances[1].slice(-1)[0] || NaN);
        } else {
            dataRepresentation.variance.push(this.getVarianceByCurrentPointsOfSeries(
                group && group.series[0],
                group && group.series[2],
            ));
        }

        return dataRepresentation;
    }

    public isValueFinite(value: number): boolean {
        return value != null && isFinite(value);
    }

    public postProcess(dataRepresentation: IDataRepresentation): void {
        if (!dataRepresentation || !dataRepresentation.groups) {
            return;
        }

        const {
            settings,
            viewport,
        } = dataRepresentation;

        dataRepresentation.groups.forEach((
            seriesGroup: IDataRepresentationSeriesGroup,
            seriesGroupIndex: number,
        ) => {
            if (seriesGroup) {
                dataRepresentation.series = dataRepresentation.series.concat(seriesGroup.series);

                const yAxisSettings: YAxisDescriptor = seriesGroupIndex === 0
                    ? settings.yAxis
                    : settings.secondaryYAxis;

                const yMin: number = this.getNotNaNValue(
                    yAxisSettings.min.value,
                    seriesGroup.y.min as number,
                );

                const yMax: number = this.getNotNaNValue(
                    yAxisSettings.max.value,
                    seriesGroup.y.max as number,
                );

                seriesGroup.y.min = Math.min(yMin, yMax);
                seriesGroup.y.max = Math.max(yMin, yMax);

                seriesGroup.y.scale.domain(
                    [seriesGroup.y.min, seriesGroup.y.max],
                    DataRepresentationTypeEnum.NumberType,
                );
            }
        });

        dataRepresentation.sortedSeries = this.sortSeries(
            dataRepresentation.series,
            viewport.height,
        );
    }

    /**
     *
     * Please consider this method has side effects.
     *
     * This method generates dataPoints and color segments.
     * TODO: We should rethink current code structure to use Design Patterns for better code quality.
     *
     * It also supports two directions for color segments.
     *   1. A data point starts a color segment
     *   2. A data point ends a color segment
     *
     * The second approach requires to handle axisValues from the end,
     * while the first approach handles values in the natural order
     */
    private getGradientPoints(
        axisValues: DataRepresentationAxisValueType[],
        dataRepresentation: IDataRepresentation,
        seriesGroup: IDataRepresentationSeriesGroup,
        groupedValue: powerbi.DataViewValueColumn,
        seriesY: IDataRepresentationAxisBase,
        kpiIndexes: number[],
        name: string,
        settings: Settings,
        currentPoint: IDataRepresentationPointIndexed,
    ): {
            points: IDataRepresentationPoint[],
            gradientPoints: IDataRepresentationPointGradientColor[],
        } {
        const gradientPoints: IDataRepresentationPointGradientColor[] = [];

        const currentLineSettings = settings.line.getCurrentSettings(name)
        const dataPointEndsKpiColorSegment: boolean = currentLineSettings.dataPointStartsKpiColorSegment;

        const copiedAxisValues: DataRepresentationAxisValueType[] = dataPointEndsKpiColorSegment
            ? axisValues.slice().reverse()
            : axisValues.slice();

        const points: IDataRepresentationPoint[] = copiedAxisValues
            .map((axisValue: DataRepresentationAxisValueType, index: number) => {
                const categoryIndex: number = dataPointEndsKpiColorSegment
                    ? copiedAxisValues.length - 1 - index
                    : index;

                const value: number = groupedValue.values[categoryIndex] as number;

                this.applyXArguments(dataRepresentation, axisValue);
                this.applyYArguments(seriesGroup.y, value);

                this.applyYArguments(seriesY, value);

                const kpiIndex: number = this.getKPIIndex(kpiIndexes[categoryIndex]);

                let color: string = currentLineSettings.fillColor;

                if (currentLineSettings.shouldMatchKpiColor) {
                    const currentKPI: IKPIIndicatorSettings = settings
                        .kpiIndicator
                        .getCurrentKPI(kpiIndex);

                    color = currentKPI.color.value.value || color;
                }

                if (this.isValueFinite(value)
                    && (categoryIndex > currentPoint.index || !isFinite(currentPoint.index))
                ) {
                    currentPoint.x = axisValue;
                    currentPoint.y = value;
                    currentPoint.index = categoryIndex;
                    currentPoint.kpiIndex = kpiIndex;
                    currentPoint.color = color;
                }

                const point: IDataRepresentationPoint = {
                    color,
                    kpiIndex,
                    x: axisValue,
                    y: value,
                };

                this.pointFilter.groupPointByColor(
                    gradientPoints,
                    point,
                    dataPointEndsKpiColorSegment,
                );

                return point;
            });

        if (dataPointEndsKpiColorSegment) {
            return {
                gradientPoints,
                points: points.reverse(),
            };
        }

        return {
            gradientPoints,
            points,
        };
    }

    private sortSeries(
        series: IDataRepresentationSeries[],
        height: number,
    ): IDataRepresentationSeries[] {
        return series
            .slice()
            .sort((a: IDataRepresentationSeries, b: IDataRepresentationSeries) => {
                // To sort series we have to convert value to px as scales are not the same
                const aYScale: DataRepresentationScale = a.y.scale
                    .copy()
                    .range([height, 0]);

                const bYScale: DataRepresentationScale = b.y.scale
                    .copy()
                    .range([height, 0]);

                const bScaledMin: number = bYScale.scale(b.domain.min);
                const bScaledMax: number = bYScale.scale(b.domain.max);

                const aScaledMin: number = aYScale.scale(a.domain.min);
                const aScaledMax: number = aYScale.scale(a.domain.max);

                 // Brackets are not required but they make this condition simpler to understand
                return (aScaledMax - bScaledMax)
                    || (aScaledMin - bScaledMin);
            });
    }

    private applyXArguments(
        dataRepresentation: IDataRepresentation,
        axisValue: DataRepresentationAxisValueType,
    ): void {
        if (dataRepresentation.x.min === undefined) {
            dataRepresentation.x.min = axisValue;
        }

        if (dataRepresentation.x.max === undefined) {
            dataRepresentation.x.max = axisValue;
        }

        if (dataRepresentation.x.axisType === DataRepresentationTypeEnum.DateType
            || dataRepresentation.x.axisType === DataRepresentationTypeEnum.NumberType
        ) {
            if (axisValue < dataRepresentation.x.min) {
                dataRepresentation.x.min = axisValue;
            }

            if (axisValue > dataRepresentation.x.max) {
                dataRepresentation.x.max = axisValue;
            }
        } else if (dataRepresentation.x.axisType === DataRepresentationTypeEnum.StringType) {
            const format: string = dataRepresentation.x.format;

            const textLength: number = this.getLength(axisValue, format);

            if (textLength < this.getLength(dataRepresentation.x.min, format)) {
                dataRepresentation.x.min = axisValue;
            }

            if (textLength > this.getLength(dataRepresentation.x.max, format)) {
                dataRepresentation.x.max = axisValue;
            }
        }
    }

    private getNotNaNValue(value: number, fallbackValue: number): number {
        return isNaN(value)
            ? fallbackValue
            : value;
    }

    private getLength(value: DataRepresentationAxisValueType, format: string): number {
        return this.convertToString(value, format).length;
    }

    private convertToString(value: DataRepresentationAxisValueType, format: string): string {
        if (!value) {
            return "";
        }

        if (value instanceof Date) {
            return valueFormatter.format(value, format || "dddd, MMMM dd, yyyy");
        }

        return `${value}`;
    }

    private applyYArguments(
        axis: IDataRepresentationAxisBase,
        value: number,
    ): void {
        if (axis.min === undefined) {
            axis.min = value;
        }

        if (axis.max === undefined) {
            axis.max = value;
        }

        if (value !== null && value < axis.min) {
            axis.min = value;
        }

        if (value !== null && value > axis.max) {
            axis.max = value;
        }
    }

    private getKPIIndex(kpiIndex: number): number {
        return kpiIndex === undefined
            || kpiIndex === null
            || isNaN(kpiIndex)
            || kpiIndex as any instanceof Date
            ? NaN
            : kpiIndex;
    }

    private getXAxisScale(
        scale: DataRepresentationScale,
        min: DataRepresentationAxisValueType,
        max: DataRepresentationAxisValueType,
        type: DataRepresentationTypeEnum,
        categoryValues: any[]): DataRepresentationScale {

        let values: any[];

        switch (type) {
            case DataRepresentationTypeEnum.DateType:
            case DataRepresentationTypeEnum.NumberType: {
                values = [min, max];

                break;
            }
            case DataRepresentationTypeEnum.StringType: {
                values = categoryValues;

                break;
            }
        }

        return scale.domain(values, type);
    }

    private getFormatStringByColumn(column: powerbi.DataViewMetadataColumn): string {
        if (!column || !column.format) {
            return undefined;
        }

        return column.format;
    }
}
