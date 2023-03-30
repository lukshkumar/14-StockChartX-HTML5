import { DataSeries, DataSeriesSuffix } from "../index";
import { TAIndicator } from "../index";
import { ITAIndicatorConfig } from "../index";
import { ILineTheme } from "../index";
import { Recordset } from "../../TASdk/Recordset";
import * as TASdk from "../../TASdk/TASdk";
import { Projection } from "../index";
import { Bands } from "../../TASdk/Bands";
import { LinePlot, IIndicatorOptions } from "../index";
import { ViewLoader } from "../../StockChartX.UI/index";
import { DarvasBoxSettingsDialog } from "../../StockChartX.UI/index";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

// @if SCX_LICENSE = 'full'
"use strict";

export interface ILineConfig {
  hasUserConfig?: boolean;
  priceLine: boolean;
  theme: ILineTheme;
  visible: boolean;
}

export interface IDarvasBoxConfig extends ITAIndicatorConfig {
  darvasBoxLinePeriods: number;
  boxTop: number;
  boxBottom: number;

  topLine: ILineConfig;
  bottomLine: ILineConfig;
}

const $ = window.jQuery;

export class DarvasBox extends TAIndicator {
  /**
   * @internal
   */
  private _darvasBoxLinePeriods;

  /**
   * @internal
   */
  private _boxTop: number = 1;

  /**
   * @internal
   */
  private _boxBottom: number = 1;

  /**
   * @internal
   */
  private _topLineDataseries: DataSeries = null;

  /**
   * @internal
   */
  private _bottomLineDataseries: DataSeries = null;

  /**
   * @internal
   */
  private _topLinePlotItem = null;

  /**
   * @internal
   */
  private _bottomLinePlotItem = null;

  /**
   * @internal
   */
  private _lines = [];

  constructor(config?: IDarvasBoxConfig) {
    super($.extend(true, { taIndicator: TASdk.DBox }, config));

    this.allowSettingsDialog = true;

    let topLine, bottomLine;
    if (
      config &&
      config.darvasBoxLinePeriods &&
      config.topLine &&
      config.bottomLine
    ) {
      this._darvasBoxLinePeriods = config.darvasBoxLinePeriods;
      topLine = config.topLine;
      bottomLine = config.bottomLine;
    } else {
      topLine = {
        hasUserConfig: false,
        priceLine: false,
        theme: null,
        visible: true
      };
      bottomLine = {
        hasUserConfig: false,
        priceLine: false,
        theme: null,
        visible: true
      };

      this._darvasBoxLinePeriods = 5;
    }

    this._lines.push(topLine);
    this._lines.push(bottomLine);
  }

  get lines(): any {
    return this._lines;
  }
  get darvasBoxLinePeriods(): number {
    return this._darvasBoxLinePeriods;
  }

  set darvasBoxLinePeriods(val: number) {
    this._darvasBoxLinePeriods = val;
  }

  get boxTop(): number {
    return this._boxTop;
  }

  set boxTop(val: number) {
    this._boxTop = val;
  }

  get boxBottom(): number {
    return this._boxBottom;
  }

  set boxBottom(val: number) {
    this._boxBottom = val;
  }

  /**
   * Returns indicator name (e.g. 'Simple Moving Average').
   * @returns {string}
   */
  getName() {
    return "Darvas Box";
  }

  /**
   * Returns short indicator name (e.g. 'SMA').
   * @returns {string}
   */
  getShortName() {
    return "Darvas Box";
  }

  getParametersString() {
    return this._parameters;
  }
  get projection(): Projection {
    return this._panel && this._panel.getProjection(this.valueScale);
  }

