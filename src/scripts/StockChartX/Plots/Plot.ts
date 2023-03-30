import { ValueLine } from "../index";
import { LineStyle } from "../index";
import { DataSeriesSuffix } from "../index";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import {
  IChartPanelObjectOptions,
  IChartPanelObjectConfig,
  ChartPanelObject
} from "../index";
import { DataSeries, IMinMaxValues } from "../index";
import { ChartPanel } from "../index";
import { ValueScale } from "../index";
import { Projection } from "../index";
import { HtmlUtil } from "../index";
import { PlotEvent } from "../Utils/PlotEvent";
import { PlotType } from "../Utils/PlotType";
"use strict";

// region Interfaces

export interface IPlotOptions extends IChartPanelObjectOptions {
  plotStyle: string;
  showValueMarkers: boolean;
  showValueLines: boolean;
  extendValueLines: boolean;
}

export interface IPlotConfig extends IChartPanelObjectConfig {
  dataSeries?: DataSeries | DataSeries[];
  chartPanel?: ChartPanel;
  theme?: any;
  plotType?: PlotType;
  valueScale?: ValueScale;
  plotStyle?: string;
  colorField?: Array<string>;
  textField?: string;
  zIndex?: number;
}

export interface IPlotDrawParams {
  context: CanvasRenderingContext2D;
  projection: Projection;
  dates: Date[];
  values: number[];
  startIndex: number;
  endIndex: number;
  startColumn: number;
  theme: any;
}

export interface IPlotValueDrawParams extends IPlotDrawParams {}

export interface IPlotBarDrawParams extends IPlotDrawParams {
  open: number[];
  high: number[];
  low: number[];
  close: number[];
}

export interface IPlotDefaults {
  plotStyle: string;
}

// endregion

// region Declarations

/**
 * Plot events enumeration values.
 * @name PlotEvent
 * @enum {string}
 * @property {string} DATA_SERIES_CHANGED Data series has been changed
 * @property {string} PANEL_CHANGED Plot panel has been changed
 * @property {string} THEME_CHANGED Plot theme has been changed
 * @property {string} STYLE_CHANGED Plot style has been changed
 * @property {string} SHOW_VALUE_MARKERS_CHANGED Show value markers option has been enabled or disabled
 * @property {string} VISIBLE_CHANGED Plot visibility has been changed (visible | invisible)
 * @property {string} VALUE_SCALE_CHANGED Plot value scale has been changed
 * @property {string} BASE_VALUE_CHANGED Plot base value has been changed
 * @readonly
 * @memberOf StockChartX
 */

const DefaultZIndex = 100;
const DefaultPriceStyleZIndex = 30;

/**
 * Represents abstract plot.
 * @param {Object} [config] The configuration object.
 * @param {StockChartX.DataSeries[]} [config.dataSeries] An array of data series for the plot.
 * @param {Object} [config.chartPanel] The parent chart panel.
 * @param {Object} [config.theme] The plot's theme.
 * @param {String} [config.plotType] The plot type.
 * @constructor StockChartX.Plot
 * @augments StockChartX.ChartPanelObject
 * @abstract
 */
export abstract class Plot extends ChartPanelObject {
  // region Properties
  /**
   * @internal
   */
  protected _plotThemeKey = "";

  /**
   * @internal
   */
  protected textField = "";

  /**
   * @internal
   */
  private _dataSeries: DataSeries[] = [];

  /**
   * An array of data series used by plot.
   * @name dataSeries
   * @type {Array}
   * @memberOf StockChartX.Plot#
   */
  get dataSeries(): DataSeries[] {
    return this._dataSeries;
  }

  set dataSeries(value: DataSeries[]) {
    this.setDataSeries(value);
  }

  /**
   * @internal
   */
  private _theme;

  /**
   * The theme.
   * @name theme
   * @type {Object}
   * @memberOf StockChartX.Plot#
   */
  get theme(): any {
    return this._theme;
  }

  set theme(value: any) {
    let oldValue = this._theme;
    this._theme = value;
    this.fire(PlotEvent.THEME_CHANGED, value, oldValue);
  }

