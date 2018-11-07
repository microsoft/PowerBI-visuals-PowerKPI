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

namespace powerbi.visuals.samples.powerKpi {
    // powerbi
    import VisualDataRole = powerbi.VisualDataRole;
    import DataViewMapping = powerbi.DataViewMapping;

    // powerbi.data
    import DataViewObjectDescriptor = powerbi.data.DataViewObjectDescriptor;
    import DataViewObjectDescriptors = powerbi.data.DataViewObjectDescriptors;
    import DataViewObjectPropertyDescriptor = powerbi.data.DataViewObjectPropertyDescriptor;
    import DataViewObjectPropertyDescriptors = powerbi.data.DataViewObjectPropertyDescriptors;

    export class CommonCapabilitiesBuilder implements CapabilitiesBuilder {
        public makeDataRoles(): VisualDataRole[] {
            return [
                categoryColumn,
                seriesColumn,
                valuesColumn,
                secondaryValuesColumn,
                kpiColumn,
                kpiIndicatorValueColumn,
                secondKPIIndicatorValueColumn,
            ];
        }

        public makeDataViewMappings(): DataViewMapping[] {
            return [{
                conditions: [
                    {
                        [categoryColumn.name]: { max: 1 },
                        [seriesColumn.name]: { max: 0 },
                        [valuesColumn.name]: { max: 0 },
                        [secondaryValuesColumn.name]: { max: 0 },
                        [kpiColumn.name]: { max: 0 },
                        [kpiIndicatorValueColumn.name]: { max: 0 },
                        [secondKPIIndicatorValueColumn.name]: { max: 0 },
                    },
                    {
                        [categoryColumn.name]: { max: 1 },
                        [seriesColumn.name]: { max: 1 },
                        [valuesColumn.name]: { max: 1 },
                        [secondaryValuesColumn.name]: { max: 1 },
                        [kpiColumn.name]: { max: 0 },
                        [kpiIndicatorValueColumn.name]: { max: 1 },
                        [secondKPIIndicatorValueColumn.name]: { max: 1 },
                    },
                    {
                        [categoryColumn.name]: { max: 1 },
                        [seriesColumn.name]: { max: 0 },
                        [valuesColumn.name]: { min: 1 },
                        [kpiColumn.name]: { max: 0 },
                        [kpiIndicatorValueColumn.name]: { max: 1 },
                        [secondKPIIndicatorValueColumn.name]: { max: 1 },
                    },
                    {
                        [categoryColumn.name]: { max: 1 },
                        [seriesColumn.name]: { max: 1 },
                        [valuesColumn.name]: { max: 1 },
                        [secondaryValuesColumn.name]: { max: 1 },
                        [kpiColumn.name]: { max: 1 },
                        [kpiIndicatorValueColumn.name]: { max: 1 },
                        [secondKPIIndicatorValueColumn.name]: { max: 1 },
                    },
                    {
                        [categoryColumn.name]: { max: 1 },
                        [seriesColumn.name]: { max: 0 },
                        [valuesColumn.name]: { min: 1 },
                        [kpiColumn.name]: { max: 1 },
                        [kpiIndicatorValueColumn.name]: { max: 1 },
                        [secondKPIIndicatorValueColumn.name]: { max: 1 },
                    },
                ],
                categorical: {
                    categories: {
                        for: {
                            in: categoryColumn.name
                        },
                        dataReductionAlgorithm: {
                            window: { count: 30000 }
                        }
                    },
                    values: {
                        group: {
                            by: seriesColumn.name,
                            select: [
                                {
                                    for: {
                                        in: valuesColumn.name
                                    }
                                },
                                {
                                    for: {
                                        in: secondaryValuesColumn.name
                                    }
                                },
                                {
                                    for: {
                                        in: kpiColumn.name
                                    }
                                },
                                {
                                    for: {
                                        in: kpiIndicatorValueColumn.name
                                    }
                                },
                                {
                                    for: {
                                        in: secondKPIIndicatorValueColumn.name
                                    }
                                },
                            ]
                        }
                    }
                }
            }];
        }

