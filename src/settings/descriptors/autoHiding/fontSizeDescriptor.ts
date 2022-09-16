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
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import { pixelConverter } from "powerbi-visuals-utils-typeutils";

import {
    IDescriptor,
    IDescriptorParserOptions,
} from "../descriptor";

import { ShowDescriptor } from "./showDescriptor";

export class FontSizeDescriptor
    extends ShowDescriptor
    implements IDescriptor {

    private minFontSize: number = 8;
    private isMinFontSizeApplied: boolean = false;

    private viewportForFontSize8: powerbi.IViewport = {
        height: 210,
        width: 210,
    };

    public font = new formattingSettings.FontControl({
        name: "font",
        displayName: "Font",
        fontFamily: new formattingSettings.FontPicker({
            name: "fontFamily",
            displayName: "Text Color",
            value: "Segoe UI, wf_segoe-ui_normal, helvetica, arial, sans-serif"
        }),
        fontSize: new formattingSettings.NumUpDown({
            name: "fontSize",
            displayName: "Text Size",
            value: this.minFontSize, 
            options: {
                minValue: {
                    type: powerbi.visuals.ValidatorType.Min,
                    value: this.minFontSize,
                }
            }
        }),
        bold: new formattingSettings.ToggleSwitch({
            name: "isBold",
            value: false
        }),
        italic:  new formattingSettings.ToggleSwitch({
            name: "isItalic",
            value: false
        })
    });

    public get fontSizeInPx(): number {
        return pixelConverter.fromPointToPixel(this.font.fontSize.value);
    }

    public parse(options: IDescriptorParserOptions): void {
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

        if (this.isMinFontSizeApplied) {
            this.font.fontSize.value = this.minFontSize;
        }
    }
}
 