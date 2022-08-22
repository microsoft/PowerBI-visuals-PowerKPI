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
    BaseDescriptor,
    IDescriptor,
    IDescriptorParserOptions,
} from "./descriptor";

import { LayoutEnum } from "../../layout/layoutEnum";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;

export class LayoutDescriptor
    extends BaseDescriptor {

    autoHideVisualComponents = new formattingSettings.ToggleSwitch({
        name: "autoHideVisualComponents",
        displayName: "Auto Scale",
        value: true
    });

    auto = new formattingSettings.ToggleSwitch({
        name: "auto",
        displayName: "Auto",
        value: true,
    });

    layout = new formattingSettings.ItemDropdown({
        name: "layout",
        displayName: "Layout",
        items: [
            {
                value: LayoutEnum[LayoutEnum.Top],
                displayName: "Top"
            },
            {
                value: LayoutEnum[LayoutEnum.Right],
                displayName: "Right"
            },
            {
                value: LayoutEnum[LayoutEnum.Bottom],
                displayName: "Bottom"
            },
            {
                value: LayoutEnum[LayoutEnum.Left],
                displayName: "Left"
            }
        ],
        value: {
            value: LayoutEnum[LayoutEnum.Top],
            displayName: "Top"
        }
    });

    private _layout: string;

    private _minSupportedHeight: number = 250;

    constructor() {
        super()
        
        this.name = "layout";
        this.displayName = "Layout";
        this.slices.push(this.autoHideVisualComponents, this.auto, this.layout);
    }

    public parse(options: IDescriptorParserOptions): void {
        if (this.auto.value) {
            Object.defineProperty(this, "layout", {
                configurable: true,
                enumerable: false,
            });

            if (options.viewport.height < this._minSupportedHeight) {
                this._layout = LayoutEnum[LayoutEnum.Left];
            } else {
                this._layout = LayoutEnum[LayoutEnum.Top];
            }

            return;
        }

        this._layout = this.layout.value.value.toString();
    }

    public getLayout(): string {
        return this._layout;
    }
}
