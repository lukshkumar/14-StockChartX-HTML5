/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
"use strict";
import i18next from "../StockChartX.External/i18next.js";

import TranslationOptions = I18next.TranslationOptions;
import { Chart } from "./index";
import { Environment } from "./index";

const $ = window.jQuery;

export class Localization {
  static fallbackLocale = "en";

  static async localize(chart: Chart, element?: JQuery) {
    let locale = chart.locale,
      store = i18next.store;

    if (
      !i18next.isInitialized ||
      (store.data && Object.keys(store.data).indexOf(locale) === -1)
    )
      await this._localize(locale);

    if (i18next.language !== locale) i18next.changeLanguage(locale);

    element = element || $(document);
    if (element.localize) element.localize();
  }

  static async localizeText(
    chartOrLocale: Chart | string,
    key?: string,
    trlOptions?: TranslationOptions
  ): Promise<string> {
    if (!key) return null;

    let store = i18next.store,
      locale =
        chartOrLocale instanceof Chart
          ? chartOrLocale.locale
          : chartOrLocale || this.fallbackLocale;

    if (
      !i18next.isInitialized ||
      (store.data && Object.keys(store.data).indexOf(locale) === -1)
    )
      await this._localize(locale);

    if (i18next.language !== locale) i18next.changeLanguage(locale);

    if (trlOptions) {
      let options = {
        interpolation: {
          prefix: "{",
          suffix: "}"
        },
        replace: trlOptions.replace,
        defaultValue: trlOptions.defaultValue
      };

      return i18next.t(key, options);
    }

    return i18next.t(key);
  }

  private static async _localize(locale: string) {
    return new Promise((resolve: () => void, reject: () => void) => {
      i18next.use(window.i18nextXHRBackend);
      i18next.init(
        {
          debug: false,
          lng: locale,
          fallbackLng: this.fallbackLocale,
          backend: {
            loadPath: `${Environment.Path.locales}{{lng}}.json`
          }
        },
        (error: any) => {
          if (error) {
            reject();

            return;
          }

          window.jqueryI18next.init(i18next, $, {
            parseDefaultValueFromContent: true,
            handleName: "localize"
          });

          resolve();
        }
      );
    });
  }
}
