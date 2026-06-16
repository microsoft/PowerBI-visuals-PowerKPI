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

import { range as d3Range } from "d3-array";
import {
    ScaleQuantize,
    scaleQuantize,
} from "d3-scale";

import { label as NewLabelUtils } from "powerbi-visuals-utils-chartutils";
import { pixelConverter } from "powerbi-visuals-utils-typeutils";

import {
    interfaces,
    textMeasurementService,
    valueFormatter,
} from "powerbi-visuals-utils-formattingutils";

import { IDataRepresentationPoint } from "../dataRepresentation/dataRepresentationPoint";
import { DataRepresentationPointFilter } from "../dataRepresentation/dataRepresentationPointFilter";
import { DataRepresentationScale } from "../dataRepresentation/dataRepresentationScale";
import { IDataRepresentationSeries } from "../dataRepresentation/dataRepresentationSeries";
import { BaseComponent } from "./base/baseComponent";
import { IVisualComponentConstructorOptions } from "./base/visualComponentConstructorOptions";
import { IVisualComponentRenderOptions } from "./base/visualComponentRenderOptions";

export class LabelsComponent extends BaseComponent<IVisualComponentConstructorOptions, IVisualComponentRenderOptions>   {
    private className: string = "labelsComponent";

    private minimumLabelsToRender: number = 1;
    private estimatedLabelWidth: number = 40; // This value represents a width of label just for optimization

    private pointFilter: DataRepresentationPointFilter = new DataRepresentationPointFilter();

    constructor(options: IVisualComponentConstructorOptions) {
        super();

        this.initElement(
            options.element,
            this.className,
            "g",
        );
    }

    public render(options: IVisualComponentRenderOptions): void {
        const { settings: { labels } } = options.data;

        if (labels.isElementShown()) {
            try { // This try-catch protects visual from being destroyed by PBI core team due to changes for core visuals
                this.renderLabels(options);
            } catch (err) {
                this.clear();
            }
        } else {
            this.clear();
        }
    }

    private renderLabels(options: IVisualComponentRenderOptions): void {
        const { viewport, settings: { labels } } = options.data;

        this.element
            .classed(this.italicClassName, labels.font.italic.value)
            .classed(this.boldClassName, labels.font.bold.value);

        const labelLayoutOptions: NewLabelUtils.labelLayout.DataLabelLayoutOptions =
            NewLabelUtils.labelUtils.getDataLabelLayoutOptions(null);

        const labelLayout: NewLabelUtils.labelLayout.LabelLayout = new NewLabelUtils.labelLayout.LabelLayout(labelLayoutOptions);

        const labelGroups: Array<NewLabelUtils.labelLayout.LabelDataPointGroup<NewLabelUtils.labelLayout.LabelDataPoint[]>> =
            this.getLabelGroups(options);

        const dataLabels: NewLabelUtils.labelLayout.Label[] = labelLayout.layout(labelGroups, viewport);

        NewLabelUtils.labelUtils.drawDefaultLabels(this.element, dataLabels, true);
    }

    private getTextProperties(
        text: string,
        fontSize: number,
        fontFamily: string,
    ): interfaces.TextProperties {
        return {
            fontFamily,
            fontSize: pixelConverter.toString(fontSize),
            text,
        };
    }

