export enum LineInterpolation {
    linear = "linear",
    stepBefore = "step-before",
    stepAfter = "step-after",
    basis = "basis",
    basisOpen = "basis-open",
    basisClosed = "basis-closed",
    cardinal = "cardinal",
    cardinalOpen = "cardinal-open",
    cardinalClosed = "cardinal-closed",
    monotone = "monotone",
}

export enum LineStyle {
    solidLine = "solidLine",
    dottedLine = "dottedLine",
    dashedLine = "dashedLine",
    dotDashedLine = "dotDashedLine",
}

export enum LineType {
    line = "line",
    area = "area",
    column = "column",
}

export interface SimpleLineSetting {
    fillColor: string;
    shouldMatchKpiColor: boolean;
    dataPointStartsKpiColorSegment: boolean;
    lineStyle: LineStyle;
    thickness: number;
    interpolation: LineInterpolation;
    lineType: LineType;
    opacity: number;
    areaOpacity: number;
    interpolationWithColorizedLine: LineInterpolation;
}