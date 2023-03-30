import {
  IPlotOptions,
  IPlotConfig,
  IPlotDefaults,
  Plot,
  IPlotBarDrawParams
} from "../index";
import { JsUtil } from "../index";
import { IValueMarkerTheme } from "../index";
import { HtmlUtil } from "../index";
import { CanvasOffset } from "../index";
import { ValueLine } from "../index";
import { LineStyle } from "../index";
import { PlotEvent } from "../Utils/PlotEvent";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

// region Interfaces

export interface IBarPlotOptions extends IPlotOptions {
  columnWidthRatio: number;
  minWidth: number;
}

export interface IBarPlotConfig extends IPlotConfig {
  columnWidthRatio?: number;
  minWidth?: number;
}

export interface IBarPlotDefaults extends IPlotDefaults {
  columnWidthRatio: number;
  minWidth: number;
}

// endregion

// Declarations

/**
 * Plot events enumeration values.
 * @name PlotEvent
 * @enum {string}
 * @property {string} COLUMN_WIDTH_RATIO_CHANGED Plot column width ratio has been changed
 * @property {string} MIN_WIDTH_CHANGED Plot min width has been changed
 * @readonly
 * @memberOf StockChartX
 */

const BarPlotStyle = {
  OHLC: "OHLC",
  COLORED_OHLC: "coloredOHLC",
  HLC: "HLC",
  COLORED_HLC: "coloredHLC",
  HL: "HL",
  COLORED_HL: "coloredHL",
  CANDLE: "candle",
  HOLLOW_CANDLE: "hollowCandle",
  HEIKIN_ASHI: "heikinAshi",
  RENKO: "renko",
  LINE_BREAK: "lineBreak",
  POINT_AND_FIGURE: "pointAndFigure",
  KAGI: "kagi"
};
Object.freeze(BarPlotStyle);

// endregion

export class BarPlot extends Plot {
  static readonly Style = BarPlotStyle;

  static readonly defaults: IBarPlotDefaults = {
    plotStyle: BarPlotStyle.CANDLE,
    minWidth: 1,
    columnWidthRatio: 0.8
  };

  // region Properties

  get columnWidthRatio(): number {
    let ratio = (<IBarPlotOptions>this._options).columnWidthRatio;

    return ratio || BarPlot.defaults.columnWidthRatio;
  }

  set columnWidthRatio(value: number) {
    if (JsUtil.isNegativeNumber(value) || value > 1)
      throw new Error("Ratio must be in range [0..1]");

    this._setOption(
      "columnWidthRatio",
      value,
      PlotEvent.COLUMN_WIDTH_RATIO_CHANGED
    );
  }

  get minWidth(): number {
    let width = (<IBarPlotOptions>this._options).minWidth;

    return width || BarPlot.defaults.minWidth;
  }

  set minWidth(value: number) {
    if (!JsUtil.isPositiveNumber(value))
      throw new Error("Min width must be greater than 0.");

    this._setOption("minWidth", value, PlotEvent.MIN_WIDTH_CHANGED);
  }

  // endregion

  constructor(config?: IBarPlotConfig) {
    super(config);

    this._plotThemeKey = "bar";
  }

  /**
   * inheritDoc
   */
  draw() {
    if (!this.visible) return;

    let style = BarPlotStyle;

    switch (this.plotStyle) {
      case style.OHLC:
      case style.HLC:
      case style.HL:
        this._drawBars();
        break;
      case style.COLORED_OHLC:
      case style.COLORED_HLC:
      case style.COLORED_HL:
        this._drawColoredBars();
        break;
      case style.HOLLOW_CANDLE:
        this._drawHollowCandles();
        break;
      case style.RENKO:
        this._drawBricks(true);
        break;
      case style.LINE_BREAK:
        this._drawBricks();
        break;
      case style.KAGI:
        this._drawKagi();
        break;
      default:
        this._drawCandles();
        break;
    }
  }

