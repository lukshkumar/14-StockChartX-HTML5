import { JQueryEventObject } from "../external/typescript/jquery";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { JsUtil } from "../StockChartX/index";
import { LineStyle } from "../StockChartX/index";
import Switchery from "../StockChartX.External/switchery";
import { FillPropertiesHandler } from "./index";
import { Tooltip, TooltipContentKind } from "./index";
import {
  ILinePropertiesHandlerConfig,
  LinePropertiesHandler
} from "./index";

"use strict";
const $ = window.jQuery;
const FRAGMENT_ID = {
  REGION: "#scxTooltipView_region_",
  INPUT: "#scxTooltipView_input_",
  LABEL: "#scxTooltipView_label_",
  CHECK: "#scxTooltipView_chk_",
  IMAGE: "#scxTooltipView_image_"
};

const CLASS_SPECTRUM = "scxTooltipView";

export class TooltipView {
  private tooltipView: JQuery;

  set container(container: JQuery) {
    container.append(this.tooltipView);
  }

  private _regionImage: JQuery;
  private _regionText: JQuery;
  private _regionTextStyle: JQuery;

  private _labelBorder: JQuery;
  private _inputBorderColor: JQuery;
  private _inputBorderWidth: JQuery;
  private _inputBorderStyle: JQuery;
  private _switchBorderEnabled: Switchery;
  private _switchBorderEnabledJQuery: JQuery;

  private _labelFillColor: JQuery;
  private _inputFillColor: JQuery;
  private _switchFillEnabled: Switchery;
  private _switchFillEnabledJQuery: JQuery;

  private _inputsKind: JQuery;
  private _kindChooser: TooltipKindChooser;

  private _inputText: JQuery;
  private _inputTextColor: JQuery;
  private _inputTextFont: JQuery;
  private _inputTextSize: JQuery;
  private _inputsTextStyles: JQuery;
  private _styleChooser: TextStyleChooser;

  private _inputImageUrl: JQuery;
  private _inputImagePreview: JQuery;

  private _fillPropertiesHandlerTooltip: FillPropertiesHandler;

  private _tooltip: Tooltip;

