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
  NumberFormat,
  IntlNumberFormat,
  CustomNumberFormat
} from "../../../../src/scripts/exporter";

// tslint:disable:no-unused-expression

"use strict";

class TestNumberFormat extends NumberFormat {
  constructor(locale?: string) {
    super(locale);
  }

  format(value: number): string {
    return "";
  }
}

describe("NumberFormat", () => {
  let target: NumberFormat;

  beforeEach(() => {
    target = new TestNumberFormat();
  });

  describe("className", () => {
    it("should be empty string", () => {
      expect(NumberFormat.className).to.equal("");
    });
  });

  describe("registeredFormatters", () => {
    it("should return registered formatters", () => {
      const expected = {
        "StockChartX.CustomNumberFormat": CustomNumberFormat,
        "StockChartX.IntlNumberFormat": IntlNumberFormat
      };
      expect(NumberFormat.registeredFormatters).to.deep.equal(expected);
    });
  });

  describe("register", () => {
    context("when class name", () => {
      it("should register formatter", () => {
        const expected = {
          "StockChartX.CustomNumberFormat": CustomNumberFormat,
          "StockChartX.IntlNumberFormat": IntlNumberFormat,
          test: TestNumberFormat
        };
        NumberFormat.register("test", TestNumberFormat);

        expect(NumberFormat.registeredFormatters).to.deep.equal(expected);
      });
    });
    context("when constructor", () => {
      it("should throw exception", () => {
        expect(() => NumberFormat.register(TestNumberFormat)).to.throw();
      });
    });
  });

  describe("deserialize", () => {
    context("when null", () => {
      it("should return null", () => {
        expect(NumberFormat.deserialize(null)).to.be.null;
      });
    });
    context("when undefined", () => {
      it("should return null", () => {
        expect(NumberFormat.deserialize(undefined)).to.be.null;
      });
    });
    context("when state does not contain class name", () => {
      it("should throw exception", () => {
        expect(() => NumberFormat.deserialize(<any>{})).to.throw();
      });
    });
    context("when state contains empty class name", () => {
      it("should throw exception", () => {
        const state = {
          className: "",
          locale: ""
        };
        expect(() => NumberFormat.deserialize(state)).to.throw();
      });
    });
    context("when class name is not registered", () => {
      it("should throw exception", () => {
        const state = {
          className: "Some unknown class",
          locale: ""
        };
        expect(() => NumberFormat.deserialize(state)).to.throw();
      });
    });
    context("when CustomNumberFormat state", () => {
      const state = {
        className: "StockChartX.CustomNumberFormat",
        formatString: "%3d",
        locale: "uk-UA"
      };

      it("should not throw exception", () => {
        expect(() => NumberFormat.deserialize(state)).to.not.throw();
      });
      it("should return instance of CustomNumberFormat", () => {
        expect(() => NumberFormat.deserialize(state)).to.be.instanceOf(
          CustomNumberFormat.constructor
        );
      });
    });
    context("when IntlNumberFormat state", () => {
      const state = {
        className: "StockChartX.IntlNumberFormat",
        locale: "uk-UA",
        options: {
          mininumFractionDigits: 3,
          maximumFractionDigits: 5
        }
      };

      it("should not throw exception", () => {
        expect(() => NumberFormat.deserialize(state)).to.not.throw();
      });
      it("should return instance of IntlNumberFormat", () => {
        expect(() => NumberFormat.deserialize(state)).to.be.instanceOf(
          IntlNumberFormat.constructor
        );
      });
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

  describe("constructor", () => {
    context("when default", () => {
      it("should initialize locale with undefined", () => {
        expect(target.locale).to.be.undefined;
      });
    });
    context("when locale is set", () => {
      it("should initialize locale with a given value", () => {
        target = new TestNumberFormat("uk-UA");
        expect(target.locale).to.equal("uk-UA");
      });
    });
  });

  describe("saveState", () => {
    it("should return state", () => {
      target.locale = "uk-UA";

      const expected = {
        className: "",
        locale: "uk-UA"
      };
      expect(target.saveState()).to.deep.equal(expected);
    });
  });

  describe("loadState", () => {
    it("should restore state", () => {
      const state = {
        className: "",
        locale: "uk-UA"
      };
      target.loadState(state);

      expect(target.locale).to.equal("uk-UA");
    });
  });
});
