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

import { Dispatch } from "d3-dispatch";

import {
    interactivityBaseService,
} from "powerbi-visuals-utils-interactivityutils";

import { IDataRepresentationSeries } from "../dataRepresentation/dataRepresentationSeries";
import { EventName } from "../event/eventName";

export interface IBehaviorOptions extends interactivityBaseService.IBehaviorOptions<IDataRepresentationSeries> {
    eventDispatcher: Dispatch<any>;
    interactivityService: interactivityBaseService.IInteractivityService<IDataRepresentationSeries>;
}

export class Behavior implements interactivityBaseService.IInteractiveBehavior {
    private options: IBehaviorOptions;

    public bindEvents(
        options: IBehaviorOptions,
        selectionHandler: interactivityBaseService.ISelectionHandler,
    ): void {
        this.options = options;

        this.options.eventDispatcher.on(
            EventName.onSelect,
            (event: MouseEvent, series: IDataRepresentationSeries) => {
                if (!event || !series) {
                    return;
                }

                selectionHandler.handleSelection(series, event.ctrlKey);
            },
        );

        this.options.eventDispatcher.on(
            EventName.onClearSelection,
            () => {
                selectionHandler.handleClearSelection();
            },
        );
    }

    public renderSelection(): void {
        this.options.eventDispatcher.call(
            EventName.onHighlight,
            undefined,
            this.options.interactivityService.hasSelection(),
        );
    }
}
