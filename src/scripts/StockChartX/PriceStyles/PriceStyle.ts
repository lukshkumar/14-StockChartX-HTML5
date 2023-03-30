/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { JsUtil } from "../index";
import { ClassRegistrar, IConstructor } from "../index";
import { ChartComponent } from "../index";
import { IChartComponent, IChartComponentConfig } from "../index";
import { ChartPanel } from "../index";
import { IDestroyable } from "../index";
import { IStateProvider } from "../index";
import { Plot } from "../index";
import {
  TAIndicator,
  DataSeriesSuffix,
  IndicatorField,
  DataSeries
} from "../index";
import { IndicatorParam } from "../Indicators/utils";
import { AverageTrueRange } from "../../TASdk/exporter";
"use strict";

// region Interfaces

export interface IPriceStyle
  extends IChartComponent,
    IStateProvider<IPriceStyleState>,
    IDestroyable {
  readonly className: string;
  readonly chartPanel: ChartPanel;
  showValueLines: boolean;
  extendValueLines: boolean;

  primaryDataSeriesSuffix(suffix: string): string;
  updateComputedDataSeries();
  apply(autoScale?: boolean);
}

export interface IPriceStyleConfig extends IChartComponentConfig {
  options?: IPriceStyleOptions;
}

export interface IPriceStyleDefaults {
  showValueLines?: boolean;
  extendValueLines?: boolean;
}

export interface IPriceStyleOptions {
  showValueLines?: boolean;
  extendValueLines?: boolean;
}

export interface IPriceStyleState {
  readonly className: string;
  options: IPriceStyleOptions;
}

// endregion

class PriceStyleRegistrar {
  /**
   * @internal
   */
  private static _priceStyles = new ClassRegistrar<IPriceStyle>();

  /**
   * Gets object with information about registered price styles. Key is class name and value is constructor.
   * @name registeredPriceStyles.
   * @type {Object}
   * @memberOf StockChartX.PriceStyle
   */
  static get registeredPriceStyles(): object {
    return this._priceStyles.registeredItems;
  }

  /**
   * Registers new price style.
   * @method register
   * @param {string} className The unique class name of the price style.
   * @param {Function} constructor The constructor.
   * @memberOf StockChartX.PriceStyle
   */
  /**
   * Registers new price style.
   * @method register
   * @param {Function} type The constructor.
   * @memberOf StockChartX.PriceStyle
   */
  static register(type: typeof PriceStyle);
  static register(className: string, constructor: IConstructor<IPriceStyle>);
  static register(
    typeOrClassName: string | typeof PriceStyle,
    constructor?: IConstructor<IPriceStyle>
  ) {
    if (typeof typeOrClassName === "string")
      this._priceStyles.register(typeOrClassName, constructor);
    else
      this._priceStyles.register(typeOrClassName.className, <
        IConstructor<IPriceStyle>
      >(<any>typeOrClassName));
  }

  /**
   * Creates price style instance.
   * @param {string} className The class name of price style.
   * @returns {IPriceStyle}
   * @memberOf StockChartX.PriceStyle
   */
  static create(className: string): IPriceStyle {
    return this._priceStyles.createInstance(className);
  }

  /**
   * Deserializes price style.
   * @method deserialize
   * @param {Object} state The state of price style.
   * @returns {IPriceStyle}
   * @memberOf StockChartX.PriceStyle
   */
  static deserialize(state: IPriceStyleState): IPriceStyle {
    if (!state) return null;

    let priceStyle = this._priceStyles.createInstance(state.className);
    priceStyle.loadState(state);

    return priceStyle;
  }
}

/**
 * The base class for price styles.
 * @constructor StockChartX.PriceStyle
 * @memberOf StockChartX
 */
/**
 * Creates plot object for the price style.
 * @method createPlot
 * @returns {StockChartX.Plot}
 * @memberOf StockChartX.PriceStyle#
 * @protected
 */
export abstract class PriceStyle extends ChartComponent implements IPriceStyle {
  static get className(): string {
    return "";
  }

  // region PriceStyleRegistrar mixin

  static registeredPriceStyles: object;
  static register: (
    typeOrClassName: string | typeof PriceStyle,
    constructor?: IConstructor<IPriceStyle>
  ) => void;
  static create: (className: string) => IPriceStyle;
  static deserialize: (state: IPriceStyleState) => IPriceStyle;

  static defaults: IPriceStyleDefaults = {
    showValueLines: false,
    extendValueLines: false
  };

  // endregion

  // region Properties

  /**
   * @internal
   */
  get className(): string {
    return (<any>this.constructor).className;
  }

  /**
   * @internal
   */
  protected _plot: Plot;

  /**
   * The price style plot.
   * @name plot
   * @type {StockChartX.Plot}
   * @readonly
   * @memberOf StockChartX.PriceStyle#
   */
  get plot(): Plot {
    return this._plot;
  }

  /**
   * The chart panel.
   * @name mainPanel
   * @type {StockChartX.ChartPanel}
   * @readonly
   * @memberOf StockChartX.PriceStyle#
   */
  get chartPanel(): ChartPanel {
    return this._plot && this._plot.chartPanel;
  }

  /**
   * @internal
   */
  protected _options: IPriceStyleOptions = <IPriceStyleOptions>{};

  /**
   * Gets/Sets the flag that indicates whether value lines are visible.
   * @name showValueLines
   * @type {boolean}
   * @memberOf StockChartX.PriceStyle#
   */
  get showValueLines(): boolean {
    let value = this._options.showValueLines;

    return value != null ? value : PriceStyle.defaults.showValueLines;
  }

  set showValueLines(value: boolean) {
    this._options.showValueLines = value;

    this._updatePlot();
  }

