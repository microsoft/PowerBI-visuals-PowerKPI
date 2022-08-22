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
import { pixelConverter } from "powerbi-visuals-utils-typeutils";

import { IMargin } from "powerbi-visuals-utils-svgutils";

import { BaseContainerComponent } from "./base/baseContainerComponent";
import { IVisualComponent } from "./base/visualComponent";
import { IVisualComponentConstructorOptions } from "./base/visualComponentConstructorOptions";

import {
    IVisualComponentRenderOptions,
    IVisualComponentRenderOptionsBase,
} from "./base/visualComponentRenderOptions";

import { DataRepresentationAxisValueType } from "../dataRepresentation/dataRepresentationAxisValueType";
import { IDataRepresentationPoint } from "../dataRepresentation/dataRepresentationPoint";
import { DataRepresentationScale } from "../dataRepresentation/dataRepresentationScale";
import { IDataRepresentationSeries } from "../dataRepresentation/dataRepresentationSeries";
import { EventName } from "../event/eventName";
import { IAxisReferenceLineBaseComponentRenderOptions } from "./axes/referenceLine/axisReferenceLineBaseComponent";
import { XAxisReferenceLineComponent } from "./axes/referenceLine/xAxisReferenceLineComponent";
import { YAxisReferenceLineComponent } from "./axes/referenceLine/yAxisReferenceLineComponent";
import { ChartComponent } from "./chartComponent";
import { DotsComponent } from "./dotsComponent";
import { IEventPositionVisualComponentOptions } from "./eventPositionVisualComponentOptions";
import { LabelsComponent } from "./labelsComponent";
import { TooltipComponent } from "./tooltipComponent";
import { VerticalLineComponent } from "./verticalLineComponent";

export interface ISvgComponentRenderOptions extends IVisualComponentRenderOptions {
    xTicks: DataRepresentationAxisValueType[];
    yTicks: DataRepresentationAxisValueType[];
    secondaryYTicks: DataRepresentationAxisValueType[];
    additionalMargin: IMargin;
}

