/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { Drawing } from "../../index";
import { FibonacciDrawingBase, IFibonacciLevel } from "../../index";
import { IRect } from "../../index";
import { IPoint } from "../../index";
import { Geometry } from "../../index";
import { PanGesture } from "../../index";
import { IWindowEvent, GestureState } from "../../index";
import {
  DrawingCursorClass,
  IFibonacciDrawingBaseDefaults,
  FibonacciLevelTextVerPosition
} from "../utils";

// @if SCX_LICENSE != 'free'

"use strict";

/**
 * Represents fibonacci fan drawing.
 * @param {object} [config] The configuration object.
 * @param {number[]} [config.levels] The level values.
 * @constructor StockChartX.FibonacciFanDrawing
 * @augments StockChartX.FibonacciDrawingBase
 * @example
 *  // Create fibonacci fan drawing.
 *  var retracements1 = new StockChartX.FibonacciFanDrawing({
 *      points: [{x: 10, y: 20}, {x: 50, y: 60}]
 *  });
 *
 *  // Create fibonacci fan drawing.
 *  var retracements2 = new StockChartX.FibonacciFanDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}]
 *  });
 *
 *  // Create fibonacci fan drawing with a custom theme.
 *  var retracemnts3 = new StockChartX.FibonacciFanDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}],
 *      theme: {
 *          line: {
 *              strokeColor: '#FF0000'
 *              width: 1
 *          }
 *      },
 *      levels: [{value: 0.382}, {value: 0.5}, {value: 0.618}]
 *  });
 */
export class FibonacciFanDrawing extends FibonacciDrawingBase {
  static get className(): string {
    return "fibonacciFan";
  }

  static defaults: IFibonacciDrawingBaseDefaults = {
    levels: [{ value: 0.382 }, { value: 0.5 }, { value: 0.618 }],
    levelTextVerPosition: FibonacciLevelTextVerPosition.MIDDLE
  };

  get pointsNeeded(): number {
    return 2;
  }