    private getLabelGroups(
        options: IVisualComponentRenderOptions,
    ): Array<NewLabelUtils.labelLayout.LabelDataPointGroup<NewLabelUtils.labelLayout.LabelDataPoint[]>> {
        const {
            data: {
                x,
                series,
                viewport,
                settings: { labels },
            },
            colorPalette
        } = options;

        const xScale: DataRepresentationScale = x.scale
            .copy()
            .range([0, viewport.width]);

        const fontSizeInPx: number = pixelConverter.fromPointToPixel(labels.font.fontSize.value);

        const pointsLength: number = series
            && series[0]
            && series[0].points
            && series[0].points.length
            || 0;

        const lastPointIndex: number = pointsLength - 1;

        const availableAmountOfLabels: number = NewLabelUtils.labelUtils.getNumberOfLabelsToRender(
            viewport.width,
            labels.percentile.value,
            this.minimumLabelsToRender,
            this.estimatedLabelWidth);

        const maxNumberOfLabels: number = Math.round(availableAmountOfLabels * labels.percentile.value / 100);

        const indexScale: ScaleQuantize<number> = scaleQuantize()
            .domain([0, maxNumberOfLabels])
            .range(d3Range(0, pointsLength, 1));

        return series.map((currentSeries: IDataRepresentationSeries, seriesIndex: number) => {
            const labelDataPoints: NewLabelUtils.labelLayout.LabelDataPoint[] = [];

            const labelDisplayUnits: number = (labels.displayUnits.value || currentSeries.domain.max) as number;

            const valueFormatters: valueFormatter.IValueFormatter[] = series.map((seriesGroup: IDataRepresentationSeries) => {
                return this.getValueFormatter(
                    labelDisplayUnits,
                    labels.precision.value,
                    seriesGroup.format);
            });

            const yScale: DataRepresentationScale = currentSeries.y.scale
                .copy()
                .range([viewport.height, 0]);

            for (let index: number = 0, previousPointIndex: number = -1; index <= maxNumberOfLabels; index++) {
                const pointIndex: number = indexScale(index);

                const point: IDataRepresentationPoint = currentSeries.points[pointIndex];

                if (previousPointIndex !== pointIndex && this.pointFilter.isPointValid(point)) {
                    previousPointIndex = pointIndex;

                    const formattedValue: string = valueFormatters[seriesIndex].format(point.y);

                    const textProperties: interfaces.TextProperties = this.getTextProperties(
                        formattedValue,
                        fontSizeInPx,
                        labels.font.fontFamily.value);

                    const textWidth: number = textMeasurementService.measureSvgTextWidth(textProperties);
                    const textHeight: number = textMeasurementService.estimateSvgTextHeight(textProperties);

                    const parentShape: NewLabelUtils.labelLayout.LabelParentPoint = {
                        point: {
                            x: xScale.scale(point.x),
                            y: yScale.scale(point.y),
                        },
                        radius: 0,
                        validPositions: [
                            NewLabelUtils.labelLayout.NewPointLabelPosition.Above,
                            NewLabelUtils.labelLayout.NewPointLabelPosition.Below,
                            NewLabelUtils.labelLayout.NewPointLabelPosition.Left,
                            NewLabelUtils.labelLayout.NewPointLabelPosition.Right,
                        ],
                    };

                    const isHighContrast: boolean = colorPalette.isHighContrast;

                    const labelDataPoint: NewLabelUtils.labelLayout.LabelDataPoint = {
                        fontProperties: {
                            color: isHighContrast ? colorPalette.foreground.value : labels.color.value.value,
                            family: labels.font.fontFamily.value,
                            size: NewLabelUtils.units.FontSize.createFromPt(labels.font.fontSize.value),
                        },
                        identity: null,
                        insideFill: isHighContrast ? colorPalette.foreground.value : labels.color.value.value,
                        isPreferred: pointIndex === 0 || pointIndex === lastPointIndex,
                        outsideFill: isHighContrast ? colorPalette.foreground.value : labels.color.value.value,
                        parentShape,
                        parentType: NewLabelUtils.labelLayout.LabelDataPointParentType.Point,
                        text: formattedValue,
                        textSize: {
                            height: textHeight,
                            width: textWidth,
                        },
                    };

                    labelDataPoints.push(labelDataPoint);
                }
            }

            return {
                labelDataPoints,
                maxNumberOfLabels: labelDataPoints.length,
            };
        });
    }

    private getValueFormatter(
        displayUnits: number,
        precision: number,
        format: string,
    ): valueFormatter.IValueFormatter {
        return valueFormatter.create({
            format,
            precision,
            value: displayUnits,
        });
    }
}
