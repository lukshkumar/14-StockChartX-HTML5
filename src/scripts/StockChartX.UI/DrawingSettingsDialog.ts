/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { Dialog } from "./index";
import { JQueryEventObject } from "../external/typescript/jquery";
import Switchery from "../StockChartX.External/switchery";
import { Chart } from "../StockChartX/index";
import { IDialogConfig } from "./index";
import {
  MagnetMode,
  MagnetPoint,
  DrawingClassNames,
  DrawingDefaults
} from "../StockChartX/Drawings/utils";
import { Environment } from "../StockChartX/index";
import { FillPropertiesHandler } from "./index";
import { Tabs } from "./index";
import { TextStyleChooser, TooltipView } from "./index";
import { CoordinatePanel } from "./index";
import { JsUtil } from "../StockChartX/index";
import { LineStyle } from "../StockChartX/index";
import {
  ILinePropertiesHandlerConfig,
  LinePropertiesHandler
} from "./index";
import { Localization } from "../StockChartX/index";
import { Notification } from "./index";
import { Tooltip } from "./index";
import { ViewLoader } from "./index";
import { ImageDrawing, Drawing } from "../StockChartX/index";
import { NoteDrawing, TextDrawing, BalloonDrawing } from "../StockChartX/index";
const $ = window.jQuery;
"use strict";

export interface IDrawingSettingsDialogConfig extends IDialogConfig {
  chart: Chart;
  drawing: Drawing;
  cancel?(): void;
  always?(): void;
}

enum Tab {
  DRAWING,
  TOOLTIP,
  POINTS
}

const DRAWING_DIALOG_ID = {
  DIALOG: "#scxDrawingDialog_",
  INPUT: "#scxDrawingDialog_input_",
  LABEL: "#scxDrawingDialog_label_",
  CHECK: "#scxDrawingDialog_chk_",
  FIGURE: "#scxDrawingDialog_panel_figure_",
  PANEL: "#scxDrawingDialog_panel_",
  TAB: "#scxDrawingDialog_tab_"
};

const CLASS_SPECTRUM = "scxSpectrumDrawingDialog";

export class DrawingSettingsDialog extends Dialog {
  private _title: JQuery;

  private _tabItemsContainer: JQuery;
  private _tabPanelsContainer: JQuery;
  private _tabs: Tabs;
  private _tab_tooltip: JQuery;

  private _panelFigure: JQuery;
  private _panelFigureLine: JQuery;
  private _panelFigureHorizontalLine: JQuery;
  private _panelFigureArc: JQuery;
  private _panelFigureLineEnabled: JQuery;
  private _panelFigureFill: JQuery;
  private _panelFigureFillEnabled: JQuery;
  private _panelFigureFill2: JQuery;
  private _panelFigureFill2Enabled: JQuery;
  private _panelFigureLabel: JQuery;

  private _panelPoints: JQuery;

  private _panelText: JQuery;
  private _panelImage: JQuery;

  private _input_lineColor: JQuery;
  private _input_lineWidth: JQuery;
  private _input_lineStyle: JQuery;
  private _input_fillColor: JQuery;
  private _input_fillColor2: JQuery;
  private _input_labelText: JQuery;
  private _input_labelColor: JQuery;
  private _input_labelFont: JQuery;
  private _input_labelSize: JQuery;
  private _input_horizontalLineColor: JQuery;
  private _input_horizontalLineWidth: JQuery;
  private _input_horizontalLineStyle: JQuery;
  private _input_arcColor: JQuery;
  private _input_arcWidth: JQuery;
  private _input_arcStyle: JQuery;

  private _input_text: JQuery;
  private _input_textColor: JQuery;
  private _input_textFont: JQuery;
  private _input_textSize: JQuery;
  private _inputs_textStyles: JQuery;
  private _textStylesChooser: TextStyleChooser;
  private _input_textBackColor: JQuery;
  private _input_textBorderColor: JQuery;

  private _input_imageUrl: JQuery;
  private _input_imagePreview: JQuery;

  private _input_magnetTo: JQuery;
  private _input_magnetMode: JQuery;

  private _chk_lineEnabled: Switchery;
  private _chk_lineEnabledHTMLObj: JQuery;
  private _chk_fillEnabled: Switchery;
  private _chk_fillEnabledHTMLObj: JQuery;
  private _chk_fill2Enabled: Switchery;
  private _chk_fill2EnabledHTMLObj: JQuery;
  private _chk_textBackgroundEnabledHTMLObj: JQuery;
  private _chk_textBorderEnabledHTMLObj: JQuery;
  // private _chk_textBackgroundEnabled: JQuery;
  // private _chk_textBorderEnabled: JQuery;

  private _label_lineEnabled: JQuery;
  private _label_fillEnabled: JQuery;
  private _label_fill2Enabled: JQuery;
  private _label_textBackgroundEnabled: JQuery;
  private _label_textBorderEnabled: JQuery;
  // private _label_magnetToLabel: JQuery;

  protected _config: IDrawingSettingsDialogConfig;
  private _isApplyClicked: boolean = false;

  private _fillPropertiesHandler: FillPropertiesHandler;
  private _fillPropertiesHandler2: FillPropertiesHandler;

  private _tooltipView: TooltipView;

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

  private _coordinatePanel: CoordinatePanel;

  constructor(container: JQuery) {
    super(container);

    this._initFields();
    this._init();
  }

