/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

// region Structures

/**
 * The bar structure.
 * @typedef {object} StockChartX~Bar
 * @type {object}
 * @property {Date} date The timestamp of the bar.
 * @property {number} open The open price.
 * @property {number} high The high price.
 * @property {number} low The low price.
 * @property {number} close The close price.
 * @property {number} volume The volume.
 * @memberOf StockChartX
 */

/**
 * The bar data series object.
 * @typedef {object} StockChartX~BarDataSeries
 * @type {object}
 * @property {StockChartX.DataSeries} date The date data series.
 * @property {StockChartX.DataSeries} open The open data series.
 * @property {StockChartX.DataSeries} high The high data series.
 * @property {StockChartX.DataSeries} low The low data series.
 * @property {StockChartX.DataSeries} close The close data series.
 * @property {StockChartX.DataSeries} volume The volume data series.
 * @memberOf StockChartX
 */

/**
 * The OHLC data series object.
 * @typedef {object} StockChartX~OHLCDataSeries
 * @type {object}
 * @property {StockChartX.DataSeries} open The open data series.
 * @property {StockChartX.DataSeries} high The high data series.
 * @property {StockChartX.DataSeries} low The low data series.
 * @property {StockChartX.DataSeries} close The close data series.
 * @memberOf StockChartX
 */

// endregion
import { JsUtil, DataSeries, DataSeriesSuffix } from "../index";
"use strict";

// region Interfaces

export interface IBar {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IOHLCDataSeries {
  open: DataSeries;
  high: DataSeries;
  low: DataSeries;
  close: DataSeries;
}

export interface IBarDataSeries extends IOHLCDataSeries {
  date: DataSeries;
  volume: DataSeries;
}

// endregion

/**
 * Represents data manager that contains data series.
 * @constructor StockChartX.DataManager
 */
export class DataManager {
  // region Private members

  /**
   * An object that contains data series.
   * @name _dataSeries
   * @type {Object}
   * @memberOf StockChartX.DataManager#
   * @private
   * @internal
   */
  private _dataSeries: object = {};

  // endregion

  // region Properties

  /**
   * Returns date data series.
   * @name dateDataSeries
   * @type {StockChartX.DataSeries}
   * @readonly
   * @memberOf StockChartX.DataManager#
   * @example
   * var dateDataSeries = dataManager.dateDataSeries;
   */
  get dateDataSeries(): DataSeries {
    return this.getDataSeries(DataSeriesSuffix.DATE);
  }

  // endregion

  // region Search

  /**
   * Finds data series with a given suffix.
   * @method findDataSeries
   * @param {String} suffix The data series suffix.
   * @returns {StockChartX.DataSeries}
   * @memberOf StockChartX.DataManager#
   * @example
   * var dataSeries = dataManager.findDataSeries(StockChartX.DataSeriesSuffix.OPEN);
   */
  findDataSeries(suffix: string): DataSeries {
    let series: any = this._dataSeries;

    for (let prop in series) {
      if (series.hasOwnProperty(prop)) {
        let pos = prop.lastIndexOf(suffix);
        if (pos >= 0 && pos === prop.length - suffix.length)
          return series[prop];
      }
    }

    return null;
  }

  /**
   * Returns data series with a given name.
   * @method getDataSeries
   * @param {String} name The data series name.
   * @param {boolean} [addIfNotFound = false]
   * @returns {StockChartX.DataSeries}
   * @memberOf StockChartX.DataManager#
   * @example
   * var dataSeries = dataManager.getDataSeries("OpenInterest");
   */
  getDataSeries(name: string, addIfNotFound: boolean = false): DataSeries {
    let dataSeries = this._dataSeries[name];

    if (dataSeries) return dataSeries;

    return addIfNotFound ? this.addDataSeries(name) : null;
  }

  /**
   * Returns index of value by a given date.
   * @param {Date} date The search date.
   * @returns {number} Index of value at the specified date or null if date not found.
   * @since 2.15.6
   */
  indexByDate(date: Date): number {
    let dateDataSeries = this.dateDataSeries;
    if (!dateDataSeries) return null;

    let index = dateDataSeries.binaryIndexOf(date);

    return index >= 0 ? index : null;
  }

  // endregion

  // region Clearing