  drawValueMarkers() {
    if (!this.showValueMarkers) return;

    let drawParams = this._barDrawParams();
    if (drawParams.values.length === 0) return;

    let marker = this.chart.valueMarker,
      markerTheme = this._valueMarkerTheme(drawParams);

    let lastIdx = drawParams.values.length - 1;
    let lastClose = drawParams.close[lastIdx];

    marker.draw(lastClose, this.panelValueScale, markerTheme);

    if (this.showValueLines && lastClose != null) {
      let valueLineTheme = drawParams.theme.valueLine;
      let line = new ValueLine({
        point: {
          record: lastIdx + 0.5,
          value: lastClose
        },
        theme: {
          strokeColor:
            (valueLineTheme && valueLineTheme.strokeColor) ||
            markerTheme.fill.fillColor,
          width: (valueLineTheme && valueLineTheme.width) || 1,
          lineStyle:
            (valueLineTheme && valueLineTheme.lineStyle) || LineStyle.DASH
        },
        extended: this.extendValueLines,
        visible: this.showValueLines
      });
      line.chartPanel = this.chartPanel;
      line.valueScale = this.valueScale;
      line.draw();
    }
  }

  private _valueMarkerTheme(drawParams: any): IValueMarkerTheme {
    let plotTheme = drawParams.theme,
      markerTheme = plotTheme.valueMarker;

    if (markerTheme) {
      return markerTheme;
    }

    let lastIdx = drawParams.values.length - 1;
    let isUp = drawParams.close[lastIdx] >= drawParams.open[lastIdx];

    if (isUp) {
      markerTheme = plotTheme.upCandle && plotTheme.upCandle.valueMarker;
      if (markerTheme) return markerTheme;
    } else {
      markerTheme = plotTheme.downCandle && plotTheme.downCandle.valueMarker;
      if (markerTheme) return markerTheme;
    }

    let fillColor = this._getMarkerFillColor(drawParams);
    markerTheme = this.chart.valueMarker.theme;
    markerTheme.fill.fillColor = fillColor;
    markerTheme.text.fillColor = HtmlUtil.isDarkColor(fillColor)
      ? "white"
      : "black";

    return markerTheme;
  }

  /**
   * @internal
   */
  private _getMarkerFillColor(drawParams: any): string {
    let lastIdx = drawParams.values.length - 1,
      isUp = drawParams.close[lastIdx] >= drawParams.open[lastIdx],
      style = BarPlotStyle;

    switch (this.plotStyle) {
      case style.OHLC:
      case style.HLC:
      case style.HL:
        return drawParams.theme.strokeColor;
      case style.COLORED_OHLC:
      case style.COLORED_HLC:
      case style.COLORED_HL:
        return drawParams.theme[isUp ? "upBar" : "downBar"].strokeColor;
      case style.CANDLE:
      case style.HOLLOW_CANDLE:
      case style.HEIKIN_ASHI:
      case style.RENKO:
        return drawParams.theme[isUp ? "upCandle" : "downCandle"].fill
          .fillColor;
      case style.LINE_BREAK:
        return isUp
          ? drawParams.theme.upCandle.border.strokeColor
          : drawParams.theme.downCandle.fill.fillColor;
      case style.POINT_AND_FIGURE:
      case style.KAGI:
        return drawParams.theme[isUp ? "upCandle" : "downCandle"].border
          .strokeColor;
      default:
        return null;
    }
  }

