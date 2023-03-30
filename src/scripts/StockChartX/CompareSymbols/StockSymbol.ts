/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2019 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import {
  PriceStyle,
  DataSeriesSuffix,
  Plot,
  DataManager,
  ChartPanel,
  Chart,
  IInstrument,
  IBarDataSeries
} from "../index";

export type IStockSymbolConfig = {
  instrument: IInstrument;
  chart: Chart;
};

/**
 * Describes newly Added Symbols.
 * @param {Object} config The configuration object.
 * @param {StockChartX.chart} config.chart The parent chart.
 * @param {StockChartX.IInstrument} config.instrument The parent chart.
 * @constructor StockChartX.StockSymbol
 */
export class StockSymbol {
  /**
   * @internal
   */
  private _dataManager: DataManager;

  /**
   * @internal
   */
  private _name: string;

  /**
   * @internal
   */
  private _chartPanel: ChartPanel;

  get chartPanel(): ChartPanel {
    return this._chartPanel;
  }

  set chartPanel(chartPanel: ChartPanel) {
    this._chartPanel = chartPanel;
  }

  /**
   * @internal
   */
  private _chart: Chart;

  /**
   * @internal
   */
  private _priceStyleKind: string;
  get priceStyleKind() {
    return this._priceStyleKind;
  }
  /**
   * @internal
   */
  private _instrument: IInstrument;

  /**
   * @internal
   */
  private _subscribers: any = {};

  constructor(config: IStockSymbolConfig) {
    this._chart = config.chart;
    this._instrument = config.instrument;
    this._name = this.getSymbolName();
    const panelCount = this._chart.chartPanels.length;
    const heightRatio = 1 / (panelCount + 1);
    this._chartPanel = this._chart.addChartPanel(
      this._chart.chartPanels.length,
      heightRatio
    );
    this._chartPanel.symbol = this;
    this._dataManager = this._chart.dataManager;

    this._priceStyleKind = this._chart.priceStyleKind;

    // Check if dataseries with prefix===this._name exists
    if (
      this._dataManager.getDataSeries(this._name + DataSeriesSuffix.CLOSE) ===
      null
    ) {
      this._dataManager.addBarDataSeries(this._name);
    }

    // Getting new Plot
    const plot = this.getNewPlot(this._priceStyleKind, this._name);
    this._chartPanel.addObjects(plot);

    this._chart.update();
  }

  public on(eventName: string, callback: any) {
    if (!this._subscribers[eventName]) {
      this._subscribers[eventName] = [];
    }
    this._subscribers[eventName].push(callback);
  }

  public appendBars(bars) {
    this._dataManager.appendBarsWithPrefix(this._name, bars);
  }
  public prependBars(bars) {
    this._dataManager.insertBarsWithPrefix(0, bars, this._name);
  }

  public getBarDataSeries(): IBarDataSeries {
    return this._dataManager.barDataSeries(this._name);
  }

  public changePriceStyle(priceStyle: string) {
    this._changePriceStyle(priceStyle, this._name);
  }

  private _changePriceStyle(priceStyleKind: string, name: string) {
    const chartPanel = this._chartPanel;
    const currentPlot = chartPanel.objects[0];
    const newPlot = this.getNewPlot(priceStyleKind, name);

    chartPanel.removeObjects(currentPlot);
    chartPanel.addObjects(newPlot);
    this._priceStyleKind = priceStyleKind;

    // Sets autoscale and updates the chart
    this._chart.setNeedsUpdate(true);
  }

  public getSymbolName() {
    return this._instrument.symbol + "-" + this._instrument.exchange;
  }
  public unsubscribe() {
    if (!this._subscribers.unsubscribe) {
      return;
    }
    this._subscribers.unsubscribe.forEach(callback => {
      callback();
    });
  }

  private getNewPlot(priceStyleKind: string, name: string): Plot {
    const priceStyle = PriceStyle.create(priceStyleKind);
    let plot = (<any>priceStyle).createPlot();

    const dataManager = this._chart.dataManager;

    let dsSuffix = DataSeriesSuffix;

    if (dataManager.getDataSeries(name + dsSuffix.CLOSE) === null) {
      dataManager.addBarDataSeries(name);
    }
    plot.dataSeries = [
      dataManager.getDataSeries(name + dsSuffix.CLOSE),
      dataManager.getDataSeries(name + dsSuffix.OPEN),
      dataManager.getDataSeries(name + dsSuffix.HIGH),
      dataManager.getDataSeries(name + dsSuffix.LOW)
    ];
    return plot;
  }
}
