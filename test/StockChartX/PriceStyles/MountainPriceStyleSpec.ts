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
  BarPriceStyle,
  LinePlot,
  MountainPriceStyle
} from "../../../src/scripts/exporter";
import { PlotType } from "../../../src/scripts/StockChartX/Utils/PlotType";

// tslint:disable:no-unused-expression

"use strict";

describe("MountainPriceStyle", () => {
  let target: BarPriceStyle;

  beforeEach(() => {
    target = new MountainPriceStyle();
  });

  describe("className", () => {
    it("should return 'mountain'", () => {
      expect(MountainPriceStyle.className).to.equal("mountain");
    });
  });

  describe("createPlot", () => {
    it("should return plot", () => {
      expect(target.createPlot()).to.exist;
    });
    it("should create bar plot", () => {
      expect(target.createPlot().constructor).to.be.instanceOf(
        LinePlot.constructor
      );
    });
    it("should be OHLC bar plot", () => {
      expect(target.createPlot().plotStyle).to.equal(LinePlot.Style.MOUNTAIN);
    });
    it("should set plotType to PRICE_STYLE", () => {
      expect(target.createPlot().plotType).to.equal(PlotType.PRICE_STYLE);
    });
  });
});
