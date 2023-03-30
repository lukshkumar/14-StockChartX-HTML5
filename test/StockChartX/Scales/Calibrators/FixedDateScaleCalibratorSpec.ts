/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { expect } from "chai";
import { FixedDateScaleCalibrator } from "../../../../src/scripts/exporter";

// tslint:disable:no-unused-expression

"use strict";

describe("FixedDateScaleCalibrator", () => {
  let target: FixedDateScaleCalibrator;

  beforeEach(() => {
    target = new FixedDateScaleCalibrator();
  });

  describe("className", () => {
    it("should return class name", () => {
      expect(FixedDateScaleCalibrator.className).to.equal(
        "StockChartX.FixedDateScaleCalibrator"
      );
    });
  });

  describe("constructor", () => {
    context("when default", () => {
      it("should initialize labels count", () => {
        expect(target.majorTicksCount).to.equal(3);
      });
    });
  });

  describe("saveState", () => {
    it("should return state", () => {
      const expected = {
        className: "StockChartX.FixedDateScaleCalibrator",
        options: {
          majorTicks: {
            count: 10
          }
        }
      };
      target.majorTicksCount = 10;

      expect(target.saveState()).to.deep.equal(expected);
    });
  });

  describe("loadState", () => {
    const expected = {
      className: "StockChartX.FixedDateScaleCalibrator",
      options: {
        majorTicks: {
          count: 10
        }
      }
    };

    it("should load major ticks count", () => {
      target.loadState(expected);
      expect(target.majorTicksCount).to.equal(10);
    });
  });
});
