import { FibonacciDrawingBase } from "../StockChartX/index";
import { FibonacciLevelLineExtension } from "../StockChartX/Drawings/utils";
import Switchery from "../StockChartX.External/switchery";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { Dialog } from "./index";
import { IDrawingSettingsDialogConfig } from "./index";
import { Tabs } from "./index";
import { TooltipView } from "./index";
import { CoordinatePanel } from "./index";
// import { $ } from '../external/typescript/jquery';
import {
  ILinePropertiesHandlerConfig,
  LinePropertiesHandler
} from "./index";
import {
  MagnetMode,
  MagnetPoint,
  DrawingDefaults,
  DrawingClassNames
} from "../StockChartX/Drawings/utils";
import { Tooltip } from "./index";
import { ViewLoader } from "./index";
const $ = window.jQuery;
const tinycolor = require("tinycolor2");

// @if SCX_LICENSE != 'free'

"use strict";

export interface IFibonacciDrawingSettingsDialogConfig
  extends IDrawingSettingsDialogConfig {
  drawing: FibonacciDrawingBase;
}

enum Tab {
  LEVELS,
  TOOLTIP,
  POINTS
}

const FIBONACCI_DIALOG_ID = {
  DIALOG: "#scxFibonacciDrawingDialog_",
  INPUT: ".scxFibonacciDrawingDialog_input_",
  LABEL: "#scxFibonacciDrawingDialog_label_",
  TAB: "#scxFibonacciDrawingDialog_tab_",
  CHECK: ".scxFibonacciDrawingDialog_chk_",
  FIGURE: ".scxFibonacciDrawingDialog_panel_figure_",
  PANEL: ".scxFibonacciDrawingDialog_panel_"
};

const CLASS_SPECTRUM = "scxSpectrumDrawingDialog";

export class FibonacciDrawingSettingsDialog extends Dialog {
  _isApplyClicked: any;
  private static _numericFieldConfig = {
    showArrows: false,
    maxValue: 10,
    minValue: 1,
    value: 1
  };

  private static _numericDoubleFieldConfig = {
    showArrows: false,
    priceDecimals: 3,
    maxValue: 500,
    minValue: 0,
    value: 1
  };

