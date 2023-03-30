/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { Drawing } from "../../index";
import {
  IFibonacciDrawingBaseDefaults,
  FibonacciLevelTextVerPosition,
  FibonacciLevelLineExtension,
  FibonacciLevelTextHorPosition,
  LEVEL_LINES_EXTENSION_CHANGED
} from "../utils";
import { FibonacciDrawingBase, IFibonacciLevel } from "../../index";
import { IRect } from "../../index";
import { IPoint } from "../../index";
import { Geometry } from "../../index";
import { PanGesture } from "../../index";
import { IWindowEvent, GestureState } from "../../index";
import { IMinMaxValues } from "../../index";
import { DrawingCursorClass } from "../utils";

// @if SCX_LICENSE = 'full'

"use strict";

export interface IFibonacciTimeZonesDrawingDefaults
  extends IFibonacciDrawingBaseDefaults {
  levelLinesExtension: string;
}

let defaults: IFibonacciTimeZonesDrawingDefaults = {
  levels: [
    { value: 0 },
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 5 },
    { value: 8 },
    { value: 13 },
    { value: 21 },
    { value: 34 },
    { value: 55 },
    { value: 89 }
  ],
  levelLinesExtension: FibonacciLevelLineExtension.BOTH
};

/**
 * Represents fibonacci timezones drawing.
 * @param {object} [config] The configuration object.
 * @param {number[]} [config.levels] The level values.
 * @constructor StockChartX.FibonacciTimeZonesDrawing
 * @augments StockChartX.Drawing
 * @example
 *  // Create fibonacci timezones drawing.
 *  var timeZones1 = new StockChartX.FibonacciTimeZonesDrawing({
 *      points: [{x: 10, y: 20}, {x: 50, y: 60}]
 *  });
 *
 *  // Create fibonacci timezones drawing.
 *  var timeZones2 = new StockChartX.FibonacciTimeZonesDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}]
 *  });
 *
 *  // Create fibonacci timezones drawing with a custom theme.
 *  var timeZones3 = new StockChartX.FibonacciTimeZonesDrawing({
 *      points: [p{record: 10, value: 20.0}, {record: 50, value: 60.0}],
 *      theme: {
 *          line: {
 *              strokeColor: '#FF0000'
 *              width: 1
 *          }
 *      },
 *      levels: [{value: 0}, {value: 1}, {value: 2}, {value: 3}, {value: 5},
 *               {value: 8}, {value: 13}, {value: 21}, {value: 34}, {value: 55}, {value: 89}]
 *  });
 */
export class FibonacciTimeZonesDrawing extends FibonacciDrawingBase {
  static get className(): string {
    return "fibonacciTimeZones";
  }

  static defaults: IFibonacciTimeZonesDrawingDefaults = defaults;

  /**
   * The level lines extension.
   * @name levelLinesExtension
   * @type {string}
   * @memberOf StockChartX.FibonacciDrawingBase#
   */
  get levelLinesExtension(): string {
    let extension = this._optionValue("levelLinesExtension");

    return extension != null
      ? <string>extension
      : FibonacciTimeZonesDrawing.defaults.levelLinesExtension;
  }

  set levelLinesExtension(value: string) {
    this._setOption(
      "levelLinesExtension",
      value,
      LEVEL_LINES_EXTENSION_CHANGED
    );
  }

  get pointsNeeded(): number {
    return 2;
  }

  /**
   * @inheritdoc
   */
  bounds(): IRect {
    let points = this.cartesianPoints();
    if (points.length < this.pointsNeeded) return null;
    let x,
      maxLevel = this.levels.reduce(
        (value: number, level: IFibonacciLevel) =>
          this._isLevelVisible(level) ? Math.max(value, level.value) : value,
        Number.MIN_VALUE
      );

    x = Math.round((points[1].x - points[0].x) * maxLevel + points[0].x);

    return {
      left: Math.min(points[0].x, x),
      top: this.chartPanel.frame.top,
      width: Math.abs(Math.max(points[0].x, x) - Math.min(points[0].x, x)),
      height: this.chartPanel.frame.height
    };
  }

  /**
   * @inheritdoc
   */
  hitTest(point: IPoint): boolean {
    if (!this.canHandleEvents) return false;

    let points = this.cartesianPoints();
    if (points.length < 2) return false;

    if (this.showTrendLine && Geometry.isPointNearPolyline(point, points))
      return true;

    if (this.showLevelLines || this.showLevelBackgrounds) {
      let yRange = this._linesYRange(points);

      for (let level of this.levels) {
        if (!this._isLevelVisible(level)) continue;

        let x = Math.round(
            (points[1].x - points[0].x) * level.value + points[0].x
          ),
          point1 = { x, y: yRange.max },
          point2 = { x, y: yRange.min };

        if (Geometry.isPointNearLine(point, point1, point2)) return true;
      }
    }

    return this.selected && Geometry.isPointNearPoint(point, points);
  }

