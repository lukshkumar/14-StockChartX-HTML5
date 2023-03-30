import { ColoredHLCBarPriceStyle } from "../StockChartX/index";
import { ColoredHLBarPriceStyle } from "../StockChartX/index";
import { ColoredBarPriceStyle } from "../StockChartX/index";
import { HLCBarPriceStyle } from "../StockChartX/index";
import { HLBarPriceStyle } from "../StockChartX/index";
import { LineBreakPriceStyle } from "../StockChartX/index";
import { KagiPriceStyle, KagiReversalKind } from "../StockChartX/index";
import { RenkoPriceStyle, RenkoBoxSizeKind } from "../StockChartX/index";
import {
  PointAndFigurePriceStyle,
  PointAndFigureBoxSizeKind,
  PointAndFigureSource
} from "../StockChartX/index";
import { IDialogConfig } from "./index";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { Dialog } from "./index";
import { IPriceStyle } from "../StockChartX/index";
import { BarPriceStyle } from "../StockChartX/index";

/// <reference path="../references.ts" />
"use strict";

export interface IPriceStyleDialogConfig extends IDialogConfig {
  priceStyle: IPriceStyle;
}

const ID = {
  DIALOG: "#scxPriceStyleDialog_",
  INPUT: ".scxPriceStyleDialog_input_",
  FIGURE: ".scxPriceStyleDialog_panel_ntb_"
};

const numericFieldConfig = {
  showArrows: true,
  maxValue: 100,
  minValue: 1,
  value: 1
};

const numericFieldFloatConfig = {
  showArrows: true,
  maxValue: 100,
  minValue: 0.01,
  priceDecimals: 5,
  value: 1
};

export class PriceStyleSettingsDialog extends Dialog {
  protected _config: IPriceStyleDialogConfig;
  private _title: JQuery;
  private _panelFigureInputsPanel: JQuery;
  private _input_source: JQuery;
  private _input_boxSizeKind: JQuery;
  private _input_ATRlength: JQuery;
  private _input_boxSize: JQuery;
  private _input_pointsCount: JQuery;
  private _input_reversalAmount: JQuery;
  private _input_reversalDoubleAmount: JQuery;
  private _input_numberOfLine: JQuery;
  private _panelFigureSource: JQuery;
  private _panelFigureBoxCalculationMethods: JQuery;
  private _panelFigureATRLength: JQuery;
  private _panelFigureBoxSize: JQuery;
  private _panelFigurePointsCount: JQuery;
  private _panelFigureReversalAmount: JQuery;
  private _panelFigureReversalDoubleAmount: JQuery;
  private _panelFigureNumberOfLine: JQuery;
  private _panelFigureBarStyle: JQuery;
  private _input_barStyle: JQuery;
  private _panelFigureColoredBarStyle: JQuery;
  private _input_coloredBarStyle: JQuery;
  private _source: string;
  private _boxSizeKind: string;
  private _priceStyleKind: string;
  private _barsStyle: string;
  private _coloredBarsStyle: string;
  private _isApplyClicked: boolean = false;
  private _input_instrumentPriceStyle: JQuery;
  private _instrumentPriceStyle: string;
  private _panelFigureInstrumentPriceStyle: JQuery;

  constructor(container: JQuery) {
    super(container);

    this._initFields();
    this._init();
  }

  public show(config: IPriceStyleDialogConfig): void {
    if (!this.initDialog(config)) return;

    const chartPanel = config.chartPanel;
    // Handle Instrument/symbol chartPanel
    if (chartPanel && chartPanel.symbol) {
      this.handleInstrumentPanel(chartPanel);
    } else {
      this._priceStyleKind = config.priceStyle.chart.priceStyleKind;

      this._setDialogTitle();
      this._setValues(this._priceStyleKind);

      this._switchView(this._priceStyleKind);
    }

    this._isApplyClicked = false;
    super.show(config);
  }

