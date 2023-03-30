import { Chart } from "../index";
import { ChartEvent } from "../index";
import * as TASdk from "../../TASdk/TASdk";

import { IDestroyable } from "../index";
import { ChartPanel } from "../index";
import { ValueScale } from "../index";
import { Plot } from "../index";
import { PlotType } from "../Utils/PlotType";
import {
  IndicatorContextMenu,
  IIndicatorContextMenuConfig
} from "../../StockChartX.UI/index";
import { DataSeries } from "../index";
import { IndicatorField, TAIndicator } from "../index";
import { HistogramPlot } from "../index";
import { LinePlot } from "../index";
import { ViewLoader } from "../../StockChartX.UI/index";
import { IndicatorInfoDialog } from "../../StockChartX.UI/index";
import { IndicatorSettingsDialog } from "../../StockChartX.UI/index";
import { Localization } from "../index";
import { Notification } from "../../StockChartX.UI/index";
import { IValueChangedEvent } from "../index";
// import { IchimokuIndicator } from "../index";
import { IchimokuIndicator, DarvasBox } from "../index";
import {
  IndicatorDefaults,
  IndicatorParam,
  ZIndexVolume,
  Class
} from "./utils";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

"use strict";

const $ = jQuery;

export interface IIndicatorConfig {
  chart?: Chart;
  panelHeightRatio?: number;
  showParamsInTitle?: boolean;
  showValueMarkers?: boolean;
  showValuesInTitle?: boolean;
  showNameInTitle?: boolean;
  allowSettingsDialog?: boolean;
  visible?: boolean;
  valueScaleIndex?: number;
  panelIndex?: number;
  isCustomIndicator?: boolean;
  parameters?: Object;
  coloredVolumeTheme?: any;
  showTitle?: boolean;
}

export interface IIndicatorOptions {
  isDarvasBox?: boolean;
  isIchimokuIndicator?: boolean;
  valueScaleIndex?: number;
  panelHeightRatio: number;
  showValueMarkers: boolean;
  showValuesInTitle: boolean;
  showNameInTitle: boolean;
  showParamsInTitle: boolean;
  allowSettingsDialog: boolean;
  parameters: Object;
  visible: boolean;
  coloredVolumeTheme?: any;
  showTitle?: boolean;
  zIndex?: number;
  panelIndex: number;
}

interface IIndicatorTitleControls {
  name: JQuery;
  parameters: JQuery;
  rootDiv: JQuery;
}

/**
 * Represent abstract chart indicator.
 * @param {Object} config The configuration object.
 * @param {StockChartX.Chart} [config.chart] The parent chart.
 * @param {Object} [config.parameters] The TA indicator parameters.
 * @param {Number} [config.panelHeightRatio] The height ratio of the chart panel.
 * @param {Boolean} [config.showValueMarkers] The flag that indicates whether value markers are visible.
 * @param {Boolean} [config.showValuesInTitle] The flag that indicates whether values are visible in the title.
 * @constructor StockChartX.Indicator
 */
export abstract class Indicator implements IDestroyable {
  /**
   * @internal
   */
  protected _chart: Chart;

  /**
   * @internal
   */
  protected _isOverlay = false;

  /**
   * @internal
   */
  protected _fieldNames: string[];

  /**
   * @internal
   */
  protected _panel: ChartPanel;

  /**
   * @internal
   */
  private _titleControls: IIndicatorTitleControls;

  /**
   * @internal
   */
  protected _plotItems = [];

  /**
   * @internal
   */
  protected _options: IIndicatorOptions = <IIndicatorOptions>{};

  /**
   * @internal
   */
  private _valueScale: ValueScale;
  /**
   * @internal
   */
  _usePrimaryDataSeries = true; // TODO: Temporary solution for renko. Needs to be updated.

  /**
   * @internal
   */
  private _collapseIndicatorTitle = false;

  /**
   * @internal
   */
  private _collapseIndicatorIcon;

  /**
   * The parent chart
   * @name chart
   * @type {StockChartX.Chart}
   * @memberOf StockChartX.Indicator#
   */
  get chart(): Chart {
    return this._chart;
  }

  set chart(value: Chart) {
    if (value && !(value instanceof Chart))
      throw new TypeError("Chart must be an instance of StockChartX.Chart.");

    this._removeControls();
    this._chart = value;
    if (value && this._options.valueScaleIndex)
      this.valueScale = this._chart.valueScales[this._options.valueScaleIndex];
  }

  /**
   * The parent chart panel.
   * @name chartPanel
   * @type {StockChartX.ChartPanel}
   * @readonly
   * @memberOf StockChartX.Indicator#
   */
  get chartPanel(): ChartPanel {
    return this._panel;
  }

  get valueScale(): ValueScale {
    return this._valueScale;
  }

  set valueScale(value: ValueScale) {
    if (value && !(value instanceof ValueScale))
      throw new TypeError(
        "Value scale must be an instance of StockChartX.ValueScale."
      );

    this._valueScale = value;
  }

  /**
   * True if it's an overlay indicator, false otherwise.
   * @name isOverlay
   * @type {boolean}
   * @memberOf StockChartX.Indicator#
   */
  get isOverlay(): boolean {
    return this._isOverlay;
  }

  /**
   * Gets panel height ratio. It is not used in case of overlay indicator.
   * @name panelHeightRatio
   * @type {number}
   * @readonly
   * @memberOf StockChartX.Indicator#
   */
  get panelHeightRatio(): number {
    return this._options.panelHeightRatio;
  }

