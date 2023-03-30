/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { Environment, IPoint, IRect } from "../index";
"use strict";

// tslint:disable:no-invalid-this

/**
 * Geometry functions
 * @namespace Geometry
 * @memberOf StockChartX
 */
export namespace Geometry {
  export let REGULAR_DEVIATION = Environment.isMobile ? 20 : 5;
  export let MAGNET_DEVIATION = Environment.isMobile ? 40 : 15;
  export let DEVIATION = REGULAR_DEVIATION;

  /**
   * Calculates line length.
   * @method length
   * @param {StockChartX~Point} point1 The first point.
   * @param {StockChartX~Point} point2 The second point.
   * @returns {Number} The length of line.
   * @memberOf StockChartX.Geometry
   */
  export function length(point1: IPoint, point2: IPoint): number {
    let xLen = Math.abs(point2.x - point1.x),
      yLen = Math.abs(point2.y - point1.y),
      len = Math.sqrt(xLen * xLen + yLen * yLen);

    return Math.round(len);
  }

  /**
   * Calculates X projection length.
   * @method xProjectionLength
   * @param {StockChartX~Point} point1 The first point.
   * @param {StockChartX~Point} point2 The second point.
   * @returns {Number} The length of X projection.
   * @memberOf StockChartX.Geometry
   */
  export function xProjectionLength(point1: IPoint, point2: IPoint): number {
    return Math.abs(point1.x - point2.x);
  }

  /**
   * Calculates Y projection length.
   * @method yProjectionLength
   * @param {StockChartX~Point} point1 The first point.
   * @param {StockChartX~Point} point2 The second point.
   * @returns {Number} The length of Y projection.
   * @memberOf StockChartX.Geometry
   */
  export function yProjectionLength(point1: IPoint, point2: IPoint) {
    return Math.abs(point1.y - point2.y);
  }

  /**
   * Checks if two values are equal or their difference is not greater than deviation.
   * @method isValueNearValue
   * @param {Number} value1 The first value.
   * @param {Number} value2 The second value.
   * @returns {boolean}
   * @memberOf StockChartX.Geometry
   */
  export function isValueNearValue(value1: number, value2: number): boolean {
    return Math.abs(value1 - value2) <= DEVIATION;
  }

  /**
   * Checks if value is located between two values (with deviation).
   * @method isValueBetweenOrNearValues
   * @param {Number} value The value to check.
   * @param {Number} value1 The first value.
   * @param {Number} value2 The second value.
   * @returns {boolean}
   * @memberOf StockChartX.Geometry
   */
  export function isValueBetweenOrNearValues(
    value: number,
    value1: number,
    value2: number
  ): boolean {
    return (
      value >= Math.min(value1, value2) - DEVIATION &&
      value <= Math.max(value1, value2) + DEVIATION
    );
  }

  /**
   * Checks if one point is located near other point.
   * @method isPointNearPoint
   * @param {StockChartX~Point} point The first point.
   * @param {StockChartX~Point | StockChartX~Point[]} checkPoint The second point or an array of points.
   * @returns {boolean}
   * @memberOf StockChartX.Geometry
   */
  export function isPointNearPoint(
    point: IPoint,
    checkPoint: IPoint | IPoint[]
  ): boolean {
    if (Array.isArray(checkPoint)) {
      for (let p of checkPoint) {
        if (this.isPointNearPoint(point, p)) return true;
      }

      return false;
    }

    return (
      this.isValueNearValue(point.x, (<IPoint>checkPoint).x) &&
      this.isValueNearValue(point.y, (<IPoint>checkPoint).y)
    );
  }

