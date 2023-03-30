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
import { CanvasOffset } from "../../index";
import {
  DrawingCursorClass,
  DrawingClassNames
} from "../utils";

// @if SCX_LICENSE != 'free'

"use strict";

/**
 * Represents rectangle drawing.
 * @constructor StockChartX.RectangleDrawing
 * @augments StockChartX.Drawing
 * @example
 *  // Create rectangle drawing.
 *  var rect1 = new StockChartX.RectangleDrawing({
 *      points: [{x: 10, y: 20}, {x: 50, y: 60}]
 *  });
 *
 *  // Create rectangle drawing.
 *  var rect2 = new StockChartX.RectangleDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}]
 *  });
 *
 *  // Create rectangle drawing with a custom theme.
 *  var rect3 = new StockChartX.RectangleDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}],
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
export class RectangleDrawing extends Drawing {
  static get className(): string {
    return DrawingClassNames.RectangleDrawing;
  }

  get pointsNeeded(): number {
    return 2;
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

  /**
   * @inheritdoc
   */
  bounds(): IRect {
    let points = this.cartesianPoints();
    if (points.length < this.pointsNeeded) return null;

    return {
      left: Math.min(points[0].x, points[1].x),
      top: Math.min(points[0].y, points[1].y),
      width: Math.abs(points[0].x - points[1].x),
      height: Math.abs(points[0].y - points[1].y)
    };
  }

  /**
   * @internal
   */
  private _markerPoints(rect?: IRect): IPoint[] {
    if (!rect) rect = this.bounds();
    if (!rect) {
      let point = this.cartesianPoint(0);

      return point && [point];
    }

    let midX = Math.round(rect.left + rect.width / 2),
      midY = Math.round(rect.top + rect.height / 2),
      right = rect.left + rect.width,
      bottom = rect.top + rect.height;

    return [
      { x: rect.left, y: rect.top }, // left top point
      { x: midX, y: rect.top }, // middle top point
      { x: right, y: rect.top }, // right top point
      { x: right, y: midY }, // middle right point
      { x: right, y: bottom }, // right bottom point
      { x: midX, y: bottom }, // middle bottom point
      { x: rect.left, y: bottom }, // left bottom point
      { x: rect.left, y: midY } // left middle point
    ];
  }

  /**
   * @internal
   */
  private _normalizePoints() {
    let rect = this.bounds();
    if (rect) {
      let projection = this.projection,
        points = this.chartPoints;

      points[0].moveTo(rect.left, rect.top, projection);
      points[1].moveTo(
        rect.left + rect.width,
        rect.top + rect.height,
        projection
      );
    }
  }

  /**
   * @inheritdoc
   */
  hitTest(point: IPoint): boolean {
    if (!this.canHandleEvents) return false;

    let points = this.cartesianPoints();

    return (
      points.length > 1 &&
      Geometry.isPointNearRectPoints(point, points[0], points[1])
    );
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
        this._normalizePoints();

        let markerPoints = this._markerPoints();
        if (markerPoints && markerPoints.length > 1) {
          for (let i = 0; i < markerPoints.length; i++) {
            if (
              Geometry.isPointNearPoint(event.pointerPosition, markerPoints[i])
            ) {
              this._setDragPoint(i);
              this._updateCursor();

              return true;
            }
          }
        }
        break;
      case GestureState.CONTINUED:
        if (this._dragPoint < 0) break;

        let projection = this.projection,
          points = this.chartPoints,
          pos = event.pointerPosition;

        switch (this._dragPoint) {
          case 0: // left top point
            points[0].moveTo(pos.x, pos.y, projection);
            break;
          case 1: // middle top point
            points[0].moveToY(pos.y, projection);
            break;
          case 2: // right top point
            points[0].moveToY(pos.y, projection);
            points[1].moveToX(pos.x, projection);
            break;
          case 3: // middle right point
            points[1].moveToX(pos.x, projection);
            break;
          case 4: // right bottom point
            points[1].moveTo(pos.x, pos.y, projection);
            break;
          case 5: // middle bottom point
            points[1].moveToY(pos.y, projection);
            break;
          case 6: // left bottom point
            points[0].moveToX(pos.x, projection);
            points[1].moveToY(pos.y, projection);
            break;
          case 7: // left middle point
            points[0].moveToX(pos.x, projection);
            break;
          default:
            break;
        }

        return true;
      default:
        break;
    }

    return false;
  }

  /**
   * @internal
   */
  private _updateCursor() {
    let cursorClass;

    switch (this._dragPoint) {
      case 0: // left top point
      case 4: // right bottom point
        cursorClass = DrawingCursorClass.RESIZE_NWSE;
        break;
      case 1: // middle top point
      case 5: // middle bottom point
        cursorClass = DrawingCursorClass.RESIZE_NS;
        break;
      case 2: // right top point
      case 6: // left bottom point
        cursorClass = DrawingCursorClass.RESIZE_NESW;
        break;
      case 3: // middle right point
      case 7: // left middle point
        cursorClass = DrawingCursorClass.RESIZE_EW;
        break;
      default:
        break;
    }

    if (cursorClass) this.changeCursor(cursorClass);
  }

  /**
   * @inheritdoc
   */
  draw() {
    if (!this.visible) return;

    let rect = this.bounds(),
      context = this.context,
      theme = this.actualTheme;

    if (rect) {
      context.beginPath();
      context.rect(
        rect.left + CanvasOffset,
        rect.top + CanvasOffset,
        rect.width,
        rect.height
      );
      context.scxFillStroke(theme.fill, theme.line);
    }

    if (this.selected) {
      let points = this._markerPoints(rect);
      this._drawSelectionMarkers(points);
    }
  }
}

Drawing.register(RectangleDrawing);

// @endif
