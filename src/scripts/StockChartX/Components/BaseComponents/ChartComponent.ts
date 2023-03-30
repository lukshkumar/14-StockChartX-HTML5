/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import {
  IComponent,
  Component
} from "../../index";
import { Chart } from "../../index";
"use strict";

export interface IChartComponentConfig {
  chart?: Chart;
}

export interface IChartComponent extends IComponent {
  chart: Chart;
}

/**
 * Represents abstract component on the chart.
 * @constructor StockChartX.ChartComponent
 * @abstract
 * @augments StockChartX.Component
 */
export abstract class ChartComponent extends Component
  implements IChartComponent {
  // region Properties

  /**
   * @internal
   */
  private _chart: Chart;

  /**
   *  The parent chart.
   *  @name chart
   *  @type {StockChartX.Chart}
   *  @readonly
   *  @memberOf StockChartX.ChartComponent#
   */
  get chart(): Chart {
    return this._chart;
  }

  set chart(value: Chart) {
    if (this._chart !== value) {
      this._onChartChanging();
      this._chart = value;
      this._onChartChanged();
    }
  }

  // endregion

  constructor(config?: IChartComponentConfig) {
    super();

    if (config) this._chart = config.chart;
  }

  protected _onChartChanging() {
    if (this._unsubscribe) this._unsubscribe();
  }

  protected _onChartChanged() {
    if (this._subscribe) this._subscribe();
  }

  protected _subscribe?();

  protected _unsubscribe?();

  // region IDestroyable

  /**
   * @inheritDoc
   */
  destroy() {
    if (this._unsubscribe) this._unsubscribe();
  }

  // endregion
}
