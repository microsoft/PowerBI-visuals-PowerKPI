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

import { DataRepresentationTypeEnum } from "../../dataRepresentation/dataRepresentationType";

export interface IDescriptorParserOptions {
    isAutoHideBehaviorEnabled: boolean;
    viewport: powerbi.IViewport;
    type: DataRepresentationTypeEnum;
}

export interface IDescriptor {
    parse?(options?: IDescriptorParserOptions): void;
    setDefault?(): void;
    getValueByKey?(key: string): string | number | boolean;
    shouldKeyBeEnumerated?(key: string): boolean;
}

export abstract class BaseDescriptor {
    public applyDefault(defaultSettings: BaseDescriptor) {
        if (!defaultSettings) {
            return;
        }

        Object
            .keys(defaultSettings)
            .forEach((propertyName: string) => {
                this[propertyName] = defaultSettings[propertyName];
            });
    }

    public enumerateProperties(): { [propertyName: string]: powerbi.DataViewPropertyValue; } {
        const properties: { [propertyName: string]: powerbi.DataViewPropertyValue; } = {};

        for (const key in this) {
            const shouldKeyBeEnumerated: boolean = (this as IDescriptor).shouldKeyBeEnumerated
                ? (this as IDescriptor).shouldKeyBeEnumerated(key)
                : this.hasOwnProperty(key);

            if (shouldKeyBeEnumerated) {
                if ((this as IDescriptor).getValueByKey) {
                    properties[key] = (this as IDescriptor).getValueByKey(key);
                } else {
                    properties[key] = this[key] as any;
                }
            }
        }

        return properties;
    }
}
