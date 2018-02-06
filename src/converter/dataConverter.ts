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

namespace powerbi.extensibility.visual.powerKPI {
    import DataViewObjects = powerbi.DataViewObjects;
    import ValueTypeDescriptor = powerbi.ValueTypeDescriptor;
    import ColorHelper = utils.color.ColorHelper

    import SelectionId = powerbi.visuals.ISelectionId;

    export class DataConverter
        extends VarianceConverter
        implements Converter {
        
        private selectionIdBuilder: ISelectionIdBuilder;

        constructor(options: VisualConstructorOptions) {
            super();
            this.selectionIdBuilder = options.host.createSelectionIdBuilder();
        }

        private seriesFillColorProperty: DataViewObjectPropertyIdentifier = {
            objectName: "series",
            propertyName: "fillColor"
        };

        public convert(options: ConverterOptions): DataRepresentation {
            const {
                dataView,
                viewport,
                style
            } = options;

            const settings: Settings = Settings.parse(dataView) as Settings;

            const defaultXScale: DataRepresentationScale = DataRepresentationScale.create()
                , defaultYScale: DataRepresentationScale = DataRepresentationScale.create();

            let type: DataRepresentationTypeEnum = DataRepresentationTypeEnum.None;

            const dataRepresentation: DataRepresentation = {
                viewport,
                settings,
                series: [],
                x: {
                    type,
                    values: [],
                    min: undefined,
                    max: undefined,
                    metadata: undefined,
                    name: undefined,
                    ticks: [],
                    format: undefined
                },
                y: {
                    min: undefined,
                    max: undefined,
                    ticks: [],
                    format: undefined,
                    maxTickWidth: 0
                },
                scale: {
                    x: defaultXScale,
                    y: defaultYScale
                },
                variance: [],
                variances: [],
                margin: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                }
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

            const groupedValues: DataViewValueColumn[] = dataView.categorical.values.grouped()[0].values
                , axisCategory: DataViewCategoryColumn = dataView.categorical.categories[0]
                , axisCategoryType: ValueTypeDescriptor = axisCategory.source.type;

            dataRepresentation.x.metadata = axisCategory.source;
            dataRepresentation.x.name = axisCategory.source.displayName;

            if (axisCategoryType.dateTime) {
                type = DataRepresentationTypeEnum.DateType;
            } else if (axisCategoryType.integer || axisCategoryType.numeric) {
                type = DataRepresentationTypeEnum.NumberType;
            } else if (axisCategoryType.text) {
                type = DataRepresentationTypeEnum.StringType;
            }

            settings.parseSettings(viewport, type);

            dataRepresentation.x.type = type;
            
            const colorHelper: ColorHelper = ColorHelper
                ? new ColorHelper(
                    style.colorPalette,
                    this.seriesFillColorProperty
                )
                : new ColorHelper(
                    style && style.colorPalette /* && style.colorPalette.dataColors */,
                    this.seriesFillColorProperty
                );

            const series: DataRepresentationSeries[] = [];

            const currentKPIColumn: DataViewValueColumn[] = groupedValues
                .filter((groupedValue: DataViewValueColumn) => {
                    return groupedValue.source.roles[KPIColumn.name];
                });

            const kpiIndexes: number[] = (currentKPIColumn
                && currentKPIColumn[0]
                && currentKPIColumn[0].values as number[]) || [];

            let maxThickness: number = NaN;

            groupedValues.forEach((groupedValue: DataViewValueColumn, seriesIndex: number) => {
                if (groupedValue.source.roles[KPIIndicatorValueColumn.name]) {
                    dataRepresentation.variances[0] = groupedValue.values as number[];
                }

                if (groupedValue.source.roles[SecondKPIIndicatorValueColumn.name]) {
                    dataRepresentation.variances[1] = groupedValue.values as number[];
                }

                if (groupedValue.source.roles[ValuesColumn.name]) {
                    const currentPoint: DataRepresentationPointIndexed = {
                        axisValue: null,
                        value: NaN,
                        index: NaN,
                        kpiIndex: NaN,
                    };

                    const points: DataRepresentationPoint[] = axisCategory
                        .values
                        .map((axisValue: DataRepresentationAxisValueType, categoryIndex: number) => {
                            const value: number = groupedValue.values[categoryIndex] as number;

                            this.applyXArguments(dataRepresentation, axisValue);
                            this.applyYArguments(dataRepresentation, value);

                            let kpiIndex: number = this.getKPIIndex(kpiIndexes[categoryIndex]);

                            if (value !== null) {
                                currentPoint.axisValue = axisValue;
                                currentPoint.value = value;
                                currentPoint.index = categoryIndex;
                                currentPoint.kpiIndex = kpiIndex;
                            }

                            return {
                                axisValue,
                                value,
                                kpiIndex,
                            } as DataRepresentationPoint;
                        });
                        
                    const selectionId: SelectionId = <any>this.selectionIdBuilder
                        .withSeries(dataView.categorical.values, groupedValue)
                        .withMeasure(groupedValue.source.queryName)
                        .createSelectionId();

                    const objects: DataViewObjects = groupedValue.source.objects;

                    const color: string = colorHelper.getColorForSeriesValue(
                        objects,
                        // dataView.categorical.values.identityFields, commented
                        seriesIndex);

                    const lineStyle: string = settings._lineStyle.parseValue(objects)
                        , thickness: number = settings._lineThickness.parseValue(objects);

                    if (isNaN(maxThickness) || thickness > maxThickness) {
                        maxThickness = thickness;
                    }

                    const format: string = this.getFormatStringByColumn(groupedValue.source);

                    series.push({
                        points,
                        selectionId,
                        color,
                        format,
                        lineStyle,
                        thickness,
                        current: currentPoint,
                        name: groupedValue.source.displayName
                    });
                }
            });

            dataRepresentation.settings.applyColumnFormat(
                this.getFormatStringByColumn(axisCategory && axisCategory.source)
            );

            dataRepresentation.series = series;
            dataRepresentation.x.values = axisCategory.values as DataRepresentationAxisValueType[];

            dataRepresentation.x.format = dataRepresentation.settings.dateValueKPI.getFormat();
            dataRepresentation.y.format = series && series[0] && series[0].format;

            const xScale: DataRepresentationScale = this.getXAxisScale(
                defaultXScale,
                dataRepresentation.x.min,
                dataRepresentation.x.max,
                dataRepresentation.x.type,
                axisCategory.values);

            const yMin: number = this.getNotNaNValue(
                settings.yAxis.min,
                dataRepresentation.y.min);

            const yMax: number = this.getNotNaNValue(
                settings.yAxis.max,
                dataRepresentation.y.max);

            dataRepresentation.y.min = Math.min(yMin, yMax);
            dataRepresentation.y.max = Math.max(yMin, yMax);

            const yScale: DataRepresentationScale = defaultYScale.domain(
                [dataRepresentation.y.min, dataRepresentation.y.max],
                DataRepresentationTypeEnum.NumberType);

            dataRepresentation.scale = {
                x: xScale,
                y: yScale
            };

            dataRepresentation.margin = settings.dots.getMarginByThickness(
                maxThickness,
                dataRepresentation.margin
            );

            if (dataRepresentation.variances[0]) {
                dataRepresentation.variance.push(dataRepresentation.variances[0]
                    && dataRepresentation.variances[0].length
                    && dataRepresentation.variances[0].slice(-1)[0] || NaN);
            } else {
                dataRepresentation.variance.push(this.getVarianceByCurrentPointsOfSeries(series[0], series[1]));
            }

            if (dataRepresentation.variances[1]) {
                dataRepresentation.variance.push(dataRepresentation.variances[1]
                    && dataRepresentation.variances[1].length
                    && dataRepresentation.variances[1].slice(-1)[0] || NaN);
            } else {
                dataRepresentation.variance.push(this.getVarianceByCurrentPointsOfSeries(series[0], series[2]));
            }

            return dataRepresentation;
        }

        private applyXArguments(
            dataRepresentation: DataRepresentation,
            axisValue: DataRepresentationAxisValueType
        ): void {
            if (dataRepresentation.x.min === undefined) {
                dataRepresentation.x.min = axisValue;
            }

            if (dataRepresentation.x.max === undefined) {
                dataRepresentation.x.max = axisValue;
            }

            if (dataRepresentation.x.type === DataRepresentationTypeEnum.DateType
                || dataRepresentation.x.type === DataRepresentationTypeEnum.NumberType) {

                if (axisValue < dataRepresentation.x.min) {
                    dataRepresentation.x.min = axisValue;
                }

                if (axisValue > dataRepresentation.x.max) {
                    dataRepresentation.x.max = axisValue;
                }
            } else if (dataRepresentation.x.type === DataRepresentationTypeEnum.StringType) {
                const textLength: number = this.getLength(axisValue as string);

                if (textLength < this.getLength(dataRepresentation.x.min as string)) {
                    dataRepresentation.x.min = axisValue;
                }

                if (textLength > this.getLength(dataRepresentation.x.max as string)) {
                    dataRepresentation.x.max = axisValue;
                }
            }
        }

        private getNotNaNValue(value: number, fallbackValue: number): number {
            return isNaN(value)
                ? fallbackValue
                : value;
        }

        private getLength(text: string): number {
            if (!text || !text.length) {
                return 0;
            }

            return text.length;
        }

        private applyYArguments(
            dataRepresentation: DataRepresentation,
            value: number
        ): void {
            if (dataRepresentation.y.min === undefined) {
                dataRepresentation.y.min = value;
            }

            if (dataRepresentation.y.max === undefined) {
                dataRepresentation.y.max = value;
            }

            if (value !== null && value < dataRepresentation.y.min) {
                dataRepresentation.y.min = value;
            }

            if (value !== null && value > dataRepresentation.y.max) {
                dataRepresentation.y.max = value;
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

    export function createConverter(options: VisualConstructorOptions): Converter {
        return new DataConverter(options);
    }
}
