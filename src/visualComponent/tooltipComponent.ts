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

import { VarianceConverter } from "../converter/varianceConverter";
import { IDataRepresentationPoint } from "../dataRepresentation/dataRepresentationPoint";
import { IDataRepresentationSeries } from "../dataRepresentation/dataRepresentationSeries";
import { DataRepresentationTypeEnum } from "../dataRepresentation/dataRepresentationType";
import { IKPIIndicatorSettings } from "../settings/descriptors/kpi/kpiIndicatorsListDescriptor";
import { LegendDescriptor } from "../settings/descriptors/legendDescriptor";
import { ILineDescriptor, LineStyle } from "../settings/descriptors/lineDescriptor";
import { TooltipVarianceDescriptor } from "../settings/descriptors/tooltip/tooltipVarianceDescriptor";
import { IVisualComponent } from "./base/visualComponent";
import { IVisualComponentConstructorOptions } from "./base/visualComponentConstructorOptions";
import { IEventPositionVisualComponentOptions } from "./eventPositionVisualComponentOptions";

export interface ITooltipComponentConstructorOptions extends IVisualComponentConstructorOptions {
    tooltipService: powerbi.extensibility.ITooltipService;
}

enum TooltipMarkerShapeEnum {
    circle,
    none,
}

interface IVisualTooltipDataItem extends powerbi.extensibility.VisualTooltipDataItem {
    lineStyle?: string; // TODO: Extend PBI API
    markerShape?: string; // TODO: Extend PBI API
    lineColor?: string; // TODO: Extend PBI API
}

