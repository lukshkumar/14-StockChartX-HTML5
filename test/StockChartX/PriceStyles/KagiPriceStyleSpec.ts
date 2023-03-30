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
  KagiPriceStyle,
  KagiReversalKind,
  DataSeriesSuffix,
  IKagiPriceStyleState
} from "../../../src/scripts/exporter";
import { PlotType } from "../../../src/scripts/StockChartX/Utils/PlotType";

"use strict";

describe("KagiPriceStyle", () => {
  let target: KagiPriceStyle;

  beforeEach(() => {
    target = new KagiPriceStyle();
  });

  describe("className", () => {
    it("should return 'kagi'", () => {
      expect(KagiPriceStyle.className).to.equal("kagi");
    });
  });

  describe("constructor", () => {
    context("when default", () => {
      it("should initialize with reversal", () => {
        const expected = {
          kind: KagiReversalKind.ATR,
          value: 20
        };

        expect(target.reversal).to.deep.equal(expected);
      });
    });
    context("when config", () => {
      it("should initialize with reversal from config", () => {
        const expected = {
          options: {
            reversal: {
              kind: KagiReversalKind.FIXED,
              value: 3
            },
            showValueLines: true,
            extendValueLines: true
          }
        };
        target = new KagiPriceStyle(expected);

        expect(target.reversal).to.deep.equal(expected.options.reversal);
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
      expect(target.createPlot().plotStyle).to.equal(BarPlot.Style.KAGI);
    });
    it("should set plotType to PRICE_STYLE", () => {
      expect(target.createPlot().plotType).to.equal(PlotType.PRICE_STYLE);
    });
  });

  describe("dataSeriesSuffix", () => {
    it("should return kagi", () => {
      expect(target.dataSeriesSuffix()).to.equal(DataSeriesSuffix.KAGI);
    });
  });

  describe("saveState", () => {
    it("should return state", () => {
      const expected = {
        className: "kagi",
        options: {
          reversal: {
            kind: KagiReversalKind.FIXED,
            value: 3
          }
        }
      };
      target.reversal = expected.options.reversal;

      expect(target.saveState()).to.deep.equal(expected);
    });
  });

  describe("loadState", () => {
    it("should restore state", () => {
      const expected: IKagiPriceStyleState = {
        className: "kagi",
        options: {
          reversal: {
            kind: KagiReversalKind.FIXED,
            value: 5
          },
          showValueLines: true,
          extendValueLines: true
        }
      };
      target.loadState(expected);

      expect(target.reversal).to.deep.equal(expected.options.reversal);
    });
  });

  describe("primaryDataSeriesSuffix", () => {
    context("when date data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.DATE);
        expect(actual).to.equal(DataSeriesSuffix.KAGI);
      });
    });
    context("when open data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.OPEN);
        expect(actual).to.equal(DataSeriesSuffix.KAGI);
      });
    });
    context("when high data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.HIGH);
        expect(actual).to.equal(DataSeriesSuffix.KAGI);
      });
    });
    context("when low data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.LOW);
        expect(actual).to.equal(DataSeriesSuffix.KAGI);
      });
    });
    context("when close data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.CLOSE);
        expect(actual).to.equal(DataSeriesSuffix.KAGI);
      });
    });
    context("when volume data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.VOLUME);
        expect(actual).to.equal(DataSeriesSuffix.KAGI);
      });
    });
  });
});
