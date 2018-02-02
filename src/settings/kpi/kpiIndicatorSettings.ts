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

namespace powerbi.extensibility.visual {
    interface PropertyConfiguration {
        name: string;
        defaultValue: any | ((index: number) => any);
        displayName: (text: string) => string;
        type: any;
    }

    interface EnumPropertyConfiguration {
        name: string;
        displayName: string;
    }

    export interface IKPIIndicatorSettings { // This should be synchronized with _properties
        color?: string;
        shape?: string;
    }

    export class KPIIndicatorSettings extends FontSizeSettings {
        public position: string = HorizontalLayoutEnum[HorizontalLayoutEnum.Left];

        private _maxAmountOfKPIs: number = 5;

        private _default: IKPIIndicatorSettings = Object.freeze({
            color: null,
            shape: null
        });

        private kpiIndexPropertyName: string = "kpiIndex";

        private _colors: string[] = [
            "#01b7a8",
            "#f2c80f",
            "#fd625e",
            "#a66999",
            "#374649"
        ];

        private _shapes: EnumPropertyConfiguration[] = [
            { name: "circle-full", displayName: "Circle" },
            { name: "triangle", displayName: "Triangle" },
            { name: "rhombus", displayName: "Diamond" },
            { name: "square", displayName: "Square" },
            { name: "flag", displayName: "Flag" },
            { name: "exclamation", displayName: "Exclamation" },
            { name: "checkmark", displayName: "Checkmark" },
            { name: "arrow-up", displayName: "Arrow Up" },
            { name: "arrow-right-up", displayName: "Arrow Right Up" },
            { name: "arrow-right-down", displayName: "Arrow Right Down" },
            { name: "arrow-down", displayName: "Arrow Down" },
            { name: "caret-up", displayName: "Caret Up" },
            { name: "caret-down", displayName: "Caret Down" },
            { name: "circle-empty", displayName: "Circle Empty" },
            { name: "circle-x", displayName: "Circle X" },
            { name: "circle-exclamation", displayName: "Circle Exclamation" },
            { name: "circle-checkmark", displayName: "Circle Checkmark" },
            { name: "x", displayName: "X" },
            { name: "star-empty", displayName: "Star Empty" },
            { name: "star-full", displayName: "Star Full" }
        ];

        private _properties: PropertyConfiguration[] = [
            {
                name: "color",
                displayName: (text: string) => text,
                defaultValue: (index: number) => {
                    const color: string = this.getElementByIndex<string>(this._colors, index);

                    return color || this._colors[0];
                },
                type: { fill: { solid: { color: true } } }
            },
            {
                name: "shape",
                displayName: () => "    Indicator",
                defaultValue: (index: number) => {
                    const shape: EnumPropertyConfiguration =
                        this.getElementByIndex<EnumPropertyConfiguration>(this._shapes, index);

                    return shape
                        ? shape.name
                        : this._shapes[0].name;
                },
                type: { enumeration: this.getEnumType() }
            },
            {
                name: this.kpiIndexPropertyName,
                displayName: () => "    Value",
                defaultValue: (index: number) => index + 1,
                type: { numeric: true },
            },
        ];

        public getElementByIndex<Type>(setOfValues: Type[], index: number): Type {
            const amountOfValues: number = setOfValues.length;

            const currentIndex: number = index < amountOfValues
                ? index
                : Math.round(index / amountOfValues);

            return setOfValues[currentIndex];
        }

        constructor(viewport?: IViewport) {
            super(viewport);

            this.applySettingToContext();

            this.show = true;
            this.fontSize = 12;
        }

        private applySettingToContext(): void {
            for (let index: number = 0; index < this._maxAmountOfKPIs; index++) {
                this._properties.forEach((property: PropertyConfiguration) => {
                    const indexedName: string = this.getPropertyName(property.name, index);

                    this[indexedName] = typeof property.defaultValue === "function"
                        ? property.defaultValue(index)
                        : property.defaultValue;
                });
            }
        }

        private getEnumType(): IEnumType {
            const members: IEnumMember[] = this._shapes.map((shape: EnumPropertyConfiguration) => {
                return {
                    value: shape.name,
                    displayName: shape.displayName
                };
            });

            return createEnumType(members);
        }

        private getPropertyName(name: string, index: number): string {
            return `${name}_${index}`;
        }

        public getCurrentKPI(kpiIndex: number): IKPIIndicatorSettings {
            if (!isNaN(kpiIndex) && kpiIndex !== null) {
                for (let index: number = 0; index < this._maxAmountOfKPIs; index++) {
                    const currentKPIIndex: number = this[this.getPropertyName(this.kpiIndexPropertyName, index)];

                    if (currentKPIIndex === kpiIndex) {
                        return this._properties.reduce((
                            current: IKPIIndicatorSettings,
                            property: PropertyConfiguration
                        ) => {
                            const indexedName: string = this.getPropertyName(property.name, index);

                            current[property.name] = this[indexedName];

                            return current;
                        }, {});
                    }
                }
            }

            return this._default;
        }
    }
}