  /**
   * @internal
   */
  private _drawBars() {
    let params = this._barDrawParams();
    if (params.values.length === 0) return;

    let context = params.context,
      projection = params.projection,
      dates = params.dates,
      xOffset = 0,
      style = this.plotStyle,
      isBar = style === BarPlot.Style.OHLC,
      isHLC = style === BarPlot.Style.HLC;

    if (isBar || isHLC) {
      let columnWidth = this.chart.dateScale.columnWidth,
        width = columnWidth * this.columnWidthRatio;

      if (width > this.minWidth) xOffset = Math.round(width / 2);
    }

    context.beginPath();
    for (
      let i = params.startIndex, column = params.startColumn;
      i <= params.endIndex;
      i++ , column++
    ) {
      let open = params.open[i],
        high = params.high[i],
        low = params.low[i],
        close = params.close[i];
      if (open == null || high == null || low == null || close == null)
        continue;

      let x = dates
        ? projection.xByDate(dates[i])
        : projection.xByColumn(column),
        yHigh = projection.yByValue(high),
        yLow = projection.yByValue(low);

      if (isBar && xOffset > 0) {
        let yOpen = projection.yByValue(open);

        context.moveTo(x, yOpen);
        context.lineTo(x - xOffset, yOpen);
      }

      if ((isBar || isHLC) && xOffset > 0) {
        let yClose = projection.yByValue(close);

        context.moveTo(x, yClose);
        context.lineTo(x + xOffset, yClose);
      }

      if (yHigh === yLow) yLow--;
      context.moveTo(x, yHigh);
      context.lineTo(x, yLow + CanvasOffset);
    }
    context.scxStroke(params.theme);
  }

  /**
   * @internal
   */
  private _drawColoredBars() {
    let params = this._barDrawParams();
    if (params.values.length === 0) return;

    this._drawColoredBarItems(params, true, params.theme.upBar);
    this._drawColoredBarItems(params, false, params.theme.downBar);
  }

  /**
   * @internal
   */
  private _drawColoredBarItems(
    params: IPlotBarDrawParams,
    drawUpBars: boolean,
    theme: any
  ) {
    let context = params.context,
      projection = params.projection,
      style = this.plotStyle,
      isBar = style === BarPlot.Style.COLORED_OHLC,
      isHLC = style === BarPlot.Style.COLORED_HLC,
      xOffset = 0;

    if (isBar || isHLC) {
      let columnWidth = this.chart.dateScale.columnWidth,
        width = columnWidth * this.columnWidthRatio;

      if (width > this.minWidth) xOffset = Math.round(width / 2);
    }

    context.beginPath();
    for (
      let i = params.startIndex, column = params.startColumn;
      i <= params.endIndex;
      i++ , column++
    ) {
      let open = params.open[i],
        high = params.high[i],
        low = params.low[i],
        close = params.close[i],
        isUp = close >= open;

      if (open == null || high == null || low == null || close == null)
        continue;
      if (drawUpBars !== isUp) continue;

      let x = params.dates
        ? projection.xByDate(params.dates[i])
        : projection.xByColumn(column),
        yHigh = projection.yByValue(high),
        yLow = projection.yByValue(low);

      if (isBar && xOffset > 0) {
        let yOpen = projection.yByValue(open);

        context.moveTo(x + CanvasOffset, yOpen);
        context.lineTo(x - xOffset + CanvasOffset, yOpen);
      }

      if ((isBar || isHLC) && xOffset > 0) {
        let yClose = projection.yByValue(close);

        context.moveTo(x + CanvasOffset, yClose);
        context.lineTo(x + xOffset + CanvasOffset, yClose);
      }

      if (yHigh === yLow) yLow--;
      context.moveTo(x, yHigh + CanvasOffset);
      context.lineTo(x, yLow + CanvasOffset);
    }
    context.scxApplyStrokeTheme(theme);
    context.stroke();
  }

  /**
   * @internal
   */
  private _drawCandles() {
    let params = this._barDrawParams();
    if (params.values.length === 0) return;

    // Draw up candles
    this._drawCandleItems(params, true, true);

    // Draw down candles
    this._drawCandleItems(params, false, true);

    // Draw up wicks
    this._drawCandleItems(params, true, false);

    // Draw down wicks
    this._drawCandleItems(params, false, false);
  }

