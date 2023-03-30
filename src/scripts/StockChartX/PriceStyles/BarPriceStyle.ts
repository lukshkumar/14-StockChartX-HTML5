import { PriceStyle } from "../index";
import { BarPlot } from "../index";
import { Plot } from "../index";
import { PlotType } from "../Utils/PlotType";
import { PriceStyleClassNames } from "../Utils/PriceStyleClassNames";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

// @if SCX_LICENSE != 'free'

"use strict";

/**
 * Represents bar price style.
 * @constructor StockChartX.BarPriceStyle
 * @augments StockChartX.PriceStyle
 * @memberOf StockChartX
 */
export class BarPriceStyle extends PriceStyle {
  static get className(): string {
    return PriceStyleClassNames.BarPriceStyle;
  }

  /**
   * @inheritDoc
   */
  createPlot(): Plot {
    return new BarPlot({
      plotStyle: BarPlot.Style.OHLC,
      plotType: PlotType.PRICE_STYLE
    });
  }
}

PriceStyle.register(BarPriceStyle);

// @endif