  /**
   * Gets/Sets flag that indicates whether value markers are visible on the value scale.
   * @name showValueMarkers
   * @type {boolean}
   * @memberof StockChartX.Indicator#
   */
  get showValueMarkers(): boolean {
    return this._options.showValueMarkers;
  }

  set showValueMarkers(value: boolean) {
    value = !!value;

    if (this._options.showValueMarkers !== value) {
      this._options.showValueMarkers = value;
      this.updateTitleControlsVisibility();
    }
  }

  /**
   * Gets/Sets theme for colored volume indicator.
   * @name coloredVolumeTheme
   * @type {object}
   * @memberof StockChartX.Indicator#
   */
  get coloredVolumeTheme(): any {
    return this._options.coloredVolumeTheme;
  }

  set coloredVolumeTheme(value: any) {
    this._options.coloredVolumeTheme = value;
  }

  /**
   * Gets/Sets flag that indicates whether values are visible in the title.
   * @name showValuesInTitle
   * @type {boolean}
   * @memberOf StockChartX.Indicator#
   */
  get showValuesInTitle(): boolean {
    return this._options.showValuesInTitle;
  }

  set showValuesInTitle(value: boolean) {
    value = !!value;

    if (this._options.showValuesInTitle !== value) {
      this._options.showValuesInTitle = value;
      this.updateTitleControlsVisibility();
    }
  }

  get showNameInTitle(): boolean {
    return this._options.showNameInTitle;
  }

  set showNameInTitle(value: boolean) {
    value = !!value;
    if (this._options.showNameInTitle !== value) {
      this._options.showNameInTitle = value;
      this.updateTitleControlsVisibility();
      this._collapseIndicatorName(this._options.showNameInTitle);
    }
  }

  get showParamsInTitle(): boolean {
    return this._options.showParamsInTitle;
  }

  set showParamsInTitle(value: boolean) {
    value = !!value;
    if (this._options.showParamsInTitle !== value) {
      this._options.showParamsInTitle = value;
      this.updateTitleControlsVisibility();
    }
  }

  /**
   * Gets/Sets flag that indicates whether indicator's title is visible.
   * @name showTitle
   * @type {boolean}
   * @memberOf StockChartX.Indicator#
   */
  get showTitle(): boolean {
    return this._options.showTitle;
  }
  set showTitle(value: boolean) {
    if (this._options.showTitle !== value) {
      this._options.showTitle = value;
      this.updateTitleControlsVisibility();
    }
  }

  /**
   * Gets/Sets flag that indicates whether settings dialog are enable in context menu.
   * @name allowSettingsDialog
   * @type {boolean}
   * @memberOf StockChartX.Indicator#
   */
  get allowSettingsDialog(): boolean {
    return this._options.allowSettingsDialog;
  }

  set allowSettingsDialog(value: boolean) {
    value = !!value;

    if (this._options.allowSettingsDialog !== value) {
      this._options.allowSettingsDialog = value;
    }
  }

  /**
   * The indicator parameters.
   * @name parameters
   * @type {object}
   * @memberOf StockChartX.Indicator#
   */
  get parameters() {
    return this._options.parameters;
  }

  get fieldNames(): string[] {
    return this._fieldNames;
  }

  get plots(): Plot[] {
    let plots = [];
    for (let item of this._plotItems) {
      plots.push(item.plot);
    }

    return plots;
  }

  get visible(): boolean {
    return this._options.visible;
  }

  set visible(value: boolean) {
    value = !!value;
    this._options.visible = value;
    for (let i = 0, count = this._plotItems.length; i < count; i++) {
      let plot = this._plotItems[i].plot;
      if (plot) plot.visible = value;
    }
  }

  /**
   * Gets/Sets flag that returns/sets z-index of selected indicator.
   * @name zIndex
   * @type {number}
   * @memberof StockChartX.Indicator#
   */
  get zIndex(): number {
    return this._options.zIndex;
  }
  set zIndex(value: number) {
    this._options.zIndex = value;
    for (let plot of this.plots) {
      plot.zIndex = this._options.zIndex;
    }
  }

  /**
   * Gets flag that indicates whether indicator can be merged into the upper panel.
   * @name canMergeUp
   * @type {boolean}
   * @memberOf StockChartX.Indicator#
   */
  get canMergeUp(): boolean {
    return this._panel.getIndex() > 0;
  }

  /**
   * Gets flag that indicates whether indicator can be merged into the lower panel.
   * @name canMergeDown
   * @type {boolean}
   * @memberOf StockChartX.Indicator#
   */
  get canMergeDown(): boolean {
    return this._panel.getIndex() < this.chart.chartPanels.length - 1;
  }

  /**
   * Gets flag that indicates whether indicator can be unmerged into the upper panel.
   * @name canUnmergeDown
   * @type {boolean}
   * @memberOf StockChartX.Indicator#
   */
  get canUnmergeUp(): boolean {
    let panelIndicators = this._panel.indicators;

    return panelIndicators.length > 1 && this._panel !== this.chart.mainPanel;
  }

  /**
   * Gets flag that indicates whether indicator can be unmerged into the lower panel.
   * @name canUnmergeDown
   * @type {boolean}
   * @memberOf StockChartX.Indicator#
   */
  get canUnmergeDown(): boolean {
    let panelIndicators = this._panel.indicators;

    return panelIndicators.length > 1 || this._panel === this.chart.mainPanel;
  }

  get isInitialized(): boolean {
    return this._plotItems.length > 0;
  }

  /**
   * @internal
   */
  private _titleContextMenu: IndicatorContextMenu;

  /**
   * @internal
   */
  private _parametersContextMenu: IndicatorContextMenu;

