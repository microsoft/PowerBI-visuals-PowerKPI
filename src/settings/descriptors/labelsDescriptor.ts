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

import { NumberDescriptorBase } from "./numberDescriptorBase";

export class LabelsDescriptor extends NumberDescriptorBase {
    public color: string = "rgb(119, 119, 119)";
    public fontFamily: string = "'Segoe UI Light', wf_segoe-ui_light, helvetica, arial, sans-serif";
    public isBold: boolean = false;
    public isItalic: boolean = false;

    /**
     * This property is an alias of density and it's defined special for Power BI.
     * It's predefined PBI property name in order to create a percentage slider at format panel.
     */
    public percentile: number = 100;

    public get density(): number {
        return this.percentile;
    }

    constructor(viewport: powerbi.IViewport) {
        super(viewport);

        this.show = false;
    }
}
