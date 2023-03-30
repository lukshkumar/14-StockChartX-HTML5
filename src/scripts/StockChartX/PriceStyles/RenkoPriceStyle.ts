import {
  PriceStyle,
  IPriceStyleConfig,
  IPriceStyleOptions,
  IPriceStyleState
} from "../index";
import { BarConverter } from "../index";
import { DataSeriesSuffix } from "../index";
import { Plot } from "../index";
import { BarPlot, IPriceStyleDefaults } from "../index";
import { Notification } from "../../StockChartX.UI/index";
import { PlotType } from "../Utils/PlotType";
import { PriceStyleClassNames } from "../Utils/PriceStyleClassNames";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

// @if SCX_LICENSE = 'full'

/**
 * The renko box size structure.
 * @typedef {object} StockChartX~RenkoBoxSize
 * @type {object}
 * @property {StockChartX.RenkoBoxSizeKind} kind The box size kind (atr or fixed).
 * @property {number} value The box size value.
 * @memberOf StockChartX
 * @example
 *  var boxSize = {
 *      kind: StockChartX.RenkoBoxSizeKind.ATR,
 *      value: 14
 *  };
 */

"use strict";

// region Interfaces

export interface IRenkoBoxSize {
  kind: RenkoBoxSizeKind;
  value: number;
}

export interface IRenkoPriceStyleDefaults extends IPriceStyleDefaults {
  boxSize: IRenkoBoxSize;
}

export interface IRenkoPriceStyleConfig extends IPriceStyleConfig {
  options?: IRenkoPriceStyleOptions;
}

export interface IRenkoPriceStyleOptions extends IPriceStyleOptions {
  boxSize?: IRenkoBoxSize;
}

export interface IRenkoPriceStyleState extends IPriceStyleState {
  options: IRenkoPriceStyleOptions;
}

// endregion

// region Declarations

const MissingTickSizeKey = "notification.instruments.msg.missingTickSize";

/**
 * Renko box size kind enum values.
 * @readonly
 * @enum {string}
 * @memberOf StockChartX
 */
export const RenkoBoxSizeKind = {
  /** The box size is based on fixed value. */
  FIXED: <RenkoBoxSizeKind>"fixed",

  /** The box size is based on ATR value. */
  ATR: <RenkoBoxSizeKind>"atr",

  /** The box size is based on a given amount of tick sizes. */
  POINTS: <RenkoBoxSizeKind>"points"
};
Object.freeze(RenkoBoxSizeKind);
export type RenkoBoxSizeKind = "atr" | "fixed" | "points";

// endregion

/**
 * Represents renko price style.
 * @constructor StockChartX.RenkoPriceStyle
 * @augments StockChartX.PriceStyle
 * @memberOf StockChartX
 */
export class RenkoPriceStyle extends PriceStyle {
  // region Static properties

  static readonly defaults: IRenkoPriceStyleDefaults = {
    boxSize: {
      kind: RenkoBoxSizeKind.ATR,
      value: 20
    }
  };

  static get className(): string {
    return PriceStyleClassNames.RenkoPriceStyle;
  }

  // endregion

  // region Properties

  /**
   * The box size.
   * @name boxSize
   * @type {StockChartX~RenkoBoxSize}
   * @memberOf StockChartX.RenkoPriceStyle#
   */
  get boxSize(): IRenkoBoxSize {
    return (
      (<IRenkoPriceStyleOptions>this._options).boxSize ||
      RenkoPriceStyle.defaults.boxSize
    );
  }

  set boxSize(value: IRenkoBoxSize) {
    (<IRenkoPriceStyleOptions>this._options).boxSize = value;
  }

  /**
   * @internal
   */
  private _boxSizeValue: number;
  /**
   * The calculated box size value.
   * @name boxSizeValue
   * @type {number}
   * @readonly
   * @memberOf StockChartX.RenkoPriceStyle#
   */
  get boxSizeValue(): number {
    return this._boxSizeValue;
  }

  // endregion

  constructor(config?: IRenkoPriceStyleConfig) {
    super(config);
  }

  // endregion

  /**
   * @inheritDoc
   */
  createPlot(): Plot {
    return new BarPlot({
      plotStyle: BarPlot.Style.RENKO,
      plotType: PlotType.PRICE_STYLE
    });
  }

  /**
   * @inheritDoc
   */
  dataSeriesSuffix(): string {
    return DataSeriesSuffix.RENKO;
  }

  /**
   * @inheritDoc
   */
  primaryDataSeriesSuffix(suffix: string): string {
    let psSuffix = super.primaryDataSeriesSuffix(suffix);
    if (psSuffix) return psSuffix;

    switch (suffix) {
      case DataSeriesSuffix.DATE:
      case DataSeriesSuffix.VOLUME:
        return this.dataSeriesSuffix();
      default:
        return "";
    }
  }

  /**
   * @internal
   */
  private _calculateBoxSizeValue(): number {
    let boxSize = this.boxSize,
      instrument = this.chart && this.chart.instrument,
      tickSize = instrument && instrument.tickSize,
      value;

    switch (boxSize.kind) {
      case RenkoBoxSizeKind.ATR:
        value = this._calculateAtr(boxSize.value);
        break;
      case RenkoBoxSizeKind.FIXED:
        value = boxSize.value;
        break;
      case RenkoBoxSizeKind.POINTS:
        if (tickSize) value = boxSize.value * tickSize;

        if (instrument && !tickSize) {
          this.chart
            .localizeText(MissingTickSizeKey, { instrument: instrument.symbol })
            .then(async (text: string) => Notification.error(text));
        }
        break;
      default:
        throw new Error(`Unknown box size kind: ${boxSize.kind}`);
    }

    this._boxSizeValue = value;

    return value;
  }

  /**
   * @inheritDoc
   */
  updateComputedDataSeries() {
    let dataManager = this.chart.dataManager,
      renko = dataManager.barDataSeries(DataSeriesSuffix.RENKO, true);

    let boxSize = this._calculateBoxSizeValue();
    if (!boxSize) return;

    BarConverter.convertToRenko(dataManager.barDataSeries(), boxSize, renko);
  }
}

PriceStyle.register(RenkoPriceStyle);