  constructor(config: IIndicatorConfig) {
    if (!config || typeof config !== "object")
      throw new TypeError("Config expected.");

    this._chart = config.chart;

    this._options = <IIndicatorOptions>{
      panelHeightRatio: config.panelHeightRatio,
      showParamsInTitle: true,
      showValueMarkers: true,
      showValuesInTitle: true,
      showNameInTitle: true,
      allowSettingsDialog: true,
      visible: true,
      showTitle: true
    };

    this.allowSettingsDialog =
      config.allowSettingsDialog !== undefined
        ? config.allowSettingsDialog
        : true;
    this.showParamsInTitle =
      config.showParamsInTitle !== undefined ? config.showParamsInTitle : true;
    this.showValueMarkers =
      config.showValueMarkers !== undefined ? config.showValueMarkers : true;
    this.showValuesInTitle =
      config.showValuesInTitle !== undefined ? config.showValuesInTitle : true;
    this.showNameInTitle =
      config.showNameInTitle !== undefined ? config.showNameInTitle : true;
    this.visible = config.visible !== undefined ? config.visible : true;
    this.coloredVolumeTheme =
      config.coloredVolumeTheme !== undefined
        ? config.coloredVolumeTheme
        : null;
    this._options.valueScaleIndex = config.valueScaleIndex;
    this.showTitle = config.showTitle != null ? config.showTitle : true;

    if (this._chart) {
      if (config.panelIndex != null)
        this._panel = this._chart.chartPanelsContainer.panels[
          config.panelIndex
        ];
      if (config.valueScaleIndex)
        this.valueScale = this._chart.valueScales[config.valueScaleIndex];
    }

    this._initIndicator(config);

    if (config.parameters) {
      for (let prop in <any>config.parameters) {
        if (config.parameters.hasOwnProperty(prop)) {
          // noinspection JSUnfilteredForInLoop
          this.setParameterValue(prop, config.parameters[prop]);
        }
      }
    }
  }

  /**
   * Returns true if value is set for a given parameter name, false otherwise.
   * @method hasParameter
   * @param {String} paramName The parameter name.
   * @returns {boolean}
   * @memberOf StockChartX.Indicator#
   */
  hasParameter(paramName: string): boolean {
    return this._options.parameters[paramName] !== undefined;
  }

  /**
   * Returns parameter value by name.
   * @method getParameterValue
   * @param {string} paramName The parameter name.
   * @returns {*}
   * @memberOf StockChartX.Indicator#
   */
  getParameterValue(paramName: string): any {
    return this._options.parameters[paramName];
  }

  /**
   * Sets parameter value.
   * @method setParameterValue
   * @param {string} paramName
   * @param {*} paramValue The
   * @memberOf StockChartX.Indicator#
   */
  setParameterValue(paramName: string, paramValue: any) {
    this._options.parameters[paramName] = paramValue;
  }

  /**
   * Returns indicator name (e.g. 'Simple Moving Average').
   * @method getName
   * @returns {string}
   * @memberOf StockChartX.Indicator#
   */
  getName(): string {
    return "";
  }

  /**
   * Returns short indicator name (e.g. 'SMA').
   * @method getShortName
   * @returns {string}
   * @memberOf StockChartX.Indicator#
   */
  getShortName(): string {
    return "";
  }

  /**
   * Returns plot's name. E.g. 'Top', 'Bottom', 'Median', ...
   * @method getPlotName
   * @param {string} fieldName the TA field name.
   * @returns {string}
   * @memberOf StockChartX.Indicator#
   */
  getPlotName(fieldName: string): string {
    return "";
  }

  /**
   * @internal
   */
  getPlots(): Plot[] {
    return this._plotItems.map((value: any) => value.plot);
  }

  /**
   * Serializes indicator state.
   * @method serialize
   * @returns {object}
   * @memberOf StockChartX.Indicator#
   */
  serialize() {
    let panel = this._panel;
    if (panel) {
      this._options.panelHeightRatio = panel.heightRatio;
    }
    if (this.valueScale) this._options.valueScaleIndex = this.valueScale.index;
    else delete this._options.valueScaleIndex;

    let state = $.extend(true, {}, this._options);
    if (panel) {
      state.panelIndex = panel.getIndex();
    }

    return state;
  }

  calculate(): any {}

  /**
   * @internal
   */
  protected _initPanel() {}

  /**
   * @internal
   */
  protected _updatePlotItem(index: number): boolean {
    return false;
  }

  /**
   * @internal
   */
  protected _needsCustomScale(): boolean {
    return false;
  }

  //noinspection JSUnusedLocalSymbols
  /**
   * Removes all values from a given data series. Clears all values in all data series if parameter is omitted.
   * @method clearDataSeries
   * @param {String | StockChartX.DataSeries} [dataSeries] The data series name or data series object.
   * @memberOf StockChartX.Indicator#
   */
  clearDataSeries(dataSeries: string | DataSeries) {}