        public makeObjects(): DataViewObjectDescriptors {
            const kpiIndicatorProperties: DataViewObjectPropertyDescriptors = KPIIndicatorDescriptor
                .createDefault()
                .getObjectProperties();

            kpiIndicatorProperties["show"] = this.boolean();
            kpiIndicatorProperties["fontSize"] = this.fontSize("Size");
            kpiIndicatorProperties["position"] = this.position("Position", horizontalPositionEnum);
            kpiIndicatorProperties["shouldBackgroundColorMatchKpiColor"] = this.boolean("Background Match KPI Color");

            const kpiIndicatorValue: DataViewObjectDescriptor = this.getKPISettings("KPI Indicator Value", true, true);

            kpiIndicatorValue.properties["matchKPIColor"] = this.boolean("Match KPI Indicator Color");

            return {
                layout: {
                    displayName: "Layout",
                    properties: {
                        autoHideVisualComponents: this.boolean("Auto Scale"),
                        auto: this.boolean("Auto"),
                        layout: this.layout()
                    }
                },
                title: {
                    displayName: "Title",
                    properties: {}
                },
                subtitle: {
                    displayName: "Subtitle",
                    properties: {
                        show: this.boolean(),
                        titleText: {
                            displayName: "Title Text",
                            type: { text: true },
                            suppressFormatPainterCopy: true,
                        },
                        fontColor: this.fontColor(),
                        background: this.nullableColor(),
                        alignment: {
                            displayName: "Alignment",
                            type: { formatting: { alignment: true } }
                        },
                        fontSize: this.fontSize(),
                        fontFamily: this.fontFamily(),
                    }
                },
                kpiIndicator: {
                    displayName: "KPI Indicator",
                    description: "KPI Indicator options",
                    properties: kpiIndicatorProperties
                },
                kpiIndicatorValue,
                kpiIndicatorLabel: this.getKPIIndicatorLabel("KPI Indicator Label"),
                secondKPIIndicatorValue: this.getKPISettings("Second KPI Indicator Value", true, true),
                secondKPIIndicatorLabel: this.getKPIIndicatorLabel("Second KPI Indicator Label"),
                actualValueKPI: this.getKPISettings("KPI Actual Value", true),
                actualLabelKPI: this.getKPISettings("KPI Actual Label"),
                dateValueKPI: this.getKPISettings("KPI Date Value", true, true),
                dateLabelKPI: this.getKPISettings("KPI Date Label"),
                labels: {
                    displayName: "Data Labels",
                    description: "Display data label options",
                    properties: {
                        show: this.boolean(),
                        color: this.color(),
                        displayUnits: this.displayUnits(),
                        precision: this.precision(),
                        fontSize: this.fontSize(),
                        fontFamily: this.fontFamily(),
                        isBold: this.isBold(),
                        isItalic: this.isItalic(),
                        percentile: this.numeric("Label Density")
                    }
                },
                line: {
                    displayName: "Line",
                    properties: {
                        fillColor: this.color(),
                        shouldMatchKpiColor: {
                            displayName: "Match KPI Color",
                            type: { bool: true }
                        },
                        dataPointStartsKpiColorSegment: {
                            displayName: "Data Point Starts KPI Color Segment",
                            type: { bool: true }
                        },
                        lineType: {
                            displayName: "Type",
                            type: { enumeration: lineTypeEnumType }
                        },
                        thickness: {
                            displayName: "Thickness",
                            type: { numeric: true }
                        },
                        rawOpacity: {
                            displayName: "Opacity",
                            type: { numeric: true }
                        },
                        rawAreaOpacity: {
                            displayName: "Area Opacity",
                            type: { numeric: true }
                        },
                        lineStyle: {
                            displayName: "Style",
                            type: { enumeration: lineStyleEnumType }
                        },
                        interpolation: {
                            displayName: "Interpolation",
                            type: { enumeration: lineInterpolationEnumType }
                        },
                        interpolationWithColorizedLine: {
                            displayName: "Interpolation",
                            type: { enumeration: lineInterpolationWithColorizedLineEnumType }
                        },
                    }
                },
                // series, lineStyle, lineThickness are here for backward compatibility. It's been actually moved to line
                series: {
                    displayName: "Data Colors",
                    properties: {
                        fillColor: {
                            displayName: "Color",
                            type: {
                                fill: {
                                    solid: {
                                        color: true
                                    }
                                }
                            }
                        }
                    }
                },
                lineStyle: {
                    displayName: "Line Style",
                    properties: {
                        lineStyle: {
                            type: {
                                enumeration: lineStyleEnumType
                            }
                        }
                    }
                },
                lineThickness: {
                    displayName: "Line Thickness",
                    properties: {
                        thickness: {
                            type: {
                                numeric: true
                            }
                        }
                    }
                },
                legend: {
                    displayName: "Legend",
                    description: "Display legend options",
                    properties: {
                        show: this.boolean(),
                        position: this.position("Position", positionEnum),
                        showTitle: this.boolean("Title"),
                        titleText: this.text("Legend Name"),
                        labelColor: this.color(),
                        fontFamily: this.fontFamily(),
                        fontSize: this.fontSize(),
                        style: {
                            displayName: "Style",
                            type: { enumeration: legendStyleEnum }
                        },
                    }
                },
                xAxis: this.getXAxis("X Axis"),
                yAxis: this.getYAxis("Y Axis"),
                secondaryYAxis: this.getYAxis("Secondary Y Axis"),
                referenceLineOfXAxis: this.getAxisLineSettings("X Axis Reference Lines"),
                referenceLineOfYAxis: this.getAxisLineSettings("Y Axis Reference Lines"),
                secondaryReferenceLineOfYAxis: this.getAxisLineSettings("Secondary Y Axis Reference Lines"),
                tooltipLabel: this.getTooltipSettings("Tooltip Label", true),
                tooltipVariance: this.getTooltipSettings("Tooltip KPI Indicator Value", true),
                secondTooltipVariance: this.getTooltipSettings("Second Tooltip KPI Indicator Value", true),
                tooltipValues: this.getTooltipSettings("Tooltip Values")
            };
        }