  /**
   * Gets actual plot theme.
   * @name actualTheme
   * @type {Object}
   * @memberOf StockChartX.Plot#
   */
  get actualTheme(): any {
    if (this._theme) return this._theme;

    return this.chart.theme.plot[this._plotThemeKey][this.plotStyle];
  }

  /**
   * Gets/Sets plot style.
   * @name plotStyle
   * @type {string}
   * @memberOf StockChartX.Plot#
   */
  get plotStyle(): string {
    let style = (<IPlotOptions>this._options).plotStyle;
    if (style) return style;

    let defaults = <IPlotDefaults>(<any>this.constructor).defaults;

    return defaults && defaults.plotStyle;
  }

  set plotStyle(value: string) {
    this._setOption("plotStyle", value, PlotEvent.STYLE_CHANGED);
  }

  /**
   * Gets/Sets the flag that indicates whether value markers are visible.
   * @name showValueMarkers
   * @type {boolean}
   * @memberOf StockChartX.Plot#
   */
  get showValueMarkers(): boolean {
    return (<IPlotOptions>this._options).showValueMarkers;
  }

  set showValueMarkers(value: boolean) {
    this._setOption(
      "showValueMarkers",
      value,
      PlotEvent.SHOW_VALUE_MARKERS_CHANGED
    );
  }

  /**
   * Gets/Sets the flag that indicates whether value lines are visible.
   * @name showValueLines
   * @type {boolean}
   * @memberOf StockChartX.Plot#
   */
  get showValueLines(): boolean {
    return (<IPlotOptions>this._options).showValueLines;
  }

  set showValueLines(value: boolean) {
    this._setOption(
      "showValueLines",
      value,
      PlotEvent.SHOW_VALUE_LINES_CHANGED
    );
  }

  /**
   * Gets/Sets the flag that indicates whether value lines are extended.
   * @name extendValueLines
   * @returns {boolean}
   * @memberOf StockChartX.Plot#
   */
  get extendValueLines(): boolean {
    return (<IPlotOptions>this._options).extendValueLines;
  }

  set extendValueLines(value: boolean) {
    this._setOption(
      "extendValueLines",
      value,
      PlotEvent.EXTEND_VALUE_LINES_CHANGED
    );
  }

  /**
   * @internal
   */
  protected _plotType: PlotType = PlotType.USER;

  /**
   * Gets plot type.
   * @name plotType
   * @type {string}
   * @memberOf StockChartX.Plot#
   */
  get plotType(): PlotType {
    return this._plotType;
  }

  // endregion

  constructor(config?: IPlotConfig) {
    super(config);

    let suppress = this.suppressEvents(true);

    if (config) {
      if (config.dataSeries != null) this.setDataSeries(config.dataSeries);
      if (config.chartPanel != null) this.chartPanel = config.chartPanel;
      if (config.theme != null) this.theme = config.theme;
      if (config.plotType) this._plotType = config.plotType;
      if (config.options) this._options = config.options;
      if (config.valueScale) this.valueScale = config.valueScale;
      this.plotStyle = config.plotStyle;
      if (config.zIndex) this.zIndex = config.zIndex;
      if (config.textField) this.textField = config.textField;
    }

    let options = <IPlotOptions>this._options;
    if (options.showValueMarkers == null) options.showValueMarkers = true;
    if (options.visible == null) options.visible = true;
    if (this.zIndex == null)
      this.zIndex =
        this.plotType === PlotType.PRICE_STYLE
          ? DefaultPriceStyleZIndex
          : DefaultZIndex;

    this.suppressEvents(suppress);
  }

  /**
   * Sets 1 or more data series.
   * @method setDataSeries
   * @param {StockChartX.DataSeries | StockChartX.DataSeries[]} dataSeries The data series.
   * @memberOf StockChartX.Plot#
   */
  setDataSeries(dataSeries: DataSeries | DataSeries[]) {
    let newValue;

    if (dataSeries instanceof DataSeries) newValue = [dataSeries];
    else if (Array.isArray(dataSeries)) newValue = dataSeries;
    else
      throw new TypeError(
        "Single data series or an array of data series expected."
      );

    let oldValue = this._dataSeries;
    if (oldValue !== newValue) {
      this._dataSeries = newValue;
      this.fire(PlotEvent.DATA_SERIES_CHANGED, newValue, oldValue);
    }
  }

