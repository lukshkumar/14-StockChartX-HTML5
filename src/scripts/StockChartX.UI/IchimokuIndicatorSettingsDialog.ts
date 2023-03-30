/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { Dialog } from "./index";
import { IIndicatorSettingsDialogConfig } from "./index";
import Switchery from "../StockChartX.External/switchery";

import {
  ILinePropertiesHandlerConfig,
  LinePropertiesHandler
} from "./index";

// @if SCX_LICENSE = 'full'

"use strict";
const $ = window.jQuery;
const tinycolor = require("tinycolor2");

const ID = {
  DIALOG: "#scxIchimokuIndicatorDialog_",
  LABEL: ".scxIchimokuIndicatorDialog_label",
  INPUT: ".scxIchimokuIndicatorDialog_input_",
  CHECK: ".scxIchimokuIndicatorDialog_chk_",
  FIGURE: ".scxIchimokuIndicatorDialog_panel_figure_",
  PANEL: ".scxIchimokuIndicatorDialog_panel_",
  TITLE: "#scxIchimokuIndicatorDialog_title"
};

const CLASS_SPECTRUM = "scxSpectrumDrawingDialog";

export class IchimokuIndicatorSettingsDialog extends Dialog {
  _isApplyClicked: any;
  protected _config: IIndicatorSettingsDialogConfig;
  // private _isApplyClicked: boolean = false;

  private _panelFigureLinesStylePanel: JQuery;
  private _input_conversion: JQuery;
  private _input_base: JQuery;
  private _input_lagging: JQuery;
  private _input_lineColor: JQuery;
  private _input_lineWidth: JQuery;
  private _input_lineStyle: JQuery;
  private _chk_tenkanLineEnabledHTMLObj: JQuery;
  private _chk_kijunLineEnabledHTMLObj: JQuery;
  private _chk_chikouLineEnabledHTMLObj: JQuery;
  private _chk_senkouALineEnabledHTMLObj: JQuery;
  private _chk_senkouBLineEnabledHTMLObj: JQuery;
  private _chk_kumoEnabledHTMLObj: JQuery;

  private _lineEnabled = [];

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

