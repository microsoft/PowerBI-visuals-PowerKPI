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

import { BaseContainerComponent } from "./base/baseContainerComponent";
import { VisualComponent } from "./base/visualComponent";
import { VisualComponentConstructorOptions } from "./base/visualComponentConstructorOptions";
import { VisualComponentRenderOptions } from "./base/visualComponentRenderOptions";

import {
    DotComponent,
    DotComponentRenderOptions
} from "./dotComponent";

import {
    ComboComponent,
    ComboComponentRenderOptions
} from "./combo/comboComponent";

import { EventName } from "../event/eventName";
import { DataRepresentationSeries } from "../dataRepresentation/dataRepresentationSeries";
import { DataRepresentationPoint } from "../dataRepresentation/dataRepresentationPoint";

export class ChartComponent extends BaseContainerComponent<VisualComponentConstructorOptions, VisualComponentRenderOptions, DotComponentRenderOptions | ComboComponentRenderOptions> {
    private className: string = "multiShapeComponent";

    private amountOfDataPointsForFallbackComponents: number = 1;
    private shouldRenderFallbackComponents: boolean = false;

    constructor(options: VisualComponentConstructorOptions) {
        super();

        this.initElement(
            options.element,
            this.className,
            "g"
        );

        this.constructorOptions = {
            ...options,
            element: this.element,
        };

        if (this.constructorOptions.eventDispatcher) {
            this.constructorOptions.eventDispatcher.on(
                EventName.onHighlight,
                this.highlight.bind(this)
            );
        }
    }

    public render(options: VisualComponentRenderOptions): void {
        const { data: { sortedSeries, viewport, x, settings } } = options;

        const shouldRenderFallbackComponents: boolean = sortedSeries
            && sortedSeries[0]
            && sortedSeries[0].points
            && sortedSeries[0].points.length === this.amountOfDataPointsForFallbackComponents;

        if (this.shouldRenderFallbackComponents !== shouldRenderFallbackComponents) {
            this.forEach(
                this.components,
                (component: VisualComponent<any>) => {
                    component.destroy();
                }
            );

            this.components = [];

            this.shouldRenderFallbackComponents = shouldRenderFallbackComponents;
        }

        this.initComponents(
            this.components,
            sortedSeries.length,
            () => {
                return this.shouldRenderFallbackComponents
                    ? new DotComponent(this.constructorOptions)
                    : new ComboComponent(this.constructorOptions);
            }
        );

        this.forEach(
            this.components,
            (component: VisualComponent<DotComponentRenderOptions | ComboComponentRenderOptions>, componentIndex: number) => {
                const currentSeries: DataRepresentationSeries = sortedSeries[componentIndex];

                if (this.shouldRenderFallbackComponents) {
                    const point: DataRepresentationPoint = currentSeries.points[0];

                    component.render({
                        point,
                        viewport,
                        thickness: currentSeries.settings.line.thickness,
                        x: x.scale,
                        y: currentSeries.y.scale,
                        radiusFactor: settings.dots.radiusFactor,
                        opacity: currentSeries.settings.line.opacity,
                        series: currentSeries,
                    });
                } else {
                    component.render({
                        viewport,
                        thickness: currentSeries.settings.line.thickness,
                        x: x.scale,
                        y: currentSeries.y.scale,
                        interpolation: currentSeries.settings.line.getInterpolation(),
                        lineStyle: currentSeries.settings.line.lineStyle,
                        gradientPoints: currentSeries.gradientPoints,
                        lineType: currentSeries.settings.line.lineType,
                        opacity: currentSeries.settings.line.opacity,
                        areaOpacity: currentSeries.settings.line.areaOpacity,
                        series: currentSeries,
                    });
                }
            }
        );
    }
}