  /**
   * @internal
   */
  protected _onChartPanelChanged(oldValue: ChartPanel) {
    this.fire(PlotEvent.PANEL_CHANGED, this.chartPanel, oldValue);
  }

  /**
   * @internal
   */
  protected _onValueScaleChanged(oldValue: ValueScale) {
    this.fire(PlotEvent.VALUE_SCALE_CHANGED, this.valueScale, oldValue);
  }

  /**
   * @internal
   */
  protected _onVisibleChanged(oldValue: boolean) {
    this.fire(PlotEvent.VISIBLE_CHANGED, this.visible, oldValue);
  }

  /**
   * Finds dataSeries by nameSuffix
   * @method findDataSeries
   * @param {string} nameSuffix
   * @returns {DataSeries} Found DataSeries
   * @memberOf StockChartX.Plot#
   */
  findDataSeries(nameSuffix: string): DataSeries {
    for (let dataSeries of this._dataSeries) {
      if (dataSeries.nameSuffix === nameSuffix) return dataSeries;
    }

    return null;
  }

  /**
   * Returns minimum and maximum values in a given range.
   * @method minMaxValues
   * @param {Number} [startIndex] The start search index. 0 if omitted.
   * @param {Number} [count] The number of values to iterate through. Iterates through all values after startIndex if omitted.
   * @returns {{min: Number, max: Number}} An object that contains min and max values.
   * @memberOf StockChartX.Plot#
   * @example
   *  var values1 = plot.getMinMaxValues();
   *  var values2 = plot.getMinMaxValues(1, 5);
   */
  minMaxValues(startIndex: number, count: number): IMinMaxValues<number> {
    let min = Infinity,
      max = -Infinity;

    for (let dataSeries of this._dataSeries) {
      if (dataSeries.isValueDataSeries) {
        let values = dataSeries.minMaxValues(startIndex, count);
        if (values.min < min) min = values.min;
        if (values.max > max) max = values.max;
      }
    }

    return {
      min,
      max
    };
  }

  /**
   * @internal
   */
  protected _valueDrawParams(): IPlotValueDrawParams {
    let chart = this.chart,
      valueSeries = this._dataSeries[0],
      dateSeries = this.findDataSeries(DataSeriesSuffix.DATE),
      projection = this.projection,
      firstVisibleIndex,
      lastVisibleIndex;

    if (dateSeries) {
      let dateRange = chart.dateScale.visibleDateRange;

      firstVisibleIndex = dateSeries.floorIndex(dateRange.min);
      lastVisibleIndex = dateSeries.ceilIndex(dateRange.max);
    } else {
      firstVisibleIndex = chart.firstVisibleIndex;
      lastVisibleIndex = chart.lastVisibleIndex;
    }

    let startIndex = Math.max(
        valueSeries.leftNearestVisibleValueIndex(firstVisibleIndex) - 1,
        0
      ),
      endIndex = Math.min(
        valueSeries.rightNearestVisibleValueIndex(lastVisibleIndex) + 1,
        valueSeries.length - 1
      ),
      startColumn = dateSeries ? 0 : projection.columnByRecord(startIndex);

    return {
      context: this.context,
      projection,
      dates: <Date[]>(dateSeries && dateSeries.values),
      values: <number[]>valueSeries.values,
      startIndex,
      endIndex,
      startColumn,
      theme: this.actualTheme
    };
  }

