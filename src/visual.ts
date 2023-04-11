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
import { formattingSettings, FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";

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
import { LineType } from "./settings/descriptors/line/lineTypes";
import { DataRepresentationTypeEnum } from "./dataRepresentation/dataRepresentationType";
import { AxisType } from "./settings/descriptors/axis/axisDescriptor";
import { NumberDescriptorBase } from "./settings/descriptors/numberDescriptorBase";

import FormattingSettingsSlice = formattingSettings.Slice;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import ILocalizationManager = powerbi.extensibility.ILocalizationManager;

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

    private localizationManager: ILocalizationManager;
    private settings: Settings;
    private formattingSettingsService: FormattingSettingsService;

    constructor(options: IPowerKPIConstructorOptions) {
        this.settings = new Settings()
        this.localizationManager = options.host.createLocalizationManager()
        this.formattingSettingsService = new FormattingSettingsService(this.localizationManager);
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

    public update(options: VisualUpdateOptions): void {
        this.settings = this.formattingSettingsService.populateFormattingSettingsModel(Settings, options.dataViews);

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

    public updateFormatPropertyValue(){
        this.settings.cards.forEach(card => {
            if(card instanceof NumberDescriptorBase){
                card.applyDefaultFormatByType(this.axisType)
            }
        })
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        this.filterFormattingProperties()

        return this.formattingSettingsService.buildFormattingModel(this.settings);
    }

    private filterFormattingProperties() {
        this.filterSettingsCards();
        this.filterLayoutProperties();
        this.filterLineProperties();
        this.filterKPIIndicatorProperties();
        this.filterKPIIndicatorValueProperties();
        this.filterSettingsPropertiesByAxisType();
        this.setLocalizedDisplayNames();

    }

    private filterSettingsPropertiesByAxisType() {
        const { 
            kpiIndicatorValue,
            secondKPIIndicatorValue,
            dateValueKPI,
            tooltipLabel,
            tooltipVariance,
            secondTooltipVariance
        } = this.settings

        const settingsToFilterByAxis = [
            kpiIndicatorValue,
            secondKPIIndicatorValue,
            dateValueKPI,
            tooltipLabel,
            tooltipVariance,
            secondTooltipVariance
        ]
        settingsToFilterByAxis.forEach(card => {
            const newSlices = [...card.slices]
            this.addArrayItems(newSlices, [card.displayUnits, card.precision, card.format])
            if (card.shouldNumericPropertiesBeHiddenByType
                && this.axisType !== DataRepresentationTypeEnum.NumberType
            ) {
                this.removeArrayItem(newSlices, card.displayUnits)
                this.removeArrayItem(newSlices, card.precision)
            }
    
            if (this.axisType !== DataRepresentationTypeEnum.NumberType
                && this.axisType !== DataRepresentationTypeEnum.DateType
            ) {
                this.removeArrayItem(newSlices, card.format)
            }
            card.slices = newSlices
        })
    }

    private filterSettingsCards() {
        const newCards = [...this.settings.defaultCards]
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
        const newSlices: Array<FormattingSettingsSlice> = [...layout.slices];
        if(layout.auto.value) this.removeArrayItem(newSlices, layout.layout)
        layout.slices = newSlices
    }

    private filterLineProperties(){
        const { line } = this.settings
        line.container.containerItems.forEach(containerItem => {
            const containerName = containerItem.displayName
            const currentSettings = line.getCurrentSettings(containerName);
            const newSlices: Array<FormattingSettingsSlice> = [...containerItem.slices]

            if(currentSettings.shouldMatchKpiColor) { 
                this.removeArrayItem(newSlices, newSlices.filter(el => el.name === "interpolation")[0])
            } else {
                this.removeArrayItem(newSlices, newSlices.filter(el => el.name === "dataPointStartsKpiColorSegment")[0])
                this.removeArrayItem(newSlices, newSlices.filter(el => el.name === "interpolationWithColorizedLine")[0])
            }

            if(currentSettings.lineType !== LineType.area) this.removeArrayItem(newSlices, newSlices.filter(el => el.name === "rawAreaOpacity")[0])
            containerItem.slices = newSlices
        })
    }

    private filterKPIIndicatorProperties() {
        const { kpiIndicator } = this.settings
        const newSlices: Array<FormattingSettingsSlice> = kpiIndicator.getContextProperties()

        if(!this.dataRepresentation?.settings.kpiIndicatorValue.show.value || isNaN(this.dataRepresentation.variance?.[0])) {
            this.removeArrayItem(newSlices, kpiIndicator.position)
        }
        kpiIndicator.slices = newSlices
    }

    private filterKPIIndicatorValueProperties() {
        const { kpiIndicatorValue } = this.settings
        const newSlices: Array<FormattingSettingsSlice> = [...kpiIndicatorValue.slices]
        if(kpiIndicatorValue.matchKPIColor.value) this.removeArrayItem(newSlices, kpiIndicatorValue.fontColor)
        kpiIndicatorValue.slices = newSlices
    }

    private setLocalizedDisplayNames() {
        this.settings.cards.forEach(card => {
            card.setLocalizedDisplayName(this.localizationManager)
        })
    }

    private removeArrayItem<T>(array: T[], item: T) {
        const index = array.indexOf(item);
        if(index > -1) {
            array.splice(index, 1)
        }
    }

    private addArrayItem<T>(array: T[], item: T) {
        const index = array.indexOf(item);
        if(index === -1) {
            array.push(item)
        }
    }

    private addArrayItems<T>(array: T[], items: T[]) {
        items.forEach(item => this.addArrayItem(array, item))
    }
}