  /**
   * Checks if point is located near rectangle described by 2 points.
   * @method isPointNearRectPoints
   * @param {StockChartX~Point} point The point.
   * @param {StockChartX~Point} rectPoint1 The first point of rectangle.
   * @param {StockChartX~Point} rectPoint2 The second point of rectangle.
   * @returns {boolean}
   * @memberOf StockChartX.Geometry
   */
  export function isPointNearRectPoints(
    point: IPoint,
    rectPoint1: IPoint,
    rectPoint2: IPoint
  ): boolean {
    let leftX = Math.min(rectPoint1.x, rectPoint2.x),
      rightX = Math.max(rectPoint1.x, rectPoint2.x),
      topY = Math.min(rectPoint1.y, rectPoint2.y),
      bottomY = Math.max(rectPoint1.y, rectPoint2.y);

    if (
      this.isPointNearLine(
        point,
        { x: leftX, y: bottomY },
        { x: leftX, y: topY }
      )
    )
      return true;
    if (
      this.isPointNearLine(point, { x: leftX, y: topY }, { x: rightX, y: topY })
    )
      return true;
    if (
      this.isPointNearLine(
        point,
        { x: rightX, y: topY },
        { x: rightX, y: bottomY }
      )
    )
      return true;

    return this.isPointNearLine(
      point,
      { x: rightX, y: bottomY },
      { x: leftX, y: bottomY }
    );
  }

  /**
   * Checks if point is located near or inside of a given rectangle.
   * @param {StockChartX~Point} point The point.
   * @param {StockChartX~Rect} rect The rectangle.
   * @returns {boolean}
   * @memberOf StockChartX.Geometry
   */
  export function isPointInsideOrNearRect(point: IPoint, rect: IRect) {
    return (
      this.isValueBetweenOrNearValues(
        point.x,
        rect.left,
        rect.left + rect.width
      ) &&
      this.isValueBetweenOrNearValues(point.y, rect.top, rect.top + rect.height)
    );
  }

  /**
   * Checks if point is located near or inside of a given rectangle described by 2 points.
   * @param {StockChartX~Point} point The point.
   * @param {StockChartX~Point} rectPoint1 The first point of rectangle.
   * @param {StockChartX~Point} rectPoint2 The second point of rectangle.
   * @returns {boolean}
   * @memberOf StockChartX.Geometry
   */
  export function isPointInsideOrNearRectPoints(
    point: IPoint,
    rectPoint1: IPoint,
    rectPoint2: IPoint
  ): boolean {
    let leftX = Math.min(rectPoint1.x, rectPoint2.x),
      rightX = Math.max(rectPoint1.x, rectPoint2.x),
      topY = Math.min(rectPoint1.y, rectPoint2.y),
      bottomY = Math.max(rectPoint1.y, rectPoint2.y);

    return (
      this.isValueBetweenOrNearValues(point.x, leftX, rightX) &&
      this.isValueBetweenOrNearValues(point.y, topY, bottomY)
    );
  }

  /**
   * Checks if point is located near the circle.
   * @param {StockChartX~Point} point The point.
   * @param {StockChartX~Point} centerPoint The center point of circle.
   * @param {number | StockChartX~Point} radius The radius of circle or the point to calculate radius.
   * @returns {boolean}
   * @memberOf StockChartX.Geometry
   */
  export function isPointNearCircle(
    point: IPoint,
    centerPoint: IPoint,
    radius: number | IPoint
  ): boolean {
    let r1 = this.length(centerPoint, point);
    let r2 =
      typeof radius === "number" ? radius : this.length(centerPoint, radius);

    return this.isValueNearValue(r1, r2);
  }

  /**
   * Checks if point is located near or inside the circle.
   * @param {StockChartX~Point} point The point.
   * @param {StockChartX~Point} centerPoint The center point of circle.
   * @param {number | StockChartX~Point} radius The radius of circle or the point to calculate radius.
   * @returns {boolean}
   * @memberOf StockChartX.Geometry
   */
  export function isPointInsideOrNearCircle(
    point: IPoint,
    centerPoint: IPoint,
    radius: number | IPoint
  ): boolean {
    let r1 = this.length(centerPoint, point);
    let r2 =
      typeof radius === "number" ? radius : this.length(centerPoint, radius);

    return this.isValueBetweenOrNearValues(r1, 0, r2);
  }

