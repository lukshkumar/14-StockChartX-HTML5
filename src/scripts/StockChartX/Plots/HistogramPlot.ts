import {
  IPlotOptions,
  IPlotConfig,
  IPlotDefaults,
  Plot
} from "../index";
import { JsUtil } from "../index";
import { PlotEvent } from "../Utils/PlotEvent";
import { CanvasOffset } from "../index";

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

export interface IHistogramPlotOptions extends IPlotOptions {
  baseValue: number;
  columnWidthRatio: number;
  minColumnWidth: number;
}

export interface IHistogramPlotConfig extends IPlotConfig {
  baseValue?: number;
  columnWidthRatio?: number;
  minColumnWidth?: number;
}

export interface IHistogramPlotDefaults extends IPlotDefaults {
  baseValue: number;
  columnWidthRatio: number;
  minWidth: number;
}

// endregion

// region Declarations

const HistogramPlotStyle = {
  LINE: "line",
  COLORED_LINE: "coloredLine",
  COLUMN: "column",
  COLORED_COLUMN: "coloredColumn"
};
Object.freeze(HistogramPlotStyle);

// endregion

/**
 * Represents histogram plot.
 * @param {Object} [config] The configuration object.
 * @constructor StockChartX.HistogramPlot
 * @augments StockChartX.Plot
 * @example
 *  var plot = new StockChartX.HistogramPlot({
 *      dataSeries: volumeDataSeries
 *  });
 */
export class HistogramPlot extends Plot {
  static readonly Style = HistogramPlotStyle;

  static readonly defaults: IHistogramPlotDefaults = {
    plotStyle: HistogramPlotStyle.LINE,
    baseValue: 0.0,
    columnWidthRatio: 0.5,
    minWidth: 3
  };

  // region Properties

  /**
   * Gets/Sets base value.
   * @name baseValue
   * @type {number}
   * @memberOf StockChartX.HistogramPlot#
   */
  get baseValue(): number {
    let value = (<IHistogramPlotOptions>this._options).baseValue;

    return value != null ? value : HistogramPlot.defaults.baseValue;
  }

  set baseValue(value: number) {
    if (!JsUtil.isFiniteNumber(value))
      throw new TypeError("Value must be a finite number.");

    this._setOption("baseValue", value, PlotEvent.BASE_VALUE_CHANGED);
  }

  /**
   * Gets/Sets histogram column width ratio.
   * @name columnWidthRatio
   * It is used if plot style is set to StockChartX.HistogramPlot.COLUMN.
   * The value must be in range (0..1].
   * @type {number}
   * @memberOf StockChartX.HistogramPlot#
   */
  get columnWidthRatio(): number {
    let ratio = (<IHistogramPlotOptions>this._options).columnWidthRatio;

    return ratio || HistogramPlot.defaults.columnWidthRatio;
  }

  set columnWidthRatio(value: number) {
    if (JsUtil.isNegativeNumber(value) || value > 1)
      throw new Error("Ratio must be in range (0..1]");

    this._setOption(
      "columnWidthRatio",
      value,
      PlotEvent.COLUMN_WIDTH_RATIO_CHANGED
    );
  }

  /**
   * Gets/Sets min width of histogram column.
   * @name minColumnWidth
   * It is used if plot style is set to StockChartX.HistogramPlot.Style.COLUMN.
   * @type {number}
   * @memberOf StockChartX.HistogramPlot#
   */
  get minColumnWidth(): number {
    let width = (<IHistogramPlotOptions>this._options).minColumnWidth;

    return width || HistogramPlot.defaults.minWidth;
  }

  set minColumnWidth(value: number) {
    if (!JsUtil.isPositiveNumber(value))
      throw new Error("Min width must be a positive number.");

    this._setOption("minColumnWidth", value, PlotEvent.MIN_WIDTH_CHANGED);
  }

  // endregion

  constructor(config?: IHistogramPlotConfig) {
    super(config);

    this._plotThemeKey = "histogram";
  }

  /**
   * @inheritdoc
   */
  draw() {
    if (!this.visible) return;

    switch (this.plotStyle) {
      case HistogramPlotStyle.COLORED_LINE:
        this._drawColoredLines();
        break;
      case HistogramPlotStyle.COLUMN:
        this._drawColumns();
        break;
      case HistogramPlotStyle.COLORED_COLUMN:
        this._drawColoredColumns();
        break;
      default:
        this._drawLines();
        break;
    }
  }

  drawValueMarkers() {
    if (this.plotStyle === HistogramPlotStyle.COLORED_COLUMN)
      this._setupValueMarkersTheme();
    super.drawValueMarkers();
  }

  /**
   * @internal
   */
  private _drawLines() {
    let params = this._valueDrawParams();

    if (params.values.length === 0) return;

    let context = params.context,
      projection = params.projection,
      dates = params.dates,
      baseValueY = projection.yByValue(this.baseValue),
      prevX = null,
      maxValue = -Infinity;

    context.beginPath();
    for (
      let i = params.startIndex, column = params.startColumn;
      i <= params.endIndex;
      i++, column++
    ) {
      let value = params.values[i];
      if (value == null) continue;

      let x = dates
        ? projection.xByDate(dates[i])
        : projection.xByColumn(column);
      if (x === prevX) {
        maxValue = Math.max(maxValue, value);
      } else {
        if (prevX !== null) {
          context.moveTo(prevX, projection.yByValue(maxValue) + CanvasOffset);
          context.lineTo(prevX, baseValueY + CanvasOffset);
        }

        maxValue = value;
        prevX = x;
      }
    }
    context.moveTo(prevX, projection.yByValue(maxValue) + CanvasOffset);
    context.lineTo(prevX, baseValueY + CanvasOffset);

    context.scxApplyStrokeTheme(params.theme);
    context.stroke();
  }

