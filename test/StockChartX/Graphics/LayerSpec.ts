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
import { Layer } from "../../../src/scripts/exporter";

"use strict";

describe("Layer", () => {
  let target: Layer;
  let container: JQuery;

  beforeEach(() => {
    container = $("<div></div>").appendTo($("body"));
    target = new Layer({
      parent: container,
      size: {
        width: 100,
        height: 200
      }
    });
  });

  afterEach(() => {
    container.remove();
  });

  describe("constructor", () => {
    context("when config", () => {
      it("should initialize parent container", () => {
        expect(target.parent).to.deep.equal(container);
      });
      it("should set size", () => {
        expect(target.size).to.deep.equal({ width: 100, height: 200 });
      });
      it("should create canvas", () => {
        expect(target.canvas).to.exist;
      });
      it("should initialize context", () => {
        expect(target.context).to.exist;
      });
    });
  });

  describe("canvas", () => {
    it("should return canvas", () => {
      expect(target.canvas).to.exist;
    });
  });

  describe("context", () => {
    it("should return canvas' context", () => {
      expect(target.context).to.exist;
    });
  });

  describe("parent", () => {
    it("should return parent container", () => {
      expect(target.parent).to.exist;
    });
  });

  describe("size", () => {
    it("should set size", () => {
      const expected = {
        width: 230,
        height: 140
      };
      target.size = expected;

      expect(target.size).to.deep.equal(expected);
    });
  });

  describe("destroy", () => {
    it("should destroy parent container", () => {
      target.destroy();
      expect(target.parent).to.be.null;
    });
    it("should destroy canvas", () => {
      target.destroy();
      expect(target.canvas).to.be.null;
    });
    it("should destroy context", () => {
      target.destroy();
      expect(target.context).to.be.null;
    });
  });
});
