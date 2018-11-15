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

import {
    Selection,
} from "d3";

import powerbi from "powerbi-visuals-api";

import { EventName } from "../../event/eventName";

import {
    CssConstants,
} from "powerbi-visuals-utils-svgutils";

import {
    pixelConverter,
} from "powerbi-visuals-utils-typeutils";

import {
    IVisualComponentConstructorOptions,
} from "./visualComponentConstructorOptions";

import {
    VisualComponent,
    VisualComponentViewport,
} from "./visualComponent";

export abstract class BaseComponent<ConstructorOptionsType
    extends IVisualComponentConstructorOptions, RenderOptionsType>
    implements VisualComponent<RenderOptionsType> {

    public get isShown(): boolean {
        return this.isComponentShown;
    }

    protected hiddenClassName: string = this.getClassNameWithPrefix("hidden");

    protected boldClassName: string = this.getClassNameWithPrefix("bold");
    protected italicClassName: string = this.getClassNameWithPrefix("italic");
    protected underlinedClassName: string = this.getClassNameWithPrefix("underlined");

    protected element: Selection<any, RenderOptionsType, any, any>;

    protected constructorOptions: ConstructorOptionsType;
    protected renderOptions: RenderOptionsType;

    protected minWidth: number = 20;
    protected width: number = 0;

    protected minHeight: number = 20;
    protected height: number = 0;
    private isComponentShown: boolean = true;
    private classNamePrefix: string = "powerKpi_";

    public abstract render(options: RenderOptionsType): void;

    public highlight(hasSelection: boolean): void {
        return;
    }

    public initElement(
        baseElement: Selection<any, RenderOptionsType, any, any>,
        className: string,
        tagName: string = "div",
    ): void {
        this.element = this.createElement(
            baseElement,
            className,
            tagName,
        );
    }

    public clear(): void {
        if (!this.element) {
            return;
        }

        this.clearElement(this.element);
    }

    public destroy(): void {
        if (this.element) {
            this.element.remove();
        }

        this.element = null;
        this.constructorOptions = null;
        this.renderOptions = null;
    }

    public hide(): void {
        if (!this.element || !this.isComponentShown) {
            return;
        }

        this.element.style("display", "none");

        this.isComponentShown = false;
    }

    public show(): void {
        if (!this.element || this.isComponentShown) {
            return;
        }

        this.element.style("display", null);

        this.isComponentShown = true;
    }

    public toggle(): void {
        if (this.isComponentShown) {
            this.hide();
        } else {
            this.show();
        }
    }

    public updateSize(width: number, height: number): void {
        if (!isNaN(width) && isFinite(width)) {
            this.width = Math.max(this.minWidth, width);
        } else {
            this.width = undefined;
        }

        if (!isNaN(height) && isFinite(height)) {
            this.height = Math.max(this.minHeight, height);
        } else {
            this.height = undefined;
        }

        this.updateSizeOfElement(this.width, this.height);
    }

    public getViewport(): VisualComponentViewport {
        return {
            height: this.height,
            width: this.width,
        };
    }

    public getRenderOptions(): RenderOptionsType {
        return this.renderOptions || null;
    }

    protected createElement(
        baseElement: Selection<any, RenderOptionsType, any, any>,
        className: string,
        tagName: string = "div",
    ): Selection<any, RenderOptionsType, any, any> {
        return baseElement
            .append(tagName)
            .classed(this.getClassNameWithPrefix(className), true);
    }

    protected getClassNameWithPrefix(className: string): string {
        return className
            ? `${this.classNamePrefix}${className}`
            : className;
    }

    protected getSelectorWithPrefix(className: string): CssConstants.ClassAndSelector {
        return CssConstants.createClassAndSelector(this.getClassNameWithPrefix(className));
    }

    protected clearElement(element: Selection<any, any, any, any>): void {
        element
            .selectAll("*")
            .remove();
    }

    protected updateViewport(viewport: powerbi.IViewport): void {
        this.element
            .style("width", pixelConverter.toString(viewport.width))
            .style("height", pixelConverter.toString(viewport.height));
    }

    protected updateBackgroundColor(element: Selection<any, any, any, any>, color: string): void {
        if (!element) {
            return;
        }

        element.style("background-color", color || null);
    }

    protected updateSizeOfElement(width: number, height: number): void {
        if (!this.element) {
            return;
        }

        const styleObject: any = {};

        styleObject.width
            = styleObject["min-width"]
            = styleObject["max-width"]
            = width !== undefined && width !== null
                ? pixelConverter.toString(width)
                : null;

        styleObject.height
            = styleObject["min-height"]
            = styleObject["max-height"]
            = height !== undefined && height !== null
                ? pixelConverter.toString(height)
                : null;

        this.element.style(styleObject);
    }

    protected updateElementOrder(element: Selection<any, any, any, any>, order: number): void {
        if (!element) {
            return;
        }

        const browserSpecificOrder: number = order + 1;

        element
            .style("-webkit-box-ordinal-group", browserSpecificOrder)
            .style("-ms-flex-order", order)
            .style("order", order);
    }

    protected updateElementOpacity(
        element: Selection<any, any, any, any>,
        opacity: number,
        selected: boolean,
        hasSelection: boolean,
    ): void {
        if (!element) {
            return;
        }

        const shouldBeSelected: boolean = hasSelection
            ? selected
            : true;

        element.style("opacity", shouldBeSelected ? opacity : opacity / 3);
    }

    protected clickHandler(): void {
        if (!this.constructorOptions
            || !this.constructorOptions.eventDispatcher
        ) {
            return;
        }

        this.constructorOptions.eventDispatcher.call(
            EventName.onClick,
            undefined,
            this,
            require("d3-selection").event,
        );
    }
}
