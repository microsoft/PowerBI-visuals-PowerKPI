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

    interface CaptionKPIComponentAttributes {
        isShown: boolean;
        size: IViewport;
    }

    export class CaptionKPIComponent implements KPIVisualComponent<CaptionKPIComponentOptions> {
        private className: string = "captionKPIComponent";
        private invisibleClassName: string = "invisible";

        protected innerContainerSelector: ClassAndSelector = createClassAndSelector("captionKPIComponentInnerContainer");
        private captionContainerSelector: ClassAndSelector = createClassAndSelector("kpiCaptionContainer");
        private captionSelector: ClassAndSelector = createClassAndSelector("kpiCaption");

        private sizeOffset: IViewport = {
            width: 15,
            height: 5
        };

        protected element: D3.Selection;
        protected innerContainer: D3.Selection;

        private isComponentRendered: boolean = false;

        private size: IViewport;

        constructor(options: KPIComponentConstructorOptionsWithClassName) {
            this.element = options.element
                .append("div")
                .classed(this.className, true)
                .classed(options.className, true);
        }

        public render(options: CaptionKPIComponentOptions): void {
            const {
                captions,
                align,
                data: {
                    viewport,
                    settings: {
                        layout
                    }
                 },
             } = options;

            let {
                isShown,
                size
            } = this.getAttributes(captions);

            this.size = size;

            isShown = layout.autoHideVisualComponents
                ? isShown && this.canComponentBeRenderedAtViewport(viewport, layout.getLayout())
                : isShown;

            this.isComponentRendered = isShown;

            this.element.classed(this.invisibleClassName, !isShown);

            this.innerContainer = this.getDynamicElement(
                this.element,
                this.innerContainerSelector,
                isShown,
                align);

            this.renderElement(
                this.innerContainer,
                captions,
                this.captionContainerSelector,
                this.captionSelector);
        }

        private getAttributes(captions: CaptionKPIComponentOptionsValueSettings[][]): CaptionKPIComponentAttributes {
            let isShown: boolean = false;

            const size: IViewport = {
                width: 0,
                height: 0
            };

            captions.forEach((captionList: CaptionKPIComponentOptionsValueSettings[]) => {
                let width: number = 0;
                let height: number = 0;

                captionList.forEach((caption: CaptionKPIComponentOptionsValueSettings) => {
                    isShown = isShown || caption.settings.show;

                    if (caption.settings.show) {
                        const text: string = caption.value || "M";

                        let rect: SVGRect = TextMeasurementService.measureSvgTextRect({
                            text,
                            fontFamily: caption.settings.fontFamily,
                            fontSize: PixelConverter.toString(PixelConverter.fromPointToPixel(caption.settings.fontSize))
                        }, text);

                        height = Math.max(height, rect.height + this.sizeOffset.height);
                        width += rect.width + this.sizeOffset.width;
                    }
                });

                size.height += height;
                size.width = Math.max(size.width, width);
            });

            return {
                size,
                isShown: isShown
            };
        }

        private canComponentBeRenderedAtViewport(viewport: IViewport, layout: string): boolean {
            switch (LayoutEnum[layout]) {
                case LayoutEnum.Left:
                case LayoutEnum.Right: {
                    return viewport.height >= this.size.height;
                }
                case LayoutEnum.Top:
                case LayoutEnum.Bottom: {
                    return viewport.width >= this.size.width;
                }
                default: {
                    return false;
                }
            }
        }

        private getDynamicElement(
            element: D3.Selection,
            selector: ClassAndSelector,
            shouldElementBeRendered: boolean,
            align: AlignEnum
        ): D3.Selection {
            const selection: D3.UpdateSelection = element
                .selectAll(selector.selector)
                .data(shouldElementBeRendered ? [shouldElementBeRendered] : []);

            selection
                .enter()
                .append("div")
                .classed(selector.class, true);

            selection.attr({
                "class": `${selector.class} ${AlignEnum[align]}`
            });

            selection
                .exit()
                .remove();

            return selection;
        }

        protected renderElement(
            element: D3.Selection,
            captions: CaptionKPIComponentOptionsValueSettings[][],
            containerSelector: ClassAndSelector,
            selector: ClassAndSelector
        ): void {
            const containerSelection: D3.UpdateSelection = element
                .selectAll(containerSelector.selector)
                .data(captions);

            containerSelection
                .enter()
                .append("div")
                .classed(containerSelector.class, true);

            const elementSelection: D3.UpdateSelection = containerSelection
                .selectAll(selector.selector)
                .data((captions: CaptionKPIComponentOptionsValueSettings[]) => {
                    return (captions || []).filter((options: CaptionKPIComponentOptionsValueSettings) => {
                        return options
                            && options.settings
                            && options.settings.show;
                    });
                });

            elementSelection
                .enter()
                .append("div")
                .classed(selector.class, true);

            elementSelection
                .attr({
                    title: (options: CaptionKPIComponentOptionsValueSettings) => options.title || null,
                    "class": (options: CaptionKPIComponentOptionsValueSettings) => {
                        let className: string = selector.class;

                        if (options.settings.isBold) {
                            className += " boldStyle";
                        }

                        if (options.settings.isItalic) {
                            className += " italicStyle";
                        }

                        if (options.className) {
                            className += ` ${options.className}`;
                        }

                        return className;
                    }
                })
                .style({
                    color: (options: CaptionKPIComponentOptionsValueSettings) => options.settings.fontColor,
                    "font-size": (options: CaptionKPIComponentOptionsValueSettings) => {
                        return PixelConverter.toString(PixelConverter.fromPointToPixel(options.settings.fontSize));
                    },
                    "font-family": (options: CaptionKPIComponentOptionsValueSettings) => options.settings.fontFamily,
                })
                .text((options: CaptionKPIComponentOptionsValueSettings) => options.value);

            elementSelection
                .exit()
                .remove();

            containerSelection
                .exit()
                .remove();
        }

        public isRendered(): boolean {
            return this.isComponentRendered;
        }

        public clear(): void {
            this.element.remove();
        }

        public destroy(): void {
            this.element = null;
        }

        public getViewport(): VisualComponentViewport {
            if (!this.size) {
                return {
                    height: 0,
                    width: 0
                };
            }

            return this.size;
        }
    }
}
