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
import { LocalDataStore } from "../../../../src/scripts/exporter";

"use strict";

describe("LocalDataStore", () => {
  let target: LocalDataStore;

  beforeEach(() => {
    target = new LocalDataStore();
    target.clear();
  });

  describe("save", () => {
    it("should be fulfilled", () => {
      return new Promise(async resolve => {
        await target.save("key", "2");
        resolve();
      });
    });
  });

  describe("load", () => {
    context("when unknown key", () => {
      it("should return null", () => {
        return target.load("key").then(value => expect(value).to.be.null);
      });
    });
    context("when valid key", () => {
      it("should return value", () => {
        return new Promise(async resolve => {
          await target.save("key", "value");

          let value = await target.load("key");
          resolve(value);
        }).then(value => expect(value).to.equal("value"));
      });
    });
  });

  describe("clear", () => {
    context("when key", () => {
      it("should remove only that key", () => {
        return new Promise(async resolve => {
          await target.save("key 1", "value 1");
          await target.save("key 2", "value 2");
          await target.clear("key 1");

          const value = await target.load("key 2");
          resolve(value);
        }).then(value => expect(value).to.equal("value 2"));
      });
    });
    context("when without arguments", () => {
      it("should remove all keys", () => {
        return new Promise(async resolve => {
          await target.save("key 1", "value 1");
          await target.save("key 2", "value 2");
          await target.clear();

          const value1 = await target.load("key 1");
          const value2 = await target.load("key 2");
          resolve([value1, value2]);
        }).then(value => expect(value).to.deep.equal([null, null]));
      });
    });
  });
});