        public makeSorting(): VisualSortingCapabilities {
            return {
                implicit: {
                    clauses: [{
                        role: categoryColumn.name,
                        direction: 1
                    }]
                }
            };
        }

        private boolean(displayName: string = "Show"): DataViewObjectPropertyDescriptor {
            return {
                displayName,
                type: { bool: true }
            };
        }

        private fontColor(displayName: string = "Font Color"): DataViewObjectPropertyDescriptor {
            return {
                displayName,
                type: { fill: { solid: { color: true } } }
            };
        }

        private nullableColor(displayName: string = "Background Color"): DataViewObjectPropertyDescriptor {
            return {
                displayName,
                type: { fill: { solid: { color: { nullable: true } } } }
            };
        }

        private fontSize(displayName: string = "Text Size"): DataViewObjectPropertyDescriptor {
            return {
                displayName,
                type: { formatting: { fontSize: true } }
            };
        }

        private numeric(displayName: string = "Number", placeHolderText?: string): DataViewObjectPropertyDescriptor {
            return {
                displayName,
                placeHolderText,
                type: { numeric: true },
                suppressFormatPainterCopy: true
            };
        }

        private color(displayName: string = "Color"): DataViewObjectPropertyDescriptor {
            return {
                displayName,
                type: { fill: { solid: { color: true } } }
            };
        }

        private displayUnits(displayName: string = "Display Units"): DataViewObjectPropertyDescriptor {
            return {
                displayName,
                description: "Select the units (millions, billions, etc.)",
                type: { formatting: { labelDisplayUnits: true } },
                suppressFormatPainterCopy: true,
            };
        }

        private precision(displayName: string = "Decimal Places"): DataViewObjectPropertyDescriptor {
            return {
                displayName,
                description: "Select the number of decimal places to display",
                placeHolderText: "Auto",
                type: { numeric: true },
                suppressFormatPainterCopy: true
            };
        }

