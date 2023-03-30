/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { Chart } from "../../index";
import { IHandler, Handler } from "../../index";

"use strict";

export interface IChartHandler extends IHandler {
  chart: Chart;
}

/**
 * Represents abstract chart handler.
 * @constructor StockChartX.ChartHandler
 * @augments StockChartX.Handler
 * @abstract
 */
export abstract class ChartHandler extends Handler implements IChartHandler {
  // region Properties

  /**
   * @internal
   */
  private _chart: Chart;

  /**
   *  The parent chart.
   *  @name chart
   *  @type {StockChartX.Chart}
   *  @memberOf StockChartX.ChartHandler#
   */
  get chart(): Chart {
    return this._chart;
  }

  set chart(value: Chart) {
    let oldValue = this._chart;
    if (oldValue !== value) {
      if (this._onChartChanging) this._onChartChanging();

      this._chart = value;

      if (this._onChartChanged) this._onChartChanged(oldValue);
    }
  }

  // endregion

  constructor(chart?: Chart) {
    super();

    this._chart = chart;
  }

  /**
   * This method gets executed before chart property changed.
   * @method _onChartChanging
   * @memberOf StockChartX.ChartHandler#
   * @protected
   */
  protected _onChartChanging?();

  /**
   * This method gets executed when chart property changed.
   * @method _onChartChanged
   * @param {StockChartX.Chart} oldChart Previous chart property value.
   * @memberOf StockChartX.ChartHandler#
   * @protected
   */
  protected _onChartChanged?(oldChart: Chart);
}
