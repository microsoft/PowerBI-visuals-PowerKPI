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
import { CssConstants } from "powerbi-visuals-utils-svgutils";
import { pixelConverter } from "powerbi-visuals-utils-typeutils";

import { LayoutEnum } from "../../layout/layoutEnum";
import { LayoutToStyleEnum } from "../../layout/layoutToStyleEnum";
import { LayoutDescriptor } from "../../settings/descriptors/layoutDescriptor";
import { LegendDescriptor, LegendPosition } from "../../settings/descriptors/legendDescriptor";
import { BaseContainerComponent } from "../base/baseContainerComponent";
import { IVisualComponentViewport } from "../base/visualComponent";
import { IVisualComponentConstructorOptions } from "../base/visualComponentConstructorOptions";
import { IVisualComponentRenderOptions } from "../base/visualComponentRenderOptions";
import { DateKPIComponent } from "./dateKPIComponent";
import { IKPIComponentConstructorOptionsWithClassName } from "./kpiComponentConstructorOptionsWithClassName";
import { IKPIVisualComponent } from "./kpiVisualComponent";
import { ValueKPIComponent } from "./valueKPIComponent";
import { VarianceComponentWithCustomLabel } from "./varianceComponentWithCustomLabel";
import { VarianceComponentWithIndicator } from "./varianceComponentWithIndicator";

enum KPIComponentLayoutEnum {
    kpiComponentRow,
    kpiComponentColumn,
}

export class KPIComponent extends BaseContainerComponent<
    IVisualComponentConstructorOptions,
    IVisualComponentRenderOptions,
    IVisualComponentRenderOptions
    > {
    private className: string = "kpiComponent";

    private layout: LayoutEnum = LayoutEnum.Top;

    private childSelector: CssConstants.ClassAndSelector = CssConstants.createClassAndSelector("kpiComponentChild");

    constructor(options: IVisualComponentConstructorOptions) {
        super();

        this.initElement(
            options.element,
            this.className,
        );

        const className: string = this.childSelector.className;

        const constructorOptions: IKPIComponentConstructorOptionsWithClassName = {
            ...options,
            className,
            element: this.element,
        };

        this.components = [
            new VarianceComponentWithIndicator(constructorOptions),
            new DateKPIComponent(constructorOptions),
            new ValueKPIComponent(constructorOptions),
            new VarianceComponentWithCustomLabel(constructorOptions),
        ];
    }

    public render(options: IVisualComponentRenderOptions): void {
        const { viewport: { width, height }, settings: { layout, legend } } = options.data;

        const viewport: powerbi.IViewport = { width, height };
        this.layout = layout.layout.value?.value as LayoutEnum;

        this.applyStyleBasedOnLayout(layout, legend, viewport);

        let howManyComponentsWasRendered: number = 0;

        this.components.forEach((component: IKPIVisualComponent<IVisualComponentRenderOptions>) => {

            component.render(options);

            if (component.isRendered()) {
                howManyComponentsWasRendered++;
            }

            if (component.getViewport) {
                const margins: IVisualComponentViewport = component.getViewport();

                switch (this.layout) {
                    case LayoutEnum.Left:
                    case LayoutEnum.Right: {
                        options.data.viewport.height -= margins.height;
                        break;
                    }
                    case LayoutEnum.Bottom:
                    case LayoutEnum.Top:
                    default: {
                        options.data.viewport.width -= margins.width;
                        break;
                    }
                }
            }
        });

        options.data.viewport = viewport;

        this.applyWidthToChildren(howManyComponentsWasRendered);
    }

    /**
     * The clientHeight and clientWidth might return invalid values if some DOM elements force this element to squash.
     * Such issue often occurs if flex layout is used
     *
     * To fix this issue plotComponent is hidden by default.
     */
    public getViewport(): IVisualComponentViewport {
        const viewport: IVisualComponentViewport = {
            height: 0,
            width: 0,
        };

        if (this.element) {
            const element: HTMLDivElement = this.element.node();

            switch (this.layout) {
                case LayoutEnum.Left:
                case LayoutEnum.Right: {
                    viewport.width = element.clientWidth;
                    break;
                }
                case LayoutEnum.Top:
                case LayoutEnum.Bottom:
                default: {
                    viewport.height = element.clientHeight;
                    break;
                }
            }
        }

        return viewport;
    }

    private applyStyleBasedOnLayout(
        layoutSettings: LayoutDescriptor,
        legend: LegendDescriptor,
        viewport: powerbi.IViewport,
    ): void {
        let currentLayout: LayoutToStyleEnum;
        let kpiLayout: KPIComponentLayoutEnum;
        let maxWidth: string;
        switch (layoutSettings.layout.value?.value) {
            case LayoutEnum.Left:
            case LayoutEnum.Right: {
                kpiLayout = KPIComponentLayoutEnum.kpiComponentColumn;
                maxWidth = null;

                if (
                    !legend.isElementShown() || 
                    legend.position.value?.value === LegendPosition.Bottom || 
                    legend.position.value?.value === LegendPosition.BottomCenter
                ) {
                    currentLayout = LayoutToStyleEnum.columnReversedLayout;
                } else {
                    currentLayout = LayoutToStyleEnum.columnLayout;
                }

                break;
            }
            case LayoutEnum.Bottom:
            case LayoutEnum.Top:
            default: {
                currentLayout = LayoutToStyleEnum.rowLayout;
                kpiLayout = KPIComponentLayoutEnum.kpiComponentRow;
                maxWidth = pixelConverter.toString(Math.floor(viewport.width));

                break;
            }
        }

        this.element
            .style("max-width", maxWidth)
            .attr("class", `${this.className} ${LayoutToStyleEnum[currentLayout]} ${KPIComponentLayoutEnum[kpiLayout]}`);
    }

    private applyWidthToChildren(howManyComponentsWasRendered: number): void {
        let width: number = 100;

        if (this.layout === LayoutEnum.Top || this.layout === LayoutEnum.Bottom) {
            width = width / howManyComponentsWasRendered;
        }

        const widthInPercentage: string = `${width}%`;

        this.element
            .selectAll(this.childSelector.selectorName)
            .style("width", widthInPercentage)
            .style("max-width", widthInPercentage);
    }
}
