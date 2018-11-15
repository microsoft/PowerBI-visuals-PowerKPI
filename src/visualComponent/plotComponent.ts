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
    VisualComponent,
    VisualComponentViewport,
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

export class PlotComponent extends BaseContainerComponent<
    IVisualComponentConstructorOptions,
    IVisualComponentRenderOptions,
    IVisualComponentRenderOptions | IXAxisComponentRenderOptions | IYAxisComponentRenderOptions
    > {
    private xAxisComponent: IAxisComponent<IXAxisComponentRenderOptions>;
    private yAxisComponent: IAxisComponent<IYAxisComponentRenderOptions>;
    private secondaryYAxisComponent: IAxisComponent<IYAxisComponentRenderOptions>;
    private svgComponent: VisualComponent<ISvgComponentRenderOptions>;

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

    public render(options: IVisualComponentRenderOptions): void {
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
            additionalMargin: null,
            axis: x,
            margin: null,
            settings: xAxis,
            viewport: null,
        });

        this.yAxisComponent.preRender({
            axis: firstGroup && firstGroup.y,
            margin: null,
            settings: yAxis,
            viewport: null,
        });

        this.secondaryYAxisComponent.preRender({
            axis: secondGroup && secondGroup.y,
            margin: null,
            settings: secondaryYAxis,
            viewport: null,
        });

        const xAxisViewport: VisualComponentViewport = this.xAxisComponent.getViewport();

        const maxYAxisHeight: number = Math.max(
            this.yAxisComponent.getViewport().height,
            this.secondaryYAxisComponent.getViewport().height,
        );

        const height: number = Math.max(
            0,
            reducedViewport.height - xAxisViewport.height - maxYAxisHeight,
        );

        this.yAxisComponent.render({
            axis: firstGroup && firstGroup.y,
            margin,
            settings: yAxis,
            viewport: {
                height,
                width: reducedViewport.width,
            },
        });

        this.secondaryYAxisComponent.render({
            axis: secondGroup && secondGroup.y,
            margin,
            settings: secondaryYAxis,
            viewport: {
                height,
                width: reducedViewport.width,
            },
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
            - rightOffset,
        );

        this.xAxisComponent.render({
            additionalMargin: {
                bottom: 0,
                left: yAxisViewport.width + leftOffset,
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
