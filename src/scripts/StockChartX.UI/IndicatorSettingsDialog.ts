import { IndicatorParam } from "../StockChartX/Indicators/utils";
import * as TASdk from "../TASdk/TASdk";
import { DarvasBox } from "../StockChartX/index";
import { IchimokuIndicator } from "../StockChartX/index";
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
import { ColorPicker } from "./index";
import { IndicatorParamValue, Indicator } from "../StockChartX/index";
import { DataSeriesSuffix } from "../StockChartX/index";
import { LineStyle } from "../StockChartX/index";
// import { $ } from "../external/typescript/jquery";
import { JsUtil } from "../StockChartX/index";
const $ = window.jQuery;

"use strict";

export interface IIndicatorSettingsDialogConfig extends IDialogConfig {
  indicator?: Indicator;
  ichimokuIndicator?: IchimokuIndicator;
  dBox?: DarvasBox;
  done?: () => void;
}

const CLASS_INVALID_VALUE = "scxInvalidValue";
const ID = {
  DIALOG_TITLE: "#scxIndicatorDialog_title",
  CONTAINER: "#scxIndicatorDialog_container_",
  INPUT: "#scxIndicatorDialog_input_",
  LABEL: "#scxIndicatorDialog_label_"
};

const CLASS_SPECTRUM = "scxSpectrumIndicatorPropertiesDialog";

const numericFieldConfigInt = {
  value: 1
};

const numericFieldConfigFloat = {
  canBeNegative: true,
  priceDecimals: 2,
  value: 1
};

export class IndicatorSettingsDialog extends Dialog {
  protected _config: IIndicatorSettingsDialogConfig;
  private _indicator: any;
  private _input_pivotTimeDropDown: JQuery;
  private _input_source: JQuery;
  private _title: JQuery;
  private _input_multiplier: JQuery;
  private _container_cycle1: JQuery;
  private _container_cycle2: JQuery;
  private _container_kPeriods: JQuery;
  private _container_kSmoothing: JQuery;
  private _container_dPeriods: JQuery;
  private _input_pointsOrPercent: JQuery;
  private _input_source2: JQuery;
  private _input_maType: JQuery;
  private _input_pctDMovingAverageType: JQuery;
  private _input_periods: JQuery;
  private _input_r2scale: JQuery;
  private _input_standardDeviations: JQuery;
  private _input_shift: JQuery;
  private _input_minTick: JQuery;
  private _input_limitMove: JQuery;
  private _input_kPeriods: JQuery;
  private _input_kSmoothing: JQuery;
  private _input_kDoubleSmoothing: JQuery;
  private _input_dPeriods: JQuery;
  private _input_barHistory: JQuery;
  private _input_cycle1: JQuery;
  private _input_cycle2: JQuery;
  private _input_cycle3: JQuery;
  private _input_shortTerm: JQuery;
  private _input_longTerm: JQuery;
  private _input_roc: JQuery;
  private _input_signalPeriods: JQuery;
  private _input_shortCycle: JQuery;
  private _input_longCycle: JQuery;
  private _input_minAF: JQuery;
  private _input_maxAF: JQuery;
  private _input_levels: JQuery;
  private _label_line1: JQuery;
  private _input_line1_width: JQuery;
  private _input_line1_color: ColorPicker;
  private _input_line1_style: JQuery;
  private _label_line2: JQuery;
  private _input_line2_width: JQuery;
  private _input_line2_color: ColorPicker;
  private _input_line2_style: JQuery;
  private _label_line3: JQuery;
  private _input_line3_width: JQuery;
  private _input_line3_color: ColorPicker;
  private _input_line3_style: JQuery;
  private _input_histogram_line1_color: ColorPicker;
  private _input_histogram_line2_color: ColorPicker;

  constructor(container: JQuery) {
    super(container);

    this._indicator = TASdk.Unknown;
    this._initFields();
    this._init();
  }

  public show(config: IIndicatorSettingsDialogConfig) {
    if (!this.initDialog(config)) return;
    this._config = config;
    this._indicator = config.indicator;

    this._setDialogTitle();
    this._config.chart.localize(this._dialog);

    super.show(config);
    this._setViewAndValues();
  }

  public hide(): void {
    this._dialog.find(".scxSpectrum").spectrum("hide");

    super.hide();
  }

  private _init(): void {
    let colorPickerParams = {
      containerClassName: CLASS_SPECTRUM,
      localStorageKey: "scxIndicatorDialog_spectrum",
      showAlpha: true
    };
    this._input_line1_color = this._dialog
      .find(`${ID.INPUT}line1_color`)
      .scx()
      .colorPicker(colorPickerParams);
    this._input_line2_color = this._dialog
      .find(`${ID.INPUT}line2_color`)
      .scx()
      .colorPicker(colorPickerParams);
    this._input_line3_color = this._dialog
      .find(`${ID.INPUT}line3_color`)
      .scx()
      .colorPicker(colorPickerParams);
    this._input_histogram_line1_color = this._dialog
      .find(`${ID.INPUT}histogram_line1_color`)
      .scx()
      .colorPicker(colorPickerParams);
    this._input_histogram_line2_color = this._dialog
      .find(`${ID.INPUT}histogram_line2_color`)
      .scx()
      .colorPicker(colorPickerParams);

    this._dialog.find(".scxComboBox").selectpicker({ container: "body" });
    this._dialog
      .find("#scxIndicatorDialog_btn_save")
      .off("click")
      .click(() => {
        if (this._dialog.find(`.${CLASS_INVALID_VALUE}`).length === 0) {
          this._save();
        }
      });
    this._dialog
      .find("#scxIndicatorDialog_btn_apply")
      .off("click")
      .click(() => {
        if (this._dialog.find(`.${CLASS_INVALID_VALUE}`).length === 0) {
          this._apply();
        }
      });
  }

