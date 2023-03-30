import { ITextTheme, IStrokeTheme, IFillTheme } from "../../index";
import {
  IDrawingConfig,
  IDrawingOptions,
  IDrawingDefaults,
  Drawing
} from "../../index";
import { FibonacciDrawingSettingsDialog } from "../../../StockChartX.UI/index";
import { ViewLoader } from "../../../StockChartX.UI/index";
import {
  FibonacciLevelTextVerPosition,
  FibonacciLevelTextHorPosition
} from "../utils";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

// @if SCX_LICENSE != 'free'

/**
 * The fibonacci level structure.
 * @typedef {object} FibonacciLevel
 * @type {object}
 * @property {boolean} [visible = true] The flag that indicates whether level is visible.
 * @property {number} value The level value.
 * @property {object} [theme] The theme for the level.
 * @memberOf StockChartX
 * @example
 *  var point = {
 *      x: 10,
 *      y: 20
 *  };
 */

"use strict";

export interface IFibonacciLevel {
  value: number;
  visible?: boolean;
  theme?: IFibonacciLevelTheme;
}

export interface IFibonacciLevelTheme {
  text?: ITextTheme;
  line?: IStrokeTheme;
  fill?: IFillTheme;
}

export interface IFibonacciDrawingBaseConfig extends IDrawingConfig {
  levels: IFibonacciLevel[];
}

export interface IFibonacciDrawingBaseOptions extends IDrawingOptions {
  levels?: IFibonacciLevel[];
  showTrendLine?: boolean;
  showLevelLines?: boolean;
  showLevelBackgrounds?: boolean;
  showLevelValues?: boolean;
  showLevelPrices?: boolean;
  showLevelPercents?: boolean;
  levelTextHorPosition?: string;
  levelTextVerPosition?: string;
}

export interface IFibonacciDrawingBaseDefaults extends IDrawingDefaults {
  levels?: IFibonacciLevel[];
  showTrendLine?: boolean;
  showLevelLines?: boolean;
  showLevelBackgrounds?: boolean;
  showLevelValues?: boolean;
  showLevelPrices?: boolean;
  showLevelPercents?: boolean;
  levelTextHorPosition?: string;
  levelTextVerPosition?: string;
}

let defaults: IFibonacciDrawingBaseDefaults = {
  createPointBehavior: null,
  levels: [{ value: 0.382 }, { value: 0.5 }, { value: 0.618 }, { value: 1.0 }],
  showTrendLine: true,
  showLevelLines: true,
  showLevelBackgrounds: true,
  showLevelValues: true,
  showLevelPrices: true,
  showLevelPercents: true,
  levelTextHorPosition: FibonacciLevelTextHorPosition.RIGHT,
  levelTextVerPosition: FibonacciLevelTextVerPosition.BOTTOM
};

/**
 * Drawing events enumeration values.
 * @name DrawingEvent
 * @enum {string}
 * @property {string} LEVELS_CHANGED Levels changed
 * @property {string} SHOW_TREND_LINE_CHANGED Trend line was shown or hidden
 * @property {string} SHOW_LEVEL_LINES_CHANGED Level lines were shown or hidden
 * @property {string} SHOW_LEVEL_BACKGROUNDS_CHANGED Level backgrounds were shown or hidden
 * @property {string} SHOW_LEVEL_VALUES_CHANGED Level values were shown or hidden
 * @property {string} SHOW_LEVEL_PRICES_CHANGED Level prices were shown or hidden
 * @property {string} SHOW_LEVEL_PERCENTS_CHANGED Level percents were shown or hidden
 * @property {string} LEVEL_TEXT_HOR_POSITION_CHANGED Level text horizontal position was changed
 * @property {string} LEVEL_TEXT_VER_POSITION_CHANGED Level text vertical position was changed
 * @property {string} LEVEL_LINES_EXTENSION_CHANGED Level lines extension was enabled or disabled
 * @property {string} REVERSE_CHANGED Fibonacci drawing was reversed
 * @readonly
 * @memberOf StockChartX
 */
const LEVELS_CHANGED = "drawingLevelsChanged";
const SHOW_TREND_LINE_CHANGED = "drawingShowTrendLineChanged";
const SHOW_LEVEL_LINES_CHANGED = "drawingShowLevelLinesChanged";
const SHOW_LEVEL_BACKGROUNDS_CHANGED = "drawingShowLevelBackgroundsChanged";
const SHOW_LEVEL_VALUES_CHANGED = "drawingShowLevelValuesChanged";
const SHOW_LEVEL_PRICES_CHANGED = "drawingShowLevelPricesChanged";
const SHOW_LEVEL_PERCENTS_CHANGED = "drawingShowLevelPercentsChanged";
const LEVEL_TEXT_HOR_POSITION_CHANGED = "drawingLevelTextHorPositionChanged";
const LEVEL_TEXT_VER_POSITION_CHANGED = "drawingLevelTextVerPositionChanged";
const LEVEL_LINES_EXTENSION_CHANGED = "drawingLevelLinesExtensionChanged";
const REVERSE_CHANGED = "drawingReverseChanged";

