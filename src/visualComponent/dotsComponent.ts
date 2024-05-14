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

import { IDataRepresentationPoint } from "../dataRepresentation/dataRepresentationPoint";
import { IDataRepresentationSeries } from "../dataRepresentation/dataRepresentationSeries";
import { BaseContainerComponent } from "./base/baseContainerComponent";
import { IVisualComponent } from "./base/visualComponent";
import { IVisualComponentConstructorOptions } from "./base/visualComponentConstructorOptions";
import { IVisualComponentRenderOptions } from "./base/visualComponentRenderOptions";

import {
    DotComponent,
    IDotComponentRenderOptions,
} from "./dotComponent";

export class DotsComponent extends BaseContainerComponent<
    IVisualComponentConstructorOptions,
    IVisualComponentRenderOptions,
    IDotComponentRenderOptions
    > {
    private className: string = "dotsComponent";

    constructor(options: IVisualComponentConstructorOptions) {
        super();

        this.initElement(
            options.element,
            this.className,
            "g",
        );

        this.constructorOptions = {
            ...options,
            element: this.element,
        };
    }

    public render(options: IVisualComponentRenderOptions): void {
        const {
            data: {
                 x,
                series,
                viewport,
                settings: { dots, line },
            },           
            colorPalette
        } = options;

        this.initComponents(
            this.components,
            series.length,
            () => {
                return new DotComponent(this.constructorOptions);
            },
        );

        this.forEach(
            this.components,
            (component: IVisualComponent<IDotComponentRenderOptions>, componentIndex: number) => {
                const currentSeries: IDataRepresentationSeries = series[componentIndex];

                const point: IDataRepresentationPoint = currentSeries.points
                    .filter((currentPoint: IDataRepresentationPoint) => {
                        return currentPoint.y !== null && !isNaN(currentPoint.y);
                    })[0];

                if (point) {
                    component.show();

                    const lineSettings = line.getCurrentSettings(currentSeries.containerName)
                    component.render({
                        point,
                        radiusFactor: dots.radiusFactor.value,
                        series: currentSeries,
                        thickness: lineSettings.thickness,
                        viewport,
                        x: x.scale,
                        y: currentSeries.y.scale,
                        colorPalette
                    });
                } else {
                    component.hide();
                }
            },
        );
    }
}
