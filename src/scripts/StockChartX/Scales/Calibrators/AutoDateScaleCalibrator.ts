import {
  TimeIntervalDateTimeFormat,
  DateScale,
  TimeSpan,
  DateTimeFormatName,
  DummyCanvasContext,
  DateScaleCalibrator,
  IDateScaleCalibratorConfig,
  IDateScaleCalibratorOptions,
  JsUtil
} from "../../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

// region Interfaces

export interface IAutoDateScaleCalibratorConfig
  extends IDateScaleCalibratorConfig {
  majorTicks?: {
    minOffset?: number;
  };
  minorTicks?: {
    count?: number;
  };
}

interface IAutoDateScaleCalibratorOptions extends IDateScaleCalibratorOptions {
  majorTicks?: {
    minOffset?: number;
  };
  minorTicks?: {
    count?: number;
  };
}

export interface IAutoDateScaleCalibratorDefaults {
  majorTicks: {
    minOffset: number;
  };
  minorTicks: {
    count: number;
  };
}

// endregion

/**
 * The date scale calibrator which uses floating date format.
 * @constructor StockChartX.AutoDateScaleCalibrator
 * @augments StockChartX.DateScaleCalibrator
 */
export class AutoDateScaleCalibrator extends DateScaleCalibrator {
  static defaults: IAutoDateScaleCalibratorDefaults = {
    majorTicks: {
      minOffset: 30
    },
    minorTicks: {
      count: 0
    }
  };

  static get className(): string {
    return "StockChartX.AutoDateScaleCalibrator";
  }

  // region Properties

  /**
   * Gets/Sets min horizontal offset between date labels.
   * @name minLabelsOffset
   * @type {Number}
   * @memberOf StockChartX.AutoDateScaleCalibrator#
   */
  get minLabelsOffset(): number {
    let majorTicks = (<IAutoDateScaleCalibratorOptions>this._options)
      .majorTicks;

    return majorTicks && majorTicks.minOffset != null
      ? majorTicks.minOffset
      : AutoDateScaleCalibrator.defaults.majorTicks.minOffset;
  }

  set minLabelsOffset(value: number) {
    if (value != null && JsUtil.isNegativeNumber(value))
      throw new Error("Min labels offset must be greater or equal to 0.");

    let options = <IAutoDateScaleCalibratorOptions>this._options;
    (options.majorTicks || (options.majorTicks = {})).minOffset = value;
  }

  /**
   * Gets/Sets number of minor ticks on the date scale.
   * @name minorTicksCount
   * @type {number}
   * @memberOf StockChartX.AutoDateScaleCalibrator#
   */
  get minorTicksCount(): number {
    let minorTicks = (<IAutoDateScaleCalibratorOptions>this._options)
      .minorTicks;

    return minorTicks && minorTicks.count != null
      ? minorTicks.count
      : AutoDateScaleCalibrator.defaults.minorTicks.count;
  }

  set minorTicksCount(value: number) {
    if (value != null && JsUtil.isNegativeNumber(value))
      throw new Error("Ticks count must be a positive number or 0.");

    let options = <IAutoDateScaleCalibratorOptions>this._options;
    (options.minorTicks || (options.minorTicks = {})).count = value;
  }

  /**
   * @internal
   */
  private _formatter = new TimeIntervalDateTimeFormat();

  // endregion

  constructor(config?: IAutoDateScaleCalibratorConfig) {
    super(config);
  }

  /**
   * @internal
   */
  protected _calibrateMajorTicks(dateScale: DateScale) {
    let dates = dateScale.getDateDataSeries().values,
      chart = dateScale.chart,
      frame = dateScale.projectionFrame,
      projection = dateScale.projection,
      record = projection.recordByColumn(0),
      lastRecord = dateScale.maxAllowedRecord,
      minLabelsOffset = this.minLabelsOffset,
      textDrawBounds = dateScale._textDrawBounds(),
      minTextX = textDrawBounds.left,
      maxTextX = textDrawBounds.left + textDrawBounds.width,
      prevDate = new Date(0),
      prevDateString = null,
      prevLabelRight = -Infinity,
      dummyContext = DummyCanvasContext,
      maxX = chart.chartPanelsContainer.panelsContentFrame.width;

    this._formatter.timeInterval = chart.timeInterval;
    this._formatter.locale = chart.locale;

    dummyContext.applyTextTheme(dateScale.actualTheme.text);

    let charWidth = dummyContext.textWidth("9");

    while (record <= lastRecord) {
      let date =
        record >= 0 && record < dates.length
          ? <Date>dates[record]
          : projection.dateByRecord(record);
      let dateString = this._labelDateString(date, prevDate);
      if (!dateString || dateString === prevDateString) {
        // Date string was not changed. There is no need to show it again.
        record++;
        continue;
      }

      let x = projection.xByRecord(record);
      if (x < frame.left) {
        record++;
        continue;
      }
      if (x >= maxX) break;

      // Calculate rough text width. Because canvas's method is too slow.
      let textWidth = dateString.length * charWidth,
        textStartX = x - textWidth / 2,
        nextX;

      if (textStartX < prevLabelRight) {
        nextX = prevLabelRight + textWidth / 2;
      } else {
        textWidth = dummyContext.textWidth(dateString);
        textStartX = x - textWidth / 2;
        if (textStartX < prevLabelRight) {
          nextX = prevLabelRight + textWidth / 2;
        } else {
          let textX = x,
            textAlign = "center";
          if (textStartX < minTextX) {
            textStartX = textX = minTextX;
            textAlign = "left";
          } else if (textStartX + textWidth > maxTextX) {
            textX = maxTextX;
            textStartX = textX - textWidth;
            textAlign = "right";
          }

          this.majorTicks.push({
            x,
            textX,
            textAlign,
            date,
            text: dateString
          });

          prevLabelRight = textStartX + textWidth + minLabelsOffset;
          nextX = Math.ceil(prevLabelRight);
          prevDate = date;
          prevDateString = dateString;
        }
      }

      if (nextX > maxX) break;

      let nextRecord = projection.recordByX(nextX) + 1;
      record = nextRecord > record ? nextRecord : record + 1;
    }
  }

