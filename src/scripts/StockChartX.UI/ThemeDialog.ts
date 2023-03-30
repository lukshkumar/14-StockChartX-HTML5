import Switchery from "../StockChartX.External/switchery";
import { Notification } from "./index";
import { JQueryEventObject } from "../external/typescript/jquery.d";
import { IDialogConfig } from "./index";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */
import { Dialog } from "./index";
import { Theme } from "../StockChartX/index";
import { Localization } from "../StockChartX/index";
import { JsUtil } from "../StockChartX/index";
import { Environment } from "../StockChartX/index";

"use strict";
const $ = window.jQuery;

export interface IThemeDialogConfig extends IDialogConfig {
  theme: any;
  done(theme: Object): void;
}

const DIALOG_ID = {
  DIALOG: "#scxThemeDialog_",
  LABEL: "#scxThemeDialog_label_",
  CHECK: "#scxThemeDialog_chk_",
  FIELD: "#scxThemeDialog_input_",
  BUTTON: "#scxThemeDialog_btn_"
};

const localizeKey = "themeDialog.themes";

export class ThemeDialog extends Dialog {
  private static CLASS_INVALID_VALUE = "scxInvalidValue";
  private static CLASS_BTN_PRIMARY = "btn-primary";
  private static CLASS_BTN_DEFAULT = "btn-default";

  private static _switcherySettings = {
    color: "#64bd63",
    secondaryColor: "#ddd",
    className: "scx_switchery",
    disabled: false,
    disabledOpacity: 0.5,
    speed: "0.4s"
  };

  protected _config: IThemeDialogConfig;

  private _dialogBody: JQuery;
  private _dialogTitle: JQuery;
  private _btnApply: JQuery;
  private _fieldLineBarColor: JQuery;
  private _fieldUpBarColor: JQuery;
  private _fieldDownBarColor: JQuery;
  private _labelUpBarBorderColor: JQuery;
  private _fieldUpBarBorderColor: JQuery;
  private _fieldUpBarBorderEnabled: JQuery;
  private _chkUpBarBorderEnabled: Switchery;
  private _labelDownBarBorderColor: JQuery;
  private _fieldDownBarBorderColor: JQuery;
  private _fieldDownBarBorderEnabled: JQuery;
  private _chkDownBarBorderEnabled: Switchery;
  private _fieldUpWickColor: JQuery;
  private _fieldValueScalePanelColor: JQuery;
  // private _labelValueScalePanelColor: JQuery;
  private _fieldDateScalePanelColor: JQuery;
  // private _labelDateScalePanelColor: JQuery;
  private _fieldDownWickColor: JQuery;
  private _fieldTextFont: JQuery;
  private _fieldTextSize: JQuery;
  private _fieldTextColor: JQuery;
  private _fieldGradient1Color: JQuery;
  private _fieldGradient2Color: JQuery;
  private _fieldGridColor: JQuery;
  private _fieldTheme: JQuery;
  private _wrapperTheme: JQuery;
  private _btnNewTheme: JQuery;
  private _btnNewThemeConfirm: JQuery;
  private _fieldNewThemeName: JQuery;
  private _btnSaveTheme: JQuery;

  constructor(container: JQuery) {
    super(container);

    this._initFields();
    this._init();
  }

  public show(config: IThemeDialogConfig) {
    if (!this.initDialog(config)) return;
    this._setValues();
    this._hideNewThemeForm();
    super.show(config);
  }

  public hide(): void {
    //   this._config = null;
    super.hide();
  }

  private _init(): void {
    this._fieldTextFont
      .selectpicker({ container: "body" })
      .change((e: JQueryEventObject) => {
        this._fieldTextFont
          .next()
          .css({ "font-family": (<HTMLInputElement>e.target).value });
      });

    this._fieldTextSize.selectpicker({ container: "body" });

    this._fieldTheme
      .selectpicker({ container: "body" })
      .change((e: JQueryEventObject) => {
        let themeName = $(e.currentTarget).val();
        if (themeName && this._config.theme.name !== themeName) {
          this._setTitle(themeName);
          this._config.theme = Theme[themeName];
          this._setValues();
        }
      });

    this._btnNewTheme.on("click", () => {
      let scrollTop = this._dialogBody.scrollTop();

      this._showNewThemeForm();
      this.resize();

      // scroll to the just shown element
      if (this._dialogBody[0].scrollHeight > $(window).height()) {
        let top = this._wrapperTheme.position().top;
        let scrollToNewThemeBox =
          top +
          this._wrapperTheme.outerHeight(true) -
          this._dialogBody.height();
        scrollTop =
          scrollTop < scrollToNewThemeBox ? scrollToNewThemeBox : scrollTop;
        this._dialogBody.scrollTop(scrollTop);
      }
    });

    this._fieldNewThemeName.keyup((e: JQueryEventObject) => {
      if (e.which === 13) this._addNewTheme();
    });

    this._fieldNewThemeName.on("input", (e: JQueryEventObject) => {
      this._highlightNewThemeNameInvalid(false);
      this._switchNewThemeConfirmButton($(e.currentTarget).val().length);
    });

    this._btnNewThemeConfirm.on("click", () => {
      this._addNewTheme();
    });

    this._dialog
      .find(".scxSpectrum")
      .scx()
      .colorPicker({ localStorageKey: "scxThemeDialog_spectrum" });

    this._chkUpBarBorderEnabled = new Switchery(
      document.querySelector(DIALOG_ID.CHECK + "upBarBorderColor"),
      ThemeDialog._switcherySettings
    );
    this._chkDownBarBorderEnabled = new Switchery(
      document.querySelector(DIALOG_ID.CHECK + "downBarBorderColor"),
      ThemeDialog._switcherySettings
    );

    this._chkUpBarBorderEnabled.setPosition(false);
    this._chkDownBarBorderEnabled.setPosition(false);
    $("body").on("scxSwitcherChanged", (e: JQueryEventObject, evtData: any) => {
      let target = $(evtData.target);
      let isEnabled = evtData.checked;

      if (target.is(this._fieldUpBarBorderEnabled))
        this._setUpBarBorderState(isEnabled);
      else if (target.is(this._fieldDownBarBorderEnabled))
        this._setDownBarBorderState(isEnabled);
    });

    this._btnSaveTheme.on("click", () => {
      let theme = this._getValues();
      this._saveTheme(theme);
      this._apply(theme);
    });
    this._btnApply.on("click", () => {
      this._apply();
    });
  }