  private static _getMAType(value: string): number {
    let maType = parseInt(value, 10);
    switch (maType) {
      case TASdk.Const.simpleMovingAverage:
      case TASdk.Const.exponentialMovingAverage:
      case TASdk.Const.timeSeriesMovingAverage:
      case TASdk.Const.triangularMovingAverage:
      case TASdk.Const.variableMovingAverage:
      case TASdk.Const.VIDYA:
      case TASdk.Const.wellesWilderSmoothing:
      case TASdk.Const.weightedMovingAverage:
        return maType;
      default:
        return TASdk.Const.simpleMovingAverage;
    }
  }

  private static _getPointsOrPercent(value: string): number {
    let val = parseInt(value, 10);

    if (val === IndicatorParamValue.POINT) return val;

    return IndicatorParamValue.PERCENT;
  }

  private _getSource(value: string): string {
    if (this._indicator.chart.findDataSeries(value)) return value;

    return DataSeriesSuffix.CLOSE;
  }

  private static _getLineStyle(value: string): string {
    switch (value) {
      case LineStyle.SOLID:
      case LineStyle.DASH:
      case LineStyle.DOT:
      case LineStyle.DASH_DOT:
        return value;
      default:
        return LineStyle.SOLID;
    }
  }

  // noinspection JSMethodCanBeStatic
  private numericValue(control: JQuery) {
    return control.scxNumericField("getValue");
  }

  // noinspection JSMethodCanBeStatic
  private setNumericValue(control: JQuery, value: number) {
    control.scxNumericField("setValue", value);
  }

  private updateNumericFromIndicator(control: JQuery, paramName: string) {
    this.setNumericValue(control, this._indicator.getParameterValue(paramName));
  }

  private updateIndicatorFromNumeric(paramName: string, control: JQuery) {
    this._indicator.setParameterValue(paramName, this.numericValue(control));
  }

  private updateIndicatorLineStyle(paramName: string, control: JQuery) {
    this._indicator.setParameterValue(
      paramName,
      IndicatorSettingsDialog._getLineStyle(control.val())
    );
  }

  private _hideFields(): void {
    // Hide all parameter value containers.
    this._dialogContent.body
      .find("[id^='scxIndicatorDialog_container_']")
      .hide();
    this._label_line1.text("Line");
  }

  private _restoreFields(): void {
    this._input_line1_width.show();
    this._input_line1_style.selectpicker("show");
    this._input_line3_width.show();
    this._input_line3_style.selectpicker("show");
  }

  private _resetErrors(): void {
    this._dialog
      .find(`.${CLASS_INVALID_VALUE}`)
      .each((index: number, item: Element) => {
        $(item).removeClass(CLASS_INVALID_VALUE);
      });
  }

  private _setFieldValueBounds(): void {
    let recordCount = this._indicator ? this._indicator.chart.recordCount : 0,
      max = parseInt((recordCount / 2).toString(), 10),
      maxValue = 10000;

    this._input_periods.scxNumericField("setBounds", 1, maxValue);
    this._input_r2scale.scxNumericField("setBounds", 0.01, 1);
    this._input_standardDeviations.scxNumericField("setBounds", 0, 5);
    this._input_shift.scxNumericField("setBounds", 0, 20);
    this._input_minTick.scxNumericField("setBounds", 0, 1);
    this._input_limitMove.scxNumericField("setBounds", 0.01, 1000);
    this._input_kPeriods.scxNumericField("setBounds", 2, max);
    this._input_kSmoothing.scxNumericField("setBounds", 2, max);
    this._input_kDoubleSmoothing.scxNumericField("setBounds", 2, max);
    this._input_dPeriods.scxNumericField("setBounds", 2, max);
    this._input_barHistory.scxNumericField("setBounds", 2, max);
    this._input_cycle1.scxNumericField("setBounds", 2, maxValue);
    this._input_cycle2.scxNumericField("setBounds", 2, maxValue);
    this._input_cycle3.scxNumericField("setBounds", 2, maxValue);
    this._input_shortTerm.scxNumericField("setBounds", 2, max);
    this._input_longTerm.scxNumericField("setBounds", 2, max);
    this._input_roc.scxNumericField("setBounds", 0, 100);
    this._input_signalPeriods.scxNumericField("setBounds", 2, max);
    this._input_shortCycle.scxNumericField("setBounds", 2, maxValue);
    this._input_longCycle.scxNumericField("setBounds", 2, maxValue);
    this._input_minAF.scxNumericField("setBounds", 0, 1);
    this._input_maxAF.scxNumericField("setBounds", 0, 1);
    this._input_levels.scxNumericField("setBounds", 0, 100);
    this._input_line1_width.scxNumericField("setBounds", 1, 20);
    this._input_line2_width.scxNumericField("setBounds", 1, 20);
    this._input_line3_width.scxNumericField("setBounds", 1, 20);

    if (this._indicator.taIndicator === TASdk.HighLowBands) {
      this._input_periods.scxNumericField("setBounds", 6, maxValue);
    }
  }