  private static _switcherySettings = {
    color: "#64bd63",
    secondaryColor: "#ddd",
    className: "scx_switchery",
    disabled: false,
    disabledOpacity: 0.5,
    speed: "0.4s"
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
    $("body").on("scxSwitcherChanged", (e: JQueryEventObject, evtData: any) => {
      let target = $(evtData.target),
        isEnabled = evtData.checked;

      if (target.is(this._chk_tenkanLineEnabledHTMLObj)) {
        this._setLineState(isEnabled, 0);
      } else if (target.is(this._chk_kijunLineEnabledHTMLObj)) {
        this._setLineState(isEnabled, 1);
      } else if (target.is(this._chk_chikouLineEnabledHTMLObj)) {
        this._setLineState(isEnabled, 2);
      } else if (target.is(this._chk_senkouALineEnabledHTMLObj)) {
        this._setLineState(isEnabled, 3);
      } else if (target.is(this._chk_senkouBLineEnabledHTMLObj)) {
        this._setLineState(isEnabled, 4);
      } else if (target.is(this._chk_kumoEnabledHTMLObj)) {
        this._setLineState(isEnabled, 5);
      }
    });

    this._input_conversion.scxNumericField(
      IchimokuIndicatorSettingsDialog._numericFieldConfig
    );
    this._input_base.scxNumericField(
      IchimokuIndicatorSettingsDialog._numericFieldConfig
    );
    this._input_lagging.scxNumericField(
      IchimokuIndicatorSettingsDialog._numericFieldConfig
    );
    this._input_lineWidth.scxNumericField(
      IchimokuIndicatorSettingsDialog._numericFieldWidthConfig
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

    let _chk_tenkanLineEnabled = new Switchery(
      document.querySelector(`${ID.CHECK}tenkanLine`),
      IchimokuIndicatorSettingsDialog._switcherySettings
    );
    this._lineEnabled.push(_chk_tenkanLineEnabled);

    let _chk_kijunLineEnabled = new Switchery(
      document.querySelector(`${ID.CHECK}kijunLine`),
      IchimokuIndicatorSettingsDialog._switcherySettings
    );
    this._lineEnabled.push(_chk_kijunLineEnabled);

    let _chk_chikouLineEnabled = new Switchery(
      document.querySelector(`${ID.CHECK}chikouLine`),
      IchimokuIndicatorSettingsDialog._switcherySettings
    );
    this._lineEnabled.push(_chk_chikouLineEnabled);

    let _chk_senkouALineEnabled = new Switchery(
      document.querySelector(`${ID.CHECK}senkouALine`),
      IchimokuIndicatorSettingsDialog._switcherySettings
    );
    this._lineEnabled.push(_chk_senkouALineEnabled);

    let _chk_senkouBLineEnabled = new Switchery(
      document.querySelector(`${ID.CHECK}senkouBLine`),
      IchimokuIndicatorSettingsDialog._switcherySettings
    );
    this._lineEnabled.push(_chk_senkouBLineEnabled);

    let _chk_kumoEnabled = new Switchery(
      document.querySelector(`${ID.CHECK}kumo`),
      IchimokuIndicatorSettingsDialog._switcherySettings
    );
    this._lineEnabled.push(_chk_kumoEnabled);

    this._dialog.find(`${ID.DIALOG}btn_save`).on("click", () => {
      this._save();
    });

    this._dialog.find(`${ID.DIALOG}btn_apply`).on("click", () => {
      this._apply();
    });
  }

  private _setLineState(isEnabled: boolean, index: number): void {
    let label = this._panelFigureLinesStylePanel.find(ID.LABEL).eq(index);
    let input_lineColor = this._panelFigureLinesStylePanel
      .find(`${ID.INPUT}lineColor`)
      .eq(index);
    let input_lineWidth = this._panelFigureLinesStylePanel
      .find(`${ID.INPUT}lineWidth`)
      .eq(index);
    let input_lineStyle = this._panelFigureLinesStylePanel
      .find(`${ID.INPUT}lineStyle:even`)
      .eq(index);

    if (isEnabled) {
      label.removeClass("disabled");
      input_lineColor.spectrum("enable");
      input_lineStyle.removeAttr("disabled");
      input_lineStyle.selectpicker("refresh");
      input_lineWidth.scxNumericField("enable");
      this._config.ichimokuIndicator.lines[index].visible = true;
    } else {
      label.addClass("disabled");
      input_lineColor.spectrum("disable");
      input_lineStyle.attr("disabled", "disabled");
      input_lineStyle.selectpicker("refresh");
      input_lineWidth.scxNumericField("disable");
      this._config.ichimokuIndicator.lines[index].visible = false;
    }
  }

  private _setValues(): void {
    let linesCount = this._config.ichimokuIndicator.lines.length;

    for (let i = 0; i < linesCount; i++) {
      let theme = this._config.ichimokuIndicator.lines[i].theme,
        linePropertiesConfig: ILinePropertiesHandlerConfig = {
          colorPicker: this._input_lineColor.eq(i),
          widthInput: this._input_lineWidth.eq(i),
          lineStyleDropdown: this._input_lineStyle.eq(i)
        },
        linePropertiesHandler = new LinePropertiesHandler(linePropertiesConfig);

      linePropertiesHandler.theme = theme;

      if (
        this._config.ichimokuIndicator.lines[i].visible !==
        this._lineEnabled[i].isChecked()
      ) {
        this._lineEnabled[i].setPosition(true);
      }

      this._setLineState(this._config.ichimokuIndicator.lines[i].visible, i);
    }

    let input_backgroundColor = this._input_lineColor.eq(linesCount - 1);
    input_backgroundColor.spectrum(
      "set",
      this._config.ichimokuIndicator.lines[linesCount - 1].theme.fillColor
    );

    this._input_conversion.scxNumericField(
      "setValue",
      this._config.ichimokuIndicator.conversionLinePeriods
    );
    this._input_base.scxNumericField(
      "setValue",
      this._config.ichimokuIndicator.baseLinePeriods
    );
    this._input_lagging.scxNumericField(
      "setValue",
      this._config.ichimokuIndicator.loggingSpan2Periods
    );
  }

  private _getValues(): void {
    let linesCount = this._config.ichimokuIndicator.lines.length;

    for (let i = 0; i < linesCount - 1; i++) {
      let linePropertiesConfig: ILinePropertiesHandlerConfig = {
          colorPicker: this._input_lineColor.eq(i),
          widthInput: this._input_lineWidth.eq(i),
          lineStyleDropdown: this._input_lineStyle.eq(i)
        },
        linePropertiesHandler = new LinePropertiesHandler(linePropertiesConfig);
      let newTheme = linePropertiesHandler.theme;
      this._config.ichimokuIndicator.lines[i].theme = newTheme;
    }

    let input_background = this._input_lineColor.eq(linesCount - 1);
    let fillColor = input_background.spectrum("get").toRgb();
    this._config.ichimokuIndicator.lines[
      linesCount - 1
    ].theme.fillColor = tinycolor(fillColor).toRgbString();

    this._config.ichimokuIndicator.conversionLinePeriods = this._input_conversion.scxNumericField(
      "getValue"
    );
    this._config.ichimokuIndicator.baseLinePeriods = this._input_base.scxNumericField(
      "getValue"
    );
    this._config.ichimokuIndicator.loggingSpan2Periods = this._input_lagging.scxNumericField(
      "getValue"
    );
  }

  private _save(): void {
    this._apply();
    this.hide();
  }

  private _apply(): void {
    this._getValues();
    this._config.ichimokuIndicator.update();
    this._isApplyClicked = true;
  }

  private setDialogTitle() {
    this._dialog
      .find(ID.TITLE)
      .scxLocalize("indicatorSettingsDialog.title.IchimokuCloud");
  }

  private _initFields(): void {
    this._panelFigureLinesStylePanel = this._dialog.find(
      `${ID.FIGURE}linesStylePanel`
    );
    this._input_conversion = this._dialog.find(
      `${ID.INPUT}conversionLinePeriods`
    );
    this._input_base = this._dialog.find(`${ID.INPUT}baseLinePeriods`);
    this._input_lagging = this._dialog.find(`${ID.INPUT}laggingSpanPeriods`);
    this._input_lineColor = this._dialog.find(`${ID.INPUT}lineColor`);
    this._input_lineWidth = this._dialog.find(`${ID.INPUT}lineWidth`);
    this._input_lineStyle = this._dialog.find(`${ID.INPUT}lineStyle`);
    this._chk_tenkanLineEnabledHTMLObj = this._dialog.find(
      `${ID.CHECK}tenkanLine`
    );
    this._chk_kijunLineEnabledHTMLObj = this._dialog.find(
      `${ID.CHECK}kijunLine`
    );
    this._chk_chikouLineEnabledHTMLObj = this._dialog.find(
      `${ID.CHECK}chikouLine`
    );
    this._chk_senkouALineEnabledHTMLObj = this._dialog.find(
      `${ID.CHECK}senkouALine`
    );
    this._chk_senkouBLineEnabledHTMLObj = this._dialog.find(
      `${ID.CHECK}senkouBLine`
    );
    this._chk_kumoEnabledHTMLObj = this._dialog.find(`${ID.CHECK}kumo`);
  }
}

// @endif