        private fontFamily(displayName: string = "Font Family"): DataViewObjectPropertyDescriptor {
            return {
                displayName,
                type: { formatting: { fontFamily: true } }
            };
        }

        private isBold(displayName: string = "Bold"): DataViewObjectPropertyDescriptor {
            return {
                displayName,
                type: { bool: true }
            };
        }

        private isItalic(displayName: string = "Italic"): DataViewObjectPropertyDescriptor {
            return {
                displayName,
                type: { bool: true }
            };
        }

        private text(displayName: string = "Text", placeHolderText?: string): DataViewObjectPropertyDescriptor {
            return {
                displayName,
                placeHolderText,
                type: { text: true }
            };
        }

        private format(displayName: string = "Format", placeHolderText?: string): DataViewObjectPropertyDescriptor {
            return this.text(displayName, placeHolderText);
        }

        private position(displayName: string, positionEnum: IEnumType): DataViewObjectPropertyDescriptor {
            return {
                displayName,
                type: { enumeration: positionEnum }
            };
        }

        private layout(displayName: string = "Layout"): DataViewObjectPropertyDescriptor {
            return {
                displayName,
                type: { enumeration: layoutEnum }
            };
        }

        private getKPISettings(
            displayName: string,
            isNumberFormattingSupported: boolean = false,
            isFormatSupported: boolean = false,
        ): DataViewObjectDescriptor {
            const objectDescriptor: DataViewObjectDescriptor = {
                displayName,
                properties: {
                    show: this.boolean(),
                    fontColor: this.fontColor(),
                    fontSize: this.fontSize(),
                    isBold: this.isBold(),
                    isItalic: this.isItalic(),
                    fontFamily: this.fontFamily(),
                }
            };

            if (isFormatSupported) {
                objectDescriptor.properties['format'] = this.format();
            }

            if (isNumberFormattingSupported) {
                objectDescriptor.properties['displayUnits'] = this.displayUnits();
                objectDescriptor.properties['precision'] = this.precision();
            }

            return objectDescriptor;
        }

        private getTooltipSettings(
            displayName: string,
            isFormatSupported: boolean = false
        ): DataViewObjectDescriptor {
            const objectDescriptor: DataViewObjectDescriptor = {
                displayName,
                properties: {
                    show: this.boolean(),
                    displayUnits: this.displayUnits(),
                    precision: this.precision(),
                    label: this.text("Label", "Variance")
                }
            };

            if (isFormatSupported) {
                objectDescriptor.properties['format'] = this.format();
            }

            return objectDescriptor;
        }

        private getAxis(displayName: string): DataViewObjectDescriptor {
            return {
                displayName,
                properties: {
                    show: this.boolean(),
                    fontColor: this.fontColor(),
                    displayUnits: this.displayUnits(),
                    precision: this.precision(),
                    fontSize: this.fontSize(),
                    percentile: this.numeric("Ticks Density"),
                    fontFamily: this.fontFamily(),
                }
            };
        }

        private getXAxis(displayName: string): DataViewObjectDescriptor {
            const descriptor: DataViewObjectDescriptor = this.getAxis(displayName);

            descriptor.properties.type = {
                displayName: "Type",
                type: { enumeration: axisTypeEnumType },
            };

            return descriptor;
        }

        private getYAxis(displayName: string): DataViewObjectDescriptor {
            const descriptor: DataViewObjectDescriptor = this.getAxis(displayName);

            descriptor.properties.min = this.numeric("Min", "Auto");
            descriptor.properties.max = this.numeric("Max", "Auto");

            return descriptor;
        }

        private getKPIIndicatorLabel(displayName: string): DataViewObjectDescriptor {
            const kpiIndicatorLabel: DataViewObjectDescriptor = this.getKPISettings(displayName);

            kpiIndicatorLabel.properties["label"] = this.text("Label");

            return kpiIndicatorLabel;
        }

        private getAxisLineSettings(displayName: string): DataViewObjectDescriptor {
            return {
                displayName,
                properties: {
                    show: this.boolean(""),
                    color: this.color(),
                    thickness: this.numeric("Thickness")
                }
            };
        }
    }
}
