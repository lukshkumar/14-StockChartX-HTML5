/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { PriceStyle } from "../index";
// import { Plot } from "../index";
import { BarPlot } from "../index";
import { BarConverter } from "../index";
import { DataSeriesSuffix } from "../index";
import { Plot } from "../index";
import { PlotType } from "../Utils/PlotType";
import { PriceStyleClassNames } from "../Utils/PriceStyleClassNames";

// @if SCX_LICENSE = 'full'

"use strict";

/**
 * Represents heikin ashi price style.
 * @constructor StockChartX.HeikinAshiPriceStyle
 * @augments StockChartX.PriceStyle
 * @memberOf StockChartX
 */

/**
 * Represents heikin ashi price style.
 * @constructor StockChartX.HeikinAshiPriceStyle
 * @augments StockChartX.PriceStyle
 * @memberOf StockChartX
 */
export class HeikinAshiPriceStyle extends PriceStyle {
  static get className(): string {
    return PriceStyleClassNames.HeikinAshiPriceStyle;
  }

  /**
   * @inheritDoc
   */
  createPlot(): Plot {
    return new BarPlot({
      plotStyle: BarPlot.Style.CANDLE,
      plotType: PlotType.PRICE_STYLE
    });
  }

  /**
   * @inheritDoc
   */
  dataSeriesSuffix(): string {
    return DataSeriesSuffix.HEIKIN_ASHI;
  }

  /**
   * @inheritDoc
   */
  updateComputedDataSeries() {
    let dataManager = this.chart.dataManager,
      heikinAshi = dataManager.ohlcDataSeries(
        DataSeriesSuffix.HEIKIN_ASHI,
        true
      );

    BarConverter.convertToHeikinAshi(dataManager.ohlcDataSeries(), heikinAshi);
  }
}

PriceStyle.register(HeikinAshiPriceStyle);

// @endif
