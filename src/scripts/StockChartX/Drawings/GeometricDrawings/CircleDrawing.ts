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
 * Represents circle drawing.
 * @constructor StockChartX.CircleDrawing
 * @augments StockChartX.Drawing
 * @example
 *  // Create circle drawing.
 *  var circle1 = new StockChartX.CircleDrawing({
 *      points: [{x: 10, y: 20}, {x: 50, y: 60}]
 *  });
 *
 *  // Create circle drawing.
 *  var circle2 = new StockChartX.CircleDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}]
 *  });
 *
 *  // Create circle drawing with a custom theme.
 *  var circle3 = new StockChartX.CircleDrawing({
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
export class CircleDrawing extends Drawing {
  static get className(): string {
    return DrawingClassNames.CircleDrawing;
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

    let radius = Geometry.length(points[0], points[1]);

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

    return (
      points.length > 1 &&
      Geometry.isPointNearCircle(point, points[0], points[1])
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
        if (this._dragPoint >= 0) {
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
   * @internal
   */
  private _updateCursor() {
    let cursorClass;

    switch (this._dragPoint) {
      case 0: // left
      case 2: // right
        cursorClass = DrawingCursorClass.RESIZE_EW;
        break;
      case 1: // top
      case 3: // bottom
        cursorClass = DrawingCursorClass.RESIZE_NS;
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

    let points = this.cartesianPoints(),
      context = this.context,
      theme = this.actualTheme;

    if (points.length > 1) {
      let radius = Geometry.length(points[0], points[1]),
        markers = this._markerPoints(points);

      context.beginPath();
      context.arc(points[0].x, points[0].y, radius, 0, 2 * Math.PI);
      context.scxFillStroke(theme.fill, theme.line);

      if (this.selected) {
        this._drawSelectionMarkers(markers);
      }
    }
  }

  /**
   * @internal
   */
  private _markerPoints(points?: IPoint[]): IPoint[] {
    points = points || this.cartesianPoints();
    if (points.length === 0) return null;

    let center = points[0];
    if (points.length === 1) return [{ x: center.x, y: center.y }];

    let radius = Geometry.length(points[0], points[1]);

    return [
      { x: center.x - radius, y: center.y }, // left
      { x: center.x, y: center.y - radius }, // top
      { x: center.x + radius, y: center.y }, // right
      { x: center.x, y: center.y + radius } // bottom
    ];
  }
}

Drawing.register(CircleDrawing);

// @endif