  /**
   * @internal
   */
  protected _handlePanGesture(
    gesture: PanGesture,
    event: IWindowEvent
  ): boolean {
    switch (gesture.state) {
      case GestureState.STARTED:
        let points = this.cartesianPoints();
        if (points.length > 1) {
          for (let i = 0; i < points.length; i++) {
            if (Geometry.isPointNearPoint(event.pointerPosition, points[i])) {
              this._setDragPoint(i);
              this.changeCursor(DrawingCursorClass.RESIZE);

              return true;
            }
          }
        }

        break;
      case GestureState.CONTINUED:
        if (this._dragPoint >= 0) {
          this.chartPoints[this._dragPoint].moveToPoint(
            event.pointerPosition,
            this.projection
          );

          return true;
        }
        break;
      default:
        break;
    }

    return false;
  }

  /**
   * @inheritdoc
   */
  draw() {
    if (!this.visible) return;

    let points = this.cartesianPoints();
    if (points.length === 0) return;

    let context = this.context,
      theme = this.actualTheme;

    if (points.length > 1) {
      let yRange = this._linesYRange(points),
        prevX,
        textY;

      if (this.showLevelValues) {
        this._applyTextPosition();

        switch (this.levelTextVerPosition) {
          case FibonacciLevelTextVerPosition.MIDDLE:
            textY = (yRange.min + yRange.max) / 2;
            break;
          case FibonacciLevelTextVerPosition.TOP:
            textY = yRange.min;
            context.textBaseline = "top";
            break;
          case FibonacciLevelTextVerPosition.BOTTOM:
            textY = yRange.max;
            context.textBaseline = "bottom";
            break;
          default:
            break;
        }
      }

      for (let level of this.levels) {
        if (!this._isLevelVisible(level)) continue;

        let levelTheme = level.theme ? level.theme : theme,
          x = Math.round(
            (points[1].x - points[0].x) * level.value + points[0].x
          );

        if (this.showLevelBackgrounds) {
          if (prevX) {
            context.beginPath();
            context.moveTo(prevX, yRange.min); // Go to first point
            context.lineTo(prevX, yRange.max); // Draw to second point
            context.lineTo(x, yRange.max); // Draw to third point
            context.lineTo(x, yRange.min); // Draw to last point
            context.closePath();
            context.scxFill(levelTheme.fill || theme.fill);
          }
          prevX = x;
        }

        if (this.showLevelLines) {
          context.beginPath();

          context.moveTo(x, yRange.min);
          context.lineTo(x, yRange.max);

          context.scxStroke(levelTheme.line || theme.line);
        }

        if (this.showLevelValues) {
          let text = Number(level.value).toFixed(0),
            levelLineWidth = levelTheme
              ? levelTheme.line.width
              : theme.line.width,
            displacement = 0;

          if (this.levelTextHorPosition === FibonacciLevelTextHorPosition.LEFT)
            displacement = -levelLineWidth / 2;
          else if (
            this.levelTextHorPosition === FibonacciLevelTextHorPosition.RIGHT
          )
            displacement = levelLineWidth / 2;

          context.scxApplyTextTheme(levelTheme.text || theme.text);
          context.fillText(
            text,
            this._adjustXWithTextOffset(x) + displacement,
            textY
          );
        }
      }
    }
    if (points.length > 1 && this.showTrendLine) {
      context.scxStrokePolyline(points, theme.trendLine);
    }

    if (this.selected) {
      this._drawSelectionMarkers(points);
    }
  }

  /**
   * @internal
   */
  private _linesYRange(points: IPoint[]): IMinMaxValues<number> {
    let contentFrame = this.chartPanel.contentFrame,
      max = Math.max(points[0].y, points[1].y),
      min = Math.min(points[0].y, points[1].y);

    switch (this.levelLinesExtension) {
      case FibonacciLevelLineExtension.NONE:
        break;
      case FibonacciLevelLineExtension.TOP:
        min = 0;
        break;
      case FibonacciLevelLineExtension.BOTTOM:
        max = contentFrame.height;
        break;
      case FibonacciLevelLineExtension.BOTH:
        min = 0;
        max = contentFrame.height;
        break;
      default:
        throw new Error(
          `Unknown level lines extension: ${this.levelLinesExtension}`
        );
    }

    return {
      min,
      max
    };
  }
}

Drawing.register(FibonacciTimeZonesDrawing);

// @endif
