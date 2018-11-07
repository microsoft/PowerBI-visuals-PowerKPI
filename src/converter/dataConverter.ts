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

// powerbi
import ValueTypeDescriptor = powerbi.ValueTypeDescriptor;

// powerbi.visuals
import SelectionId = powerbi.visuals.SelectionId;
import SelectionIdBuilder = powerbi.visuals.SelectionIdBuilder;

export class DataConverter
    extends VarianceConverter
    implements Converter {

    public convert(options: ConverterOptions): DataRepresentation {
        const dataRepresentation: DataRepresentation = this.process(options);

        this.postProcess(dataRepresentation);

        return dataRepresentation;
    }

    public process(options: ConverterOptions): DataRepresentation {
        const {
            dataView,
            viewport,
            style,
            hasSelection,
        } = options;

        const settings: Settings = Settings.parse(dataView) as Settings;

        let type: DataRepresentationTypeEnum = DataRepresentationTypeEnum.None;

        const dataRepresentation: DataRepresentation = {
            viewport,
            settings,
            series: [],
            groups: [],
            sortedSeries: [],
            x: {
                type,
                values: [],
                min: undefined,
                max: undefined,
                metadata: undefined,
                name: undefined,
                format: undefined,
                scale: DataRepresentationScale.create()
            },
            variance: [],
            variances: [],
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            isGrouped: false,
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

        const axisCategory: DataViewCategoryColumn = dataView.categorical.categories[0];

        dataRepresentation.x.metadata = axisCategory.source;
        dataRepresentation.x.name = axisCategory.source.displayName;

        settings.parse(dataView);

        const axisCategoryType: ValueTypeDescriptor = axisCategory.source.type;

        if (axisCategoryType.text) {
            settings.xAxis.type = AxisType.categorical;
        }

        if (axisCategoryType.text || settings.xAxis.type === AxisType.categorical) {
            type = DataRepresentationTypeEnum.StringType;
        } else if (axisCategoryType.dateTime) {
            type = DataRepresentationTypeEnum.DateType;
        } else if (axisCategoryType.integer || axisCategoryType.numeric) {
            type = DataRepresentationTypeEnum.NumberType;
        }

        settings.parseSettings(viewport, type);

        dataRepresentation.x.type = type;

        let maxThickness: number = NaN;

        let seriesColorIndex: number = 0;

        if (dataView.categorical.values
            && dataView.categorical.values.source
            && dataView.categorical.values.source.displayName
            && settings.legend.titleText === undefined
        ) {
            settings.legend.titleText = dataView.categorical.values.source.displayName;
        }

        const axisCategoryFormat: string = this.getFormatStringByColumn(axisCategory && axisCategory.source);

        dataRepresentation.settings.dateValueKPI.setColumnFormat(axisCategoryFormat);
        dataRepresentation.settings.tooltipLabel.setColumnFormat(axisCategoryFormat);

        // Applies series formats
        dataRepresentation.x.format = dataRepresentation.settings.dateValueKPI.getFormat();

        dataView.categorical.values.grouped().forEach((group: DataViewValueColumnGroup) => {
            const groupedValues: DataViewValueColumn[] = group.values;

            const currentKPIColumn: DataViewValueColumn[] = groupedValues
                .filter((groupedValue: DataViewValueColumn) => {
                    return groupedValue.source.roles[kpiColumn.name];
                });

            const kpiIndexes: number[] = (currentKPIColumn
                && currentKPIColumn[0]
                && currentKPIColumn[0].values as number[]
            ) || [];

            groupedValues.forEach((groupedValue: DataViewValueColumn) => {
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
                                min: undefined,
                                max: undefined,
                                scale: DataRepresentationScale.create(),
                            }
                        };
                    }

                    const seriesGroup: DataRepresentationSeriesGroup = dataRepresentation.groups[groupIndex];

                    const currentPoint: DataRepresentationPointIndexed = {
                        x: null,
                        y: NaN,
                        index: NaN,
                        kpiIndex: NaN,
                        color: undefined,
                    };

                    const seriesSettings: SeriesSettings = (SeriesSettings.getDefault() as SeriesSettings);

                    for (const propertyName in seriesSettings) {
                        const descriptor: BaseDescriptor = seriesSettings[propertyName];
                        const defaultDescriptor: BaseDescriptor = settings[propertyName];

                        if (descriptor && descriptor.applyDefault && defaultDescriptor) {
                            descriptor.applyDefault(defaultDescriptor);
                        }
                    }

                    seriesSettings.parseObjects(group.objects || groupedValue.source.objects);

                    if (!seriesSettings.line.fillColor
                        && style
                        && style.colorPalette
                        && style.colorPalette.dataColors
                    ) {
                        seriesSettings.line.fillColor = style.colorPalette.dataColors
                            .getColorByIndex(seriesColorIndex)
                            .value;

                        seriesColorIndex++;
                    }

                    const seriesY: DataRepresentationAxisBase = {
                        min: undefined,
                        max: undefined,
                    };

                    const { points, gradientPoints } = this.getGradientPoints(
                        axisCategory.values as DataRepresentationAxisValueType[],
                        dataRepresentation,
                        seriesGroup,
                        groupedValue,
                        seriesY,
                        kpiIndexes,
                        seriesSettings,
                        settings,
                        currentPoint,
                    );

                    const isGrouped: boolean = group && !!group.identity;

                    if (isGrouped) {
                        dataRepresentation.isGrouped = isGrouped;
                    }

                    const identity: SelectionId = SelectionIdBuilder.builder()
                        .withSeries(
                            dataView.categorical.values,
                            isGrouped
                                ? group
                                : groupedValue
                        )
                        .withMeasure(groupedValue.source.queryName)
                        .createSelectionId();

                    if (isNaN(maxThickness) || seriesSettings.line.thickness > maxThickness) {
                        maxThickness = seriesSettings.line.thickness;
                    }

                    const name: string = isGrouped && group.name
                        ? `${group.name} - ${groupedValue.source.displayName}`
                        : groupedValue.source.displayName;

                    const groupName: string = isGrouped && group.name
                        ? `${group.name}`
                        : undefined;

                    seriesGroup.series.push({
                        name,
                        points,
                        format,
                        identity,
                        groupName,
                        hasSelection,
                        gradientPoints,
                        domain: seriesY,
                        y: seriesGroup.y,
                        current: currentPoint,
                        settings: seriesSettings,
                        selected: false,
                    });
                }
            });
        });

        dataRepresentation.x.values = axisCategory.values as DataRepresentationAxisValueType[];

        this.getXAxisScale(
            dataRepresentation.x.scale,
            dataRepresentation.x.min,
            dataRepresentation.x.max,
            dataRepresentation.x.type,
            axisCategory.values
        );

        dataRepresentation.margin = settings.dots.getMarginByThickness(
            maxThickness,
            dataRepresentation.margin
        );

        const group: DataRepresentationSeriesGroup = dataRepresentation.groups
            && (dataRepresentation.groups[0] || dataRepresentation.groups[1]);

        if (dataRepresentation.variances[0]) {
            dataRepresentation.variance.push(dataRepresentation.variances[0]
                && dataRepresentation.variances[0].length
                && dataRepresentation.variances[0].slice(-1)[0] || NaN);
        } else {
            dataRepresentation.variance.push(this.getVarianceByCurrentPointsOfSeries(
                group && group.series[0],
                group && group.series[1]
            ));
        }

        if (dataRepresentation.variances[1]) {
            dataRepresentation.variance.push(dataRepresentation.variances[1]
                && dataRepresentation.variances[1].length
                && dataRepresentation.variances[1].slice(-1)[0] || NaN);
        } else {
            dataRepresentation.variance.push(this.getVarianceByCurrentPointsOfSeries(
                group && group.series[0],
                group && group.series[2]
            ));
        }

        return dataRepresentation;
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
     * The second approach requires to handle axisValues from the end while the first approach handles values in the natural order
     */
    private getGradientPoints(
        axisValues: DataRepresentationAxisValueType[],
        dataRepresentation: DataRepresentation,
        seriesGroup: DataRepresentationSeriesGroup,
        groupedValue: DataViewValueColumn,
        seriesY: DataRepresentationAxisBase,
        kpiIndexes: number[],
        seriesSettings: SeriesSettings,
        settings: Settings,
        currentPoint: DataRepresentationPointIndexed,
    ): {
            points: DataRepresentationPoint[],
            gradientPoints: DataRepresentationPointGradientColor[],
        } {
        const gradientPoints: DataRepresentationPointGradientColor[] = [];

        const dataPointEndsKpiColorSegment: boolean = !seriesSettings.line.dataPointStartsKpiColorSegment;

        const copiedAxisValues: DataRepresentationAxisValueType[] = dataPointEndsKpiColorSegment
            ? axisValues.slice().reverse()
            : axisValues.slice();

        const points: DataRepresentationPoint[] = copiedAxisValues
            .map((axisValue: DataRepresentationAxisValueType, index: number) => {
                const categoryIndex: number = dataPointEndsKpiColorSegment
                    ? copiedAxisValues.length - 1 - index
                    : index;

                const value: number = groupedValue.values[categoryIndex] as number;

                this.applyXArguments(dataRepresentation, axisValue);
                this.applyYArguments(seriesGroup.y, value);

                this.applyYArguments(seriesY, value);

                let kpiIndex: number = this.getKPIIndex(kpiIndexes[categoryIndex]);

                let color: string = seriesSettings.line.fillColor;

                if (seriesSettings.line.shouldMatchKpiColor) {
                    const currentKPI: IKPIIndicatorSettings = settings
                        .kpiIndicator
                        .getCurrentKPI(kpiIndex);

                    color = currentKPI && currentKPI.color || color;
                }

                if (isFinite(value) && (categoryIndex > currentPoint.index || !isFinite(currentPoint.index))) {
                    currentPoint.x = axisValue;
                    currentPoint.y = value;
                    currentPoint.index = categoryIndex;
                    currentPoint.kpiIndex = kpiIndex;
                    currentPoint.color = color;
                }

                const point: DataRepresentationPoint = {
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
            points,
            gradientPoints,
        };
    }

    public postProcess(dataRepresentation: DataRepresentation): void {
        if (!dataRepresentation || !dataRepresentation.groups) {
            return;
        }

        const {
            settings,
            viewport,
        } = dataRepresentation;

        dataRepresentation.groups.forEach((
            seriesGroup: DataRepresentationSeriesGroup,
            seriesGroupIndex: number
        ) => {
            if (seriesGroup) {
                dataRepresentation.series = dataRepresentation.series.concat(seriesGroup.series);

                const yAxisSettings: YAxisDescriptor = seriesGroupIndex === 0
                    ? settings.yAxis
                    : settings.secondaryYAxis;

                const yMin: number = this.getNotNaNValue(
                    yAxisSettings.min,
                    seriesGroup.y.min as number
                );

                const yMax: number = this.getNotNaNValue(
                    yAxisSettings.max,
                    seriesGroup.y.max as number
                );

                seriesGroup.y.min = Math.min(yMin, yMax);
                seriesGroup.y.max = Math.max(yMin, yMax);

                seriesGroup.y.scale.domain(
                    [seriesGroup.y.min, seriesGroup.y.max],
                    DataRepresentationTypeEnum.NumberType
                );
            }
        });

        dataRepresentation.sortedSeries = this.sortSeries(
            dataRepresentation.series,
            viewport.height
        );
    }

    private sortSeries(
        series: DataRepresentationSeries[],
        height: number
    ): DataRepresentationSeries[] {
        return series
            .slice()
            .sort((a: DataRepresentationSeries, b: DataRepresentationSeries) => {
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

                return (aScaledMax - bScaledMax)
                    || (aScaledMin - bScaledMin); // Brackets are not required but they make this condition simpler to understand
            });
    }

    private applyXArguments(
        dataRepresentation: DataRepresentation,
        axisValue: DataRepresentationAxisValueType,
    ): void {
        if (dataRepresentation.x.min === undefined) {
            dataRepresentation.x.min = axisValue;
        }

        if (dataRepresentation.x.max === undefined) {
            dataRepresentation.x.max = axisValue;
        }

        if (dataRepresentation.x.type === DataRepresentationTypeEnum.DateType
            || dataRepresentation.x.type === DataRepresentationTypeEnum.NumberType
        ) {
            if (axisValue < dataRepresentation.x.min) {
                dataRepresentation.x.min = axisValue;
            }

            if (axisValue > dataRepresentation.x.max) {
                dataRepresentation.x.max = axisValue;
            }
        } else if (dataRepresentation.x.type === DataRepresentationTypeEnum.StringType) {
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
        axis: DataRepresentationAxisBase,
        value: number
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

    private getFormatStringByColumn(column: DataViewMetadataColumn): string {
        if (!column || !column.format) {
            return undefined;
        }

        return column.format;
    }
}

export function createConverter(): Converter {
    return new DataConverter();
}
