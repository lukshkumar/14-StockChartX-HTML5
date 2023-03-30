import { IDataStore } from "../../index";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

/**
 *  Represents local data storage.
 *  @constructor StockChartX.LocalDataStore
 */
export class LocalDataStore implements IDataStore {
  private static ensureLocalStorageAvailable(
    target: object,
    key: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    if (descriptor) {
      let origFunc = descriptor.value;

      descriptor.value = function(...args: any[]): any {
        if (!localStorage) throw new Error("Local storage is not available.");

        return origFunc.apply(this, args);
      };
    }

    return descriptor;
  }

  // region IDataStore

  /**
   * Save data with a given key.
   * @method save
   * @param {string} key The unique key.
   * @param {string} data The data.
   * @return {Promise}
   * @memberOf StockChartX.LocalDataStore#
   */
  @LocalDataStore.ensureLocalStorageAvailable
  async save(key: string, data: string) {
    localStorage.setItem(key, data);
  }

  /**
   * Load data associated with a given key.
   * @method load
   * @param {string} key The key to load data for.
   * @return {Promise}
   * @memberOf StockChartX.LocalDataStore#
   */
  @LocalDataStore.ensureLocalStorageAvailable
  async load(key: string): Promise<string> {
    return localStorage.getItem(key);
  }

  /**
   * Clears data associated with a given key or clears all data if key is not specified.
   * @method clear
   * @param {string} [key] The key to clear data for.
   * @return {Promise}
   * @memberOf StockChartX.LocalDataStore#
   */
  @LocalDataStore.ensureLocalStorageAvailable
  async clear(key?: string) {
    if (key) {
      localStorage.removeItem(key);
    } else {
      localStorage.clear();
    }
  }

  // endregion
}
