/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

/* tslint:disable:interface-name */
/**
 * @internal
 */
declare global {
  interface Math {
    roundToDecimals(value: number, decimals: number): number;
    round(value: string): number;
    trunc(value: number): number;
  }
}
/* tslint:enable:interface-name */

/**
 * The string padding options
 * @typedef {} StringPaddingOptions
 * @type {object}
 * @property {number} width The number of characters in the resulting string
 * (equal to the number of original characters plus any additional padding characters).
 * @property {boolean} alignLeft If true then characters are left aligned, otherwise characters are right aligned.
 * @property {char} padding The padding character.
 * @memberOf StockChartX
 */

export type IAction = () => void;
export type IAction1<T> = (arg: T) => void;

export interface IStringPaddingOptions {
  width: number;
  alignLeft: boolean;
  padding: number;
}
"use strict";

export class JsUtil {
  /**
   * Checks if a given value is a number.
   * @method isNumber
   * @param {*} value The value to check.
   * @returns {boolean} True if a given value is a number, false otherwise.
   * @memberOf StockChartX.JsUtil
   */
  static isNumber(value: any): boolean {
    return typeof value === "number";
  }

  /**
   * Checks if a given value is a finite number.
   * @method isFiniteNumber
   * @param {*} value The value to check.
   * @returns {boolean} True if a given value is a finite number, false, otherwise.
   * @memberOf StockChartX.JsUtil
   */
  static isFiniteNumber(value: any): boolean {
    return this.isNumber(value) && isFinite(value);
  }

  /**
   * Checks if a given value is a finite number or NaN.
   * @method isFiniteNumberOrNaN
   * @param {*} value The value to check.
   * @returns {boolean} True if a given value is a finite number or NaN, false otherwise.
   * @memberOf StockChartX.JsUtil
   */
  static isFiniteNumberOrNaN(value: any): boolean {
    return this.isNumber(value) && (isFinite(value) || isNaN(value));
  }

  static isPositiveNumber(value: any): boolean {
    return this.isFiniteNumber(value) && value > 0;
  }

  static isNegativeNumber(value: any): boolean {
    return this.isFiniteNumber(value) && value < 0;
  }

  /**
   * Checks if a given value is a positive number or NaN.
   * @method isPositiveNumberOrNaN
   * @param {*} value The value to check.
   * @returns {boolean} True if a given value is a positive number or NaN.
   * @memberOf StockChartX.JsUtil
   */
  static isPositiveNumberOrNaN(value: any): boolean {
    return (
      this.isNumber(value) && (isNaN(value) || (value > 0 && isFinite(value)))
    );
  }

  /**
   * Checks if a given value is a function.
   * @method isFunction
   * @param {*} value The value to check.
   * @returns {boolean} True if a given value is a function, false otherwise.
   * @memberOf StockChartX.JsUtil
   */
  static isFunction(value: any): boolean {
    return !!(value && value.constructor && value.call && value.apply);
  }

  static shallowClone<T extends object>(obj: T): T {
    return window.jQuery.extend(true, {}, obj);
  }

  static clone<T extends object>(obj: T): T {
    let result = window.jQuery.extend(true, {}, obj);
    for (let prop in result) {
      if (!result.hasOwnProperty(prop)) continue;

      let arr = result[prop];
      if (!Array.isArray(arr)) continue;

      for (let i = 0, count = arr.length; i < count; i++) {
        if (typeof arr[i] === "object") {
          arr[i] = this.clone(arr[i]);
        }
      }
    }

    return result;
  }

  /**
   * Extends prototype of dst with properties from src.
   * @method extend
   * @param {Object} dst The object to be extended.
   * @param {Object} src The source object to get properties from.
   * @memberOf StockChartX.JsUtil
   */
  static extend(dst: ObjectConstructor, src: ObjectConstructor): void {
    let dstPrototype = dst.prototype;

    let f = () => {};
    f.prototype = src.prototype;
    (<any>dst).prototype = new f();
    dst.prototype.constructor = dst;

    // tslint:disable-next-line:forin
    for (let key in dstPrototype) {
      // noinspection JSUnfilteredForInLoop
      dst.prototype[key] = dstPrototype[key];
    }
  }

  static applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach((baseCtor: any) => {
      Object.getOwnPropertyNames(baseCtor).forEach((name: string) => {
        let descriptor = Object.getOwnPropertyDescriptor(baseCtor, name);

        if (descriptor.enumerable && name !== "constructor") {
          derivedCtor[name] = baseCtor[name];
        }
      });

      Object.getOwnPropertyNames(baseCtor.prototype).forEach((name: string) => {
        if (name !== "constructor") {
          derivedCtor.prototype[name] = baseCtor.prototype[name];
        }
      });
    });
  }

  /**
   * Returns a new string that aligns the characters by padding then with spaces, for the specified total length.
   * @param {string} str The original string.
   * @param {IStringPaddingOptions} options The padding options.
   * @returns {string}
   * @example
   * // Left aligns the string "12" for total width of 5 characters. The result is '12   '.
   * var res = StockChartX.JsUtil.padStr("12", {width: 5, alignLeft: true, padding: ' '});
   *
   * // Right aligns the string "12" for total width of 5 characters. The result is '   12'.
   * var res = StockChartX.JsUtil.padStr("12", {width: 5, alignLeft: false, padding: ' '});
   */
  static padStr(str: string, options: IStringPaddingOptions): string {
    let count = options.width - str.length;
    for (let i = 0; i < count; i++) {
      str = options.alignLeft
        ? `${str}${options.padding}`
        : `${options.padding}${str}`;
    }

    return str;
  }

  /**
   * Filters given text. Strips html injections.
   * @param {string} text The original text
   * @returns {string}
   */
  static filterText(text: string): string {
    return $("<div></div>")
      .text(text)
      .html()
      .trim();
  }

  static flattenArray<T>(array: T[]): T[] {
    return array.reduce((prev: any[], cur: T) => {
      if (Array.isArray(cur)) return prev.concat(this.flattenArray(cur));

      return prev.concat(cur);
    }, []);
  }

  static flattenedArray<T>(
    array: T[] | T[][] | T[][][],
    callback: (item: T) => void
  ) {
    for (let item of array) {
      if (Array.isArray(item)) this.flattenedArray(item, callback);
      else callback(item);
    }
  }

  static sort<T>(array: T[], comparer: (left: T, right: T) => number) {
    let swapped = true;
    let j = 0;
    let len = array.length;

    while (swapped) {
      swapped = false;
      j++;
      for (let i = 0; i < len - j; i++) {
        let left = array[i],
          right = array[i + 1],
          cmpRes = comparer(left, right);

        if (cmpRes > 0) {
          array[i] = right;
          array[i + 1] = left;
          swapped = true;
        }
      }
    }
  }

  static log(value: number): number {
    return Math.log(value);
  }
}
Math.roundToDecimals = (value: number, decimals: number): number =>
  //noinspection JSCheckFunctionSignatures
  Number(
    <string>Math.round(`${value}E${decimals}`).toString() +
      <string>`E-${decimals}`
  );

if (!Math.trunc) {
  //noinspection SpellCheckingInspection
  Math.trunc = (value: number): number =>
    value < 0 ? Math.ceil(value) : Math.floor(value);
}
