/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import {
  DateScale,
  TimeSpan,
  DummyCanvasContext,
  DateScaleCalibrator,
  IDateScaleCalibratorConfig,
  IDateScaleCalibratorOptions,
  JsUtil,
  CustomFormat,
  CustomFormatter,
  CustomDateTimeFormat,
  Chart
} from "../../index";
"use strict";

// region Interfaces

export interface IFixedDateScaleCalibratorConfig
  extends IDateScaleCalibratorConfig {
  majorTicks?: {
    count?: number;
    format?: IFixedDateLabelsFormat;
    customFormat?(
      calibrator: DateScaleCalibrator,
      labelIndex: number,
      date: Date
    );
    customFormatter?(
      calibrator: DateScaleCalibrator,
      labelIndex: number,
      date: Date
    );
  };
  minorTicks?: {
    count?: number;
  };
}

interface IFixedDateScaleCalibratorOptions extends IDateScaleCalibratorOptions {
  majorTicks?: {
    count?: number;
    format?: IFixedDateLabelsFormat;
    customFormat?: CustomFormat;
    customFormatter?: CustomFormatter;
  };
  minorTicks?: {
    count?: number;
  };
}

export interface IFixedDateScaleCalibratorDefaults {
  majorTicks: {
    count: number;
    format?: IFixedDateLabelsFormat;
    customFormat?: CustomFormat;
    customFormatter?: CustomFormatter;
  };
  minorTicks: {
    count: number;
  };
}

export interface IFixedDateLabelsFormat {
  first?: string;
  last?: string;
  other: string;
}

// endregion

/**
 * The date scale calibrator which produces fixed number of labels.
 * @constructor StockChartX.FixedDateScaleCalibrator
 * @augments StockChartX.DateScaleCalibrator
 */
export class FixedDateScaleCalibrator extends DateScaleCalibrator {
  static defaults: IFixedDateScaleCalibratorDefaults = {
    majorTicks: {
      count: 3
    },
    minorTicks: {
      count: 0
    }
  };

  static get className(): string {
    return "StockChartX.FixedDateScaleCalibrator";
  }

  // region Properties

  /**
   * @internal
   */
  private _formatter = new CustomDateTimeFormat();

  /**
   * Gets/Sets number of major ticks on the date scale.
   * @name majorTicksCount
   * @type {number}
   * @memberOf StockChartX.FixedDateScaleCalibrator#
   */
  get majorTicksCount(): number {
    let majorTicks = (<IFixedDateScaleCalibratorOptions>this._options)
      .majorTicks;

    return majorTicks && majorTicks.count != null
      ? majorTicks.count
      : FixedDateScaleCalibrator.defaults.majorTicks.count;
  }

  set majorTicksCount(value: number) {
    if (value != null && JsUtil.isNegativeNumber(value))
      throw new Error("Ticks count must be a positive number.");

    let options = <IFixedDateScaleCalibratorOptions>this._options;
    (options.majorTicks || (options.majorTicks = {})).count = value;
  }

  /**
   * Gets/Sets number of minor ticks on the date scale.
   * @name minorTicksCount
   * @type {number}
   * @memberOf StockChartX.FixedDateScaleCalibrator#
   */
  get minorTicksCount(): number {
    let minorTicks = (<IFixedDateScaleCalibratorOptions>this._options)
      .minorTicks;

    return minorTicks && minorTicks.count != null
      ? minorTicks.count
      : FixedDateScaleCalibrator.defaults.minorTicks.count;
  }

  set minorTicksCount(value: number) {
    if (value != null && JsUtil.isNegativeNumber(value))
      throw new Error("Ticks count must be a positive number.");

    let options = <IFixedDateScaleCalibratorOptions>this._options;
    (options.minorTicks || (options.minorTicks = {})).count = value;
  }

  /**
   * Gets/Sets format of different major tick labels (first, last, all others)
   * @name majorTicksFormat
   * @type {Object}
   * @memberOf StockChartX.FixedDateScaleCalibrator#
   * @example
   *  calibrator.majorTicksFormat = {
   *      first: 'YYYY-MM-DD HH:mm',
   *      last: 'YYYY-MM-DD HH:mm',
   *      other: 'HH:mm'
   *  };
   */
  get majorTicksFormat(): IFixedDateLabelsFormat {
    let majorTicks = (<IFixedDateScaleCalibratorOptions>this._options)
      .majorTicks;

    return (
      (majorTicks && majorTicks.format) ||
      FixedDateScaleCalibrator.defaults.majorTicks.format
    );
  }

  set majorTicksFormat(value: IFixedDateLabelsFormat) {
    let options = <IFixedDateScaleCalibratorOptions>this._options;

    (options.majorTicks || (options.majorTicks = {})).format = value;
  }

  /**
   * Gets/Sets custom format of major ticks labels
   * @name customFormat
   * @type {CustomFormat}
   * @memberOf StockChartX.FixedDateScaleCalibrator#
   */
  get customFormat(): CustomFormat {
    let majorTicks = (<IFixedDateScaleCalibratorOptions>this._options)
      .majorTicks;

    return majorTicks ? majorTicks.customFormat : null;
  }

