import { Drawing } from "../../index";
import { IChartPoint, ChartPoint, IPoint } from "../../index";
import { MouseHoverGesture } from "../../index";
import { IWindowEvent } from "../../index";
import { IRect } from "../../index";
import { Geometry } from "../../index";
import { DrawingClassNames } from "../utils";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

// @if SCX_LICENSE != 'free'

"use strict";

/**
 * Represents  free hand drawing
 * @constructor StockChartX.FreeHandDrawing
 * @augments StockChartX.Drawing
 */
export class FreeHandDrawing extends Drawing {
  static get className(): string {
    return DrawingClassNames.FreeHandDrawing;
  }

  /**
   * @internal
   */
  private _drawingPoints: number = 0;

  get pointsNeeded(): number {
    return Number.MAX_VALUE;
  }

  /**
   * @internal
   */
  protected _handleUserDrawingPoint(point: IChartPoint) {
    this._drawingPoints++;

    this.appendChartPoint(point);
    if (this._drawingPoints >= 2) {
      this._finishUserDrawing();
    }

    return true;
  }

  /**
   * @internal
   */
  protected _handleUserDrawingMoveGesture(
    gesture: MouseHoverGesture,
    event: IWindowEvent
  ) {
    let length = this.chartPoints.length;

    if (length > 0) {
      let currentPoint = event.pointerPosition;
      let currentChartPoint = <ChartPoint>(
        this._normalizeUserDrawingPoint(currentPoint)
      );
      let lastPoint = this.chartPoints[length - 1];

      if (
        Math.round(currentChartPoint.value) !== Math.round(lastPoint.value) ||
        currentPoint.x !== lastPoint.x
      ) {
        this.appendChartPoint(currentChartPoint);
        this.chartPanel.setNeedsUpdate();
      }
    }
  }

  /**
   * @inheritdoc
   */
  bounds(): IRect {
    let points = this.cartesianPoints();
    if (points.length < 2) return null;

    let maxX = points.reduce(
        (prev: number, curr: IPoint) => Math.max(prev, curr.x),
        -Infinity
      ),
      minX = points.reduce(
        (prev: number, curr: IPoint) => Math.min(prev, curr.x),
        Infinity
      ),
      maxY = points.reduce(
        (prev: number, curr: IPoint) => Math.max(prev, curr.y),
        -Infinity
      ),
      minY = points.reduce(
        (prev: number, curr: IPoint) => Math.min(prev, curr.y),
        Infinity
      );

    let width = Math.abs(maxX - minX),
      height = Math.abs(maxY - minY);

    return {
      left: minX,
      top: minY,
      width,
      height
    };
  }

  /**
   * @inheritdoc
   */
  hitTest(point: IPoint): boolean {
    if (!this.canHandleEvents) return false;

    return Geometry.isPointNearPolyline(point, this.cartesianPoints());
  }

  /**
   * @inheritdoc
   */
  draw() {
    if (!this.visible) return;

    let points = this.cartesianPoints(),
      context = this.context,
      theme = this.actualTheme;

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }
    context.scxStroke(theme.line);

    if (this.selected) {
      let firstPoint = points[0];
      let lastPoint = points[points.length - 1];

      this._drawSelectionMarkers([firstPoint, lastPoint]);
    }
  }
}

Drawing.register(FreeHandDrawing);

// @endif
