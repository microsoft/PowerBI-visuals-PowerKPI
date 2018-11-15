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

import { VisualComponent } from "./visualComponent";
import { BaseComponent } from "./baseComponent";

export abstract class BaseContainerComponent<ConstructorOptionsType, RenderOptionsType, ComponentsRenderOptions>
    extends BaseComponent<ConstructorOptionsType, RenderOptionsType> {

    protected components: VisualComponent<ComponentsRenderOptions>[] = [];

    public clear(components: VisualComponent<ComponentsRenderOptions>[] = this.components): void {
        this.forEach(
            components,
            (component: VisualComponent<ComponentsRenderOptions>) => {
                component.clear();
            }
        );

        super.clear();
    }

    public destroy(components: VisualComponent<any>[] = this.components): void {
        this.destroyComponents(components);

        super.destroy();
    }

    protected destroyComponents(components: VisualComponent<any>[] = this.components): void {
        this.forEach(
            components.splice(0, components.length),
            (component: VisualComponent<any>) => {
                component.destroy();
            }
        );
    }

    protected forEach<ComponentsRenderOptions>(
        components: VisualComponent<ComponentsRenderOptions>[],
        iterator: (
            component: VisualComponent<ComponentsRenderOptions>,
            index: number
        ) => void
    ): void {
        components.forEach((component: VisualComponent<ComponentsRenderOptions>, index: number) => {
            if (component) {
                iterator(component, index);
            }
        });
    }

    protected initComponents<ComponentsRenderOptions>(
        components: VisualComponent<ComponentsRenderOptions>[],
        expectedAmountOfComponents: number,
        initComponent: (index: number) => VisualComponent<ComponentsRenderOptions>
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

    public highlight(hasSelection: boolean, components: VisualComponent<ComponentsRenderOptions>[] = this.components): void {
        this.forEach(components, (component: VisualComponent<ComponentsRenderOptions>) => {
            if (component.highlight) {
                component.highlight(hasSelection);
            }
        });
    }
}
