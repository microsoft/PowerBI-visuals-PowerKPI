var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            function createEnumType(members) {
                return new EnumType(members);
            }
            visual.createEnumType = createEnumType;
            var EnumType = /** @class */ (function () {
                function EnumType(allMembers) {
                    this.allMembers = allMembers;
                }
                EnumType.prototype.members = function (validMembers) {
                    var allMembers = this.allMembers;
                    if (!validMembers)
                        return allMembers;
                    var membersToReturn = [];
                    for (var _i = 0, allMembers_1 = allMembers; _i < allMembers_1.length; _i++) {
                        var member = allMembers_1[_i];
                        if (_.has(validMembers, member.value))
                            membersToReturn.push(member);
                    }
                    return membersToReturn;
                };
                return EnumType;
            }());
            visual.EnumType = EnumType;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var LayoutEnum;
            (function (LayoutEnum) {
                LayoutEnum[LayoutEnum["Top"] = 0] = "Top";
                LayoutEnum[LayoutEnum["Right"] = 1] = "Right";
                LayoutEnum[LayoutEnum["Bottom"] = 2] = "Bottom";
                LayoutEnum[LayoutEnum["Left"] = 3] = "Left";
            })(LayoutEnum = visual.LayoutEnum || (visual.LayoutEnum = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var HorizontalLayoutEnum;
            (function (HorizontalLayoutEnum) {
                HorizontalLayoutEnum[HorizontalLayoutEnum["Left"] = 0] = "Left";
                HorizontalLayoutEnum[HorizontalLayoutEnum["Right"] = 1] = "Right";
            })(HorizontalLayoutEnum = visual.HorizontalLayoutEnum || (visual.HorizontalLayoutEnum = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var LayoutToStyleEnum;
            (function (LayoutToStyleEnum) {
                LayoutToStyleEnum[LayoutToStyleEnum["columnLayout"] = 0] = "columnLayout";
                LayoutToStyleEnum[LayoutToStyleEnum["columnReversedLayout"] = 1] = "columnReversedLayout";
                LayoutToStyleEnum[LayoutToStyleEnum["rowLayout"] = 2] = "rowLayout";
                LayoutToStyleEnum[LayoutToStyleEnum["rowReversedLayout"] = 3] = "rowReversedLayout";
            })(LayoutToStyleEnum = visual.LayoutToStyleEnum || (visual.LayoutToStyleEnum = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            visual.CategoryColumn = {
                name: "Axis",
                displayName: "Axis"
            };
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            visual.ValuesColumn = {
                name: "Values",
                displayName: "Values"
            };
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            visual.KPIColumn = {
                name: "KPI",
                displayName: "KPI Indicator Index"
            };
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            visual.KPIIndicatorValueColumn = {
                name: "KPIIndicatorValue",
                displayName: "KPI Indicator Value"
            };
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            visual.SecondKPIIndicatorValueColumn = {
                name: "SecondKPIIndicatorValue",
                displayName: "Second KPI Indicator Value"
            };
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var ViewportSettings = /** @class */ (function () {
                function ViewportSettings(viewport) {
                    if (viewport === void 0) { viewport = { width: 0, height: 0 }; }
                    this._viewport = viewport;
                }
                return ViewportSettings;
            }());
            visual.ViewportSettings = ViewportSettings;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var ShowSettings = /** @class */ (function (_super) {
                __extends(ShowSettings, _super);
                function ShowSettings(viewport) {
                    if (viewport === void 0) { viewport = { width: 0, height: 0 }; }
                    var _this = _super.call(this, viewport) || this;
                    _this._show = true;
                    _this.isAbleToBeShown = true;
                    Object.defineProperty(_this, "show", Object.getOwnPropertyDescriptor(ShowSettings.prototype, "show"));
                    return _this;
                }
                Object.defineProperty(ShowSettings.prototype, "show", {
                    get: function () {
                        if (!this.isAbleToBeShown) {
                            return false;
                        }
                        return this._show;
                    },
                    set: function (isShown) {
                        this._show = isShown;
                    },
                    enumerable: true,
                    configurable: true
                });
                ShowSettings.prototype.parse = function (options) {
                    this.isAbleToBeShown = !(options
                        && options.isAutoHideBehaviorEnabled
                        && options.viewport
                        && this._viewport
                        &&
                            (options.viewport.width <= this._viewport.width
                                ||
                                    options.viewport.height <= this._viewport.height));
                };
                return ShowSettings;
            }(visual.ViewportSettings));
            visual.ShowSettings = ShowSettings;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var FontSizeSettings = /** @class */ (function (_super) {
                __extends(FontSizeSettings, _super);
                function FontSizeSettings(viewport) {
                    var _this = _super.call(this, viewport) || this;
                    _this.minFontSize = 8;
                    _this.isMinFontSizeApplied = false;
                    _this.viewportForFontSize8 = {
                        width: 210,
                        height: 210
                    };
                    _this._fontSize = _this.minFontSize; // This value is in pt.
                    Object.defineProperty(_this, "fontSize", Object.getOwnPropertyDescriptor(FontSizeSettings.prototype, "fontSize"));
                    return _this;
                }
                Object.defineProperty(FontSizeSettings.prototype, "fontSize", {
                    get: function () {
                        if (this.isMinFontSizeApplied) {
                            return this.minFontSize;
                        }
                        return this._fontSize;
                    },
                    set: function (fontSize) {
                        // Power BI returns numbers as strings for some unknown reason. This is why we convert value to number.
                        var parsedFontSize = +fontSize;
                        this._fontSize = isNaN(parsedFontSize)
                            ? this.minFontSize
                            : parsedFontSize;
                    },
                    enumerable: true,
                    configurable: true
                });
                FontSizeSettings.prototype.parse = function (options) {
                    _super.prototype.parse.call(this, options);
                    this.isMinFontSizeApplied =
                        options
                            && options.isAutoHideBehaviorEnabled
                            && options.viewport
                            &&
                                (options.viewport.width <= this.viewportForFontSize8.width
                                    ||
                                        options.viewport.height <= this.viewportForFontSize8.height);
                };
                return FontSizeSettings;
            }(visual.ShowSettings));
            visual.FontSizeSettings = FontSizeSettings;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var DataViewObjects = extensibility.utils.dataview.DataViewObjects;
            // powerbi.visuals
            var ColorHelper = extensibility.utils.color.ColorHelper;
            var SeriesBoundSettingsBase = /** @class */ (function () {
                function SeriesBoundSettingsBase(displayName, objectName, propertyName, defaultValue) {
                    this.displayName = displayName;
                    this.propertyId = { objectName: objectName, propertyName: propertyName };
                    this.defaultValue = defaultValue;
                }
                SeriesBoundSettingsBase.prototype.enumerateObjectInstances = function (enumeratedObjectName, series) {
                    var _a = this.propertyId, objectName = _a.objectName, propertyName = _a.propertyName;
                    if (enumeratedObjectName !== objectName) {
                        return [];
                    }
                    return series.map(function (series) {
                        return {
                            objectName: objectName,
                            displayName: series.name,
                            selector: ColorHelper.normalizeSelector(series.selectionId.getSelector()),
                            properties: (_a = {},
                                _a[propertyName] = series[propertyName],
                                _a)
                        };
                        var _a;
                    });
                };
                SeriesBoundSettingsBase.prototype.parseValue = function (objects) {
                    return DataViewObjects.getValue(objects, this.propertyId, this.defaultValue);
                };
                return SeriesBoundSettingsBase;
            }());
            visual.SeriesBoundSettingsBase = SeriesBoundSettingsBase;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var NumberSettingsBase = /** @class */ (function (_super) {
                __extends(NumberSettingsBase, _super);
                function NumberSettingsBase(viewport, shouldPropertiesBeHiddenByType) {
                    if (shouldPropertiesBeHiddenByType === void 0) { shouldPropertiesBeHiddenByType = false; }
                    var _this = _super.call(this, viewport) || this;
                    _this.minPrecision = 0;
                    _this.maxPrecision = 17;
                    _this.format = undefined;
                    _this.defaultFormat = undefined;
                    _this.columnFormat = undefined;
                    _this.displayUnits = 0;
                    _this.precision = undefined;
                    _this.shouldNumericPropertiesBeHiddenByType = shouldPropertiesBeHiddenByType;
                    return _this;
                }
                NumberSettingsBase.prototype.parse = function (options) {
                    _super.prototype.parse.call(this, options);
                    this.precision = this.getValidPrecision(this.precision);
                    this.hidePropertiesByType(options.type);
                };
                NumberSettingsBase.prototype.hidePropertiesByType = function (type) {
                    if (type === void 0) { type = visual.DataRepresentationTypeEnum.NumberType; }
                    this.applyDefaultFormatByType(type);
                    if (this.shouldNumericPropertiesBeHiddenByType
                        && type !== visual.DataRepresentationTypeEnum.NumberType) {
                        this.hideNumberProperties();
                    }
                    if (!(type === visual.DataRepresentationTypeEnum.NumberType
                        || type === visual.DataRepresentationTypeEnum.DateType)) {
                        this.hideFormatProperty();
                    }
                };
                NumberSettingsBase.prototype.getValidPrecision = function (precision) {
                    if (isNaN(precision)) {
                        return precision;
                    }
                    return Math.min(Math.max(this.minPrecision, precision), this.maxPrecision);
                };
                /**
                 * Hides properties at the formatting panel
                 */
                NumberSettingsBase.prototype.hideNumberProperties = function () {
                    Object.defineProperties(this, {
                        displayUnits: {
                            enumerable: false
                        },
                        precision: {
                            enumerable: false
                        }
                    });
                };
                NumberSettingsBase.prototype.hideFormatProperty = function () {
                    Object.defineProperty(this, "format", {
                        enumerable: false
                    });
                };
                NumberSettingsBase.prototype.applyDefaultFormatByType = function (type) {
                    if (this.defaultFormat) {
                        return;
                    }
                    switch (type) {
                        case visual.DataRepresentationTypeEnum.DateType: {
                            this.defaultFormat = "%M/%d/yyyy";
                            if (this.format === undefined) {
                                this.format = this.defaultFormat;
                            }
                            break;
                        }
                        case visual.DataRepresentationTypeEnum.NumberType: {
                            this.defaultFormat = "#,0.00";
                            break;
                        }
                        default: {
                            this.defaultFormat = undefined;
                        }
                    }
                };
                NumberSettingsBase.prototype.getFormat = function () {
                    return this.format || this.columnFormat || this.defaultFormat;
                };
                NumberSettingsBase.prototype.setColumnFormat = function (format) {
                    if (!format) {
                        return;
                    }
                    this.columnFormat = format;
                };
                return NumberSettingsBase;
            }(visual.FontSizeSettings));
            visual.NumberSettingsBase = NumberSettingsBase;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var AxisSettings = /** @class */ (function (_super) {
                __extends(AxisSettings, _super);
                function AxisSettings(viewportToBeHidden, viewportToIncreaseDensity, shouldPropertiesBeHiddenByType) {
                    if (shouldPropertiesBeHiddenByType === void 0) { shouldPropertiesBeHiddenByType = false; }
                    var _this = _super.call(this, viewportToBeHidden, shouldPropertiesBeHiddenByType) || this;
                    _this.shouldDensityBeAtMax = false;
                    _this.maxDensity = 100;
                    _this.fontColor = "rgb(0,0,0)";
                    _this._percentile = _this.maxDensity;
                    _this.fontFamily = "'Segoe UI Light', wf_segoe-ui_light, helvetica, arial, sans-serif";
                    _this.viewportToIncreaseDensity = viewportToIncreaseDensity;
                    Object.defineProperty(_this, "percentile", Object.getOwnPropertyDescriptor(AxisSettings.prototype, "percentile"));
                    return _this;
                }
                Object.defineProperty(AxisSettings.prototype, "percentile", {
                    // This property is an alias of density and it's defined special for Power BI. It's predefined PBI property name in order to create a percentage slider at format panel
                    get: function () {
                        if (this.shouldDensityBeAtMax) {
                            return this.maxDensity;
                        }
                        return this._percentile;
                    },
                    set: function (value) {
                        this._percentile = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AxisSettings.prototype, "density", {
                    get: function () {
                        return this.percentile;
                    },
                    enumerable: true,
                    configurable: true
                });
                AxisSettings.prototype.parse = function (options) {
                    _super.prototype.parse.call(this, options);
                    this.shouldDensityBeAtMax = options.isAutoHideBehaviorEnabled
                        && this.viewportToIncreaseDensity
                        && options.viewport
                        && (options.viewport.width <= this.viewportToIncreaseDensity.width
                            ||
                                options.viewport.height <= this.viewportToIncreaseDensity.height);
                };
                return AxisSettings;
            }(visual.NumberSettingsBase));
            visual.AxisSettings = AxisSettings;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var YAxisSettings = /** @class */ (function (_super) {
                __extends(YAxisSettings, _super);
                function YAxisSettings() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.min = NaN;
                    _this.max = NaN;
                    return _this;
                }
                return YAxisSettings;
            }(visual.AxisSettings));
            visual.YAxisSettings = YAxisSettings;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var AxisReferenceLineSettings = /** @class */ (function () {
                function AxisReferenceLineSettings(isShown) {
                    if (isShown === void 0) { isShown = true; }
                    this._minThickness = 0.2;
                    this._maxThickness = 5;
                    this.color = "#e9e9e9";
                    this.thickness = 1;
                    this.show = isShown;
                }
                AxisReferenceLineSettings.prototype.parse = function () {
                    this.thickness = Math.min(Math.max(this._minThickness, this.thickness), this._maxThickness);
                };
                return AxisReferenceLineSettings;
            }());
            visual.AxisReferenceLineSettings = AxisReferenceLineSettings;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var SubtitleAlignment;
            (function (SubtitleAlignment) {
                SubtitleAlignment[SubtitleAlignment["left"] = "left"] = "left";
                SubtitleAlignment[SubtitleAlignment["center"] = "center"] = "center";
                SubtitleAlignment[SubtitleAlignment["right"] = "right"] = "right";
            })(SubtitleAlignment = visual.SubtitleAlignment || (visual.SubtitleAlignment = {}));
            var SubtitleSettings = /** @class */ (function (_super) {
                __extends(SubtitleSettings, _super);
                function SubtitleSettings() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.titleText = "";
                    _this.fontColor = "#A6A6A6";
                    _this.background = "";
                    _this.alignment = SubtitleAlignment.left;
                    _this.fontFamily = "'Segoe UI', wf_segoe-ui_normal, helvetica, arial, sans-serif";
                    return _this;
                }
                return SubtitleSettings;
            }(visual.FontSizeSettings));
            visual.SubtitleSettings = SubtitleSettings;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            /**
             * We use this class to move the Title option up above the Subtitle at the formatting panel
             */
            var FakeTitleSettings = /** @class */ (function () {
                function FakeTitleSettings() {
                    this.untrackedProperty = false;
                }
                return FakeTitleSettings;
            }());
            visual.FakeTitleSettings = FakeTitleSettings;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var LabelsSettings = /** @class */ (function (_super) {
                __extends(LabelsSettings, _super);
                function LabelsSettings(viewport) {
                    var _this = _super.call(this, viewport) || this;
                    _this.color = "rgb(119, 119, 119)";
                    _this.fontFamily = "'Segoe UI Light', wf_segoe-ui_light, helvetica, arial, sans-serif";
                    _this.isBold = false;
                    _this.isItalic = false;
                    _this.percentile = 100; // This property is an alias of density and it's defined special for Power BI. It's predefined PBI property name in order to create a percentage slider at format panel
                    _this.show = false;
                    return _this;
                }
                Object.defineProperty(LabelsSettings.prototype, "density", {
                    get: function () {
                        return this.percentile;
                    },
                    enumerable: true,
                    configurable: true
                });
                return LabelsSettings;
            }(visual.NumberSettingsBase));
            visual.LabelsSettings = LabelsSettings;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var LegendSettings = /** @class */ (function (_super) {
                __extends(LegendSettings, _super);
                function LegendSettings() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.position = "BottomCenter";
                    _this.showTitle = false;
                    _this.titleText = "";
                    _this.labelColor = "rgb(102, 102, 102)";
                    _this.fontFamily = "'Segoe UI Light', wf_segoe-ui_light, helvetica, arial, sans-serif";
                    return _this;
                }
                return LegendSettings;
            }(visual.FontSizeSettings));
            visual.LegendSettings = LegendSettings;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var KPIIndicatorValueSettings = /** @class */ (function (_super) {
                __extends(KPIIndicatorValueSettings, _super);
                function KPIIndicatorValueSettings(viewport, shouldPropertiesBeHiddenByType) {
                    if (shouldPropertiesBeHiddenByType === void 0) { shouldPropertiesBeHiddenByType = false; }
                    var _this = _super.call(this, viewport, shouldPropertiesBeHiddenByType) || this;
                    _this.fontColor = "#333333";
                    _this.isBold = true;
                    _this.isItalic = false;
                    _this.fontFamily = "'Segoe UI', wf_segoe-ui_normal, helvetica, arial, sans-serif";
                    _this.fontSize = 12;
                    _this.displayUnits = 1;
                    return _this;
                }
                return KPIIndicatorValueSettings;
            }(visual.NumberSettingsBase));
            visual.KPIIndicatorValueSettings = KPIIndicatorValueSettings;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var KPIIndicatorLabelSettings = /** @class */ (function (_super) {
                __extends(KPIIndicatorLabelSettings, _super);
                function KPIIndicatorLabelSettings(viewport) {
                    var _this = _super.call(this, viewport) || this;
                    _this.fontColor = "#acacac";
                    _this.fontSize = 9;
                    _this.isBold = false;
                    return _this;
                }
                return KPIIndicatorLabelSettings;
            }(visual.KPIIndicatorValueSettings));
            visual.KPIIndicatorLabelSettings = KPIIndicatorLabelSettings;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var KPIIndicatorSettings = /** @class */ (function (_super) {
                __extends(KPIIndicatorSettings, _super);
                function KPIIndicatorSettings(viewport) {
                    var _this = _super.call(this, viewport) || this;
                    _this.position = visual.HorizontalLayoutEnum[visual.HorizontalLayoutEnum.Left];
                    _this._maxAmountOfKPIs = 5;
                    _this._default = Object.freeze({
                        color: null,
                        shape: null
                    });
                    _this.kpiIndexPropertyName = "kpiIndex";
                    _this._colors = [
                        "#01b7a8",
                        "#f2c80f",
                        "#fd625e",
                        "#a66999",
                        "#374649"
                    ];
                    _this._shapes = [
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
                    _this._properties = [
                        {
                            name: "color",
                            displayName: function (text) { return text; },
                            defaultValue: function (index) {
                                var color = _this.getElementByIndex(_this._colors, index);
                                return color || _this._colors[0];
                            },
                            type: { fill: { solid: { color: true } } }
                        },
                        {
                            name: "shape",
                            displayName: function () { return "    Indicator"; },
                            defaultValue: function (index) {
                                var shape = _this.getElementByIndex(_this._shapes, index);
                                return shape
                                    ? shape.name
                                    : _this._shapes[0].name;
                            },
                            type: { enumeration: _this.getEnumType() }
                        },
                        {
                            name: _this.kpiIndexPropertyName,
                            displayName: function () { return "    Value"; },
                            defaultValue: function (index) { return index + 1; },
                            type: { numeric: true },
                        },
                    ];
                    _this.applySettingToContext();
                    _this.show = true;
                    _this.fontSize = 12;
                    return _this;
                }
                KPIIndicatorSettings.prototype.getElementByIndex = function (setOfValues, index) {
                    var amountOfValues = setOfValues.length;
                    var currentIndex = index < amountOfValues
                        ? index
                        : Math.round(index / amountOfValues);
                    return setOfValues[currentIndex];
                };
                KPIIndicatorSettings.prototype.applySettingToContext = function () {
                    var _this = this;
                    var _loop_1 = function (index) {
                        this_1._properties.forEach(function (property) {
                            var indexedName = _this.getPropertyName(property.name, index);
                            _this[indexedName] = typeof property.defaultValue === "function"
                                ? property.defaultValue(index)
                                : property.defaultValue;
                        });
                    };
                    var this_1 = this;
                    for (var index = 0; index < this._maxAmountOfKPIs; index++) {
                        _loop_1(index);
                    }
                };
                KPIIndicatorSettings.prototype.getEnumType = function () {
                    var members = this._shapes.map(function (shape) {
                        return {
                            value: shape.name,
                            displayName: shape.displayName
                        };
                    });
                    return visual.createEnumType(members);
                };
                KPIIndicatorSettings.prototype.getPropertyName = function (name, index) {
                    return name + "_" + index;
                };
                KPIIndicatorSettings.prototype.getCurrentKPI = function (kpiIndex) {
                    var _this = this;
                    if (!isNaN(kpiIndex) && kpiIndex !== null) {
                        var _loop_2 = function (index) {
                            var currentKPIIndex = this_2[this_2.getPropertyName(this_2.kpiIndexPropertyName, index)];
                            if (currentKPIIndex === kpiIndex) {
                                return { value: this_2._properties.reduce(function (current, property) {
                                        var indexedName = _this.getPropertyName(property.name, index);
                                        current[property.name] = _this[indexedName];
                                        return current;
                                    }, {}) };
                            }
                        };
                        var this_2 = this;
                        for (var index = 0; index < this._maxAmountOfKPIs; index++) {
                            var state_1 = _loop_2(index);
                            if (typeof state_1 === "object")
                                return state_1.value;
                        }
                    }
                    return this._default;
                };
                return KPIIndicatorSettings;
            }(visual.FontSizeSettings));
            visual.KPIIndicatorSettings = KPIIndicatorSettings;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var KPIIndicatorCustomizableLabelSettings = /** @class */ (function (_super) {
                __extends(KPIIndicatorCustomizableLabelSettings, _super);
                function KPIIndicatorCustomizableLabelSettings(viewport) {
                    var _this = _super.call(this, viewport) || this;
                    _this.label = "";
                    _this.show = false;
                    return _this;
                }
                KPIIndicatorCustomizableLabelSettings.prototype.isShown = function () {
                    return this.show && !!this.label;
                };
                return KPIIndicatorCustomizableLabelSettings;
            }(visual.KPIIndicatorLabelSettings));
            visual.KPIIndicatorCustomizableLabelSettings = KPIIndicatorCustomizableLabelSettings;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var KPIIndicatorValueSignSettings = /** @class */ (function (_super) {
                __extends(KPIIndicatorValueSignSettings, _super);
                function KPIIndicatorValueSignSettings(viewport) {
                    var _this = _super.call(this, viewport) || this;
                    _this.matchKPIColor = true;
                    /**
                     * Below is small hack to change order of properties
                     * The matchKPIColor should be before fontColor for better UX
                     */
                    delete _this.fontColor;
                    _this.fontColor = "#333333";
                    return _this;
                }
                KPIIndicatorValueSignSettings.prototype.parse = function (options) {
                    _super.prototype.parse.call(this, options);
                    this.makePropertyFontColorPropertyEnumerable(!this.matchKPIColor);
                };
                KPIIndicatorValueSignSettings.prototype.makePropertyFontColorPropertyEnumerable = function (isEnumerable) {
                    Object.defineProperty(this, "fontColor", {
                        enumerable: isEnumerable
                    });
                };
                return KPIIndicatorValueSignSettings;
            }(visual.KPIIndicatorValueSettings));
            visual.KPIIndicatorValueSignSettings = KPIIndicatorValueSignSettings;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var LineStyleSettings = /** @class */ (function (_super) {
                __extends(LineStyleSettings, _super);
                function LineStyleSettings() {
                    var _this = _super.call(this, "Line Style", "lineStyle", "lineStyle", LineStyleSettings.DefaultValue) || this;
                    _this._styles = [
                        {
                            displayName: "Solid",
                            value: LineStyleSettings.DefaultValue
                        },
                        {
                            displayName: "Dotted",
                            value: "dottedLine"
                        },
                        {
                            displayName: "Dashed",
                            value: "dashedLine"
                        },
                        {
                            displayName: "Dot-dashed",
                            value: "dotDashedLine"
                        }
                    ];
                    return _this;
                }
                LineStyleSettings.createDefault = function () {
                    return new LineStyleSettings();
                };
                LineStyleSettings.prototype.getEnumType = function () {
                    var members = this._styles.map(function (style) {
                        return {
                            displayName: style.displayName,
                            value: style.value
                        };
                    });
                    return visual.createEnumType(members);
                };
                LineStyleSettings.DefaultValue = "solidLine";
                return LineStyleSettings;
            }(visual.SeriesBoundSettingsBase));
            visual.LineStyleSettings = LineStyleSettings;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var LineThicknessSettings = /** @class */ (function (_super) {
                __extends(LineThicknessSettings, _super);
                function LineThicknessSettings() {
                    var _this = _super.call(this, "Line Thickness", "lineThickness", "thickness", 2) || this;
                    _this.minThickness = 0.25;
                    _this.maxThickness = 10;
                    return _this;
                }
                LineThicknessSettings.createDefault = function () {
                    return new LineThicknessSettings();
                };
                LineThicknessSettings.prototype.parseValue = function (objects) {
                    var value = _super.prototype.parseValue.call(this, objects);
                    return Math.min(Math.max(this.minThickness, value), this.maxThickness);
                };
                return LineThicknessSettings;
            }(visual.SeriesBoundSettingsBase));
            visual.LineThicknessSettings = LineThicknessSettings;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var LayoutSettings = /** @class */ (function () {
                function LayoutSettings() {
                    this._minSupportedHeight = 250;
                    this.autoHideVisualComponents = true;
                    this.auto = true;
                    this.layout = visual.LayoutEnum[visual.LayoutEnum.Top];
                }
                LayoutSettings.prototype.parse = function (options) {
                    if (this.auto) {
                        Object.defineProperty(this, "layout", {
                            enumerable: false
                        });
                        if (options.viewport.height < this._minSupportedHeight) {
                            this._layout = visual.LayoutEnum[visual.LayoutEnum.Left];
                        }
                        else {
                            this._layout = visual.LayoutEnum[visual.LayoutEnum.Top];
                        }
                        return;
                    }
                    this._layout = this.layout;
                };
                LayoutSettings.prototype.getLayout = function () {
                    return this._layout;
                };
                return LayoutSettings;
            }());
            visual.LayoutSettings = LayoutSettings;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var TooltipSettings = /** @class */ (function (_super) {
                __extends(TooltipSettings, _super);
                function TooltipSettings() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.show = true;
                    return _this;
                }
                return TooltipSettings;
            }(visual.NumberSettingsBase));
            visual.TooltipSettings = TooltipSettings;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var TooltipLabelSettings = /** @class */ (function (_super) {
                __extends(TooltipLabelSettings, _super);
                function TooltipLabelSettings() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.label = "";
                    return _this;
                }
                return TooltipLabelSettings;
            }(visual.TooltipSettings));
            visual.TooltipLabelSettings = TooltipLabelSettings;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var DotsSettings = /** @class */ (function () {
                function DotsSettings() {
                    this.radiusFactor = 1.4;
                }
                DotsSettings.prototype.getMarginByThickness = function (thickness, defaultMargin) {
                    if (isNaN(thickness)) {
                        return defaultMargin;
                    }
                    var currentThickness = thickness * this.radiusFactor;
                    return {
                        top: currentThickness,
                        right: currentThickness,
                        bottom: currentThickness,
                        left: currentThickness
                    };
                };
                return DotsSettings;
            }());
            visual.DotsSettings = DotsSettings;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            // powerbi.extensibility.utils.dataview
            var DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;
            /* These viewports describe the minimal viewport for each visual component */
            var kpiCaptionViewport = {
                width: 90,
                height: 90
            };
            var kpiLabelViewport = {
                width: 165,
                height: 165
            };
            var subtitleViewport = {
                width: 150,
                height: 150
            };
            var legendViewport = {
                width: 120,
                height: 120
            };
            var LabelsViewport = {
                width: 80,
                height: 80
            };
            var axisViewportToDecreaseFontSize = {
                width: 70,
                height: 70
            };
            var axisViewportToIncreaseDensity = {
                width: 250,
                height: 250
            };
            var Settings = /** @class */ (function (_super) {
                __extends(Settings, _super);
                function Settings() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.layout = new visual.LayoutSettings();
                    _this.title = new visual.FakeTitleSettings();
                    _this.subtitle = new visual.SubtitleSettings(subtitleViewport);
                    _this.kpiIndicator = new visual.KPIIndicatorSettings(kpiCaptionViewport);
                    _this.kpiIndicatorValue = new visual.KPIIndicatorValueSignSettings(kpiCaptionViewport);
                    _this.kpiIndicatorLabel = new visual.KPIIndicatorCustomizableLabelSettings(kpiLabelViewport);
                    _this.secondKPIIndicatorValue = new visual.KPIIndicatorValueSettings(kpiCaptionViewport);
                    _this.secondKPIIndicatorLabel = new visual.KPIIndicatorCustomizableLabelSettings(kpiLabelViewport);
                    _this.actualValueKPI = new visual.KPIIndicatorValueSettings(kpiCaptionViewport);
                    _this.actualLabelKPI = new visual.KPIIndicatorLabelSettings(kpiLabelViewport);
                    _this.dateValueKPI = new visual.KPIIndicatorValueSettings(kpiCaptionViewport, true);
                    _this.dateLabelKPI = new visual.KPIIndicatorLabelSettings(kpiLabelViewport);
                    _this.labels = new visual.LabelsSettings(LabelsViewport);
                    _this._lineStyle = new visual.LineStyleSettings();
                    _this._lineThickness = new visual.LineThicknessSettings();
                    _this.dots = new visual.DotsSettings();
                    _this.legend = new visual.LegendSettings(legendViewport);
                    _this.xAxis = new visual.AxisSettings(axisViewportToDecreaseFontSize, axisViewportToIncreaseDensity, true);
                    _this.yAxis = new visual.YAxisSettings(axisViewportToDecreaseFontSize, axisViewportToIncreaseDensity, false);
                    _this.referenceLineOfXAxis = new visual.AxisReferenceLineSettings(false);
                    _this.referenceLineOfYAxis = new visual.AxisReferenceLineSettings();
                    _this.tooltipLabel = new visual.TooltipSettings(undefined, true);
                    _this.tooltipVariance = new visual.TooltipLabelSettings();
                    _this.secondTooltipVariance = new visual.TooltipLabelSettings();
                    _this.tooltipValues = new visual.TooltipSettings();
                    return _this;
                }
                Settings.prototype.parseSettings = function (viewport, type) {
                    var _this = this;
                    var options = {
                        viewport: viewport,
                        type: type,
                        isAutoHideBehaviorEnabled: this.layout.autoHideVisualComponents
                    };
                    Object.keys(this)
                        .forEach(function (settingName) {
                        var settingsObj = _this[settingName];
                        if (settingsObj.parse) {
                            settingsObj.parse(options);
                        }
                    });
                };
                Settings.prototype.applyColumnFormat = function (format) {
                    [
                        this.dateValueKPI,
                        this.tooltipLabel
                    ].forEach(function (settings) {
                        settings.setColumnFormat(format);
                    });
                };
                return Settings;
            }(DataViewObjectsParser));
            visual.Settings = Settings;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var DataRepresentationScale = /** @class */ (function () {
                function DataRepresentationScale(scale, isOrdinal) {
                    if (scale === void 0) { scale = null; }
                    if (isOrdinal === void 0) { isOrdinal = false; }
                    this.isOrdinalScale = false;
                    this.baseScale = scale;
                    this.isOrdinalScale = isOrdinal;
                }
                DataRepresentationScale.create = function () {
                    return new DataRepresentationScale();
                };
                DataRepresentationScale.prototype.domain = function (values, type) {
                    var scale;
                    if (values && values.length) {
                        switch (type) {
                            case visual.DataRepresentationTypeEnum.DateType: {
                                scale = d3.time.scale();
                                break;
                            }
                            case visual.DataRepresentationTypeEnum.NumberType: {
                                scale = d3.scale.linear();
                                break;
                            }
                            case visual.DataRepresentationTypeEnum.StringType: {
                                scale = d3.scale.ordinal();
                                this.isOrdinalScale = true;
                                break;
                            }
                        }
                    }
                    if (scale) {
                        scale.domain(values.map(function (x) { return x; }));
                    }
                    this.baseScale = scale;
                    return this;
                };
                DataRepresentationScale.prototype.getDomain = function () {
                    if (!this.baseScale) {
                        return [];
                    }
                    return this.baseScale.domain() || [];
                };
                DataRepresentationScale.prototype.scale = function (value) {
                    if (!this.baseScale) {
                        return 0;
                    }
                    var v = this.baseScale(value);
                    return v;
                };
                DataRepresentationScale.prototype.copy = function () {
                    return new DataRepresentationScale(this.baseScale && this.baseScale.copy(), this.isOrdinalScale);
                };
                DataRepresentationScale.prototype.range = function (rangeValues) {
                    if (this.baseScale) {
                        if (this.isOrdinalScale) {
                            this.baseScale.rangePoints(rangeValues);
                        }
                        else {
                            this.baseScale.range(rangeValues);
                        }
                    }
                    return this;
                };
                Object.defineProperty(DataRepresentationScale.prototype, "isOrdinal", {
                    get: function () {
                        return this.isOrdinalScale;
                    },
                    enumerable: true,
                    configurable: true
                });
                return DataRepresentationScale;
            }());
            visual.DataRepresentationScale = DataRepresentationScale;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var DataRepresentationTypeEnum;
            (function (DataRepresentationTypeEnum) {
                DataRepresentationTypeEnum[DataRepresentationTypeEnum["None"] = 0] = "None";
                DataRepresentationTypeEnum[DataRepresentationTypeEnum["DateType"] = 1] = "DateType";
                DataRepresentationTypeEnum[DataRepresentationTypeEnum["NumberType"] = 2] = "NumberType";
                DataRepresentationTypeEnum[DataRepresentationTypeEnum["StringType"] = 3] = "StringType";
            })(DataRepresentationTypeEnum = visual.DataRepresentationTypeEnum || (visual.DataRepresentationTypeEnum = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted; free of charge; to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""); to deal
 *  in the Software without restriction; including without limitation the rights
 *  to use; copy; modify; merge; publish; distribute; sublicense; and/or sell
 *  copies of the Software; and to permit persons to whom the Software is
 *  furnished to do so; subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*; WITHOUT WARRANTY OF ANY KIND; EXPRESS OR
 *  IMPLIED; INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY;
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM; DAMAGES OR OTHER
 *  LIABILITY; WHETHER IN AN ACTION OF CONTRACT; TORT OR OTHERWISE; ARISING FROM;
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var DataRepresentationPointFilter = /** @class */ (function () {
                function DataRepresentationPointFilter() {
                }
                DataRepresentationPointFilter.prototype.isPointValid = function (point) {
                    return point
                        && point.value !== null
                        && point.value !== undefined
                        && !isNaN(point.value);
                };
                DataRepresentationPointFilter.prototype.filter = function (points) {
                    var _this = this;
                    return points.filter(function (point) { return _this.isPointValid(point); });
                };
                return DataRepresentationPointFilter;
            }());
            visual.DataRepresentationPointFilter = DataRepresentationPointFilter;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var VarianceConverter = /** @class */ (function () {
                function VarianceConverter() {
                }
                VarianceConverter.prototype.getVarianceByCurrentPointsOfSeries = function (firstSeries, secondSeries) {
                    if (!this.isSeriesValid(firstSeries) || !this.isSeriesValid(secondSeries)) {
                        return NaN;
                    }
                    var firstPoint = firstSeries.current, index = firstPoint.index, secondPoint = !isNaN(index) && secondSeries.points[index];
                    return this.getVarianceByPoints(firstPoint, secondPoint);
                };
                VarianceConverter.prototype.isSeriesValid = function (series) {
                    return series && series.current && series.current.value !== null;
                };
                VarianceConverter.prototype.getVarianceByPoints = function (firstPoint, secondePoint) {
                    if (!this.isPointValid(firstPoint) || !this.isPointValid(secondePoint)) {
                        return NaN;
                    }
                    return this.getVariance(firstPoint.value, secondePoint.value);
                };
                VarianceConverter.prototype.isPointValid = function (point) {
                    return point
                        && point.value !== null
                        && point.value !== 0
                        && !isNaN(point.value);
                };
                VarianceConverter.prototype.getVariance = function (firstValue, secondValue) {
                    return firstValue / secondValue - 1;
                };
                return VarianceConverter;
            }());
            visual.VarianceConverter = VarianceConverter;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var ColorHelper = extensibility.utils.color.ColorHelper;
            var DataConverter = /** @class */ (function (_super) {
                __extends(DataConverter, _super);
                function DataConverter(options) {
                    var _this = _super.call(this) || this;
                    _this.seriesFillColorProperty = {
                        objectName: "series",
                        propertyName: "fillColor"
                    };
                    _this.selectionIdBuilder = options.host.createSelectionIdBuilder();
                    return _this;
                }
                DataConverter.prototype.convert = function (options) {
                    var _this = this;
                    var dataView = options.dataView, viewport = options.viewport, style = options.style;
                    var settings = visual.Settings.parse(dataView);
                    var defaultXScale = visual.DataRepresentationScale.create(), defaultYScale = visual.DataRepresentationScale.create();
                    var type = visual.DataRepresentationTypeEnum.None;
                    var dataRepresentation = {
                        viewport: viewport,
                        settings: settings,
                        series: [],
                        x: {
                            type: type,
                            values: [],
                            min: undefined,
                            max: undefined,
                            metadata: undefined,
                            name: undefined,
                            ticks: [],
                            format: undefined
                        },
                        y: {
                            min: undefined,
                            max: undefined,
                            ticks: [],
                            format: undefined,
                            maxTickWidth: 0
                        },
                        scale: {
                            x: defaultXScale,
                            y: defaultYScale
                        },
                        variance: [],
                        variances: [],
                        margin: {
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0
                        }
                    };
                    if (!dataView
                        || !dataView.categorical
                        || !dataView.categorical.categories
                        || !dataView.categorical.categories[0]
                        || !dataView.categorical.categories[0].values
                        || !dataView.categorical.values
                        || !dataView.categorical.values.grouped) {
                        return dataRepresentation;
                    }
                    var groupedValues = dataView.categorical.values.grouped()[0].values, axisCategory = dataView.categorical.categories[0], axisCategoryType = axisCategory.source.type;
                    dataRepresentation.x.metadata = axisCategory.source;
                    dataRepresentation.x.name = axisCategory.source.displayName;
                    if (axisCategoryType.dateTime) {
                        type = visual.DataRepresentationTypeEnum.DateType;
                    }
                    else if (axisCategoryType.integer || axisCategoryType.numeric) {
                        type = visual.DataRepresentationTypeEnum.NumberType;
                    }
                    else if (axisCategoryType.text) {
                        type = visual.DataRepresentationTypeEnum.StringType;
                    }
                    settings.parseSettings(viewport, type);
                    dataRepresentation.x.type = type;
                    var colorHelper = ColorHelper
                        ? new ColorHelper(style.colorPalette, this.seriesFillColorProperty)
                        : new ColorHelper(style && style.colorPalette /* && style.colorPalette.dataColors */, this.seriesFillColorProperty);
                    var series = [];
                    var currentKPIColumn = groupedValues
                        .filter(function (groupedValue) {
                        return groupedValue.source.roles[visual.KPIColumn.name];
                    });
                    var kpiIndexes = (currentKPIColumn
                        && currentKPIColumn[0]
                        && currentKPIColumn[0].values) || [];
                    var maxThickness = NaN;
                    groupedValues.forEach(function (groupedValue, seriesIndex) {
                        if (groupedValue.source.roles[visual.KPIIndicatorValueColumn.name]) {
                            dataRepresentation.variances[0] = groupedValue.values;
                        }
                        if (groupedValue.source.roles[visual.SecondKPIIndicatorValueColumn.name]) {
                            dataRepresentation.variances[1] = groupedValue.values;
                        }
                        if (groupedValue.source.roles[visual.ValuesColumn.name]) {
                            var currentPoint_1 = {
                                axisValue: null,
                                value: NaN,
                                index: NaN,
                                kpiIndex: NaN,
                            };
                            var points = axisCategory
                                .values
                                .map(function (axisValue, categoryIndex) {
                                var value = groupedValue.values[categoryIndex];
                                _this.applyXArguments(dataRepresentation, axisValue);
                                _this.applyYArguments(dataRepresentation, value);
                                var kpiIndex = _this.getKPIIndex(kpiIndexes[categoryIndex]);
                                if (value !== null) {
                                    currentPoint_1.axisValue = axisValue;
                                    currentPoint_1.value = value;
                                    currentPoint_1.index = categoryIndex;
                                    currentPoint_1.kpiIndex = kpiIndex;
                                }
                                return {
                                    axisValue: axisValue,
                                    value: value,
                                    kpiIndex: kpiIndex,
                                };
                            });
                            var selectionId = _this.selectionIdBuilder
                                .withSeries(dataView.categorical.values, groupedValue)
                                .withMeasure(groupedValue.source.queryName)
                                .createSelectionId();
                            var objects = groupedValue.source.objects;
                            var color = colorHelper.getColorForSeriesValue(objects, 
                            // dataView.categorical.values.identityFields, commented
                            seriesIndex);
                            var lineStyle = settings._lineStyle.parseValue(objects), thickness = settings._lineThickness.parseValue(objects);
                            if (isNaN(maxThickness) || thickness > maxThickness) {
                                maxThickness = thickness;
                            }
                            var format = _this.getFormatStringByColumn(groupedValue.source);
                            series.push({
                                points: points,
                                selectionId: selectionId,
                                color: color,
                                format: format,
                                lineStyle: lineStyle,
                                thickness: thickness,
                                current: currentPoint_1,
                                name: groupedValue.source.displayName
                            });
                        }
                    });
                    dataRepresentation.settings.applyColumnFormat(this.getFormatStringByColumn(axisCategory && axisCategory.source));
                    dataRepresentation.series = series;
                    dataRepresentation.x.values = axisCategory.values;
                    dataRepresentation.x.format = dataRepresentation.settings.dateValueKPI.getFormat();
                    dataRepresentation.y.format = series && series[0] && series[0].format;
                    var xScale = this.getXAxisScale(defaultXScale, dataRepresentation.x.min, dataRepresentation.x.max, dataRepresentation.x.type, axisCategory.values);
                    var yMin = this.getNotNaNValue(settings.yAxis.min, dataRepresentation.y.min);
                    var yMax = this.getNotNaNValue(settings.yAxis.max, dataRepresentation.y.max);
                    dataRepresentation.y.min = Math.min(yMin, yMax);
                    dataRepresentation.y.max = Math.max(yMin, yMax);
                    var yScale = defaultYScale.domain([dataRepresentation.y.min, dataRepresentation.y.max], visual.DataRepresentationTypeEnum.NumberType);
                    dataRepresentation.scale = {
                        x: xScale,
                        y: yScale
                    };
                    dataRepresentation.margin = settings.dots.getMarginByThickness(maxThickness, dataRepresentation.margin);
                    if (dataRepresentation.variances[0]) {
                        dataRepresentation.variance.push(dataRepresentation.variances[0]
                            && dataRepresentation.variances[0].length
                            && dataRepresentation.variances[0].slice(-1)[0] || NaN);
                    }
                    else {
                        dataRepresentation.variance.push(this.getVarianceByCurrentPointsOfSeries(series[0], series[1]));
                    }
                    if (dataRepresentation.variances[1]) {
                        dataRepresentation.variance.push(dataRepresentation.variances[1]
                            && dataRepresentation.variances[1].length
                            && dataRepresentation.variances[1].slice(-1)[0] || NaN);
                    }
                    else {
                        dataRepresentation.variance.push(this.getVarianceByCurrentPointsOfSeries(series[0], series[2]));
                    }
                    return dataRepresentation;
                };
                DataConverter.prototype.applyXArguments = function (dataRepresentation, axisValue) {
                    if (dataRepresentation.x.min === undefined) {
                        dataRepresentation.x.min = axisValue;
                    }
                    if (dataRepresentation.x.max === undefined) {
                        dataRepresentation.x.max = axisValue;
                    }
                    if (dataRepresentation.x.type === visual.DataRepresentationTypeEnum.DateType
                        || dataRepresentation.x.type === visual.DataRepresentationTypeEnum.NumberType) {
                        if (axisValue < dataRepresentation.x.min) {
                            dataRepresentation.x.min = axisValue;
                        }
                        if (axisValue > dataRepresentation.x.max) {
                            dataRepresentation.x.max = axisValue;
                        }
                    }
                    else if (dataRepresentation.x.type === visual.DataRepresentationTypeEnum.StringType) {
                        var textLength = this.getLength(axisValue);
                        if (textLength < this.getLength(dataRepresentation.x.min)) {
                            dataRepresentation.x.min = axisValue;
                        }
                        if (textLength > this.getLength(dataRepresentation.x.max)) {
                            dataRepresentation.x.max = axisValue;
                        }
                    }
                };
                DataConverter.prototype.getNotNaNValue = function (value, fallbackValue) {
                    return isNaN(value)
                        ? fallbackValue
                        : value;
                };
                DataConverter.prototype.getLength = function (text) {
                    if (!text || !text.length) {
                        return 0;
                    }
                    return text.length;
                };
                DataConverter.prototype.applyYArguments = function (dataRepresentation, value) {
                    if (dataRepresentation.y.min === undefined) {
                        dataRepresentation.y.min = value;
                    }
                    if (dataRepresentation.y.max === undefined) {
                        dataRepresentation.y.max = value;
                    }
                    if (value !== null && value < dataRepresentation.y.min) {
                        dataRepresentation.y.min = value;
                    }
                    if (value !== null && value > dataRepresentation.y.max) {
                        dataRepresentation.y.max = value;
                    }
                };
                DataConverter.prototype.getKPIIndex = function (kpiIndex) {
                    return kpiIndex === undefined
                        || kpiIndex === null
                        || isNaN(kpiIndex)
                        || kpiIndex instanceof Date
                        ? NaN
                        : kpiIndex;
                };
                DataConverter.prototype.getXAxisScale = function (scale, min, max, type, categoryValues) {
                    var values;
                    switch (type) {
                        case visual.DataRepresentationTypeEnum.DateType:
                        case visual.DataRepresentationTypeEnum.NumberType: {
                            values = [min, max];
                            break;
                        }
                        case visual.DataRepresentationTypeEnum.StringType: {
                            values = categoryValues;
                            break;
                        }
                    }
                    return scale.domain(values, type);
                };
                DataConverter.prototype.getFormatStringByColumn = function (column) {
                    if (!column || !column.format) {
                        return undefined;
                    }
                    return column.format;
                };
                return DataConverter;
            }(visual.VarianceConverter));
            visual.DataConverter = DataConverter;
            function createConverter(options) {
                return new DataConverter(options);
            }
            visual.createConverter = createConverter;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var ComponentContainer = /** @class */ (function () {
                function ComponentContainer(options) {
                    this.baseClassName = "componentContainer";
                    this.components = [];
                    this.element = options.element
                        .append("div")
                        .classed(this.baseClassName, true);
                }
                ComponentContainer.prototype.render = function (options) {
                    this.components.forEach(function (component) {
                        component.render(options);
                        if (component.getMargins) {
                            var margins = component.getMargins();
                            options.data.viewport.height -= margins.height;
                            options.data.viewport.width -= margins.width;
                        }
                    });
                };
                ComponentContainer.prototype.clear = function () {
                    this.components.forEach(function (component) {
                        component.clear();
                    });
                };
                ComponentContainer.prototype.destroy = function () {
                    this.components.forEach(function (component) {
                        component.destroy();
                    });
                    this.components = null;
                    this.element = null;
                };
                return ComponentContainer;
            }());
            visual.ComponentContainer = ComponentContainer;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PixelConverter = powerbi.extensibility.utils.type.PixelConverter;
            var createClassAndSelector = powerbi.extensibility.utils.svg.CssConstants.createClassAndSelector;
            var LineComponent = /** @class */ (function (_super) {
                __extends(LineComponent, _super);
                function LineComponent(options) {
                    var _this = _super.call(this) || this;
                    _this.element = options.element;
                    return _this;
                }
                LineComponent.prototype.render = function (options) {
                    var _this = this;
                    var data = options.data;
                    var _a = options.data, series = _a.series, scale = _a.scale;
                    var firstSeries = series[0];
                    var xScale = scale.x
                        .copy()
                        .range([0, data.viewport.width]);
                    var yScale = scale.y
                        .copy()
                        .range([data.viewport.height, 0]);
                    var line = this.getLine(xScale, yScale);
                    var lineSelection = this.element
                        .selectAll(LineComponent.ElementClassName.selectorName)
                        .data([firstSeries]);
                    lineSelection
                        .enter()
                        .append("svg:path")
                        .classed(LineComponent.ElementClassName.className, true);
                    lineSelection
                        .attr({
                        d: function (series) {
                            var points = _this.filter(series.points);
                            return line(points);
                        },
                        "class": function (series) {
                            return LineComponent.ElementClassName.className + " " + series.lineStyle;
                        }
                    })
                        .style({
                        "stroke": function (series) { return series.color; },
                        "stroke-width": function (series) { return PixelConverter.toString(series.thickness); }
                    });
                    lineSelection
                        .exit()
                        .remove();
                };
                LineComponent.prototype.getLine = function (xScale, yScale) {
                    var r = d3.svg.line()
                        .x(function (data) {
                        var result = xScale.scale(data.axisValue);
                        return result;
                    })
                        .y(function (data) {
                        var result = yScale.scale(data.value);
                        return result;
                    });
                    return r;
                };
                LineComponent.prototype.clear = function () {
                    this.element
                        .selectAll(LineComponent.ElementClassName.selectorName)
                        .remove();
                };
                LineComponent.prototype.destroy = function () {
                    this.element = null;
                };
                LineComponent.ElementClassName = createClassAndSelector("line");
                return LineComponent;
            }(visual.DataRepresentationPointFilter));
            visual.LineComponent = LineComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var createClassAndSelector = powerbi.extensibility.utils.svg.CssConstants.createClassAndSelector;
            var MultiLineComponent = /** @class */ (function () {
                function MultiLineComponent(options) {
                    this.lineComponents = [];
                    this.element = options.element
                        .append("g")
                        .classed(MultiLineComponent.ClassName, true);
                }
                MultiLineComponent.prototype.render = function (options) {
                    var _this = this;
                    var series = options.data.series;
                    var multiLineSelection = this.element
                        .selectAll(MultiLineComponent.ComponentClassName.selectorName)
                        .data(series);
                    multiLineSelection.enter()
                        .append("g")
                        .call(function (selection) {
                        if (!selection || !selection[0]) {
                            return;
                        }
                        selection[0].forEach(function (element) {
                            if (!element) {
                                return;
                            }
                            _this.initComponent(d3.select(element));
                        });
                        var selectionLength = selection[0].length;
                        if (selectionLength < _this.lineComponents.length) {
                            _this.lineComponents
                                .slice(selectionLength)
                                .forEach(function (component) {
                                component.clear();
                                component.destroy();
                            });
                            _this.lineComponents = _this.lineComponents.slice(0, selectionLength);
                        }
                    })
                        .classed(MultiLineComponent.ComponentClassName.className, true);
                    series.forEach(function (dataSeries, index) {
                        var data = _.clone(options.data);
                        data.series = [dataSeries];
                        _this.lineComponents[index].render({ data: data });
                    });
                    multiLineSelection
                        .exit()
                        .remove();
                };
                MultiLineComponent.prototype.initComponent = function (element) {
                    this.lineComponents.push(new visual.LineComponent({ element: element }));
                };
                MultiLineComponent.prototype.clear = function () {
                    this.lineComponents.forEach(function (lineComponent) {
                        lineComponent.clear();
                    });
                };
                MultiLineComponent.prototype.destroy = function () {
                    this.lineComponents.forEach(function (lineComponent) {
                        lineComponent.destroy();
                    });
                    this.element = null;
                    this.lineComponents = null;
                };
                MultiLineComponent.ClassName = "multiLineComponent";
                MultiLineComponent.ComponentClassName = createClassAndSelector("multiLine");
                return MultiLineComponent;
            }());
            visual.MultiLineComponent = MultiLineComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            // powerbi
            var ValueType = powerbi.extensibility.utils.type.ValueType;
            var NumberFormat = extensibility.utils.formatting.numberFormat;
            var DateTimeSequence = powerbi.extensibility.utils.formatting.DateTimeSequence;
            // powerbi.visuals    
            var AxisHelper = extensibility.utils.chart.axis;
            var valueFormatter = extensibility.utils.formatting.valueFormatter;
            var PowerKPIAxisHelper;
            (function (PowerKPIAxisHelper) {
                var DefaultOuterPadding = 0;
                var DefaultInnerTickSize = 6;
                var DefaultOuterTickSize = 0;
                var OrientationLeft = "left";
                var OrientationBottom = "bottom";
                var DefaultXLabelMaxWidth = 1;
                var DefaultXLabelFactor = 2;
                var DefaultMinInterval = 0;
                var MinTickInterval100Pct = 0.01;
                var MinTickIntervalInteger = 1;
                var RecommendedNumberOfTicksSmall = 3;
                var RecommendedNumberOfTicksMiddle = 5;
                var RecommendedNumberOfTicksLarge = 8;
                var AvailableWidthYAxisSmall = 150;
                var AvailableWidthYAxisMiddle = 300;
                var MinAmountOfTicksForDates = 1;
                var MinAmountOfTicks = 0;
                /**
                 * Default ranges are for when we have a field chosen for the axis,
                 * but no values are returned by the query.
                 */
                PowerKPIAxisHelper.emptyDomain = [0, 0];
                var TickLabelPadding = 2; // between text labels, used by AxisHelper
                var MinOrdinalRectThickness = 20;
                var ScalarTickLabelPadding = 3;
                var MinTickCount = 2;
                var DefaultBestTickCount = 3;
                /**
                 * Create a d3 axis including scale. Can be vertical or horizontal, and either datetime, numeric, or text.
                 * @param options The properties used to create the axis.
                 */
                function createAxis(options) {
                    var pixelSpan = options.pixelSpan, dataDomain = options.dataDomain, metaDataColumn = options.metaDataColumn, formatString = options.formatString, outerPadding = options.outerPadding || DefaultOuterPadding, isCategoryAxis = !!options.isCategoryAxis, isScalar = !!options.isScalar, isVertical = !!options.isVertical, useTickIntervalForDisplayUnits = !!options.useTickIntervalForDisplayUnits, getValueFn = options.getValueFn, categoryThickness = options.categoryThickness, axisDisplayUnits = options.axisDisplayUnits, axisPrecision = options.axisPrecision, is100Pct = !!options.is100Pct, tickLabelPadding = options.tickLabelPadding || TickLabelPadding;
                    var dataType = getCategoryValueType(metaDataColumn, isScalar);
                    // Create the Scale
                    var scaleResult = createScale(options);
                    var scale = scaleResult.scale;
                    var bestTickCount = scaleResult.bestTickCount;
                    var scaleDomain = scale.domain();
                    var isLogScaleAllowed = isLogScalePossible(dataDomain, dataType);
                    // fix categoryThickness if scalar and the domain was adjusted when making the scale "nice"
                    if (categoryThickness && isScalar && dataDomain && dataDomain.length === 2) {
                        var oldSpan = dataDomain[1] - dataDomain[0];
                        var newSpan = scaleDomain[1] - scaleDomain[0];
                        if (oldSpan > 0 && newSpan > 0) {
                            categoryThickness = categoryThickness * oldSpan / newSpan;
                        }
                    }
                    var minTickInterval = isScalar
                        ? getMinTickValueInterval(formatString, dataType, is100Pct)
                        : undefined;
                    var tickValues = getRecommendedTickValues(bestTickCount, scale, dataType, isScalar, minTickInterval, options.shouldTheMinValueBeIncluded);
                    if (isScalar
                        && bestTickCount === 1
                        && tickValues
                        && tickValues.length > 1) {
                        tickValues = [tickValues[0]];
                    }
                    if (options.scaleType && options.scaleType === 'log' && isLogScaleAllowed) {
                        tickValues = tickValues.filter(function (d) {
                            return powerOfTen(d);
                        });
                    }
                    var formatter = createFormatter(scaleDomain, dataDomain, dataType, isScalar, formatString, bestTickCount, tickValues, getValueFn, useTickIntervalForDisplayUnits, axisDisplayUnits, axisPrecision);
                    // sets default orientation only, cartesianChart will fix y2 for comboChart
                    // tickSize(pixelSpan) is used to create gridLines
                    var axis = d3.svg.axis()
                        .scale(scale)
                        .tickSize(DefaultInnerTickSize, DefaultOuterTickSize)
                        .orient(isVertical
                        ? OrientationLeft
                        : OrientationBottom)
                        .ticks(bestTickCount)
                        .tickValues(tickValues);
                    var formattedTickValues = [];
                    if (metaDataColumn) {
                        formattedTickValues = formatAxisTickValues(axis, tickValues, formatter, dataType, getValueFn);
                    }
                    var xLabelMaxWidth;
                    // Use category layout of labels if specified, otherwise use scalar layout of labels
                    if (!isScalar && categoryThickness) {
                        xLabelMaxWidth = Math.max(DefaultXLabelMaxWidth, categoryThickness - tickLabelPadding * DefaultXLabelFactor);
                    }
                    else {
                        // When there are 0 or 1 ticks, then xLabelMaxWidth = pixelSpan
                        xLabelMaxWidth = tickValues.length > DefaultXLabelMaxWidth
                            ? getScalarLabelMaxWidth(scale, tickValues)
                            : pixelSpan;
                        xLabelMaxWidth = xLabelMaxWidth - ScalarTickLabelPadding * DefaultXLabelFactor;
                    }
                    return {
                        scale: scale,
                        axis: axis,
                        formatter: formatter,
                        values: formattedTickValues,
                        axisType: dataType,
                        axisLabel: null,
                        isCategoryAxis: isCategoryAxis,
                        xLabelMaxWidth: xLabelMaxWidth,
                        categoryThickness: categoryThickness,
                        outerPadding: outerPadding,
                        usingDefaultDomain: scaleResult.usingDefaultDomain,
                        isLogScaleAllowed: isLogScaleAllowed,
                        dataDomain: dataDomain,
                    };
                }
                PowerKPIAxisHelper.createAxis = createAxis;
                /**
                 * Indicates whether the number is power of 10.
                 */
                function powerOfTen(d) {
                    var value = Math.abs(d);
                    // formula log2(Y)/log2(10) = log10(Y)
                    // because double issues this won"t return exact value
                    // we need to ceil it to nearest number.
                    var log10 = Math.log(value) / Math.LN10;
                    log10 = Math.ceil(log10 - 1e-12);
                    return value / Math.pow(10, log10) === 1;
                }
                PowerKPIAxisHelper.powerOfTen = powerOfTen;
                function getScalarLabelMaxWidth(scale, tickValues) {
                    // find the distance between two ticks. scalar ticks can be anywhere, such as:
                    // |---50----------100--------|
                    if (scale && !_.isEmpty(tickValues)) {
                        return Math.abs(scale(tickValues[1]) - scale(tickValues[0]));
                    }
                    return DefaultXLabelMaxWidth;
                }
                function createFormatter(scaleDomain, dataDomain, dataType, isScalar, formatString, bestTickCount, tickValues, getValueFn, useTickIntervalForDisplayUnits, axisDisplayUnits, axisPrecision) {
                    if (useTickIntervalForDisplayUnits === void 0) { useTickIntervalForDisplayUnits = false; }
                    var formatter;
                    if (dataType.dateTime) {
                        if (isScalar) {
                            var value = new Date(scaleDomain[0]);
                            var value2 = new Date(scaleDomain[1]);
                            // datetime with only one value needs to pass the same value
                            // (from the original dataDomain value, not the adjusted scaleDomain)
                            // so formatting works correctly.
                            if (bestTickCount === 1) {
                                value = value2 = new Date(dataDomain[0]);
                            }
                            // this will ignore the formatString and create one based on the smallest non-zero portion of the values supplied.
                            formatter = valueFormatter.create({
                                format: formatString,
                                value: value,
                                value2: value2,
                                tickCount: bestTickCount,
                            });
                        }
                        else {
                            // Use the model formatString for ordinal datetime
                            formatter = valueFormatter.createDefaultFormatter(formatString, true);
                        }
                    }
                    else {
                        if (useTickIntervalForDisplayUnits && isScalar && tickValues.length > 1) {
                            var value1 = axisDisplayUnits
                                ? axisDisplayUnits
                                : tickValues[1] - tickValues[0];
                            var options = {
                                format: formatString,
                                value: value1,
                                value2: 0,
                                allowFormatBeautification: true,
                            };
                            if (axisPrecision) {
                                options.precision = axisPrecision;
                            }
                            else {
                                options.precision = AxisHelper.calculateAxisPrecision(tickValues[0], tickValues[1], axisDisplayUnits, formatString);
                            }
                            formatter = valueFormatter.create(options);
                        }
                        else {
                            // do not use display units, just the basic value formatter
                            // datetime is handled above, so we are ordinal and either boolean, numeric, or text.
                            formatter = valueFormatter.createDefaultFormatter(formatString, true);
                        }
                    }
                    return formatter;
                }
                PowerKPIAxisHelper.createFormatter = createFormatter;
                function getMinTickValueInterval(formatString, columnType, is100Pct) {
                    var isCustomFormat = formatString && !NumberFormat.isStandardFormat(formatString);
                    if (isCustomFormat) {
                        var precision = NumberFormat.getCustomFormatMetadata(formatString, true).precision;
                        if (formatString.indexOf("%") > -1) {
                            precision += 2; // percent values are multiplied by 100 during formatting
                        }
                        return Math.pow(10, -precision);
                    }
                    else if (is100Pct) {
                        return MinTickInterval100Pct;
                    }
                    else if (columnType.integer) {
                        return MinTickIntervalInteger;
                    }
                    return DefaultMinInterval;
                }
                PowerKPIAxisHelper.getMinTickValueInterval = getMinTickValueInterval;
                /**
                 * Format the linear tick labels or the category labels.
                 */
                function formatAxisTickValues(axis, tickValues, formatter, dataType, getValueFn) {
                    var formattedTickValues = [];
                    if (!getValueFn) {
                        getValueFn = function (data) { return data; };
                    }
                    if (formatter) {
                        axis.tickFormat(function (d) { return formatter.format(getValueFn(d, dataType)); });
                        formattedTickValues = tickValues.map(function (d) { return formatter.format(getValueFn(d, dataType)); });
                    }
                    else {
                        formattedTickValues = tickValues.map(function (d) { return getValueFn(d, dataType); });
                    }
                    return formattedTickValues;
                }
                function isLogScalePossible(domain, axisType) {
                    if (domain == null || domain.length < 2 || isDateTime(axisType)) {
                        return false;
                    }
                    return (domain[0] > 0 && domain[1] > 0)
                        || (domain[0] < 0 && domain[1] < 0); // domain must exclude 0
                }
                PowerKPIAxisHelper.isLogScalePossible = isLogScalePossible;
                function isDateTime(type) {
                    return !!(type && type.dateTime);
                }
                PowerKPIAxisHelper.isDateTime = isDateTime;
                function getRecommendedTickValues(maxTicks, scale, axisType, isScalar, minTickInterval, shouldTheMinValueBeIncluded) {
                    if (shouldTheMinValueBeIncluded === void 0) { shouldTheMinValueBeIncluded = false; }
                    if (!isScalar || isOrdinalScale(scale)) {
                        return getRecommendedTickValuesForAnOrdinalRange(maxTicks, scale.domain());
                    }
                    else if (isDateTime(axisType)) {
                        return getRecommendedTickValuesForADateTimeRange(maxTicks, scale.domain());
                    }
                    return getRecommendedTickValuesForAQuantitativeRange(maxTicks, scale, minTickInterval, shouldTheMinValueBeIncluded);
                }
                PowerKPIAxisHelper.getRecommendedTickValues = getRecommendedTickValues;
                function getRecommendedTickValuesForAnOrdinalRange(maxTicks, labels) {
                    var tickLabels = [];
                    // return no ticks in this case
                    if (maxTicks <= 0) {
                        return tickLabels;
                    }
                    var len = labels.length;
                    if (maxTicks > len) {
                        return labels;
                    }
                    for (var i = 0, step = Math.ceil(len / maxTicks); i < len; i += step) {
                        tickLabels.push(labels[i]);
                    }
                    return tickLabels;
                }
                PowerKPIAxisHelper.getRecommendedTickValuesForAnOrdinalRange = getRecommendedTickValuesForAnOrdinalRange;
                function getRecommendedTickValuesForAQuantitativeRange(maxTicks, scale, minInterval, shouldTheMinValueBeIncluded) {
                    if (shouldTheMinValueBeIncluded === void 0) { shouldTheMinValueBeIncluded = false; }
                    var tickLabels = [];
                    // if maxticks is zero return none
                    if (maxTicks === 0) {
                        return tickLabels;
                    }
                    if (scale.ticks) {
                        if (shouldTheMinValueBeIncluded && scale.domain) {
                            var domain = scale.domain();
                            var minValue = domain[0];
                            var maxValue = domain[1] !== undefined && domain[1] !== null
                                ? domain[1]
                                : minValue;
                            var span = Math.abs(maxValue - minValue);
                            var step = Math.pow(10, Math.floor(Math.log(span / maxTicks) / Math.LN10));
                            var err = maxTicks / span * step;
                            if (err <= .15) {
                                step *= 10;
                            }
                            else if (err <= .35) {
                                step *= 5;
                            }
                            else if (err <= .75) {
                                step *= 2;
                            }
                            if (!isNaN(step) && isFinite(step)) {
                                tickLabels = d3.range(minValue, maxValue, step);
                            }
                        }
                        else {
                            tickLabels = scale.ticks(maxTicks);
                            if (tickLabels.length > maxTicks && maxTicks > 1) {
                                tickLabels = scale.ticks(maxTicks - 1);
                            }
                            if (tickLabels.length < MinTickCount) {
                                tickLabels = scale.ticks(maxTicks + 1);
                            }
                        }
                        tickLabels = createTrueZeroTickLabel(tickLabels);
                        if (minInterval && tickLabels.length > 1) {
                            var tickInterval = tickLabels[1] - tickLabels[0];
                            while (tickInterval > 0 && tickInterval < minInterval) {
                                for (var i = 1; i < tickLabels.length; i++) {
                                    tickLabels.splice(i, 1);
                                }
                                tickInterval = tickInterval * 2;
                            }
                            // keep at least two labels - the loop above may trim all but one if we have odd # of tick labels and dynamic range < minInterval
                            if (tickLabels.length === 1) {
                                tickLabels.push(tickLabels[0] + minInterval);
                            }
                        }
                        return tickLabels;
                    }
                    return tickLabels;
                }
                PowerKPIAxisHelper.getRecommendedTickValuesForAQuantitativeRange = getRecommendedTickValuesForAQuantitativeRange;
                function getRecommendedTickValuesForADateTimeRange(maxTicks, dataDomain) {
                    var tickLabels = [];
                    if (dataDomain[0] === 0 && dataDomain[1] === 0) {
                        return [];
                    }
                    var dateTimeTickLabels = DateTimeSequence.calculate(new Date(dataDomain[0]), new Date(dataDomain[1]), maxTicks).sequence;
                    tickLabels = dateTimeTickLabels.map(function (d) { return d.getTime(); });
                    tickLabels = ensureValuesInRange(tickLabels, dataDomain[0], dataDomain[1]);
                    return tickLabels;
                }
                function isOrdinalScale(scale) {
                    return typeof scale.invert === "undefined";
                }
                PowerKPIAxisHelper.isOrdinalScale = isOrdinalScale;
                /**
                 * Gets the ValueType of a category column, defaults to Text if the type is not present.
                 */
                function getCategoryValueType(metadataColumn, isScalar) {
                    if (metadataColumn && columnDataTypeHasValue(metadataColumn.type)) {
                        return metadataColumn.type;
                    }
                    if (isScalar) {
                        return ValueType.fromDescriptor({ numeric: true });
                    }
                    return ValueType.fromDescriptor({ text: true });
                }
                PowerKPIAxisHelper.getCategoryValueType = getCategoryValueType;
                function columnDataTypeHasValue(dataType) {
                    return dataType && (dataType.bool || dataType.numeric || dataType.text || dataType.dateTime);
                }
                PowerKPIAxisHelper.columnDataTypeHasValue = columnDataTypeHasValue;
                function createScale(options) {
                    var pixelSpan = options.pixelSpan, dataDomain = options.dataDomain, metaDataColumn = options.metaDataColumn, isScalar = options.isScalar, isVertical = options.isVertical, forcedTickCount = options.forcedTickCount, shouldClamp = options.shouldClamp, maxTickCount = options.maxTickCount, density = options.density;
                    var outerPadding = options.outerPadding || DefaultOuterPadding, minOrdinalRectThickness = options.minOrdinalRectThickness || MinOrdinalRectThickness;
                    var dataType = getCategoryValueType(metaDataColumn, isScalar);
                    var maxTicks = isVertical
                        ? getRecommendedNumberOfTicksForYAxis(pixelSpan)
                        : getRecommendedNumberOfTicksForXAxis(pixelSpan, minOrdinalRectThickness);
                    if (maxTickCount &&
                        maxTicks > maxTickCount) {
                        maxTicks = maxTickCount;
                    }
                    var scalarDomain = dataDomain
                        ? dataDomain.slice()
                        : null;
                    var bestTickCount = maxTicks;
                    var scale;
                    var usingDefaultDomain = false;
                    if (dataDomain == null
                        || (dataDomain.length === 2 && dataDomain[0] == null && dataDomain[1] == null)
                        || (dataDomain.length !== 2 && isScalar)) {
                        usingDefaultDomain = true;
                        if (dataType.dateTime || !isOrdinal(dataType)) {
                            dataDomain = PowerKPIAxisHelper.emptyDomain;
                        }
                        else {
                            dataDomain = [];
                        }
                        if (isOrdinal(dataType)) {
                            scale = createOrdinalScale(pixelSpan, dataDomain);
                        }
                        else {
                            scale = createNumericalScale(options.scaleType, pixelSpan, dataDomain, dataType, outerPadding, bestTickCount);
                        }
                    }
                    else {
                        if (isScalar && dataDomain.length > 0) {
                            bestTickCount = forcedTickCount !== undefined
                                ? (maxTicks !== 0 ? forcedTickCount : 0)
                                : getBestNumberOfTicks(dataDomain[0], dataDomain[dataDomain.length - 1], [metaDataColumn], maxTicks, dataType.dateTime);
                            var normalizedRange = normalizeLinearDomain({
                                min: dataDomain[0],
                                max: dataDomain[dataDomain.length - 1]
                            });
                            scalarDomain = [
                                normalizedRange.min,
                                normalizedRange.max
                            ];
                        }
                        if (isScalar && dataType.numeric && !dataType.dateTime) {
                            // Note: Don't pass bestTickCount to createNumericalScale, because it overrides boundaries of the domain.
                            scale = createNumericalScale(options.scaleType, pixelSpan, scalarDomain, dataType, outerPadding, null, shouldClamp);
                            bestTickCount = maxTicks === 0
                                ? 0
                                : getAmountOfTicksByDensity(Math.floor((pixelSpan - outerPadding) / minOrdinalRectThickness), density);
                        }
                        else if (isScalar && dataType.dateTime) {
                            // Use of a linear scale, instead of a d3.time.scale, is intentional since we want
                            // to control the formatting of the time values, since d3"s implementation isn"t
                            // in accordance to our design.
                            // scalarDomain: should already be in long-int time (via category.values[0].getTime())
                            scale = createLinearScale(pixelSpan, scalarDomain, outerPadding, null, shouldClamp); // DO NOT PASS TICKCOUNT
                            bestTickCount = maxTicks === 0 ? 0
                                : getAmountOfTicksByDensity((Math.max(MinAmountOfTicksForDates, (pixelSpan - outerPadding) / minOrdinalRectThickness)), density);
                            bestTickCount = bestTickCount < MinAmountOfTicksForDates
                                ? MinAmountOfTicksForDates
                                : bestTickCount;
                        }
                        else if (dataType.text || dataType.dateTime || dataType.numeric || dataType.bool) {
                            scale = createOrdinalScale(pixelSpan, scalarDomain);
                            bestTickCount = maxTicks === 0
                                ? 0
                                : getAmountOfTicksByDensity((Math.min(scalarDomain.length, (pixelSpan - outerPadding) / minOrdinalRectThickness)), density);
                        }
                    }
                    // vertical ordinal axis (e.g. categorical bar chart) does not need to reverse
                    if (isVertical && isScalar) {
                        scale.range(scale.range().reverse());
                    }
                    normalizeInfinityInScale(scale);
                    return {
                        scale: scale,
                        bestTickCount: bestTickCount,
                        usingDefaultDomain: usingDefaultDomain,
                    };
                }
                PowerKPIAxisHelper.createScale = createScale;
                function getAmountOfTicksByDensity(amountOfTicks, density) {
                    return Math.floor(Math.max(amountOfTicks, MinAmountOfTicks) * density / 100);
                }
                function normalizeInfinityInScale(scale) {
                    // When large values (eg Number.MAX_VALUE) are involved, a call to scale.nice occasionally
                    // results in infinite values being included in the domain. To correct for that, we need to
                    // re-normalize the domain now to not include infinities.
                    var scaledDomain = scale.domain();
                    for (var i = 0, len = scaledDomain.length; i < len; ++i) {
                        if (scaledDomain[i] === Number.POSITIVE_INFINITY) {
                            scaledDomain[i] = Number.MAX_VALUE;
                        }
                        else if (scaledDomain[i] === Number.NEGATIVE_INFINITY) {
                            scaledDomain[i] = -Number.MAX_VALUE;
                        }
                    }
                    scale.domain(scaledDomain);
                }
                PowerKPIAxisHelper.normalizeInfinityInScale = normalizeInfinityInScale;
                function createOrdinalScale(pixelSpan, dataDomain) {
                    return d3.scale.ordinal()
                        .rangePoints([0, pixelSpan])
                        .domain(dataDomain);
                }
                PowerKPIAxisHelper.createOrdinalScale = createOrdinalScale;
                function normalizeLinearDomain(domain) {
                    if (isNaN(domain.min) || isNaN(domain.max)) {
                        domain.min = PowerKPIAxisHelper.emptyDomain[0];
                        domain.max = PowerKPIAxisHelper.emptyDomain[1];
                    }
                    else if (domain.min === domain.max) {
                        // d3 linear scale will give zero tickValues if max === min, so extend a little
                        domain.min = domain.min < 0 ? domain.min * 1.2 : domain.min * 0.8;
                        domain.max = domain.max < 0 ? domain.max * 0.8 : domain.max * 1.2;
                    }
                    else {
                        // Check that min is very small and is a negligable portion of the whole domain.
                        // (fix floating pt precision bugs)
                        // sometimes highlight value math causes small negative numbers which makes the axis add
                        // a large tick interval instead of just rendering at zero.
                        if (Math.abs(domain.min) < 0.0001 && domain.min / (domain.max - domain.min) < 0.0001) {
                            domain.min = 0;
                        }
                    }
                    return domain;
                }
                // this function can return different scales e.g. log, linear
                // NOTE: export only for testing, do not access directly
                function createNumericalScale(axisScaleType, pixelSpan, dataDomain, dataType, outerPadding, niceCount, shouldClamp) {
                    if (outerPadding === void 0) { outerPadding = 0; }
                    return createLinearScale(pixelSpan, dataDomain, outerPadding, niceCount, shouldClamp);
                }
                PowerKPIAxisHelper.createNumericalScale = createNumericalScale;
                // NOTE: export only for testing, do not access directly
                function createLinearScale(pixelSpan, dataDomain, outerPadding, niceCount, shouldClamp) {
                    if (outerPadding === void 0) { outerPadding = 0; }
                    var originalScale = d3.scale.linear()
                        .range([dataDomain[0], dataDomain[1]])
                        .domain([0, pixelSpan])
                        .clamp(false);
                    var end = pixelSpan - outerPadding;
                    var scale = d3.scale.linear()
                        .range([0, end])
                        .domain([originalScale(0), originalScale(end)])
                        .clamp(shouldClamp);
                    // we use millisecond ticks since epoch for datetime, so we don"t want any "nice" with numbers like 17398203392.
                    if (niceCount) {
                        scale.nice(niceCount);
                    }
                    return scale;
                }
                PowerKPIAxisHelper.createLinearScale = createLinearScale;
                function getRecommendedNumberOfTicksForXAxis(availableWidth, minOrdinalRectThickness) {
                    var numberOfTicks = RecommendedNumberOfTicksLarge;
                    for (; numberOfTicks > 1; numberOfTicks--) {
                        if (numberOfTicks * minOrdinalRectThickness < availableWidth) {
                            break;
                        }
                    }
                    return numberOfTicks;
                }
                PowerKPIAxisHelper.getRecommendedNumberOfTicksForXAxis = getRecommendedNumberOfTicksForXAxis;
                function getRecommendedNumberOfTicksForYAxis(availableWidth) {
                    if (availableWidth < AvailableWidthYAxisSmall) {
                        return RecommendedNumberOfTicksSmall;
                    }
                    if (availableWidth < AvailableWidthYAxisMiddle) {
                        return RecommendedNumberOfTicksMiddle;
                    }
                    return RecommendedNumberOfTicksLarge;
                }
                PowerKPIAxisHelper.getRecommendedNumberOfTicksForYAxis = getRecommendedNumberOfTicksForYAxis;
                function isOrdinal(type) {
                    return !!(type
                        && (type.text
                            || type.bool
                            || (type.misc && type.misc.barcode)
                            || (type.geography && type.geography.postalCode)));
                }
                PowerKPIAxisHelper.isOrdinal = isOrdinal;
                /**
                 * Get the best number of ticks based on minimum value, maximum value,
                 * measure metadata and max tick count.
                 *
                 * @param min The minimum of the data domain.
                 * @param max The maximum of the data domain.
                 * @param valuesMetadata The measure metadata array.
                 * @param maxTickCount The max count of intervals.
                 * @param isDateTime - flag to show single tick when min is equal to max.
                 */
                function getBestNumberOfTicks(min, max, valuesMetadata, maxTickCount, isDateTime) {
                    if (isNaN(min) || isNaN(max)) {
                        return DefaultBestTickCount;
                    }
                    if (maxTickCount <= 1 || (max <= 1 && min >= -1)) {
                        return maxTickCount;
                    }
                    if (min === max) {
                        // datetime needs to only show one tick value in this case so formatting works correctly
                        if (!!isDateTime) {
                            return 1;
                        }
                        return DefaultBestTickCount;
                    }
                    if (hasNonIntegerData(valuesMetadata)) {
                        return maxTickCount;
                    }
                    // e.g. 5 - 2 + 1 = 4, => [2,3,4,5]
                    return Math.min(max - min + 1, maxTickCount);
                }
                PowerKPIAxisHelper.getBestNumberOfTicks = getBestNumberOfTicks;
                function ensureValuesInRange(values, min, max) {
                    var filteredValues = values.filter(function (v) { return v >= min && v <= max; });
                    if (filteredValues.length < 2) {
                        filteredValues = [min, max];
                    }
                    return filteredValues;
                }
                PowerKPIAxisHelper.ensureValuesInRange = ensureValuesInRange;
                function hasNonIntegerData(valuesMetadata) {
                    for (var i = 0, len = valuesMetadata.length; i < len; i++) {
                        var currentMetadata = valuesMetadata[i];
                        if (currentMetadata && currentMetadata.type && !currentMetadata.type.integer) {
                            return true;
                        }
                    }
                    return false;
                }
                PowerKPIAxisHelper.hasNonIntegerData = hasNonIntegerData;
                /**
                 * Round out very small zero tick values (e.g. -1e-33 becomes 0).
                 *
                 * @param ticks Array of numbers (from d3.scale.ticks([maxTicks])).
                 * @param epsilon Max ratio of calculated tick interval which we will recognize as zero.
                 *
                 * e.g.
                 *     ticks = [-2, -1, 1e-10, 3, 4]; epsilon = 1e-5;
                 *     closeZero = 1e-5 * | 2 - 1 | = 1e-5
                 *     // Tick values <= 1e-5 replaced with 0
                 *     return [-2, -1, 0, 3, 4];
                 */
                function createTrueZeroTickLabel(ticks, epsilon) {
                    if (epsilon === void 0) { epsilon = 1e-5; }
                    if (!ticks || ticks.length < 2) {
                        return ticks;
                    }
                    var closeZero = epsilon * Math.abs(ticks[1] - ticks[0]);
                    return ticks.map(function (tick) { return Math.abs(tick) <= closeZero ? 0 : tick; });
                }
            })(PowerKPIAxisHelper = visual.PowerKPIAxisHelper || (visual.PowerKPIAxisHelper = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PixelConverter = powerbi.extensibility.utils.type.PixelConverter;
            var valueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;
            var TextMeasurementService = powerbi.extensibility.utils.formatting.textMeasurementService;
            var AxisBaseComponent = /** @class */ (function () {
                function AxisBaseComponent() {
                    this.invisibleClassName = "invisible";
                    this.isEnabled = true;
                    this.fontSize = 11;
                    this.additionalXAxisOffset = 5;
                    this.maxAmountOfTicks = 50;
                }
                AxisBaseComponent.prototype.hide = function (isHidden) {
                    if (this.svgElement) {
                        this.svgElement.classed(this.invisibleClassName, !isHidden);
                    }
                };
                AxisBaseComponent.prototype.clear = function () {
                    this.element
                        .selectAll("*")
                        .remove();
                };
                AxisBaseComponent.prototype.destroy = function () {
                    this.element = null;
                    this.svgElement = null;
                };
                AxisBaseComponent.prototype.updateSvgViewport = function (viewport) {
                    this.svgElement.style({
                        width: PixelConverter.toString(viewport.width),
                        height: PixelConverter.toString(viewport.height)
                    });
                };
                AxisBaseComponent.prototype.getLabelHeight = function (value, formatter, fontSize, fontFamily) {
                    var text = formatter.format(value), textProperties = this.getTextProperties(text, fontSize, fontFamily);
                    return TextMeasurementService.measureSvgTextHeight(textProperties, text);
                };
                AxisBaseComponent.prototype.getLabelWidth = function (values, formatter, fontSize, fontFamily) {
                    var _this = this;
                    var width = Math.max.apply(Math, values.map(function (value) {
                        var text = formatter.format(value), textProperties = _this.getTextProperties(text, fontSize, fontFamily);
                        return TextMeasurementService.measureSvgTextWidth(textProperties, text);
                    }));
                    return isFinite(width)
                        ? width
                        : 0;
                };
                AxisBaseComponent.prototype.getTextProperties = function (text, fontSize, fontFamily) {
                    return {
                        text: text,
                        fontFamily: fontFamily,
                        fontSize: PixelConverter.toString(fontSize)
                    };
                };
                AxisBaseComponent.prototype.getValueFormatterOfXAxis = function (x, xAxis) {
                    var minValue, maxValue, precision;
                    if (x.type === visual.DataRepresentationTypeEnum.NumberType) {
                        minValue = xAxis.displayUnits || x.max;
                        precision = xAxis.precision;
                    }
                    else {
                        minValue = x.min;
                        maxValue = x.max;
                    }
                    return this.getValueFormatter(minValue, maxValue, x.metadata, this.maxAmountOfTicks, precision, x.format || undefined);
                };
                AxisBaseComponent.prototype.getValueFormatter = function (min, max, metadata, tickCount, precision, valueFormat) {
                    return valueFormatter.create({
                        tickCount: tickCount,
                        precision: precision,
                        format: valueFormat,
                        value: min,
                        value2: max,
                        columnType: metadata && metadata.type
                    });
                };
                return AxisBaseComponent;
            }());
            visual.AxisBaseComponent = AxisBaseComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PixelConverter = powerbi.extensibility.utils.type.PixelConverter;
            var TextMeasurementService = powerbi.extensibility.utils.formatting.textMeasurementService;
            // powerbi.visuals
            var SVGUtil = extensibility.utils.svg;
            var XAxisComponent = /** @class */ (function (_super) {
                __extends(XAxisComponent, _super);
                function XAxisComponent(options) {
                    var _this = _super.call(this) || this;
                    _this.labelPadding = 8;
                    _this.elementClassName = "visualXAxis";
                    _this.elementClassNameContainer = "visualXAxisContainer";
                    _this.maxElementHeight = 0;
                    _this.maxElementWidth = 0;
                    _this.widthOfTheLatestLabel = 0;
                    _this.mainElementYOffset = -7.5;
                    _this.svgElement = options.element
                        .append("div")
                        .classed(_this.elementClassName, true)
                        .append("svg")
                        .classed(_this.elementClassNameContainer, true);
                    _this.element = _this.svgElement
                        .append("g")
                        .attr({
                        transform: SVGUtil.translate(0, _this.mainElementYOffset)
                    });
                    return _this;
                }
                XAxisComponent.prototype.render = function (options) {
                    var xAxis = options.data.settings.xAxis;
                    this.isEnabled = xAxis.show;
                    this.hide(this.isEnabled);
                    this.renderComponent(options);
                };
                XAxisComponent.prototype.renderComponent = function (options) {
                    var _this = this;
                    var _a = options.data, width = _a.viewport.width, margin = _a.margin, xAxis = _a.settings.xAxis, y = _a.y, x = _a.x, _b = _a.x, min = _b.min, max = _b.max, metadata = _b.metadata, type = _b.type, scale = _a.scale;
                    this.fontSize = PixelConverter.fromPointToPixel(xAxis.fontSize);
                    var formatter = this.getValueFormatterOfXAxis(x, xAxis);
                    var domain = scale.x.getDomain();
                    this.maxElementHeight = this.getLabelHeight(max, formatter, this.fontSize, xAxis.fontFamily);
                    this.maxElementWidth = this.getLabelWidth([min, max], formatter, this.fontSize, xAxis.fontFamily);
                    this.widthOfTheLatestLabel = this.getLabelWidth([domain.slice(-1)[0] || ""], formatter, this.fontSize, xAxis.fontFamily);
                    var axisProperties = this.getAxisProperties(width - this.getWidthOffsetBasedOnLabelWidth(), domain, metadata, !scale.x.isOrdinal, xAxis.density);
                    var axis = axisProperties.axis;
                    x.ticks = axis.tickValues();
                    this.svgElement.style({
                        "font-family": xAxis.fontFamily,
                        "font-size": PixelConverter.toString(this.fontSize),
                        fill: xAxis.fontColor
                    });
                    this.updateSvgViewport({
                        width: width + margin.left,
                        height: this.maxElementHeight
                    });
                    this.element.attr({
                        transform: SVGUtil.translate(0, 0)
                    });
                    var i = 0;
                    axis
                        .orient("bottom")
                        .tickFormat(function (item) {
                        var index = i++;
                        var currentValue = type === visual.DataRepresentationTypeEnum.DateType
                            ? new Date(item)
                            : item;
                        var formattedLabel = metadata && metadata.type && metadata.type.dateTime
                            ? axisProperties.formatter.format(currentValue)
                            : formatter.format(currentValue);
                        var availableWidth = NaN;
                        if (_this.maxElementWidth > width) {
                            availableWidth = width;
                        }
                        if (index === 0 && _this.maxElementWidth / 2 > y.maxTickWidth) {
                            availableWidth = y.maxTickWidth * 2;
                        }
                        if (!isNaN(availableWidth)) {
                            return TextMeasurementService.getTailoredTextOrDefault(_this.getTextProperties(formattedLabel, _this.fontSize, xAxis.fontFamily), availableWidth);
                        }
                        return formattedLabel;
                    });
                    this.element.call(axis);
                };
                XAxisComponent.prototype.getWidthOffsetBasedOnLabelWidth = function () {
                    return this.widthOfTheLatestLabel / 2;
                };
                XAxisComponent.prototype.getAxisProperties = function (pixelSpan, dataDomain, metaDataColumn, isScalar, density) {
                    return visual.PowerKPIAxisHelper.createAxis({
                        pixelSpan: pixelSpan,
                        dataDomain: dataDomain,
                        isScalar: isScalar,
                        density: density,
                        metaDataColumn: metaDataColumn,
                        isVertical: false,
                        isCategoryAxis: true,
                        formatString: undefined,
                        outerPadding: 0,
                        useTickIntervalForDisplayUnits: true,
                        shouldClamp: false,
                        // outerPaddingRatio: 0,
                        innerPaddingRatio: 1,
                        tickLabelPadding: undefined,
                        minOrdinalRectThickness: this.maxElementWidth + this.labelPadding
                    });
                };
                XAxisComponent.prototype.getMargins = function () {
                    if (!this.isEnabled) {
                        return {
                            width: 0,
                            height: 0
                        };
                    }
                    return {
                        width: this.getWidthOffsetBasedOnLabelWidth(),
                        height: this.maxElementHeight + this.additionalXAxisOffset
                    };
                };
                return XAxisComponent;
            }(visual.AxisBaseComponent));
            visual.XAxisComponent = XAxisComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PixelConverter = powerbi.extensibility.utils.type.PixelConverter;
            var TextMeasurementService = powerbi.extensibility.utils.formatting.textMeasurementService;
            var SVGUtil = extensibility.utils.svg;
            var valueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;
            var YAxisComponent = /** @class */ (function (_super) {
                __extends(YAxisComponent, _super);
                function YAxisComponent(options) {
                    var _this = _super.call(this) || this;
                    _this.elementClassName = "visualYAxis";
                    _this.additionalOffset = 16;
                    _this.labelOffset = 12;
                    _this.maxLabelWidth = 0;
                    _this.maxLabelHeight = 0;
                    _this.maxXAxisLabelWidth = 100;
                    _this.valueFormat = valueFormatter.DefaultNumericFormat;
                    _this.svgElement = options.element
                        .append("svg")
                        .style({
                        "font-size": PixelConverter.toString(_this.fontSize)
                    })
                        .classed(_this.elementClassName, true);
                    _this.element = _this.svgElement.append("g");
                    return _this;
                }
                YAxisComponent.prototype.render = function (options) {
                    var yAxis = options.data.settings.yAxis;
                    this.isEnabled = yAxis.show;
                    this.hide(this.isEnabled);
                    this.renderComponent(options);
                };
                YAxisComponent.prototype.renderComponent = function (options) {
                    var _this = this;
                    var _a = options.data, viewport = _a.viewport, yAxis = _a.settings.yAxis, y = _a.y, margin = _a.margin, min = y.min, max = y.max;
                    var width = viewport.width, height = viewport.height;
                    var xAxisTickHight = this.computeXAxisTickHeight(options);
                    height -= xAxisTickHight;
                    this.fontSize = PixelConverter.fromPointToPixel(yAxis.fontSize);
                    var formatter = this.getValueFormatter(yAxis.displayUnits || max, undefined, undefined, undefined, yAxis.precision, y.format || this.valueFormat);
                    this.maxLabelHeight = this.getLabelHeight(max, formatter, this.fontSize, yAxis.fontFamily);
                    var availableWidth = width / 2;
                    var axisProperties = this.getAxisProperties(height, [min, max], yAxis.density, yAxis.density === yAxis.maxDensity);
                    var axis = axisProperties.axis;
                    y.ticks = axis.tickValues();
                    var ticks = yAxis.show && y.ticks && y.ticks.length
                        ? y.ticks
                        : [];
                    this.maxLabelWidth = yAxis.show
                        ? this.getLabelWidth(ticks, formatter, this.fontSize, yAxis.fontFamily)
                        : this.computeXAxisTickWidth(options);
                    y.maxTickWidth = this.getTickWidth();
                    var shouldLabelsBeTruncated = false;
                    if (this.maxLabelWidth > availableWidth) {
                        this.maxLabelWidth = availableWidth;
                        shouldLabelsBeTruncated = true;
                    }
                    this.svgElement.style({
                        "font-family": yAxis.fontFamily,
                        "font-size": PixelConverter.toString(this.fontSize),
                        fill: yAxis.fontColor
                    });
                    this.updateSvgViewport({
                        width: this.getMargins().width,
                        height: height - margin.top
                    });
                    this.updateMargin(margin);
                    this.element.attr({
                        transform: SVGUtil.translate(this.maxLabelWidth + this.labelOffset, this.maxLabelHeight / 2)
                    });
                    axis.tickFormat(function (item) {
                        var formattedLabel = formatter.format(item);
                        if (shouldLabelsBeTruncated) {
                            return TextMeasurementService.getTailoredTextOrDefault(_this.getTextProperties(formattedLabel, _this.fontSize, yAxis.fontFamily), availableWidth);
                        }
                        return formattedLabel;
                    });
                    this.element.call(axis);
                };
                YAxisComponent.prototype.computeXAxisTickHeight = function (options) {
                    var _a = options.data, x = _a.x, xAxis = _a.settings.xAxis;
                    if (!xAxis.show) {
                        return 0;
                    }
                    var formatter = this.getValueFormatterOfXAxis(x, xAxis);
                    return this.getLabelHeight(x.max, formatter, PixelConverter.fromPointToPixel(xAxis.fontSize), xAxis.fontFamily) + this.additionalXAxisOffset;
                };
                YAxisComponent.prototype.computeXAxisTickWidth = function (options) {
                    var _a = options.data, x = _a.x, xAxis = _a.settings.xAxis;
                    if (!xAxis.show) {
                        return 0;
                    }
                    var formatter = this.getValueFormatterOfXAxis(x, xAxis);
                    var width = this.getLabelWidth([x.min, x.max], formatter, PixelConverter.fromPointToPixel(xAxis.fontSize), xAxis.fontFamily);
                    return Math.min(this.maxXAxisLabelWidth, width / 2);
                };
                YAxisComponent.prototype.updateMargin = function (margin) {
                    this.svgElement.style({
                        "padding-top": PixelConverter.toString(margin.top)
                    });
                };
                YAxisComponent.prototype.getAxisProperties = function (pixelSpan, dataDomain, density, isDensityAtMax) {
                    return visual.PowerKPIAxisHelper.createAxis({
                        pixelSpan: pixelSpan - this.maxLabelHeight / 2,
                        dataDomain: dataDomain,
                        density: density,
                        isVertical: true,
                        isScalar: true,
                        isCategoryAxis: false,
                        metaDataColumn: null,
                        formatString: undefined,
                        outerPadding: this.maxLabelHeight / 2,
                        useTickIntervalForDisplayUnits: true,
                        shouldClamp: false,
                        // outerPaddingRatio: 0,
                        is100Pct: true,
                        innerPaddingRatio: 1,
                        tickLabelPadding: undefined,
                        minOrdinalRectThickness: this.maxLabelHeight,
                        shouldTheMinValueBeIncluded: isDensityAtMax
                    });
                };
                YAxisComponent.prototype.getMargins = function () {
                    return {
                        width: this.getTickWidth(),
                        height: this.isEnabled
                            ? this.maxLabelHeight / 2
                            : 0
                    };
                };
                YAxisComponent.prototype.getTickWidth = function () {
                    return this.maxLabelWidth + this.additionalOffset;
                };
                return YAxisComponent;
            }(visual.AxisBaseComponent));
            visual.YAxisComponent = YAxisComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var AxesComponent = /** @class */ (function () {
                function AxesComponent(options) {
                    this.element = options.element;
                    this.components = [
                        new visual.YAxisComponent({ element: this.element }),
                        new visual.XAxisComponent({ element: this.element }),
                    ];
                }
                AxesComponent.prototype.render = function (options) {
                    var viewport = _.clone(options.data.viewport);
                    this.components.forEach(function (component) {
                        var componentOptions = {
                            data: _.clone(options.data)
                        };
                        componentOptions.data.viewport = viewport;
                        component.render(componentOptions);
                        if (component.getMargins) {
                            var margins = component.getMargins();
                            viewport.height -= margins.height;
                            viewport.width -= margins.width;
                        }
                    });
                };
                AxesComponent.prototype.clear = function () {
                    this.components.forEach(function (component) {
                        component.clear();
                    });
                };
                AxesComponent.prototype.destroy = function () {
                    this.components.forEach(function (component) {
                        component.destroy();
                    });
                    this.components = null;
                    this.element = null;
                };
                AxesComponent.prototype.getMargins = function () {
                    return this.components.reduce(function (previous, component) {
                        if (component.getMargins) {
                            var margins = component.getMargins();
                            previous.height += margins.height;
                            previous.width += margins.width;
                        }
                        return previous;
                    }, { width: 0, height: 0 });
                };
                return AxesComponent;
            }());
            visual.AxesComponent = AxesComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var createClassAndSelector = powerbi.extensibility.utils.svg.CssConstants.createClassAndSelector;
            var AxisReferenceLineBaseComponent = /** @class */ (function () {
                function AxisReferenceLineBaseComponent(options) {
                    this.className = "axisReferenceLineComponent";
                    this.lineSelector = createClassAndSelector("axisReferenceLine");
                    this.element = options.element
                        .append("g")
                        .classed(this.className, true);
                }
                AxisReferenceLineBaseComponent.prototype.render = function (options) {
                    var settings = this.getSettings(options);
                    var lineSelection = this.element
                        .selectAll(this.lineSelector.selectorName)
                        .data(settings.show
                        ? this.getData(options)
                        : []);
                    var line = d3.svg.line()
                        .x(function (positions) {
                        return positions[0] || 0;
                    })
                        .y(function (positions) {
                        return positions[1] || 0;
                    });
                    var getPoints = this.getPointsFunction(options);
                    lineSelection
                        .enter()
                        .append("svg:path")
                        .classed(this.lineSelector.className, true);
                    lineSelection
                        .attr({
                        d: function (value) {
                            return line(getPoints(value));
                        }
                    })
                        .style({
                        "stroke": settings.color,
                        "stroke-width": settings.thickness
                    });
                    lineSelection
                        .exit()
                        .remove();
                };
                AxisReferenceLineBaseComponent.prototype.clear = function () {
                    this.element
                        .selectAll("*")
                        .remove();
                };
                AxisReferenceLineBaseComponent.prototype.destroy = function () {
                    this.element = null;
                };
                return AxisReferenceLineBaseComponent;
            }());
            visual.AxisReferenceLineBaseComponent = AxisReferenceLineBaseComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var YAxisReferenceLineComponent = /** @class */ (function (_super) {
                __extends(YAxisReferenceLineComponent, _super);
                function YAxisReferenceLineComponent() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                YAxisReferenceLineComponent.prototype.getData = function (options) {
                    var y = options.data.y;
                    return y.ticks || [];
                };
                YAxisReferenceLineComponent.prototype.getPointsFunction = function (options) {
                    var _a = options.data, viewport = _a.viewport, scale = _a.scale;
                    var yScale = scale.y
                        .copy()
                        .range([viewport.height, 0]);
                    return function (value) {
                        var y = yScale.scale(value);
                        return [
                            [0, y],
                            [viewport.width, y]
                        ];
                    };
                };
                YAxisReferenceLineComponent.prototype.getSettings = function (options) {
                    return options.data.settings.referenceLineOfYAxis;
                };
                return YAxisReferenceLineComponent;
            }(visual.AxisReferenceLineBaseComponent));
            visual.YAxisReferenceLineComponent = YAxisReferenceLineComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var XAxisReferenceLineComponent = /** @class */ (function (_super) {
                __extends(XAxisReferenceLineComponent, _super);
                function XAxisReferenceLineComponent() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                XAxisReferenceLineComponent.prototype.getData = function (options) {
                    var x = options.data.x;
                    return x.ticks || [];
                };
                XAxisReferenceLineComponent.prototype.getPointsFunction = function (options) {
                    var _a = options.data, viewport = _a.viewport, scale = _a.scale;
                    var xScale = scale.x
                        .copy()
                        .range([0, viewport.width]);
                    return function (value) {
                        var x = xScale.scale(value);
                        return [
                            [x, 0],
                            [x, viewport.height]
                        ];
                    };
                };
                XAxisReferenceLineComponent.prototype.getSettings = function (options) {
                    return options.data.settings.referenceLineOfXAxis;
                };
                return XAxisReferenceLineComponent;
            }(visual.AxisReferenceLineBaseComponent));
            visual.XAxisReferenceLineComponent = XAxisReferenceLineComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var createClassAndSelector = powerbi.extensibility.utils.svg.CssConstants.createClassAndSelector;
            var DotsComponent = /** @class */ (function () {
                function DotsComponent(options) {
                    this.className = "dotsComponent";
                    this.dotsSelector = createClassAndSelector("dots");
                    this.dotSelector = createClassAndSelector("dot");
                    this.element = options.element
                        .append("g")
                        .classed(this.className, true);
                }
                DotsComponent.prototype.render = function (options) {
                    var _a = options.data, series = _a.series, viewport = _a.viewport, scale = _a.scale, dots = _a.settings.dots;
                    var xScale = scale.x
                        .copy()
                        .range([0, viewport.width]);
                    var yScale = scale.y
                        .copy()
                        .range([viewport.height, 0]);
                    var dotsSelection = this.element
                        .selectAll(this.dotsSelector.selectorName)
                        .data(series);
                    dotsSelection
                        .enter()
                        .append("g")
                        .classed(this.dotsSelector.className, true);
                    dotsSelection
                        .style({
                        fill: function (series) { return series.color; }
                    });
                    var dotSelection = dotsSelection
                        .selectAll(this.dotSelector.selectorName)
                        .data(function (series) {
                        return series.points
                            .filter(function (point) {
                            return point.value !== null && !isNaN(point.value);
                        })
                            .map(function (point) {
                            return {
                                point: point,
                                thickness: series.thickness
                            };
                        });
                    });
                    dotSelection
                        .enter()
                        .append("circle")
                        .classed(this.dotSelector.className, true);
                    dotSelection
                        .attr({
                        cx: function (point) { return xScale.scale(point.point.axisValue); },
                        cy: function (point) { return yScale.scale(point.point.value); },
                        r: function (point) { return point.thickness * dots.radiusFactor; }
                    });
                    dotSelection
                        .exit()
                        .remove();
                    dotsSelection
                        .exit()
                        .remove();
                };
                DotsComponent.prototype.clear = function () {
                    this.element
                        .selectAll("*")
                        .remove();
                };
                DotsComponent.prototype.destroy = function () {
                    this.element = null;
                };
                return DotsComponent;
            }());
            visual.DotsComponent = DotsComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var MultiShapeComponent = /** @class */ (function () {
                function MultiShapeComponent(options) {
                    this.className = "multiShapeComponent";
                    this.amountOfDataPointsForFallbackComponents = 1;
                    this.mainComponents = [];
                    this.fallbackComponents = [];
                    this.element = options.element
                        .append("g")
                        .classed(this.className, true);
                    this.mainComponents = [
                        new visual.MultiLineComponent({
                            element: this.element
                        })
                    ];
                    this.fallbackComponents = [
                        new visual.DotsComponent({
                            element: this.element
                        })
                    ];
                }
                MultiShapeComponent.prototype.render = function (options) {
                    var series = options.data.series;
                    if (series
                        && series[0]
                        && series[0].points
                        && series[0].points.length === this.amountOfDataPointsForFallbackComponents) {
                        this.clearComponents(this.mainComponents);
                        this.renderComponents(this.fallbackComponents, options);
                    }
                    else {
                        this.clearComponents(this.fallbackComponents);
                        this.renderComponents(this.mainComponents, options);
                    }
                };
                MultiShapeComponent.prototype.renderComponents = function (components, options) {
                    components.forEach(function (component) {
                        component.render(options);
                    });
                };
                MultiShapeComponent.prototype.clear = function () {
                    this.clearComponents(this.getComponents());
                };
                MultiShapeComponent.prototype.getComponents = function () {
                    return this.mainComponents.concat(this.fallbackComponents);
                };
                MultiShapeComponent.prototype.clearComponents = function (components) {
                    components.forEach(function (component) {
                        component.clear();
                    });
                };
                MultiShapeComponent.prototype.destroy = function () {
                    this.getComponents()
                        .forEach(function (component) {
                        component.destroy();
                    });
                    this.mainComponents = [];
                    this.fallbackComponents = [];
                    this.element = null;
                };
                return MultiShapeComponent;
            }());
            visual.MultiShapeComponent = MultiShapeComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var createClassAndSelector = powerbi.extensibility.utils.svg.CssConstants.createClassAndSelector;
            var VerticalLineComponent = /** @class */ (function () {
                function VerticalLineComponent(options) {
                    this.className = "verticalLineComponent";
                    this.lineSelector = createClassAndSelector("verticalLine");
                    this.element = options.element
                        .append("g")
                        .classed(this.className, true);
                }
                VerticalLineComponent.prototype.render = function (options) {
                    var _a = options.data, series = _a.series, viewport = _a.viewport, scale = _a.scale;
                    var xScale = scale.x
                        .copy()
                        .range([0, viewport.width]);
                    var points = series
                        && series[0]
                        && series[0].points
                        || [];
                    var lineSelection = this.element
                        .selectAll(this.lineSelector.selectorName)
                        .data(points);
                    lineSelection
                        .enter()
                        .append("line")
                        .classed(this.lineSelector.className, true);
                    lineSelection
                        .attr({
                        x1: function (point) { return xScale.scale(point.axisValue); },
                        y1: 0,
                        x2: function (point) { return xScale.scale(point.axisValue); },
                        y2: viewport.height
                    });
                    lineSelection
                        .exit()
                        .remove();
                };
                VerticalLineComponent.prototype.clear = function () {
                    this.element
                        .selectAll("*")
                        .remove();
                };
                VerticalLineComponent.prototype.destroy = function () {
                    this.element = null;
                };
                return VerticalLineComponent;
            }());
            visual.VerticalLineComponent = VerticalLineComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            // powerbi.visuals
            var valueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;
            var TooltipComponent = /** @class */ (function (_super) {
                __extends(TooltipComponent, _super);
                function TooltipComponent(tooltipService) {
                    var _this = _super.call(this) || this;
                    _this.tooltipService = tooltipService;
                    _this.varianceDisplayName = "Variance";
                    _this.secondVarianceDisplayName = _this.varianceDisplayName + " 2";
                    _this.percentageFormat = "+0.00 %;-0.00 %;0.00 %";
                    _this.numberFormat = valueFormatter.DefaultNumericFormat;
                    return _this;
                }
                TooltipComponent.prototype.render = function (options) {
                    if (!options.position || !this.tooltipService) {
                        return;
                    }
                    this.showTooltip(options);
                };
                TooltipComponent.prototype.showTooltip = function (options) {
                    var _this = this;
                    var position = options.position, _a = options.data, x = _a.x, series = _a.series, _b = _a.settings, kpiIndicator = _b.kpiIndicator, tooltipLabel = _b.tooltipLabel, tooltipVariance = _b.tooltipVariance, secondTooltipVariance = _b.secondTooltipVariance, tooltipValues = _b.tooltipValues, variances = _a.variances;
                    if (!tooltipLabel.show
                        && !tooltipVariance.show
                        && !tooltipValues.show
                        && !secondTooltipVariance.show) {
                        this.clear();
                        return;
                    }
                    var dataItems = [];
                    var firstVariance = this.getVarianceTooltip(series[0] && series[0].points[0], series[1] && series[1].points[0], tooltipVariance, this.varianceDisplayName, kpiIndicator.getCurrentKPI(series[0]
                        && series[0].points[0]
                        && series[0].points[0].kpiIndex), (variances[0] || [])[0]);
                    if (firstVariance) {
                        dataItems.push(firstVariance);
                    }
                    var secondVariance = this.getVarianceTooltip(series[0] && series[0].points[0], series[2] && series[2].points[0], secondTooltipVariance, this.secondVarianceDisplayName, undefined, (variances[1] || [])[0]);
                    if (secondVariance) {
                        dataItems.push(secondVariance);
                    }
                    if (dataItems.length) {
                        dataItems.push({
                            displayName: "   ",
                            value: ""
                        }, {
                            displayName: "   ",
                            value: "",
                        });
                    }
                    if (tooltipValues.show) {
                        series.forEach(function (dataSeries) {
                            var valueFormatter = _this.getValueFormatterByFormat(dataSeries.format || _this.numberFormat, tooltipValues.displayUnits, tooltipValues.precision);
                            var point = dataSeries
                                && dataSeries.points
                                && dataSeries.points[0];
                            if (point
                                && point.value !== null
                                && point.value !== undefined
                                && !isNaN(point.value)) {
                                dataItems.push({
                                    displayName: dataSeries.name,
                                    value: valueFormatter.format(point.value),
                                    color: dataSeries.color
                                });
                            }
                        });
                    }
                    var point = series
                        && series[0]
                        && series[0].points
                        && series[0].points[0];
                    if (tooltipLabel.show
                        && point
                        && point.axisValue !== undefined
                        && point.axisValue !== null) {
                        var formatter = this.getValueFormatterByFormat(tooltipLabel.getFormat(), x.type === visual.DataRepresentationTypeEnum.NumberType
                            ? tooltipLabel.displayUnits
                            : undefined, x.type === visual.DataRepresentationTypeEnum.NumberType
                            ? tooltipLabel.precision
                            : undefined);
                        var text = formatter
                            ? formatter.format(point.axisValue)
                            : point.axisValue;
                        dataItems = [
                            {
                                displayName: "",
                                value: text
                            }
                        ].concat(dataItems);
                    }
                    if (dataItems.length) {
                        this.tooltipService.show({
                            dataItems: dataItems,
                            coordinates: [position.x, position.y, 0, 0],
                            identities: [],
                            isTouchEvent: false
                        });
                    }
                    else {
                        this.clear();
                    }
                };
                TooltipComponent.prototype.getVarianceTooltip = function (firstPoint, secondPoint, settings, displayName, commonKPISettings, kpiIndicatorVariance) {
                    if (commonKPISettings === void 0) { commonKPISettings = {}; }
                    if (!settings.show) {
                        return null;
                    }
                    var variance = !isNaN(kpiIndicatorVariance) && kpiIndicatorVariance !== null
                        ? kpiIndicatorVariance
                        : this.getVarianceByPoints(firstPoint, secondPoint);
                    if (isNaN(variance)) {
                        return null;
                    }
                    var varianceFormatter = this.getValueFormatterByFormat(this.percentageFormat, settings.displayUnits, settings.precision);
                    return {
                        displayName: settings.label || displayName,
                        value: varianceFormatter.format(variance),
                        color: commonKPISettings.color || "rgba(0,0,0,0)"
                    };
                };
                TooltipComponent.prototype.getValueFormatterByFormat = function (format, displayUnits, precision) {
                    return valueFormatter.create({
                        format: format,
                        precision: precision,
                        value: displayUnits
                    });
                };
                TooltipComponent.prototype.clear = function () {
                    if (!this.tooltipService || !this.tooltipService.enabled()) {
                        return;
                    }
                    this.tooltipService.hide({ immediately: true, isTouchEvent: false });
                };
                TooltipComponent.prototype.destroy = function () {
                    this.clear();
                    this.tooltipService = null;
                };
                return TooltipComponent;
            }(visual.VarianceConverter));
            visual.TooltipComponent = TooltipComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PixelConverter = powerbi.extensibility.utils.type.PixelConverter;
            var LabelLayout = extensibility.utils.chart.label.LabelLayout;
            var TextMeasurementService = powerbi.extensibility.utils.formatting.textMeasurementService;
            // powerbi.visuals
            var LabelUtils = extensibility.utils.chart.label.LabelUtils;
            var FontSize = extensibility.utils.chart.label.Units.FontSize;
            var valueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;
            var LabelsComponent = /** @class */ (function (_super) {
                __extends(LabelsComponent, _super);
                function LabelsComponent(options) {
                    var _this = _super.call(this) || this;
                    _this.className = "labelsComponent";
                    _this.italicClassName = "italicStyle";
                    _this.boldClassName = "boldStyle";
                    _this.minimumLabelsToRender = 1;
                    _this.estimatedLabelWidth = 40; // This value represents a width of label just for optimization
                    _this.element = options.element
                        .append("g")
                        .classed(_this.className, true);
                    return _this;
                }
                LabelsComponent.prototype.render = function (options) {
                    var labels = options.data.settings.labels;
                    if (labels.show) {
                        try {
                            this.renderLabels(options);
                        }
                        catch (err) {
                            this.clear();
                        }
                    }
                    else {
                        this.clear();
                    }
                };
                LabelsComponent.prototype.renderLabels = function (options) {
                    var _a = options.data, viewport = _a.viewport, labels = _a.settings.labels;
                    this.element
                        .classed(this.italicClassName, labels.isItalic)
                        .classed(this.boldClassName, labels.isBold);
                    var labelLayoutOptions = LabelUtils.getDataLabelLayoutOptions(null);
                    var labelLayout = new LabelLayout(labelLayoutOptions);
                    var labelGroups = this.getLabelGroups(options);
                    var dataLabels = labelLayout.layout(labelGroups, viewport);
                    LabelUtils.drawDefaultLabels(this.element, dataLabels, true);
                };
                LabelsComponent.prototype.getTextProperties = function (text, fontSize, fontFamily) {
                    return {
                        text: text,
                        fontFamily: fontFamily,
                        fontSize: PixelConverter.toString(fontSize)
                    };
                };
                LabelsComponent.prototype.getLabelGroups = function (options) {
                    var _this = this;
                    var _a = options.data, series = _a.series, scale = _a.scale, viewport = _a.viewport, labels = _a.settings.labels, y = _a.y;
                    var xScale = scale.x
                        .copy()
                        .range([0, viewport.width]);
                    var yScale = scale.y
                        .copy()
                        .range([viewport.height, 0]);
                    var fontSizeInPx = PixelConverter.fromPointToPixel(labels.fontSize);
                    var labelDisplayUnits = labels.displayUnits || y.max;
                    var valueFormatters = series.map(function (seriesGroup) {
                        return _this.getValueFormatter(labelDisplayUnits, labels.precision, seriesGroup.format);
                    });
                    var pointsLength = series
                        && series[0]
                        && series[0].points
                        && series[0].points.length
                        || 0;
                    var lastPointIndex = pointsLength - 1;
                    var availableAmountOfLabels = LabelUtils.getNumberOfLabelsToRender(viewport.width, labels.density, this.minimumLabelsToRender, this.estimatedLabelWidth);
                    var maxNumberOfLabels = Math.round(availableAmountOfLabels * labels.density / 100);
                    var indexScale = d3.scale
                        .quantize()
                        .domain([0, maxNumberOfLabels])
                        .range(d3.range(0, pointsLength, 1));
                    return series.map(function (currentSeries, seriesIndex) {
                        var labelDataPoints = [];
                        for (var index = 0, previousPointIndex = -1; index <= maxNumberOfLabels; index++) {
                            var pointIndex = indexScale(index);
                            var point = currentSeries.points[pointIndex];
                            if (previousPointIndex !== pointIndex && _this.isPointValid(point)) {
                                previousPointIndex = pointIndex;
                                var formattedValue = valueFormatters[seriesIndex].format(point.value);
                                var textProperties = _this.getTextProperties(formattedValue, fontSizeInPx, labels.fontFamily);
                                var textWidth = TextMeasurementService.measureSvgTextWidth(textProperties);
                                var textHeight = TextMeasurementService.estimateSvgTextHeight(textProperties);
                                var parentShape = {
                                    point: {
                                        x: xScale.scale(point.axisValue),
                                        y: yScale.scale(point.value),
                                    },
                                    radius: 0,
                                    validPositions: [
                                        1 /* Above */,
                                        2 /* Below */,
                                        4 /* Left */,
                                        8 /* Right */
                                    ]
                                };
                                var labelDataPoint = {
                                    isPreferred: pointIndex === 0 || pointIndex === lastPointIndex,
                                    text: formattedValue,
                                    textSize: {
                                        width: textWidth,
                                        height: textHeight
                                    },
                                    outsideFill: labels.color,
                                    insideFill: labels.color,
                                    parentType: 0 /* Point */,
                                    parentShape: parentShape,
                                    fontProperties: {
                                        family: labels.fontFamily,
                                        color: labels.color,
                                        size: FontSize.createFromPt(labels.fontSize)
                                    },
                                    identity: null
                                };
                                labelDataPoints.push(labelDataPoint);
                            }
                        }
                        return {
                            labelDataPoints: labelDataPoints,
                            maxNumberOfLabels: labelDataPoints.length
                        };
                    });
                };
                LabelsComponent.prototype.getValueFormatter = function (displayUnits, precision, format) {
                    return valueFormatter.create({
                        format: format,
                        precision: precision,
                        value: displayUnits
                    });
                };
                LabelsComponent.prototype.clear = function () {
                    this.element
                        .selectAll("*")
                        .remove();
                };
                LabelsComponent.prototype.destroy = function () {
                    this.element = null;
                };
                return LabelsComponent;
            }(visual.DataRepresentationPointFilter));
            visual.LabelsComponent = LabelsComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PixelConverter = powerbi.extensibility.utils.type.PixelConverter;
            var SvgComponent = /** @class */ (function () {
                function SvgComponent(options) {
                    this.containerClassName = "svgComponentContainer";
                    this.className = "svgComponent";
                    this.components = [];
                    this.dynamicComponents = [];
                    this.element = options.element
                        .append("div")
                        .classed(this.className, true)
                        .append("svg")
                        .classed(this.containerClassName, true);
                    this.components = [
                        new visual.YAxisReferenceLineComponent({ element: this.element }),
                        new visual.XAxisReferenceLineComponent({ element: this.element }),
                        new visual.MultiShapeComponent({ element: this.element }),
                        new visual.LabelsComponent({ element: this.element })
                    ];
                    this.dynamicComponents = [
                        new visual.VerticalLineComponent({ element: this.element }),
                        new visual.DotsComponent({ element: this.element }),
                        new visual.TooltipComponent(options.tooltipService)
                    ];
                }
                SvgComponent.prototype.render = function (options) {
                    var _a = options.data, yAxis = _a.settings.yAxis, y = _a.y, viewport = _a.viewport, margin = _a.margin, values = _a.x.values, x = _a.scale.x;
                    this.updateViewport(viewport);
                    this.updateMargin(margin, yAxis.show
                        ? 0
                        : y.maxTickWidth);
                    this.positions = this.getPositions(viewport, values, x.copy());
                    this.components.forEach(function (component) {
                        component.render(options);
                    });
                    this.bindEvents(options);
                };
                SvgComponent.prototype.updateViewport = function (viewport) {
                    this.element.style({
                        width: PixelConverter.toString(viewport.width),
                        height: PixelConverter.toString(viewport.height)
                    });
                };
                SvgComponent.prototype.updateMargin = function (margin, extraLeftMargin) {
                    this.element.style({
                        "padding-top": PixelConverter.toString(margin.top),
                        "padding-right": PixelConverter.toString(margin.right),
                        "padding-bottom": PixelConverter.toString(margin.bottom),
                        "padding-left": PixelConverter.toString(margin.left + extraLeftMargin)
                    });
                };
                SvgComponent.prototype.getPositions = function (viewport, values, xScale) {
                    var scale = xScale
                        .copy()
                        .range([0, viewport.width]);
                    return values.map(function (value) {
                        return scale.scale(value);
                    });
                };
                SvgComponent.prototype.bindEvents = function (options) {
                    var _this = this;
                    this.element.on("mousemove", function () { return _this.pointerMoveEvent(options); });
                    this.element.on("touchmove", function () { return _this.pointerMoveEvent(options); });
                    this.element.on("mouseleave", function () { return _this.pointerLeaveHandler(); });
                    this.element.on("touchend", function () { return _this.pointerLeaveHandler(); });
                };
                SvgComponent.prototype.pointerMoveEvent = function (options) {
                    var event = d3.event;
                    var offsetX = Number.MAX_VALUE, originalXPosition = Number.MAX_VALUE, originalYPosition = Number.MAX_VALUE;
                    switch (event.type) {
                        case "mousemove": {
                            originalXPosition = event.pageX;
                            originalYPosition = event.pageY;
                            offsetX = event.offsetX;
                            break;
                        }
                        case "touchmove": {
                            var touch = event;
                            if (touch && touch.touches && touch.touches[0]) {
                                originalXPosition = touch.touches[0].pageX;
                                originalYPosition = touch.touches[0].pageY;
                                var element = this.element.node();
                                var xScaleViewport = this.getXScale(element);
                                offsetX = (originalXPosition - element.getBoundingClientRect().left) / xScaleViewport;
                            }
                            break;
                        }
                    }
                    this.renderDynamicComponentByPosition(offsetX, originalXPosition, originalYPosition, options);
                };
                // TODO: Looks like this method should be refactored in order to make it more understandable
                SvgComponent.prototype.renderDynamicComponentByPosition = function (offsetX, xPosition, yPosition, baseOptions) {
                    var _a = baseOptions.data, series = _a.series, margin = _a.margin, y = _a.y, yAxis = _a.settings.yAxis;
                    var amountOfPoints = series
                        && series[0]
                        && series[0].points
                        && series[0].points.length
                        || 0;
                    var dataPointIndex = this.getIndexByPosition(offsetX
                        - margin.left
                        - (yAxis.show ? 0 : y.maxTickWidth));
                    dataPointIndex = Math.min(Math.max(0, dataPointIndex), amountOfPoints);
                    var options = {
                        position: { x: xPosition, y: yPosition },
                        data: _.clone(baseOptions.data)
                    };
                    var dataSeries = [];
                    baseOptions.data.series.forEach(function (series) {
                        var point = series.points[dataPointIndex];
                        if (point) {
                            var seriesToReturn = _.clone(series);
                            seriesToReturn.points = [point];
                            dataSeries.push(seriesToReturn);
                        }
                    });
                    options.data.series = dataSeries;
                    if (options.data.variances.length) {
                        options.data.variances = options.data.variances.map(function (varianceGroup) {
                            var variance = varianceGroup[dataPointIndex];
                            if (!isNaN(variance) && variance !== null) {
                                return [variance];
                            }
                            return [];
                        });
                    }
                    this.dynamicComponents.forEach(function (component) {
                        component.render(options);
                    });
                };
                SvgComponent.prototype.getXScale = function (container) {
                    var rect = container.getBoundingClientRect(), clientWidth = container.clientWidth || $(container).width();
                    return rect.width / clientWidth;
                };
                /**
                 * This method linear search
                 *
                 * This method is a small hack. Please improve if you know how to improve it
                 *
                 * @param position {number} Current pointer position
                 */
                SvgComponent.prototype.getIndexByPosition = function (position) {
                    if (!this.positions) {
                        return NaN;
                    }
                    var length = this.positions.length;
                    for (var index = 0; index < length; index++) {
                        var condition = (index === 0
                            && position <= this.positions[index])
                            || (index === 0
                                && this.positions[index + 1] !== undefined
                                && position <= this.positions[index] + (this.positions[index + 1] - this.positions[index]) / 2)
                            || (index === length - 1
                                && position >= this.positions[index])
                            || (index === length - 1
                                && this.positions[index - 1] !== undefined
                                && position >= this.positions[index] - (this.positions[index] - this.positions[index - 1]) / 2)
                            || (this.positions[index - 1] !== undefined
                                && this.positions[index] !== undefined
                                && this.positions[index + 1] !== undefined
                                && (position >= (this.positions[index] - Math.abs(this.positions[index] - this.positions[index - 1]) / 2))
                                && (position <= (this.positions[index] + Math.abs(this.positions[index + 1] - this.positions[index]) / 2)));
                        if (condition) {
                            return index;
                        }
                    }
                    return NaN;
                };
                SvgComponent.prototype.pointerLeaveHandler = function () {
                    this.clearDynamicComponents();
                };
                SvgComponent.prototype.clearDynamicComponents = function () {
                    this.clearComponents(this.dynamicComponents);
                };
                SvgComponent.prototype.getComponents = function () {
                    return this.components.concat(this.dynamicComponents);
                };
                SvgComponent.prototype.clear = function () {
                    var components = this.getComponents();
                    this.clearComponents(components);
                    this.element.remove();
                };
                SvgComponent.prototype.clearComponents = function (components) {
                    components.forEach(function (component) {
                        component.clear();
                    });
                };
                SvgComponent.prototype.destroy = function () {
                    var components = this.getComponents();
                    components.forEach(function (component) {
                        component.destroy();
                    });
                    this.components = null;
                    this.dynamicComponents = null;
                    this.element = null;
                };
                return SvgComponent;
            }());
            visual.SvgComponent = SvgComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PlotComponent = /** @class */ (function () {
                function PlotComponent(options) {
                    this.components = [];
                    this.element = options.element
                        .append("div")
                        .classed(PlotComponent.ClassName, true);
                    this.components = [
                        new visual.AxesComponent({
                            element: this.element
                        }),
                        new visual.SvgComponent({
                            element: this.element,
                            tooltipService: options.tooltipService
                        })
                    ];
                }
                PlotComponent.prototype.render = function (options) {
                    var _a = options.data, viewport = _a.viewport, margin = _a.margin;
                    this.updateViewport(viewport);
                    viewport.width -= margin.left + margin.right;
                    viewport.height -= margin.top + margin.bottom;
                    this.components.forEach(function (component) {
                        component.render(options);
                        if (component.getMargins) {
                            var margins = component.getMargins();
                            viewport.width -= margins.width;
                            viewport.height -= margins.height;
                        }
                    });
                };
                PlotComponent.prototype.clear = function () {
                    this.components.forEach(function (component) {
                        component.clear();
                    });
                };
                PlotComponent.prototype.destroy = function () {
                    this.components.forEach(function (component) {
                        component.destroy();
                    });
                    this.components = null;
                    this.element = null;
                };
                PlotComponent.prototype.updateViewport = function (viewport) {
                    this.element.style({
                        width: viewport.width,
                        height: viewport.height
                    });
                };
                PlotComponent.ClassName = "plot";
                return PlotComponent;
            }());
            visual.PlotComponent = PlotComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var LegendIcon = extensibility.utils.chart.legend.LegendIcon;
            var createLegend = extensibility.utils.chart.legend.createLegend;
            var LegendPosition = extensibility.utils.chart.legend.LegendPosition;
            var LegendComponent = /** @class */ (function () {
                function LegendComponent(options) {
                    this.className = "legendComponent";
                    this.element = options.element
                        .append("div")
                        .classed(this.className, true);
                    this.legend = createLegend(this.element.node(), true, null, true);
                }
                LegendComponent.prototype.render = function (options) {
                    var legend = options.data.settings.legend;
                    if (!legend.show) {
                        return;
                    }
                    var legendData = this.createLegendData(options.data, legend);
                    this.legend.changeOrientation(this.getLegendPosition(legend.position));
                    this.legend.drawLegend(legendData, options.data.viewport);
                };
                LegendComponent.prototype.createLegendData = function (data, settings) {
                    var legendDataPoints = data.series
                        .map(function (series) {
                        return {
                            color: series.color,
                            icon: LegendIcon.Circle,
                            label: series.name,
                            identity: series.selectionId,
                            selected: false
                        };
                    });
                    return {
                        title: settings.titleText,
                        dataPoints: legendDataPoints,
                        grouped: false,
                        fontSize: settings.fontSize,
                        labelColor: settings.labelColor
                    };
                };
                LegendComponent.prototype.getLegendPosition = function (position) {
                    var positionIndex = LegendPosition[position];
                    return positionIndex === undefined
                        ? LegendPosition.BottomCenter
                        : positionIndex;
                };
                LegendComponent.prototype.clear = function () {
                    this.element.remove();
                };
                LegendComponent.prototype.destroy = function () {
                    this.element = null;
                    this.legend = null;
                };
                LegendComponent.prototype.getMargins = function () {
                    if (!this.legend) {
                        return {
                            width: 0,
                            height: 0
                        };
                    }
                    return this.legend.getMargins();
                };
                return LegendComponent;
            }());
            visual.LegendComponent = LegendComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var AlignEnum;
            (function (AlignEnum) {
                AlignEnum[AlignEnum["alignLeft"] = 0] = "alignLeft";
                AlignEnum[AlignEnum["alignCenter"] = 1] = "alignCenter";
                AlignEnum[AlignEnum["alignRight"] = 2] = "alignRight";
            })(AlignEnum = visual.AlignEnum || (visual.AlignEnum = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var ContentAlignEnum;
            (function (ContentAlignEnum) {
                ContentAlignEnum[ContentAlignEnum["contentLeft"] = 0] = "contentLeft";
                ContentAlignEnum[ContentAlignEnum["contentRight"] = 1] = "contentRight";
            })(ContentAlignEnum = visual.ContentAlignEnum || (visual.ContentAlignEnum = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PixelConverter = powerbi.extensibility.utils.type.PixelConverter;
            var createClassAndSelector = powerbi.extensibility.utils.svg.CssConstants.createClassAndSelector;
            var TextMeasurementService = powerbi.extensibility.utils.formatting.textMeasurementService;
            var CaptionKPIComponent = /** @class */ (function () {
                function CaptionKPIComponent(options) {
                    this.className = "captionKPIComponent";
                    this.invisibleClassName = "invisible";
                    this.innerContainerSelector = createClassAndSelector("captionKPIComponentInnerContainer");
                    this.captionContainerSelector = createClassAndSelector("kpiCaptionContainer");
                    this.captionSelector = createClassAndSelector("kpiCaption");
                    this.sizeOffset = {
                        width: 15,
                        height: 5
                    };
                    this.isComponentRendered = false;
                    this.element = options.element
                        .append("div")
                        .classed(this.className, true)
                        .classed(options.className, true);
                }
                CaptionKPIComponent.prototype.render = function (options) {
                    var captions = options.captions, align = options.align, _a = options.data, viewport = _a.viewport, layout = _a.settings.layout;
                    var _b = this.getAttributes(captions), isShown = _b.isShown, size = _b.size;
                    this.size = size;
                    isShown = layout.autoHideVisualComponents
                        ? isShown && this.canComponentBeRenderedAtViewport(viewport, layout.getLayout())
                        : isShown;
                    this.isComponentRendered = isShown;
                    this.element.classed(this.invisibleClassName, !isShown);
                    this.innerContainer = this.getDynamicElement(this.element, this.innerContainerSelector, isShown, align);
                    this.renderElement(this.innerContainer, captions, this.captionContainerSelector, this.captionSelector);
                };
                CaptionKPIComponent.prototype.getAttributes = function (captions) {
                    var _this = this;
                    var isShown = false;
                    var size = {
                        width: 0,
                        height: 0
                    };
                    captions.forEach(function (captionList) {
                        var width = 0;
                        var height = 0;
                        captionList.forEach(function (caption) {
                            isShown = isShown || caption.settings.show;
                            if (caption.settings.show) {
                                var text = caption.value || "M";
                                var rect = TextMeasurementService.measureSvgTextRect({
                                    text: text,
                                    fontFamily: caption.settings.fontFamily,
                                    fontSize: PixelConverter.toString(PixelConverter.fromPointToPixel(caption.settings.fontSize))
                                }, text);
                                height = Math.max(height, rect.height + _this.sizeOffset.height);
                                width += rect.width + _this.sizeOffset.width;
                            }
                        });
                        size.height += height;
                        size.width = Math.max(size.width, width);
                    });
                    return {
                        size: size,
                        isShown: isShown
                    };
                };
                CaptionKPIComponent.prototype.canComponentBeRenderedAtViewport = function (viewport, layout) {
                    switch (visual.LayoutEnum[layout]) {
                        case visual.LayoutEnum.Left:
                        case visual.LayoutEnum.Right: {
                            return viewport.height >= this.size.height;
                        }
                        case visual.LayoutEnum.Top:
                        case visual.LayoutEnum.Bottom: {
                            return viewport.width >= this.size.width;
                        }
                        default: {
                            return false;
                        }
                    }
                };
                CaptionKPIComponent.prototype.getDynamicElement = function (element, selector, shouldElementBeRendered, align) {
                    var selection = element
                        .selectAll(selector.selectorName)
                        .data(shouldElementBeRendered ? [shouldElementBeRendered] : []);
                    selection
                        .enter()
                        .append("div")
                        .classed(selector.className, true);
                    selection.attr({
                        "class": selector.className + " " + visual.AlignEnum[align]
                    });
                    selection
                        .exit()
                        .remove();
                    return selection;
                };
                CaptionKPIComponent.prototype.renderElement = function (element, captions, containerSelector, selector) {
                    var containerSelection = element
                        .selectAll(containerSelector.selectorName)
                        .data(captions);
                    containerSelection
                        .enter()
                        .append("div")
                        .classed(containerSelector.className, true);
                    var elementSelection = containerSelection
                        .selectAll(selector.selectorName)
                        .data(function (captions) {
                        return (captions || []).filter(function (options) {
                            return options
                                && options.settings
                                && options.settings.show;
                        });
                    });
                    elementSelection
                        .enter()
                        .append("div")
                        .classed(selector.className, true);
                    elementSelection
                        .attr({
                        title: function (options) { return options.title || null; },
                        "class": function (options) {
                            var className = selector.className;
                            if (options.settings.isBold) {
                                className += " boldStyle";
                            }
                            if (options.settings.isItalic) {
                                className += " italicStyle";
                            }
                            if (options.className) {
                                className += " " + options.className;
                            }
                            return className;
                        }
                    })
                        .style({
                        color: function (options) { return options.settings.fontColor; },
                        "font-size": function (options) {
                            return PixelConverter.toString(PixelConverter.fromPointToPixel(options.settings.fontSize));
                        },
                        "font-family": function (options) { return options.settings.fontFamily; },
                    })
                        .text(function (options) { return options.value; });
                    elementSelection
                        .exit()
                        .remove();
                    containerSelection
                        .exit()
                        .remove();
                };
                CaptionKPIComponent.prototype.isRendered = function () {
                    return this.isComponentRendered;
                };
                CaptionKPIComponent.prototype.clear = function () {
                    this.element.remove();
                };
                CaptionKPIComponent.prototype.destroy = function () {
                    this.element = null;
                };
                CaptionKPIComponent.prototype.getMargins = function () {
                    if (!this.size) {
                        return {
                            height: 0,
                            width: 0
                        };
                    }
                    return this.size;
                };
                return CaptionKPIComponent;
            }());
            visual.CaptionKPIComponent = CaptionKPIComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var valueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;
            var DateKPIComponent = /** @class */ (function (_super) {
                __extends(DateKPIComponent, _super);
                function DateKPIComponent(options) {
                    var _this = _super.call(this, {
                        element: options.element,
                        className: options.className
                    }) || this;
                    _this.extraClassName = "dateKPIComponent";
                    _this.element.classed(_this.extraClassName, true);
                    return _this;
                }
                DateKPIComponent.prototype.render = function (options) {
                    var _a = options.data, settings = _a.settings, x = _a.x, captionDetailsKPIComponentOptions = _.clone(options);
                    var axisValue = options.data.series
                        && options.data.series[0]
                        && options.data.series[0].current.axisValue;
                    var formattedValue = "";
                    if (axisValue) {
                        var formatter = this.getValueFormatter(x.type, settings.dateValueKPI.getFormat(), settings.dateValueKPI.displayUnits || x.max, settings.dateValueKPI.precision);
                        if (formatter) {
                            formattedValue = formatter.format(axisValue);
                        }
                        else {
                            formattedValue = "" + axisValue;
                        }
                    }
                    var valueCaption = {
                        value: formattedValue,
                        settings: settings.dateValueKPI,
                        title: options.data.x.name || formattedValue
                    };
                    var labelCaption = {
                        value: options.data.x.name,
                        settings: settings.dateLabelKPI
                    };
                    captionDetailsKPIComponentOptions.captions = [
                        [valueCaption],
                        [labelCaption]
                    ];
                    captionDetailsKPIComponentOptions.align = visual.AlignEnum.alignLeft;
                    _super.prototype.render.call(this, captionDetailsKPIComponentOptions);
                };
                DateKPIComponent.prototype.getValueFormatter = function (type, format, value, precision) {
                    var currentValue, currentPrecision;
                    if (type === visual.DataRepresentationTypeEnum.NumberType) {
                        currentValue = value;
                        currentPrecision = precision;
                    }
                    return this.getValueFormatterByFormat(format, currentValue, currentPrecision);
                };
                DateKPIComponent.prototype.getValueFormatterByFormat = function (format, value, precision) {
                    return valueFormatter.create({
                        format: format,
                        value: value,
                        precision: precision
                    });
                };
                return DateKPIComponent;
            }(visual.CaptionKPIComponent));
            visual.DateKPIComponent = DateKPIComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            // powerbi.visuals
            var valueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;
            var DisplayUnitSystemType = powerbi.extensibility.utils.formatting.DisplayUnitSystemType;
            var ValueKPIComponent = /** @class */ (function (_super) {
                __extends(ValueKPIComponent, _super);
                function ValueKPIComponent(options) {
                    var _this = _super.call(this, {
                        element: options.element,
                        className: options.className
                    }) || this;
                    _this.extraClassName = "valueKPIComponent";
                    _this.element.classed(_this.extraClassName, true);
                    _this.valueFormat = valueFormatter.DefaultNumericFormat;
                    return _this;
                }
                ValueKPIComponent.prototype.render = function (options) {
                    var _a = options.data, series = _a.series, settings = _a.settings, variance = _a.variance, captionDetailsKPIComponentOptions = _.clone(options);
                    var caption = "", details = "", title = "";
                    if (options.data.series
                        && options.data.series[0]
                        && options.data.series[0].current
                        && !isNaN(options.data.series[0].current.value)) {
                        var formatter = valueFormatter.create({
                            format: options.data.series[0].format || this.valueFormat,
                            precision: settings.actualValueKPI.precision,
                            value: settings.actualValueKPI.displayUnits || options.data.y.max,
                            displayUnitSystemType: DisplayUnitSystemType.WholeUnits,
                        });
                        var value = options.data.series[0].current.value;
                        title = "" + value;
                        caption = formatter.format(value);
                        details = options.data.series[0].name;
                    }
                    var valueCaption = {
                        title: details || title,
                        value: caption,
                        settings: settings.actualValueKPI
                    };
                    var labelCaption = {
                        value: details,
                        settings: settings.actualLabelKPI
                    };
                    captionDetailsKPIComponentOptions.captions = [
                        [valueCaption],
                        [labelCaption]
                    ];
                    var isVarianceKPIAvailable = series
                        && series.length > 0
                        && series[0]
                        && series[0].current
                        && !isNaN(series[0].current.kpiIndex);
                    var currentAlign = visual.AlignEnum.alignCenter;
                    if (!settings.dateLabelKPI.show && !settings.dateValueKPI.show) {
                        currentAlign = visual.AlignEnum.alignLeft;
                    }
                    else if (((!settings.kpiIndicatorValue.show || isNaN(variance[0]))
                        && (!settings.kpiIndicatorLabel.isShown() || (isNaN(variance[0]) && series[0] && series[0].current && isNaN(series[0].current.kpiIndex)))
                        && (!isVarianceKPIAvailable || !settings.kpiIndicator.show))
                        && (!settings.secondKPIIndicatorValue.show && !settings.secondKPIIndicatorLabel.isShown()
                            || isNaN(variance[1]))) {
                        currentAlign = visual.AlignEnum.alignRight;
                    }
                    captionDetailsKPIComponentOptions.align = currentAlign;
                    _super.prototype.render.call(this, captionDetailsKPIComponentOptions);
                };
                return ValueKPIComponent;
            }(visual.CaptionKPIComponent));
            visual.ValueKPIComponent = ValueKPIComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var valueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;
            var DisplayUnitSystemType = powerbi.extensibility.utils.formatting.DisplayUnitSystemType;
            var VarianceBaseComponent = /** @class */ (function (_super) {
                __extends(VarianceBaseComponent, _super);
                function VarianceBaseComponent() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.percentageFormat = "+0.00 %;-0.00 %;0.00 %";
                    return _this;
                }
                VarianceBaseComponent.prototype.getValueFormatter = function (displayUnits, precision) {
                    return valueFormatter.create({
                        precision: precision,
                        format: this.percentageFormat,
                        value: displayUnits,
                        displayUnitSystemType: DisplayUnitSystemType.WholeUnits,
                    });
                };
                VarianceBaseComponent.prototype.clear = function () {
                    this.element
                        .selectAll("*")
                        .remove();
                };
                VarianceBaseComponent.prototype.destroy = function () {
                    this.element = null;
                };
                return VarianceBaseComponent;
            }(visual.CaptionKPIComponent));
            visual.VarianceBaseComponent = VarianceBaseComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var VarianceComponentWithIndicator = /** @class */ (function (_super) {
                __extends(VarianceComponentWithIndicator, _super);
                function VarianceComponentWithIndicator(options) {
                    var _this = _super.call(this, {
                        element: options.element,
                        className: options.className
                    }) || this;
                    _this.componentClassName = "varianceComponentWithSymbol";
                    _this.indicatorClassName = "kpiIndicator";
                    _this.indicatorValueClassName = "kpiIndicatorValueCaption";
                    _this.hiddenElementClassName = "hiddenElement";
                    _this.fakedKPIIndicatorClassName = "fakedKPIIndicator";
                    _this.glyphClassName = "powervisuals-glyph";
                    _this.element.classed(_this.componentClassName, true);
                    return _this;
                }
                VarianceComponentWithIndicator.prototype.render = function (options) {
                    var _a = options.data, series = _a.series, _b = _a.settings, dateLabelKPI = _b.dateLabelKPI, dateValueKPI = _b.dateValueKPI, actualValueKPI = _b.actualValueKPI, actualLabelKPI = _b.actualLabelKPI, secondKPIIndicatorValue = _b.secondKPIIndicatorValue, secondKPIIndicatorLabel = _b.secondKPIIndicatorLabel, kpiIndicatorValue = _b.kpiIndicatorValue, kpiIndicatorLabel = _b.kpiIndicatorLabel, kpiIndicator = _b.kpiIndicator, variance = _a.variance;
                    var current = (series && series.length > 0 && series[0]).current, kpiIndex = NaN;
                    if (current) {
                        kpiIndex = current.kpiIndex;
                    }
                    var kpiIndicatorSettings = kpiIndicator.getCurrentKPI(kpiIndex);
                    var varianceSettings = _.clone(kpiIndicatorValue), kpiLabelSettings = _.clone(kpiIndicatorLabel);
                    kpiLabelSettings.show = kpiIndicatorLabel.isShown();
                    varianceSettings.fontColor = kpiIndicatorValue.matchKPIColor
                        && kpiIndicatorSettings
                        && kpiIndicatorSettings.color
                        ? kpiIndicatorSettings.color
                        : kpiIndicatorValue.fontColor;
                    if (isNaN(variance[0])) {
                        varianceSettings.show = false;
                    }
                    var indicatorSettings = new visual.KPIIndicatorValueSettings();
                    indicatorSettings.fontColor = kpiIndicatorSettings.color;
                    indicatorSettings.show = kpiIndicator.show;
                    indicatorSettings.isBold = false; // This options doesn't make any sense for symbol
                    indicatorSettings.fontSize = kpiIndicator.fontSize;
                    indicatorSettings.fontFamily = null;
                    if (isNaN(kpiIndex)) {
                        indicatorSettings.show = false;
                    }
                    if (isNaN(variance[0]) && isNaN(kpiIndex)) {
                        kpiLabelSettings.show = false;
                    }
                    var currentAlign = visual.AlignEnum.alignRight;
                    if (!dateLabelKPI.show
                        && !dateValueKPI.show
                        && !actualLabelKPI.show
                        && (!actualValueKPI.show || series[0] && series[0].current && isNaN(series[0] && series[0].current.value))
                        && (!secondKPIIndicatorValue.show && !secondKPIIndicatorLabel.isShown() || isNaN(variance[1]))) {
                        currentAlign = visual.AlignEnum.alignLeft;
                    }
                    else if (!varianceSettings.show && !kpiLabelSettings.show) {
                        currentAlign = visual.AlignEnum.alignCenter;
                    }
                    var className = kpiIndicatorSettings.shape
                        ? this.indicatorClassName + " " + this.glyphClassName + " " + kpiIndicatorSettings.shape
                        : undefined;
                    var title = kpiIndicatorLabel.label || "" + variance[0];
                    var indicatorCaption = {
                        title: title,
                        value: " ",
                        settings: indicatorSettings,
                        className: className
                    };
                    var fakedIndicatorSettings = new visual.KPIIndicatorValueSettings();
                    // We should implement a copy method for settings
                    fakedIndicatorSettings.fontColor = indicatorSettings.fontColor;
                    fakedIndicatorSettings.show = indicatorSettings.show;
                    fakedIndicatorSettings.isBold = indicatorSettings.isBold;
                    fakedIndicatorSettings.fontSize = indicatorSettings.fontSize;
                    fakedIndicatorSettings.show = fakedIndicatorSettings.show
                        && varianceSettings.show
                        && kpiLabelSettings.show
                        && !!kpiIndicatorLabel.label;
                    var fakedIndicatorCaption = {
                        title: title,
                        value: "",
                        settings: fakedIndicatorSettings,
                        className: className
                            ? className + " " + this.hiddenElementClassName + " " + this.fakedKPIIndicatorClassName
                            : this.hiddenElementClassName + " " + this.fakedKPIIndicatorClassName
                    };
                    var formatter = this.getValueFormatter(varianceSettings.displayUnits, varianceSettings.precision);
                    var valueCaption = {
                        title: title,
                        value: formatter.format(variance[0]),
                        settings: varianceSettings
                    };
                    var labelCaption = {
                        value: kpiIndicatorLabel.label,
                        settings: kpiLabelSettings,
                        className: this.indicatorValueClassName
                    };
                    var captions = [];
                    switch (visual.HorizontalLayoutEnum[kpiIndicator.position]) {
                        case visual.HorizontalLayoutEnum.Right: {
                            captions.push([valueCaption, indicatorCaption], [labelCaption, fakedIndicatorCaption]);
                            break;
                        }
                        case visual.HorizontalLayoutEnum.Left:
                        default: {
                            captions.push([indicatorCaption, valueCaption], [fakedIndicatorCaption, labelCaption]);
                            break;
                        }
                    }
                    _super.prototype.render.call(this, {
                        captions: captions,
                        data: options.data,
                        align: currentAlign
                    });
                };
                return VarianceComponentWithIndicator;
            }(visual.VarianceBaseComponent));
            visual.VarianceComponentWithIndicator = VarianceComponentWithIndicator;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var VarianceComponentWithCustomLabel = /** @class */ (function (_super) {
                __extends(VarianceComponentWithCustomLabel, _super);
                function VarianceComponentWithCustomLabel(options) {
                    var _this = _super.call(this, {
                        element: options.element,
                        className: options.className
                    }) || this;
                    _this.componentClassName = "varianceComponentWithCustomLabel";
                    _this.element.classed(_this.componentClassName, true);
                    return _this;
                }
                VarianceComponentWithCustomLabel.prototype.render = function (options) {
                    var _a = options.data, series = _a.series, variance = _a.variance, _b = _a.settings, dateLabelKPI = _b.dateLabelKPI, dateValueKPI = _b.dateValueKPI, actualValueKPI = _b.actualValueKPI, actualLabelKPI = _b.actualLabelKPI, kpiIndicatorValue = _b.kpiIndicatorValue, kpiIndicatorLabel = _b.kpiIndicatorLabel, secondKPIIndicatorValue = _b.secondKPIIndicatorValue, secondKPIIndicatorLabel = _b.secondKPIIndicatorLabel, kpiIndicator = _b.kpiIndicator;
                    var varianceSettings = _.clone(secondKPIIndicatorValue), labelSettings = _.clone(secondKPIIndicatorLabel);
                    labelSettings.show = secondKPIIndicatorLabel.isShown();
                    if (isNaN(variance[1])) {
                        varianceSettings.show = false;
                        labelSettings.show = false;
                    }
                    var isVarianceKPIAvailable = series
                        && series.length > 0
                        && series[0]
                        && series[0].current
                        && !isNaN(series[0].current.kpiIndex);
                    var currentAlign = visual.AlignEnum.alignCenter;
                    if (!dateLabelKPI.show
                        && !dateValueKPI.show
                        && (!actualValueKPI.show || series[0] && series[0].current && isNaN(series[0] && series[0].current.value))
                        && !actualLabelKPI.show) {
                        currentAlign = visual.AlignEnum.alignLeft;
                    }
                    else if ((!kpiIndicatorValue.show || isNaN(variance[0]))
                        && (!kpiIndicatorLabel.isShown() || (isNaN(variance[0]) && series[0] && series[0].current && isNaN(series[0].current.kpiIndex)))
                        && (!isVarianceKPIAvailable || !kpiIndicator.show)) {
                        currentAlign = visual.AlignEnum.alignRight;
                    }
                    var formatter = this.getValueFormatter(varianceSettings.displayUnits, varianceSettings.precision);
                    var valueCaption = {
                        value: formatter.format(variance[1]),
                        title: secondKPIIndicatorLabel.label || "" + variance[1],
                        settings: varianceSettings
                    };
                    var labelCaption = {
                        value: secondKPIIndicatorLabel.label,
                        settings: labelSettings
                    };
                    _super.prototype.render.call(this, {
                        captions: [
                            [valueCaption],
                            [labelCaption]
                        ],
                        data: options.data,
                        align: currentAlign
                    });
                };
                return VarianceComponentWithCustomLabel;
            }(visual.VarianceBaseComponent));
            visual.VarianceComponentWithCustomLabel = VarianceComponentWithCustomLabel;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PixelConverter = powerbi.extensibility.utils.type.PixelConverter;
            var createClassAndSelector = powerbi.extensibility.utils.svg.CssConstants.createClassAndSelector;
            // powerbi.visuals
            var LegendPosition = extensibility.utils.chart.legend.LegendPosition;
            var KPIComponentLayoutEnum;
            (function (KPIComponentLayoutEnum) {
                KPIComponentLayoutEnum[KPIComponentLayoutEnum["kpiComponentRow"] = 0] = "kpiComponentRow";
                KPIComponentLayoutEnum[KPIComponentLayoutEnum["kpiComponentColumn"] = 1] = "kpiComponentColumn";
            })(KPIComponentLayoutEnum || (KPIComponentLayoutEnum = {}));
            var KPIComponent = /** @class */ (function () {
                function KPIComponent(options) {
                    this.className = "kpiComponent";
                    this.layout = visual.LayoutEnum.Top;
                    this.childSelector = createClassAndSelector("kpiComponentChild");
                    this.element = options.element
                        .append("div")
                        .classed(this.className, true);
                    var className = this.childSelector.className;
                    this.components = [
                        new visual.VarianceComponentWithIndicator({ className: className, element: this.element }),
                        new visual.DateKPIComponent({ className: className, element: this.element }),
                        new visual.ValueKPIComponent({ className: className, element: this.element }),
                        new visual.VarianceComponentWithCustomLabel({ className: className, element: this.element }),
                    ];
                }
                KPIComponent.prototype.render = function (options) {
                    var _this = this;
                    var _a = options.data, _b = _a.viewport, width = _b.width, height = _b.height, _c = _a.settings, layout = _c.layout, legend = _c.legend;
                    var viewport = { width: width, height: height };
                    this.layout = visual.LayoutEnum[layout.getLayout()];
                    this.applyStyleBasedOnLayout(layout, legend, viewport);
                    var howManyComponentsWasRendered = 0;
                    this.components.forEach(function (component) {
                        component.render(options);
                        if (component.isRendered()) {
                            howManyComponentsWasRendered++;
                        }
                        if (component.getMargins) {
                            var margins = component.getMargins();
                            switch (_this.layout) {
                                case visual.LayoutEnum.Left:
                                case visual.LayoutEnum.Right: {
                                    options.data.viewport.height -= margins.height;
                                    break;
                                }
                                case visual.LayoutEnum.Bottom:
                                case visual.LayoutEnum.Top:
                                default: {
                                    options.data.viewport.width -= margins.width;
                                    break;
                                }
                            }
                        }
                    });
                    options.data.viewport = viewport;
                    this.applyWidthToChildren(howManyComponentsWasRendered);
                };
                KPIComponent.prototype.applyStyleBasedOnLayout = function (layoutSettings, legend, viewport) {
                    var currentLayout, kpiLayout, maxWidth;
                    switch (visual.LayoutEnum[layoutSettings.getLayout()]) {
                        case visual.LayoutEnum.Left:
                        case visual.LayoutEnum.Right: {
                            kpiLayout = KPIComponentLayoutEnum.kpiComponentColumn;
                            maxWidth = null;
                            if (!legend.show
                                || (LegendPosition[legend.position]
                                    && (LegendPosition[legend.position] === LegendPosition.Bottom
                                        || LegendPosition[legend.position] === LegendPosition.BottomCenter))) {
                                currentLayout = visual.LayoutToStyleEnum.columnReversedLayout;
                            }
                            else {
                                currentLayout = visual.LayoutToStyleEnum.columnLayout;
                            }
                            break;
                        }
                        case visual.LayoutEnum.Bottom:
                        case visual.LayoutEnum.Top:
                        default: {
                            currentLayout = visual.LayoutToStyleEnum.rowLayout;
                            kpiLayout = KPIComponentLayoutEnum.kpiComponentRow;
                            maxWidth = PixelConverter.toString(Math.floor(viewport.width));
                            break;
                        }
                    }
                    this.element
                        .style({
                        "max-width": maxWidth
                    })
                        .attr({
                        "class": this.className + " " + visual.LayoutToStyleEnum[currentLayout] + " " + KPIComponentLayoutEnum[kpiLayout]
                    });
                };
                KPIComponent.prototype.applyWidthToChildren = function (howManyComponentsWasRendered) {
                    var width = 100;
                    if (this.layout === visual.LayoutEnum.Top || this.layout === visual.LayoutEnum.Bottom) {
                        width = width / howManyComponentsWasRendered;
                    }
                    var widthInPercentage = width + "%";
                    this.element
                        .selectAll(this.childSelector.selectorName)
                        .style({
                        width: widthInPercentage,
                        "max-width": widthInPercentage
                    });
                };
                KPIComponent.prototype.clear = function () {
                    this.components.forEach(function (component) {
                        component.clear();
                    });
                    this.element.remove();
                };
                KPIComponent.prototype.destroy = function () {
                    this.components.forEach(function (component) {
                        component.destroy();
                    });
                    this.element = null;
                    this.components = null;
                };
                KPIComponent.prototype.getMargins = function () {
                    var viewport = {
                        height: 0,
                        width: 0
                    };
                    if (this.element) {
                        var element = this.element.node();
                        switch (this.layout) {
                            case visual.LayoutEnum.Left:
                            case visual.LayoutEnum.Right: {
                                viewport.width = element.clientWidth;
                                break;
                            }
                            case visual.LayoutEnum.Top:
                            case visual.LayoutEnum.Bottom:
                            default: {
                                viewport.height = element.clientHeight;
                                break;
                            }
                        }
                    }
                    return viewport;
                };
                return KPIComponent;
            }());
            visual.KPIComponent = KPIComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PixelConverter = powerbi.extensibility.utils.type.PixelConverter;
            var createClassAndSelector = powerbi.extensibility.utils.svg.CssConstants.createClassAndSelector;
            var SubtitleComponent = /** @class */ (function () {
                function SubtitleComponent(options) {
                    this.element = options.element
                        .append("div")
                        .classed(SubtitleComponent.ClassName, true);
                }
                SubtitleComponent.prototype.render = function (options) {
                    var subtitle = options.data.settings.subtitle;
                    var data = subtitle.show
                        ? [subtitle]
                        : [];
                    var subtitleSelection = this.element
                        .selectAll(SubtitleComponent.SubTitleSelector.selectorName)
                        .data(data);
                    subtitleSelection
                        .enter()
                        .append("div")
                        .classed(SubtitleComponent.SubTitleSelector.className, true);
                    subtitleSelection
                        .text(function (settings) { return settings.titleText; })
                        .style({
                        color: function (settings) { return settings.fontColor; },
                        "text-align": function (settings) { return settings.alignment; },
                        "font-size": function (settings) {
                            var fontSizeInPx = PixelConverter.fromPointToPixel(settings.fontSize);
                            return PixelConverter.toString(fontSizeInPx);
                        },
                        "background-color": function (settings) { return settings.background; },
                        "font-family": function (settings) { return settings.fontFamily; },
                    });
                    subtitleSelection
                        .exit()
                        .remove();
                };
                SubtitleComponent.prototype.clear = function () {
                    this.element.remove();
                };
                SubtitleComponent.prototype.destroy = function () {
                    this.element = null;
                };
                SubtitleComponent.prototype.getMargins = function () {
                    var viewport = {
                        height: 0,
                        width: 0
                    };
                    if (this.element) {
                        viewport.height = $(this.element.node()).height();
                    }
                    return viewport;
                };
                SubtitleComponent.ClassName = "subtitleComponent";
                SubtitleComponent.SubTitleSelector = createClassAndSelector("subtitle");
                return SubtitleComponent;
            }());
            visual.SubtitleComponent = SubtitleComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PixelConverter = powerbi.extensibility.utils.type.PixelConverter;
            var LayoutComponent = /** @class */ (function (_super) {
                __extends(LayoutComponent, _super);
                function LayoutComponent(options) {
                    var _this = _super.call(this, options) || this;
                    _this.className = "layoutComponent";
                    _this.element.classed(_this.className, true);
                    _this.components = [
                        new visual.KPIComponent({
                            element: _this.element
                        }),
                        new visual.PlotComponent({
                            element: _this.element,
                            tooltipService: options.tooltipService
                        })
                    ];
                    return _this;
                }
                LayoutComponent.prototype.render = function (options) {
                    var _a = options.data, viewport = _a.viewport, layout = _a.settings.layout, selectedLayout = this.getLayout(layout.getLayout());
                    var widthInPx = PixelConverter.toString(viewport.width);
                    var heightInPx = PixelConverter.toString(viewport.height);
                    this.element
                        .attr({
                        "class": this.baseClassName + " " + this.className + " " + visual.LayoutToStyleEnum[selectedLayout]
                    })
                        .style({
                        "min-width": widthInPx,
                        "max-width": widthInPx,
                        "width": widthInPx,
                        "min-height": heightInPx,
                        "max-height": heightInPx,
                        "height": heightInPx,
                    });
                    _super.prototype.render.call(this, options);
                };
                LayoutComponent.prototype.getLayout = function (layout) {
                    switch (visual.LayoutEnum[layout]) {
                        case visual.LayoutEnum.Left: {
                            return visual.LayoutToStyleEnum.rowLayout;
                        }
                        case visual.LayoutEnum.Right: {
                            return visual.LayoutToStyleEnum.rowReversedLayout;
                        }
                        case visual.LayoutEnum.Bottom: {
                            return visual.LayoutToStyleEnum.columnReversedLayout;
                        }
                        case visual.LayoutEnum.Top:
                        default: {
                            return visual.LayoutToStyleEnum.columnLayout;
                        }
                    }
                };
                return LayoutComponent;
            }(visual.ComponentContainer));
            visual.LayoutComponent = LayoutComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PixelConverter = powerbi.extensibility.utils.type.PixelConverter;
            var MainComponent = /** @class */ (function (_super) {
                __extends(MainComponent, _super);
                function MainComponent(options) {
                    var _this = _super.call(this, options) || this;
                    _this.className = "powerKPI";
                    _this.element.classed(_this.className, true);
                    _this.components = [
                        new visual.SubtitleComponent({
                            element: _this.element
                        }),
                        new visual.CommonComponent(__assign({}, options, { element: _this.element, tooltipService: options.tooltipService }))
                    ];
                    return _this;
                }
                MainComponent.prototype.render = function (options) {
                    var viewport = options.data.viewport;
                    this.updateViewport(viewport);
                    _super.prototype.render.call(this, options);
                };
                MainComponent.prototype.updateViewport = function (viewport) {
                    this.element.style({
                        width: PixelConverter.toString(viewport.width),
                        height: PixelConverter.toString(viewport.height)
                    });
                };
                return MainComponent;
            }(visual.ComponentContainer));
            visual.MainComponent = MainComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            // powerbi.visuals
            var LegendPosition = powerbi.extensibility.utils.chart.legend.LegendPosition;
            var CommonComponent = /** @class */ (function (_super) {
                __extends(CommonComponent, _super);
                function CommonComponent(options) {
                    var _this = _super.call(this, options) || this;
                    _this.className = "commonComponent";
                    _this.element.classed(_this.className, true);
                    _this.components = [
                        new visual.LegendComponent(__assign({}, options, { element: _this.element })),
                        new visual.LayoutComponent({
                            element: _this.element,
                            tooltipService: options.tooltipService
                        })
                    ];
                    return _this;
                }
                CommonComponent.prototype.render = function (options) {
                    var legendComponent = this.components;
                    if (!options.data.settings.legend.show) {
                        this.components = this.components.filter(function (x) { return !(x instanceof visual.LegendComponent); });
                    }
                    _super.prototype.render.call(this, options);
                    this.components = legendComponent;
                    var legend = options.data.settings.legend, layout = this.getLayout(legend.position);
                    this.element.attr({
                        "class": this.baseClassName + " " + this.className + " " + visual.LayoutToStyleEnum[layout]
                    });
                };
                CommonComponent.prototype.getLayout = function (position) {
                    switch (LegendPosition[position]) {
                        case LegendPosition.Left:
                        case LegendPosition.LeftCenter: {
                            return visual.LayoutToStyleEnum.rowLayout;
                        }
                        case LegendPosition.Right:
                        case LegendPosition.RightCenter: {
                            return visual.LayoutToStyleEnum.rowReversedLayout;
                        }
                        case LegendPosition.Top:
                        case LegendPosition.TopCenter: {
                            return visual.LayoutToStyleEnum.columnLayout;
                        }
                        case LegendPosition.Bottom:
                        case LegendPosition.BottomCenter:
                        default: {
                            return visual.LayoutToStyleEnum.columnReversedLayout;
                        }
                    }
                };
                return CommonComponent;
            }(visual.ComponentContainer));
            visual.CommonComponent = CommonComponent;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var ColorHelper = extensibility.utils.color.ColorHelper;
            var Settings = extensibility.visual.Settings;
            var MainComponent = extensibility.visual.MainComponent;
            var PowerKPI = /** @class */ (function () {
                function PowerKPI(options) {
                    this.rootElement = d3.select(options.element);
                    this.converter = visual.createConverter(options);
                    this.style = {
                        colorPalette: options.host.colorPalette,
                        isHighContrast: false,
                        labelText: {
                            color: {
                                value: options.element.style.color
                            }
                        },
                        subTitleText: {
                            color: {
                                value: options.element.style.color
                            }
                        },
                        titleText: {
                            color: {
                                value: options.element.style.color
                            }
                        }
                    };
                    this.component = new MainComponent({ element: this.rootElement, tooltipService: options.host.tooltipService });
                }
                PowerKPI.prototype.update = function (options) {
                    var dataView = null;
                    var viewport = { height: 0, width: 0 };
                    if (options && options.dataViews) {
                        dataView = options.dataViews[0];
                    }
                    if (options && options.viewport) {
                        viewport = _.clone(options.viewport);
                        viewport.width -= PowerKPI.ViewportReducer;
                        viewport.height -= PowerKPI.ViewportReducer;
                    }
                    this.render(this.converter.convert({
                        dataView: dataView,
                        viewport: viewport,
                        style: this.style
                    }));
                };
                PowerKPI.prototype.render = function (dataRepresentation) {
                    this.dataRepresentation = dataRepresentation;
                    this.component.render({
                        data: this.dataRepresentation
                    });
                };
                PowerKPI.prototype.enumerateObjectInstances = function (options) {
                    var _this = this;
                    var instances = (this.dataRepresentation
                        && this.dataRepresentation.settings
                        && Settings.enumerateObjectInstances(this.dataRepresentation.settings, options).instances)
                        || [];
                    if (this.dataRepresentation) {
                        [
                            this.dataRepresentation.settings._lineStyle,
                            this.dataRepresentation.settings._lineThickness
                        ].forEach(function (seriesBoundSettings) {
                            instances.push.apply(instances, seriesBoundSettings.enumerateObjectInstances(options.objectName, _this.dataRepresentation.series));
                        });
                        switch (options.objectName) {
                            case "kpiIndicator": {
                                if (this.dataRepresentation
                                    && (this.dataRepresentation.variance
                                        && isNaN(this.dataRepresentation.variance[0])
                                        || (this.dataRepresentation.settings
                                            && !this.dataRepresentation.settings.kpiIndicatorValue.show))
                                    && instances
                                    && instances[0]
                                    && instances[0].properties) {
                                    delete instances[0].properties["position"];
                                }
                                break;
                            }
                            case "kpiIndicatorValue": {
                                if (this.dataRepresentation
                                    && this.dataRepresentation.variance
                                    && isNaN(this.dataRepresentation.variance[0])) {
                                    instances = [];
                                }
                                break;
                            }
                            case "kpiIndicatorLabel": {
                                if (this.dataRepresentation
                                    && this.dataRepresentation.variance
                                    && isNaN(this.dataRepresentation.variance[0])
                                    && this.dataRepresentation.series
                                    && this.dataRepresentation.series[0]
                                    && this.dataRepresentation.series[0].current
                                    && isNaN(this.dataRepresentation.series[0].current.kpiIndex)) {
                                    instances = [];
                                }
                                break;
                            }
                            case "secondKPIIndicatorValue":
                            case "secondKPIIndicatorLabel":
                            case "secondTooltipVariance": {
                                if (!this.dataRepresentation.series
                                    || !this.dataRepresentation.variance
                                    || isNaN(this.dataRepresentation.variance[1])) {
                                    instances = [];
                                }
                                break;
                            }
                            case "series": {
                                instances.push.apply(instances, this.enumerateSeries(options.objectName));
                                break;
                            }
                        }
                    }
                    return instances;
                };
                PowerKPI.prototype.enumerateSeries = function (objectName) {
                    return this.dataRepresentation.series.map(function (series) {
                        return {
                            objectName: objectName,
                            displayName: series.name,
                            selector: ColorHelper.normalizeSelector(series.selectionId.getSelector()),
                            properties: {
                                fillColor: { solid: { color: series.color } }
                            }
                        };
                    });
                };
                PowerKPI.prototype.destroy = function () {
                    this.component.destroy();
                    this.converter = null;
                    this.rootElement = null;
                    this.component = null;
                };
                PowerKPI.ViewportReducer = 3;
                return PowerKPI;
            }());
            visual.PowerKPI = PowerKPI;
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
