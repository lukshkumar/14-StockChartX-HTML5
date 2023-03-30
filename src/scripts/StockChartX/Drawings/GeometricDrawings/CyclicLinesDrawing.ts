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
import { IMinMaxValues } from "../../index";
import {
  DrawingCursorClass,
  DrawingClassNames
} from "../utils";

// @if SCX_LICENSE = 'full'

"use strict";

/**
 * Represents cyclic lines drawing.
 * @param {object} [config] The configuration object.
 * @constructor StockChartX.CyclicLinesDrawing
 * @augments StockChartX.Drawing
 * @example
 *  // Create cyclic lines drawing.
 *  var cyclicLines1 = new StockChartX.CyclicLinesDrawing({
 *      points: [{x: 100, y: 100}, {x: 200, y: 200}]
 *  });
 *
 *  // Create cyclic lines drawing.
 *  var cyclicLines2 = new StockChartX.CyclicLinesDrawing({
 *      points: [{record: 20, value: 4.0}, {record: 50, value: 120.0}]
 *  });
 */
export class CyclicLinesDrawing extends Drawing {
  static get className(): string {
    return DrawingClassNames.CyclicLinesDrawing;
  }

  private _drawingPoints: IPoint[][] = [];

  private _isDirectionRight: boolean;

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
    if (points.length < this.pointsNeeded || this._drawingPoints) return null;

    let frame = this.chartPanel.contentFrame,
      drawingPoints = this._drawingPoints,
      firstLine = drawingPoints[1],
      lastLine = drawingPoints[drawingPoints.length - 1];

    return {
      left: Math.min(firstLine[0].x, lastLine[0].x),
      top: 0,
      width: Math.abs(firstLine[0].x - lastLine[0].x),
      height: frame.height
    };
  }

  /**
   * @inheritdoc
   */
  hitTest(point: IPoint): boolean {
    if (!this.canHandleEvents) return false;

    if (this.chartPoints.length < 2) return false;

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
      frame = this.chartPanel.contentFrame;

    this._drawingPoints = [points];

    if (points.length > 1) {
      let xPoints = this._calculateXPointsForLines(),
        yRange: IMinMaxValues<number> = { min: 0, max: frame.height };

      for (let x of xPoints) {
        let linePoint1: IPoint = { x, y: yRange.min },
          linePoint2: IPoint = { x, y: yRange.max };

        context.beginPath();
        context.moveTo(linePoint1.x, linePoint1.y);
        context.lineTo(linePoint2.x, linePoint2.y);
        context.scxStroke(this.actualTheme.line);

        this._drawingPoints.push([linePoint1, linePoint2]);
      }
    }

    if (points.length > 1) {
      context.scxStrokePolyline(points, this.actualTheme.line);
    }

    if (this.selected) {
      this._drawSelectionMarkers(points);
    }
  }

  private _calculateXPointsForLines(): number[] {
    let frameWidth = this.chartPanel.contentFrame.width,
      points = this.cartesianPoints();

    let p1 = points[0].x,
      p2 = points[1].x,
      xPoints = [p1, p2];

    if (p1 === p2) p2 = this._isDirectionRight ? p2 + 1 : p2 - 1;
    else this._isDirectionRight = p2 > p1;

    let range = p2 - p1,
      lastXPoint = p2;

    while (true) {
      let x = lastXPoint + range;

      if ((p1 < p2 && x < frameWidth) || (p1 > p2 && x > 0)) {
        lastXPoint = x;
        xPoints.push(lastXPoint);
      } else break;
    }

    return xPoints;
  }
}

Drawing.register(CyclicLinesDrawing);

// @endif