  /**
   * Updates indicator.
   * @method update
   * @memberOf StockChartX.Indicator#
   */
  update() {
    let result = this.calculate(),
      indicatorName = this.getShortName(),
      parameters = result.parameters ? `(${result.parameters})` : "",
      indicatorTitle = indicatorName + parameters;
    if (!this._panel) {
      if (this._isOverlay) {
        this._panel = this._chart.mainPanel;
      } else {
        try {
          this._panel = this._chart.addChartPanel(
            this._chart.chartPanels.length,
            this.panelHeightRatio,
            true
          );
        } catch (e) {
          this._chart.removeIndicators(this);
          this._chart.setNeedsUpdate();

          return;
        }

        this._initPanel();
        this._chart.layout();
        this._panel.setNeedsAutoScale();
      }
    }
    if (!this._panel.visible) return;

    this._initPanelTitle();
    this._titleControls.name.text(indicatorName);
    this._titleControls.parameters.text(parameters);

    // Remove old plots.
    for (let item of this._plotItems) {
      this._panel.removePlot(item.plot);
    }

    for (let i = 0; i < this._fieldNames.length; i++) {
      let plotItem = this._plotItems[i],
        fieldName,
        fieldTitle;
      if (!this._updatePlotItem(i)) {
        fieldName = this._fieldNames[i];
        fieldTitle = this.getPlotName(fieldName);

        let field = result.recordSet && result.recordSet.getField(fieldName),
          dataSeries = field
            ? DataSeries.fromField(field, result.startIndex)
            : new DataSeries(fieldName);

        plotItem.dataSeries = dataSeries;

        if (this._fieldNames.length === 1 || !fieldTitle)
          dataSeries.name = indicatorTitle;
        else dataSeries.name = `${indicatorTitle}.${fieldTitle}`;

        this._chart.dataManager.addDataSeries(dataSeries, true);

        let theme;
        switch (fieldName) {
          case IndicatorField.INDICATOR_HISTOGRAM:
            theme = this._getHistogramTheme(i);
            plotItem.plot = new HistogramPlot({
              plotStyle: HistogramPlot.Style.COLUMN,
              dataSeries,
              theme
            });
            plotItem.color = theme.fill.fillColor;
            break;
          case IndicatorField.INDICATOR_HISTOGRAM_HIGH:
          case IndicatorField.INDICATOR_HISTOGRAM_LOW:
            theme = this._getHistogramTheme(i);
            plotItem.plot = new HistogramPlot({
              plotStyle: HistogramPlot.Style.COLUMN,
              dataSeries: dataSeries,
              theme: theme
            });
            break;
          case IndicatorField.INDICATOR_HIGH:
          case IndicatorField.INDICATOR_LOW:
            theme = this._getLineTheme(i);
            plotItem.plot = new LinePlot({
              plotStyle: LinePlot.Style.MOUNTAIN,
              dataSeries: dataSeries,
              theme: theme
            });
            break;
          case IndicatorField.SUPERTREND:
            theme = {
              strokeColor: this.getParameterValue(IndicatorParam.LINE_COLOR),
              stroke2Color: this.getParameterValue(IndicatorParam.LINE2_COLOR)
            };
            plotItem.plot = new LinePlot({
              dataSeries: dataSeries,
              colorField: result.recordSet.getField("CF"),
              theme: theme
            });
            break;
          case IndicatorField.PIVOTPOINTS:
            theme = this._getLineTheme(0);
            plotItem.plot = new LinePlot({
              plotStyle: LinePlot.Style.HORIZONTAL,
              dataSeries: dataSeries,
              theme: theme,
              textField: "P"
            });
            break;
          case IndicatorField.S1:
            theme = this._getLineTheme(1);
            plotItem.plot = new LinePlot({
              plotStyle: LinePlot.Style.HORIZONTAL,
              dataSeries: dataSeries,
              theme: theme,
              textField: "S1"
            });
            break;
          case IndicatorField.R1:
            theme = this._getLineTheme(2);
            plotItem.plot = new LinePlot({
              plotStyle: LinePlot.Style.HORIZONTAL,
              dataSeries: dataSeries,
              theme: theme,
              textField: "R1"
            });
            break;
          case IndicatorField.S2:
            theme = this._getLineTheme(1);
            plotItem.plot = new LinePlot({
              plotStyle: LinePlot.Style.HORIZONTAL,
              dataSeries: dataSeries,
              theme: theme,
              textField: "S2"
            });
            break;
          case IndicatorField.R2:
            theme = this._getLineTheme(2);
            plotItem.plot = new LinePlot({
              plotStyle: LinePlot.Style.HORIZONTAL,
              dataSeries: dataSeries,
              theme: theme,
              textField: "R2"
            });
            break;
          case IndicatorField.S3:
            theme = this._getLineTheme(1);
            plotItem.plot = new LinePlot({
              plotStyle: LinePlot.Style.HORIZONTAL,
              dataSeries: dataSeries,
              theme: theme,
              textField: "S3"
            });
            break;

          case IndicatorField.R3:
            theme = this._getLineTheme(2);
            plotItem.plot = new LinePlot({
              plotStyle: LinePlot.Style.HORIZONTAL,
              dataSeries: dataSeries,
              theme: theme,
              textField: "R3"
            });
            break;
          default:
            theme = this._getLineTheme(i);
            plotItem.plot = new LinePlot({
              dataSeries,
              theme
            });
            plotItem.color = theme.strokeColor;
            break;
        }
      }
      plotItem.plot._plotType = PlotType.INDICATOR;
      plotItem.plot.showValueMarkers = this.showValueMarkers;
      plotItem.plot.visible = this.visible;
      plotItem.plot.valueScale = this._valueScale;
      if (this.zIndex) {
        plotItem.plot.zIndex = this.zIndex;
      }
      this._panel.addPlot(plotItem.plot);

      plotItem.titlePlotSpan
        .css("color", plotItem.color)
        .text(fieldTitle ? fieldTitle + ":" : "");
      plotItem.titleValueSpan
        .css("color", plotItem.color)
        .attr(
          "title",
          fieldName !== IndicatorField.INDICATOR ? fieldName : this.getName()
        );
    }

    this.updateHoverRecord();
    this._updatePanelTitle();
  }

