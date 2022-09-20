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


import {
    interactivityBaseService,
    interactivitySelectionService,
} from "powerbi-visuals-utils-interactivityutils";

import { IConverter } from "./converter/converter";
import { DataConverter } from "./converter/dataConverter";
import { IDataRepresentation } from "./dataRepresentation/dataRepresentation";
import { EventName } from "./event/eventName";
import { IVisualComponent } from "./visualComponent/base/visualComponent";
import { IVisualComponentRenderOptions } from "./visualComponent/base/visualComponentRenderOptions";
import { MainComponent } from "./visualComponent/mainComponent";

import {
    IDataRepresentationSeries,
} from "./dataRepresentation/dataRepresentationSeries";

import {
    Behavior,
    IBehaviorOptions,
} from "./behavior/behavior";
import { Settings } from "./settings/settings";
import { formattingSettings, FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsSlice = formattingSettings.Slice;
import { LineType } from "./settings/descriptors/lineDescriptor";
export interface IPowerKPIConstructorOptions extends powerbi.extensibility.visual.VisualConstructorOptions {
    rootElement?: HTMLElement;
}

export class PowerKPI implements powerbi.extensibility.visual.IVisual {
    private static ViewportReducer: number = 3;

    private eventDispatcher: Dispatch<any> = dispatch(...Object.keys(EventName));

    private element: Selection<any, any, any, any>;
    private converter: IConverter;
    private component: IVisualComponent<IVisualComponentRenderOptions>;

    private dataRepresentation: IDataRepresentation;

    private behavior: Behavior;
    private interactivityService: interactivityBaseService.IInteractivityService<IDataRepresentationSeries>;
    private settings: Settings;
    private formattingSettingsService: FormattingSettingsService;

    constructor(options: IPowerKPIConstructorOptions) {
        // if (window.location !== window.parent.location) {
        //     require("core-js/stable");
        // }
        this.settings = new Settings()
        const localizationManager = options.host.createLocalizationManager()
        this.formattingSettingsService = new FormattingSettingsService(localizationManager);
        this.element = d3Select(options.element);

        this.converter = new DataConverter({
            colorPalette: options.host.colorPalette,
            createSelectionIdBuilder: options.host.createSelectionIdBuilder.bind(options.host),
        });

        this.behavior = new Behavior();
        this.interactivityService = interactivitySelectionService.createInteractivitySelectionService(options.host);

        const rootElement = options.rootElement && d3Select(options.rootElement) || this.element;

        this.component = new MainComponent({
            element: this.element,
            eventDispatcher: this.eventDispatcher,
            interactivityService: this.interactivityService,
            rootElement,
            tooltipService: options.host.tooltipService,
        });
    }

    public update(options: powerbi.extensibility.visual.VisualUpdateOptions): void {
        this.settings = this.formattingSettingsService.populateFormattingSettingsModel(Settings, options.dataViews);
        debugger

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
            settings: this.settings
        });
        if (this.interactivityService) {
            this.interactivityService.applySelectionStateToData(dataRepresentation.series);

            const behaviorOptions: IBehaviorOptions = {
                behavior: this.behavior,
                dataPoints: dataRepresentation.series,
                eventDispatcher: this.eventDispatcher,
                interactivityService: this.interactivityService,
            };

            this.interactivityService.bind(behaviorOptions);
        }

        this.render(dataRepresentation);
    }

    public render(dataRepresentation: IDataRepresentation): void {
        this.dataRepresentation = dataRepresentation;

        this.component.render({
            data: this.dataRepresentation,
        });
    }

    public destroy(): void {
        this.component.destroy();

        this.converter = null;
        this.element = null;
        this.component = null;
        this.dataRepresentation = null;
        this.interactivityService = null;
        this.behavior = null;
        this.settings = null;
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        debugger
        this.filterFormattingProperties()
        console.log(this.settings.tooltipValues.precision.value)
        return this.formattingSettingsService.buildFormattingModel(this.settings);
    }

    private filterFormattingProperties() {
        this.filterSettingsCards()
        this.filterLayoutProperties()
        this.filterLineProperties()
        this.filterKPIIndicatorProperties()
        this.filterKPIIndicatorValueProperties()
    }

    private filterSettingsCards() {
        let newCards = [...this.settings.defaultCards]
        this.settings.defaultCards.forEach(card => {
            if(this.shouldDeleteSettingsCard(card.name)){
                this.removeArrayItem(newCards, card)
            }
        })
        this.settings.cards = newCards
    }

    public shouldDeleteSettingsCard (
        cardName: string,
    ): boolean {
        switch (cardName) {
            case "kpiIndicatorValue": {
                return isNaN(this.dataRepresentation?.variance?.[0])
            }
            case "kpiIndicatorLabel": {
                return isNaN(this.dataRepresentation?.variance?.[0]) && isNaN(this.dataRepresentation?.series?.[0]?.current?.kpiIndex)
            }
            case "secondKPIIndicatorValue":
            case "secondKPIIndicatorLabel":
            case "secondTooltipVariance": {
                return !this.dataRepresentation?.series || !this.dataRepresentation?.variance || isNaN(this.dataRepresentation.variance[1])
            }
            case "secondaryYAxis":
            case "secondaryReferenceLineOfYAxis": {
                return !this.dataRepresentation?.groups?.[1]
            }
            default: {
                return false
            }
        }
    }

    private filterLayoutProperties() {
        const { layout } = this.settings
        let newSlices: Array<FormattingSettingsSlice> = [layout.autoHideVisualComponents, layout.auto, layout.layout];
        if(layout.auto.value) this.removeArrayItem(newSlices, layout.layout)
        layout.slices = newSlices
    }

    private filterLineProperties(){
        const { line } = this.settings
        line.container.containerItems.forEach(containerItem => {
            const containerName = containerItem.displayName
            let newSlices: Array<FormattingSettingsSlice> = [
                "fillColor", 
                "shouldMatchKpiColor", 
                "dataPointStartsKpiColorSegment", 
                "lineType", 
                "thickness", 
                "rawOpacity", 
                "rawAreaOpacity", 
                "lineStyle", 
                "interpolation",
                "interpolationWithColorizedLine"
            ].map(name => line[containerName]?.[name])

            if(!line[containerName]) return

            if(line[containerName].shouldMatchKpiColor.value) { 
                this.removeArrayItem(newSlices, line[containerName].interpolation)
            } else {
                this.removeArrayItem(newSlices, line[containerName].dataPointStartsKpiColorSegment)
                this.removeArrayItem(newSlices, line[containerName].interpolationWithColorizedLine)
            }

            if(line[containerName].lineType.value?.value !== LineType.area) this.removeArrayItem(newSlices, line[containerName].rawAreaOpacity)
            containerItem.slices = newSlices
        })
    }

    private filterKPIIndicatorProperties() {
        const { kpiIndicator } = this.settings
        let newSlices: Array<FormattingSettingsSlice> = kpiIndicator.getContextProperties()

        if(!this.dataRepresentation?.settings.kpiIndicatorValue.show.value || isNaN(this.dataRepresentation.variance?.[0])) {
            this.removeArrayItem(newSlices, kpiIndicator.position)
        }
        kpiIndicator.slices = newSlices
    }

    private filterKPIIndicatorValueProperties() {
        const { kpiIndicatorValue } = this.settings
        let newSlices: Array<FormattingSettingsSlice> = [
            kpiIndicatorValue.show,
            kpiIndicatorValue.font,
            kpiIndicatorValue.format,
            kpiIndicatorValue.displayUnits,
            kpiIndicatorValue.precision,
            kpiIndicatorValue.matchKPIColor,
            kpiIndicatorValue.fontColor,
        ]
        if(kpiIndicatorValue.matchKPIColor.value) this.removeArrayItem(newSlices, kpiIndicatorValue.fontColor)
        kpiIndicatorValue.slices = newSlices
    }

    private removeArrayItem<T>(array: Array<T>, item: T) {
        const index = array.indexOf(item);
        if(index > -1) {
            array.splice(index, 1)
        }
    }
}
