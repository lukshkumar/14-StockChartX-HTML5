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
  FibonacciLevelTextVerPosition
} from "../utils";

// @if SCX_LICENSE = 'full'

"use strict";

/**
 * Represents fibonacci arcs drawing.
 * @param {object} [config] The configuration object.
 * @param {number[]} [config.levels] The level values.
 * @constructor StockChartX.FibonacciArcsDrawing
 * @augments StockChartX.FibonacciDrawingBase
 * @example
 *  // Create fibonacci arcs drawing.
 *  var arcs1 = new StockChartX.FibonacciArcsDrawing({
 *      points: [{x: 10, y: 20}, {x: 50, y: 60}]
 *  });
 *
 *  // Create fibonacci arcs drawing.
 *  var arcs2 = new StockChartX.FibonacciArcsDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}]
 *  });
 *
 *  // Create fibonacci arcs drawing with a custom theme.
 *  var arcs3 = new StockChartX.FibonacciArcsDrawing({
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
export class FibonacciArcsDrawing extends FibonacciDrawingBase {
  static get className(): string {
    return "fibonacciArcs";
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

    let len = Geometry.length(points[0], points[1]),
      radius,
      maxLevel = this.levels.reduce(
        (value: number, level: IFibonacciLevel) =>
          this._isLevelVisible(level) ? Math.max(value, level.value) : value,
        Number.MIN_VALUE
      );

    radius = Math.round(len * maxLevel);

    return {
      left: points[0].x - radius,
      top: points[0].y - radius,
      width: 2 * radius,
      height: 2 * radius
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
      let len = Geometry.length(points[0], points[1]);

      for (let level of this.levels) {
        if (!this._isLevelVisible(level)) continue;

        let radius = Math.round(len * level.value);
        if (Geometry.isPointNearCircle(point, points[0], radius)) return true;
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
        let point = this.cartesianPoint(1);
        if (point && Geometry.isPointNearPoint(event.pointerPosition, point)) {
          this._setDragPoint(1);
          this.changeCursor(DrawingCursorClass.RESIZE);

          return true;
        }
        break;
      case GestureState.CONTINUED:
        if (this._dragPoint === 1) {
          this.chartPoints[1].moveToPoint(
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
      let width = Geometry.length(points[0], points[1]),
        centerX = points[0].x,
        centerY = points[0].y,
        prevRadius;

      this._applyTextPosition();

      for (let level of this.levels) {
        if (!this._isLevelVisible(level)) continue;

        let levelTheme = level.theme ? level.theme : theme,
          radius = Math.round(width * level.value);

        if (this.showLevelBackgrounds) {
          let fillTheme = levelTheme.fill || theme.fill;

          context.beginPath();
          context.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);

          if (prevRadius) {
            context.arc(centerX, centerY, prevRadius, 0, 2 * Math.PI, true);
            context.scxApplyFillTheme(fillTheme);
            context.fill("evenodd");
          } else {
            context.scxFill(fillTheme);
          }
        }

        if (this.showLevelLines) {
          context.beginPath();
          context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
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

          context.scxApplyTextTheme(levelTheme.text || theme.text);
          context.fillText(levelText, centerX, centerY + radius + displacement);
        }

        prevRadius = radius;
      }

      if (this.showTrendLine) {
        context.scxStrokePolyline(points, theme.trendLine);
      }
    }

    if (this.selected) {
      this._drawSelectionMarkers(points);
    }
  }
}

Drawing.register(FibonacciArcsDrawing);

// @endif
