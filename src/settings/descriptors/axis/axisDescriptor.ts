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

import {
    IDescriptor,
    IDescriptorParserOptions,
} from "../descriptor";

import { NumberDescriptorBase } from "../numberDescriptorBase";

export enum AxisType {
    continuous,
    categorical,
}

export class AxisDescriptor
    extends NumberDescriptorBase
    implements IDescriptor {

    /**
     * This property is an alias of density and it's defined special for Power BI
     * It's predefined PBI property name in order to create a percentage slider at format panel
     */
    public get percentile(): number {
        if (this.shouldDensityBeAtMax) {
            return this.maxDensity;
        }

        return this._percentile;
    }

    public set percentile(value: number) {
        this._percentile = value;
    }

    public get density(): number {
        return this.percentile;
    }

    public maxDensity: number = 100;

    public fontColor: string = "rgb(0,0,0)";

    public fontFamily: string = "'Segoe UI Light', wf_segoe-ui_light, helvetica, arial, sans-serif";

    private shouldDensityBeAtMax: boolean = false;
    private viewportToIncreaseDensity: powerbi.IViewport;

    private _percentile: number = this.maxDensity;

    constructor(
        viewportToBeHidden: powerbi.IViewport,
        viewportToIncreaseDensity: powerbi.IViewport,
        shouldPropertiesBeHiddenByType: boolean = false,
    ) {
        super(viewportToBeHidden, shouldPropertiesBeHiddenByType);

        this.viewportToIncreaseDensity = viewportToIncreaseDensity;

        Object.defineProperty(
            this,
            "percentile",
            {
                ...Object.getOwnPropertyDescriptor(
                    AxisDescriptor.prototype,
                    "percentile",
                ),
                enumerable: true,
            },
        );
    }

    public parse(options: IDescriptorParserOptions) {
        super.parse(options);

        this.shouldDensityBeAtMax = options.isAutoHideBehaviorEnabled
            && this.viewportToIncreaseDensity
            && options.viewport
            && (options.viewport.width <= this.viewportToIncreaseDensity.width
                ||
                options.viewport.height <= this.viewportToIncreaseDensity.height);
    }
}
