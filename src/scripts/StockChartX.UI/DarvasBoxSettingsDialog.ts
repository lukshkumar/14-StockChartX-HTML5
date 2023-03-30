import {
  LinePropertiesHandler,
  ILinePropertiesHandlerConfig
} from "./index";
import { IIndicatorSettingsDialogConfig } from "./index";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { Dialog } from "./index";
import tinycolor from "tinycolor2";

const $ = window.jQuery;

/// <reference path="../references.ts" />

"use strict";

const ID = {
  DIALOG: "#scxDarvasBoxDialog_",
  LABEL: ".scxDarvasBoxDialog_label",
  INPUT: ".scxDarvasBoxDialog_input_",
  CHECK: ".scxDarvasBoxDialog_chk_",
  FIGURE: ".scxDarvasBoxDialog_panel_figure_",
  PANEL: ".scxDarvasBoxDialog_panel_"
};

const CLASS_SPECTRUM = "scxSpectrumDrawingDialog";

export class DarvasBoxSettingsDialog extends Dialog {
  protected _config: IIndicatorSettingsDialogConfig;
  private _isApplyClicked: boolean = false;

  private _input_darvasBox: JQuery;
  private _title: JQuery;
  private _panelFigureLinesStylePanel: JQuery;
  private _input_lineColor: JQuery;
  private _input_lineWidth: JQuery;
  private _input_lineStyle: JQuery;
  private _topLineHandler: LinePropertiesHandler;
  private _bottomLineHandler: LinePropertiesHandler;
  private _chk_topLineEnabledHTMLObj: JQuery;
  private _chk_bottomLineEnabledHTMLObj: JQuery;

  private static _numericFieldConfig = {
    showArrows: true,
    maxValue: 2000,
    minValue: 1,
    value: 1
  };

  private static _numericFieldWidthConfig = {
    showArrows: false,
    maxValue: 20,
    minValue: 1,
    value: 1
  };

  constructor(container: JQuery) {
    super(container);

    this._initFields();
    this._init();
  }

  public show(config: IIndicatorSettingsDialogConfig): void {
    if (!this.initDialog(config)) return;

    this._isApplyClicked = false;
    this.setDialogTitle();
    this._setValues();
    super.show(config);
  }

  private _init(): void {
    $("body").bind("scxSwitcherChanged", (evtData: any) => {
      let target = $(evtData.target),
        isEnabled = evtData.checked;

      if (target.is(this._chk_topLineEnabledHTMLObj)) {
        this._setLineState(isEnabled, 0);
      }
      if (target.is(this._chk_bottomLineEnabledHTMLObj)) {
        this._setLineState(isEnabled, 1);
      }
    });

    this._input_darvasBox.scxNumericField(
      DarvasBoxSettingsDialog._numericFieldConfig
    );
    this._input_lineWidth.scxNumericField(
      DarvasBoxSettingsDialog._numericFieldWidthConfig
    );
    this._input_lineStyle.selectpicker({ container: "body" });

    this._dialog
      .find(".scxSpectrum")
      .scx()
      .colorPicker({
        containerClassName: CLASS_SPECTRUM,
        localStorageKey: "scxThemeDialog_spectrum",
        showAlpha: true
      });

    this._dialog.find(`${ID.DIALOG}btn_save`).on("click", () => {
      this._save();
    });

    this._dialog.find(`${ID.DIALOG}btn_apply`).on("click", () => {
      this._apply();
    });
  }

  private _setLineState(isEnabled: boolean, index: number): void {
    let label = this._panelFigureLinesStylePanel.find(ID.LABEL).eq(index);
    let input_lineColor = this._input_lineColor.eq(index);
    let input_lineWidth = this._input_lineWidth.eq(index);
    let input_lineStyle = this._input_lineStyle.eq(index);

    if (isEnabled) {
      label.removeClass("disabled");
      input_lineColor.spectrum("enable");
      input_lineStyle.removeAttr("disabled");
      input_lineStyle.selectpicker("refresh");
      input_lineWidth.scxNumericField("enable");
      this._config.dBox.lines[index].visible = true;
    } else {
      label.addClass("disabled");
      input_lineColor.spectrum("disable");
      input_lineStyle.attr("disabled", "disabled");
      input_lineStyle.selectpicker("refresh");
      input_lineWidth.scxNumericField("disable");
      this._config.dBox.lines[index].visible = false;
    }
  }

