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

namespace powerbi.extensibility.visual {
    import PixelConverter = powerbi.extensibility.utils.type.PixelConverter;

    // powerbi
    import Label = utils.chart.label.Label;
    import LabelLayout = utils.chart.label.LabelLayout;
    import LabelDataPoint = utils.chart.label.LabelDataPoint;
    import TextProperties = powerbi.extensibility.utils.formatting.TextProperties;
    import LabelParentPoint = utils.chart.label.LabelParentPoint;
    import LabelDataPointGroup = utils.chart.label.LabelDataPointGroup;
    import NewPointLabelPosition = utils.chart.label.NewPointLabelPosition;
    import DataLabelLayoutOptions = utils.chart.label.DataLabelLayoutOptions;
    import TextMeasurementService = powerbi.extensibility.utils.formatting.textMeasurementService;
    import LabelDataPointParentType = utils.chart.label.LabelDataPointParentType;

    // powerbi.visuals
    import LabelUtils = utils.chart.label.LabelUtils;
    import FontSize = utils.chart.label.Units.FontSize;
    import valueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;
    import IValueFormatter = powerbi.extensibility.utils.formatting.IValueFormatter;

    export class LabelsComponent
        extends DataRepresentationPointFilter
        implements VisualComponent {

        private className: string = "labelsComponent";
        private italicClassName: string = "italicStyle";
        private boldClassName: string = "boldStyle";

        private minimumLabelsToRender: number = 1;
        private estimatedLabelWidth: number = 40; // This value represents a width of label just for optimization

        private element: d3.Selection<any>;

        constructor(options: VisualComponentConstructorOptions) {
            super();

            this.element = options.element
                .append("g")
                .classed(this.className, true);
        }

        public render(options: VisualComponentOptions): void {
            const { settings: { labels } } = options.data;

            if (labels.show) {
                try { // This try-catch protects visual from being destroyed by PBI core team due to changes for core visuals
                    this.renderLabels(options);
                } catch (err) {
                    this.clear();
                }
            } else {
                this.clear();
            }
        }

        private renderLabels(options: VisualComponentOptions): void {
            const { viewport, settings: { labels } } = options.data;

            this.element
                .classed(this.italicClassName, labels.isItalic)
                .classed(this.boldClassName, labels.isBold);

            const labelLayoutOptions: DataLabelLayoutOptions = LabelUtils.getDataLabelLayoutOptions(null);

            const labelLayout: LabelLayout = new LabelLayout(labelLayoutOptions);

            const labelGroups: LabelDataPointGroup<LabelDataPoint[]>[] = this.getLabelGroups(options);

            const dataLabels: Label[] = labelLayout.layout(labelGroups, viewport);

            LabelUtils.drawDefaultLabels(this.element, dataLabels, true);
        }

        private getTextProperties(text: string, fontSize: number, fontFamily: string): TextProperties {
            return {
                text,
                fontFamily,
                fontSize: PixelConverter.toString(fontSize)
            };
        }

        private getLabelGroups(options: VisualComponentOptions): LabelDataPointGroup<LabelDataPoint[]>[] {
            const {
                series,
                scale,
                viewport,
                settings: { labels },
                y
             } = options.data;

            const xScale: DataRepresentationScale = scale.x
                .copy()
                .range([0, viewport.width]);

            const yScale: DataRepresentationScale = scale.y
                .copy()
                .range([viewport.height, 0]);

            const fontSizeInPx: number = PixelConverter.fromPointToPixel(labels.fontSize);

            const labelDisplayUnits: number = labels.displayUnits || y.max;

            const valueFormatters: IValueFormatter[] = series.map((seriesGroup: DataRepresentationSeries) => {
                return this.getValueFormatter(
                    labelDisplayUnits,
                    labels.precision,
                    seriesGroup.format);
            });

            const pointsLength: number = series
                && series[0]
                && series[0].points
                && series[0].points.length
                || 0;

            const lastPointIndex: number = pointsLength - 1;

            let availableAmountOfLabels: number = LabelUtils.getNumberOfLabelsToRender(
                viewport.width,
                labels.density,
                this.minimumLabelsToRender,
                this.estimatedLabelWidth);

            const maxNumberOfLabels: number = Math.round(availableAmountOfLabels * labels.density / 100);

            const indexScale: d3.scale.Quantize<any> = d3.scale
                .quantize()
                .domain([0, maxNumberOfLabels])
                .range(d3.range(0, pointsLength, 1));

            return series.map((currentSeries: DataRepresentationSeries, seriesIndex: number) => {
                const labelDataPoints: LabelDataPoint[] = [];

                for (let index: number = 0, previousPointIndex: number = -1; index <= maxNumberOfLabels; index++) {
                    const pointIndex: number = indexScale(index);

                    const point: DataRepresentationPoint = currentSeries.points[pointIndex];

                    if (previousPointIndex !== pointIndex && this.isPointValid(point)) {
                        previousPointIndex = pointIndex;

                        const formattedValue: string = valueFormatters[seriesIndex].format(point.value);

                        const textProperties: TextProperties = this.getTextProperties(
                            formattedValue,
                            fontSizeInPx,
                            labels.fontFamily);

                        const textWidth: number = TextMeasurementService.measureSvgTextWidth(textProperties);
                        const textHeight: number = TextMeasurementService.estimateSvgTextHeight(textProperties);

                        let parentShape: LabelParentPoint = {
                            point: {
                                x: xScale.scale(point.axisValue),
                                y: yScale.scale(point.value),
                            },
                            radius: 0,
                            validPositions: [
                                NewPointLabelPosition.Above,
                                NewPointLabelPosition.Below,
                                NewPointLabelPosition.Left,
                                NewPointLabelPosition.Right
                            ]
                        };

                        let labelDataPoint: LabelDataPoint = {
                            isPreferred: pointIndex === 0 || pointIndex === lastPointIndex,
                            text: formattedValue,
                            textSize: {
                                width: textWidth,
                                height: textHeight
                            },
                            outsideFill: labels.color,
                            insideFill: labels.color,
                            parentType: LabelDataPointParentType.Point,
                            parentShape: parentShape,
                            fontProperties: {
                                family: labels.fontFamily,
                                color: labels.color,
                                size: FontSize.createFromPt(labels.fontSize)
                            },
                            identity: null
                        };

                        labelDataPoints.push(labelDataPoint);
                    }
                }

                return {
                    labelDataPoints,
                    maxNumberOfLabels: labelDataPoints.length
                };
            });
        }

        private getValueFormatter(
            displayUnits: number,
            precision: number,
            format: string
        ): IValueFormatter {
            return valueFormatter.create({
                format,
                precision,
                value: displayUnits
            });
        }

        public clear(): void {
            this.element
                .selectAll("*")
                .remove();
        }

        public destroy(): void {
            this.element = null;
        }
    }
}