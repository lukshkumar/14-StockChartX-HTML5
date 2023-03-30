/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { expect } from "chai";
import { Dictionary } from "../../../src/scripts/exporter";

// tslint:disable:no-unused-expression

"use strict";

describe("Dictionary", () => {
  let target: Dictionary<string, number>;

  beforeEach(() => {
    target = new Dictionary<string, number>();
  });

  describe("count", () => {
    context("when empty", () => {
      it("should return 0", () => {
        expect(target.count).to.equal(0);
      });
    });
    context("when not empty", () => {
      it("should return number of elements", () => {
        target.add("key1", 1);
        expect(target.count).to.equal(1);

        target.add("key2", 2);
        expect(target.count).to.equal(2);
      });
    });
  });

  describe("constructor", () => {
    context("when single key value pair", () => {
      const expected = {
        key: "test",
        value: 5
      };
      const dict = new Dictionary<string, number>(expected);

      it("should contain 1 pair", () => {
        expect(dict.count).to.equal(1);
      });
      it("should contain added pair", () => {
        expect(dict.get(expected.key)).to.equal(5);
      });
    });
    context("when array of key value pairs", () => {
      const expected = [
        {
          key: "key 1",
          value: 1
        },
        {
          key: "key 2",
          value: 2
        }
      ];
      const dict = new Dictionary<string, number>(expected);

      it("should contain 2 pairs", () => {
        expect(dict.count).to.equal(2);
      });
      it("should added pairs", () => {
        for (let item of expected) {
          expect(dict.get(item.key)).to.equal(item.value);
        }
      });
    });
  });

  describe("add", () => {
    context("when key is present", () => {
      it("should throw exception", () => {
        target.add("key", 1);
        expect(() => target.add("key", 2)).throw(Error);
      });
    });
    context("when dictionary is empty", () => {
      const expected = {
        key: "key 1",
        value: 1
      };
      const dict = new Dictionary<string, number>();
      dict.add(expected.key, expected.value);

      it("should contain 1 pair", () => {
        expect(dict.count).to.equal(1);
      });
      it("should contain added pair", () => {
        expect(dict.get(expected.key)).to.equal(expected.value);
      });
    });
    context("when dictionary contains 1 pair", () => {
      const expected1 = {
        key: "key 1",
        value: 1
      };
      const expected2 = {
        key: "key 2",
        value: 2
      };
      const dict = new Dictionary<string, number>();
      dict.add(expected1.key, expected1.value);
      dict.add(expected2.key, expected2.value);

      it("should contain 2 pairs", () => {
        expect(dict.count).to.equal(2);
      });
      it("should contain old pair", () => {
        expect(dict.get(expected1.key)).to.equal(expected1.value);
      });
      it("should contain new pair", () => {
        expect(dict.get(expected2.key)).to.equal(expected2.value);
      });
    });
  });

  describe("remove", () => {
    context("when key not found", () => {
      it("should return false", () => {
        let actual = target.remove("unknown key");
        expect(actual).to.be.false;

        target.add("key 1", 1);
        actual = target.remove("unknown key");
        expect(actual).to.be.false;
        expect(target.count).to.equal(1);
      });
    });
    context("when key exists", () => {
      const dict = new Dictionary<string, number>();
      dict.add("key 1", 1);
      dict.add("key 2", 2);
      let actual = dict.remove("key 2");

      it("should return true", () => {
        expect(actual).to.be.true;
      });
      it("should remove pair", () => {
        expect(dict.count).to.equal(1);
        expect(dict.get("key 1")).to.equal(1);
      });
    });
  });

  describe("containsKey", () => {
    context("when key exists", () => {
      it("should return true", () => {
        target.add("key", 1);
        expect(target.containsKey("key")).to.be.true;
      });
    });
    context("when dictionary is empty", () => {
      it("should return false", () => {
        expect(target.containsKey("key")).to.be.false;
      });
    });
    context("when key not found", () => {
      it("should return false", () => {
        target.add("key 1", 1);

        expect(target.containsKey("key 2")).to.be.false;
      });
    });
  });

  describe("get", () => {
    context("when dictionary is empty", () => {
      it("should return null", () => {
        expect(target.get("key")).to.be.null;
      });
    });
    context("when key not found", () => {
      it("should return null", () => {
        target.add("key 1", 1);

        expect(target.get("key 2")).to.be.null;
      });
    });
    context("when key exists", () => {
      it("should return true", () => {
        target.add("key 1", 1);

        expect(target.get("key 1")).to.equal(1);
      });
    });
  });
});
