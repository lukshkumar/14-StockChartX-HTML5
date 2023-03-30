import { IStrokeTheme, LineStyle } from "../StockChartX/index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */


"use strict";

export interface ILinePropertiesHandlerConfig {
  colorPicker: JQuery;
  widthInput: JQuery;
  lineStyleDropdown: JQuery;
}

export class LinePropertiesHandler {
  private _colorPicker: JQuery;
  private _widthInput: JQuery;
  private _lineStyleDropdown: JQuery;

  constructor(config: ILinePropertiesHandlerConfig) {
    this._colorPicker = config.colorPicker;
    this._widthInput = config.widthInput;
    this._lineStyleDropdown = config.lineStyleDropdown;
  }

  public get theme(): IStrokeTheme {
    let themeValue = {
      strokeColor: this._colorPicker.spectrum("get").toRgbString(),
      width: this._widthInput.scxNumericField("getValue"),
      lineStyle: this._lineStyleDropdown.val()
    };

    return themeValue;
  }

  public set theme(theme: IStrokeTheme) {
    this._colorPicker.spectrum("set", theme.strokeColor);
    this._widthInput.scxNumericField("setValue", theme.width);
    this._lineStyleDropdown.selectpicker(
      "val",
      theme.lineStyle || LineStyle.SOLID
    );
    this._lineStyleDropdown.selectpicker("refresh");
  }
}
