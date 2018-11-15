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

import "jasmine-jquery";

import {
    select as d3Select,
} from "d3-selection";

import powerbi from "powerbi-visuals-api";

import {
    legendInterfaces,
} from "powerbi-visuals-utils-chartutils";

import {
    createColorPalette,
    createSelectionIdBuilder,
    createTooltipService,
    renderTimeout,
    testDom,
    VisualBuilderBase,
} from "powerbi-visuals-utils-testutils";

import { PowerKPI } from "../src/visual";
import { VisualComponent } from "../src/visualComponent/base/visualComponent";
import { VisualComponentConstructorOptions } from "../src/visualComponent/base/visualComponentConstructorOptions";

import {
    IDataRepresentationPoint,
    IDataRepresentationPointGradientColor,
} from "../src/dataRepresentation/dataRepresentationPoint";

import { IDataRepresentation } from "../src/dataRepresentation/dataRepresentation";
import { IDataRepresentationX } from "../src/dataRepresentation/dataRepresentationAxis";
import { DataRepresentationPointFilter } from "../src/dataRepresentation/dataRepresentationPointFilter";
import { IDataRepresentationSeries } from "../src/dataRepresentation/dataRepresentationSeries";
import { DataRepresentationTypeEnum } from "../src/dataRepresentation/dataRepresentationType";
import { SeriesSettings } from "../src/settings/seriesSettings";
import { Settings } from "../src/settings/settings";
import { EventPositionVisualComponentOptions } from "../src/visualComponent/eventPositionVisualComponentOptions";
import { TooltipComponent } from "../src/visualComponent/tooltipComponent";

import {
    LineComponent,
    LineComponentRenderOptions,
} from "../src/visualComponent/combo/lineComponent";

import {
    LegendDescriptor,
    LegendStyle,

} from "../src/settings/descriptors/legendDescriptor";

import { AreaComponent } from "../src/visualComponent/combo/areaComponent";
import { ComboComponent } from "../src/visualComponent/combo/comboComponent";

import {
    LineInterpolation,
    LineStyle,
    LineType,
} from "../src/settings/descriptors/lineDescriptor";

import { DataConverter } from "../src/converter/dataConverter";
import { DataRepresentationScale } from "../src/dataRepresentation/dataRepresentationScale";
import { AxisType } from "../src/settings/descriptors/axis/axisDescriptor";

import {
    DotComponent,
    DotComponentRenderOptions,
} from "../src/visualComponent/dotComponent";

import {
    IKPIIndicatorSettings,
    KPIIndicatorDescriptor,
} from "../src/settings/descriptors/kpi/kpiIndicatorDescriptor";

import { DataBuilder } from "./dataBuilder";