  public show(config: IDrawingSettingsDialogConfig): void {
    if (!this.initDialog(config)) return;

    this._isApplyClicked = false;

    this._setDialogTitle();
    this._switchView();
    this._tabs.activate(0);
    this._setValues(this._config.drawing);

    super.show(config);

    if (Environment.isPhone || Environment.isMobile) event.preventDefault();
  }

  public hide(): void {
    if (!this._isApplyClicked && this._config.cancel) this._config.cancel();

    if (this._config.always) this._config.always();

    super.hide();
  }

  private _init(): void {
    // dialog tabs
    this._tabs = new Tabs({
      tabsContainer: this._tabItemsContainer,
      panelsContainer: this._tabPanelsContainer,
      onChange: (index: number) => {
        this.resize();
      }
    });

    // common controls
    this._input_lineWidth.scxNumericField(
      DrawingSettingsDialog._numericFieldConfig
    );
    this._input_horizontalLineWidth.scxNumericField(
      DrawingSettingsDialog._numericFieldConfig
    );
    this._input_arcWidth.scxNumericField(
      DrawingSettingsDialog._numericFieldConfig
    );

    this._chk_lineEnabled = new Switchery(
      document.querySelector(`${DRAWING_DIALOG_ID.CHECK}lineColor`),
      DrawingSettingsDialog._switcherySettings
    );
    this._chk_lineEnabled.setPosition(true);

    this._chk_fillEnabled = new Switchery(
      document.querySelector(`${DRAWING_DIALOG_ID.CHECK}fillColor`),
      DrawingSettingsDialog._switcherySettings
    );
    this._chk_fillEnabled.setPosition(true);

    this._chk_fill2Enabled = new Switchery(
      document.querySelector(`${DRAWING_DIALOG_ID.CHECK}fillColor2`),
      DrawingSettingsDialog._switcherySettings
    );
    this._chk_fill2Enabled.setPosition(true);

    this._fillPropertiesHandler = new FillPropertiesHandler({
      label: this._label_fillEnabled,
      colorPicker: this._input_fillColor,
      switcher: this._chk_fillEnabled
    });

    this._fillPropertiesHandler2 = new FillPropertiesHandler({
      label: this._label_fill2Enabled,
      colorPicker: this._input_fillColor2,
      switcher: this._chk_fill2Enabled
    });

    this._input_labelFont
      .selectpicker({ container: "body" })
      .change((e: JQueryEventObject) => {
        this._input_labelFont
          .next()
          .css({ "font-family": (<HTMLInputElement>e.target).value });
      });

    this._input_labelSize.selectpicker({ container: "body" });

    this._input_lineStyle.selectpicker({ container: "body" });
    this._input_horizontalLineStyle.selectpicker({ container: "body" });
    this._input_arcStyle.selectpicker({ container: "body" });

    // text panel
    this._input_textFont
      .selectpicker({ container: "body" })
      .change((e: JQueryEventObject) => {
        this._input_textFont
          .next()
          .css({ "font-family": (<HTMLInputElement>e.target).value });
      });

    this._input_textSize.selectpicker({ container: "body" });

    this._textStylesChooser = new TextStyleChooser(this._inputs_textStyles);

    // image panel
    this._initImagePreview(this._input_imageUrl, this._input_imagePreview);

    // magnet mode
    this._input_magnetTo.selectpicker({ container: "body" });
    this._input_magnetMode.selectpicker({ container: "body" });

    // all color pickers
    this._dialog
      .find(".scxSpectrum")
      .scx()
      .colorPicker({
        containerClassName: CLASS_SPECTRUM,
        localStorageKey: "scxThemeDialog_spectrum",
        showAlpha: true
      });

    // all ios-like checkboxes
    $("body").on("scxSwitcherChanged", (e: JQueryEventObject, evtData: any) => {
      let target = $(evtData.target),
        isEnabled = evtData.checked;

      if (target.is(this._chk_lineEnabledHTMLObj))
        this._setLineState(isEnabled);
      else if (target.is(this._chk_fillEnabledHTMLObj))
        this._fillPropertiesHandler.setState(isEnabled);
      else if (target.is(this._chk_fill2EnabledHTMLObj))
        this._fillPropertiesHandler2.setState(isEnabled);
      else if (target.is(this._chk_textBackgroundEnabledHTMLObj))
        this._setTextBackgroundState(isEnabled);
      else if (target.is(this._chk_textBorderEnabledHTMLObj))
        this._setTextBorderState(isEnabled);
    });

    this._dialog
      .find(`${DRAWING_DIALOG_ID.DIALOG}btn_resetToDefaults`)
      .on("click", () => {
        this.resetToDefaults();
      });

    this._dialog.find(`${DRAWING_DIALOG_ID.DIALOG}btn_save`).on("click", () => {
      this._save();
    });

    this._dialog
      .find(`${DRAWING_DIALOG_ID.DIALOG}btn_apply`)
      .on("click", () => {
        this._apply();
      });
  }

