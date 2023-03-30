/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2019 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { expect } from "chai";

import { CompareSymbol, Chart, Theme } from "../../../src/scripts/exporter";
"use strict";
describe("DataManager", () => {
  let target: CompareSymbol;
  let chart: Chart;
  let config = {
    width: 768,
    height: 460,
    theme: Theme.Dark,
    container: window.jQuery("#chartContainer"),
    instrument: {
      symbol: "BTCUSD",
      company: "BITCOIN",
      exchange: "Binance"
    }
  };
  chart = new Chart(config);
  target = new CompareSymbol({ chart });
  console.log("heeeelllo ", target);

  beforeEach(() => {
    console.log("heeeelllo ", target);
  });
  describe("dateDataSeries", () => {
    context("when no data series", () => {
      it("should return null", () => {
        // console.log("targettt ", target);
        // expect(true).to.be(true);
      });
    });
  });
});
