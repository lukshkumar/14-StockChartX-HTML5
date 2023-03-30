import { BreakLines } from "../../index";
import { ChartPanel } from "../../index";
import { ChartHandler } from "../../index";
import { IStrokeTheme } from "../../index";
import { ITimePoint } from "../../index";
import { Chart } from "../../index";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

/**
 * The break line callback function.
 * @callback StockChartX~BreakLinesDateFilter
 * @param {Date} date The processing date.
 * @return {boolean} True to display line at a given date otherwise false.
 * @memberOf StockChartX
 */

"use strict";

// region Interfaces

export type IBreakLinesDateFilter = (date: Date) => boolean;

export interface ITimePoint {
  hours: number;
  minutes: number;
}

export interface IBreakLinesHandlerConfig {
  chart: Chart;
  time?: ITimePoint;
  theme?: IStrokeTheme;
  visible?: boolean;
  dateFilter?: IBreakLinesDateFilter;
}

export interface IBreakLinesHandler {
  time: ITimePoint;
  theme: IStrokeTheme;
  visible: boolean;
  dateFilter?: IBreakLinesDateFilter;
}

const DEFAULT_TIME = {
  hours: 0,
  minutes: 0
};

// endregion

export class BreakLinesHandler extends ChartHandler
  implements IBreakLinesHandler {
  // region Properties

  private _time: ITimePoint;
  private _theme: IStrokeTheme;
  private _breakLines: BreakLines;
  private _dateFilter: IBreakLinesDateFilter;

  // region Properties

  /**
   * Time value.
   * @name time
   * @type {number}
   * @memberOf StockChartX.BreakLines#
   */
  get time(): ITimePoint {
    return this._time;
  }

  set time(value: ITimePoint) {
    value.hours = value.hours > 24 || value.hours < 0 ? 0 : value.hours;
    value.minutes = value.minutes > 60 || value.hours < 0 ? 0 : value.minutes;
    this._time = value;
  }

  /**
   * Gets/Sets theme.
   * @name theme
   * @type {StockChartX.IStrokeTheme}
   * @memberOf StockChartX.BreakLines#
   */
  get theme(): IStrokeTheme {
    return this._theme;
  }

  set theme(value: IStrokeTheme) {
    this._theme = value;
  }

  // endregion

  /**
   * Gets spread chart panel.
   * @name chartPanel
   * @type StockChartX.Chart
   * @readonly
   * @memberOf StockChartX.BreakLinesHandler#
   */
  get chartPanel(): ChartPanel {
    return this.chart.mainPanel;
  }

  get visible(): boolean {
    return this._breakLines.visible;
  }

  set visible(value: boolean) {
    this._breakLines.visible = value;
  }

  /**
   * Gets/Sets date filter.
   * @name dateFilter
   * @type {StockChartX~BreakLinesDateFilter}
   * @memberOf StockChartX.BreakLines#
   * @example
   *  breakLines.dateFilter = function(date) {
   *      return date.getDay() !== 0;
   *  };
   */
  get dateFilter(): IBreakLinesDateFilter {
    return this._dateFilter;
  }

  set dateFilter(value: IBreakLinesDateFilter) {
    this._dateFilter = value;
  }

  // endregion

  constructor(config: IBreakLinesHandlerConfig) {
    super(config.chart);

    this._theme = config.theme || this.chart.theme.dateScale.breakLine.stroke;
    this._time = config.time || DEFAULT_TIME;
    this._dateFilter = config.dateFilter;
    this._breakLines = new BreakLines({ breakLinesHandler: this });
  }

  public layout() {
    let panel = this.chartPanel,
      breakLines = this._breakLines;

    if (this.visible && !panel.containsObject(breakLines)) {
      panel.addObjects(breakLines);
    } else if (!this.visible && panel.containsObject(breakLines)) {
      panel.removeObjects(breakLines);
    }
  }
}
