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

import {
    ScaleQuantize,
    scaleQuantize,
    range as d3Range
} from "d3";

import { pixelConverter } from "powerbi-visuals-utils-typeutils";
import { label as NewLabelUtils } from "powerbi-visuals-utils-chartutils";

import {
    valueFormatter,
    textMeasurementService,
} from "powerbi-visuals-utils-formattingutils";

import { BaseComponent } from "./base/baseComponent";
import { VisualComponentConstructorOptions } from "./base/visualComponentConstructorOptions";
import { VisualComponentRenderOptions } from "./base/visualComponentRenderOptions";
import { DataRepresentationPointFilter } from "../dataRepresentation/dataRepresentationPointFilter";
import { DataRepresentationScale } from "../dataRepresentation/dataRepresentationScale";
import { DataRepresentationSeries } from "../dataRepresentation/dataRepresentationSeries";
import { DataRepresentationPoint } from "../dataRepresentation/dataRepresentationPoint";

export class LabelsComponent extends BaseComponent<VisualComponentConstructorOptions, VisualComponentRenderOptions>   {
    private className: string = "labelsComponent";

    private minimumLabelsToRender: number = 1;
    private estimatedLabelWidth: number = 40; // This value represents a width of label just for optimization

    private pointFilter: DataRepresentationPointFilter = new DataRepresentationPointFilter();

    constructor(options: VisualComponentConstructorOptions) {
        super();

        this.initElement(
            options.element,
            this.className,
            "g"
        );
    }

    public render(options: VisualComponentRenderOptions): void {
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

    private renderLabels(options: VisualComponentRenderOptions): void {
        const { viewport, settings: { labels } } = options.data;

        this.element
            .classed(this.italicClassName, labels.isItalic)
            .classed(this.boldClassName, labels.isBold);

        // TODO: Fix label component
        const labelLayoutOptions: NewLabelUtils.labelLayout.DataLabelLayoutOptions = NewLabelUtils.labelUtils.LabelUtils.getDataLabelLayoutOptions(null);

        const labelLayout: NewLabelUtils.labelLayout.LabelLayout = new NewLabelUtils.labelLayout.LabelLayout(labelLayoutOptions);

        const labelGroups: NewLabelUtils.labelLayout.LabelDataPointGroup<NewLabelUtils.labelLayout.LabelDataPoint[]>[] = this.getLabelGroups(options);

        const dataLabels: NewLabelUtils.labelLayout.Label[] = labelLayout.layout(labelGroups, viewport);

        NewLabelUtils.labelUtils.LabelUtils.drawDefaultLabels(this.element, dataLabels, true);
    }

    private getTextProperties(
        text: string,
        fontSize: number,
        fontFamily: string
    ): textMeasurementService.TextProperties {
        return {
            text,
            fontFamily,
            fontSize: pixelConverter.toString(fontSize)
        };
    }

    private getLabelGroups(options: VisualComponentRenderOptions): NewLabelUtils.labelLayout.LabelDataPointGroup<NewLabelUtils.labelLayout.LabelDataPoint[]>[] {
        const {
            x,
            series,
            viewport,
            settings: { labels },

        } = options.data;

        const xScale: DataRepresentationScale = x.scale
            .copy()
            .range([0, viewport.width]);

        const fontSizeInPx: number = pixelConverter.fromPointToPixel(labels.fontSize);

        const pointsLength: number = series
            && series[0]
            && series[0].points
            && series[0].points.length
            || 0;

        const lastPointIndex: number = pointsLength - 1;

        let availableAmountOfLabels: number = NewLabelUtils.labelUtils.LabelUtils.getNumberOfLabelsToRender(
            viewport.width,
            labels.density,
            this.minimumLabelsToRender,
            this.estimatedLabelWidth);

        const maxNumberOfLabels: number = Math.round(availableAmountOfLabels * labels.density / 100);

        const indexScale: ScaleQuantize<number> = scaleQuantize()
            .domain([0, maxNumberOfLabels])
            .range(d3Range(0, pointsLength, 1));

        return series.map((currentSeries: DataRepresentationSeries, seriesIndex: number) => {
            const labelDataPoints: NewLabelUtils.labelLayout.LabelDataPoint[] = [];

            const labelDisplayUnits: number = labels.displayUnits || (currentSeries.domain.max as number);

            const valueFormatters: valueFormatter.IValueFormatter[] = series.map((seriesGroup: DataRepresentationSeries) => {
                return this.getValueFormatter(
                    labelDisplayUnits,
                    labels.precision,
                    seriesGroup.format);
            });

            const yScale: DataRepresentationScale = currentSeries.y.scale
                .copy()
                .range([viewport.height, 0]);

            for (let index: number = 0, previousPointIndex: number = -1; index <= maxNumberOfLabels; index++) {
                const pointIndex: number = indexScale(index);

                const point: DataRepresentationPoint = currentSeries.points[pointIndex];

                if (previousPointIndex !== pointIndex && this.pointFilter.isPointValid(point)) {
                    previousPointIndex = pointIndex;

                    const formattedValue: string = valueFormatters[seriesIndex].format(point.y);

                    const textProperties: textMeasurementService.TextProperties = this.getTextProperties(
                        formattedValue,
                        fontSizeInPx,
                        labels.fontFamily);

                    const textWidth: number = textMeasurementService.textMeasurementService.measureSvgTextWidth(textProperties);
                    const textHeight: number = textMeasurementService.textMeasurementService.estimateSvgTextHeight(textProperties);

                    let parentShape: NewLabelUtils.labelLayout.LabelParentPoint = {
                        point: {
                            x: xScale.scale(point.x),
                            y: yScale.scale(point.y),
                        },
                        radius: 0,
                        validPositions: [
                            NewLabelUtils.labelLayout.NewPointLabelPosition.Above,
                            NewLabelUtils.labelLayout.NewPointLabelPosition.Below,
                            NewLabelUtils.labelLayout.NewPointLabelPosition.Left,
                            NewLabelUtils.labelLayout.NewPointLabelPosition.Right
                        ]
                    };

                    let labelDataPoint: NewLabelUtils.labelLayout.LabelDataPoint = {
                        isPreferred: pointIndex === 0 || pointIndex === lastPointIndex,
                        text: formattedValue,
                        textSize: {
                            width: textWidth,
                            height: textHeight
                        },
                        outsideFill: labels.color,
                        insideFill: labels.color,
                        parentType: NewLabelUtils.labelLayout.LabelDataPointParentType.Point,
                        parentShape: parentShape,
                        fontProperties: {
                            family: labels.fontFamily,
                            color: labels.color,
                            size: NewLabelUtils.units.Units.FontSize.createFromPt(labels.fontSize)
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
    ): valueFormatter.IValueFormatter {
        return valueFormatter.valueFormatter.create({
            format,
            precision,
            value: displayUnits
        });
    }
}
