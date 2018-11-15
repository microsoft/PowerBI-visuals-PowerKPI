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
    IDescriptor,
    IDescriptorParserOptions,
} from "./descriptor";

import { FontSizeDescriptor } from "./autoHiding/fontSizeDescriptor";

import {
    DataRepresentationTypeEnum,
} from "../../dataRepresentation/dataRepresentationType";

export class NumberDescriptorBase
    extends FontSizeDescriptor
    implements IDescriptor {

    public format: string = undefined;
    public defaultFormat: string = undefined;
    public columnFormat: string = undefined;

    public displayUnits: number = 0;
    public precision: number = undefined;

    protected minPrecision: number = 0;
    protected maxPrecision: number = 17;

    private shouldNumericPropertiesBeHiddenByType: boolean;

    constructor(viewport?: powerbi.IViewport, shouldPropertiesBeHiddenByType: boolean = false) {
        super(viewport);

        this.shouldNumericPropertiesBeHiddenByType = shouldPropertiesBeHiddenByType;
    }

    public parse(options: IDescriptorParserOptions) {
        super.parse(options);

        this.precision = this.getValidPrecision(this.precision);

        this.hidePropertiesByType(options.type);
    }

    public getFormat(): string {
        return this.format || this.columnFormat || this.defaultFormat;
    }

    public setColumnFormat(format: string) {
        if (!format) {
            return;
        }

        this.columnFormat = format;
    }

    public getValueByKey(key: string): string {
        if (key === "format") {
            return this.getFormat();
        }

        return this[key];
    }

    protected getValidPrecision(precision: number): number {
        if (isNaN(precision)) {
            return precision;
        }

        return Math.min(
            Math.max(this.minPrecision, precision),
            this.maxPrecision);
    }

    /**
     * Hides properties at the formatting panel
     */
    protected hideNumberProperties(): void {
        Object.defineProperties(this, {
            displayUnits: {
                enumerable: false,
            },
            precision: {
                enumerable: false,
            },
        });
    }

    protected hideFormatProperty(): void {
        Object.defineProperty(
            this,
            "format", {
                enumerable: false,
            },
        );
    }

    protected applyDefaultFormatByType(type: DataRepresentationTypeEnum): void {
        if (this.defaultFormat) {
            return;
        }

        switch (type) {
            case DataRepresentationTypeEnum.DateType: {
                this.defaultFormat = "%M/%d/yyyy";

                if (this.format === undefined) {
                    this.format = this.defaultFormat;
                }

                break;
            }
            case DataRepresentationTypeEnum.NumberType: {
                this.defaultFormat = "#,0.00";

                break;
            }
            default: {
                this.defaultFormat = undefined;
            }
        }
    }

    private hidePropertiesByType(type: DataRepresentationTypeEnum = DataRepresentationTypeEnum.NumberType): void {
        this.applyDefaultFormatByType(type);

        if (this.shouldNumericPropertiesBeHiddenByType
            && type !== DataRepresentationTypeEnum.NumberType
        ) {
            this.hideNumberProperties();
        }

        if (!(type === DataRepresentationTypeEnum.NumberType
            || type === DataRepresentationTypeEnum.DateType)
        ) {
            this.hideFormatProperty();
        }
    }
}
