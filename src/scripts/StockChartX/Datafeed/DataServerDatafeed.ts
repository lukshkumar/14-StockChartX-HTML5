import {
  Datafeed,
  DataServer,
  IBarsRequest,
  IData,
  Chart,
  IBar,
  BarsUpdateKind
} from "../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

/**
 * Represents datafeed that loads data from a DataServer.
 * @constructor StockChartX.DataServerDatafeed#
 * @param {DataServer.DataServer} dataServer
 * @memberOf StockChartX
 */
export class DataServerDatafeed extends Datafeed {
  /**
   * @internal
   */
  private dataServer: DataServer;

  constructor(dataServer: DataServer) {
    super();

    this.dataServer = dataServer;
  }

  /**
   * @inheritDoc
   */
  send(request: IBarsRequest) {
    this._loadData(request);
    request.chart.showWaitingBar(undefined);
  }

  /**
   * @internal
   */
  private _loadData(request: IBarsRequest): void {
    this.dataServer.getHistory(
      this._processResult.bind(this, request),
      request as any
    );
  }

  /**
   * @internal
   */
  private _processResult(request: IBarsRequest, data: IData): void {
    let bars = this._convertBars(data.Bars as any, request);

    this.subscribe(request.chart);
    this.onRequestCompleted(request, bars);
  }

  /**
   * @internal
   */
  private subscribe(chart: Chart): void {
    this.dataServer.subscribeQuote(
      this._processQuote.bind(this, chart),
      chart.instrument as any
    );
  }

  /**
   * @internal
   */
  private _processQuote(chart: Chart, quote: any): void {
    quote = this._convertQuote(quote);

    if (quote.symbol.symbol !== chart.instrument.symbol) return;

    let lastBar = this._getLastChartBar(chart),
      currentBarStartTimestamp,
      nextBarStartTimestamp;
    if (lastBar) {
      currentBarStartTimestamp = lastBar.date.getTime();
      nextBarStartTimestamp =
        <number>currentBarStartTimestamp + <number>chart.timeInterval;
    } else {
      return;
    }

    if (quote.date.getTime() < currentBarStartTimestamp || quote.price === 0)
      return;

    if (
      new Date(quote.date) >= new Date(nextBarStartTimestamp) ||
      lastBar === null
    ) {
      // If there were no historical data and timestamp is in range of current time frame
      if (lastBar === null && quote.date < nextBarStartTimestamp)
        nextBarStartTimestamp = currentBarStartTimestamp;

      // If gap is more than one time frame
      while (
        quote.date >=
        <number>nextBarStartTimestamp + <number>chart.timeInterval
      )
        nextBarStartTimestamp += chart.timeInterval;

      // Create bar
      let bar = {
        open: quote.price,
        high: quote.price,
        low: quote.price,
        close: quote.price,
        volume: quote.volume,
        date: new Date(nextBarStartTimestamp)
      };

      chart.appendBars(bar);
      chart.dateScale.applyAutoScroll(BarsUpdateKind.NEW_BAR);
    } else {
      // Update current bar
      lastBar.close = quote.price;
      // Temporary workaround
      lastBar.volume = <number>lastBar.volume + quote.volume / 1000;

      if (lastBar.high < quote.price) lastBar.high = quote.price;

      if (lastBar.low > quote.price) lastBar.low = quote.price;

      this._updateLastBar(lastBar, chart);
      chart.dateScale.applyAutoScroll(BarsUpdateKind.TICK);
    }
  }

  /**
   * @internal
   */
  private _updateLastBar(bar: IBar, chart: Chart): void {
    let chartData = chart.barDataSeries();

    chartData.open.updateLast(bar.open);
    chartData.high.updateLast(bar.high);
    chartData.low.updateLast(bar.low);
    chartData.close.updateLast(bar.close);
    chartData.volume.updateLast(bar.volume);
    chartData.date.updateLast(bar.date);

    chart.setNeedsUpdate(true);
  }

  /**
   * @internal
   */
  private _getLastChartBar(chart: Chart): IBar {
    let chartData = chart.barDataSeries();

    if (chartData.open.values.length === 0) return null;

    return {
      open: <number>chartData.open.lastValue,
      high: <number>chartData.high.lastValue,
      low: <number>chartData.low.lastValue,
      close: <number>chartData.close.lastValue,
      volume: <number>chartData.volume.lastValue,
      // @ts-ignore
      date: new Date(chartData.date.lastValue)
    };
  }

  /**
   * @internal
   */
  private _convertQuote(quote: any) {
    return {
      symbol: {
        symbol: quote.Symbol.Symbol,
        company: quote.Symbol.Company,
        exchange: quote.Symbol.Exchange,
        type: quote.Symbol.Type
      },
      price: quote.Price,
      bid: quote.Bid,
      bidSize: quote.BidSize,
      ask: quote.Ask,
      askSize: quote.AskSize,
      volume: quote.Volume,
      date: new Date(quote.Date)
    };
  }

  /**
   * @internal
   */
  private _convertBars(bars: IBar | IBar[], request: IBarsRequest): IBar[] {
    let dataBars = [];
    $.each(bars, (index: any, data: any) => {
      let date = moment(data.Date).toDate();

      if (request.endDate && date >= request.endDate) return undefined;

      let bar = {
        open: data.Open,
        close: data.Close,
        high: data.High,
        low: data.Low,
        volume: data.Volume,
        date: new Date(data.Date)
      };
      dataBars.push(bar);
    });
    if (dataBars.length > 1) {
      let isDescendingOrder =
        dataBars[0].date.getTime() > dataBars[1].date.getTime();
      if (isDescendingOrder) dataBars.reverse();
    }

    return dataBars;
  }
}
