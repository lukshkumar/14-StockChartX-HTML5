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
import {
  DrawingCursorClass,
  DrawingClassNames
} from "../utils";

// @if SCX_LICENSE != 'free'

"use strict";
/**
 * Represents speed lines drawing.
 * @constructor StockChartX.SpeedLinesDrawing
 * @augments StockChartX.Drawing
 * @example
 *  // Create error channel drawing.
 *  var drawing1 = new StockChartX.SpeedLinesDrawing({
 *      points: [{x: 10, y: 20}, {x: 50, y: 60}]
 *  });
 *
 *  // Create speed lines drawing.
 *  var drawing2 = new StockChartX.SpeedLinesDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}]
 *  });
 *
 *  // Create speed lines drawing with a custom theme.
 *  var drawing3 = new StockChartX.SpeedLinesDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}],
 *      theme: {
 *          line: {
 *              strokeColor: 'white'
 *              width: 2
 *          }
 *      }
 *  });
 */
export class SpeedLinesDrawing extends Drawing {
  static get className(): string {
    return DrawingClassNames.SpeedLinesDrawing;
  }

  /**
   * @internal
   */
  private _drawingPoints: IPoint[];

  /**
   * @internal
   */
  private _markersPoints: IPoint[];

  /**
   * @internal
   */
  private _extend: boolean = true;

  get pointsNeeded(): number {
    return 2;
  }

  get extend(): boolean {
    return this._extend;
  }

  set extend(val: boolean) {
    this._extend = val;
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
    let points = this._drawingPoints;
    if (!points || points.length < 6) return null;

    return {
      left: Math.min(points[0].x, points[1].x),
      top: Math.min(
        points[0].y,
        points[1].y,
        points[2].y,
        points[3].y,
        points[4].y,
        points[5].y
      ),
      width: Math.abs(points[1].x - points[0].x),
      height: Math.abs(
        Math.max(
          points[0].y,
          points[1].y,
          points[2].y,
          points[3].y,
          points[4].y,
          points[5].y
        ) -
          Math.min(
            points[0].y,
            points[1].y,
            points[2].y,
            points[3].y,
            points[4].y,
            points[5].y
          )
      )
    };
  }

  /**
   * @inheritdoc
   */
  hitTest(point: IPoint): boolean {
    if (!this.canHandleEvents) return false;

    if (this.chartPoints.length < this.pointsNeeded) return false;

    let p = this._drawingPoints;

    return (
      Geometry.isPointNearLine(point, p[0], p[1]) ||
      Geometry.isPointNearLine(point, p[2], p[3]) ||
      Geometry.isPointNearLine(point, p[4], p[5])
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
        if (
          Geometry.isPointNearPoint(
            this._markersPoints[0],
            event.pointerPosition
          )
        )
          this._setDragPoint(0);
        else if (
          Geometry.isPointNearPoint(
            this._markersPoints[1],
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

      let p = (this._drawingPoints = this._calculateDrawingPoints(points));

      context.moveTo(p[0].x, p[0].y);
      context.lineTo(p[1].x, p[1].y);

      context.moveTo(p[2].x, p[2].y);
      context.lineTo(p[3].x, p[3].y);

      context.moveTo(p[4].x, p[4].y);
      context.lineTo(p[5].x, p[5].y);

      context.scxStroke(theme.line);
      points = this._markersPoints;
    }
    if (this.selected) this._drawSelectionMarkers(points);
  }

  /**
   * @internal
   */
  private _calculateDrawingPoints(points: IPoint[]): IPoint[] {
    let x1 = points[0].x,
      y1 = points[0].y,
      x2 = points[1].x,
      y2 = points[1].y;

    let dataSeries = this.chart.primaryBarDataSeries();
    let high = dataSeries.high,
      low = dataSeries.low;

    let startHigh = <number>high.valueAtIndex(this.projection.recordByX(x1)),
      startLow = <number>low.valueAtIndex(this.projection.recordByX(x1)),
      endHigh = <number>high.valueAtIndex(this.projection.recordByX(x2)),
      endLow = <number>low.valueAtIndex(this.projection.recordByX(x2));

    let isUptrend: boolean = endHigh > startLow,
      isDowntrend: boolean = endLow < startHigh;

    if (isUptrend && isDowntrend) {
      if (y1 > y2) {
        isUptrend = true;
      } else {
        isUptrend = false;
      }
    }

    let y3 = 0,
      y4 = 0;

    if (isUptrend) {
      y1 = this.projection.yByValue(startLow);
      y2 = this.projection.yByValue(endHigh);
      let value1 = startLow + (endHigh - startLow) * 0.667,
        value2 = startLow + (endHigh - startLow) * 0.333;
      y3 = this.projection.yByValue(value1);
      y4 = this.projection.yByValue(value2);
    } else {
      y1 = this.projection.yByValue(startHigh);
      y2 = this.projection.yByValue(endLow);
      let value1 = startHigh - (startHigh - endLow) * 0.667,
        value2 = startHigh - (startHigh - endLow) * 0.333;
      y3 = this.projection.yByValue(value1);
      y4 = this.projection.yByValue(value2);
    }

    x1 = this.projection.xByRecord(this.projection.recordByX(points[0].x));
    x2 = this.projection.xByRecord(this.projection.recordByX(points[1].x));

    this._markersPoints = [{ x: x1, y: y1 }, { x: x2, y: y2 }];

    if (this.extend) {
      let run = x2 - x1,
        delta = Math.sqrt(x1 * x2 + y1 * y2);
      x2 = Math.round(x1 + run * delta);
      y2 = Math.round(y1 - (y1 - y2) * delta);
      y3 = Math.round(y1 - (y1 - y3) * delta);
      y4 = Math.round(y1 - (y1 - y4) * delta);
    }

    return [
      { x: x1, y: y1 },
      { x: x2, y: y2 },
      { x: x1, y: y1 },
      { x: x2, y: y3 },
      { x: x1, y: y1 },
      { x: x2, y: y4 }
    ];
  }
}

Drawing.register(SpeedLinesDrawing);

// @endif
