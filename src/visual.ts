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

// powerbi
import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;
import IViewport = powerbi.powerbi.IViewport;

// powerbi.extensibility
import IColorPalette = powerbi.extensibility.IColorPalette;
import IVisual = powerbi.extensibility.visual.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;

// powerbi.data
import Selector = powerbi.data.Selector;

// powerKPI
import Behavior = powerKpi.Behavior;
import Converter = powerKpi.Converter;
import EventName = powerKpi.EventName;
import MainComponent = powerKpi.MainComponent;
import SeriesSettings = powerKpi.SeriesSettings;
import BaseDescriptor = powerKpi.BaseDescriptor;
import VisualComponent = powerKpi.VisualComponent;
import BehaviorOptions = powerKpi.BehaviorOptions;
import DataRepresentation = powerKpi.DataRepresentation;
import DataRepresentationSeries = powerKpi.DataRepresentationSeries;
import VisualComponentRenderOptions = powerKpi.VisualComponentRenderOptions;
import DataRepresentationSeriesGroup = powerKpi.DataRepresentationSeriesGroup;

export class PowerKPI implements IVisual {
    private static ViewportReducer: number = 3;

    private eventDispatcher: D3.Dispatch = d3.dispatch(...Object.keys(EventName));

    private rootElement: D3.Selection;
    private converter: Converter;
    private component: VisualComponent<VisualComponentRenderOptions>;

    private dataRepresentation: DataRepresentation;
    private colorPalette: IColorPalette;

    private behavior: Behavior;
    private interactivityService: IInteractivityService;

    public init(options: VisualConstructorOptions): void {
        this.rootElement = d3.select(options.element);

        this.converter = powerKpi.createConverter();

        this.behavior = new Behavior();
        this.interactivityService = createInteractivityService(options.host);

        this.colorPalette = options.host.colorPalette;

        this.component = new MainComponent({
            element: this.rootElement,
            style: this.colorPalette,
            eventDispatcher: this.eventDispatcher,
            interactivityService: this.interactivityService,
        });
    }

    public update(options: VisualUpdateOptions): void {
        const dataView: DataView = options && options.dataViews && options.dataViews[0];

        const viewport: IViewport = options
            && options.viewport
            && {
                width: options.viewport.width - PowerKPI.ViewportReducer,
                height: options.viewport.height - PowerKPI.ViewportReducer,
            }
            || { height: 0, width: 0 };

        const dataRepresentation: DataRepresentation = this.converter.convert({
            dataView,
            viewport,
            style: this.colorPalette,
            hasSelection: this.interactivityService && this.interactivityService.hasSelection(),
        });

        if (this.interactivityService) {
            this.interactivityService.applySelectionStateToData(dataRepresentation.series);

            const behaviorOptions: BehaviorOptions = {
                eventDispatcher: this.eventDispatcher,
                interactivityService: this.interactivityService,
            };

            this.interactivityService.bind(
                dataRepresentation.series,
                this.behavior,
                behaviorOptions,
            );
        }

        this.render(dataRepresentation);
    }

    public render(dataRepresentation: DataRepresentation): void {
        this.dataRepresentation = dataRepresentation;

        this.component.render({
            data: this.dataRepresentation
        });
    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
        const { objectName } = options;

        const shouldUseContainers: boolean = Object.keys(new SeriesSettings()).indexOf(objectName) !== -1;

        if (shouldUseContainers) {
            const enumerationBuilder: ObjectEnumerationBuilder = new ObjectEnumerationBuilder();

            this.enumerateSettings(
                enumerationBuilder,
                objectName,
                this.getSettings.bind(this)
            );

            return enumerationBuilder.complete();
        }

        let instances: VisualObjectInstance[] = this.dataRepresentation
            && this.dataRepresentation.settings
            && this.dataRepresentation.settings.enumerateObjectInstances(options)
            || [];

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
            case "secondaryYAxis":
            case "secondaryReferenceLineOfYAxis": {
                if (!this.dataRepresentation
                    || !this.dataRepresentation.groups
                    || !this.dataRepresentation.groups[1]
                ) {
                    instances = [];
                }

                break;
            }
        }

        return instances;
    }

    private enumerateSettings(
        enumerationBuilder: ObjectEnumerationBuilder,
        objectName: string,
        getSettings: (settings: BaseDescriptor) => { [propertyName: string]: DataViewPropertyValue }
    ): void {
        this.applySettings(
            objectName,
            "[All]",
            null,
            enumerationBuilder,
            getSettings(this.dataRepresentation.settings[objectName])
        );

        this.enumerateSettingsDeep(
            this.getSeries(this.dataRepresentation),
            objectName,
            enumerationBuilder,
            getSettings
        );
    }

    private getSeries(dataRepresentation: DataRepresentation): DataRepresentationSeries[] {
        if (!dataRepresentation) {
            return [];
        }

        if (!dataRepresentation.isGrouped) {
            return dataRepresentation.series;
        }

        const seriesGroup: DataRepresentationSeriesGroup = dataRepresentation.groups
            .filter((group: DataRepresentationSeriesGroup) => {
                return !!group && !!group.series;
            })[0];

        return seriesGroup && seriesGroup.series || [];
    }

    private getSettings(settings: BaseDescriptor): { [propertyName: string]: DataViewPropertyValue } {
        return settings.enumerateProperties();
    }

    private applySettings(
        objectName: string,
        displayName: string,
        selector: Selector,
        enumerationBuilder: ObjectEnumerationBuilder,
        properties: { [propertyName: string]: DataViewPropertyValue }
    ): void {
        enumerationBuilder.pushContainer({ displayName });

        const instance: VisualObjectInstance = {
            selector,
            objectName,
            properties,
        };

        enumerationBuilder.pushInstance(instance);
        enumerationBuilder.popContainer();
    }

    private enumerateSettingsDeep(
        seriesArray: DataRepresentationSeries[],
        objectName: string,
        enumerationBuilder: ObjectEnumerationBuilder,
        getSettings: (settings: BaseDescriptor) => { [propertyName: string]: DataViewPropertyValue }
    ): void {
        for (let series of seriesArray) {
            const name: string = series.groupName || series.name;

            this.applySettings(
                objectName,
                name,
                ColorHelper.normalizeSelector(series.identity.getSelector()),
                enumerationBuilder,
                getSettings(series.settings[objectName]),
            );
        }
    }

    // TODO
    public onClearSelection(): void {
        if (this.interactivityService) {
            this.interactivityService.clearSelection();
        }
    }

    // TODO
    public onRestoreSelection(options): boolean {
        if (this.interactivityService && options) {
            return this.interactivityService.restoreSelection(options.selection);
        }

        return false;
    }

    public destroy(): void {
        this.component.destroy();

        this.converter = null;
        this.rootElement = null;
        this.component = null;
        this.dataRepresentation = null;
        this.interactivityService = null;
        this.behavior = null;
    }
}
