/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { IStateProvider } from "../../index";
import { ClassRegistrar, IConstructor } from "../../index";
import { JsUtil } from "../../index";
"use strict";

// region Interfaces

export interface INumberFormat extends IStateProvider<INumberFormatState> {
  locale: string;
  format(value: number): string;
}

export interface INumberFormatState {
  className: string;
  locale: string;
}

// endregion

class NumberFormatRegistrar {
  /**
   * @internal
   */
  private static _registrar = new ClassRegistrar<INumberFormat>();

  /**
   * Gets object with information about registered number formatters. Key is class name and value is formatter constructor.
   * @name registeredFormatters
   * @type {Object}
   * @memberOf StockChartX.NumberFormat
   */
  static get registeredFormatters(): object {
    return this._registrar.registeredItems;
  }

  static register(type: typeof NumberFormat);
  static register(className: string, constructor: IConstructor<INumberFormat>);
  /**
   * Registers new number formatter.
   * @method register
   * @param {string} className The unique class name of the formatter.
   * @param {Function} constructor The constructor.
   * @memberOf StockChartX.NumberFormat
   */
  // noinspection JSCommentMatchesSignature, JSValidateJSDoc
  /**
   * Registers new number formatter.
   * @method register
   * @param {Function} type The constructor.
   * @memberOf StockChartX.NumberFormat
   */
  static register(
    typeOrClassName: string | typeof NumberFormat,
    constructor?: IConstructor<INumberFormat>
  ) {
    if (typeof typeOrClassName === "string")
      this._registrar.register(typeOrClassName, constructor);
    else
      this._registrar.register(typeOrClassName.className, <
        IConstructor<INumberFormat>
      >(<any>typeOrClassName));
  }

  /**
   * Deserializes number formatter.
   * @method deserialize
   * @param {Object} state The formatter's state.
   * @returns {StockChartX.NumberFormat}
   * @memberOf StockChartX.NumberFormat
   */
  static deserialize(state?: INumberFormatState): INumberFormat {
    if (!state) return null;

    let format = this._registrar.createInstance(state.className);
    format.loadState(state);

    return format;
  }
}

/**
 * The abstract base class for number formatters.
 * @constructor StockChartX.NumberFormat
 */
/**
 * Converts specified value into string representation.
 * @method format
 * @param {number} value The value.
 * @returns {string} The string representation of the specified value.
 * @memberOf StockChartX.NumberFormat#
 */
export abstract class NumberFormat implements INumberFormat {
  static get className(): string {
    return "";
  }

  // region NumberFormatRegistrar mixin

  static registeredFormatters: object;
  static register: (
    typeOrClassName: string | typeof NumberFormat,
    constructor?: IConstructor<INumberFormat>
  ) => void;
  static deserialize: (state: INumberFormatState) => INumberFormat;

  // endregion

  // region Properties

  /**
   * @internal
   */
  private _locale: string;
  /**
   * The locale string (e.g. 'en-US').
   * @name locale
   * @type {string}
   * @memberOf StockChartX.NumberFormat#
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

  /**
   * @internal
   */
  protected constructor(locale?: string) {
    this._locale = locale;
  }

  // region Property changed handlers

  /**
   * @internal
   */
  protected _onLocaleChanged?();

  // endregion

  abstract format(value: number): string;

  // region IStateProvider members

  /**
   * Saves formatter state.
   * @method saveState
   * @returns {object} The state.
   * @memberOf StockChartX.NumberFormat#
   * @see [loadState]{@linkCode StockChartX.NumberFormat#loadState}
   */
  saveState(): INumberFormatState {
    return {
      className: (<any>this.constructor).className,
      locale: this.locale
    };
  }

  /**
   * Loads state.
   * @method loadState
   * @param {object} state The state.
   * @memberOf StockChartX.NumberFormat#
   * @see [saveState]{@linkCode StockChartX.NumberFormat#saveState}
   */
  loadState(state?: INumberFormatState) {
    this._locale = state && state.locale;
  }

  // endregion
}

JsUtil.applyMixins(NumberFormat, [NumberFormatRegistrar]);
