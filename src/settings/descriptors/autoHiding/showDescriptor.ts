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

import { ViewportDescriptor } from "./viewportDescriptor";

import {
    IDescriptor,
    IDescriptorParserOptions,
} from "../descriptor";

export class ShowDescriptor
    extends ViewportDescriptor
    implements IDescriptor {

    show = new formattingSettings.ToggleSwitch({
        name: "show",
        displayName: "Show",
        value: true,
        topLevelToggle: true
    });

    private isAbleToBeShown: boolean = true;

    constructor(viewport: powerbi.IViewport = { width: 0, height: 0 }) {
        super(viewport);

        this.slices.push(this.show)
    }

    public parse(options: IDescriptorParserOptions): void {
        this.isAbleToBeShown = !(
            options
            && options.isAutoHideBehaviorEnabled
            && options.viewport
            && this._viewport
            &&
            (
                options.viewport.width <= this._viewport.width ||
                options.viewport.height <= this._viewport.height
            )
        );
    }

    public isElementShown(): boolean {
        return this.isAbleToBeShown && this.show.value
    }
}
 