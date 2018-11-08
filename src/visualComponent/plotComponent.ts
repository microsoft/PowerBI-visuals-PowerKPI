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

import { BaseContainerComponent } from "./base/baseContainerComponent";
import { VisualComponentConstructorOptions } from "./base/visualComponentConstructorOptions";
import { VisualComponentRenderOptions } from "./base/visualComponentRenderOptions";
import { AxisComponent } from "./axes/axisBaseComponent";

import {
    VisualComponent,
    VisualComponentViewport
} from "./base/visualComponent";

import {
    XAxisComponent,
    XAxisComponentRenderOptions
} from "./axes/xAxisComponent";

import {
    YAxisComponent,
    YAxisComponentRenderOptions
} from "./axes/yAxisComponent";

import {
    SvgComponent,
    SvgComponentRenderOptions
} from "./svgComponent";

export class PlotComponent extends BaseContainerComponent<VisualComponentConstructorOptions, VisualComponentRenderOptions, VisualComponentRenderOptions | XAxisComponentRenderOptions | YAxisComponentRenderOptions> {
    private xAxisComponent: AxisComponent<XAxisComponentRenderOptions>;
    private yAxisComponent: AxisComponent<YAxisComponentRenderOptions>;
    private secondaryYAxisComponent: AxisComponent<YAxisComponentRenderOptions>;
    private svgComponent: VisualComponent<SvgComponentRenderOptions>;

    private additionalWidthOffset: number = 5;

    constructor(options: VisualComponentConstructorOptions) {
        super();

        this.initElement(
            options.element,
            "plot"
        );

        this.constructorOptions = {
            ...options,
            element: this.element,
        };

        this.hide();

        this.yAxisComponent = new YAxisComponent(this.constructorOptions);
        this.svgComponent = new SvgComponent(this.constructorOptions);
        this.secondaryYAxisComponent = new YAxisComponent(this.constructorOptions);
        this.xAxisComponent = new XAxisComponent(this.constructorOptions);

        this.components = [
            this.yAxisComponent,
            this.svgComponent,
            this.secondaryYAxisComponent,
            this.xAxisComponent,
        ];
    }

    public render(options: VisualComponentRenderOptions): void {
        const {
            x,
            margin,
            groups: [firstGroup, secondGroup],
            viewport,
            settings: {
                xAxis,
                yAxis,
                secondaryYAxis,
            },
        } = options.data;

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
            axis: x,
            settings: xAxis,
            margin: null,
            viewport: null,
            additionalMargin: null,
        });

        this.yAxisComponent.preRender({
            margin: null,
            viewport: null,
            settings: yAxis,
            axis: firstGroup && firstGroup.y,
        });

        this.secondaryYAxisComponent.preRender({
            margin: null,
            viewport: null,
            settings: secondaryYAxis,
            axis: secondGroup && secondGroup.y
        });

        const xAxisViewport: VisualComponentViewport = this.xAxisComponent.getViewport();

        const maxYAxisHeight: number = Math.max(
            this.yAxisComponent.getViewport().height,
            this.secondaryYAxisComponent.getViewport().height,
        );

        const height: number = Math.max(
            0,
            reducedViewport.height - xAxisViewport.height - maxYAxisHeight
        );

        this.yAxisComponent.render({
            margin,
            viewport: {
                height,
                width: reducedViewport.width,
            },
            axis: firstGroup && firstGroup.y,
            settings: yAxis,
        });

        this.secondaryYAxisComponent.render({
            margin,
            viewport: {
                height,
                width: reducedViewport.width,
            },
            axis: secondGroup && secondGroup.y,
            settings: secondaryYAxis,
        });

        const yAxisViewport: VisualComponentViewport = this.yAxisComponent.getViewport();
        const secondaryYAxisViewport: VisualComponentViewport = this.secondaryYAxisComponent.getViewport();

        const leftOffset: number = this.getOffset(xAxisViewport.width, yAxisViewport.width);
        const rightOffset: number = this.getOffset(xAxisViewport.width2, secondaryYAxisViewport.width);

        const width: number = Math.max(0,
            reducedViewport.width
            - yAxisViewport.width
            - secondaryYAxisViewport.width
            - leftOffset
            - rightOffset
        );

        this.xAxisComponent.render({
            margin,
            additionalMargin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: yAxisViewport.width + leftOffset,
            },
            viewport: {
                width,
                height: reducedViewport.height,
            },
            axis: x,
            settings: xAxis,
        });

        this.svgComponent.render({
            data: {
                ...options.data,
                margin,
                viewport: {
                    width,
                    height,
                },
            },
            xTicks: this.xAxisComponent.getTicks(),
            yTicks: this.yAxisComponent.getTicks(),
            secondaryYTicks: this.secondaryYAxisComponent.getTicks(),
            additionalMargin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: leftOffset
            },
        });
    }

    public destroy(): void {
        super.destroy();

        this.xAxisComponent = null;
        this.yAxisComponent = null;
        this.secondaryYAxisComponent = null;
        this.svgComponent = null;
    }

    private getOffset(xAxisWidth: number, yAxisWidth: number): number {
        return xAxisWidth > yAxisWidth
            ? xAxisWidth - yAxisWidth
            : 0;
    }
}
