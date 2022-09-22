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

import { SettingsBase } from "./settingBase";

import {
    IDescriptor,
    IDescriptorParserOptions,
} from "./descriptors/descriptor";

import { DataRepresentationTypeEnum } from "../dataRepresentation/dataRepresentationType";

import { DotsDescriptor } from "./descriptors/dotsDescriptor";
import { FakeTitleDescriptor } from "./descriptors/fakeTitleDescriptor";
import { KPIIndicatorCustomizableLabelDescriptor } from "./descriptors/kpi/kpiIndicatorCustomizableLabelDescriptor";
import { KPIIndicatorsListDescriptor } from "./descriptors/kpi/kpiIndicatorsListDescriptor";
import { KPIIndicatorLabelDescriptor } from "./descriptors/kpi/kpiIndicatorLabelDescriptor";
import { KPIIndicatorDateLabelDescriptor } from "./descriptors/kpi/kpiIndicatorDateLabelDescriptor";
import { KPIIndicatorValueDescriptor } from "./descriptors/kpi/kpiIndicatorValueDescriptor";
import { KPIIndicatorDateDescriptor } from "./descriptors/kpi/kpiIndicatorDateDescriptor";
import { KPIIndicatorValueSignDescriptor } from "./descriptors/kpi/kpiIndicatorValueSignDescriptor";
import { LabelsDescriptor } from "./descriptors/labelsDescriptor";
import { LayoutDescriptor } from "./descriptors/layoutDescriptor";
import { LegendDescriptor } from "./descriptors/legendDescriptor";
import { LineDescriptor } from "./descriptors/lineDescriptor";
import { SubtitleDescriptor } from "./descriptors/subtitleDescriptor";

import { XAxisDescriptor } from "./descriptors/axis/xAxisDescriptor";
import { YAxisDescriptor } from "./descriptors/axis/yAxisDescriptor";

import { AxisReferenceLineDescriptor } from "./descriptors/axis/referenceLine/axisReferenceLineDescriptor";
import { TooltipVarianceDescriptor } from "./descriptors/tooltip/tooltipVarianceDescriptor";
import { TooltipLabelDescriptor } from "./descriptors/tooltip/tooltipLabelDescriptor";
import { TooltipValueDescriptor } from "./descriptors/tooltip/tooltipValueDescriptor";
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

const kpiCaptionViewport: powerbi.IViewport = {
    height: 90,
    width: 90,
};

const kpiLabelViewport: powerbi.IViewport = {
    height: 165,
    width: 165,
};

const subtitleViewport: powerbi.IViewport = {
    height: 150,
    width: 150,
};

const legendViewport: powerbi.IViewport = {
    height: 120,
    width: 120,
};

const LabelsViewport: powerbi.IViewport = {
    height: 80,
    width: 80,
};

const axisViewportToDecreaseFontSize: powerbi.IViewport = {
    height: 70,
    width: 70,
};

const axisViewportToIncreaseDensity: powerbi.IViewport = {
    height: 250,
    width: 250,
};