  private _init(): void {
    this._input_ATRlength.scxNumericField(numericFieldConfig);
    this._input_boxSize.scxNumericField(numericFieldFloatConfig);
    this._input_pointsCount.scxNumericField(numericFieldConfig);
    this._input_reversalAmount.scxNumericField(numericFieldConfig);
    this._input_reversalDoubleAmount.scxNumericField(numericFieldFloatConfig);
    this._input_numberOfLine.scxNumericField(numericFieldConfig);

    this._input_source.selectpicker({ container: "body" });
    this._input_boxSizeKind.selectpicker({ container: "body" });
    this._input_barStyle.selectpicker({ container: "body" });
    this._input_coloredBarStyle.selectpicker({ container: "body" });

    this._input_instrumentPriceStyle.selectpicker({ container: "body" });

    this._input_source.on("change", () => {
      this._source = this._input_source.val();
      this._switchPriceStyleMethod();
    });

    this._input_boxSizeKind.on("change", () => {
      this._boxSizeKind = this._input_boxSizeKind.val();
      this._switchPriceStyleMethod();
    });

    this._input_barStyle.on("change", () => {
      this._barsStyle = this._input_barStyle.val();
    });

    this._input_coloredBarStyle.on("change", () => {
      this._coloredBarsStyle = this._input_coloredBarStyle.val();
    });

    this._input_instrumentPriceStyle.on("change", () => {
      this._instrumentPriceStyle = this._input_instrumentPriceStyle.val();
    });

    this._dialog.find(`${ID.DIALOG}btn_save`).on("click", () => {
      this._apply();
    });
  }

  private _switchView(priceStyleKind: string): void {
    this._panelFigureInputsPanel.show();

    // @if SCX_LICENSE != 'free'
    switch (priceStyleKind) {
      // @if SCX_LICENSE = 'full'
      case PointAndFigurePriceStyle.className:
        this._switchPriceStyleMethod();
        this._panelFigureNumberOfLine.hide();
        this._panelFigureSource.show();
        this._panelFigureBoxCalculationMethods.show();
        this._panelFigureReversalAmount.show();
        this._panelFigureReversalDoubleAmount.hide();
        this._panelFigureBarStyle.hide();
        this._panelFigureColoredBarStyle.hide();

        this._panelFigureInstrumentPriceStyle.hide();
        return;
      case RenkoPriceStyle.className:
        this._switchPriceStyleMethod();
        this._panelFigureNumberOfLine.hide();
        this._panelFigureSource.hide();
        this._panelFigureBoxCalculationMethods.show();
        this._panelFigureReversalAmount.hide();
        this._panelFigureReversalDoubleAmount.hide();
        this._panelFigureBarStyle.hide();
        this._panelFigureColoredBarStyle.hide();

        this._panelFigureInstrumentPriceStyle.hide();
        return;
      case KagiPriceStyle.className:
        this._switchPriceStyleMethod();
        this._panelFigureNumberOfLine.hide();
        this._panelFigureSource.hide();
        this._panelFigureBoxCalculationMethods.show();
        this._panelFigureBoxSize.hide();
        this._panelFigurePointsCount.hide();
        this._panelFigureATRLength.hide();
        this._panelFigureBarStyle.hide();
        this._panelFigureColoredBarStyle.hide();

        this._panelFigureInstrumentPriceStyle.hide();
        return;
      case LineBreakPriceStyle.className:
        this._panelFigureNumberOfLine.show();
        this._panelFigureSource.hide();
        this._panelFigureBoxCalculationMethods.hide();
        this._panelFigureReversalAmount.hide();
        this._panelFigureBoxSize.hide();
        this._panelFigurePointsCount.hide();
        this._panelFigureATRLength.hide();
        this._panelFigureReversalDoubleAmount.hide();
        this._panelFigureBarStyle.hide();
        this._panelFigureColoredBarStyle.hide();

        this._panelFigureInstrumentPriceStyle.hide();
        return;
      // @endif
      case BarPriceStyle.className:
      case HLBarPriceStyle.className:
      case HLCBarPriceStyle.className:
        this._panelFigureBarStyle.show();
        this._panelFigureNumberOfLine.hide();
        this._panelFigureSource.hide();
        this._panelFigureBoxCalculationMethods.hide();
        this._panelFigureReversalAmount.hide();
        this._panelFigureBoxSize.hide();
        this._panelFigurePointsCount.hide();
        this._panelFigureATRLength.hide();
        this._panelFigureReversalDoubleAmount.hide();
        this._panelFigureColoredBarStyle.hide();

        this._panelFigureInstrumentPriceStyle.hide();
        return;
      case ColoredBarPriceStyle.className:
      case ColoredHLBarPriceStyle.className:
      case ColoredHLCBarPriceStyle.className:
        this._panelFigureColoredBarStyle.show();
        this._panelFigureBarStyle.hide();
        this._panelFigureNumberOfLine.hide();
        this._panelFigureSource.hide();
        this._panelFigureBoxCalculationMethods.hide();
        this._panelFigureReversalAmount.hide();
        this._panelFigureBoxSize.hide();
        this._panelFigurePointsCount.hide();
        this._panelFigureATRLength.hide();
        this._panelFigureReversalDoubleAmount.hide();

        this._panelFigureInstrumentPriceStyle.hide();
        return;
      default:
        return;
    }
    // @endif
  }