  /**
   * @internal
   */
  protected _barDrawParams(): IPlotBarDrawParams {
    let chart = this.chart,
      dataSeries = this._dataSeries,
      projection = this.projection,
      dateSeries = null,
      openSeries = null,
      highSeries = null,
      lowSeries = null,
      closeSeries = null,
      firstVisibleIndex,
      lastVisibleIndex;

    for (let item of dataSeries) {
      switch (item.nameSuffix) {
        case DataSeriesSuffix.DATE:
          dateSeries = item;
          break;
        case DataSeriesSuffix.OPEN:
          openSeries = item;
          break;
        case DataSeriesSuffix.HIGH:
          highSeries = item;
          break;
        case DataSeriesSuffix.LOW:
          lowSeries = item;
          break;
        case DataSeriesSuffix.CLOSE:
          closeSeries = item;
          break;
        default:
          break;
      }
    }

    if (dateSeries) {
      let dateRange = chart.dateScale.visibleDateRange;

      firstVisibleIndex = dateSeries.floorIndex(dateRange.min);
      lastVisibleIndex = dateSeries.ceilIndex(dateRange.max);
    } else {
      firstVisibleIndex = chart.firstVisibleIndex;
      lastVisibleIndex = chart.lastVisibleIndex;
    }

    let startIndex = Math.max(
        dataSeries[0].leftNearestVisibleValueIndex(firstVisibleIndex) - 1,
        0
      ),
      endIndex = Math.min(
        dataSeries[0].rightNearestVisibleValueIndex(lastVisibleIndex) + 1,
        dataSeries[0].length - 1
      ),
      startColumn = dateSeries ? 0 : projection.columnByRecord(startIndex);

    return {
      context: this.context,
      projection,
      values: <number[]>this._dataSeries[0].values,
      dates: <Date[]>(dateSeries && dateSeries.values),
      open: <number[]>(openSeries && openSeries.values),
      high: <number[]>(highSeries && highSeries.values),
      low: <number[]>(lowSeries && lowSeries.values),
      close: <number[]>(closeSeries && closeSeries.values),
      startIndex,
      endIndex,
      startColumn,
      theme: this.actualTheme
    };
  }

  drawValueMarkers() {
    if (!this.showValueMarkers) return;

    let dataSeries = this._dataSeries[0],
      values = dataSeries.values,
      marker = this.chart.valueMarker,
      lastValue = <number>(
        values[dataSeries.leftNearestVisibleValueIndex(values.length)]
      ),
      markerTheme = marker.theme,
      theme = this.actualTheme;

    if (theme.valueMarker) markerTheme = theme.valueMarker;
    else {
      let fillColor: string;
      if (theme.strokeColor && theme.strokeEnabled !== false)
        fillColor = theme.strokeColor;
      else if (theme.fill && theme.fill.fillEnabled !== false) {
        if (theme.fill.linearGradient)
          fillColor =
            theme.fill.linearGradient[0] || theme.fill.linearGradient[0].color;
        else if (theme.fill.radialGradient)
          fillColor = theme.fill.radialGradient[0].color;
        else fillColor = theme.fill.fillColor;
      } else if (theme.line && theme.line.strokeEnabled !== false)
        fillColor = theme.line.strokeColor;
      else fillColor = markerTheme.fill.fillColor;

      markerTheme.fill.fillColor = fillColor;
      markerTheme.text.fillColor = HtmlUtil.isDarkColor(fillColor)
        ? "white"
        : "black";
    }

    marker.draw(lastValue, this.panelValueScale, markerTheme);

    if (this.showValueLines && lastValue != null) {
      let lastIdx = this._dataSeries[0].length - 1;
      let valueLineTheme = theme.valueLine;
      let line = new ValueLine({
        point: {
          record: lastIdx + 0.5,
          value: lastValue
        },
        theme: {
          strokeColor:
            (valueLineTheme && theme.valueLine.strokeColor) ||
            markerTheme.fill.fillColor,
          width: (valueLineTheme && theme.valueLine.width) || 1,
          lineStyle:
            (valueLineTheme && valueLineTheme.lineStyle) || LineStyle.DASH
        },
        extended: this.extendValueLines,
        visible: this.showValueLines
      });
      line.chartPanel = this.chartPanel;
      line.valueScale = this.valueScale;
      line.draw();
    }
  }
}
