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

// @if SCX_LICENSE = 'full'

"use strict";

export class AndrewsPitchforkDrawing extends Drawing {
  static get className(): string {
    return DrawingClassNames.AndrewsPitchforkDrawing;
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
    let point1 = points[0],
      point2 = points[1],
      point3 = points[2],
      x1 = point1.x,
      y1 = point1.y,
      x2 = point2.x,
      y2 = point2.y,
      x3 = point3.x,
      y3 = point3.y,
      centerX = (x3 - x2) / 2 + x2,
      centerY = (y3 - y2) / 2 + y2,
      topX = x2 - (x1 - centerX),
      topY = y2 - (y1 - centerY),
      bottomX = x3 - (x1 - centerX),
      bottomY = y3 - (y1 - centerY),
      delta1 = Math.sqrt(x2 * topX + y2 * topY),
      ox2 = x2 + (topX - x2) * delta1,
      oy2 = y2 + (topY - y2) * delta1,
      oPoint2 = { x: ox2, y: oy2 },
      delta2 = Math.sqrt(x3 * bottomX + y3 * bottomY),
      ox3 = x3 + (bottomX - x3) * delta2,
      oy3 = y3 + (bottomY - y3) * delta2,
      oPoint3 = { x: ox3, y: oy3 };

    return {
      left: Math.min(
        points[0].x,
        points[1].x,
        points[2].x,
        oPoint2.x,
        oPoint3.x
      ),
      top: Math.min(
        points[0].y,
        points[1].y,
        points[2].y,
        oPoint2.y,
        oPoint3.y
      ),
      width: Math.abs(
        Math.max(points[0].x, points[1].x, points[2].x, oPoint2.x, oPoint3.x) -
          Math.min(points[0].x, points[1].x, points[2].x, oPoint2.x, oPoint3.x)
      ),
      height:
        Math.abs(
          Math.max(points[0].y, points[1].y, points[2].y, oPoint2.y, oPoint3.y)
        ) -
        Math.min(points[0].y, points[1].y, points[2].y, oPoint2.y, oPoint3.y)
    };
  }

  /**
   * @inheritdoc
   */
  hitTest(point: IPoint): boolean {
    if (!this.canHandleEvents) return false;

    let points = this.cartesianPoints();
    if (points.length < 3) return false;

    let point1 = points[0],
      point2 = points[1],
      point3 = points[2],
      x1 = point1.x,
      y1 = point1.y,
      x2 = point2.x,
      y2 = point2.y,
      x3 = point3.x,
      y3 = point3.y,
      centerX = (x3 - x2) / 2 + x2,
      centerY = (y3 - y2) / 2 + y2,
      topX = x2 - (x1 - centerX),
      topY = y2 - (y1 - centerY),
      bottomX = x3 - (x1 - centerX),
      bottomY = y3 - (y1 - centerY),
      delta = Math.sqrt(x1 * centerX + y1 * centerY),
      ox1 = x1 + (centerX - x1) * delta,
      oy1 = y1 + (centerY - y1) * delta,
      oPoint1 = { x: ox1, y: oy1 },
      delta1 = Math.sqrt(x2 * topX + y2 * topY),
      ox2 = x2 + (topX - x2) * delta1,
      oy2 = y2 + (topY - y2) * delta1,
      oPoint2 = { x: ox2, y: oy2 },
      delta2 = Math.sqrt(x3 * bottomX + y3 * bottomY),
      ox3 = x3 + (bottomX - x3) * delta2,
      oy3 = y3 + (bottomY - y3) * delta2,
      oPoint3 = { x: ox3, y: oy3 };

    return (
      Geometry.isPointNearLine(point, point2, point3) ||
      Geometry.isPointNearLine(point, point1, oPoint1) ||
      Geometry.isPointNearLine(point, point2, oPoint2) ||
      Geometry.isPointNearLine(point, point3, oPoint3)
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
        centerX = (x3 - x2) / 2 + x2,
        centerY = (y3 - y2) / 2 + y2,
        topX = x2 - (x1 - centerX),
        topY = y2 - (y1 - centerY),
        bottomX = x3 - (x1 - centerX),
        bottomY = y3 - (y1 - centerY),
        delta = Math.sqrt(x1 * centerX + y1 * centerY),
        ox1 = x1 + (centerX - x1) * delta,
        oy1 = y1 + (centerY - y1) * delta,
        delta1 = Math.sqrt(x2 * topX + y2 * topY),
        ox2 = x2 + (topX - x2) * delta1,
        oy2 = y2 + (topY - y2) * delta1,
        delta2 = Math.sqrt(x3 * bottomX + y3 * bottomY),
        ox3 = x3 + (bottomX - x3) * delta2,
        oy3 = y3 + (bottomY - y3) * delta2;

      context.beginPath();

      context.moveTo(x1, y1);
      context.lineTo(ox1, oy1);

      context.moveTo(x2, y2);
      context.lineTo(ox2, oy2);

      context.moveTo(x3, y3);
      context.lineTo(ox3, oy3);

      context.moveTo(x2, y2);
      context.lineTo(x3, y3);

      // context.strokeRect(topX,topY,1,1);
      // context.strokeRect(bottomX,bottomY,1,1);

      context.scxStroke(theme.line);
    } else if (points.length > 1) {
      context.scxStrokePolyline(points, theme.line);
    }

    if (this.selected) {
      this._drawSelectionMarkers(points);
    }
  }
}

Drawing.register(AndrewsPitchforkDrawing);

// @endif
