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

namespace powerbi.extensibility.visual.powerKPI {
    // powerbi.extensibility.utils.dataview
    import DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;

    /* These viewports describe the minimal viewport for each visual component */

    const kpiCaptionViewport: IViewport = {
        width: 90,
        height: 90
    };

    const kpiLabelViewport: IViewport = {
        width: 165,
        height: 165
    };

    const subtitleViewport: IViewport = {
        width: 150,
        height: 150
    };

    const legendViewport: IViewport = {
        width: 120,
        height: 120
    };

    const LabelsViewport: IViewport = {
        width: 80,
        height: 80
    };

    const axisViewportToDecreaseFontSize: IViewport = {
        width: 70,
        height: 70
    };

    const axisViewportToIncreaseDensity: IViewport = {
        width: 250,
        height: 250
    };

    export class Settings extends DataViewObjectsParser {
        public layout: LayoutSettings = new LayoutSettings();
        public title: FakeTitleSettings = new FakeTitleSettings();
        public subtitle: SubtitleSettings = new SubtitleSettings(subtitleViewport);
        public kpiIndicator: KPIIndicatorSettings = new KPIIndicatorSettings(kpiCaptionViewport);
        public kpiIndicatorValue: KPIIndicatorValueSignSettings = new KPIIndicatorValueSignSettings(kpiCaptionViewport);
        public kpiIndicatorLabel: KPIIndicatorCustomizableLabelSettings = new KPIIndicatorCustomizableLabelSettings(kpiLabelViewport);
        public secondKPIIndicatorValue: KPIIndicatorValueSettings = new KPIIndicatorValueSettings(kpiCaptionViewport);
        public secondKPIIndicatorLabel: KPIIndicatorCustomizableLabelSettings = new KPIIndicatorCustomizableLabelSettings(kpiLabelViewport);
        public actualValueKPI: KPIIndicatorValueSettings = new KPIIndicatorValueSettings(kpiCaptionViewport);
        public actualLabelKPI: KPIIndicatorLabelSettings = new KPIIndicatorLabelSettings(kpiLabelViewport);
        public dateValueKPI: KPIIndicatorValueSettings = new KPIIndicatorValueSettings(kpiCaptionViewport, true);
        public dateLabelKPI: KPIIndicatorLabelSettings = new KPIIndicatorLabelSettings(kpiLabelViewport);
        public labels: LabelsSettings = new LabelsSettings(LabelsViewport);
        public _lineStyle: LineStyleSettings = new LineStyleSettings();
        public _lineThickness: LineThicknessSettings = new LineThicknessSettings();
        public dots: DotsSettings = new DotsSettings();
        public legend: LegendSettings = new LegendSettings(legendViewport);
        public xAxis: AxisSettings = new AxisSettings(axisViewportToDecreaseFontSize, axisViewportToIncreaseDensity, true);
        public yAxis: YAxisSettings = new YAxisSettings(axisViewportToDecreaseFontSize, axisViewportToIncreaseDensity, false);
        public referenceLineOfXAxis: AxisReferenceLineSettings = new AxisReferenceLineSettings(false);
        public referenceLineOfYAxis: AxisReferenceLineSettings = new AxisReferenceLineSettings();
        public tooltipLabel: TooltipSettings = new TooltipSettings(undefined, true);
        public tooltipVariance: TooltipLabelSettings = new TooltipLabelSettings();
        public secondTooltipVariance: TooltipLabelSettings = new TooltipLabelSettings();
        public tooltipValues: TooltipSettings = new TooltipSettings();

        public parseSettings(viewport: IViewport, type: DataRepresentationTypeEnum): void {
            const options: SettingsParserOptions = {
                viewport,
                type,
                isAutoHideBehaviorEnabled: this.layout.autoHideVisualComponents
            };

            Object.keys(this)
                .forEach((settingName: string) => {
                    const settingsObj: SettingsBase = this[settingName] as SettingsBase;

                    if (settingsObj.parse) {
                        settingsObj.parse(options);
                    }
                });
        }

        public applyColumnFormat(format: string): void {
            [
                this.dateValueKPI,
                this.tooltipLabel
            ].forEach((settings: NumberSettingsBase) => {
                settings.setColumnFormat(format);
            });
        }
    }
}
