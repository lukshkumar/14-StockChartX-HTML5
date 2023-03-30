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
import { Rect } from "../../../src/scripts/exporter";

"use strict";

describe("Rect", () => {
  let target: Rect;

  beforeEach(() => {
    target = new Rect({
      left: 10,
      top: 20,
      width: 30,
      height: 40
    });
  });

  describe("constructor", () => {
    context("when default", () => {
      it("should initialize with 0 values", () => {
        expect(new Rect()).to.deep.equal(
          new Rect({
            left: 0,
            top: 0,
            width: 0,
            height: 0
          })
        );
      });
    });
    context("when parameters", () => {
      it("should initialize rectangle with a given values", () => {
        const expected = new Rect({
          left: 10,
          top: 20,
          width: 30,
          height: 40
        });
        expect(new Rect(expected)).to.deep.equal(expected);
      });
    });
  });

  describe("clone", () => {
    it("should return new instance", () => {
      expect(target.clone()).not.to.equal(target);
    });
    it("should return cloned rectangle", () => {
      expect(target.clone()).to.deep.equal(target);
    });
  });

  describe("equals", () => {
    context("when equal", () => {
      it("should return true", () => {
        expect(target.equals(target.clone())).to.be.true;
      });
    });
    context("when left is different", () => {
      it("should return false", () => {
        const rect = target.clone();
        rect.left = 1;
        expect(target.equals(rect)).to.be.false;
      });
    });
    context("when top is different", () => {
      it("should return false", () => {
        const rect = target.clone();
        rect.top = 1;
        expect(target.equals(rect)).to.be.false;
      });
    });
    context("when width is different", () => {
      it("should return false", () => {
        const rect = target.clone();
        rect.width = 1;
        expect(target.equals(rect)).to.be.false;
      });
    });
    context("when height is different", () => {
      it("should return false", () => {
        const rect = target.clone();
        rect.height = 1;
        expect(target.equals(rect)).to.be.false;
      });
    });
  });

  describe("toString", () => {
    it("should return string representatioin", () => {
      const expected = "[left: 10, top: 20, width: 30, height: 40]";
      expect(target.toString()).to.equal(expected);
    });
  });

  describe("bottom", () => {
    it("should calculate bottom value", () => {
      expect(target.bottom).to.equal(60);
    });
  });

  describe("right", () => {
    it("should calculate right value", () => {
      expect(target.right).to.equal(40);
    });
  });

  describe("containsPoint", () => {
    context("when not in the rect", () => {
      it("should return false", () => {
        expect(target.containsPoint({ x: 0, y: 30 })).to.be.false;
        expect(target.containsPoint({ x: 3, y: 0 })).to.be.false;
        expect(target.containsPoint({ x: 50, y: 30 })).to.be.false;
        expect(target.containsPoint({ x: 50, y: 70 })).to.be.false;
      });
    });
    context("when in the rect", () => {
      it("should return true", () => {
        expect(target.containsPoint({ x: 10, y: 20 })).to.be.true;
        expect(target.containsPoint({ x: 10, y: 60 })).to.be.true;
        expect(target.containsPoint({ x: 40, y: 20 })).to.be.true;
        expect(target.containsPoint({ x: 40, y: 60 })).to.be.true;
        expect(target.containsPoint({ x: 11, y: 21 })).to.be.true;
      });
    });
  });

  describe("cropLeft", () => {
    it("should return cropped rectangle", () => {
      const expected = new Rect({
        left: 15,
        top: 20,
        width: 25,
        height: 40
      });
      target.cropLeft(
        new Rect({
          left: 10,
          top: 20,
          width: 5,
          height: 40
        })
      );

      expect(target).to.deep.equal(expected);
    });
  });

  describe("cropRight", () => {
    it("should return cropped rectangle", () => {
      const expected = new Rect({
        left: 10,
        top: 20,
        width: 24,
        height: 40
      });
      target.cropRight(
        new Rect({
          left: 35,
          top: 20,
          width: 5,
          height: 40
        })
      );

      expect(target).to.deep.equal(expected);
    });
  });

  describe("cropTop", () => {
    it("should return cropped rectangle", () => {
      const expected = new Rect({
        left: 10,
        top: 25,
        width: 30,
        height: 35
      });
      target.cropTop(
        new Rect({
          left: 10,
          top: 20,
          width: 30,
          height: 5
        })
      );

      expect(target).to.deep.equal(expected);
    });
  });

  describe("cropBottom", () => {
    it("should return cropped rectangle", () => {
      const expected = new Rect({
        left: 10,
        top: 20,
        width: 30,
        height: 35
      });
      target.cropBottom(
        new Rect({
          left: 10,
          top: 55,
          width: 30,
          height: 5
        })
      );

      expect(target).to.deep.equal(expected);
    });
  });

  describe("applyPadding", () => {
    context("when empty padding", () => {
      it("should not change rectangle", () => {
        const expected = target.clone();
        target.applyPadding(<any>{});

        expect(target).to.deep.equal(expected);
      });
    });
    context("when padding", () => {
      const expected = new Rect({
        left: 11,
        top: 22,
        width: 26,
        height: 29
      });
      target = new Rect({
        left: 10,
        top: 20,
        width: 30,
        height: 35
      });
      target.applyPadding({
        left: 1,
        top: 2,
        right: 3,
        bottom: 4
      });

      expect(target).to.deep.equal(expected);
    });
  });
});
