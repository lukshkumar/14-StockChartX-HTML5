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

import {
  BarPlot,
  DataSeriesSuffix,
  LineBreakPriceStyle,
  ILineBreakPriceStyleState
} from "../../../src/scripts/exporter";
import { PlotType } from "../../../src/scripts/StockChartX/Utils/PlotType";

"use strict";

describe("LineBreakPriceStyle", () => {
  let target: LineBreakPriceStyle;

  beforeEach(() => {
    target = new LineBreakPriceStyle();
  });

  describe("className", () => {
    it("should return 'lineBreak'", () => {
      expect(LineBreakPriceStyle.className).to.equal("lineBreak");
    });
  });

  describe("constructor", () => {
    context("when default", () => {
      it("should initialize with 3 lines", () => {
        expect(target.lines).to.equal(3);
      });
    });
    context("when config", () => {
      it("should initialize with lines count from config", () => {
        const expected = {
          options: {
            lines: 2
          }
        };
        target = new LineBreakPriceStyle(expected);

        expect(target.lines).to.equal(2);
      });
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
      expect(target.createPlot().plotStyle).to.equal(BarPlot.Style.LINE_BREAK);
    });
    it("should set plotType to PRICE_STYLE", () => {
      expect(target.createPlot().plotType).to.equal(PlotType.PRICE_STYLE);
    });
  });

  describe("dataSeriesSuffix", () => {
    it("should return kagi", () => {
      expect(target.dataSeriesSuffix()).to.equal(DataSeriesSuffix.LINE_BREAK);
    });
  });

  describe("saveState", () => {
    it("should return state", () => {
      const expected = {
        className: "lineBreak",
        options: {
          lines: 2
        }
      };
      target.lines = 2;

      expect(target.saveState()).to.deep.equal(expected);
    });
  });

  describe("loadState", () => {
    it("should restore state", () => {
      const expected: ILineBreakPriceStyleState = {
        className: "lineBreak",
        options: {
          lines: 5,
          showValueLines: true,
          extendValueLines: true
        }
      };
      target.loadState(expected);

      expect(target.lines).to.equal(5);
    });
  });

  describe("primaryDataSeriesSuffix", () => {
    context("when date data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.DATE);
        expect(actual).to.equal(DataSeriesSuffix.LINE_BREAK);
      });
    });
    context("when open data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.OPEN);
        expect(actual).to.equal(DataSeriesSuffix.LINE_BREAK);
      });
    });
    context("when high data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.HIGH);
        expect(actual).to.equal(DataSeriesSuffix.LINE_BREAK);
      });
    });
    context("when low data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.LOW);
        expect(actual).to.equal(DataSeriesSuffix.LINE_BREAK);
      });
    });
    context("when close data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.CLOSE);
        expect(actual).to.equal(DataSeriesSuffix.LINE_BREAK);
      });
    });
    context("when volume data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.VOLUME);
        expect(actual).to.equal(DataSeriesSuffix.LINE_BREAK);
      });
    });
  });
});