  /**
   * @internal
   */
  _getHistogramTheme(fieldIndex: number): any {
    let paramName, color;

    switch (fieldIndex) {
      case 0:
        paramName = IndicatorParam.LINE_COLOR;
        color =
          this.getParameterValue(paramName) ||
          this.chart.theme.plot.indicator.line1.strokeColor;
        break;
      case 1:
        paramName = IndicatorParam.LINE2_COLOR;
        color =
          this.getParameterValue(paramName) ||
          this.chart.theme.plot.indicator.line3.strokeColor;
        break;
      case 2:
        paramName = IndicatorParam.LINE3_COLOR;
        color =
          this.getParameterValue(paramName) ||
          this.chart.theme.plot.indicator.line2.strokeColor;
        break;
      case 3:
        paramName = IndicatorParam.HISTOGRAM_HIGH_COLOR;
        color = this.getParameterValue(paramName);
        break;
      case 4:
        paramName = IndicatorParam.HISTOGRAM_LOW_COLOR;
        color = this.getParameterValue(paramName);
        break;

      default:
        return null;
    }
    return {
      line: {
        strokeEnabled: false
      },
      fill: {
        fillEnabled: true,
        fillColor: color
      }
    };
  }

  // /**
  //  * @internal
  //  */
  // _getCustomLineTheme(fieldIndex: number): any {
  //   let colorParamName,
  //     widthParamName,
  //     lineStyleParamName,
  //     color,
  //     width,
  //     lineStyle;
  //   switch (fieldIndex) {
  //     case 0:
  //       colorParamName = IndicatorParam.LINE_COLOR;
  //       widthParamName = IndicatorParam.LINE_WIDTH;
  //       lineStyleParamName = IndicatorParam.LINE_STYLE;
  //       color = this.getParameterValue(colorParamName);
  //       width = this.getParameterValue(widthParamName);
  //       lineStyle = this.getParameterValue(lineStyleParamName);
  //       break;
  //     case 1:
  //       colorParamName = IndicatorParam.LINE2_COLOR;
  //       widthParamName = IndicatorParam.LINE2_WIDTH;
  //       lineStyleParamName = IndicatorParam.LINE2_STYLE;
  //       color = this.getParameterValue(colorParamName);
  //       width = this.getParameterValue(widthParamName);
  //       lineStyle = this.getParameterValue(lineStyleParamName);
  //       break;
  //     case 2:
  //       colorParamName = IndicatorParam.LINE3_COLOR;
  //       widthParamName = IndicatorParam.LINE3_WIDTH;
  //       lineStyleParamName = IndicatorParam.LINE3_STYLE;
  //       color = this.getParameterValue(colorParamName);
  //       width = this.getParameterValue(widthParamName);
  //       lineStyle = this.getParameterValue(lineStyleParamName);
  //       break;
  //   }
  //   return {
  //     strokeEnabled: true,
  //     width: width,
  //     strokeColor: color,
  //     lineStyle: lineStyle,
  //     fill: {
  //       fillEnabled: true,
  //       fillColor: color
  //     }
  //   };
  // }
  _getLineTheme(fieldIndex: number): any {
    let indicatorTheme = this.chart.theme.plot.indicator,
      colorParamName,
      widthParamName,
      lineStyleParamName,
      color,
      width,
      lineStyle;

    switch (fieldIndex) {
      case 0:
        colorParamName = IndicatorParam.LINE_COLOR;
        widthParamName = IndicatorParam.LINE_WIDTH;
        lineStyleParamName = IndicatorParam.LINE_STYLE;

        switch (this._fieldNames.length) {
          case 1:
            if (this.fieldNames[fieldIndex] === "Volume") {
              color =
                this.getParameterValue(colorParamName) ||
                (indicatorTheme && indicatorTheme.line4.strokeColor);
              width =
                this.getParameterValue(widthParamName) ||
                (indicatorTheme && indicatorTheme.line4.width);
              lineStyle =
                this.getParameterValue(lineStyleParamName) ||
                (indicatorTheme && indicatorTheme.line4.lineStyle);
            } else {
              color =
                this.getParameterValue(colorParamName) ||
                (indicatorTheme && indicatorTheme.line1.strokeColor);
              width =
                this.getParameterValue(widthParamName) ||
                (indicatorTheme && indicatorTheme.line1.width);
              lineStyle =
                this.getParameterValue(lineStyleParamName) ||
                (indicatorTheme && indicatorTheme.line1.lineStyle);
            }
            break;
          case 2:
            color =
              this.getParameterValue(colorParamName) ||
              (indicatorTheme && indicatorTheme.line2.strokeColor);
            width =
              this.getParameterValue(widthParamName) ||
              (indicatorTheme && indicatorTheme.line2.width);
            lineStyle =
              this.getParameterValue(lineStyleParamName) ||
              (indicatorTheme && indicatorTheme.line2.lineStyle);
            break;
          case 3:
            color =
              this.getParameterValue(colorParamName) ||
              (indicatorTheme && indicatorTheme.line3.strokeColor);
            width =
              this.getParameterValue(widthParamName) ||
              (indicatorTheme && indicatorTheme.line3.width);
            lineStyle =
              this.getParameterValue(lineStyleParamName) ||
              (indicatorTheme && indicatorTheme.line3.lineStyle);
            break;
          default:
            color =
              this.getParameterValue(colorParamName) ||
              (indicatorTheme && indicatorTheme.line1.strokeColor);
            width =
              this.getParameterValue(widthParamName) ||
              (indicatorTheme && indicatorTheme.line1.width);
            lineStyle =
              this.getParameterValue(lineStyleParamName) ||
              (indicatorTheme && indicatorTheme.line1.lineStyle);
            break;
        }

        break;
      case 1:
        colorParamName = IndicatorParam.LINE2_COLOR;
        widthParamName = IndicatorParam.LINE2_WIDTH;
        lineStyleParamName = IndicatorParam.LINE2_STYLE;
        switch (this._fieldNames.length) {
          case 2:
            color =
              this.getParameterValue(colorParamName) ||
              (indicatorTheme && indicatorTheme.line3.strokeColor);
            width =
              this.getParameterValue(widthParamName) ||
              (indicatorTheme && indicatorTheme.line3.width);
            lineStyle =
              this.getParameterValue(lineStyleParamName) ||
              (indicatorTheme && indicatorTheme.line3.lineStyle);
            break;
          case 3:
            color =
              this.getParameterValue(colorParamName) ||
              (indicatorTheme && indicatorTheme.line1.strokeColor);
            width =
              this.getParameterValue(widthParamName) ||
              (indicatorTheme && indicatorTheme.line1.width);
            lineStyle =
              this.getParameterValue(lineStyleParamName) ||
              (indicatorTheme && indicatorTheme.line1.lineStyle);
            break;
          default:
            color =
              this.getParameterValue(colorParamName) ||
              (indicatorTheme && indicatorTheme.line3.strokeColor);
            width =
              this.getParameterValue(widthParamName) ||
              (indicatorTheme && indicatorTheme.line3.width);
            lineStyle =
              this.getParameterValue(lineStyleParamName) ||
              (indicatorTheme && indicatorTheme.line3.lineStyle);
            break;
        }
        break;
      case 2:
        colorParamName = IndicatorParam.LINE3_COLOR;
        widthParamName = IndicatorParam.LINE3_WIDTH;
        lineStyleParamName = IndicatorParam.LINE3_STYLE;
        switch (this._fieldNames.length) {
          case 2:
            color =
              this.getParameterValue(colorParamName) ||
              (indicatorTheme && indicatorTheme.line1.strokeColor);
            width =
              this.getParameterValue(widthParamName) ||
              (indicatorTheme && indicatorTheme.line1.width);
            lineStyle =
              this.getParameterValue(lineStyleParamName) ||
              (indicatorTheme && indicatorTheme.line1.lineStyle);
            break;
          case 3:
            color =
              this.getParameterValue(colorParamName) ||
              (indicatorTheme && indicatorTheme.line2.strokeColor);
            width =
              this.getParameterValue(widthParamName) ||
              (indicatorTheme && indicatorTheme.line2.width);
            lineStyle =
              this.getParameterValue(lineStyleParamName) ||
              (indicatorTheme && indicatorTheme.line2.lineStyle);
            break;
          default:
            color =
              this.getParameterValue(colorParamName) ||
              (indicatorTheme && indicatorTheme.line1.strokeColor);
            width =
              this.getParameterValue(widthParamName) ||
              (indicatorTheme && indicatorTheme.line1.width);
            lineStyle =
              this.getParameterValue(lineStyleParamName) ||
              (indicatorTheme && indicatorTheme.line1.lineStyle);
            break;
        }
        break;
      default:
        return null;
    }
    return {
      strokeEnabled: true,
      width: width,
      strokeColor: color,
      lineStyle: lineStyle,
      fill: {
        fillEnabled: true,
        fillColor: color
      }
    };
  }

