import { PointAndFigurePlot } from "../index";
import { BarConverter } from "../index";
import {
  PriceStyle,
  IPriceStyleConfig,
  IPriceStyleOptions,
  IPriceStyleState
} from "../index";
import { JsUtil } from "../index";
import { Plot } from "../index";
import { BarPlot } from "../index";
import { DataSeriesSuffix, IPriceStyleDefaults } from "../index";
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
 * The point & figure box size structure.
 * @typedef {object} StockChartX~PointAndFigureBoxSize
 * @type {object}
 * @property {StockChartX.PointAndFigureBoxSizeKind} kind The box size kind (atr or fixed).
 * @property {number} value The box size value.
 * @memberOf StockChartX
 * @example
 *  var boxSize = {
 *      kind: StockChartX.PointAndFigureBoxSizeKind.ATR,
 *      value: 14
 *  };
 */

"use strict";

// region Declarations

const MissingTickSizeKey = "notification.instruments.msg.missingTickSize";

/**
 * Point & Figure box size kind enum values.
 * @readonly
 * @enum {string}
 * @memberOf StockChartX
 */
export const PointAndFigureBoxSizeKind = {
  /** The box size is based on ATR value. */
  ATR: <PointAndFigureBoxSizeKind>"atr",

  /** The box size is based on fixed value. */
  FIXED: <PointAndFigureBoxSizeKind>"fixed",

  /** The box size is based on a given amount of tick sizes. */
  POINTS: <PointAndFigureBoxSizeKind>"points"
};
Object.freeze(PointAndFigureBoxSizeKind);
export type PointAndFigureBoxSizeKind = "atr" | "fixed" | "points";

/**
 * The source to be used to calculate point & figure.
 * @name StockChartX~PointAndFigureSource
 * @readonly
 * @enum {string}
 * @memberOf StockChartX
 */
export const PointAndFigureSource = {
  /** Close data series. */
  CLOSE: <PointAndFigureSource>"close",

  /** High/Low data series. */
  HIGH_LOW: <PointAndFigureSource>"highLow"
};
Object.freeze(PointAndFigureSource);
export type PointAndFigureSource = "close" | "highLow";

// endregion

// region Interfaces

export interface IPointAndFigureBoxSize {
  kind: PointAndFigureBoxSizeKind;
  value: number;
}

export interface IPointAndFigurePriceStyleDefaults extends IPriceStyleDefaults {
  source: PointAndFigureSource;
  boxSize: IPointAndFigureBoxSize;
  reversal: number;
}

export interface IPointAndFigurePriceStyleConfig extends IPriceStyleConfig {
  options?: IPointAndFigurePriceStyleOptions;
}

export interface IPointAndFigurePriceStyleOptions extends IPriceStyleOptions {
  boxSize?: IPointAndFigureBoxSize;
  reversal?: number;
  source?: PointAndFigureSource;
}

export interface IPointAndFigurePriceStyleState extends IPriceStyleState {
  options: IPointAndFigurePriceStyleOptions;
}

// endregion

/**
 * Represents point and figure price style.
 * @constructor StockChartX.PointAndFigurePriceStyle
 * @augments StockChartX.PriceStyle
 * @memberOf StockChartX
 */
export class PointAndFigurePriceStyle extends PriceStyle {
  // region Static properties

  static readonly defaults: IPointAndFigurePriceStyleDefaults = {
    source: PointAndFigureSource.CLOSE,
    boxSize: {
      kind: PointAndFigureBoxSizeKind.ATR,
      value: 20
    },
    reversal: 3
  };

  static get className(): string {
    return PriceStyleClassNames.PointAndFigurePriceStyle;
  }

  // endregion

  // region Properties

  /**
   * Price style source.
   * @name source
   * @type {StockChartX~PointAndFigureSource}
   * @memberOf StockChartX.PointAndFigurePriceStyle#
   */
  get source(): PointAndFigureSource {
    return (<IPointAndFigurePriceStyleOptions>this._options).source;
  }

  set source(value: PointAndFigureSource) {
    (<IPointAndFigurePriceStyleOptions>this._options).source = value;
  }

  /**
   * The box size.
   * @name boxSize
   * @type {StockChartX~PointAndFigureBoxSize}
   * @memberOf StockChartX.PointAndFigurePriceStyle#
   */
  get boxSize(): IPointAndFigureBoxSize {
    return (
      (<IPointAndFigurePriceStyleOptions>this._options).boxSize ||
      PointAndFigurePriceStyle.defaults.boxSize
    );
  }

  set boxSize(value: IPointAndFigureBoxSize) {
    (<IPointAndFigurePriceStyleOptions>this._options).boxSize = value;
  }

  /**
   * The reversal amount.
   * @name reversal
   * @type {number}
   * @memberOf StockChartX.PointAndFigurePriceStyle#
   */
  get reversal(): number {
    return (
      (<IPointAndFigurePriceStyleOptions>this._options).reversal ||
      PointAndFigurePriceStyle.defaults.reversal
    );
  }

  set reversal(value: number) {
    if (value != null && !JsUtil.isPositiveNumber(value))
      throw new TypeError("Reversal must be a positive number.");

    (<IPointAndFigurePriceStyleOptions>this._options).reversal = value;
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
   * @memberOf StockChartX.PointAndFigurePriceStyle#
   */
  get boxSizeValue(): number {
    return this._boxSizeValue;
  }

  // endregion

  constructor(config?: IPointAndFigurePriceStyleConfig) {
    super(config);
  }

  // endregion

  /**
   * @inheritDoc
   */
  createPlot(): Plot {
    let plot = new PointAndFigurePlot({
      plotStyle: BarPlot.Style.POINT_AND_FIGURE,
      plotType: PlotType.PRICE_STYLE
    });
    plot.boxSize = this._boxSizeValue;

    return plot;
  }

  /**
   * @inheritDoc
   */
  dataSeriesSuffix(): string {
    return DataSeriesSuffix.POINT_AND_FIGURE;
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
      case PointAndFigureBoxSizeKind.ATR:
        value = this._calculateAtr(boxSize.value);
        break;
      case PointAndFigureBoxSizeKind.FIXED:
        value = boxSize.value;
        break;
      case PointAndFigureBoxSizeKind.POINTS:
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
      pf = dataManager.barDataSeries(DataSeriesSuffix.POINT_AND_FIGURE, true);

    let boxSize = this._calculateBoxSizeValue();
    if (!boxSize) return;

    let plot = <PointAndFigurePlot>this._plot;
    if (plot) plot.boxSize = boxSize;

    BarConverter.convertToPointAndFigure(
      dataManager.barDataSeries(),
      boxSize,
      this.reversal,
      this.source,
      pf
    );
  }
}

PriceStyle.register(PointAndFigurePriceStyle);

// @endif
