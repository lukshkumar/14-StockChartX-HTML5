/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { Drawing, IDrawingOptions, IDrawingDefaults } from "../../index";
import { IRect } from "../../index";
import { IPoint } from "../../index";
import { JsUtil } from "../../index";
import { Geometry } from "../../index";
import { DummyCanvasContext } from "../../index";
import { PanGesture } from "../../index";
import { IWindowEvent, GestureState } from "../../index";
import {
  DrawingCursorClass,
  DrawingClassNames
} from "../utils";

// @if SCX_LICENSE != 'free'

"use strict";

// region Interfaces

export interface IMeasureDrawingOptions extends IDrawingOptions {
  cornerRadius: number;
}

export interface IMeasureDrawingDefaults extends IDrawingDefaults {
  cornerRadius: number;
}

// endregion

export const MeasureArrowDrawingMode = {
  START: "start",
  END: "end",
  BOTH: "both"
};

/**
 * Represents measure drawing.
 * @constructor StockChartX.MeasureDrawing
 * @augments StockChartX.Drawing
 * @example
 *  // Create rectangle drawing.
 *  var rect1 = new StockChartX.MeasureDrawing({
 *      points: [{x: 10, y: 20}, {x: 50, y: 60}]
 *  });
 *
 *  // Create rectangle drawing.
 *  var rect2 = new StockChartX.MeasureDrawing({
 *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}]
 *  });
 *
 *  // Create rectangle drawing with a custom theme.
 *  var rect3 = new StockChartX.MeasureDrawing({
 *      theme: {
 *               line: {
 *                   width: 1,
 *                   strokeColor: 'white',
 *                   strokeEnabled: true,
 *                   lineStyle : LineStyle.DASH
 *               },
 *               border: {
 *                   width: 1,
 *                   strokeColor: 'white',
 *                   strokeEnabled: true,
 *                   lineStyle: LineStyle.DASH
 *               },
 *               fill: {
 *                   fillEnabled: true,
 *                   fillColor: 'rgba(255, 255, 255, 0.5)'
 *               },
 *               balloon: {
 *                   text: {
 *                       fontFamily: 'Calibri',
 *                       fontSize: 11,
 *                       fillColor: 'white'
 *                   },
 *                   border: {
 *                       width: 1,
 *                       strokeColor: 'darkgray',
 *                       strokeEnabled: true,
 *                       lineStyle: LineStyle.SOLID
 *                   },
 *                   fill: {
 *                       fillEnabled: true,
 *                       fillColor: 'rgba(255, 255, 255, 0.5)'
 *                   }
 *               }
 *      }
 *  });
 */
export class MeasureDrawing extends Drawing {
  // region Static members

  static get className(): string {
    return DrawingClassNames.MeasureDrawing;
  }

  static defaults: IMeasureDrawingDefaults = {
    cornerRadius: 5
  };

  // endregion

  /**
   * @internal
   */
  private _isXDirectionInverted = false;

  /**
   * @internal
   */
  private _isYDirectionInverted = false;

  /**
   * @internal
   */
  private _xDirection = 1;

  /**
   * @internal
   */
  private _yDirection = 1;

  // region Properties

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

  get cornerRadius(): number {
    let radius = (<IMeasureDrawingOptions>this._options).cornerRadius;

    return radius != null ? radius : MeasureDrawing.defaults.cornerRadius;
  }

  set cornerRadius(value: number) {
    if (value && !JsUtil.isPositiveNumber(value))
      throw new Error("Corder radius must be a positive number.");

    (<IMeasureDrawingOptions>this._options).cornerRadius = value;
  }

  // endregion

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
   * @internal
   */
  private _markerPoints(rect?: IRect): IPoint[] {
    if (!rect) rect = this.bounds();
    if (!rect) {
      let point = this.cartesianPoint(0);

      return point && [point];
    }

    let midX = Math.round(rect.left + rect.width / 2),
      midY = Math.round(rect.top + rect.height / 2),
      right = rect.left + rect.width,
      bottom = rect.top + rect.height;

    return [
      { x: rect.left, y: rect.top }, // left top point
      { x: midX, y: rect.top }, // middle top point
      { x: right, y: rect.top }, // right top point
      { x: right, y: midY }, // middle right point
      { x: right, y: bottom }, // right bottom point
      { x: midX, y: bottom }, // middle bottom point
      { x: rect.left, y: bottom }, // left bottom point
      { x: rect.left, y: midY } // left middle point
    ];
  }

  /**
   * @internal
   */
  private _normalizePoints() {
    let rect = this.bounds();
    if (rect) {
      let projection = this.projection,
        points = this.chartPoints;

      points[0].moveTo(rect.left, rect.top, projection);
      points[1].moveTo(
        rect.left + rect.width,
        rect.top + rect.height,
        projection
      );
    }
  }