  draw() {}

  /**
   * @internal
   */
  private _removeControls() {
    if (this._titleControls) {
      this._unSubscribeEvents();

      this._titleControls.rootDiv.remove();
      this._titleControls = null;
    }
  }

  destroy() {
    let chart = this.chart,
      panel = this._panel;

    if (panel && panel !== chart.mainPanel && panel.indicators.length > 0)
      panel.indicators[0]._initPanel();
    if (this._titleContextMenu) this._titleContextMenu.destroy();
    if (this._parametersContextMenu) this._parametersContextMenu.destroy();

    this._removeControls();
    this.chart = null;
    this._panel = null;
  }

  // It is used in custom indicators.
  getInfoAbout(): string {
    return "";
  }

  showInfoDialog() {
    ViewLoader.indicatorInfoDialog((dialog: IndicatorInfoDialog) => {
      dialog.show({
        chart: this.chart,
        indicator: this
      });
    });
  }

  showSettingsDialog() {
    ViewLoader.indicatorSettingsDialog((dialog: IndicatorSettingsDialog) => {
      dialog.show({
        chart: this.chart,
        indicator: this,
        done: () => {
          this.update();
          this._panel.setNeedsUpdate(true);
        }
      });
    });
  }

  /**
   * Updates values in the title.
   * @method updateHoverRecord
   * @param {number} [record] The hover record.
   * @memberOf StockChartX.Indicator#
   * @private
   * @internal
   */
  updateHoverRecord(record?: number) {
    if (!this.showValuesInTitle) return;
    if (!this.showNameInTitle) return;

    if (record == null) record = this._chart.hoveredRecord;

    for (let item of this._plotItems) {
      let recordCount = item.dataSeries ? item.dataSeries.length : 0;

      if (recordCount <= 0) continue;
      if (record == null || record < 0 || record >= recordCount)
        record = recordCount - 1;

      let value = item.dataSeries.valueAtIndex(record),
        text = isNaN(value) ? "" : this._panel.formatValue(value);

      item.titleValueSpan.text(text);
    }
  }

  /**
   * @internal
   */
  _addPlot(plot: Plot, titleColor: string) {
    this._panel.addPlot(plot);

    this._initPanelTitle();

    for (let plotItem of this._plotItems) {
      if (plotItem.plot) continue;

      plotItem.plot = plot;
      plotItem.dataSeries = plot.dataSeries[0];
      plotItem.color = titleColor;

      this._updatePanelTitle();

      return plotItem;
    }
  }

