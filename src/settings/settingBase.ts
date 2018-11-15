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
    dataViewObjects,
    dataViewObjectsParser,
} from "powerbi-visuals-utils-dataviewutils";

import {
    BaseDescriptor,
    IDescriptor,
} from "./descriptors/descriptor";

export class SettingsBase extends dataViewObjectsParser.DataViewObjectsParser {
    public parse(dataView: powerbi.DataView): SettingsBase {
        return this.parseObjects(dataView
            && dataView.metadata
            && dataView.metadata.objects,
        );
    }

    public parseObjects(objects: powerbi.DataViewObjects): SettingsBase {
        if (objects) {
            const properties: dataViewObjectsParser.DataViewProperties = this.getProperties();

            for (const objectName in properties) {
                for (const propertyName in properties[objectName]) {
                    const defaultValue: any = this[objectName][propertyName];

                    this[objectName][propertyName] = dataViewObjects.DataViewObjects.getCommonValue(
                        objects,
                        properties[objectName][propertyName],
                        defaultValue);
                }

                this.processDescriptor(this[objectName]);
            }
        }

        return this as any;
    }

    public enumerateObjectInstances(
        options: powerbi.EnumerateVisualObjectInstancesOptions,
    ): powerbi.VisualObjectInstance[] {
        const descriptor: BaseDescriptor = this[options.objectName];

        if (!descriptor) {
            return [];
        }

        return [{
            objectName: options.objectName,
            properties: descriptor.enumerateProperties(),
            selector: null,
        }];
    }

    protected processDescriptor(descriptor: IDescriptor): void {
        if (!descriptor || !descriptor.parse) {
            return;
        }

        descriptor.parse();
    }
}