  private _switchPriceStyleMethod(): void {
    // @if SCX_LICENSE = 'full'
    switch (this._boxSizeKind) {
      case PointAndFigureBoxSizeKind.ATR:
        this._panelFigureBoxSize.hide();
        this._panelFigurePointsCount.hide();
        this._panelFigureATRLength.show();
        break;
      case PointAndFigureBoxSizeKind.FIXED:
        this._panelFigureBoxSize.show();
        this._panelFigurePointsCount.hide();
        this._panelFigureATRLength.hide();
        break;
      case PointAndFigureBoxSizeKind.POINTS:
        this._panelFigureBoxSize.hide();
        this._panelFigurePointsCount.show();
        this._panelFigureATRLength.hide();
        break;
      default:
        break;
    }

    if (this._priceStyleKind === KagiPriceStyle.className) {
      this._panelFigurePointsCount.hide();
      if (this._boxSizeKind === KagiReversalKind.ATR) {
        this._panelFigureATRLength.hide();
        this._panelFigureReversalAmount.show();
        this._panelFigureReversalDoubleAmount.hide();
      } else {
        this._panelFigureBoxSize.hide();
        this._panelFigureReversalAmount.hide();
        this._panelFigureReversalDoubleAmount.show();
      }
    }
    // @endif
  }

  private _setPriceStyleValue(symbol: string): void {}

