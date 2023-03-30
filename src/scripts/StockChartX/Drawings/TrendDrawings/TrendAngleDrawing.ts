import { Drawing, IDrawingOptions } from "../../index";
import { IRect } from "../../index";
import { IPoint } from "../../index";
import { Geometry } from "../../index";
import { PanGesture } from "../../index";
import { IWindowEvent, GestureState } from "../../index";
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

"use strict";

export class TrendAngleDrawing extends Drawing {
  static get className(): string {
    return DrawingClassNames.TrendAngleDrawing;
  }

  static defaults = {
    radius: 30
  };

  private _tanMax = 16331239353195370; // Math.tan(Math.PI/2)
  private _tanMin = -16331239353195370;
  protected _textOffset: number = 4;
  protected _arctan: number;
  protected _angleCorrection: boolean = false;

  get pointsNeeded(): number {
    return 2;
  }

  /**
   * Gets/Sets radius.
   * @name radius
   * @type {number}
   * @memberOf StockChartX.Drawing#
   */
  get radius(): number {
    return (
      (<IDrawingOptions>this._options).radius ||
      TrendAngleDrawing.defaults.radius
    );
  }

  set radius(value: number) {
    this._setOption("radius", value);
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
   * @inheritdoc
   */
  hitTest(point: IPoint): boolean {
    if (!this.canHandleEvents) return false;

    let points = this.cartesianPoints();

    if (this._dragPoint == null) {
      if (this._arctan != null) {
        this._angleCorrection = true;
        let y =
          Math.tan(this._arctan) * (points[0].x - points[1].x) + points[0].y;
        if (points[0].x !== points[1].x || points[0].y !== y) {
          points[1].y = y;
        }
      }
    }

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
          ) &&
          this._arctan == null
        )
          this._setDragPoint(0);
        else if (
          Geometry.isPointNearPoint(
            this.cartesianPoint(1),
            event.pointerPosition
          )
        )
          this._setDragPoint(1);
        else {
          if (this._arctan != null) {
            let points = this.cartesianPoints(),
              tan = Math.tan(this._arctan),
              y = tan * (points[0].x - points[1].x) + points[0].y;
            if (
              (points[0].x !== points[1].x || points[0].y !== y) &&
              tan < this._tanMax &&
              tan > this._tanMin
            ) {
              this.chartPoints[1].value = this.projection.valueByY(y);
            }
          }

          return false;
        }

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

    if (this._dragPoint == null) {
      if (this._arctan && this._angleCorrection) {
        let tan = Math.tan(this._arctan);
        let y = tan * (points[0].x - points[1].x) + points[0].y;
        if (
          (points[0].x !== points[1].x || points[0].y !== y) &&
          tan < this._tanMax &&
          tan > this._tanMin
        ) {
          points[1].y = y;
        }
      }
    }

    if (points.length > 1) {
      this.context.scxStrokePolyline(points, this.actualTheme.line);
      this._calculateAngle(points);
    }

    if (this.selected) {
      this._drawSelectionMarkers(points);
    }
  }

  /**
   * @internal
   */
  private _calculateAngle(points: IPoint[]) {
    let angle: number;
    let atan = Math.atan(
      (points[1].y - points[0].y) / (points[0].x - points[1].x)
    );

    if (isNaN(atan)) {
      angle = 90;
    } else {
      angle = Math.round(atan * (180 / Math.PI));
    }

    this._arctan = atan;
    let radian = (-angle * Math.PI) / 180;
    let clockWise = false;

    if (angle <= 0 && points[1].x <= points[0].x) {
      angle = 180 + angle;
      radian = radian + Math.PI;
    }
    if (angle > 0 && points[1].x <= points[0].x && points[1].y > points[0].y) {
      angle = angle - 180;
      radian = radian + Math.PI;
      clockWise = true;
    }
    if (angle < 0 && points[1].x > points[0].x) {
      clockWise = true;
    }

    this._drawTrendAngle(angle.toFixed(0), radian, clockWise, points);
  }

  /**
   * @internal
   */
  private _drawTrendAngle(
    angle: number | string,
    radian: number,
    clockWise: boolean,
    points: IPoint[]
  ) {
    let context = this.context;

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    context.lineTo(points[0].x + this.radius, points[0].y);
    context.scxStroke(this.actualTheme.horizontalLine);

    context.beginPath();
    context.arc(points[0].x, points[0].y, this.radius, radian, 0, clockWise);
    context.scxStroke(this.actualTheme.arc);

    context.scxApplyTextTheme(this.actualTheme.text);
    context.fillText(
      `${angle.toString()}°`,
      points[0].x + this._textOffset + this.radius,
      points[0].y + this._textOffset
    );
  }
}

Drawing.register(TrendAngleDrawing);
