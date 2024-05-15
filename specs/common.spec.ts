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
import { select as d3Select } from "d3-selection";

import powerbi from "powerbi-visuals-api";

import { legendInterfaces } from "powerbi-visuals-utils-chartutils";

import {
    createColorPalette,
    createSelectionIdBuilder,
    createTooltipService,
    renderTimeout,
    testDom,
} from "powerbi-visuals-utils-testutils";

import { valueFormatter } from "powerbi-visuals-utils-formattingutils";

import { IVisualComponent } from "../src/visualComponent/base/visualComponent";
import { IVisualComponentConstructorOptions } from "../src/visualComponent/base/visualComponentConstructorOptions";

import {
    IDataRepresentationPoint,
    IDataRepresentationPointGradientColor,
} from "../src/dataRepresentation/dataRepresentationPoint";

import { IDataRepresentation } from "../src/dataRepresentation/dataRepresentation";
import { IDataRepresentationX } from "../src/dataRepresentation/dataRepresentationAxis";
import { DataRepresentationPointFilter } from "../src/dataRepresentation/dataRepresentationPointFilter";
import { IDataRepresentationSeries } from "../src/dataRepresentation/dataRepresentationSeries";
import { DataRepresentationTypeEnum } from "../src/dataRepresentation/dataRepresentationType";
import { Settings } from "../src/settings/settings";
import { IEventPositionVisualComponentOptions } from "../src/visualComponent/eventPositionVisualComponentOptions";
import { TooltipComponent } from "../src/visualComponent/tooltipComponent";

import {
    ILineComponentRenderOptions,
    LineComponent,
} from "../src/visualComponent/combo/lineComponent";

import {
    LegendDescriptor,
    LegendStyle,
} from "../src/settings/descriptors/legendDescriptor";

import { NumberDescriptorBase } from "../src/settings/descriptors/numberDescriptorBase";

import { AreaComponent } from "../src/visualComponent/combo/areaComponent";
import { ComboComponent } from "../src/visualComponent/combo/comboComponent";

import {
    LineInterpolation,
    LineStyle,
    LineType,
} from "../src/settings/descriptors/line/lineTypes";

import { DataConverter } from "../src/converter/dataConverter";
import { AxisOptions } from "../src/converter/converterOptions";
import { DataRepresentationScale } from "../src/dataRepresentation/dataRepresentationScale";
import { AxisType } from "../src/settings/descriptors/axis/axisDescriptor";

import {
    DotComponent,
    IDotComponentRenderOptions,
} from "../src/visualComponent/dotComponent";

import {
    IKPIIndicatorSettings,
    KPIIndicatorsListDescriptor,
} from "../src/settings/descriptors/kpi/kpiIndicatorsListDescriptor";

import { labelMeasurementService } from "../src/services/labelMeasurementService";

import { ComboComponentAreaComponentTest } from "./comboComponentAreaComponentTest";
import { TestWrapper } from "./testWrapper";