export class SvgComponent extends BaseContainerComponent<
    IVisualComponentConstructorOptions,
    ISvgComponentRenderOptions,
    IAxisReferenceLineBaseComponentRenderOptions | IVisualComponentRenderOptionsBase
    > {
    private className: string = "svgComponent";

    private xAxisReferenceLineComponent: IVisualComponent<IAxisReferenceLineBaseComponentRenderOptions>;
    private yAxisReferenceLineComponent: IVisualComponent<IAxisReferenceLineBaseComponentRenderOptions>;
    private secondaryYAxisReferenceLineComponent: IVisualComponent<IAxisReferenceLineBaseComponentRenderOptions>;

    private chartComponent: IVisualComponent<IVisualComponentRenderOptions>;
    private labelsComponent: IVisualComponent<IVisualComponentRenderOptions>;

    private dynamicComponents: Array<IVisualComponent<IVisualComponentRenderOptions | IEventPositionVisualComponentOptions>> = [];

    private positions: number[];

    constructor(options: IVisualComponentConstructorOptions) {
        super();

        this.initElement(
            options.element,
            this.className,
            "svg",
        );

        this.constructorOptions = {
            ...options,
            element: this.element,
        };

        this.xAxisReferenceLineComponent = new XAxisReferenceLineComponent(this.constructorOptions);
        this.yAxisReferenceLineComponent = new YAxisReferenceLineComponent(this.constructorOptions);
        this.secondaryYAxisReferenceLineComponent = new YAxisReferenceLineComponent(this.constructorOptions);

        this.chartComponent = new ChartComponent(this.constructorOptions);
        this.labelsComponent = new LabelsComponent(this.constructorOptions);

        this.components = [
            this.xAxisReferenceLineComponent,
            this.yAxisReferenceLineComponent,
            this.secondaryYAxisReferenceLineComponent,
            this.chartComponent,
            this.labelsComponent,
        ];

        this.dynamicComponents = [
            new VerticalLineComponent(this.constructorOptions),
            new DotsComponent(this.constructorOptions),
            new TooltipComponent({
                ...this.constructorOptions,
                tooltipService: this.constructorOptions.tooltipService,
            }),
        ];

        this.bindEvents();

        if (this.constructorOptions.eventDispatcher) {
            this.constructorOptions.eventDispatcher.on(
                EventName.onClick,
                this.clickComponentHandler.bind(this),
            );
        }
    }

    public render(options: ISvgComponentRenderOptions): void {
        const {
            data: {
                groups: [firstGroup, secondGroup],
                settings,
                viewport,
                margin,
                x: { values, scale },
            },
            additionalMargin,
        } = options;

        const reducedViewport: powerbi.IViewport = {
            height: Math.max(0, viewport.height - margin.top - margin.bottom),
            width: Math.max(0, viewport.width - margin.left - margin.right),
        };

        this.updateViewport(reducedViewport);

        this.updateMargin(margin, additionalMargin);

        this.positions = this.getPositions(reducedViewport, values, scale);

        this.renderOptions = {
            ...options,
            data: {
                ...options.data,
                viewport: reducedViewport,
            },
        };

        this.xAxisReferenceLineComponent.render({
            scale,
            settings: settings.referenceLineOfXAxis,
            ticks: options.xTicks,
            viewport: reducedViewport,
        });

        this.yAxisReferenceLineComponent.render({
            scale: firstGroup && firstGroup.y && firstGroup.y.scale,
            settings: settings.referenceLineOfYAxis,
            ticks: options.yTicks,
            viewport: reducedViewport,
        });

        this.secondaryYAxisReferenceLineComponent.render({
            scale: secondGroup && secondGroup.y && secondGroup.y.scale,
            settings: settings.secondaryReferenceLineOfYAxis,
            ticks: options.secondaryYTicks,
            viewport: reducedViewport,
        });

        this.chartComponent.render(this.renderOptions);
        this.labelsComponent.render(this.renderOptions);
    }

    public clear(): void {
        super.clear(this.dynamicComponents);
        super.clear();
    }

    public destroy(): void {
        super.destroy(this.dynamicComponents);
        super.destroy();

        this.xAxisReferenceLineComponent = null;
        this.yAxisReferenceLineComponent = null;
        this.secondaryYAxisReferenceLineComponent = null;
        this.chartComponent = null;
        this.labelsComponent = null;
    }

    private bindEvents(): void {
        this.element.on("mousemove", () => this.pointerMoveEvent(this.renderOptions));
        this.element.on("touchmove", () => this.pointerMoveEvent(this.renderOptions));

        this.element.on("mouseleave", () => this.pointerLeaveHandler());
        this.element.on("touchend", () => this.pointerLeaveHandler());

        this.element.on("click", (this.clickHandler.bind(this)));
    }

    private updateMargin(margin: IMargin, additionalMargin: IMargin): void {
        this.element
            .style("padding-top", pixelConverter.toString(margin.top + additionalMargin.top))
            .style("padding-right", pixelConverter.toString(margin.right + additionalMargin.right))
            .style("padding-bottom", pixelConverter.toString(margin.bottom + additionalMargin.bottom))
            .style("padding-left", pixelConverter.toString(margin.left + additionalMargin.left));
    }

    private getPositions(
        viewport: powerbi.IViewport,
        values: DataRepresentationAxisValueType[],
        xScale: DataRepresentationScale,
    ): number[] {
        const scale: DataRepresentationScale = xScale
            .copy()
            .range([0, viewport.width]);

        return values.map((value: DataRepresentationAxisValueType) => {
            return scale.scale(value);
        });
    }

    private pointerMoveEvent(options: ISvgComponentRenderOptions): void {
        const { data: { settings, variance } } = options;

        const isSecondTooltipShown: boolean = variance
            && !isNaN(variance[1])
            && settings.secondTooltipVariance.showElement();

        if (!settings.tooltipLabel.showElement()
            && !settings.tooltipValues.showElement()
            && !settings.tooltipVariance.showElement()
            && !isSecondTooltipShown
        ) {
            this.pointerLeaveHandler();

            return;
        }

        const event: MouseEvent | TouchEvent = require("d3-selection").event;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        let offsetX: number = Number.MAX_VALUE;
        let originalXPosition: number = Number.MAX_VALUE;
        let originalYPosition: number = Number.MAX_VALUE;

        switch (event.type) {
            case "mousemove": {
                originalXPosition = (event as MouseEvent).pageX;
                originalYPosition = (event as MouseEvent).pageY;

                offsetX = (event as MouseEvent).offsetX;

                break;
            }
            case "touchmove": {
                const touch: TouchEvent = event as TouchEvent;

                if (touch && touch.touches && touch.touches[0]) {
                    originalXPosition = touch.touches[0].pageX;
                    originalYPosition = touch.touches[0].pageY;

                    const element: SVGElement = this.element.node() as SVGElement;

                    const xScaleViewport: number = this.getXScale(element);

                    offsetX = (originalXPosition - element.getBoundingClientRect().left) / xScaleViewport;
                }

                break;
            }
        }

        this.renderDynamicComponentByPosition(
            offsetX,
            originalXPosition,
            originalYPosition,
            options,
        );
    }

    // TODO: Looks like this method should be refactored in order to make it more understandable
    private renderDynamicComponentByPosition(
        offsetX: number,
        xPosition: number,
        yPosition: number,
        baseOptions: ISvgComponentRenderOptions,
    ) {
        const {
            data: {
                series,
                margin,
                settings: { yAxis },
            },
            additionalMargin,
        } = baseOptions;

        const amountOfPoints: number = series
            && series[0]
            && series[0].points
            && series[0].points.length
            || 0;

        let dataPointIndex: number = this.getIndexByPosition(offsetX - margin.left - additionalMargin.left);

        dataPointIndex = Math.min(Math.max(0, dataPointIndex), amountOfPoints);

        const dataSeries: IDataRepresentationSeries[] = [];

        baseOptions.data.series.forEach((seriesItem: IDataRepresentationSeries) => {
            const point: IDataRepresentationPoint = seriesItem.points[dataPointIndex];

            if (point) {
                const seriesToReturn: IDataRepresentationSeries = {
                    ...seriesItem,
                    points: [point],
                };

                dataSeries.push(seriesToReturn);
            }
        });

        const options: IEventPositionVisualComponentOptions = {
            data: {
                ...baseOptions.data,
                series: dataSeries,
            },
            position: { x: xPosition, y: yPosition },
        };

        if (options.data.variances.length) {
            options.data.variances = options.data.variances.map((varianceGroup: number[]) => {
                const variance: number = varianceGroup[dataPointIndex];

                if (!isNaN(variance) && variance !== null) {
                    return [variance];
                }

                return [];
            });
        }

        this.forEach(
            this.dynamicComponents,
            (component: IVisualComponent<IVisualComponentRenderOptions>) => {
                component.render(options);

                if (component.show) {
                    component.show();
                }
            },
        );
    }

    private getXScale(container: SVGElement): number {
        const rect: ClientRect = container.getBoundingClientRect();
        const clientWidth: number = container.clientWidth || 1;

        return rect.width / clientWidth;
    }

    /**
     * This method linear search
     *
     * This method is a small hack. Please improve if you know how to improve it
     *
     * @param position {number} Current pointer position
     */
    private getIndexByPosition(position: number): number {
        if (!this.positions) {
            return NaN;
        }

        const length: number = this.positions.length;

        for (let index: number = 0; index < length; index++) {
            const condition: boolean =
                (index === 0
                    && position <= this.positions[index])
                || (index === 0
                    && this.positions[index + 1] !== undefined
                    && position <= this.positions[index] + (this.positions[index + 1] - this.positions[index]) / 2)
                || (index === length - 1
                    && position >= this.positions[index])
                || (index === length - 1
                    && this.positions[index - 1] !== undefined
                    && position >= this.positions[index] - (this.positions[index] - this.positions[index - 1]) / 2)
                || (this.positions[index - 1] !== undefined
                    && this.positions[index] !== undefined
                    && this.positions[index + 1] !== undefined
                    && (position >= (this.positions[index] - Math.abs(this.positions[index] - this.positions[index - 1]) / 2))
                    && (position <= (this.positions[index] + Math.abs(this.positions[index + 1] - this.positions[index]) / 2)));

            if (condition) {
                return index;
            }
        }

        return NaN;
    }

    private pointerLeaveHandler(): void {
        this.forEach(
            this.dynamicComponents,
            (component: IVisualComponent<any>) => {
                component.hide();
            },
        );
    }

    private clickComponentHandler(
        component: IVisualComponent<IVisualComponentRenderOptionsBase>,
        event: Event,
    ): void {
        if (!this.constructorOptions || !this.constructorOptions.eventDispatcher) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        if (this === component) {
            this.constructorOptions.eventDispatcher.call(EventName.onClearSelection);

            return;
        }

        const renderOptions: IVisualComponentRenderOptionsBase = component
            && component.getRenderOptions
            && component.getRenderOptions();

        const series: IDataRepresentationSeries = renderOptions && renderOptions.series;

        if (!series) {
            return;
        }

        this.constructorOptions.eventDispatcher.call(
            EventName.onSelect,
            undefined,
            event,
            series,
        );
    }
}
