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
    import PixelConverter = powerbi.extensibility.utils.type.PixelConverter;
    import IValueFormatter = powerbi.extensibility.utils.formatting.IValueFormatter;
    import valueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;
    import TextProperties = powerbi.extensibility.utils.formatting.TextProperties;
    import TextMeasurementService = powerbi.extensibility.utils.formatting.textMeasurementService;
    
    export abstract class AxisBaseComponent implements VisualComponent {
        private invisibleClassName: string = "invisible";

        protected svgElement: d3.Selection<any>;
        protected element: d3.Selection<any>;

        protected isEnabled: boolean = true;

        protected fontSize: number = 11;

        protected additionalXAxisOffset: number = 5;

        protected maxAmountOfTicks: number = 50;

        public abstract render(options: VisualComponentOptions): void;

        public hide(isHidden: boolean): void {
            if (this.svgElement) {
                this.svgElement.classed(this.invisibleClassName, !isHidden);
            }
        }

        public clear(): void {
            this.element
                .selectAll("*")
                .remove();
        }

        public destroy(): void {
            this.element = null;
            this.svgElement = null;
        }

        protected updateSvgViewport(viewport: IViewport): void {
            this.svgElement.style({
                width: PixelConverter.toString(viewport.width),
                height: PixelConverter.toString(viewport.height)
            });
        }

        protected getLabelHeight(
            value: DataRepresentationAxisValueType,
            formatter: IValueFormatter,
            fontSize: number,
            fontFamily: string
        ): number {
            const text: string = formatter.format(value)
                , textProperties: TextProperties = this.getTextProperties(text, fontSize, fontFamily);

            return TextMeasurementService.measureSvgTextHeight(textProperties, text);
        }

        protected getLabelWidth(
            values: DataRepresentationAxisValueType[],
            formatter: IValueFormatter,
            fontSize: number,
            fontFamily: string
        ): number {
            const width: number = Math.max(...values.map((value: number) => {
                const text: string = formatter.format(value)
                    , textProperties: TextProperties = this.getTextProperties(text, fontSize, fontFamily);

                return TextMeasurementService.measureSvgTextWidth(textProperties, text);
            }));

            return isFinite(width)
                ? width
                : 0;
        }

        protected getTextProperties(
            text: string,
            fontSize: number,
            fontFamily: string
        ): TextProperties {
            return {
                text,
                fontFamily,
                fontSize: PixelConverter.toString(fontSize)
            };
        }

        protected getValueFormatterOfXAxis(x: DataRepresentationX, xAxis: AxisSettings): IValueFormatter {
            let minValue: DataRepresentationAxisValueType
                , maxValue: DataRepresentationAxisValueType
                , precision: number;

            if (x.type === DataRepresentationTypeEnum.NumberType) {
                minValue = xAxis.displayUnits || x.max;
                precision = xAxis.precision;
            } else {
                minValue = x.min;
                maxValue = x.max;
            }

            return this.getValueFormatter(
                minValue,
                maxValue,
                x.metadata,
                this.maxAmountOfTicks,
                precision,
                x.format || undefined);
        }

        protected getValueFormatter(
            min: DataRepresentationAxisValueType,
            max: DataRepresentationAxisValueType,
            metadata?: DataViewMetadataColumn,
            tickCount?: number,
            precision?: number,
            valueFormat?: string
        ): IValueFormatter {
            
            return valueFormatter.create({
                tickCount,
                precision,
                format: valueFormat,
                value: min,
                value2: max,
                columnType: metadata && metadata.type
            });
        }
    }
}