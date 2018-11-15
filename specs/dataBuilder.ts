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

import powerbi from "powerbi-visuals-api";

import { valueType } from "powerbi-visuals-utils-typeutils";
import { testDataViewBuilder, getRandomNumbers } from "powerbi-visuals-utils-testutils";

import { getDateRange } from "./helpers";

export class DataBuilder extends testDataViewBuilder.TestDataViewBuilder {
    private static CategoryColumnName: string = "Axis";
    private static ValuesColumnName: string = "Values";

    private amountOfSeries: number = 10;

    public dates: Date[] = [];
    public seriesValues: number[][] = [];

    constructor() {
        super();

        this.dates = getDateRange(
            new Date(2016, 0, 1),
            new Date(2016, 0, 10),
            1000 * 24 * 3600
        );

        for (let i: number = 0; i < this.amountOfSeries; i++) {
            this.seriesValues.push(getRandomNumbers(
                this.dates.length,
                -Number.MAX_VALUE,
                Number.MAX_VALUE)
            );
        }
    }

    public getDataView(columnNames?: string[]): powerbi.DataView {
        const datesCategory = {
            source: {
                displayName: DataBuilder.CategoryColumnName,
                format: "%M/%d/yyyy",
                type: valueType.ValueType.fromDescriptor({ dateTime: true }),
                roles: { Axis: true }
            },
            values: this.dates
        };

        const valuesCategory = this.seriesValues.map((values: number[]) => {
            return {
                values,
                source: {
                    displayName: DataBuilder.ValuesColumnName,
                    type: valueType.ValueType.fromDescriptor({ integer: true }),
                    roles: { Values: true }
                }
            };
        });

        return this.createCategoricalDataViewBuilder(
            [datesCategory],
            valuesCategory,
            columnNames
        ).build();
    }
}
