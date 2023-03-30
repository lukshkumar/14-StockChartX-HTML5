/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

/**
 * The date scale major tick mark structure.
 * @typedef {object} StockChartX~DateScaleMajorTick
 * @type {object}
 * @property {number} x The x coordinate of the tick mark.
 * @property {Date} date The date value.
 * @property {number} textX The x coordinate of the tick mark text.
 * @property {string} text The text representation of the date.
 * @memberOf StockChartX
 */

/**
 * The date scale minor tick mark structure.
 * @typedef {object} StockChartX~DateScaleMinorTick
 * @type {object}
 * @property {number} x The x coordinate of the tick mark.
 * @memberOf StockChartX
 */

"use strict";
import { JsUtil, DateScale } from "../../index";
import { IStateProvider } from "../../index";
import { ClassRegistrar, IConstructor } from "../../index";
// region Properties

export interface IDateScaleMajorTick {
  x: number;
  date: Date;
  textX: number;
  textAlign: string;
  text: string;
}

export interface IDateScaleMinorTick {
  x: number;
}

export interface IDateScaleCalibratorConfig {}

export interface IDateScaleCalibratorOptions {}

export interface IDateScaleCalibratorState {
  className: string;
  options: IDateScaleCalibratorOptions;
}

export interface IDateScaleCalibrator
  extends IStateProvider<IDateScaleCalibratorState> {
  majorTicks: IDateScaleMajorTick[];
  minorTicks: IDateScaleMinorTick[];

  calibrate(dateScale: DateScale);
}

// endregion

// region Declarations

export type CustomFormat = (
  calibrator: DateScaleCalibrator,
  labelIndex: number,
  date: Date
) => string;
export type CustomFormatter = (
  calibrator: DateScaleCalibrator,
  labelIndex: number,
  date: Date
) => string;

// endregion

/**
 * @internal
 */
class DateScaleCalibratorRegistrar {
  private static _calibrators = new ClassRegistrar<IDateScaleCalibrator>();

  /**
   * Gets object with information about registered date scale calibrators. Key is class name and value is constructor.
   * @name registeredCalibrators.
   * @type {Object}
   * @memberOf StockChartX.DateScaleCalibrator
   */
  static get registeredCalibrators(): object {
    return this._calibrators.registeredItems;
  }

  /**
   * Registers new date scale calibrator.
   * @method register
   * @param {string} className The unique class name of the date scale calibrator.
   * @param {Function} constructor The constructor.
   * @memberOf StockChartX.DateScaleCalibrator
   */
  /**
   * Registers new date scale calibrator.
   * @method register
   * @param {Function} type The constructor.
   * @memberOf StockChartX.DateScaleCalibrator
   */
  static register(type: typeof DateScaleCalibrator);
  static register(
    className: string,
    constructor: IConstructor<IDateScaleCalibrator>
  );
  static register(
    typeOrClassName: string | typeof DateScaleCalibrator,
    constructor?: IConstructor<IDateScaleCalibrator>
  ) {
    if (typeof typeOrClassName === "string")
      this._calibrators.register(typeOrClassName, constructor);
    else
      this._calibrators.register(typeOrClassName.className, <
        IConstructor<IDateScaleCalibrator>
      >(<any>typeOrClassName));
  }

  /**
   * Deserializes date scale calibrator.
   * @method deserialize
   * @param {Object} state The state of date scale calibrator.
   * @returns {IDateScaleCalibrator}
   * @memberOf StockChartX.DateScaleCalibrator
   */
  static deserialize(state: IDateScaleCalibratorState): IDateScaleCalibrator {
    if (!state) return null;

    let calibrator = this._calibrators.createInstance(state.className);
    calibrator.loadState(state);

    return calibrator;
  }
}

/**
 * The abstract base class for date scale calibrators.
 * @constructor StockChartX.DateScaleCalibrator
 */
