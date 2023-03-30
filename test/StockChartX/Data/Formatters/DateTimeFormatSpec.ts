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
  CustomTimeIntervalDateTimeFormat,
  DateTimeFormat,
  CustomDateTimeFormat,
  TimeIntervalDateTimeFormat
} from "../../../../src/scripts/exporter";

// tslint:disable:no-unused-expression

"use strict";

class TestDateTimeFormat extends DateTimeFormat {
  format(date: Date): string {
    return "";
  }
}

describe("DateTimeFormat", () => {
  let target: DateTimeFormat;

  beforeEach(() => {
    target = new TestDateTimeFormat();
  });

  describe("className", () => {
    it("should be empty string", () => {
      expect(DateTimeFormat.className).to.equal("");
    });
  });

  describe("registeredFormatters", () => {
    it("should return registered formatters", () => {
      const expected = {
        "StockChartX.CustomDateTimeFormat": CustomDateTimeFormat,
        "StockChartX.TimeIntervalDateTimeFormat": TimeIntervalDateTimeFormat,
        "StockChartX.CustomTimeIntervalDateTimeFormat": CustomTimeIntervalDateTimeFormat
      };
      expect(DateTimeFormat.registeredFormatters).to.deep.equal(expected);
    });
  });

  describe("register", () => {
    context("when class name", () => {
      it("should register formatter", () => {
        const expected = {
          "StockChartX.CustomDateTimeFormat": CustomDateTimeFormat,
          "StockChartX.TimeIntervalDateTimeFormat": TimeIntervalDateTimeFormat,
          "StockChartX.CustomTimeIntervalDateTimeFormat": CustomTimeIntervalDateTimeFormat,
          test: TestDateTimeFormat
        };
        DateTimeFormat.register("test", TestDateTimeFormat);

        expect(DateTimeFormat.registeredFormatters).to.deep.equal(expected);
      });
    });
    context("when constructor", () => {
      it("should throw exception", () => {
        expect(() => DateTimeFormat.register(TestDateTimeFormat)).to.throw();
      });
    });
  });

  describe("deserialize", () => {
    context("when null", () => {
      it("should return null", () => {
        expect(DateTimeFormat.deserialize(null)).to.be.null;
      });
    });
    context("when undefined", () => {
      it("should return null", () => {
        expect(DateTimeFormat.deserialize(undefined)).to.be.null;
      });
    });
    context("when state does not contain class name", () => {
      it("should throw exception", () => {
        expect(() => DateTimeFormat.deserialize(<any>{})).to.throw();
      });
    });
    context("when state contains empty class name", () => {
      it("should throw exception", () => {
        const state = {
          className: "",
          locale: ""
        };
        expect(() => DateTimeFormat.deserialize(state)).to.throw();
      });
    });
    context("when class name is not registered", () => {
      it("should throw exception", () => {
        const state = {
          className: "Some unknown class",
          locale: ""
        };
        expect(() => DateTimeFormat.deserialize(state)).to.throw();
      });
    });
    context("when CustomDateTimeFormat state", () => {
      const state = {
        className: "StockChartX.CustomDateTimeFormat",
        formatString: "YYYY-MM-DD",
        locale: "uk-UA"
      };

      it("should not throw exception", () => {
        expect(() => DateTimeFormat.deserialize(state)).to.not.throw();
      });
      it("should return instance of CustomDateTimeFormat", () => {
        expect(() => DateTimeFormat.deserialize(state)).to.be.instanceOf(
          CustomDateTimeFormat.constructor
        );
      });
    });
    context("when TimeIntervalDateTimeFormat state", () => {
      const state = {
        className: "StockChartX.TimeIntervalDateTimeFormat",
        locale: "uk-UA",
        timeInterval: 10
      };

      it("should not throw exception", () => {
        expect(() => DateTimeFormat.deserialize(state)).to.not.throw();
      });
      it("should return instance of IntlNumberFormat", () => {
        expect(() => DateTimeFormat.deserialize(state)).to.be.instanceOf(
          TimeIntervalDateTimeFormat.constructor
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