  /**
   * Removes all values from a given data series. Clears all values in all data series if parameter is omitted.
   * @method clearDataSeries
   * @param {String | StockChartX.DataSeries} [dataSeries] The data series name or data series object.
   * @memberOf StockChartX.DataManager#
   * @example
   * // clears all data series
   * dataManager.clearDataSeries();
   *
   * // clears 'OpenInterest' data series.
   * dataManager.clearDataSeries("OpenInterest");
   *
   * // clears date data series.
   * dataManager.clearDataSeries(dataManager.dateDataSeries);
   */
  clearDataSeries(dataSeries?: string | DataSeries): void {
    let series;

    if (!dataSeries) {
      // Clear all data series if argument is not specified.
      series = this._dataSeries;
      for (let prop in series) {
        if (series.hasOwnProperty(prop)) series[prop].clear();
      }
    } else if (typeof dataSeries === "string") {
      // Clear data series with a given name.
      series = this.getDataSeries(dataSeries);
      if (series) series.clear();
    } else {
      // Clear given data series.
      dataSeries.clear();
    }
  }

  /**
   * Trims all data series to a given maximum length.
   * @method trimDataSeries
   * @param {number} maxLength The new maximum length of data series.
   * @memberOf StockChartX.DataManager#
   * @example
   * // Trim all data series to contain 10 values maximum.
   * dataManager.trimDataSeries(10);
   */
  trimDataSeries(maxLength: number): void {
    let series: any = this._dataSeries;

    for (let prop in series) {
      if (series.hasOwnProperty(prop)) {
        series[prop].trim(maxLength);
      }
    }
  }

  // endregion

  // region Bar & OHLC data series routines

  /**
   * Creates bar data series (date, open, high, low, close, volume);
   * @method addBarDataSeries
   * @param {String} [symbol] The symbol name.
   * @memberOf StockChartX.DataManager#
   * @returns {StockChartX~BarDataSeries} Object that contains all data series.
   * @example
   * var dataSeries = dataManager.addBarDataSeries();
   * or
   * var dataSeries = dataManager.addBarDataSeries('AAPL');
   */
  addBarDataSeries(symbol: string = ""): IBarDataSeries {
    let dsSuffix = DataSeriesSuffix;
    return {
      date: this.addDataSeries(symbol + dsSuffix.DATE),
      open: this.addDataSeries(symbol + dsSuffix.OPEN),
      high: this.addDataSeries(symbol + dsSuffix.HIGH),
      low: this.addDataSeries(symbol + dsSuffix.LOW),
      close: this.addDataSeries(symbol + dsSuffix.CLOSE),
      volume: this.addDataSeries(symbol + dsSuffix.VOLUME)
    };
  }

  /**
   * Returns bar data series.
   * @method barDataSeries
   * @param {string} [prefix] The data series prefix. It can be symbol (like 'aapl') or price style prefix (like '.kagi').
   * @param {boolean} [createIfNotFound = false] The flag that indicates whether data series should be created if it is not found.
   * @returns {StockChartX~BarDataSeries} An object with bar data series.
   * @memberOf StockChartX.DataManager#
   * @example
   * var obj = dataManager.barDataSeries();
   * var dates = obj.date;
   * var opens = obj.open
   * var highs = obj.high;
   * var lows = obj.low;
   * var closes = obj.close;
   * var volumes = obj.volume;
   */
  barDataSeries(
    prefix: string = "",
    createIfNotFound: boolean = false
  ): IBarDataSeries {
    let dsSuffix = DataSeriesSuffix;

    return {
      date: this.getDataSeries(prefix + dsSuffix.DATE, createIfNotFound),
      open: this.getDataSeries(prefix + dsSuffix.OPEN, createIfNotFound),
      high: this.getDataSeries(prefix + dsSuffix.HIGH, createIfNotFound),
      low: this.getDataSeries(prefix + dsSuffix.LOW, createIfNotFound),
      close: this.getDataSeries(prefix + dsSuffix.CLOSE, createIfNotFound),
      volume: this.getDataSeries(prefix + dsSuffix.VOLUME, createIfNotFound)
    };
  }

  /**
   * Returns open, high, low, close data series.
   * @method ohlcDataSeries
   * @param {string} [prefix] The data series prefix. It can be symbol (like 'aapl') or price style prefix (like '.kagi').
   * @param {boolean} [createIfNotFound = false] The flag that indicates whether data series should be created if it is not found.
   * @returns {StockChartX~OHLCDataSeries}
   * @memberOf StockChartX.DataManager#
   * @example
   * var obj = dataManager.ohlcDataSeries();
   * var opens = obj.open
   * var highs = obj.high;
   * var lows = obj.low;
   * var closes = obj.close;
   */
  ohlcDataSeries(
    prefix: string = "",
    createIfNotFound: boolean = false
  ): IOHLCDataSeries {
    let dsSuffix = DataSeriesSuffix;

    return {
      open: this.getDataSeries(prefix + dsSuffix.OPEN, createIfNotFound),
      high: this.getDataSeries(prefix + dsSuffix.HIGH, createIfNotFound),
      low: this.getDataSeries(prefix + dsSuffix.LOW, createIfNotFound),
      close: this.getDataSeries(prefix + dsSuffix.CLOSE, createIfNotFound)
    };
  }

