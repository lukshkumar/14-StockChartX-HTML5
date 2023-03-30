/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { JsUtil } from "../../index";
import { TimeSpan } from "../../index";
import {
  IDateTimeFormatState,
  DateTimeFormat
} from "../../index";
"use strict";

// region Interfaces

export interface ITimeIntervalDateTimeFormatState extends IDateTimeFormatState {
  timeInterval: number;
}

// endregion

export const DateTimeFormatName = {
  YEAR_MONTH: "year-month",
  MONTH_DAY: "month-day",
  DATE: "date",
  SHORT_DATE_TIME: "short_date_time",
  LONG_DATE_TIME: "long_date_time",
  SHORT_TIME: "short_time",
  LONG_TIME: "long_time"
};

/**
 * Represents date time formatter which formats dates in different ways
 * depending on specified time interval.
 * @constructor StockChartX.TimeIntervalDateTimeFormat
 * @augments StockChartX.DateTimeFormat
 * @memberOf StockChartX
 */
export class TimeIntervalDateTimeFormat extends DateTimeFormat {
  static get className(): string {
    return "StockChartX.TimeIntervalDateTimeFormat";
  }

  /**
   * @internal
   */
  private _formatters: object = {};

  // region Properties

  /**
   * @internal
   */
  private _timeInterval: number;
  /**
   * The time interval in milliseconds.
   * @name timeInterval
   * @type {number}
   * @memberOf StockChartX.TimeIntervalDateTimeFormat#
   */
  get timeInterval(): number {
    return this._timeInterval;
  }

  set timeInterval(value: number) {
    if (!JsUtil.isPositiveNumber(value))
      throw new Error("Time interval must be a positive number.");

    this._timeInterval = value;
  }

  // endregion

  constructor(timeInterval?: number) {
    super();

    this._timeInterval = timeInterval;
  }

  // region Property changed handlers

  /**
   * @internal
   */
  protected _onLocaleChanged() {
    this._clearFormatters();
  }

  // endregion

  // region Formatting

  /**
   * @internal
   */
  private _clearFormatters() {
    this._formatters = {};
  }

  /**
   * @internal
   */
  private _createFormatter(
    options: Intl.DateTimeFormatOptions
  ): Intl.DateTimeFormat {
    let locale = this.locale || "en";

    return <Intl.DateTimeFormat>(
      (<any>(
        new IntlPolyfill.DateTimeFormat(locale, <
          IntlPolyfill.DateTimeFormatOptions
        >options)
      ))
    );
  }

  /**
   * @inheritDoc
   */
  format(date: Date): string {
    let timeInterval = this._timeInterval;

    // Year periodicity
    if (timeInterval >= TimeSpan.MILLISECONDS_IN_YEAR) {
      return date.getFullYear().toString();
    }

    let formatName = DateTimeFormatName;

    // Month periodicity
    if (timeInterval >= TimeSpan.MILLISECONDS_IN_MONTH) {
      // can be changed to something like "Jan 2014"
      return this.formatter(formatName.YEAR_MONTH).format(date);
    }

    // Day/Week periodicity
    if (timeInterval >= TimeSpan.MILLISECONDS_IN_DAY) {
      // can be changed to something like "Jan 1, 2014"
      return this.formatter(formatName.DATE).format(date);
    }

    // Minute/Hour periodicity
    if (timeInterval >= TimeSpan.MILLISECONDS_IN_MINUTE) {
      // can be changed to something like "Jan 1, 2014 10:00"
      return this.formatter(formatName.SHORT_DATE_TIME).format(date);
    }

    // Second periodicity
    if (timeInterval >= TimeSpan.MILLISECONDS_IN_SECOND) {
      // can be changed to something like "Jan 1, 2014 10:00:00"
      return this.formatter(formatName.SHORT_DATE_TIME).format(date);
    }

    // Millisecond periodicity
    // can be changed to something like "Jan 1, 2014 10:00:00.000"
    return this.formatter(formatName.LONG_DATE_TIME).format(date);
  }

  /**
   * Formats specified date using formatter with a given name.
   * @method formatWithFormatter
   * @param {Date} date The date.
   * @param {string} formatName The formatter name to be used. See {@linkcode StockChartX.DateTimeFormatName}.
   * @returns {string}
   * @memberOf StockChartX.TimeIntervalDateTimeFormat#
   */
  formatWithFormatter(date: Date, formatName: string): string {
    return this.formatter(formatName).format(date);
  }

  formatter(name: string): Intl.DateTimeFormat {
    let formatter = this._formatters[name];
    if (formatter) return formatter;

    let formatName = DateTimeFormatName;
    switch (name) {
      case formatName.YEAR_MONTH:
        formatter = this._createFormatter({
          year: "numeric",
          month: "short"
        });
        break;
      case formatName.MONTH_DAY:
        formatter = this._createFormatter({
          month: "short",
          day: "2-digit"
        });
        break;
      case formatName.DATE:
        formatter = this._createFormatter({
          year: "numeric",
          month: "short",
          day: "2-digit"
        });
        break;
      case formatName.SHORT_DATE_TIME:
        formatter = this._createFormatter({
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          hour12: false,
          minute: "2-digit"
        });
        break;
      case formatName.LONG_DATE_TIME:
        formatter = this._createFormatter({
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          hour12: false,
          minute: "2-digit",
          second: "2-digit"
        });
        break;
      case formatName.SHORT_TIME:
        formatter = this._createFormatter({
          hour: "2-digit",
          hour12: false,
          minute: "2-digit"
        });
        break;
      case formatName.LONG_TIME:
        formatter = this._createFormatter({
          hour: "2-digit",
          hour12: false,
          minute: "2-digit",
          second: "2-digit"
        });
        break;
      default:
        throw new Error(`Unknown formatter name: ${name}`);
    }

    this._formatters[name] = formatter;

    return formatter;
  }

  // endregion

  // region IStateProvider members

  /**
   * @inheritDoc
   */
  saveState(): ITimeIntervalDateTimeFormatState {
    let state = <ITimeIntervalDateTimeFormatState>super.saveState();
    state.timeInterval = this.timeInterval;

    return state;
  }

  /**
   * @inheritDoc
   */
  loadState(state: ITimeIntervalDateTimeFormatState) {
    super.loadState(state);

    this._timeInterval = state && state.timeInterval;
  }

  // endregion
}

DateTimeFormat.register(TimeIntervalDateTimeFormat);