  private static _numericFieldConfig = {
    showArrows: false,
    maxValue: 10,
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

  constructor(tooltipView: JQuery) {
    this.tooltipView = tooltipView;
    this._initFields();
    this._init();
  }

  private _setBorderState(isEnabled: boolean): void {
    this._switchBorderEnabled.setPosition(isEnabled);
    if (isEnabled) {
      this._labelBorder.removeClass("disabled");
      this._inputBorderColor.spectrum("enable");
      this._inputBorderStyle.removeAttr("disabled").selectpicker("refresh");
      this._inputBorderWidth.scxNumericField("enable");
      if (!this._switchBorderEnabled.isChecked())
        this._switchBorderEnabled.setPosition(true);
    } else {
      this._labelBorder.addClass("disabled");
      this._inputBorderColor.spectrum("disable");
      this._inputBorderStyle
        .attr("disabled", "disabled")
        .selectpicker("refresh");
      this._inputBorderWidth.scxNumericField("disable");
      if (this._switchBorderEnabled.isChecked())
        this._switchBorderEnabled.setPosition(true);
    }
  }

  public setValues(tooltip: Tooltip, replaceTooltip: boolean = true): void {
    if (replaceTooltip) this._tooltip = tooltip;

    let tooltipTheme = tooltip.theme || tooltip.actualTheme;

    this._setBorderState(tooltipTheme.border.enabled);
    this._inputBorderColor.spectrum(
      "set",
      tooltipTheme.border.strokeColor || tooltipTheme.border.color
    );

    this._inputBorderStyle
      .selectpicker("val", tooltipTheme.border.lineStyle || LineStyle.SOLID)
      .selectpicker("refresh");

    this._inputBorderWidth.scxNumericField(
      "setValue",
      tooltipTheme.border.width
    );

    this._fillPropertiesHandlerTooltip.theme = {
      fillColor: tooltipTheme.fill.color
    };
    this._fillPropertiesHandlerTooltip.setState(tooltipTheme.fill.enabled);

    this._kindChooser.setKind(tooltip.contentKind);

    if (tooltip.contentKind === TooltipContentKind.IMAGE) {
      this._inputText.val("");
      this._inputImageUrl.val(tooltip.text);
      this._inputImagePreview.attr("src", tooltip.text);
      if (!tooltip.text) this._resetImagePreview(this._inputImagePreview);
    } else {
      this._inputText.val(tooltip.text);
      this._inputImageUrl.val("");
      this._resetImagePreview(this._inputImagePreview);
    }

    this._inputTextColor.spectrum("set", tooltipTheme.text.fillColor);
    this._inputTextFont
      .selectpicker("val", tooltipTheme.text.fontFamily)
      .selectpicker("refresh");
    this._inputTextSize
      .selectpicker("val", tooltipTheme.text.fontSize)
      .selectpicker("refresh");
    this._styleChooser.setStyle("b", tooltipTheme.text.fontWeight === "bold");
    this._styleChooser.setStyle("i", tooltipTheme.text.fontStyle === "italic");
    this._styleChooser.setStyle(
      "u",
      tooltipTheme.text.decoration === "underline"
    );
  }

  private _init(): void {
    this._switchBorderEnabled = new Switchery(
      document.querySelector(`${FRAGMENT_ID.CHECK}borderColor`),
      TooltipView._switcherySettings
    );
    this._switchBorderEnabled.setPosition(true);

    this._inputTextSize.selectpicker({ container: "body" });
    this._inputBorderStyle.selectpicker({ container: "body" });
    this._inputBorderWidth.scxNumericField(TooltipView._numericFieldConfig);

    this._switchFillEnabled = new Switchery(
      document.querySelector(`${FRAGMENT_ID.CHECK}fillColor`),
      TooltipView._switcherySettings
    );
    this._switchFillEnabled.setPosition(true);

    this._fillPropertiesHandlerTooltip = new FillPropertiesHandler({
      label: this._labelFillColor,
      colorPicker: this._inputFillColor,
      switcher: this._switchFillEnabled
    });

    this._kindChooser = new TooltipKindChooser({
      buttons: this._inputsKind,
      panelText: this._regionText,
      panelTextStyle: this._regionTextStyle,
      panelImage: this._regionImage
    });

    this._styleChooser = new TextStyleChooser(this._inputsTextStyles);
    this._initImagePreview(this._inputImageUrl, this._inputImagePreview);

    this._inputTextFont
      .selectpicker({ container: "body" })
      .change((e: JQueryEventObject) => {
        this._inputTextFont
          .next()
          .css({ "font-family": (<HTMLInputElement>e.target).value });
      });

    this.tooltipView
      .find(".scxSpectrum")
      .scx()
      .colorPicker({
        containerClassName: CLASS_SPECTRUM,
        localStorageKey: "scxThemeDialog_spectrum",
        showAlpha: true
      });

    $("body").on("scxSwitcherChanged", (e: JQueryEventObject, evtData: any) => {
      let target = $(evtData.target),
        isEnabled = evtData.checked;

      if (target.is(this._switchBorderEnabledJQuery))
        this._setBorderState(isEnabled);

      if (target.is(this._switchFillEnabledJQuery))
        this._fillPropertiesHandlerTooltip.setState(isEnabled);
    });
  }

  private _initImagePreview(inputImageURL: JQuery, imagePreview: JQuery): void {
    let _imagePreviewTimer = null,
      _imagePreviewDelay = 1000;

    inputImageURL.on("keyup", () => {
      let url = inputImageURL.val();
      imagePreview.parent().addClass("scxLoading");
      imagePreview.hide();
      if (_imagePreviewTimer) {
        clearTimeout(_imagePreviewTimer);
      }
      _imagePreviewTimer = setTimeout(() => {
        imagePreview.attr("src", url);
      }, _imagePreviewDelay);
    });

    imagePreview.on("load", (e: JQueryEventObject) => {
      $(e.currentTarget).show();
      $(e.currentTarget)
        .parent()
        .removeClass("scxHasBg");
      $(e.currentTarget)
        .parent()
        .removeClass("scxLoading");
    });
    imagePreview.on("error", (e: JQueryEventObject) => {
      $(e.currentTarget)
        .parent()
        .addClass("scxHasBg");
      $(e.currentTarget)
        .parent()
        .removeClass("scxLoading");
      $(e.currentTarget).hide();
    });
  }

  private _resetImagePreview(imagePreview: JQuery): void {
    imagePreview
      .attr("src", "")
      .hide()
      .parent()
      .addClass("scxHasBg")
      .removeClass("scxLoading");
  }

  public resetToDefaults(): void {
    let tooltip = JsUtil.clone(this._tooltip);
    tooltip.contentKind = Tooltip.defaults.kind;
    tooltip.text = Tooltip.defaults.text;
    tooltip.theme = tooltip.defaultTheme;

    this.setValues(tooltip, false);
  }

  public apply(): void {
    let tooltip = this._tooltip,
      tooltipTheme = $.extend(true, {}, tooltip.actualTheme),
      linePropertiesConfig: ILinePropertiesHandlerConfig,
      linePropertiesHandler: LinePropertiesHandler;

    linePropertiesConfig = {
      colorPicker: this._inputBorderColor,
      widthInput: this._inputBorderWidth,
      lineStyleDropdown: this._inputBorderStyle
    };
    linePropertiesHandler = new LinePropertiesHandler(linePropertiesConfig);

    tooltipTheme.border = linePropertiesHandler.theme;
    tooltipTheme.border.enabled = this._switchBorderEnabled.isChecked();
    tooltipTheme.fill.enabled = this._fillPropertiesHandlerTooltip.isEnabled;
    tooltipTheme.fill.color = this._fillPropertiesHandlerTooltip.theme.fillColor;
    tooltip.contentKind = this._kindChooser.getKind();

    switch (tooltip.contentKind) {
      case TooltipContentKind.IMAGE:
        tooltip.text = JsUtil.filterText(this._inputImageUrl.val());
        break;
      case TooltipContentKind.TEXT:
        tooltip.text = this._inputText.val().trim();
        break;
      case TooltipContentKind.HTML:
        tooltip.text = this._inputText.val().trim();
        break;
      default:
        break;
    }

    tooltipTheme.text.fillColor = this._inputTextColor
      .spectrum("get")
      .toRgbString();
    tooltipTheme.text.fontFamily = this._inputTextFont.selectpicker("val");
    tooltipTheme.text.fontSize = this._inputTextSize.selectpicker("val");
    tooltipTheme.text.fontWeight = this._styleChooser.getStyle("b")
      ? "bold"
      : "normal";
    tooltipTheme.text.fontStyle = this._styleChooser.getStyle("i")
      ? "italic"
      : "normal";
    tooltipTheme.text.decoration = this._styleChooser.getStyle("u")
      ? "underline"
      : "";

    tooltip.theme = tooltipTheme;
  }

  private _initFields(): void {
    this._regionImage = this.tooltipView.find(`${FRAGMENT_ID.REGION}image`);
    this._regionText = this.tooltipView.find(`${FRAGMENT_ID.REGION}text`);
    this._regionTextStyle = this.tooltipView.find(
      `${FRAGMENT_ID.REGION}textStyle`
    );
    this._labelBorder = this.tooltipView.find(`${FRAGMENT_ID.LABEL}border`);
    this._inputBorderColor = this.tooltipView.find(
      `${FRAGMENT_ID.INPUT}borderColor`
    );
    this._inputBorderWidth = this.tooltipView.find(
      `${FRAGMENT_ID.INPUT}borderWidth`
    );
    this._inputBorderStyle = this.tooltipView.find(
      `${FRAGMENT_ID.INPUT}borderStyle`
    );
    this._switchBorderEnabledJQuery = this.tooltipView.find(
      `${FRAGMENT_ID.CHECK}borderColor`
    );
    this._labelFillColor = this.tooltipView.find(
      `${FRAGMENT_ID.LABEL}fillColor`
    );
    this._inputFillColor = this.tooltipView.find(
      `${FRAGMENT_ID.INPUT}fillColor`
    );
    this._switchFillEnabledJQuery = this.tooltipView.find(
      `${FRAGMENT_ID.CHECK}fillColor`
    );
    this._inputsKind = this.tooltipView
      .find(".scxTooltipView_tooltipKind")
      .children();
    this._inputText = this.tooltipView.find(`${FRAGMENT_ID.INPUT}tooltipText`);
    this._inputTextColor = this.tooltipView.find(
      `${FRAGMENT_ID.INPUT}textColor`
    );
    this._inputTextFont = this.tooltipView.find(`${FRAGMENT_ID.INPUT}textFont`);
    this._inputTextSize = this.tooltipView.find(`${FRAGMENT_ID.INPUT}textSize`);
    this._inputsTextStyles = this.tooltipView.find(
      `${FRAGMENT_ID.INPUT}tooltipTextStyles`
    );
    this._inputImageUrl = this.tooltipView.find(`${FRAGMENT_ID.INPUT}imageURL`);
    this._inputImagePreview = this.tooltipView.find(
      `${FRAGMENT_ID.IMAGE}preview`
    );
  }
}

export class TextStyleChooser {
  private _selector: JQuery;
  private _labels;
  private _checkboxes;

