/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { Drawing } from "../../index";
import { IPoint } from "../../index";
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
 * Represents triangle drawing.
 * @constructor StockChartX.TriangleDrawing
 * @augments StockChartX.Drawing
 * @example
 *  // Create triangle drawing.
 *  var triangle1 = new StockChartX.TriangleDrawing({
 *      points: [{x: 10, y: 20}, {x: 50, y: 60}, {x: 100, y: 100}]
 *  });
 *
 *  // Create triangle drawing.
 *  var triangle2 = new StockChartX.TriangleDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}, {record: 100, value: 100.0}]
 *  });
 *
 *  // Create triangle drawing with a custom theme.
 *  var triangle3 = new StockChartX.TriangleDrawing({
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
export class TriangleDrawing extends Drawing {
  static get className(): string {
    return DrawingClassNames.TriangleDrawing;
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

    let left = Math.min(points[0].x, points[1].x, points[2].x),
      top = Math.min(points[0].y, points[1].y, points[2].y),
      width = Math.max(points[0].x, points[1].x, points[2].x) - left,
      height = Math.max(points[0].y, points[1].y, points[2].y) - top;

    return {
      left,
      top,
      width,
      height
    };
  }

  /**
   * @inheritdoc
   */
  hitTest(point: IPoint): boolean {
    if (!this.canHandleEvents) return false;

    let points = this.cartesianPoints();

    return points.length > 1 && Geometry.isPointNearPolygon(point, points);
  }

  /**
   * @internal
   */
  protected _handlePanGesture(gesture: PanGesture, event: IWindowEvent) {
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
      for (let i = 1; i < points.length; i++)
        context.lineTo(points[i].x, points[i].y);
      context.closePath();
      context.scxFillStroke(theme.fill, theme.line);
    }

    if (this.selected) {
      this._drawSelectionMarkers(points);
    }
  }
}

Drawing.register(TriangleDrawing);

// @endif
