/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { expect } from "chai";
import { DateScaleCalibrator } from "../../../../src/scripts/exporter";

// tslint:disable:no-unused-expression

"use strict";

class DateScaleCalibratorStub extends DateScaleCalibrator {
  protected _calibrateMajorTicks() {}
}

describe("DateScaleCalibrator", () => {
  let target: DateScaleCalibrator;

  beforeEach(() => {
    target = new DateScaleCalibratorStub();
  });

  describe("className", () => {
    it("should return class name", () => {
      expect(DateScaleCalibrator.className).to.equal("");
    });
  });

  describe("constructor", () => {
    context("when default", () => {
      it("should initialize major ticks with empty array", () => {
        expect(target.majorTicks).to.deep.equal([]);
      });
    });
  });

  describe("calibrate", () => {
    context("when date scale is null", () => {
      it("should clear previous major ticks", () => {
        target.majorTicks.push({
          x: 1,
          date: new Date(),
          textX: 1,
          text: "",
          textAlign: ""
        });
        target.calibrate(null);

        expect(target.majorTicks).to.deep.equal([]);
      });
    });
  });

  describe("saveState", () => {
    it("should return state", () => {
      const expected = {
        className: "",
        options: {}
      };

      expect(target.saveState()).to.deep.equal(expected);
    });
  });
});