  /**
   * @internal
   */
  protected _calibrateMinorTicks() {
    super._calibrateMinorTicks(this.minorTicksCount);
  }

  /**
   * @internal
   */
  private _labelDateString(date: Date, prevDate: Date): string {
    if (date <= prevDate) return null;

    let ts = TimeSpan,
      formatter = this._formatter,
      timeInterval = formatter.timeInterval;

    // Year periodicity
    let year = date.getFullYear(),
      prevYear = prevDate.getFullYear();
    if (timeInterval >= ts.MILLISECONDS_IN_YEAR) {
      return year !== prevYear ? year.toString() : null;
    }

    let FormatName = DateTimeFormatName;

    // Month periodicity
    let month = date.getMonth() + 1,
      prevMonth = prevDate.getMonth() + 1;
    if (timeInterval >= ts.MILLISECONDS_IN_MONTH) {
      if (year !== prevYear)
        return formatter.formatWithFormatter(date, FormatName.YEAR_MONTH); // can be changed to something like "Jan 2014"
      if (month !== prevMonth)
        return formatter.formatWithFormatter(date, FormatName.YEAR_MONTH); // can be changed to something like "Jan"

      return null;
    }

    // Day/Week periodicity
    let day = date.getDate();
    let prevDay = prevDate.getDate();
    if (timeInterval >= ts.MILLISECONDS_IN_DAY) {
      if (year !== prevYear)
        return formatter.formatWithFormatter(date, FormatName.DATE); // can be changed to something like "Jan 1, 2014"
      if (month !== prevMonth || day !== prevDay)
        return formatter.formatWithFormatter(date, FormatName.MONTH_DAY); // can be changed to something like "Jan 1"

      return null;
    }

    // Minute/Hour periodicity
    let hour = date.getHours();
    let prevHour = prevDate.getHours();
    let minute = date.getMinutes();
    let prevMinute = prevDate.getMinutes();
    if (timeInterval >= ts.MILLISECONDS_IN_MINUTE) {
      if (year !== prevYear) {
        // can be changed to something like "Jan 1, 2014 10:00"
        return formatter.formatWithFormatter(date, FormatName.SHORT_DATE_TIME);
      }
      if (month !== prevMonth || day !== prevDay) {
        // can be changed to something like "Jan 1 10:00"
        return formatter.formatWithFormatter(date, FormatName.SHORT_DATE_TIME);
      }
      if (hour !== prevHour || minute !== prevMinute) {
        // can be changed to something like "10:00"
        return formatter.formatWithFormatter(date, FormatName.SHORT_TIME);
      }

      return null;
    }

    // Second periodicity
    let second = date.getSeconds();
    let prevSecond = prevDate.getSeconds();
    if (timeInterval >= ts.MILLISECONDS_IN_SECOND) {
      if (year !== prevYear) {
        // can be changed to something like "Jan 1, 2014 10:00:00"
        return formatter.formatWithFormatter(date, FormatName.SHORT_DATE_TIME);
      }
      if (month !== prevMonth || day !== prevDay) {
        // can be changed to something like "Jan 1 10:00:00"
        return formatter.formatWithFormatter(date, FormatName.SHORT_DATE_TIME);
      }
      if (hour !== prevHour || minute !== prevMinute) {
        // can be changed to something like "10:00:00"
        return formatter.formatWithFormatter(date, FormatName.LONG_TIME);
      }
      if (second !== prevSecond) {
        // can be changed to something like "10:00" (mm:ss)
        return formatter.formatWithFormatter(date, FormatName.LONG_TIME);
      }

      return null;
    }

    // Millisecond periodicity
    let ms = date.getMilliseconds();
    let prevMs = prevDate.getMilliseconds();
    if (year !== prevYear) {
      // can be changed to something like "Jan 1, 2014 10:00:00.000"
      return formatter.formatWithFormatter(date, FormatName.LONG_DATE_TIME);
    }
    if (month !== prevMonth || day !== prevDay) {
      // can be changed to something like "Jan 1 10:00:00.000"
      return formatter.formatWithFormatter(date, FormatName.LONG_DATE_TIME);
    }
    if (hour !== prevHour || minute !== prevMinute) {
      // can be changed to something like "10:00:00.000"
      return formatter.formatWithFormatter(date, FormatName.LONG_TIME);
    }
    if (second !== prevSecond || ms !== prevMs) {
      // can be changed to something like "00.000"
      return formatter.formatWithFormatter(date, FormatName.LONG_TIME);
    }

    return null;
  }
}

DateScaleCalibrator.register(AutoDateScaleCalibrator);
