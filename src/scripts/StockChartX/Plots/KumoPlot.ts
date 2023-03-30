import { DataSeries } from "../index";
import { Plot } from "../index";
import { IPlotDefaults } from "../index";
import { IPlotConfig } from "../index";
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

export interface IKumoPlotConfig extends IPlotConfig {}

export interface IKumoPlotDefaults extends IPlotDefaults {}

// endregion

/**
 * Represents Kumo plot.
 * @param {Object} [config] The configuration object.
 * @constructor StockChartX.KumoPlot
 * @augments StockChartX.Plot
 * @example
 *  var plot = new StockChartX.KumoPlot({
 *      dataSeries: SenkouSpanADataSeries, SenkouSpanBDataSeries
 *  });
 */
export class KumoPlot extends Plot {
  constructor(config?: IKumoPlotConfig) {
    super(config);
  }

  /**
   * @inheritdoc
   */
  draw() {
    if (!this.visible) return;

    let params = this._barDrawParams();
    if (params.values.length === 0) return;

    let context = this.context,
      projection = this.projection,
      x,
      y,
      value: number;

    context.beginPath();

    value = <number>this.dataSeries[0].values[params.startIndex];
    x = projection.xByRecord(params.startIndex);
    y = projection.yByValue(value);
    context.moveTo(x, y);

    for (let i = params.startIndex + 1; i <= params.endIndex; i++) {
      value = <number>this.dataSeries[0].values[i];
      if (value == null) continue;

      x = projection.xByRecord(i);
      y = projection.yByValue(value);
      context.lineTo(x, y);
    }

    value = <number>this.dataSeries[1].values[params.endIndex + 1];
    if (value == null) {
      value = <number>(
        this.dataSeries[1].values[
          this.getLastNotNullValueIndex(this.dataSeries[1])
        ]
      );
      params.endIndex = this.getLastNotNullValueIndex(this.dataSeries[0]);
    }
    x = projection.xByRecord(params.endIndex);
    y = projection.yByValue(value);
    context.lineTo(x, y);

    for (let i = params.endIndex; i >= params.startIndex; i--) {
      value = <number>this.dataSeries[1].values[i];
      if (value == null) continue;

      x = projection.xByRecord(i);
      y = projection.yByValue(value);
      context.lineTo(x, y);
    }

    value = <number>this.dataSeries[0].values[params.startIndex];
    if (value == null) {
      value = <number>(
        this.dataSeries[0].values[
          this.getFirstNotNullValueIndex(this.dataSeries[0])
        ]
      );
      params.startIndex = this.getFirstNotNullValueIndex(this.dataSeries[0]);
    }
    x = projection.xByRecord(params.startIndex);
    y = projection.yByValue(value);
    context.lineTo(x, y);

    context.scxFill(params.theme);
  }

  getFirstNotNullValueIndex(dataserie: DataSeries): number {
    let index = 0,
      isContinue = true;

    while (isContinue && index < dataserie.length) {
      if (dataserie.values[index] == null) index++;
      else isContinue = false;
    }

    return index;
  }

  getLastNotNullValueIndex(dataserie: DataSeries): number {
    let index: number = dataserie.length,
      isContinue = true;

    while (isContinue && index > 0) {
      if (dataserie.values[index] == null) index--;
      else isContinue = false;
    }

    return index;
  }
}