  private _setFieldsRestrictions(): void {
    this._input_shortTerm.scxNumericField("onChange", null);
    this._input_longTerm.scxNumericField("onChange", null);
    this._input_cycle1.scxNumericField("onChange", null);
    this._input_cycle2.scxNumericField("onChange", null);
    this._input_shortCycle.scxNumericField("onChange", null);
    this._input_longCycle.scxNumericField("onChange", null);
    this._input_minAF.scxNumericField("onChange", null);
    this._input_maxAF.scxNumericField("onChange", null);

    switch (this._indicator.taIndicator) {
      // @if SCX_LICENSE = 'full'
      case TASdk.VolumeOscillator:
        this._input_shortTerm.scxNumericField("onChange", (val: any) => {
          if (val >= this.numericValue(this._input_longTerm)) {
            this._input_shortTerm.addClass(CLASS_INVALID_VALUE);
            this._input_longTerm.addClass(CLASS_INVALID_VALUE);
          } else {
            this._input_shortTerm.removeClass(CLASS_INVALID_VALUE);
            this._input_longTerm.removeClass(CLASS_INVALID_VALUE);
          }
        });

        this._input_longTerm.scxNumericField("onChange", (val: any) => {
          if (val <= this.numericValue(this._input_shortTerm)) {
            this._input_shortTerm.addClass(CLASS_INVALID_VALUE);
            this._input_longTerm.addClass(CLASS_INVALID_VALUE);
          } else {
            this._input_shortTerm.removeClass(CLASS_INVALID_VALUE);
            this._input_longTerm.removeClass(CLASS_INVALID_VALUE);
          }
        });
        break;
      case TASdk.PriceOscillator:
        this._input_cycle1.scxNumericField("onChange", (val: any) => {
          if (val >= this.numericValue(this._input_cycle2)) {
            this._input_cycle1.addClass(CLASS_INVALID_VALUE);
            this._input_cycle2.addClass(CLASS_INVALID_VALUE);
          } else {
            this._input_cycle1.removeClass(CLASS_INVALID_VALUE);
            this._input_cycle2.removeClass(CLASS_INVALID_VALUE);
          }
        });

        this._input_cycle2.scxNumericField("onChange", (val: any) => {
          if (val <= this.numericValue(this._input_cycle1)) {
            this._input_cycle1.addClass(CLASS_INVALID_VALUE);
            this._input_cycle2.addClass(CLASS_INVALID_VALUE);
          } else {
            this._input_cycle1.removeClass(CLASS_INVALID_VALUE);
            this._input_cycle2.removeClass(CLASS_INVALID_VALUE);
          }
        });
        break;
      case TASdk.ParabolicSAR:
        this._input_minAF.scxNumericField("onChange", (val: any) => {
          if (val > this.numericValue(this._input_maxAF)) {
            this._input_minAF.addClass(CLASS_INVALID_VALUE);
            this._input_maxAF.addClass(CLASS_INVALID_VALUE);
          } else {
            this._input_minAF.removeClass(CLASS_INVALID_VALUE);
            this._input_maxAF.removeClass(CLASS_INVALID_VALUE);
          }
        });

        this._input_maxAF.scxNumericField("onChange", (val: any) => {
          if (val < this.numericValue(this._input_minAF)) {
            this._input_maxAF.addClass(CLASS_INVALID_VALUE);
            this._input_minAF.addClass(CLASS_INVALID_VALUE);
          } else {
            this._input_maxAF.removeClass(CLASS_INVALID_VALUE);
            this._input_minAF.removeClass(CLASS_INVALID_VALUE);
          }
        });
        break;
      // @endif
      case TASdk.MACD:
      // @if SCX_LICENSE = 'full'
      case TASdk.MACDHistogram:
      case TASdk.SchaffTrendCycle:
        // @endif
        this._input_shortCycle.scxNumericField("onChange", (val: any) => {
          if (val >= this.numericValue(this._input_longCycle)) {
            this._input_shortCycle.addClass(CLASS_INVALID_VALUE);
            this._input_longCycle.addClass(CLASS_INVALID_VALUE);
          } else {
            this._input_shortCycle.removeClass(CLASS_INVALID_VALUE);
            this._input_longCycle.removeClass(CLASS_INVALID_VALUE);
          }
        });

        this._input_longCycle.scxNumericField("onChange", (val: any) => {
          if (val <= this.numericValue(this._input_shortCycle)) {
            this._input_shortCycle.addClass(CLASS_INVALID_VALUE);
            this._input_longCycle.addClass(CLASS_INVALID_VALUE);
          } else {
            this._input_shortCycle.removeClass(CLASS_INVALID_VALUE);
            this._input_longCycle.removeClass(CLASS_INVALID_VALUE);
          }
        });
        break;
      default:
        break;
    }
  }