  /**
   * @inheritdoc
   */
  bounds(): IRect {
    let points = this.cartesianPoints();
    if (points.length < this.pointsNeeded) return null;

    let x1 = points[0].x,
      y1 = points[0].y,
      x2 = points[1].x,
      y2 = points[1].y,
      contentFrame = this.chartPanel.contentFrame,
      isOnLeftSide = x1 > x2,
      x3 = isOnLeftSide ? contentFrame.left : contentFrame.right,
      maxLevel = this.levels.reduce(
        (value: number, level: IFibonacciLevel) =>
          this._isLevelVisible(level) ? Math.max(value, level.value) : value,
        Number.MIN_VALUE
      ),
      minLevel = this.levels.reduce(
        (value: number, level: IFibonacciLevel) =>
          this._isLevelVisible(level) ? Math.min(value, level.value) : value,
        Number.MAX_VALUE
      );

    let minY = Math.round((y1 - y2) * minLevel + y2),
      firstY3 = Math.round(y1 + ((x3 - x1) * (minY - y1)) / (x2 - x1)),
      maxY = Math.round((y1 - y2) * maxLevel + y2),
      lastY3 = Math.round(y1 + ((x3 - x1) * (maxY - y1)) / (x2 - x1));

    return {
      left: Math.min(points[0].x, points[1].x, x3),
      top: Math.min(points[0].y, points[1].y, lastY3, firstY3),
      width: Math.abs(
        Math.max(points[0].x, points[1].x, x3) -
          Math.min(points[0].x, points[1].x, x3)
      ),
      height: Math.abs(
        Math.max(points[0].y, points[1].y, lastY3, firstY3) -
          Math.min(points[0].y, points[1].y, lastY3, firstY3)
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

    let x1 = points[0].x,
      y1 = points[0].y,
      x2 = points[1].x,
      y2 = points[1].y,
      x3 = this.chartPanel.contentFrame.right;

    if (this.showTrendLine && Geometry.isPointNearPolyline(point, points))
      return true;

    if (this.showLevelLines || this.showLevelBackgrounds) {
      for (let level of this.levels) {
        if (!this._isLevelVisible(level)) continue;

        let y = Math.round((y1 - y2) * level.value + y2),
          y3 = Math.round(y1 + ((x3 - x1) * (y - y1)) / (x2 - x1)),
          point1 = { x: x1, y: y1 },
          point2 = { x: x3, y: y3 };

        if (Geometry.isPointNearLine(point, point1, point2)) return true;
      }
    }

    return this.selected && Geometry.isPointNearPoint(point, points[1]);
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
      let x1 = points[0].x,
        y1 = points[0].y,
        x2 = points[1].x,
        y2 = points[1].y,
        contentFrame = this.chartPanel.contentFrame,
        isOnLeftSide = x1 > x2,
        x3 = isOnLeftSide ? contentFrame.left : contentFrame.right,
        pointsBuffer = [];

      switch (this.levelTextVerPosition) {
        case FibonacciLevelTextVerPosition.MIDDLE:
          context.textBaseline = "middle";
          break;
        case FibonacciLevelTextVerPosition.TOP:
          context.textBaseline = "bottom";
          break;
        case FibonacciLevelTextVerPosition.BOTTOM:
          context.textBaseline = "top";
          break;
        default:
          throw new Error(
            `Unsupported level text vertical position: ${
              this.levelTextVerPosition
            }`
          );
      }

      context.textAlign = isOnLeftSide ? "left" : "right";
      let shiftForHorizontalPositionOfText = 0;
      for (let level of this.levels) {
        if (!this._isLevelVisible(level)) continue;

        let levelTheme = level.theme ? level.theme : theme,
          y = Math.round((y1 - y2) * level.value + y2),
          y3 = Math.round(y1 + ((x3 - x1) * (y - y1)) / (x2 - x1));

        if (this.showLevelBackgrounds) {
          if (pointsBuffer.length === 2) {
            context.beginPath();
            context.moveTo(pointsBuffer[0].x, pointsBuffer[0].y); // Go to first point
            context.lineTo(pointsBuffer[1].x, pointsBuffer[1].y); // Draw to second point
            context.lineTo(x1, y1); // Draw to third point
            context.lineTo(x3, y3); // Draw to last point
            context.closePath();
            context.scxFill(levelTheme.fill || theme.fill);

            pointsBuffer[0] = { x: x3, y: y3 };
            pointsBuffer[1] = { x: x1, y: y1 };
          } else {
            pointsBuffer.push({ x: x3, y: y3 });
            pointsBuffer.push({ x: x1, y: y1 });
          }
        }

        if (this.showLevelLines) {
          context.beginPath();
          context.moveTo(x1, y1);
          context.lineTo(x3, y3);
          context.scxStroke(levelTheme.line || theme.line);
        }

        if (this.showLevelValues) {
          let textX, textY;
          context.scxApplyTextTheme(levelTheme.text || theme.text);
          let fontHeight = parseInt(context.font, 10),
            frameWidth = this.chartPanel.contentFrame.width,
            frameHeight = this.chartPanel.contentFrame.height;
          if (y3 < fontHeight) {
            if (isOnLeftSide) {
              textX =
                (Math.abs(x1) * Math.abs(y3)) / (Math.abs(y3) + Math.abs(y1));
            } else {
              textX =
                frameWidth -
                ((frameWidth - Math.abs(x1)) * Math.abs(y3)) /
                  (Math.abs(y3) + Math.abs(y1));
            }
            textY = fontHeight;
          } else {
            textX = isOnLeftSide ? x3 + 3 : x3 - 3;
            textY = y3;
          }
          if (y3 > frameHeight - fontHeight) {
            if (isOnLeftSide) {
              textX = (x1 * (y3 - frameHeight)) / (y3 - y1);
            } else {
              textX =
                frameWidth -
                ((frameWidth - x1) * (y3 - frameHeight)) / (y3 - y1);
            }
            textY = frameHeight - fontHeight;
          }
          let levelText = this.showLevelPercents
            ? `${Number(level.value * 100).toFixed(2)}%`
            : Number(level.value).toFixed(3);

          if (this.showLevelPrices) {
            let priceText = Number(this.projection.valueByY(y3)).toFixed(3);

            levelText += ` (${priceText})`;
          }

          textY += shiftForHorizontalPositionOfText;
          shiftForHorizontalPositionOfText += fontHeight + fontHeight / 10;
          if (y1 < textY) {
            textY -= (fontHeight + fontHeight / 10) * 2;
          }

          context.fillText(levelText, textX, textY);
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
}

Drawing.register(FibonacciFanDrawing);

// @endif