  /**
   * @internal
   */
  private _drawCandleItems(
    params: IPlotBarDrawParams,
    drawUpBars: boolean,
    drawBody: boolean
  ) {
    let context = params.context,
      upTheme = params.theme.upCandle,
      downTheme = params.theme.downCandle,
      projection = params.projection,
      columnWidth = this.chart.dateScale.columnWidth,
      width = Math.max(columnWidth * this.columnWidthRatio, this.minWidth),
      borderXOffset = Math.round(width / 2);

    width = borderXOffset * 2;

    context.beginPath();
    for (
      let i = params.startIndex, column = params.startColumn;
      i <= params.endIndex;
      i++ , column++
    ) {
      let open = params.open[i],
        high = params.high[i],
        low = params.low[i],
        close = params.close[i],
        isUp = close >= open;

      if (open == null || high == null || low == null || close == null)
        continue;
      if (drawUpBars !== isUp) continue;

      let x = params.dates
        ? projection.xByDate(params.dates[i])
        : projection.xByColumn(column),
        yOpen = projection.yByValue(open),
        yClose = projection.yByValue(close);

      if (drawBody) {
        if (width < 3) {
          context.moveTo(x, yClose);
          context.lineTo(x, yOpen);
        } else {
          context.rect(
            x - borderXOffset + CanvasOffset,
            Math.min(yOpen, yClose) + CanvasOffset,
            width - 2 * CanvasOffset,
            Math.max(Math.abs(yOpen - yClose), 1)
          );
        }
      } else {
        // Draw wick
        let yHigh = projection.yByValue(high),
          yLow = projection.yByValue(low);
        if (width < 3) {
          context.moveTo(x, Math.min(yOpen, yClose));
          context.lineTo(x, yHigh);

          context.moveTo(x, Math.max(yOpen, yClose));
          context.lineTo(x, yLow);
        } else {
          context.moveTo(x, Math.min(yOpen, yClose + CanvasOffset));
          context.lineTo(x, yHigh + CanvasOffset);

          context.moveTo(x, Math.max(yOpen, yClose) + CanvasOffset);
          context.lineTo(x, yLow + CanvasOffset);
        }
      }
    }

    let theme = drawUpBars ? upTheme : downTheme;
    if (drawBody) {
      if (width < 3) {
        let bodyTheme = {
          strokeColor: theme.fill.fillColor
        };
        context.scxStroke(bodyTheme);
      } else {
        context.scxFillStroke(theme.fill, theme.border);
      }
    } else {
      context.scxStroke(theme.wick);
    }
  }

  /**
   * @internal
   */
  private _drawHollowCandles() {
    let params = this._barDrawParams();
    if (params.values.length === 0) return;

    let context = params.context,
      upTheme = params.theme.upCandle,
      downTheme = params.theme.downCandle,
      upHollowTheme = params.theme.upHollowCandle,
      downHollowTheme = params.theme.downHollowCandle;

    // Up hollow body
    this._drawHollowCandleItems(params, true, true, false, false);
    context.scxStroke(upHollowTheme.border);
    // Up hollow wick
    this._drawHollowCandleItems(params, true, true, true, false);
    context.scxStroke(upHollowTheme.wick);

    // Up fill body
    this._drawHollowCandleItems(params, true, false, false, false);
    context.scxFillStroke(upTheme.fill, upTheme.border);
    // Up fill wick
    this._drawHollowCandleItems(params, true, false, false, true);
    context.scxStroke(upTheme.wick);

    // Down hollow body
    this._drawHollowCandleItems(params, false, true, false, false);
    context.scxStroke(downHollowTheme.border);
    // Down hollow wick
    this._drawHollowCandleItems(params, false, true, true, false);
    context.scxStroke(downHollowTheme.wick);

    // Down fill body
    this._drawHollowCandleItems(params, false, false, false, false);
    context.scxFillStroke(downTheme.fill, downTheme.border);
    // Down fill wick
    this._drawHollowCandleItems(params, false, false, false, true);
    context.scxStroke(downTheme.wick);
  }

