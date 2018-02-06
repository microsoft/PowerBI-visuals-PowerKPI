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

namespace powerbi.extensibility.visual.powerKPI {
    import PixelConverter = powerbi.extensibility.utils.type.PixelConverter;
    import ClassAndSelector = powerbi.extensibility.utils.svg.CssConstants.ClassAndSelector;
    import createClassAndSelector = powerbi.extensibility.utils.svg.CssConstants.createClassAndSelector;

    export class SubtitleComponent implements VisualComponent {
        private static ClassName: string = "subtitleComponent";
        private static SubTitleSelector: ClassAndSelector = createClassAndSelector("subtitle");

        private element: d3.Selection<SVGElement>;

        constructor(options: VisualComponentConstructorOptions) {
            this.element = options.element
                .append("div")
                .classed(SubtitleComponent.ClassName, true);
        }

        public render(options: VisualComponentOptions): void {
            const { subtitle } = options.data.settings;

            const data: SubtitleSettings[] = subtitle.show
                ? [subtitle]
                : [];

            const subtitleSelection: d3.selection.Update<any> = this.element
                .selectAll(SubtitleComponent.SubTitleSelector.selectorName)
                .data(data);

            subtitleSelection
                .enter()
                .append("div")
                .classed(SubtitleComponent.SubTitleSelector.className, true);

            subtitleSelection
                .text((settings: SubtitleSettings) => settings.titleText)
                .style({
                    color: (settings: SubtitleSettings) => settings.fontColor,
                    "text-align": (settings: SubtitleSettings) => settings.alignment,
                    "font-size": (settings: SubtitleSettings) => {
                        const fontSizeInPx: number = PixelConverter.fromPointToPixel(settings.fontSize);

                        return PixelConverter.toString(fontSizeInPx);
                    },
                    "background-color": (settings: SubtitleSettings) => settings.background,
                    "font-family": (settings: SubtitleSettings) => settings.fontFamily,
                });

            subtitleSelection
                .exit()
                .remove();
        }

        public clear(): void {
            this.element.remove();
        }

        public destroy(): void {
            this.element = null;
        }

        public getMargins(): IViewport {
            const viewport: IViewport = {
                height: 0,
                width: 0
            };

            if (this.element) {
                viewport.height = $(this.element.node()).height();
            }

            return viewport;
        }
    }
}