  /**
   * @internal
   */
  _initPanelTitle() {
    if (!this._panel.visible) return;

    if (this._titleControls) return;

    let controls = (this._titleControls = <IIndicatorTitleControls>{});
    let menuConfig: IIndicatorContextMenuConfig = {
      menuContainer: null,
      showOnClick: true,
      indicator: this,
      onItemSelected: (menuItem: JQuery, checked: boolean) => {
        let id = menuItem.data("id");

        switch (id) {
          case IndicatorContextMenu.MenuItem.ABOUT:
            this.showInfoDialog();
            break;
          case IndicatorContextMenu.MenuItem.SETTINGS:
            this.showSettingsDialog();
            break;
          case IndicatorContextMenu.MenuItem.SHOW_PARAMS:
            this.showParamsInTitle = checked;
            this._panel.setNeedsUpdate();
            break;
          case IndicatorContextMenu.MenuItem.SHOW_MARKERS:
            this.showValueMarkers = checked;
            this._panel.setNeedsUpdate();
            break;
          case IndicatorContextMenu.MenuItem.SHOW_VALUES:
            this.showValuesInTitle = checked;
            this._panel.setNeedsUpdate();
            break;
          case IndicatorContextMenu.MenuItem.VISIBLE:
            this.visible = checked;
            this.updateTitleControlsVisibility();
            this._panel.setNeedsUpdate();
            break;
          case IndicatorContextMenu.MenuItem.MERGE_UP:
            this._merge(true);
            break;
          case IndicatorContextMenu.MenuItem.MERGE_DOWN:
            this._merge(false);
            break;
          case IndicatorContextMenu.MenuItem.UNMERGE_UP:
            this._unmerge(true);
            break;
          case IndicatorContextMenu.MenuItem.UNMERGE_DOWN:
            this._unmerge(false);
            break;
          case IndicatorContextMenu.MenuItem.DELETE:
            this._remove();
            break;
          case undefined:
            break;
          default:
            throw new Error(`Unknown menu item '${id}'`);
        }
      }
    };

    let div = (controls.rootDiv = this._panel.titleDiv.scxAppend(
      "div",
      Class.TITLE
    ));
    controls.name = div
      .scxAppend("div", Class.TITLE_CAPTION)
      .text(this.getShortName());
    this._titleContextMenu = controls.name
      .scx()
      .indicatorContextMenu(menuConfig);
    controls.parameters = div.scxAppend("div", Class.TITLE_CAPTION);
    controls.parameters.scx().indicatorContextMenu(menuConfig);

    this._collapseIndicatorIcon = div
      .scxAppend("span", [Class.TITLE_ICON, Class.TITLE_HIDE])
      .attr("title", "Show/Hide Indicator`s Title")
      .on("click", () => {
        this.showNameInTitle = this._collapseIndicatorTitle;
      });

    div
      .scxAppend("span", [Class.TITLE_ICON, Class.TITLE_REMOVE_ICON])
      .attr("title", "Remove indicator")
      .on("click", () => {
        this._remove();
      });

    for (let i = 0, count = this._fieldNames.length; i < count; i++) {
      this._plotItems.push({
        titlePlotSpan: div.scxAppend("span", Class.TITLE_VALUE),
        titleValueSpan: div.scxAppend("span", Class.TITLE_VALUE)
      });
    }
    this.updateTitleControlsVisibility();

    this._subscribeEvents();
  }

  /**
   * @internal
   */
  protected _merge(isMergingUp: boolean): void {
    let chart = this.chart,
      currPanelIdx = this._panel.getIndex(),
      newPanelIdx = isMergingUp ? currPanelIdx - 1 : currPanelIdx + 1;

    if (newPanelIdx < 0 || newPanelIdx >= chart.chartPanels.length) return;

    if (isMergingUp && this._needsCustomScale() && currPanelIdx === 1) {
      this.valueScale = chart.addValueScale();
      this.valueScale.rightPanelVisible = false;
    }

    let newIndicator = this.serialize(),
      newIndicatorPanel = chart.chartPanels[newPanelIdx];

    newIndicator.panelIndex = newPanelIdx;

    let mergedIndicator = chart.addIndicators(newIndicator);

    if (
      newIndicatorPanel !== chart.mainPanel &&
      newIndicatorPanel.indicators[0] === mergedIndicator
    )
      mergedIndicator._initPanel();

    if (isMergingUp && this._needsCustomScale() && currPanelIdx === 1) {
      mergedIndicator.zIndex = ZIndexVolume;
    }

    chart.removeIndicators(this);
    chart.setNeedsUpdate(true);
  }

  /**
   * @internal
   */
  protected _unmerge(unmergeUp: boolean): void {
    let newPanelIndex = unmergeUp
      ? this._panel.getIndex()
      : this._panel.getIndex() + 1;
    try {
      let newPanel = this.chart.addChartPanel(newPanelIndex);
      newPanel.layout(newPanel.frame);
      this.chart.removeValueScale(this.valueScale);
      this._merge(unmergeUp);
    } catch (e) {
      Localization.localizeText(
        this.chart,
        "notification.indicators.msg.noMoreSpace"
      ).then((text: string) => {
        Notification.warning(text);
      });
    }
  }

  // It is used in custom indicators.
  getParametersString(): string {
    return null;
  }

