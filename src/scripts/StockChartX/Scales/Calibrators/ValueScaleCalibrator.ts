import { JsUtil } from "../../index";
import { ChartPanelValueScale } from "../../index";
import { CustomNumberFormat } from "../../index";
import { IConstructor, ClassRegistrar } from "../../index";
import { IStateProvider } from "../../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

/**
 * The value scale major tick mark structure.
 * @typedef {object} StockChartX~ValueScaleMajorTick
 * @type {object}
 * @property {number} y The Y coordinate of the tick mark.
 * @property {number} value The value.
 * @property {string} text The text representation of the date.
 * @memberOf StockChartX
 */

/**
 * The value scale minor tick mark structure.
 * @typedef {object} StockChartX~ValueScaleMinorTick
 * @type {object}
 * @property {number} y The Y coordinate of the tick mark.
 * @memberOf StockChartX
 */

"use strict";

// region Interfaces

export interface IValueScaleMajorTick {
  y: number;
  value: number;
  text: string;
}

export interface IValueScaleMinorTick {
  y: number;
}

export interface IValueScaleCalibratorConfig {}

export interface IValueScaleCalibratorOptions {
  suffix: string;
  divider: number;
}

export interface IValueScaleCalibratorState {
  className: string;
  options: IValueScaleCalibratorOptions;
}

export interface IValueScaleCalibrator
  extends IStateProvider<IValueScaleCalibratorState> {
  majorTicks: IValueScaleMajorTick[];
  minorTicks: IValueScaleMinorTick[];

  suffix: string;
  divider: number;

  calibrate(valueScale: ChartPanelValueScale);
}

// endregion

/**
 * @internal
 */
class ValueScaleCalibratorRegistrar {
  private static _calibrators = new ClassRegistrar<IValueScaleCalibrator>();

  /**
   * Gets object with information about registered value scale calibrators. Key is class name and value is constructor.
   * @name registeredCalibrators
   * @type {Object}
   * @memberOf StockChartX.ValueScaleCalibrator
   */
  static get registeredCalibrators(): object {
    return this._calibrators.registeredItems;
  }

  /**
   * Registers new value scale calibrator.
   * @method register
   * @param {string} className The unique class name of the value scale calibrator.
   * @param {Function} constructor The constructor.
   * @memberOf StockChartX.ValueScaleCalibrator
   */
  /**
   * Registers new value scale calibrator.
   * @method register
   * @param {Function} type The constructor.
   * @memberOf StockChartX.ValueScaleCalibrator
   */
  static register(type: typeof ValueScaleCalibrator);
  static register(
    className: string,
    constructor: IConstructor<IValueScaleCalibrator>
  );
  static register(
    typeOrClassName: string | typeof ValueScaleCalibrator,
    constructor?: IConstructor<IValueScaleCalibrator>
  ) {
    if (typeof typeOrClassName === "string")
      this._calibrators.register(typeOrClassName, constructor);
    else
      this._calibrators.register(typeOrClassName.className, <
        IConstructor<IValueScaleCalibrator>
      >(<any>typeOrClassName));
  }

  /**
   * Deserializes value scale calibrator.
   * @method deserialize
   * @param {Object} state The state of date scale calibrator.
   * @returns {IValueScaleCalibrator}
   * @memberOf StockChartX.ValueScaleCalibrator
   */
  static deserialize(state: IValueScaleCalibratorState): IValueScaleCalibrator {
    if (!state) return null;

    let calibrator = this._calibrators.createInstance(state.className);
    calibrator.loadState(state);

    return calibrator;
  }
}

/**
 * The abstract base class for value scale calibrators.
 * @constructor StockChartX.ValueScaleCalibrator
 */
export abstract class ValueScaleCalibrator implements IValueScaleCalibrator {
  static get className(): string {
    return "";
  }

  // region ValueScaleCalibratorRegistrar mixin

  static registeredCalibrators: object;
  static register: (
    typeOrClassName: string | typeof ValueScaleCalibrator,
    constructor?: IConstructor<IValueScaleCalibrator>
  ) => void;
  static deserialize: (
    state: IValueScaleCalibratorState
  ) => IValueScaleCalibrator;

  // endregion

  // region Properties

  /**
   * @internal
   */
  private _majorTicks: IValueScaleMajorTick[] = [];

