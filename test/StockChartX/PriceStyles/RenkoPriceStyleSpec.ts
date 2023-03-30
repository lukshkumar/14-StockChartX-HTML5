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
  DataSeriesSuffix,
  BarPlot,
  RenkoPriceStyle,
  RenkoBoxSizeKind,
  IRenkoPriceStyleState
} from "../../../src/scripts/exporter";
import { PlotType } from "../../../src/scripts/StockChartX/Utils/PlotType";

// tslint:disable:no-unused-expression

"use strict";

describe("RenkoPriceStyle", () => {
  let target: RenkoPriceStyle;

  beforeEach(() => {
    target = new RenkoPriceStyle();
  });

  describe("className", () => {
    it("should return 'renko'", () => {
      expect(RenkoPriceStyle.className).to.equal("renko");
    });
  });

  describe("constructor", () => {
    context("when default", () => {
      it("should initialize with box size", () => {
        const expected = {
          kind: RenkoBoxSizeKind.ATR,
          value: 20
        };

        expect(target.boxSize).to.deep.equal(expected);
      });
    });
    context("when config", () => {
      it("should initialize with box size from config", () => {
        const expected = {
          options: {
            boxSize: {
              kind: RenkoBoxSizeKind.FIXED,
              value: 14
            }
          }
        };
        target = new RenkoPriceStyle(expected);

        expect(target.boxSize).to.deep.equal(expected.options.boxSize);
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
      expect(target.createPlot().plotStyle).to.equal(BarPlot.Style.RENKO);
    });
    it("should set plotType to PRICE_STYLE", () => {
      expect(target.createPlot().plotType).to.equal(PlotType.PRICE_STYLE);
    });
  });

  describe("dataSeriesSuffix", () => {
    it("should return kagi", () => {
      expect(target.dataSeriesSuffix()).to.equal(DataSeriesSuffix.RENKO);
    });
  });

  describe("saveState", () => {
    it("should return state", () => {
      const expected: IRenkoPriceStyleState = {
        className: "renko",
        options: {
          boxSize: {
            kind: RenkoBoxSizeKind.FIXED,
            value: 3
          }
        }
      };
      target.boxSize = expected.options.boxSize;

      expect(target.saveState()).to.deep.equal(expected);
    });
  });

  describe("loadState", () => {
    it("should restore state", () => {
      const expected: IRenkoPriceStyleState = {
        className: "renko",
        options: {
          boxSize: {
            kind: RenkoBoxSizeKind.FIXED,
            value: 5
          },
          showValueLines: true,
          extendValueLines: true
        }
      };
      target.loadState(expected);

      expect(target.boxSize).to.deep.equal(expected.options.boxSize);
    });
  });

  describe("primaryDataSeriesSuffix", () => {
    context("when date data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.DATE);
        expect(actual).to.equal(DataSeriesSuffix.RENKO);
      });
    });
    context("when open data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.OPEN);
        expect(actual).to.equal(DataSeriesSuffix.RENKO);
      });
    });
    context("when high data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.HIGH);
        expect(actual).to.equal(DataSeriesSuffix.RENKO);
      });
    });
    context("when low data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.LOW);
        expect(actual).to.equal(DataSeriesSuffix.RENKO);
      });
    });
    context("when close data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.CLOSE);
        expect(actual).to.equal(DataSeriesSuffix.RENKO);
      });
    });
    context("when volume data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.VOLUME);
        expect(actual).to.equal(DataSeriesSuffix.RENKO);
      });
    });
  });
});
