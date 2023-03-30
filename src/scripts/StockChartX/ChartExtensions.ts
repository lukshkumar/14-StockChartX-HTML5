/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */
import { Chart, IChartConfig } from "./index";
"use strict";
window.jQuery.fn.StockChartX = function(config: IChartConfig) {
  config = config || {};
  // tslint:disable-next-line:no-invalid-this
  config.container = this;

  return new Chart(config);
};
export default {};
