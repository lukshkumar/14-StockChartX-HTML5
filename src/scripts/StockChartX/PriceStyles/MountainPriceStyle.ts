/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { LinePlot } from "../index";
import { PriceStyle } from "../index";
import { Plot } from "../index";
import { PlotType } from "../Utils/PlotType";
import { PriceStyleClassNames } from "../Utils/PriceStyleClassNames";

// @if SCX_LICENSE != 'free'

"use strict";

/**
 * Represents mountain line price style.
 * @constructor StockChartX.MountainPriceStyle
 * @augments StockChartX.PriceStyle
 * @memberOf StockChartX
 */
export class MountainPriceStyle extends PriceStyle {
  static get className(): string {
    return PriceStyleClassNames.MountainPriceStyle;
  }

  /**
   * @inheritDoc
   */
  createPlot(): Plot {
    return new LinePlot({
      plotStyle: LinePlot.Style.MOUNTAIN,
      plotType: PlotType.PRICE_STYLE
    });
  }
}

PriceStyle.register(MountainPriceStyle);

// @endif