export class TooltipComponent
    extends VarianceConverter
    implements IVisualComponent<IEventPositionVisualComponentOptions> {

    private varianceDisplayName: string = "Variance";
    private secondVarianceDisplayName: string = `${this.varianceDisplayName} 2`;

    private numberFormat: string = valueFormatter.DefaultNumericFormat;

    private transparentColor: string = "rgba(0,0,0,0)";

    constructor(private constructorOptions: ITooltipComponentConstructorOptions) {
        super();
    }

    public render(options: IEventPositionVisualComponentOptions): void {
        if (!options.position || !this.constructorOptions.tooltipService) {
            return;
        }

        this.showTooltip(options);
    }

    public clear(): void {
        if (!this.constructorOptions.tooltipService) {
            return;
        }

        this.constructorOptions.tooltipService.hide({
            immediately: true,
            isTouchEvent: false,
        });
    }

    public destroy(): void {
        this.clear();
        this.constructorOptions = null;
    }

    public hide(): void {
        this.clear();
    }

    private showTooltip(options: IEventPositionVisualComponentOptions): void {
        const {
            position,
            data: {
                x,
                series,
                settings: {
                    kpiIndicator,
                    tooltipLabel,
                    tooltipVariance,
                    secondTooltipVariance,
                    tooltipValues,
                    legend,
                    line
                },
                variances,
            },
        } = options;

        if (!tooltipLabel.isElementShown()
            && !tooltipVariance.isElementShown()
            && !tooltipValues.isElementShown()
            && !secondTooltipVariance.isElementShown()
        ) {
            this.clear();

            return;
        }

        let dataItems: IVisualTooltipDataItem[] = [];

        const firstVariance: IVisualTooltipDataItem = this.getVarianceTooltip(
            series[0] && series[0].points[0],
            series[1] && series[1].points[0],
            tooltipVariance,
            this.varianceDisplayName,
            kpiIndicator.getCurrentKPI(
                series[0]
                && series[0].points[0]
                && series[0].points[0].kpiIndex),
            (variances[0] || [])[0],
            legend,
            series[0] && line[series[0].name]
        );

        if (firstVariance) {
            dataItems.push(firstVariance);
        }

        const secondVariance: IVisualTooltipDataItem = this.getVarianceTooltip(
            series[0] && series[0].points[0],
            series[2] && series[2].points[0],
            secondTooltipVariance,
            this.secondVarianceDisplayName,
            undefined,
            (variances[1] || [])[0],
        );

        if (secondVariance) {
            dataItems.push(secondVariance);
        }

        if (dataItems.length) {
            dataItems.push(
                this.getTooltipSeparator(),
                this.getTooltipSeparator(),
            );
        }

        if (tooltipValues.isElementShown()) {
            series.forEach((dataSeries: IDataRepresentationSeries) => {
                const valueFormatterInstance: valueFormatter.IValueFormatter = this.getValueFormatterByFormat(
                    dataSeries.format || this.numberFormat,
                    tooltipValues.displayUnits.value.value as number,
                    tooltipValues.precision.value,
                );

                const dataSeriesPoint: IDataRepresentationPoint = dataSeries
                    && dataSeries.points
                    && dataSeries.points[0];

                if (dataSeriesPoint
                    && dataSeriesPoint.y !== null
                    && dataSeriesPoint.y !== undefined
                    && !isNaN(dataSeriesPoint.y)
                ) {
                    const lineSettings: ILineDescriptor = line[dataSeries.name]
                    if(!lineSettings){
                        return
                    }
                    dataItems.push({
                        color: lineSettings.fillColor.value.value,
                        displayName: `${dataSeries.name}`,
                        lineColor: lineSettings.fillColor.value.value,
                        lineStyle: legend.getLegendLineStyle(lineSettings.lineStyle.value.value as LineStyle),
                        markerShape: legend.getLegendMarkerShape(),
                        value: valueFormatterInstance.format(dataSeriesPoint.y),
                    });
                }
            });
        }

        const point: IDataRepresentationPoint = series
            && series[0]
            && series[0].points
            && series[0].points[0];

        if (tooltipLabel.isElementShown()
            && point
            && point.x !== undefined
            && point.x !== null
        ) {
            const formatter: valueFormatter.IValueFormatter = this.getValueFormatterByFormat(
                tooltipLabel.getFormat(),
                x.axisType === DataRepresentationTypeEnum.NumberType
                    ? tooltipLabel.displayUnits.value.value as number
                    : undefined,
                x.axisType === DataRepresentationTypeEnum.NumberType
                    ? tooltipLabel.precision.value
                    : undefined);

            const text: string = formatter
                ? formatter.format(point.x)
                : point.x as string;

            dataItems = [
                {
                    color: this.transparentColor,
                    displayName: "",
                    markerShape: this.getTooltipMarkerShape(TooltipMarkerShapeEnum.circle),
                    value: text,
                },
                ...dataItems,
            ];
        }

        if (dataItems.length) {
            this.constructorOptions.tooltipService.show({
                coordinates: this.getCoordinates(position.x, position.y),
                dataItems,
                identities: [],
                isTouchEvent: false,
            });
        } else {
            this.clear();
        }
    }

    private getCoordinates(x: number, y: number): [number, number] {
        if (!this.constructorOptions || !this.constructorOptions.rootElement) {
            return [x, y];
        }

        const rootNode: HTMLElement = this.constructorOptions.rootElement.node();

        const rect: ClientRect = rootNode.getBoundingClientRect();

        return [
            x - rect.left - rootNode.clientLeft,
            y - rect.top - rootNode.clientTop,
        ];
    }

    private getTooltipSeparator(): IVisualTooltipDataItem {
        return {
            color: this.transparentColor,
            displayName: "   ",
            markerShape: this.getTooltipMarkerShape(TooltipMarkerShapeEnum.none),
            value: "",
        };
    }

    private getVarianceTooltip(
        firstPoint: IDataRepresentationPoint,
        secondPoint: IDataRepresentationPoint,
        settings: TooltipVarianceDescriptor,
        displayName: string,
        commonKPISettings: IKPIIndicatorSettings = {},
        kpiIndicatorVariance: number,
        legendDescriptor?: LegendDescriptor,
        lineSettings?: ILineDescriptor,
    ): IVisualTooltipDataItem {
        if (!settings.isElementShown()) {
            return null;
        }

        const variance: number = !isNaN(kpiIndicatorVariance) && kpiIndicatorVariance !== null
            ? kpiIndicatorVariance
            : this.getVarianceByPoints(firstPoint, secondPoint);

        if (isNaN(variance)) {
            return null;
        }

        const varianceFormatter: valueFormatter.IValueFormatter = this.getValueFormatterByFormat(
            settings.getFormat(),
            settings.displayUnits.value.value as number,
            settings.precision.value,
        );

        const lineStyle: string = legendDescriptor && lineSettings
            ? legendDescriptor.getLegendLineStyle(lineSettings.lineStyle.value.value as LineStyle)
            : undefined;

        const markerShape: string = legendDescriptor
            ? legendDescriptor.getLegendMarkerShape()
            : this.getTooltipMarkerShape(TooltipMarkerShapeEnum.circle);

        const color: string = (commonKPISettings.color && commonKPISettings.color.value.value) || this.transparentColor;

        const lineColor: string = lineSettings
            ? color
            : undefined;

        return {
            color,
            displayName: `${settings.label.value}` || `${displayName}`,
            lineColor,
            lineStyle,
            markerShape,
            value: varianceFormatter.format(variance),
        };
    }

    private getValueFormatterByFormat(
        format?: string,
        displayUnits?: number,
        precision?: number,
    ): valueFormatter.IValueFormatter {
        return valueFormatter.create({
            format,
            precision,
            value: displayUnits,
        });
    }

    private getTooltipMarkerShape(markerShape: TooltipMarkerShapeEnum): string {
        return TooltipMarkerShapeEnum[markerShape];
    }
}
