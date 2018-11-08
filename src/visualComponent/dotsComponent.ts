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

import { VisualComponent } from "./base/visualComponent";
import { VisualComponentConstructorOptions } from "./base/visualComponentConstructorOptions";
import { VisualComponentRenderOptions } from "./base/visualComponentRenderOptions";
import { BaseContainerComponent } from "./base/baseContainerComponent";
import { DataRepresentationSeries } from "../dataRepresentation/dataRepresentationSeries";
import { DataRepresentationPoint } from "../dataRepresentation/dataRepresentationPoint";

import {
    DotComponent,
    DotComponentRenderOptions,
} from "./dotComponent";

export class DotsComponent extends BaseContainerComponent<VisualComponentConstructorOptions, VisualComponentRenderOptions, DotComponentRenderOptions> {
    private className: string = "dotsComponent";

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
    }

    public render(options: VisualComponentRenderOptions): void {
        const {
            x,
            series,
            viewport,
            settings: { dots }
        } = options.data;

        this.initComponents(
            this.components,
            series.length,
            () => {
                return new DotComponent(this.constructorOptions);
            }
        );

        this.forEach(
            this.components,
            (component: VisualComponent<DotComponentRenderOptions>, componentIndex: number) => {
                const currentSeries: DataRepresentationSeries = series[componentIndex];

                const point: DataRepresentationPoint = currentSeries.points
                    .filter((point: DataRepresentationPoint) => {
                        return point.y !== null && !isNaN(point.y);
                    })[0];

                if (point) {
                    component.show();

                    component.render({
                        x: x.scale,
                        point,
                        viewport,
                        y: currentSeries.y.scale,
                        thickness: currentSeries.settings.line.thickness,
                        radiusFactor: dots.radiusFactor,
                        series: currentSeries,
                    });
                } else {
                    component.hide();
                }
            }
        );
    }
}
