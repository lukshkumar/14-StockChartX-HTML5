/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

// region Declarations

/**
 * The point structure.
 * @typedef {Object} StockChartX~Point
 * @type {Object}
 * @property {number} x The X coordinate.
 * @property {number} y The Y coordinate.
 * @memberOf StockChartX
 * @example
 *  var point = {
 *      x: 10,
 *      y: 20
 *  };
 */

/**
 * The point behavior structure.
 * @typedef {object} StockChartX~PointBehavior
 * @type {object}
 * @property {StockChartX.XPointBehavior} x The X coordinate behavior.
 * @property {StockChartX.YPointBehavior} y The Y coordinate behavior.
 * @memberOf StockChartX
 * @see [XPointBehavior]{@linkcode StockChartX.XPointBehavior}
 * @see [YPointBehavior]{@linkcode StockChartX.YPointBehavior}
 * @example
 * var behavior = {
 *  x: StockChartX.XPointBehavior.DATE,
 *  y: StockChartX.YPointBehavior.VALUE
 * };
 */

// endregion
import { ICloneable } from "../index";
import { Projection } from "../index";
"use strict";

// region Interfaces

export interface IPoint {
  x: number;
  y: number;
}

export interface IChartPoint {
  x?: number;
  date?: Date;
  record?: number;
  y?: number;
  value?: number;
}

// endregion

// region Declarations

/**
 * X point behavior enum values.
 * @readonly
 * @enum {string}
 * @memberOf StockChartX
 */
export const XPointBehavior = {
  /** Use x as X coordinate */
  X: <XPointBehavior>"x",

  /** Use record as X coordinate */
  RECORD: <XPointBehavior>"record",

  /** Use date as X coordinate */
  DATE: <XPointBehavior>"date"
};
Object.freeze(XPointBehavior);
export type XPointBehavior = "x" | "record" | "date";

/**
 * Y point behavior enum values.
 * @readonly
 * @enum {string}
 * @memberOf StockChartX
 */
export const YPointBehavior = {
  /** Use y as Y coordinate */
  Y: <YPointBehavior>"y",

  /** Use value as Y coordinate */
  VALUE: <YPointBehavior>"value"
};
Object.freeze(YPointBehavior);
export type YPointBehavior = "y" | "value";

export interface IPointBehavior {
  x: XPointBehavior;
  y: YPointBehavior;
}

// endregion

/**
 * Represents chart point.
 * @param {Object} [config] The configuration object.
 * @param {Number} [config.x] The X coordinate of point.
 * @param {Number} [config.y] The Y coordinate of point.
 * @param {Date} [config.date] The date of point.
 * @param {Number} [config.record] The record of point.
 * @param {Number} [config.value] The value of point.
 * @example
 *  // Create cartesian point.
 *  var p1 = new StockChartX.ChartPoint({
 *      x: 10,
 *      y: 20
 *  });
 *
 *  // Create date-value point.
 *  var p2 = new StockChartX.ChartPoint({
 *      date: new Date(),
 *      value: 10.0
 *  });
 *
 *  // Create record-value point.
 *  var p3 = new StockChartX.ChartPoint({
 *      record: 1,
 *      value: 10.0
 *  });
 * @constructor StockChartX.ChartPoint
 */

/**
 * Raw point's X coordinate.
 * @name x
 * @type number
 * @memberOf StockChartX.ChartPoint#
 */

/**
 * Raw point's date value.
 * @name date
 * @type Date
 * @memberOf StockChartX.ChartPoint#
 */

/**
 * Raw point's record value.
 * @name record
 * @type number
 * @memberOf StockChartX.ChartPoint#
 */

/**
 * Raw point's Y coordinate
 * @name y
 * @type number
 * @memberOf StockChartX.ChartPoint#
 */

/**
 * Raw point's price value.
 * @name value
 * @type number
 * @memberOf StockChartX.ChartPoint#
 */
export class ChartPoint implements IChartPoint, ICloneable<ChartPoint> {
  public x: number;
  public date: Date;
  public record: number;
  public y: number;
  public value: number;

  constructor(config?: IChartPoint) {
    config = config || {};

    if (config.x != null) this.x = config.x;
    if (config.y != null) this.y = config.y;
    if (config.date != null)
      this.date =
        typeof config.date === "string"
          ? new Date(<string>(<any>config.date))
          : config.date;
    if (config.value != null) this.value = config.value;
    if (config.record != null) this.record = config.record;
  }

