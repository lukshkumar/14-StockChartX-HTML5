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
  PointAndFigurePriceStyle,
  PointAndFigureBoxSizeKind,
  PointAndFigureSource,
  BarPlot,
  IPointAndFigurePriceStyleState,
  KagiReversalKind
} from "../../../src/scripts/exporter";
import { PlotType } from "../../../src/scripts/StockChartX/Utils/PlotType";

// tslint:disable:no-unused-expression

"use strict";

describe("PointAndFigurePriceStyle", () => {
  let target: PointAndFigurePriceStyle;

  beforeEach(() => {
    target = new PointAndFigurePriceStyle();
  });

  describe("className", () => {
    it("should return 'pointAndFigure'", () => {
      expect(PointAndFigurePriceStyle.className).to.equal("pointAndFigure");
    });
  });

  describe("constructor", () => {
    context("when default", () => {
      it("should initialize with atr(20) box size", () => {
        const expected = {
          kind: PointAndFigureBoxSizeKind.ATR,
          value: 20
        };

        expect(target.boxSize).to.deep.equal(expected);
      });
      it("should initialize reversal with 3", () => {
        expect(target.reversal).to.equal(3);
      });
    });
    context("when config", () => {
      const expected = {
        options: {
          boxSize: {
            kind: PointAndFigureBoxSizeKind.FIXED,
            value: 3
          },
          reversal: 5,
          source: PointAndFigureSource.HIGH_LOW
        }
      };
      it("should initialize with box size from config", () => {
        target = new PointAndFigurePriceStyle(expected);

        expect(target.boxSize).to.deep.equal(expected.options.boxSize);
      });
      it("should initialize reversal", () => {
        target = new PointAndFigurePriceStyle(expected);

        expect(target.reversal).to.equal(5);
      });
      it("should initialize source", () => {
        target = new PointAndFigurePriceStyle(expected);

        expect(target.source).to.equal(expected.options.source);
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
      expect(target.createPlot().plotStyle).to.equal(
        BarPlot.Style.POINT_AND_FIGURE
      );
    });
    it("should set plotType to PRICE_STYLE", () => {
      expect(target.createPlot().plotType).to.equal(PlotType.PRICE_STYLE);
    });
  });

  describe("dataSeriesSuffix", () => {
    it("should return kagi", () => {
      expect(target.dataSeriesSuffix()).to.equal(
        DataSeriesSuffix.POINT_AND_FIGURE
      );
    });
  });

  describe("saveState", () => {
    it("should return state", () => {
      const expected = {
        className: "pointAndFigure",
        options: {
          boxSize: {
            kind: PointAndFigureBoxSizeKind.FIXED,
            value: 14
          },
          reversal: 5,
          source: PointAndFigureSource.CLOSE
        }
      };
      target.boxSize = expected.options.boxSize;
      target.reversal = expected.options.reversal;
      target.source = expected.options.source;

      expect(target.saveState()).to.deep.equal(expected);
    });
  });

  describe("loadState", () => {
    const expected: IPointAndFigurePriceStyleState = {
      className: "pointAndFigure",
      options: {
        boxSize: {
          kind: KagiReversalKind.FIXED,
          value: 14
        },
        reversal: 5,
        source: PointAndFigureSource.HIGH_LOW,
        showValueLines: true,
        extendValueLines: true
      }
    };

    it("should restore box size", () => {
      target.loadState(expected);

      expect(target.reversal).to.equal(5);
    });
    it("should restore reversal", () => {
      target.loadState(expected);

      expect(target.reversal).to.deep.equal(expected.options.reversal);
    });
    it("should restore source", () => {
      target.loadState(expected);

      expect(target.source).to.equal(expected.options.source);
    });
  });

  describe("primaryDataSeriesSuffix", () => {
    context("when date data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.DATE);
        expect(actual).to.equal(DataSeriesSuffix.POINT_AND_FIGURE);
      });
    });
    context("when open data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.OPEN);
        expect(actual).to.equal(DataSeriesSuffix.POINT_AND_FIGURE);
      });
    });
    context("when high data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.HIGH);
        expect(actual).to.equal(DataSeriesSuffix.POINT_AND_FIGURE);
      });
    });
    context("when low data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.LOW);
        expect(actual).to.equal(DataSeriesSuffix.POINT_AND_FIGURE);
      });
    });
    context("when close data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.CLOSE);
        expect(actual).to.equal(DataSeriesSuffix.POINT_AND_FIGURE);
      });
    });
    context("when volume data series", () => {
      it("should return kagi", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.VOLUME);
        expect(actual).to.equal(DataSeriesSuffix.POINT_AND_FIGURE);
      });
    });
  });
});
