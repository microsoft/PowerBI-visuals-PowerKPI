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

import { pixelConverter } from "powerbi-visuals-utils-typeutils";

import { BaseContainerComponent } from "./base/baseContainerComponent";
import {
    VisualComponent,
    VisualComponentViewport,
} from "./base/visualComponent";

import { LayoutEnum } from "../layout/layoutEnum";
import { LayoutToStyleEnum } from "../layout/layoutToStyleEnum";
import { IVisualComponentConstructorOptions } from "./base/visualComponentConstructorOptions";
import { IVisualComponentRenderOptions } from "./base/visualComponentRenderOptions";
import { KPIComponent } from "./kpi/kpiComponent";
import { PlotComponent } from "./plotComponent";

export class LayoutComponent extends BaseContainerComponent<
    IVisualComponentConstructorOptions,
    IVisualComponentRenderOptions,
    IVisualComponentRenderOptions
    > {

    private className: string = "layoutComponent";

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

        this.components = [
            new KPIComponent(this.constructorOptions),
            new PlotComponent(this.constructorOptions),
        ];
    }

    public render(options: IVisualComponentRenderOptions): void {
        const { data: { viewport, settings: { layout } } } = options;

        const selectedLayout: LayoutToStyleEnum = this.getLayout(layout.getLayout());

        const widthInPx: string = pixelConverter.toString(viewport.width);
        const heightInPx: string = pixelConverter.toString(viewport.height);

        this.element
            .attr("class", `${this.getClassNameWithPrefix(this.className)} ${LayoutToStyleEnum[selectedLayout]}`)
            .style("min-width", widthInPx)
            .style("max-width", widthInPx)
            .style("width", widthInPx)
            .style("min-height", heightInPx)
            .style("max-height", heightInPx)
            .style("height", heightInPx);

        this.forEach(
            this.components,
            (component: VisualComponent<IVisualComponentRenderOptions>) => {
                component.render(options);

                if (component.getViewport) {
                    const margins: VisualComponentViewport = component.getViewport();

                    options.data.viewport.height -= margins.height;
                    options.data.viewport.width -= margins.width;
                }
            },
        );
    }

    private getLayout(layout: string): LayoutToStyleEnum {
        switch (LayoutEnum[layout]) {
            case LayoutEnum.Left: {
                return LayoutToStyleEnum.rowLayout;
            }
            case LayoutEnum.Right: {
                return LayoutToStyleEnum.rowReversedLayout;
            }
            case LayoutEnum.Bottom: {
                return LayoutToStyleEnum.columnReversedLayout;
            }
            case LayoutEnum.Top:
            default: {
                return LayoutToStyleEnum.columnLayout;
            }
        }
    }
}