  private _initImagePreview(inputImageURL: JQuery, imagePreview: JQuery): void {
    let _imagePreviewTimer = null,
      _imagePreviewDelay = 1000;

    inputImageURL.on("keyup", () => {
      let url = inputImageURL.val();
      imagePreview.parent().addClass("scxLoading");
      imagePreview.hide(undefined);
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
    let drawing = JsUtil.clone(this._config.drawing);

    // reset drawing
    if (this._tabs.activeIndex() === Tab.DRAWING) {
      drawing.theme = drawing.defaultTheme;

      // @if SCX_LICENSE = 'full'
      switch (drawing.className) {
        case DrawingClassNames.NoteDrawing:
          $.extend(true, <NoteDrawing>drawing, DrawingDefaults.NoteDrawing);
          break;

        case DrawingClassNames.ImageDrawing:
          (<ImageDrawing>drawing).url = "";
          break;

        case DrawingClassNames.TextDrawing:
        case DrawingClassNames.BalloonDrawing:
          (<TextDrawing>drawing).text = "";
          break;
        default:
          break;
      }
      // @endif

      this._setValues(drawing, true);
    }

    // reset tooltip
    if (this._tabs.activeIndex() === Tab.TOOLTIP && this._tooltipView)
      this._tooltipView.resetToDefaults();

    if (this._tabs.activeIndex() === Tab.POINTS) {
      this._input_magnetMode
        .selectpicker("val", MagnetMode.NONE)
        .selectpicker("refresh");
      this._input_magnetTo
        .selectpicker("val", MagnetPoint.BAR)
        .selectpicker("refresh");

      this._coordinatePanel.setValues(this._config.drawing);
    }

    this._config.chart.localize(this._dialog);
  }

  private _setLineState(isEnabled: boolean): void {
    if (!!isEnabled) {
      this._input_lineColor.spectrum("enable");
      this._label_lineEnabled.removeClass("disabled");
      this._input_lineStyle.removeAttr("disabled").selectpicker("refresh");
      this._input_lineWidth.scxNumericField("enable");
      if (!this._chk_lineEnabled.isChecked())
        this._chk_lineEnabled.setPosition(true);
    } else {
      this._input_lineColor.spectrum("disable");
      this._label_lineEnabled.addClass("disabled");
      this._input_lineStyle
        .attr("disabled", "disabled")
        .selectpicker("refresh");
      this._input_lineWidth.scxNumericField("disable");
      if (this._chk_lineEnabled.isChecked())
        this._chk_lineEnabled.setPosition(true);
    }
  }

  private _setTextBackgroundState(isEnabled: boolean): void {
    if (!!isEnabled) {
      this._input_textBackColor.spectrum("enable");
      this._label_textBackgroundEnabled.removeClass("disabled");
    } else {
      this._input_textBackColor.spectrum("disable");
      this._label_textBackgroundEnabled.addClass("disabled");
    }
  }

  private _setTextBorderState(isEnabled: boolean): void {
    if (!!isEnabled) {
      this._input_textBorderColor.spectrum("enable");
      this._label_textBorderEnabled.removeClass("disabled");
    } else {
      this._input_textBorderColor.spectrum("disable");
      this._label_textBorderEnabled.addClass("disabled");
    }
  }

  private _switchView(): void {
    this._dialog.find(".scxSpectrum").spectrum("enable");

    // hide all containers
    this._panelFigure.hide();
    this._panelImage.hide();
    this._panelText.hide();

    // hide all elements inside figure-type container
    this._panelFigureLine.hide();
    this._panelFigureLineEnabled.hide();
    this._panelFigureFill.hide();
    this._panelFigureFillEnabled.hide();
    this._panelFigureFill2.hide();
    this._panelFigureFill2Enabled.hide();
    this._panelFigureLabel.hide();
    this._panelFigureArc.hide();
    this._panelFigureHorizontalLine.hide();

    // show needed elements
    switch (this._config.drawing.className) {
      // @if SCX_LICENSE != 'free'
      case DrawingClassNames.DotDrawing:
      case DrawingClassNames.SquareDrawing:
      case DrawingClassNames.DiamondDrawing:
      case DrawingClassNames.ArrowUpDrawing:
      case DrawingClassNames.ArrowDownDrawing:
      case DrawingClassNames.ArrowLeftDrawing:
      case DrawingClassNames.ArrowRightDrawing:
      case DrawingClassNames.Arrow:
        this._panelFigureFill.show();
        this._panelFigure.show();
        break;

      case DrawingClassNames.NoteDrawing:
        this._panelFigureFill.show();
        this._panelFigureFillEnabled.show();
        this._panelFigureFill2.show();
        this._panelFigureFill2Enabled.show();
        this._panelFigureLabel.show();
        this._panelFigure.show();
        break;
      // @endif

      case DrawingClassNames.LineSegmentDrawing:
      // @if SCX_LICENSE != 'free'
      case DrawingClassNames.HorizontalLineDrawing:
      case DrawingClassNames.VerticalLineDrawing:
      case DrawingClassNames.TrendChannelDrawing:
      case DrawingClassNames.ErrorChannelDrawing:
      case DrawingClassNames.TironeLevelsDrawing:
      case DrawingClassNames.QuadrantLinesDrawing:
      case DrawingClassNames.RaffRegressionDrawing:
      case DrawingClassNames.SpeedLinesDrawing:
      case DrawingClassNames.GannFanDrawing:
      case DrawingClassNames.PolylineDrawing:
      // @endif
      // @if SCX_LICENSE = 'full'
      case DrawingClassNames.AndrewsPitchforkDrawing:
      case DrawingClassNames.CyclicLinesDrawing:
        // @endif
        this._panelFigureLine.show();
        this._panelFigure.show();
        break;

      // @if SCX_LICENSE != 'free'
      case DrawingClassNames.RectangleDrawing:
      case DrawingClassNames.TriangleDrawing:
      case DrawingClassNames.CircleDrawing:
      case DrawingClassNames.EllipseDrawing:
      case DrawingClassNames.PolygonDrawing:
        this._panelFigureLine.show();
        this._panelFigureLineEnabled.show();
        this._panelFigureFill.show();
        this._panelFigureFillEnabled.show();
        this._panelFigure.show();
        break;

      case DrawingClassNames.TextDrawing:
        this._panelText.show();
        this._input_text.show();
        this._inputs_textStyles.show();
        break;

      case DrawingClassNames.ImageDrawing:
        this._panelImage.show();
        break;

      case DrawingClassNames.BalloonDrawing:
        this._panelFigureLine.show();
        this._panelFigureLineEnabled.show();
        this._panelFigureFill.show();
        this._panelFigureFillEnabled.show();
        this._panelFigure.show();

        this._input_text.show();
        this._inputs_textStyles.show();
        this._panelText.show();
        break;

      case DrawingClassNames.MeasureDrawing:
        this._panelFigureLine.show();
        this._panelFigureLineEnabled.show();
        this._panelFigureFill.show();
        this._panelFigureFillEnabled.show();
        this._panelFigure.show();

        this._panelText.show();
        this._input_text.hide();
        this._inputs_textStyles.hide();
        break;
      case DrawingClassNames.FreeHandDrawing:
        this._panelFigure.show();
        this._panelFigureLine.show();
        break;
      // @endif
      case DrawingClassNames.TrendAngleDrawing:
        this._panelFigure.show();
        this._panelFigureLine.show();
        this._panelFigureArc.show();
        this._panelFigureHorizontalLine.show();
        break;
      default:
        break;
    }
  }

  private _setDialogTitle() {
    this._title.scxLocalize(
      `drawingSettingDialog.title.${this._config.drawing.className}`
    );
  }

  private _setValues(drawing: Drawing, partially?: boolean): void {
    // apply drawing theme
    if (!partially || (partially && this._tabs.activeIndex() === Tab.DRAWING)) {
      let drawingTheme = drawing.theme || drawing.actualTheme;

      switch (drawing.className) {
        // @if SCX_LICENSE != 'free'
        case DrawingClassNames.DotDrawing:
        case DrawingClassNames.SquareDrawing:
        case DrawingClassNames.DiamondDrawing:
        case DrawingClassNames.ArrowUpDrawing:
        case DrawingClassNames.ArrowDownDrawing:
        case DrawingClassNames.ArrowLeftDrawing:
        case DrawingClassNames.ArrowRightDrawing:
        case DrawingClassNames.Arrow:
          this._fillPropertiesHandler.theme = drawingTheme.fill;
          this._fillPropertiesHandler.setState(true);
          break;

        case DrawingClassNames.NoteDrawing:
          this._fillPropertiesHandler.theme = drawingTheme.fill;
          this._fillPropertiesHandler.setState(
            drawingTheme.fill.fillEnabled !== false
          );

          this._fillPropertiesHandler2.theme = drawingTheme.centerPointFill;
          this._fillPropertiesHandler2.setState(
            drawingTheme.centerPointFill.fillEnabled !== false
          );

          this._input_labelText.val((<NoteDrawing>drawing).label);
          this._input_labelColor.spectrum("set", drawingTheme.text.fillColor);
          this._input_labelFont
            .selectpicker("val", drawingTheme.text.fontFamily)
            .selectpicker("refresh");
          this._input_labelSize
            .selectpicker("val", drawingTheme.text.fontSize)
            .selectpicker("refresh");
          break;
        // @endif

        case DrawingClassNames.LineSegmentDrawing:
        // @if SCX_LICENSE != 'free'
        case DrawingClassNames.HorizontalLineDrawing:
        case DrawingClassNames.VerticalLineDrawing:
        case DrawingClassNames.TrendChannelDrawing:
        case DrawingClassNames.ErrorChannelDrawing:
        case DrawingClassNames.TironeLevelsDrawing:
        case DrawingClassNames.QuadrantLinesDrawing:
        case DrawingClassNames.RaffRegressionDrawing:
        case DrawingClassNames.SpeedLinesDrawing:
        case DrawingClassNames.GannFanDrawing:
        case DrawingClassNames.PolylineDrawing:
        // @endif
        // @if SCX_LICENSE = 'full'
        case DrawingClassNames.AndrewsPitchforkDrawing:
        case DrawingClassNames.CyclicLinesDrawing:
          // @endif
          this._setLineState(true);
          this._input_lineColor.spectrum("set", drawingTheme.line.strokeColor);
          this._input_lineStyle
            .selectpicker("val", drawingTheme.line.lineStyle || LineStyle.SOLID)
            .selectpicker("refresh");
          this._input_lineWidth.scxNumericField(
            "setValue",
            drawingTheme.line.width
          );
          break;

        // @if SCX_LICENSE != 'free'
        case DrawingClassNames.RectangleDrawing:
        case DrawingClassNames.TriangleDrawing:
        case DrawingClassNames.CircleDrawing:
        case DrawingClassNames.EllipseDrawing:
        case DrawingClassNames.PolygonDrawing:
          this._setLineState(
            drawingTheme.line.strokeEnabled !== undefined
              ? drawingTheme.line.strokeEnabled
              : true
          );
          this._input_lineColor.spectrum("set", drawingTheme.line.strokeColor);
          this._input_lineStyle
            .selectpicker("val", drawingTheme.line.lineStyle || LineStyle.SOLID)
            .selectpicker("refresh");
          this._input_lineWidth.scxNumericField(
            "setValue",
            drawingTheme.line.width
          );

          this._fillPropertiesHandler.theme = drawingTheme.fill;
          this._fillPropertiesHandler.setState(
            drawingTheme.fill.fillEnabled !== false
          );
          break;

        case DrawingClassNames.TextDrawing:
          this._input_text.val((<TextDrawing>drawing).text);
          this._input_textColor.spectrum("set", drawingTheme.text.fillColor);
          this._input_textFont
            .selectpicker("val", drawingTheme.text.fontFamily)
            .selectpicker("refresh");
          this._input_textSize
            .selectpicker("val", drawingTheme.text.fontSize)
            .selectpicker("refresh");
          this._textStylesChooser.setStyle(
            "b",
            drawingTheme.text.fontWeight === "bold"
          );
          this._textStylesChooser.setStyle(
            "i",
            drawingTheme.text.fontStyle === "italic"
          );
          this._textStylesChooser.setStyle(
            "u",
            drawingTheme.text.decoration === "underline"
          );
          break;

        case DrawingClassNames.ImageDrawing:
          let url = (<ImageDrawing>drawing).url;

          this._input_imageUrl.val(url);
          this._input_imagePreview.attr("src", url);

          if (!url) this._resetImagePreview(this._input_imagePreview);

          break;

        case DrawingClassNames.BalloonDrawing:
          this._setLineState(
            drawingTheme.line.strokeEnabled !== undefined
              ? drawingTheme.line.strokeEnabled
              : true
          );
          this._input_lineColor.spectrum("set", drawingTheme.line.strokeColor);
          this._input_lineStyle
            .selectpicker("val", drawingTheme.line.lineStyle || LineStyle.SOLID)
            .selectpicker("refresh");
          this._input_lineWidth.scxNumericField(
            "setValue",
            drawingTheme.line.width
          );

          this._fillPropertiesHandler.theme = drawingTheme.fill;
          this._fillPropertiesHandler.setState(
            drawingTheme.fill.fillEnabled !== false
          );

          this._input_text.val((<BalloonDrawing>drawing).text);
          this._input_textColor.spectrum("set", drawingTheme.text.fillColor);
          this._input_textFont
            .selectpicker("val", drawingTheme.text.fontFamily)
            .selectpicker("refresh");
          this._input_textSize
            .selectpicker("val", drawingTheme.text.fontSize)
            .selectpicker("refresh");
          this._textStylesChooser.setStyle(
            "b",
            drawingTheme.text.fontWeight === "bold"
          );
          this._textStylesChooser.setStyle(
            "i",
            drawingTheme.text.fontStyle === "italic"
          );
          this._textStylesChooser.setStyle(
            "u",
            drawingTheme.text.decoration === "underline"
          );
          break;

        case DrawingClassNames.MeasureDrawing:
          this._setLineState(
            drawingTheme.line.strokeEnabled !== undefined
              ? drawingTheme.line.strokeEnabled
              : true
          );
          this._input_lineColor.spectrum("set", drawingTheme.line.strokeColor);
          this._input_lineStyle
            .selectpicker("val", drawingTheme.line.lineStyle || LineStyle.SOLID)
            .selectpicker("refresh");
          this._input_lineWidth.scxNumericField(
            "setValue",
            drawingTheme.line.width
          );

          this._fillPropertiesHandler.theme = drawingTheme.fill;
          this._fillPropertiesHandler.setState(
            drawingTheme.fill.fillEnabled !== false
          );

          this._input_text.val((<BalloonDrawing>drawing).text);
          this._input_textColor.spectrum(
            "set",
            drawingTheme.balloon.text.fillColor
          );
          this._input_textFont
            .selectpicker("val", drawingTheme.balloon.text.fontFamily)
            .selectpicker("refresh");
          this._input_textSize
            .selectpicker("val", drawingTheme.balloon.text.fontSize)
            .selectpicker("refresh");
          break;
        case DrawingClassNames.FreeHandDrawing:
          this._setLineState(true);
          this._input_lineColor.spectrum("set", drawingTheme.line.strokeColor);
          this._input_lineStyle
            .selectpicker("val", drawingTheme.line.lineStyle || LineStyle.SOLID)
            .selectpicker("refresh");
          this._input_lineWidth.scxNumericField(
            "setValue",
            drawingTheme.line.width
          );
          break;
        // @endif
        case DrawingClassNames.TrendAngleDrawing:
          this._setLineState(true);
          this._input_lineColor.spectrum("set", drawingTheme.line.strokeColor);
          this._input_lineStyle
            .selectpicker("val", drawingTheme.line.lineStyle || LineStyle.SOLID)
            .selectpicker("refresh");
          this._input_lineWidth.scxNumericField(
            "setValue",
            drawingTheme.line.width
          );
          this._input_horizontalLineColor.spectrum(
            "set",
            drawingTheme.horizontalLine.strokeColor
          );
          this._input_horizontalLineStyle
            .selectpicker(
              "val",
              drawingTheme.horizontalLine.lineStyle || LineStyle.DOT
            )
            .selectpicker("refresh");
          this._input_horizontalLineWidth.scxNumericField(
            "setValue",
            drawingTheme.horizontalLine.width
          );
          this._input_arcColor.spectrum("set", drawingTheme.arc.strokeColor);
          this._input_arcStyle
            .selectpicker("val", drawingTheme.arc.lineStyle || LineStyle.DOT)
            .selectpicker("refresh");
          this._input_arcWidth.scxNumericField(
            "setValue",
            drawingTheme.arc.width
          );
          break;
        default:
          break;
      }
    }

    if (!partially || (partially && this._tabs.activeIndex() === Tab.POINTS)) {
      if (!drawing.magnetMode) {
        drawing.magnetPoint = MagnetPoint.BAR;
        drawing.magnetMode = MagnetMode.NONE;
      }

      this._input_magnetMode
        .selectpicker("val", drawing.magnetMode)
        .selectpicker("refresh");
      this._input_magnetTo
        .selectpicker("val", drawing.magnetPoint)
        .selectpicker("refresh");

      if (!this._coordinatePanel)
        this._coordinatePanel = new CoordinatePanel(this._panelPoints);

      this._coordinatePanel.setValues(this._config.drawing);
    }

    // apply tooltip theme
    if (!partially || (partially && this._tabs.activeIndex() === Tab.TOOLTIP))
      this._loadTooltipView(drawing.tooltip);
  }

  private _save(): void {
    this._apply();

    if (this._validateInputValue()) this.hide();
  }

  private _apply(): void {
    let drawing = this._config.drawing;
    if (!drawing.chart) return;
    let drawingTheme = $.extend(true, {}, drawing.actualTheme);

    let text = "";

    this._coordinatePanel.apply();

    // apply magnet
    if (!drawing.magnetMode) {
      drawing.magnetPoint = MagnetPoint.BAR;
      drawing.magnetMode = MagnetMode.NONE;
    } else {
      drawing.magnetPoint = this._input_magnetTo.val();
      drawing.magnetMode = this._input_magnetMode.val();
    }

    let linePropertiesConfig: ILinePropertiesHandlerConfig,
      linePropertiesHandler: LinePropertiesHandler;

    linePropertiesConfig = {
      colorPicker: this._input_lineColor,
      widthInput: this._input_lineWidth,
      lineStyleDropdown: this._input_lineStyle
    };
    linePropertiesHandler = new LinePropertiesHandler(linePropertiesConfig);

    // apply drawing theme
    switch (drawing.className) {
      // @if SCX_LICENSE != 'free'
      case DrawingClassNames.DotDrawing:
      case DrawingClassNames.SquareDrawing:
      case DrawingClassNames.DiamondDrawing:
      case DrawingClassNames.ArrowUpDrawing:
      case DrawingClassNames.ArrowDownDrawing:
      case DrawingClassNames.ArrowLeftDrawing:
      case DrawingClassNames.ArrowRightDrawing:
      case DrawingClassNames.Arrow:
        drawingTheme.fill.fillColor = this._fillPropertiesHandler.theme.fillColor;
        break;

      case DrawingClassNames.NoteDrawing:
        drawingTheme.fill.fillColor = this._fillPropertiesHandler.theme.fillColor;
        drawingTheme.fill.fillEnabled = this._fillPropertiesHandler.isEnabled;
        drawingTheme.centerPointFill.fillColor = this._fillPropertiesHandler2.theme.fillColor;
        drawingTheme.centerPointFill.fillEnabled = this._fillPropertiesHandler2.isEnabled;
        (<NoteDrawing>drawing).label = this._input_labelText.val();
        drawingTheme.text.fillColor = this._input_labelColor
          .spectrum("get")
          .toRgbString();
        drawingTheme.text.fontFamily = this._input_labelFont.selectpicker(
          "val"
        );
        drawingTheme.text.fontSize = this._input_labelSize.selectpicker("val");
        break;
      // @endif

      case DrawingClassNames.LineSegmentDrawing:
      // @if SCX_LICENSE != 'free'
      case DrawingClassNames.HorizontalLineDrawing:
      case DrawingClassNames.VerticalLineDrawing:
      case DrawingClassNames.TrendChannelDrawing:
      case DrawingClassNames.ErrorChannelDrawing:
      case DrawingClassNames.TironeLevelsDrawing:
      case DrawingClassNames.QuadrantLinesDrawing:
      case DrawingClassNames.RaffRegressionDrawing:
      case DrawingClassNames.SpeedLinesDrawing:
      case DrawingClassNames.GannFanDrawing:
      case DrawingClassNames.PolylineDrawing:
      // @endif
      // @if SCX_LICENSE = 'full'
      case DrawingClassNames.AndrewsPitchforkDrawing:
      case DrawingClassNames.CyclicLinesDrawing:
        // @endif
        drawingTheme.line = linePropertiesHandler.theme;
        break;

      // @if SCX_LICENSE != 'free'
      case DrawingClassNames.RectangleDrawing:
      case DrawingClassNames.TriangleDrawing:
      case DrawingClassNames.CircleDrawing:
      case DrawingClassNames.EllipseDrawing:
      case DrawingClassNames.PolygonDrawing:
        drawingTheme.line = linePropertiesHandler.theme;
        drawingTheme.line.strokeEnabled = this._chk_lineEnabled.isChecked();
        drawingTheme.fill.fillEnabled = this._fillPropertiesHandler.isEnabled;
        drawingTheme.fill.fillColor = this._fillPropertiesHandler.theme.fillColor;
        break;

      case DrawingClassNames.ImageDrawing:
        if (!this._validateInputValue()) {
          Localization.localizeText(
            this._config.chart,
            "notification.drawingSettingDialog.msg.urlIsNotSpecified"
          ).then((title: string) => {
            Notification.warning(title);
          });

          return;
        }

        (<ImageDrawing>drawing).url = JsUtil.filterText(
          this._input_imageUrl.val()
        );
        break;

      case DrawingClassNames.TextDrawing:
        if (!this._validateInputValue()) {
          Localization.localizeText(
            this._config.chart,
            "notification.drawingSettingDialog.msg.textIsNotSpecified"
          ).then((title: string) => {
            Notification.warning(title);
          });

          return;
        }

        text = JsUtil.filterText(this._input_text.val());
        (<TextDrawing>drawing).text = text.length
          ? text
          : (<TextDrawing>drawing).text;
        drawingTheme.text.fillColor = this._input_textColor
          .spectrum("get")
          .toRgbString();
        drawingTheme.text.fontFamily = this._input_textFont.selectpicker("val");
        drawingTheme.text.fontSize = parseInt(
          <string>this._input_textSize.selectpicker("val"),
          10
        );
        drawingTheme.text.fontWeight = this._textStylesChooser.getStyle("b")
          ? "bold"
          : "normal";
        drawingTheme.text.fontStyle = this._textStylesChooser.getStyle("i")
          ? "italic"
          : "normal";
        drawingTheme.text.decoration = this._textStylesChooser.getStyle("u")
          ? "underline"
          : "";
        break;

      case DrawingClassNames.BalloonDrawing:
        if (!this._validateInputValue()) {
          Localization.localizeText(
            this._config.chart,
            "notification.drawingSettingDialog.msg.textIsNotSpecified"
          ).then((title: string) => {
            Notification.warning(title);
          });

          return;
        }

        text = JsUtil.filterText(this._input_text.val());
        (<BalloonDrawing>drawing).text = text.length
          ? text
          : (<BalloonDrawing>drawing).text;
        drawingTheme.text.fillColor = this._input_textColor
          .spectrum("get")
          .toRgbString();
        drawingTheme.text.fontFamily = this._input_textFont.selectpicker("val");
        drawingTheme.text.fontSize = parseInt(
          <string>this._input_textSize.selectpicker("val"),
          10
        );
        drawingTheme.text.fontWeight = this._textStylesChooser.getStyle("b")
          ? "bold"
          : "normal";
        drawingTheme.text.fontStyle = this._textStylesChooser.getStyle("i")
          ? "italic"
          : "normal";
        drawingTheme.text.decoration = this._textStylesChooser.getStyle("u")
          ? "underline"
          : "";

        drawingTheme.line = linePropertiesHandler.theme;
        drawingTheme.line.strokeEnabled = this._chk_lineEnabled.isChecked();
        drawingTheme.fill.fillEnabled = this._fillPropertiesHandler.isEnabled;
        drawingTheme.fill.fillColor = this._fillPropertiesHandler.theme.fillColor;
        break;

      case DrawingClassNames.MeasureDrawing:
        drawingTheme.line = linePropertiesHandler.theme;
        drawingTheme.line.strokeEnabled = this._chk_lineEnabled.isChecked();

        drawingTheme.border = linePropertiesHandler.theme;
        drawingTheme.border.strokeEnabled = this._chk_lineEnabled.isChecked();

        drawingTheme.fill.fillEnabled = this._fillPropertiesHandler.isEnabled;
        drawingTheme.fill.fillColor = this._fillPropertiesHandler.theme.fillColor;
        drawingTheme.balloon.fill.fillEnabled = this._fillPropertiesHandler.isEnabled;
        drawingTheme.balloon.fill.fillColor = this._fillPropertiesHandler.theme.fillColor;
        drawingTheme.balloon.text.fillColor = this._input_textColor
          .spectrum("get")
          .toRgbString();
        drawingTheme.balloon.text.fontFamily = this._input_textFont.selectpicker(
          "val"
        );
        drawingTheme.balloon.text.fontSize = parseInt(
          <string>this._input_textSize.selectpicker("val"),
          10
        );
        break;
      case DrawingClassNames.FreeHandDrawing:
        drawingTheme.line = linePropertiesHandler.theme;
        break;
      // @endif
      case DrawingClassNames.TrendAngleDrawing:
        drawingTheme.line = linePropertiesHandler.theme;

        linePropertiesConfig = {
          colorPicker: this._input_horizontalLineColor,
          widthInput: this._input_horizontalLineWidth,
          lineStyleDropdown: this._input_horizontalLineStyle
        };
        linePropertiesHandler = new LinePropertiesHandler(linePropertiesConfig);

        drawingTheme.horizontalLine = linePropertiesHandler.theme;

        linePropertiesConfig = {
          colorPicker: this._input_arcColor,
          widthInput: this._input_arcWidth,
          lineStyleDropdown: this._input_arcStyle
        };
        linePropertiesHandler = new LinePropertiesHandler(linePropertiesConfig);

        drawingTheme.arc = linePropertiesHandler.theme;
        break;
      default:
        break;
    }

    this._config.drawing.theme = drawingTheme;
    if (this._tooltipView) this._tooltipView.apply();
    this._config.drawing.chartPanel.update();

    this._isApplyClicked = true;
  }

  private _validateInputValue(): boolean {
    // @if SCX_LICENSE != 'free'
    switch (this._config.drawing.className) {
      case DrawingClassNames.ImageDrawing:
        let url = JsUtil.filterText(this._input_imageUrl.val());
        if (!url.length) return false;
        break;

      case DrawingClassNames.TextDrawing:
      case DrawingClassNames.BalloonDrawing:
        let text = JsUtil.filterText(this._input_text.val());
        if (!text) return false;
        break;
      default:
        break;
    }
    // @endif

    return true;
  }

  private _loadTooltipView(tooltip: Tooltip) {
    ViewLoader.tooltipView((fragment: TooltipView) => {
      fragment.container = this._tab_tooltip;
      fragment.setValues(tooltip);
      this._tooltipView = fragment;
      this._config.chart.localize(this._dialog);
    });
  }

  private _initFields(): void {
    this._title = this._dialog.find(`${DRAWING_DIALOG_ID.DIALOG}title`);
    this._tabItemsContainer = this._dialog.find(".scxTabs");
    this._tabPanelsContainer = this._dialog.find(".scxTabsContent");
    this._tab_tooltip = this._dialog.find(`${DRAWING_DIALOG_ID.TAB}tooltip`);
    this._panelFigure = this._dialog.find(`${DRAWING_DIALOG_ID.PANEL}figure`);
    this._panelFigureLine = this._dialog.find(
      `${DRAWING_DIALOG_ID.FIGURE}linePanel`
    );
    this._panelFigureHorizontalLine = this._dialog.find(
      `${DRAWING_DIALOG_ID.FIGURE}horizontalLinePanel`
    );
    this._panelFigureArc = this._dialog.find(
      `${DRAWING_DIALOG_ID.FIGURE}arcPanel`
    );
    this._panelFigureLineEnabled = this._dialog.find(
      `${DRAWING_DIALOG_ID.FIGURE}lineEnabled`
    );
    this._panelFigureFill = this._dialog.find(
      `${DRAWING_DIALOG_ID.FIGURE}fillColorPanel`
    );
    this._panelFigureFillEnabled = this._dialog.find(
      `${DRAWING_DIALOG_ID.FIGURE}fillColorPanel_fillEnabled`
    );
    this._panelFigureFill2 = this._dialog.find(
      `${DRAWING_DIALOG_ID.FIGURE}fillColorPanel2`
    );
    this._panelFigureFill2Enabled = this._dialog.find(
      `${DRAWING_DIALOG_ID.FIGURE}fillColorPanel2_fillEnabled`
    );
    this._panelFigureLabel = this._dialog.find(
      `${DRAWING_DIALOG_ID.FIGURE}label`
    );
    this._panelPoints = this._dialog.find(`${DRAWING_DIALOG_ID.PANEL}points`);
    this._panelText = this._dialog.find(`${DRAWING_DIALOG_ID.PANEL}text`);
    this._panelImage = this._dialog.find(`${DRAWING_DIALOG_ID.PANEL}image`);
    this._input_lineColor = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}lineColor`
    );
    this._input_lineWidth = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}lineWidth`
    );
    this._input_lineStyle = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}lineStyle`
    );
    this._input_fillColor = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}fillColor`
    );
    this._input_fillColor2 = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}fillColor2`
    );
    this._input_labelText = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}labelText`
    );
    this._input_labelColor = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}labelColor`
    );
    this._input_labelFont = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}labelFont`
    );
    this._input_labelSize = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}labelSize`
    );
    this._input_horizontalLineColor = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}horizontalLineColor`
    );
    this._input_horizontalLineWidth = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}horizontalLineWidth`
    );
    this._input_horizontalLineStyle = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}horizontalLineStyle`
    );
    this._input_arcColor = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}arcColor`
    );
    this._input_arcWidth = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}arcWidth`
    );
    this._input_arcStyle = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}arcStyle`
    );
    this._input_text = this._dialog.find(`${DRAWING_DIALOG_ID.INPUT}text`);
    this._input_textColor = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}textColor`
    );
    this._input_textFont = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}textFont`
    );
    this._input_textSize = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}textSize`
    );
    this._input_textColor = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}textColor`
    );
    this._inputs_textStyles = this._dialog.find(".scxDrawingDialog_textStyles");
    this._textStylesChooser = null;
    this._input_textBackColor = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}textBackgroundColor`
    );
    this._input_textBorderColor = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}textBorderColor`
    );
    this._input_imageUrl = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}imageURL`
    );
    this._input_imagePreview = this._dialog.find(
      `${DRAWING_DIALOG_ID.DIALOG}imagePreview`
    );
    this._chk_lineEnabledHTMLObj = this._dialog.find(
      `${DRAWING_DIALOG_ID.CHECK}lineColor`
    );
    this._chk_fillEnabledHTMLObj = this._dialog.find(
      `${DRAWING_DIALOG_ID.CHECK}fillColor`
    );
    this._chk_fill2EnabledHTMLObj = this._dialog.find(
      `${DRAWING_DIALOG_ID.CHECK}fillColor2`
    );
    this._chk_textBackgroundEnabledHTMLObj = this._dialog.find(
      `${DRAWING_DIALOG_ID.CHECK}textBackgroundColor`
    );
    this._chk_textBorderEnabledHTMLObj = this._dialog.find(
      `${DRAWING_DIALOG_ID.CHECK}textBorderColor`
    );
    // this._chk_textBackgroundEnabled = this._dialog.find(`${DRAWING_DIALOG_ID.CHECK}textBackgroundColor`);
    // this._chk_textBorderEnabled = this._dialog.find(`${DRAWING_DIALOG_ID.CHECK}textBorderColor`);
    this._label_lineEnabled = this._dialog.find(
      `${DRAWING_DIALOG_ID.LABEL}lineColor`
    );
    this._label_fillEnabled = this._dialog.find(
      `${DRAWING_DIALOG_ID.LABEL}fillColor`
    );
    this._label_fill2Enabled = this._dialog.find(
      `${DRAWING_DIALOG_ID.LABEL}fillColor2`
    );
    this._label_textBackgroundEnabled = this._dialog.find(
      `${DRAWING_DIALOG_ID.LABEL}textBackgroundColor`
    );
    this._label_textBorderEnabled = this._dialog.find(
      `${DRAWING_DIALOG_ID.LABEL}textBorderColor`
    );
    // this._label_magnetToLabel = this._dialog.find(`${DRAWING_DIALOG_ID.LABEL}magnetToLabel`);
    // magnetMode
    this._input_magnetTo = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}magnetTo`
    );
    this._input_magnetMode = this._dialog.find(
      `${DRAWING_DIALOG_ID.INPUT}magnetMode`
    );
  }
}