  private static _numericTimeZoneFieldConfig = {
    showArrows: false,
    maxValue: 10000,
    minValue: 0,
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

  private _title: JQuery;
  private _tabItemsContainer: JQuery;
  private _tabPanelsContainer: JQuery;
  private _tabs: Tabs;
  private _input_magnetTo: JQuery;
  private _input_magnetMode: JQuery;
  // private _label_magnetToLabel: JQuery;
  private _panelFigure: JQuery;
  private _panelFigureLine: JQuery;
  private _panelFigureTrendLinePanel: JQuery;
  private _panelFigureTrendLine: JQuery;
  private _panelFigureLevelParametersPanel: JQuery;
  private _panelFigureLevelParameters: JQuery;
  private _panelFigureRetracementsOptionsPanel: JQuery;
  private _panelFigureRetracementsOptions: JQuery;
  private _panelFigureLabelsParametersPanel: JQuery;
  private _panelFigureLabelsParameters: JQuery;
  private _panelFigureBackgroundPanel: JQuery;
  private _panelFigureBackground: JQuery;
  private _panelPoints: JQuery;
  private _input_lineLevel: JQuery;
  // private _input_lineColor: JQuery;
  private _input_lineWidth: JQuery;
  private _input_lineStyle: JQuery;
  private _input_trendLineColor: JQuery;
  private _input_trendLineWidth: JQuery;
  private _input_trendLineStyle: JQuery;
  private _input_labelsPosition: JQuery;
  private _input_labelsTextPosition: JQuery;
  private _chk_lineEnabledHTMLObj: JQuery;
  private _chk_trendLineEnabledHTMLObj: JQuery;
  private _chk_trendLineEnabled: Switchery;
  private _chk_levelsValueEnabledHTMLObj: JQuery;
  private _chk_levelsPriceEnabledHTMLObj: JQuery;
  private _chk_levelsPercentEnabledHTMLObj: JQuery;
  private _chk_linesReverseEnabledHTMLObj: JQuery;
  private _chk_extendLinesLeftEnabledHTMLObj: JQuery;
  private _chk_extendLinesRightEnabledHTMLObj: JQuery;
  private _chk_extendLinesTopEnabledHTMLObj: JQuery;
  private _chk_extendLinesBottomEnabledHTMLObj: JQuery;
  private _chk_backgroundEnabledHTMLObj: JQuery;
  private _levelsPriceEnabled: JQuery;
  private _levelsPercentEnabled: JQuery;
  private _levelsExtendHorEnabled: JQuery;
  private _levelsExtendVerEnabled: JQuery;
  private _labelsHorEnabled: JQuery;
  private _levelsReverseEnabled: JQuery;
  private _label_trendLine: JQuery;
  private _label_extendLinesLeft: JQuery;
  private _label_extendLinesRight: JQuery;
  private _label_extendLinesTop: JQuery;
  private _label_extendLinesBottom: JQuery;
  private _label_reverse: JQuery;
  private _label_levels: JQuery;
  private _label_levelPrices: JQuery;
  private _label_levelPercents: JQuery;
  private _label_background: JQuery;

  protected _config: IFibonacciDrawingSettingsDialogConfig;
  // private _isApplyClicked: boolean = false;
  private _levels = [];
  private _showTrendLine: boolean;
  private _showLevelValues: boolean;
  private _showLevelPrices: boolean;
  private _showLevelPercents: boolean;
  private _showLevelBackgrounds: boolean;
  private _reverse: boolean;
  private _levelLinesExtension: string;
  private _levelTextHorPosition: string;
  private _levelTextVerPosition: string;

  private _chk_levelsPriceEnabled: Switchery;
  private _chk_levelsPercentEnabled: Switchery;

  private _tabTooltip: JQuery;
  private _tooltipView: TooltipView;
  private _coordinatePanel: CoordinatePanel;

  constructor(container: JQuery) {
    super(container);

    this._initFields();
    this._init();
  }

  public show(config: IFibonacciDrawingSettingsDialogConfig) {
    if (!this.initDialog(config)) return;

    this._setDialogTitle();
    this._setDrawingConfig(this._config.drawing);
    this._tabs.activate(0);
    // this._isApplyClicked = false;
    this._setDialogFields();

    super.show(config);
  }

  public hide() {
    this._clearDialogFields();

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

    // magnet mode
    this._input_magnetTo.selectpicker({ container: "body" });
    this._input_magnetMode.selectpicker({ container: "body" });

    $("body").on("scxSwitcherChanged", (e: JQueryEventObject, evtData: any) => {
      let target = $(evtData.target),
        isEnabled = !!evtData.checked;

      if (target.is(this._chk_lineEnabledHTMLObj)) {
        let index = $(evtData.target).index(
          ".scxFibonacciDrawingDialog_chk_lineEnable"
        );
        this._setLineState(isEnabled, index);
      }

      if (target.is(this._chk_trendLineEnabledHTMLObj))
        this._setTrendLineState(isEnabled);

      if (target.is(this._chk_levelsValueEnabledHTMLObj)) {
        this._showLevelValues = isEnabled;
        this._setLevelsState(isEnabled);
      }

      if (target.is(this._chk_levelsPriceEnabledHTMLObj)) {
        this._setLabelState(this._label_levelPrices, isEnabled);
        this._showLevelPrices = isEnabled;
      }

      if (target.is(this._chk_levelsPercentEnabledHTMLObj)) {
        this._setLabelState(this._label_levelPercents, isEnabled);
        this._showLevelPercents = isEnabled;
      }

      if (target.is(this._chk_linesReverseEnabledHTMLObj)) {
        this._setLabelState(this._label_reverse, isEnabled);
        this._reverse = isEnabled;
      }

      if (target.is(this._chk_extendLinesLeftEnabledHTMLObj)) {
        this._setLabelState(this._label_extendLinesLeft, isEnabled);
        this._setLevelLinesExtension(
          isEnabled,
          FibonacciLevelLineExtension.RIGHT,
          FibonacciLevelLineExtension.LEFT
        );
      }

      if (target.is(this._chk_extendLinesRightEnabledHTMLObj)) {
        this._setLabelState(this._label_extendLinesRight, isEnabled);
        this._setLevelLinesExtension(
          isEnabled,
          FibonacciLevelLineExtension.LEFT,
          FibonacciLevelLineExtension.RIGHT
        );
      }

      if (target.is(this._chk_extendLinesTopEnabledHTMLObj)) {
        this._setLabelState(this._label_extendLinesTop, isEnabled);
        this._setLevelLinesExtension(
          isEnabled,
          FibonacciLevelLineExtension.BOTTOM,
          FibonacciLevelLineExtension.TOP
        );
      }

      if (target.is(this._chk_extendLinesBottomEnabledHTMLObj)) {
        this._setLabelState(this._label_extendLinesBottom, isEnabled);
        this._setLevelLinesExtension(
          isEnabled,
          FibonacciLevelLineExtension.TOP,
          FibonacciLevelLineExtension.BOTTOM
        );
      }

      if (target.is(this._chk_backgroundEnabledHTMLObj)) {
        this._setLabelState(this._label_background, isEnabled);
        this._showLevelBackgrounds = isEnabled;
      }
    });

    this._dialog
      .find(`${FIBONACCI_DIALOG_ID.DIALOG}btn_resetToDefaults`)
      .on("click", () => {
        this.resetToDefaults();
      });

    this._dialog
      .find(`${FIBONACCI_DIALOG_ID.DIALOG}btn_save`)
      .on("click", () => {
        this._save();
      });

    this._dialog
      .find(`${FIBONACCI_DIALOG_ID.DIALOG}btn_apply`)
      .on("click", () => {
        this._apply();
      });
    this._dialog
      .find(`${FIBONACCI_DIALOG_ID.PANEL}addLinePanel`)
      .on("click", () => {
        this._addNewLinePanel();
      });
  }

  private _initFields(): void {
    this._title = this._dialog.find(`${FIBONACCI_DIALOG_ID.DIALOG}title`);
    this._tabItemsContainer = this._dialog.find(".scxTabs");
    this._tabPanelsContainer = this._dialog.find(".scxTabsContent");
    this._panelFigure = this._dialog.find(`${FIBONACCI_DIALOG_ID.PANEL}figure`);
    this._panelFigureLine = this._dialog.find(
      `${FIBONACCI_DIALOG_ID.FIGURE}linePanel`
    );
    this._panelFigureTrendLinePanel = this._dialog.find(
      `${FIBONACCI_DIALOG_ID.FIGURE}trendLinePanel`
    );
    this._panelFigureTrendLine = null;
    this._panelFigureLevelParametersPanel = this._dialog.find(
      `${FIBONACCI_DIALOG_ID.FIGURE}levelParametersPanel`
    );
    this._panelFigureLevelParameters = null;
    this._panelFigureRetracementsOptionsPanel = this._dialog.find(
      `${FIBONACCI_DIALOG_ID.FIGURE}retracementsOptionsPanel`
    );
    this._panelFigureRetracementsOptions = null;
    this._panelFigureLabelsParametersPanel = this._dialog.find(
      `${FIBONACCI_DIALOG_ID.FIGURE}labelsParametersPanel`
    );
    this._panelFigureLabelsParameters = null;
    this._panelFigureBackgroundPanel = this._dialog.find(
      `${FIBONACCI_DIALOG_ID.FIGURE}backgroundPanel`
    );
    this._panelFigureBackground = null;
    this._tabTooltip = this._dialog.find(`${FIBONACCI_DIALOG_ID.TAB}tooltip`);
    this._panelPoints = this._dialog.find(`${FIBONACCI_DIALOG_ID.PANEL}points`);
    this._input_lineLevel = null;
    // this._input_lineColor = null;
    this._input_lineWidth = null;
    this._input_lineStyle = null;
    this._input_trendLineColor = null;
    this._input_trendLineWidth = null;
    this._input_trendLineStyle = null;
    this._input_labelsPosition = null;
    this._input_labelsTextPosition = null;
    this._chk_lineEnabledHTMLObj = null;
    this._chk_trendLineEnabledHTMLObj = null;
    this._chk_trendLineEnabled = null;
    this._chk_levelsValueEnabledHTMLObj = null;
    this._chk_levelsPriceEnabledHTMLObj = null;
    this._chk_levelsPercentEnabledHTMLObj = null;
    this._chk_linesReverseEnabledHTMLObj = null;
    this._chk_extendLinesLeftEnabledHTMLObj = null;
    this._chk_extendLinesRightEnabledHTMLObj = null;
    this._chk_extendLinesTopEnabledHTMLObj = null;
    this._chk_extendLinesBottomEnabledHTMLObj = null;
    this._chk_backgroundEnabledHTMLObj = null;
    this._levelsPriceEnabled = null;
    this._levelsPercentEnabled = null;
    this._levelsExtendHorEnabled = null;
    this._levelsExtendVerEnabled = null;
    this._labelsHorEnabled = null;
    this._levelsReverseEnabled = null;
    this._label_trendLine = null;
    this._label_extendLinesLeft = null;
    this._label_extendLinesRight = null;
    this._label_extendLinesTop = null;
    this._label_extendLinesBottom = null;
    this._label_reverse = null;
    this._label_levels = null;
    this._label_levelPrices = null;
    this._label_levelPercents = null;
    this._label_background = null;
    // this._label_magnetToLabel = this._dialog.find(`${FIBONACCI_DIALOG_ID.LABEL}magnetToLabel`);
    // magnetMode
    this._input_magnetTo = this._dialog.find(
      `${FIBONACCI_DIALOG_ID.INPUT}magnetTo`
    );
    this._input_magnetMode = this._dialog.find(
      `${FIBONACCI_DIALOG_ID.INPUT}magnetMode`
    );
  }

  private _setDialogFields(partially?: boolean): void {
    this._generateTrendLine();
    this._addLinePanel();
    this._generateRetracementsOptions();
    this._generateLevelParameters();
    this._generateLabelsParameters();
    this._generateBackgroundParameters();

    this._defineDomObjects();

    this._setTrendLineParameters();
    this._setRetracementsOptions();
    this._setLevelParameters();
    this._setLabelsParameters();
    this._setBackgroundParameters();

    this._setValues(partially);
    this._switchView();
  }

  private _setDrawingConfig(config: any): void {
    this._showTrendLine = config.showTrendLine;
    this._showLevelValues = config.showLevelValues;
    this._showLevelPrices = config.showLevelPrices;
    this._showLevelPercents = config.showLevelPercents;
    this._showLevelBackgrounds = config.showLevelBackgrounds;
    this._levelLinesExtension = (<any>config).levelLinesExtension;
    this._reverse = (<any>config).reverse;
    this._levelTextHorPosition = config.levelTextHorPosition;
    this._levelTextVerPosition = config.levelTextVerPosition;

    this._levels = $.extend(true, [], config.levels);
  }

  private _setLabelState(label: JQuery, state: boolean): void {
    state ? label.removeClass("disabled") : label.addClass("disabled");
  }

  private _setLevelLinesExtension(
    isEnabled: boolean,
    changedSide: string,
    anotherSide: string
  ): void {
    if (isEnabled) {
      this._levelLinesExtension =
        this._levelLinesExtension === changedSide
          ? FibonacciLevelLineExtension.BOTH
          : anotherSide;
    } else if (this._levelLinesExtension === FibonacciLevelLineExtension.BOTH) {
      this._levelLinesExtension = changedSide;
    } else {
      this._levelLinesExtension = FibonacciLevelLineExtension.NONE;
    }
  }

  private _setLineState(isEnabled: boolean, index: number): void {
    let input_lineColor = this._panelFigureLine
      .find(`${FIBONACCI_DIALOG_ID.INPUT}lineColor`)
      .eq(index);
    let input_lineLevel = this._panelFigureLine
      .find(`${FIBONACCI_DIALOG_ID.INPUT}lineLevel`)
      .eq(index);
    let input_lineWidth = this._panelFigureLine
      .find(`${FIBONACCI_DIALOG_ID.INPUT}lineWidth`)
      .eq(index);
    let input_lineStyle = this._panelFigureLine
      .find(`${FIBONACCI_DIALOG_ID.INPUT}lineStyle:even`)
      .eq(index);

    if (isEnabled) {
      input_lineColor.spectrum("enable");
      input_lineStyle.removeAttr("disabled");
      input_lineStyle.selectpicker("refresh");
      input_lineWidth.scxNumericField("enable");
      input_lineLevel.scxNumericField("enable");
      this._levels[index].visible = true;
    } else {
      input_lineColor.spectrum("disable");
      input_lineStyle.attr("disabled", "disabled");
      input_lineStyle.selectpicker("refresh");
      input_lineWidth.scxNumericField("disable");
      input_lineLevel.scxNumericField("disable");
      this._levels[index].visible = false;
    }
  }

  private _setTrendLineState(isEnabled: boolean): void {
    if (isEnabled) {
      this._label_trendLine.removeClass("disabled");
      this._input_trendLineColor.spectrum("enable");
      this._input_trendLineWidth.scxNumericField("enable");
      this._input_trendLineStyle.removeAttr("disabled");
      this._input_trendLineStyle.selectpicker("refresh");
      this._showTrendLine = true;
    } else {
      this._label_trendLine.addClass("disabled");
      this._input_trendLineColor.spectrum("disable");
      this._input_trendLineWidth.scxNumericField("disable");
      this._input_trendLineStyle.attr("disabled", "disabled");
      this._input_trendLineStyle.selectpicker("refresh");
      this._showTrendLine = false;
    }
  }

  private _setLevelsState(isEnabled: boolean): void {
    if (isEnabled) {
      this._label_levels.removeClass("disabled");
      if (this._chk_levelsPriceEnabled.isChecked())
        this._label_levelPrices.removeClass("disabled");
      if (this._chk_levelsPercentEnabled.isChecked())
        this._label_levelPercents.removeClass("disabled");
      this._chk_levelsPriceEnabled.enable();
      this._chk_levelsPercentEnabled.enable();
    } else {
      this._label_levels.addClass("disabled");
      this._label_levelPrices.addClass("disabled");
      this._label_levelPercents.addClass("disabled");
      this._chk_levelsPriceEnabled.disable();
      this._chk_levelsPercentEnabled.disable();
    }
    FibonacciDrawingSettingsDialog._switcherySettings.disabled = false;
  }

  private _switchView(): void {
    this._panelFigureLine.show();
    this._panelFigure.show();

    switch (this._config.drawing.className) {
      // @if SCX_LICENSE = 'full'
      case DrawingClassNames.FibonacciArcsDrawing:
        this._panelFigureRetracementsOptionsPanel.hide();
        this._levelsPriceEnabled.hide();
        this._labelsHorEnabled.show();
        this._panelFigureTrendLinePanel.show();

        return;
      case DrawingClassNames.FibonacciEllipsesDrawing:
        this._panelFigureRetracementsOptionsPanel.hide();
        this._labelsHorEnabled.show();
        this._levelsPriceEnabled.hide();
        this._panelFigureTrendLinePanel.show();

        return;
      case DrawingClassNames.FibonacciTimeZonesDrawing:
        this._levelsExtendHorEnabled.hide();
        this._levelsExtendVerEnabled.show();
        this._levelsReverseEnabled.hide();
        this._panelFigureRetracementsOptionsPanel.show();
        this._levelsPriceEnabled.hide();
        this._levelsPercentEnabled.hide();
        this._panelFigureTrendLinePanel.show();

        return;
      // @endif
      case DrawingClassNames.FibonacciRetracementsDrawing:
        this._levelsExtendHorEnabled.show();
        this._levelsExtendVerEnabled.hide();
        this._levelsReverseEnabled.show();
        this._panelFigureRetracementsOptionsPanel.show();
        this._panelFigureTrendLinePanel.show();

        return;
      case DrawingClassNames.FibonacciFanDrawing:
        this._panelFigureRetracementsOptionsPanel.hide();
        this._panelFigureTrendLinePanel.hide();
        this._labelsHorEnabled.hide();

        return;
      case DrawingClassNames.FibonacciExtensionsDrawing:
        this._levelsExtendHorEnabled.show();
        this._levelsExtendVerEnabled.hide();
        this._levelsReverseEnabled.show();
        this._panelFigureRetracementsOptionsPanel.show();
        this._panelFigureTrendLinePanel.show();

        return;
      default:
        return;
    }
  }

  private _setDialogTitle() {
    this._title.scxLocalize(
      `fibonacciDrawing.title.${this._config.drawing.className}`
    );
  }

  private _setValues(partially?: boolean): void {
    let drawing = this._config.drawing;

    if (!partially || (partially && this._tabs.activeIndex() === Tab.LEVELS)) {
      for (let i = 0; i < this._levels.length; i++) {
        let level = this._levels[i];
        let isTimeZones = false;
        // @if SCX_LICENSE = 'full'
        isTimeZones =
          drawing.className === DrawingClassNames.FibonacciTimeZonesDrawing;
        // @endif
        (<HTMLInputElement>this._input_lineLevel[i]).value = isTimeZones
          ? level.value
          : level.value.toFixed(3);

        let input_lineColor = this._dialog
            .find(`${FIBONACCI_DIALOG_ID.INPUT}lineColor`)
            .eq(i),
          input_lineWidth = this._dialog
            .find(`${FIBONACCI_DIALOG_ID.INPUT}lineWidth`)
            .eq(i),
          input_lineStyle = this._dialog
            .find(`${FIBONACCI_DIALOG_ID.INPUT}lineStyle:even`)
            .eq(i),
          lineTheme =
            (level.theme && level.theme.line) ||
            (drawing.actualTheme && drawing.actualTheme.line),
          linePropertiesConfig: ILinePropertiesHandlerConfig = {
            colorPicker: input_lineColor,
            widthInput: input_lineWidth,
            lineStyleDropdown: input_lineStyle
          },
          linePropertiesHandler = new LinePropertiesHandler(
            linePropertiesConfig
          );

        linePropertiesHandler.theme = lineTheme;
      }

      if (drawing.className !== DrawingClassNames.FibonacciFanDrawing) {
        let linePropertiesConfig: ILinePropertiesHandlerConfig = {
            colorPicker: this._input_trendLineColor,
            widthInput: this._input_trendLineWidth,
            lineStyleDropdown: this._input_trendLineStyle
          },
          linePropertiesHandler = new LinePropertiesHandler(
            linePropertiesConfig
          );

        linePropertiesHandler.theme = drawing.actualTheme.trendLine;
      }
    }

    if (!partially || (partially && this._tabs.activeIndex() === Tab.TOOLTIP))
      this._loadTooltipView(drawing.tooltip);

    if (!partially || (partially && this._tabs.activeIndex() === Tab.POINTS)) {
      this._input_magnetMode
        .selectpicker("val", this._config.drawing.magnetMode)
        .selectpicker("refresh");
      this._input_magnetTo
        .selectpicker("val", this._config.drawing.magnetPoint)
        .selectpicker("refresh");

      if (!this._coordinatePanel)
        this._coordinatePanel = new CoordinatePanel(this._panelPoints);

      this._coordinatePanel.setValues(this._config.drawing);
    }

    this._config.chart.localize(this._dialog);
  }

  private _getValues(): void {
    for (let i = 0; i < this._levels.length; i++) {
      let level = this._levels[i];
      // let isTimeZones = false;
      // @if SCX_LICENSE = 'full'
      // isTimeZones = this._config.drawing.className !== DrawingClassNames.FibonacciTimeZonesDrawing;
      // @endif

      level.value = parseFloat(
        (<HTMLInputElement>this._input_lineLevel[i]).value
      );

      let input_lineColor = this._dialog
          .find(`${FIBONACCI_DIALOG_ID.INPUT}lineColor`)
          .eq(i),
        input_lineWidth = this._dialog
          .find(`${FIBONACCI_DIALOG_ID.INPUT}lineWidth`)
          .eq(i),
        input_lineStyle = this._dialog
          .find(`${FIBONACCI_DIALOG_ID.INPUT}lineStyle:even`)
          .eq(i),
        linePropertiesConfig: ILinePropertiesHandlerConfig = {
          colorPicker: input_lineColor,
          widthInput: input_lineWidth,
          lineStyleDropdown: input_lineStyle
        },
        linePropertiesHandler = new LinePropertiesHandler(linePropertiesConfig);
      if (!level.theme) level.theme = {};
      if (!level.theme.line) level.theme.line = {};
      if (!level.theme.fill) level.theme.fill = {};
      if (!level.theme.text) {
        level.theme.text = this._config.drawing.actualTheme.text
          ? $.extend(true, {}, this._config.drawing.actualTheme.text)
          : {};
      }

      level.theme.line = linePropertiesHandler.theme;

      let fillColor = input_lineColor.spectrum("get").toRgb();
      level.theme.text.fillColor = tinycolor(fillColor).toRgbString();
      fillColor.a = 0.3;
      level.theme.fill.fillColor = tinycolor(fillColor).toRgbString(); // TODO: to add alpha channel
    }

    let theme = (this._config.drawing.theme = $.extend(
      true,
      {},
      this._config.drawing.actualTheme
    ));
    if (
      this._config.drawing.className !== DrawingClassNames.FibonacciFanDrawing
    ) {
      let linePropertiesConfig: ILinePropertiesHandlerConfig = {
          colorPicker: this._input_trendLineColor,
          widthInput: this._input_trendLineWidth,
          lineStyleDropdown: this._input_trendLineStyle
        },
        linePropertiesHandler = new LinePropertiesHandler(linePropertiesConfig);

      theme.trendLine = linePropertiesHandler.theme;
    }

    this._levelTextHorPosition = this._input_labelsPosition.val();
    this._levelTextVerPosition = this._input_labelsTextPosition.val();
  }

  public resetToDefaults(): void {
    let defaultTheme = this._config.drawing.defaultTheme,
      defaults,
      defaultConfig;

    if (this._tabs.activeIndex() === Tab.LEVELS) {
      switch (this._config.drawing.className) {
        // @if SCX_LICENSE = 'full'
        case DrawingClassNames.FibonacciArcsDrawing:
          defaults = DrawingDefaults.FibonacciArcsDrawing;
          break;
        case DrawingClassNames.FibonacciEllipsesDrawing:
          defaults = DrawingDefaults.FibonacciEllipsesDrawing;
          break;
        // @endif
        case DrawingClassNames.FibonacciRetracementsDrawing:
          defaults = DrawingDefaults.FibonacciRetracementsDrawing;
          break;
        case DrawingClassNames.FibonacciFanDrawing:
          defaults = DrawingDefaults.FibonacciFanDrawing;
          break;
        case DrawingClassNames.FibonacciExtensionsDrawing:
          defaults = DrawingDefaults.FibonacciExtensionsDrawing;
          break;
        // @if SCX_LICENSE = 'full'
        case DrawingClassNames.FibonacciTimeZonesDrawing:
          defaults = DrawingDefaults.FibonacciTimeZonesDrawing;
          break;
        // @endif
        default:
          break;
      }
      defaultConfig = $.extend(
        false,
        DrawingDefaults.FibonacciDrawingBase,
        defaults
      );

      this._clearDialogFields();
      this._setDrawingConfig(defaultConfig);
      this._setDialogFields(true);
      this.resize();

      if (
        this._config.drawing.className !== DrawingClassNames.FibonacciFanDrawing
      ) {
        this._input_trendLineColor.spectrum(
          "set",
          defaultTheme.trendLine.strokeColor
        );
        this._input_trendLineWidth.scxNumericField(
          "setValue",
          defaultTheme.trendLine.width
        );
        this._input_trendLineStyle
          .selectpicker("val", defaultTheme.trendLine.lineStyle)
          .selectpicker("refresh");
      }
    }

    if (this._tabs.activeIndex() === Tab.TOOLTIP)
      this._tooltipView.resetToDefaults();

    if (this._tabs.activeIndex() === Tab.POINTS) {
      this._input_magnetMode
        .selectpicker("val", MagnetMode.NONE)
        .selectpicker("refresh");
      this._input_trendLineStyle
        .selectpicker("val", defaultTheme.trendLine.lineStyle)
        .selectpicker("refresh");
      this._input_magnetTo
        .selectpicker("val", MagnetPoint.BAR)
        .selectpicker("refresh");

      this._coordinatePanel.setValues(this._config.drawing);
    }

    this._config.chart.localize(this._dialog);
  }

  private _apply(): void {
    if (!this._config.drawing.chart) return;

    let drawing = this._config.drawing;

    this._getValues();

    if (this._tooltipView) this._tooltipView.apply();

    // apply magnet
    if (!drawing.magnetMode) {
      drawing.magnetPoint = MagnetPoint.BAR;
      drawing.magnetMode = MagnetMode.NONE;
    } else {
      drawing.magnetPoint = this._input_magnetTo.val();
      drawing.magnetMode = this._input_magnetMode.val();
    }

    this._coordinatePanel.apply();

    drawing.showTrendLine = this._showTrendLine;
    drawing.showLevels = this._showLevelValues;
    drawing.showLevelPrices = this._showLevelPrices;
    drawing.showLevelPercents = this._showLevelPercents;
    drawing.showLevelBackgrounds = this._showLevelBackgrounds;
    if ((<any>drawing).levelLinesExtension !== undefined)
      (<any>drawing).levelLinesExtension = this._levelLinesExtension;
    if ((<any>drawing).reverse !== undefined)
      (<any>drawing).reverse = this._reverse;
    drawing.levelTextHorPosition = this._levelTextHorPosition;
    drawing.levelTextVerPosition = this._levelTextVerPosition;

    drawing.levels = this._levels;
    drawing.chartPanel.update();

    this._isApplyClicked = true;
  }

  private _save(): void {
    this._apply();
    this.hide();
  }

  private _addNewLinePanel(): void {
    let theme = this._config.drawing.actualTheme;
    this._getValues();
    this._levels.push({
      value: 0,
      visible: true,
      theme: $.extend(true, {}, { line: theme.line })
    });
    this._clearLinePanel();
    this._addLinePanel();
    this._setValues(true);
    this.resize();
  }

  private _addLinePanel(): void {
    this._levels.forEach(() => {
      this._generateLinePanel();
    });

    this._defineDomLevelObjects();
    this._setLinePanelsProperties();
  }

  private _deleteLinePanel(e: JQueryEventObject) {
    this._getValues();
    let index = $(e.currentTarget).index(
      ".scxFibonacciDrawingDialog_panel_deleteLinePanel"
    );
    this._levels.splice(index, 1);
    this._panelFigureLine.eq(index).remove();
    this._clearLinePanel();
    this._addLinePanel();
    this._setValues(true);
    this.resize();
  }

  private _clearDialogFields(): void {
    $(".scxDropdown").removeClass("open");
    this._clearLinePanel();
    this._clearDialogParameters();
  }

  private _clearLinePanel(): void {
    this._panelFigureLine.remove();
    $("body")
      .find(`${FIBONACCI_DIALOG_ID.INPUT}lineColor${CLASS_SPECTRUM}`)
      .remove();
  }

  private _clearDialogParameters(): void {
    this._panelFigureRetracementsOptions.remove();
    this._panelFigureTrendLine.remove();
    this._panelFigureLevelParameters.remove();
    this._panelFigureLabelsParameters.remove();
    this._panelFigureBackground.remove();
  }

  private _setBackgroundParameters(): void {
    let backgroundSwitcher = this._dialog.find(
      `${FIBONACCI_DIALOG_ID.CHECK}background`
    );
    let chk_backgroundEnabled = new Switchery(
      backgroundSwitcher[0],
      FibonacciDrawingSettingsDialog._switcherySettings
    );

    chk_backgroundEnabled.setPosition(this._showLevelBackgrounds);
    this._setLabelState(this._label_background, this._showLevelBackgrounds);
  }

  private _setLabelsParameters(): void {
    this._input_labelsPosition.selectpicker({ container: "body" });
    this._input_labelsPosition
      .selectpicker("val", this._levelTextHorPosition)
      .selectpicker("refresh");
    this._input_labelsTextPosition.selectpicker({ container: "body" });
    this._input_labelsTextPosition
      .selectpicker("val", this._levelTextVerPosition)
      .selectpicker("refresh");
  }

  private _setRetracementsOptions(): void {
    let extendLinesLeft = this._dialog.find(
      `${FIBONACCI_DIALOG_ID.CHECK}extendLinesLeft`
    );
    let chk_extendLinesLeftEnabled = new Switchery(
      extendLinesLeft[0],
      FibonacciDrawingSettingsDialog._switcherySettings
    );

    let extendLinesRight = this._dialog.find(
      `${FIBONACCI_DIALOG_ID.CHECK}extendLinesRight`
    );
    let chk_extendLinesRightEnabled = new Switchery(
      extendLinesRight[0],
      FibonacciDrawingSettingsDialog._switcherySettings
    );

    let extendLinesTop = this._dialog.find(
      `${FIBONACCI_DIALOG_ID.CHECK}extendLinesTop`
    );
    let chk_extendLinesTopEnabled = new Switchery(
      extendLinesTop[0],
      FibonacciDrawingSettingsDialog._switcherySettings
    );

    let extendLinesBottom = this._dialog.find(
      `${FIBONACCI_DIALOG_ID.CHECK}extendLinesBottom`
    );
    let chk_extendLinesBottomEnabled = new Switchery(
      extendLinesBottom[0],
      FibonacciDrawingSettingsDialog._switcherySettings
    );

    let linesReverse = this._dialog.find(
      `${FIBONACCI_DIALOG_ID.CHECK}linesReverse`
    );
    let chk_linesReverseEnabled = new Switchery(
      linesReverse[0],
      FibonacciDrawingSettingsDialog._switcherySettings
    );
    chk_linesReverseEnabled.setPosition(this._reverse);
    this._setLabelState(this._label_reverse, this._reverse);

    switch (this._levelLinesExtension) {
      case FibonacciLevelLineExtension.NONE:
        chk_extendLinesLeftEnabled.setPosition(false);
        chk_extendLinesRightEnabled.setPosition(false);
        chk_extendLinesTopEnabled.setPosition(false);
        chk_extendLinesBottomEnabled.setPosition(false);

        this._setLabelState(this._label_extendLinesLeft, false);
        this._setLabelState(this._label_extendLinesRight, false);
        this._setLabelState(this._label_extendLinesTop, false);
        this._setLabelState(this._label_extendLinesBottom, false);

        return;
      case FibonacciLevelLineExtension.LEFT:
        chk_extendLinesLeftEnabled.setPosition(true);
        this._setLabelState(this._label_extendLinesLeft, true);

        return;
      case FibonacciLevelLineExtension.RIGHT:
        chk_extendLinesRightEnabled.setPosition(true);
        this._setLabelState(this._label_extendLinesRight, true);

        return;
      case FibonacciLevelLineExtension.TOP:
        chk_extendLinesTopEnabled.setPosition(true);
        this._setLabelState(this._label_extendLinesTop, true);

        return;
      case FibonacciLevelLineExtension.BOTTOM:
        chk_extendLinesBottomEnabled.setPosition(true);
        this._setLabelState(this._label_extendLinesBottom, true);

        return;
      case FibonacciLevelLineExtension.BOTH:
        chk_extendLinesLeftEnabled.setPosition(true);
        chk_extendLinesRightEnabled.setPosition(true);
        chk_extendLinesTopEnabled.setPosition(true);
        chk_extendLinesBottomEnabled.setPosition(true);

        this._setLabelState(this._label_extendLinesLeft, true);
        this._setLabelState(this._label_extendLinesRight, true);
        this._setLabelState(this._label_extendLinesTop, true);
        this._setLabelState(this._label_extendLinesBottom, true);

        return;
      default:
        return;
    }
  }

  private _setLevelParameters(): void {
    let levelsValue = this._dialog.find(
        `${FIBONACCI_DIALOG_ID.CHECK}levelsValue`
      ),
      chk_levelsValueEnabled = new Switchery(
        levelsValue[0],
        FibonacciDrawingSettingsDialog._switcherySettings
      );

    let levelsPrice = this._dialog.find(
      `${FIBONACCI_DIALOG_ID.CHECK}levelsPrice`
    );
    this._chk_levelsPriceEnabled = new Switchery(
      levelsPrice[0],
      FibonacciDrawingSettingsDialog._switcherySettings
    );

    let levelsPercents = this._dialog.find(
      `${FIBONACCI_DIALOG_ID.CHECK}levelsPercent`
    );
    this._chk_levelsPercentEnabled = new Switchery(
      levelsPercents[0],
      FibonacciDrawingSettingsDialog._switcherySettings
    );

    this._chk_levelsPriceEnabled.setPosition(this._showLevelPrices);
    this._chk_levelsPercentEnabled.setPosition(this._showLevelPercents);
    chk_levelsValueEnabled.setPosition(this._showLevelValues);

    if (!this._showLevelValues) this._setLevelsState(this._showLevelValues);
  }

  private _setTrendLineParameters(): void {
    this._input_trendLineWidth.scxNumericField(
      FibonacciDrawingSettingsDialog._numericFieldConfig
    );

    let trendLineSwitcher = Array.prototype.slice.call(
      this._panelFigureTrendLinePanel.find(".js-switch")
    );

    if (trendLineSwitcher.length !== 0) {
      this._chk_trendLineEnabled = new Switchery(
        trendLineSwitcher[0],
        FibonacciDrawingSettingsDialog._switcherySettings
      );
      this._chk_trendLineEnabled.setPosition(this._showTrendLine);
      this._setTrendLineState(this._showTrendLine);
    }
  }

  private _setLinePanelsProperties(): void {
    // @if SCX_LICENSE = 'full'
    if (
      this._config.drawing.className ===
      DrawingClassNames.FibonacciTimeZonesDrawing
    )
      this._input_lineLevel.scxNumericField(
        FibonacciDrawingSettingsDialog._numericTimeZoneFieldConfig
      );
    // @endif
    else
      this._input_lineLevel.scxNumericField(
        FibonacciDrawingSettingsDialog._numericDoubleFieldConfig
      );

    this._input_lineWidth.scxNumericField(
      FibonacciDrawingSettingsDialog._numericFieldConfig
    );

    this._input_lineStyle.selectpicker({ container: "body" });

    this._dialog
      .find("#scxFibonacciDrawingDialog_panel_levels .scxSpectrum")
      .scx()
      .colorPicker({
        containerClassName: CLASS_SPECTRUM,
        localStorageKey: "scxThemeDialog_spectrum",
        showAlpha: true
      });

    let switchery = Array.prototype.slice.call(
      this._panelFigureLine.find(".js-switch")
    );

    for (let i = 0; i < switchery.length; i++) {
      let chk_lineEnabled = new Switchery(
        switchery[i],
        FibonacciDrawingSettingsDialog._switcherySettings
      );

      if (typeof this._levels[i].visible === "undefined")
        this._levels[i].visible = true;

      chk_lineEnabled.setPosition(this._levels[i].visible);
      this._setLineState(this._levels[i].visible, i);
    }
  }

  private _generateLinePanel(): void {
    // tslint:disable prefer-template
    $(
      '<tr class="scxFibonacciDrawingDialog_panel_figure_linePanel">' +
        "<td>" +
        '<span class="scxFibonacciDrawingDialog_panel_figure_lineEnabled">' +
        '<input class="scxFibonacciDrawingDialog_chk_lineEnable js-switch" type="checkbox"/>' +
        "</span>" +
        '<input class="scxFibonacciDrawingDialog_input_lineLevel form-control" type="text">' +
        '<input class="scxFibonacciDrawingDialog_input_lineColor scxSpectrum" type="text">' +
        '<input class="scxFibonacciDrawingDialog_input_lineWidth form-control" type="text">' +
        '<select class="scxFibonacciDrawingDialog_input_lineStyle scxLineStyleSelector scxDropdown">' +
        '<option value="solid" data-manuali18="indicatorSettingsDialog.solid">&nbsp;</option>' +
        '<option value="dash" data-manuali18="indicatorSettingsDialog.dash">&nbsp;</option>' +
        '<option value="dot" data-manuali18="indicatorSettingsDialog.dot">&nbsp;</option>' +
        '<option value="dash-dot" data-manuali18="indicatorSettingsDialog.dashDot">&nbsp;</option>' +
        "</select>" +
        '<a href="#" aria-hidden="true" class="close scxFibonacciDrawingDialog_panel_deleteLinePanel">&#215;</a>' +
        "</td>" +
        "</tr>"
    ).appendTo(this._panelFigure.find("table"));
    // tslint:enable
  }

  private _generateTrendLine(): void {
    // tslint:disable prefer-template
    $(
      '<tr class="scxFibonacciDrawingDialog_panel_figure_trendLine">' +
        "<td>" +
        '<span class="scxFibonacciDrawingDialog_panel_figure_trendEnabled">' +
        '<input class="scxFibonacciDrawingDialog_chk_trendLine js-switch" type="checkbox"/>' +
        "</span>" +
        '<label class="scxFibonacciDrawingDialog_label_trendLine">Trend Line</label>' +
        '<input class="scxFibonacciDrawingDialog_input_lineColor scxSpectrum" type="text">' +
        '<input class="scxFibonacciDrawingDialog_input_lineWidth form-control" type="text">' +
        '<select class="scxFibonacciDrawingDialog_input_lineStyle scxLineStyleSelector scxDropdown">' +
        '<option value="solid" data-manuali18="indicatorSettingsDialog.solid">&nbsp;</option>' +
        '<option value="dash" data-manuali18="indicatorSettingsDialog.dash">&nbsp;</option>' +
        '<option value="dot" data-manuali18="indicatorSettingsDialog.dot">&nbsp;</option>' +
        '<option value="dash-dot" data-manuali18="indicatorSettingsDialog.dashDot">&nbsp;</option>' +
        "</select>" +
        "</td>" +
        "</tr>"
    ).appendTo(this._panelFigureTrendLinePanel.find("table"));
    // tslint:enable
  }

  private _generateRetracementsOptions(): void {
    // tslint:disable prefer-template
    $(
      '<tr class="scxFibonacciDrawingDialog_panel_figure_retracementsOptions">' +
        "<td>" +
        '<div class="scxFibonacciDrawingDialog_extendHor">' +
        '<span class="scxFibonacciDrawingDialog_panel_figure_lineEnabled">' +
        '<input class="scxFibonacciDrawingDialog_chk_extendLinesLeft js-switch" type="checkbox"/>' +
        "</span>" +
        '<label class="scxFibonacciDrawingDialog_label_extendLinesLeft">Extend Left</label>' +
        '<span class="scxFibonacciDrawingDialog_panel_figure_lineEnabled">' +
        '<input class="scxFibonacciDrawingDialog_chk_extendLinesRight js-switch" type="checkbox"/>' +
        "</span>" +
        '<label class="scxFibonacciDrawingDialog_label_extendLinesRight">Extend Right</label>' +
        "</div>" +
        '<div class="scxFibonacciDrawingDialog_extendVer">' +
        '<span class="scxFibonacciDrawingDialog_panel_figure_lineEnabled">' +
        '<input class="scxFibonacciDrawingDialog_chk_extendLinesTop js-switch" type="checkbox"/>' +
        "</span>" +
        '<label class="scxFibonacciDrawingDialog_label_extendLinesTop">Extend Top</label>' +
        '<span class="scxFibonacciDrawingDialog_panel_figure_lineEnabled">' +
        '<input class="scxFibonacciDrawingDialog_chk_extendLinesBottom js-switch" type="checkbox"/>' +
        "</span>" +
        '<label class="scxFibonacciDrawingDialog_label_extendLinesBottom">Extend Bottom</label>' +
        "</div>" +
        '<div class="scxFibonacciDrawingDialog_reverse">' +
        '<span class="scxFibonacciDrawingDialog_panel_figure_lineEnabled">' +
        '<input class="scxFibonacciDrawingDialog_chk_linesReverse js-switch" type="checkbox"/>' +
        "</span>" +
        '<label class="scxFibonacciDrawingDialog_label_linesReverse">Reverse</label>' +
        "</div>" +
        "</td>" +
        "</tr>"
    ).appendTo(this._panelFigureRetracementsOptionsPanel.find("table"));
    // tslint:enable
  }

  private _generateLevelParameters(): void {
    // tslint:disable prefer-template
    $(
      '<tr class="scxFibonacciDrawingDialog_panel_figure_levelParameters">' +
        "<td>" +
        '<span class="scxFibonacciDrawingDialog_panel_figure_lineEnabled">' +
        '<input class="scxFibonacciDrawingDialog_chk_levelsValue js-switch" type="checkbox"/>' +
        "</span>" +
        '<label class="scxFibonacciDrawingDialog_label_levels">Levels</label>' +
        '<div class="scxFibonacciDrawingDialog_levelsPrice">' +
        '<span class="scxFibonacciDrawingDialog_panel_figure_lineEnabled">' +
        '<input class="scxFibonacciDrawingDialog_chk_levelsPrice js-switch" type="checkbox"/>' +
        "</span>" +
        '<label class="scxFibonacciDrawingDialog_label_prices">Prices</label> ' +
        "</div>" +
        '<div class="scxFibonacciDrawingDialog_levelsPercent">' +
        '<span class="scxFibonacciDrawingDialog_panel_figure_lineEnabled">' +
        '<input class="scxFibonacciDrawingDialog_chk_levelsPercent js-switch" type="checkbox"/>' +
        "</span>" +
        '<label class="scxFibonacciDrawingDialog_label_percents">Percents</label>' +
        "</div>" +
        "</td>" +
        "</tr>"
    ).appendTo(this._panelFigureLevelParametersPanel.find("table"));
    // tslint:enable
  }

  private _generateLabelsParameters(): void {
    // tslint:disable prefer-template
    $(
      '<tr class="scxFibonacciDrawingDialog_panel_figure_labels">' +
        "<td>" +
        '<label class="scxFibonacciDrawingDialog_label">Labels</label>' +
        '<div class="scxFibonacciDrawingDialog_labelsPosition">' +
        '<select class="scxFibonacciDrawingDialog_input_labelsPosition scxDropdown">' +
        '<option value="left" data-i18n="indicatorSettingsDialog.left"></option>' +
        '<option value="center" data-i18n="indicatorSettingsDialog.center"></option>' +
        '<option value="right" data-i18n="indicatorSettingsDialog.right"></option>' +
        "</select>" +
        "</div>" +
        '<select class="scxFibonacciDrawingDialog_input_labelsTextPosition scxDropdown">' +
        '<option value="top" data-i18n="indicatorSettingsDialog.top"></option>' +
        '<option value="middle" data-i18n="indicatorSettingsDialog.middle"></option>' +
        '<option value="bottom" data-i18n="indicatorSettingsDialog.bottom"></option>' +
        "</select>" +
        "</td>" +
        "</tr>"
    ).appendTo(this._panelFigureLabelsParametersPanel.find("table"));
    // tslint:enable
  }

  private _generateBackgroundParameters(): void {
    // tslint:disable prefer-template
    $(
      '<tr class="scxFibonacciDrawingDialog_panel_figure_background">' +
        "<td>" +
        '<span class="scxFibonacciDrawingDialog_panel_figure_lineEnabled">' +
        '<input class="scxFibonacciDrawingDialog_chk_background js-switch" type="checkbox"/>' +
        "</span>" +
        '<label class="scxFibonacciDrawingDialog_label_background">Background</label>' +
        "</td>" +
        "</tr>"
    ).appendTo(this._panelFigureBackgroundPanel.find("table"));
    // tslint:enable
  }

  private _defineDomObjects() {
    let figureId = FIBONACCI_DIALOG_ID.FIGURE,
      inputId = FIBONACCI_DIALOG_ID.INPUT,
      checkId = FIBONACCI_DIALOG_ID.CHECK;

    this._panelFigureTrendLine = this._dialog.find(`${figureId}trendLine`);
    this._panelFigureLevelParameters = this._dialog.find(
      `${figureId}levelParameters`
    );
    this._panelFigureRetracementsOptions = this._dialog.find(
      `${figureId}retracementsOptions`
    );
    this._panelFigureLabelsParameters = this._dialog.find(`${figureId}labels`);
    this._panelFigureBackground = this._dialog.find(`${figureId}background`);
    this._input_trendLineColor = this._panelFigureTrendLinePanel.find(
      `${inputId}lineColor`
    );
    this._input_trendLineWidth = this._panelFigureTrendLinePanel.find(
      `${inputId}lineWidth`
    );
    this._input_trendLineStyle = this._panelFigureTrendLinePanel.find(
      `${inputId}lineStyle`
    );
    this._input_labelsPosition = this._panelFigureLabelsParametersPanel.find(
      `${inputId}labelsPosition`
    );
    this._input_labelsTextPosition = this._panelFigureLabelsParametersPanel.find(
      `${inputId}labelsTextPosition`
    );
    this._chk_trendLineEnabledHTMLObj = this._dialog.find(
      `${checkId}trendLine`
    );
    this._chk_levelsValueEnabledHTMLObj = this._dialog.find(
      `${checkId}levelsValue`
    );
    this._chk_levelsPriceEnabledHTMLObj = this._dialog.find(
      `${checkId}levelsPrice`
    );
    this._chk_levelsPercentEnabledHTMLObj = this._dialog.find(
      `${checkId}levelsPercent`
    );
    this._chk_linesReverseEnabledHTMLObj = this._dialog.find(
      `${checkId}linesReverse`
    );
    this._chk_extendLinesLeftEnabledHTMLObj = this._dialog.find(
      `${checkId}extendLinesLeft`
    );
    this._chk_extendLinesRightEnabledHTMLObj = this._dialog.find(
      `${checkId}extendLinesRight`
    );
    this._chk_extendLinesTopEnabledHTMLObj = this._dialog.find(
      `${checkId}extendLinesTop`
    );
    this._chk_extendLinesBottomEnabledHTMLObj = this._dialog.find(
      `${checkId}extendLinesBottom`
    );
    this._chk_backgroundEnabledHTMLObj = this._dialog.find(
      `${checkId}background`
    );
    this._levelsPriceEnabled = this._dialog.find(
      ".scxFibonacciDrawingDialog_levelsPrice"
    );
    this._levelsPercentEnabled = this._dialog.find(
      ".scxFibonacciDrawingDialog_levelsPercent"
    );
    this._levelsExtendHorEnabled = this._dialog.find(
      ".scxFibonacciDrawingDialog_extendHor"
    );
    this._levelsExtendVerEnabled = this._dialog.find(
      ".scxFibonacciDrawingDialog_extendVer"
    );
    this._labelsHorEnabled = this._dialog.find(
      ".scxFibonacciDrawingDialog_labelsPosition"
    );
    this._levelsReverseEnabled = this._dialog.find(
      ".scxFibonacciDrawingDialog_reverse"
    );
    this._label_trendLine = this._dialog.find(
      ".scxFibonacciDrawingDialog_label_trendLine"
    );
    this._label_extendLinesLeft = this._dialog.find(
      ".scxFibonacciDrawingDialog_label_extendLinesLeft"
    );
    this._label_extendLinesRight = this._dialog.find(
      ".scxFibonacciDrawingDialog_label_extendLinesRight"
    );
    this._label_extendLinesTop = this._dialog.find(
      ".scxFibonacciDrawingDialog_label_extendLinesTop"
    );
    this._label_extendLinesBottom = this._dialog.find(
      ".scxFibonacciDrawingDialog_label_extendLinesBottom"
    );
    this._label_reverse = this._dialog.find(
      ".scxFibonacciDrawingDialog_label_linesReverse"
    );
    this._label_levels = this._dialog.find(
      ".scxFibonacciDrawingDialog_label_levels"
    );
    this._label_levelPercents = this._dialog.find(
      ".scxFibonacciDrawingDialog_label_percents"
    );
    this._label_levelPrices = this._dialog.find(
      ".scxFibonacciDrawingDialog_label_prices"
    );
    this._label_background = this._dialog.find(
      ".scxFibonacciDrawingDialog_label_background"
    );
  }

  /**
   * @internal
   */
  private _loadTooltipView(tooltip: Tooltip) {
    ViewLoader.tooltipView((fragment: TooltipView) => {
      fragment.container = this._tabTooltip;
      fragment.setValues(tooltip);
      this._tooltipView = fragment;
      this._config.chart.localize(this._dialog);
    });
  }

  private _defineDomLevelObjects() {
    this._panelFigureLine = this._dialog.find(
      `${FIBONACCI_DIALOG_ID.FIGURE}linePanel`
    );
    this._input_lineLevel = this._dialog.find(
      `${FIBONACCI_DIALOG_ID.INPUT}lineLevel`
    );
    // this._input_lineColor                 = this._dialog.find(`${FIBONACCI_DIALOG_ID.INPUT}lineColor`);
    this._input_lineWidth = this._dialog.find(
      `${FIBONACCI_DIALOG_ID.INPUT}lineWidth`
    );
    this._input_lineStyle = this._dialog.find(
      `${FIBONACCI_DIALOG_ID.INPUT}lineStyle`
    );
    this._chk_lineEnabledHTMLObj = this._dialog.find(
      `${FIBONACCI_DIALOG_ID.CHECK}lineEnable`
    );

    let delete_figureLine = this._dialog.find(
      `${FIBONACCI_DIALOG_ID.PANEL}deleteLinePanel`
    );
    delete_figureLine.on("click", (e: JQueryEventObject) => {
      this._deleteLinePanel(e);
    });
  }
}

// @endif
