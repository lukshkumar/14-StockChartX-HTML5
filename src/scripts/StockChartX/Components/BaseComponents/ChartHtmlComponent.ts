/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { Chart } from "../../index";
import { IHtmlComponent, HtmlComponent } from "../../index";
import { IChartComponentConfig } from "../../index";
"use strict";

// region Interfaces

export interface IChartHtmlComponent extends IHtmlComponent {
  chart: Chart;
}

export interface IChartHtmlComponentConfig extends IChartComponentConfig {}

// endregion

/**
 * Represents html container component on the chart panel.
 * @constructor StockChartX.ChartHtmlComponent
 * @augments StockChartX.HtmlComponent
 * @abstract
 */
export abstract class ChartHtmlComponent extends HtmlComponent
  implements IChartHtmlComponent {
  // region Properties

  /**
   * @internal
   */
  private _chart: Chart;

  /**
   * Gets/Sets parent chart.
   * @name chart
   * @type {StockChartX.Chart}
   * @memberOf StockChartX.ChartHtmlComponent#
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

  constructor(config?: IChartHtmlComponentConfig) {
    super();

    if (config) this.chart = config.chart;
  }

  protected _onChartChanging() {
    this._removeContainer();
  }

  protected _onChartChanged?();
}
