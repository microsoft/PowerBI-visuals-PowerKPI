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

namespace powerbi.visuals.samples.powerKpi {
    // jsCommon
    import PixelConverter = jsCommon.PixelConverter;
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    import createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;

    export abstract class BaseComponent<ConstructorOptionsType extends VisualComponentConstructorOptions, RenderOptionsType> implements VisualComponent<RenderOptionsType> {
        private isComponentShown: boolean = true;
        private classNamePrefix: string = "powerKpi_";

        protected hiddenClassName: string = this.getClassNameWithPrefix("hidden");

        protected boldClassName: string = this.getClassNameWithPrefix("bold");
        protected italicClassName: string = this.getClassNameWithPrefix("italic");
        protected underlinedClassName: string = this.getClassNameWithPrefix("underlined");

        protected element: D3.Selection;

        protected constructorOptions: ConstructorOptionsType;
        protected renderOptions: RenderOptionsType;

        protected minWidth: number = 20;
        protected width: number = 0;

        protected minHeight: number = 20;
        protected height: number = 0;

        public abstract render(options: RenderOptionsType): void;

        public highlight(hasSelection: boolean): void { }

        public initElement(
            baseElement: D3.Selection,
            className: string,
            tagName: string = "div"
        ): void {
            this.element = this.createElement(
                baseElement,
                className,
                tagName
            );
        }

        protected createElement(
            baseElement: D3.Selection,
            className: string,
            tagName: string = "div"
        ): D3.Selection {
            return baseElement
                .append(tagName)
                .classed(this.getClassNameWithPrefix(className), true);
        }

        protected getClassNameWithPrefix(className: string): string {
            return className
                ? `${this.classNamePrefix}${className}`
                : className;
        }

        protected getSelectorWithPrefix(className: string): ClassAndSelector {
            return createClassAndSelector(this.getClassNameWithPrefix(className));
        }

        public clear(): void {
            if (!this.element) {
                return;
            }

            this.clearElement(this.element);
        }

        protected clearElement(element: D3.Selection): void {
            element
                .selectAll("*")
                .remove();
        }

        public destroy(): void {
            if (this.element) {
                this.element.remove();
            }

            this.element = null;
            this.constructorOptions = null;
            this.renderOptions = null;
        }

        protected updateViewport(viewport: IViewport): void {
            this.element.style({
                width: PixelConverter.toString(viewport.width),
                height: PixelConverter.toString(viewport.height)
            });
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

        public get isShown(): boolean {
            return this.isComponentShown;
        }

        protected updateBackgroundColor(element: D3.Selection, color: string): void {
            if (!element) {
                return;
            }

            element.style("background-color", color || null);
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

        protected updateSizeOfElement(width: number, height: number): void {
            if (!this.element) {
                return;
            }

            const styleObject: any = {};

            styleObject["width"]
                = styleObject["min-width"]
                = styleObject["max-width"]
                = width !== undefined && width !== null
                    ? PixelConverter.toString(width)
                    : null;

            styleObject["height"]
                = styleObject["min-height"]
                = styleObject["max-height"]
                = height !== undefined && height !== null
                    ? PixelConverter.toString(height)
                    : null;

            this.element.style(styleObject);
        }

        public getViewport(): VisualComponentViewport {
            return {
                width: this.width,
                height: this.height,
            };
        }

        protected updateElementOrder(element: D3.Selection, order: number): void {
            if (!element) {
                return;
            }

            const browserSpecificOrder: number = order + 1;

            element.style({
                "-webkit-box-ordinal-group": browserSpecificOrder,
                "-ms-flex-order": order,
                order,
            });
        }

        protected updateElementOpacity(
            element: D3.Selection,
            opacity: number,
            selected: boolean,
            hasSelection: boolean
        ): void {
            if (!element) {
                return;
            }

            const shouldBeSelected: boolean = hasSelection
                ? selected
                : true;

            element.style("opacity", shouldBeSelected ? opacity : opacity / 3);
        }

        public getRenderOptions(): RenderOptionsType {
            return this.renderOptions || null;
        }

        protected clickHandler(): void {
            if (!this.constructorOptions
                || !this.constructorOptions.eventDispatcher
            ) {
                return;
            }

            this.constructorOptions.eventDispatcher[EventName.onClick](
                this,
                d3.event,
            );
        }
    }
}
