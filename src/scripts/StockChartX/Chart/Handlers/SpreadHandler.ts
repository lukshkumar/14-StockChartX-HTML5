import { Spread } from "../../index";
import { ISpreadTheme } from "../../index";
import { Chart } from "../../index";
import { ChartHandler } from "../../index";
import { ChartPanel } from "../../index";
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
export interface ISpreadHandlerConfig {
  chart: Chart;
  ask?: number;
  bid?: number;
  theme?: ISpreadTheme;
}

export interface ISpreadHandler {
  visible: boolean;
  ask: number;
  bid: number;
  theme: ISpreadTheme;
}
// endregion

/**
 * Represents spread handler
 * @constructor StockChartX.SpreadHandler
 */
export class SpreadHandler extends ChartHandler implements ISpreadHandler {
  // region Properties

  /**
   * @internal
   */
  private _spread = new Spread();

  /**
   * Gets spread chart panel.
   * @name chartPanel
   * @type StockChartX.Chart
   * @readonly
   * @memberOf StockChartX.SpreadHandler#
   */
  get chartPanel(): ChartPanel {
    return this.chart.mainPanel;
  }

  /**
   * Get/Sets spread visible
   * @name visible
   * @type {number}
   * @memberOf StockChartX.SpreadHandler#
   */
  set visible(value: boolean) {
    this._spread.visible = value;
  }

  get visible(): boolean {
    return this._spread.visible;
  }

  /**
   * Gets/Sets ask line value.
   * @name ask
   * @type {number}
   * @memberOf StockChartX.SpreadHandler#
   */
  get ask(): number {
    return this._spread.ask;
  }

  set ask(value: number) {
    this._spread.ask = value;
  }

  /**
   * Gets/Sets bid line value.
   * @name bid
   * @type {number}
   * @memberOf StockChartX.SpreadHandler
   */
  get bid(): number {
    return this._spread.bid;
  }

  set bid(value: number) {
    this._spread.bid = value;
  }

  /**
   * Gets/Sets theme.
   * @name theme
   * @type {StockChartX.ISpreadTheme}
   * @memberOf StockChartX.SpreadHandler#
   */
  get theme(): ISpreadTheme {
    return this._spread.theme;
  }

  set theme(value: ISpreadTheme) {
    this._spread.theme = value;
  }
  // endregion

  constructor(config: ISpreadHandlerConfig) {
    super(config.chart);

    this.ask = config.ask;
    this.bid = config.bid;
    this.theme = config.theme;
  }

  /**
   * Layout spread.
   * @method layout
   * @memberOf StockChartX.SpreadHandler#
   */
  layout() {
    let panel = this.chartPanel,
      spread = this._spread;

    if (this.visible && !panel.containsObject(spread)) {
      panel.addObjects(spread);
    } else if (!this.visible && panel.containsObject(spread)) {
      panel.removeObjects(spread);
    }
  }
}
