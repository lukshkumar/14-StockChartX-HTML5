import { Drawing } from "../../index";
import {
  IFibonacciDrawingBaseDefaults,
  FibonacciLevelTextVerPosition,
  FibonacciLevelLineExtension,
  FibonacciLevelTextHorPosition,
  REVERSE_CHANGED,
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

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

// @if SCX_LICENSE != 'free'

"use strict";

export interface IFibonacciExtensionsDrawingDefaults
  extends IFibonacciDrawingBaseDefaults {
  reverse: boolean;
  levelLinesExtension: string;
}

let defaults: IFibonacciExtensionsDrawingDefaults = {
  levels: [
    { value: 0 },
    { value: 0.2361 },
    { value: 0.382 },
    { value: 0.5 },
    { value: 0.618 },
    { value: 0.764 },
    { value: 1.0 },
    { value: 1.618 },
    { value: 2.618 },
    { value: 3.618 },
    { value: 4.236 }
  ],
  reverse: false,
  levelTextVerPosition: FibonacciLevelTextVerPosition.MIDDLE,
  levelLinesExtension: FibonacciLevelLineExtension.NONE
};

/**
 * Represents fibonacci extensions drawing.
 * @param {object} [config] The configuration object.
 * @param {number[]} [config.levels] The level values.
 * @constructor StockChartX.FibonacciExtensionsDrawing
 * @augments StockChartX.Drawing
 * @example
 *  // Create fibonacci extensions drawing.
 *  var extensions1 = new StockChartX.FibonacciExtensionsDrawing({
 *      points: [{x: 10, y: 20}, {x: 50, y: 60}, {x: 100, y: 20}]
 *  });
 *
 *  // Create fibonacci extensions drawing.
 *  var extensions2 = new StockChartX.FibonacciExtensionsDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}, {record: 100, value: 20.0}]
 *  });
 *
 *  // Create fibonacci extensions drawing with a custom theme.
 *  var extensions3 = new StockChartX.FibonacciExtensionsDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}, {record: 100, value: 20.0}],
 *      theme: {
 *          line: {
 *              strokeColor: '#FF0000'
 *              width: 1
 *          }
 *      },
 *      levels: [{value: 0}, {value: 0.2361}, {value: 0.382}, {value: 0.5}, {value: 0.618}, {value: 0.764},
 *               {value: 1.0}, {value: 1.618}, {value: 2.618}, {value: 3.618}, {value: 4.236}]
 *  });
 */
export class FibonacciExtensionsDrawing extends FibonacciDrawingBase {
  static get className(): string {
    return "fibonacciExtensions";
  }

  static defaults: IFibonacciExtensionsDrawingDefaults = defaults;

  /**
   * The flag that indicates whether levels are reversed.
   * @name reverse
   * @type {boolean}
   * @memberOf StockChartX.FibonacciDrawingBase#
   */
  get reverse(): boolean {
    let flag = this._optionValue("reverse");

    return flag != null
      ? <boolean>flag
      : FibonacciExtensionsDrawing.defaults.reverse;
  }

  set reverse(value: boolean) {
    this._setOption("reverse", value, REVERSE_CHANGED);
  }

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
      : FibonacciExtensionsDrawing.defaults.levelLinesExtension;
  }

  set levelLinesExtension(value: string) {
    this._setOption(
      "levelLinesExtension",
      value,
      LEVEL_LINES_EXTENSION_CHANGED
    );
  }

  get pointsNeeded(): number {
    return 3;
  }

  /**
   * @inheritDoc
   */
  pointsLocalizationKeys(): string[] {
    let chartPointsNames = [
      "drawingSettingDialog.start",
      "drawingSettingDialog.middle",
      "drawingSettingDialog.end"
    ];

    return chartPointsNames;
  }

  /**
   * @inheritdoc
   */
  bounds(): IRect {
    let points = this.cartesianPoints();

    if (points.length < this.pointsNeeded) return null;
    let y,
      maxLevel = this.levels.reduce(
        (value: number, level: IFibonacciLevel) =>
          this._isLevelVisible(level) ? Math.max(value, level.value) : value,
        Number.MIN_VALUE
      );

    y = this.reverse
      ? Math.round((points[0].y - points[1].y) * maxLevel + points[2].y)
      : Math.round((points[1].y - points[0].y) * maxLevel + points[2].y);

    return {
      left: Math.min(points[0].x, points[1].x, points[2].x),
      top: Math.min(points[0].y, points[1].y, points[2].y, y),
      width: Math.abs(
        Math.max(points[0].x, points[1].x, points[2].x) -
          Math.min(points[0].x, points[1].x, points[2].x)
      ),
      height: Math.abs(
        Math.max(points[0].y, points[1].y, points[2].y, y) -
          Math.min(points[0].y, points[1].y, points[2].y, y)
      )
    };
  }

  /**
   * @inheritdoc
   */
  hitTest(point: IPoint): boolean {
    if (!this.canHandleEvents) return false;

    let points = this.cartesianPoints();
    if (points.length < this.pointsNeeded) return false;

    if (this.showTrendLine && Geometry.isPointNearPolyline(point, points))
      return true;

    if (this.showLevelLines || this.showLevelBackgrounds) {
      let xRange = this._linesXRange(points);

      for (let level of this.levels) {
        if (!this._isLevelVisible(level)) continue;

        let y = this.reverse
            ? Math.round(
                (points[0].y - points[1].y) * level.value + points[2].y
              )
            : Math.round(
                (points[1].y - points[0].y) * level.value + points[2].y
              ),
          point1 = { x: xRange.min, y },
          point2 = { x: xRange.max, y };

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

    if (points.length > 2) {
      let xRange = this._linesXRange(points),
        textX,
        prevY;

      if (this.showLevelValues) {
        switch (this.levelTextHorPosition) {
          case FibonacciLevelTextHorPosition.CENTER:
            textX = (xRange.min + xRange.max) / 2;
            break;
          case FibonacciLevelTextHorPosition.LEFT:
            textX = xRange.min;
            break;
          case FibonacciLevelTextHorPosition.RIGHT:
            textX = xRange.max;
            break;
          default:
            throw new Error(
              `Unknown text horizontal position: ${this.levelTextHorPosition}`
            );
        }
        textX = this._adjustXWithTextOffset(textX);
        this._applyTextPosition();
      }

      for (let level of this.levels) {
        if (!this._isLevelVisible(level)) continue;

        let levelTheme = level.theme ? level.theme : theme,
          y = this.reverse
            ? Math.round(
                (points[0].y - points[1].y) * level.value + points[2].y
              )
            : Math.round(
                (points[1].y - points[0].y) * level.value + points[2].y
              );

        if (this.showLevelBackgrounds) {
          if (prevY) {
            context.beginPath();
            context.moveTo(xRange.min, prevY); // Go to first point
            context.lineTo(xRange.max, prevY); // Draw to second point
            context.lineTo(xRange.max, y); // Draw to third point
            context.lineTo(xRange.min, y); // Draw to last point
            context.closePath();
            context.scxFill(levelTheme.fill || theme.fill);
          }
          prevY = y;
        }

        if (this.showLevelLines) {
          context.beginPath();
          context.moveTo(xRange.min, y);
          context.lineTo(xRange.max, y);
          context.scxStroke(levelTheme.line || theme.line);
        }

        if (this.showLevelValues) {
          let levelText = this.showLevelPercents
            ? `${Number(level.value * 100).toFixed(2)}%`
            : Number(level.value).toFixed(3);

          let levelLineWidth = levelTheme
              ? levelTheme.line.width
              : theme.line.width,
            displacement = 0;

          if (this.levelTextVerPosition === FibonacciLevelTextVerPosition.TOP)
            displacement = -levelLineWidth / 2;
          else if (
            this.levelTextVerPosition === FibonacciLevelTextVerPosition.BOTTOM
          )
            displacement = levelLineWidth / 2;

          if (this.showLevelPrices) {
            let priceText = Number(this.projection.valueByY(y)).toFixed(3);

            levelText += ` (${priceText})`;
          }

          let levelLineExt = this.levelLinesExtension;
          let fibLineExt = FibonacciLevelLineExtension;

          switch (this.levelTextHorPosition) {
            case FibonacciLevelTextHorPosition.RIGHT:
              if (
                levelLineExt === fibLineExt.RIGHT ||
                levelLineExt === fibLineExt.BOTH
              )
                context.textAlign = FibonacciLevelTextHorPosition.RIGHT as any;
              break;
            case FibonacciLevelTextHorPosition.LEFT:
              if (
                levelLineExt === fibLineExt.LEFT ||
                levelLineExt === fibLineExt.BOTH
              )
                context.textAlign = FibonacciLevelTextHorPosition.LEFT as any;
              break;
            default:
              break;
          }

          context.scxApplyTextTheme(levelTheme.text || theme.text);
          context.fillText(
            levelText,
            textX,
            this._adjustYWithTextOffset(y) + displacement
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
  private _linesXRange(points: IPoint[]): IMinMaxValues<number> {
    let contentFrame = this.chartPanel.contentFrame,
      min = Math.min(points[1].x, points[2].x),
      max = Math.max(points[1].x, points[2].x);

    switch (this.levelLinesExtension) {
      case FibonacciLevelLineExtension.NONE:
        break;
      case FibonacciLevelLineExtension.LEFT:
        min = contentFrame.left;
        break;
      case FibonacciLevelLineExtension.RIGHT:
        max = contentFrame.right;
        break;
      case FibonacciLevelLineExtension.BOTH:
        min = contentFrame.left;
        max = contentFrame.right;
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

  /**
   * @internal
   */
  protected _adjustXWithTextOffset(x: number): number {
    let offset: number;
    let fibLineExt = FibonacciLevelLineExtension;
    let levelLineExt = this.levelLinesExtension;
    switch (this.levelTextHorPosition) {
      case FibonacciLevelTextHorPosition.LEFT:
        if (
          levelLineExt === fibLineExt.LEFT ||
          levelLineExt === fibLineExt.BOTH
        )
          offset = x + this._textOffset;
        else offset = x - this._textOffset;
        break;
      case FibonacciLevelTextHorPosition.RIGHT:
        if (
          levelLineExt === fibLineExt.RIGHT ||
          levelLineExt === fibLineExt.BOTH
        )
          offset = x - this._textOffset;
        else offset = x + this._textOffset;
        break;
      default:
        offset = x;
        break;
    }

    return offset;
  }
}

Drawing.register(FibonacciExtensionsDrawing);

// @endif