  private _setValues(priceStyleKind: string): void {
    switch (priceStyleKind) {
      // @if SCX_LICENSE = 'full'
      case PointAndFigurePriceStyle.className:
        let pointAndFigurePriceStyle = <PointAndFigurePriceStyle>(
          this._config.priceStyle
        );
        this._source = pointAndFigurePriceStyle.source;
        this._input_source
          .selectpicker("val", this._source || PointAndFigureSource.CLOSE)
          .selectpicker("refresh");

        this._boxSizeKind = pointAndFigurePriceStyle.boxSize.kind;
        this._input_boxSizeKind
          .selectpicker(
            "val",
            this._boxSizeKind || PointAndFigureBoxSizeKind.ATR
          )
          .selectpicker("refresh");
        switch (this._boxSizeKind) {
          case PointAndFigureBoxSizeKind.ATR:
            this._input_ATRlength.scxNumericField(
              "setValue",
              pointAndFigurePriceStyle.boxSize.value || 1
            );
            break;
          case PointAndFigureBoxSizeKind.FIXED:
            this._input_boxSize.scxNumericField(
              "setValue",
              pointAndFigurePriceStyle.boxSize.value || 1
            );
            break;
          case PointAndFigureBoxSizeKind.POINTS:
            this._input_pointsCount.scxNumericField(
              "setValue",
              pointAndFigurePriceStyle.boxSize.value || 1
            );
            break;
          default:
            break;
        }

        this._input_reversalAmount.scxNumericField(
          "setValue",
          pointAndFigurePriceStyle.reversal || 1
        );

        return;
      case RenkoPriceStyle.className:
        let renkoPriceStyle = <RenkoPriceStyle>this._config.priceStyle;
        this._boxSizeKind = renkoPriceStyle.boxSize.kind;
        this._input_boxSizeKind
          .selectpicker("val", this._boxSizeKind || RenkoBoxSizeKind.ATR)
          .selectpicker("refresh");

        switch (this._boxSizeKind) {
          case PointAndFigureBoxSizeKind.ATR:
            this._input_ATRlength.scxNumericField(
              "setValue",
              renkoPriceStyle.boxSize.value || 1
            );
            break;
          case PointAndFigureBoxSizeKind.FIXED:
            this._input_boxSize.scxNumericField(
              "setValue",
              renkoPriceStyle.boxSize.value || 1
            );
            break;
          case PointAndFigureBoxSizeKind.POINTS:
            this._input_pointsCount.scxNumericField(
              "setValue",
              renkoPriceStyle.boxSize.value || 1
            );
            break;
          default:
            break;
        }

        return;
      case KagiPriceStyle.className:
        let kagiPriceStyle = <KagiPriceStyle>this._config.priceStyle;
        this._boxSizeKind = kagiPriceStyle.reversal.kind;

        this._input_boxSizeKind
          .selectpicker("val", this._boxSizeKind || KagiReversalKind.ATR)
          .selectpicker("refresh");

        switch (this._boxSizeKind) {
          case PointAndFigureBoxSizeKind.ATR:
            this._input_reversalAmount.scxNumericField(
              "setValue",
              kagiPriceStyle.reversal.value || 1
            );
            break;
          case PointAndFigureBoxSizeKind.FIXED:
            this._input_reversalDoubleAmount.scxNumericField(
              "setValue",
              kagiPriceStyle.reversal.value || 1
            );
            break;
          case PointAndFigureBoxSizeKind.POINTS:
            this._input_reversalDoubleAmount.scxNumericField(
              "setValue",
              kagiPriceStyle.reversal.value || 1
            );
            break;
          default:
            break;
        }

        return;
      case LineBreakPriceStyle.className:
        let lineBreakPriceStyle = <LineBreakPriceStyle>this._config.priceStyle;
        this._input_numberOfLine.scxNumericField(
          "setValue",
          lineBreakPriceStyle.lines || 1
        );

        return;
      // @endif
      // @if SCX_LICENSE != 'free'
      case BarPriceStyle.className:
      case HLBarPriceStyle.className:
      case HLCBarPriceStyle.className:
        this._setBarStyle(priceStyleKind);

        return;
      case ColoredBarPriceStyle.className:
      case ColoredHLBarPriceStyle.className:
      case ColoredHLCBarPriceStyle.className:
        this._setBarStyle(priceStyleKind, true);

        return;
      // @endif
      default:
        this.hide();

        return;
    }
  }

  private _setBarStyle(barStyle: string, colored?: boolean): void {
    if (colored) {
      this._coloredBarsStyle = barStyle;
      this._input_coloredBarStyle
        .selectpicker("val", barStyle)
        .selectpicker("refresh");
    } else {
      this._barsStyle = barStyle;
      this._input_barStyle
        .selectpicker("val", barStyle)
        .selectpicker("refresh");
    }
  }

