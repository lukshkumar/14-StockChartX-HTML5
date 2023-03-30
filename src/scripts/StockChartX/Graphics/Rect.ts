import { IPoint } from "../index";
import { ICloneable } from "../index";

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
 * The rect structure.
 * @typedef {} StockChartX~Rect
 * @type {Object}
 * @property {number} left The left rectangle coordinate.
 * @property {number} top The top rectangle coordinate.
 * @property {number} right The right rectangle coordinate.
 * @property {number} bottom The bottom rectangle coordinate.
 * @memberOf StockChartX
 */

/**
 * The size structure.
 * @typedef {} StockChartX~Size
 * @type {Object}
 * @property {number} width The width.
 * @property {number} height The height.
 * @memberOf StockChartX
 * @example
 * var size = {
 *  width: 10,
 *  height: 20
 * };
 */

/**
 * The padding values structure.
 * @typedef {} StockChartX~Padding
 * @type {Object}
 * @property {number} left The left padding.
 * @property {number} top The top padding.
 * @property {number} right The right padding.
 * @property {number} bottom The bottom padding.
 * @memberOf StockChartX
 * @example
 *  var padding = {
 *      left: 5,
 *      top: 5,
 *      right: 10,
 *      bottom: 10
 *  };
 */

// endregion

"use strict";

// region Interfaces

export interface IRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface IPadding {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface ISize {
  width: number;
  height: number;
}

// endregion

/**
 * Describes rectangle structure.
 * @param {StockChartX.Rect | StockChartX~Rect} [rect] The source rectangle object to copy values from.
 * @constructor StockChartX.Rect
 * @example Create empty rectangle
 *
 * var rect = new StockChartX.Rect();
 * @example Create rectangle at (10, 10) top left point and size (20, 20).
 *
 * var rect = new StockChartX.Rect({
 *      left: 10,
 *      top: 10,
 *      width: 20,
 *      height: 20
 * );
 */
export class Rect implements IRect, ICloneable<Rect> {
  // region Properties

  /**
   * The X coordinate of top left point.
   * @name left
   * @type {Number}
   * @memberOf StockChartX.Rect#
   */
  public left: number = 0;

  /**
   * The Y coordinate of top left point.
   * @name top
   * @type {Number}
   * @memberOf StockChartX.Rect#
   */
  public top: number = 0;

  /**
   * The width of rectangle.
   * @name width
   * @type {Number}
   * @memberOf StockChartX.Rect#
   */
  public width: number = 0;

  /**
   * The height of rectangle.
   * @name height
   * @type {Number}
   * @memberOf StockChartX.Rect#
   */
  public height: number = 0;

  /**
   * The bottom Y coordinate.
   * @name bottom
   * @type {number}
   * @memberOf StockChartX.Rect#
   * @readonly
   */
  get bottom(): number {
    return this.top + this.height;
  }

  /**
   * The right X coordinate.
   * @name right
   * @type {number}
   * @memberOf StockChartX.Rect#
   * @readonly
   */
  get right(): number {
    return this.left + this.width;
  }

  // endregion

  constructor(rect?: IRect) {
    rect = rect || <IRect>{};

    this.left = rect.left || 0;
    this.top = rect.top || 0;
    this.width = rect.width || 0;
    this.height = rect.height || 0;
  }

  // region ICloneable members

  /**
   * Clones rectangle object.
   * @method clone
   * @returns {StockChartX.Rect}
   * @memberOf StockChartX.Rect#
   */
  clone(): Rect {
    return new Rect(this);
  }

  // endregion

  /**
   * Determines whether rectangle equals to a given rectangle. Both rectangles are equal if their properties are equal.
   * @method equals
   * @param {StockChartX.Rect | StockChartX~Rect} rect The rectangle to compare.
   * @returns {boolean}
   * @memberOf StockChartX.Rect#
   * @example
   *
   * var rect1 = new StockChartX.Rect({
   *      left: 10,
   *      top: 10,
   *      width: 20,
   *      height: 20
   * );
   * var rect2 = {
   *      left: 10,
   *      top: 10,
   *      width: 10,
   *      height: 10
   * };
   * var result = rect1.equals(rect2); // returns true.
   */
  equals(rect: IRect): boolean {
    return (
      rect &&
      this.left === rect.left &&
      this.top === rect.top &&
      this.width === rect.width &&
      this.height === rect.height
    );
  }

  /**
   * Returns string representation of the rectangle object.
   * @method toString
   * @returns {string}
   * @memberOf StockChartX.Rect#
   */
  toString(): string {
    return `[left: ${this.left}, top: ${this.top}, width: ${
      this.width
    }, height: ${this.height}]`;
  }

  /**
   * Determines whether rectangle contains a point described by (X, Y) coordinates.
   * @method containsPoint
   * @param {StockChartX~Point} point The (X, Y) point.
   * @returns {boolean} True if rectangles are equal, false otherwise.
   * @memberOf StockChartX.Rect#
   * @example
   *  var rect = new StockChartX.Rect({
   *      left: 10,
   *      top: 10,
   *      width: 20,
   *      height: 20
   *  });
   *  var result = rect.containsPoint({x: 15, y: 15}); // returns true.
   */
  containsPoint(point: IPoint): boolean {
    return (
      point.x >= this.left &&
      point.x <= this.right &&
      point.y >= this.top &&
      point.y <= this.bottom
    );
  }

  // region Cropping

  cropLeft(rect: Rect): void {
    let rectRight = rect.right;

    if (this.left < rectRight) {
      this.width = this.right - rectRight;
      this.left = rectRight;
    }
  }

  cropRight(rect: Rect): void {
    if (this.right >= rect.left) {
      this.width = rect.left - 1 - this.left;
    }
  }

  cropTop(rect: Rect): void {
    let rectBottom = rect.bottom;
    if (this.top < rectBottom) {
      this.height = this.bottom - rectBottom;
      this.top = rectBottom;
    }
  }

  cropBottom(rect: Rect): void {
    if (this.bottom > rect.top) {
      this.height = rect.top - this.top;
    }
  }

  // endregion

  /**
   * Copies properties from a given rectangle.
   * @method copyFrom
   * @param {StockChartX.Rect | StockChartX~Rect} rect The source rectangle to copy properties from.
   * @memberOf StockChartX.Rect#
   */
  copyFrom(rect: IRect): void {
    this.left = rect.left;
    this.top = rect.top;
    this.width = rect.width;
    this.height = rect.height;
  }

  /**
   * Applies padding to the rectangle.
   * @method applyPadding
   * @param {StockChartX~Padding} padding The padding.
   * @memberOf StockChartX.Rect#
   */
  applyPadding(padding: IPadding): void {
    if (padding.left) {
      this.left += padding.left;
      this.width -= padding.left;
    }
    if (padding.top) {
      this.top += padding.top;
      this.height -= padding.top;
    }
    if (padding.right) this.width -= padding.right;
    if (padding.bottom) this.height -= padding.bottom;
  }
}
