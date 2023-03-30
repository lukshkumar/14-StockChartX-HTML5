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
import {
  ChartPoint,
  Projection,
  XPointBehavior,
  YPointBehavior
} from "../../../src/scripts/exporter";

"use strict";

describe("ChartPoint", () => {
  let target: ChartPoint;
  let projection: Projection;
  let origRecordByX;
  let origDateByX;
  let origValueByY;
  let origXByDate;
  let origXByRecord;
  let origYByValue;

  before(() => {
    origRecordByX = Projection.prototype.recordByX;
    origDateByX = Projection.prototype.dateByX;
    origValueByY = Projection.prototype.valueByY;
    origXByDate = Projection.prototype.xByDate;
    origXByRecord = Projection.prototype.xByRecord;
    origYByValue = Projection.prototype.yByValue;

    Projection.prototype.recordByX = () => {
      return 1;
    };
    Projection.prototype.dateByX = () => {
      return new Date(2);
    };
    Projection.prototype.valueByY = () => {
      return 3;
    };
    Projection.prototype.xByDate = () => {
      return 4;
    };
    Projection.prototype.xByRecord = () => {
      return 5;
    };
    Projection.prototype.yByValue = () => {
      return 6;
    };

    projection = new Projection(null);
  });

  after(() => {
    Projection.prototype.recordByX = origRecordByX;
    Projection.prototype.dateByX = origDateByX;
    Projection.prototype.valueByY = origValueByY;
    Projection.prototype.xByDate = origXByDate;
    Projection.prototype.xByRecord = origXByRecord;
    Projection.prototype.yByValue = origYByValue;
  });

  describe("constructor", () => {
    context("when (x, y)", () => {
      const expected = {
        x: 10,
        y: 20
      };
      it("should initialize x", () => {
        expect(new ChartPoint(expected).x).to.equal(expected.x);
      });
      it("should initialize y", () => {
        expect(new ChartPoint(expected).y).to.equal(expected.y);
      });
    });
    context("when (x, value)", () => {
      const expected = {
        x: 10,
        value: 20
      };
      it("should initialize x", () => {
        expect(new ChartPoint(expected).x).to.equal(expected.x);
      });
      it("should initialize value", () => {
        expect(new ChartPoint(expected).value).to.equal(expected.value);
      });
    });
    context("when (date, y)", () => {
      const expected = {
        date: new Date(),
        y: 20
      };
      it("should initialize date", () => {
        expect(new ChartPoint(expected).date).to.equal(expected.date);
      });
      it("should initialize y", () => {
        expect(new ChartPoint(expected).y).to.equal(expected.y);
      });
    });
    context("when (date, value)", () => {
      const expected = {
        date: new Date(),
        value: 20
      };
      it("should initialize date", () => {
        expect(new ChartPoint(expected).date).to.equal(expected.date);
      });
      it("should initialize value", () => {
        expect(new ChartPoint(expected).value).to.equal(expected.value);
      });
    });
    context("when (record, y)", () => {
      const expected = {
        record: 10,
        y: 20
      };
      it("should initialize record", () => {
        expect(new ChartPoint(expected).record).to.equal(expected.record);
      });
      it("should initialize y", () => {
        expect(new ChartPoint(expected).y).to.equal(expected.y);
      });
    });
    context("when (record, value)", () => {
      const expected = {
        record: 10,
        value: 20
      };
      it("should initialize record", () => {
        expect(new ChartPoint(expected).record).to.equal(expected.record);
      });
      it("should initialize value", () => {
        expect(new ChartPoint(expected).value).to.equal(expected.value);
      });
    });
  });

  describe("convert", () => {
    const point = {
      x: 10,
      y: 20
    };

    context("when (date, y)", () => {
      it("should convert to (date, y) chart point", () => {
        const behavior = {
          x: XPointBehavior.DATE,
          y: YPointBehavior.Y
        };
        const expected = new ChartPoint({
          date: new Date(2),
          y: 20
        });
        const actual = ChartPoint.convert(point, behavior, projection);

        expect(actual).to.deep.equal(expected);
      });
    });
    context("when (record, value)", () => {
      it("should convert to (record, value) chart point", () => {
        const behavior = {
          x: XPointBehavior.RECORD,
          y: YPointBehavior.VALUE
        };
        const expected = new ChartPoint({
          record: 1,
          value: 3
        });
        const actual = ChartPoint.convert(point, behavior, projection);

        expect(actual).to.deep.equal(expected);
      });
    });
    context("when (x, value)", () => {
      it("should convert to (x, value) chart point", () => {
        const behavior = {
          x: XPointBehavior.X,
          y: YPointBehavior.VALUE
        };
        const expected = new ChartPoint({
          x: 10,
          value: 3
        });
        const actual = ChartPoint.convert(point, behavior, projection);

        expect(actual).to.deep.equal(expected);
      });
    });
    context("when x behavior is invalid", () => {
      it("should throw exception", () => {
        const behavior = {
          x: "unknown",
          y: YPointBehavior.Y
        };
        expect(() => ChartPoint.convert(point, <any>behavior, projection)).to
          .throw;
      });
    });
    context("when y behavior is invalid", () => {
      it("should throw exception", () => {
        const behavior = {
          x: XPointBehavior.X,
          y: "unknown"
        };
        expect(() => ChartPoint.convert(point, <any>behavior, projection)).to
          .throw;
      });
    });
  });

  describe("clear", () => {
    context("when (x, y)", () => {
      it("should clear values", () => {
        const expected = new ChartPoint({
          x: undefined,
          y: undefined
        });
        target = new ChartPoint({
          x: 10,
          y: 10
        });
        target.clear();

        expect(target).to.deep.equal(expected);
      });
    });
    context("when (date, value)", () => {
      it("should clear values", () => {
        const expected = new ChartPoint({
          date: undefined,
          value: undefined
        });
        target = new ChartPoint({
          date: new Date(),
          value: 10
        });
        target.clear();

        expect(target).to.deep.equal(expected);
      });
    });
    context("when (record, y)", () => {
      it("should clear values", () => {
        const expected = new ChartPoint({
          record: undefined,
          y: undefined
        });
        target = new ChartPoint({
          record: 10,
          y: 10
        });
        target.clear();

        expect(target).to.deep.equal(expected);
      });
    });
  });

  describe("getX", () => {
    context("when x", () => {
      it("should return same x", () => {
        target = new ChartPoint({
          x: 10,
          y: 20
        });

        expect(target.getX(projection)).to.equal(10);
      });
    });
    context("when date", () => {
      it("should return x", () => {
        target = new ChartPoint({
          date: new Date(),
          y: 20
        });

        expect(target.getX(projection)).to.equal(4);
      });
    });
    context("when record", () => {
      it("should return x", () => {
        target = new ChartPoint({
          record: 10,
          y: 20
        });

        expect(target.getX(projection)).to.equal(5);
      });
    });
    context("when undefined", () => {
      it("should return null", () => {
        target = new ChartPoint({
          x: undefined,
          y: 20
        });

        expect(target.getX(projection)).to.be.null;
      });
    });
    context("when null", () => {
      it("should return null", () => {
        target = new ChartPoint({
          x: null,
          y: 20
        });

        expect(target.getX(projection)).to.be.null;
      });
    });
  });

  describe("getDate", () => {
    context("when x", () => {
      it("should return date", () => {
        target = new ChartPoint({
          x: 10,
          y: 20
        });
        const actual = target.getDate(projection);

        expect(actual).to.deep.equal(new Date(2));
      });
    });
    context("when date", () => {
      it("should return date", () => {
        target = new ChartPoint({
          date: new Date(),
          y: 20
        });
        const actual = target.getDate(projection);

        expect(actual).to.equal(target.date);
      });
    });
    context("when record", () => {
      it("should return date", () => {
        target = new ChartPoint({
          record: 10,
          y: 20
        });
        const actual = target.getDate(projection);

        expect(actual).to.deep.equal(new Date(2));
      });
    });
    context("when undefined", () => {
      it("should return null", () => {
        target = new ChartPoint({
          x: undefined,
          y: 20
        });
        const actual = target.getDate(projection);

        expect(actual).to.be.null;
      });
    });
    context("when null", () => {
      it("should return null", () => {
        target = new ChartPoint({
          x: null,
          y: 20
        });
        const actual = target.getDate(projection);

        expect(actual).to.be.null;
      });
    });
  });

  describe("getRecord", () => {
    context("when x", () => {
      it("should return record", () => {
        target = new ChartPoint({
          x: 10,
          y: 20
        });
        const actual = target.getRecord(projection);

        expect(actual).to.equal(1);
      });
    });
    context("when date", () => {
      it("should return record", () => {
        target = new ChartPoint({
          date: new Date(),
          y: 20
        });
        const actual = target.getRecord(projection);

        expect(actual).to.equal(1);
      });
    });
    context("when record", () => {
      it("should return record", () => {
        target = new ChartPoint({
          record: 10,
          y: 20
        });
        const actual = target.getRecord(projection);

        expect(actual).to.equal(10);
      });
    });
    context("when undefined", () => {
      it("should return null", () => {
        target = new ChartPoint({
          x: undefined,
          y: 20
        });
        const actual = target.getRecord(projection);

        expect(actual).to.be.null;
      });
    });
    context("when null", () => {
      it("should return null", () => {
        target = new ChartPoint({
          x: null,
          y: 20
        });
        const actual = target.getRecord(projection);

        expect(actual).to.be.null;
      });
    });
  });

  describe("getY", () => {
    context("when y", () => {
      it("should return y", () => {
        target = new ChartPoint({
          x: 10,
          y: 20
        });
        const actual = target.getY(projection);

        expect(actual).to.equal(20);
      });
    });
    context("when value", () => {
      it("should return y", () => {
        target = new ChartPoint({
          x: 10,
          value: 20
        });
        const actual = target.getY(projection);

        expect(actual).to.equal(6);
      });
    });
    context("when undefined", () => {
      it("should return null", () => {
        target = new ChartPoint({
          x: 10,
          y: undefined
        });
        const actual = target.getY(projection);

        expect(actual).to.be.null;
      });
    });
    context("when null", () => {
      it("should return null", () => {
        target = new ChartPoint({
          x: 10,
          y: null
        });
        const actual = target.getY(projection);

        expect(actual).to.be.null;
      });
    });
  });

  describe("toPoint", () => {
    context("when (x, y)", () => {
      it("should return the same point", () => {
        const expected = {
          x: 10,
          y: 20
        };
        const actual = new ChartPoint(expected).toPoint(projection);

        expect(actual).to.deep.equal(expected);
      });
    });
    context("when (date, value)", () => {
      it("should convert to (x, y) point", () => {
        target = new ChartPoint({
          date: new Date(),
          value: 20
        });
        const expected = {
          x: 4,
          y: 6
        };
        const actual = new ChartPoint(expected).toPoint(projection);

        expect(actual).to.deep.equal(expected);
      });
    });
  });

  describe("moveTo", () => {
    context("when (x, y)", () => {
      it("should move to new point", () => {
        target = new ChartPoint({
          x: 10,
          y: 20
        });
        const expected = new ChartPoint({
          x: 30,
          y: 40
        });
        const actual = target.moveTo(expected.x, expected.y, projection);

        expect(actual).to.deep.equal(expected);
      });
    });
    context("when (date, value)", () => {
      it("should move to new point", () => {
        target = new ChartPoint({
          date: new Date(),
          value: 20
        });
        const expected = new ChartPoint({
          date: new Date(2),
          value: 3
        });
        const actual = target.moveTo(10, 20, projection);

        expect(actual).to.deep.equal(expected);
      });
    });
    context("when (record, value)", () => {
      it("should move to new point", () => {
        target = new ChartPoint({
          record: 10,
          value: 20
        });
        const expected = new ChartPoint({
          record: 1,
          value: 3
        });
        const actual = target.moveTo(10, 20, projection);

        expect(actual).to.deep.equal(expected);
      });
    });
  });

  describe("moveToPoint", () => {
    context("when (x, y)", () => {
      it("should move to new point", () => {
        target = new ChartPoint({
          x: 10,
          y: 20
        });
        const expected = new ChartPoint({
          x: 30,
          y: 40
        });
        const actual = target.moveToPoint(expected, projection);

        expect(actual).to.deep.equal(expected);
      });
    });
    context("when (date, value)", () => {
      it("should move to new point", () => {
        target = new ChartPoint({
          date: new Date(),
          value: 20
        });
        const expected = new ChartPoint({
          date: new Date(2),
          value: 3
        });
        const actual = target.moveToPoint({ x: 10, y: 20 }, projection);

        expect(actual).to.deep.equal(expected);
      });
    });
    context("when (record, value)", () => {
      it("should move to new point", () => {
        target = new ChartPoint({
          record: 10,
          value: 20
        });
        const expected = new ChartPoint({
          record: 1,
          value: 3
        });
        const actual = target.moveToPoint({ x: 10, y: 20 }, projection);

        expect(actual).to.deep.equal(expected);
      });
    });
  });

  describe("moveToX", () => {
    context("when (x, y)", () => {
      it("should move to a new x", () => {
        target = new ChartPoint({
          x: 10,
          y: 20
        });
        const expected = new ChartPoint({
          x: 30,
          y: 20
        });
        const actual = target.moveToX(expected.x, projection);

        expect(actual).to.deep.equal(expected);
      });
    });
    context("when (date, value)", () => {
      it("should move to a new x", () => {
        target = new ChartPoint({
          date: new Date(),
          value: 20
        });
        const expected = new ChartPoint({
          date: new Date(2),
          value: 20
        });
        const actual = target.moveToX(10, projection);

        expect(actual).to.deep.equal(expected);
      });
    });
    context("when (record, value)", () => {
      it("should move to a new x", () => {
        target = new ChartPoint({
          record: 10,
          value: 20
        });
        const expected = new ChartPoint({
          record: 1,
          value: 20
        });
        const actual = target.moveToX(10, projection);

        expect(actual).to.deep.equal(expected);
      });
    });
  });

  describe("moveToY", () => {
    context("when (x, y)", () => {
      it("should move to a new y", () => {
        target = new ChartPoint({
          x: 10,
          y: 20
        });
        const expected = new ChartPoint({
          x: 10,
          y: 20
        });
        const actual = target.moveToY(expected.y, projection);

        expect(actual).to.deep.equal(expected);
      });
    });
    context("when (date, value)", () => {
      it("should move to a new y", () => {
        target = new ChartPoint({
          date: new Date(5),
          value: 20
        });
        const expected = new ChartPoint({
          date: new Date(5),
          value: 3
        });
        const actual = target.moveToY(10, projection);

        expect(actual).to.deep.equal(expected);
      });
    });
  });

  describe("clone", () => {
    it("should return new object with the same values", () => {
      target = new ChartPoint({
        x: 10,
        y: 20
      });
      const actual = target.clone();

      expect(actual).to.deep.equal(target);
    });
  });
});