  private _getValues(): void {
    let chart = this._config.chart;
    let chartPanel = this._config.chartPanel;
    if (chartPanel && chartPanel.symbol) {
      const _priceStylekind = chartPanel.symbol.priceStyleKind;
      if (this._instrumentPriceStyle !== _priceStylekind) {
        chartPanel.symbol.changePriceStyle(this._instrumentPriceStyle);
      }
      return;
    }

    switch (this._priceStyleKind) {
      // @if SCX_LICENSE = 'full'
      case PointAndFigurePriceStyle.className:
        let pointAndFigurePriceStyle = <PointAndFigurePriceStyle>(
          this._config.priceStyle
        );
        pointAndFigurePriceStyle.source = this._input_source.val();
        pointAndFigurePriceStyle.boxSize.kind = this._input_boxSizeKind.val();

        switch (pointAndFigurePriceStyle.boxSize.kind) {
          case PointAndFigureBoxSizeKind.ATR:
            pointAndFigurePriceStyle.boxSize.value = this._input_ATRlength.scxNumericField(
              "getValue"
            );
            break;
          case PointAndFigureBoxSizeKind.FIXED:
            pointAndFigurePriceStyle.boxSize.value = this._input_boxSize.scxNumericField(
              "getValue"
            );
            break;
          case PointAndFigureBoxSizeKind.POINTS:
            pointAndFigurePriceStyle.boxSize.value = this._input_pointsCount.scxNumericField(
              "getValue"
            );
            break;
          default:
            break;
        }

        pointAndFigurePriceStyle.reversal = this._input_reversalAmount.scxNumericField(
          "getValue"
        );

        break;
      case RenkoPriceStyle.className:
        let renkoPriceStyle = <RenkoPriceStyle>this._config.priceStyle;
        renkoPriceStyle.boxSize.kind = this._input_boxSizeKind.val();

        switch (renkoPriceStyle.boxSize.kind) {
          case PointAndFigureBoxSizeKind.ATR:
            renkoPriceStyle.boxSize.value = this._input_ATRlength.scxNumericField(
              "getValue"
            );
            break;
          case PointAndFigureBoxSizeKind.FIXED:
            renkoPriceStyle.boxSize.value = this._input_boxSize.scxNumericField(
              "getValue"
            );
            break;
          case PointAndFigureBoxSizeKind.POINTS:
            renkoPriceStyle.boxSize.value = this._input_pointsCount.scxNumericField(
              "getValue"
            );
            break;
          default:
            break;
        }
        break;
      case KagiPriceStyle.className:
        let kagiPriceStyle = <KagiPriceStyle>this._config.priceStyle;
        kagiPriceStyle.reversal.kind = this._input_boxSizeKind.val();

        switch (kagiPriceStyle.reversal.kind) {
          case PointAndFigureBoxSizeKind.ATR:
            kagiPriceStyle.reversal.value = this._input_reversalAmount.scxNumericField(
              "getValue"
            );
            break;
          case PointAndFigureBoxSizeKind.FIXED:
            kagiPriceStyle.reversal.value = this._input_reversalDoubleAmount.scxNumericField(
              "getValue"
            );
            break;
          case PointAndFigureBoxSizeKind.POINTS:
            kagiPriceStyle.reversal.value = this._input_reversalDoubleAmount.scxNumericField(
              "getValue"
            );
            break;
          default:
            break;
        }
        break;
      case LineBreakPriceStyle.className:
        let lineBreakPriceStyle = <LineBreakPriceStyle>this._config.priceStyle;
        lineBreakPriceStyle.lines = this._input_numberOfLine.scxNumericField(
          "getValue"
        );

        break;
      // @endif
      // @if SCX_LICENSE != 'free'
      case BarPriceStyle.className:
      case HLBarPriceStyle.className:
      case HLCBarPriceStyle.className:
        chart.priceStyleKind = this._barsStyle;
        chart.update();

        break;
      case ColoredBarPriceStyle.className:
      case ColoredHLBarPriceStyle.className:
      case ColoredHLCBarPriceStyle.className:
        chart.priceStyleKind = this._coloredBarsStyle;
        chart.update();

        break;
      // @endif
      default:
        throw new Error(`Unknown price style: ${this._priceStyleKind}`);
    }
  }