  constructor(selector: JQuery) {
    this._selector = selector;
    this._init();
  }

  public getStyle(val: string): boolean {
    switch (val.toLowerCase()) {
      case "b":
        return this._checkboxes.eq(0).prop("checked");
      case "i":
        return this._checkboxes.eq(1).prop("checked");
      case "u":
        return this._checkboxes.eq(2).prop("checked");
      default:
        return false;
    }
  }

  public setStyle(val: string, state: boolean): void {
    switch (val.toLowerCase()) {
      case "b":
        state
          ? this._labels.eq(0).addClass("active")
          : this._labels.eq(0).removeClass("active");
        this._checkboxes.eq(0).prop("checked", state);
        break;
      case "i":
        state
          ? this._labels.eq(1).addClass("active")
          : this._labels.eq(1).removeClass("active");
        this._checkboxes.eq(1).prop("checked", state);
        break;
      case "u":
        state
          ? this._labels.eq(2).addClass("active")
          : this._labels.eq(2).removeClass("active");
        this._checkboxes.eq(2).prop("checked", state);
        break;
      default:
        break;
    }
  }

  private _init(): void {
    this._labels = this._selector.find(">label");
    this._checkboxes = this._selector.find("input[type=checkbox]");
    this._labels
      .click((e: JQueryEventObject) => {
        let checkbox = $(e.currentTarget).find("input[type=checkbox]");
        checkbox.prop("checked", !checkbox.prop("checked"));
        checkbox.prop("checked")
          ? $(e.currentTarget).addClass("active")
          : $(e.currentTarget).removeClass("active");
      })
      .each((e: JQueryEventObject) => {
        $(e.currentTarget)
          .find("input[type=checkbox]")
          .prop("checked")
          ? $(e.currentTarget).addClass("active")
          : $(e.currentTarget).removeClass("active");
      });
  }
}

interface ITooltipKindChooserConfig {
  onChange?: any;
  buttons: JQuery;
  panelText: JQuery;
  panelTextStyle: JQuery;
  panelImage: JQuery;
}

class TooltipKindChooser {
  private DATA_KIND = "data-kind";

