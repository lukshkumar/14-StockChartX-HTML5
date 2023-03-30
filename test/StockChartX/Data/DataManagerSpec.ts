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

import { DataManager, DataSeries, IBar } from "../../../src/scripts/exporter";
"use strict";

describe("DataManager", () => {
  let target: DataManager;

  beforeEach(() => {
    target = new DataManager();
  });

  describe("dateDataSeries", () => {
    context("when no data series", () => {
      it("should return null", () => {
        expect(target.dateDataSeries).to.be.null;
      });
    });
    context("when no date data series", () => {
      it("should return null", () => {
        expect(target.dateDataSeries).to.be.null;
      });
    });
    context("when date data series exists", () => {
      it("should return data series", () => {
        target.addBarDataSeries();

        expect(target.dateDataSeries).to.exist;
        expect(target.dateDataSeries.name).to.equal(".date");
      });
    });
  });

  describe("addBarDataSeries", () => {
    context("when symbol is not specified", () => {
      it("should return object with data series", () => {
        const actual = target.addBarDataSeries();

        expect(actual).to.deep.equal(target.barDataSeries());
      });
    });
    context("when symbol is specified", () => {
      it("should return object with data series", () => {
        const actual = target.addBarDataSeries("aapl");

        expect(actual).to.deep.equal(target.barDataSeries("aapl"));
      });
    });
  });

  describe("barDataSeries", () => {
    context("when symbol is not specified", () => {
      context("when createIfNotFound is true", () => {
        const manager = new DataManager();
        const actual = manager.barDataSeries("", true);

        it("should return object with data series", () => {
          expect(actual).to.exist;
          expect(actual.date).to.exist;
          expect(actual.open).to.exist;
          expect(actual.high).to.exist;
          expect(actual.low).to.exist;
          expect(actual.close).to.exist;
          expect(actual.volume).to.exist;
        });
        it("should add data series", () => {
          expect(manager.getDataSeries(".date")).to.equal(actual.date);
          expect(manager.getDataSeries(".open")).to.equal(actual.open);
          expect(manager.getDataSeries(".high")).to.equal(actual.high);
          expect(manager.getDataSeries(".low")).to.equal(actual.low);
          expect(manager.getDataSeries(".close")).to.equal(actual.close);
          expect(manager.getDataSeries(".volume")).to.equal(actual.volume);
        });
      });
      context("when data series exist", () => {
        it("should return object with data series", () => {
          target.addBarDataSeries();

          const actual = target.barDataSeries();
          expect(actual).to.exist;
          expect(actual.date).to.exist;
          expect(actual.open).to.exist;
          expect(actual.high).to.exist;
          expect(actual.low).to.exist;
          expect(actual.close).to.exist;
          expect(actual.volume).to.exist;
        });
        it("should return bar data series", () => {
          target.addBarDataSeries();

          const actual = target.barDataSeries();
          expect(target.getDataSeries(".date")).to.equal(actual.date);
          expect(target.getDataSeries(".open")).to.equal(actual.open);
          expect(target.getDataSeries(".high")).to.equal(actual.high);
          expect(target.getDataSeries(".low")).to.equal(actual.low);
          expect(target.getDataSeries(".close")).to.equal(actual.close);
          expect(target.getDataSeries(".volume")).to.equal(actual.volume);
        });
      });
      context(
        "when data series not found and createIfNotFound is false",
        () => {
          it("should return object with null data series", () => {
            const actual = target.barDataSeries();

            expect(actual).to.deep.equal({
              date: null,
              open: null,
              high: null,
              low: null,
              close: null,
              volume: null
            });
          });
        }
      );
    });
    context("when symbol is specified", () => {
      context("when createIfNotFound is true", () => {
        const manager = new DataManager();
        const actual = manager.barDataSeries("aapl", true);

        it("should return object with data series", () => {
          expect(actual).to.exist;
          expect(actual.date).to.exist;
          expect(actual.open).to.exist;
          expect(actual.high).to.exist;
          expect(actual.low).to.exist;
          expect(actual.close).to.exist;
          expect(actual.volume).to.exist;
        });
        it("should add data series", () => {
          expect(manager.getDataSeries("aapl.date")).to.equal(actual.date);
          expect(manager.getDataSeries("aapl.open")).to.equal(actual.open);
          expect(manager.getDataSeries("aapl.high")).to.equal(actual.high);
          expect(manager.getDataSeries("aapl.low")).to.equal(actual.low);
          expect(manager.getDataSeries("aapl.close")).to.equal(actual.close);
          expect(manager.getDataSeries("aapl.volume")).to.equal(actual.volume);
        });
      });
      context("when data series exist", () => {
        it("should return object with data series", () => {
          target.addBarDataSeries("aapl");

          const actual = target.barDataSeries("aapl");
          expect(actual).to.exist;
          expect(actual.date).to.exist;
          expect(actual.open).to.exist;
          expect(actual.high).to.exist;
          expect(actual.low).to.exist;
          expect(actual.close).to.exist;
          expect(actual.volume).to.exist;
        });
        it("should add data series", () => {
          target.addBarDataSeries("aapl");

          const actual = target.barDataSeries("aapl");
          expect(target.getDataSeries("aapl.date")).to.equal(actual.date);
          expect(target.getDataSeries("aapl.open")).to.equal(actual.open);
          expect(target.getDataSeries("aapl.high")).to.equal(actual.high);
          expect(target.getDataSeries("aapl.low")).to.equal(actual.low);
          expect(target.getDataSeries("aapl.close")).to.equal(actual.close);
          expect(target.getDataSeries("aapl.volume")).to.equal(actual.volume);
        });
      });
      context("when createIfNotFound is false", () => {
        it("should return object with null data series", () => {
          const actual = target.barDataSeries("aapl");

          expect(actual).to.deep.equal({
            date: null,
            open: null,
            high: null,
            low: null,
            close: null,
            volume: null
          });
        });
      });
    });
  });

  describe("ohlcDataSeries", () => {
    context("when symbol is not specified", () => {
      context("when createIfNotFound is true", () => {
        const manager = new DataManager();
        const actual = manager.ohlcDataSeries("", true);

        it("should return object with data series", () => {
          expect(actual).to.exist;
          expect(actual.open).to.exist;
          expect(actual.high).to.exist;
          expect(actual.low).to.exist;
          expect(actual.close).to.exist;
        });
        it("should add data series", () => {
          expect(manager.getDataSeries(".open")).to.equal(actual.open);
          expect(manager.getDataSeries(".high")).to.equal(actual.high);
          expect(manager.getDataSeries(".low")).to.equal(actual.low);
          expect(manager.getDataSeries(".close")).to.equal(actual.close);
        });
      });
      context("when data series exist", () => {
        it("should return object with data series", () => {
          target.addBarDataSeries();

          const actual = target.ohlcDataSeries();
          expect(actual).to.exist;
          expect(actual.open).to.exist;
          expect(actual.high).to.exist;
          expect(actual.low).to.exist;
          expect(actual.close).to.exist;
        });
        it("should add data series", () => {
          target.addBarDataSeries();

          const actual = target.ohlcDataSeries();
          expect(target.getDataSeries(".open")).to.equal(actual.open);
          expect(target.getDataSeries(".high")).to.equal(actual.high);
          expect(target.getDataSeries(".low")).to.equal(actual.low);
          expect(target.getDataSeries(".close")).to.equal(actual.close);
        });
      });
      context("when createIfNotFound is false", () => {
        it("should return object with null data series", () => {
          const actual = target.ohlcDataSeries();

          expect(actual).to.deep.equal({
            open: null,
            high: null,
            low: null,
            close: null
          });
        });
      });
    });
    context("when symbol is specified", () => {
      context("when createIfNotFound is true", () => {
        const manager = new DataManager();
        const actual = manager.ohlcDataSeries("aapl", true);

        it("should return object with data series", () => {
          expect(actual).to.exist;
          expect(actual.open).to.exist;
          expect(actual.high).to.exist;
          expect(actual.low).to.exist;
          expect(actual.close).to.exist;
        });
        it("should add data series", () => {
          expect(manager.getDataSeries("aapl.open")).to.equal(actual.open);
          expect(manager.getDataSeries("aapl.high")).to.equal(actual.high);
          expect(manager.getDataSeries("aapl.low")).to.equal(actual.low);
          expect(manager.getDataSeries("aapl.close")).to.equal(actual.close);
        });
      });
      context("when data series exist", () => {
        it("should return object with data series", () => {
          target.addBarDataSeries("aapl");

          const actual = target.ohlcDataSeries("aapl");
          expect(actual).to.exist;
          expect(actual.open).to.exist;
          expect(actual.high).to.exist;
          expect(actual.low).to.exist;
          expect(actual.close).to.exist;
        });
        it("should add data series", () => {
          target.addBarDataSeries("aapl");

          const actual = target.ohlcDataSeries("aapl");
          expect(target.getDataSeries("aapl.open")).to.equal(actual.open);
          expect(target.getDataSeries("aapl.high")).to.equal(actual.high);
          expect(target.getDataSeries("aapl.low")).to.equal(actual.low);
          expect(target.getDataSeries("aapl.close")).to.equal(actual.close);
        });
      });
      context("when createIfNotFound is false", () => {
        it("should return object with null data series", () => {
          const actual = target.ohlcDataSeries("aapl");

          expect(actual).to.deep.equal({
            open: null,
            high: null,
            low: null,
            close: null
          });
        });
      });
    });
  });

  describe("addDataSeries", () => {
    context("when name", () => {
      context("when data series with the same name does not exist", () => {
        it("should add data series", () => {
          target.addDataSeries("sma");

          expect(target.getDataSeries("sma")).to.exist;
        });
        it("should return added data series", () => {
          const actual = target.addDataSeries("sma");
          expect(actual).to.deep.equal(target.getDataSeries("sma"));
        });
      });
      context("when data series with the same name exists", () => {
        it("should throw exception", () => {
          target.addBarDataSeries();

          expect(() => target.addDataSeries(".close")).to.throw(Error);
        });
      });
      context("when should replace data series", () => {
        it("should replace data series", () => {
          target.addBarDataSeries();
          const old = target.getDataSeries(".close");
          target.addDataSeries(".close", true);

          expect(target.getDataSeries(".close")).to.not.equal(old);
        });
        it("should return replaced data series", () => {
          target.addBarDataSeries();
          const actual = target.addDataSeries(".close", true);

          expect(actual).to.exist;
          expect(target.getDataSeries(".close")).to.equal(actual);
        });
      });
    });
    context("when data series", () => {
      const expected = new DataSeries(".close");

      context("when data series with the same name does not exist", () => {
        it("should add data series", () => {
          target.addDataSeries(expected);

          expect(target.getDataSeries(".close")).to.exist;
        });
        it("should return added data series", () => {
          expect(target.addDataSeries(expected)).to.equal(expected);
        });
      });
      context("when data series with the same name exists", () => {
        it("should throw exception", () => {
          target.addBarDataSeries();

          expect(() => target.addDataSeries(expected)).to.throw(Error);
        });
      });
      context("when should replace data series", () => {
        it("should replace data series", () => {
          target.addBarDataSeries();
          const old = target.getDataSeries(".close");
          target.addDataSeries(expected, true);

          expect(target.getDataSeries(".close")).to.not.equal(old);
        });
        it("should return replaced data series", () => {
          target.addBarDataSeries();
          const actual = target.addDataSeries(expected, true);

          expect(actual).to.exist;
          expect(target.getDataSeries(".close")).to.equal(actual);
        });
      });
    });
  });

  describe("findDataSeries", () => {
    context("when data series does not exist", () => {
      it("should return null", () => {
        expect(target.findDataSeries(".unknown")).to.be.null;
      });
    });
    context("when set name instead of suffix", () => {
      it("should return data series", () => {
        target.addDataSeries("goog.sma");

        expect(target.findDataSeries("goog.sma")).to.exist;
      });
    });
    context("when name equals to suffix", () => {
      it("should return data series", () => {
        target.addBarDataSeries();
        const actual = target.findDataSeries(".close");

        expect(actual).to.exist;
        expect(actual.name).to.equal(".close");
      });
    });
    context("when name does not equal to suffix", () => {
      it("should return data series", () => {
        target.addDataSeries("goog.sma");

        const actual = target.findDataSeries(".sma");
        expect(actual).to.exist;
        expect(actual.name).to.equal("goog.sma");
      });
    });
  });

  describe("getDataSeries", () => {
    context("when data series does not exist", () => {
      it("should return null", () => {
        expect(target.getDataSeries("unknown")).to.be.null;
      });
    });
    context("when suffix is specified instead of name", () => {
      it("should return null", () => {
        target.addDataSeries("goog.sma");

        expect(target.getDataSeries(".sma")).to.be.null;
      });
    });
    context("when name equals to suffix", () => {
      it("should return data series", () => {
        target.addBarDataSeries();
        const actual = target.getDataSeries(".close");

        expect(actual).to.exist;
        expect(actual.name).to.equal(".close");
      });
    });
    context("when name does not equal to suffix", () => {
      it("should return data series", () => {
        target.addDataSeries("goog.sma");

        const actual = target.getDataSeries("goog.sma");
        expect(actual).to.exist;
        expect(actual.name).to.equal("goog.sma");
      });
    });
    context("when data series should be added", () => {
      it("should add data series", () => {
        target.addDataSeries("sma");

        expect(target.getDataSeries("sma")).to.exist;
      });
      it("should return added data series", () => {
        const actual = target.addDataSeries("sma");

        expect(actual).to.equal(target.getDataSeries("sma"));
      });
    });
  });

  describe("indexByDate", () => {
    context("when date not found", () => {
      it("should return null", () => {
        target.addBarDataSeries();
        target.dateDataSeries.values = [
          new Date(10),
          new Date(100),
          new Date(200),
          new Date(300)
        ];

        expect(target.indexByDate(new Date())).to.be.null;
        expect(target.indexByDate(new Date(20))).to.be.null;
        expect(target.indexByDate(new Date(150))).to.be.null;
        expect(target.indexByDate(new Date(400))).to.be.null;
      });
    });
    context("when date found", () => {
      it("should return index", () => {
        target.addBarDataSeries();
        target.dateDataSeries.values = [
          new Date(10),
          new Date(100),
          new Date(200),
          new Date(300)
        ];

        expect(target.indexByDate(new Date(10))).to.equal(0);
        expect(target.indexByDate(new Date(100))).to.equal(1);
        expect(target.indexByDate(new Date(300))).to.equal(3);
      });
    });
  });

  describe("clear", () => {
    context("when name is specified", () => {
      it("should clear data series by name", () => {
        target.addBarDataSeries();
        const ds = target.barDataSeries();
        ds.open.add(1);
        ds.close.add(2);

        target.clearDataSeries(".close");
        expect(ds.open.length).to.equal(1);
        expect(ds.close.length).to.equal(0);
      });
    });
    context("when data series is specified", () => {
      it("should clear data series", () => {
        target.addBarDataSeries();
        const ds = target.barDataSeries();
        ds.open.add(1);
        ds.close.add(2);

        target.clearDataSeries(ds.open);
        expect(ds.open.length).to.equal(0);
        expect(ds.close.length).to.equal(1);
      });
    });
    context("when argument is missing", () => {
      it("should clear all data series", () => {
        target.addBarDataSeries();
        const ds = target.barDataSeries();
        ds.open.add(1);
        ds.close.add(2);

        target.clearDataSeries();
        expect(ds.open.length).to.equal(0);
        expect(ds.close.length).to.equal(0);
      });
    });
  });

  describe("trimDataSeries", () => {
    context("when negative number", () => {
      it("should clear data series", () => {
        target.addBarDataSeries();
        const ds = target.barDataSeries();
        ds.open.add(1, 2, 3);
        ds.close.add(5, 6, 7);

        target.trimDataSeries(-2);
        expect(ds.open.length).to.equal(0);
        expect(ds.close.length).to.equal(0);
      });
    });
    context("when 0", () => {
      it("should clear data series", () => {
        target.addBarDataSeries();
        const ds = target.barDataSeries();
        ds.open.add(1, 2, 3);
        ds.close.add(5, 6, 7);

        target.trimDataSeries(0);
        expect(ds.open.length).to.equal(0);
        expect(ds.close.length).to.equal(0);
      });
    });
    context("when positive number", () => {
      it("should leave specified number of values", () => {
        target.addBarDataSeries();
        const ds = target.barDataSeries();
        ds.open.add(1, 2, 3);
        ds.close.add(5, 6, 7);

        target.trimDataSeries(2);
        expect(ds.open.values).to.deep.equal([2, 3]);
        expect(ds.close.values).to.deep.equal([6, 7]);
      });
    });
  });

  describe("removeDataSeries", () => {
    context("when name", () => {
      context("when not found", () => {
        it("should not throw exception", () => {
          expect(() => target.removeDataSeries("unknown")).not.throw();
        });
      });
      context("when found", () => {
        it("should remove data series", () => {
          target.addBarDataSeries();
          target.removeDataSeries(".close");

          expect(target.getDataSeries(".close")).to.be.null;
        });
      });
    });
    context("when data series", () => {
      context("when not found", () => {
        it("should not throw exception", () => {
          expect(() => target.removeDataSeries(new DataSeries())).not.throw();
        });
      });
      context("when found", () => {
        it("should remove data series", () => {
          target.addBarDataSeries();
          target.removeDataSeries(target.getDataSeries(".close"));

          expect(target.getDataSeries(".close")).to.be.null;
        });
      });
    });
    context("when argument is missing", () => {
      it("should remove all data series", () => {
        target.addBarDataSeries();
        target.removeDataSeries();

        expect(target.barDataSeries()).to.deep.equal({
          date: null,
          open: null,
          high: null,
          low: null,
          close: null,
          volume: null
        });
      });
    });
  });

  describe("appendBars", () => {
    context("when single bar", () => {
      it("should append bar", () => {
        const expected: IBar = {
          date: new Date(),
          open: 2,
          high: 3,
          low: 4,
          close: 5,
          volume: 6
        };
        target.addBarDataSeries();
        target.appendBars(expected);

        const actual = target.bar(0);
        expect(actual).to.deep.equal(expected);
      });
    });
    context("when array of bars", () => {
      it("should append array of bars", () => {
        const bar1: IBar = {
          date: new Date(1),
          open: 2,
          high: 3,
          low: 4,
          close: 5,
          volume: 6
        };
        const bar2: IBar = {
          date: new Date(11),
          open: 21,
          high: 31,
          low: 41,
          close: 51,
          volume: 61
        };
        target.addBarDataSeries();
        target.appendBars([bar1, bar2]);

        expect(target.bar(0)).to.deep.equal(bar1);
        expect(target.bar(1)).to.deep.equal(bar2);
      });
    });
    context("when variable number of bars", () => {
      it("should append multiple bars", () => {
        const bar1: IBar = {
          date: new Date(1),
          open: 2,
          high: 3,
          low: 4,
          close: 5,
          volume: 6
        };
        const bar2: IBar = {
          date: new Date(11),
          open: 21,
          high: 31,
          low: 41,
          close: 51,
          volume: 61
        };
        target.addBarDataSeries();
        target.appendBars(bar1, bar2);

        expect(target.bar(0)).to.deep.equal(bar1);
        expect(target.bar(1)).to.deep.equal(bar2);
      });
    });
  });

  describe("bar", () => {
    context("when number", () => {
      context("when index is out of range", () => {
        it("should return null", () => {
          target.addBarDataSeries();
          expect(target.bar(0)).to.be.null;
        });
      });
      context("when index is valid", () => {
        it("should return bar at a given index", () => {
          const bar: IBar = {
            date: new Date(),
            open: 2,
            high: 3,
            low: 4,
            close: 5,
            volume: 6
          };
          target.addBarDataSeries();
          target.appendBars(bar);

          const actual = target.bar(0);
          expect(actual).to.deep.equal(bar);
        });
      });
    });
    context("when date", () => {
      const bar: IBar = {
        date: new Date(),
        open: 2,
        high: 3,
        low: 4,
        close: 5,
        volume: 6
      };

      context("when there is bar with a given date", () => {
        it("should return bar", () => {
          target.addBarDataSeries();
          target.appendBars(bar);

          const actual = target.bar(bar.date);
          expect(actual).to.deep.equal(bar);
        });
      });
      context("when data series is empty", () => {
        it("should return null", () => {
          target.addBarDataSeries();

          expect(target.bar(new Date(100))).to.be.null;
        });
      });
      context("when bar with a given date not found", () => {
        it("should return null", () => {
          target.addBarDataSeries();
          target.appendBars(bar);

          expect(target.bar(new Date(100))).to.be.null;
        });
      });
    });
  });
});
