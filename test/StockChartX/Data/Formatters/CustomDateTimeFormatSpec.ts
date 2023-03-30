/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

// tslint:disable:no-unused-expression

"use strict";
import { expect } from "chai";
import { CustomDateTimeFormat } from "../../../../src/scripts/exporter";


describe("CustomDateTimeFormat", () => {
  let target: CustomDateTimeFormat;

  beforeEach(() => {
    target = new CustomDateTimeFormat();
  });

  describe("className", () => {
    it("should be StockChartX.CustomDateTimeFormat", () => {
      expect(CustomDateTimeFormat.className).to.equal(
        "StockChartX.CustomDateTimeFormat"
      );
    });
  });

  describe("locale", () => {
    context("when set", () => {
      it("should change locale", () => {
        target.locale = "uk-UA";
        expect(target.locale).to.equal("uk-UA");
      });
    });
  });

  describe("formatString", () => {
    context("when set", () => {
      it("should change format string", () => {
        target.formatString = "YYYY-MM-DD";
        expect(target.formatString).to.equal("YYYY-MM-DD");
      });
    });
  });

  describe("constructor", () => {
    context("when default", () => {
      it("should initialize locale with undefined", () => {
        expect(target.locale).to.be.undefined;
      });
      it("should initialize format string with undefined", () => {
        expect(target.formatString).to.be.undefined;
      });
    });
    context("when format string", () => {
      it("should initialize locale with undefined", () => {
        target = new CustomDateTimeFormat("YYYY");
        expect(target.locale).to.be.undefined;
      });
      it("should initialize format string", () => {
        target = new CustomDateTimeFormat("YYYY");
        expect(target.formatString).to.equal("YYYY");
      });
    });
  });

  describe("format", () => {
    context("when custom date format", () => {
      it("should return date part only", () => {
        target.formatString = "YYYY-MM-DD";
        const actual = target.format(new Date(2015, 4, 10, 11, 12));
        expect(actual).to.equal("2015-05-10");
      });
    });
  });

  describe("saveState", () => {
    it("should return state", () => {
      target.locale = "uk-UA";
      target.formatString = "YYYY";

      const expected = {
        className: "StockChartX.CustomDateTimeFormat",
        formatString: "YYYY",
        locale: "uk-UA"
      };
      expect(target.saveState()).to.deep.equal(expected);
    });
  });

  describe("loadState", () => {
    const state = {
      className: "StockChartX.CustomDateTimeFormat",
      formatString: "YYYY",
      locale: "uk-UA"
    };

    it("should restore locale", () => {
      target.loadState(state);
      expect(target.locale).to.equal("uk-UA");
    });
    it("should restore format string", () => {
      target.loadState(state);
      expect(target.formatString).to.equal("YYYY");
    });
  });
});