  private _saveTheme(theme?: any): void {
    if (theme == null) theme = this._getValues();

    theme.name = this._config.theme.name;
    this._config.theme = theme;
    Theme[this._config.theme.name] = this._config.theme;
    Localization.localizeText(
      this._config.chart,
      "notification.theme.msg.success"
    ).then((text: string) => {
      Notification.success(text);
    });
  }

  private _addNewTheme(): void {
    let text = JsUtil.filterText(this._fieldNewThemeName.val());
    if (typeof Theme[text] === "undefined") {
      if (text !== "") {
        this._setTitle(text);
        this._fieldTheme.append(ThemeDialog._generateThemeSelectorItem(text));

        this._config.theme = this._getValues();
        this._config.theme.name = text;
        Theme[text] = this._config.theme;
        this._fieldTheme.selectpicker("val", text).selectpicker("refresh");
      }
      this._hideNewThemeForm();
    } else {
      this._highlightNewThemeNameInvalid(true);
    }
  }

  private _showNewThemeForm(): void {
    this._btnNewTheme.hide();
    this._wrapperTheme.show();
    if (!Environment.isMobile) this._fieldNewThemeName.focus();
  }

  private _hideNewThemeForm(): void {
    this._fieldNewThemeName.val("");
    this._wrapperTheme.hide();
    this._btnNewTheme.show();
  }

  private _switchNewThemeConfirmButton(flag: boolean): void {
    if (flag) {
      this._btnNewThemeConfirm
        .scxLocalize("themeDialog.ok")
        .removeClass(ThemeDialog.CLASS_BTN_DEFAULT)
        .addClass(ThemeDialog.CLASS_BTN_PRIMARY);
    } else {
      this._btnNewThemeConfirm
        .scxLocalize("themeDialog.cancel")
        .removeClass(ThemeDialog.CLASS_BTN_PRIMARY)
        .addClass(ThemeDialog.CLASS_BTN_DEFAULT);
    }
    this._config.chart.localize(this._btnNewThemeConfirm);
  }

  private async _setTitle(themeName: string) {
    let chart = this._config.chart;

    let localizedThemeName = await Localization.localizeText(
        chart,
        localizeKey + themeName,
        { defaultValue: themeName }
      ),
      title = await Localization.localizeText(chart, "themeDialog.title", {
        replace: { themeName: localizedThemeName }
      });

    this._dialogTitle.text(title);
  }

  private static _generateThemeSelectorItem(name: string): JQuery {
    name = JsUtil.filterText(name);
    let i18Attr = localizeKey + name;

    return $(
      `<option title="${name}" value="${name}" data-i18n="${i18Attr}">${name}</option>`
    );
  }

  private _setUpBarBorderState(isEnabled: boolean): void {
    if (isEnabled) {
      this._fieldUpBarBorderColor.spectrum("enable");
      this._labelUpBarBorderColor.removeClass("disabled");
      if (!this._chkUpBarBorderEnabled.isChecked())
        this._chkUpBarBorderEnabled.setPosition(true);
    } else {
      this._fieldUpBarBorderColor.spectrum("disable");
      this._labelUpBarBorderColor.addClass("disabled");
      if (this._chkUpBarBorderEnabled.isChecked())
        this._chkUpBarBorderEnabled.setPosition(true);
    }
  }

  private _setDownBarBorderState(isEnabled: boolean): void {
    if (isEnabled) {
      this._fieldDownBarBorderColor.spectrum("enable");
      this._labelDownBarBorderColor.removeClass("disabled");
      if (!this._chkDownBarBorderEnabled.isChecked())
        this._chkDownBarBorderEnabled.setPosition(true);
    } else {
      this._fieldDownBarBorderColor.spectrum("disable");
      this._labelDownBarBorderColor.addClass("disabled");
      if (this._chkDownBarBorderEnabled.isChecked())
        this._chkDownBarBorderEnabled.setPosition(true);
    }
  }

  private _setValues(): void {
    let theme = this._config.theme;

    this._setTitle(theme.name);
    this._fieldLineBarColor.spectrum("set", theme.plot.line.simple.strokeColor);
    this._fieldUpBarColor.spectrum(
      "set",
      theme.plot.bar.candle.upCandle.fill.fillColor
    );
    this._fieldDownBarColor.spectrum(
      "set",
      theme.plot.bar.candle.downCandle.fill.fillColor
    );
    this._fieldUpBarBorderColor.spectrum(
      "set",
      theme.plot.bar.candle.upCandle.border.strokeColor
    );
    this._setUpBarBorderState(
      theme.plot.bar.candle.upCandle.border.strokeEnabled
    );
    this._fieldDownBarBorderColor.spectrum(
      "set",
      theme.plot.bar.candle.downCandle.border.strokeColor
    );
    this._setDownBarBorderState(
      theme.plot.bar.candle.downCandle.border.strokeEnabled
    );
    this._fieldUpWickColor.spectrum(
      "set",
      theme.plot.bar.candle.upCandle.wick.strokeColor
    );
    this._fieldDownWickColor.spectrum(
      "set",
      theme.plot.bar.candle.downCandle.wick.strokeColor
    );
    this._fieldTextFont
      .selectpicker("val", theme.valueScale.text.fontFamily)
      .selectpicker("refresh");
    this._fieldTextSize
      .selectpicker("val", theme.valueScale.text.fontSize)
      .selectpicker("refresh");
    this._fieldValueScalePanelColor.spectrum(
      "set",
      theme.valueScale.fill.fillColor
    );
    this._fieldDateScalePanelColor.spectrum(
      "set",
      theme.dateScale.fill.fillColor
    );

    this._fieldTextColor.spectrum("set", theme.valueScale.text.fillColor);
    this._fieldGradient1Color.spectrum("set", theme.chart.background[0]);
    this._fieldGradient2Color.spectrum("set", theme.chart.background[1]);
    this._fieldGridColor.spectrum("set", theme.chartPanel.grid.strokeColor);

    let items = [];
    for (let i in Theme) {
      if (Theme.hasOwnProperty(i))
        items.push(ThemeDialog._generateThemeSelectorItem(Theme[i].name));
    }
    this._fieldTheme.empty().append(items);
    this._fieldTheme
      .selectpicker("val", this._config.theme.name)
      .selectpicker("refresh");
    // this._fieldTheme.selectpicker('refresh');
  }