describe("Power KPI", () => {
    describe("DOM", () => {
        it("Root element should be defined in DOM", (done) => {
            const testWrapper: TestWrapper = new TestWrapper;

            testWrapper.visualBuilder.updateRenderTimeout(
                testWrapper.dataView,
                () => {
                    Array.from(testWrapper.visualBuilder.root).forEach(
                        el => expect(document.body.contains(el)).toBeTrue
                    );

                    done();
                }
            );
        });
    });

    describe("TooltipComponent", () => {
        it("constructor shouldn't throw any exception during initialization", () => {
            expect(() => {
                return new TooltipComponent({
                    tooltipService: createTooltipService(false),
                });
            }).not.toThrow();
        });

        it("should call tooltip API", (done) => {
            const tooltipService: powerbi.extensibility.ITooltipService =
                createTooltipService(false);

            const tooltipComponent: TooltipComponent = new TooltipComponent({
                tooltipService,
            });

            const testWrapper: TestWrapper = new TestWrapper;
            const colorPalette = testWrapper.visualBuilder.visualHost.colorPalette;

            spyOn(tooltipService, "show");

            const position = { x: 100, y: 100 };

            const currentDate: Date = new Date();

            const firstPoints: IDataRepresentationPoint[] = [
                {
                    color: "red",
                    kpiIndex: 0,
                    x: currentDate,
                    y: 100,
                },
            ];

            const secondPoints: IDataRepresentationPoint[] = [
                {
                    color: "green",
                    kpiIndex: 0,
                    x: currentDate,
                    y: 200,
                },
            ];

            const thirdPoints: IDataRepresentationPoint[] = [
                {
                    color: "blue",
                    kpiIndex: 0,
                    x: currentDate,
                    y: 300,
                },
            ];

            const series = [
                {
                    current: null,
                    domain: null,
                    format: null,
                    gradientPoints: [
                        {
                            color: firstPoints[0].color,
                            points: firstPoints,
                        },
                    ],
                    hasSelection: false,
                    identity: null,
                    name: "Series1",
                    points: firstPoints,
                    selected: false,
                    y: null,
                },
                {
                    current: null,
                    domain: null,
                    format: null,
                    gradientPoints: [
                        {
                            color: secondPoints[0].color,
                            points: secondPoints,
                        },
                    ],
                    hasSelection: false,
                    identity: null,
                    name: "Series2",
                    points: secondPoints,
                    selected: false,
                    y: null,
                },
                {
                    current: null,
                    domain: null,
                    format: null,
                    gradientPoints: [
                        {
                            color: thirdPoints[0].color,
                            points: thirdPoints,
                        },
                    ],
                    hasSelection: false,
                    identity: null,
                    name: "Series3",
                    points: thirdPoints,
                    selected: false,
                    y: null,
                },
            ] as unknown as IDataRepresentationSeries[];

            const variances: number[][] = [[-100], [-200]];

            const settings: Settings = new Settings();

            const options: IEventPositionVisualComponentOptions = {
                data: {
                    series,
                    settings,
                    variances,
                    x: {
                        axisType: DataRepresentationTypeEnum.DateType,
                    } as IDataRepresentationX,
                } as IDataRepresentation,
                position,
                colorPalette
            };

            tooltipComponent.render(options);

            renderTimeout(() => {
                expect(tooltipService.show).toHaveBeenCalled();

                done();
            });
        });
    });

    describe("KPIIndicatorSettings", () => {
        let kpiIndicatorSettings: KPIIndicatorsListDescriptor;

        beforeEach(() => {
            kpiIndicatorSettings = new KPIIndicatorsListDescriptor();
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
                const actualValue: string =
                    kpiIndicatorSettings.getElementByIndex(testSet, 0);

                expect(actualValue).toBe(expectedValue);
            });

            it("should return the last element", () => {
                const expectedValue: string = testSet[testSet.length - 1];
                const actualValue: string =
                    kpiIndicatorSettings.getElementByIndex(
                        testSet,
                        testSet.length - 1
                    );

                expect(actualValue).toBe(expectedValue);
            });
        });

        describe("getCurrentKPI", () => {
            it("should return the default KPI if KPI value has not been found in the specified KPIs", () => {
                const actualKPI: IKPIIndicatorSettings =
                    kpiIndicatorSettings.getCurrentKPI(-100);

                expect(actualKPI.shape?.value.value).toBeNull();
                expect(actualKPI.color?.value.value).toBeNull();
            });

            it("should return KPI if KPI value has been found in the specified KPIs", () => {
                const actualKPI: IKPIIndicatorSettings =
                    kpiIndicatorSettings.getCurrentKPI(2);

                expect(actualKPI.shape?.value.value).toBeDefined();
                expect(actualKPI.color?.value.value).toBeDefined();
            });
        });
    });

    describe("NumberDescriptorBase", () => {
        it("defaultFormat and format must be equal to %M/%d/yyyy if type is date", () => {
            const numberDescriptorBase: NumberDescriptorBase =
                new NumberDescriptorBase();

            numberDescriptorBase.parse({
                isAutoHideBehaviorEnabled: false,
                viewport: { height: 600, width: 800 },
            });

            expect(numberDescriptorBase.defaultFormat).toBeNull;
            expect(numberDescriptorBase.format.value).toBeNull;

            numberDescriptorBase.applyDefaultFormatByType(DataRepresentationTypeEnum.DateType)

            const expectedFormat: string = "%M/%d/yyyy";
            expect(numberDescriptorBase.defaultFormat).toBe(expectedFormat);
            expect(numberDescriptorBase.format.value).toBe(expectedFormat);
        });
    });

    describe("LineComponent", () => {
        it("a single line should be rendered if all of points have the same color", () => {
            const points: IDataRepresentationPoint[] = [
                {
                    color: "green",
                    kpiIndex: 1,
                    x: new Date(2000, 1, 1),
                    y: 0,
                },
                {
                    color: "green",
                    kpiIndex: 1,
                    x: new Date(2001, 1, 1),
                    y: 100,
                },
                {
                    color: "green",
                    kpiIndex: 1,
                    x: new Date(2002, 1, 1),
                    y: 1000,
                },
                {
                    color: "green",
                    kpiIndex: 1,
                    x: new Date(2003, 1, 1),
                    y: 10000,
                },
            ];

            const element = renderLineBasedComponent(
                points,
                createLineComponent
            );

            expect(
                element.selectAll(".powerKpi_lineComponent_line").nodes().length
            ).toBe(1);
        });

        it("two lines should be rendered if points have two different colors", () => {
            const points: IDataRepresentationPoint[] = [
                {
                    color: "green",
                    kpiIndex: 1,
                    x: new Date(2000, 1, 1),
                    y: 0,
                },
                {
                    color: "green",
                    kpiIndex: 1,
                    x: new Date(2001, 1, 1),
                    y: 100,
                },
                {
                    color: "blue",
                    kpiIndex: 1,
                    x: new Date(2002, 1, 1),
                    y: 1000,
                },
                {
                    color: "blue",
                    kpiIndex: 1,
                    x: new Date(2003, 1, 1),
                    y: 10000,
                },
            ];

            const element = renderLineBasedComponent(
                points,
                createLineComponent
            );

            expect(
                element.selectAll(".powerKpi_lineComponent_line").nodes().length
            ).toBe(2);
        });

        function createLineComponent(
            options: IVisualComponentConstructorOptions
        ): LineComponent {
            return new LineComponent(options);
        }
    });

    describe("AreaComponent", () => {
        it("a single area should be rendered if all of points have the same color", () => {
            const points: IDataRepresentationPoint[] = [
                {
                    color: "green",
                    kpiIndex: 1,
                    x: new Date(2000, 1, 1),
                    y: 0,
                },
                {
                    color: "green",
                    kpiIndex: 1,
                    x: new Date(2001, 1, 1),
                    y: 100,
                },
                {
                    color: "green",
                    kpiIndex: 1,
                    x: new Date(2002, 1, 1),
                    y: 1000,
                },
                {
                    color: "green",
                    kpiIndex: 1,
                    x: new Date(2003, 1, 1),
                    y: 10000,
                },
            ];

            const element = renderLineBasedComponent(
                points,
                createAreaComponent
            );

            expect(
                element.selectAll(".powerKpi_areaComponent_area").nodes().length
            ).toBe(1);
        });

        it("two areas should be rendered if points have two different colors", () => {
            const points: IDataRepresentationPoint[] = [
                {
                    color: "green",
                    kpiIndex: 1,
                    x: new Date(2000, 1, 1),
                    y: 0,
                },
                {
                    color: "green",
                    kpiIndex: 1,
                    x: new Date(2001, 1, 1),
                    y: 100,
                },
                {
                    color: "blue",
                    kpiIndex: 1,
                    x: new Date(2002, 1, 1),
                    y: 1000,
                },
                {
                    color: "blue",
                    kpiIndex: 1,
                    x: new Date(2003, 1, 1),
                    y: 10000,
                },
            ];

            const element = renderLineBasedComponent(
                points,
                createAreaComponent
            );

            expect(
                element.selectAll(".powerKpi_areaComponent_area").nodes().length
            ).toBe(2);
        });

        function createAreaComponent(
            options: IVisualComponentConstructorOptions
        ): AreaComponent {
            return new AreaComponent(options);
        }
    });

    describe("DotComponent", () => {
        it("should render a single dot", () => {
            const viewport: powerbi.IViewport = {
                height: 500,
                width: 500,
            };

            const element = createElement(viewport);

            const point: IDataRepresentationPoint = {
                color: "green",
                kpiIndex: 0,
                x: new Date(2015, 5, 5),
                y: 100,
            };

            const testWrapper: TestWrapper = new TestWrapper;
            const colorPalette = testWrapper.visualBuilder.visualHost.colorPalette;

            const dotComponentRenderOptions: IDotComponentRenderOptions = {
                point,
                radiusFactor: 1,
                thickness: 1,
                viewport,
                x: DataRepresentationScale.create().domain(
                    [new Date(2014, 5, 5), new Date(2018, 5, 5)],
                    DataRepresentationTypeEnum.DateType
                ),
                y: DataRepresentationScale.create().domain(
                    [0, 1000],
                    DataRepresentationTypeEnum.NumberType
                ),
                colorPalette,
            };

            const dotComponent: DotComponent = new DotComponent({ element });

            dotComponent.render(dotComponentRenderOptions);

            expect(document.body.contains(element.node())).toBeTrue
        });
    });

    describe("ComboComponent", () => {
        let viewport: powerbi.IViewport;
        let element;

        beforeEach(() => {
            viewport = {
                height: 500,
                width: 500,
            };

            element = createElement(viewport);
        });

        it("should init LineComponent if line type is line", () => {
            const comboComponent: ComboComponent =
                new ComboComponentLineComponentTest({ element });
            
            const testWrapper: TestWrapper = new TestWrapper;
            const colorPalette = testWrapper.visualBuilder.visualHost.colorPalette;

            comboComponent.render({
                areaOpacity: 1,
                gradientPoints: [],
                interpolation: LineInterpolation.linear,
                lineStyle: LineStyle.solidLine,
                lineType: LineType.line,
                opacity: 1,
                thickness: 1,
                viewport,
                x: DataRepresentationScale.create(),
                y: DataRepresentationScale.create(),
                colorPalette,
            });
        });

        class ComboComponentLineComponentTest extends ComboComponent {
            protected forEach<ComponentsRenderOptions>(
                components: Array<IVisualComponent<ComponentsRenderOptions>>,
                iterator: (
                    component: IVisualComponent<ComponentsRenderOptions>,
                    index: number
                ) => void
            ): void {
                super.forEach(
                    components,
                    (
                        component: IVisualComponent<ComponentsRenderOptions>,
                        componentIndex: number
                    ) => {
                        expect(component instanceof LineComponent).toBeTruthy();

                        iterator(component, componentIndex);
                    }
                );
            }
        }

        it("should init AreaComponent if line type is area", () => {
            const comboComponent: ComboComponent =
                new ComboComponentAreaComponentTest({ element });

            const testWrapper: TestWrapper = new TestWrapper;
            const colorPalette = testWrapper.visualBuilder.visualHost.colorPalette;

            comboComponent.render({
                areaOpacity: 1,
                gradientPoints: [],
                interpolation: LineInterpolation.linear,
                lineStyle: LineStyle.solidLine,
                lineType: LineType.area,
                opacity: 1,
                thickness: 1,
                viewport,
                x: DataRepresentationScale.create(),
                y: DataRepresentationScale.create(),
                colorPalette,
            });
        });
    });

    function createElement(viewport: powerbi.IViewport) {
        return d3Select(
            testDom(viewport.height.toString(), viewport.width.toString())
        );
    }

    function renderLineBasedComponent(
        points: IDataRepresentationPoint[],
        createComponent: (
            options: IVisualComponentConstructorOptions
        ) => IVisualComponent<ILineComponentRenderOptions>
    ) {
        const viewport: powerbi.IViewport = {
            height: 500,
            width: 500,
        };

        const element = createElement(viewport);

        const lineComponent: IVisualComponent<ILineComponentRenderOptions> =
            createComponent({ element });

        const dates: Date[] = [];
        const values: number[] = [];

        const dataPointFilter: DataRepresentationPointFilter =
            new DataRepresentationPointFilter();

        const gradientPoints: IDataRepresentationPointGradientColor[] = [];

        const testWrapper: TestWrapper = new TestWrapper;
        const colorPalette = testWrapper.visualBuilder.visualHost.colorPalette;

        points.forEach((point: IDataRepresentationPoint) => {
            dates.push(point.x as Date);
            values.push(point.y);

            dataPointFilter.groupPointByColor(gradientPoints, point, false);
        });

        lineComponent.render({
            gradientPoints,
            interpolation: LineInterpolation.linear,
            lineStyle: LineStyle.solidLine,
            opacity: 1,
            thickness: 1,
            viewport,
            x: DataRepresentationScale.create().domain(
                [dates[0], dates[dates.length - 1]],
                DataRepresentationTypeEnum.DateType
            ),
            y: DataRepresentationScale.create().domain(
                [values[0], values[values.length - 1]],
                DataRepresentationTypeEnum.NumberType
            ),
            colorPalette
        });

        return element;
    }

    describe("DataRepresentationPointFilter", () => {
        let dataRepresentationPointFilter: DataRepresentationPointFilter;

        beforeEach(() => {
            dataRepresentationPointFilter = new DataRepresentationPointFilter();
        });

        describe("isPointValid", () => {
            it("should return false if point is undefined", () => {
                let testVariable;
                testVariable = undefined;
                expect(
                    dataRepresentationPointFilter.isPointValid(testVariable)
                ).toBeFalsy();
            });

            it("should return false if point.y is undefined", () => {
                const testPoint = {
                    color: undefined,
                    kpiIndex: undefined,
                    x: undefined,
                    y: undefined,
                } as unknown as IDataRepresentationPoint;
                expect(
                    dataRepresentationPointFilter.isPointValid(testPoint)
                ).toBeFalsy();
            });

            it("should return false if point.y is null", () => {
                const testPoint = {
                    color: undefined,
                    kpiIndex: undefined,
                    x: undefined,
                    y: null,
                } as unknown as IDataRepresentationPoint;
                expect(
                    dataRepresentationPointFilter.isPointValid(testPoint)
                ).toBeFalsy();
            });

            it("should return false if point.y is null", () => {
                const testPoint = {
                    color: undefined,
                    kpiIndex: undefined,
                    x: undefined,
                    y: NaN,
                } as unknown as IDataRepresentationPoint;
                expect(
                    dataRepresentationPointFilter.isPointValid(testPoint)
                ).toBeFalsy();
            });

            it("should return true if point.y is a valid number", () => {
                const testPoint = {
                    color: undefined,
                    kpiIndex: undefined,
                    x: undefined,
                    y: 123,
                } as unknown as IDataRepresentationPoint;
                expect(
                    dataRepresentationPointFilter.isPointValid(testPoint)
                ).toBeTruthy();
            });
        });

        describe("groupPointByColor", () => {
            it("should not throw any exceptions if point is undefined", () => {
                expect(() => {
                    let testVariable;
                    testVariable = undefined;
                    dataRepresentationPointFilter.groupPointByColor(
                        [],
                        testVariable,
                        false
                    );
                }).not.toThrow();
            });

            it("should not throw any exceptions if gradientPoints is undefined", () => {
                const testPoint = {
                    color: undefined,
                    kpiIndex: undefined,
                    x: undefined,
                    y: 123,
                } as unknown as IDataRepresentationPoint;
                expect(() => {
                    let testVariable;
                    testVariable = undefined;
                    dataRepresentationPointFilter.groupPointByColor(
                        testVariable,
                        testPoint,
                        false
                    );
                }).not.toThrow();
            });

            it("should return an array with an element if there're two points with the same color", () => {
                const points: IDataRepresentationPoint[] = [
                    {
                        color: "green",
                        kpiIndex: 0,
                        x: new Date(),
                        y: 123,
                    },
                    {
                        color: "green",
                        kpiIndex: 1,
                        x: new Date(),
                        y: 125,
                    },
                ];

                expect(getGradientPoints(points).length).toBe(1);
            });

            it("should return an array with two elements if there're two points with the different colors", () => {
                const points: IDataRepresentationPoint[] = [
                    {
                        color: "green",
                        kpiIndex: 0,
                        x: new Date(),
                        y: 123,
                    },
                    {
                        color: "blue",
                        kpiIndex: 1,
                        x: new Date(),
                        y: 125,
                    },
                ];

                expect(getGradientPoints(points).length).toBe(2);
            });

            it("gradient points set color and points color should be the same", () => {
                const color: string = "green";

                const points: IDataRepresentationPoint[] = [
                    {
                        color,
                        kpiIndex: 0,
                        x: new Date(),
                        y: 123,
                    },
                    {
                        color,
                        kpiIndex: 1,
                        x: new Date(),
                        y: 125,
                    },
                ];

                expect(getGradientPoints(points)[0].color).toBe(color);
            });

            it("color of first gradient points set and color of first point must be the same", () => {
                const firstColor: string = "green";
                const secondColor: string = "blue";

                const points: IDataRepresentationPoint[] = [
                    {
                        color: firstColor,
                        kpiIndex: 0,
                        x: new Date(),
                        y: 123,
                    },
                    {
                        color: secondColor,
                        kpiIndex: 1,
                        x: new Date(),
                        y: 125,
                    },
                ];

                expect(getGradientPoints(points)[0].color).toBe(firstColor);
            });

            it("color of second gradient points set and color of second point must be the same", () => {
                const firstColor: string = "green";
                const secondColor: string = "blue";

                const points: IDataRepresentationPoint[] = [
                    {
                        color: firstColor,
                        kpiIndex: 0,
                        x: new Date(),
                        y: 123,
                    },
                    {
                        color: secondColor,
                        kpiIndex: 1,
                        x: new Date(),
                        y: 125,
                    },
                ];

                expect(getGradientPoints(points)[1].color).toBe(secondColor);
            });

            function getGradientPoints(
                points: IDataRepresentationPoint[]
            ): IDataRepresentationPointGradientColor[] {
                const gradientPoints: IDataRepresentationPointGradientColor[] =
                    [];

                points.filter((point: IDataRepresentationPoint) => {
                    dataRepresentationPointFilter.groupPointByColor(
                        gradientPoints,
                        point,
                        false
                    );
                });

                return gradientPoints;
            }
        });
    });

    describe("LegendDescriptor", () => {
        let legendDescriptor: LegendDescriptor;

        beforeEach(() => {
            const viewport: powerbi.IViewport = {
                height: 0,
                width: 0,
            };
            legendDescriptor = new LegendDescriptor(viewport);
        });

        describe("getLegendMarkerShape", () => {
            it("should return LegendMarkerShape.square if style is LegendStyle.box", () => {
                legendDescriptor.style.value = legendDescriptor.getNewComplexValue(
                    LegendStyle.box, 
                    legendDescriptor.style.items
                );

                expect(legendDescriptor.getLegendMarkerShape()).toBe(
                    legendInterfaces.MarkerShape.square
                );
            });

            it("should return LegendMarkerShape.longDash if style is LegendStyle.line", () => {
                legendDescriptor.style.value = legendDescriptor.getNewComplexValue(
                    LegendStyle.line, 
                    legendDescriptor.style.items
                );

                expect(legendDescriptor.getLegendMarkerShape()).toBe(
                    legendInterfaces.MarkerShape.longDash
                );
            });

            it("should return LegendMarkerShape.longDash if style is LegendStyle.styledLine", () => {
                legendDescriptor.style.value = legendDescriptor.getNewComplexValue(
                    LegendStyle.styledLine, 
                    legendDescriptor.style.items
                );

                expect(legendDescriptor.getLegendMarkerShape()).toBe(
                    legendInterfaces.MarkerShape.longDash
                );
            });

            it("should return LegendMarkerShape.circle if style is LegendStyle.circle", () => {
                legendDescriptor.style.value = legendDescriptor.getNewComplexValue(
                    LegendStyle.circle, 
                    legendDescriptor.style.items
                );

                expect(legendDescriptor.getLegendMarkerShape()).toBe(
                    legendInterfaces.MarkerShape.circle
                );
            });
        });

        describe("getLegendLineStyle", () => {
            it("should return LegendLineStyle.solid if style is LegendStyle.line", () => {
                legendDescriptor.style.value = legendDescriptor.getNewComplexValue(
                    LegendStyle.line, 
                    legendDescriptor.style.items
                );

                let testVariable;
                testVariable = undefined;
                expect(legendDescriptor.getLegendLineStyle(testVariable)).toBe(
                    legendInterfaces.LineStyle.solid
                );
            });

            it("should return LegendLineStyle.solid if style is LegendStyle.styledLine and lineStyle is LineStyle.solidLine", () => {
                legendDescriptor.style.value = legendDescriptor.getNewComplexValue(
                    LegendStyle.styledLine, 
                    legendDescriptor.style.items
                );

                expect(
                    legendDescriptor.getLegendLineStyle(LineStyle.solidLine)
                ).toBe(legendInterfaces.LineStyle.solid);
            });

            it("should return LegendLineStyle.dashed if style is LegendStyle.styledLine and lineStyle is LineStyle.dashedLine", () => {
                legendDescriptor.style.value = legendDescriptor.getNewComplexValue(
                    LegendStyle.styledLine, 
                    legendDescriptor.style.items
                );

                expect(
                    legendDescriptor.getLegendLineStyle(LineStyle.dashedLine)
                ).toBe(legendInterfaces.LineStyle.dashed);
            });

            it("should return LegendLineStyle.dashed if style is LegendStyle.styledLine and lineStyle is LineStyle.dotDashedLine", () => {
                legendDescriptor.style.value = legendDescriptor.getNewComplexValue(
                    LegendStyle.styledLine, 
                    legendDescriptor.style.items
                );

                expect(
                    legendDescriptor.getLegendLineStyle(LineStyle.dotDashedLine)
                ).toBe(legendInterfaces.LineStyle.dashed);
            });

            it("should return LegendLineStyle.solid if style is LegendStyle.styledLine and lineStyle is undefined", () => {
                legendDescriptor.style.value = legendDescriptor.getNewComplexValue(
                    LegendStyle.styledLine, 
                    legendDescriptor.style.items
                );

                let testVariable;
                testVariable = undefined;
                expect(legendDescriptor.getLegendLineStyle(testVariable)).toBe(
                    legendInterfaces.LineStyle.solid
                );
            });
        });
    });

    describe("DataConverter", () => {
        it("dataRepresentation.x.type must be changed to DataRepresentationTypeEnum.StringType if XAxis.type is AxisType.categorical", () => {
            const testWrapper: TestWrapper = new TestWrapper;

            const dataView: powerbi.DataView = testWrapper.dataView;

            dataView.metadata.objects = {
                xAxis: {
                    type: AxisType.categorical,
                },
            };

            const dataConverter: DataConverter = new DataConverter({
                colorPalette: createColorPalette(),
                createSelectionIdBuilder,
            });

            const axisOptions: AxisOptions = {
                dataView,
                xAxisType: AxisType.categorical
            }
            dataConverter.getAxisType(axisOptions)

            const dataRepresentation: IDataRepresentation =
                dataConverter.convert({
                    dataView,
                    hasSelection: false,
                    settings: new Settings(),
                    viewport: { width: 100, height: 100 },
                });

            expect(dataRepresentation.x.axisType).toBe(
                DataRepresentationTypeEnum.StringType
            );
        });

        describe("isValueFinite", () => {
            it("should return false if value is null", () => {
                const dataConverter: DataConverter = new DataConverter({
                    colorPalette: createColorPalette(),
                    createSelectionIdBuilder,
                });

                expect(dataConverter.isValueFinite(null as any as number)).toBeFalsy();
            });

            it("should return true if value is a valid number", () => {
                const dataConverter: DataConverter = new DataConverter({
                    colorPalette: createColorPalette(),
                    createSelectionIdBuilder,
                });

                expect(dataConverter.isValueFinite(5)).toBeTruthy();
            });
        });
    });

    describe("LabelMeasurementService", () => {
        describe("getLabelWidth", () => {
            it("should return 0 if Date object is not valid", () => {
                const fakeValueFormatter = null as unknown as valueFormatter.IValueFormatter;
                expect(
                    labelMeasurementService.getLabelWidth(
                        [new Date("Power BI rocks")],
                        fakeValueFormatter,
                        8,
                        ""
                    )
                ).toBe(0);
            });
        });
    });
});
