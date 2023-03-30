/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

// tslint:disable:no-unused-expression
import { expect } from "chai";
import { BarPlot, ColoredBarPriceStyle } from "../../../src/scripts/exporter";
import { PlotType } from "../../../src/scripts/StockChartX/Utils/PlotType";

"use strict";

describe("ColoredBarPriceStyle", () => {
  let target: ColoredBarPriceStyle;

  beforeEach(() => {
    target = new ColoredBarPriceStyle();
  });

  describe("className", () => {
    it("should return 'coloredBar'", () => {
      expect(ColoredBarPriceStyle.className).to.equal("coloredBar");
    });
  });

  describe("createPlot", () => {
    it("should return plot", () => {
      expect(target.createPlot()).to.exist;
    });
    it("should create bar plot", () => {
      expect(target.createPlot().constructor).to.be.instanceOf(
        BarPlot.constructor
      );
    });
    it("should be OHLC bar plot", () => {
      expect(target.createPlot().plotStyle).to.equal(
        BarPlot.Style.COLORED_OHLC
      );
    });
    it("should set plotType to PRICE_STYLE", () => {
      expect(target.createPlot().plotType).to.equal(PlotType.PRICE_STYLE);
    });
  });
});
