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
import { AnimationController, Animation } from "../../../src/scripts/exporter";

"use strict";

describe("AnimationController", () => {
  afterEach(() => {
    AnimationController._animations = [];
  });

  describe("AnimationInterval", () => {
    it("should set animation interval", () => {
      AnimationController.AnimationInterval = 10;
      expect(AnimationController.AnimationInterval).to.equal(10);
    });
  });

  describe("hasAnimationToRun", () => {
    context("when empty", () => {
      it("should return false", () => {
        expect(AnimationController.hasAnimationsToRun()).to.be.false;
      });
    });
    context("when has animation", () => {
      it("should return true", () => {
        AnimationController.add(new Animation());
        expect(AnimationController.hasAnimationsToRun()).to.be.true;
      });
    });
  });

  describe("contains", () => {
    context("when empty", () => {
      it("should return false", () => {
        expect(AnimationController.contains(new Animation())).to.be.false;
      });
    });
    context("when non-existing animation", () => {
      it("should return false", () => {
        AnimationController.add(new Animation());
        expect(AnimationController.contains(new Animation())).to.be.false;
      });
    });
    context("when animation exists", () => {
      it("should return true", () => {
        const animation = new Animation();
        AnimationController.add(animation);
        expect(AnimationController.contains(animation)).to.be.true;
      });
    });
  });

  describe("add", () => {
    context("when new animation", () => {
      const animation = new Animation();

      it("should return true", () => {
        const actual = AnimationController.add(animation);
        expect(actual).to.be.true;
      });
      it("should contain added animation", () => {
        AnimationController.add(animation);
        expect(AnimationController.contains(animation)).to.be.true;
      });
    });
    context("when animation exists", () => {
      const animation = new Animation();

      it("should return false", () => {
        AnimationController.add(animation);
        expect(AnimationController.add(animation)).to.be.false;
      });
    });
  });

  describe("remove", () => {
    const animation = new Animation();

    context("when animation does not exist", () => {
      it("should return false", () => {
        expect(AnimationController.remove(animation)).to.be.false;
      });
    });
    context("when animation exists", () => {
      it("should return true", () => {
        AnimationController.add(animation);
        expect(AnimationController.remove(animation)).to.be.true;
      });
    });
  });
});