  /**
   * Converts XY point into ChartPoint.
   * @param {StockChartX~Point} point The source point.
   * @param {StockChartX~PointBehavior} behavior The convert behavior.
   * @param {StockChartX.Projection} projection The projection.
   * @returns {StockChartX.ChartPoint}
   * @memberOf StockChartX.ChartPoint
   * @example
   * var point = {
   *  x: 10,
   *  y: 20
   * };
   * var behavior = {
   *  x: StockChartX.XPointBehavior.RECORD,
   *  y: StockChartX.YPointBehavior.VALUE
   * };
   * var chartPoint = StockChartX.ChartPoint.convert(point, behavior, projection);
   */
  static convert(
    point: IPoint,
    behavior: IPointBehavior,
    projection: Projection
  ): ChartPoint {
    let config = <IChartPoint>{};

    switch (behavior.x) {
      case XPointBehavior.X:
        config.x = point.x;
        break;
      case XPointBehavior.RECORD:
        config.record =
          point.x != null ? projection.recordByX(point.x, false) : null;
        break;
      case XPointBehavior.DATE:
        config.date = point.x != null ? projection.dateByX(point.x) : null;
        break;
      default:
        throw new Error(`Unknown X point behavior: ${behavior.x}`);
    }

    switch (behavior.y) {
      case YPointBehavior.Y:
        config.y = point.y;
        break;
      case YPointBehavior.VALUE:
        config.value = point.y != null ? projection.valueByY(point.y) : null;
        break;
      default:
        throw new Error(`Unknown Y point behavior: ${behavior.y}`);
    }

    return new ChartPoint(config);
  }

  /**
   * Clears point's values.
   * @method clear
   * @memberOf StockChartX.ChartPoint#
   */
  clear(): void {
    delete this.x;
    delete this.y;
    delete this.date;
    delete this.value;
    delete this.record;
  }

  /**
   * Returns point's X coordinate using a given projection.
   * @method getX
   * @param {StockChartX.Projection} projection The projection.
   * @returns {Number} The X coordinate.
   * @memberOf StockChartX.ChartPoint#
   * @see [getDate]{@linkcode StockChartX.ChartPoint#getDate}
   * @see [getRecord]{@linkcode StockChartX.ChartPoint#getRecord}
   * @see [getY]{@linkcode StockChartX.ChartPoint#getY}
   * @see [toPoint]{@linkcode StockChartX.ChartPoint#toPoint}
   * @example
   *  var x = point.getX(projection);
   */
  getX(projection: Projection): number {
    if (this.x != null) return this.x;
    if (this.date != null) return projection.xByDate(this.date);
    if (this.record != null) return projection.xByRecord(this.record, false);

    return null;
  }

  /**
   * Returns point's date coordinate using a given projection.
   * @method getDate
   * @param {StockChartX.Projection} projection The projection.
   * @returns {Date} The date.
   * @memberOf StockChartX.ChartPoint#
   * @see [getX]{@linkcode StockChartX.ChartPoint#getX}
   * @see [getRecord]{@linkcode StockChartX.ChartPoint#getRecord}
   * @see [getY]{@linkcode StockChartX.ChartPoint#getY}
   * @see [toPoint]{@linkcode StockChartX.ChartPoint#toPoint}
   * @example
   *  var date = point.getDate(projection);
   */
  getDate(projection: Projection): Date {
    if (this.x != null) return projection.dateByX(this.x);
    if (this.date != null) return this.date;
    if (this.record != null)
      return projection.dateByX(projection.xByRecord(this.record, false));

    return null;
  }

  /**
   * Returns point's record coordinate using a given projection.
   * @method getRecord
   * @param {StockChartX.Projection} projection The projection.
   * @returns {Number} The record.
   * @memberOf StockChartX.ChartPoint#
   * @see [getX]{@linkcode StockChartX.ChartPoint#getX}
   * @see [getY]{@linkcode StockChartX.ChartPoint#getY}
   * @see [toPoint]{@linkcode StockChartX.ChartPoint#toPoint}
   * @example
   *  var record = point.getRecord(projection);
   */
  getRecord(projection: Projection): number {
    if (this.x != null) return projection.recordByX(this.x, false);
    if (this.date != null)
      return projection.recordByX(projection.xByDate(this.date, false), false);
    if (this.record != null) return this.record;

    return null;
  }

  /**
   * Returns point's Y coordinate using a given projection.
   * @method getY
   * @param {StockChartX.Projection} projection The projection.
   * @returns {Number} The Y coordinate.
   * @memberOf StockChartX.ChartPoint#
   * @see [getX]{@linkcode StockChartX.ChartPoint#getX}
   * @see [getDate]{@linkcode StockChartX.ChartPoint#getDate}
   * @see [getRecord]{@linkcode StockChartX.ChartPoint#getRecord}
   * @see [toPoint]{@linkcode StockChartX.ChartPoint#toPoint}
   * @example
   *  var y = point.getY(projection);
   */
  getY(projection: Projection): number {
    if (this.y != null) return this.y;
    if (this.value != null) return projection.yByValue(this.value);

    return null;
  }

