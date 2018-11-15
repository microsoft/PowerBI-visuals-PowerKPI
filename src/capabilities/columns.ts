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

export interface VisualDataRole {
    name: string; // must be aligned to capabilities.json
    displayName: string;
}

export const categoryColumn: VisualDataRole = {
    name: "Axis",
    displayName: "Axis",
};

export const kpiColumn: VisualDataRole = {
    name: "KPI",
    displayName: "KPI Indicator Index",
};

export const kpiIndicatorValueColumn: VisualDataRole = {
    name: "KPIIndicatorValue",
    displayName: "KPI Indicator Value",
};

export const secondKPIIndicatorValueColumn: VisualDataRole = {
    name: "SecondKPIIndicatorValue",
    displayName: "Second KPI Indicator Value",
};

export const valuesColumn: VisualDataRole = {
    name: "Values",
    displayName: "Values",
};

export const seriesColumn: VisualDataRole = {
    name: "SeriesColumn",
    displayName: "Series",
};

export const secondaryValuesColumn: VisualDataRole = {
    name: "SecondaryValues",
    displayName: "Secondary Values",
};

