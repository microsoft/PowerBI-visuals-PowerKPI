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

namespace powerbi.extensibility.visual {
    export class FontSizeSettings
        extends ShowSettings
        implements SettingsBase {

        private minFontSize: number = 8;
        private isMinFontSizeApplied: boolean = false;

        private viewportForFontSize8: IViewport = {
            width: 210,
            height: 210
        };

        private _fontSize: number = this.minFontSize; // This value is in pt.

        constructor(viewport?: IViewport) {
            super(viewport);

            Object.defineProperty(
                this,
                "fontSize",
                Object.getOwnPropertyDescriptor(
                    FontSizeSettings.prototype,
                    "fontSize"));
        }

        public get fontSize(): number {
            if (this.isMinFontSizeApplied) {
                return this.minFontSize;
            }

            return this._fontSize;
        }

        public set fontSize(fontSize: number) {
            // Power BI returns numbers as strings for some unknown reason. This is why we convert value to number.
            const parsedFontSize: number = +fontSize;

            this._fontSize = isNaN(parsedFontSize)
                ? this.minFontSize
                : parsedFontSize;
        }

        public parse(options: SettingsParserOptions): void {
            super.parse(options);

            this.isMinFontSizeApplied =
                options
                && options.isAutoHideBehaviorEnabled
                && options.viewport
                &&
                (
                    options.viewport.width <= this.viewportForFontSize8.width
                    ||
                    options.viewport.height <= this.viewportForFontSize8.height
                );
        }
    }
}