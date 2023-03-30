import {
  ValueScaleCalibrator,
  IValueScaleCalibratorConfig,
  JsUtil,
  ChartPanelValueScale,
  HtmlUtil,
  IValueScaleCalibratorOptions
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

export interface IAutoValueScaleCalibratorConfig
  extends IValueScaleCalibratorConfig {
  majorTicks?: {
    minOffset?: number;
  };
  minorTicks?: {
    count?: number;
  };
}

interface IAutoValueScaleCalibratorOptions
  extends IValueScaleCalibratorOptions {
  majorTicks?: {
    minOffset?: number;
  };
  minorTicks?: {
    count?: number;
  };
}

export interface IAutoValueScaleCalibratorDefaults {
  majorTicks: {
    minOffset: number;
  };
  minorTicks: {
    count: number;
  };
}

// endregion

/**
 * The value scale calibrator which uses floating value step.
 * @constructor StockChartX.AutoValueScaleCalibrator
 * @augments StockChartX.ValueScaleCalibrator
 */
export class AutoValueScaleCalibrator extends ValueScaleCalibrator {
  static defaults: IAutoValueScaleCalibratorDefaults = {
    majorTicks: {
      minOffset: 10
    },
    minorTicks: {
      count: 0
    }
  };

  static get className(): string {
    return "StockChartX.AutoValueScaleCalibrator";
  }

  // region Properties

  /**
   * The minimum vertical offset between labels.
   * @name minValuesOffset
   * @type {number}
   * @memberOf StockChartX.AutoValueScaleCalibrator#
   */
  get minValuesOffset(): number {
    let majorTicks = (<IAutoValueScaleCalibratorOptions>this._options)
      .majorTicks;

    return majorTicks != null && majorTicks.minOffset != null
      ? majorTicks.minOffset
      : AutoValueScaleCalibrator.defaults.majorTicks.minOffset;
  }

  set minValuesOffset(value: number) {
    if (value != null && JsUtil.isNegativeNumber(value))
      throw new Error("Values offset must be a value greater or equal to 0.");

    let options = <IAutoValueScaleCalibratorOptions>this._options;
    (options.majorTicks || (options.majorTicks = {})).minOffset = value;
  }

  /**
   * Gets/Sets number of minor tick marks on the value scale.
   * @name minorTicksCount
   * @type {number}
   * @memberOf StockChartX.AutoValueScaleCalibrator#
   */
  get minorTicksCount(): number {
    let minorTicks = (<IAutoValueScaleCalibratorOptions>this._options)
      .minorTicks;

    return minorTicks && minorTicks.count != null
      ? minorTicks.count
      : AutoValueScaleCalibrator.defaults.minorTicks.count;
  }

  set minorTicksCount(value: number) {
    if (value != null && JsUtil.isNegativeNumber(value))
      throw new Error("Tick count must be greater or equal to 0.");

    let options = <IAutoValueScaleCalibratorOptions>this._options;
    (options.minorTicks || (options.minorTicks = {})).count = value;
  }

  // endregion

  /**
   * @internal
   */
  protected _calibrateMajorTicks(valueScale: ChartPanelValueScale) {
    let theme = valueScale.actualTheme,
      textHeight = HtmlUtil.getFontSize(theme.text),
      minValuesOffset = this.minValuesOffset,
      padding = valueScale.padding,
      panelPadding = valueScale.chartPanel.panelPadding,
      y = Math.round(Math.max(padding.top, panelPadding.top) + textHeight / 2),
      bottom =
        valueScale.chartPanel.layer.canvas.height() -
        padding.bottom -
        textHeight / 2,
      projection = valueScale.projection,
      prevText = null;

    while (y < bottom) {
      let value = projection.valueByY(y);
      let text = valueScale.formatValue(value);

      if (text !== prevText) {
        this.majorTicks.push({
          y,
          value,
          text
        });
        prevText = text;
      }

      y += textHeight + minValuesOffset;
    }
  }

  /**
   * @internal
   */
  protected _calibrateMinorTicks() {
    super._calibrateMinorTicks(this.minorTicksCount);
  }
}

ValueScaleCalibrator.register(AutoValueScaleCalibrator);
