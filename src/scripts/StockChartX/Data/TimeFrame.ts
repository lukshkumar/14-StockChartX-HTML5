/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { JsUtil } from "../index";
"use strict";

// region Declarations

/**
 * Time span values.
 * @readonly
 * @enum {number}
 * @memberOf StockChartX
 */
export const TimeSpan = {
  /** Number of milliseconds in year. */
  MILLISECONDS_IN_YEAR: 31556926000,

  /** number of milliseconds in month. */
  MILLISECONDS_IN_MONTH: 2629743830,

  /** Number of milliseconds in week. */
  MILLISECONDS_IN_WEEK: 604800000,

  /** Number of milliseconds in day. */
  MILLISECONDS_IN_DAY: 86400000,

  /**  Number of milliseconds in hour. */
  MILLISECONDS_IN_HOUR: 3600000,

  /** Number of milliseconds in minute. */
  MILLISECONDS_IN_MINUTE: 60000,

  /** Number of milliseconds in second. */
  MILLISECONDS_IN_SECOND: 1000
};
Object.freeze(TimeSpan);

/**
 * Periodicity values.
 * @readonly
 * @enum {string}
 * @memberOf StockChartX
 */
export const Periodicity = {
  /** Tick. */
  TICK: "t",

  /** Second. */
  SECOND: "s",

  /** Minute. */
  MINUTE: "",

  /** Hour. */
  HOUR: "h",

  /** Day. */
  DAY: "d",

  /** Week. */
  WEEK: "w",

  /** Month. */
  MONTH: "m",

  /** Year. */
  YEAR: "y"
};
Object.freeze(Periodicity);

// endregion

// region Interfaces

export interface ITimeFrame {
  interval: number;
  periodicity: string;
}

// #endregion

/**
 * Describes time frame object.
 * @param {Number} [interval = 1]  Time frame interval.
 * @param {String} [periodicity]   Time frame periodicity. See StockChartX.Periodicity enum
 * @constructor StockChartX.TimeFrame
 */
export class TimeFrame implements ITimeFrame {
  public interval: number;
  public periodicity: string;

  constructor(periodicity?: string, interval?: number) {
    this.periodicity = periodicity || Periodicity.MINUTE;
    this.interval = JsUtil.isFiniteNumber(interval) ? interval : 1;
  }

  public toString(): string {
    return `${this.interval} ${TimeFrame.periodicityToString(
      this.periodicity
    )}`;
  }

  public static periodicityToString(periodicity: string): string {
    switch (periodicity) {
      case Periodicity.TICK:
        return "tick";
      case Periodicity.SECOND:
        return "second";
      case Periodicity.MINUTE:
        return "minute";
      case Periodicity.HOUR:
        return "hour";
      case Periodicity.DAY:
        return "day";
      case Periodicity.WEEK:
        return "week";
      case Periodicity.MONTH:
        return "month";
      case Periodicity.YEAR:
        return "year";
      default:
        throw new Error(`Unsupported periodicity: ${periodicity}`);
    }
  }
  public static periodicityToShortString(periodicity: string): string {
    switch (periodicity) {
      case Periodicity.TICK:
        return "tick";
      case Periodicity.SECOND:
        return "sec";
      case Periodicity.MINUTE:
        return "min";
      case Periodicity.HOUR:
        return "hr";
      case Periodicity.DAY:
        return "day";
      case Periodicity.WEEK:
        return "wk";
      case Periodicity.MONTH:
        return "mo";
      case Periodicity.YEAR:
        return "yr";
      default:
        throw new Error(`Unsupported periodicity: ${periodicity}`);
    }
  }
  public static timeFrameToTimeInterval(timeFrame: ITimeFrame) {
    switch (timeFrame.periodicity) {
      case Periodicity.TICK:
        return timeFrame.interval;
      case Periodicity.SECOND:
        return timeFrame.interval * TimeSpan.MILLISECONDS_IN_SECOND;
      case Periodicity.MINUTE:
        return timeFrame.interval * TimeSpan.MILLISECONDS_IN_MINUTE;
      case Periodicity.HOUR:
        return timeFrame.interval * TimeSpan.MILLISECONDS_IN_HOUR;
      case Periodicity.DAY:
        return timeFrame.interval * TimeSpan.MILLISECONDS_IN_DAY;
      case Periodicity.WEEK:
        return timeFrame.interval * TimeSpan.MILLISECONDS_IN_WEEK;
      case Periodicity.MONTH:
        return timeFrame.interval * TimeSpan.MILLISECONDS_IN_MONTH;
      case Periodicity.YEAR:
        return timeFrame.interval * TimeSpan.MILLISECONDS_IN_YEAR;
      default:
        return 0;
    }
  }
  public static timeIntervalToTimeFrame(timeInterval: number): TimeFrame {
    if (timeInterval >= TimeSpan.MILLISECONDS_IN_YEAR) {
      return new TimeFrame(
        Periodicity.YEAR,
        timeInterval / TimeSpan.MILLISECONDS_IN_YEAR
      );
    }
    if (timeInterval >= TimeSpan.MILLISECONDS_IN_MONTH) {
      return new TimeFrame(
        Periodicity.MONTH,
        timeInterval / TimeSpan.MILLISECONDS_IN_MONTH
      );
    }
    if (
      timeInterval >= TimeSpan.MILLISECONDS_IN_WEEK &&
      timeInterval % TimeSpan.MILLISECONDS_IN_WEEK === 0
    ) {
      return new TimeFrame(
        Periodicity.WEEK,
        timeInterval / TimeSpan.MILLISECONDS_IN_WEEK
      );
    }
    if (timeInterval >= TimeSpan.MILLISECONDS_IN_DAY) {
      return new TimeFrame(
        Periodicity.DAY,
        timeInterval / TimeSpan.MILLISECONDS_IN_DAY
      );
    }
    if (timeInterval >= TimeSpan.MILLISECONDS_IN_HOUR) {
      return new TimeFrame(
        Periodicity.HOUR,
        timeInterval / TimeSpan.MILLISECONDS_IN_HOUR
      );
    }
    if (timeInterval >= TimeSpan.MILLISECONDS_IN_MINUTE) {
      return new TimeFrame(
        Periodicity.MINUTE,
        timeInterval / TimeSpan.MILLISECONDS_IN_MINUTE
      );
    }
    if (timeInterval >= TimeSpan.MILLISECONDS_IN_SECOND) {
      return new TimeFrame(
        Periodicity.SECOND,
        timeInterval / TimeSpan.MILLISECONDS_IN_SECOND
      );
    }

    throw new Error(`Unsupported time interval: ${timeInterval}`);
  }
}
