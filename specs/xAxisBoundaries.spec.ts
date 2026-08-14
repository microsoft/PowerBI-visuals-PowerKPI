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

import { DataRepresentationTypeEnum } from "../src/dataRepresentation/dataRepresentationType";
import { Settings } from "../src/settings/settings";
import { XAxisDescriptor } from "../src/settings/descriptors/axis/xAxisDescriptor";

function createXAxisSettings(): XAxisDescriptor {
    return new Settings().xAxis;
}

describe("XAxisDescriptor boundaries", () => {
    describe("numeric axis", () => {
        const type: DataRepresentationTypeEnum = DataRepresentationTypeEnum.NumberType;

        it("should report no boundary while the inputs are left empty", () => {
            const xAxis: XAxisDescriptor = createXAxisSettings();

            expect(xAxis.getMin(type)).toBeUndefined();
            expect(xAxis.getMax(type)).toBeUndefined();
        });

        it("should report the numeric values the author typed", () => {
            const xAxis: XAxisDescriptor = createXAxisSettings();

            xAxis.min.value = -10;
            xAxis.max.value = 250;

            expect(xAxis.getMin(type)).toBe(-10);
            expect(xAxis.getMax(type)).toBe(250);
        });

        it("should treat zero as a real boundary rather than an empty input", () => {
            const xAxis: XAxisDescriptor = createXAxisSettings();

            xAxis.min.value = 0;

            expect(xAxis.getMin(type)).toBe(0);
        });

        it("should ignore the date inputs", () => {
            const xAxis: XAxisDescriptor = createXAxisSettings();

            xAxis.minDate.value = "2024-01-31";

            expect(xAxis.getMin(type)).toBeUndefined();
        });
    });

    describe("date axis", () => {
        const type: DataRepresentationTypeEnum = DataRepresentationTypeEnum.DateType;

        it("should report no boundary while the inputs are left empty", () => {
            const xAxis: XAxisDescriptor = createXAxisSettings();

            expect(xAxis.getMin(type)).toBeUndefined();
            expect(xAxis.getMax(type)).toBeUndefined();
        });

        it("should parse the dates the author typed", () => {
            const xAxis: XAxisDescriptor = createXAxisSettings();

            xAxis.minDate.value = "2024-01-31";
            xAxis.maxDate.value = "2024-12-01";

            expect((xAxis.getMin(type) as Date).getTime()).toBe(new Date("2024-01-31").getTime());
            expect((xAxis.getMax(type) as Date).getTime()).toBe(new Date("2024-12-01").getTime());
        });

        it("should ignore an entry that cannot be read as a date", () => {
            const xAxis: XAxisDescriptor = createXAxisSettings();

            xAxis.minDate.value = "not a date";

            expect(xAxis.getMin(type)).toBeUndefined();
        });

        it("should ignore the numeric inputs", () => {
            const xAxis: XAxisDescriptor = createXAxisSettings();

            xAxis.min.value = 42;

            expect(xAxis.getMin(type)).toBeUndefined();
        });
    });

    describe("categorical axis", () => {
        const type: DataRepresentationTypeEnum = DataRepresentationTypeEnum.StringType;

        it("should never report a boundary, whichever input is filled in", () => {
            const xAxis: XAxisDescriptor = createXAxisSettings();

            xAxis.min.value = 1;
            xAxis.max.value = 2;
            xAxis.minDate.value = "2024-01-31";
            xAxis.maxDate.value = "2024-12-01";

            expect(xAxis.getMin(type)).toBeUndefined();
            expect(xAxis.getMax(type)).toBeUndefined();
        });
    });

    describe("formatting pane visibility", () => {
        function getVisibility(axisType: DataRepresentationTypeEnum) {
            const settings: Settings = new Settings();

            settings.filterFormattingProperties(
                null,
                axisType,
                { getDisplayName: (key: string) => key } as any,
                false,
            );

            return {
                max: settings.xAxis.max.visible,
                maxDate: settings.xAxis.maxDate.visible,
                min: settings.xAxis.min.visible,
                minDate: settings.xAxis.minDate.visible,
            };
        }

        it("should offer the numeric inputs only on a numeric axis", () => {
            const visibility = getVisibility(DataRepresentationTypeEnum.NumberType);

            expect(visibility.min).toBe(true);
            expect(visibility.max).toBe(true);
            expect(visibility.minDate).toBe(false);
            expect(visibility.maxDate).toBe(false);
        });

        it("should offer the date inputs only on a date axis", () => {
            const visibility = getVisibility(DataRepresentationTypeEnum.DateType);

            expect(visibility.minDate).toBe(true);
            expect(visibility.maxDate).toBe(true);
            expect(visibility.min).toBe(false);
            expect(visibility.max).toBe(false);
        });

        it("should offer neither pair on a categorical axis", () => {
            const visibility = getVisibility(DataRepresentationTypeEnum.StringType);

            expect(visibility.min).toBe(false);
            expect(visibility.max).toBe(false);
            expect(visibility.minDate).toBe(false);
            expect(visibility.maxDate).toBe(false);
        });
    });
});
