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

module powerbi.extensibility.visual {
    // powerbi
    import DataView = powerbi.DataView;
    import VisualObjectInstance = powerbi.VisualObjectInstance;
    import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
    import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;

    import ColorHelper = utils.color.ColorHelper;
    import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions

    import Settings = extensibility.visual.Settings;
    import Converter = extensibility.visual.Converter;
    import MainComponent = extensibility.visual.MainComponent;
    import VisualComponent = extensibility.visual.VisualComponent;
    import DataRepresentation = extensibility.visual.DataRepresentation;
    import SeriesBoundSettingsBase = extensibility.visual.SeriesBoundSettingsBase;
    import DataRepresentationSeries = extensibility.visual.DataRepresentationSeries;

    export class PowerKPI implements IVisual {        
        private static ViewportReducer: number = 3;

        private rootElement: d3.Selection<any>;
        private converter: Converter;
        private component: VisualComponent;

        private dataRepresentation: DataRepresentation;
        private style: IVisualStyle;

        constructor(options: VisualConstructorOptions) {            
            this.rootElement = d3.select(options.element);
            this.converter = visual.createConverter(options);

            this.style = {
                colorPalette: options.host.colorPalette,
                isHighContrast: false,
                labelText: {
                    color: {
                        value: options.element.style.color                        
                    }
                },
                subTitleText: {
                    color: {
                        value: options.element.style.color                        
                    }                    
                },
                titleText: {
                    color: {
                        value: options.element.style.color                        
                    }
                }
            }
            this.component = new MainComponent({ element: this.rootElement, tooltipService: options.host.tooltipService });

        }

        public update(options: VisualUpdateOptions): void {
            let dataView: DataView = null;
            let viewport: IViewport = { height: 0, width: 0 };

            if (options && options.dataViews) {
                dataView = options.dataViews[0];
            }

            if (options && options.viewport) {
                viewport = _.clone(options.viewport);

                viewport.width -= PowerKPI.ViewportReducer;
                viewport.height -= PowerKPI.ViewportReducer;
            }

            this.render(this.converter.convert({
                dataView,
                viewport,
                style: this.style
            }));
        }

        public render(dataRepresentation: DataRepresentation): void {
            this.dataRepresentation = dataRepresentation;

            this.component.render({
                data: this.dataRepresentation
            });
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let instances: VisualObjectInstance[] = (this.dataRepresentation
                && this.dataRepresentation.settings
                && (Settings.enumerateObjectInstances(this.dataRepresentation.settings, options) as VisualObjectInstanceEnumerationObject).instances)
                || [];

            if (this.dataRepresentation) {
                [
                    this.dataRepresentation.settings._lineStyle,
                    this.dataRepresentation.settings._lineThickness
                ].forEach((seriesBoundSettings: SeriesBoundSettingsBase) => {
                    instances.push(...seriesBoundSettings.enumerateObjectInstances(
                        options.objectName,
                        this.dataRepresentation.series));
                });

                switch (options.objectName) {
                    case "kpiIndicator": {
                        if (this.dataRepresentation
                            && (this.dataRepresentation.variance
                                && isNaN(this.dataRepresentation.variance[0])
                                || (this.dataRepresentation.settings
                                    && !this.dataRepresentation.settings.kpiIndicatorValue.show))
                            && instances
                            && instances[0]
                            && instances[0].properties
                        ) {
                            delete instances[0].properties["position"];
                        }

                        break;
                    }
                    case "kpiIndicatorValue": {
                        if (this.dataRepresentation
                            && this.dataRepresentation.variance
                            && isNaN(this.dataRepresentation.variance[0])
                        ) {
                            instances = [];
                        }

                        break;
                    }
                    case "kpiIndicatorLabel": {
                        if (this.dataRepresentation
                            && this.dataRepresentation.variance
                            && isNaN(this.dataRepresentation.variance[0])
                            && this.dataRepresentation.series
                            && this.dataRepresentation.series[0]
                            && this.dataRepresentation.series[0].current
                            && isNaN(this.dataRepresentation.series[0].current.kpiIndex)
                        ) {
                            instances = [];
                        }

                        break;
                    }
                    case "secondKPIIndicatorValue":
                    case "secondKPIIndicatorLabel":
                    case "secondTooltipVariance": {
                        if (!this.dataRepresentation.series
                            || !this.dataRepresentation.variance
                            || isNaN(this.dataRepresentation.variance[1])
                        ) {
                            instances = [];
                        }

                        break;
                    }
                    case "series": {
                        instances.push(...this.enumerateSeries(options.objectName));

                        break;
                    }
                }
            }

            return instances;
        }

        private enumerateSeries(objectName: string): VisualObjectInstance[] {
            return this.dataRepresentation.series.map((series: DataRepresentationSeries) => {
                return {
                    objectName,
                    displayName: series.name,
                    selector: ColorHelper.normalizeSelector(series.selectionId.getSelector()),
                    properties: {
                        fillColor: { solid: { color: series.color } }
                    }
                } as VisualObjectInstance;
            });
        }

        public destroy(): void {
            this.component.destroy();

            this.converter = null;
            this.rootElement = null;
            this.component = null;
        }
    }
}
