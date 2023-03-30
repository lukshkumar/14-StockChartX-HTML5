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
import { IPoint, ChartPoint } from "../../index";
import { Geometry } from "../../index";
import { PanGesture } from "../../index";
import { IWindowEvent, GestureState } from "../../index";
import { DrawingCursorClass } from "../utils";

// @if SCX_LICENSE != 'free'

"use strict";

export class TrendChannelDrawing extends Drawing {
  static get className(): string {
    return "trendChannel";
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

    let x1 = points[0].x,
      y1 = points[0].y,
      x2 = points[1].x,
      y2 = points[1].y,
      x3 = points[2].x,
      y3 = points[2].y,
      x4 = x3 + (x2 - x1),
      y4 = y2 + (y3 - y1),
      x5 = x1 - (x3 - x1),
      y5 = y1 - (y3 - y1),
      x6 = x5 + (x2 - x1),
      y6 = y2 - (y3 - y1),
      delta1 = Math.sqrt(x3 * x4 + y3 * y4),
      topDestinationX = Math.round(x3 + (x4 - x3) * delta1),
      topDestinationY = Math.round(y3 + (y4 - y3) * delta1),
      delta2 = Math.sqrt(x5 * x6 + y5 * y6),
      bottomDestinationX = Math.round(x5 + (x6 - x5) * delta2),
      bottomDestinationY = Math.round(y5 + (y6 - y5) * delta2);

    return {
      left: Math.min(
        points[0].x,
        points[1].x,
        points[2].x,
        topDestinationX,
        bottomDestinationX,
        x4,
        x5,
        x6
      ),
      top: Math.min(
        points[0].y,
        points[1].y,
        points[2].y,
        topDestinationY,
        bottomDestinationY,
        y4,
        y5,
        y6
      ),
      width: Math.abs(
        Math.max(
          points[0].x,
          points[1].x,
          points[2].x,
          x4,
          x5,
          x6,
          topDestinationX,
          bottomDestinationX
        ) -
          Math.min(
            points[0].x,
            points[1].x,
            points[2].x,
            x4,
            x5,
            x6,
            topDestinationX,
            bottomDestinationX
          )
      ),
      height: Math.abs(
        Math.max(
          points[0].y,
          points[1].y,
          points[2].y,
          y4,
          y5,
          y6,
          topDestinationY,
          bottomDestinationY
        ) -
          Math.min(
            points[0].y,
            points[1].y,
            points[2].y,
            y4,
            y5,
            y6,
            topDestinationY,
            bottomDestinationY
          )
      )
    };
  }

  _finishUserDrawing() {
    super._finishUserDrawing();

    let points = this.cartesianPoints(),
      point = ChartPoint.convert(
        { x: points[0].x, y: points[0].y - 20 },
        this.createPointBehavior,
        this.projection
      );
    this.appendChartPoint(point);
  }

  /**
   * @inheritdoc
   */
  hitTest(point: IPoint): boolean {
    if (!this.canHandleEvents) return false;

    let points = this.cartesianPoints();
    if (points.length < this.pointsNeeded) return false;

    let x1 = points[0].x,
      y1 = points[0].y,
      x2 = points[1].x,
      y2 = points[1].y,
      x3 = points[2].x,
      y3 = points[2].y,
      x4 = x3 + (x2 - x1),
      y4 = y2 + (y3 - y1),
      x5 = x1 - (x3 - x1),
      y5 = y1 - (y3 - y1),
      x6 = x5 + (x2 - x1),
      y6 = y2 - (y3 - y1),
      delta = Math.sqrt(x1 * x2 + y1 * y2),
      centerDestinationX = Math.round(x1 + (x2 - x1) * delta),
      centerDestinationY = Math.round(y1 + (y2 - y1) * delta),
      delta1 = Math.sqrt(x3 * x4 + y3 * y4),
      topDestinationX = Math.round(x3 + (x4 - x3) * delta1),
      topDestinationY = Math.round(y3 + (y4 - y3) * delta1),
      delta2 = Math.sqrt(x5 * x6 + y5 * y6),
      bottomDestinationX = Math.round(x5 + (x6 - x5) * delta2),
      bottomDestinationY = Math.round(y5 + (y6 - y5) * delta2);

    return (
      Geometry.isPointNearLine(
        point,
        { x: x1, y: y1 },
        { x: centerDestinationX, y: centerDestinationY }
      ) ||
      Geometry.isPointNearLine(
        point,
        { x: x3, y: y3 },
        { x: topDestinationX, y: topDestinationY }
      ) ||
      Geometry.isPointNearLine(
        point,
        { x: x5, y: y5 },
        { x: bottomDestinationX, y: bottomDestinationY }
      )
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
        let points = this.cartesianPoints();
        if (points.length > 1) {
          for (let i = 0; i < points.length; i++) {
            if (Geometry.isPointNearPoint(event.pointerPosition, points[i])) {
              this._setDragPoint(i);
              this.changeCursor(DrawingCursorClass.RESIZE);

              return true;
            }
          }
        }

        break;
      case GestureState.CONTINUED:
        if (this._dragPoint >= 0) {
          this.chartPoints[this._dragPoint].moveToPoint(
            event.pointerPosition,
            this.projection
          );
          if (this._dragPoint === 0)
            this.chartPoints[2].translate(
              gesture.moveOffset.x,
              gesture.moveOffset.y,
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

    if (points.length > 2) {
      let x1 = points[0].x,
        y1 = points[0].y,
        x2 = points[1].x,
        y2 = points[1].y,
        x3 = points[2].x,
        y3 = points[2].y,
        x4 = x3 + (x2 - x1),
        y4 = y2 + (y3 - y1),
        x5 = x1 - (x3 - x1),
        y5 = y1 - (y3 - y1),
        x6 = x5 + (x2 - x1),
        y6 = y2 - (y3 - y1),
        delta = Math.sqrt(x1 * x2 + y1 * y2),
        centerDestinationX = Math.round(x1 + (x2 - x1) * delta),
        centerDestinationY = Math.round(y1 + (y2 - y1) * delta),
        delta1 = Math.sqrt(x3 * x4 + y3 * y4),
        topDestinationX = Math.round(x3 + (x4 - x3) * delta1),
        topDestinationY = Math.round(y3 + (y4 - y3) * delta1),
        delta2 = Math.sqrt(x5 * x6 + y5 * y6),
        bottomDestinationX = Math.round(x5 + (x6 - x5) * delta2),
        bottomDestinationY = Math.round(y5 + (y6 - y5) * delta2);

      context.beginPath();

      context.moveTo(x1, y1);
      context.lineTo(centerDestinationX, centerDestinationY);

      context.moveTo(x3, y3);
      context.lineTo(topDestinationX, topDestinationY);

      context.moveTo(x5, y5);
      context.lineTo(bottomDestinationX, bottomDestinationY);

      context.scxStroke(theme.line);
    } else if (points.length > 1) {
      context.scxStrokePolyline(points, theme.line);
    }

    if (this.selected) {
      this._drawSelectionMarkers(points);
    }
  }
}

Drawing.register(TrendChannelDrawing);

// @endif