  /**
   * @internal
   */
  private _drawColoredLines() {
    let params = this._barDrawParams();
    if (params.values.length === 0) return;

    let context = params.context,
      projection = params.projection,
      dates = params.dates,
      baseValueY = projection.yByValue(this.baseValue);

    let drawHistogram = (drawUpBars: boolean, theme: any) => {
      let prevX = null,
        maxValue = -Infinity;

      context.beginPath();
      for (
        let i = params.startIndex, column = params.startColumn;
        i <= params.endIndex;
        i++, column++
      ) {
        let value = params.values[i];
        if (value == null) continue;
        if (drawUpBars && params.close[i] < params.open[i]) continue;
        if (!drawUpBars && params.close[i] >= params.open[i]) continue;

        let x = dates
          ? projection.xByDate(dates[i])
          : projection.xByColumn(column);
        if (x === prevX) {
          maxValue = Math.max(maxValue, value);
        } else {
          if (prevX !== null) {
            context.moveTo(x, projection.yByValue(value) + CanvasOffset);
            context.lineTo(x, baseValueY + CanvasOffset);
          }

          maxValue = value;
          prevX = x;
        }
      }
      context.moveTo(prevX, projection.yByValue(maxValue) + CanvasOffset);
      context.lineTo(prevX, baseValueY + CanvasOffset);

      context.scxApplyStrokeTheme(theme);
      context.stroke();
    };
    drawHistogram(true, params.theme.upBar);
    drawHistogram(false, params.theme.downBar);
  }

  /**
   * @internal
   */
  private _drawColumns() {
    let params = this._barDrawParams();
    if (params.values.length === 0) return;

    let context = params.context,
      projection = params.projection,
      dates = params.dates,
      yBaseValue = projection.yByValue(this.baseValue),
      columnWidth = this.chart.dateScale.columnWidth,
      xOffset = Math.round(
        Math.max(columnWidth * this.columnWidthRatio, this.minColumnWidth) / 2
      ),
      width = xOffset * 2,
      prevX = null,
      y,
      maxValue = -Infinity;

    context.beginPath();
    for (
      let i = params.startIndex, column = params.startColumn;
      i <= params.endIndex;
      i++, column++
    ) {
      let value = params.values[i];
      if (value == null) continue;

      let x = dates
        ? projection.xByDate(dates[i])
        : projection.xByColumn(column);
      if (x === prevX) {
        maxValue = Math.max(maxValue, value);
      } else {
        if (prevX !== null) {
          y = projection.yByValue(maxValue);
          context.rect(
            prevX - xOffset + CanvasOffset,
            Math.min(y, yBaseValue) + CanvasOffset,
            width,
            Math.max(Math.abs(y - yBaseValue), 1)
          );
        }

        maxValue = value;
        prevX = x;
      }
    }
    y = projection.yByValue(maxValue);
    context.rect(
      prevX - xOffset + CanvasOffset,
      Math.min(y, yBaseValue) + CanvasOffset,
      width,
      Math.max(Math.abs(y - yBaseValue), 1)
    );

    let theme = params.theme;
    context.scxFillStroke(theme.fill, theme.line);
  }

  /**
   * @internal
   */
  private _setupValueMarkersTheme() {
    let params = this._barDrawParams();

    if (params.values.length === 0) return;

    let theme = this.actualTheme,
      color = null,
      lastIdx = params.values.length - 1,
      isUp = params.close[lastIdx] >= params.open[lastIdx];

    if (isUp) {
      color = theme.upCandle && theme.upCandle.fill.fillColor;
    } else {
      color = theme.downCandle && theme.downCandle.fill.fillColor;
    }
    theme.strokeColor = color;
  }

  /**
   * @internal
   */
  private _drawColoredColumns() {
    let params = this._barDrawParams();
    if (params.values.length === 0) return;

    let context = params.context,
      projection = params.projection,
      dates = params.dates,
      baseValueY = projection.yByValue(this.baseValue),
      y,
      columnWidth = this.chart.dateScale.columnWidth,
      xOffset = Math.round(
        Math.max(columnWidth * this.columnWidthRatio, this.minColumnWidth) / 2
      ),
      width = xOffset * 2;

    let drawHistogram = (drawUpBars: boolean, theme: any) => {
      let prevX = null,
        maxValue = -Infinity;

      context.beginPath();
      for (
        let i = params.startIndex, column = params.startColumn;
        i <= params.endIndex;
        i++, column++
      ) {
        let value = params.values[i];
        if (value == null) continue;
        if (drawUpBars && params.close[i] < params.open[i]) continue;
        if (!drawUpBars && params.close[i] >= params.open[i]) continue;

        let x = dates
          ? projection.xByDate(dates[i])
          : projection.xByColumn(column);
        if (x === prevX) {
          maxValue = Math.max(maxValue, value);
        } else {
          if (prevX !== null) {
            y = projection.yByValue(maxValue);
            context.rect(
              prevX - xOffset + CanvasOffset,
              Math.min(y, baseValueY) + CanvasOffset,
              width,
              Math.max(Math.abs(y - baseValueY), 1)
            );
          }
          maxValue = value;
          prevX = x;
        }
      }
      y = projection.yByValue(maxValue);
      context.rect(
        prevX - xOffset + CanvasOffset,
        Math.min(y, baseValueY) + CanvasOffset,
        width,
        Math.max(Math.abs(y - baseValueY), 1)
      );
      context.scxFillStroke(theme.fill, theme.line);
    };

    drawHistogram(true, params.theme.upCandle);
    drawHistogram(false, params.theme.downCandle);
  }
}
