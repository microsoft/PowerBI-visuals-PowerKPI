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

// jsCommon
import PixelConverter = jsCommon.PixelConverter;

// powerbi
import TextProperties = powerbi.TextProperties;

// powerbi.visuals
import ILegend = powerbi.visuals.ILegend;
import LegendData = powerbi.visuals.LegendData;
import LegendIcon = powerbi.visuals.LegendIcon;
import createLegend = powerbi.visuals.createLegend;
import LegendPosition = powerbi.visuals.LegendPosition;
import LegendDataPoint = powerbi.visuals.LegendDataPoint;

export class LegendComponent extends BaseComponent<VisualComponentConstructorOptions, VisualComponentRenderOptions> {
    private className: string = "legendComponent";

    private legend: ILegend;

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

    private createLegend(options: VisualComponentConstructorOptions): ILegend {
        // Try-catch protects Power KPI from being completely broken due to createLegend incompatibility in different PBI Desktop versions
        try {
            const pbiDesktopFeb2018RegExp: RegExp = /legendParentElement, interactive, interactivityService, isScrollable, legendPosition, legendSmallViewPortProperties, style/;

            if (pbiDesktopFeb2018RegExp.test(createLegend.toString())) {
                const createLegendAny: any = createLegend;

                return createLegendAny(
                    $(options.element.node()),
                    false,
                    options.interactivityService || undefined,
                    true,
                    undefined,
                    undefined,
                    options.style || undefined,
                );
            } else {
                return createLegend(
                    $(options.element.node()),
                    false,
                    options.interactivityService || undefined,
                    true,
                    undefined,
                    options.style || undefined,
                    false,
                );
            }
        }
        catch (err) {
            return null;
        }
    }

    public render(options: VisualComponentRenderOptions): void {
        if (!this.legend) {
            return;
        }

        const { data: { settings: { legend } } } = options;

        const legendData: LegendData = this.createLegendData(options.data, legend);

        // Try-catch protects Power KPI from being completely broken due to createLegend incompatibility in different PBI Desktop versions
        try {
            this.legend.changeOrientation(this.getLegendPosition(legend.position));

            this.legend.drawLegend(legendData, options.data.viewport);
        } catch (_) { }
    }

    private createLegendData(data: DataRepresentation, settings: LegendDescriptor): LegendData {
        const legendDataPoints: LegendDataPoint[] = data.series
            .map((series: DataRepresentationSeries) => {
                return {
                    color: series.settings.line.fillColor,
                    icon: LegendIcon.Circle,
                    label: series.name,
                    identity: series.identity,
                    selected: series.selected,
                    lineStyle: settings.getLegendLineStyle(series.settings.line.lineStyle),
                    markerShape: settings.getLegendMarkerShape(),
                    lineColor: series.settings.line.fillColor,
                } as LegendDataPoint;
            });

        const fontSizeInPx: number = PixelConverter.fromPointToPixel(settings.fontSize);

        return {
            show: settings.show,
            position: this.getLegendPosition(settings.position),
            title: settings.titleText,
            showTitle: settings.showTitle,
            dataPoints: legendDataPoints,
            grouped: false,
            fontProperties: {
                color: settings.labelColor,
                family: settings.fontFamily,
                size: {
                    pt: settings.fontSize,
                    px: PixelConverter.fromPointToPixel(settings.fontSize)
                },
                sizePx: fontSizeInPx,
                toTextProperties: (text?: string) => { // TODO: It's a PBI Desktop May 2017 specific. Please get rid of this function once PBID is updated.
                    return {
                        text,
                        fontFamily: settings.fontFamily,
                        fontSize: PixelConverter.toString(fontSizeInPx),
                        sizePx: fontSizeInPx,
                    } as TextProperties;
                },
                toSVGStyle: () => { // TODO: It's a PBI Desktop May 2017 specific. Please get rid of this function once PBID is updated.
                    return {
                        "font-size": PixelConverter.toString(fontSizeInPx),
                        "font-family": settings.fontFamily,
                        fill: settings.labelColor,
                    };
                }
            } as any
        };
    }

    private getLegendPosition(position: string): number {
        const positionIndex: number = LegendPosition[position];

        return positionIndex === undefined
            ? LegendPosition.BottomCenter
            : positionIndex;
    }

    public destroy(): void {
        this.legend = null;

        super.destroy();
    }

    public getViewport(): VisualComponentViewport {
        if (!this.legend) {
            return {
                width: 0,
                height: 0
            };
        }

        return this.legend.getMargins();
    }
}