/**
 * The base abstract class for fibonacci drawings.
 * @param {object} [config] The configuration object.
 * @param {number[]} [config.levels] The level values.
 * @constructor StockChartX.FibonacciDrawingBase
 * @augments StockChartX.Drawing
 */
export class FibonacciDrawingBase extends Drawing {
  static get subClassName(): string {
    return "fibonacci";
  }

  static defaults: IFibonacciDrawingBaseDefaults = defaults;

  /**
   * @internal
   */
  protected _textOffset: number = 2;

  /**
   * The level values
   * @name levels
   * @type {StockChartX.FibonacciLevel[]}
   * @memberOf StockChartX.FibonacciDrawingBase#
   */
  get levels(): IFibonacciLevel[] {
    let value = this._optionValue("levels");

    return value || FibonacciDrawingBase.defaults.levels;
  }

  set levels(value: IFibonacciLevel[]) {
    if (value != null && !Array.isArray(value))
      throw new TypeError("Levels must be an array of numbers.");

    for (let i = 0, count = value.length; i < count - 1; i++) {
      for (let j = i + 1; j < count; j++) {
        if (value[i].value > value[j].value) {
          let tmp = value[i];
          value[i] = value[j];
          value[j] = tmp;
        }
      }
    }

    (<IFibonacciDrawingBaseOptions>this._options).levels = value;
    this.fire(LEVELS_CHANGED, value);
  }

  /**
   * The flag that indicates whether trend line is visible.
   * @name showTrendLine
   * @type {boolean}
   * @memberOf StockChartX.FibonacciDrawingBase#
   */
  get showTrendLine(): boolean {
    let flag = this._optionValue("showTrendLine");

    return flag != null
      ? <boolean>flag
      : FibonacciDrawingBase.defaults.showTrendLine;
  }

  set showTrendLine(value: boolean) {
    this._setOption("showTrendLine", value, SHOW_TREND_LINE_CHANGED);
  }

  /**
   * The flag that indicates whether level lines are visible.
   * @name showLevelLines
   * @type {boolean}
   * @memberOf StockChartX.FibonacciDrawingBase#
   */
  get showLevelLines(): boolean {
    let flag = this._optionValue("showLevelLines");

    return flag != null
      ? <boolean>flag
      : FibonacciDrawingBase.defaults.showLevelLines;
  }

  set showLevelLines(value: boolean) {
    this._setOption("showLevelLines", value, SHOW_LEVEL_LINES_CHANGED);
  }

  /**
   * The flag that indicates whether area between levels is filled.
   * @name showLevelBackgrounds
   * @type {boolean}
   * @memberOf StockChartX.FibonacciDrawingBase#
   */
  get showLevelBackgrounds(): boolean {
    let flag = this._optionValue("showLevelBackgrounds");

    return flag != null
      ? <boolean>flag
      : FibonacciDrawingBase.defaults.showLevelBackgrounds;
  }

  set showLevelBackgrounds(value: boolean) {
    this._setOption(
      "showLevelBackgrounds",
      value,
      SHOW_LEVEL_BACKGROUNDS_CHANGED
    );
  }

  /**
   * The flag that indicates whether level values are visible.
   * @name showLevelValues
   * @type {boolean}
   * @memberOf StockChartX.FibonacciDrawingBase#
   */
  get showLevelValues(): boolean {
    let flag = this._optionValue("showLevelValues");

    return flag != null
      ? <boolean>flag
      : FibonacciDrawingBase.defaults.showLevelValues;
  }

  set showLevels(value: boolean) {
    this._setOption("showLevelValues", value, SHOW_LEVEL_VALUES_CHANGED);
  }

  /**
   * The flag that indicates whether level prices are visible.
   * @name showLevelPrices
   * @type {boolean}
   * @memberOf StockChartX.FibonacciDrawingBase#
   */
  get showLevelPrices(): boolean {
    let flag = this._optionValue("showLevelPrices");

    return flag != null
      ? <boolean>flag
      : FibonacciDrawingBase.defaults.showLevelPrices;
  }