  private _setViewAndValues(): void {
    let indicator = this._indicator;

    this._restoreFields();
    this._hideFields();
    this._resetErrors();
    this._setFieldValueBounds();
    this._setFieldsRestrictions();

    this._input_line1_color.setColor(
      indicator._plotItems[0].plot.actualTheme.strokeColor ||
        (indicator._plotItems[0].plot.actualTheme.downCandle &&
          indicator._plotItems[0].plot.actualTheme.downCandle.fill.fillColor) ||
        (indicator._plotItems[0].plot.actualTheme.fill &&
          indicator._plotItems[0].plot.actualTheme.fill.fillColor)
    );

    this.updateNumericFromIndicator(
      this._input_line1_width,
      IndicatorParam.LINE_WIDTH
    );
    this._input_line1_style.val(
      indicator.getParameterValue(IndicatorParam.LINE_STYLE)
    );
    this._dialog.find(`${ID.CONTAINER}line1`).show();

    if (indicator.fieldNames.length > 1) {
      this._input_line2_color.setColor(
        indicator._plotItems[1].plot.actualTheme.strokeColor ||
          (indicator._plotItems[1].plot.actualTheme.upCandle &&
            indicator._plotItems[1].plot.actualTheme.upCandle.fill.fillColor) ||
          indicator._plotItems[1].plot.actualTheme.fill.fillColor
      );

      this.updateNumericFromIndicator(
        this._input_line2_width,
        IndicatorParam.LINE2_WIDTH
      );
      this._input_line2_style.val(
        indicator.getParameterValue(IndicatorParam.LINE2_STYLE)
      );
      this._dialog.find(`${ID.CONTAINER}line2`).show();
    }
    if (indicator.fieldNames.length > 2) {
      this._input_line3_color.setColor(
        indicator._plotItems[2].plot.actualTheme.strokeColor ||
          indicator._plotItems[2].plot.actualTheme.fill.fillColor
      );
      this.updateNumericFromIndicator(
        this._input_line3_width,
        IndicatorParam.LINE3_WIDTH
      );
      this._input_line3_style.val(
        indicator.getParameterValue(IndicatorParam.LINE3_STYLE)
      );
      this._dialog.find(`${ID.CONTAINER}line3`).show();

      this._label_line1.text("Top");
      this._label_line2.text("Median");
      this._label_line3.text("Bottom");
    }

    if (indicator.hasParameter(IndicatorParam.SOURCE)) {
      this._input_source.val(
        indicator.getParameterValue(IndicatorParam.SOURCE)
      );
      this._dialog.find(`${ID.CONTAINER}source`).show();
    }
    if (indicator.hasParameter(IndicatorParam.DURATION)) {
      this._input_pivotTimeDropDown.val(
        indicator.getParameterValue(IndicatorParam.DURATION)
      );
      this._dialog.find(`${ID.CONTAINER}pivotTime`).show();
    }
    if (indicator.hasParameter(IndicatorParam.PERIODS)) {
      this.updateNumericFromIndicator(
        this._input_periods,
        IndicatorParam.PERIODS
      );
      this._dialog.find(`${ID.CONTAINER}periods`).show();
    }
    if (indicator.hasParameter(IndicatorParam.MA_TYPE)) {
      this._input_maType.val(
        indicator.getParameterValue(IndicatorParam.MA_TYPE)
      );
      this._dialog.find(`${ID.CONTAINER}maType`).show();
    }
    if (indicator.hasParameter(IndicatorParam.MULTIPLIER)) {
      this.updateNumericFromIndicator(
        this._input_multiplier,
        IndicatorParam.MULTIPLIER
      );
      this._dialog.find(ID.CONTAINER + "multiplier").show();
    }
    if (indicator.hasParameter(IndicatorParam.STANDARD_DEVIATIONS)) {
      this.updateNumericFromIndicator(
        this._input_standardDeviations,
        IndicatorParam.STANDARD_DEVIATIONS
      );
      this._dialog.find(`${ID.CONTAINER}standardDeviations`).show();
    }
    if (indicator.hasParameter(IndicatorParam.SHORT_CYCLE)) {
      this.updateNumericFromIndicator(
        this._input_shortCycle,
        IndicatorParam.SHORT_CYCLE
      );
      this._dialog.find(`${ID.CONTAINER}shortCycle`).show();
    }
    if (indicator.hasParameter(IndicatorParam.LONG_CYCLE)) {
      this.updateNumericFromIndicator(
        this._input_longCycle,
        IndicatorParam.LONG_CYCLE
      );
      this._dialog.find(`${ID.CONTAINER}longCycle`).show();
    }
    if (indicator.hasParameter(IndicatorParam.SIGNAL_PERIODS)) {
      this.updateNumericFromIndicator(
        this._input_signalPeriods,
        IndicatorParam.SIGNAL_PERIODS
      );
      this._dialog.find(`${ID.CONTAINER}signalPeriods`).show();
    }
    if (indicator.hasParameter(IndicatorParam.CYCLE_1)) {
      this.updateNumericFromIndicator(
        this._input_cycle1,
        IndicatorParam.CYCLE_1
      );
      this._container_cycle1.show();
    }
    if (indicator.hasParameter(IndicatorParam.CYCLE_2)) {
      this.updateNumericFromIndicator(
        this._input_cycle2,
        IndicatorParam.CYCLE_2
      );
      this._container_cycle2.show();
    }
    if (indicator.hasParameter(IndicatorParam.SHIFT)) {
      this.updateNumericFromIndicator(this._input_shift, IndicatorParam.SHIFT);
      this._dialog.find(`${ID.CONTAINER}shift`).show();
    }

    switch (indicator.taIndicator) {
      case TASdk.MACD:
        this._label_line1.text("Signal");
        this._label_line2.text("Histogram");
        this._input_line3_width.hide();
        this._input_line3_style.selectpicker("hide");
        break;

      case TASdk.BollingerBands:
      // @if SCX_LICENSE = 'full'
      case TASdk.MovingAverageEnvelope:
        // @endif
        break;

      // @if SCX_LICENSE = 'full'

      case TASdk.HHV:
      case TASdk.LLV:
      case TASdk.MoneyFlowIndex:
      case TASdk.MassIndex:
      case TASdk.ChaikinMoneyFlow:
      case TASdk.CommodityChannelIndex:
      case TASdk.WilliamsPctR:
      case TASdk.FractalChaosOscillator:
      case TASdk.GopalakrishnanRangeIndex:
      case TASdk.PrettyGoodOscillator:
      case TASdk.PriceVolumeTrend:
      case TASdk.PositiveVolumeIndex:
      case TASdk.NegativeVolumeIndex:
      case TASdk.PerformanceIndex:
      case TASdk.CoppockCurve:
        break;

      case TASdk.VIDYA:
        this.updateNumericFromIndicator(
          this._input_r2scale,
          IndicatorParam.R2_SCALE
        );
        this._dialog.find(`${ID.CONTAINER}r2scale`).show();
        break;

      case TASdk.MedianPrice:
      case TASdk.HighMinusLow:
      case TASdk.TypicalPrice:
      case TASdk.WeightedClose:
      case TASdk.WilliamsAccumulationDistribution:
      case TASdk.TrueRange:
      case TASdk.PrimeNumberOscillator:
      case TASdk.ElderThermometer:
      case TASdk.MarketFacilitationIndex:
        break;

      case TASdk.StandardDeviation:
        break;

      case TASdk.HighLowBands:
        this._label_line1.text("High");
        this._label_line2.text("Median");
        this._label_line3.text("Low");
        break;

      case TASdk.FractalChaosBands:
        this._label_line1.text("High");
        this._label_line2.text("Low");
        break;

      case TASdk.PrimeNumberBands:
        this._label_line1.text("Top");
        this._label_line2.text("Bottom");
        break;
      case TASdk.PivotPoints:
        this._label_line1.text("Support");
        this._label_line2.text("Pivot");
        this._label_line3.text("Resistance");
        break;
      case TASdk.TradeVolumeIndex:
        this.updateNumericFromIndicator(
          this._input_minTick,
          IndicatorParam.MIN_TICK
        );
        this._dialog.find(`${ID.CONTAINER}minTick`).show();
        break;

      case TASdk.SwingIndex:
      case TASdk.AccumulativeSwingIndex:
        this.updateNumericFromIndicator(
          this._input_limitMove,
          IndicatorParam.LIMIT_MOVE
        );
        this._dialog.find(`${ID.CONTAINER}limitMove`).show();
        break;

      case TASdk.ComparativeRelativeStrength:
        this._input_source2.val(
          indicator.getParameterValue(IndicatorParam.SOURCE2)
        );
        this._dialog.find(`${ID.CONTAINER}source2`).show();
        break;

      case TASdk.StochasticMomentumIndex:
        this.updateNumericFromIndicator(
          this._input_kPeriods,
          IndicatorParam.PCT_K_PERIODS
        );
        this.updateNumericFromIndicator(
          this._input_kSmoothing,
          IndicatorParam.PCT_K_SMOOTHING
        );
        this.updateNumericFromIndicator(
          this._input_kDoubleSmoothing,
          IndicatorParam.PCT_K_DOUBLE_SMOOTHING
        );
        this.updateNumericFromIndicator(
          this._input_dPeriods,
          IndicatorParam.PCT_D_PERIODS
        );
        this._input_pctDMovingAverageType.val(
          indicator.getParameterValue(IndicatorParam.PCT_D_MA_TYPE)
        );

        this._container_kPeriods.show();
        this._container_kSmoothing.show();
        this._dialog.find(`${ID.CONTAINER}kDoubleSmoothing`).show();
        this._container_dPeriods.show();
        this._dialog.find(`${ID.CONTAINER}pctDMovingAverageType`).show();

        this._label_line1.text("%D");
        this._label_line2.text("%K");
        break;

      case TASdk.UltimateOscillator:
        this.updateNumericFromIndicator(
          this._input_cycle3,
          IndicatorParam.CYCLE_3
        );
        this._dialog.find(`${ID.CONTAINER}cycle3`).show();
        break;

      case TASdk.VolumeOscillator:
        this.updateNumericFromIndicator(
          this._input_shortTerm,
          IndicatorParam.SHORT_TERM
        );
        this.updateNumericFromIndicator(
          this._input_longTerm,
          IndicatorParam.LONG_TERM
        );
        this._input_pointsOrPercent.val(
          indicator.getParameterValue(IndicatorParam.CYCLE_3)
        );

        this._dialog.find(`${ID.CONTAINER}shortTerm`).show();
        this._dialog.find(`${ID.CONTAINER}longTerm`).show();
        this._dialog.find(`${ID.CONTAINER}pointsOrPercent`).show();
        break;

      case TASdk.ChaikinVolatility:
        this.updateNumericFromIndicator(
          this._input_roc,
          IndicatorParam.RATE_OF_CHANGE
        );
        this._dialog.find(`${ID.CONTAINER}rateOfChange`).show();
        break;

      case TASdk.StochasticOscillator:
        this.updateNumericFromIndicator(
          this._input_kPeriods,
          IndicatorParam.PCT_K_PERIODS
        );
        this.updateNumericFromIndicator(
          this._input_kSmoothing,
          IndicatorParam.PCT_K_SMOOTHING
        );
        this.updateNumericFromIndicator(
          this._input_dPeriods,
          IndicatorParam.PCT_D_PERIODS
        );

        this._container_kPeriods.show();
        this._container_kSmoothing.show();
        this._container_dPeriods.show();

        this._label_line1.text("%D");
        this._label_line2.text("%K");
        break;

      case TASdk.PriceOscillator:
        break;

      case TASdk.MACDHistogram:
        this._label_line1.text("Color");
        this._input_line1_width.hide();
        this._input_line1_style.selectpicker("hide");
        break;

      case TASdk.EaseOfMovement:
        break;

      case TASdk.DetrendedPriceOscillator:
      case TASdk.RAVI:
        break;

      case TASdk.ParabolicSAR:
        this.updateNumericFromIndicator(
          this._input_minAF,
          IndicatorParam.MIN_AF
        );
        this.updateNumericFromIndicator(
          this._input_maxAF,
          IndicatorParam.MAX_AF
        );
        this._dialog.find(`${ID.CONTAINER}minAF`).show();
        this._dialog.find(`${ID.CONTAINER}maxAF`).show();
        break;

      case TASdk.DirectionalMovementSystem:
        break;
      case TASdk.SuperTrendOscillator:
        this._input_line2_color.setColor(
          indicator.getParameterValue(IndicatorParam.LINE2_COLOR)
        );
        this._dialog.find(ID.CONTAINER + "line2").show();
        this._label_line1.text("Uptrend");
        this._input_line1_width.hide();
        this._input_line1_style.selectpicker("hide");
        this._label_line2.text("Downtrend");
        this._input_line2_width.hide();
        this._input_line2_style.selectpicker("hide");

        break;
      case TASdk.RainbowOscillator:
        this.updateNumericFromIndicator(
          this._input_levels,
          IndicatorParam.LEVELS
        );
        this._dialog.find(`${ID.CONTAINER}levels`).show();
        break;

      case TASdk.ElderRay:
        this._label_line1.text("Bull Power");
        this._label_line2.text("Bear Power");
        break;

      case TASdk.ElderForceIndex:
        this._label_line2.text("Signal");
        break;

      case TASdk.EhlerFisherTransform:
        this._label_line1.text("Indicator");
        this._label_line2.text("Signal");
        break;

      case TASdk.KeltnerChannel:
      case TASdk.STARC:
      case TASdk.SchaffTrendCycle:
        break;

      // @endif

      case TASdk.ColoredVolume:
        this._dialog.find(`${ID.CONTAINER}line1`).hide();
        this._dialog.find(`${ID.CONTAINER}histogram_colors`).show();
        let theme =
          indicator.coloredVolumeTheme != null
            ? indicator.coloredVolumeTheme
            : indicator.chart.theme.plot.bar.candle;
        this._input_histogram_line1_color.setColor(
          theme.upCandle.fill.fillColor
        );
        this._input_histogram_line2_color.setColor(
          theme.downCandle.fill.fillColor
        );
        break;

      default:
        break;
    }

    [
      this._input_source,
      this._input_source2,
      this._input_pointsOrPercent,
      this._input_maType,
      this._input_pctDMovingAverageType,
      this._input_line1_style,
      this._input_line2_style,
      this._input_line3_style
    ].forEach((control: JQuery) => {
      control.selectpicker("refresh");
    });
  }

