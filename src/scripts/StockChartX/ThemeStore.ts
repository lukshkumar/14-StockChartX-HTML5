import { LocalDataStore } from "./index";
import { Notification } from "../StockChartX.UI/index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

const $ = window.jQuery;
let Theme = window.Theme;
const EventSuffix = ".scxThemeStore";
const ThemeKey = "scxThemes";

export class ThemeStore {
  /**
   * The flag that indicates whether themes should be saved automatically.
   * @name autoSave
   * @type {boolean}
   * @default true
   * @memberOf StockChartX.ThemeStore
   */
  static autoSave = true;

  /**
   * Saves themes into the local storage.
   * @method save
   * @memberOf StockChartX.ThemeStore
   * @return {Promise}
   */
  static async save(): Promise<void> {
    let store = new LocalDataStore();

    await store.save(ThemeKey, JSON.stringify(Theme));
  }

  /**
   * Loads themes from the local storage.
   * @method load
   * @memberOf StockChartX.ThemeStore
   * @return {Promise}
   */
  static async load(): Promise<any> {
    let store = new LocalDataStore();

    return await store.load(ThemeKey);
  }
}

$(async () => {
  try {
    let theme = await ThemeStore.load();
    Theme = $.extend(true, {}, Theme, theme ? JSON.parse(theme) : null);
  } catch (e) {
    Notification.error("Themes are not loaded.");
  }

  $(window).on(`beforeunload${EventSuffix}`, () => {
    if (ThemeStore.autoSave) ThemeStore.save();
  });
});
