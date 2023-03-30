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
"use strict";

import {
  TimeIntervalDateTimeFormat,
  CustomDateTimeFormat,
  TimeSpan,
  DateTimeFormatName
} from "../../../../src/scripts/exporter";

describe("TimeIntervalDateTimeFormat", () => {
  let target: TimeIntervalDateTimeFormat;

  beforeEach(() => {
    target = new TimeIntervalDateTimeFormat();
  });

  describe("className", () => {
    it("should be StockChartX.TimeIntervalDateTimeFormat", () => {
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

  describe("timeInterval", () => {
    context("when set", () => {
      it("should change format string", () => {
        target.timeInterval = TimeSpan.MILLISECONDS_IN_DAY;
        expect(target.timeInterval).to.equal(TimeSpan.MILLISECONDS_IN_DAY);
      });
    });
  });

  describe("constructor", () => {
    context("when default", () => {
      it("should initialize locale with undefined", () => {
        expect(target.locale).to.be.undefined;
      });
      it("should initialize time interval with undefined", () => {
        expect(target.timeInterval).to.be.undefined;
      });
    });
    context("when time interval", () => {
      it("should initialize locale with undefined", () => {
        target = new TimeIntervalDateTimeFormat(TimeSpan.MILLISECONDS_IN_DAY);
        expect(target.locale).to.be.undefined;
      });
      it("should initialize time interval", () => {
        target = new TimeIntervalDateTimeFormat(TimeSpan.MILLISECONDS_IN_DAY);
        expect(target.timeInterval).to.equal(TimeSpan.MILLISECONDS_IN_DAY);
      });
    });
  });

  describe("formatter", () => {
    context("when year-month", () => {
      it("should return formatter", () => {
        const actual = target.formatter(DateTimeFormatName.YEAR_MONTH);
        expect(actual).to.exist;
        expect(actual.resolvedOptions()).to.deep.equal({
          locale: "en",
          calendar: "gregory",
          timeZone: undefined,
          numberingSystem: "latn",
          year: "numeric",
          month: "long"
        });
      });
    });
    context("when month-day", () => {
      it("should return formatter", () => {
        const actual = target.formatter(DateTimeFormatName.MONTH_DAY);
        expect(actual).to.exist;
        expect(actual.resolvedOptions()).to.deep.equal({
          locale: "en",
          calendar: "gregory",
          timeZone: undefined,
          numberingSystem: "latn",
          month: "long",
          day: "numeric"
        });
      });
    });
    context("when date", () => {
      it("should return formatter", () => {
        const actual = target.formatter(DateTimeFormatName.DATE);
        expect(actual).to.exist;
        expect(actual.resolvedOptions()).to.deep.equal({
          locale: "en",
          calendar: "gregory",
          timeZone: undefined,
          numberingSystem: "latn",
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      });
    });
    context("when short date time", () => {
      it("should return formatter", () => {
        const actual = target.formatter(DateTimeFormatName.SHORT_DATE_TIME);
        expect(actual).to.exist;
        expect(actual.resolvedOptions()).to.deep.equal({
          locale: "en",
          calendar: "gregory",
          timeZone: undefined,
          numberingSystem: "latn",
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
          hour: "numeric",
          hour12: false,
          minute: "2-digit",
          second: "2-digit"
        });
      });
    });
    context("when long date time", () => {
      it("should return formatter", () => {
        const actual = target.formatter(DateTimeFormatName.LONG_DATE_TIME);
        expect(actual).to.exist;
        expect(actual.resolvedOptions()).to.deep.equal({
          locale: "en",
          calendar: "gregory",
          timeZone: undefined,
          numberingSystem: "latn",
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
          hour: "numeric",
          hour12: false,
          minute: "2-digit",
          second: "2-digit"
        });
      });
    });
    context("when short time", () => {
      it("should return formatter", () => {
        const actual = target.formatter(DateTimeFormatName.SHORT_TIME);
        expect(actual).to.exist;
        expect(actual.resolvedOptions()).to.deep.equal({
          locale: "en",
          calendar: "gregory",
          timeZone: undefined,
          numberingSystem: "latn",
          hour: "numeric",
          hour12: false,
          minute: "2-digit"
        });
      });
    });
    context("when long time", () => {
      it("should return formatter", () => {
        const actual = target.formatter(DateTimeFormatName.LONG_TIME);
        expect(actual).to.exist;
        expect(actual.resolvedOptions()).to.deep.equal({
          locale: "en",
          calendar: "gregory",
          timeZone: undefined,
          numberingSystem: "latn",
          hour: "numeric",
          hour12: false,
          minute: "2-digit",
          second: "2-digit"
        });
      });
    });
    context("when formatter is unknown", () => {
      it("should throw an exception", () => {
        expect(() => target.formatter("unknown")).to.throw();
      });
    });
  });

  describe("format", () => {
    const date = new Date(2014, 1, 2, 3, 4, 5);

    context("when time frame is 1 ms", () => {
      it("should return date and time", () => {
        target.timeInterval = 1;
        expect(target.format(date)).to.equal(
          "Sunday, February 2, 2014, 3:04:05"
        );
      });
    });
    context("when time frame is 1 sec", () => {
      it("should return date and time", () => {
        target.timeInterval = TimeSpan.MILLISECONDS_IN_SECOND;
        expect(target.format(date)).to.equal(
          "Sunday, February 2, 2014, 3:04:05"
        );
      });
    });
    context("when time frame is 1 min", () => {
      it("should return date and time", () => {
        target.timeInterval = TimeSpan.MILLISECONDS_IN_MINUTE;
        expect(target.format(date)).to.equal(
          "Sunday, February 2, 2014, 3:04:05"
        );
      });
    });
    context("when time frame is 1 hour", () => {
      it("should return date and time", () => {
        target.timeInterval = TimeSpan.MILLISECONDS_IN_HOUR;
        expect(target.format(date)).to.equal(
          "Sunday, February 2, 2014, 3:04:05"
        );
      });
    });
    context("when time frame is 1 day", () => {
      it("should return date", () => {
        target.timeInterval = TimeSpan.MILLISECONDS_IN_DAY;
        expect(target.format(date)).to.equal("February 2, 2014");
      });
    });
    context("when time frame is 1 week", () => {
      it("should return date", () => {
        target.timeInterval = TimeSpan.MILLISECONDS_IN_WEEK;
        expect(target.format(date)).to.equal("February 2, 2014");
      });
    });
    context("when time frame is 1 month", () => {
      it("should return date", () => {
        target.timeInterval = TimeSpan.MILLISECONDS_IN_MONTH;
        expect(target.format(date)).to.equal("February 2014");
      });
    });
    context("when time frame is 1 year", () => {
      it("should return date", () => {
        target.timeInterval = TimeSpan.MILLISECONDS_IN_YEAR;
        expect(target.format(date)).to.equal("2014");
      });
    });
  });

  describe("formatWithFormatter", () => {
    const date = new Date(2014, 1, 2, 3, 4, 5);

    context("when formatter is year-month", () => {
      it("should return date", () => {
        const actual = target.formatWithFormatter(
          date,
          DateTimeFormatName.YEAR_MONTH
        );
        expect(actual).to.equal("February 2014");
      });
    });
    context("when formatter is month-day", () => {
      it("should return date", () => {
        const actual = target.formatWithFormatter(
          date,
          DateTimeFormatName.MONTH_DAY
        );
        expect(actual).to.equal("February 2");
      });
    });
    context("when formatter is date", () => {
      it("should return date", () => {
        const actual = target.formatWithFormatter(
          date,
          DateTimeFormatName.DATE
        );
        expect(actual).to.equal("February 2, 2014");
      });
    });
    context("when formatter is short date time", () => {
      it("should return date and time", () => {
        const actual = target.formatWithFormatter(
          date,
          DateTimeFormatName.SHORT_DATE_TIME
        );
        expect(actual).to.equal("Sunday, February 2, 2014, 3:04:05");
      });
    });
    context("when formatter is long date time", () => {
      it("should return date and time", () => {
        const actual = target.formatWithFormatter(
          date,
          DateTimeFormatName.LONG_DATE_TIME
        );
        expect(actual).to.equal("Sunday, February 2, 2014, 3:04:05");
      });
    });
    context("when formatter is short time", () => {
      it("should return time", () => {
        const actual = target.formatWithFormatter(
          date,
          DateTimeFormatName.SHORT_TIME
        );
        expect(actual).to.equal("3:04");
      });
    });
    context("when formatter is long time", () => {
      it("should return date part only", () => {
        const actual = target.formatWithFormatter(
          date,
          DateTimeFormatName.LONG_TIME
        );
        expect(actual).to.equal("3:04:05");
      });
    });
  });

  describe("saveState", () => {
    it("should return state", () => {
      target.locale = "uk-UA";
      target.timeInterval = TimeSpan.MILLISECONDS_IN_HOUR;

      const expected = {
        className: "StockChartX.TimeIntervalDateTimeFormat",
        timeInterval: TimeSpan.MILLISECONDS_IN_HOUR,
        locale: "uk-UA"
      };
      expect(target.saveState()).to.deep.equal(expected);
    });
  });

  describe("loadState", () => {
    const state = {
      className: "StockChartX.TimeIntervalDateTimeFormat",
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
