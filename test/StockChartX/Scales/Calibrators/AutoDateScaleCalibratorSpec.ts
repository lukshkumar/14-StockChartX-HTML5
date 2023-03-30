/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { expect } from "chai";
import { AutoDateScaleCalibrator } from "../../../../src/scripts/exporter";

// tslint:disable:no-unused-expression

"use strict";

describe("AutoDateScaleCalibrator", () => {
  let target: AutoDateScaleCalibrator;

  beforeEach(() => {
    target = new AutoDateScaleCalibrator();
  });

  describe("className", () => {
    it("should return class name", () => {
      expect(AutoDateScaleCalibrator.className).to.equal(
        "StockChartX.AutoDateScaleCalibrator"
      );
    });
  });

  describe("constructor", () => {
    context("when default", () => {
      it("should initialize min labels offset", () => {
        expect(target.minLabelsOffset).to.equal(30);
      });
    });
  });

  describe("minLabelsOffset", () => {
    context("when valid value", () => {
      it("should set min labels offset", () => {
        target.minLabelsOffset = 10;
        expect(target.minLabelsOffset).to.equal(10);
      });
    });
    context("when null", () => {
      it("should throw exception", () => {
        expect(() => (target.minLabelsOffset = null)).to.throw;
      });
    });
    context("when undefined", () => {
      it("should throw exception", () => {
        expect(() => (target.minLabelsOffset = undefined)).to.throw;
      });
    });
    context("when negative value", () => {
      it("should throw exception", () => {
        expect(() => (target.minLabelsOffset = -1)).to.throw;
      });
    });
  });

  describe("saveState", () => {
    it("should return state", () => {
      const expected = {
        className: "StockChartX.AutoDateScaleCalibrator",
        options: {
          majorTicks: {
            minOffset: 10
          }
        }
      };
      target.minLabelsOffset = 10;

      expect(target.saveState()).to.deep.equal(expected);
    });
  });

  describe("loadState", () => {
    it("should restore state", () => {
      const expected = {
        className: "StockChartX.AutoDateScaleCalibrator",
        options: {
          majorTicks: {
            minOffset: 12
          }
        }
      };
      target.loadState(expected);

      expect(target.minLabelsOffset).to.equal(12);
    });
  });
});
