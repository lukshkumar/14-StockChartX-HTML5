import { LinePlot } from "../index";
import { PriceStyle } from "../index";
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

"use strict";

/**
 * Represents line price style.
 * @constructor StockChartX.LinePriceStyle
 * @augments StockChartX.PriceStyle
 * @memberOf StockChartX
 */
export class LinePriceStyle extends PriceStyle {
  static get className(): string {
    return PriceStyleClassNames.LinePriceStyle;
  }

  /**
   * @inheritDoc
   */
  createPlot(): Plot {
    return new LinePlot({
      plotStyle: LinePlot.Style.SIMPLE,
      plotType: PlotType.PRICE_STYLE
    });
  }
}

PriceStyle.register(LinePriceStyle);