  /**
   * Gets/Sets the flag that indicates whether value lines are extended.
   * @name extendValueLines
   * @returns {boolean}
   * @memberOf StockChartX.PriceStyle#
   */
  get extendValueLines(): boolean {
    let value = this._options.extendValueLines;

    return value != null ? value : PriceStyle.defaults.extendValueLines;
  }

  set extendValueLines(value: boolean) {
    this._options.extendValueLines = value;
    this._updatePlot();
  }

  // endregion

  constructor(config?: IPriceStyleConfig) {
    super(config);

    if (config) {
      this.chart = config.chart;
      let state = <IPriceStyleState>{
        className: "",
        options: config.options
      };
      this.loadState(state);
    }
  }

  /**
   * @inheritDoc
   */
  protected _onChartChanging() {
    this.destroy();
  }

  protected _updatePlot() {
    let plot = this.plot;

    if (!plot) return;

    plot.showValueLines = this.showValueLines;
    plot.extendValueLines = this.extendValueLines;
  }

  // region IStateProvider members

  /**
   * Saves price style state.
   * @method saveState
   * @returns {object} The state.
   * @memberOf StockChartX.PriceStyle#
   * @see [loadState]{@linkcode StockChartX.PriceStyle#loadState}
   */
  saveState(): IPriceStyleState {
    return {
      className: (<any>this.constructor).className,
      options: JsUtil.clone(this._options)
    };
  }

  /**
   * Restores price style state.
   * @method loadState
   * @param {object} state The state.
   * @memberOf StockChartX.PriceStyle#
   * @see [saveState]{@linkcode StockChartX.PriceStyle#saveState}
   */
  loadState(state: IPriceStyleState) {
    this._options =
      (state && JsUtil.clone(state.options)) || <IPriceStyleOptions>{};
  }

  // endregion

  apply(autoScale: boolean = true) {
    let chart = this.chart;
    if (!chart) return;

    let plot = this._plot;
    if (!plot) {
      this._plot = plot = this.createPlot();
      this._updatePlot();
    }

    if (!plot) throw new Error("Price style plot is not created.");

    this.updateComputedDataSeries();
    chart.updateIndicators();

    let dsSuffix = DataSeriesSuffix;
    plot.dataSeries = [
      chart.primaryDataSeries(dsSuffix.CLOSE),
      chart.primaryDataSeries(dsSuffix.OPEN),
      chart.primaryDataSeries(dsSuffix.HIGH),
      chart.primaryDataSeries(dsSuffix.LOW)
    ];

    chart.mainPanel.addPlot(plot);
    if (autoScale) chart.mainPanel.setNeedsAutoScale();
    chart.setNeedsUpdate();
  }

  protected abstract createPlot(): Plot;

  /**
   * Returns data series suffix which should be used to get primary data series.
   * @method dataSeriesSuffix
   * @returns {string}
   * @memberOf StockChartX.PriceStyle#
   */
  dataSeriesSuffix(): string {
    return "";
  }

  /**
   * Returns primary data series suffix.
   * @method primaryDataSeriesSuffix
   * @param {string} suffix The requesting data series suffix.
   * @returns {string}
   * @memberOf StockChartX.PriceStyle#
   */
  primaryDataSeriesSuffix(suffix: string): string {
    let dsSuffix = DataSeriesSuffix;

    switch (suffix) {
      case dsSuffix.OPEN:
      case dsSuffix.HIGH:
      case dsSuffix.LOW:
      case dsSuffix.CLOSE:
        return this.dataSeriesSuffix();
      default:
        return "";
    }
  }

  /**
   * @internal
   */
  protected removeComputedDataSeries() {
    let chart = this.chart;
    if (!chart) return;

    let psSuffix = this.dataSeriesSuffix(),
      dsSuffix = DataSeriesSuffix;

    if (!psSuffix) return;

    chart.removeDataSeries(psSuffix + dsSuffix.DATE);
    chart.removeDataSeries(psSuffix + dsSuffix.OPEN);
    chart.removeDataSeries(psSuffix + dsSuffix.HIGH);
    chart.removeDataSeries(psSuffix + dsSuffix.LOW);
    chart.removeDataSeries(psSuffix + dsSuffix.CLOSE);
    chart.removeDataSeries(psSuffix + dsSuffix.VOLUME);
  }

  /**
   * Updates computed data series.
   * Some price styles use their own OHLC values (like P&F, Kagi, ...).
   * @method updateComputedDataSeries
   * @memberOf StockChartX.PriceStyle#
   */
  updateComputedDataSeries() {}

  /**
   * @internal
   */
  protected _calculateAtr(period: number): number {
    let atr = new TAIndicator({
      taIndicator: AverageTrueRange,
      chart: this.chart
    });
    atr.setParameterValue(IndicatorParam.PERIODS, period);
    atr._usePrimaryDataSeries = false;

    let res = atr.calculate();
    if (!res.recordSet) return null;
    let field = res.recordSet.getField(IndicatorField.INDICATOR);
    if (!field) return null;
    let atrDataSeries = DataSeries.fromField(field, res.startIndex);
    let value = <number>atrDataSeries.lastValue;
    if (!value) return null;

    return Math.roundToDecimals(value, 5);
  }

  // region IDestroyable members

  /**
   * Destroys price style.
   * @method destroy
   * @memberOf StockChartX.PriceStyle#
   */
  destroy() {
    let plot = this._plot,
      panel = plot && plot.chartPanel;

    if (panel) panel.removePlot(plot);

    this.removeComputedDataSeries();
  }

  // endregion
}

JsUtil.applyMixins(PriceStyle, [PriceStyleRegistrar]);
