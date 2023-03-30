/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { Chart } from "../index";
"use strict";

/**
 * The abstract class that extends chart events.
 * @constructor StockChartX.ChartEventsExtender
 * @abstract
 */
export abstract class ChartEventsExtender {
  /**
   * @internal
   */
  private _suppressEvents: boolean = false;

  public chart: Chart;

  /**
   * Suppresses/Allows all events.
   * @method suppressEvents
   * @param {boolean} [suppress = true] The flag to suppress or resume events raising.
   * @returns {boolean} The old value.
   * @memberOf StockChartX.ChartEventsExtender#
   * @example <caption>Suppress events</caption>
   *  obj.suppressEvents();
   * @example <caption>Resume events</caption>
   *  obj.suppressEvents(false);
   */
  suppressEvents(suppress: boolean = true): boolean {
    let oldValue = this._suppressEvents;
    this._suppressEvents = suppress;

    return oldValue;
  }

  /**
   * Fires event.
   * @method fire
   * @param {String} event The event name.
   * @param {*} [newValue] The new property value.
   * @param {*} [oldValue] The old property value.
   * @memberOf StockChartX.ChartEventsExtender#
   * @example
   *  obj.fire('custom_event', 'new value', 'old value');
   */
  fire(event: string, newValue?: any, oldValue?: any) {
    let chart = this.chart;
    if (chart && !this._suppressEvents)
      chart.fireTargetValueChanged(this, event, newValue, oldValue);
  }
}
