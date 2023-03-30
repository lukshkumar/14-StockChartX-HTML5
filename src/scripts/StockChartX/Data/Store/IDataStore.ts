/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

/**
 * The callback that gets executed when load data completed.
 * @callback StockChartX~DataStoreSuccessCallback
 * @param {string} [data] The loaded data.
 */

/**
 * The callback that gets executed when operation completed.
 * @callback StockChartX~DataStoreFailCallback
 * @param {Error} error The error.
 * @memberOf StockChartX
 */

"use strict";

export interface IDataStore {
  save(key: string, data: string): Promise<void>;
  load(key: string): Promise<string>;
  clear(key?: string): Promise<void>;
}
