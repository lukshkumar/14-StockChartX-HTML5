/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import {
  IDateTimeFormatState,
  DateTimeFormat
} from "../../index";
"use strict";

const NONE = "none";

// region Interfaces

export interface ICustomDateTimeFormatState extends IDateTimeFormatState {
  formatString: string;
}

// endregion

/**
 * Represents custom date time formatter.
 * @param {string} [format] Custom format string (see {@link http://momentjs.com/docs/#/displaying/} for more details.)
 * @constructor StockChartX.CustomDateTimeFormat
 * @augments StockChartX.DateTimeFormat
 * @memberOf StockChartX
 * @example
 * var formatter = new StockChartX.CustomDateTimeFormat('YYYY-MM-DD');
 */
export class CustomDateTimeFormat extends DateTimeFormat {
  // region Properties

  static get className(): string {
    return "StockChartX.CustomDateTimeFormat";
  }

  /**
   * The format string. See {@link http://momentjs.com/docs/#/displaying/} for more details.
   * @name formatString
   * @type {string}
   * @memberOf StockChartX.CustomDateTimeFormat#
   */
  public formatString: string = null;

  // endregion

  constructor(format?: string) {
    super();

    this.formatString = format;
  }

  /**
   * @inheritDoc
   */
  format(date: Date, format?: string): string {
    format = format || this.formatString;

    if (format === NONE) return "";

    let momentDate = moment(date);
    moment.locale(this.locale);

    return momentDate.format(format);
  }

  // region IStateProvider members

  /**
   * @inheritDoc
   */
  saveState(): ICustomDateTimeFormatState {
    let state = <ICustomDateTimeFormatState>super.saveState();
    state.formatString = this.formatString;

    return state;
  }

  /**
   * @inheritDoc
   */
  loadState(state: ICustomDateTimeFormatState) {
    super.loadState(state);

    this.formatString = state.formatString;
  }

  // endregion
}

DateTimeFormat.register(CustomDateTimeFormat);