  /**
   * @internal
   */
  private _drawHollowCandleItems(
    params: IPlotBarDrawParams,
    drawUpBars: boolean,
    drawHollowBars: boolean,
    drawHollowWicks: boolean,
    drawFillWicks: boolean
  ) {
    let context = params.context,
      projection = params.projection,
      prevClose = null,
      columnWidth = this.chart.dateScale.columnWidth,
      minCandleWidth = 3,
      barWidth = Math.max(columnWidth * this.columnWidthRatio, minCandleWidth),
      halfBarWidth = Math.round(barWidth / 2);

    barWidth = halfBarWidth * 2;
    let hollowBarWidh = Math.round(Math.max(barWidth, 3) - 2 * CanvasOffset),
      hollowHalfBarWidth = Math.round(hollowBarWidh / 2) - 2 * CanvasOffset;

    for (let j = params.startIndex - 1; j >= 0; j--) {
      if (
        params.open[j] == null &&
        params.high[j] == null &&
        params.low[j] == null &&
        params.close[j] == null
      ) {
        prevClose = params.close[j];
        break;
      }
    }

    context.beginPath();
    for (
      let i = params.startIndex, column = params.startColumn;
      i <= params.endIndex;
      i++ , column++
    ) {
      let open = params.open[i],
        high = params.high[i],
        low = params.low[i],
        close = params.close[i];

      if (open == null || high == null || low == null || close == null)
        continue;
      if (prevClose == null) prevClose = open;

      let isUp = close >= prevClose,
        isHollow = close > open;

      prevClose = close;

      if (drawUpBars !== isUp || drawHollowBars !== isHollow) continue;

      let x = params.dates
        ? projection.xByDate(params.dates[i])
        : projection.xByColumn(column),
        yOpen = projection.yByValue(open),
        yClose = projection.yByValue(close);

      if (drawHollowWicks || drawFillWicks) {
        let yHigh = projection.yByValue(high),
          yLow = projection.yByValue(low);

        if (drawHollowWicks) {
          context.moveTo(x, Math.min(yOpen, yClose));
          context.lineTo(x, yHigh);

          context.moveTo(x, Math.max(yOpen, yClose));
          context.lineTo(x, yLow);
        } else {
          context.moveTo(x, Math.min(yOpen, yClose) + CanvasOffset);
          context.lineTo(x, yHigh + CanvasOffset);

          context.moveTo(x, Math.max(yOpen, yClose) + CanvasOffset);
          context.lineTo(x, yLow + CanvasOffset);
        }
      } else {
        if (drawHollowBars) {
          context.rect(
            x - hollowHalfBarWidth,
            Math.min(yOpen, yClose),
            hollowBarWidh - 2 * CanvasOffset,
            Math.max(Math.abs(yOpen - yClose), 1)
          );
        } else {
          context.rect(
            x - halfBarWidth + CanvasOffset,
            Math.min(yOpen, yClose) + CanvasOffset,
            barWidth - 2 * CanvasOffset,
            Math.max(Math.abs(yOpen - yClose), 1)
          );
        }
      }
    }
  }

  /**
   * @internal
   */
  private _drawBricks(styleRenko?: boolean) {
    let params = this._barDrawParams();
    if (params.values.length === 0) return;

    // Draw up bars.
    this._drawBrickItems(params, true, styleRenko);

    // Draw down bars.
    this._drawBrickItems(params, false, styleRenko);
  }