  private _apply(): void {
    this._getValues();

    // @if SCX_LICENSE != 'free'
    let priceStyleKind = this._config.chart.priceStyleKind;

    if (
      priceStyleKind !== BarPriceStyle.className &&
      priceStyleKind !== HLBarPriceStyle.className &&
      priceStyleKind !== HLCBarPriceStyle.className &&
      priceStyleKind !== ColoredBarPriceStyle.className &&
      priceStyleKind !== ColoredHLBarPriceStyle.className &&
      priceStyleKind !== ColoredHLCBarPriceStyle.className
    ) {
      this._config.priceStyle.apply();
    }
    // @endif

    this._isApplyClicked = true;
    this._config.chart.dateScale.setNeedsAutoScale();
    this.hide();
  }

  private _setDialogTitle() {
    this._title.scxLocalize(
      `priceStyleSettingsDialog.titles.${this._priceStyleKind}`
    );
  }

  private _initFields(): void {
    let dialog = this._dialog;

    this._title = dialog.find(`${ID.DIALOG}title`);
    this._panelFigureInputsPanel = dialog.find(`${ID.FIGURE}inputsPanel`);
    this._input_source = dialog.find(`${ID.INPUT}source`);
    this._input_boxSizeKind = dialog.find(`${ID.INPUT}boxSizeKind`);
    this._input_ATRlength = dialog.find(`${ID.INPUT}ATRLength`);
    this._input_boxSize = dialog.find(`${ID.INPUT}boxSize`);
    this._input_pointsCount = dialog.find(`${ID.INPUT}pointsCount`);
    this._input_reversalAmount = dialog.find(`${ID.INPUT}reversalAmount`);
    this._input_reversalDoubleAmount = dialog.find(
      `${ID.INPUT}reversalDoubleAmount`
    );
    this._input_numberOfLine = dialog.find(`${ID.INPUT}numberOfLine`);
    this._panelFigureSource = dialog.find(`${ID.FIGURE}source`);
    this._panelFigureBoxCalculationMethods = dialog.find(
      `${ID.FIGURE}boxSizeKind`
    );
    this._panelFigureATRLength = dialog.find(`${ID.FIGURE}ATRLength`);
    this._panelFigureBoxSize = dialog.find(`${ID.FIGURE}boxSize`);
    this._panelFigurePointsCount = dialog.find(`${ID.FIGURE}pointsCount`);
    this._panelFigureReversalAmount = dialog.find(`${ID.FIGURE}reversalAmount`);
    this._panelFigureReversalDoubleAmount = dialog.find(
      `${ID.FIGURE}reversalDoubleAmount`
    );
    this._panelFigureNumberOfLine = dialog.find(`${ID.FIGURE}numberOfLine`);
    this._panelFigureBarStyle = dialog.find(`${ID.FIGURE}barStyle`);
    this._input_barStyle = dialog.find(`${ID.INPUT}barStyle`);
    this._panelFigureColoredBarStyle = dialog.find(
      `${ID.FIGURE}coloredBarStyle`
    );
    this._input_coloredBarStyle = dialog.find(`${ID.INPUT}coloredBarStyle`);

    this._panelFigureInstrumentPriceStyle = dialog.find(
      `${ID.FIGURE}instrumentPriceStyle`
    );

    this._input_instrumentPriceStyle = dialog.find(
      `${ID.INPUT}instrumentPriceStyle`
    );
  }
  handleInstrumentPanel(chartPanel) {
    this._panelFigureBarStyle.hide();
    this._panelFigureNumberOfLine.hide();
    this._panelFigureSource.hide();
    this._panelFigureBoxCalculationMethods.hide();
    this._panelFigureReversalAmount.hide();
    this._panelFigureBoxSize.hide();
    this._panelFigurePointsCount.hide();
    this._panelFigureATRLength.hide();
    this._panelFigureReversalDoubleAmount.hide();
    this._panelFigureColoredBarStyle.hide();

    this._panelFigureInstrumentPriceStyle.show();

    const instrumentPriceStyle = chartPanel.symbol.priceStyleKind;
    this._input_instrumentPriceStyle
      .selectpicker("val", instrumentPriceStyle)
      .selectpicker("refresh");
  }
}
