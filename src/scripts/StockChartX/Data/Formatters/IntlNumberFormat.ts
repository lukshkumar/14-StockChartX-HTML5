/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import {
  INumberFormatState,
  NumberFormat
} from "../../index";
import { JsUtil } from "../../index";
"use strict";

// region Interfaces

export interface IIntlNumberFormatState extends INumberFormatState {
  options: Intl.NumberFormatOptions;
}

// endregion

/**
 * Represents language sensitive number formatter based on Intl.NumberFormat
 * ({@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat})
 * @param {string} [locale='en'] The locale.
 * @param {Intl.NumberFormatOptions} [options] The format options.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat}
 * @constructor StockChartX.IntlNumberFormat
 * @augments StockChartX.NumberFormat
 * @example
 * var options = {
 *  minimumFractionDigits: 4,
 *  maximumFractionDigits: 4
 * };
 * var format = new StockChartX.IntlNumberFormat(options);
 */
export class IntlNumberFormat extends NumberFormat {
  static get className(): string {
    return "StockChartX.IntlNumberFormat";
  }

  /**
   * @internal
   */
  private _numberFormat: Intl.NumberFormat;

  // region Properties

  /**
   * Gets/Sets format options ({@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat})
   * @name options
   * @type {Intl.ResolvedNumberFormatOptions}
   * @memberOf StockChartX.IntlNumberFormat#
   */
  get options(): Intl.ResolvedNumberFormatOptions {
    return this._numberFormat.resolvedOptions();
  }

  set options(value: Intl.ResolvedNumberFormatOptions) {
    this._createFormat(value);
  }

  // endregion

  constructor(locale?: string, options?: Intl.NumberFormatOptions) {
    super(locale);

    this._createFormat(options);
  }

  // region Property changed handlers

  /**
   * @internal
   */
  protected _onLocaleChanged() {
    this._createFormat();
  }

  // endregion

  // region Formatting

  /**
   * @internal
   */
  private _createFormat(options?: Intl.NumberFormatOptions) {
    let locale = this.locale || "en";

    if (!options) {
      options = this._numberFormat && this._numberFormat.resolvedOptions();
    }
    this._numberFormat = new Intl.NumberFormat(locale, options || undefined);
  }

  /**
   * @inheritDoc
   */
  format(value: number): string {
    return this._numberFormat.format(value);
  }

  /**
   * Sets number of decimal digits to display.
   * @method setDecimalDigits
   * @param {number} value Number of decimal digits.
   * @memberOf StockChartX.IntlNumberFormat#
   */
  setDecimalDigits(value: number) {
    if (JsUtil.isNegativeNumber(value))
      throw new Error("Value must be greater or equal to zero.");

    let options = this._numberFormat.resolvedOptions();

    options.minimumFractionDigits = options.maximumFractionDigits = value;
    this._createFormat(options);
  }

  // endregion

  // region IStateProvider members

  /**
   * @inheritDoc
   */
  saveState(): IIntlNumberFormatState {
    let state = <IIntlNumberFormatState>super.saveState();
    state.options = JsUtil.clone(this.options);

    return state;
  }

  /**
   * @inheritDoc
   */
  loadState(state: IIntlNumberFormatState) {
    super.loadState(state);

    this._createFormat(state && state.options);
  }

  // endregion
}

NumberFormat.register(IntlNumberFormat);
