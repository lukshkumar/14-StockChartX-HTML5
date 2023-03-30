/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { JsUtil } from "../../index";
import {
  IDateTimeFormatState,
  DateTimeFormat
} from "../../index";
import { CustomDateTimeFormat } from "../../index";
import { TimeSpan } from "../../index";
"use strict";

// region Interfaces

export interface ICustomTimeIntervalDateTimeFormatState
  extends IDateTimeFormatState {
  timeInterval: number;
}

// endregion

/**
 * Represents date time formatter which formats dates in different ways
 * depending on specified time interval.
 * @constructor StockChartX.CustomTimeIntervalDateTimeFormat
 * @augments StockChartX.DateTimeFormat
 * @memberOf StockChartX
 */
export class CustomTimeIntervalDateTimeFormat extends DateTimeFormat {
  static get className(): string {
    return "StockChartX.CustomTimeIntervalDateTimeFormat";
  }

  // region Properties

  /**
   * @internal
   */
  private _timeInterval: number;
  /**
   * The time interval in milliseconds.
   * @name timeInterval
   * @type {number}
   * @memberOf StockChartX.CustomTimeIntervalDateTimeFormat#
   */
  get timeInterval(): number {
    return this._timeInterval;
  }

  set timeInterval(value: number) {
    if (!JsUtil.isPositiveNumber(value))
      throw new Error("Time interval must be a positive number.");

    this._timeInterval = value;
  }

  /**
   * @internal
   */
  private _formatter = new CustomDateTimeFormat();

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
    this._formatter.locale = this.locale || "en";
  }

  // endregion

  // region Formatting

  /**
   * @inheritDoc
   */
  format(date: Date): string {
    this._formatter.formatString = this._findFormat();

    return this._formatter.format(date);
  }

  /**
   * @internal
   */
  private _findFormat() {
    let timeInterval = this._timeInterval;

    // Year periodicity
    if (timeInterval >= TimeSpan.MILLISECONDS_IN_YEAR) {
      return "YYYY";
    }

    // Month periodicity
    if (timeInterval >= TimeSpan.MILLISECONDS_IN_MONTH) {
      // can be changed to something like "Jan 2014"
      return "MMM YYYY";
    }

    // Day/Week periodicity
    if (timeInterval >= TimeSpan.MILLISECONDS_IN_DAY) {
      // can be changed to something like "Jan 1, 2014"
      return "D MMM YYYY";
    }

    // Minute/Hour periodicity
    if (timeInterval >= TimeSpan.MILLISECONDS_IN_MINUTE) {
      // can be changed to something like "Jan 1, 2014 10:00"
      return "D MMM YYYY HH:mm";
    }

    // Second periodicity
    if (timeInterval >= TimeSpan.MILLISECONDS_IN_SECOND) {
      // can be changed to something like "Jan 1, 2014 10:00:00"
      return "D MMM YYYY HH:mm:ss";
    }

    // Millisecond periodicity
    // can be changed to something like "Jan 1, 2014 10:00:00.000"
    return "D MMM YYYY HH:mm:ss.SSS";
  }

  // endregion

  // region IStateProvider members

  /**
   * @inheritDoc
   */
  saveState(): ICustomTimeIntervalDateTimeFormatState {
    let state = <ICustomTimeIntervalDateTimeFormatState>super.saveState();
    state.timeInterval = this.timeInterval;

    return state;
  }

  /**
   * @inheritDoc
   */
  loadState(state: ICustomTimeIntervalDateTimeFormatState) {
    super.loadState(state);

    this._timeInterval = state && state.timeInterval;
  }

  // endregion
}

DateTimeFormat.register(CustomTimeIntervalDateTimeFormat);
