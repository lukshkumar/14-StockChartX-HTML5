/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { expect } from "chai";
import { CustomTimeIntervalDateTimeFormat } from "../../../../src/scripts/exporter";
import { TimeSpan } from "../../../../src/scripts/StockChartX/Data/TimeFrame";

// tslint:disable:no-unused-expression

"use strict";

describe("CustomTimeIntervalDateTimeFormat", () => {
  let target: CustomTimeIntervalDateTimeFormat;

  beforeEach(() => {
    target = new CustomTimeIntervalDateTimeFormat();
  });

  describe("className", () => {
    it("should be StockChartX.CustomTimeIntervalDateTimeFormat", () => {
      expect(CustomTimeIntervalDateTimeFormat.className).to.equal(
        "StockChartX.CustomTimeIntervalDateTimeFormat"
      );
    });
  });

  describe("timeInterval", () => {
    context("when positive value", () => {
      it("should change format string", () => {
        target.timeInterval = TimeSpan.MILLISECONDS_IN_HOUR;
        expect(target.timeInterval).to.equal(TimeSpan.MILLISECONDS_IN_HOUR);
      });
    });
    context("when negative value", () => {
      it("should throw exception", () => {
        expect(() => (target.timeInterval = -1)).to.throw;
      });
    });
    context("when 0", () => {
      it("should throw exception", () => {
        expect(() => (target.timeInterval = 0)).to.throw;
      });
    });
    context("when infinity", () => {
      it("should throw exception", () => {
        expect(() => (target.timeInterval = Infinity)).to.throw;
      });
    });
    context("when negative infinity", () => {
      it("should throw exception", () => {
        expect(() => (target.timeInterval = -Infinity)).to.throw;
      });
    });
    context("when NaN", () => {
      it("should throw exception", () => {
        expect(() => (target.timeInterval = NaN)).to.throw;
      });
    });
  });

  describe("constructor", () => {
    context("when default", () => {
      it("should initialize time interval with undefined", () => {
        expect(target.timeInterval).to.be.undefined;
      });
    });
    context("when time interval", () => {
      it("should initialize time interval", () => {
        target = new CustomTimeIntervalDateTimeFormat(
          TimeSpan.MILLISECONDS_IN_HOUR
        );
        expect(target.timeInterval).to.equal(TimeSpan.MILLISECONDS_IN_HOUR);
      });
    });
  });

  describe("format", () => {
    context("when year", () => {
      it("should return year only", () => {
        target.timeInterval = TimeSpan.MILLISECONDS_IN_YEAR;
        const actual = target.format(new Date(2015, 4, 10, 11, 12));
        expect(actual).to.equal("2015");
      });
    });
    context("when month", () => {
      it("should return year and month", () => {
        target.timeInterval = TimeSpan.MILLISECONDS_IN_MONTH;
        const actual = target.format(new Date(2015, 4, 10, 11, 12));
        expect(actual).to.equal("May 2015");
      });
    });
    context("when day", () => {
      it("should return date", () => {
        target.timeInterval = TimeSpan.MILLISECONDS_IN_DAY;
        const actual = target.format(new Date(2015, 4, 10, 11, 12));
        expect(actual).to.equal("10 May 2015");
      });
    });
    context("when week", () => {
      it("should return date", () => {
        target.timeInterval = TimeSpan.MILLISECONDS_IN_WEEK;
        const actual = target.format(new Date(2015, 4, 10, 11, 12));
        expect(actual).to.equal("10 May 2015");
      });
    });
    context("when hour", () => {
      it("should return date and time", () => {
        target.timeInterval = TimeSpan.MILLISECONDS_IN_HOUR;
        const actual = target.format(new Date(2015, 4, 10, 11, 12, 13));
        expect(actual).to.equal("10 May 2015 11:12");
      });
    });
    context("when minute", () => {
      it("should return date and time", () => {
        target.timeInterval = TimeSpan.MILLISECONDS_IN_MINUTE;
        const actual = target.format(new Date(2015, 4, 10, 11, 12, 13));
        expect(actual).to.equal("10 May 2015 11:12");
      });
    });
    context("when second", () => {
      it("should return date and time", () => {
        target.timeInterval = TimeSpan.MILLISECONDS_IN_SECOND;
        const actual = target.format(new Date(2015, 4, 10, 11, 12, 13, 14));
        expect(actual).to.equal("10 May 2015 11:12:13");
      });
    });
    context("when millisecond", () => {
      it("should return date and time", () => {
        target.timeInterval = 1;
        const actual = target.format(new Date(2015, 4, 10, 11, 12, 13, 14));
        expect(actual).to.equal("10 May 2015 11:12:13.014");
      });
    });
  });

  describe("saveState", () => {
    it("should return state", () => {
      target.locale = "uk-UA";
      target.timeInterval = TimeSpan.MILLISECONDS_IN_HOUR;

      const expected = {
        className: "StockChartX.CustomTimeIntervalDateTimeFormat",
        timeInterval: TimeSpan.MILLISECONDS_IN_HOUR,
        locale: "uk-UA"
      };
      expect(target.saveState()).to.deep.equal(expected);
    });
  });

  describe("loadState", () => {
    const state = {
      className: "StockChartX.CustomTimeIntervalDateTimeFormat",
      timeInterval: TimeSpan.MILLISECONDS_IN_HOUR,
      locale: "uk-UA"
    };

    it("should restore locale", () => {
      target.loadState(state);
      expect(target.locale).to.equal("uk-UA");
    });
    it("should restore time interval", () => {
      target.loadState(state);
      expect(target.timeInterval).to.equal(TimeSpan.MILLISECONDS_IN_HOUR);
    });
  });
});
