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
import { IVisualComponentConstructorOptions } from "./base/visualComponentConstructorOptions";
import { IVisualComponentRenderOptions } from "./base/visualComponentRenderOptions";

import {
    IVisualComponent,
    IVisualComponentViewport,
} from "./base/visualComponent";

import { LayoutToStyleEnum } from "../layout/layoutToStyleEnum";
import { LayoutComponent } from "./layoutComponent";
import { LegendComponent } from "./legendComponent";
import { LegendPosition } from "../settings/descriptors/legendDescriptor";

export class CommonComponent extends BaseContainerComponent<
    IVisualComponentConstructorOptions,
    IVisualComponentRenderOptions,
    IVisualComponentRenderOptions
    > {
    private className: string = "commonComponent";

    constructor(options: IVisualComponentConstructorOptions) {
        super();

        this.initElement(
            options.element,
            this.className,
            "div",
        );

        this.element.classed(this.className, true);

        this.constructorOptions = {
            ...options,
            element: this.element,
        };

        this.components = [
            new LegendComponent(this.constructorOptions),
            new LayoutComponent(this.constructorOptions),
        ];
    }

    public render(options: IVisualComponentRenderOptions): void {
        this.forEach(
            this.components,
            (component: IVisualComponent<IVisualComponentRenderOptions>) => {
                component.render(options);

                if (component.getViewport) {
                    const viewport: IVisualComponentViewport = component.getViewport();

                    options.data.viewport.height -= viewport.height;
                    options.data.viewport.width -= viewport.width;
                }
            },
        );

        const { data: { settings: { legend } } } = options;
        const layout: LayoutToStyleEnum = this.getLayout(legend.position.value?.value as LegendPosition);

        this.element.attr(
            "class",
            `${this.getClassNameWithPrefix(this.className)} ${LayoutToStyleEnum[layout]}`,
        );
    }

    private getLayout(position: LegendPosition): LayoutToStyleEnum {
        switch (position) {
            case LegendPosition.Left:
            case LegendPosition.LeftCenter: {
                return LayoutToStyleEnum.rowLayout;
            }
            case LegendPosition.Right:
            case LegendPosition.RightCenter: {
                return LayoutToStyleEnum.rowReversedLayout;
            }
            case LegendPosition.Top:
            case LegendPosition.TopCenter: {
                return LayoutToStyleEnum.columnLayout;
            }
            case LegendPosition.Bottom:
            case LegendPosition.BottomCenter:
            default: {
                return LayoutToStyleEnum.columnReversedLayout;
            }
        }
    }
}