describe("Power KPI", () => {
    // describe("capabilities", () => {
    //     it("the capabilities object should be defined", () => {
    //         expect(require("../capabilities.json")).toBeDefined();
    //     });
    // });

    describe("DOM", () => {
        it("Root element should be defined in DOM", (done) => {
            const testWrapper: TestWrapper = TestWrapper.create();

            testWrapper.visualBuilder.updateRenderTimeout(testWrapper.dataView, () => {
                expect(testWrapper.visualBuilder.$root).toBeInDOM();

                done();
            });
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
            const tooltipService: powerbi.extensibility.ITooltipService = createTooltipService(false);

            const tooltipComponent: TooltipComponent = new TooltipComponent({
                tooltipService,
            });

            spyOn(tooltipService, "show");

            const position = { x: 100, y: 100 };

            const currentDate: Date = new Date();

            const seriesSettings: SeriesSettings = SeriesSettings.getDefault() as SeriesSettings;

            const firstPoints: IDataRepresentationPoint[] = [{
                x: currentDate,
                y: 100,
                kpiIndex: 0,
                color: "red",
            }];

            const secondPoints: IDataRepresentationPoint[] = [{
                x: currentDate,
                y: 200,
                kpiIndex: 0,
                color: "green",
            }];

            const thirdPoints: IDataRepresentationPoint[] = [{
                x: currentDate,
                y: 300,
                kpiIndex: 0,
                color: "blue",
            }];

            const series: IDataRepresentationSeries[] = [
                {
                    format: null,
                    current: null,
                    name: "Series1",
                    identity: null,
                    settings: seriesSettings,
                    points: firstPoints,
                    gradientPoints: [{
                        points: firstPoints,
                        color: firstPoints[0].color,
                    }],
                    domain: null,
                    y: null,
                    hasSelection: false,
                    selected: false,
                },
                {
                    format: null,
                    current: null,
                    name: "Series2",
                    identity: null,
                    settings: seriesSettings,
                    points: secondPoints,
                    gradientPoints: [{
                        points: secondPoints,
                        color: secondPoints[0].color,
                    }],
                    domain: null,
                    y: null,
                    hasSelection: false,
                    selected: false,
                },
                {
                    format: null,
                    current: null,
                    name: "Series3",
                    identity: null,
                    settings: seriesSettings,
                    points: thirdPoints,
                    gradientPoints: [{
                        points: thirdPoints,
                        color: thirdPoints[0].color,
                    }],
                    domain: null,
                    y: null,
                    hasSelection: false,
                    selected: false,
                },
            ];

            const variances: number[][] = [
                [-100],
                [-200],
            ];

            const settings: Settings = Settings.getDefault() as Settings;

            const options: EventPositionVisualComponentOptions = {
                position,
                data: {
                    series,
                    variances,
                    settings,
                    x: {
                        axisType: DataRepresentationTypeEnum.DateType,
                    } as IDataRepresentationX,
                } as IDataRepresentation,
            };

            tooltipComponent.render(options);

            renderTimeout(() => {
                expect(tooltipService.show).toHaveBeenCalled();

                done();
            });
        });
    });

    describe("KPIIndicatorSettings", () => {
        let kpiIndicatorSettings: KPIIndicatorDescriptor;

        beforeEach(() => {
            kpiIndicatorSettings = new KPIIndicatorDescriptor();
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

    describe("LineComponent", () => {
        it("a single line should be rendered if all of points have the same color", () => {
            const points: IDataRepresentationPoint[] = [
                {
                    x: new Date(2000, 1, 1),
                    y: 0,
                    kpiIndex: undefined,
                    color: "green",
                },
                {
                    x: new Date(2001, 1, 1),
                    y: 100,
                    kpiIndex: undefined,
                    color: "green",
                },
                {
                    x: new Date(2002, 1, 1),
                    y: 1000,
                    kpiIndex: undefined,
                    color: "green",
                },
                {
                    x: new Date(2003, 1, 1),
                    y: 10000,
                    kpiIndex: undefined,
                    color: "green",
                },
            ];

            const element = renderLineBasedComponent(points, createLineComponent);

            expect(element.selectAll(".powerKpi_lineComponent_line").nodes().length).toBe(1);
        });

        it("two lines should be rendered if points have two different colors", () => {
            const points: IDataRepresentationPoint[] = [
                {
                    x: new Date(2000, 1, 1),
                    y: 0,
                    kpiIndex: undefined,
                    color: "green",
                },
                {
                    x: new Date(2001, 1, 1),
                    y: 100,
                    kpiIndex: undefined,
                    color: "green",
                },
                {
                    x: new Date(2002, 1, 1),
                    y: 1000,
                    kpiIndex: undefined,
                    color: "blue",
                },
                {
                    x: new Date(2003, 1, 1),
                    y: 10000,
                    kpiIndex: undefined,
                    color: "blue",
                },
            ];

            const element = renderLineBasedComponent(points, createLineComponent);

            expect(element.selectAll(".powerKpi_lineComponent_line").nodes().length).toBe(2);
        });

        function createLineComponent(options: VisualComponentConstructorOptions): LineComponent {
            return new LineComponent(options);
        }
    });

    describe("AreaComponent", () => {
        it("a single area should be rendered if all of points have the same color", () => {
            const points: IDataRepresentationPoint[] = [
                {
                    x: new Date(2000, 1, 1),
                    y: 0,
                    kpiIndex: undefined,
                    color: "green",
                },
                {
                    x: new Date(2001, 1, 1),
                    y: 100,
                    kpiIndex: undefined,
                    color: "green",
                },
                {
                    x: new Date(2002, 1, 1),
                    y: 1000,
                    kpiIndex: undefined,
                    color: "green",
                },
                {
                    x: new Date(2003, 1, 1),
                    y: 10000,
                    kpiIndex: undefined,
                    color: "green",
                },
            ];

            const element = renderLineBasedComponent(points, createAreaComponent);

            expect(element.selectAll(".powerKpi_areaComponent_area").nodes().length).toBe(1);
        });

        it("two areas should be rendered if points have two different colors", () => {
            const points: IDataRepresentationPoint[] = [
                {
                    x: new Date(2000, 1, 1),
                    y: 0,
                    kpiIndex: undefined,
                    color: "green",
                },
                {
                    x: new Date(2001, 1, 1),
                    y: 100,
                    kpiIndex: undefined,
                    color: "green",
                },
                {
                    x: new Date(2002, 1, 1),
                    y: 1000,
                    kpiIndex: undefined,
                    color: "blue",
                },
                {
                    x: new Date(2003, 1, 1),
                    y: 10000,
                    kpiIndex: undefined,
                    color: "blue",
                },
            ];

            const element = renderLineBasedComponent(points, createAreaComponent);

            expect(element.selectAll(".powerKpi_areaComponent_area").nodes().length).toBe(2);
        });

        function createAreaComponent(options: VisualComponentConstructorOptions): AreaComponent {
            return new AreaComponent(options);
        }
    });

    describe("DotComponent", () => {
        it("should render a single dot", () => {
            const viewport: powerbi.IViewport = {
                width: 500,
                height: 500,
            };

            const element = createElement(viewport);

            const point: IDataRepresentationPoint = {
                x: new Date(2015, 5, 5),
                y: 100,
                kpiIndex: 0,
                color: "green",
            };

            const dotComponentRenderOptions: DotComponentRenderOptions = {
                point,
                viewport,
                thickness: 1,
                radiusFactor: 1,
                x: DataRepresentationScale
                    .create()
                    .domain(
                        [new Date(2014, 5, 5), new Date(2018, 5, 5)],
                        DataRepresentationTypeEnum.DateType,
                    ),
                y: DataRepresentationScale
                    .create()
                    .domain(
                        [0, 1000],
                        DataRepresentationTypeEnum.NumberType,
                    ),
            };

            const dotComponent: DotComponent = new DotComponent({ element });

            dotComponent.render(dotComponentRenderOptions);

            expect($(element.node())).toBeInDOM();
        });
    });

    describe("ComboComponent", () => {
        let viewport: powerbi.IViewport;
        let element;

        beforeEach(() => {
            viewport = {
                width: 500,
                height: 500,
            };

            element = createElement(viewport);
        });

        it("should init LineComponent if line type is line", () => {
            const comboComponent: ComboComponent = new ComboComponentLineComponentTest({ element });

            comboComponent.render({
                viewport,
                lineType: LineType.line,
                areaOpacity: 1,
                gradientPoints: [],
                interpolation: LineInterpolation.linear,
                lineStyle: LineStyle.solidLine,
                opacity: 1,
                thickness: 1,
                x: DataRepresentationScale.create(),
                y: DataRepresentationScale.create(),
            });
        });

        class ComboComponentLineComponentTest extends ComboComponent {
            protected forEach<ComponentsRenderOptions>(
                components: Array<VisualComponent<ComponentsRenderOptions>>,
                iterator: (
                    component: VisualComponent<ComponentsRenderOptions>,
                    index: number,
                ) => void,
            ): void {
                super.forEach(
                    components,
                    (component: VisualComponent<ComponentsRenderOptions>, componentIndex: number) => {
                        expect(component instanceof LineComponent).toBeTruthy();

                        iterator(component, componentIndex);
                    });
            }
        }

        it("should init AreaComponent if line type is area", () => {
            const comboComponent: ComboComponent = new ComboComponentAreaComponentTest({ element });

            comboComponent.render({
                viewport,
                lineType: LineType.area,
                areaOpacity: 1,
                gradientPoints: [],
                interpolation: LineInterpolation.linear,
                lineStyle: LineStyle.solidLine,
                opacity: 1,
                thickness: 1,
                x: DataRepresentationScale.create(),
                y: DataRepresentationScale.create(),
            });
        });

        class ComboComponentAreaComponentTest extends ComboComponent {
            protected forEach<ComponentsRenderOptions>(
                components: Array<VisualComponent<ComponentsRenderOptions>>,
                iterator: (
                    component: VisualComponent<ComponentsRenderOptions>,
                    index: number,
                ) => void,
            ): void {
                super.forEach(
                    components,
                    (component: VisualComponent<ComponentsRenderOptions>, componentIndex: number) => {
                        expect(component instanceof AreaComponent).toBeTruthy();

                        iterator(component, componentIndex);
                    });
            }
        }
    });

    function createElement(viewport: powerbi.IViewport) {
        return d3Select(testDom(
            viewport.height.toString(),
            viewport.width.toString(),
        ).get(0));
    }

    function renderLineBasedComponent(
        points: IDataRepresentationPoint[],
        createComponent: (options: VisualComponentConstructorOptions) => VisualComponent<LineComponentRenderOptions>,
    ) {
        const viewport: powerbi.IViewport = {
            width: 500,
            height: 500,
        };

        const element = createElement(viewport);

        const lineComponent: VisualComponent<LineComponentRenderOptions> = createComponent({ element });

        const dates: Date[] = [];
        const values: number[] = [];

        const dataPointFilter: DataRepresentationPointFilter = new DataRepresentationPointFilter();

        const gradientPoints: IDataRepresentationPointGradientColor[] = [];

        points.forEach((point: IDataRepresentationPoint) => {
            dates.push(point.x as Date);
            values.push(point.y);

            dataPointFilter.groupPointByColor(gradientPoints, point, false);
        });

        lineComponent.render({
            viewport,
            opacity: 1,
            thickness: 1,
            lineStyle: LineStyle.solidLine,
            gradientPoints,
            interpolation: LineInterpolation.linear,
            x: DataRepresentationScale
                .create()
                .domain([dates[0], dates[dates.length - 1]], DataRepresentationTypeEnum.DateType),
            y: DataRepresentationScale
                .create()
                .domain([values[0], values[values.length - 1]], DataRepresentationTypeEnum.NumberType),
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
                expect(dataRepresentationPointFilter.isPointValid(undefined)).toBeFalsy();
            });

            it("should return false if point is null", () => {
                expect(dataRepresentationPointFilter.isPointValid(null)).toBeFalsy();
            });

            it("should return false if point.y is undefined", () => {
                expect(dataRepresentationPointFilter.isPointValid({
                    x: undefined,
                    y: undefined,
                    color: undefined,
                    kpiIndex: undefined,
                })).toBeFalsy();
            });

            it("should return false if point.y is null", () => {
                expect(dataRepresentationPointFilter.isPointValid({
                    x: undefined,
                    y: null,
                    color: undefined,
                    kpiIndex: undefined,
                })).toBeFalsy();
            });

            it("should return false if point.y is null", () => {
                expect(dataRepresentationPointFilter.isPointValid({
                    x: undefined,
                    y: NaN,
                    color: undefined,
                    kpiIndex: undefined,
                })).toBeFalsy();
            });

            it("should return true if point.y is a valid number", () => {
                expect(dataRepresentationPointFilter.isPointValid({
                    x: undefined,
                    y: 123,
                    color: undefined,
                    kpiIndex: undefined,
                })).toBeTruthy();
            });
        });

        describe("groupPointByColor", () => {
            it("should not throw any exceptions if point is undefined", () => {
                expect(() => {
                    dataRepresentationPointFilter.groupPointByColor([], undefined, false);
                }).not.toThrow();
            });

            it("should not throw any exceptions if gradientPoints is undefined", () => {
                expect(() => {
                    dataRepresentationPointFilter.groupPointByColor(
                        undefined,
                        {
                            x: undefined,
                            y: 123,
                            kpiIndex: undefined,
                            color: undefined,
                        },
                        false,
                    );
                }).not.toThrow();
            });

            it("should return an array with an element if there're two points with the same color", () => {
                const points: IDataRepresentationPoint[] = [
                    {
                        x: new Date(),
                        y: 123,
                        kpiIndex: 0,
                        color: "green",
                    },
                    {
                        x: new Date(),
                        y: 125,
                        kpiIndex: 1,
                        color: "green",
                    },
                ];

                expect(getGradientPoints(points).length).toBe(1);
            });

            it("should return an array with two elements if there're two points with the different colors", () => {
                const points: IDataRepresentationPoint[] = [
                    {
                        x: new Date(),
                        y: 123,
                        kpiIndex: 0,
                        color: "green",
                    },
                    {
                        x: new Date(),
                        y: 125,
                        kpiIndex: 1,
                        color: "blue",
                    },
                ];

                expect(getGradientPoints(points).length).toBe(2);
            });

            it("gradient points set color and points color should be the same", () => {
                const color: string = "green";

                const points: IDataRepresentationPoint[] = [
                    {
                        color,
                        x: new Date(),
                        y: 123,
                        kpiIndex: 0,
                    },
                    {
                        color,
                        x: new Date(),
                        y: 125,
                        kpiIndex: 1,
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
                        x: new Date(),
                        y: 123,
                        kpiIndex: 0,
                    },
                    {
                        color: secondColor,
                        x: new Date(),
                        y: 125,
                        kpiIndex: 1,
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
                        x: new Date(),
                        y: 123,
                        kpiIndex: 0,
                    },
                    {
                        color: secondColor,
                        x: new Date(),
                        y: 125,
                        kpiIndex: 1,
                    },
                ];

                expect(getGradientPoints(points)[1].color).toBe(secondColor);
            });

            function getGradientPoints(points: IDataRepresentationPoint[]): IDataRepresentationPointGradientColor[] {
                const gradientPoints: IDataRepresentationPointGradientColor[] = [];

                points.filter((point: IDataRepresentationPoint) => {
                    dataRepresentationPointFilter.groupPointByColor(gradientPoints, point, false);
                });

                return gradientPoints;
            }
        });
    });

    describe("LegendDescriptor", () => {
        let legendDescriptor: LegendDescriptor;

        beforeEach(() => {
            legendDescriptor = new LegendDescriptor();
        });

        describe("getLegendMarkerShape", () => {
            it("should return LegendMarkerShape.square if style is LegendStyle.box", () => {
                legendDescriptor.style = LegendStyle.box;

                expect(legendDescriptor.getLegendMarkerShape()).toBe(legendInterfaces.MarkerShape.square);
            });

            it("should return LegendMarkerShape.longDash if style is LegendStyle.line", () => {
                legendDescriptor.style = LegendStyle.line;

                expect(legendDescriptor.getLegendMarkerShape()).toBe(legendInterfaces.MarkerShape.longDash);
            });

            it("should return LegendMarkerShape.longDash if style is LegendStyle.styledLine", () => {
                legendDescriptor.style = LegendStyle.styledLine;

                expect(legendDescriptor.getLegendMarkerShape()).toBe(legendInterfaces.MarkerShape.longDash);
            });

            it("should return LegendMarkerShape.circle if style is LegendStyle.circle", () => {
                legendDescriptor.style = LegendStyle.circle;

                expect(legendDescriptor.getLegendMarkerShape()).toBe(legendInterfaces.MarkerShape.circle);
            });
        });

        describe("getLegendLineStyle", () => {
            it("should return LegendLineStyle.solid if style is LegendStyle.line", () => {
                legendDescriptor.style = LegendStyle.line;

                expect(legendDescriptor.getLegendLineStyle(undefined)).toBe(legendInterfaces.LineStyle.solid);
            });

            it("should return LegendLineStyle.solid if style is LegendStyle.styledLine and lineStyle is LineStyle.solidLine", () => {
                legendDescriptor.style = LegendStyle.styledLine;

                expect(legendDescriptor.getLegendLineStyle(LineStyle.solidLine)).toBe(legendInterfaces.LineStyle.solid);
            });

            it("should return LegendLineStyle.dashed if style is LegendStyle.styledLine and lineStyle is LineStyle.dashedLine", () => {
                legendDescriptor.style = LegendStyle.styledLine;

                expect(legendDescriptor.getLegendLineStyle(LineStyle.dashedLine)).toBe(legendInterfaces.LineStyle.dashed);
            });

            it("should return LegendLineStyle.dashed if style is LegendStyle.styledLine and lineStyle is LineStyle.dotDashedLine", () => {
                legendDescriptor.style = LegendStyle.styledLine;

                expect(legendDescriptor.getLegendLineStyle(LineStyle.dotDashedLine)).toBe(legendInterfaces.LineStyle.dashed);
            });

            it("should return LegendLineStyle.solid if style is LegendStyle.styledLine and lineStyle is undefined", () => {
                legendDescriptor.style = LegendStyle.styledLine;

                expect(legendDescriptor.getLegendLineStyle(undefined)).toBe(legendInterfaces.LineStyle.solid);
            });
        });
    });

    describe("DataConverter", () => {
        it("dataRepresentation.x.type must be changed to DataRepresentationTypeEnum.StringType if XAxis.type is AxisType.categorical", () => {
            const testWrapper: TestWrapper = TestWrapper.create();

            const dataView: powerbi.DataView = testWrapper.dataView;

            dataView.metadata.objects = {
                xAxis: {
                    type: AxisType.categorical,
                },
            };

            const dataConverter: DataConverter = new DataConverter({
                createSelectionIdBuilder,
                colorPalette: createColorPalette(),
            });

            const dataRepresentation: IDataRepresentation = dataConverter.convert({
                dataView,
                viewport: { width: 100, height: 100 },
                hasSelection: false,
            });

            expect(dataRepresentation.x.axisType).toBe(DataRepresentationTypeEnum.StringType);
        });

        describe("isValueFinite", () => {
            it("should return false if value is null", () => {
                const dataConverter: DataConverter = new DataConverter({
                    createSelectionIdBuilder,
                    colorPalette: createColorPalette(),
                });

                expect(dataConverter.isValueFinite(null)).toBeFalsy();
            });

            it("should return true if value is a valid number", () => {
                const dataConverter: DataConverter = new DataConverter({
                    createSelectionIdBuilder,
                    colorPalette: createColorPalette(),
                });

                expect(dataConverter.isValueFinite(5)).toBeTruthy();
            });
        });
    });
});

class TestWrapper {

    public static create(): TestWrapper {
        return new TestWrapper();
    }
    public dataView: powerbi.DataView;
    public dataViewBuilder: DataBuilder;
    public visualBuilder: PowerKPIBuilder;

    constructor(width: number = 1024, height: number = 768) {
        this.visualBuilder = new PowerKPIBuilder(width, height);
        this.dataViewBuilder = new DataBuilder();

        this.dataView = this.dataViewBuilder.getDataView();
    }
}

class PowerKPIBuilder extends VisualBuilderBase<PowerKPI> {
    constructor(width: number, height: number) {
        super(width, height);
    }

    protected build(): PowerKPI {
        return new PowerKPI({
            element: this.element.get(0),
            host: this.visualHost,
        });
    }

    public get instance(): PowerKPI {
        return this.visual;
    }

    public get $root(): JQuery {
        return this.element.children(".powerKpi_powerKPI");
    }
}
