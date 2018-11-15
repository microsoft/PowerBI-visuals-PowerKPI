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
    Descriptor,
    DescriptorParserOptions
} from "./descriptors/descriptor";

import { DataRepresentationTypeEnum } from "../dataRepresentation/dataRepresentationType";

import { LayoutDescriptor } from "./descriptors/layoutDescriptor";
import { FakeTitleDescriptor } from "./descriptors/fakeTitleDescriptor";
import { SubtitleDescriptor } from "./descriptors/subtitleDescriptor";
import { KPIIndicatorDescriptor } from "./descriptors/kpi/kpiIndicatorDescriptor";
import { KPIIndicatorValueSignDescriptor } from "./descriptors/kpi/kpiIndicatorValueSignDescriptor";
import { KPIIndicatorCustomizableLabelDescriptor } from "./descriptors/kpi/kpiIndicatorCustomizableLabelDescriptor";
import { KPIIndicatorValueDescriptor } from "./descriptors/kpi/kpiIndicatorValueDescriptor";
import { KPIIndicatorLabelDescriptor } from "./descriptors/kpi/kpiIndicatorLabelDescriptor";
import { LabelsDescriptor } from "./descriptors/labelsDescriptor";
import { LineDescriptor } from "./descriptors/lineDescriptor";
import { DotsDescriptor } from "./descriptors/dotsDescriptor";
import { LegendDescriptor } from "./descriptors/legendDescriptor";

import {
    XAxisDescriptor,
    YAxisDescriptor
} from "./descriptors/axis/axisDescriptor";

import { AxisReferenceLineDescriptor } from "./descriptors/axis/referenceLine/axisReferenceLineDescriptor";
import { TooltipDescriptor } from "./descriptors/tooltip/tooltipDescriptor";
import { TooltipLabelDescriptor } from "./descriptors/tooltip/tooltipLabelDescriptor";

const kpiCaptionViewport: powerbi.IViewport = {
    width: 90,
    height: 90
};

const kpiLabelViewport: powerbi.IViewport = {
    width: 165,
    height: 165
};

const subtitleViewport: powerbi.IViewport = {
    width: 150,
    height: 150
};

const legendViewport: powerbi.IViewport = {
    width: 120,
    height: 120
};

const LabelsViewport: powerbi.IViewport = {
    width: 80,
    height: 80
};

const axisViewportToDecreaseFontSize: powerbi.IViewport = {
    width: 70,
    height: 70
};

const axisViewportToIncreaseDensity: powerbi.IViewport = {
    width: 250,
    height: 250
};

export class Settings extends SettingsBase {
    public layout: LayoutDescriptor = new LayoutDescriptor();
    public title: FakeTitleDescriptor = new FakeTitleDescriptor();
    public subtitle: SubtitleDescriptor = new SubtitleDescriptor(subtitleViewport);
    public kpiIndicator: KPIIndicatorDescriptor = new KPIIndicatorDescriptor(kpiCaptionViewport);
    public kpiIndicatorValue: KPIIndicatorValueSignDescriptor = new KPIIndicatorValueSignDescriptor(kpiCaptionViewport);
    public kpiIndicatorLabel: KPIIndicatorCustomizableLabelDescriptor = new KPIIndicatorCustomizableLabelDescriptor(kpiLabelViewport);
    public secondKPIIndicatorValue: KPIIndicatorValueDescriptor = new KPIIndicatorValueDescriptor(kpiCaptionViewport);
    public secondKPIIndicatorLabel: KPIIndicatorCustomizableLabelDescriptor = new KPIIndicatorCustomizableLabelDescriptor(kpiLabelViewport);
    public actualValueKPI: KPIIndicatorValueDescriptor = new KPIIndicatorValueDescriptor(kpiCaptionViewport);
    public actualLabelKPI: KPIIndicatorLabelDescriptor = new KPIIndicatorLabelDescriptor(kpiLabelViewport);
    public dateValueKPI: KPIIndicatorValueDescriptor = new KPIIndicatorValueDescriptor(kpiCaptionViewport, true);
    public dateLabelKPI: KPIIndicatorLabelDescriptor = new KPIIndicatorLabelDescriptor(kpiLabelViewport);
    public labels: LabelsDescriptor = new LabelsDescriptor(LabelsViewport);
    public line: LineDescriptor = new LineDescriptor();
    public dots: DotsDescriptor = new DotsDescriptor();
    public legend: LegendDescriptor = new LegendDescriptor(legendViewport);
    public xAxis: XAxisDescriptor = new XAxisDescriptor(axisViewportToDecreaseFontSize, axisViewportToIncreaseDensity, true);
    public yAxis: YAxisDescriptor = new YAxisDescriptor(axisViewportToDecreaseFontSize, axisViewportToIncreaseDensity, false);
    public secondaryYAxis: YAxisDescriptor = new YAxisDescriptor(axisViewportToDecreaseFontSize, axisViewportToIncreaseDensity, false);
    public referenceLineOfXAxis: AxisReferenceLineDescriptor = new AxisReferenceLineDescriptor(false);
    public referenceLineOfYAxis: AxisReferenceLineDescriptor = new AxisReferenceLineDescriptor();
    public secondaryReferenceLineOfYAxis: AxisReferenceLineDescriptor = new AxisReferenceLineDescriptor(false);
    public tooltipLabel: TooltipDescriptor = new TooltipDescriptor(undefined, true);
    public tooltipVariance: TooltipLabelDescriptor = new TooltipLabelDescriptor();
    public secondTooltipVariance: TooltipLabelDescriptor = new TooltipLabelDescriptor();
    public tooltipValues: TooltipDescriptor = new TooltipDescriptor();

    constructor() {
        super();

        const percentageFormat: string = "+0.00 %;-0.00 %;0.00 %";

        this.kpiIndicatorValue.defaultFormat = percentageFormat;
        this.secondKPIIndicatorValue.defaultFormat = percentageFormat;

        this.tooltipVariance.defaultFormat = percentageFormat;
        this.secondTooltipVariance.defaultFormat = percentageFormat;
    }

    public parseSettings(viewport: powerbi.IViewport, type: DataRepresentationTypeEnum): void {
        const options: DescriptorParserOptions = {
            viewport,
            type,
            isAutoHideBehaviorEnabled: this.layout.autoHideVisualComponents
        };

        Object.keys(this)
            .forEach((settingName: string) => {
                const settingsObj: Descriptor = this[settingName] as Descriptor;

                if (settingsObj.parse) {
                    settingsObj.parse(options);
                }
            });
    }

    protected processDescriptor(descriptor: Descriptor): void { }
}
