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

import $ from "jquery";

import { Selection } from "d3";

import { pixelConverter } from "powerbi-visuals-utils-typeutils";
import { CssConstants } from "powerbi-visuals-utils-svgutils";

import { VisualComponentViewport } from "./base/visualComponent";
import { BaseComponent } from "./base/baseComponent";
import { VisualComponentConstructorOptions } from "./base/visualComponentConstructorOptions";
import { VisualComponentRenderOptions } from "./base/visualComponentRenderOptions";
import { SubtitleDescriptor } from "../settings/descriptors/subtitleDescriptor";

export class SubtitleComponent extends BaseComponent<VisualComponentConstructorOptions, VisualComponentRenderOptions> {
    private className: string = "subtitleComponent";
    private subTitleSelector: CssConstants.ClassAndSelector = CssConstants.createClassAndSelector("subtitle");

    constructor(options: VisualComponentConstructorOptions) {
        super();

        this.initElement(
            options.element,
            this.className,
        );
    }

    public render(options: VisualComponentRenderOptions): void {
        const { subtitle } = options.data.settings;

        const data: SubtitleDescriptor[] = subtitle.show
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
            .text((settings: SubtitleDescriptor) => settings.titleText)
            .style("color", (settings: SubtitleDescriptor) => settings.fontColor)
            .style("text-align", (settings: SubtitleDescriptor) => settings.alignment)
            .style("font-size", (settings: SubtitleDescriptor) => {
                const fontSizeInPx: number = pixelConverter.fromPointToPixel(settings.fontSize);

                return pixelConverter.toString(fontSizeInPx);
            })
            .style("background-color", (settings: SubtitleDescriptor) => settings.background)
            .style("font-family", (settings: SubtitleDescriptor) => settings.fontFamily);

        subtitleSelection
            .exit()
            .remove();
    }

    public getViewport(): VisualComponentViewport {
        const viewport: VisualComponentViewport = {
            height: 0,
            width: 0
        };

        if (this.element) {
            viewport.height = $(this.element.node()).height();
        }

        return viewport;
    }
}
