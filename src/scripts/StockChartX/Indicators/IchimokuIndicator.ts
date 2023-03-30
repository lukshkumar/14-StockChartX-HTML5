import { ViewLoader } from "../../StockChartX.UI/index";
import { IchimokuIndicatorSettingsDialog } from "../../StockChartX.UI/index";
import { KumoPlot, ILineConfig } from "../index";
import { Bands } from "../../TASdk/Bands";
import { TAIndicator } from "../index";
import { DataSeries, IIndicatorOptions } from "../index";
import * as TASdk from "../../TASdk/TASdk";
import { Recordset } from "../../TASdk/Recordset";
import { LinePlot, IIndicatorConfig } from "../index";
// import { $ } from '../../external/typescript/jquery';

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
const $ = window.jQuery;

// @if SCX_LICENSE = 'full'

"use strict";

export interface ICumoTheme {
  fillColor: string;
}

export interface ICumoConfig {
  visible: boolean;
  theme: ICumoTheme;
}

export interface ILineTheme {
  strokeColor: string;
  width: number;
  lineStyle: string;
}

export interface IIchimokuIndicatorConfig extends IIndicatorConfig {
  conversionLinePeriods: number;
  baseLinePeriods: number;
  loggingSpan2Periods: number;
  displacement: number;

  tenkanSenLine: ILineConfig;
  kijunSenLine: ILineConfig;
  chikouSpanLine: ILineConfig;
  senkouSpanALine: ILineConfig;
  senkouSpanBLine: ILineConfig;
  kumo: ICumoConfig;
}

export class IchimokuIndicator extends TAIndicator {
  /**
   * @internal
   */
  private _conversionLinePeriods: number = 9;

  /**
   * @internal
   */
  private _baseLinePeriods: number = 26;

  /**
   * @internal
   */
  private _loggingSpan2Periods: number = 52;

  /**
   * @internal
   */
  private _displacement: number = 26;

  /**
   * @internal
   */
  private _tenkanSenDataseries: DataSeries = null;

  /**
   * @internal
   */
  private _kijunSenDataseries: DataSeries = null;

  /**
   * @internal
   */
  private _chikouSpanDataseries: DataSeries = null;

  /**
   * @internal
   */
  private _senkouSpanADataseries: DataSeries = null;

  /**
   * @internal
   */
  private _senkouSpanBDataseries: DataSeries = null;

  /**
   * @internal
   */
  private _tenkanSenPlotItem = null;

  /**
   * @internal
   */
  private _kijunSenPlotItem = null;

  /**
   * @internal
   */
  private _chikouSpanPlotItem = null;

  /**
   * @internal
   */
  private _senkouSpanAPlotItem = null;

  /**
   * @internal
   */
  private _senkouSpanBPlotItem = null;

  /**
   * @internal
   */
  private _kumoPlotItem = null;

  /**
   * @internal
   */
  private _lines = [];

  /**
   * @internal
   */
  private _tenkanSenLine: ILineConfig = {
    visible: true,
    priceLine: false,
    theme: {
      strokeColor: "rgb(4, 150, 255)",
      width: 1,
      lineStyle: "solid"
    }
  };

  /**
   * @internal
   */
  private _kijunSenLine: ILineConfig = {
    visible: true,
    priceLine: false,
    theme: {
      strokeColor: "rgb(153, 21, 21)",
      width: 1,
      lineStyle: "solid"
    }
  };

  /**
   * @internal
   */
  private _chikouSpanLine: ILineConfig = {
    visible: true,
    priceLine: false,
    theme: {
      strokeColor: "rgb(69, 153, 21)",
      width: 1,
      lineStyle: "solid"
    }
  };

  /**
   * @internal
   */
  private _senkouSpanALine: ILineConfig = {
    visible: true,
    priceLine: false,
    theme: {
      strokeColor: "rgb(0, 128, 0)",
      width: 1,
      lineStyle: "solid"
    }
  };

  /**
   * @internal
   */
  private _senkouSpanBLine: ILineConfig = {
    visible: true,
    priceLine: false,
    theme: {
      strokeColor: "rgb(255, 0, 0)",
      width: 1,
      lineStyle: "solid"
    }
  };

  /**
   * @internal
   */
  private _kumo: ICumoConfig = {
    visible: true,
    theme: {
      fillColor: "rgba(0, 127, 255, 0.5)"
    }
  };

