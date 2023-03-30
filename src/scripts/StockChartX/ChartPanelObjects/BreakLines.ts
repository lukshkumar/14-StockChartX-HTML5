import {
  IChartPanelObjectConfig,
  ChartPanelObject,
  IChartPanelObject,
  IChartPanelObjectOptions
} from "../index";
import { BreakLinesHandler } from "../index";
import { TimeSpan } from "../index";
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

export interface IBreakLinesConfig extends IChartPanelObjectConfig {
  breakLinesHandler: BreakLinesHandler;
}

export interface IBreakLines extends IChartPanelObject {}

interface IBreakLinesOptions extends IChartPanelObjectOptions {
  breakLinesHandler: BreakLinesHandler;
}

// endregion

/**
 * Represents spread chart panel object
 * @constructor StockChartX.BreakLines
 * @augments StockChartX.ChartPanelObject
 */
export class BreakLines extends ChartPanelObject implements IBreakLines {
  private _handler: BreakLinesHandler;

  constructor(config: IBreakLinesConfig) {
    super(config && { options: <IBreakLinesOptions>config });

    this._handler = config.breakLinesHandler;
  }

  /**
   * @inheritDoc
   */
  draw() {
    if (this._handler.chart.timeInterval >= TimeSpan.MILLISECONDS_IN_DAY)
      return;

    let projection = this.projection,
      frame = this.chartPanel.contentFrame,
      context = this.context,
      date = moment(projection.dateByX(0))
        .startOf("day")
        .hours(this._handler.time.hours)
        .minutes(this._handler.time.minutes)
        .toDate(),
      lastDate = projection.dateByRecord(
        projection.dateScale.lastVisibleIndex + 1
      ),
      filter = this._handler.dateFilter;

    context.scxApplyStrokeTheme(this._handler.theme);
    context.beginPath();
    while (date <= lastDate) {
      if (!filter || !filter(date)) {
        let x = projection.xByDate(moment(date).toDate());
        context.moveTo(x, 0);
        context.lineTo(x, frame.bottom - frame.top);
      }
      date = moment(date)
        .add(1, "day")
        .toDate();
    }
    context.stroke();
  }
}