  /**
   * @internal
   */
  private _drawBrickItems(
    params: IPlotBarDrawParams,
    drawUpBars: boolean,
    styleRenko?: boolean
  ) {
    let context = params.context,
      projection = params.projection,
      columnWidth = this.chart.dateScale.columnWidth,
      brickWidth = Math.max(columnWidth * this.columnWidthRatio, this.minWidth),
      halfBrickWidth = Math.round(brickWidth / 2);

    context.beginPath();

    for (
      let i = params.startIndex, column = params.startColumn;
      i <= params.endIndex;
      i++ , column++
    ) {
      let open = params.open[i],
        close = params.close[i],
        isUp = close >= open;

      brickWidth = halfBrickWidth * 2;

      if (open == null || close == null) continue;
      if ((drawUpBars && !isUp) || (!drawUpBars && isUp)) continue;

      let x = params.dates
        ? projection.xByDate(params.dates[i])
        : projection.xByColumn(column),
        yOpen = projection.yByValue(open),
        yClose = projection.yByValue(close);

      if (brickWidth < 3) {
        context.moveTo(x, yClose);
        context.lineTo(x, yOpen);
      } else {
        if (!drawUpBars || styleRenko) {
          context.rect(
            x - halfBrickWidth + CanvasOffset,
            Math.min(yOpen, yClose) + CanvasOffset,
            brickWidth,
            Math.max(Math.abs(yOpen - yClose), 1)
          );
        } else {
          context.rect(
            x - halfBrickWidth,
            Math.min(yOpen, yClose),
            brickWidth,
            Math.max(Math.abs(yOpen - yClose), 1)
          );
        }
      }
    }

    let theme = drawUpBars ? params.theme.upCandle : params.theme.downCandle;
    if (brickWidth < 3) {
      let bodyTheme = {
        strokeColor: theme.fill.fillColor
      };
      context.scxStroke(bodyTheme);
    } else {
      context.scxFillStroke(theme.fill, theme.border);
    }
  }

  /**
   * @internal
   */
  private _drawKagi() {
    let params = this._barDrawParams();
    if (params.values.length === 0) return;

    // Draw up lines
    this._drawKagiItems(params, true);

    // Draw down lines
    this._drawKagiItems(params, false);
  }

  /**
   * @internal
   */
  private _drawKagiItems(params: IPlotBarDrawParams, drawUpLine: boolean) {
    let context = params.context,
      projection = params.projection,
      prevX = null,
      isCurrentLineUp = null,
      switchLine = false,
      checkPrice = null;

    context.beginPath();
    for (let i = 0; i <= params.endIndex; i++) {
      let open = params.open[i],
        close = params.close[i],
        price1 = open,
        price2 = close,
        drawConnectionLine = true;

      if (open == null || close == null) continue;

      if (isCurrentLineUp === null) {
        // Initial state
        isCurrentLineUp = close >= open;
        drawConnectionLine = false;
      } else if (isCurrentLineUp) {
        // it's falling bar.
        if (close < checkPrice) {
          // draw line to the prev check price
          switchLine = true;
          drawConnectionLine = drawUpLine;
          price1 = drawUpLine ? open : checkPrice;
          price2 = drawUpLine ? checkPrice : close;
        }
      } else {
        // It's raising bar.
        if (close > checkPrice) {
          // draw line to prev check price
          switchLine = true;
          drawConnectionLine = !drawUpLine;
          price1 = drawUpLine ? checkPrice : open;
          price2 = drawUpLine ? close : checkPrice;
        }
      }

      let x = params.dates
        ? projection.xByDate(params.dates[i])
        : projection.xByRecord(i);
      if (
        i >= params.startIndex &&
        (isCurrentLineUp === drawUpLine || switchLine)
      ) {
        let y1 = projection.yByValue(price1),
          y2 = projection.yByValue(price2);

        if (drawConnectionLine) {
          context.moveTo(prevX, y1);
          context.lineTo(x, y1);
        } else {
          context.moveTo(x, y1);
        }
        context.lineTo(x, y2);
      }
      prevX = x;

      if (isCurrentLineUp) {
        checkPrice = switchLine ? Math.max(open, close) : Math.min(open, close);
      } else {
        checkPrice = switchLine ? Math.min(open, close) : Math.max(open, close);
      }

      if (switchLine) {
        isCurrentLineUp = !isCurrentLineUp;
        switchLine = false;
      }
    }

    let theme = params.theme[drawUpLine ? "upCandle" : "downCandle"].border;
    context.scxStroke(theme);
  }
}
