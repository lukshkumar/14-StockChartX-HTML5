/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { expect } from "chai";
import { Animation } from "../../../src/scripts/exporter";

// tslint:disable:no-unused-expression

"use strict";

describe("Animation", () => {
  let target: Animation;

  beforeEach(() => {
    target = new Animation();
  });

  describe("constructor", () => {
    context("when default", () => {
      it("should initialize callback with undefined", () => {
        expect(target.callback).to.be.undefined;
      });
      it("should not be started", () => {
        expect(target.started).to.be.false;
      });
      it("should not contain context", () => {
        expect(target.context).to.be.null;
      });
      it("should be recurring", () => {
        expect(target.recurring).to.be.true;
      });
    });
    context("when config", () => {
      const config = {
        callback: () => {},
        context: { prop: true },
        recurring: false
      };
      const actual = new Animation(config);

      it("should initialize callback", () => {
        expect(actual.callback).to.equal(config.callback);
      });
      it("should not be started", () => {
        expect(actual.started).to.be.false;
      });
      it("should initialize context", () => {
        expect(actual.context).to.deep.equal(config.context);
      });
      it("should initialize recurring flag", () => {
        expect(actual.recurring).to.equal(config.recurring);
      });
    });
  });

  describe("callback", () => {
    it("should set callback", () => {
      const cb = () => 1;
      target.callback = cb;
      expect(target.callback).to.equal(cb);
    });
  });

  describe("context", () => {
    it("should set context", () => {
      const expected = {
        prop: "value"
      };
      target.context = expected;
      expect(target.context).to.deep.equal(expected);
    });
  });

  describe("recurring", () => {
    it("should set recurring flag", () => {
      target.recurring = false;
      expect(target.recurring).to.be.false;
    });
  });

  describe("start", () => {
    context("when callback is not specified", () => {
      it("should throw exception", () => {
        expect(() => target.start()).to.throw;
      });
    });
    context("when callback is set", () => {
      it("should return true", () => {
        target.callback = () => {};
        expect(target.start()).to.be.true;
      });
      it("should set started flag", () => {
        target.callback = () => {};
        target.start();
        expect(target.started).to.be.true;
      });
    });
    context("when starts second time", () => {
      it("should return false", () => {
        target.callback = () => {};
        target.start();
        expect(target.start()).to.be.false;
      });
      it("should be started", () => {
        target.callback = () => {};
        target.start();
        target.start();
        expect(target.started).to.be.true;
      });
    });
  });

  describe("stop", () => {
    context("when stopping", () => {
      it("should be stopped", () => {
        target.callback = () => {};
        target.start();
        target.stop();

        expect(target.started).to.be.false;
      });
    });
  });

  describe("handleAnimationFrame", () => {
    it("should execute callback", () => {
      let executed = false;
      target.callback = () => (executed = true);
      target.handleAnimationFrame();

      expect(executed).to.be.true;
    });
  });
});