  /**
   * @inheritdoc
   */
  hitTest(point: IPoint): boolean {
    if (!this.canHandleEvents) return false;

    let points = this.cartesianPoints();

    return (
      points.length > 1 &&
      Geometry.isPointNearRectPoints(point, points[0], points[1])
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
              this._isXDirectionInverted = this._xDirection === -1;
              this._isYDirectionInverted = this._yDirection === 1;

              this._normalizePoints();
              this._setDragPoint(i);
              this._updateCursor();

              return true;
            }
          }
        }
        break;
      case GestureState.CONTINUED:
        if (this._dragPoint >= 0) {
          let projection = this.projection,
            points = this.chartPoints,
            pos = event.pointerPosition;

          switch (this._dragPoint) {
            case 0: // left top point
              points[0].moveTo(pos.x, pos.y, projection);
              break;
            case 1: // middle top point
              points[0].moveToY(pos.y, projection);
              break;
            case 2: // right top point
              points[0].moveToY(pos.y, projection);
              points[1].moveToX(pos.x, projection);
              break;
            case 3: // middle right point
              points[1].moveToX(pos.x, projection);
              break;
            case 4: // right bottom point
              points[1].moveTo(pos.x, pos.y, projection);
              break;
            case 5: // middle bottom point
              points[1].moveToY(pos.y, projection);
              break;
            case 6: // left bottom point
              points[0].moveToX(pos.x, projection);
              points[1].moveToY(pos.y, projection);
              break;
            case 7: // left middle point
              points[0].moveToX(pos.x, projection);
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
      case 0: // left top point
      case 4: // right bottom point
        cursorClass = DrawingCursorClass.RESIZE_NWSE;
        break;
      case 1: // middle top point
      case 5: // middle bottom point
        cursorClass = DrawingCursorClass.RESIZE_NS;
        break;
      case 2: // right top point
      case 6: // left bottom point
        cursorClass = DrawingCursorClass.RESIZE_NESW;
        break;
      case 3: // middle right point
      case 7: // left middle point
        cursorClass = DrawingCursorClass.RESIZE_EW;
        break;
      default:
        break;
    }

    if (cursorClass) this.changeCursor(cursorClass);
  }

  /**
   * @internal
   */
  private _duration(): string {
    let rect = this.bounds();
    if (!rect) return "";

    let fromDate = moment(this.projection.dateByX(rect.left)),
      toDate = moment(this.projection.dateByX(rect.left + rect.width));

    let durationIn = "years",
      duration = toDate.diff(fromDate, durationIn);

    if (duration === 0) {
      durationIn = "months";
      duration = toDate.diff(fromDate, durationIn);
    }

    if (duration === 0) {
      durationIn = "weeks";
      duration = toDate.diff(fromDate, durationIn);
    }

    if (duration === 0) {
      durationIn = "days";
      duration = toDate.diff(fromDate, durationIn);
    }

    if (duration === 0) {
      durationIn = "hours";
      duration = toDate.diff(fromDate, durationIn);
    }

    if (duration === 0) {
      durationIn = "minutes";
      duration = toDate.diff(fromDate, durationIn);
    }

    if (duration === 0) {
      durationIn = "seconds";
      duration = toDate.diff(fromDate, durationIn);
    }

    duration *= this._xDirection;

    return moment
      .duration(duration, durationIn)
      .humanize(true)
      .replace("in", "");
  }

  /**
   * @inheritdoc
   */
  draw() {
    if (!this.visible) return;

    let rect = this.bounds();
    if (!rect) return;

    let midX = Math.round(rect.left + rect.width / 2),
      midY = Math.round(rect.top + rect.height / 2),
      right = rect.left + rect.width,
      bottom = rect.top + rect.height,
      context = this.context,
      midLeft = { x: rect.left, y: midY },
      midRight = { x: right, y: midY },
      midTop = { x: midX, y: rect.top },
      midBottom = { x: midX, y: bottom },
      theme = this.actualTheme;

    context.beginPath();
    context.rect(rect.left, rect.top, rect.width, rect.height);
    context.scxFillStroke(theme.fill, theme.border);

    // Direction
    let p1 = this.chartPoints[0],
      p2 = this.chartPoints[1],
      isInvertedX = this._isXDirectionInverted ? p1.x < p2.x : p1.x > p2.x,
      isInvertedY = this._isYDirectionInverted ? p1.y > p2.y : p1.y < p2.y;

    this._xDirection = isInvertedX ? -1 : 1;
    this._yDirection = isInvertedY ? -1 : 1;

    // Arrows
    let xArrows =
        this._xDirection === 1
          ? MeasureArrowDrawingMode.END
          : MeasureArrowDrawingMode.START,
      yArrows =
        this._yDirection === 1
          ? MeasureArrowDrawingMode.START
          : MeasureArrowDrawingMode.END;

    this._drawArrowHeadLine(midLeft, midRight, xArrows);
    this._drawArrowHeadLine(midTop, midBottom, yArrows);

    // Balloon
    let projection = this.projection,
      maxPrice = p1.getValue(projection),
      minPrice = p2.getValue(projection),
      recordsCount = this.chart.barsBetweenPoints(p1, p2),
      priceText = this.panelValueScale.formatValue(
        (maxPrice - minPrice) * this._yDirection
      ),
      priceSize = DummyCanvasContext.measureText(priceText, theme.balloon.text),
      dateText = `${(
        recordsCount * this._xDirection
      ).toFixed()} bars, ${this._duration()}`,
      dateSize = DummyCanvasContext.measureText(dateText, theme.balloon.text),
      balloonHeight = priceSize.height + dateSize.height + 2,
      balloonWidth = Math.max(priceSize.width, dateSize.width) + 2,
      balloonLeft = midBottom.x - balloonWidth / 2,
      balloonTop = rect.top + rect.height + 4,
      priceY = balloonTop + priceSize.height,
      dateY = priceY + priceSize.height;

    this._drawRoundRect(balloonLeft, balloonTop, balloonWidth, balloonHeight);

    context.scxApplyTextTheme(theme.balloon.text);
    context.textBaseline = "alphabetic";
    context.textAlign = "left";
    context.fillText(priceText, balloonLeft + 3, priceY);
    context.fillText(dateText, balloonLeft + 3, dateY);

    // Points
    if (this.selected) {
      this._drawSelectionMarkers(this._markerPoints(rect));
    }
  }

  /**
   * @internal
   */
  private _drawArrowHeadLine(
    startPoint: IPoint,
    endPoint: IPoint,
    arrows: string
  ) {
    let context = this.context,
      theme = this.actualTheme,
      startRadians: number,
      endRadians: number;

    context.beginPath();

    context.moveTo(startPoint.x, startPoint.y);
    context.lineTo(endPoint.x, endPoint.y);
    context.scxStroke(theme.line);

    let dx = endPoint.x - startPoint.x,
      dy = endPoint.y - startPoint.y,
      radians = ((endPoint.x > startPoint.x ? -90 : 90) * Math.PI) / 180;

    switch (arrows) {
      case MeasureArrowDrawingMode.BOTH:
        // draw the starting arrowhead
        startRadians = Math.atan(dy / dx) + radians;
        if (startRadians === Math.PI) startRadians = 0;

        // draw the ending arrowhead
        endRadians = Math.atan(dy / dx) - radians;
        if (endRadians === 0) endRadians = Math.PI;

        this._drawArrow(startPoint, startRadians);
        this._drawArrow(endPoint, endRadians);

        break;
      case MeasureArrowDrawingMode.START:
        // draw the starting arrowhead
        startRadians = Math.atan(dy / dx) + radians;
        if (startRadians === Math.PI) startRadians = 0;

        this._drawArrow(startPoint, startRadians);
        break;
      case MeasureArrowDrawingMode.END:
        // draw the ending arrowhead
        endRadians = Math.atan(dy / dx) - radians;
        if (endRadians === 0) endRadians = Math.PI;

        this._drawArrow(endPoint, endRadians);
        break;
      default:
        break;
    }
  }

  /**
   * @internal
   */
  private _drawArrow(point: IPoint, radians: number) {
    let context = this.context,
      theme = this.actualTheme;

    context.save();

    context.beginPath();
    context.translate(point.x, point.y);
    context.rotate(radians);
    context.moveTo(0, 0);
    context.lineTo(5, 5);
    context.moveTo(0, 0);
    context.lineTo(-5, 5);
    context.closePath();
    context.scxStroke(theme.line);

    context.restore();
  }

  /**
   * Draws a rounded rectangle using the current state of the canvas.
   * If you omit the last three params, it will draw a rectangle
   * outline with a 5 pixel border radius
   * @method _drawRoundRect
   * @param {Number} x The top left x coordinate
   * @param {Number} y The top left y coordinate
   * @param {Number} width The width of the rectangle
   * @param {Number} height The height of the rectangle
   * @param {Number} radius The corner radius. Defaults to 5;
   * @memberOf StockChartX.MeasureDrawing
   * @private
   * @internal
   */
  private _drawRoundRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius?: number
  ) {
    if (radius == null) {
      radius = this.cornerRadius;
    }

    width += radius;
    height += radius;

    let context = this.context,
      right = x + width,
      bottom = y + height;

    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(right - radius, y);
    context.quadraticCurveTo(right, y, right, y + radius);
    context.lineTo(right, bottom - radius);
    context.quadraticCurveTo(right, bottom, right - radius, bottom);
    context.lineTo(x + radius, bottom);
    context.quadraticCurveTo(x, bottom, x, bottom - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();

    let theme = this.actualTheme.balloon;
    context.scxFillStroke(theme.fill, theme.border);
  }
}

Drawing.register(MeasureDrawing);

// @endif
