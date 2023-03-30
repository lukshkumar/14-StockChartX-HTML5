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
import { JsUtil } from "../../index";
import { DrawingCalculationUtil } from "../../index";
import { IDrawingDefaults } from "../../index";
import { DrawingCursorClass } from "../utils";

// @if SCX_LICENSE != 'free'

"use strict";

export interface IErrorChannelOptions extends IDrawingDefaults {
  rangeRatio?: number;
}

const RANGE_RATIO_CHANGED = "drawingRangeRatioChanged";

/**
 * Represents error channel drawing.
 * @constructor StockChartX.ErrorChannelDrawing
 * @augments StockChartX.Drawing
 * @example
 *  // Create error channel drawing.
 *  var drawing1 = new StockChartX.ErrorChannelDrawing({
 *      points: [{x: 10, y: 20}, {x: 50, y: 60}]
 *  });
 *
 *  // Create error channel drawing.
 *  var drawing2 = new StockChartX.ErrorChannelDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}]
 *  });
 *
 *  // Create error channel drawing with a custom theme.
 *  var drawing3 = new StockChartX.ErrorChannelDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}],
 *      theme: {
 *          line: {
 *              strokeColor: 'white'
 *              width: 2
 *          }
 *      }
 *  });
 */
export class ErrorChannelDrawing extends Drawing {
  static get className(): string {
    return "errorChannel";
  }

  static defaults: IErrorChannelOptions = {
    rangeRatio: 0.5
  };

  get rangeRatio(): number {
    let value = this._optionValue("rangeRatio");

    return value || ErrorChannelDrawing.defaults.rangeRatio;
  }

  set rangeRatio(value: number) {
    if (typeof value !== "number")
      throw new TypeError("Range ratio must be a number.");

    if (!JsUtil.isPositiveNumber(value))
      throw new Error("Range ratio must be a number greater than 0.");

    (<IErrorChannelOptions>this._options).rangeRatio = value;
    this.fire(RANGE_RATIO_CHANGED, value);
  }

  /**
   * @internal
   */
  private _drawingPoints: IPoint[];

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
    if (!p) return false;

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
    if (points.length < 2) return;

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
      let x1 = points[0].x,
        x2 = points[1].x;
      if (x1 > x2) {
        let tmp = points[1];
        points[1] = points[0];
        points[0] = tmp;
      }
    }

    if (points.length > 1) {
      context.beginPath();

      let p = (this._drawingPoints = this._calculateDrawingPoints(points));
      this._moveMainLineYPoint(p[2].y, p[3].y);

      context.moveTo(p[0].x, p[0].y);
      context.lineTo(p[1].x, p[1].y);

      context.moveTo(p[2].x, p[2].y);
      context.lineTo(p[3].x, p[3].y);

      context.moveTo(p[4].x, p[4].y);
      context.lineTo(p[5].x, p[5].y);

      context.scxStroke(theme.line);

      points = this._getMainLinePoints();
    }
    if (this.selected) this._drawSelectionMarkers(points);
  }

  /**
   * @internal
   */
  protected _calculateDrawingPoints(points: IPoint[]): IPoint[] {
    let point1 = points[0],
      point2 = points[1],
      projection = this.projection,
      dataSeries = this.chart.primaryBarDataSeries();

    let r1 = projection.recordByX(point1.x),
      r2 = projection.recordByX(point2.x);

    let record1 = Math.min(r1, r2),
      record2 = Math.max(r1, r2);

    let high = dataSeries.high,
      highestHigh = 0;
    for (let i = record1; i <= record2; i++) {
      if (<number>high.valueAtIndex(i) > highestHigh) {
        highestHigh = <number>high.valueAtIndex(i);
      }
    }

    let low = dataSeries.low,
      lowestLow = highestHigh;
    for (let i = record1; i <= record2; i++) {
      if (<number>low.valueAtIndex(i) < lowestLow) {
        lowestLow = <number>low.valueAtIndex(i);
      }
    }

    let range = (highestHigh - lowestLow) * this.rangeRatio,
      recordCount = record2 - record1 + 1,
      values = [];
    for (let i = 0; i < recordCount; i++) {
      values.push(<number>dataSeries.low.valueAtIndex(record1 + i));
    }

    let regression = DrawingCalculationUtil.calculateLinearRegression(values);
    let slope = regression.slope,
      leftValue = regression.firstValue,
      rightValue = leftValue + slope * (recordCount - 1);

    let y1 = projection.yByValue(leftValue + range),
      y2 = projection.yByValue(rightValue + range),
      y3 = projection.yByValue(leftValue),
      y4 = projection.yByValue(rightValue),
      y5 = projection.yByValue(leftValue - range),
      y6 = projection.yByValue(rightValue - range);

    return [
      { x: point1.x, y: y1 },
      { x: point2.x, y: y2 },
      { x: point1.x, y: y3 },
      { x: point2.x, y: y4 },
      { x: point1.x, y: y5 },
      { x: point2.x, y: y6 }
    ];
  }

  /**
   * @internal
   */
  private _getMainLinePoints(): IPoint[] {
    return [this._drawingPoints[2], this._drawingPoints[3]];
  }

  /**
   * @internal
   */
  private _moveMainLineYPoint(y1: number, y2: number): void {
    this.chartPoints[0].moveToY(y1, this.projection);
    this.chartPoints[1].moveToY(y2, this.projection);
  }
}

Drawing.register(ErrorChannelDrawing);

// @endif
