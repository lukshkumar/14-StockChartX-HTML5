/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { expect } from "chai";
import { CustomNumberFormat } from "../../../../src/scripts/exporter";

// tslint:disable:no-unused-expression

"use strict";

describe("CustomNumberFormat", () => {
  let target: CustomNumberFormat;

  beforeEach(() => {
    target = new CustomNumberFormat();
  });

  describe("className", () => {
    it("should be StockChartX.CustomNumberFormat", () => {
      expect(CustomNumberFormat.className).to.equal(
        "StockChartX.CustomNumberFormat"
      );
    });
  });

  describe("formatString", () => {
    it("should get/set format string", () => {
      target.formatString = "%f";
      expect(target.formatString).to.equal("%f");
    });
  });

  describe("constructor", () => {
    context("when default", () => {
      it("should initialize format string with %f", () => {
        expect(target.formatString).to.equal("%f");
      });
    });
    context("when null", () => {
      it("should initialize format string with %f", () => {
        target = new CustomNumberFormat(null);
        expect(target.formatString).to.equal("%f");
      });
    });
    context("when undefined", () => {
      it("should initialize format string with %f", () => {
        target = new CustomNumberFormat(undefined);
        expect(target.formatString).to.equal("%f");
      });
    });
    context("when valid format", () => {
      it("should initialize format string with a given format", () => {
        target = new CustomNumberFormat("%d");
        expect(target.formatString).to.equal("%d");
      });
    });
    context("when non string", () => {
      it("should throw expcetion", () => {
        expect(() => new CustomNumberFormat(<any>123)).to.throw();
      });
    });
    context("when invalid format", () => {
      it("should throw exception", () => {
        expect(() => new CustomNumberFormat("abc")).to.throw();
      });
    });
    context("when %d", () => {
      it("should parse", () => {
        target = new CustomNumberFormat("%d");
        const actual = target["_options"]; // tslint:disable-line

        expect(actual.sign).to.be.false;
        expect(actual.padding).to.equal(" ");
        expect(actual.alignLeft).to.be.false;
        expect(actual.width).to.be.false;
        expect(actual.precision).to.be.false;
        expect(actual.type).to.equal("d");
      });
    });
    context("when %+d", () => {
      it("should parse", () => {
        target = new CustomNumberFormat("%+d");
        const actual = target["_options"]; // tslint:disable-line

        expect(actual.sign).to.be.true;
        expect(actual.padding).to.equal(" ");
        expect(actual.alignLeft).to.be.false;
        expect(actual.width).to.be.false;
        expect(actual.precision).to.be.false;
        expect(actual.type).to.equal("d");
      });
    });
    context("when %4f", () => {
      it("should parse", () => {
        target = new CustomNumberFormat("%4f");
        const actual = target["_options"]; // tslint:disable-line

        expect(actual.sign).to.be.false;
        expect(actual.padding).to.equal(" ");
        expect(actual.alignLeft).to.be.false;
        expect(actual.width).to.equal("4");
        expect(actual.precision).to.be.false;
        expect(actual.type).to.equal("f");
      });
    });
    context("when %04f", () => {
      it("should parse", () => {
        target = new CustomNumberFormat("%04f");
        const actual = target["_options"]; // tslint:disable-line

        expect(actual.sign).to.be.false;
        expect(actual.padding).to.equal("0");
        expect(actual.alignLeft).to.be.false;
        expect(actual.width).to.equal("4");
        expect(actual.precision).to.be.false;
        expect(actual.type).to.equal("f");
      });
    });
    context("when %5.2f", () => {
      it("should parse", () => {
        target = new CustomNumberFormat("%5.2f");
        const actual = target["_options"]; // tslint:disable-line

        expect(actual.sign).to.be.false;
        expect(actual.padding).to.equal(" ");
        expect(actual.alignLeft).to.be.false;
        expect(actual.width).to.equal("5");
        expect(actual.precision).to.equal("2");
        expect(actual.type).to.equal("f");
      });
    });
  });

  describe("format", () => {
    context("when decimal format", () => {
      context("when value is 2 and format is %d", () => {
        it("should return '2'", () => {
          target.formatString = "%d";
          expect(target.format(2)).to.equal("2");
        });
      });
      context("when value is 2 and format is %3d", () => {
        it("should return '  2'", () => {
          target.formatString = "%3d";
          expect(target.format(2)).to.equal("  2");
        });
      });
      context("when value is 2 and format is %-3d", () => {
        it("should return '2  '", () => {
          target.formatString = "%-3d";
          expect(target.format(2)).to.equal("2  ");
        });
      });
      context("when value is 2 and format is %03d", () => {
        it("should return '002'", () => {
          target.formatString = "%03d";
          expect(target.format(2)).to.equal("002");
        });
      });
      context("when value is 2 and format is %+03d", () => {
        it("should return '+002'", () => {
          target.formatString = "%+03d";
          expect(target.format(2)).to.equal("+002");
        });
      });
      context("when value is 2 and format is %+-3d", () => {
        it("should return '+2 '", () => {
          target.formatString = "%+-3d";
          expect(target.format(2)).to.equal("+2 ");
        });
      });
    });
    context("when binary format", () => {
      context("when value is 2 and format is %b", () => {
        it("should return '10'", () => {
          target.formatString = "%b";
          expect(target.format(2)).to.equal("10");
        });
      });
      context("when value is 2 and format is %4b", () => {
        it("should return '  10'", () => {
          target.formatString = "%4b";
          expect(target.format(2)).to.equal("  10");
        });
      });
      context("when value is 2 and format is %-4b", () => {
        it("should return '10  '", () => {
          target.formatString = "%-4b";
          expect(target.format(2)).to.equal("10  ");
        });
      });
      context("when value is 2 and format is %04b", () => {
        it("should return '0010'", () => {
          target.formatString = "%04b";
          expect(target.format(2)).to.equal("0010");
        });
      });
      context("when value is -2 and format is %b", () => {
        it("should return '-10'", () => {
          target.formatString = "%b";
          expect(target.format(-2)).to.equal("-10");
        });
      });
    });
    context("when character format", () => {
      context("when 65", () => {
        it("should return A", () => {
          target.formatString = "%c";
          expect(target.format(65)).to.equal("A");
        });
      });
    });
    context("when float format", () => {
      context("when value is 2.5 and format is %f", () => {
        it("should return '2.5'", () => {
          target.formatString = "%f";
          expect(target.format(2.5)).to.equal("2.5");
        });
      });
      context("when value is 2.5 and format is %4f", () => {
        it("should return '2 2.5'", () => {
          target.formatString = "%4f";
          expect(target.format(2.5)).to.equal(" 2.5");
        });
      });
      context("when value is 2 and format is %5.2f", () => {
        it("should return '2 2.50'", () => {
          target.formatString = "%5.2f";
          expect(target.format(2.5)).to.equal(" 2.50");
        });
      });
    });
    context("when hex format", () => {
      context("when value is 4 and format is %x", () => {
        it("should return '4'", () => {
          target.formatString = "%x";
          expect(target.format(4)).to.equal("4");
        });
      });
      context("when value is 26 and format is %x", () => {
        it("should return '1a'", () => {
          target.formatString = "%x";
          expect(target.format(26)).to.equal("1a");
        });
      });
      context("when value is 26 and format is %4x", () => {
        it("should return '  1a'", () => {
          target.formatString = "%4x";
          expect(target.format(26)).to.equal("  1a");
        });
      });
      context("when value is 26 and format is %-4x", () => {
        it("should return '1a  '", () => {
          target.formatString = "%-4x";
          expect(target.format(26)).to.equal("1a  ");
        });
      });
    });
    context("when upper cased hex format", () => {
      context("when value is 4 and format is %X", () => {
        it("should return '4'", () => {
          target.formatString = "%X";
          expect(target.format(4)).to.equal("4");
        });
      });
      context("when value is 26 and format is %X", () => {
        it("should return '1A'", () => {
          target.formatString = "%X";
          expect(target.format(26)).to.equal("1A");
        });
      });
      context("when value is 26 and format is %4X", () => {
        it("should return '  1A'", () => {
          target.formatString = "%4X";
          expect(target.format(26)).to.equal("  1A");
        });
      });
      context("when value is 26 and format is %-4X", () => {
        it("should return '1A  '", () => {
          target.formatString = "%-4X";
          expect(target.format(26)).to.equal("1A  ");
        });
      });
    });
    context("when exponential format", () => {
      context("when value is 4 and format is %e", () => {
        it("should return '4e+0'", () => {
          target.formatString = "%e";
          expect(target.format(4)).to.equal("4e+0");
        });
      });
      context("when value is 0.126 and format is %e", () => {
        it("should return '1.26e-1'", () => {
          target.formatString = "%e";
          expect(target.format(0.126)).to.equal("1.26e-1");
        });
      });
      context("when value is 0.126 and format is %8e", () => {
        it("should return ' 1.26e-1'", () => {
          target.formatString = "%8e";
          expect(target.format(0.126)).to.equal(" 1.26e-1");
        });
      });
    });
    context("when upper cased exponential format", () => {
      context("when value is 4 and format is %E", () => {
        it("should return '4E+0'", () => {
          target.formatString = "%E";
          expect(target.format(4)).to.equal("4E+0");
        });
      });
      context("when value is 0.126 and format is %E", () => {
        it("should return '1.26E-1'", () => {
          target.formatString = "%E";
          expect(target.format(0.126)).to.equal("1.26E-1");
        });
      });
      context("when value is 0.126 and format is %8E", () => {
        it("should return ' 1.26E-1'", () => {
          target.formatString = "%8E";
          expect(target.format(0.126)).to.equal(" 1.26E-1");
        });
      });
    });
    context("when float or exponential format", () => {
      context("when value is 4 and format is %g", () => {
        it("should return '4'", () => {
          target.formatString = "%g";
          expect(target.format(4)).to.equal("4");
        });
      });
      context("when value is 10000 and format is %g", () => {
        it("should return '1e+4'", () => {
          target.formatString = "%g";
          expect(target.format(10000)).to.equal("1e+4");
        });
      });
    });
  });

  describe("saveState", () => {
    it("should return state", () => {
      target.locale = "uk-UA";
      target.formatString = "%5.2f";

      const expected = {
        className: "StockChartX.CustomNumberFormat",
        locale: "uk-UA",
        formatString: "%5.2f"
      };
      expect(target.saveState()).to.deep.equal(expected);
    });
  });

  describe("loadState", () => {
    it("should restore state", () => {
      const state = {
        className: "StockChartX.CustomNumberFormat",
        locale: "uk-UA",
        formatString: "%5.2f"
      };
      target.loadState(state);

      expect(target.locale).to.equal("uk-UA");
      expect(target.formatString).to.equal("%5.2f");
    });
  });
});