  set customFormat(value: CustomFormat) {
    let majorTicks = (<IFixedDateScaleCalibratorOptions>this._options)
      .majorTicks;

    if (majorTicks) majorTicks.customFormat = value;
  }

  /**
   * Gets/Sets custom formatter that returns label for each major ticks
   * @name customFormatter
   * @type {CustomFormatter}
   * @memberOf StockChartX.FixedDateScaleCalibrator#
   */
  get customFormatter(): CustomFormatter {
    let majorTicks = (<IFixedDateScaleCalibratorOptions>this._options)
      .majorTicks;

    return majorTicks ? majorTicks.customFormatter : null;
  }

  set customFormatter(value: CustomFormatter) {
    let majorTicks = (<IFixedDateScaleCalibratorOptions>this._options)
      .majorTicks;

    if (majorTicks) majorTicks.customFormatter = value;
  }

  // endregion

  constructor(config?: IFixedDateScaleCalibratorConfig) {
    super(config);
  }

  /**
   * @internal
   */
  protected _calibrateMajorTicks(dateScale: DateScale) {
    let frame = dateScale.projectionFrame,
      textDrawBounds = dateScale._textDrawBounds(),
      minTextX = textDrawBounds.left,
      maxTextX = textDrawBounds.left + textDrawBounds.width,
      projection = dateScale.projection,
      padding = dateScale.chart.chartPanelsContainer.panelPadding,
      startX = frame.left - padding.left,
      endX = frame.right + padding.right,
      dummyContext = DummyCanvasContext,
      ticksCount = this.majorTicksCount,
      tickWidth = (endX - startX) / (ticksCount - 1),
      formats = this.majorTicksFormat;

    if (!formats) formats = <IFixedDateLabelsFormat>{};
    if (!formats.other)
      formats.other = FixedDateScaleCalibrator._createAutoFormat(
        dateScale.chart
      );

    dummyContext.applyTextTheme(dateScale.actualTheme.text);

    for (let i = 0; i < ticksCount; i++) {
      let x = startX + i * tickWidth;
      this._updateFormatterForLabel(i, i === ticksCount - 1, formats);

      let date = projection.dateByX(x),
        dateString = this._customMajorFormatter(i, date);

      if (!dateString) {
        let customFormat = this._customMajorFormat(i, date);
        dateString = this._formatter.format(date, customFormat);
      }

      let textWidth = dummyContext.textWidth(dateString),
        textAlign = "center",
        textX = x;

      if (textX - textWidth / 2 < minTextX) {
        textX = minTextX;
        textAlign = "left";
      } else if (textX + textWidth / 2 > maxTextX) {
        textX = maxTextX;
        textAlign = "right";
      }

      this.majorTicks.push({
        x,
        textX: x,
        textAlign,
        date,
        text: dateString
      });
    }
  }

  /**
   * @internal
   */
  private _customMajorFormat(labelIndex: number, date: Date): string {
    let majorTicks = (<IFixedDateScaleCalibratorOptions>this._options)
      .majorTicks;

    if (majorTicks && majorTicks.customFormat)
      return majorTicks.customFormat(this, labelIndex, date);

    return null;
  }

  /**
   * @internal
   */
  private _customMajorFormatter(labelIndex: number, date: Date): string {
    let majorTicks = (<IFixedDateScaleCalibratorOptions>this._options)
      .majorTicks;

    if (majorTicks && majorTicks.customFormatter)
      return majorTicks.customFormatter(this, labelIndex, date);

    return null;
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
  private _updateFormatterForLabel(
    labelIndex: number,
    isLastLabel: boolean,
    formats: IFixedDateLabelsFormat
  ) {
    let formatString;

    if (isLastLabel) formatString = formats.last || formats.other;
    else if (labelIndex === 0) formatString = formats.first || formats.other;
    else formatString = formats.other;

    this._formatter.formatString = formatString;
  }

  /**
   * @internal
   */
  private static _createAutoFormat(chart: Chart): string {
    let timeInterval = chart.timeInterval,
      format;

    if (timeInterval >= TimeSpan.MILLISECONDS_IN_YEAR) format = "YYYY";
    else if (timeInterval >= TimeSpan.MILLISECONDS_IN_MONTH)
      format = "YYYY MMM";
    else if (timeInterval >= TimeSpan.MILLISECONDS_IN_DAY)
      format = "YYYY-MM-DD";
    else if (timeInterval >= TimeSpan.MILLISECONDS_IN_MINUTE)
      format = "YYYY-MM-DD HH:mm";
    else if (timeInterval >= TimeSpan.MILLISECONDS_IN_SECOND)
      format = "YYYY-MM-DD HH:mm:ss";
    else format = "YYYY-MM-DD HH:mm:ss.SSS";

    return format;
  }
}

DateScaleCalibrator.register(FixedDateScaleCalibrator);
