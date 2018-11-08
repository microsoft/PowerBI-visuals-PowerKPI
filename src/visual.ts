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

import "../styles/styles.less";

import {
    dispatch,
    Dispatch,
    Selection,
    select as d3Select,
} from "d3";

import powerbi from "powerbi-visuals-api";

import { interactivityService } from "powerbi-visuals-utils-interactivityutils";
import { ColorHelper } from "powerbi-visuals-utils-colorutils";

import { EventName } from "./event/eventName";
import { Converter } from "./converter/converter";
import { VisualComponent } from "./visualComponent/base/visualComponent";
import { VisualComponentRenderOptions } from "./visualComponent/base/visualComponentRenderOptions";
import { createConverter } from "./converter/dataConverter";
import { MainComponent } from "./visualComponent/mainComponent";
import { SeriesSettings } from "./settings/seriesSettings";
import { BaseDescriptor } from "./settings/descriptors/descriptor";
import { DataRepresentation } from "./dataRepresentation/dataRepresentation";

import {
    DataRepresentationSeries,
    DataRepresentationSeriesGroup,
} from "./dataRepresentation/dataRepresentationSeries";

import {
    Behavior,
    BehaviorOptions,
} from "./behavior/behavior";

export class PowerKPI implements powerbi.extensibility.visual.IVisual {
    private static ViewportReducer: number = 3;

    private eventDispatcher: Dispatch<any> = dispatch(...Object.keys(EventName));

    private rootElement: Selection<any, any, any, any>;
    private converter: Converter;
    private component: VisualComponent<VisualComponentRenderOptions>;

    private dataRepresentation: DataRepresentation;
    private colorPalette: powerbi.extensibility.IColorPalette;

    private behavior: Behavior;
    private interactivityService: interactivityService.IInteractivityService;

    constructor(options: powerbi.extensibility.visual.VisualConstructorOptions) {
        this.rootElement = d3Select(options.element);

        this.converter = createConverter(options.host.createSelectionIdBuilder.bind(options.host));

        this.behavior = new Behavior();
        this.interactivityService = interactivityService.createInteractivityService(options.host);

        this.colorPalette = options.host.colorPalette;

        this.component = new MainComponent({
            element: this.rootElement,
            style: this.colorPalette,
            eventDispatcher: this.eventDispatcher,
            interactivityService: this.interactivityService,
            tooltipService: options.host.tooltipService,
        });
    }

    public update(options: powerbi.extensibility.visual.VisualUpdateOptions): void {
        const dataView: powerbi.DataView = options && options.dataViews && options.dataViews[0];

        const viewport: powerbi.IViewport = options
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

    public enumerateObjectInstances(options: powerbi.EnumerateVisualObjectInstancesOptions): powerbi.VisualObjectInstanceEnumeration {
        const { objectName } = options;

        const shouldUseContainers: boolean = Object.keys(new SeriesSettings()).indexOf(objectName) !== -1;

        if (shouldUseContainers) {
            const enumerationObject: powerbi.VisualObjectInstanceEnumerationObject = {
                instances: [],
                containers: [],
            };

            this.enumerateSettings(
                enumerationObject,
                objectName,
                this.getSettings.bind(this)
            );

            return enumerationObject;
        }

        let instances: powerbi.VisualObjectInstance[] = this.dataRepresentation
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
        enumerationObject: powerbi.VisualObjectInstanceEnumerationObject,
        objectName: string,
        getSettings: (settings: BaseDescriptor) => { [propertyName: string]: powerbi.DataViewPropertyValue }
    ): void {
        this.applySettings(
            objectName,
            "[All]",
            null,
            enumerationObject,
            getSettings(this.dataRepresentation.settings[objectName])
        );

        this.enumerateSettingsDeep(
            this.getSeries(this.dataRepresentation),
            objectName,
            enumerationObject,
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

    private getSettings(settings: BaseDescriptor): { [propertyName: string]: powerbi.DataViewPropertyValue } {
        return settings.enumerateProperties();
    }

    private applySettings(
        objectName: string,
        displayName: string,
        selector: powerbi.data.Selector,
        enumerationObject: powerbi.VisualObjectInstanceEnumerationObject,
        properties: { [propertyName: string]: powerbi.DataViewPropertyValue }
    ): void {
        const containerIdx: number = enumerationObject.containers.push({ displayName }) - 1;

        enumerationObject.instances.push({
            selector,
            objectName,
            properties,
            containerIdx
        });
    }

    private enumerateSettingsDeep(
        seriesArray: DataRepresentationSeries[],
        objectName: string,
        enumerationObject: powerbi.VisualObjectInstanceEnumerationObject,
        getSettings: (settings: BaseDescriptor) => { [propertyName: string]: powerbi.DataViewPropertyValue }
    ): void {
        for (let series of seriesArray) {
            const name: string = series.groupName || series.name;

            const selector: powerbi.data.Selector = series.identity
                && (series.identity as powerbi.visuals.ISelectionId).getSelector();

            this.applySettings(
                objectName,
                name,
                ColorHelper.normalizeSelector(selector),
                enumerationObject,
                getSettings(series.settings[objectName]),
            );
        }
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
