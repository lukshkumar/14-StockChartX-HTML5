/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

/**
 * The request structure.
 * @typedef {object} StockChartX~Request
 * @type {object}
 * @property {number} id The unique request identifier.
 * @property {StockChartX.Chart} chart The chart, sending the request.
 * @memberOf StockChartX
 */

/**
 * The historical bars request
 * @typedef {object} StockChartX~BarsRequest
 * @type {object}
 * @property {number} id The unique request identifier.
 * @property {StockChartX.Chart} chart The chart, sending the request.
 * @property {number} count The number of bars to load.
 * @property {Date} [endDate] The end date to load bars.
 * @property {string} kind request type.
 */
import { Chart } from "../index";
"use strict";

export const RequestKind = {
  BARS: "bars",
  MORE_BARS: "moreBars"
};

export interface IRequest {
  id?: number;
  kind: string;
  chart?: Chart;
}

export interface IBarsRequest extends IRequest {
  count: number;
  endDate?: Date;
}