  private _updateIndicatorFromUI(): void {
    let indicator = this._indicator;
    indicator.setParameterValue(
      IndicatorParam.LINE_COLOR,
      this._input_line1_color.getColor()
    );
    this.updateIndicatorFromNumeric(
      IndicatorParam.LINE_WIDTH,
      this._input_line1_width
    );
    this.updateIndicatorLineStyle(
      IndicatorParam.LINE_STYLE,
      this._input_line1_style
    );

    if (indicator.fieldNames.length > 1) {
      indicator.setParameterValue(
        IndicatorParam.LINE2_COLOR,
        this._input_line2_color.getColor()
      );
      this.updateIndicatorFromNumeric(
        IndicatorParam.LINE2_WIDTH,
        this._input_line2_width
      );
      this.updateIndicatorLineStyle(
        IndicatorParam.LINE2_STYLE,
        this._input_line2_style
      );
    }
    if (indicator.fieldNames.length > 2) {
      indicator.setParameterValue(
        IndicatorParam.LINE3_COLOR,
        this._input_line3_color.getColor()
      );
      this.updateIndicatorFromNumeric(
        IndicatorParam.LINE3_WIDTH,
        this._input_line3_width
      );
      this.updateIndicatorLineStyle(
        IndicatorParam.LINE3_STYLE,
        this._input_line3_style
      );
    }

    if (indicator.hasParameter(IndicatorParam.PERIODS))
      this.updateIndicatorFromNumeric(
        IndicatorParam.PERIODS,
        this._input_periods
      );
    if (indicator.hasParameter(IndicatorParam.SOURCE))
      indicator.setParameterValue(
        IndicatorParam.SOURCE,
        this._getSource(this._input_source.val())
      );
    if (indicator.hasParameter(IndicatorParam.MA_TYPE))
      indicator.setParameterValue(
        IndicatorParam.MA_TYPE,
        IndicatorSettingsDialog._getMAType(this._input_maType.val())
      );
    if (indicator.hasParameter(IndicatorParam.SHORT_CYCLE))
      this.updateIndicatorFromNumeric(
        IndicatorParam.SHORT_CYCLE,
        this._input_shortCycle
      );
    if (indicator.hasParameter(IndicatorParam.LONG_CYCLE))
      this.updateIndicatorFromNumeric(
        IndicatorParam.LONG_CYCLE,
        this._input_longCycle
      );
    if (indicator.hasParameter(IndicatorParam.STANDARD_DEVIATIONS))
      this.updateIndicatorFromNumeric(
        IndicatorParam.STANDARD_DEVIATIONS,
        this._input_standardDeviations
      );
    if (indicator.hasParameter(IndicatorParam.CYCLE_1))
      this.updateIndicatorFromNumeric(
        IndicatorParam.CYCLE_1,
        this._input_cycle1
      );
    if (indicator.hasParameter(IndicatorParam.CYCLE_2))
      this.updateIndicatorFromNumeric(
        IndicatorParam.CYCLE_2,
        this._input_cycle2
      );
    if (indicator.hasParameter(IndicatorParam.SHIFT))
      this.updateIndicatorFromNumeric(IndicatorParam.SHIFT, this._input_shift);

    switch (indicator.taIndicator) {
      // @if SCX_LICENSE != 'free'
      case TASdk.HistoricalVolatility:
        this.updateIndicatorFromNumeric(
          IndicatorParam.BAR_HISTORY,
          this._input_barHistory
        );
        break;
      // @endif

      // @if SCX_LICENSE = 'full'
      case TASdk.VIDYA:
        this.updateIndicatorFromNumeric(
          IndicatorParam.R2_SCALE,
          this._input_r2scale
        );
        break;

      case TASdk.TradeVolumeIndex:
        this.updateIndicatorFromNumeric(
          IndicatorParam.MIN_TICK,
          this._input_minTick
        );
        break;

      case TASdk.SwingIndex:
      case TASdk.AccumulativeSwingIndex:
        this.updateIndicatorFromNumeric(
          IndicatorParam.LIMIT_MOVE,
          this._input_limitMove
        );
        break;
      case TASdk.SuperTrendOscillator:
        indicator.setParameterValue(
          IndicatorParam.LINE2_COLOR,
          this._input_line2_color.getColor()
        );
        this.updateIndicatorFromNumeric(
          IndicatorParam.LINE2_WIDTH,
          this._input_line2_width
        );
        this.updateIndicatorFromNumeric(
          IndicatorParam.LINE_WIDTH,
          this._input_line1_width
        );
        this.updateIndicatorFromNumeric(
          IndicatorParam.MULTIPLIER,
          this._input_multiplier
        );
        break;
      case TASdk.ComparativeRelativeStrength:
        indicator.setParameterValue(
          IndicatorParam.SOURCE2,
          this._getSource(this._input_source2.val())
        );
        break;

      case TASdk.StochasticMomentumIndex:
        this.updateIndicatorFromNumeric(
          IndicatorParam.PCT_K_PERIODS,
          this._input_kPeriods
        );
        this.updateIndicatorFromNumeric(
          IndicatorParam.PCT_K_SMOOTHING,
          this._input_kSmoothing
        );
        this.updateIndicatorFromNumeric(
          IndicatorParam.PCT_K_DOUBLE_SMOOTHING,
          this._input_kDoubleSmoothing
        );
        this.updateIndicatorFromNumeric(
          IndicatorParam.PCT_D_PERIODS,
          this._input_dPeriods
        );
        indicator.setParameterValue(
          IndicatorParam.PCT_D_MA_TYPE,
          IndicatorSettingsDialog._getMAType(
            this._input_pctDMovingAverageType.val()
          )
        );
        break;

      case TASdk.UltimateOscillator:
        this.updateIndicatorFromNumeric(
          IndicatorParam.CYCLE_3,
          this._input_cycle3
        );
        break;

      case TASdk.VolumeOscillator:
        this.updateIndicatorFromNumeric(
          IndicatorParam.SHORT_TERM,
          this._input_shortTerm
        );
        this.updateIndicatorFromNumeric(
          IndicatorParam.LONG_TERM,
          this._input_longTerm
        );
        indicator.setParameterValue(
          IndicatorParam.POINTS_OR_PERCENT,
          IndicatorSettingsDialog._getPointsOrPercent(
            this._input_pointsOrPercent.val()
          )
        );
        break;

      case TASdk.ChaikinVolatility:
        this.updateIndicatorFromNumeric(
          IndicatorParam.RATE_OF_CHANGE,
          this._input_roc
        );
        break;

      case TASdk.StochasticOscillator:
        this.updateIndicatorFromNumeric(
          IndicatorParam.PCT_K_PERIODS,
          this._input_kPeriods
        );
        this.updateIndicatorFromNumeric(
          IndicatorParam.PCT_K_SMOOTHING,
          this._input_kSmoothing
        );
        this.updateIndicatorFromNumeric(
          IndicatorParam.PCT_D_PERIODS,
          this._input_dPeriods
        );
        break;

      case TASdk.ParabolicSAR:
        this.updateIndicatorFromNumeric(
          IndicatorParam.MIN_AF,
          this._input_minAF
        );
        this.updateIndicatorFromNumeric(
          IndicatorParam.MAX_AF,
          this._input_maxAF
        );
        break;

      case TASdk.RainbowOscillator:
        this.updateIndicatorFromNumeric(
          IndicatorParam.LEVELS,
          this._input_levels
        );
        break;

      // @endif

      case TASdk.MACD:
      // @if SCX_LICENSE = 'full'
      case TASdk.MACDHistogram:
        // @endif
        this.updateIndicatorFromNumeric(
          IndicatorParam.SIGNAL_PERIODS,
          this._input_signalPeriods
        );
        break;
      case TASdk.PivotPoints:
        indicator.setParameterValue(
          IndicatorParam.DURATION,
          this._input_pivotTimeDropDown.val()
        );
        break;
      case TASdk.ColoredVolume:
        if (indicator.coloredVolumeTheme == null)
          indicator.coloredVolumeTheme = JsUtil.clone(
            indicator.chart.theme.plot.histogram.coloredColumn
          );
        indicator.coloredVolumeTheme.upCandle.fill.fillColor = this._input_histogram_line1_color.getColor();
        indicator.coloredVolumeTheme.downCandle.fill.fillColor = this._input_histogram_line2_color.getColor();
        break;
      default:
        break;
    }
  }

