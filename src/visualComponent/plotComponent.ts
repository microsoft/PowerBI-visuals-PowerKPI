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

import { IAxisComponent } from "./axes/axisBaseComponent";
import { BaseContainerComponent } from "./base/baseContainerComponent";
import { IVisualComponentConstructorOptions } from "./base/visualComponentConstructorOptions";
import { IVisualComponentRenderOptions } from "./base/visualComponentRenderOptions";

import {
    IVisualComponent,
    IVisualComponentViewport,
} from "./base/visualComponent";

import {
    IXAxisComponentRenderOptions,
    XAxisComponent,
} from "./axes/xAxisComponent";

import {
    IYAxisComponentRenderOptions,
    YAxisComponent,
} from "./axes/yAxisComponent";

import {
    ISvgComponentRenderOptions,
    SvgComponent,
} from "./svgComponent";

import {
    IZoomSliderComponentRenderOptions,
    ZoomSliderAxis,
    ZoomSliderComponent,
} from "./zoomSliderComponent";

import { isZoomableAxisType } from "../dataRepresentation/dataRepresentationZoom";

export class PlotComponent extends BaseContainerComponent<
    IVisualComponentConstructorOptions,
    IVisualComponentRenderOptions,
    IVisualComponentRenderOptions | IXAxisComponentRenderOptions | IYAxisComponentRenderOptions | IZoomSliderComponentRenderOptions
    > {
    private xAxisComponent: IAxisComponent<IXAxisComponentRenderOptions>;
    private yAxisComponent: IAxisComponent<IYAxisComponentRenderOptions>;
    private secondaryYAxisComponent: IAxisComponent<IYAxisComponentRenderOptions>;
    private svgComponent: IVisualComponent<ISvgComponentRenderOptions>;
    private xZoomSliderComponent: ZoomSliderComponent;
    private yZoomSliderComponent: ZoomSliderComponent;

    private additionalWidthOffset: number = 5;

    constructor(options: IVisualComponentConstructorOptions) {
        super();

        this.initElement(
            options.element,
            "plot",
        );

        this.constructorOptions = {
            ...options,
            element: this.element,
        };

        this.hide();

        // The plot lays its children out in DOM order, so the vertical zoom slider is
        // created first to sit left of the Y axis, and the horizontal one last so that
        // it wraps onto its own full width row underneath the X axis.
        this.yZoomSliderComponent = new ZoomSliderComponent(this.constructorOptions);
        this.yAxisComponent = new YAxisComponent(this.constructorOptions);
        this.svgComponent = new SvgComponent(this.constructorOptions);
        this.secondaryYAxisComponent = new YAxisComponent(this.constructorOptions);
        this.xAxisComponent = new XAxisComponent(this.constructorOptions);
        this.xZoomSliderComponent = new ZoomSliderComponent(this.constructorOptions);

        this.components = [
            this.yZoomSliderComponent,
            this.yAxisComponent,
            this.svgComponent,
            this.secondaryYAxisComponent,
            this.xAxisComponent,
            this.xZoomSliderComponent,
        ];
    }

    // eslint-disable-next-line max-lines-per-function
    public render(options: IVisualComponentRenderOptions): void {
        const {
            data: {
                 x,
                margin,
                groups: [firstGroup, secondGroup],
                viewport,
                locale,
                zoom,
                settings: {
                    xAxis,
                    yAxis,
                    secondaryYAxis,
                    zoomSlider,
                },
            },
            colorPalette
        } = options;

        if (!firstGroup && !secondGroup) {
            this.hide();

            return;
        }

        this.show();

        this.updateViewport(viewport);

        const reducedViewport: powerbi.IViewport = {
            height: viewport.height,
            width: Math.max(0, viewport.width - this.additionalWidthOffset),
        };

        this.xAxisComponent.preRender({
            additionalMargin: null,
            axis: x,
            margin: null,
            settings: xAxis,
            viewport: null,
            colorPalette: colorPalette
        });

        this.yAxisComponent.preRender({
            axis: firstGroup && firstGroup.y,
            margin: null,
            settings: yAxis,
            viewport: null,
            colorPalette: colorPalette,
            locale: locale
        });

        this.secondaryYAxisComponent.preRender({
            axis: secondGroup && secondGroup.y,
            margin: null,
            settings: secondaryYAxis,
            viewport: null,
            colorPalette: colorPalette,
            locale: locale
        });

        const xAxisViewport: IVisualComponentViewport = this.xAxisComponent.getViewport();

        const maxYAxisHeight: number = Math.max(
            this.yAxisComponent.getViewport().height,
            this.secondaryYAxisComponent.getViewport().height,
        );

        // Each slider is rendered once the space it reserves is known; its own band is
        // taken out of the chart area first so the two never overlap. The horizontal one
        // is offered only on an axis that has a range to narrow, never on a categorical
        // one, and the guard is applied here as well as in the pane: the field can be
        // swapped for a text column while the setting stays on.
        const isXAxisZoomable: boolean = isZoomableAxisType(x.axisType);

        const xZoomSliderHeight: number = zoomSlider.isShownForXAxis() && isXAxisZoomable
            ? ZoomSliderComponent.Thickness
            : 0;

        const yZoomSliderWidth: number = zoomSlider.isShownForYAxis()
            ? ZoomSliderComponent.Thickness
            : 0;

        const height: number = Math.max(
            0,
            reducedViewport.height - xAxisViewport.height - maxYAxisHeight - xZoomSliderHeight,
        );

        this.yAxisComponent.render({
            axis: firstGroup && firstGroup.y,
            margin,
            settings: yAxis,
            viewport: {
                height,
                width: reducedViewport.width,
            },
            colorPalette: colorPalette,
            locale: locale
        });

        this.secondaryYAxisComponent.render({
            axis: secondGroup && secondGroup.y,
            margin,
            settings: secondaryYAxis,
            viewport: {
                height,
                width: reducedViewport.width,
            },
            colorPalette: colorPalette,
            locale: locale
        });

        const yAxisViewport: IVisualComponentViewport = this.yAxisComponent.getViewport();
        const secondaryYAxisViewport: IVisualComponentViewport = this.secondaryYAxisComponent.getViewport();

        const leftOffset: number = this.getOffset(xAxisViewport.width, yAxisViewport.width);
        const rightOffset: number = this.getOffset(xAxisViewport.width2, secondaryYAxisViewport.width);

        const width: number = Math.max(0,
            reducedViewport.width
            - yAxisViewport.width
            - secondaryYAxisViewport.width
            - leftOffset
            - rightOffset
            - yZoomSliderWidth,
        );

        // Both sliders span the drawing area rather than the whole plot: the same
        // margins the chart applies are taken off their length, and the space the
        // components before them occupy is added back as an offset. Without it the
        // horizontal slider would start under the Y axis labels and the vertical one
        // would start above the top of the chart.
        this.yZoomSliderComponent.render({
            axis: ZoomSliderAxis.y,
            isShown: zoomSlider.isShownForYAxis(),
            offset: margin.top,
            range: zoom.y,
            viewport: {
                height: Math.max(0, height - margin.top - margin.bottom),
                width: yZoomSliderWidth,
            },
        });

        this.xZoomSliderComponent.render({
            axis: ZoomSliderAxis.x,
            isShown: zoomSlider.isShownForXAxis() && isXAxisZoomable,
            offset: yZoomSliderWidth + yAxisViewport.width + leftOffset + margin.left,
            range: zoom.x,
            viewport: {
                height: xZoomSliderHeight,
                width: Math.max(0, width - margin.left - margin.right),
            },
        });

        this.xAxisComponent.render({
            additionalMargin: {
                bottom: 0,
                left: yZoomSliderWidth + yAxisViewport.width + leftOffset,
                right: 0,
                top: 0,
            },
            axis: x,
            margin,
            settings: xAxis,
            viewport: {
                height: reducedViewport.height,
                width,
            },
            colorPalette
        });

        this.svgComponent.render({
            additionalMargin: {
                bottom: 0,
                left: leftOffset,
                right: 0,
                top: 0,
            },
            data: {
                ...options.data,
                margin,
                viewport: {
                    height,
                    width,
                },
            },
            xTicks: this.xAxisComponent.getTicks(),
            yTicks: this.yAxisComponent.getTicks(),

            secondaryYTicks: this.secondaryYAxisComponent.getTicks(),
            colorPalette,
        });
    }

    public destroy(): void {
        super.destroy();

        this.xAxisComponent = null;
        this.yAxisComponent = null;
        this.secondaryYAxisComponent = null;
        this.svgComponent = null;
        this.xZoomSliderComponent = null;
        this.yZoomSliderComponent = null;
    }

    private getOffset(xAxisWidth: number, yAxisWidth: number): number {
        return xAxisWidth > yAxisWidth
            ? xAxisWidth - yAxisWidth
            : 0;
    }
}