  // endregion

  // region Add/Remove data series

  /**
   * Adds data series into the data manager.
   * If you specify data series name a new data series will be created and added.
   * @method addDataSeries
   * @param {String | StockChartX.DataSeries} dataSeries The data series name or data series object.
   * @param {Boolean} [replaceIfExists = false] The flag that indicates whether data series with the same name should be replaced.
   * @returns {StockChartX.DataSeries} The data series that has been added.
   * @throws Error if data series with the same name already exists and replaceIfExists set to false.
   * @memberOf StockChartX.DataManager#
   * @example
   * // Add new data series.
   * dataManager.addDataSeries(new StockChartX.DataSeries("OpenInterest"));
   *
   * // Add new data series with a given name.
   * dataManager.addDataSeries("OpenInterest");
   *
   * // Add/Replace data series with a given name.
   * dataManager.addDataSeries("Open Interest", true);
   */
  addDataSeries(
    dataSeries: string | DataSeries,
    replaceIfExists: boolean = false
  ): DataSeries {
    if (!dataSeries) throw new Error("Data series is not specified.");

    if (typeof dataSeries === "string") {
      return this.addDataSeries(new DataSeries(dataSeries), replaceIfExists);
    }

    if (!(dataSeries instanceof DataSeries))
      throw new TypeError(
        "Invalid data series. Name or data series object expected."
      );

    let name = (<DataSeries>dataSeries).name;
    if (!name || typeof name !== "string")
      throw new TypeError("Data series name must be non-empty string.");

    if (this.getDataSeries(name) && !replaceIfExists)
      throw new Error(`Data series '${name}' already exists.`);

    this._dataSeries[name] = dataSeries;

    return <DataSeries>dataSeries;
  }

  /**
   * Removes specified data series. Or removes all data series if parameter is omitted.
   * @method removeDataSeries
   * @param {String | StockChartX.DataSeries} [dataSeries] The data series object or data series name.
   * @memberOf StockChartX.DataManager#
   * @example
   * // Remove all data series.
   * dataManager.removeDataSeries();
   *
   * // Remove 'OpenInterest' data series.
   * dataManager.removeDataSeries('OpenInterest');
   *
   * // Remove date data series.
   * dataManager.removeDataSeries(dataManager.dateDataSeries);
   */
  removeDataSeries(dataSeries?: string | DataSeries): void {
    if (!dataSeries) {
      this._dataSeries = {};
    } else {
      let name: string;
      if (typeof dataSeries === "string") {
        name = dataSeries;
      } else {
        name = dataSeries.name;
      }

      delete this._dataSeries[name];
    }
  }

  // endregion

  // region Bar routines

  /**
   * Appends values from single bar or an array of bars into the corresponding data series.
   * @method appendBars
   * @param {StockChartX~Bar | StockChartX~Bar[]} bars The single bar or an array of bars.
   * @memberOf StockChartX.DataManager#
   * @example
   * // Add single bar
   * dataManager.appendBars({
   *  date: new Date(),
   *  open: 10,
   *  high: 11,
   *  low: 9,
   *  close: 9.5,
   *  volume: 1
   * });
   *
   * // Add several bars
   * dataManager.appendBars([
   *  {
   *      date: new Date(),
   *      open: 10,
   *      high: 11,
   *      low: 8,
   *      close: 9,
   *      volume: 1
   *  },
   *  {
   *      date: new Date(),
   *      open: 20,
   *      high: 21,
   *      low: 18,
   *      close: 19,
   *      volume: 1
   *  }
   * ]);
   */
  appendBars(...bars: (IBar | IBar[])[]) {
    let dataSeries = this.barDataSeries();

    let addBar = (bar: IBar) => {
      dataSeries.date.add(bar.date);
      dataSeries.open.add(bar.open);
      dataSeries.high.add(bar.high);
      dataSeries.low.add(bar.low);
      dataSeries.close.add(bar.close);
      dataSeries.volume.add(bar.volume);
    };
    if (Array.isArray(bars)) {
      JsUtil.flattenedArray(<IBar[]>bars, addBar);
    } else {
      addBar(bars);
    }
  }

