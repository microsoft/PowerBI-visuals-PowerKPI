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

import { ViewportDescriptor } from "./viewportDescriptor";

import {
    Descriptor,
    DescriptorParserOptions,
} from "../descriptor";

export class ShowDescriptor
    extends ViewportDescriptor
    implements Descriptor {

    private _show: boolean = true;

    private isAbleToBeShown: boolean = true;

    constructor(viewport: powerbi.IViewport = { width: 0, height: 0 }) {
        super(viewport);

        Object.defineProperty(
            this,
            "show",
            {
                ...Object.getOwnPropertyDescriptor(
                    ShowDescriptor.prototype,
                    "show"
                ),
                enumerable: true
            }
        );
    }

    public get show(): boolean {
        if (!this.isAbleToBeShown) {
            return false;
        }

        return this._show;
    }

    public set show(isShown: boolean) {
        this._show = isShown;
    }

    public parse(options: DescriptorParserOptions): void {
        this.isAbleToBeShown = !(
            options
            && options.isAutoHideBehaviorEnabled
            && options.viewport
            && this._viewport
            &&
            (
                options.viewport.width <= this._viewport.width
                ||
                options.viewport.height <= this._viewport.height
            )
        );
    }
}

