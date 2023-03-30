/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */


// region Interfaces

export interface IKeyValuePair<TKey, TValue> {
  key: TKey;
  value: TValue;
}

export interface IDictionary<TKey, TValue> {
  count: number;

  add(key: TKey, value: TValue): void;
  remove(key: TKey): boolean;
  containsKey(key: TKey): boolean;
  get(key: TKey): TValue;
}

// endregion

//noinspection JSUnusedLocalSymbols
/**
 * Represents dictionary with key and value.
 * @constructor StockChartX.Dictionary
 */
export class Dictionary<TKey, TValue> implements IDictionary<TKey, TValue> {
  /**
   * @internal
   */
  private _dict: object;

  // region Properties

  /**
   * @internal
   */
  private _length: number;

  /**
   * Returns number of elements in the dictionary
   * @type {number}
   * @readonly
   * @memberOf StockChartX.Dictionary#
   */
  get count(): number {
    return this._length;
  }

  // endregion

  constructor(
    pairs?: IKeyValuePair<TKey, TValue> | IKeyValuePair<TKey, TValue>[]
  ) {
    this._length = 0;
    this._dict = {};

    if (pairs) {
      if (Array.isArray(pairs)) {
        for (let pair of pairs) {
          this.add(pair.key, pair.value);
        }
      } else {
        this.add(pairs.key, pairs.value);
      }
    }
  }

  /**
   * Adds new key/value pair into the dictionary.
   * @method add
   * @param {string} key The key
   * @param {*} value The value
   * @memberOf StockChartX.Dictionary#
   */
  add(key: TKey, value: TValue) {
    if (this.containsKey(key))
      throw new Error("An item with the same key already exists.");

    this._dict[<any>key] = value;
    this._length++;
  }

  /**
   * Removes key/value pair by a given key.
   * @method remove
   * @param {string} key The key to be removed.
   * @returns {boolean} True if pair has been removed, false if key is present in the dictionary.
   * @memberOf StockChartX.Dictionary#
   */
  remove(key: TKey): boolean {
    if (!this.containsKey(key)) return false;

    delete this._dict[<any>key];
    this._length--;

    return true;
  }

  /**
   * Removes all keys and values from the dictionary.
   * @method clear
   * @memberOf StockChartX.Dictionary#
   */
  clear(): void {
    this._length = 0;
    this._dict = {};
  }

  /**
   * Checks whether given key is present in the dictionary.
   * @method containsKey
   * @param {string} key The key.
   * @returns {boolean} True if key is present in the dictionary, false otherwise.
   * @memberOf StockChartX.Dictionary#
   */
  containsKey(key: TKey): boolean {
    return this._dict[<any>key] !== undefined;
  }

  /**
   * Returns value by a given key.
   * @method get
   * @param {string} key The key.
   * @returns {*} Value by by a given key.
   * @memberOf StockChartX.Dictionary#
   */
  get(key: TKey): TValue {
    return this.containsKey(key) ? this._dict[<any>key] : null;
  }
}
