import { BarPlot } from "../index";
import { IPlotBarDrawParams } from "../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

export class PointAndFigurePlot extends BarPlot {
  // region Properties

  /**
   * @internal
   */
  private _boxSize: number;
  get boxSize(): number {
    return this._boxSize;
  }

  set boxSize(value: number) {
    this._boxSize = value;
  }

  // endregion

  draw() {
    if (!this.visible) return;

    let params = this._barDrawParams();
    if (params.values.length === 0) return;

    // Draw X columns.
    params.context.beginPath();
    this._drawColumns(params, true);
    params.context.scxStroke(params.theme.upCandle.border);
    // Draw O columns.
    params.context.beginPath();
    this._drawColumns(params, false);
    params.context.scxStroke(params.theme.downCandle.border);
  }

  /**
   * @internal
   */
  private _drawColumns(params: IPlotBarDrawParams, drawXColumns: boolean) {
    let context = params.context,
      projection = params.projection,
      boxSize = this.boxSize,
      columnWidth = this.chart.dateScale.columnWidth,
      barWidth = Math.max(columnWidth * this.columnWidthRatio, this.minWidth),
      halfBarWidth = Math.round(barWidth / 2),
      theme = drawXColumns ? null : params.theme.downCandle.border;

    for (
      let i = params.startIndex, column = params.startColumn;
      i <= params.endIndex;
      i++, column++
    ) {
      let open = params.open[i],
        close = params.close[i];

      if (open == null || close == null) continue;

      let isRaisingBar = close >= open;
      if (drawXColumns !== isRaisingBar) continue;

      let x = params.dates
          ? projection.xByDate(params.dates[i])
          : projection.xByColumn(column),
        low = params.low[i] - boxSize/2,
        high = params.high[i] + boxSize/2;
        while (high - low > 1e-6) {
        let yLow = projection.yByValue(low),
          yHigh = projection.yByValue(low + boxSize);

        if (drawXColumns) {
          if (barWidth < 3) {
            context.moveTo(x, yLow);
            context.lineTo(x, yHigh);
          } else {
            context.moveTo(x - halfBarWidth, yLow);
            context.lineTo(x + halfBarWidth, yHigh);
            context.moveTo(x - halfBarWidth, yHigh);
            context.lineTo(x + halfBarWidth, yLow);
          }
        } else {
          if (barWidth < 3) {
            context.moveTo(x, yLow);
            context.lineTo(x, yHigh);
          } else {
            let horRadius = halfBarWidth,
              verRadius = (yHigh - yLow) / 2;
            context.beginPath();
            context.save();
            context.translate(x, (yLow + yHigh) / 2);
            if (horRadius !== verRadius)
              context.scale(1, verRadius / horRadius);
            context.arc(0, 0, horRadius, 0, 2 * Math.PI);
            context.restore();
            context.closePath();
            context.scxStroke(theme);
          }
        }
        low += boxSize;
      }
    }
  }
}