  constructor(config?: IIchimokuIndicatorConfig) {
    // @ts-ignore
    super({ ...(config || {}), taIndicator: TASdk.IchimokuCloud });

    if (config) {
      this._conversionLinePeriods = config.conversionLinePeriods || 9;
      this._baseLinePeriods = config.baseLinePeriods || 26;
      this._loggingSpan2Periods = config.loggingSpan2Periods || 52;
      this._displacement = config.displacement || 26;

      this._tenkanSenLine = config.tenkanSenLine || this._tenkanSenLine;
      this._kijunSenLine = config.kijunSenLine || this._kijunSenLine;
      this._chikouSpanLine = config.chikouSpanLine || this._chikouSpanLine;
      this._senkouSpanALine = config.senkouSpanALine || this._senkouSpanALine;
      this._senkouSpanBLine = config.senkouSpanBLine || this._senkouSpanBLine;
      this._kumo = config.kumo || this._kumo;
    }

    this._lines.push(this._tenkanSenLine);
    this._lines.push(this._kijunSenLine);
    this._lines.push(this._chikouSpanLine);
    this._lines.push(this._senkouSpanALine);
    this._lines.push(this._senkouSpanBLine);
    this._lines.push(this._kumo);
  }

  get lines(): any {
    return this._lines;
  }

  get conversionLinePeriods(): number {
    return this._conversionLinePeriods;
  }

  set conversionLinePeriods(val: number) {
    this._conversionLinePeriods = val;
  }

  get baseLinePeriods(): number {
    return this._baseLinePeriods;
  }

  set baseLinePeriods(val: number) {
    this._baseLinePeriods = val;
  }

  get loggingSpan2Periods(): number {
    return this._loggingSpan2Periods;
  }

  set loggingSpan2Periods(val: number) {
    this._loggingSpan2Periods = val;
  }

  get displacement(): number {
    return this._displacement;
  }

  set displacement(val: number) {
    this._displacement = val;
  }

  /**
   * Returns indicator name (e.g. 'Simple Moving Average').
   * @returns {string}
   */
  getName() {
    return "Ichimoku Kinko Hyo";
  }

  /**
   * Returns short indicator name (e.g. 'SMA').
   * @returns {string}
   */
  getShortName() {
    return "Ichimoku Kinko Hyo";
  }

  getParametersString() {
    return this._parameters;
  }

  /**
   * Serializes indicator state.
   * @returns {object}
   */
  serialize(): IIndicatorOptions {
    let state = super.serialize();

    state.isIchimokuIndicator = true;
    state = $.extend(
      true,
      {
        conversionLinePeriods: this._conversionLinePeriods,
        baseLinePeriods: this._baseLinePeriods,
        loggingSpan2Periods: this._loggingSpan2Periods,
        displacement: this._displacement,
        tenkanSenLine: this._tenkanSenLine,
        kijunSenLine: this._kijunSenLine,
        chikouSpanLine: this._chikouSpanLine,
        senkouSpanALine: this._senkouSpanALine,
        senkouSpanBLine: this._senkouSpanBLine,
        kumo: this._kumo
      },
      state
    );

    return state;
  }

  /**
   * @internal
   */
  _initIndicator() {
    this._options.parameters = {};
    this._isOverlay = true;
    this._fieldNames = [
      "Tenkan Sen",
      "Kijun Sen",
      "Chikou Span",
      "Senkou Span A",
      "Senkou Span B",
      "Kumo"
    ];
  }

  calculate() {
    let bands = Bands.prototype,
      title = [
        this._conversionLinePeriods,
        this._baseLinePeriods,
        this._loggingSpan2Periods,
        this._displacement
      ];

    return {
      parameters: title ? title.join(", ") : "",
      recordSet: bands.ichimoku(
        this._createRecordset(),
        this._conversionLinePeriods,
        this._baseLinePeriods,
        this._loggingSpan2Periods
      ),
      startIndex: 1
    };
  }

  fixFirstNotNullIncorrectValue(dataserie: DataSeries): DataSeries {
    if (!dataserie) return dataserie;

    let index = 0,
      isContinue = true;

    while (isContinue && index < dataserie.length) {
      if (dataserie.values[index] != null) {
        dataserie.values[index] = null;
        isContinue = false;
      }
      index++;
    }

    return dataserie;
  }

  getDataserieFromRecordSet(
    recordSet: Recordset,
    fieldName: string,
    startIndex: number
  ): DataSeries {
    let field = recordSet && recordSet.getField(fieldName);

    return this.fixFirstNotNullIncorrectValue(
      field
        ? DataSeries.fromField(field, startIndex)
        : new DataSeries(fieldName)
    );
  }

