import { IPlotConfig, IPlotDefaults, Plot } from "../index";
import { ChartPoint } from "../index";
import { Drawing } from "../index";
import { DrawingClassNames } from "../Drawings/utils";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

"use strict";

// region Interfaces

export interface ILinePlotConfig extends IPlotConfig {}

export interface ILinePlotDefaults extends IPlotDefaults {}

// endregion

// region Declarations

const LinePlotStyle = {
  SIMPLE: "simple",
  MOUNTAIN: "mountain",
  STEP: "step",
  HORIZONTAL: "horizontal"
};
Object.freeze(LinePlotStyle);

const PointEpsilon = 1.8;
const ValueEpsilon = 1e-5;

// endregion

/**
 * Describes line plot.
 * @param {Object} [config] The configuration object.
 * @constructor StockChartX.LinePlot
 * @augments StockChartX.Plot
 * @example
 *  var plot = new StockChartX.LinePlot({
 *      dataSeries: closeDataSeries
 *  });
 */
export class LinePlot extends Plot {
  private colorField;
  static readonly Style = LinePlotStyle;

  static readonly defaults: ILinePlotDefaults = {
    plotStyle: LinePlotStyle.SIMPLE
  };

  constructor(config?: ILinePlotConfig) {
    super(config);
    if (config.colorField) {
      this.colorField = config.colorField;
    }
    this._plotThemeKey = "line";
  }

  /**
   * @inheritdoc
   */
  draw() {
    if (!this.visible) return;

    switch (this.plotStyle) {
      case LinePlotStyle.MOUNTAIN:
        this._drawMountainLine();
        break;
      case LinePlotStyle.STEP:
        this._drawStepLine();
        break;
      case LinePlotStyle.HORIZONTAL:
        this._drawHorizontalLine();
        break;
      default:
        if (this.dataSeries[0].name.includes("Supertrend")) {
          this._drawSupertrendLine();
        } else {
          this._drawSimpleLine();
        }
        break;
    }
  }

