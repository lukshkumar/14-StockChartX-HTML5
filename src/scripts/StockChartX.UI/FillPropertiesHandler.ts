import { IFillTheme } from "../StockChartX/index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

/// <reference path="../references.ts" />

"use strict";

export interface IFillPropertiesHandlerConfig {
  label: JQuery;
  colorPicker: JQuery;
  switcher: Switchery;
}

export class FillPropertiesHandler {
  /**
   * @internal
   */
  private _label: JQuery;

  /**
   * @internal
   */
  private _colorPicker: JQuery;

  /**
   * @internal
   */
  private _switcher: Switchery;

  get theme(): IFillTheme {
    return {
      fillColor: this._colorPicker.spectrum("get").toRgbString()
    };
  }

  set theme(theme: IFillTheme) {
    this._colorPicker.spectrum("set", theme.fillColor);
  }

  get isEnabled(): boolean {
    return this._switcher.isChecked();
  }

  constructor(config: IFillPropertiesHandlerConfig) {
    this._label = config.label;
    this._colorPicker = config.colorPicker;
    this._switcher = config.switcher;
  }

  /**
   * Sets state of fill property item
   * @method setState
   * @param {boolean} enable
   * @memberOf StockChartX.UI.FillPropertiesHandler#
   */
  setState(enable: boolean): void {
    this._switcher.setPosition(enable);
    if (enable) {
      this._colorPicker.spectrum("enable");
      this._label.removeClass("disabled");
      if (!this._switcher.isChecked()) this._switcher.setPosition(true);
    } else {
      this._colorPicker.spectrum("disable");
      this._label.addClass("disabled");
      if (this._switcher.isChecked()) this._switcher.setPosition(true);
    }
  }
}
