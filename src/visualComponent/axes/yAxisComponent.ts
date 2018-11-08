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

import {
    IMargin,
    manipulation as svgManipulation
} from "powerbi-visuals-utils-svgutils";

import { pixelConverter } from "powerbi-visuals-utils-typeutils";
import {
    textMeasurementService,
    valueFormatter,
} from "powerbi-visuals-utils-formattingutils";

import { DataRepresentationAxis } from "../../dataRepresentation/dataRepresentationAxis";
import { YAxisDescriptor } from "../../settings/descriptors/axis/axisDescriptor";
import { VisualComponentConstructorOptions } from "../base/visualComponentConstructorOptions";
import { VisualComponentViewport } from "../base/visualComponent";

import { PowerKPIAxisHelper } from "./helpers/axisHelper";

import {
    AxisComponent,
    AxisBaseComponent
} from "./axisBaseComponent";

export interface YAxisComponentRenderOptions {
    settings: YAxisDescriptor;
    axis: DataRepresentationAxis;
    viewport: powerbi.IViewport;
    margin: IMargin;
}

export class YAxisComponent
    extends AxisBaseComponent<VisualComponentConstructorOptions, YAxisComponentRenderOptions>
    implements AxisComponent<YAxisComponentRenderOptions> {

    private className: string = "visualYAxis";

    private additionalOffset: number = 10;

    private labelOffset: number = 12;

    private maxLabelWidth: number = 0;
    private maxLabelHeight: number = 0;

    private maxXAxisLabelWidth: number = 100;

    private valueFormat: string = valueFormatter.valueFormatter.DefaultNumericFormat;

    constructor(options: VisualComponentConstructorOptions) {
        super();

        this.initElement(
            options.element,
            this.className,
            "svg"
        );

        this.gElement = this.element.append("g");
    }

    public preRender(options: YAxisComponentRenderOptions): void {
        if (!this.areRenderOptionsValid(options)) {
            return;
        }

        const {
            axis,
            settings,
        } = options;

        if (settings.show) {
            this.show();
        } else {
            this.hide();
        }

        const fontSize: number = settings.fontSizeInPx;

        this.formatter = this.getValueFormatter(
            settings.displayUnits || axis.max,
            undefined,
            undefined,
            undefined,
            settings.precision,
            axis.format || this.valueFormat
        );

        this.maxLabelHeight = this.getLabelHeight(
            axis.max,
            this.formatter,
            fontSize,
            settings.fontFamily
        );
    }

    public render(options: YAxisComponentRenderOptions): void {
        if (!this.areRenderOptionsValid(options)) {
            this.hide();

            this.axisProperties = null;

            return;
        }

        const {
            axis,
            margin,
            settings,
            viewport,
        } = options;

        const fontSize: number = settings.fontSizeInPx;

        const height: number = Math.max(0, viewport.height - margin.top - margin.bottom);

        this.axisProperties = this.getAxisProperties(
            height,
            [axis.min, axis.max],
            settings.density,
            settings.density === settings.maxDensity
        );

        if (!this.isShown) {
            return;
        }

        this.maxLabelWidth = settings.show
            ? this.getLabelWidth(
                this.getTicks(),
                this.formatter,
                fontSize,
                settings.fontFamily
            )
            : 0;

        const availableWidth: number = viewport.width / 2;

        let shouldLabelsBeTruncated: boolean = false;

        if (this.maxLabelWidth > availableWidth) {
            this.maxLabelWidth = availableWidth;

            shouldLabelsBeTruncated = true;
        }

        this.element
            .style("font-family", settings.fontFamily)
            .style("font-size", pixelConverter.toString(fontSize))
            .style("fill", settings.fontColor)
            .style("padding", `${pixelConverter.toString(margin.top)} 0 ${pixelConverter.toString(this.maxLabelHeight / 2)} 0`);

        this.updateViewport({
            height,
            width: this.getTickWidth(),
        });

        this.gElement.attr("transform", svgManipulation.translate(
            this.maxLabelWidth + this.labelOffset,
            this.maxLabelHeight / 2
        ));

        this.axisProperties.axis.tickFormat((item: number) => {
            const formattedLabel: string = this.formatter.format(item);

            if (shouldLabelsBeTruncated) {
                return textMeasurementService.textMeasurementService.getTailoredTextOrDefault(
                    this.getTextProperties(formattedLabel, fontSize, settings.fontFamily),
                    availableWidth
                );
            }

            return formattedLabel;
        });

        this.gElement.call(this.axisProperties.axis);
    }

    private getAxisProperties(
        pixelSpan: number,
        dataDomain: any[],
        density: number,
        isDensityAtMax: boolean
    ) {
        return PowerKPIAxisHelper.createAxis({
            pixelSpan,
            dataDomain,
            density,
            isVertical: true,
            isScalar: true,
            isCategoryAxis: false,
            metaDataColumn: null,
            formatString: undefined,
            outerPadding: this.maxLabelHeight / 2,
            useTickIntervalForDisplayUnits: true,
            shouldClamp: false,
            // outerPaddingRatio: 0, // TODO:
            is100Pct: true,
            innerPaddingRatio: 1,
            tickLabelPadding: undefined,
            minOrdinalRectThickness: this.maxLabelHeight,
            shouldTheMinValueBeIncluded: isDensityAtMax
        });
    }

    public getViewport(): VisualComponentViewport {
        if (!this.isShown) {
            return {
                width: 0,
                height: 0
            };
        }

        return {
            width: this.getTickWidth(),
            height: this.maxLabelHeight / 2,
        };
    }

    private getTickWidth(): number {
        return this.maxLabelWidth + this.additionalOffset;
    }

    private areRenderOptionsValid(options: YAxisComponentRenderOptions): boolean {
        return !!(options && options.axis && options.settings);
    }
}
