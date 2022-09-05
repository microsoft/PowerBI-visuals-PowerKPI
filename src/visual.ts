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
import { DataRepresentationTypeEnum } from "./dataRepresentation/dataRepresentationType";
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
        this.filterFormattingProperties()
        return this.formattingSettingsService.buildFormattingModel(this.settings);
    }

    private filterFormattingProperties() {
        this.filterLineProperties()
        this.filterKPIIndicatorValueProperties()
    }

    private filterLineProperties(){
        const line = this.settings.line
        let newSlices: Array<FormattingSettingsSlice> = [
            line.fillColor, 
            line.shouldMatchKpiColor, 
            line.dataPointStartsKpiColorSegment, 
            line.lineType, 
            line.thickness, 
            line.rawOpacity, 
            line.rawAreaOpacity, 
            line.lineStyle, 
            line.interpolation
        ]
        if(!line.shouldMatchKpiColor.value) this.removeSlice(newSlices, line.dataPointStartsKpiColorSegment)
        if(line.lineType.value.value !== LineType.area) this.removeSlice(newSlices, line.rawAreaOpacity)
        line.slices = newSlices
    }

    private filterKPIIndicatorValueProperties(){
        const kpiIndicatorValue = this.settings.kpiIndicatorValue
        let newSlices: Array<FormattingSettingsSlice> = [
            kpiIndicatorValue.show,
            kpiIndicatorValue.font,
            kpiIndicatorValue.format,
            kpiIndicatorValue.displayUnits,
            kpiIndicatorValue.precision,
            kpiIndicatorValue.matchKPIColor,
            kpiIndicatorValue.fontColor,
        ]
        if(kpiIndicatorValue.matchKPIColor.value) this.removeSlice(newSlices, kpiIndicatorValue.fontColor)
        kpiIndicatorValue.slices = newSlices
    }

    private removeSlice(slices: Array<FormattingSettingsSlice>, item: FormattingSettingsSlice) {
        const index = slices.indexOf(item);
        if(index > -1) {
            slices.splice(index, 1)
        }
    }
}
