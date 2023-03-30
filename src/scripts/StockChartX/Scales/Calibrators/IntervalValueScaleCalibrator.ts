import {
  ValueScaleCalibrator,
  IValueScaleCalibratorOptions,
  IValueScaleCalibratorConfig
} from "../../index";
import { ChartPanelValueScale } from "../../index";
import { HtmlUtil } from "../../index";
import { JsUtil } from "../../index";
import { IntlNumberFormat } from "../../index";

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

export interface IIntervalValueScaleCalibratorConfig
  extends IValueScaleCalibratorConfig {
  majorTicks?: {
    interval?: number;
    minOffset?: number;
  };
  minorTicks?: {
    count?: number;
  };
}

interface IIntervalValueScaleCalibratorOptions
  extends IValueScaleCalibratorOptions {
  majorTicks?: {
    interval?: number;
    minOffset?: number;
  };
  minorTicks?: {
    count?: number;
  };
}

export interface IIntervalValueScaleCalibratorDefaults {
  majorTicks: {
    interval: number;
    minOffset: number;
  };
  minorTicks: {
    count: number;
  };
}

// endregion

const INTERVAL_EPSILON = 1e-8;

/**
 * The value scale calibrator which uses user defined value interval.
 * @constructor StockChartX.IntervalValueScaleCalibrator
 * @augments StockChartX.ValueScaleCalibrator
 */
export class IntervalValueScaleCalibrator extends ValueScaleCalibrator {
  // region Statics

  static defaults: IIntervalValueScaleCalibratorDefaults = {
    majorTicks: {
      interval: 0.005,
      minOffset: 10
    },
    minorTicks: {
      count: 0
    }
  };

  static get className(): string {
    return "StockChartX.IntervalValueScaleCalibrator";
  }

  // endregion

  // region Properties

  /**
   * The minimum interval between values..
   * @name interval
   * @type {number}
   * @memberOf StockChartX.IntervalValueScaleCalibrator#
   */
  get interval(): number {
    let majorTicks = (<IIntervalValueScaleCalibratorOptions>this._options)
      .majorTicks;

    return majorTicks && majorTicks.interval
      ? majorTicks.interval
      : IntervalValueScaleCalibrator.defaults.majorTicks.interval;
  }

  set interval(value: number) {
    if (value != null) {
      if (!JsUtil.isPositiveNumber(value))
        throw new Error("Interval must be a value greater than 0.");
      if (value < INTERVAL_EPSILON) throw new Error("Interval is too small.");
    }

    let options = <IIntervalValueScaleCalibratorOptions>this._options;
    (options.majorTicks || (options.majorTicks = {})).interval = value;
  }

  /**
   * The minimum vertical offset between labels.
   * @name minValuesOffset
   * @type {number}
   * @memberOf StockChartX.IntervalValueScaleCalibrator#
   */
  get minValuesOffset(): number {
    let majorTicks = (<IIntervalValueScaleCalibratorOptions>this._options)
      .majorTicks;

    return majorTicks && majorTicks.minOffset != null
      ? majorTicks.minOffset
      : IntervalValueScaleCalibrator.defaults.majorTicks.minOffset;
  }

  set minValuesOffset(value: number) {
    if (value != null && JsUtil.isNegativeNumber(value))
      throw new Error("Values offset must be a value greater or equal to 0.");

    let options = <IIntervalValueScaleCalibratorOptions>this._options;
    (options.majorTicks || (options.majorTicks = {})).minOffset = value;
  }

  /**
   * Gets/Sets number of minor tick marks on the value scale.
   * @name minorTicksCount
   * @type {number}
   * @memberOf StockChartX.IntervalValueScaleCalibrator#
   */
  get minorTicksCount(): number {
    let minorTicks = (<IIntervalValueScaleCalibratorOptions>this._options)
      .minorTicks;

    return minorTicks && minorTicks.count != null
      ? minorTicks.count
      : IntervalValueScaleCalibrator.defaults.minorTicks.count;
  }

  set minorTicksCount(value: number) {
    if (value != null && JsUtil.isNegativeNumber(value))
      throw new Error("Tick count must be greater or equal to 0.");

    let options = <IIntervalValueScaleCalibratorOptions>this._options;
    (options.minorTicks || (options.minorTicks = {})).count = value;
  }

  // endregion

  constructor(config?: IIntervalValueScaleCalibratorConfig) {
    super(config);
  }

  /**
   * @internal
   */
  protected _calibrateMajorTicks(valueScale: ChartPanelValueScale) {
    this._calibrateIntervalMajorTicks(valueScale);
    if (this.majorTicks.length <= 1) {
      this.majorTicks.length = 0;
      this._calibrateRangeMajorTicks(valueScale);
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
  private _calibrateIntervalMajorTicks(valueScale: ChartPanelValueScale) {
    let interval = this.interval;
    if (interval < INTERVAL_EPSILON) return;
    if (valueScale.maxVisibleValue - valueScale.minVisibleValue <= interval)
      return;

    let textHeight = HtmlUtil.getFontSize(valueScale.actualTheme.text),
      labelOffset = textHeight + this.minValuesOffset,
      padding = valueScale.padding,
      bottom =
        valueScale.chartPanel.layer.size.height -
        padding.bottom -
        textHeight / 2,
      projection = valueScale.projection,
      prevValue = projection.valueByY(0),
      y = Math.round(padding.top + textHeight / 2),
      nextY = y,
      value,
      prevText = null;

    while (y < bottom) {
      let prevY = nextY;
      do {
        // Round value to the interval
        value = interval * Math.trunc(projection.valueByY(y) / interval);
        if (value >= prevValue) value = prevValue - interval;
        prevValue = value;

        y = Math.round(projection.yByValue(value));
        if (y >= nextY) {
          prevY = y;
          break;
        }
        y = prevY + 1;
        prevY = y;
      } while (y < bottom);
      nextY = y + labelOffset;

      if (y >= bottom) break;

      let text = this.divider
        ? this.formatValue(value)
        : valueScale.formatValue(value);

      if (text !== prevText) {
        this.majorTicks.push({
          y,
          value,
          text
        });
        prevText = text;
      }
      y = nextY;
    }
  }

  /**
   * @internal
   */
  private _calibrateRangeMajorTicks(valueScale: ChartPanelValueScale) {
    let textHeight = HtmlUtil.getFontSize(valueScale.actualTheme.text),
      halfTextHeight = textHeight / 2,
      labelOffset = textHeight + this.minValuesOffset,
      padding = valueScale.padding,
      panelHeight = valueScale.chartPanel.layer.size.height,
      topY = padding.top + halfTextHeight,
      bottomY = panelHeight - padding.bottom - halfTextHeight,
      projection = valueScale.projection;

    if (bottomY - topY < labelOffset) {
      // We don't have enough space to show 2 labels. Let's just show label in the middle.
      let midY = panelHeight / 2,
        midValue = projection.valueByY(midY);

      this.majorTicks.push({
        y: midY,
        value: midValue,
        text: valueScale.formatValue(midValue)
      });
    } else {
      // We have enough space. So lets show top and bottom labels.
      let topValue = projection.valueByY(topY);
      this.majorTicks.push({
        y: topY,
        value: topValue,
        text: valueScale.formatValue(topValue)
      });

      let bottomValue = projection.valueByY(bottomY);
      this.majorTicks.push({
        y: bottomY,
        value: bottomValue,
        text: valueScale.formatValue(bottomValue)
      });
    }
  }
}

ValueScaleCalibrator.register(IntervalValueScaleCalibrator);
