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

import { VisualComponent } from "../base/visualComponent";
import { BaseContainerComponent } from "../base/baseContainerComponent";
import { VisualComponentConstructorOptions } from "../base/visualComponentConstructorOptions";
import { LineType } from "../../settings/descriptors/lineDescriptor";

import {
    AreaComponent,
    AreaComponentRenderOptions
} from "./areaComponent";

import {
    LineComponent,
    LineComponentRenderOptions
} from "./lineComponent";

export interface ComboComponentRenderOptions extends AreaComponentRenderOptions {
    lineType: LineType;
}

export class ComboComponent extends BaseContainerComponent<VisualComponentConstructorOptions, ComboComponentRenderOptions, LineComponentRenderOptions> {
    private className: string = "comboComponent";

    private currentLineType: LineType;

    constructor(options: VisualComponentConstructorOptions) {
        super();

        this.initElement(
            options.element,
            this.className,
            "g"
        );

        this.constructorOptions = {
            ...options,
            element: this.element,
        };
    }

    public render(options: ComboComponentRenderOptions): void {
        const { lineType } = options;

        this.renderOptions = options;

        if (lineType !== this.currentLineType) {
            this.destroyComponents();

            this.currentLineType = lineType;
        }

        this.initComponents(
            this.components,
            1,
            () => {
                switch (this.currentLineType) {
                    case LineType.area: {
                        return new AreaComponent(this.constructorOptions);
                    }
                    case LineType.column:
                    default: {
                        return new LineComponent(this.constructorOptions);
                    }
                }
            }
        );

        this.forEach(
            this.components,
            (component: VisualComponent<LineComponentRenderOptions>) => {
                component.render(options);
            }
        );
    }
}

