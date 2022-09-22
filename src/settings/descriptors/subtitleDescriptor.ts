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
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import { FontSizeDescriptor } from "./autoHiding/fontSizeDescriptor";

export enum SubtitleAlignment {
    left = "left",
    center = "center",
    right = "right",
}

export class SubtitleDescriptor extends FontSizeDescriptor {
    public titleText = new formattingSettings.TextInput({
        name: "titleText",
        displayName: "Title text",
        value: "",
        placeholder: ""
    });

    public fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Font Color",
        value: { value: "#A6A6A6" }
    });

    public background = new formattingSettings.ColorPicker({
        name: "background",
        displayName: "Background Color",
        value: { value: null }
    });

    public alignment = new formattingSettings.AlignmentGroup({
        name: "alignment",
        displayName: "Alignment",
        mode: powerbi.visuals.AlignmentGroupMode.Horizonal,
        value: SubtitleAlignment.left
    });;

    constructor(viewport: powerbi.IViewport) {
        super(viewport)

        this.slices = [this.show, this.titleText, this.font, this.fontColor, this.background, this.alignment];
        this.name = "subtitle";
        this.displayName = "Subtitle";
    }
}