  /**
   * @internal
   */
  private _drawSimpleLine() {
    let params = this._valueDrawParams();
    if (params.values.length === 0) return;

    let context = params.context,
      projection = params.projection,
      dates = params.dates,
      prevX = null,
      lastValue = null,
      minValue = Infinity,
      maxValue = -Infinity,
      breakLine = true,
      curY = null;

    context.beginPath();

    for (
      let i = params.startIndex, column = params.startColumn;
      i <= params.endIndex;
      i++, column++
    ) {
      let value = params.values[i];
      if (value == null) continue;

      let isNaNValue = value !== value;
      if (isNaNValue && breakLine) continue;

      let x = dates
        ? projection.xByDate(dates[i])
        : projection.xByColumn(column);

      if (breakLine) {
        context.moveTo(x, projection.yByValue(value));
        breakLine = false;
        continue;
      }
      if (isNaNValue) breakLine = true;
      if (!breakLine && x === prevX) {
        // We have several records at the same X coordinate.
        // Save min/max/last values to draw just 1 vertical line later.
        minValue = Math.min(minValue, value);
        maxValue = Math.max(maxValue, value);
        lastValue = value;

        continue;
      }

      if (minValue !== Infinity) {
        // We have several records at the same X coordinate. Draw single vertical line.
        let minY = projection.yByValue(minValue);
        let isNewMinY = Math.abs(curY - minY) > PointEpsilon;

        if (Math.abs(maxValue - minValue) < ValueEpsilon) {
          // We have the same min/max values. So just draw line to this point.
          if (isNewMinY) context.lineTo(prevX, minY);
        } else {
          let maxY = projection.yByValue(maxValue);
          if (Math.abs(maxY - minY) < PointEpsilon) {
            // Min/Max values are different but they are pointed to the same Y coordinate.
            // Draw line to this coordinate.
            if (isNewMinY) context.lineTo(prevX, minY);
          } else {
            // Min/Max values are different. Draw vertical line.
            if (isNewMinY) context.moveTo(prevX, minY);
            context.lineTo(prevX, maxY);
            // Move to the Y of the last value.
            if (Math.abs(lastValue - maxValue) > ValueEpsilon) {
              let y = projection.yByValue(lastValue);
              if (Math.abs(y - maxY) > PointEpsilon) context.moveTo(prevX, y);
            }
          }
        }
      }

      if (!breakLine) {
        // Add line to the current point
        curY = projection.yByValue(value);
        context.lineTo(x, curY);
        minValue = maxValue = lastValue = value;
      } else {
        minValue = Infinity;
        maxValue = lastValue = -Infinity;
        curY = null;
      }

      prevX = x;
    }
    if (minValue !== Infinity && minValue !== maxValue) {
      context.moveTo(prevX, projection.yByValue(minValue));
      context.lineTo(prevX, projection.yByValue(maxValue));
    }
    context.scxApplyStrokeTheme(params.theme.line || params.theme);
    context.stroke();
  }
  /**
   * @internal
   */
  private _drawSupertrendLine() {
    let params = this._valueDrawParams();
    let count = params.startIndex;
    if (params.values.length === 0) return;
    this.chartPanel.removeSelectDrawings(false);
    let context = params.context,
      projection = params.projection,
      dates = params.dates,
      prevX = null,
      lastValue = null,
      minValue = Infinity,
      maxValue = -Infinity,
      breakLine = true,
      curY = null;
    context.beginPath();
    let CurrentColorValue = this.colorField.value(params.startIndex);
    let CurrentColor =
      CurrentColorValue == 0
        ? params.theme.stroke2Color
        : params.theme.strokeColor;
    context.scxApplyStrokeTheme({ strokeColor: CurrentColor, width: 1 });
    for (
      let i = params.startIndex, column = params.startColumn;
      i <= params.endIndex + 1;
      i++, column++
    ) {
      let value = params.values[i];
      if (
        this.colorField.value(i) == CurrentColorValue &&
        params.values[i - 1] > 0
      ) {
        context.stroke();
      } else {
        if (params.values[i - 1] && params.values[i - 1] > 0) {
          if (count > 0) {
            let drawing = Drawing.deserialize({
              className:
                CurrentColor == params.theme.strokeColor
                  ? DrawingClassNames.ArrowDownDrawing
                  : DrawingClassNames.ArrowUpDrawing
            });
            drawing.selectable = false;

            drawing.setChartPoints([
              new ChartPoint({
                date: projection.dateByColumn(column),
                value: value
              })
            ]);
            drawing.size.height = 18;
            this.chartPanel.addDrawings(drawing);
            this.chartPanel.setNeedsUpdate();
          }
          CurrentColorValue = this.colorField.value(i);
          CurrentColor =
            CurrentColorValue == 0
              ? params.theme.stroke2Color
              : params.theme.strokeColor;
          context.stroke();
          context.beginPath();
          context.scxApplyStrokeTheme({ strokeColor: CurrentColor });
          context.moveTo(
            dates
              ? projection.xByDate(dates[i - 1])
              : projection.xByColumn(column - 1),
            projection.yByValue(params.values[i - 1])
          );
          context.lineTo(
            dates ? projection.xByDate(dates[i]) : projection.xByColumn(column),
            projection.yByValue(value)
          );
          context.stroke();
          count++;
        }
      }

      if (value == null) continue;

      let isNaNValue = value !== value;
      if (isNaNValue && breakLine) continue;

      let x = dates
        ? projection.xByDate(dates[i])
        : projection.xByColumn(column);

      if (breakLine) {
        context.moveTo(x, projection.yByValue(value));
        breakLine = false;
        continue;
      }
      if (isNaNValue) breakLine = true;
      if (!breakLine && x === prevX) {
        // We have several records at the same X coordinate.
        // Save min/max/last values to draw just 1 vertical line later.
        minValue = Math.min(minValue, value);
        maxValue = Math.max(maxValue, value);
        lastValue = value;

        continue;
      }

      if (minValue !== Infinity) {
        // We have several records at the same X coordinate. Draw single vertical line.
        let minY = projection.yByValue(minValue);
        let isNewMinY = Math.abs(curY - minY) > PointEpsilon;

        if (Math.abs(maxValue - minValue) < ValueEpsilon) {
          // We have the same min/max values. So just draw line to this point.
          if (isNewMinY) context.lineTo(prevX, minY);
        } else {
          let maxY = projection.yByValue(maxValue);
          if (Math.abs(maxY - minY) < PointEpsilon) {
            // Min/Max values are different but they are pointed to the same Y coordinate.
            // Draw line to this coordinate.
            if (isNewMinY) context.lineTo(prevX, minY);
          } else {
            // Min/Max values are different. Draw vertical line.
            if (isNewMinY) context.moveTo(prevX, minY);
            context.lineTo(prevX, maxY);
            // Move to the Y of the last value.
            if (Math.abs(lastValue - maxValue) > ValueEpsilon) {
              let y = projection.yByValue(lastValue);
              if (Math.abs(y - maxY) > PointEpsilon) context.moveTo(prevX, y);
            }
          }
        }
      }

      if (!breakLine) {
        // Add line to the current point
        curY = projection.yByValue(value);
        context.lineTo(x, curY);
        minValue = maxValue = lastValue = value;
      } else {
        minValue = Infinity;
        maxValue = lastValue = -Infinity;
        curY = null;
      }

      prevX = x;
    }
    if (minValue !== Infinity && minValue !== maxValue) {
      context.moveTo(prevX, projection.yByValue(minValue));
      context.lineTo(prevX, projection.yByValue(maxValue));
    }
  }

