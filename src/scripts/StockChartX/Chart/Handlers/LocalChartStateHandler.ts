import { JQueryEventObject } from "../../../external/typescript/jquery";
import { IChartStateHandler } from "../../index";
import { LocalDataStore } from "../../index";
import { ChartHandler } from "../../index";
import { Chart } from "../../index";
import { Notification } from "../../../StockChartX.UI/index";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";
const $ = window.jQuery
// region Interfaces

export interface ILocalChartStateHandlerConfig {
  chart?: Chart;
  autoSave?: boolean;
  autoLoad?: boolean;
}

// endregion

// region Declarations

const EventSuffix = ".scxLocalChartStateHandler";

// endregion

/**
 * Represents chart state handler that stores data in local storage.
 * @constructor StockChartX.LocalChartStateHandler
 */
export class LocalChartStateHandler extends ChartHandler
  implements IChartStateHandler {
  // region Properties

  /**
   * The flag that indicates whether state should be saved automatically.
   * @name autoSave
   * @type {boolean}
   * @default true
   * @memberOf StockChartX.LocalChartStateHandler#
   */
  autoSave: boolean = true;

  /**
   * The flag that indicates whether state should be loaded automatically.
   * @name autoLoad
   * @type {boolean}
   * @default true
   * @memberOf StockChartX.LocalChartStateHandler#
   */
  autoLoad: boolean = true;

  // endregion

  constructor(config?: ILocalChartStateHandlerConfig) {
    super(config && config.chart);

    if (config) {
      if (config.autoSave != null) this.autoSave = config.autoSave;
      if (config.autoLoad != null) this.autoLoad = config.autoLoad;
    }

    this._subscribe();
  }

  // region Events handling

  /**
   * @inheritDoc
   */
  protected _subscribe() {
    $(window).on(
      `beforeunload${EventSuffix}`,
      this,
      this._onBeforeUnloadWindow
    );
  }

  /**
   * @inheritDoc
   */
  protected _unsubscribe() {
    $(window).off(EventSuffix, this._onBeforeUnloadWindow);
  }

  //noinspection JSMethodCanBeStatic
  /**
   * Handles 'beforeunload' window event.
   * @method _onBeforeUnloadWindow
   * @memberOf StockChartX.LocalChartStateHandler#
   * @private
   */
  private _onBeforeUnloadWindow(event: JQueryEventObject) {
    let self = <LocalChartStateHandler>event.data;
    if (self.autoSave) {
      self
        .save()
        .catch(async (error: any) => Notification.error(error.message));
    }
  }

  // endregion

  // region IChartStateHandler members

  /**
   * Saves chart state.
   * @method save
   * @return {Promise}
   * @memberOf StockChartX.LocalChartStateHandler#
   * @see [load]{@linkCode StockChartX.LocalChartStateHandler#load}
   */
  async save(): Promise<void> {
    let chart = this.chart;
    if (!chart) return;

    let key = this._generateKey(),
      state = JSON.stringify(chart.saveState()),
      store = new LocalDataStore();

    await store.save(key, state);
  }

  /**
   *  Loads and restores chart state.
   *  @method load
   *  @return {Promise}
   *  @memberOf StockChartX.LocalChartStateHandler#
   *  @see [save]{@linkCode StockChartX.LocalChartStateHandler#save}
   */
  async load(): Promise<boolean> {
    let chart = this.chart;
    if (!chart) {
      return false;
    }

    let key = this._generateKey(),
      store = new LocalDataStore();

    let data = await store.load(key);
    if (!data) return false;

    let json;
    try {
      json = JSON.parse(data);
    } catch (ex) {
      throw new Error("Chart state is corrupted.");
    }

    try {
      chart.loadState(json);
    } catch (ex) {
      throw new Error(`Load chart state failed: ${ex}`);
    }

    return true;
  }

  /**
   * Clears stored chart state.
   * @method clear
   * @return {Promise}
   * @memberOf StockChartX.LocalChartStateHandler#
   */
  async clear(): Promise<void> {
    let chart = this.chart;
    if (!chart) return;

    let key = this._generateKey(),
      store = new LocalDataStore();

    await store.clear(key);
  }

  // endregion

  //noinspection JSMethodCanBeStatic
  /**
   * Generates unique key for the current chart.
   * @method _generateKey
   * @returns {string}
   * @memberOf StockChartX.LocalChartStateHandler#
   * @private
   */
  private _generateKey(): string {
    return `chart|${window.location.pathname}`;
  }
}