  private _kind: string;
  private _config: ITooltipKindChooserConfig;

  constructor(config: any) {
    this._config = config;

    this.setKind(TooltipContentKind.TEXT);
    this._config.buttons.on("click", this, this._onButtonClicked);
  }

  destroy(): void {
    this._config.buttons.off("click", this._onButtonClicked);
  }

  getKind(): string {
    return this._kind;
  }

  setKind(newKind: string, fire?: boolean): boolean {
    if (newKind === this._kind) return false;

    switch (newKind) {
      case TooltipContentKind.TEXT:
        this._config.panelImage.hide();
        this._config.panelTextStyle.show();
        this._config.panelText.show();
        break;
      case TooltipContentKind.HTML:
        this._config.panelImage.hide();
        this._config.panelTextStyle.hide();
        this._config.panelText.show();
        break;
      case TooltipContentKind.IMAGE:
        this._config.panelText.hide();
        this._config.panelImage.show();
        break;
      default:
        return false;
    }

    this._highlightButton(newKind);
    this._kind = newKind;
    if (fire && this._config.onChange) this._config.onChange(newKind);

    return true;
  }

  private _highlightButton(kind: string): void {
    this._config.buttons.removeClass("active");
    this._config.buttons
      .filter(`[${this.DATA_KIND}="${kind}"]`)
      .addClass("active");
  }

  private _onButtonClicked(event: JQueryEventObject) {
    let self = event.data;
    self.setKind($(event.target).data().kind, true);
  }
}
