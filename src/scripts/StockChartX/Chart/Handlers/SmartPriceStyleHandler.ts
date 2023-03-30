import { PriceStyleClassNames } from "../../Utils/PriceStyleClassNames";
import {
  IChartHandler,
  ChartHandler
} from "../../index";
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

export interface ISmartPriceStyleHandler extends IChartHandler {
  enabled: boolean;
  adopt();
}

// endregion

// region Declarations

const PriceStyleLevels = [
  { priceStyle: PriceStyleClassNames.LinePriceStyle, columnWidth: 0 },
  // @if SCX_LICENSE != 'free'
  { priceStyle: PriceStyleClassNames.ColoredBarPriceStyle, columnWidth: 2 },
  // @endif
  { priceStyle: PriceStyleClassNames.CandlePriceStyle, columnWidth: 6 },
  { priceStyle: PriceStyleClassNames.CandlePriceStyle, columnWidth: Infinity }
];

// endregion

/**
 * Handles smart price style changes according to the current zoom factor.
 * @constructor StockChartX.SmartPriceStyleHandler
 * @augments StockChartX.ChartHandler
 */
export class SmartPriceStyleHandler extends ChartHandler
  implements ISmartPriceStyleHandler {
  /**
   * The flag that indicates whether price style should be changed automatically.
   * @name enabled
   * @memberOf StockChartX.SmartPriceStyleHandler#
   */
  enabled = false;

  /**
   * Adopts price style to the current zoom factor.
   * @method adopt
   * @memberOf StockChartX.SmartPriceStyleHandler#
   */
  adopt() {
    if (!this.enabled) return;

    let chart = this.chart,
      width = chart.dateScale.columnWidth;

    for (let i = 0, count = PriceStyleLevels.length; i < count - 1; i++) {
      let item = PriceStyleLevels[i],
        nextItem = PriceStyleLevels[i + 1];

      if (item.columnWidth < width && width < nextItem.columnWidth) {
        chart.priceStyleKind = item.priceStyle;
      }
    }
  }
}
