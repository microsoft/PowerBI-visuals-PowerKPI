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
    legendInterfaces,
    legend as legendModule,
} from "powerbi-visuals-utils-chartutils";

import { VisualComponentViewport } from "./base/visualComponent";
import { BaseComponent } from "./base/baseComponent";
import { VisualComponentConstructorOptions } from "./base/visualComponentConstructorOptions";
import { VisualComponentRenderOptions } from "./base/visualComponentRenderOptions";
import { DataRepresentation } from "../dataRepresentation/dataRepresentation";
import { DataRepresentationSeries } from "../dataRepresentation/dataRepresentationSeries";
import { LegendDescriptor } from "../settings/descriptors/legendDescriptor";

export class LegendComponent extends BaseComponent<VisualComponentConstructorOptions, VisualComponentRenderOptions> {
    private className: string = "legendComponent";

    private legend: legendInterfaces.ILegend;

    constructor(options: VisualComponentConstructorOptions) {
        super();

        this.initElement(
            options.element,
            this.className,
        );

        this.constructorOptions = {
            ...options,
            element: this.element
        };

        this.legend = this.createLegend(this.constructorOptions);
    }

    private createLegend(options: VisualComponentConstructorOptions): legendInterfaces.ILegend {
        try {
            return legendModule.createLegend(
                options.element.node(),
                false,
                options.interactivityService || undefined,
                true,
            );
        } catch (_) {
            return null;
        }
    }

    public render(options: VisualComponentRenderOptions): void {
        const { data: { settings: { legend } } } = options;

        if (!this.legend || !legend.show) {
            this.hide();

            return;
        }

        this.element.style("font-family", legend.fontFamily);

        try {
            const legendData: legendInterfaces.LegendData = this.createLegendData(options.data, legend);

            this.legend.changeOrientation(this.getLegendPosition(legend.position));

            this.legend.drawLegend(legendData, options.data.viewport);

            this.show();
        } catch (_) {
            this.hide();
        }
    }

    private createLegendData(data: DataRepresentation, settings: LegendDescriptor): legendInterfaces.LegendData {
        const dataPoints: legendInterfaces.LegendDataPoint[] = data.series
            .map((series: DataRepresentationSeries) => {
                const dataPoint: legendInterfaces.LegendDataPoint = {
                    color: series.settings.line.fillColor,
                    label: series.name,
                    identity: series.identity,
                    selected: series.selected,
                    lineStyle: settings.getLegendLineStyle(series.settings.line.lineStyle),
                    markerShape: settings.getLegendMarkerShape(),
                };

                return dataPoint;
            });

        const title: string = !!(settings.titleText && settings.showTitle)
            ? settings.titleText
            : undefined;

        return {
            dataPoints,
            title,
            fontSize: settings.fontSize,
            grouped: false,
            labelColor: settings.labelColor,
        };
    }

    private getLegendPosition(position: string): number {
        const positionIndex: number = legendInterfaces.LegendPosition[position];

        return positionIndex === undefined
            ? legendInterfaces.LegendPosition.BottomCenter
            : positionIndex;
    }

    public destroy(): void {
        this.legend = null;

        super.destroy();
    }

    public getViewport(): VisualComponentViewport {
        if (!this.legend || !this.isShown) {
            return {
                width: 0,
                height: 0
            };
        }

        return this.legend.getMargins();
    }
}
