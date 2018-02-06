/*
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
/// <reference path="_references.ts"/>

namespace powerbi.extensibility.visual.test {
    // powerbi
    import DataView = powerbi.DataView;

    // tests
    import PowerKPI = powerbi.extensibility.visual.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.PowerKPI;
    import Settings = powerbi.extensibility.visual.powerKPI.Settings;
    import VisualComponent = powerbi.extensibility.visual.powerKPI.VisualComponent;
    import TooltipComponent = powerbi.extensibility.visual.powerKPI.TooltipComponent;
    import DataRepresentation = powerbi.extensibility.visual.powerKPI.DataRepresentation;
    import DataRepresentationX = powerbi.extensibility.visual.powerKPI.DataRepresentationX;
    import KPIIndicatorSettings = powerbi.extensibility.visual.powerKPI.KPIIndicatorSettings;
    import IKPIIndicatorSettings = powerbi.extensibility.visual.powerKPI.IKPIIndicatorSettings;
    import DataRepresentationSeries = powerbi.extensibility.visual.powerKPI.DataRepresentationSeries;
    import DataRepresentationTypeEnum = powerbi.extensibility.visual.powerKPI.DataRepresentationTypeEnum;
    import EventPositionVisualComponentOptions = powerbi.extensibility.visual.powerKPI.EventPositionVisualComponentOptions;
    import VisualBuilderBase = powerbi.extensibility.utils.test.VisualBuilderBase;
    import helpers = powerbi.extensibility.utils.test.helpers;
    
    // powerbitests
    import PowerKPIData = powerbi.extensibility.visual.test.PowerKPIData;

    powerbi.extensibility.utils.test.mocks.createLocale();

    describe("Power KPI", () => {
        
        describe("DOM", () => {
            it("Root element is defined in DOM", (done) => {
                const testWrapper: TestWrapper = TestWrapper.create();

                testWrapper.visualBuilder.updateRenderTimeout(testWrapper.dataView, () => {
                    expect(testWrapper.visualBuilder.$root).toBeInDOM();

                    done();
                });
            });
        });

        describe("TooltipComponent", () => {
            function createTooltipComponent(service?: ITooltipService): VisualComponent {
                return new TooltipComponent(service);
            }

            it("constructor shouldn't throw any exception during initialization", () => {
                expect(() => {
                    createTooltipComponent();
                }).not.toThrow();
            });

            it("should call tooltip API", (done) => {
                const tooltipService = jasmine.createSpyObj("tooltipService", ["show"]);
                const tooltipComponent: TooltipComponent = createTooltipComponent(tooltipService) as TooltipComponent;                

                const position = { x: 100, y: 100 };

                const currentDate: Date = new Date();

                const series: DataRepresentationSeries[] = [
                    {
                        points: [{ axisValue: currentDate, value: 100, kpiIndex: 0, }],
                        color: "green",
                        name: "Series1",
                        selectionId: null,
                        lineStyle: null,
                        thickness: 0,
                        current: null,
                        format: null
                    },
                    {
                        points: [{ axisValue: currentDate, value: 200, kpiIndex: 0, }],
                        color: "blue",
                        name: "Series2",
                        selectionId: null,
                        lineStyle: null,
                        thickness: 0,
                        current: null,
                        format: null
                    },
                    {
                        points: [{ axisValue: currentDate, value: 300, kpiIndex: 0, }],
                        color: "yellow",
                        name: "Series3",
                        selectionId: null,
                        lineStyle: null,
                        thickness: 0,
                        current: null,
                        format: null
                    }
                ];

                const variances: number[][] = [
                    [-100],
                    [-200]
                ];

                const settings: Settings = Settings.getDefault() as Settings;

                const options: EventPositionVisualComponentOptions = {
                    position,
                    data: {
                        series,
                        variances,
                        settings,
                        x: {
                            type: DataRepresentationTypeEnum.DateType
                        } as DataRepresentationX
                    } as DataRepresentation
                };

                tooltipComponent.render(options);

                helpers.renderTimeout(() => {
                    expect(tooltipComponent.tooltipService.show).toHaveBeenCalled();

                    done();
                });
            });
        });

        describe("KPIIndicatorSettings", () => {
            let kpiIndicatorSettings: KPIIndicatorSettings;

            beforeEach(() => {
                kpiIndicatorSettings = new KPIIndicatorSettings();
            });

            describe("getElementByIndex", () => {
                const testSet: string[] = [
                    "Power BI 1",
                    "Power BI 2",
                    "Power BI 3",
                    "Power BI 4",
                    "Power BI 5",
                ];

                it("should return the first element", () => {
                    const expectedValue: string = testSet[0];
                    const actualValue: string = kpiIndicatorSettings.getElementByIndex(testSet, 0);

                    expect(actualValue).toBe(expectedValue);
                });

                it("should return the last element", () => {
                    const expectedValue: string = testSet[testSet.length - 1];
                    const actualValue: string = kpiIndicatorSettings.getElementByIndex(testSet, testSet.length - 1);

                    expect(actualValue).toBe(expectedValue);
                });
            });

            describe("getCurrentKPI", () => {
                it("should return the default KPI if KPI value has not been found in the specified KPIs", () => {
                    const actualKPI: IKPIIndicatorSettings = kpiIndicatorSettings.getCurrentKPI(-100);

                    expect(actualKPI.shape).toBeNull();
                    expect(actualKPI.color).toBeNull();
                });

                it("should return KPI if KPI value has been found in the specified KPIs", () => {
                    const actualKPI: IKPIIndicatorSettings = kpiIndicatorSettings.getCurrentKPI(2);

                    expect(actualKPI.shape).toBeDefined();
                    expect(actualKPI.color).toBeDefined();
                });
            });
        });
    });

    class TestWrapper {
        public dataView: DataView;
        public dataViewBuilder: PowerKPIData;
        public visualBuilder: PowerKPIBuilder;

        constructor(width: number = 1024, height: number = 768) {
            this.visualBuilder = new PowerKPIBuilder(width, height);
            this.dataViewBuilder = new PowerKPIData();

            this.dataView = this.dataViewBuilder.getDataView();
        }

        public static create(): TestWrapper {
            return new TestWrapper();
        }
    }

    class PowerKPIBuilder extends VisualBuilderBase<PowerKPI> {
        constructor(width: number, height: number) {
            super(width, height);
        }

        protected build(): PowerKPI {
            return new PowerKPI({
                element: document.createElement("div"),
                host: {
                    createSelectionIdBuilder: () => {}
                } as IVisualHost
            });
        }

        public get instance(): PowerKPI {
            return this.visual;
        }

        public get $root(): JQuery {
            return this.element;
        }
    }
}