  private _getValues(): any {
    let theme = $.extend(true, {}, this._config.theme);

    let lineColor = this._fieldLineBarColor.spectrum("get").toRgbString();
    theme.plot.line.simple.strokeColor = lineColor;
    theme.plot.line.mountain.line.strokeColor = lineColor;
    theme.plot.bar.OHLC.strokeColor = lineColor;
    theme.plot.bar.HLC.strokeColor = lineColor;
    theme.plot.bar.HL.strokeColor = lineColor;

    let upBarColor = this._fieldUpBarColor.spectrum("get").toRgbString();
    theme.plot.bar.candle.upCandle.fill.fillColor = upBarColor;
    theme.plot.bar.coloredOHLC.upBar.strokeColor = upBarColor;
    theme.plot.bar.coloredHLC.upBar.strokeColor = upBarColor;
    theme.plot.bar.coloredHL.upBar.strokeColor = upBarColor;
    theme.plot.bar.candle.upCandle.fill.fillColor = upBarColor;
    theme.plot.bar.hollowCandle.upCandle.fill.fillColor = upBarColor;
    theme.plot.bar.hollowCandle.upHollowCandle.border.strokeColor = upBarColor;
    theme.plot.bar.hollowCandle.upHollowCandle.wick.strokeColor = upBarColor;
    theme.plot.bar.heikinAshi.upCandle.fill.fillColor = upBarColor;
    theme.plot.bar.renko.upCandle.fill.fillColor = upBarColor;
    theme.plot.bar.lineBreak.upCandle.fill.fillColor = upBarColor;
    theme.plot.bar.pointAndFigure.upCandle.border.strokeColor = upBarColor;
    theme.plot.bar.kagi.upCandle.border.strokeColor = upBarColor;

    let downBarColor = this._fieldDownBarColor.spectrum("get").toRgbString();
    theme.plot.bar.candle.downCandle.fill.fillColor = downBarColor;
    theme.plot.bar.coloredOHLC.downBar.strokeColor = downBarColor;
    theme.plot.bar.coloredHLC.downBar.strokeColor = downBarColor;
    theme.plot.bar.coloredHL.downBar.strokeColor = downBarColor;
    theme.plot.bar.candle.downCandle.fill.fillColor = downBarColor;
    theme.plot.bar.hollowCandle.downCandle.fill.fillColor = downBarColor;
    theme.plot.bar.hollowCandle.downHollowCandle.border.strokeColor = downBarColor;
    theme.plot.bar.hollowCandle.downHollowCandle.wick.strokeColor = downBarColor;
    theme.plot.bar.heikinAshi.downCandle.fill.fillColor = downBarColor;
    theme.plot.bar.renko.downCandle.fill.fillColor = downBarColor;
    theme.plot.bar.lineBreak.downCandle.fill.fillColor = downBarColor;
    theme.plot.bar.pointAndFigure.downCandle.border.strokeColor = downBarColor;
    theme.plot.bar.kagi.downCandle.border.strokeColor = downBarColor;

    theme.plot.bar.candle.upCandle.border.strokeColor = this._fieldUpBarBorderColor
      .spectrum("get")
      .toRgbString();
    theme.plot.bar.candle.upCandle.border.strokeEnabled = this._chkUpBarBorderEnabled.isChecked();

    theme.plot.bar.candle.downCandle.border.strokeColor = this._fieldDownBarBorderColor
      .spectrum("get")
      .toRgbString();
    theme.plot.bar.candle.downCandle.border.strokeEnabled = this._chkDownBarBorderEnabled.isChecked();

    let upWickColor = this._fieldUpWickColor.spectrum("get").toRgbString();
    let downWickColor = this._fieldDownWickColor.spectrum("get").toRgbString();
    theme.plot.bar.candle.upCandle.wick.strokeColor = upWickColor;
    theme.plot.bar.candle.downCandle.wick.strokeColor = downWickColor;
    theme.plot.bar.hollowCandle.upCandle.wick.strokeColor = upWickColor;
    theme.plot.bar.hollowCandle.downCandle.wick.strokeColor = downWickColor;
    theme.plot.bar.heikinAshi.upCandle.wick.strokeColor = upWickColor;
    theme.plot.bar.heikinAshi.downCandle.wick.strokeColor = downWickColor;

    let font = this._fieldTextFont.selectpicker("val");
    if (font) {
      theme.chartPanel.title.fontFamily = font;
      theme.valueScale.text.fontFamily = font;
      theme.valueScale.valueMarker.text.fontFamily = font;
      theme.dateScale.text.fontFamily = font;
      theme.dateScale.dateMarker.text.fontFamily = font;
      theme.orderBar.buy.market.pendingSubmit.kind.text.fontFamily = font;
      theme.orderBar.buy.market.pendingCancel.kind.text.fontFamily = font;
      theme.orderBar.buy.market.pendingReplace.kind.text.fontFamily = font;
      theme.orderBar.buy.market.submitted.kind.text.fontFamily = font;
      theme.orderBar.buy.market.accepted.kind.text.fontFamily = font;
      theme.orderBar.buy.market.pendingSubmit.quantity.text.fontFamily = font;
      theme.orderBar.buy.market.pendingCancel.quantity.text.fontFamily = font;
      theme.orderBar.buy.market.pendingReplace.quantity.text.fontFamily = font;
      theme.orderBar.buy.market.submitted.quantity.text.fontFamily = font;
      theme.orderBar.buy.market.accepted.quantity.text.fontFamily = font;
      theme.orderBar.buy.market.pendingSubmit.price.text.fontFamily = font;
      theme.orderBar.buy.market.pendingCancel.price.text.fontFamily = font;
      theme.orderBar.buy.market.pendingReplace.price.text.fontFamily = font;
      theme.orderBar.buy.market.submitted.price.text.fontFamily = font;
      theme.orderBar.buy.market.accepted.price.text.fontFamily = font;

      theme.orderBar.buy.stop.pendingSubmit.kind.text.fontFamily = font;
      theme.orderBar.buy.stop.pendingCancel.kind.text.fontFamily = font;
      theme.orderBar.buy.stop.pendingReplace.kind.text.fontFamily = font;
      theme.orderBar.buy.stop.submitted.kind.text.fontFamily = font;
      theme.orderBar.buy.stop.accepted.kind.text.fontFamily = font;
      theme.orderBar.buy.stop.pendingSubmit.quantity.text.fontFamily = font;
      theme.orderBar.buy.stop.pendingCancel.quantity.text.fontFamily = font;
      theme.orderBar.buy.stop.pendingReplace.quantity.text.fontFamily = font;
      theme.orderBar.buy.stop.submitted.quantity.text.fontFamily = font;
      theme.orderBar.buy.stop.accepted.quantity.text.fontFamily = font;
      theme.orderBar.buy.stop.pendingSubmit.price.text.fontFamily = font;
      theme.orderBar.buy.stop.pendingCancel.price.text.fontFamily = font;
      theme.orderBar.buy.stop.pendingReplace.price.text.fontFamily = font;
      theme.orderBar.buy.stop.submitted.price.text.fontFamily = font;
      theme.orderBar.buy.stop.accepted.price.text.fontFamily = font;

      theme.orderBar.buy.limit.pendingSubmit.kind.text.fontFamily = font;
      theme.orderBar.buy.limit.pendingCancel.kind.text.fontFamily = font;
      theme.orderBar.buy.limit.pendingReplace.kind.text.fontFamily = font;
      theme.orderBar.buy.limit.submitted.kind.text.fontFamily = font;
      theme.orderBar.buy.limit.accepted.kind.text.fontFamily = font;
      theme.orderBar.buy.limit.pendingSubmit.quantity.text.fontFamily = font;
      theme.orderBar.buy.limit.pendingCancel.quantity.text.fontFamily = font;
      theme.orderBar.buy.limit.pendingReplace.quantity.text.fontFamily = font;
      theme.orderBar.buy.limit.submitted.quantity.text.fontFamily = font;
      theme.orderBar.buy.limit.accepted.quantity.text.fontFamily = font;
      theme.orderBar.buy.limit.pendingSubmit.price.text.fontFamily = font;
      theme.orderBar.buy.limit.pendingCancel.price.text.fontFamily = font;
      theme.orderBar.buy.limit.pendingReplace.price.text.fontFamily = font;
      theme.orderBar.buy.limit.submitted.price.text.fontFamily = font;
      theme.orderBar.buy.limit.accepted.price.text.fontFamily = font;

      theme.orderBar.buy.stopLimit.pendingSubmit.kind.text.fontFamily = font;
      theme.orderBar.buy.stopLimit.pendingCancel.kind.text.fontFamily = font;
      theme.orderBar.buy.stopLimit.pendingReplace.kind.text.fontFamily = font;
      theme.orderBar.buy.stopLimit.submitted.kind.text.fontFamily = font;
      theme.orderBar.buy.stopLimit.accepted.kind.text.fontFamily = font;
      theme.orderBar.buy.stopLimit.pendingSubmit.quantity.text.fontFamily = font;
      theme.orderBar.buy.stopLimit.pendingCancel.quantity.text.fontFamily = font;
      theme.orderBar.buy.stopLimit.pendingReplace.quantity.text.fontFamily = font;
      theme.orderBar.buy.stopLimit.submitted.quantity.text.fontFamily = font;
      theme.orderBar.buy.stopLimit.accepted.quantity.text.fontFamily = font;
      theme.orderBar.buy.stopLimit.pendingSubmit.price.text.fontFamily = font;
      theme.orderBar.buy.stopLimit.pendingCancel.price.text.fontFamily = font;
      theme.orderBar.buy.stopLimit.pendingReplace.price.text.fontFamily = font;
      theme.orderBar.buy.stopLimit.submitted.price.text.fontFamily = font;
      theme.orderBar.buy.stopLimit.accepted.price.text.fontFamily = font;

      theme.orderBar.sell.market.pendingSubmit.kind.text.fontFamily = font;
      theme.orderBar.sell.market.pendingCancel.kind.text.fontFamily = font;
      theme.orderBar.sell.market.pendingReplace.kind.text.fontFamily = font;
      theme.orderBar.sell.market.submitted.kind.text.fontFamily = font;
      theme.orderBar.sell.market.accepted.kind.text.fontFamily = font;
      theme.orderBar.sell.market.pendingSubmit.quantity.text.fontFamily = font;
      theme.orderBar.sell.market.pendingCancel.quantity.text.fontFamily = font;
      theme.orderBar.sell.market.pendingReplace.quantity.text.fontFamily = font;
      theme.orderBar.sell.market.submitted.quantity.text.fontFamily = font;
      theme.orderBar.sell.market.accepted.quantity.text.fontFamily = font;
      theme.orderBar.sell.market.pendingSubmit.price.text.fontFamily = font;
      theme.orderBar.sell.market.pendingCancel.price.text.fontFamily = font;
      theme.orderBar.sell.market.pendingReplace.price.text.fontFamily = font;
      theme.orderBar.sell.market.submitted.price.text.fontFamily = font;
      theme.orderBar.sell.market.accepted.price.text.fontFamily = font;

      theme.orderBar.sell.stop.pendingSubmit.kind.text.fontFamily = font;
      theme.orderBar.sell.stop.pendingCancel.kind.text.fontFamily = font;
      theme.orderBar.sell.stop.pendingReplace.kind.text.fontFamily = font;
      theme.orderBar.sell.stop.submitted.kind.text.fontFamily = font;
      theme.orderBar.sell.stop.accepted.kind.text.fontFamily = font;
      theme.orderBar.sell.stop.pendingSubmit.quantity.text.fontFamily = font;
      theme.orderBar.sell.stop.pendingCancel.quantity.text.fontFamily = font;
      theme.orderBar.sell.stop.pendingReplace.quantity.text.fontFamily = font;
      theme.orderBar.sell.stop.submitted.quantity.text.fontFamily = font;
      theme.orderBar.sell.stop.accepted.quantity.text.fontFamily = font;
      theme.orderBar.sell.stop.pendingSubmit.price.text.fontFamily = font;
      theme.orderBar.sell.stop.pendingCancel.price.text.fontFamily = font;
      theme.orderBar.sell.stop.pendingReplace.price.text.fontFamily = font;
      theme.orderBar.sell.stop.submitted.price.text.fontFamily = font;
      theme.orderBar.sell.stop.accepted.price.text.fontFamily = font;

      theme.orderBar.sell.limit.pendingSubmit.kind.text.fontFamily = font;
      theme.orderBar.sell.limit.pendingCancel.kind.text.fontFamily = font;
      theme.orderBar.sell.limit.pendingReplace.kind.text.fontFamily = font;
      theme.orderBar.sell.limit.submitted.kind.text.fontFamily = font;
      theme.orderBar.sell.limit.accepted.kind.text.fontFamily = font;
      theme.orderBar.sell.limit.pendingSubmit.quantity.text.fontFamily = font;
      theme.orderBar.sell.limit.pendingCancel.quantity.text.fontFamily = font;
      theme.orderBar.sell.limit.pendingReplace.quantity.text.fontFamily = font;
      theme.orderBar.sell.limit.submitted.quantity.text.fontFamily = font;
      theme.orderBar.sell.limit.accepted.quantity.text.fontFamily = font;
      theme.orderBar.sell.limit.pendingSubmit.price.text.fontFamily = font;
      theme.orderBar.sell.limit.pendingCancel.price.text.fontFamily = font;
      theme.orderBar.sell.limit.pendingReplace.price.text.fontFamily = font;
      theme.orderBar.sell.limit.submitted.price.text.fontFamily = font;
      theme.orderBar.sell.limit.accepted.price.text.fontFamily = font;

      theme.orderBar.sell.stopLimit.pendingSubmit.kind.text.fontFamily = font;
      theme.orderBar.sell.stopLimit.pendingCancel.kind.text.fontFamily = font;
      theme.orderBar.sell.stopLimit.pendingReplace.kind.text.fontFamily = font;
      theme.orderBar.sell.stopLimit.submitted.kind.text.fontFamily = font;
      theme.orderBar.sell.stopLimit.accepted.kind.text.fontFamily = font;
      theme.orderBar.sell.stopLimit.pendingSubmit.quantity.text.fontFamily = font;
      theme.orderBar.sell.stopLimit.pendingCancel.quantity.text.fontFamily = font;
      theme.orderBar.sell.stopLimit.pendingReplace.quantity.text.fontFamily = font;
      theme.orderBar.sell.stopLimit.submitted.quantity.text.fontFamily = font;
      theme.orderBar.sell.stopLimit.accepted.quantity.text.fontFamily = font;
      theme.orderBar.sell.stopLimit.pendingSubmit.price.text.fontFamily = font;
      theme.orderBar.sell.stopLimit.pendingCancel.price.text.fontFamily = font;
      theme.orderBar.sell.stopLimit.pendingReplace.price.text.fontFamily = font;
      theme.orderBar.sell.stopLimit.submitted.price.text.fontFamily = font;
      theme.orderBar.sell.stopLimit.accepted.price.text.fontFamily = font;

      theme.positionBar.short.kind.text.fontFamily = font;
      theme.positionBar.short.kind.text.fontFamily = font;
      theme.positionBar.short.kind.text.fontFamily = font;
      theme.positionBar.short.kind.text.fontFamily = font;
      theme.positionBar.short.kind.text.fontFamily = font;
      theme.positionBar.short.quantity.text.fontFamily = font;
      theme.positionBar.short.quantity.text.fontFamily = font;
      theme.positionBar.short.quantity.text.fontFamily = font;
      theme.positionBar.short.quantity.text.fontFamily = font;
      theme.positionBar.short.quantity.text.fontFamily = font;
      theme.positionBar.short.price.text.fontFamily = font;
      theme.positionBar.short.price.text.fontFamily = font;
      theme.positionBar.short.price.text.fontFamily = font;
      theme.positionBar.short.price.text.fontFamily = font;
      theme.positionBar.short.price.text.fontFamily = font;

      theme.positionBar.long.kind.text.fontFamily = font;
      theme.positionBar.long.kind.text.fontFamily = font;
      theme.positionBar.long.kind.text.fontFamily = font;
      theme.positionBar.long.kind.text.fontFamily = font;
      theme.positionBar.long.kind.text.fontFamily = font;
      theme.positionBar.long.quantity.text.fontFamily = font;
      theme.positionBar.long.quantity.text.fontFamily = font;
      theme.positionBar.long.quantity.text.fontFamily = font;
      theme.positionBar.long.quantity.text.fontFamily = font;
      theme.positionBar.long.quantity.text.fontFamily = font;
      theme.positionBar.long.price.text.fontFamily = font;
      theme.positionBar.long.price.text.fontFamily = font;
      theme.positionBar.long.price.text.fontFamily = font;
      theme.positionBar.long.price.text.fontFamily = font;
      theme.positionBar.long.price.text.fontFamily = font;
    }

    let fontSize = parseInt(<any>this._fieldTextSize.selectpicker("val"), 10);
    theme.chartPanel.title.fontSize = fontSize;
    theme.valueScale.text.fontSize = fontSize;
    theme.valueScale.valueMarker.text.fontSize = fontSize;
    theme.dateScale.text.fontSize = fontSize;
    theme.dateScale.dateMarker.text.fontSize = fontSize;

    theme.orderBar.buy.market.pendingSubmit.kind.text.fontSize = fontSize;
    theme.orderBar.buy.market.pendingCancel.kind.text.fontSize = fontSize;
    theme.orderBar.buy.market.pendingReplace.kind.text.fontSize = fontSize;
    theme.orderBar.buy.market.submitted.kind.text.fontSize = fontSize;
    theme.orderBar.buy.market.accepted.kind.text.fontSize = fontSize;
    theme.orderBar.buy.market.pendingSubmit.quantity.text.fontSize = fontSize;
    theme.orderBar.buy.market.pendingCancel.quantity.text.fontSize = fontSize;
    theme.orderBar.buy.market.pendingReplace.quantity.text.fontSize = fontSize;
    theme.orderBar.buy.market.submitted.quantity.text.fontSize = fontSize;
    theme.orderBar.buy.market.accepted.quantity.text.fontSize = fontSize;
    theme.orderBar.buy.market.pendingSubmit.price.text.fontSize = fontSize;
    theme.orderBar.buy.market.pendingCancel.price.text.fontSize = fontSize;
    theme.orderBar.buy.market.pendingReplace.price.text.fontSize = fontSize;
    theme.orderBar.buy.market.submitted.price.text.fontSize = fontSize;
    theme.orderBar.buy.market.accepted.price.text.fontSize = fontSize;

    theme.orderBar.buy.stop.pendingSubmit.kind.text.fontSize = fontSize;
    theme.orderBar.buy.stop.pendingCancel.kind.text.fontSize = fontSize;
    theme.orderBar.buy.stop.pendingReplace.kind.text.fontSize = fontSize;
    theme.orderBar.buy.stop.submitted.kind.text.fontSize = fontSize;
    theme.orderBar.buy.stop.accepted.kind.text.fontSize = fontSize;
    theme.orderBar.buy.stop.pendingSubmit.quantity.text.fontSize = fontSize;
    theme.orderBar.buy.stop.pendingCancel.quantity.text.fontSize = fontSize;
    theme.orderBar.buy.stop.pendingReplace.quantity.text.fontSize = fontSize;
    theme.orderBar.buy.stop.submitted.quantity.text.fontSize = fontSize;
    theme.orderBar.buy.stop.accepted.quantity.text.fontSize = fontSize;
    theme.orderBar.buy.stop.pendingSubmit.price.text.fontSize = fontSize;
    theme.orderBar.buy.stop.pendingCancel.price.text.fontSize = fontSize;
    theme.orderBar.buy.stop.pendingReplace.price.text.fontSize = fontSize;
    theme.orderBar.buy.stop.submitted.price.text.fontSize = fontSize;
    theme.orderBar.buy.stop.accepted.price.text.fontSize = fontSize;

    theme.orderBar.buy.limit.pendingSubmit.kind.text.fontSize = fontSize;
    theme.orderBar.buy.limit.pendingCancel.kind.text.fontSize = fontSize;
    theme.orderBar.buy.limit.pendingReplace.kind.text.fontSize = fontSize;
    theme.orderBar.buy.limit.submitted.kind.text.fontSize = fontSize;
    theme.orderBar.buy.limit.accepted.kind.text.fontSize = fontSize;
    theme.orderBar.buy.limit.pendingSubmit.quantity.text.fontSize = fontSize;
    theme.orderBar.buy.limit.pendingCancel.quantity.text.fontSize = fontSize;
    theme.orderBar.buy.limit.pendingReplace.quantity.text.fontSize = fontSize;
    theme.orderBar.buy.limit.submitted.quantity.text.fontSize = fontSize;
    theme.orderBar.buy.limit.accepted.quantity.text.fontSize = fontSize;
    theme.orderBar.buy.limit.pendingSubmit.price.text.fontSize = fontSize;
    theme.orderBar.buy.limit.pendingCancel.price.text.fontSize = fontSize;
    theme.orderBar.buy.limit.pendingReplace.price.text.fontSize = fontSize;
    theme.orderBar.buy.limit.submitted.price.text.fontSize = fontSize;
    theme.orderBar.buy.limit.accepted.price.text.fontSize = fontSize;

    theme.orderBar.buy.stopLimit.pendingSubmit.kind.text.fontSize = fontSize;
    theme.orderBar.buy.stopLimit.pendingCancel.kind.text.fontSize = fontSize;
    theme.orderBar.buy.stopLimit.pendingReplace.kind.text.fontSize = fontSize;
    theme.orderBar.buy.stopLimit.submitted.kind.text.fontSize = fontSize;
    theme.orderBar.buy.stopLimit.accepted.kind.text.fontSize = fontSize;
    theme.orderBar.buy.stopLimit.pendingSubmit.quantity.text.fontSize = fontSize;
    theme.orderBar.buy.stopLimit.pendingCancel.quantity.text.fontSize = fontSize;
    theme.orderBar.buy.stopLimit.pendingReplace.quantity.text.fontSize = fontSize;
    theme.orderBar.buy.stopLimit.submitted.quantity.text.fontSize = fontSize;
    theme.orderBar.buy.stopLimit.accepted.quantity.text.fontSize = fontSize;
    theme.orderBar.buy.stopLimit.pendingSubmit.price.text.fontSize = fontSize;
    theme.orderBar.buy.stopLimit.pendingCancel.price.text.fontSize = fontSize;
    theme.orderBar.buy.stopLimit.pendingReplace.price.text.fontSize = fontSize;
    theme.orderBar.buy.stopLimit.submitted.price.text.fontSize = fontSize;
    theme.orderBar.buy.stopLimit.accepted.price.text.fontSize = fontSize;

    theme.orderBar.sell.market.pendingSubmit.kind.text.fontSize = fontSize;
    theme.orderBar.sell.market.pendingCancel.kind.text.fontSize = fontSize;
    theme.orderBar.sell.market.pendingReplace.kind.text.fontSize = fontSize;
    theme.orderBar.sell.market.submitted.kind.text.fontSize = fontSize;
    theme.orderBar.sell.market.accepted.kind.text.fontSize = fontSize;
    theme.orderBar.sell.market.pendingSubmit.quantity.text.fontSize = fontSize;
    theme.orderBar.sell.market.pendingCancel.quantity.text.fontSize = fontSize;
    theme.orderBar.sell.market.pendingReplace.quantity.text.fontSize = fontSize;
    theme.orderBar.sell.market.submitted.quantity.text.fontSize = fontSize;
    theme.orderBar.sell.market.accepted.quantity.text.fontSize = fontSize;
    theme.orderBar.sell.market.pendingSubmit.price.text.fontSize = fontSize;
    theme.orderBar.sell.market.pendingCancel.price.text.fontSize = fontSize;
    theme.orderBar.sell.market.pendingReplace.price.text.fontSize = fontSize;
    theme.orderBar.sell.market.submitted.price.text.fontSize = fontSize;
    theme.orderBar.sell.market.accepted.price.text.fontSize = fontSize;

    theme.orderBar.sell.stop.pendingSubmit.kind.text.fontSize = fontSize;
    theme.orderBar.sell.stop.pendingCancel.kind.text.fontSize = fontSize;
    theme.orderBar.sell.stop.pendingReplace.kind.text.fontSize = fontSize;
    theme.orderBar.sell.stop.submitted.kind.text.fontSize = fontSize;
    theme.orderBar.sell.stop.accepted.kind.text.fontSize = fontSize;
    theme.orderBar.sell.stop.pendingSubmit.quantity.text.fontSize = fontSize;
    theme.orderBar.sell.stop.pendingCancel.quantity.text.fontSize = fontSize;
    theme.orderBar.sell.stop.pendingReplace.quantity.text.fontSize = fontSize;
    theme.orderBar.sell.stop.submitted.quantity.text.fontSize = fontSize;
    theme.orderBar.sell.stop.accepted.quantity.text.fontSize = fontSize;
    theme.orderBar.sell.stop.pendingSubmit.price.text.fontSize = fontSize;
    theme.orderBar.sell.stop.pendingCancel.price.text.fontSize = fontSize;
    theme.orderBar.sell.stop.pendingReplace.price.text.fontSize = fontSize;
    theme.orderBar.sell.stop.submitted.price.text.fontSize = fontSize;
    theme.orderBar.sell.stop.accepted.price.text.fontSize = fontSize;

    theme.orderBar.sell.limit.pendingSubmit.kind.text.fontSize = fontSize;
    theme.orderBar.sell.limit.pendingCancel.kind.text.fontSize = fontSize;
    theme.orderBar.sell.limit.pendingReplace.kind.text.fontSize = fontSize;
    theme.orderBar.sell.limit.submitted.kind.text.fontSize = fontSize;
    theme.orderBar.sell.limit.accepted.kind.text.fontSize = fontSize;
    theme.orderBar.sell.limit.pendingSubmit.quantity.text.fontSize = fontSize;
    theme.orderBar.sell.limit.pendingCancel.quantity.text.fontSize = fontSize;
    theme.orderBar.sell.limit.pendingReplace.quantity.text.fontSize = fontSize;
    theme.orderBar.sell.limit.submitted.quantity.text.fontSize = fontSize;
    theme.orderBar.sell.limit.accepted.quantity.text.fontSize = fontSize;
    theme.orderBar.sell.limit.pendingSubmit.price.text.fontSize = fontSize;
    theme.orderBar.sell.limit.pendingCancel.price.text.fontSize = fontSize;
    theme.orderBar.sell.limit.pendingReplace.price.text.fontSize = fontSize;
    theme.orderBar.sell.limit.submitted.price.text.fontSize = fontSize;
    theme.orderBar.sell.limit.accepted.price.text.fontSize = fontSize;

    theme.orderBar.sell.stopLimit.pendingSubmit.kind.text.fontSize = fontSize;
    theme.orderBar.sell.stopLimit.pendingCancel.kind.text.fontSize = fontSize;
    theme.orderBar.sell.stopLimit.pendingReplace.kind.text.fontSize = fontSize;
    theme.orderBar.sell.stopLimit.submitted.kind.text.fontSize = fontSize;
    theme.orderBar.sell.stopLimit.accepted.kind.text.fontSize = fontSize;
    theme.orderBar.sell.stopLimit.pendingSubmit.quantity.text.fontSize = fontSize;
    theme.orderBar.sell.stopLimit.pendingCancel.quantity.text.fontSize = fontSize;
    theme.orderBar.sell.stopLimit.pendingReplace.quantity.text.fontSize = fontSize;
    theme.orderBar.sell.stopLimit.submitted.quantity.text.fontSize = fontSize;
    theme.orderBar.sell.stopLimit.accepted.quantity.text.fontSize = fontSize;
    theme.orderBar.sell.stopLimit.pendingSubmit.price.text.fontSize = fontSize;
    theme.orderBar.sell.stopLimit.pendingCancel.price.text.fontSize = fontSize;
    theme.orderBar.sell.stopLimit.pendingReplace.price.text.fontSize = fontSize;
    theme.orderBar.sell.stopLimit.submitted.price.text.fontSize = fontSize;
    theme.orderBar.sell.stopLimit.accepted.price.text.fontSize = fontSize;

    theme.positionBar.short.kind.text.fontSize = fontSize;
    theme.positionBar.short.kind.text.fontSize = fontSize;
    theme.positionBar.short.kind.text.fontSize = fontSize;
    theme.positionBar.short.kind.text.fontSize = fontSize;
    theme.positionBar.short.kind.text.fontSize = fontSize;
    theme.positionBar.short.quantity.text.fontSize = fontSize;
    theme.positionBar.short.quantity.text.fontSize = fontSize;
    theme.positionBar.short.quantity.text.fontSize = fontSize;
    theme.positionBar.short.quantity.text.fontSize = fontSize;
    theme.positionBar.short.quantity.text.fontSize = fontSize;
    theme.positionBar.short.price.text.fontSize = fontSize;
    theme.positionBar.short.price.text.fontSize = fontSize;
    theme.positionBar.short.price.text.fontSize = fontSize;
    theme.positionBar.short.price.text.fontSize = fontSize;
    theme.positionBar.short.price.text.fontSize = fontSize;

    theme.positionBar.long.kind.text.fontSize = fontSize;
    theme.positionBar.long.kind.text.fontSize = fontSize;
    theme.positionBar.long.kind.text.fontSize = fontSize;
    theme.positionBar.long.kind.text.fontSize = fontSize;
    theme.positionBar.long.kind.text.fontSize = fontSize;
    theme.positionBar.long.quantity.text.fontSize = fontSize;
    theme.positionBar.long.quantity.text.fontSize = fontSize;
    theme.positionBar.long.quantity.text.fontSize = fontSize;
    theme.positionBar.long.quantity.text.fontSize = fontSize;
    theme.positionBar.long.quantity.text.fontSize = fontSize;
    theme.positionBar.long.price.text.fontSize = fontSize;
    theme.positionBar.long.price.text.fontSize = fontSize;
    theme.positionBar.long.price.text.fontSize = fontSize;
    theme.positionBar.long.price.text.fontSize = fontSize;
    theme.positionBar.long.price.text.fontSize = fontSize;

    let fontColor = this._fieldTextColor.spectrum("get").toHexString();
    theme.chartPanel.title.fillColor = fontColor;
    theme.valueScale.text.fillColor = fontColor;
    theme.valueScale.valueMarker.text.fillColor = fontColor;
    theme.dateScale.text.fillColor = fontColor;
    theme.dateScale.dateMarker.text.fillColor = fontColor;
    theme.chart.background = [
      this._fieldGradient1Color.spectrum("get").toRgbString(),
      this._fieldGradient2Color.spectrum("get").toRgbString()
    ];
    theme.valueScale.fill.fillColor = this._fieldValueScalePanelColor
      .spectrum("get")
      .toRgbString();
    theme.dateScale.fill.fillColor = this._fieldDateScalePanelColor
      .spectrum("get")
      .toRgbString();
    let gridColor = this._fieldGridColor.spectrum("get").toHexString();
    theme.chartPanel.grid.strokeColor = gridColor;
    theme.dateScale.line.strokeColor = gridColor;

    return theme;
  }