export class Settings extends formattingSettings.Model {
    public layout: LayoutDescriptor = new LayoutDescriptor();
    public title: FakeTitleDescriptor = new FakeTitleDescriptor();
    public subtitle: SubtitleDescriptor = new SubtitleDescriptor(subtitleViewport);
    public kpiIndicator: KPIIndicatorsListDescriptor = new KPIIndicatorsListDescriptor(kpiCaptionViewport);
    public kpiIndicatorValue: KPIIndicatorValueSignDescriptor = new KPIIndicatorValueSignDescriptor(kpiCaptionViewport);
    public kpiIndicatorLabel: KPIIndicatorCustomizableLabelDescriptor = new KPIIndicatorCustomizableLabelDescriptor(
        "kpiIndicatorLabel",
        "KPI Indicator Label",
        kpiLabelViewport,
    );
    public secondKPIIndicatorValue: KPIIndicatorValueDescriptor = new KPIIndicatorValueDescriptor(
        kpiCaptionViewport, 
        "secondKPIIndicatorValue", 
        "Second KPI Indicator Value"
    );
    public secondKPIIndicatorLabel: KPIIndicatorCustomizableLabelDescriptor = new KPIIndicatorCustomizableLabelDescriptor(
        "secondKPIIndicatorLabel",
        "Second KPI Indicator Label",
        kpiLabelViewport,
    );
    public actualValueKPI: KPIIndicatorValueDescriptor = new KPIIndicatorValueDescriptor(kpiCaptionViewport, "actualValueKPI", "KPI Actual Value");
    public actualLabelKPI: KPIIndicatorLabelDescriptor = new KPIIndicatorLabelDescriptor(kpiLabelViewport, "actualLabelKPI", "KPI Actual Label");
    public dateValueKPI: KPIIndicatorDateDescriptor = new KPIIndicatorDateDescriptor(kpiCaptionViewport);
    public dateLabelKPI: KPIIndicatorDateLabelDescriptor = new KPIIndicatorDateLabelDescriptor(kpiLabelViewport);
    public labels: LabelsDescriptor = new LabelsDescriptor(LabelsViewport);
    public line: LineDescriptor = new LineDescriptor();
    public dots: DotsDescriptor = new DotsDescriptor();
    public legend: LegendDescriptor = new LegendDescriptor(legendViewport);
    public xAxis: XAxisDescriptor = new XAxisDescriptor(axisViewportToDecreaseFontSize, axisViewportToIncreaseDensity);
    public yAxis: YAxisDescriptor = new YAxisDescriptor("yAxis", "Y Axis", axisViewportToDecreaseFontSize, axisViewportToIncreaseDensity);
    public secondaryYAxis: YAxisDescriptor = new YAxisDescriptor("secondaryYAxis", "Secondary Y Axis", axisViewportToDecreaseFontSize, axisViewportToIncreaseDensity);
    public referenceLineOfXAxis: AxisReferenceLineDescriptor = new AxisReferenceLineDescriptor("referenceLineOfXAxis", "X Axis Reference Lines", false);
    public referenceLineOfYAxis: AxisReferenceLineDescriptor = new AxisReferenceLineDescriptor("referenceLineOfYAxis", "Y Axis Reference Lines");
    public secondaryReferenceLineOfYAxis: AxisReferenceLineDescriptor = new AxisReferenceLineDescriptor("secondaryReferenceLineOfYAxis", "Secondary Y Axis Reference Lines", false);
    public tooltipLabel: TooltipLabelDescriptor = new TooltipLabelDescriptor("tooltipLabel", "Tooltip Label");
    public tooltipVariance: TooltipVarianceDescriptor = new TooltipVarianceDescriptor("tooltipVariance", "Tooltip KPI Indicator Value");
    public secondTooltipVariance: TooltipVarianceDescriptor = new TooltipVarianceDescriptor("secondTooltipVariance", "Second Tooltip KPI Indicator Value");
    public tooltipValues: TooltipValueDescriptor = new TooltipValueDescriptor("tooltipValues", "Tooltip Values");
    public defaultCards = [
        this.layout, this.title, this.subtitle, this.kpiIndicator, this.kpiIndicatorValue,
        this.kpiIndicatorLabel, this.secondKPIIndicatorValue, this.secondKPIIndicatorLabel, 
        this.actualValueKPI, this.actualLabelKPI, this.dateValueKPI, this.dateLabelKPI,
        this.labels, // this.dots,
        this.line, this.legend, this.xAxis,
        this.yAxis, this.secondaryYAxis, this.referenceLineOfXAxis, this.referenceLineOfYAxis,
        this.secondaryReferenceLineOfYAxis, this.tooltipLabel, this.tooltipVariance, 
        this.secondTooltipVariance, this.tooltipValues
    ]
    public cards = this.defaultCards
    
    constructor() {
        super();

        const percentageFormat: string = "+0.00 %;-0.00 %;0.00 %";

        this.kpiIndicatorValue.defaultFormat = percentageFormat;
        this.secondKPIIndicatorValue.defaultFormat = percentageFormat;

        this.tooltipVariance.defaultFormat = percentageFormat;
        this.secondTooltipVariance.defaultFormat = percentageFormat;
    }

    public parseSettings(viewport: powerbi.IViewport, type: DataRepresentationTypeEnum): void {
        const options: IDescriptorParserOptions = {
            isAutoHideBehaviorEnabled: this.layout.autoHideVisualComponents.value,
            type,
            viewport,
        };

        this.cards.forEach((setting) => {
                const settingsObj: IDescriptor = setting as IDescriptor;

                if (settingsObj.parse) {
                    settingsObj.parse(options);
                }
            });
    }

    protected processDescriptor(): void {
        return;
    }
}
