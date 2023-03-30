/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { expect } from "chai";
import { IntlNumberFormat } from "../../../../src/scripts/exporter";

// tslint:disable:no-unused-expression

"use strict";

describe("IntlNumberFormat", () => {
  let target: IntlNumberFormat;

  beforeEach(() => {
    target = new IntlNumberFormat();
  });

  describe("className", () => {
    it("should be StockChartX.IntlNumberFormat", () => {
      expect(IntlNumberFormat.className).to.equal(
        "StockChartX.IntlNumberFormat"
      );
    });
  });

  describe("constructor", () => {
    context("when default", () => {
      it("should initialize locale with undefined", () => {
        expect(target.locale).to.be.undefined;
      });
      it("should initialize options.locale to 'en'", () => {
        expect(target.options.locale).to.equal("en");
      });
    });
    context("when locale is set", () => {
      it("should initialize locale with a given value", () => {
        target = new IntlNumberFormat("uk-UA");
        expect(target.locale).to.equal("uk-UA");
      });
    });
    context("when options", () => {
      const options = {
        minimumFractionDigits: 3,
        maximumFractionDigits: 4
      };

      it("should initialize locale", () => {
        target = new IntlNumberFormat("uk-UA", options);
        expect(target.locale).to.equal("uk-UA");
      });
      it("should set minimum fraction digits", () => {
        target = new IntlNumberFormat("uk-UA", options);
        expect(target.options.minimumFractionDigits).to.equal(
          options.minimumFractionDigits
        );
      });
      it("should set maximum fraction digits", () => {
        target = new IntlNumberFormat("uk-UA", options);
        expect(target.options.maximumFractionDigits).to.equal(
          options.maximumFractionDigits
        );
      });
    });
  });

  describe("decimalDigits", () => {
    context("when set", () => {
      it("should set minimum fraction digits", () => {
        target.setDecimalDigits(5);
        expect(target.options.minimumFractionDigits).to.equal(5);
      });
      it("should set maximum fraction digits", () => {
        target.setDecimalDigits(5);
        expect(target.options.maximumFractionDigits).to.equal(5);
      });
    });
    context("when negative value", () => {
      it("should throw exception", () => {
        expect(() => target.setDecimalDigits(-1)).to.throw();
      });
    });
    context("when NaN", () => {
      it("should throw exception", () => {
        expect(() => target.setDecimalDigits(NaN)).to.throw();
      });
    });
    context("when infinity", () => {
      it("should throw exception", () => {
        expect(() => target.setDecimalDigits(Infinity)).to.throw();
      });
    });
    context("when negative infinity", () => {
      it("should throw exception", () => {
        expect(() => target.setDecimalDigits(-Infinity)).to.throw();
      });
    });
  });

  describe("format", () => {
    context("when integer value", () => {
      it("should return string representation", () => {
        expect(target.format(123)).to.equal("123");
      });
    });
    context("when decimal digits 3", () => {
      it("should return 123.000", () => {
        target.setDecimalDigits(3);
        expect(target.format(123)).to.equal("123.000");
      });
    });
    context("when 123.456 and decimal digits is 3", () => {
      it("should return '123.456'", () => {
        target.setDecimalDigits(3);
        expect(target.format(123.456)).to.equal("123.456");
      });
    });
    context("when 123.4567 and decimal digits is 3", () => {
      it("should return '123.457", () => {
        expect(target.format(123.4567)).to.equal("123.457");
      });
    });
  });

  describe("saveState", () => {
    it("should return state", () => {
      target.locale = "uk";
      target.setDecimalDigits(3);

      const expected = {
        className: "StockChartX.IntlNumberFormat",
        locale: "uk",
        options: {
          locale: "uk",
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
          minimumIntegerDigits: 1,
          numberingSystem: "latn",
          style: "decimal",
          useGrouping: true
        }
      };
      expect(target.saveState()).to.deep.equal(expected);
    });
  });

  describe("loadState", () => {
    it("should restore state", () => {
      const state = {
        className: "StockChartX.IntlNumberFormat",
        locale: "uk-UA",
        options: {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3
        }
      };
      target.loadState(state);

      expect(target.locale).to.equal("uk-UA");
      expect(target.options.minimumFractionDigits).to.equal(3);
      expect(target.options.maximumFractionDigits).to.equal(3);
    });
  });
});