  private _save(): void {
    this._restoreFields();
    this._apply();
    this.hide();
  }

  private _apply(): void {
    this._updateIndicatorFromUI();

    if (Boolean(this._config.done())) {
      this._config.done();
    }
  }

  private _setDialogTitle() {
    let indicatorName = this._indicator.getName();

    if (!indicatorName) {
      let isVolumeIndicator =
        Array.isArray(this._indicator.fieldNames) &&
        this._indicator.fieldNames.length &&
        this._indicator.fieldNames[0] === "Volume";
      indicatorName = isVolumeIndicator ? "Volume" : "Indicator";
    }

    this._title.scxLocalize(
      `indicatorSettingsDialog.title.${indicatorName}`,
      indicatorName
    );
  }

  private _initFields(): void {
    let dialog = this._dialog;

    this._title = dialog.find(ID.DIALOG_TITLE);
    this._input_multiplier = dialog
      .find(ID.INPUT + "multiplier")
      .scxNumericField(numericFieldConfigInt);
    this._input_source = dialog.find(ID.INPUT + "source");
    this._container_cycle1 = dialog.find(ID.CONTAINER + "cycle1");
    this._container_cycle2 = dialog.find(ID.CONTAINER + "cycle2");
    this._container_kPeriods = dialog.find(ID.CONTAINER + "kPeriods");
    this._input_pivotTimeDropDown = dialog.find(ID.INPUT + "pivotTime");
    this._container_kSmoothing = dialog.find(ID.CONTAINER + "kSmoothing");
    this._container_dPeriods = dialog.find(ID.CONTAINER + "dPeriods");
    this._input_pointsOrPercent = dialog.find(ID.INPUT + "pointsOrPercent");
    this._input_source2 = dialog.find(ID.INPUT + "source2");
    this._input_maType = dialog.find(ID.INPUT + "maType");
    this._input_pctDMovingAverageType = dialog.find(
      ID.INPUT + "pctDMovingAverageType"
    );
    this._input_periods = dialog
      .find(ID.INPUT + "periods")
      .scxNumericField(numericFieldConfigInt);
    this._input_r2scale = dialog
      .find(ID.INPUT + "r2scale")
      .scxNumericField(numericFieldConfigFloat);
    this._input_standardDeviations = dialog
      .find(ID.INPUT + "standardDeviations")
      .scxNumericField(numericFieldConfigFloat);
    this._input_shift = dialog
      .find(ID.INPUT + "shift")
      .scxNumericField(numericFieldConfigFloat);
    this._input_minTick = dialog
      .find(ID.INPUT + "minTick")
      .scxNumericField(numericFieldConfigFloat);
    this._input_limitMove = dialog
      .find(ID.INPUT + "limitMove")
      .scxNumericField(numericFieldConfigFloat);
    this._input_kPeriods = dialog
      .find(ID.INPUT + "kPeriods")
      .scxNumericField(numericFieldConfigInt);
    this._input_kSmoothing = dialog
      .find(ID.INPUT + "kSmoothing")
      .scxNumericField(numericFieldConfigInt);
    this._input_kDoubleSmoothing = dialog
      .find(ID.INPUT + "kDoubleSmoothing")
      .scxNumericField(numericFieldConfigInt);
    this._input_dPeriods = dialog
      .find(ID.INPUT + "dPeriods")
      .scxNumericField(numericFieldConfigInt);
    this._input_barHistory = dialog
      .find(ID.INPUT + "barHistory")
      .scxNumericField(numericFieldConfigInt);
    this._input_cycle1 = dialog
      .find(ID.INPUT + "cycle1")
      .scxNumericField(numericFieldConfigFloat);
    this._input_cycle2 = dialog
      .find(ID.INPUT + "cycle2")
      .scxNumericField(numericFieldConfigFloat);
    this._input_cycle3 = dialog
      .find(ID.INPUT + "cycle3")
      .scxNumericField(numericFieldConfigFloat);
    this._input_shortTerm = dialog
      .find(ID.INPUT + "shortTerm")
      .scxNumericField(numericFieldConfigInt);
    this._input_longTerm = dialog
      .find(ID.INPUT + "longTerm")
      .scxNumericField(numericFieldConfigInt);
    this._input_roc = dialog
      .find(ID.INPUT + "rateOfChange")
      .scxNumericField(numericFieldConfigFloat);
    this._input_signalPeriods = dialog
      .find(ID.INPUT + "signalPeriods")
      .scxNumericField(numericFieldConfigInt);
    this._input_shortCycle = dialog
      .find(ID.INPUT + "shortCycle")
      .scxNumericField(numericFieldConfigInt);
    this._input_longCycle = dialog
      .find(ID.INPUT + "longCycle")
      .scxNumericField(numericFieldConfigInt);
    this._input_minAF = dialog
      .find(ID.INPUT + "minAF")
      .scxNumericField(numericFieldConfigFloat);
    this._input_maxAF = dialog
      .find(ID.INPUT + "maxAF")
      .scxNumericField(numericFieldConfigFloat);
    this._input_levels = dialog
      .find(ID.INPUT + "levels")
      .scxNumericField(numericFieldConfigInt);
    this._label_line1 = dialog.find(ID.LABEL + "line1");
    this._input_line1_width = dialog
      .find(ID.INPUT + "line1_width")
      .scxNumericField(numericFieldConfigInt);

    this._input_line1_color = null;
    this._input_line1_style = dialog.find(`${ID.INPUT}line1_style`);
    this._label_line2 = dialog.find(`${ID.LABEL}line2`);
    this._input_line2_width = dialog
      .find(`${ID.INPUT}line2_width`)
      .scxNumericField(numericFieldConfigInt);
    this._input_line2_color = null;
    this._input_line2_style = dialog.find(`${ID.INPUT}line2_style`);
    this._label_line3 = dialog.find(`${ID.LABEL}line3`);
    this._input_line3_width = dialog
      .find(`${ID.INPUT}line3_width`)
      .scxNumericField(numericFieldConfigInt);
    this._input_line3_color = null;
    this._input_line3_style = dialog.find(`${ID.INPUT}line3_style`);
    this._input_histogram_line1_color = null;
    this._input_histogram_line2_color = null;
  }
}
