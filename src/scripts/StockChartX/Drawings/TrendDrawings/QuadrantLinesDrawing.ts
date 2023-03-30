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
import { DataSeriesSuffix } from "../../index";
import {
  DrawingCursorClass,
  DrawingClassNames
} from "../utils";

// @if SCX_LICENSE != 'free'

"use strict";
/**
 * Represents quadrant lines drawing.
 * @constructor StockChartX.QuadrantLinesDrawing
 * @augments StockChartX.Drawing
 * @example
 *  // Create quadrant lines drawing.
 *  var drawing1 = new StockChartX.QuadrantLinesDrawing({
 *      points: [{x: 10, y: 20}, {x: 50, y: 60}]
 *  });
 *      *
 *  // Create quadrant lines drawing.
 *  var drawing2 = new StockChartX.QuadrantLinesDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}]
 *  });
 *
 *  // Create quadrant lines drawing with a custom theme.
 *  var drawing3 = new StockChartX.QuadrantLinesDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}],
 *      theme: {
 *          line: {
 *              strokeColor: 'white'
 *              width: 2
 *          }
 *      }
 *  });
 */
export class QuadrantLinesDrawing extends Drawing {
  static get className(): string {
    return DrawingClassNames.QuadrantLinesDrawing;
  }

  /**
   * @internal
   */
  private _drawingPoints: IPoint[][];

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
    let p = this._drawingPoints;

    return {
      left: Math.min(points[0].x, points[1].x),
      top: p[0][0].y,
      width: Math.abs(points[0].x - points[1].x),
      height: Math.abs(p[4][0].y - p[0][0].y)
    };
  }

  /**
   * @inheritdoc
   */
  hitTest(point: IPoint): boolean {
    if (!this.canHandleEvents) return false;

    if (this.chartPoints.length < 2) return false;

    let p = this._drawingPoints;
    for (let i = 0; i < 5; i++) {
      if (Geometry.isPointNearLine(point, p[i][0], p[i][1])) return true;
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

  _finishUserDrawing() {
    super._finishUserDrawing();

    let points = this.cartesianPoints();

    if (points[0].x > points[1].x) {
      this.chartPoints[0].moveToPoint(points[1], this.projection);
      this.chartPoints[1].moveToPoint(points[0], this.projection);
    }

    this._drawingPoints = this._calculateDrawingPoints(points);
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
      this._moveMainLineYPoint(p[2][0].y, p[2][1].y);

      for (let i = 0; i < 5; i++) {
        context.moveTo(p[i][0].x, p[i][0].y);
        context.lineTo(p[i][1].x, p[i][1].y);

        context.scxStroke(theme.line);
      }
    }

    if (this.selected) this._drawSelectionMarkers(this.cartesianPoints());
  }

  /**
   * @internal
   */
  protected _calculateDrawingPoints(points: IPoint[]): IPoint[][] {
    let point1 = points[0],
      point2 = points[1],
      projection = this.projection;

    let r1 = projection.recordByX(point1.x),
      r2 = projection.recordByX(point2.x);

    let record1 = Math.min(r1, r2),
      record2 = Math.max(r1, r2);

    let highestHigh = 0;
    let highDataSeries = this.chart.primaryDataSeries(DataSeriesSuffix.HIGH);

    for (let i = record1; i <= record2; i++) {
      let value = <number>highDataSeries.valueAtIndex(i);
      if (value > highestHigh) {
        highestHigh = value;
      }
    }

    let lowestLow = highestHigh;
    let lowDataSeries = this.chart.primaryDataSeries(DataSeriesSuffix.LOW);
    for (let i = record1; i <= record2; i++) {
      let value = <number>lowDataSeries.valueAtIndex(i);

      if (value < lowestLow) {
        lowestLow = value;
      }
    }

    let value = highestHigh + (highestHigh - lowestLow) / 4;

    let linesPoints = [];
    for (let i = 0; i < 5; i++) {
      value -= (highestHigh - lowestLow) / 4;
      let y1 = projection.yByValue(value),
        y2 = y1,
        x1 = point1.x,
        x2 = point2.x;
      linesPoints.push([{ x: x1, y: y1 }, { x: x2, y: y2 }]);
    }

    return linesPoints;
  }

  /**
   * @internal
   */
  private _moveMainLineYPoint(y1: number, y2: number): void {
    this.chartPoints[0].moveToY(y1, this.projection);
    this.chartPoints[1].moveToY(y2, this.projection);
  }
}

Drawing.register(QuadrantLinesDrawing);

// @endif
