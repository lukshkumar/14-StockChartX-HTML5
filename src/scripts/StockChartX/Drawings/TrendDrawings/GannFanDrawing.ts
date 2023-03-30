/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { Drawing } from "../../index";
import { IRect } from "../../index";
import { IPoint } from "../../index";
import { Geometry } from "../../index";
import { PanGesture } from "../../index";
import { IWindowEvent, GestureState } from "../../index";
import { IDrawingDefaults } from "../../index";
import {
  DrawingCursorClass,
  DrawingClassNames
} from "../utils";
// @if SCX_LICENSE != 'free'

"use strict";

export interface IGannFanAngle {
  value: number;
}

export interface IGannFanOptions extends IDrawingDefaults {
  angles?: IGannFanAngle[];
}

const ANGLES_CHANGED = "drawingAnglesChanged";
const SHOW_ANGLE_LINE_CHANGED = "drawingShowAngleLineChanged";

/**
 * Represents gann fan drawing.
 * @constructor StockChartX.GannFanDrawing
 * @augments StockChartX.Drawing
 * @example
 *  // Create gann fan drawing.
 *  var drawing1 = new StockChartX.GannFanDrawing({
 *      points: [{x: 10, y: 20}, {x: 50, y: 60}]
 *  });
 *
 *  // Create gann fan drawing.
 *  var drawing2 = new StockChartX.GannFanDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}]
 *  });
 *
 *  // Create gann fan drawing with a custom theme.
 *  var drawing3 = new StockChartX.GannFanDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}],
 *      theme: {
 *          line: {
 *              strokeColor: 'white'
 *              width: 2
 *          }
 *      }
 *  });
 */
export class GannFanDrawing extends Drawing {
  static get className(): string {
    return DrawingClassNames.GannFanDrawing;
  }

  static defaults: IGannFanOptions = {
    angles: [
      { value: 0.125 },
      { value: 0.25 },
      { value: 0.3333 },
      { value: 0.5 },
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 8 }
    ]
  };

  /**
   * @internal
   */
  private _drawingPoints: IPoint[][];

  get angles(): IGannFanAngle[] {
    let value = this._optionValue("angles");

    return value || GannFanDrawing.defaults.angles;
  }

  set angles(value: IGannFanAngle[]) {
    if (value != null && !Array.isArray(value))
      throw new TypeError("Angles must be an array of numbers.");

    (<IGannFanOptions>this._options).angles = value;
    this.fire(ANGLES_CHANGED, value);
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
    if (points.length < 2) return null;

    this._drawingPoints = this._calculateDrawingPoints(points);
    let firstPoint = this._drawingPoints[0][1],
      lastPoint = this._drawingPoints[this._drawingPoints.length - 1][1];

    return {
      left: Math.min(points[0].x, points[1].x, firstPoint.x, lastPoint.x),
      top: Math.min(points[0].y, points[1].y, firstPoint.y, lastPoint.y),
      width: Math.abs(
        Math.max(points[0].x, points[1].x, firstPoint.x, lastPoint.x) -
          Math.min(points[0].x, points[1].x, firstPoint.x, lastPoint.x)
      ),
      height: Math.abs(
        Math.max(points[0].y, points[1].y, firstPoint.y, lastPoint.y) -
          Math.min(points[0].y, points[1].y, firstPoint.y, lastPoint.y)
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

    for (let p of this._drawingPoints) {
      if (Geometry.isPointNearLine(point, p[0], p[1])) return true;
    }

    return false;
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
      context.beginPath();
      this._drawingPoints = this._calculateDrawingPoints(points);
      for (let p of this._drawingPoints) {
        context.moveTo(p[0].x, p[0].y);
        context.lineTo(p[1].x, p[1].y);
        context.scxStroke(theme.line);
      }
    }
    if (this.selected) this._drawSelectionMarkers(points);
  }

  /**
   * @internal
   */
  private _calculateDrawingPoints(points: IPoint[]): IPoint[][] {
    let x1 = points[0].x,
      y1 = points[0].y,
      x2 = points[1].x,
      y2 = points[1].y,
      contentFrame = this.chartPanel.contentFrame;

    let isLeft = x1 > x2;
    let destinationX = isLeft ? contentFrame.left : contentFrame.right;

    let drawingPoints = [];
    for (let angle of this.angles) {
      y2 = y1 - Math.round(y1 - points[1].y) * angle.value;
      drawingPoints.push([{ x: x1, y: y1 }, { x: x2, y: y2 }]);
    }

    for (let p of drawingPoints) {
      y1 = p[0].y;
      y2 = p[1].y;
      x1 = p[0].x;
      x2 = p[1].x;
      p[1].x = destinationX;
      p[1].y = Math.round(y1 + ((destinationX - x1) * (y2 - y1)) / (x2 - x1));
    }

    return drawingPoints;
  }
}

Drawing.register(GannFanDrawing);
// @endif
