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
    legend as legendModule,
    legendInterfaces,
} from "powerbi-visuals-utils-chartutils";

import { interactivityBaseService } from "powerbi-visuals-utils-interactivityutils";

import { IDataRepresentation } from "../dataRepresentation/dataRepresentation";
import { IDataRepresentationSeries } from "../dataRepresentation/dataRepresentationSeries";
import { LegendDescriptor } from "../settings/descriptors/legendDescriptor";
import { LineDescriptor } from "../settings/descriptors/line/lineDescriptor";
import { BaseComponent } from "./base/baseComponent";
import { IVisualComponentViewport } from "./base/visualComponent";
import { IVisualComponentConstructorOptions } from "./base/visualComponentConstructorOptions";
import { IVisualComponentRenderOptions } from "./base/visualComponentRenderOptions";

export class LegendComponent extends BaseComponent<IVisualComponentConstructorOptions, IVisualComponentRenderOptions> {
    private className: string = "legendComponent";

    private legend: legendInterfaces.ILegend;

    constructor(options: IVisualComponentConstructorOptions) {
        super();

        this.initElement(
            options.element,
            this.className,
        );

        this.constructorOptions = {
            ...options,
            element: this.element,
        };

        this.legend = this.createLegend(this.constructorOptions);
    }

    public render(options: IVisualComponentRenderOptions): void {
        const { data: { settings: { legend, line } } } = options;

        if (!this.legend || !legend.isElementShown()) {
            this.hide();

            return;
        }

        try {
            const legendData: legendInterfaces.LegendData = this.createLegendData(options.data, legend, line);

            this.legend.changeOrientation(this.getLegendPosition(legend.position.value.value));

            this.legend.drawLegend(legendData, options.data.viewport);

            this.show();
        } catch (_) {
            this.hide();
        }
    }

    public destroy(): void {
        this.legend = null;

        super.destroy();
    }

    public getViewport(): IVisualComponentViewport {
        if (!this.legend || !this.isShown) {
            return {
                height: 0,
                width: 0,
            };
        }

        return this.legend.getMargins();
    }

    private createLegend(options: IVisualComponentConstructorOptions): legendInterfaces.ILegend {
        const interactivityService: interactivityBaseService.IInteractivityService<legendInterfaces.LegendDataPoint> =
            (options.interactivityService as interactivityBaseService.IInteractivityService<any>) || undefined;

        try {
            return legendModule.createLegend(
                options.element.node(),
                false,
                interactivityService,
                true,
            );
        } catch (_) {
            return null;
        }
    }

    private createLegendData(data: IDataRepresentation, legend: LegendDescriptor, line: LineDescriptor): legendInterfaces.LegendData {
        const dataPoints: legendInterfaces.LegendDataPoint[] = data.series
            .map((series: IDataRepresentationSeries) => {
                const { lineStyle, fillColor } = line.getCurrentSettings(series.containerName)
                const dataPoint: legendInterfaces.LegendDataPoint = {
                    color: fillColor,
                    identity: series.identity,
                    label: series.name,
                    lineStyle: legend.getLegendLineStyle(lineStyle),
                    markerShape: legend.getLegendMarkerShape(),
                    selected: series.selected,
                };

                return dataPoint;
            });

        const title: string = legend.titleText.value && legend.showTitle.value
            ? legend.titleText.value
            : undefined;

        return {
            dataPoints,
            fontFamily: legend.font.fontFamily.value,
            fontSize: legend.font.fontSize.value,
            grouped: false,
            labelColor: legend.labelColor.value.value,
            title,
        };
    }
    
    private getLegendPosition(position: powerbi.EnumMemberValue): number {
        const positionIndex: number = legendInterfaces.LegendPosition[position];

        return positionIndex === undefined
            ? legendInterfaces.LegendPosition.BottomCenter
            : positionIndex;
    }
}
