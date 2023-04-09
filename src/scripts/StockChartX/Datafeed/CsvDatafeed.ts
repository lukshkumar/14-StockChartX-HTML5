import { Datafeed, IRequest, IBarsRequest } from "../index";

import { Notification } from "../../StockChartX.UI/index";
import { debug } from "console";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

// region Interfaces

export type IDatafeedUrlBuilderCallback = (request: IRequest) => string;
export type IDateFormat = (request: IRequest) => string;

export interface ICsvDatafeedConfig {
  urlBuilder: IDatafeedUrlBuilderCallback;
  dateFormat: IDateFormat;
  separator?: string;
}

// endregion

/**
 * Represents datafeed that loads data from a csv file.
 * @constructor StockChartX.CsvDatafeed
 * @augments StockChartX.Datafeed
 */
export class CsvDatafeed extends Datafeed {
  /**
   * @internal
   */
  private _urlBuilder: IDatafeedUrlBuilderCallback;

  /**
   * @internal
   */
  private _dateFormat: IDateFormat;

  /**
   * Data separator.
   * @name separator
   * @type {string}
   * @memberOf StockChartX.CsvDatafeed#
   */
  public separator: string;

  constructor(config: ICsvDatafeedConfig) {
    super();

    this._dateFormat = config.dateFormat;
    this._urlBuilder = config.urlBuilder;
    this.separator = config.separator || ",";
  }

  /**
   * @inheritDoc
   */
  send(request: IBarsRequest) {
    super.send(request);

    this._loadData(request);
  }

  /**
   * @internal
   */
  private _buildUrl(request: IRequest): string {
    if (!this._urlBuilder) throw new Error("Url builder is not provided.");
    
    return this._urlBuilder(request);
  }

  /**
   * @internal
   */
  
  private _loadData(request: IBarsRequest) {
		var xhr = new XMLHttpRequest();

		let url = this._buildUrl(request);

		$.get(`http://18.141.177.116:5000/?Ticker=${url[0]}&Time=${url[1]}`)
			.done((path) => {
				$.get(path, (data: any) => {
					if (this.isRequestAlive(request)) {
						this._processResult(data, request);
					}
				});
			})
			.fail(() => {
				this.onRequstCanceled(request);
				Notification.error('Unable to load data file.');
			});
	}

  /**
   * @internal
   */
  private _processResult(data: string, request: IBarsRequest) {
    let bars = this._parseBars(data, request);
    this.onRequestCompleted(request, bars);
  }

  /**
   * @internal
   */
  private _parseBars(data: string, request: IBarsRequest) {
    let bars = [],
      lines = data.split("\n"),
      format = this._dateFormat(request);

    for (let line of lines) {
      let values = line.split(this.separator),
        date = moment(values[0], format).toDate();

      if (request.endDate && date >= request.endDate) break;

      let bar = {
        date,
        open: parseFloat(values[1]),
        high: parseFloat(values[2]),
        low: parseFloat(values[3]),
        close: parseFloat(values[4]),
        volume: parseInt(values[5], 10)
      };
      bars.push(bar);
    }
    if (bars.length > 1) {
      let isDescendingOrder = bars[0].date.getTime() > bars[1].date.getTime();
      if (isDescendingOrder) bars.reverse();
    }

    return bars;
  }
}
