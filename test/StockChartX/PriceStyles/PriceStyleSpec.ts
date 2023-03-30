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
  BarPlot,
  PriceStyle,
  Plot,
  Chart,
  Environment,
  BarPriceStyle,
  CandlePriceStyle,
  ColoredBarPriceStyle,
  HeikinAshiPriceStyle,
  HollowCandlePriceStyle,
  KagiPriceStyle,
  LineBreakPriceStyle,
  MountainPriceStyle,
  RenkoPriceStyle
} from "../../../src/scripts/exporter";

// tslint:disable:no-unused-expression

"use strict";

class PriceStyleStub extends PriceStyle {
  createPlot(): Plot {
    return null;
  }
}

describe("PriceStyle", () => {
  let chart: Chart;
  let target: PriceStyle;

  beforeEach(() => {
    Environment.Path.view = "../src/view/";
    Environment.Path.locales = "../src/locales/";
    chart = new Chart({
      container: $("<div></div>").appendTo($("body"))
    });
    target = new PriceStyleStub({
      chart: chart
    });
  });

  afterEach(() => {
    chart.destroy();
  });

  describe("className", () => {
    it("should return empty string", () => {
      expect(PriceStyle.className).to.equal("");
    });
  });

  describe("registeredPriceStyles", () => {
    it("should return list of registered price styles", () => {
      const actual = <any>PriceStyle.registeredPriceStyles;

      expect(actual.bar).to.instanceOf(BarPriceStyle.constructor);
      expect(actual.candle).to.instanceOf(CandlePriceStyle.constructor);
      expect(actual.coloredBar).to.instanceOf(ColoredBarPriceStyle.constructor);
      expect(actual.heikinAshi).to.instanceOf(HeikinAshiPriceStyle.constructor);
      expect(actual.hollowCandle).to.instanceOf(
        HollowCandlePriceStyle.constructor
      );
      expect(actual.kagi).to.instanceOf(KagiPriceStyle.constructor);
      expect(actual.lineBreak).to.instanceOf(LineBreakPriceStyle.constructor);
      expect(actual.mountain).to.instanceOf(MountainPriceStyle.constructor);
      expect(actual.pointAndFigure).to.instanceOf(
        PointAndFigurePriceStyle.constructor
      );
      expect(actual.renko).to.instanceOf(RenkoPriceStyle.constructor);
    });
  });

  describe("constructor", () => {
    context("when default", () => {
      it("should initialize plot with undefined", () => {
        expect(target.plot).to.be.undefined;
      });
      it("should initialize chart", () => {
        expect(target.chart).to.equal(chart);
      });
      it("should initialize chart panel with undefined", () => {
        expect(target.chartPanel).to.be.undefined;
      });
    });
    context("when chart is not specified", () => {
      it("should initialize chart with undefined", () => {
        target = new PriceStyleStub();
        expect(target.chart).to.be.undefined;
      });
      it("should initialize chart panel with undefined", () => {
        target = new PriceStyleStub();
        expect(target.chartPanel).to.be.undefined;
      });
    });
  });

  describe("save", () => {
    it("should return serialized state", () => {
      const expected = {
        className: "",
        options: {}
      };
      expect(target.saveState()).to.deep.equal(expected);
    });
  });

  describe("dataSeriesSuffix", () => {
    it("should return empty string", () => {
      expect(target.dataSeriesSuffix()).to.equal("");
    });
  });

  describe("primaryDataSeriesSuffix", () => {
    context("when date data series", () => {
      it("should return empty string", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.DATE);

        expect(actual).to.equal("");
      });
    });
    context("when open data series", () => {
      it("should return empty string", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.OPEN);

        expect(actual).to.equal("");
      });
    });
    context("when high data series", () => {
      it("should return empty string", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.HIGH);

        expect(actual).to.equal("");
      });
    });
    context("when low data series", () => {
      it("should return empty string", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.LOW);

        expect(actual).to.equal("");
      });
    });
    context("when close data series", () => {
      it("should return empty string", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.CLOSE);

        expect(actual).to.equal("");
      });
    });
    context("when volume data series", () => {
      it("should return empty string", () => {
        const actual = target.primaryDataSeriesSuffix(DataSeriesSuffix.VOLUME);

        expect(actual).to.equal("");
      });
    });
  });

  describe("apply", () => {
    context("when plot is not specified", () => {
      it("should throw exception", () => {
        expect(() => target.apply()).to.throw;
      });
    });
    context("when plot is specified", () => {
      let plot = null;
      const setup = () => {
        plot = new BarPlot();
        target = new PriceStyleStub({
          chart: chart
        });
        PriceStyleStub.prototype.createPlot = () => plot;
        target.apply();
      };

      it("should set plot", () => {
        setup();
        expect(target.plot).to.deep.equal(plot);
      });
      it("should set panel to main panel", () => {
        setup();
        expect(target.chartPanel).to.deep.equal(chart.mainPanel);
      });
      it("should add plot to the panel", () => {
        setup();
        expect(chart.mainPanel.containsPlot(plot)).to.be.true;
      });
      it("should set proper data series to the plot", () => {
        setup();
        const series = chart.barDataSeries();
        const expected = [series.close, series.open, series.high, series.low];
        expect(target.plot.dataSeries).to.deep.equal(expected);
      });
    });
  });
});