  set showLevelPrices(value: boolean) {
    this._setOption("showLevelPrices", value, SHOW_LEVEL_PRICES_CHANGED);
  }

  /**
   * The flag that indicates whether level percents are visible.
   * @name showLevelPercents
   * @type {boolean}
   * @memberOf StockChartX.FibonacciDrawingBase#
   */
  get showLevelPercents(): boolean {
    let flag = this._optionValue("showLevelPercents");

    return flag != null
      ? <boolean>flag
      : FibonacciDrawingBase.defaults.showLevelPercents;
  }

  set showLevelPercents(value: boolean) {
    this._setOption("showLevelPercents", value, SHOW_LEVEL_PERCENTS_CHANGED);
  }

  /**
   * The horizontal position of the level text.
   * @name levelTextHorPosition
   * @type {string}
   * @memberOf StockChartX.FibonacciDrawingBase#
   */
  get levelTextHorPosition(): string {
    let pos = this._optionValue("levelTextHorPosition");

    return pos != null
      ? <string>pos
      : FibonacciDrawingBase.defaults.levelTextHorPosition;
  }

  set levelTextHorPosition(value: string) {
    this._setOption(
      "levelTextHorPosition",
      value,
      LEVEL_TEXT_HOR_POSITION_CHANGED
    );
  }

  /**
   * The vertical position of the level text.
   * @name levelTextVerPosition
   * @type {string}
   * @memberOf StockChartX.FibonacciDrawingBase#
   */
  get levelTextVerPosition(): string {
    let pos = this._optionValue("levelTextVerPosition");

    return pos != null
      ? <string>pos
      : FibonacciDrawingBase.defaults.levelTextVerPosition;
  }

  set levelTextVerPosition(value: string) {
    this._setOption(
      "levelTextVerPosition",
      value,
      LEVEL_TEXT_VER_POSITION_CHANGED
    );
  }

  constructor(config?: IFibonacciDrawingBaseConfig) {
    super(config);
  }

  /**
   * @inheritDoc
   */
  pointsLocalizationKeys(): string[] {
    let chartPointsNames = [
      "drawingSettingDialog.start",
      "drawingSettingDialog.end"
    ];

    return chartPointsNames;
  }

  /**
   * @internal
   */
  protected _showSettingsDialog() {
    if (!this.chart) return;

    ViewLoader.fibonacciDrawingSettingsDialog(
      (dialog: FibonacciDrawingSettingsDialog) => {
        dialog.show({
          chart: this.chart,
          drawing: this
        });
      }
    );
  }

  /**
   * @internal
   */
  protected _applyTextPosition() {
    let context = this.context,
      baseline,
      align;

    switch (this.levelTextVerPosition) {
      case FibonacciLevelTextVerPosition.MIDDLE:
        baseline = "middle";
        break;
      case FibonacciLevelTextVerPosition.TOP:
        baseline = "bottom";
        break;
      case FibonacciLevelTextVerPosition.BOTTOM:
        baseline = "top";
        break;
      default:
        throw new Error(
          `Unsupported level text vertical position: ${
            this.levelTextVerPosition
          }`
        );
    }

    switch (this.levelTextHorPosition) {
      case FibonacciLevelTextHorPosition.CENTER:
        align = "center";
        break;
      case FibonacciLevelTextHorPosition.LEFT:
        align = "right";
        break;
      case FibonacciLevelTextHorPosition.RIGHT:
        align = "left";
        break;
      default:
        throw new Error(
          `Unsupported level text horizontal position: ${
            this.levelTextHorPosition
          }`
        );
    }

    context.textBaseline = baseline;
    context.textAlign = align;
  }

  /**
   * @internal
   */
  // noinspection JSMethodCanBeStatic
  protected _isLevelVisible(level: IFibonacciLevel): boolean {
    return level.visible != null ? level.visible : true;
  }

  /**
   * @internal
   */
  protected _adjustXWithTextOffset(x: number): number {
    switch (this.levelTextHorPosition) {
      case FibonacciLevelTextHorPosition.LEFT:
        return x - this._textOffset;
      case FibonacciLevelTextHorPosition.RIGHT:
        return x + this._textOffset;
      default:
        return x;
    }
  }

  /**
   * @internal
   */
  protected _adjustYWithTextOffset(y: number): number {
    switch (this.levelTextVerPosition) {
      case FibonacciLevelTextVerPosition.TOP:
        return y - this._textOffset;
      case FibonacciLevelTextVerPosition.BOTTOM:
        return y + this._textOffset;
      default:
        return y;
    }
  }
}

// @endif