  /**
   * @internal
   */
  private _drawMountainLine() {
    let params = this._valueDrawParams();
    if (params.values.length === 0) return;

    let context = params.context,
      projection = params.projection,
      startX = null,
      prevX = null,
      minValue = Infinity,
      breakLine = true,
      maxY = projection.yByValue(0);

    context.scxApplyFillTheme(params.theme.fill);
    for (
      let i = params.startIndex, column = params.startColumn;
      i <= params.endIndex;
      i++, column++
    ) {
      let value = params.values[i];
      if (value == null) continue;

      let isNaNValue = value !== value;
      if (isNaNValue && breakLine) continue;

      let x = projection.xByColumn(column);
      if (breakLine) {
        context.beginPath();
        context.moveTo(x, projection.yByValue(value));
        startX = prevX = x;
        breakLine = false;
        continue;
      }
      if (isNaNValue) breakLine = true;
      if (!breakLine && x === prevX) {
        // We have several records at the same X coordinate. Save min/max/last values to draw just 1 vertical line later.
        minValue = Math.min(minValue, value);

        continue;
      }

      if (minValue !== Infinity) {
        context.lineTo(prevX, projection.yByValue(minValue));
      }

      if (!breakLine) {
        // Add line to current point
        context.lineTo(x, projection.yByValue(value));
        minValue = value;
      } else {
        minValue = Infinity;

        context.lineTo(prevX, maxY);
        context.lineTo(startX, maxY);
        context.closePath();
        context.fill();
        startX = x;
      }

      prevX = x;
    }
    if (minValue !== Infinity) {
      context.lineTo(prevX, projection.yByValue(minValue));
    }

    context.lineTo(prevX, maxY);
    context.lineTo(startX, maxY);
    context.closePath();
    context.globalAlpha = 0.2;
    context.fill();
    context.globalAlpha = 1;

    this._drawSimpleLine();
  }

