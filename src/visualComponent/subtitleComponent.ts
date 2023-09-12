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

import { Selection } from "d3-selection";

import { CssConstants } from "powerbi-visuals-utils-svgutils";
import { pixelConverter } from "powerbi-visuals-utils-typeutils";

import { SubtitleDescriptor } from "../settings/descriptors/subtitleDescriptor";
import { BaseComponent } from "./base/baseComponent";
import { IVisualComponentViewport } from "./base/visualComponent";
import { IVisualComponentConstructorOptions } from "./base/visualComponentConstructorOptions";
import { IVisualComponentRenderOptions } from "./base/visualComponentRenderOptions";

export class SubtitleComponent extends BaseComponent<IVisualComponentConstructorOptions, IVisualComponentRenderOptions> {
    private className: string = "subtitleComponent";
    private subTitleSelector: CssConstants.ClassAndSelector = CssConstants.createClassAndSelector("subtitle");

    constructor(options: IVisualComponentConstructorOptions) {
        super();

        this.initElement(
            options.element,
            this.className,
        );
    }

    public render(options: IVisualComponentRenderOptions): void {
        const { subtitle } = options.data.settings;

        const data: SubtitleDescriptor[] = subtitle.isElementShown()
            ? [subtitle]
            : [];

        const subtitleSelection: Selection<any, SubtitleDescriptor, any, any> = this.element
            .selectAll(this.subTitleSelector.selectorName)
            .data(data);

        subtitleSelection
            .enter()
            .append("div")
            .classed(this.subTitleSelector.className, true)
            .merge(subtitleSelection)
            .text((settings: SubtitleDescriptor) => settings.titleText.value)
            .style("color", (settings: SubtitleDescriptor) => settings.fontColor.value.value)
            .style("text-align", (settings: SubtitleDescriptor) => settings.alignment.value)
            .style("font-size", (settings: SubtitleDescriptor) => {
                const fontSizeInPx: number = pixelConverter.fromPointToPixel(settings.font.fontSize.value);

                return pixelConverter.toString(fontSizeInPx);
            })
            .style("background-color", (settings: SubtitleDescriptor) => settings.background.value.value)
            .style("font-family", (settings: SubtitleDescriptor) => settings.font.fontFamily.value)
            .classed(this.boldClassName, subtitle.font.bold.value)
            .classed(this.italicClassName, subtitle.font.italic.value);

        subtitleSelection
            .exit()
            .remove();
    }

    public getViewport(): IVisualComponentViewport {
        if (!this.element) {
            return {
                height: 0,
                width: 0,
            };
        }

        const height: number = (this.element.node() as Element)?.clientHeight;

        return {
            height,
            width: 0,
        };
    }
}
