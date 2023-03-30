import { IFillTheme } from "../index";
import { ChartPanelObject } from "../index";
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
 * The HighlightedColumnTheme structure.
 * @typedef {object} HighlightedColumnTheme
 * @type {object}
 * @property {StockChartX~FillTheme} fill The fill theme
 * @memberOf StockChartX
 * @example
 * var highlightedColumnTheme = {
 *  fill : {
 *      fillColor: 'rgba(0, 128, 255, 0.5)'
 *  }
 * };
 */

export interface IHighlightedColumnTheme {
  fill: IFillTheme;
}

export interface IHighlightedColumnConfig {
  date: Date;
  theme?: IHighlightedColumnTheme;
}

/**
 * Describes HighlightedColumn
 * @param {IHighlightedColumnConfig} config The configuration object.
 * @param {Date} config.date Date used for drawing columns.
 * @param {HighlightedColumnTheme} [config.theme] The theme.
 * @constructor StockChartX.HighlightedColumn
 * @augments StockChartX.ChartPanelObject
 */
export class HighlightedColumn extends ChartPanelObject {
  /**
   * @internal
   */
  private _date: Date;

  get date(): Date {
    return this._date;
  }

  /**
   * @internal
   */
  private _theme: IHighlightedColumnTheme;
  /**
   * Gets/Sets theme.
   * @name theme
   * @type {StockChartX.HighlightedColumnTheme}
   * @memberOf StockChartX.HighlightedColumn#
   */
  get theme(): IHighlightedColumnTheme {
    return this._theme;
  }

  set theme(value: IHighlightedColumnTheme) {
    this._theme = value;
  }

  /**
   * Returns actual theme.
   * @name actualTheme
   * @type {StockChartX.HighlightedColumnTheme}
   * @memberOf StockChartX.HighlightedColumn#
   */
  get actualTheme(): IHighlightedColumnTheme {
    return this._theme || this.defaultTheme;
  }

  /**
   * Returns default theme.
   * @name defaultTheme
   * @type {StockChartX.HighlightedColumnTheme}
   * @memberOf StockChartX.HighlightedColumn#
   */
  get defaultTheme(): IHighlightedColumnTheme {
    return this.chart.theme.highlightedColumn;
  }

  constructor(config: IHighlightedColumnConfig) {
    super(null);

    if (typeof config !== "object")
      throw new Error("HighlightedColumn config must be an object.");

    if (!config.date)
      throw new Error("Date for HighlightedColumn is not specified.");

    this._date = config.date;

    if (config.theme) this._theme = config.theme;
  }

  /**
   * Method that checks whether the highlightedColumn uses specified date
   * @method checkDate
   * @param {Date} date
   * @returns {boolean}
   * @memberOf StockChartX.HighlightedColumn#
   */
  checkDate(date: Date): boolean {
    return this._date.getTime() === date.getTime();
  }

  /**
   * @inheritDoc
   */
  draw() {
    if (!this.chart.highlightedColumns.visible) return;

    let panel = this.chartPanel,
      projection = panel.projection,
      context = panel.layer.context,
      columnWidth = this.chart.dateScale.columnWidth,
      x = projection.xByDate(this._date);

    context.beginPath();
    context.scxApplyFillTheme(this.actualTheme.fill);
    context.fillRect(
      x - columnWidth / 2,
      0,
      columnWidth,
      panel.layer.size.height
    );
    context.closePath();
  }

  /**
   * @inheritDoc
   */
  destroy() {
    this.chartPanel.removeObjects(this);
    super.destroy();
  }
}