  /**
   * Checks if point is located near the polygon.
   * @param {StockChartX~Point} point The point.
   * @param {StockChartX~Point[]} polygonPoints The polygon points.
   * @returns {boolean}
   * @memberOf StockChartX.Geometry
   */
  export function isPointNearPolygon(
    point: IPoint,
    polygonPoints: IPoint[]
  ): boolean {
    if (polygonPoints.length < 2) return false;

    for (let i = 0; i < polygonPoints.length - 1; i++) {
      if (this.isPointNearLine(point, polygonPoints[i], polygonPoints[i + 1]))
        return true;
    }

    return this.isPointNearLine(
      point,
      polygonPoints[polygonPoints.length - 1],
      polygonPoints[0]
    );
  }

  /**
   * Checks if point is located near the line.
   * @param {StockChartX~Point} point The check point.
   * @param {StockChartX~Point} linePoint1 The first point of line.
   * @param {StockChartX~Point} linePoint2 The second point of line.
   * @returns {boolean}
   * @memberOf StockChartX.Geometry
   */
  export function isPointNearLine(
    point: IPoint,
    linePoint1: IPoint,
    linePoint2: IPoint
  ): boolean {
    if (!this.isPointInsideOrNearRectPoints(point, linePoint1, linePoint2))
      return false;

    if (Math.abs(linePoint1.x - linePoint2.x) <= DEVIATION) return true;

    let k = (linePoint1.y - linePoint2.y) / (linePoint1.x - linePoint2.x);
    let a = Math.abs((Math.atan(k) * 180.0) / Math.PI);
    let isOrthogonal =
      Math.abs(a - 90.0) <= 10.0 || Math.abs(a - 270.0) <= 10.0;
    if (isOrthogonal) {
      let x = (point.y - (linePoint1.y - linePoint1.x * k)) / k;

      return this.isValueNearValue(x, point.x);
    } else {
      let y = linePoint1.y + k * (point.x - linePoint1.x);

      return this.isValueNearValue(y, point.y);
    }
  }

  /**
   * Checks if point is located near the line.
   * @param {StockChartX~Point} point The check point.
   * @param {StockChartX~Point[]} polylinePoints The array of points.
   * @returns {boolean}
   * @memberOf StockChartX.Geometry
   */
  export function isPointNearPolyline(
    point: IPoint,
    polylinePoints: IPoint[]
  ): boolean {
    for (let i = 0, count = polylinePoints.length; i < count - 1; i++) {
      if (this.isPointNearLine(point, polylinePoints[i], polylinePoints[i + 1]))
        return true;
    }

    return false;
  }

  /**
   * Checks if point is located near the ellipse.
   * @param {StockChartX~Point} point The check point.
   * @param {StockChartX~Point} centerPoint The center point of ellipse.
   * @param {StockChartX~Point} radiusPoint The point to calculate horizontal and vertical radius of ellipse.
   * @returns {boolean}
   * @memberOf StockChartX.Geometry
   */
  export function isPointNearEllipse(
    point: IPoint,
    centerPoint: IPoint,
    radiusPoint: IPoint
  ): boolean {
    let horRadius = Math.abs(radiusPoint.x - centerPoint.x),
      verRadius = Math.abs(radiusPoint.y - centerPoint.y);

    return this.isPointNearEllipseWithRadiuses(
      point,
      centerPoint,
      horRadius,
      verRadius
    );
  }

  /**
   * Checks if point is located near the ellipse.
   * @param {StockChartX~Point} point The check point.
   * @param {StockChartX~Point} centerPoint The center point of ellipse.
   * @param {number} horRadius The horizontal radius of ellipse.
   * @param {number} verRadius The vertical radius of ellipse.
   * @returns {boolean}
   * @memberOf StockChartX.Geometry
   */
  export function isPointNearEllipseWithRadiuses(
    point: IPoint,
    centerPoint: IPoint,
    horRadius: number,
    verRadius: number
  ): boolean {
    let x = point.x - centerPoint.x,
      y = point.y - centerPoint.y,
      value =
        (x * x) / (horRadius * horRadius) + (y * y) / (verRadius * verRadius);

    return 0.8 < value && value < 1.3;
  }
}

// tslint:enable:no-invalid-this
