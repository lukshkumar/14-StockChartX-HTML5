import {
  PriceStyle,
  IPriceStyleConfig,
  IPriceStyleDefaults,
  IPriceStyleOptions,
  IPriceStyleState
} from "../index";
import { BarConverter } from "../index";
import { DataSeriesSuffix } from "../index";
import { Plot } from "../index";
import { BarPlot } from "../index";
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
 * The kagi reversal amount structure.
 * @typedef {object} StockChartX~KagiReversalAmount
 * @type {object}
 * @property {StockChartX.KagiReversalKind} kind The reversal amount kind (atr or fixed).
 * @property {number} value The reversal amount.
 * @memberOf StockChartX
 * @example
 *  var reversal = {
 *      kind: StockChartX.KagiReversalKind.ATR,
 *      value: 14
 *  };
 */

"use strict";

// region Declarations

const MissingTickSizeKey = "notification.instruments.msg.missingTickSize";

/**
 * Kagi reversal amount kind enum values.
 * @readonly
 * @enum {string}
 * @memberOf StockChartX
 */
export const KagiReversalKind = {
  /** The reversal amount is based on ATR value. */
  ATR: <KagiReversalKind>"atr",

  /** The reversal amount is based on fixed value. */
  FIXED: <KagiReversalKind>"fixed",

  /** The box size is based on a given amount of tick sizes. */
  POINTS: <KagiReversalKind>"points"
};
Object.freeze(KagiReversalKind);
export type KagiReversalKind = "atr" | "fixed" | "points";

// endregion

// region Interfaces

export interface IKagiReversalAmount {
  kind: KagiReversalKind;
  value: number;
}

export interface IKagiPriceStyleConfig extends IPriceStyleConfig {
  options?: IKagiPriceStyleOptions;
}

export interface IKagiPriceStyleDefaults extends IPriceStyleDefaults {
  reversal: IKagiReversalAmount;
}

export interface IKagiPriceStyleOptions extends IPriceStyleOptions {
  reversal: IKagiReversalAmount;
}

export interface IKagiPriceStyleState extends IPriceStyleState {
  options: IKagiPriceStyleOptions;
}

// endregion

/**
 * Represents kagi price style.
 * @constructor StockChartX.KagiPriceStyle
 * @augments StockChartX.PriceStyle
 * @memberOf StockChartX
 */
export class KagiPriceStyle extends PriceStyle {
  // region Static properties

  static readonly defaults: IKagiPriceStyleDefaults = {
    reversal: {
      kind: KagiReversalKind.ATR,
      value: 20
    }
  };

  static get className(): string {
    return PriceStyleClassNames.KagiPriceStyle;
  }

  // endregion

  // region Properties

  /**
   * The reversal amount.
   * @name reversal
   * @type {StockChartX.KagiReversalAmount}
   * @memberOf StockChartX.KagiPriceStyle#
   */
  get reversal(): IKagiReversalAmount {
    return (
      (<IKagiPriceStyleOptions>this._options).reversal ||
      KagiPriceStyle.defaults.reversal
    );
  }

  set reversal(value: IKagiReversalAmount) {
    (<IKagiPriceStyleOptions>this._options).reversal = value;
  }

  /**
   * @internal
   */
  private _reversalValue: number;

  /**
   * The calculated reversal amount value.
   * @name reversalValue
   * @type {number}
   * @memberOf StockChartX.KagiPriceStyle#
   */
  get reversalValue(): number {
    return this._reversalValue;
  }

  // endregion

  constructor(config?: IKagiPriceStyleConfig) {
    super(config);
  }

  /**
   * @inheritDoc
   */
  createPlot(): Plot {
    return new BarPlot({
      plotStyle: BarPlot.Style.KAGI,
      plotType: PlotType.PRICE_STYLE
    });
  }

  /**
   * @inheritDoc
   */
  dataSeriesSuffix(): string {
    return DataSeriesSuffix.KAGI;
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
  private _calculateReversalValue(): number {
    let reversal = this.reversal,
      instrument = this.chart && this.chart.instrument,
      tickSize = instrument && instrument.tickSize,
      value;

    switch (reversal.kind) {
      case KagiReversalKind.ATR:
        value = this._calculateAtr(reversal.value);
        break;
      case KagiReversalKind.FIXED:
        value = reversal.value;
        break;
      case KagiReversalKind.POINTS:
        if (tickSize) value = reversal.value * tickSize;

        if (instrument && !tickSize) {
          this.chart
            .localizeText(MissingTickSizeKey, { instrument: instrument.symbol })
            .then(async (text: string) => Notification.error(text));
        }
        break;
      default:
        throw new Error(`Unknown reversal amount kind: ${reversal.kind}`);
    }

    this._reversalValue = value;

    return value;
  }

  /**
   * @inheritDoc
   */
  updateComputedDataSeries() {
    let dataManager = this.chart.dataManager,
      kagi = dataManager.barDataSeries(DataSeriesSuffix.KAGI, true);

    let reversal = this._calculateReversalValue();
    if (!reversal) return;

    BarConverter.convertToKagi(dataManager.barDataSeries(), reversal, kagi);
  }
}

PriceStyle.register(KagiPriceStyle);

// @endif
