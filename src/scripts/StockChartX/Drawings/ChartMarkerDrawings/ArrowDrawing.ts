import { ArrowDrawingBase } from "../../index";
import { IRect } from "../../index";
import { Geometry } from "../../index";
import { IPoint } from "../../index";
import { PanGesture } from "../../index";
import { IWindowEvent, GestureState } from "../../index";
import { Drawing } from "../../index";
import { CanvasOffset } from "../../index";
import {
  DrawingCursorClass,
  DrawingClassNames
} from "../utils";

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

/**
 * Represent arrow drawing.
 * @constructor StockChartX.ArrowDrawing
 * @augments StockChartX.ArrowDrawingBase
 * @example
 *  // Create arrow drawing.
 *  var arrow1 = new StockChartX.ArrowDrawing({
 *      points: [{x:10, y:20}, {x: 50, y:60}]
 *  });
 *
 *  // Create arrow drawing.
 *  var arrow2 = new StockChartX.ArrowDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}]
 *  });
 *
 *  // Create red arrow drawing.
 *  var arrow3 = new StockChartX.ArrowDrawing({
 *      points: [{x:10, y:20}, {x: 50, y:60}],
 *      theme: {
 *          fill: {
 *              fillColor: '#FF0000'
 *          }
 *      }
 *  });
 */

export class Arrow extends ArrowDrawingBase {
  static get className(): string {
    return DrawingClassNames.Arrow;
  }

  /**
   * @inheritDoc
   */
  pointsLocalizationKeys(): string[] {
    let chartPointsNames = [
      "drawingSettingDialog.start",
      "drawingSettingDialog.end"
    ];

    return chartPointsNames;
  }

  bounds(): IRect {
    let points = this.cartesianPoints();
    if (points.length < this.pointsNeeded) return null;
    let radius = Geometry.length(points[0], points[1]);

    return {
      left: points[0].x - radius,
      top: points[0].y - radius,
      width: 2 * radius,
      height: 2 * radius
    };
  }

  get pointsNeeded(): number {
    return 2;
  }

  hitTest(point: IPoint): boolean {
    if (!this.canHandleEvents) return false;

    let points = this.cartesianPoints();

    return points.length > 1 && Geometry.isPointNearPolyline(point, points);
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
        if (
          Geometry.isPointNearPoint(
            this.cartesianPoint(0),
            event.pointerPosition
          )
        )
          this._setDragPoint(0);
        else if (
          Geometry.isPointNearPoint(
            this.cartesianPoint(1),
            event.pointerPosition
          )
        )
          this._setDragPoint(1);
        else return false;
        this.changeCursor(DrawingCursorClass.RESIZE);

        return true;
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

  draw() {
    if (!this.visible) return;

    let points = this.cartesianPoints();
    if (points.length !== 2) return;

    let x1 = points[0].x,
      y1 = points[0].y,
      x2 = points[1].x,
      y2 = points[1].y;

    let line1 = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)),
      line2 = Math.sqrt((x1 - x1) * (x1 - x1) + (y2 - y1) * (y2 - y1)),
      scalarMultiplication = (x2 - x1) * (x1 - x1) + (y2 - y1) * (y2 - y1),
      angle = Math.acos(scalarMultiplication / (line1 * line2));

    let context = this.context,
      theme = this.actualTheme,
      height = Geometry.length({ x: x1, y: y1 }, { x: x2, y: y2 }),
      width = 50,
      halfWidth = width / 2,
      halfTailWidth = (width * this.tailRatio) / 2,
      triangleHeight = height * this.headRatio;

    context.save();
    context.translate(x1, y1);
    if (x2 <= x1 && y2 <= y1) {
      if (y2 === y1) {
        context.rotate(-Math.PI / 2);
      } else context.rotate(-angle);
    }
    if (x2 >= x1 && y2 <= y1) {
      if (y2 === y1) {
        context.rotate(Math.PI / 2);
      } else context.rotate(angle);
    }
    if (x2 >= x1 && y2 >= y1) {
      if (x2 === x1) {
        context.rotate(2 * Math.PI);
      } else context.rotate(Math.PI - angle);
    }
    if (x2 <= x1 && y2 >= y1) {
      context.rotate(Math.PI + angle);
    }

    context.beginPath();
    context.lineTo(0, 0);
    context.lineTo(0, -height);
    context.lineTo(-halfWidth, -triangleHeight);
    context.lineTo(-halfTailWidth, -triangleHeight);
    context.lineTo(-halfTailWidth, CanvasOffset);
    context.lineTo(halfTailWidth, CanvasOffset);
    context.lineTo(halfTailWidth, -triangleHeight);
    context.lineTo(halfWidth, -triangleHeight);
    context.lineTo(0, -height);
    context.closePath();
    context.scxFillStroke(theme.fill, theme.stroke);
    context.restore();

    if (this.selected) {
      this._drawSelectionMarkers(points);
    }
  }
}

Drawing.register(Arrow);

// @endif