  /**
   * @internal
   */
  shiftInToThePast(dataserie: DataSeries, positionsCount: number): DataSeries {
    if (dataserie.values.length <= positionsCount) return dataserie;

    for (let i = 0; i < positionsCount; i++) {
      dataserie.add(null);
    }

    let newDataserie = new DataSeries(dataserie.name),
      values: any[] = dataserie.values;

    values.splice(0, positionsCount);
    newDataserie.add(values);

    return newDataserie;
  }

  /**
   * @internal
   */
  shiftInToTheFuture(
    dataserie: DataSeries,
    positionsCount: number
  ): DataSeries {
    let newDataserie = new DataSeries(dataserie.name);

    for (let i = 0; i <= dataserie.length + positionsCount; i++) {
      if (i < positionsCount) newDataserie.add(null);
      else newDataserie.add(dataserie.values[i - positionsCount]);
    }

    return newDataserie;
  }

  /**
   * @internal
   */
  hidePlotItem(plotItem: any) {
    plotItem.plot.visible = false;
    if (!this.showValuesInTitle) {
      plotItem.titlePlotSpan.hide();
      plotItem.titleValueSpan.hide();
    }
  }

  /**
   * @internal
   */
  showPlotItem(plotItem: any) {
    plotItem.plot.visible = true;
    if (this.showValuesInTitle) {
      plotItem.titlePlotSpan.show();
      plotItem.titleValueSpan.show();
    }
  }