  /**
   * @internal
   */
  _updatePanelTitle() {
    this._titleControls.name.text(this.getShortName());
    this._titleControls.parameters.text(this.getParametersString());

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this._plotItems.length; i++) {
      let plotItem = this._plotItems[i],
        field = this._fieldNames[i];

      plotItem.titlePlotSpan
        .css("color", plotItem.color)
        .text(field ? `${field}:` : "");
      plotItem.titleValueSpan.css("color", plotItem.color).attr("title", field);
    }
  }

  updateTitleControlsVisibility() {
    let showMarkers = this.showValueMarkers,
      showValuesInTitle = this.showValuesInTitle,
      valueDisplay = showValuesInTitle ? "inline-block" : "none",
      controls = this._titleControls;

    if (controls) {
      controls.parameters.css(
        "display",
        this.showParamsInTitle ? "inline-block" : "none"
      );
      controls.name.css(
        "display",
        this.showNameInTitle ? "inline-block" : "none"
      );
      controls.name.css("opacity", this.visible ? "1" : "0.5");
      controls.rootDiv.css("display", this.showTitle ? "block" : "none");
    }

    for (let item of this._plotItems) {
      if (item.plot) item.plot.showValueMarkers = showMarkers;
      item.titlePlotSpan.css("display", valueDisplay);
      item.titleValueSpan.css("display", valueDisplay);
    }
  }

  /**
   * @internal
   */
  _initIndicator(config: IIndicatorConfig) {
    this._isOverlay = false;
    this._options.parameters = {};
  }

  /**
   * @internal
   */
  _subscribeEvents() {
    this._chart.on(
      `${ChartEvent.HOVER_RECORD_CHANGED}.scxIndicator`,
      (event: IValueChangedEvent) => {
        this.updateHoverRecord(event.value);
      },
      this
    );
  }

  /**
   * @internal
   */
  _unSubscribeEvents() {
    if (this._chart)
      this._chart.off(`${ChartEvent.HOVER_RECORD_CHANGED}.scxIndicator`, this);
  }

  /**
   * @internal
   */
  _remove() {
    let chart = this._chart;

    chart.removeIndicators(this);
    chart.setNeedsUpdate(true);
  }

  /**
   * @internal
   */
  _collapseIndicatorName(value: boolean): void {
    this._collapseIndicatorTitle = !value;
    if (this._collapseIndicatorIcon) {
      if (this._collapseIndicatorTitle)
        this._collapseIndicatorIcon
          .removeClass(Class.TITLE_HIDE)
          .addClass(Class.TITLE_SHOW);
      else
        this._collapseIndicatorIcon
          .removeClass(Class.TITLE_SHOW)
          .addClass(Class.TITLE_HIDE);
    }
    if (this._panel) this._panel.setNeedsUpdate();
  }

  /**
   * @internal
   */
  _getMaTypeString(maType: number): string {
    switch (maType) {
      case TASdk.Const.simpleMovingAverage:
        return "Simple";
      case TASdk.Const.exponentialMovingAverage:
        return "Exponential";
      case TASdk.Const.triangularMovingAverage:
        return "Triangular";
      case TASdk.Const.timeSeriesMovingAverage:
        return "Time Series";
      case TASdk.Const.variableMovingAverage:
        return "Variable";
      case TASdk.Const.VIDYA:
        return "VIDYA";
      case TASdk.Const.wellesWilderSmoothing:
        return "Welles Wilder";
      case TASdk.Const.weightedMovingAverage:
        return "Weighted";
      default:
        return "";
    }
  }

  /**
   * Deserializes indicator.
   * @method deserialize
   * @param {object} state The state.
   * @returns {StockChartX.Indicator}
   * @memberOf StockChartX.Indicator
   */
  static deserialize(state: any): Indicator {
    // @if SCX_LICENSE = 'full'
    if (state.isIchimokuIndicator) {
      return new IchimokuIndicator(state);
    }
    if (state.taIndicator === TASdk.DBox) return new DarvasBox(state);
    // @endif

    return new TAIndicator(state);
  }

  /**
   * Returns array of all available TA indicators.
   * @method allIndicators
   * @returns {number[]}
   * @memberOf StockChartX.Indicator#
   */
  static allIndicators(): number[] {
    return this.bands().concat(
      this.general(),
      this.indices(),
      this.regressions(),
      this.movingAverages(),
      this.oscillators()
    );
  }

  /**
   * Returns array of band indicators.
   * @method bands
   * @returns {number[]}
   * @memberOf StockChartX.Indicator#
   */
  static bands(): number[] {
    return IndicatorDefaults.bands();
  }

  /**
   * Returns array of general indicators.
   * @method general
   * @returns {number[]}
   * @memberOf StockChartX.Indicator#
   */
  static general(): number[] {
    return IndicatorDefaults.general();
  }

  /**
   * Returns array of index indicators.
   * @method indices
   * @returns {number[]}
   * @memberOf StockChartX.Indicator#
   */
  static indices(): number[] {
    return IndicatorDefaults.indices();
  }

  /**
   * Returns array of regression indicators.
   * @method regressions
   * @returns {number[]}
   * @memberOf StockChartX.Indicator#
   */
  static regressions(): number[] {
    return IndicatorDefaults.regressions();
  }

  /**
   * Returns array of moving average indicators.
   * @method movingAverages
   * @returns {number[]}
   * @memberOf StockChartX.Indicator#
   */
  static movingAverages(): number[] {
    return IndicatorDefaults.movingAverages();
  }

  /**
   * Returns array of oscillator indicators.
   * @method oscillators
   * @returns {number[]}
   * @memberOf StockChartX.Indicator#
   */
  static oscillators(): number[] {
    return IndicatorDefaults.oscillators();
  }
}
