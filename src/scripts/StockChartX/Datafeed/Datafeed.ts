/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { IDestroyable } from "../index";
import { IRequest, IBarsRequest, RequestKind } from "../index";
import { Dictionary } from "../index";
import { IBar } from "../index";
import { Environment } from "../index";
"use strict";

// region Interfaces

export interface IDatafeed extends IDestroyable {
  send(request: IRequest);
  cancel(request: IRequest);
}

// endregion

/**
 * Represents abstract datafeed.
 * @constructor StockChartX.Datafeed#
 * @memberOf StockChartX
 */
export abstract class Datafeed implements IDatafeed {
  /**
   * @internal
   */
  private static _requestId = 0;

  /**
   * @internal
   */
  private _requests = new Dictionary<number, IRequest>();

  /**
   * Executes request post cancel actions (e.g. hides waiting bar).
   * @method onRequstCanceled
   * @memberOf StockChartX.Datafeed#
   * @protected
   */
  protected onRequstCanceled(request: IBarsRequest) {
    request.chart.hideWaitingBar();
  }

  /**
   * Executes request post complete actions (e.g. hides waiting bar, updates indicators, refreshes chart).
   * @method onRequestCompleted
   * @memberOf StockChartX.Datafeed#
   * @protected
   */
  protected onRequestCompleted(request: IBarsRequest, bars: IBar[]) {
    let chart = request.chart,
      dataManager = chart.dataManager,
      oldPrimaryBarsCount = chart.primaryBarDataSeries().low.length,
      oldFirstVisibleRecord = chart.firstVisibleRecord,
      oldLastVisibleRecord = chart.lastVisibleRecord;

    switch (request.kind) {
      case RequestKind.BARS:
        // dataManager.clearDataSeries();
        dataManager.appendBars(bars);
        break;
      case RequestKind.MORE_BARS:
        dataManager.insertBars(0, bars);
        break;
      default:
        throw new Error(`Unknown request kind: ${request.kind}`);
    }
    chart.updateComputedDataSeries();

    let barsCount =
      chart.primaryBarDataSeries().low.length - oldPrimaryBarsCount;

    if (request.kind === RequestKind.BARS) {
      if (!Environment.isMobile && barsCount > 0) chart.recordRange(barsCount);
    } else if (request.kind === RequestKind.MORE_BARS) {
      chart.firstVisibleRecord = oldFirstVisibleRecord + barsCount;
      chart.lastVisibleRecord = oldLastVisibleRecord + barsCount;
    }
    this._requests.remove(request.id);

    chart.hideWaitingBar();
    chart.updateIndicators();
    chart.setNeedsAutoScale();
    chart.setNeedsUpdate(true);
    chart.dateScale.onMoreHistoryRequestCompleted();
  }

  /**
   * Generates next unique request identifier.
   * @method nextRequestId
   * @returns {number}
   * @memberOf StockChartX.Datafeed#
   */
  static nextRequestId(): number {
    return ++this._requestId;
  }

  // region IDatafeed members

  /**
   * Sends request to the datafeed provider.
   * @method send
   * @param {StockChartX~Request} request The processing request.
   * @memberOf StockChartX.Datafeed#
   */
  send(request: IRequest) {
    this._requests.add(request.id, request);

    request.chart.showWaitingBar(undefined);
  }

  /**
   * Cancels request processing.
   * @method cancel
   * @param {StockChartX~Request} request The cancelling request.
   * @memberOf StockChartX.Datafeed#
   */
  cancel(request: IRequest) {
    this._requests.remove(request.id);
  }

  /**
   * Destroy request.
   * @method destroy
   * @param {StockChartX~Request}.
   * @memberOf StockChartX.Datafeed#
   */
  destroy() {
    this._requests.clear();
  }

  // endregion

  /**
   * Determines whether request is alive.
   * @method isRequestAlive
   * @param {StockChartX~Request} request The request.
   * @memberof StockChartX.Datafeed#
   * @returns {boolean} True if request is alive, otherwise false.
   */
  isRequestAlive(request: IRequest): boolean {
    return this._requests.containsKey(request.id);
  }
}
