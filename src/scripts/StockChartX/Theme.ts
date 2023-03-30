/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import {IPoint, ILineTheme} from "./index"
    "use strict";

    /**
     * The stroke theme structure.
     * @typedef {object} StrokeTheme
     * @type {object}
     * @property {boolean} [strokeEnabled = true] The flag that indicates whether stroke theme is enabled.
     * @property {StrokePriority} [strokePriority = 'color'] The stroke priority (for future use).
     * @property {number} [width = 1] The stroke width.
     * @property {string} [strokeColor = 'black'] The stroke color.
     * @property {LineStyle} [lineStyle = 'solid'] The stroke style.
     * @property {string} [lineCap = 'butt'] The style of the end caps for the line.
     * Possible values are 'butt', 'round' and 'square'.
     * @property {string} [lineJoin = 'miter'] The type of corner created, when two lines meet.
     * Possible values are 'bevel', 'round' and 'miter'.
     * @memberOf StockChartX
     * @example
     * // Stroke theme for the solid red 5 px line.
     * var strokeTheme = {
     *  width: 5,
     *  strokeColor: 'red'
     * };
     *
     * // Stroke theme for the dashed green line
     * var strokeTheme = {
     *  strokeColor: 'green',
     *  lineStyle: StockChartX.LineStyle.DASH
     * };
     */

    /**
     * The fill theme structure.
     * @typedef {object} FillTheme
     * @type {object}
     * @property {boolean} [fillEnabled = true] The flag that indicates whether fill theme is enabled.
     * @property {FillPriority} [fillPriority = 'color'] The fill priority (for future use).
     * @property {string} [fillColor = 'black'] The fill color.
     * @memberOf StockChartX
     * @example
     * // Red fill theme
     * var fillTheme = {
     *  fillColor: 'red'
     * };
     */

    /**
     * The text theme structure.
     * @typedef {object} TextTheme
     * @type {object}
     * @mixes StrokeTheme
     * @mixes FillTheme
     * @property {String}[fontFamily = 'Arial'] The font family (e.g. 'Arial', 'Calibri', ...). 'Arial' by default.
     * @property {Number} [fontSize = 12] The font size.
     * @property {String} [fontStyle = 'normal'] The font style (e.g. 'normal', 'italic'). 'normal' by default.
     * @property {String} [fontWeight = 'normal'] The font weight (e.g. 'normal', 'bold'). 'normal' by default.
     * @property {String} [fontVariant = 'normal'] The font variant.
     * @memberOf StockChartX
     * @example
     * var theme = {
     *  fontFamily: 'Times New Roman',
     *  fontSize: 14,
     *  fillColor: 'green',
     *  strokeEnabled: false
     * };
     */

    /**
     * Stroke priority enumeration values.
     * @enum {string}
     * @readonly
     * @memberOf StockChartX
     */
    export const StrokePriority = {
        /** The solid color stroke style. */
        COLOR: 'color'
    };
    Object.freeze(StrokePriority);

    /**
     * Fill priority enumeration values.
     * @enum {string}
     * @readonly
     * @memberOf StockChartX
     */
    export const FillPriority = {
        /** The solid color fill style. */
        COLOR: 'color'
    };
    Object.freeze(FillPriority);

    /**
     * Line styles enumeration values.
     * @enum {string}
     * @readonly
     * @memberOf StockChartX
     */
    export const LineStyle = {
        /** The solid line style. */
        SOLID: 'solid',

        /** The dashed line style. */
        DASH: 'dash',

        /** The dotted line style. */
        DOT: 'dot',

        /** DASH_DOT The dashed-dotted line style. */
        DASH_DOT: 'dash-dot'
    };
    Object.freeze(LineStyle);

    /**
     * Default font properties.
     * @name FontDefaults
     * @type {object}
     * @property {string} fontFamily The font family (e.g. 'Arial', 'Calibri', ...).
     * @property {number} fontSize The font size.
     * @property {string} fontStyle The font style (e.g. 'normal', 'italic').
     * @property {string} fontVariant The font variant.
     * @property {string} fontWeight The font weight (e.g. 'normal', 'bold').
     * @memberOf StockChartX
     */
    export let FontDefaults = {
        fontFamily: 'Arial',
        fontSize: 12,
        fontStyle: 'normal',
        fontVariant: 'normal',
        fontWeight: 'normal'
    };
    export let StrokeDefaults = {
        strokePriority: 'color',
        strokeColor: 'black',
        width: 1,
        lineStyle: LineStyle.SOLID,
        lineJoin: 'miter',
        lineCap: 'butt'
    };

    export let DashArray = {
        DOT: [1, 7],
        DASH: [7, 7],
        DASH_DOT: [7, 7, 1, 7]
    };

    export interface IStrokeTheme {
        strokeEnabled?: boolean;
        strokePriority?: string;
        width?: number;
        strokeColor?: string;
        lineStyle?: string;
        lineCap?: string;
        lineJoin?: string;
    }

    export interface ILinearGradientFillTheme {
        stop: number;
        color: string;
    }

    export interface IRadialGradientFillTheme {
        center: IPoint;
        radius: number;
        stop?: number;
        color: string;
    }

    export interface IFillTheme {
        fillEnabled?: boolean;
        fillPriority?: string;
        fillColor?: string;
        linearGradient?: string[] | ILinearGradientFillTheme[];
        radialGradient?: IRadialGradientFillTheme[];
    }

    export interface ITextTheme extends IStrokeTheme, IFillTheme {
        fontFamily: string;
        fontSize: number;
        fontStyle: string;
        fillColor: string;
        fontVariant?: string;
        fontWeight?: string;
        decoration?: string;
    }

    export interface ISpreadTheme {
        ask?: {
            line?: IStrokeTheme;
            valueMarker?: {
                fill?: IFillTheme;
                text?: ITextTheme;
            }
        };
        bid?: {
            line?: IStrokeTheme;
            valueMarker?: {
                fill?: IFillTheme;
                text?: ITextTheme;
            }
        };
    }

    export interface IPositionBarTheme {
        line: IStrokeTheme;
        kind: {
            text: ITextTheme;
        };
        quantity: {
            text: ITextTheme;
        };
        price: {
            fill: IFillTheme;
            text: ITextTheme;
        };
    }

    export interface IPositionBarThemes {
        low: IPositionBarTheme;
        height: IPositionBarTheme;
    }

    export interface IOrderBarTheme {
        line: IStrokeTheme;
        kind: {
            text: ITextTheme;
        };
        quantity: {
            text: ITextTheme;
        };
        price: {
            fill: IFillTheme;
            text: ITextTheme;
        };
    }

    export interface IOrderBarStateTheme {
        pendingSubmit: IOrderBarTheme;
        pendingCancel: IOrderBarTheme;
        pendingReplace: IOrderBarTheme;
        submitted: IOrderBarTheme;
        accepted: IOrderBarTheme;
    }

    export interface IOrderBarlThemes {
        market: IOrderBarStateTheme;
        stop: IOrderBarStateTheme;
        limit: IOrderBarStateTheme;
        stopLimit: IOrderBarStateTheme;
    }

    export interface ICheckBoxTheme {
            fill: IFillTheme;
            line: ILineTheme;
    }

    export let Theme = {
        Dark: {
            name: 'Dark',
            chart: {
                background: ['rgb(0, 0, 0)', 'rgb(46, 46, 46)'],
                border: {
                    width: 1,
                    strokeColor: 'grey',
                    lineStyle: 'solid'
                },
                instrumentWatermark: {
                    symbol: {
                        fontFamily: 'Arial',
                        fontSize: 70,
                        fontStyle: 'normal',
                        fillColor: 'white'
                    },
                    details: {
                        fontFamily: 'Arial',
                        fontSize: 40,
                        fontStyle: 'normal',
                        fillColor: 'white'
                    }
                }
            },
            splitter: {
                fillColor: 'grey',
                hoverFillColor: 'white'
            },
            chartPanel: {
                grid: {
                    width: 1,
                    strokeColor: '#505050'
                },
                title: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fontStyle: 'normal',
                    fillColor: 'white'
                },
                watermark: {
                    text: {
                        fontFamily: 'Arial',
                        fontSize: 40,
                        fontStyle: 'normal',
                        fillColor: 'white'
                    }
                }
            },
            valueScale: {
                fill: {
                    fillColor: '#000'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fontStyle: 'normal',
                    fillColor: 'white'
                },
                line: {
                    width: 1,
                    strokeColor: '#505050'
                },
                border: {
                    width: 1,
                    strokeColor: 'darkgray',
                    lineStyle: 'solid'
                },
                valueMarker: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'green'
                    }
                }
            },
            dateScale: {
                fill: {
                    fillColor: '#000'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fillColor: '#FFFFFF'
                },
                line: {
                    width: 1,
                    strokeColor: '#505050'
                },
                border: {
                    width: 1,
                    strokeColor: 'darkgray',
                    lineStyle: 'solid'
                },
                dateMarker: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: '#FFFFFF'
                    },
                    fill: {
                        fillColor: 'green'
                    },
                    stroke: {
                        strokePriority: 'color',
                        strokeColor: '#696969',
                        width: 1,
                        lineStyle: LineStyle.SOLID,
                        lineJoin: 'miter',
                        lineCap: 'butt'
                    }
                },
                breakLine: {
                    stroke: {
                        strokeColor: '#545454',
                        width: 1,
                        lineStyle: LineStyle.DASH,
                    }
                }
            },
            crossHair: {
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fillColor: 'white'
                },
                line: {
                    width: 1,
                    strokeColor: 'darkgray',
                    lineStyle: 'dashed'
                },
                fill: {
                    fillColor: '#696969'
                }
            },
            zoomIn: {
                border: {
                    width: 1,
                    strokeColor: 'white',
                    lineStyle: 'solid'
                },
                fill: {
                    fillColor: 'rgba(255, 255, 255, 0.5)'
                }
            },
            plot: {
                point: {
                    dot: {
                        fill: {
                            fillColor: 'white'
                        }
                    }
                },
                line: {
                    simple: {
                        width: 1,
                        strokeColor: 'white'
                    },
                    mountain: {
                        line: {
                            width: 1,
                            strokeColor: 'white'
                        },
                        fill: {
                            fillColor: 'rgba(0, 0, 255, 0.5)'
                        }
                    },
                    step: {
                        width: 1,
                        strokeColor: 'white'
                    }
                },
                histogram: {
                    line: {
                        width: 1,
                        strokeColor: 'white'
                    },
                    coloredLine: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    column: {
                        line: {
                            strokeEnabled: false,
                            width: 1,
                            strokeColor: 'white'
                        },
                        fill: {
                            fillColor: 'blue'
                        }
                    },
                    coloredColumn: {
                        upBar: {
                            line: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'white'
                            },
                            fill: {
                                fillColor: 'green'
                            }
                        },
                        downBar: {
                            line: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'white'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    }
                },
                bar: {
                    OHLC: {
                        width: 1,
                        strokeColor: 'white'
                    },
                    HLC: {
                        width: 1,
                        strokeColor: 'white'
                    },
                    HL: {
                        width: 1,
                        strokeColor: 'white'
                    },
                    coloredOHLC: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    coloredHLC: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    coloredHL: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    candle: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'white'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'white'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'white'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'white'
                            }
                        }
                    },
                    heikinAshi: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'white'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'white'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'white'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'white'
                            }
                        }
                    },
                    renko: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'white'
                            },
                            fill: {
                                fillColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'white'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    },
                    lineBreak: {
                        upCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'green'
                            },
                            fill: {
                                fillEnabled: false,
                                fillColor: 'green'
                            },
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'red'
                            },
                            fill: {
                                fillEnabled: true,
                                fillColor: 'red'
                            }
                        }
                    },
                    hollowCandle: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'white'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'white'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'white'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'white'
                            }
                        },
                        upHollowCandle: {
                            border: {
                                width: 1,
                                strokeColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downHollowCandle: {
                            border: {
                                width: 1,
                                strokeColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    },
                    pointAndFigure: {
                        upCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    },
                    kagi: {
                        upCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    }
                },
                indicator: {
                    line1: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: 'white'
                    },
                    line2: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#32CD32'
                    },
                    line3: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#FF0000'
                    },
                    line4: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#0000FF'
                    }
                }
            },
            selectionMarker: {
                line: {
                    strokeColor: 'white',
                    width: 1
                },
                fill: {
                    fillColor: 'black'
                }
            },
            drawing: {
                note: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'white'
                    },
                    fill: {
                        fillColor: 'orange',
                    },
                    centerPointFill: {
                        fillColor: 'rgb(68, 68, 68)'
                    },
                },
                measure: {
                    line: {
                        width: 1,
                        strokeColor: 'white',
                        strokeEnabled: true,
                        lineStyle: LineStyle.DASH
                    },
                    border: {
                        width: 1,
                        strokeColor: 'white',
                        strokeEnabled: true,
                        lineStyle: LineStyle.DASH
                    },
                    fill: {
                        fillEnabled: true,
                        fillColor: 'rgba(255, 255, 255, 0.5)'
                    },
                    balloon: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'white'
                        },
                        border: {
                            width: 1,
                            strokeColor: 'darkgray',
                            strokeEnabled: true,
                            lineStyle: LineStyle.SOLID
                        },
                        fill: {
                            fillEnabled: true,
                            fillColor: 'rgba(255, 255, 255, 0.5)'
                        }
                    }
                },
                measureTool: {
                    line: {
                        width: 1,
                        strokeColor: 'white'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'white'
                    },
                    fill: {
                        fillColor: 'rgba(0, 0, 0, 0.8)'
                    }
                },
                abstract: {
                    line: {
                        strokeColor: 'white',
                        width: 1
                    },
                    fill: {
                        fillColor: 'rgba(255, 255, 255, 0.3)'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: 'white',
                        decoration: ''
                    },
                },
                trendAngle: {
                    line: {
                        strokeColor: 'white',
                        width: 1
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: 'white',
                        decoration: ''
                    },
                    arc: {
                        strokeColor: 'white',
                        width: 1,
                        lineStyle: 'dot'
                    },
                    horizontalLine: {
                        strokeColor: 'white',
                        width: 1,
                        lineStyle: 'dot'
                    },
                },
                abstractMarker: {
                    fill: {
                        fillColor: 'white'
                    }
                },
                fibonacci: {
                    trendLine: {
                        strokeColor: 'white',
                        width: 1,
                        lineStyle: 'dash'
                    },
                    line: {
                        strokeColor: 'white',
                        width: 1
                    },
                    fill: {
                        fillColor: 'rgba(255, 255, 255, 0.3)'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: 'white'
                    }
                },
                arrowUp: {
                    fill: {
                        fillColor: 'limegreen'
                    }
                },
                arrowDown: {
                    fill: {
                        fillColor: 'red'
                    }
                },
                text: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#FFFFFF',
                        decoration: ''
                    }
                },
                image: {
                    noImage: {
                        line: {
                            strokeColor: 'red',
                            width: 1
                        }
                    }
                },
            },
            tooltip: {
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 12,
                    fillColor: 'white',
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    decoration: ''
                },
                border: {
                    enabled: true,
                    width: 1,
                    color: 'orange',
                    lineStyle: LineStyle.SOLID
                },
                fill: {
                    enabled: true,
                    color: 'rgb(44, 44, 44)'
                }
            },
            spread: {
                ask: {
                    line: {
                        width: 1,
                        strokeColor: '#00D533'
                    },
                    valueMarker: {
                        fill: {
                            fillColor: '#00D533'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'white'
                        }
                    }
                },
                bid: {
                    line: {
                        width: 1,
                        strokeColor: '#F20500'
                    },
                    valueMarker: {
                        fill: {
                            fillColor: '#F20500'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'white'
                        }
                    }
                }
            },
            highlightedColumn: {
                fill: {
                    fillColor: 'rgba(90, 130, 182, 0.45)'
                }
            },
            button: {
                accept: {
                    fill: {
                        fillColor: 'white'
                    },
                    line: {
                        strokeColor: 'green',
                        width: 1,
                    }
                },
                cancel: {
                    fill: {
                        fillColor: 'white'
                    },
                    line: {
                        strokeColor: 'red',
                        width: 1,
                    }
                },
                none: {
                    fill: {
                        fillColor: 'white'
                    }
                }
            },
            positionBar: {
                short: {
                    line: {
                        strokeColor: 'red',
                        width: 1,
                    },
                    kind: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'white',
                            decoration: ''
                        }
                    },
                    quantity: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'white',
                            decoration: ''
                        }
                    },
                    price: {
                        fill: {
                            fillColor: 'red'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'white',
                            decoration: ''
                        }
                    }
                },
                long: {
                    line: {
                        strokeColor: 'green',
                        width: 1,
                    },
                    kind: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'white',
                            decoration: ''
                        }
                    },
                    quantity: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'white',
                            decoration: ''
                        }
                    },
                    price: {
                        fill: {
                            fillColor: 'green'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'white',
                            decoration: ''
                        }
                    }
                }
            },
            orderBar: {
                buy: {
                    market: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stop: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    limit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stopLimit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    }
                },
                sell: {
                    market: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stop: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    limit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stopLimit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    }
                }
            },
        },
        Light: {
            name: 'Light',
            chart: {
                background: ['rgb(255, 255, 255)', 'rgb(255, 255, 255)'],
                border: {
                    width: 1,
                    strokeColor: 'grey',
                    lineStyle: 'solid'
                },
                instrumentWatermark: {
                    symbol: {
                        fontFamily: 'Arial',
                        fontSize: 70,
                        fontStyle: 'normal',
                        fillColor: '#0d0d0d'
                    },
                    details: {
                        fontFamily: 'Arial',
                        fontSize: 40,
                        fontStyle: 'normal',
                        fillColor: '#1b1b1b'
                    }
                }
            },
            splitter: {
                fillColor: '#999',
                hoverFillColor: '#DDD'
            },
            chartPanel: {
                grid: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                title: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fontStyle: 'normal',
                    fillColor: '#333'
                },
                watermark: {
                    text: {
                        fontFamily: 'Arial',
                        fontSize: 40,
                        fontStyle: 'normal',
                        fillColor: '#666'
                    }
                }
            },
            valueScale: {
                fill: {
                    fillColor: '#FFF'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fontStyle: 'normal',
                    fillColor: '#333'
                },
                line: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                border: {
                    width: 1,
                    strokeColor: '#CCC',
                    lineStyle: 'solid'
                },
                valueMarker: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'green'
                    }
                }
            },
            dateScale: {
                fill: {
                    fillColor: '#FFF'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fillColor: '#333'
                },
                line: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                border: {
                    width: 1,
                    strokeColor: '#CCC',
                    lineStyle: 'solid'
                },
                dateMarker: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'green'
                    },
                    stroke: {
                        strokePriority: 'color',
                        strokeColor: '#696969',
                        width: 1,
                        lineStyle: LineStyle.SOLID,
                        lineJoin: 'miter',
                        lineCap: 'butt'
                    }
                },
                breakLine: {
                    stroke: {
                        strokeColor: '#545454',
                        width: 1,
                        lineStyle: LineStyle.DASH,
                    }
                }
            },
            crossHair: {
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fillColor: 'white'
                },
                line: {
                    width: 1,
                    strokeColor: '#333',
                    lineStyle: 'dashed'
                },
                fill: {
                    fillColor: '#696969'
                }
            },
            zoomIn: {
                border: {
                    width: 1,
                    strokeColor: 'darkgray',
                    lineStyle: 'solid'
                },
                fill: {
                    fillColor: 'rgba(0, 0, 255, 0.5)'
                }
            },
            plot: {
                point: {
                    dot: {
                        fill: {
                            fillColor: '#555'
                        }
                    }
                },
                line: {
                    simple: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    mountain: {
                        line: {
                            width: 1,
                            strokeColor: '#555'
                        },
                        fill: {
                            fillColor: 'rgba(0, 0, 255, 0.5)'
                        }
                    },
                    step: {
                        width: 1,
                        strokeColor: '#555'
                    }
                },
                histogram: {
                    line: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    coloredLine: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    column: {
                        line: {
                            strokeEnabled: false,
                            width: 1,
                            strokeColor: '#555'
                        },
                        fill: {
                            fillColor: 'blue'
                        }
                    },
                    coloredColumn: {
                        upBar: {
                            line: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#555'
                            },
                            fill: {
                                fillColor: 'green'
                            }
                        },
                        downBar: {
                            line: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#555'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    }
                },
                bar: {
                    OHLC: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    HLC: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    HL: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    coloredOHLC: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    coloredHLC: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    coloredHL: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    candle: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        }
                    },
                    heikinAshi: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        }
                    },
                    renko: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    },
                    lineBreak: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'green'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'red'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    },
                    hollowCandle: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        upHollowCandle: {
                            border: {
                                width: 1,
                                strokeColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downHollowCandle: {
                            border: {
                                width: 1,
                                strokeColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    },
                    pointAndFigure: {
                        upCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    },
                    kagi: {
                        upCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    }
                },
                indicator: {
                    line1: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#505050'
                },
                    line2: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#32CD32'
                    },
                    line3: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#FF0000'
                    },
                    line4: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#0000FF'
                    }
                },
            },
            selectionMarker: {
                line: {
                    strokeColor: '#777',
                    width: 1
                },
                fill: {
                    fillColor: 'black'
                }
            },
            drawing: {
                note: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: '#15C'
                    },
                    centerPointFill: {
                        fillColor: 'white'
                    }
                },
                measure: {
                    line: {
                        width: 1,
                        strokeColor: 'white',
                        strokeEnabled: true,
                        lineStyle: LineStyle.DASH
                    },
                    border: {
                        width: 1,
                        strokeColor: 'white',
                        strokeEnabled: true,
                        lineStyle: LineStyle.DASH
                    },
                    fill: {
                        fillEnabled: true,
                        fillColor: 'rgba(0, 0, 255, 0.5)'
                    },
                    balloon: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black'
                        },
                        border: {
                            width: 1,
                            strokeColor: 'darkgray',
                            strokeEnabled: true,
                            lineStyle: LineStyle.SOLID
                        },
                        fill: {
                            fillEnabled: true,
                            fillColor: 'rgba(0, 0, 255, 0.5)'
                        }
                    }
                },
                measureTool: {
                    line: {
                        width: 1,
                        strokeColor: 'black'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'rgba(255, 255, 255, 0.8)'
                    }
                },
                abstract: {
                    line: {
                        strokeColor: '#555',
                        width: 1
                    },
                    fill: {
                        fillColor: 'rgba(255, 255, 255, 0.3)'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    },
                },
                trendAngle: {
                    line: {
                        strokeColor: '#555',
                        width: 1
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    },
                    arc: {
                        strokeColor: '#555',
                        width: 1,
                        lineStyle: 'dot'
                    },
                    horizontalLine: {
                        strokeColor: '#555',
                        width: 1,
                        lineStyle: 'dot'
                    },
                },
                abstractMarker: {
                    fill: {
                        fillColor: '#555'
                    }
                },
                fibonacci: {
                    trendLine: {
                        strokeColor: 'black',
                        width: 1,
                        lineStyle: 'dash'
                    },
                    line: {
                        strokeColor: 'black',
                        width: 1
                    },
                    fill: {
                        fillColor: 'rgba(0, 0, 0, 0.3)'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: 'black'
                    }
                },
                arrowUp: {
                    fill: {
                        fillColor: 'limegreen'
                    }
                },
                arrowDown: {
                    fill: {
                        fillColor: 'red'
                    }
                },
                text: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    }
                },
                image: {
                    noImage: {
                        line: {
                            strokeColor: 'red',
                            width: 1
                        }
                    }
                }
            },
            tooltip: {
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 12,
                    fillColor: 'black',
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    decoration: ''
                },
                border: {
                    enabled: true,
                    width: 1,
                    color: '#15C',
                    lineStyle: LineStyle.SOLID
                },
                fill: {
                    enabled: true,
                    color: 'white'
                }
            },
            spread: {
                ask: {
                    line: {
                        width: 1,
                        strokeColor: '#00D533'
                    },
                    valueMarker: {
                        fill: {
                            fillColor: '#00D533'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'white'
                        }
                    }
                },
                bid: {
                    line: {
                        width: 1,
                        strokeColor: '#F20500'
                    },
                    valueMarker: {
                        fill: {
                            fillColor: '#F20500'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'white'
                        }
                    }
                }
            },
            highlightedColumn: {
                fill: {
                    fillColor: 'rgba(90, 130, 182, 0.45)'
                }
            },
            button: {
                accept: {
                    fill: {
                        fillColor: '#BDBDBD'
                    },
                    line: {
                        strokeColor: 'green',
                        width: 1,
                    }
                },
                cancel: {
                    fill: {
                        fillColor: '#BDBDBD'
                    },
                    line: {
                        strokeColor: 'red',
                        width: 1,
                    }
                },
                none: {
                    fill: {
                        fillColor: '#BDBDBD'
                    }
                }
            },
            positionBar: {
                short: {
                    line: {
                        strokeColor: 'red',
                        width: 1,
                    },
                    kind: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    quantity: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    price: {
                        fill: {
                            fillColor: 'red'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'white',
                            decoration: ''
                        }
                    }
                },
                long: {
                    line: {
                        strokeColor: 'green',
                        width: 1,
                    },
                    kind: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    quantity: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    price: {
                        fill: {
                            fillColor: 'green'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'white',
                            decoration: ''
                        }
                    }
                }
            },
            orderBar: {
                buy: {
                    market: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stop: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    limit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stopLimit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    }
                },
                sell: {
                    market: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stop: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    limit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stopLimit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    }
                }
            }
        },
        Beet: {
            name: 'Beet',
            chart: {
                background: ['rgb(255, 255, 255)', 'rgb(255, 255, 255)'],
                border: {
                    width: 1,
                    strokeColor: 'grey',
                    lineStyle: 'solid'
                },
                instrumentWatermark: {
                    symbol: {
                        fontFamily: 'Arial',
                        fontSize: 70,
                        fontStyle: 'normal',
                        fillColor: '#0d0d0d'
                    },
                    details: {
                        fontFamily: 'Arial',
                        fontSize: 40,
                        fontStyle: 'normal',
                        fillColor: '#1b1b1b'
                    }
                }
            },
            splitter: {
                fillColor: '#999',
                hoverFillColor: '#DDD'
            },
            chartPanel: {
                grid: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                title: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fontStyle: 'normal',
                    fillColor: '#333'
                }
            },
            valueScale: {
                fill: {
                    fillColor: '#dbd0d8'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fontStyle: 'normal',
                    fillColor: '#333'
                },
                line: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                border: {
                    width: 1,
                    strokeColor: '#CCC',
                    lineStyle: 'solid'
                },
                valueMarker: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'green'
                    }
                }
            },
            dateScale: {
                fill: {
                    fillColor: '#dbd0d8'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fillColor: '#333'
                },
                line: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                border: {
                    width: 1,
                    strokeColor: '#CCC',
                    lineStyle: 'solid'
                },
                dateMarker: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'green'
                    },
                    stroke: {
                        strokePriority: 'color',
                        strokeColor: '#696969',
                        width: 1,
                        lineStyle: LineStyle.SOLID,
                        lineJoin: 'miter',
                        lineCap: 'butt'
                    }
                },
                breakLine: {
                    stroke: {
                        strokeColor: 'red',
                        width: 1,
                        lineStyle: LineStyle.DASH,
                    }
                }
            },
            crossHair: {
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fillColor: 'white'
                },
                line: {
                    width: 1,
                    strokeColor: '#333',
                    lineStyle: 'dashed'
                },
                fill: {
                    fillColor: '#696969'
                }
            },
            zoomIn: {
                border: {
                    width: 1,
                    strokeColor: 'darkgray',
                    lineStyle: 'solid'
                },
                fill: {
                    fillColor: 'rgba(0, 0, 255, 0.5)'
                }
            },
            plot: {
                point: {
                    dot: {
                        fill: {
                            fillColor: '#555'
                        }
                    }
                },
                line: {
                    simple: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    mountain: {
                        line: {
                            width: 1,
                            strokeColor: '#555'
                        },
                        fill: {
                            fillColor: 'rgba(0, 0, 255, 0.5)'
                        }
                    },
                    step: {
                        width: 1,
                        strokeColor: '#555'
                    }
                },
                histogram: {
                    line: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    coloredLine: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    column: {
                        line: {
                            strokeEnabled: false,
                            width: 1,
                            strokeColor: '#555'
                        },
                        fill: {
                            fillColor: 'blue'
                        }
                    },
                    coloredColumn: {
                        upBar: {
                            line: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#555'
                            },
                            fill: {
                                fillColor: 'green'
                            }
                        },
                        downBar: {
                            line: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#555'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    }
                },
                bar: {
                    OHLC: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    HLC: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    HL: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    coloredOHLC: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    coloredHLC: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    coloredHL: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    candle: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        }
                    },
                    heikinAshi: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        }
                    },
                    renko: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    },
                    lineBreak: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'green'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'red'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    },
                    hollowCandle: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        upHollowCandle: {
                            border: {
                                width: 1,
                                strokeColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downHollowCandle: {
                            border: {
                                width: 1,
                                strokeColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    },
                    pointAndFigure: {
                        upCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    },
                    kagi: {
                        upCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    }
                },
                indicator: {
                    line1: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#505050'
                    },
                    line2: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#32CD32'
                    },
                    line3: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#FF0000'
                    },
                    line4: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#0000FF'
                    }
                },
            },
            selectionMarker: {
                line: {
                    strokeColor: '#777',
                    width: 1
                },
                fill: {
                    fillColor: 'black'
                }
            },
            drawing: {
                note: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: '#15C'
                    },
                    centerPointFill: {
                        fillColor: 'white'
                    }
                },
                measure: {
                    line: {
                        width: 1,
                        strokeColor: 'white',
                        strokeEnabled: true,
                        lineStyle: LineStyle.DASH
                    },
                    border: {
                        width: 1,
                        strokeColor: 'white',
                        strokeEnabled: true,
                        lineStyle: LineStyle.DASH
                    },
                    fill: {
                        fillEnabled: true,
                        fillColor: 'rgba(0, 0, 255, 0.5)'
                    },
                    balloon: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black'
                        },
                        border: {
                            width: 1,
                            strokeColor: 'darkgray',
                            strokeEnabled: true,
                            lineStyle: LineStyle.SOLID
                        },
                        fill: {
                            fillEnabled: true,
                            fillColor: 'rgba(0, 0, 255, 0.5)'
                        }
                    }
                },
                measureTool: {
                    line: {
                        width: 1,
                        strokeColor: 'black'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'rgba(255, 255, 255, 0.8)'
                    }
                },
                abstract: {
                    line: {
                        strokeColor: '#555',
                        width: 1
                    },
                    fill: {
                        fillColor: 'rgba(255, 255, 255, 0.3)'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    },
                },
                trendAngle: {
                    line: {
                        strokeColor: '#555',
                        width: 1
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    },
                    arc: {
                        strokeColor: '#555',
                        width: 1,
                        lineStyle: 'dot'
                    },
                    horizontalLine: {
                        strokeColor: '#555',
                        width: 1,
                        lineStyle: 'dot'
                    },
                },
                abstractMarker: {
                    fill: {
                        fillColor: '#555'
                    }
                },
                fibonacci: {
                    trendLine: {
                        strokeColor: 'black',
                        width: 1,
                        lineStyle: 'dash'
                    },
                    line: {
                        strokeColor: 'black',
                        width: 1
                    },
                    fill: {
                        fillColor: 'rgba(0, 0, 0, 0.3)'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: 'black'
                    }
                },
                arrowUp: {
                    fill: {
                        fillColor: 'limegreen'
                    }
                },
                arrowDown: {
                    fill: {
                        fillColor: 'red'
                    }
                },
                text: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    }
                },
                image: {
                    noImage: {
                        line: {
                            strokeColor: 'red',
                            width: 1
                        }
                    }
                }
            },
            tooltip: {
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 12,
                    fillColor: 'black',
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    decoration: ''
                },
                border: {
                    enabled: true,
                    width: 1,
                    color: '#15C',
                    lineStyle: LineStyle.SOLID
                },
                fill: {
                    enabled: true,
                    color: 'white'
                }
            },
            spread: {
                ask: {
                    line: {
                        width: 1,
                        strokeColor: '#00D533'
                    },
                    valueMarker: {
                        fill: {
                            fillColor: '#00D533'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'white'
                        }
                    }
                },
                bid: {
                    line: {
                        width: 1,
                        strokeColor: '#F20500'
                    },
                    valueMarker: {
                        fill: {
                            fillColor: '#F20500'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'white'
                        }
                    }
                }
            },
            highlightedColumn: {
                fill: {
                    fillColor: 'rgba(90, 130, 182, 0.45)'
                }
            },
            button: {
                accept: {
                    fill: {
                        fillColor: '#B9B0B6'
                    },
                    line: {
                        strokeColor: 'green',
                        width: 1,
                    }
                },
                cancel: {
                    fill: {
                        fillColor: '#B9B0B6'
                    },
                    line: {
                        strokeColor: 'red',
                        width: 1,
                    }
                },
                none: {
                    fill: {
                        fillColor: '#B9B0B6'
                    }
                }
            },
            positionBar: {
                short: {
                    line: {
                        strokeColor: 'red',
                        width: 1,
                    },
                    kind: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    quantity: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    price: {
                        fill: {
                            fillColor: 'red'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'white',
                            decoration: ''
                        }
                    }
                },
                long: {
                    line: {
                        strokeColor: 'green',
                        width: 1,
                    },
                    kind: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    quantity: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    price: {
                        fill: {
                            fillColor: 'green'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'white',
                            decoration: ''
                        }
                    }
                }
            },
            orderBar: {
                buy: {
                    market: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stop: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    limit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stopLimit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    }
                },
                sell: {
                    market: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stop: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    limit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stopLimit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    }
                }
            }
        },
        Cyan: {
            name: 'Cyan',
            chart: {
                background: ['rgb(255, 255, 255)', 'rgb(255, 255, 255)'],
                border: {
                    width: 1,
                    strokeColor: 'grey',
                    lineStyle: 'solid'
                },
                instrumentWatermark: {
                    symbol: {
                        fontFamily: 'Arial',
                        fontSize: 70,
                        fontStyle: 'normal',
                        fillColor: '#0d0d0d'
                    },
                    details: {
                        fontFamily: 'Arial',
                        fontSize: 40,
                        fontStyle: 'normal',
                        fillColor: '#1b1b1b'
                    }
                }
            },
            splitter: {
                fillColor: '#999',
                hoverFillColor: '#DDD'
            },
            chartPanel: {
                grid: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                title: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fontStyle: 'normal',
                    fillColor: '#333'
                }
            },
            valueScale: {
                fill: {
                    fillColor: '#ebedf0'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fontStyle: 'normal',
                    fillColor: '#333'
                },
                line: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                border: {
                    width: 1,
                    strokeColor: '#CCC',
                    lineStyle: 'solid'
                },
                valueMarker: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'green'
                    }
                }
            },
            dateScale: {
                fill: {
                    fillColor: '#ebedf0'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fillColor: '#333'
                },
                line: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                border: {
                    width: 1,
                    strokeColor: '#CCC',
                    lineStyle: 'solid'
                },
                dateMarker: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'green'
                    },
                    stroke: {
                        strokePriority: 'color',
                        strokeColor: '#696969',
                        width: 1,
                        lineStyle: LineStyle.SOLID,
                        lineJoin: 'miter',
                        lineCap: 'butt'
                    }
                },
                breakLine: {
                    stroke: {
                        strokeColor: 'red',
                        width: 1,
                        lineStyle: LineStyle.DASH,
                    }
                }
            },
            crossHair: {
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fillColor: 'white'
                },
                line: {
                    width: 1,
                    strokeColor: '#333',
                    lineStyle: 'dashed'
                },
                fill: {
                    fillColor: '#696969'
                }
            },
            zoomIn: {
                border: {
                    width: 1,
                    strokeColor: 'darkgray',
                    lineStyle: 'solid'
                },
                fill: {
                    fillColor: 'rgba(0, 0, 255, 0.5)'
                }
            },
            plot: {
                point: {
                    dot: {
                        fill: {
                            fillColor: '#555'
                        }
                    }
                },
                line: {
                    simple: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    mountain: {
                        line: {
                            width: 1,
                            strokeColor: '#555'
                        },
                        fill: {
                            fillColor: 'rgba(0, 0, 255, 0.5)'
                        }
                    },
                    step: {
                        width: 1,
                        strokeColor: '#555'
                    }
                },
                histogram: {
                    line: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    coloredLine: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    column: {
                        line: {
                            strokeEnabled: false,
                            width: 1,
                            strokeColor: '#555'
                        },
                        fill: {
                            fillColor: 'blue'
                        }
                    },
                    coloredColumn: {
                        upBar: {
                            line: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#555'
                            },
                            fill: {
                                fillColor: 'green'
                            }
                        },
                        downBar: {
                            line: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#555'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    }
                },
                bar: {
                    OHLC: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    HLC: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    HL: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    coloredOHLC: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    coloredHLC: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    coloredHL: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    candle: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        }
                    },
                    heikinAshi: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        }
                    },
                    renko: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    },
                    lineBreak: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'green'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'red'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    },
                    hollowCandle: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        upHollowCandle: {
                            border: {
                                width: 1,
                                strokeColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downHollowCandle: {
                            border: {
                                width: 1,
                                strokeColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    },
                    pointAndFigure: {
                        upCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    },
                    kagi: {
                        upCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    }
                },
                indicator: {
                    line1: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#505050'
                    },
                    line2: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#32CD32'
                    },
                    line3: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#FF0000'
                    },
                    line4: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#0000FF'
                    }
                },
            },
            selectionMarker: {
                line: {
                    strokeColor: '#777',
                    width: 1
                },
                fill: {
                    fillColor: 'black'
                }
            },
            drawing: {
                note: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: '#15C'
                    },
                    centerPointFill: {
                        fillColor: 'white'
                    }
                },
                measure: {
                    line: {
                        width: 1,
                        strokeColor: 'white',
                        strokeEnabled: true,
                        lineStyle: LineStyle.DASH
                    },
                    border: {
                        width: 1,
                        strokeColor: 'white',
                        strokeEnabled: true,
                        lineStyle: LineStyle.DASH
                    },
                    fill: {
                        fillEnabled: true,
                        fillColor: 'rgba(0, 0, 255, 0.5)'
                    },
                    balloon: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black'
                        },
                        border: {
                            width: 1,
                            strokeColor: 'darkgray',
                            strokeEnabled: true,
                            lineStyle: LineStyle.SOLID
                        },
                        fill: {
                            fillEnabled: true,
                            fillColor: 'rgba(0, 0, 255, 0.5)'
                        }
                    }
                },
                measureTool: {
                    line: {
                        width: 1,
                        strokeColor: 'black'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'rgba(255, 255, 255, 0.8)'
                    }
                },
                abstract: {
                    line: {
                        strokeColor: '#555',
                        width: 1
                    },
                    fill: {
                        fillColor: 'rgba(255, 255, 255, 0.3)'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    },
                },
                trendAngle: {
                    line: {
                        strokeColor: '#555',
                        width: 1
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    },
                    arc: {
                        strokeColor: '#555',
                        width: 1,
                        lineStyle: 'dot'
                    },
                    horizontalLine: {
                        strokeColor: '#555',
                        width: 1,
                        lineStyle: 'dot'
                    },
                },
                abstractMarker: {
                    fill: {
                        fillColor: '#555'
                    }
                },
                fibonacci: {
                    trendLine: {
                        strokeColor: 'black',
                        width: 1,
                        lineStyle: 'dash'
                    },
                    line: {
                        strokeColor: 'black',
                        width: 1
                    },
                    fill: {
                        fillColor: 'rgba(0, 0, 0, 0.3)'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: 'black'
                    }
                },
                arrowUp: {
                    fill: {
                        fillColor: 'limegreen'
                    }
                },
                arrowDown: {
                    fill: {
                        fillColor: 'red'
                    }
                },
                text: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    }
                },
                image: {
                    noImage: {
                        line: {
                            strokeColor: 'red',
                            width: 1
                        }
                    }
                }
            },
            tooltip: {
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 12,
                    fillColor: 'black',
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    decoration: ''
                },
                border: {
                    enabled: true,
                    width: 1,
                    color: '#15C',
                    lineStyle: LineStyle.SOLID
                },
                fill: {
                    enabled: true,
                    color: 'white'
                }
            },
            spread: {
                ask: {
                    line: {
                        width: 1,
                        strokeColor: '#00D533'
                    },
                    valueMarker: {
                        fill: {
                            fillColor: '#00D533'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'white'
                        }
                    }
                },
                bid: {
                    line: {
                        width: 1,
                        strokeColor: '#F20500'
                    },
                    valueMarker: {
                        fill: {
                            fillColor: '#F20500'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'white'
                        }
                    }
                }
            },
            highlightedColumn: {
                fill: {
                    fillColor: 'rgba(90, 130, 182, 0.45)'
                }
            },
            button: {
                accept: {
                    fill: {
                        fillColor: '#BDBDBD'
                    },
                    line: {
                        strokeColor: 'green',
                        width: 1,
                    }
                },
                cancel: {
                    fill: {
                        fillColor: '#BDBDBD'
                    },
                    line: {
                        strokeColor: 'red',
                        width: 1,
                    }
                },
                none: {
                    fill: {
                        fillColor: '#BDBDBD'
                    }
                }
            },
            positionBar: {
                short: {
                    line: {
                        strokeColor: 'red',
                        width: 1,
                    },
                    kind: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    quantity: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    price: {
                        fill: {
                            fillColor: 'red'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'white',
                            decoration: ''
                        }
                    }
                },
                long: {
                    line: {
                        strokeColor: 'green',
                        width: 1,
                    },
                    kind: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    quantity: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    price: {
                        fill: {
                            fillColor: 'green'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'white',
                            decoration: ''
                        }
                    }
                }
            },
            orderBar: {
                buy: {
                    market: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stop: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    limit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stopLimit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    }
                },
                sell: {
                    market: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stop: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    limit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stopLimit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    }
                }
            }
        },
        Gray: {
            name: 'Gray',
            chart: {
                background: ['rgb(255, 255, 255)', 'rgb(255, 255, 255)'],
                border: {
                    width: 1,
                    strokeColor: 'grey',
                    lineStyle: 'solid'
                },
                instrumentWatermark: {
                    symbol: {
                        fontFamily: 'Arial',
                        fontSize: 70,
                        fontStyle: 'normal',
                        fillColor: '#0d0d0d'
                    },
                    details: {
                        fontFamily: 'Arial',
                        fontSize: 40,
                        fontStyle: 'normal',
                        fillColor: '#1b1b1b'
                    }
                }
            },
            splitter: {
                fillColor: '#999',
                hoverFillColor: '#DDD'
            },
            chartPanel: {
                grid: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                title: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fontStyle: 'normal',
                    fillColor: '#333'
                }
            },
            valueScale: {
                fill: {
                    fillColor: '#d8d8d8'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fontStyle: 'normal',
                    fillColor: '#333'
                },
                line: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                border: {
                    width: 1,
                    strokeColor: '#CCC',
                    lineStyle: 'solid'
                },
                valueMarker: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'green'
                    }
                }
            },
            dateScale: {
                fill: {
                    fillColor: '#d8d8d8'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fillColor: '#333'
                },
                line: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                border: {
                    width: 1,
                    strokeColor: '#CCC',
                    lineStyle: 'solid'
                },
                dateMarker: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'green'
                    },
                    stroke: {
                        strokePriority: 'color',
                        strokeColor: '#696969',
                        width: 1,
                        lineStyle: LineStyle.SOLID,
                        lineJoin: 'miter',
                        lineCap: 'butt'
                    }
                },
                breakLine: {
                    stroke: {
                        strokeColor: 'red',
                        width: 1,
                        lineStyle: LineStyle.DASH,
                    }
                }
            },
            crossHair: {
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fillColor: 'white'
                },
                line: {
                    width: 1,
                    strokeColor: '#333',
                    lineStyle: 'dashed'
                },
                fill: {
                    fillColor: '#696969'
                }
            },
            zoomIn: {
                border: {
                    width: 1,
                    strokeColor: 'darkgray',
                    lineStyle: 'solid'
                },
                fill: {
                    fillColor: 'rgba(0, 0, 255, 0.5)'
                }
            },
            plot: {
                point: {
                    dot: {
                        fill: {
                            fillColor: '#555'
                        }
                    }
                },
                line: {
                    simple: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    mountain: {
                        line: {
                            width: 1,
                            strokeColor: '#555'
                        },
                        fill: {
                            fillColor: 'rgba(0, 0, 255, 0.5)'
                        }
                    },
                    step: {
                        width: 1,
                        strokeColor: '#555'
                    }
                },
                histogram: {
                    line: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    coloredLine: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    column: {
                        line: {
                            strokeEnabled: false,
                            width: 1,
                            strokeColor: '#555'
                        },
                        fill: {
                            fillColor: 'blue'
                        }
                    },
                    coloredColumn: {
                        upBar: {
                            line: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#555'
                            },
                            fill: {
                                fillColor: 'green'
                            }
                        },
                        downBar: {
                            line: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#555'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    }
                },
                bar: {
                    OHLC: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    HLC: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    HL: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    coloredOHLC: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    coloredHLC: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    coloredHL: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    candle: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        }
                    },
                    heikinAshi: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        }
                    },
                    renko: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    },
                    lineBreak: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'green'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'red'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    },
                    hollowCandle: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        upHollowCandle: {
                            border: {
                                width: 1,
                                strokeColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downHollowCandle: {
                            border: {
                                width: 1,
                                strokeColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    },
                    pointAndFigure: {
                        upCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    },
                    kagi: {
                        upCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    }
                },
                indicator: {
                    line1: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#505050'
                    },
                    line2: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#32CD32'
                    },
                    line3: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#FF0000'
                    },
                    line4: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#0000FF'
                    }
                },
            },
            selectionMarker: {
                line: {
                    strokeColor: '#777',
                    width: 1
                },
                fill: {
                    fillColor: 'black'
                }
            },
            drawing: {
                note: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: '#15C'
                    },
                    centerPointFill: {
                        fillColor: 'white'
                    }
                },
                measure: {
                    line: {
                        width: 1,
                        strokeColor: 'white',
                        strokeEnabled: true,
                        lineStyle: LineStyle.DASH
                    },
                    border: {
                        width: 1,
                        strokeColor: 'white',
                        strokeEnabled: true,
                        lineStyle: LineStyle.DASH
                    },
                    fill: {
                        fillEnabled: true,
                        fillColor: 'rgba(0, 0, 255, 0.5)'
                    },
                    balloon: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black'
                        },
                        border: {
                            width: 1,
                            strokeColor: 'darkgray',
                            strokeEnabled: true,
                            lineStyle: LineStyle.SOLID
                        },
                        fill: {
                            fillEnabled: true,
                            fillColor: 'rgba(0, 0, 255, 0.5)'
                        }
                    }
                },
                measureTool: {
                    line: {
                        width: 1,
                        strokeColor: 'black'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'rgba(255, 255, 255, 0.8)'
                    }
                },
                abstract: {
                    line: {
                        strokeColor: '#555',
                        width: 1
                    },
                    fill: {
                        fillColor: 'rgba(255, 255, 255, 0.3)'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    },
                },
                trendAngle: {
                    line: {
                        strokeColor: '#555',
                        width: 1
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    },
                    arc: {
                        strokeColor: '#555',
                        width: 1,
                        lineStyle: 'dot'
                    },
                    horizontalLine: {
                        strokeColor: '#555',
                        width: 1,
                        lineStyle: 'dot'
                    },
                },
                abstractMarker: {
                    fill: {
                        fillColor: '#555'
                    }
                },
                fibonacci: {
                    trendLine: {
                        strokeColor: 'black',
                        width: 1,
                        lineStyle: 'dash'
                    },
                    line: {
                        strokeColor: 'black',
                        width: 1
                    },
                    fill: {
                        fillColor: 'rgba(0, 0, 0, 0.3)'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: 'black'
                    }
                },
                arrowUp: {
                    fill: {
                        fillColor: 'limegreen'
                    }
                },
                arrowDown: {
                    fill: {
                        fillColor: 'red'
                    }
                },
                text: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    }
                },
                image: {
                    noImage: {
                        line: {
                            strokeColor: 'red',
                            width: 1
                        }
                    }
                }
            },
            tooltip: {
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 12,
                    fillColor: 'black',
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    decoration: ''
                },
                border: {
                    enabled: true,
                    width: 1,
                    color: '#15C',
                    lineStyle: LineStyle.SOLID
                },
                fill: {
                    enabled: true,
                    color: 'white'
                }
            },
            spread: {
                ask: {
                    line: {
                        width: 1,
                        strokeColor: '#00D533'
                    },
                    valueMarker: {
                        fill: {
                            fillColor: '#00D533'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'white'
                        }
                    }
                },
                bid: {
                    line: {
                        width: 1,
                        strokeColor: '#F20500'
                    },
                    valueMarker: {
                        fill: {
                            fillColor: '#F20500'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'white'
                        }
                    }
                }
            },
            highlightedColumn: {
                fill: {
                    fillColor: 'rgba(90, 130, 182, 0.45)'
                }
            },
            button: {
                accept: {
                    fill: {
                        fillColor: '#BDBDBD'
                    },
                    line: {
                        strokeColor: 'green',
                        width: 1,
                    }
                },
                cancel: {
                    fill: {
                        fillColor: '#BDBDBD'
                    },
                    line: {
                        strokeColor: 'red',
                        width: 1,
                    }
                },
                none: {
                    fill: {
                        fillColor: '#BDBDBD'
                    }
                }
            },
            positionBar: {
                short: {
                    line: {
                        strokeColor: 'red',
                        width: 1,
                    },
                    kind: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    quantity: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    price: {
                        fill: {
                            fillColor: 'red'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'white',
                            decoration: ''
                        }
                    }
                },
                long: {
                    line: {
                        strokeColor: 'green',
                        width: 1,
                    },
                    kind: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    quantity: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    price: {
                        fill: {
                            fillColor: 'green'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'white',
                            decoration: ''
                        }
                    }
                }
            },
            orderBar: {
                buy: {
                    market: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stop: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    limit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stopLimit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    }
                },
                sell: {
                    market: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stop: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    limit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stopLimit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    }
                }
            }
        },
        Olive: {
            name: 'Olive',
            chart: {
                background: ['rgb(255, 255, 255)', 'rgb(255, 255, 255)'],
                border: {
                    width: 1,
                    strokeColor: 'grey',
                    lineStyle: 'solid'
                },
                instrumentWatermark: {
                    symbol: {
                        fontFamily: 'Arial',
                        fontSize: 70,
                        fontStyle: 'normal',
                        fillColor: '#0d0d0d'
                    },
                    details: {
                        fontFamily: 'Arial',
                        fontSize: 40,
                        fontStyle: 'normal',
                        fillColor: '#1b1b1b'
                    }
                }
            },
            splitter: {
                fillColor: '#999',
                hoverFillColor: '#DDD'
            },
            chartPanel: {
                grid: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                title: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fontStyle: 'normal',
                    fillColor: '#333'
                }
            },
            valueScale: {
                fill: {
                    fillColor: '#e2e7da'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fontStyle: 'normal',
                    fillColor: '#333'
                },
                line: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                border: {
                    width: 1,
                    strokeColor: '#CCC',
                    lineStyle: 'solid'
                },
                valueMarker: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'green'
                    }
                }
            },
            dateScale: {
                fill: {
                    fillColor: '#e2e7da'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fillColor: '#333'
                },
                line: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                border: {
                    width: 1,
                    strokeColor: '#CCC',
                    lineStyle: 'solid'
                },
                dateMarker: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'green'
                    },
                    stroke: {
                        strokePriority: 'color',
                        strokeColor: '#696969',
                        width: 1,
                        lineStyle: LineStyle.SOLID,
                        lineJoin: 'miter',
                        lineCap: 'butt'
                    }
                },
                breakLine: {
                    stroke: {
                        strokeColor: 'red',
                        width: 1,
                        lineStyle: LineStyle.DASH,
                    }
                }
            },
            crossHair: {
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fillColor: 'white'
                },
                line: {
                    width: 1,
                    strokeColor: '#333',
                    lineStyle: 'dashed'
                },
                fill: {
                    fillColor: '#696969'
                }
            },
            zoomIn: {
                border: {
                    width: 1,
                    strokeColor: 'darkgray',
                    lineStyle: 'solid'
                },
                fill: {
                    fillColor: 'rgba(0, 0, 255, 0.5)'
                }
            },
            plot: {
                point: {
                    dot: {
                        fill: {
                            fillColor: '#555'
                        }
                    }
                },
                line: {
                    simple: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    mountain: {
                        line: {
                            width: 1,
                            strokeColor: '#555'
                        },
                        fill: {
                            fillColor: 'rgba(0, 0, 255, 0.5)'
                        }
                    },
                    step: {
                        width: 1,
                        strokeColor: '#555'
                    }
                },
                histogram: {
                    line: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    coloredLine: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    column: {
                        line: {
                            strokeEnabled: false,
                            width: 1,
                            strokeColor: '#555'
                        },
                        fill: {
                            fillColor: 'blue'
                        }
                    },
                    coloredColumn: {
                        upBar: {
                            line: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#555'
                            },
                            fill: {
                                fillColor: 'green'
                            }
                        },
                        downBar: {
                            line: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#555'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    }
                },
                bar: {
                    OHLC: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    HLC: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    HL: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    coloredOHLC: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    coloredHLC: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    coloredHL: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    candle: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        }
                    },
                    heikinAshi: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        }
                    },
                    renko: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    },
                    lineBreak: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'green'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'red'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    },
                    hollowCandle: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        upHollowCandle: {
                            border: {
                                width: 1,
                                strokeColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downHollowCandle: {
                            border: {
                                width: 1,
                                strokeColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    },
                    pointAndFigure: {
                        upCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    },
                    kagi: {
                        upCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    }
                },
                indicator:{
                    line1: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#505050'
                    },
                    line2: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#32CD32'
                    },
                    line3: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#FF0000'
                    },
                    line4: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#0000FF'
                    }
                },
            },
            selectionMarker: {
                line: {
                    strokeColor: '#777',
                    width: 1
                },
                fill: {
                    fillColor: 'black'
                }
            },
            drawing: {
                note: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: '#15C'
                    },
                    centerPointFill: {
                        fillColor: 'white'
                    }
                },
                measure: {
                    line: {
                        width: 1,
                        strokeColor: 'white',
                        strokeEnabled: true,
                        lineStyle: LineStyle.DASH
                    },
                    border: {
                        width: 1,
                        strokeColor: 'white',
                        strokeEnabled: true,
                        lineStyle: LineStyle.DASH
                    },
                    fill: {
                        fillEnabled: true,
                        fillColor: 'rgba(0, 0, 255, 0.5)'
                    },
                    balloon: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black'
                        },
                        border: {
                            width: 1,
                            strokeColor: 'darkgray',
                            strokeEnabled: true,
                            lineStyle: LineStyle.SOLID
                        },
                        fill: {
                            fillEnabled: true,
                            fillColor: 'rgba(0, 0, 255, 0.5)'
                        }
                    }
                },
                measureTool: {
                    line: {
                        width: 1,
                        strokeColor: 'black'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'rgba(255, 255, 255, 0.8)'
                    }
                },
                abstract: {
                    line: {
                        strokeColor: '#555',
                        width: 1
                    },
                    fill: {
                        fillColor: 'rgba(255, 255, 255, 0.3)'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    },
                },
                trendAngle: {
                    line: {
                        strokeColor: '#555',
                        width: 1
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    },
                    arc: {
                        strokeColor: '#555',
                        width: 1,
                        lineStyle: 'dot'
                    },
                    horizontalLine: {
                        strokeColor: '#555',
                        width: 1,
                        lineStyle: 'dot'
                    },
                },
                abstractMarker: {
                    fill: {
                        fillColor: '#555'
                    }
                },
                fibonacci: {
                    trendLine: {
                        strokeColor: 'black',
                        width: 1,
                        lineStyle: 'dash'
                    },
                    line: {
                        strokeColor: 'black',
                        width: 1
                    },
                    fill: {
                        fillColor: 'rgba(0, 0, 0, 0.3)'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: 'black'
                    }
                },
                arrowUp: {
                    fill: {
                        fillColor: 'limegreen'
                    }
                },
                arrowDown: {
                    fill: {
                        fillColor: 'red'
                    }
                },
                text: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    }
                },
                image: {
                    noImage: {
                        line: {
                            strokeColor: 'red',
                            width: 1
                        }
                    }
                }
            },
            tooltip: {
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 12,
                    fillColor: 'black',
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    decoration: ''
                },
                border: {
                    enabled: true,
                    width: 1,
                    color: '#15C',
                    lineStyle: LineStyle.SOLID
                },
                fill: {
                    enabled: true,
                    color: 'white'
                }
            },
            spread: {
                ask: {
                    line: {
                        width: 1,
                        strokeColor: '#00D533'
                    },
                    valueMarker: {
                        fill: {
                            fillColor: '#00D533'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'white'
                        }
                    }
                },
                bid: {
                    line: {
                        width: 1,
                        strokeColor: '#F20500'
                    },
                    valueMarker: {
                        fill: {
                            fillColor: '#F20500'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'white'
                        }
                    }
                }
            },
            highlightedColumn: {
                fill: {
                    fillColor: 'rgba(90, 130, 182, 0.45)'
                }
            },
            button: {
                accept: {
                    fill: {
                        fillColor: '#BDBDBD'
                    },
                    line: {
                        strokeColor: 'green',
                        width: 1,
                    }
                },
                cancel: {
                    fill: {
                        fillColor: '#BDBDBD'
                    },
                    line: {
                        strokeColor: 'red',
                        width: 1,
                    }
                },
                none: {
                    fill: {
                        fillColor: '#BDBDBD'
                    }
                }
            },
            positionBar: {
                short: {
                    line: {
                        strokeColor: 'red',
                        width: 1,
                    },
                    kind: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    quantity: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    price: {
                        fill: {
                            fillColor: 'red'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'white',
                            decoration: ''
                        }
                    }
                },
                long: {
                    line: {
                        strokeColor: 'green',
                        width: 1,
                    },
                    kind: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    quantity: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    price: {
                        fill: {
                            fillColor: 'green'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'white',
                            decoration: ''
                        }
                    }
                }
            },
            orderBar: {
                buy: {
                    market: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stop: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    limit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stopLimit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    }
                },
                sell: {
                    market: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stop: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    limit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stopLimit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    }
                }
            }
        },
        Orange: {
            name: 'Orange',
            chart: {
                background: ['rgb(255, 255, 255)', 'rgb(255, 255, 255)'],
                border: {
                    width: 1,
                    strokeColor: 'grey',
                    lineStyle: 'solid'
                },
                instrumentWatermark: {
                    symbol: {
                        fontFamily: 'Arial',
                        fontSize: 70,
                        fontStyle: 'normal',
                        fillColor: '#0d0d0d'
                    },
                    details: {
                        fontFamily: 'Arial',
                        fontSize: 40,
                        fontStyle: 'normal',
                        fillColor: '#1b1b1b'
                    }
                }
            },
            splitter: {
                fillColor: '#999',
                hoverFillColor: '#DDD'
            },
            chartPanel: {
                grid: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                title: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fontStyle: 'normal',
                    fillColor: '#333'
                }
            },
            valueScale: {
                fill: {
                    fillColor: '#f1dcd4'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fontStyle: 'normal',
                    fillColor: '#333'
                },
                line: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                border: {
                    width: 1,
                    strokeColor: '#CCC',
                    lineStyle: 'solid'
                },
                valueMarker: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'green'
                    }
                }
            },
            dateScale: {
                fill: {
                    fillColor: '#f1dcd4'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fillColor: '#333'
                },
                line: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                border: {
                    width: 1,
                    strokeColor: '#CCC',
                    lineStyle: 'solid'
                },
                dateMarker: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'green'
                    },
                    stroke: {
                        strokePriority: 'color',
                        strokeColor: '#696969',
                        width: 1,
                        lineStyle: LineStyle.SOLID,
                        lineJoin: 'miter',
                        lineCap: 'butt'
                    }
                },
                breakLine: {
                    stroke: {
                        strokeColor: 'red',
                        width: 1,
                        lineStyle: LineStyle.DASH,
                    }
                }
            },
            crossHair: {
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fillColor: 'white'
                },
                line: {
                    width: 1,
                    strokeColor: '#333',
                    lineStyle: 'dashed'
                },
                fill: {
                    fillColor: '#696969'
                }
            },
            zoomIn: {
                border: {
                    width: 1,
                    strokeColor: 'darkgray',
                    lineStyle: 'solid'
                },
                fill: {
                    fillColor: 'rgba(0, 0, 255, 0.5)'
                }
            },
            plot: {
                point: {
                    dot: {
                        fill: {
                            fillColor: '#555'
                        }
                    }
                },
                line: {
                    simple: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    mountain: {
                        line: {
                            width: 1,
                            strokeColor: '#555'
                        },
                        fill: {
                            fillColor: 'rgba(0, 0, 255, 0.5)'
                        }
                    },
                    step: {
                        width: 1,
                        strokeColor: '#555'
                    }
                },
                histogram: {
                    line: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    coloredLine: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    column: {
                        line: {
                            strokeEnabled: false,
                            width: 1,
                            strokeColor: '#555'
                        },
                        fill: {
                            fillColor: 'blue'
                        }
                    },
                    coloredColumn: {
                        upBar: {
                            line: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#555'
                            },
                            fill: {
                                fillColor: 'green'
                            }
                        },
                        downBar: {
                            line: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#555'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    }
                },
                bar: {
                    OHLC: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    HLC: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    HL: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    coloredOHLC: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    coloredHLC: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    coloredHL: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    candle: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        }
                    },
                    heikinAshi: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        }
                    },
                    renko: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    },
                    lineBreak: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'green'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'red'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    },
                    hollowCandle: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        upHollowCandle: {
                            border: {
                                width: 1,
                                strokeColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downHollowCandle: {
                            border: {
                                width: 1,
                                strokeColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    },
                    pointAndFigure: {
                        upCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    },
                    kagi: {
                        upCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    }
                },
                indicator:{
                    line1: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#505050'
                    },
                    line2: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#32CD32'
                    },
                    line3: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#FF0000'
                    },
                    line4: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#0000FF'
                    }
                },
            },
            selectionMarker: {
                line: {
                    strokeColor: '#777',
                    width: 1
                },
                fill: {
                    fillColor: 'black'
                }
            },
            drawing: {
                note: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: '#15C'
                    },
                    centerPointFill: {
                        fillColor: 'white'
                    }
                },
                measure: {
                    line: {
                        width: 1,
                        strokeColor: 'white',
                        strokeEnabled: true,
                        lineStyle: LineStyle.DASH
                    },
                    border: {
                        width: 1,
                        strokeColor: 'white',
                        strokeEnabled: true,
                        lineStyle: LineStyle.DASH
                    },
                    fill: {
                        fillEnabled: true,
                        fillColor: 'rgba(0, 0, 255, 0.5)'
                    },
                    balloon: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black'
                        },
                        border: {
                            width: 1,
                            strokeColor: 'darkgray',
                            strokeEnabled: true,
                            lineStyle: LineStyle.SOLID
                        },
                        fill: {
                            fillEnabled: true,
                            fillColor: 'rgba(0, 0, 255, 0.5)'
                        }
                    }
                },
                measureTool: {
                    line: {
                        width: 1,
                        strokeColor: 'black'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'rgba(255, 255, 255, 0.8)'
                    }
                },
                abstract: {
                    line: {
                        strokeColor: '#555',
                        width: 1
                    },
                    fill: {
                        fillColor: 'rgba(255, 255, 255, 0.3)'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    },
                },
                trendAngle: {
                    line: {
                        strokeColor: '#555',
                        width: 1
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    },
                    arc: {
                        strokeColor: '#555',
                        width: 1,
                        lineStyle: 'dot'
                    },
                    horizontalLine: {
                        strokeColor: '#555',
                        width: 1,
                        lineStyle: 'dot'
                    },
                },
                abstractMarker: {
                    fill: {
                        fillColor: '#555'
                    }
                },
                fibonacci: {
                    trendLine: {
                        strokeColor: 'black',
                        width: 1,
                        lineStyle: 'dash'
                    },
                    line: {
                        strokeColor: 'black',
                        width: 1
                    },
                    fill: {
                        fillColor: 'rgba(0, 0, 0, 0.3)'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: 'black'
                    }
                },
                arrowUp: {
                    fill: {
                        fillColor: 'limegreen'
                    }
                },
                arrowDown: {
                    fill: {
                        fillColor: 'red'
                    }
                },
                text: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    }
                },
                image: {
                    noImage: {
                        line: {
                            strokeColor: 'red',
                            width: 1
                        }
                    }
                }
            },
            tooltip: {
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 12,
                    fillColor: 'black',
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    decoration: ''
                },
                border: {
                    enabled: true,
                    width: 1,
                    color: '#15C',
                    lineStyle: LineStyle.SOLID
                },
                fill: {
                    enabled: true,
                    color: 'white'
                }
            },
            spread: {
                ask: {
                    line: {
                        width: 1,
                        strokeColor: '#00D533'
                    },
                    valueMarker: {
                        fill: {
                            fillColor: '#00D533'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'white'
                        }
                    }
                },
                bid: {
                    line: {
                        width: 1,
                        strokeColor: '#F20500'
                    },
                    valueMarker: {
                        fill: {
                            fillColor: '#F20500'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'white'
                        }
                    }
                }
            },
            highlightedColumn: {
                fill: {
                    fillColor: 'rgba(90, 130, 182, 0.45)'
                }
            },
            button: {
                accept: {
                    fill: {
                        fillColor: '#A07B76'
                    },
                    line: {
                        strokeColor: 'green',
                        width: 1,
                    }
                },
                cancel: {
                    fill: {
                        fillColor: '#A07B76'
                    },
                    line: {
                        strokeColor: 'red',
                        width: 1,
                    }
                },
                none: {
                    fill: {
                        fillColor: '#A07B76'
                    }
                }
            },
            positionBar: {
                short: {
                    line: {
                        strokeColor: 'red',
                        width: 1,
                    },
                    kind: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    quantity: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    price: {
                        fill: {
                            fillColor: 'red'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'white',
                            decoration: ''
                        }
                    }
                },
                long: {
                    line: {
                        strokeColor: 'green',
                        width: 1,
                    },
                    kind: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    quantity: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    price: {
                        fill: {
                            fillColor: 'green'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'white',
                            decoration: ''
                        }
                    }
                }
            },
            orderBar: {
                buy: {
                    market: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stop: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    limit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stopLimit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    }
                },
                sell: {
                    market: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stop: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    limit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stopLimit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    }
                }
            }
        },
        Purple: {
            name: 'Purple',
            chart: {
                background: ['rgb(255, 255, 255)', 'rgb(255, 255, 255)'],
                border: {
                    width: 1,
                    strokeColor: 'grey',
                    lineStyle: 'solid'
                },
                instrumentWatermark: {
                    symbol: {
                        fontFamily: 'Arial',
                        fontSize: 70,
                        fontStyle: 'normal',
                        fillColor: '#0d0d0d'
                    },
                    details: {
                        fontFamily: 'Arial',
                        fontSize: 40,
                        fontStyle: 'normal',
                        fillColor: '#1b1b1b'
                    }
                }
            },
            splitter: {
                fillColor: '#999',
                hoverFillColor: '#DDD'
            },
            chartPanel: {
                grid: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                title: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fontStyle: 'normal',
                    fillColor: '#333'
                }
            },
            valueScale: {
                fill: {
                    fillColor: '#e5dfee'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fontStyle: 'normal',
                    fillColor: '#333'
                },
                line: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                border: {
                    width: 1,
                    strokeColor: '#CCC',
                    lineStyle: 'solid'
                },
                valueMarker: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'green'
                    }
                }
            },
            dateScale: {
                fill: {
                    fillColor: '#e5dfee'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fillColor: '#333'
                },
                line: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                border: {
                    width: 1,
                    strokeColor: '#CCC',
                    lineStyle: 'solid'
                },
                dateMarker: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'green'
                    },
                    stroke: {
                        strokePriority: 'color',
                        strokeColor: '#696969',
                        width: 1,
                        lineStyle: LineStyle.SOLID,
                        lineJoin: 'miter',
                        lineCap: 'butt'
                    }
                },
                breakLine: {
                    stroke: {
                        strokeColor: 'red',
                        width: 1,
                        lineStyle: LineStyle.DASH,
                    }
                }
            },
            crossHair: {
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fillColor: 'white'
                },
                line: {
                    width: 1,
                    strokeColor: '#333',
                    lineStyle: 'dashed'
                },
                fill: {
                    fillColor: '#696969'
                }
            },
            zoomIn: {
                border: {
                    width: 1,
                    strokeColor: 'darkgray',
                    lineStyle: 'solid'
                },
                fill: {
                    fillColor: 'rgba(0, 0, 255, 0.5)'
                }
            },
            plot: {
                point: {
                    dot: {
                        fill: {
                            fillColor: '#555'
                        }
                    }
                },
                line: {
                    simple: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    mountain: {
                        line: {
                            width: 1,
                            strokeColor: '#555'
                        },
                        fill: {
                            fillColor: 'rgba(0, 0, 255, 0.5)'
                        }
                    },
                    step: {
                        width: 1,
                        strokeColor: '#555'
                    }
                },
                histogram: {
                    line: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    coloredLine: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    column: {
                        line: {
                            strokeEnabled: false,
                            width: 1,
                            strokeColor: '#555'
                        },
                        fill: {
                            fillColor: 'blue'
                        }
                    },
                    coloredColumn: {
                        upBar: {
                            line: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#555'
                            },
                            fill: {
                                fillColor: 'green'
                            }
                        },
                        downBar: {
                            line: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#555'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    }
                },
                bar: {
                    OHLC: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    HLC: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    HL: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    coloredOHLC: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    coloredHLC: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    coloredHL: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    candle: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        }
                    },
                    heikinAshi: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        }
                    },
                    renko: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    },
                    lineBreak: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'green'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'red'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    },
                    hollowCandle: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        upHollowCandle: {
                            border: {
                                width: 1,
                                strokeColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downHollowCandle: {
                            border: {
                                width: 1,
                                strokeColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    },
                    pointAndFigure: {
                        upCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    },
                    kagi: {
                        upCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    }
                },
                indicator: {
                    line1: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#505050'
                    },
                    line2: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#32CD32'
                    },
                    line3: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#FF0000'
                    },
                    line4: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#0000FF'
                    }
                },
            },
            selectionMarker: {
                line: {
                    strokeColor: '#777',
                    width: 1
                },
                fill: {
                    fillColor: 'black'
                }
            },
            drawing: {
                note: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: '#15C'
                    },
                    centerPointFill: {
                        fillColor: 'white'
                    },

                },
                measure: {
                    line: {
                        width: 1,
                        strokeColor: 'white',
                        strokeEnabled: true,
                        lineStyle: LineStyle.DASH
                    },
                    border: {
                        width: 1,
                        strokeColor: 'white',
                        strokeEnabled: true,
                        lineStyle: LineStyle.DASH
                    },
                    fill: {
                        fillEnabled: true,
                        fillColor: 'rgba(0, 0, 255, 0.5)'
                    },
                    balloon: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black'
                        },
                        border: {
                            width: 1,
                            strokeColor: 'darkgray',
                            strokeEnabled: true,
                            lineStyle: LineStyle.SOLID
                        },
                        fill: {
                            fillEnabled: true,
                            fillColor: 'rgba(0, 0, 255, 0.5)'
                        }
                    }
                },
                measureTool: {
                    line: {
                        width: 1,
                        strokeColor: 'black'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'rgba(255, 255, 255, 0.8)'
                    }
                },
                abstract: {
                    line: {
                        strokeColor: '#555',
                        width: 1
                    },
                    fill: {
                        fillColor: 'rgba(255, 255, 255, 0.3)'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    },
                },
                trendAngle: {
                    line: {
                        strokeColor: '#555',
                        width: 1
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    },
                    arc: {
                        strokeColor: '#555',
                        width: 1,
                        lineStyle: 'dot'
                    },
                    horizontalLine: {
                        strokeColor: '#555',
                        width: 1,
                        lineStyle: 'dot'
                    },
                },
                abstractMarker: {
                    fill: {
                        fillColor: '#555'
                    }
                },
                fibonacci: {
                    trendLine: {
                        strokeColor: 'black',
                        width: 1,
                        lineStyle: 'dash'
                    },
                    line: {
                        strokeColor: 'black',
                        width: 1
                    },
                    fill: {
                        fillColor: 'rgba(0, 0, 0, 0.3)'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: 'black'
                    }
                },
                arrowUp: {
                    fill: {
                        fillColor: 'limegreen'
                    }
                },
                arrowDown: {
                    fill: {
                        fillColor: 'red'
                    }
                },
                text: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    }
                },
                image: {
                    noImage: {
                        line: {
                            strokeColor: 'red',
                            width: 1
                        }
                    }
                }
            },
            tooltip: {
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 12,
                    fillColor: 'black',
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    decoration: ''
                },
                border: {
                    enabled: true,
                    width: 1,
                    color: '#15C',
                    lineStyle: LineStyle.SOLID
                },
                fill: {
                    enabled: true,
                    color: 'white'
                }
            },
            spread: {
                ask: {
                    line: {
                        width: 1,
                        strokeColor: '#00D533'
                    },
                    valueMarker: {
                        fill: {
                            fillColor: '#00D533'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'white'
                        }
                    }
                },
                bid: {
                    line: {
                        width: 1,
                        strokeColor: '#F20500'
                    },
                    valueMarker: {
                        fill: {
                            fillColor: '#F20500'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'white'
                        }
                    }
                }
            },
            highlightedColumn: {
                fill: {
                    fillColor: 'rgba(90, 130, 182, 0.45)'
                }
            },
            button: {
                accept: {
                    fill: {
                        fillColor: '#8F809A'
                    },
                    line: {
                        strokeColor: 'green',
                        width: 1,
                    }
                },
                cancel: {
                    fill: {
                        fillColor: '#8F809A'
                    },
                    line: {
                        strokeColor: 'red',
                        width: 1,
                    }
                },
                none: {
                    fill: {
                        fillColor: '#8F809A'
                    }
                }
            },
            positionBar: {
                short: {
                    line: {
                        strokeColor: 'red',
                        width: 1,
                    },
                    kind: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    quantity: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    price: {
                        fill: {
                            fillColor: 'red'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'white',
                            decoration: ''
                        }
                    }
                },
                long: {
                    line: {
                        strokeColor: 'green',
                        width: 1,
                    },
                    kind: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    quantity: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    price: {
                        fill: {
                            fillColor: 'green'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'white',
                            decoration: ''
                        }
                    }
                }
            },
            orderBar: {
                buy: {
                    market: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stop: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    limit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stopLimit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    }
                },
                sell: {
                    market: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stop: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    limit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stopLimit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    }
                }
            }
        },
        Sky: {
            name: 'Sky',
            chart: {
                background: ['rgb(255, 255, 255)', 'rgb(255, 255, 255)'],
                border: {
                    width: 1,
                    strokeColor: 'grey',
                    lineStyle: 'solid'
                },
                instrumentWatermark: {
                    symbol: {
                        fontFamily: 'Arial',
                        fontSize: 70,
                        fontStyle: 'normal',
                        fillColor: '#0d0d0d'
                    },
                    details: {
                        fontFamily: 'Arial',
                        fontSize: 40,
                        fontStyle: 'normal',
                        fillColor: '#1b1b1b'
                    }
                }
            },
            splitter: {
                fillColor: '#999',
                hoverFillColor: '#DDD'
            },
            chartPanel: {
                grid: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                title: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fontStyle: 'normal',
                    fillColor: '#333'
                }
            },
            valueScale: {
                fill: {
                    fillColor: '#d6e2f0'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fontStyle: 'normal',
                    fillColor: '#333'
                },
                line: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                border: {
                    width: 1,
                    strokeColor: '#CCC',
                    lineStyle: 'solid'
                },
                valueMarker: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'green'
                    }
                }
            },
            dateScale: {
                fill: {
                    fillColor: '#d6e2f0'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fillColor: '#333'
                },
                line: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                border: {
                    width: 1,
                    strokeColor: '#CCC',
                    lineStyle: 'solid'
                },
                dateMarker: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'green'
                    },
                    stroke: {
                        strokePriority: 'color',
                        strokeColor: '#696969',
                        width: 1,
                        lineStyle: LineStyle.SOLID,
                        lineJoin: 'miter',
                        lineCap: 'butt'
                    }
                },
                breakLine: {
                    stroke: {
                        strokeColor: 'red',
                        width: 1,
                        lineStyle: LineStyle.DASH,
                    }
                }
            },
            crossHair: {
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fillColor: 'white'
                },
                line: {
                    width: 1,
                    strokeColor: '#333',
                    lineStyle: 'dashed'
                },
                fill: {
                    fillColor: '#696969'
                }
            },
            zoomIn: {
                border: {
                    width: 1,
                    strokeColor: 'darkgray',
                    lineStyle: 'solid'
                },
                fill: {
                    fillColor: 'rgba(0, 0, 255, 0.5)'
                }
            },
            plot: {
                point: {
                    dot: {
                        fill: {
                            fillColor: '#555'
                        }
                    }
                },
                line: {
                    simple: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    mountain: {
                        line: {
                            width: 1,
                            strokeColor: '#555'
                        },
                        fill: {
                            fillColor: 'rgba(0, 0, 255, 0.5)'
                        }
                    },
                    step: {
                        width: 1,
                        strokeColor: '#555'
                    }
                },
                histogram: {
                    line: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    coloredLine: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    column: {
                        line: {
                            strokeEnabled: false,
                            width: 1,
                            strokeColor: '#555'
                        },
                        fill: {
                            fillColor: 'blue'
                        }
                    },
                    coloredColumn: {
                        upBar: {
                            line: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#555'
                            },
                            fill: {
                                fillColor: 'green'
                            }
                        },
                        downBar: {
                            line: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#555'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    }
                },
                bar: {
                    OHLC: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    HLC: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    HL: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    coloredOHLC: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    coloredHLC: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    coloredHL: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    candle: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        }
                    },
                    heikinAshi: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        }
                    },
                    renko: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    },
                    lineBreak: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'green'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'red'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    },
                    hollowCandle: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        upHollowCandle: {
                            border: {
                                width: 1,
                                strokeColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downHollowCandle: {
                            border: {
                                width: 1,
                                strokeColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    },
                    pointAndFigure: {
                        upCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    },
                    kagi: {
                        upCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    }
                },
                indicator: {
                    line1: {

                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#505050'
                    },
                    line2: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#32CD32'
                    },
                    line3: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#FF0000'
                    },
                    line4: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#0000FF'
                    }
                },
            },
            selectionMarker: {
                line: {
                    strokeColor: '#777',
                    width: 1
                },
                fill: {
                    fillColor: 'black'
                }
            },
            drawing: {
                note: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: '#15C'
                    },
                    centerPointFill: {
                        fillColor: 'white'
                    },

                },
                measure: {
                    line: {
                        width: 1,
                        strokeColor: 'white',
                        strokeEnabled: true,
                        lineStyle: LineStyle.DASH
                    },
                    border: {
                        width: 1,
                        strokeColor: 'white',
                        strokeEnabled: true,
                        lineStyle: LineStyle.DASH
                    },
                    fill: {
                        fillEnabled: true,
                        fillColor: 'rgba(0, 0, 255, 0.5)'
                    },
                    balloon: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black'
                        },
                        border: {
                            width: 1,
                            strokeColor: 'darkgray',
                            strokeEnabled: true,
                            lineStyle: LineStyle.SOLID
                        },
                        fill: {
                            fillEnabled: true,
                            fillColor: 'rgba(0, 0, 255, 0.5)'
                        }
                    }
                },
                measureTool: {
                    line: {
                        width: 1,
                        strokeColor: 'black'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'rgba(255, 255, 255, 0.8)'
                    }
                },
                abstract: {
                    line: {
                        strokeColor: '#555',
                        width: 1
                    },
                    fill: {
                        fillColor: 'rgba(255, 255, 255, 0.3)'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    },
                },
                trendAngle: {
                    line: {
                        strokeColor: '#555',
                        width: 1
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    },
                    arc: {
                        strokeColor: '#555',
                        width: 1,
                        lineStyle: 'dot'
                    },
                    horizontalLine: {
                        strokeColor: '#555',
                        width: 1,
                        lineStyle: 'dot'
                    },
                },
                abstractMarker: {
                    fill: {
                        fillColor: '#555'
                    }
                },
                fibonacci: {
                    trendLine: {
                        strokeColor: 'black',
                        width: 1,
                        lineStyle: 'dash'
                    },
                    line: {
                        strokeColor: 'black',
                        width: 1
                    },
                    fill: {
                        fillColor: 'rgba(0, 0, 0, 0.3)'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: 'black'
                    }
                },
                arrowUp: {
                    fill: {
                        fillColor: 'limegreen'
                    }
                },
                arrowDown: {
                    fill: {
                        fillColor: 'red'
                    }
                },
                text: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    }
                },
                image: {
                    noImage: {
                        line: {
                            strokeColor: 'red',
                            width: 1
                        }
                    }
                }
            },
            tooltip: {
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 12,
                    fillColor: 'black',
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    decoration: ''
                },
                border: {
                    enabled: true,
                    width: 1,
                    color: '#15C',
                    lineStyle: LineStyle.SOLID
                },
                fill: {
                    enabled: true,
                    color: 'white'
                }
            },
            spread: {
                ask: {
                    line: {
                        width: 1,
                        strokeColor: '#00D533'
                    },
                    valueMarker: {
                        fill: {
                            fillColor: '#00D533'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'white'
                        }
                    }
                },
                bid: {
                    line: {
                        width: 1,
                        strokeColor: '#F20500'
                    },
                    valueMarker: {
                        fill: {
                            fillColor: '#F20500'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'white'
                        }
                    }
                }
            },
            highlightedColumn: {
                fill: {
                    fillColor: 'rgba(90, 130, 182, 0.45)'
                }
            },
            button: {
                accept: {
                    fill: {
                        fillColor: '#BDBDBD'
                    },
                    line: {
                        strokeColor: 'green',
                        width: 1,
                    }
                },
                cancel: {
                    fill: {
                        fillColor: '#BDBDBD'
                    },
                    line: {
                        strokeColor: 'red',
                        width: 1,
                    }
                },
                none: {
                    fill: {
                        fillColor: '#BDBDBD'
                    }
                }
            },
            positionBar: {
                short: {
                    line: {
                        strokeColor: 'red',
                        width: 1,
                    },
                    kind: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    quantity: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    price: {
                        fill: {
                            fillColor: 'red'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'white',
                            decoration: ''
                        }
                    }
                },
                long: {
                    line: {
                        strokeColor: 'green',
                        width: 1,
                    },
                    kind: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    quantity: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    price: {
                        fill: {
                            fillColor: 'green'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'white',
                            decoration: ''
                        }
                    }
                }
            },
            orderBar: {
                buy: {
                    market: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stop: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    limit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stopLimit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    }
                },
                sell: {
                    market: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stop: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    limit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stopLimit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    }
                }
            }
        },
        Teal: {
            name: 'Teal',
            chart: {
                background: ['rgb(255, 255, 255)', 'rgb(255, 255, 255)'],
                border: {
                    width: 1,
                    strokeColor: 'grey',
                    lineStyle: 'solid'
                },
                instrumentWatermark: {
                    symbol: {
                        fontFamily: 'Arial',
                        fontSize: 70,
                        fontStyle: 'normal',
                        fillColor: '#0d0d0d'
                    },
                    details: {
                        fontFamily: 'Arial',
                        fontSize: 40,
                        fontStyle: 'normal',
                        fillColor: '#1b1b1b'
                    }
                }
            },
            splitter: {
                fillColor: '#999',
                hoverFillColor: '#DDD'
            },
            chartPanel: {
                grid: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                title: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fontStyle: 'normal',
                    fillColor: '#333'
                }
            },
            valueScale: {
                fill: {
                    fillColor: '#dee5e5'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fontStyle: 'normal',
                    fillColor: '#333'
                },
                line: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                border: {
                    width: 1,
                    strokeColor: '#CCC',
                    lineStyle: 'solid'
                },
                valueMarker: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'green'
                    }
                }
            },
            dateScale: {
                fill: {
                    fillColor: '#dee5e5'
                },
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fillColor: '#333'
                },
                line: {
                    width: 1,
                    strokeColor: '#CCC'
                },
                border: {
                    width: 1,
                    strokeColor: '#CCC',
                    lineStyle: 'solid'
                },
                dateMarker: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'green'
                    },
                    stroke: {
                        strokePriority: 'color',
                        strokeColor: '#696969',
                        width: 1,
                        lineStyle: LineStyle.SOLID,
                        lineJoin: 'miter',
                        lineCap: 'butt'
                    }
                },
                breakLine: {
                    stroke: {
                        strokeColor: 'red',
                        width: 1,
                        lineStyle: LineStyle.DASH,
                    }
                }
            },
            crossHair: {
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fillColor: 'white'
                },
                line: {
                    width: 1,
                    strokeColor: '#333',
                    lineStyle: 'dashed'
                },
                fill: {
                    fillColor: '#696969'
                }
            },
            zoomIn: {
                border: {
                    width: 1,
                    strokeColor: 'darkgray',
                    lineStyle: 'solid'
                },
                fill: {
                    fillColor: 'rgba(0, 0, 255, 0.5)'
                }
            },
            plot: {
                point: {
                    dot: {
                        fill: {
                            fillColor: '#555'
                        }
                    }
                },
                line: {
                    simple: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    mountain: {
                        line: {
                            width: 1,
                            strokeColor: '#555'
                        },
                        fill: {
                            fillColor: 'rgba(0, 0, 255, 0.5)'
                        }
                    },
                    step: {
                        width: 1,
                        strokeColor: '#555'
                    }
                },
                histogram: {
                    line: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    coloredLine: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    column: {
                        line: {
                            strokeEnabled: false,
                            width: 1,
                            strokeColor: '#555'
                        },
                        fill: {
                            fillColor: 'blue'
                        }
                    },
                    coloredColumn: {
                        upBar: {
                            line: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#555'
                            },
                            fill: {
                                fillColor: 'green'
                            }
                        },
                        downBar: {
                            line: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#555'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    }
                },
                bar: {
                    OHLC: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    HLC: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    HL: {
                        width: 1,
                        strokeColor: '#555'
                    },
                    coloredOHLC: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    coloredHLC: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    coloredHL: {
                        upBar: {
                            width: 1,
                            strokeColor: 'green'
                        },
                        downBar: {
                            width: 1,
                            strokeColor: 'red'
                        }
                    },
                    candle: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        }
                    },
                    heikinAshi: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        }
                    },
                    renko: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    },
                    lineBreak: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'green'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: 'red'
                            },
                            fill: {
                                fillColor: 'red'
                            }
                        }
                    },
                    hollowCandle: {
                        upCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: false,
                                width: 1,
                                strokeColor: '#CCC'
                            },
                            fill: {
                                fillColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: '#555'
                            }
                        },
                        upHollowCandle: {
                            border: {
                                width: 1,
                                strokeColor: 'green'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downHollowCandle: {
                            border: {
                                width: 1,
                                strokeColor: 'red'
                            },
                            wick: {
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    },
                    pointAndFigure: {
                        upCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    },
                    kagi: {
                        upCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'green'
                            }
                        },
                        downCandle: {
                            border: {
                                strokeEnabled: true,
                                width: 1,
                                strokeColor: 'red'
                            }
                        }
                    }
                },
                indicator: {
                    line1: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#505050'
                    },
                    line2: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#32CD32'
                    },
                    line3: {
                        width: 1,
                        strokeColor: '#FF0000'
                    },
                    line4: {
                        width: 1,
                        lineStyle: 'solid',
                        strokeColor: '#0000FF'
                    }
                },
            },
            selectionMarker: {
                line: {
                    strokeColor: '#777',
                    width: 1
                },
                fill: {
                    fillColor: 'black'
                }
            },
            drawing: {
                note: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: '#15C'
                    },
                    centerPointFill: {
                        fillColor: 'white'
                    }
                },
                measure: {
                    line: {
                        width: 1,
                        strokeColor: 'white',
                        strokeEnabled: true,
                        lineStyle: LineStyle.DASH
                    },
                    border: {
                        width: 1,
                        strokeColor: 'white',
                        strokeEnabled: true,
                        lineStyle: LineStyle.DASH
                    },
                    fill: {
                        fillEnabled: true,
                        fillColor: 'rgba(0, 0, 255, 0.5)'
                    },
                    balloon: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black'
                        },
                        border: {
                            width: 1,
                            strokeColor: 'darkgray',
                            strokeEnabled: true,
                            lineStyle: LineStyle.SOLID
                        },
                        fill: {
                            fillEnabled: true,
                            fillColor: 'rgba(0, 0, 255, 0.5)'
                        }
                    }
                },
                measureTool: {
                    line: {
                        width: 1,
                        strokeColor: 'black'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 11,
                        fillColor: 'black'
                    },
                    fill: {
                        fillColor: 'rgba(255, 255, 255, 0.8)'
                    }
                },
                abstract: {
                    line: {
                        strokeColor: '#555',
                        width: 1
                    },
                    fill: {
                        fillColor: 'rgba(255, 255, 255, 0.3)'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    },
                },
                trendAngle: {
                    line: {
                        strokeColor: '#555',
                        width: 1
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    },
                    arc: {
                        strokeColor: '#555',
                        width: 1,
                        lineStyle: 'dot'
                    },
                    horizontalLine: {
                        strokeColor: '#555',
                        width: 1,
                        lineStyle: 'dot'
                    },
                },
                abstractMarker: {
                    fill: {
                        fillColor: '#555'
                    }
                },
                fibonacci: {
                    trendLine: {
                        strokeColor: 'black',
                        width: 1,
                        lineStyle: 'dash'
                    },
                    line: {
                        strokeColor: 'black',
                        width: 1
                    },
                    fill: {
                        fillColor: 'rgba(0, 0, 0, 0.3)'
                    },
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: 'black'
                    }
                },
                arrowUp: {
                    fill: {
                        fillColor: 'limegreen'
                    }
                },
                arrowDown: {
                    fill: {
                        fillColor: 'red'
                    }
                },
                text: {
                    text: {
                        fontFamily: 'Calibri',
                        fontSize: 12,
                        fillColor: '#555',
                        decoration: ''
                    }
                },
                image: {
                    noImage: {
                        line: {
                            strokeColor: 'red',
                            width: 1
                        }
                    }
                }
            },
            tooltip: {
                text: {
                    fontFamily: 'Calibri',
                    fontSize: 12,
                    fillColor: 'black',
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    decoration: ''
                },
                border: {
                    enabled: true,
                    width: 1,
                    color: '#15C',
                    lineStyle: LineStyle.SOLID
                },
                fill: {
                    enabled: true,
                    color: 'white'
                }
            },
            spread: {
                ask: {
                    line: {
                        width: 1,
                        strokeColor: '#00D533'
                    },
                    valueMarker: {
                        fill: {
                            fillColor: '#00D533'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'white'
                        }
                    }
                },
                bid: {
                    line: {
                        width: 1,
                        strokeColor: '#F20500'
                    },
                    valueMarker: {
                        fill: {
                            fillColor: '#F20500'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'white'
                        }
                    }
                }
            },
            highlightedColumn: {
                fill: {
                    fillColor: 'rgba(90, 130, 182, 0.45)'
                }
            },
            button: {
                accept: {
                    fill: {
                        fillColor: '#BDBDBD'
                    },
                    line: {
                        strokeColor: 'green',
                        width: 1,
                    }
                },
                cancel: {
                    fill: {
                        fillColor: '#BDBDBD'
                    },
                    line: {
                        strokeColor: 'red',
                        width: 1,
                    }
                },
                none: {
                    fill: {
                        fillColor: '#BDBDBD'
                    }
                }
            },
            positionBar: {
                short: {
                    line: {
                        strokeColor: 'red',
                        width: 1,
                    },
                    kind: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    quantity: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    price: {
                        fill: {
                            fillColor: 'red'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'white',
                            decoration: ''
                        }
                    }
                },
                long: {
                    line: {
                        strokeColor: 'green',
                        width: 1,
                    },
                    kind: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fontStyle: 'normal',
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    quantity: {
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'black',
                            decoration: ''
                        }
                    },
                    price: {
                        fill: {
                            fillColor: 'green'
                        },
                        text: {
                            fontFamily: 'Calibri',
                            fontSize: 11,
                            fillColor: 'white',
                            decoration: ''
                        }
                    }
                }
            },
            orderBar: {
                buy: {
                    market: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stop: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    limit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stopLimit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'green',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'green'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    }
                },
                sell: {
                    market: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stop: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    limit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    },
                    stopLimit: {
                        pendingSubmit: {
                            line: {
                                strokeColor: 'grey',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'grey'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingCancel: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        pendingReplace: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        submitted: {
                            line: {
                                strokeColor: 'orange',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fontStyle: 'normal',
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'orange'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        },
                        accepted: {
                            line: {
                                strokeColor: 'red',
                                width: 1,
                            },
                            kind: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            quantity: {
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'black',
                                    decoration: ''
                                }
                            },
                            price: {
                                fill: {
                                    fillColor: 'red'
                                },
                                text: {
                                    fontFamily: 'Calibri',
                                    fontSize: 11,
                                    fillColor: 'white',
                                    decoration: ''
                                }
                            }
                        }
                    }
                }
            }
        }
    };