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

namespace powerbi.extensibility.visual {
    // powerbi
    import VisualObjectInstance = powerbi.VisualObjectInstance;
    import DataViewObjectPropertyIdentifier = powerbi.DataViewObjectPropertyIdentifier;
    import DataViewObjects = utils.dataview.DataViewObjects;
    
    // powerbi.visuals
    import ColorHelper = utils.color.ColorHelper;

    export abstract class SeriesBoundSettingsBase {
        protected propertyId: DataViewObjectPropertyIdentifier;
        protected displayName: string;
        protected defaultValue: any;

        constructor(displayName: string, objectName: string, propertyName: string, defaultValue: any) {
            this.displayName = displayName;
            this.propertyId = { objectName, propertyName };
            this.defaultValue = defaultValue;
        }

        public enumerateObjectInstances(enumeratedObjectName: string, series: DataRepresentationSeries[]): VisualObjectInstance[] {
            const { objectName, propertyName } = this.propertyId;

            if (enumeratedObjectName !== objectName) {
                return [];
            }

            return series.map((series: DataRepresentationSeries) => {
                return {
                    objectName,
                    displayName: series.name,
                    selector: ColorHelper.normalizeSelector(series.selectionId.getSelector()),
                    properties: {
                        [propertyName]: series[propertyName]
                    }
                } as VisualObjectInstance;
            });
        }

        public parseValue(objects: DataViewObjects): any {
            return DataViewObjects.getValue(objects, this.propertyId, this.defaultValue);
        }
    }
}