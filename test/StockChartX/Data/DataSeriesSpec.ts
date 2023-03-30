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
import {
  DataSeries,
  DataSeriesSuffix,
  TDataSeriesValues
} from "../../../src/scripts/exporter";
import * as TASdk from "../../../src/scripts/TASdk/exporter";
describe("DataSeries", () => {
  let target: DataSeries;

  beforeEach(() => {
    target = new DataSeries({
      name: `AAPL${DataSeriesSuffix.CLOSE}`,
      values: [1, null, 3, null, 7, 5, 4]
    });
  });

  describe("name", () => {
    context("get", () => {
      it("should return name", () => {
        expect(target.name).to.equal("AAPL.close");
      });
    });
    context("set", () => {
      it("should set name", () => {
        target.name = "new name";
        expect(target.name).to.equal("new name");
      });
      it("should set empty name instead of null", () => {
        target.name = null;
        expect(target.name).to.equal("");
      });
      it("should set empty name instead of undefined", () => {
        target.name = undefined;
        expect(target.name).to.equal("");
      });
    });
  });

  describe("values", () => {
    context("get", () => {
      it("should return values", () => {
        expect(target.values).to.deep.equal([1, null, 3, null, 7, 5, 4]);
      });
    });
    context("set", () => {
      it("should set values", () => {
        const expected = [1, 0, 3];
        target.values = expected;
        expect(target.values).to.equal(expected);
      });
      it("should throw exception on attempt to set non-array values", () => {
        let func = () => (target.values = <TDataSeriesValues>(<any>1));
        expect(func).to.throw(Error);

        func = () => (target.values = null);
        expect(func).to.throw(Error);
      });
    });
  });

  describe("length", () => {
    context("get", () => {
      it("should return number of values", () => {
        expect(target.length).to.equal(7);

        target.values = [];
        expect(target.length).to.equal(0);
      });
    });
  });

  describe("nameSuffix", () => {
    context("get", () => {
      it("should return '.close' if name is '.close'", () => {
        expect(target.nameSuffix).to.equal(".close");
      });
      it("should return '.high' if name is 'goog.pf.high'", () => {
        target.name = "goog.pf.high";
        expect(target.nameSuffix).to.equal(".high");
      });
      it("should return null if name is 'goog'", () => {
        target.name = "goog";
        expect(target.nameSuffix).to.be.null;
      });
      it("should return null if name is ''", () => {
        target.name = "";
        expect(target.nameSuffix).to.be.null;
      });
    });
  });

  describe("isValueDataSeries", () => {
    context("get", () => {
      it("should return true if suffix is not a '.date'", () => {
        expect(target.isValueDataSeries).to.be.true;
      });
      it("should return true if name is 'goog'", () => {
        target.name = "goog";
        expect(target.isValueDataSeries).to.be.true;
      });
      it("should return true if name is ''", () => {
        target.name = "";
        expect(target.isValueDataSeries).to.be.true;
      });
      it("should return false if suffix is '.date'", () => {
        target.name = ".date";
        expect(target.isValueDataSeries).to.be.false;
      });
    });
  });

  describe("isDateDataSeries", () => {
    context("get", () => {
      it("should return false if suffix is not a '.date'", () => {
        expect(target.isDateDataSeries).to.be.false;
      });
      it("should return false if name is 'goog'", () => {
        target.name = "goog";
        expect(target.isDateDataSeries).to.be.false;
      });
      it("should return false if name is empty", () => {
        target.name = "";
        expect(target.isDateDataSeries).to.be.false;
      });
      it("should return true if name is '.date'", () => {
        target.name = ".date";
        expect(target.isDateDataSeries).to.be.true;
      });
    });
  });

  describe("firstValue", () => {
    context("when empty", () => {
      it("should return first value", () => {
        target.values = [];
        expect(target.firstValue).to.be.undefined;
      });
    });
    context("when non empty", () => {
      it("should return first value", () => {
        expect(target.firstValue).to.equal(1);
      });
    });
  });

  describe("lastValue", () => {
    context("when empty", () => {
      it("should return null", () => {
        target.values = [];
        expect(target.lastValue).to.be.null;
      });
    });
    context("when non empty", () => {
      it("should return last value", () => {
        expect(target.lastValue).to.equal(4);
      });
    });
  });

  describe("constructor", () => {
    context("when empty", () => {
      const series = new DataSeries();

      it("should set name to empty string", () => {
        expect(series.name).to.equal("");
      });
      it("should set values to empty array", () => {
        expect(series.values).to.deep.equal([]);
      });
    });
    context("when invalid config", () => {
      it("should throw exception if config is not a string or not an object", () => {
        expect(() => new DataSeries(<string>(<any>1))).to.throw(Error);
      });
    });
    context("when name", () => {
      const series = new DataSeries("sma");

      it("should have constructor that accepts name", () => {
        expect(series.name).to.equal("sma");
      });
      it("should set values to empty array", () => {
        expect(series.values).to.deep.equal([]);
      });
    });
    context("when config contains null values", () => {
      const series = new DataSeries({
        name: null,
        values: null
      });

      it("should set name to empty string", () => {
        expect(series.name).to.equal("");
      });
      it("should set values to empty array", () => {
        expect(series.values).to.deep.equal([]);
      });
    });
    context("when config", () => {
      const series = new DataSeries({
        name: "sma",
        values: [1, 2]
      });

      it("should set name", () => {
        expect(series.name).to.equal("sma");
      });
      it("should set values", () => {
        expect(series.values).to.deep.equal([1, 2]);
      });
    });
  });

  describe("valueAtIndex", () => {
    context("when existing index", () => {
      it("should return value at index", () => {
        expect(target.valueAtIndex(0)).to.equal(1);
        expect(target.valueAtIndex(1)).to.be.null;
        expect(target.valueAtIndex(2)).to.equal(3);
      });
    });
    context("when index is negative value", () => {
      it("should return undefined", () => {
        expect(target.valueAtIndex(-1)).to.be.undefined;
      });
    });
    context("when index is greater or equal to length", () => {
      it("should return undefined", () => {
        expect(target.valueAtIndex(10)).to.be.undefined;
      });
    });
    context("when set value", () => {
      it("should set value at a given index", () => {
        target.valueAtIndex(0, 10);
        expect(target.values).to.deep.equal([10, null, 3, null, 7, 5, 4]);

        target.valueAtIndex(1, 11);
        expect(target.values).to.deep.equal([10, 11, 3, null, 7, 5, 4]);

        target.valueAtIndex(7, 12);
        expect(target.values).to.deep.equal([10, 11, 3, null, 7, 5, 4, 12]);
      });
    });
  });

  describe("add", () => {
    context("when single value", () => {
      it("should append value", () => {
        target.add(10);
        expect(target.length).to.equal(8);
        expect(target.lastValue).to.equal(10);

        target.add(11);
        expect(target.length).to.equal(9);
        expect(target.lastValue).to.equal(11);
      });
    });
    context("when array of values", () => {
      it("should append values", () => {
        target.add([10, 11, 12]);

        expect(target.values).to.deep.equal([
          1,
          null,
          3,
          null,
          7,
          5,
          4,
          10,
          11,
          12
        ]);
      });
    });
    context("when multiple values", () => {
      it("should append values", () => {
        target.add(10, 11, 12);

        expect(target.values).to.deep.equal([
          1,
          null,
          3,
          null,
          7,
          5,
          4,
          10,
          11,
          12
        ]);
      });
    });
  });

  describe("updateLast", () => {
    context("when empty", () => {
      it("should do nothing", () => {
        target.values = [];
        target.updateLast(1);
        expect(target.values).to.deep.equal([]);
      });
    });
    context("when not empty", () => {
      it("should update last value", () => {
        target.updateLast(10);
        expect(target.lastValue).to.equal(10);
      });
    });
  });

  describe("clear", () => {
    it("should clear all values", () => {
      target.clear();

      expect(target.length).to.equal(0);
    });
  });

  describe("trim", () => {
    it("should trim values to a given length", () => {
      let itemsRemoved = target.trim(10);
      expect(itemsRemoved).to.equal(0);
      expect(target.length).to.equal(7);

      itemsRemoved = target.trim(5);
      expect(itemsRemoved).to.equal(2);
      expect(target.values).to.deep.equal([3, null, 7, 5, 4]);

      itemsRemoved = target.trim(1);
      expect(itemsRemoved).to.equal(4);
      expect(target.values).to.deep.equal([4]);

      itemsRemoved = target.trim(0);
      expect(itemsRemoved).to.equal(1);
      expect(target.length).to.equal(0);
    });
  });

  describe("itemsCountBetweenValues", () => {
    it("should calculate number of items between values", () => {
      expect(target.itemsCountBetweenValues(0, 2)).to.equal(1);
      expect(target.itemsCountBetweenValues(1, 5)).to.equal(4);
      expect(target.itemsCountBetweenValues(4, 10)).to.equal(3);
    });
  });

  describe("minMaxValues", () => {
    it("should search min/max values", () => {
      expect(target.minMaxValues()).to.deep.equal({ min: 1, max: 7 });
      expect(target.minMaxValues(-1, 1)).to.deep.equal({ min: 1, max: 1 });
      expect(target.minMaxValues(3, 7)).to.deep.equal({ min: 4, max: 7 });
    });
  });

  describe("floorIndex", () => {
    it("should search floor index", () => {
      target.values = [1, 2, 3, 5, 7, 8, 12];

      expect(target.floorIndex(0)).to.equal(-1);
      expect(target.floorIndex(1)).to.equal(0);
      expect(target.floorIndex(2)).to.equal(1);
      expect(target.floorIndex(4)).to.equal(2);
      expect(target.floorIndex(14)).to.equal(6);
    });
  });

  describe("ceilIndex", () => {
    it("should search ceil index", () => {
      target.values = [1, 2, 3, 5, 7, 8, 12];

      expect(target.ceilIndex(0)).to.equal(0);
      expect(target.ceilIndex(1)).to.equal(0);
      expect(target.ceilIndex(2)).to.equal(1);
      expect(target.ceilIndex(4)).to.equal(3);
      expect(target.ceilIndex(14)).to.equal(7);
    });
  });

  describe("binaryIndexOf", () => {
    it("should search element", () => {
      target.values = [1, 2, 3, 5, 7, 8, 12];

      expect(target.binaryIndexOf(0)).to.equal(~0);
      expect(target.binaryIndexOf(1)).to.equal(0);
      expect(target.binaryIndexOf(2)).to.equal(1);
      expect(target.binaryIndexOf(3)).to.equal(2);
      expect(target.binaryIndexOf(4)).to.equal(~3);
      expect(target.binaryIndexOf(5)).to.equal(3);
      expect(target.binaryIndexOf(6)).to.equal(~4);
      expect(target.binaryIndexOf(7)).to.equal(4);
      expect(target.binaryIndexOf(8)).to.equal(5);
      expect(target.binaryIndexOf(9)).to.equal(~6);
      expect(target.binaryIndexOf(10)).to.equal(~6);
      expect(target.binaryIndexOf(12)).to.equal(6);
      expect(target.binaryIndexOf(20)).to.equal(~7);
    });
  });

  describe("leftNearestVisibleValueIndex", () => {
    it("should search index of nearest visible value on left side", () => {
      expect(target.leftNearestVisibleValueIndex(0)).to.equal(0);
      expect(target.leftNearestVisibleValueIndex(1)).to.equal(0);
      expect(target.leftNearestVisibleValueIndex(2)).to.equal(2);
      expect(target.leftNearestVisibleValueIndex(10)).to.equal(6);
    });
  });

  describe("rightNearestVisibleValueIndex", () => {
    it("should search index of nearest visible value on right side.", () => {
      expect(target.rightNearestVisibleValueIndex(0)).to.equal(0);
      expect(target.rightNearestVisibleValueIndex(1)).to.equal(2);
      expect(target.rightNearestVisibleValueIndex(2)).to.equal(2);
      expect(target.rightNearestVisibleValueIndex(3)).to.equal(4);
      expect(target.rightNearestVisibleValueIndex(6)).to.equal(6);
      expect(target.rightNearestVisibleValueIndex(10)).to.equal(6);
    });
  });

  describe("toField", () => {
    it("should export values to Field", () => {
      target.values = [1, 2, 3];
      const field = target.toField("open");

      expect(field.name).to.equal("open");
      expect(field.recordCount).to.equal(3);
      expect(field._m_values).to.deep.equal([0, 1, 2, 3, 0]);
    });
  });

  describe("fromField", () => {
    context("instance method", () => {
      it("should import values from Field", () => {
        const field = new TASdk.Field();
        field._m_values = [0, 1, 2, 3, 0];
        field.recordCount = 3;
        target.fromField(field, 1);

        expect(target.values).to.deep.equal([1, 2, 3]);
      });
    });
    context("static", () => {
      it("should create new data series by importing values from Field", () => {
        const field = new TASdk.Field();
        field._m_values = [0, 1, 2, 3, 0];
        field.recordCount = 3;

        target = DataSeries.fromField(field, 1);

        expect(target.values).to.deep.equal([1, 2, 3]);
      });
    });
  });
});
