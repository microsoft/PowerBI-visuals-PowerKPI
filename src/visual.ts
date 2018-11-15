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
    select as d3Select,
    Selection,
} from "d3";

import powerbi from "powerbi-visuals-api";

import { ColorHelper } from "powerbi-visuals-utils-colorutils";
import { interactivityService } from "powerbi-visuals-utils-interactivityutils";

import { IConverter } from "./converter/converter";
import { DataConverter } from "./converter/dataConverter";
import { IDataRepresentation } from "./dataRepresentation/dataRepresentation";
import { EventName } from "./event/eventName";
import { BaseDescriptor } from "./settings/descriptors/descriptor";
import { SeriesSettings } from "./settings/seriesSettings";
import { VisualComponent } from "./visualComponent/base/visualComponent";
import { IVisualComponentRenderOptions } from "./visualComponent/base/visualComponentRenderOptions";
import { MainComponent } from "./visualComponent/mainComponent";

import {
    IDataRepresentationSeries,
    IDataRepresentationSeriesGroup,
} from "./dataRepresentation/dataRepresentationSeries";

import {
    Behavior,
    IBehaviorOptions,
} from "./behavior/behavior";

export class PowerKPI implements powerbi.extensibility.visual.IVisual {
    private static ViewportReducer: number = 3;

    private eventDispatcher: Dispatch<any> = dispatch(...Object.keys(EventName));

    private rootElement: Selection<any, any, any, any>;
    private converter: IConverter;
    private component: VisualComponent<IVisualComponentRenderOptions>;

    private dataRepresentation: IDataRepresentation;

    private behavior: Behavior;
    private interactivityService: interactivityService.IInteractivityService;

    constructor(options: powerbi.extensibility.visual.VisualConstructorOptions) {
        this.rootElement = d3Select(options.element);

        this.converter = new DataConverter({
            colorPalette: options.host.colorPalette,
            createSelectionIdBuilder: options.host.createSelectionIdBuilder.bind(options.host),
        });

        this.behavior = new Behavior();
        this.interactivityService = interactivityService.createInteractivityService(options.host);

        this.component = new MainComponent({
            element: this.rootElement,
            eventDispatcher: this.eventDispatcher,
            interactivityService: this.interactivityService,
            rootElement: this.rootElement,
            tooltipService: options.host.tooltipService,
        });
    }

    public update(options: powerbi.extensibility.visual.VisualUpdateOptions): void {
        const dataView: powerbi.DataView = options && options.dataViews && options.dataViews[0];

        const viewport: powerbi.IViewport = options
            && options.viewport
            && {
                height: options.viewport.height - PowerKPI.ViewportReducer,
                width: options.viewport.width - PowerKPI.ViewportReducer,
            }
            || { height: 0, width: 0 };

        const dataRepresentation: IDataRepresentation = this.converter.convert({
            dataView,
            hasSelection: this.interactivityService && this.interactivityService.hasSelection(),
            viewport,
        });

        if (this.interactivityService) {
            this.interactivityService.applySelectionStateToData(dataRepresentation.series);

            const behaviorOptions: IBehaviorOptions = {
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

    public render(dataRepresentation: IDataRepresentation): void {
        this.dataRepresentation = dataRepresentation;

        this.component.render({
            data: this.dataRepresentation,
        });
    }

    public enumerateObjectInstances(
        options: powerbi.EnumerateVisualObjectInstancesOptions,
        ): powerbi.VisualObjectInstanceEnumeration {
        const { objectName } = options;

        const shouldUseContainers: boolean = Object.keys(new SeriesSettings()).indexOf(objectName) !== -1;

        if (shouldUseContainers) {
            const enumerationObject: powerbi.VisualObjectInstanceEnumerationObject = {
                containers: [],
                instances: [],
            };

            this.enumerateSettings(
                enumerationObject,
                objectName,
                this.getSettings.bind(this),
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
                    delete instances[0].properties.position;
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

    public destroy(): void {
        this.component.destroy();

        this.converter = null;
        this.rootElement = null;
        this.component = null;
        this.dataRepresentation = null;
        this.interactivityService = null;
        this.behavior = null;
    }

    private enumerateSettings(
        enumerationObject: powerbi.VisualObjectInstanceEnumerationObject,
        objectName: string,
        getSettings: (settings: BaseDescriptor) => { [propertyName: string]: powerbi.DataViewPropertyValue },
    ): void {
        this.applySettings(
            objectName,
            "[All]",
            null,
            enumerationObject,
            getSettings(this.dataRepresentation.settings[objectName]),
        );

        this.enumerateSettingsDeep(
            this.getSeries(this.dataRepresentation),
            objectName,
            enumerationObject,
            getSettings,
        );
    }

    private getSeries(dataRepresentation: IDataRepresentation): IDataRepresentationSeries[] {
        if (!dataRepresentation) {
            return [];
        }

        if (!dataRepresentation.isGrouped) {
            return dataRepresentation.series;
        }

        const seriesGroup: IDataRepresentationSeriesGroup = dataRepresentation.groups
            .filter((group: IDataRepresentationSeriesGroup) => {
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
        properties: { [propertyName: string]: powerbi.DataViewPropertyValue },
    ): void {
        const containerIdx: number = enumerationObject.containers.push({ displayName }) - 1;

        enumerationObject.instances.push({
            containerIdx,
            objectName,
            properties,
            selector,
        });
    }

    private enumerateSettingsDeep(
        seriesArray: IDataRepresentationSeries[],
        objectName: string,
        enumerationObject: powerbi.VisualObjectInstanceEnumerationObject,
        getSettings: (settings: BaseDescriptor) => { [propertyName: string]: powerbi.DataViewPropertyValue },
    ): void {
        for (const series of seriesArray) {
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
}