  /**
   * Returns an array of major ticks.
   * @name majorTicks
   * @type {StockChartX~ValueScaleMajorTick[]}
   * @memberOf StockChartX.ValueScaleCalibrator#
   */
  get majorTicks(): IValueScaleMajorTick[] {
    return this._majorTicks;
  }

  /**
   * @internal
   */
  private _minorTicks: IValueScaleMinorTick[] = [];

  /**
   * Returns an array of minor ticks.
   * @name minorTicks
   * @type {StockChartX~ValueScaleMinorTick[]}
   * @memberOf StockChartX.ValueScaleCalibrator#
   */
  get minorTicks(): IValueScaleMinorTick[] {
    return this._minorTicks;
  }

  /**
   * Gets/Sets divider for ValueScaleCalibrator
   * @name divider
   * @type {number}
   * @memberOf StockChartX.ValueScaleCalibrator#
   */
  get divider(): number {
    return this._options.divider;
  }

  set divider(value: number) {
    this._options.divider = value;
  }

  /**
   * Gets/Sets suffix for ValueScaleCalibrator
   * @name suffix
   * @type {string}
   * @memberOf StockChartX.ValueScaleCalibrator#
   */
  get suffix(): string {
    return this._options.suffix;
  }

  set suffix(value: string) {
    this._options.suffix = value;
  }

  /**
   * @internal
   */
  protected _options: IValueScaleCalibratorOptions = <
    IValueScaleCalibratorOptions
  >{};

  /**
   * @internal
   */
  private _formatter: CustomNumberFormat;

  // endregion

  constructor(config?: IValueScaleCalibratorConfig) {
    if (config) {
      this.loadState(<IValueScaleCalibratorState>{ options: config });
    }

    this._formatter = new CustomNumberFormat("%.2f");
  }

  /**
   * Calibrates value scale.
   * @method calibrate
   * @param {StockChartX.ChartPanelValueScale} valueScale The value scale.
   * @memberOf StockChartX.ValueScaleCalibrator#
   */
  calibrate(valueScale: ChartPanelValueScale) {
    this._majorTicks.length = 0;
    this._minorTicks.length = 0;

    if (this._calibrateMajorTicks) this._calibrateMajorTicks(valueScale);
    this._calibrateMinorTicks();
  }

  /**
   * Returns string representation of a given value according to options(divider and suffix).
   * @method formatValue
   * @param {StockChartX.ValueScaleCalibrator} value The value to be formatted.
   * @return {string}
   * @memberOf StockChartX.ValueScaleCalibrator#
   */
  formatValue(value: number): string {
    return (
      this._formatter.format(value / this._options.divider) +
      this._options.suffix
    );
  }

  /**
   * @internal
   */
  protected abstract _calibrateMajorTicks?(valueScale: ChartPanelValueScale);

  /**
   * @internal
   */
  protected _calibrateMinorTicks(ticksCount?: number) {
    if (!ticksCount) return;

    let majorTicks = this.majorTicks;

    for (let i = 0, count = majorTicks.length; i < count - 1; i++) {
      let tick1 = majorTicks[i],
        tick2 = majorTicks[i + 1],
        width = (tick2.y - tick1.y) / (ticksCount + 1);

      for (let j = 1; j <= ticksCount; j++) {
        this.minorTicks.push({
          y: Math.round(tick1.y + j * width)
        });
      }
    }
  }

  // region IStateProvider

  /**
   * Saves calibrator's state.
   * @method saveState
   * @returns {object} The state.
   * @memberOf StockChartX.ValueScaleCalibrator#
   * @see [loadState]{@linkcode StockChartX.ValueScaleCalibrator#loadState}
   */
  saveState(): IValueScaleCalibratorState {
    return {
      className: (<any>this.constructor).className,
      options: JsUtil.clone(this._options)
    };
  }

  /**
   * Restores calibrator's state.
   * @method loadState
   * @param {object} state The state.
   * @memberOf StockChartX.ValueScaleCalibrator#
   * @see [saveState]{@linkcode StockChartX.ValueScaleCalibrator#saveState}
   */
  loadState(state: IValueScaleCalibratorState) {
    this._options =
      (state && JsUtil.clone(state.options)) ||
      <IValueScaleCalibratorOptions>{};
  }

  // endregion
}

JsUtil.applyMixins(ValueScaleCalibrator, [ValueScaleCalibratorRegistrar]);
