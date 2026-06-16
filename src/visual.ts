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
    select as d3Select,
    Selection,
} from "d3-selection";
import { dispatch, Dispatch } from "d3-dispatch";

import powerbi from "powerbi-visuals-api";
import {
    interactivityBaseService,
    interactivitySelectionService,
} from "powerbi-visuals-utils-interactivityutils";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";

import { IConverter } from "./converter/converter";
import { DataConverter } from "./converter/dataConverter";
import { IDataRepresentation } from "./dataRepresentation/dataRepresentation";
import { EventName } from "./event/eventName";
import { IVisualComponent } from "./visualComponent/base/visualComponent";
import { IVisualComponentRenderOptions } from "./visualComponent/base/visualComponentRenderOptions";
import { MainComponent } from "./visualComponent/mainComponent";

import { IDataRepresentationSeries } from "./dataRepresentation/dataRepresentationSeries";

import {
    Behavior,
    IBehaviorOptions,
} from "./behavior/behavior";
import { Settings } from "./settings/settings";
import { DataRepresentationTypeEnum } from "./dataRepresentation/dataRepresentationType";
import { AxisType } from "./settings/descriptors/axis/axisDescriptor";
import { NumberDescriptorBase } from "./settings/descriptors/numberDescriptorBase";

import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualEventService = powerbi.extensibility.IVisualEventService;
import ILocalizationManager = powerbi.extensibility.ILocalizationManager;
import ISandboxExtendedColorPalette = powerbi.extensibility.ISandboxExtendedColorPalette;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;

export interface IPowerKPIConstructorOptions extends VisualConstructorOptions {
    rootElement?: HTMLElement;
}

export class PowerKPI implements IVisual {
    private static ViewportReducer: number = 3;

    private axisType: DataRepresentationTypeEnum = DataRepresentationTypeEnum.None;
    private eventDispatcher: Dispatch<any> = dispatch(...Object.keys(EventName));
    private element: Selection<any, any, any, any>;
    private converter: IConverter;
    private component: IVisualComponent<IVisualComponentRenderOptions>;
    private dataRepresentation: IDataRepresentation;
    private behavior: Behavior;
    private interactivityService: interactivityBaseService.IInteractivityService<IDataRepresentationSeries>;
    private events: IVisualEventService;

    private localizationManager: ILocalizationManager;
    private settings: Settings;
    private formattingSettingsService: FormattingSettingsService;
    private colorPalette: ISandboxExtendedColorPalette;
    private host: IVisualHost;

    constructor(options: IPowerKPIConstructorOptions) {
        this.events = options.host.eventService;
        this.settings = new Settings()
        this.localizationManager = options.host.createLocalizationManager()
        this.formattingSettingsService = new FormattingSettingsService(this.localizationManager);
        this.element = d3Select(options.element);
        this.colorPalette = options.host.colorPalette;

        this.host = options.host;

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

    public update(options: VisualUpdateOptions): void {
        this.events.renderingStarted(options);
        this.settings = this.formattingSettingsService.populateFormattingSettingsModel(Settings, options.dataViews[0]);

        const dataView: powerbi.DataView = options && options.dataViews && options.dataViews[0];

        const viewport: powerbi.IViewport = options
            && options.viewport
            && {
                height: options.viewport.height - PowerKPI.ViewportReducer,
                width: options.viewport.width - PowerKPI.ViewportReducer,
            }
            || { height: 0, width: 0 };

        this.axisType = this.converter.getAxisType({
            dataView,
            xAxisType: this.settings.xAxis.type.value.value as AxisType
        });
        this.updateFormatPropertyValue();

        const dataRepresentation: IDataRepresentation = this.converter.convert({
            dataView,
            hasSelection: this.interactivityService && this.interactivityService.hasSelection(),
            viewport,
            settings: this.settings,
            locale: this.host.locale
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
        this.events.renderingFinished(options);
    }

    public render(dataRepresentation: IDataRepresentation): void {
        this.dataRepresentation = dataRepresentation;

        this.component.render({
            data: this.dataRepresentation,
            colorPalette: this.colorPalette
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

    public updateFormatPropertyValue(){
        this.settings.cards.forEach(card => {
            if(card instanceof NumberDescriptorBase){
                card.applyDefaultFormatByType(this.axisType)
            }
        })
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        this.settings.filterFormattingProperties(this.dataRepresentation, this.axisType, this.localizationManager, this.colorPalette.isHighContrast);

        return this.formattingSettingsService.buildFormattingModel(this.settings);
    }    
}