  /**
   * Returns point's value using a given projection.
   * @method getValue
   * @param {StockChartX.Projection} projection The projection.
   * @returns {Number} The value.
   * @memberOf StockChartX.ChartPoint#
   * @see [getY]{@linkcode StockChartX.ChartPoint#getY}
   * @see [getX]{@linkcode StockChartX.ChartPoint#getX}
   * @see [getDate]{@linkcode StockChartX.ChartPoint#getDate}
   * @see [getRecord]{@linkcode StockChartX.ChartPoint#getRecord}
   * @see [toPoint]{@linkcode StockChartX.ChartPoint#toPoint}
   * @example
   *  var value = point.getValue(projection);
   */
  getValue(projection: Projection): number {
    if (this.value != null) return this.value;

    if (this.y != null) return projection.valueByY(this.y);

    return null;
  }

  /**
   * Converts chart point to cartesian point.
   * @method toPoint
   * @param {StockChartX.Projection} projection The projection.
   * @returns {StockChartX~Point} The cartesian point.
   * @memberOf StockChartX.ChartPoint#
   * @example
   *  var p = point.toPoint(projection);
   *  console.log("x: " + p.x + ", y: " + p.y);
   */
  toPoint(projection: Projection): IPoint {
    return {
      x: this.getX(projection),
      y: this.getY(projection)
    };
  }

  /**
   * Moves chart point to a given point.
   * @method moveTo
   * @param {Number} x The X coordinate.
   * @param {Number} y The Y coordinate.
   * @param {StockChartX.Projection} projection The projection.
   * @returns {StockChartX.ChartPoint} Returns self.
   * @memberOf StockChartX.ChartPoint#
   * @see [translate]{@linkcode StockChartX.ChartPoint#translate}
   * @example
   *  point.moveTo(10, 20, projection);
   */
  moveTo(x: number, y: number, projection: Projection): ChartPoint {
    return this.moveToX(x, projection).moveToY(y, projection);
  }

  /**
   * Moves chart point to a given point.
   * @method moveToPoint
   * @param {StockChartX~Point} point The destination point.
   * @param {StockChartX.Projection} projection The projection.
   * @returns {StockChartX.ChartPoint} Returns self.
   * @memberOf StockChartX.ChartPoint#
   * @example
   *  point.moveToPoint({x: 10, y: 20}, projection);
   */
  moveToPoint(point: IPoint, projection: Projection): ChartPoint {
    return this.moveTo(point.x, point.y, projection);
  }

  /**
   * Moves chart point to a point with a given X coordinate.
   * @method moveToX
   * @param {Number} x The X coordinate.
   * @param {StockChartX.Projection} projection The projection.
   * @returns {StockChartX.ChartPoint} Returns self.
   * @memberOf StockChartX.ChartPoint#
   * @example
   *  point.moveToX(10, projection);
   */
  moveToX(x: number, projection: Projection): ChartPoint {
    if (this.x != null) {
      this.x = x;
    } else if (this.date != null) {
      this.date = x != null ? projection.dateByX(x) : null;
    } else if (this.record != null) {
      this.record = x != null ? projection.recordByX(x, false) : null;
    }

    return this;
  }

  /**
   * Moves chart point to a point with a given Y coordinate.
   * @method moveToY
   * @param {Number} y The Y coordinate.
   * @param {StockChartX.Projection} projection The projection.
   * @returns {StockChartX.ChartPoint} Returns self.
   * @memberOf StockChartX.ChartPoint#
   * @example
   *  point.moveToY(20, projection);
   */
  moveToY(y: number, projection: Projection): ChartPoint {
    if (this.y != null) {
      this.y = y;
    } else if (this.value != null) {
      this.value = y != null ? projection.valueByY(y) : null;
    }

    return this;
  }

  /**
   * Translates chart point onto a given X, Y offsets.
   * @method translate
   * @param {Number} dx The X offset.
   * @param {Number} dy The Y offset.
   * @param {StockChartX.Projection} projection The projection.
   * @returns {StockChartX.ChartPoint} Returns self.
   * @memberOf StockChartX.ChartPoint#
   * @see [moveTo]{@linkcode StockChartX.ChartPoint#moveTo}
   * @example
   *  point.translate(10, 20, projection);
   */
  translate(dx: number, dy: number, projection: Projection): ChartPoint {
    let x = this.getX(projection),
      y = this.getY(projection),
      newX = x != null ? x + dx : null,
      newY = y != null ? y + dy : null;

    return this.moveTo(newX, newY, projection);
  }

  // region ICloneable members

  /**
   * Clones chart point.
   * @method clone
   * @returns {StockChartX.ChartPoint} The cloned chart point.
   * @memberOf StockChartX.ChartPoint#
   */
  clone(): ChartPoint {
    return new ChartPoint(this);
  }

  // endregion
}
