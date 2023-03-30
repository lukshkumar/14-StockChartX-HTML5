/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { expect } from "chai";
import {
  BarPlot,
  HeikinAshiPriceStyle,
  DataSeriesSuffix
} from "../../../src/scripts/exporter";
import { PlotType } from "../../../src/scripts/StockChartX/Utils/PlotType";

// tslint:disable:no-unused-expression

"use strict";

describe("HeikinAshiPriceStyle", () => {
  let target: HeikinAshiPriceStyle;

  beforeEach(() => {
    target = new HeikinAshiPriceStyle();
  });

  describe("className", () => {
    it("should return 'heikinAshi'", () => {
      expect(HeikinAshiPriceStyle.className).to.equal("heikinAshi");
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
      expect(target.createPlot().plotStyle).to.equal(BarPlot.Style.CANDLE);
    });
    it("should set plotType to PRICE_STYLE", () => {
      expect(target.createPlot().plotType).to.equal(PlotType.PRICE_STYLE);
    });
  });

  describe("dataSeriesSuffix", () => {
    it("should return heikin ashi suffix", () => {
      expect(target.dataSeriesSuffix()).to.equal(DataSeriesSuffix.HEIKIN_ASHI);
    });
  });
});