  appendBarsWithPrefix(prefix: string, ...bars: (IBar | IBar[])[]) {
    let dataSeries = this.barDataSeries(prefix, true);
    let addBar = (bar: IBar) => {
      dataSeries.date.add(bar.date);
      dataSeries.open.add(bar.open);
      dataSeries.high.add(bar.high);
      dataSeries.low.add(bar.low);
      dataSeries.close.add(bar.close);
      dataSeries.volume.add(bar.volume);
    };
    if (Array.isArray(bars)) {
      JsUtil.flattenedArray(<IBar[]>bars, addBar);
    } else {
      addBar(bars);
    }
  }

  /**
   * Inserts values from a single bar or an array of bars into a given position in data series.
   * @method insertBars
   * @param {number} [index] Starting index to insert bars at.
   * @param {StockChartX~Bar | StockChartX~Bar[]} bars The single bar or an array of bars to insert.
   * @memberOf StockChartX.DataManager#
   */
  insertBars(index: number, bars: IBar | IBar[]) {
    let barsArray = Array.isArray(bars) ? bars : [bars],
      dates = barsArray.map((item: IBar) => item.date),
      open = barsArray.map((item: IBar) => item.open),
      high = barsArray.map((item: IBar) => item.high),
      low = barsArray.map((item: IBar) => item.low),
      close = barsArray.map((item: IBar) => item.close),
      volume = barsArray.map((item: IBar) => item.volume),
      dataSeries = this.barDataSeries();

    dataSeries.date.insert(index, dates);
    dataSeries.open.insert(index, open);
    dataSeries.high.insert(index, high);
    dataSeries.low.insert(index, low);
    dataSeries.close.insert(index, close);
    dataSeries.volume.insert(index, volume);
  }

  /**
   * Inserts values from a single bar or an array of bars into a given position in data series with optional prefix (like 'aapl').
   * @method insertBarsWithPrefix
   * @param {number} [index] Starting index to insert bars at.
   * @param {string} [prefix] prefix of Data Series (like "aapl").
   * @param {StockChartX~Bar | StockChartX~Bar[]} bars The single bar or an array of bars to insert.
   * @memberOf StockChartX.DataManager#
   */
  insertBarsWithPrefix(
    index: number,
    bars: IBar | IBar[],
    prefix: string = ""
  ) {
    let barsArray = Array.isArray(bars) ? bars : [bars],
      dates = barsArray.map((item: IBar) => item.date),
      open = barsArray.map((item: IBar) => item.open),
      high = barsArray.map((item: IBar) => item.high),
      low = barsArray.map((item: IBar) => item.low),
      close = barsArray.map((item: IBar) => item.close),
      volume = barsArray.map((item: IBar) => item.volume),
      dataSeries = this.barDataSeries(prefix);

    dataSeries.date.insert(index, dates);
    dataSeries.open.insert(index, open);
    dataSeries.high.insert(index, high);
    dataSeries.low.insert(index, low);
    dataSeries.close.insert(index, close);
    dataSeries.volume.insert(index, volume);
  }
  /**
   * Returns bar at a given index.
   * @method bar
   * @param {Number | Date} indexOrDate The bar index.
   * @param {StockChartX~BarDataSeries} [barDataSeries] The object that contains bar data series.
   * Use default OHLCV data series if omitted.
   * @returns {StockChartX~Bar}
   * @memberOf StockChartX.DataManager#
   * @example
   * // Get first bar
   * var bar = dataManager.bar(0);
   */
  bar(indexOrDate: number | Date, barDataSeries?: IBarDataSeries): IBar {
    let dataSeries = barDataSeries ? barDataSeries : this.barDataSeries();
    let index =
      typeof indexOrDate === "number"
        ? indexOrDate
        : this.indexByDate(indexOrDate);

    if (index == null || index < 0 || index >= dataSeries.date.length)
      return null;

    return <IBar>{
      date: dataSeries.date.valueAtIndex(index),
      open: dataSeries.open.valueAtIndex(index),
      high: dataSeries.high.valueAtIndex(index),
      low: dataSeries.low.valueAtIndex(index),
      close: dataSeries.close.valueAtIndex(index),
      volume: dataSeries.volume.valueAtIndex(index)
    };
  }

  // endregion
}