  /**
   * @internal
   */
  private _drawStepLine() {
    let params = this._valueDrawParams();
    if (params.values.length === 0) return;

    let context = params.context,
      projection = params.projection,
      dates = params.dates,
      prevX = null,
      prevY = null,
      lastValue = null,
      minValue = Infinity,
      maxValue = -Infinity,
      x,
      breakLine = true;

    context.beginPath();
    for (
      let i = params.startIndex, column = params.startColumn;
      i <= params.endIndex;
      i++, column++
    ) {
      let value = params.values[i];
      if (value == null) continue;

      let isNaNValue = value !== value;
      if (isNaNValue && breakLine) continue;

      x = dates ? projection.xByDate(dates[i]) : projection.xByColumn(column);
      if (breakLine) {
        prevX = x;
        prevY = projection.yByValue(value);
        context.moveTo(x, prevY);
        minValue = maxValue = value;
        breakLine = false;
        continue;
      }
      if (isNaNValue) breakLine = true;
      if (!breakLine && x === prevX) {
        // We have several records at the same X coordinate. Save min/max/last values to draw just 1 vertical line later.
        minValue = Math.min(minValue, value);
        maxValue = Math.max(maxValue, value);
        lastValue = value;

        continue;
      }
      if (!breakLine) {
        context.lineTo(prevX, prevY);

        let minY = projection.yByValue(minValue);
        if (Math.abs(maxValue - minValue) < ValueEpsilon) {
          context.lineTo(prevX, minY);
          prevY = minY;
        } else {
          let maxY = projection.yByValue(maxValue);
          if (Math.abs(maxY - minY) < PointEpsilon) {
            context.lineTo(prevX, minY);
            prevY = minY;
          } else {
            context.moveTo(prevX, minY);
            context.lineTo(prevX, maxY);

            prevY = projection.yByValue(lastValue);
            context.moveTo(prevX, prevY);
          }
        }

        minValue = maxValue = lastValue = value;
      } else {
        minValue = Infinity;
        maxValue = lastValue = -Infinity;
      }

      prevX = x;
    }

    if (lastValue != null && lastValue !== -Infinity) {
      context.lineTo(x, prevY);
      context.lineTo(x, projection.yByValue(lastValue));
    }

    context.scxApplyStrokeTheme(params.theme.line || params.theme);
    context.stroke();
  }
  /**
   * @internal
   */
  private _drawHorizontalLine() {
    let params = this._valueDrawParams();
    if (params.values.length === 0) return;

    let context = params.context,
      projection = params.projection,
      dates = params.dates,
      prevX = null,
      prevY = null,
      lastValue = null,
      minValue = Infinity,
      maxValue = -Infinity,
      x,
      breakLine = true;

    context.beginPath();
    for (
      let i = params.startIndex, column = params.startColumn;
      i <= params.endIndex;
      i++, column++
    ) {
      let value = params.values[i];
      if (value == null) continue;

      let isNaNValue = value !== value;
      if (isNaNValue && breakLine) continue;

      x = dates ? projection.xByDate(dates[i]) : projection.xByColumn(column);
      if (breakLine) {
        prevX = x;
        prevY = projection.yByValue(value);
        context.moveTo(x, prevY);
        minValue = maxValue = value;
        breakLine = false;
        continue;
      }
      if (isNaNValue) breakLine = true;
      if (!breakLine && x === prevX) {
        // We have several records at the same X coordinate. Save min/max/last values to draw just 1 vertical line later.
        minValue = Math.min(minValue, value);
        maxValue = Math.max(maxValue, value);
        lastValue = value;

        continue;
      }
      if (!breakLine) {
        context.lineTo(prevX, prevY);

        let minY = projection.yByValue(minValue);
        if (Math.abs(maxValue - minValue) < ValueEpsilon) {
          if (minY !== prevY) {
            context.fillStyle = params.theme.strokeColor;
            context.fillText(this.textField, prevX - 15, minY - 2);
          }
          context.moveTo(prevX, minY);
          prevY = minY;
        } else {
          let maxY = projection.yByValue(maxValue);
          if (Math.abs(maxY - minY) < PointEpsilon) {
            context.lineTo(prevX, minY);
            prevY = minY;
          } else {
            context.moveTo(prevX, minY);
            context.lineTo(prevX, maxY);

            prevY = projection.yByValue(lastValue);
            context.moveTo(prevX, prevY);
          }
        }

        minValue = maxValue = lastValue = value;
      } else {
        minValue = Infinity;
        maxValue = lastValue = -Infinity;
      }

      prevX = x;
    }

    if (lastValue != null && lastValue !== -Infinity) {
      context.lineTo(x, prevY);
      context.lineTo(x, projection.yByValue(lastValue));
    }

    context.scxApplyStrokeTheme(params.theme.line || params.theme);
    context.stroke();
  }
}
