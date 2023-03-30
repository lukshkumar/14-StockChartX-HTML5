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
 * Represents ellipse drawing.
 * @constructor StockChartX.EllipseDrawing
 * @augments StockChartX.Drawing
 * @example
 *  // Create ellipse drawing.
 *  var ellipse1 = new StockChartX.EllipseDrawing({
 *      points: [{x: 10, y: 20}, {x: 50, y: 60}]
 *  });
 *
 *  // Create ellipse drawing.
 *  var ellipse2 = new StockChartX.EllipseDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}]
 *  });
 *
 *  // Create ellipse drawing with a custom theme.
 *  var ellipse3 = new StockChartX.EllipseDrawing({
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
export class EllipseDrawing extends Drawing {
  static get className(): string {
    return DrawingClassNames.EllipseDrawing;
  }

  get pointsNeeded(): number {
    return 2;
  }

  /**
   * @internal
   */
  private _markerPoints(points?: IPoint[]): IPoint[] {
    points = points || this.cartesianPoints();
    if (points.length === 0) return null;

    let center = points[0];
    if (points.length === 1) return [{ x: center.x, y: center.y }];

    let horRadius = Geometry.xProjectionLength(points[0], points[1]),
      verRadius = Geometry.yProjectionLength(points[0], points[1]);

    return [
      { x: center.x - horRadius, y: center.y }, // left
      { x: center.x, y: center.y - verRadius }, // top
      { x: center.x + horRadius, y: center.y }, // right
      { x: center.x, y: center.y + verRadius } // bottom
    ];
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

    let horRadius = Geometry.xProjectionLength(points[0], points[1]),
      verRadius = Geometry.yProjectionLength(points[0], points[1]);

    return {
      left: points[0].x - horRadius,
      top: points[0].y - verRadius,
      width: 2 * horRadius,
      height: 2 * verRadius
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
      Geometry.isPointNearEllipse(point, points[0], points[1])
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
          switch (this._dragPoint) {
            case 0: // left
            case 2: // right
              this.chartPoints[1].moveToX(
                event.pointerPosition.x,
                this.projection
              );
              break;
            case 1: // top
            case 3: // bottom
              this.chartPoints[1].moveToY(
                event.pointerPosition.y,
                this.projection
              );
              break;
            default:
              break;
          }

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
      let horRadius = Geometry.xProjectionLength(points[0], points[1]),
        verRadius = Geometry.yProjectionLength(points[0], points[1]),
        markers = this._markerPoints(points);

      context.beginPath();
      context.save();
      context.translate(points[0].x, points[0].y);

      if (horRadius !== verRadius) {
        context.scale(1, verRadius / horRadius);
      }

      context.arc(0, 0, horRadius, 0, 2 * Math.PI);
      context.restore();
      context.closePath();
      context.scxFillStroke(theme.fill, theme.line);

      if (this.selected) {
        this._drawSelectionMarkers(markers);
      }
    }
  }
}

Drawing.register(EllipseDrawing);

// @endif
