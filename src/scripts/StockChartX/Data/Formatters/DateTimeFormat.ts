/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { JsUtil } from "../../index";
import { ClassRegistrar, IConstructor } from "../../index";
import { IStateProvider } from "../../index";

"use strict";

// region Interfaces

export interface IDateTimeFormat extends IStateProvider<IDateTimeFormatState> {
  locale: string;
  timeInterval?: number;
  format(date: Date): string;
}

export interface IDateTimeFormatState {
  className: string;
  locale: string;
}

export interface IDateTimeParts {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
}

// endregion

class DateTimeFormatRegistrar {
  /**
   * @internal
   */
  private static _formatters = new ClassRegistrar<IDateTimeFormat>();

  /**
   * Gets object with information about registered date time formatters. Key is class name and value is formatter constructor.
   * @name registeredFormatters.
   * @type {Object}
   * @memberOf StockChartX.DateTimeFormat
   */
  static get registeredFormatters(): object {
    return this._formatters.registeredItems;
  }

  static register(type: typeof DateTimeFormat);
  static register(
    className: string,
    constructor: IConstructor<IDateTimeFormat>
  );
  /**
   * Registers new date formatter.
   * @method register
   * @param {string} className The unique class name of the formatter.
   * @param {Function} constructor The constructor.
   * @memberOf StockChartX.DateTimeFormat
   */
  //noinspection JSCommentMatchesSignature,JSValidateJSDoc
  /**
   * Registers new date formatter.
   * @method register
   * @param {Function} type The formatter's constructor.
   * @memberOf StockChartX.DateTimeFormat
   */
  static register(
    typeOrClassName: string | typeof DateTimeFormat,
    constructor?: IConstructor<IDateTimeFormat>
  ) {
    if (typeof typeOrClassName === "string")
      this._formatters.register(typeOrClassName, constructor);
    else
      this._formatters.register(typeOrClassName.className, <
        IConstructor<IDateTimeFormat>
      >(<any>typeOrClassName));
  }

  /**
   * Deserializes date formatter.
   * @method deserialize
   * @param {Object} state The formatter's state.
   * @returns {StockChartX.DateTimeFormat}
   * @memberOf StockChartX.DateTimeFormat
   */
  static deserialize(state: IDateTimeFormatState): IDateTimeFormat {
    if (!state) return null;

    let format = this._formatters.createInstance(state.className);
    format.loadState(state);

    return format;
  }
}

/**
 * The abstract date formatter.
 * @constructor StockChartX.DateTimeFormat
 */
/**
 * Converts specified date into string representation.
 * @method format
 * @param {Date} date The date.
 * @returns {string} The string representation of the specified date.
 * @memberOf StockChartX.DateTimeFormat#
 */
export abstract class DateTimeFormat implements IDateTimeFormat {
  static get className(): string {
    return "";
  }

  // region DateTimeFormatRegistrar mixin

  static registeredFormatters: object;
  static register: (
    typeOrClassName: string | typeof DateTimeFormat,
    constructor?: IConstructor<IDateTimeFormat>
  ) => void;
  static deserialize: (state: IDateTimeFormatState) => IDateTimeFormat;

  // endregion

  // region Properties

  /**
   * @internal
   */
  private _locale: string;
  /**
   * The locale string to use.
   * @name locale
   * @type {string}
   * @memberOf StockChartX.DateTimeFormat#
   */
  get locale(): string {
    return this._locale;
  }

  set locale(value: string) {
    if (this._locale !== value) {
      this._locale = value;

      if (this._onLocaleChanged) this._onLocaleChanged();
    }
  }

  // endregion

  // region Property changed handlers

  /**
   * @internal
   */
  protected _onLocaleChanged?();

  // endregion

  abstract format(date: Date): string;

  // region IStateProvider members

  /**
   * Saves formatter state.
   * @method saveState
   * @returns {object} The formatter's state.
   * @memberOf StockChartX.DateTimeFormat#
   * @see [loadState]{@linkCode StockChartX.DateTimeFormat#loadState}
   */
  saveState(): IDateTimeFormatState {
    return {
      className: (<any>this.constructor).className,
      locale: this.locale
    };
  }

  /**
   * Loads state.
   * @method loadState
   * @param {object} state The state.
   * @memberOf StockChartX.DateTimeFormat#
   * @see [saveState]{@linkCode StockChartX.DateTimeFormat#saveState}
   */
  loadState(state: IDateTimeFormatState) {
    this.locale = state.locale;
  }

  // endregion
}

JsUtil.applyMixins(DateTimeFormat, [DateTimeFormatRegistrar]);