  /**
   * Serializes indicator state.
   * @returns {object}
   */
  serialize(): IIndicatorOptions {
    let state = super.serialize();
    state.isDarvasBox = true;
    state = $.extend(
      true,
      {
        darvasBoxLinePeriods: this._darvasBoxLinePeriods,
        boxTop: this._boxTop,
        boxBottom: this._boxBottom,
        topLine: this._lines[0],
        bottomLine: this._lines[1]
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
    this._fieldNames = ["Top Line", "Bottom Line"];
  }

  calculate() {
    let bands = Bands.prototype,
      title = [this._darvasBoxLinePeriods];

    return {
      parameters: title ? title.join(", ") : "",
      recordSet: bands.darvasbox(
        this._createRecordset(),
        this._darvasBoxLinePeriods
      ),
      startIndex: 1
    };
  }

  /**
   * @internal
   */
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
  hidePlotItem(plotItem: any) {
    plotItem.plot.visible = false;
    plotItem.titlePlotSpan.hide();
    plotItem.titleValueSpan.hide();
  }

  /**
   * @internal
   */
  showPlotItem(plotItem: any) {
    plotItem.plot.visible = true;
    plotItem.titlePlotSpan.show();
    plotItem.titleValueSpan.show();
  }

  /**
   * Updates indicator.
   */
  update() {
    if (!this._lines[0].hasUserConfig) {
      let lineConfig = this.chart.theme.plot.indicator.line1;
      this._lines[0].theme = {
        width: lineConfig.width,
        lineStyle: lineConfig.lineStyle,
        strokeColor: lineConfig.strokeColor
      };
    }
    if (!this._lines[1].hasUserConfig) {
      let lineConfig = this.chart.theme.plot.indicator.line1;
      this._lines[1].theme = {
        width: lineConfig.width,
        lineStyle: lineConfig.lineStyle,
        strokeColor: lineConfig.strokeColor
      };
    }
    if (!this.isInitialized) {
      let highestHigh = 0;
      let highDataSeries = this.chart.primaryDataSeries(DataSeriesSuffix.HIGH);

      for (let i = 0; i <= this.boxTop; i++) {
        let value = <number>highDataSeries.valueAtIndex(i);
        if (value > highestHigh) {
          highestHigh = value;
        }
      }

      this._topLineDataseries = new DataSeries(`${this.getName()} Top Line`);

      let lowestLow = highestHigh;
      let lowDataSeries = this.chart.primaryDataSeries(DataSeriesSuffix.LOW);
      for (let i = 0; i <= this.boxBottom; i++) {
        let value = <number>lowDataSeries.valueAtIndex(i);

        if (value < lowestLow) {
          lowestLow = value;
        }
      }
      this._bottomLineDataseries = new DataSeries(
        `${this.getName()}Bottom Line`
      );

      if (!this._panel) {
        this._panel = this._chart.mainPanel;
        this._initPanelTitle();
      }

      if (!this._panel.visible) return;

      let topLinePlot = new LinePlot({
        dataSeries: this._topLineDataseries,
        theme: this._lines[0].theme
      });

      let bottomLinePlot = new LinePlot({
        dataSeries: this._bottomLineDataseries,
        theme: this._lines[1].theme
      });

      this._topLinePlotItem = this._addPlot(
        topLinePlot,
        this._lines[0].theme.strokeColor
      );
      this._bottomLinePlotItem = this._addPlot(
        bottomLinePlot,
        this._lines[1].theme.strokeColor
      );
    }

    this._topLineDataseries.clear();
    this._bottomLineDataseries.clear();
    if (this.visible) {
      this.showPlotItem(this._topLinePlotItem);
      this.showPlotItem(this._bottomLinePlotItem);
    } else {
      this.hidePlotItem(this._topLinePlotItem);
      this.hidePlotItem(this._bottomLinePlotItem);
    }

    let result = this.calculate();
    this._parameters = result.parameters ? `(${result.parameters})` : "";

    this._topLineDataseries.add(
      this.getDataserieFromRecordSet(
        result.recordSet,
        "Top Line",
        result.startIndex
      ).values
    );
    this._bottomLineDataseries.add(
      this.getDataserieFromRecordSet(
        result.recordSet,
        "Bottom Line",
        result.startIndex
      ).values
    );
    this._topLinePlotItem.plot.showValueMarkers = this.showValueMarkers;
    this._bottomLinePlotItem.plot.showValueMarkers = this.showValueMarkers;
    this._topLinePlotItem.plot.theme = this._lines[0].theme;
    this._bottomLinePlotItem.plot.theme = this._lines[1].theme;
    this._topLinePlotItem.color = this._lines[0].theme.strokeColor;
    this._bottomLinePlotItem.color = this._lines[1].theme.strokeColor;
    this.updateHoverRecord();
    this._updatePanelTitle();
  }

  /**
   * Shows indicator properties dialog.
   */
  showSettingsDialog() {
    ViewLoader.darvasBoxSettingsDialog((dialog: DarvasBoxSettingsDialog) => {
      dialog.show({
        chart: this.chart,
        dBox: this
      });
    });
  }

  /**
   * @inheritdoc
   */
  clearDataSeries(dataSeries: string | DataSeries) {
    let indicatorDataSeries = [
      this._topLineDataseries,
      this._bottomLineDataseries
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