  private _apply(values?: any): void {
    if (!JsUtil.isFunction(this._config.done)) return;

    if (values == null) values = this._getValues();

    this._config.done(values);
  }

  private _highlightNewThemeNameInvalid(flag: boolean) {
    if (flag) {
      this._fieldNewThemeName.addClass(ThemeDialog.CLASS_INVALID_VALUE);
      this._btnNewThemeConfirm.addClass(ThemeDialog.CLASS_INVALID_VALUE);
    } else {
      this._fieldNewThemeName.removeClass(ThemeDialog.CLASS_INVALID_VALUE);
      this._btnNewThemeConfirm.removeClass(ThemeDialog.CLASS_INVALID_VALUE);
    }
  }

  private _initFields(): void {
    this._dialogBody = this._dialog.find(".scxThemeDialog-body");
    this._dialogTitle = this._dialog.find(DIALOG_ID.DIALOG + "headerTitle");
    this._btnApply = this._dialog.find(DIALOG_ID.BUTTON + "save");
    this._fieldLineBarColor = this._dialog.find(
      DIALOG_ID.FIELD + "lineBarColor"
    );
    this._fieldUpBarColor = this._dialog.find(DIALOG_ID.FIELD + "upBarColor");
    this._fieldDownBarColor = this._dialog.find(
      DIALOG_ID.FIELD + "downBarColor"
    );
    this._labelUpBarBorderColor = this._dialog.find(
      DIALOG_ID.LABEL + "upBarBorderColor"
    );
    this._fieldUpBarBorderColor = this._dialog.find(
      DIALOG_ID.FIELD + "upBarBorderColor"
    );
    this._fieldUpBarBorderEnabled = this._dialog.find(
      DIALOG_ID.CHECK + "upBarBorderColor"
    );
    this._labelDownBarBorderColor = this._dialog.find(
      DIALOG_ID.LABEL + "downBarBorderColor"
    );
    this._fieldDownBarBorderColor = this._dialog.find(
      DIALOG_ID.FIELD + "downBarBorderColor"
    );
    this._fieldDownBarBorderEnabled = this._dialog.find(
      DIALOG_ID.CHECK + "downBarBorderColor"
    );
    this._fieldUpWickColor = this._dialog.find(DIALOG_ID.FIELD + "upWickColor");
    this._fieldDownWickColor = this._dialog.find(
      DIALOG_ID.FIELD + "downWickColor"
    );
    this._fieldTextFont = this._dialog.find(DIALOG_ID.FIELD + "textFont");
    this._fieldTextSize = this._dialog.find(DIALOG_ID.FIELD + "textSize");
    this._fieldTextColor = this._dialog.find(DIALOG_ID.FIELD + "textColor");
    this._fieldGradient1Color = this._dialog.find(
      DIALOG_ID.FIELD + "gradient1Color"
    );
    this._fieldGradient2Color = this._dialog.find(
      DIALOG_ID.FIELD + "gradient2Color"
    );
    this._fieldGridColor = this._dialog.find(DIALOG_ID.FIELD + "gridColor");
    this._fieldTheme = this._dialog.find(DIALOG_ID.FIELD + "theme");
    this._wrapperTheme = this._dialog.find("#scxThemeDialog_newThemeWrapper");
    this._btnNewTheme = this._dialog.find(DIALOG_ID.BUTTON + "newTheme");
    this._btnNewThemeConfirm = this._dialog.find(
      DIALOG_ID.BUTTON + "newThemeConfirm"
    );
    this._fieldValueScalePanelColor = this._dialog.find(
      `${DIALOG_ID.FIELD}valueScalePanelColor`
    );
    this._fieldDateScalePanelColor = this._dialog.find(
      `${DIALOG_ID.FIELD}dateScalePanelColor`
    );

    this._fieldNewThemeName = this._dialog.find(
      DIALOG_ID.FIELD + "newThemeName"
    );
    this._btnSaveTheme = this._dialog.find(DIALOG_ID.BUTTON + "saveTheme");
  }
}
