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

import { Selection } from "d3";

import powerbi from "powerbi-visuals-api";
import { textMeasurementService } from "powerbi-visuals-utils-formattingutils";
import { CssConstants } from "powerbi-visuals-utils-svgutils";
import { pixelConverter } from "powerbi-visuals-utils-typeutils";

import { IVisualComponentViewport } from "../base/visualComponent";
import {
    ICaptionKPIComponentOptions,
    ICaptionKPIComponentOptionsValueSettings,
} from "./captionKPIComponentOptions";
import { IKPIComponentConstructorOptionsWithClassName } from "./kpiComponentConstructorOptionsWithClassName";
import { IKPIVisualComponent } from "./kpiVisualComponent";

import { LayoutEnum } from "../../layout/layoutEnum";
import { AlignEnum } from "./alignEnum";

interface ICaptionKPIComponentAttributes {
    isShown: boolean;
    size: powerbi.IViewport;
}

export class CaptionKPIComponent implements IKPIVisualComponent<ICaptionKPIComponentOptions> {
    protected innerContainerSelector: CssConstants.ClassAndSelector =
        CssConstants.createClassAndSelector("captionKPIComponentInnerContainer");

    protected element: Selection<any, any, any, any>;
    protected innerContainer: Selection<any, any, any, any>;
    private className: string = "captionKPIComponent";
    private invisibleClassName: string = "invisible";
    private captionContainerSelector: CssConstants.ClassAndSelector = CssConstants.createClassAndSelector("kpiCaptionContainer");
    private captionSelector: CssConstants.ClassAndSelector = CssConstants.createClassAndSelector("kpiCaption");

    private sizeOffset: powerbi.IViewport = {
        height: 5,
        width: 15,
    };

    private isComponentRendered: boolean = false;

    private size: powerbi.IViewport;

    constructor(options: IKPIComponentConstructorOptionsWithClassName) {
        this.element = options.element
            .append("div")
            .classed(this.className, true)
            .classed(options.className, true);
    }

    public render(options: ICaptionKPIComponentOptions): void {
        const {
            captions,
            align,
            data: {
                viewport,
                settings: {
                    layout,
                },
            },
        } = options;

        const attributes: ICaptionKPIComponentAttributes = this.getAttributes(captions);

        let { isShown } = attributes;
        const { size } = attributes;

        this.size = size;

        isShown = layout.autoHideVisualComponents.value
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

    public isRendered(): boolean {
        return this.isComponentRendered;
    }

    public clear(): void {
        this.element.remove();
    }

    public destroy(): void {
        this.element = null;
    }

    public getViewport(): IVisualComponentViewport {
        if (!this.size) {
            return {
                height: 0,
                width: 0,
            };
        }

        return this.size;
    }

    protected renderElement(
        element: Selection<any, ICaptionKPIComponentOptionsValueSettings[], any, any>,
        captions: ICaptionKPIComponentOptionsValueSettings[][],
        containerSelector: CssConstants.ClassAndSelector,
        selector: CssConstants.ClassAndSelector,
    ): void {
        const containerSelection: Selection<any, ICaptionKPIComponentOptionsValueSettings[], any, any> = element
            .selectAll(containerSelector.selectorName)
            .data(captions);

        const elementSelection: Selection<any, ICaptionKPIComponentOptionsValueSettings, any, any> = containerSelection
            .enter()
            .append("div")
            .classed(containerSelector.className, true)
            .merge(containerSelection)
            .selectAll(selector.selectorName)
            .data((captionItems: ICaptionKPIComponentOptionsValueSettings[]) => {
                return (captionItems || []).filter((options: ICaptionKPIComponentOptionsValueSettings) => {
                    return options
                        && options.settings
                        && options.settings.showElement();
                });
            });

        elementSelection
            .enter()
            .append("div")
            .classed(selector.className, true)
            .merge(elementSelection)
            .attr("title", (options: ICaptionKPIComponentOptionsValueSettings) => options.title || null)
            .attr("class", (options: ICaptionKPIComponentOptionsValueSettings) => {
                let className: string = selector.className;

                if (options.settings.font.bold.value) {
                    className += " boldStyle";
                }

                if (options.settings.font.italic.value) {
                    className += " italicStyle";
                }

                if (options.className) {
                    className += ` ${options.className}`;
                }

                return className;
            })
            .style("color", (options: ICaptionKPIComponentOptionsValueSettings) => options.settings.fontColor.value.value)
            .style("font-size", (options: ICaptionKPIComponentOptionsValueSettings) => {
                return pixelConverter.toString(pixelConverter.fromPointToPixel(options.settings.fontSize));
            })
            .style("font-family", (options: ICaptionKPIComponentOptionsValueSettings) => options.settings.font.fontFamily.value)
            .text((options: ICaptionKPIComponentOptionsValueSettings) => options.value);

        elementSelection
            .exit()
            .remove();

        containerSelection
            .exit()
            .remove();
    }

    private getAttributes(captions: ICaptionKPIComponentOptionsValueSettings[][]): ICaptionKPIComponentAttributes {
        let isShown: boolean = false;

        const size: powerbi.IViewport = {
            height: 0,
            width: 0,
        };

        captions.forEach((captionList: ICaptionKPIComponentOptionsValueSettings[]) => {
            let width: number = 0;
            let height: number = 0;

            captionList.forEach((caption: ICaptionKPIComponentOptionsValueSettings) => {
                isShown = isShown || caption.settings.showElement();

                if (caption.settings.showElement()) {
                    const text: string = caption.value || "M";

                    const rect: SVGRect = textMeasurementService.textMeasurementService.measureSvgTextRect({
                        fontFamily: caption.settings.font.fontFamily.value,
                        fontSize: pixelConverter.toString(pixelConverter.fromPointToPixel(caption.settings.fontSize)),
                        text,
                    }, text);

                    height = Math.max(height, rect.height + this.sizeOffset.height);
                    width += rect.width + this.sizeOffset.width;
                }
            });

            size.height += height;
            size.width = Math.max(size.width, width);
        });

        return {
            isShown,
            size,
        };
    }

    private canComponentBeRenderedAtViewport(viewport: powerbi.IViewport, layout: string): boolean {
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
        element: Selection<any, any, any, any>,
        selector: CssConstants.ClassAndSelector,
        shouldElementBeRendered: boolean,
        align: AlignEnum,
    ): Selection<any, boolean, any, any> {
        const selection: Selection<any, boolean, any, any> = element
            .selectAll(selector.selectorName)
            .data(shouldElementBeRendered ? [shouldElementBeRendered] : []);

        selection
            .exit()
            .remove();

        return selection
            .enter()
            .append("div")
            .classed(selector.className, true)
            .merge(selection)
            .attr("class", `${selector.className} ${AlignEnum[align]}`);
    }
}
