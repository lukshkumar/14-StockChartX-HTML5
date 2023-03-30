/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { Drawing } from "../../index";
import { IPoint, IChartPoint, ChartPoint } from "../../index";
import { IWindowEvent, GestureState } from "../../index";
import { IRect } from "../../index";
import { Geometry } from "../../index";
import { PanGesture } from "../../index";
import {
  DrawingCursorClass,
  DrawingClassNames
} from "../utils";

// @if SCX_LICENSE != 'free'

"use strict";

/**
 * Represents polyline drawing.
 * @constructor StockChartX.PolylineDrawing
 * @augments StockChartX.Drawing
 * @example
 *  // Create polyline drawing.
 *  var polyline1 = new StockChartX.PolylineDrawing({
 *      points: [{x: 10, y: 20}, {x: 50, y: 60}, {x: 100, y: 100}]
 *  });
 *
 *  // Create polyline drawing.
 *  var polyline2 = new StockChartX.PolylineDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}, {record: 100, value: 100.0}]
 *  });
 *
 *  // Create polyline drawing with a custom theme.
 *  var polyline3 = new StockChartX.PolylineDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}, {record: 100, value: 100.0}],
 *      theme: {
 *          line: {
 *              strokeColor: 'white'
 *              width: 1
 *          },
 *          fill: {
 *              fillColor: 'green'
 *          }
 *      }
 *  });
 */
export class PolylineDrawing extends Drawing {
  static get className(): string {
    return DrawingClassNames.PolylineDrawing;
  }

  get pointsNeeded(): number {
    return Number.MAX_VALUE;
  }

  /**
   * @inheritdoc
   */
  bounds(): IRect {
    let points = this.cartesianPoints();
    if (points.length < 2) return null;

    let maxX = Math.max.apply(Math, points.map((item: IPoint) => item.x)),
      minX = Math.min.apply(Math, points.map((item: IPoint) => item.x)),
      maxY = Math.max.apply(Math, points.map((item: IPoint) => item.y)),
      minY = Math.min.apply(Math, points.map((item: IPoint) => item.y));

    let width = Math.abs(maxX - minX),
      height = Math.abs(maxY - minY);

    return {
      left: minX,
      top: minY,
      width,
      height
    };
  }

  /**
   * @inheritdoc
   */
  hitTest(point: IPoint): boolean {
    if (!this.canHandleEvents) return false;

    return Geometry.isPointNearPolyline(point, this.cartesianPoints());
  }

  /**
   * @internal
   */
  protected _handleUserDrawingPoint(point: IChartPoint) {
    let pointsCount = this.chartPoints.length;
    if (pointsCount > 1) {
      let lastPoint = this.cartesianPoint(pointsCount - 1);
      let curPoint = new ChartPoint(point).toPoint(this.projection);

      if (Geometry.isPointNearPoint(curPoint, lastPoint)) {
        this._finishUserDrawing();

        return true;
      }
    }

    this.appendChartPoint(point);

    return true;
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
        for (let i = 0; i < points.length; i++) {
          if (Geometry.isPointNearPoint(event.pointerPosition, points[i])) {
            this._setDragPoint(i);
            this.changeCursor(DrawingCursorClass.RESIZE);

            return true;
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

    let points = this.cartesianPoints(),
      context = this.context,
      theme = this.actualTheme;
    if (points.length > 1) {
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y);
      }
      context.scxStroke(theme.line);
    }
    if (this.selected) {
      this._drawSelectionMarkers(points);
    }
  }
}

Drawing.register(PolylineDrawing);

// @endif