  private _setValues(): void {
    let linesCount = this._config.dBox.lines.length;

    let topLineTheme = this._config.dBox.lines[0].theme;
    this._topLineHandler.theme = topLineTheme;
    this._setLineState(this._config.dBox.lines[0].visible, 0);

    let bottomLineTheme = this._config.dBox.lines[1].theme;
    this._bottomLineHandler.theme = bottomLineTheme;
    this._setLineState(this._config.dBox.lines[1].visible, 1);

    let input_backgroundColor = this._dialog
      .find(`${ID.INPUT}lineColor`)
      .eq(linesCount);
    input_backgroundColor.spectrum(
      "set",
      this._config.dBox.lines[linesCount - 1].theme.fillColor
    );

    this._input_darvasBox.scxNumericField(
      "setValue",
      this._config.dBox.darvasBoxLinePeriods
    );
  }

  private _getValues(): void {
    let linesCount = this._config.dBox.lines.length;

    this._config.dBox.lines[0].theme = this._topLineHandler.theme;
    this._config.dBox.lines[0].hasUserConfig = true;

    this._config.dBox.lines[1].theme = this._bottomLineHandler.theme;
    this._config.dBox.lines[1].hasUserConfig = true;

    let input_background = this._dialog
      .find(`${ID.INPUT}lineColor`)
      .eq(linesCount - 1);
    let fillColor = input_background.spectrum("get").toRgb();
    this._config.dBox.lines[linesCount - 1].theme.fillColor = tinycolor(
      fillColor
    ).toRgbString();
    this._config.dBox.darvasBoxLinePeriods = this._input_darvasBox.scxNumericField(
      "getValue"
    );
  }

  private _save(): void {
    this._apply();
    this.hide();
  }

  private _apply(): void {
    this._getValues();
    this._config.dBox.update();
    this._config.dBox.chartPanel.update();
    this._isApplyClicked = true;
  }

  private setDialogTitle() {
    this._title.scxLocalize("indicatorSettingsDialog.title.DBox");
  }

  private _initFields(): void {
    this._panelFigureLinesStylePanel = this._dialog.find(
      `${ID.FIGURE}linesStylePanel`
    );
    this._title = this._dialog.find(`${ID.DIALOG}title`);
    this._input_darvasBox = this._dialog.find(
      `${ID.INPUT}darvasBoxLinePeriods`
    );
    this._input_lineColor = this._dialog.find(`${ID.INPUT}lineColor`);
    this._input_lineWidth = this._dialog.find(`${ID.INPUT}lineWidth`);
    this._input_lineStyle = this._dialog.find(`${ID.INPUT}lineStyle`);
    this._chk_topLineEnabledHTMLObj = this._dialog.find(`${ID.CHECK}topLine`);
    this._chk_bottomLineEnabledHTMLObj = this._dialog.find(
      `${ID.CHECK}bottomLine`
    );

    let topLineConfig: ILinePropertiesHandlerConfig = {
      colorPicker: this._input_lineColor.eq(0),
      widthInput: this._input_lineWidth.eq(0),
      lineStyleDropdown: this._input_lineStyle.eq(0)
    };
    this._topLineHandler = new LinePropertiesHandler(topLineConfig);

    let bottomLineConfig: ILinePropertiesHandlerConfig = {
      colorPicker: this._input_lineColor.eq(1),
      widthInput: this._input_lineWidth.eq(1),
      lineStyleDropdown: this._input_lineStyle.eq(1)
    };
    this._bottomLineHandler = new LinePropertiesHandler(bottomLineConfig);
  }
}
