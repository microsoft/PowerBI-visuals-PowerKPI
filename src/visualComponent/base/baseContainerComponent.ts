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

import { BaseComponent } from "./baseComponent";
import { VisualComponent } from "./visualComponent";

export abstract class BaseContainerComponent<ConstructorOptionsType, RenderOptionsType, ComponentsRenderOptionsType>
    extends BaseComponent<ConstructorOptionsType, RenderOptionsType> {

    protected components: Array<VisualComponent<ComponentsRenderOptionsType>> = [];

    public clear(components: Array<VisualComponent<ComponentsRenderOptionsType>> = this.components): void {
        this.forEach(
            components,
            (component: VisualComponent<ComponentsRenderOptionsType>) => {
                component.clear();
            },
        );

        super.clear();
    }

    public destroy(components: Array<VisualComponent<any>> = this.components): void {
        this.destroyComponents(components);

        super.destroy();
    }

    public highlight(hasSelection: boolean, components: Array<VisualComponent<ComponentsRenderOptionsType>> = this.components): void {
        this.forEach(components, (component: VisualComponent<ComponentsRenderOptionsType>) => {
            if (component.highlight) {
                component.highlight(hasSelection);
            }
        });
    }

    protected destroyComponents(components: Array<VisualComponent<any>> = this.components): void {
        this.forEach(
            components.splice(0, components.length),
            (component: VisualComponent<any>) => {
                component.destroy();
            },
        );
    }

    protected forEach<ComponentsRenderOptions>(
        components: Array<VisualComponent<ComponentsRenderOptions>>,
        iterator: (
            component: VisualComponent<ComponentsRenderOptions>,
            index: number,
        ) => void,
    ): void {
        components.forEach((component: VisualComponent<ComponentsRenderOptions>, index: number) => {
            if (component) {
                iterator(component, index);
            }
        });
    }

    protected initComponents<ComponentsRenderOptions>(
        components: Array<VisualComponent<ComponentsRenderOptions>>,
        expectedAmountOfComponents: number,
        initComponent: (index: number) => VisualComponent<ComponentsRenderOptions>,
    ): void {
        if (!components) {
            return;
        }

        components
            .splice(expectedAmountOfComponents)
            .forEach((component: VisualComponent<ComponentsRenderOptions>) => {
                component.clear();
                component.destroy();
            });

        if (components.length < expectedAmountOfComponents) {
            for (let index: number = components.length; index < expectedAmountOfComponents; index++) {
                components.push(initComponent(index));
            }
        }
    }
}