  /**
   * Updates indicator.
   */
  update() {
    // Calculate your indicator values
    if (!this.isInitialized) {
      // this._panel = this._chart.mainPanel;

      let name = this.getName();
      this._tenkanSenDataseries = new DataSeries(`${name} Ichimoku Tenkan Sen`);
      this._kijunSenDataseries = new DataSeries(`${name} Ichimoku Kijun Sen`);
      this._chikouSpanDataseries = new DataSeries(
        `${name} Ichimoku Chikou Span`
      );
      this._senkouSpanADataseries = new DataSeries(
        `${name} Ichimoku Senkou Span A`
      );
      this._senkouSpanBDataseries = new DataSeries(
        `${name} Ichimoku Senkou Span B`
      );

      if (!this._panel) {
        this._panel = this._chart.mainPanel;
        this._initPanelTitle();
      }

      if (!this._panel.visible) return;

      let tenkanSenPlot = new LinePlot({
        dataSeries: this._tenkanSenDataseries,
        theme: this._lines[0].theme
      });

      let kijunSenPlot = new LinePlot({
        dataSeries: this._kijunSenDataseries,
        theme: this._lines[1].theme
      });

      let chikouSpanPlot = new LinePlot({
        dataSeries: this._chikouSpanDataseries,
        theme: this._lines[2].theme
      });

      let senkouSpanAPlot = new LinePlot({
        dataSeries: this._senkouSpanADataseries,
        theme: this._lines[3].theme
      });

      let senkouSpanBPlot = new LinePlot({
        dataSeries: this._senkouSpanBDataseries,
        theme: this._lines[4].theme
      });

      let kumoPlot = new KumoPlot({
        dataSeries: [this._senkouSpanADataseries, this._senkouSpanBDataseries],
        theme: this._lines[5].theme
      });

      this._tenkanSenPlotItem = this._addPlot(
        tenkanSenPlot,
        this._tenkanSenLine.theme.strokeColor
      );
      this._kijunSenPlotItem = this._addPlot(
        kijunSenPlot,
        this._kijunSenLine.theme.strokeColor
      );
      this._chikouSpanPlotItem = this._addPlot(
        chikouSpanPlot,
        this._chikouSpanLine.theme.strokeColor
      );
      this._senkouSpanAPlotItem = this._addPlot(
        senkouSpanAPlot,
        this._senkouSpanALine.theme.strokeColor
      );
      this._senkouSpanBPlotItem = this._addPlot(
        senkouSpanBPlot,
        this._senkouSpanBLine.theme.strokeColor
      );
      this._kumoPlotItem = this._addPlot(kumoPlot, "transparent");
    }

    this._tenkanSenDataseries.clear();
    this._kijunSenDataseries.clear();
    this._chikouSpanDataseries.clear();
    this._senkouSpanADataseries.clear();
    this._senkouSpanBDataseries.clear();

    this._tenkanSenPlotItem.plot.theme = this._tenkanSenLine.theme;
    this._kijunSenPlotItem.plot.theme = this._kijunSenLine.theme;
    this._chikouSpanPlotItem.plot.theme = this._chikouSpanLine.theme;
    this._senkouSpanAPlotItem.plot.theme = this._senkouSpanALine.theme;
    this._senkouSpanBPlotItem.plot.theme = this._senkouSpanBLine.theme;
    this._tenkanSenPlotItem.color = this._tenkanSenLine.theme.strokeColor;
    this._kijunSenPlotItem.color = this._kijunSenLine.theme.strokeColor;
    this._chikouSpanPlotItem.color = this._chikouSpanLine.theme.strokeColor;
    this._senkouSpanAPlotItem.color = this._senkouSpanALine.theme.strokeColor;
    this._senkouSpanBPlotItem.color = this._senkouSpanBLine.theme.strokeColor;
    this._tenkanSenPlotItem.plot.showValueMarkers = this.showValueMarkers;
    this._kijunSenPlotItem.plot.showValueMarkers = this.showValueMarkers;
    this._chikouSpanPlotItem.plot.showValueMarkers = this.showValueMarkers;
    this._senkouSpanAPlotItem.plot.showValueMarkers = this.showValueMarkers;
    this._senkouSpanBPlotItem.plot.showValueMarkers = this.showValueMarkers;
    this._kumoPlotItem.plot.showValueMarkers = this.showValueMarkers;

    if (this.visible && this._tenkanSenLine.visible)
      this.showPlotItem(this._tenkanSenPlotItem);
    else this.hidePlotItem(this._tenkanSenPlotItem);
    if (this.visible && this._kijunSenLine.visible)
      this.showPlotItem(this._kijunSenPlotItem);
    else this.hidePlotItem(this._kijunSenPlotItem);
    if (this.visible && this._chikouSpanLine.visible)
      this.showPlotItem(this._chikouSpanPlotItem);
    else this.hidePlotItem(this._chikouSpanPlotItem);
    if (this.visible && this._senkouSpanALine.visible)
      this.showPlotItem(this._senkouSpanAPlotItem);
    else this.hidePlotItem(this._senkouSpanAPlotItem);
    if (this.visible && this._senkouSpanBLine.visible)
      this.showPlotItem(this._senkouSpanBPlotItem);
    else this.hidePlotItem(this._senkouSpanBPlotItem);
    if (this.visible && this._kumo.visible)
      this.showPlotItem(this._kumoPlotItem);
    else this.hidePlotItem(this._kumoPlotItem);

    let result = this.calculate();
    this._parameters = result.parameters ? `(${result.parameters})` : "";

    this._tenkanSenDataseries.add(
      this.getDataserieFromRecordSet(
        result.recordSet,
        "Ichimoku Tenkan Sen",
        result.startIndex
      ).values
    );
    this._kijunSenDataseries.add(
      this.getDataserieFromRecordSet(
        result.recordSet,
        "Ichimoku Kijun Sen",
        result.startIndex
      ).values
    );
    this._chikouSpanDataseries.add(
      this.shiftInToThePast(
        this.getDataserieFromRecordSet(
          result.recordSet,
          "Ichimoku Chikou Span",
          result.startIndex
        ),
        this._displacement
      ).values
    );
    this._senkouSpanADataseries.add(
      this.shiftInToTheFuture(
        this.getDataserieFromRecordSet(
          result.recordSet,
          "Ichimoku Senkou Span A",
          result.startIndex
        ),
        this._displacement
      ).values
    );
    this._senkouSpanBDataseries.add(
      this.shiftInToTheFuture(
        this.getDataserieFromRecordSet(
          result.recordSet,
          "Ichimoku Senkou Span B",
          result.startIndex
        ),
        this._displacement
      ).values
    );

    this._updatePanelTitle();
    this.updateHoverRecord();
    this._panel.update();
  }

  /**
   * Shows indicator properties dialog.
   */
  showSettingsDialog() {
    ViewLoader.ichimokuIndicatorSettingsDialog(
      (dialog: IchimokuIndicatorSettingsDialog) => {
        dialog.show({
          chart: this.chart,
          ichimokuIndicator: this
        });
      }
    );
  }

  /**
   * @inheritdoc
   */
  clearDataSeries(dataSeries: string | DataSeries) {
    let indicatorDataSeries = [
      this._tenkanSenDataseries,
      this._kijunSenDataseries,
      this._chikouSpanDataseries,
      this._senkouSpanADataseries,
      this._senkouSpanBDataseries
    ];
    for (let item of indicatorDataSeries) {
      if (
        item &&
        (!dataSeries || item === dataSeries || item.name === dataSeries)
      )
        item.clear();
    }
  }
}

// @endif