export abstract class DateScaleCalibrator implements IDateScaleCalibrator {
  static get className(): string {
    return "";
  }

  /**
   * @internal
   */
  private _showVirtualDates: boolean = true;

  get showVirtualDates(): boolean {
    return this._showVirtualDates;
  }

  set showVirtualDates(value: boolean) {
    this._showVirtualDates = value;
  }

  // region DateScaleCalibratorRegistrar mixin

  static registeredCalibrators: object;
  static register: (
    typeOrClassName: string | typeof DateScaleCalibrator,
    constructor?: IConstructor<IDateScaleCalibrator>
  ) => void;
  static deserialize: (
    state: IDateScaleCalibratorState
  ) => IDateScaleCalibrator;

  // endregion

  // region Properties

  /**
   * @internal
   */
  private _majorTicks: IDateScaleMajorTick[] = [];

  /**
   * Returns an array of date scale major ticks.
   * @name majorTicks
   * @type {StockChartX~DateScaleMajorTick}
   * @memberOf StockChartX.DateScaleCalibrator#
   */
  get majorTicks(): IDateScaleMajorTick[] {
    return this._majorTicks;
  }

  /**
   * @internal
   */
  private _minorTicks: IDateScaleMinorTick[] = [];

  /**
   * Returns an array of date scale minor ticks.
   * @name minorTicks
   * @type {StockChartX~DateScaleMinorTick}
   * @memberOf StockChartX.DateScaleCalibrator#
   */
  get minorTicks(): IDateScaleMinorTick[] {
    return this._minorTicks;
  }

  /**
   * @internal
   */
  protected _options: IDateScaleCalibratorOptions = {};

  // endregion

  constructor(config?: IDateScaleCalibratorConfig) {
    if (config) {
      this.loadState(<IDateScaleCalibratorState>{ options: config });
    }
  }

  /**
   * Calibrates date scale.
   * @method calibrate
   * @param {StockChartX.DateScale} dateScale The date scale.
   * @memberOf StockChartX.DateScaleCalibrator#
   */
  calibrate(dateScale: DateScale) {
    this._majorTicks.length = 0;
    this._minorTicks.length = 0;

    if (this._calibrateMajorTicks) this._calibrateMajorTicks(dateScale);
    this._calibrateMinorTicks();
  }

  protected abstract _calibrateMajorTicks?(dateScale: DateScale);

  /**
   * @internal
   */
  protected _calibrateMinorTicks(ticksCount?: number) {
    if (!ticksCount) return;

    let majorTicks = this.majorTicks;

    for (let i = 0, count = majorTicks.length; i < count - 1; i++) {
      let tick1 = majorTicks[i],
        tick2 = majorTicks[i + 1],
        width = (tick2.x - tick1.x) / (ticksCount + 1);

      for (let j = 1; j <= ticksCount; j++) {
        this.minorTicks.push({
          x: Math.round(tick1.x + j * width)
        });
      }
    }
  }

  // region IStateProvider

  /**
   * Saves calibrator's state.
   * @method saveState
   * @returns {object} The state.
   * @memberOf StockChartX.DateScaleCalibrator#
   * @see [loadState]{@linkcode StockChartX.DateScaleCalibrator#loadState}
   */
  saveState(): IDateScaleCalibratorState {
    return {
      className: (<any>this.constructor).className,
      options: JsUtil.clone(this._options)
    };
  }

  /**
   * Restores calibrator's state.
   * @method loadState
   * @param {object} state The state.
   * @memberOf StockChartX.DateScaleCalibrator#
   * @see [saveState]{@linkcode StockChartX.DateScaleCalibrator#saveState}
   */
  loadState(state: IDateScaleCalibratorState) {
    this._options = (state && JsUtil.clone(state.options)) || {};
  }

  // endregion
}

JsUtil.applyMixins(DateScaleCalibrator, [DateScaleCalibratorRegistrar]);
