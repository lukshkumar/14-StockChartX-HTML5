import { HistogramPlot } from "../index";
import { DataSeriesSuffix } from "../index";
import {
  Indicator,
  IIndicatorConfig,
  IIndicatorOptions
} from "../index";
import { IndicatorParam } from "./utils";
import * as TASdk from "../../TASdk/TASdk";
import { Field } from "../../TASdk/Field";
import { Recordset } from "../../TASdk/Recordset";
import { LineStyle } from "../index";
import { IntlNumberFormat } from "../index";
import { Bands } from "../../TASdk/Bands";
import { General } from "../../TASdk/General";
import { LinearRegression } from "../../TASdk/LinearRegression";
import { Oscillator } from "../../TASdk/Oscillator";
import { Index } from "../../TASdk/Index";
import { MovingAverage } from "../../TASdk/MovingAverage";
import { HtmlUtil } from "../index";
import { JsUtil } from "../index";
import { ValueScale } from "../index";

"use strict";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

"use strict";

export const AutoScaleMultiplierValue = 5;

export const IndicatorField = {
  OPEN: "Open",
  HIGH: "High",
  LOW: "Low",
  CLOSE: "Close",
  VOLUME: "Volume",
  INDICATOR: "Indicator",
  INDICATOR_HIGH: "Indicator High",
  INDICATOR_LOW: "Indicator Low",
  INDICATOR_SIGNAL: "Indicator Signal",
  INDICATORSIGNAL: "IndicatorSignal",
  INDICATOR_HISTOGRAM: "Indicator Histogram",
  INDICATOR_HISTOGRAM_HIGH: "Indicator Histogram High",
  INDICATOR_HISTOGRAM_LOW: "Indicator Histogram Low",
  BOLLINGER_BAND_TOP: "Bollinger Band Top",
  BOLLINGER_BAND_MEDIAN: "Bollinger Band Median",
  BOLLINGER_BAND_BOTTOM: "Bollinger Band Bottom",
  ENVELOPE_TOP: "Envelope Top",
  ENVELOPE_MEDIAN: "Envelope Median",
  ENVELOPE_BOTTOM: "Envelope Bottom",
  HIGH_LOW_BANDS_TOP: "High Low Bands Top",
  HIGH_LOW_BANDS_MEDIAN: "High Low Bands Median",
  HIGH_LOW_BANDS_BOTTOM: "High Low Bands Bottom",
  FRACTAL_HIGH: "Fractal High",
  FRACTAL_LOW: "Fractal Low",
  PRIME_BANDS_TOP: "Prime Bands Top",
  PRIME_BANDS_BOTTOM: "Prime Bands Bottom",
  KELTNER_CHANNEL_TOP: "Keltner Top",
  KELTNER_CHANNEL_MEDIAN: "Keltner Median",
  KELTNER_CHANNEL_BOTTOM: "Keltner Bottom",
  STARC_CHANNEL_TOP: "STARC Top",
  STARC_CHANNEL_MEDIAN: "STARC Median",
  STARC_CHANNEL_BOTTOM: "STARC Bottom",
  PCT_D: "%D",
  PCT_K: "%K",
  RSQUARED: "RSquared",
  FORECAST: "Forecast",
  SLOPE: "Slope",
  INTERCEPT: "Intercept",
  SIGNAL: "Signal",
  HISTOGRAM: "Histogram",
  ADX: "ADX",
  DI_PLUS: "DI+",
  DI_MINUS: "DI-",
  AROON_UP: "Aroon Up",
  AROON_DOWN: "Aroon Down",
  AROON_OSCILLATOR: "Aroon Oscillator",
  BULL_POWER: "Indicator Bull Power",
  BEAR_POWER: "Indicator Bear Power",
  TRIGGER: "Indicator Trigger",
  SUPERTREND: "Supertrend",
  PIVOTPOINTS: "Pivot Points",
  S1: "S1",
  S2: "S2",
  S3: "S3",
  R1: "R1",
  R2: "R2",
  R3: "R3"
};
Object.freeze(IndicatorField);

export const IndicatorParamValue = {
  POINT: 1,
  PERCENT: 2
};
Object.freeze(IndicatorParamValue);

export interface ITAIndicatorConfig extends IIndicatorConfig {
  taIndicator?: number;
  symbol?: string;
}

interface ITAIndicatorOptions extends IIndicatorOptions {
  taIndicator: number;
}

/**
 * Represent chart TA indicator.
 * @param {Object} config The configuration object.
 * @param {StockChartX.Chart} [config.chart] The parent chart.
 * @param {Number} config.taIndicator The TA indicator number.
 * @param {Object} [config.parameters] The TA indicator parameters.
 * @param {Number} [config.panelHeightRatio] The height ratio of the chart panel.
 * @param {Boolean} [config.showValueMarkers] The flag that indicates whether value markers are visible.
 * @param {Boolean} [config.showValuesInTitle] The flag that indicates whether values are visible in the title.
 * @constructor StockChartX.TAIndicator
 * @augments StockChartX.Indicator
 * @example
 *  // Create simple moving average indicator.
 *  var sma1 = new StockChartX.TAIndicator({taIndicator: SimpleMovingAverage});
 *
 *  // Create simple moving average indicator with custom properties.
 *  var sma2 = new StockChartX.TAIndicator({
 *      taIndicator: SimpleMovingAverage,
 *      parameters: {
 *          StockChartX.IndicatorParam.SOURCE: StockChartX.HIGH_DATA_SERIES_SUFFIX,
 *          StockChartX.IndicatorParam.PERIODS: 21,
 *          StockChartX.IndicatorParam.LINE_COLOR: 'green'
 *          StockChartX.IndicatorParam.LINE_WIDTH: 3,
 *          StockChartX.IndicatorParam.LINE_STYLE: StockChartX.LineStyle.DASH
 *      }
 *  });
 */
export class TAIndicator extends Indicator {
  /**
   * TA indicator number.
   * @name taIndicator
   * @type {number}
   * @readonly
   * @memberOf StockChartX.TAIndicator#
   */

  /**
   * @internal
   */
  protected _parameters: string = "(params)";

  get taIndicator(): number {
    return (<ITAIndicatorOptions>this._options).taIndicator;
  }

  constructor(config: ITAIndicatorConfig) {
    super(config);

    (<ITAIndicatorOptions>this._options).taIndicator =
      config.taIndicator != null ? config.taIndicator : TASdk.Unknown;
  }

  /**
   * @inheritdoc
   */
  getName(): string {
    if (this.taIndicator === TASdk.ColoredVolume) {
      return "Colored Volume";
    }
    return TASdk.indicatorToString(this.taIndicator);
  }

  getParametersString(): string {
    return this._parameters;
  }

  /**
   * @inheritdoc
   */
  getShortName(): string {
    switch (this.taIndicator) {
      case TASdk.SimpleMovingAverage:
        return "SMA";
      case TASdk.ExponentialMovingAverage:
        return "EMA";
      case TASdk.TimeSeriesMovingAverage:
        return "TSMA";
      case TASdk.TriangularMovingAverage:
        return "TMA";
      case TASdk.VariableMovingAverage:
        return "VMA";
      case TASdk.VIDYA:
        return "VIDYA";
      case TASdk.WellesWilderSmoothing:
        return "Welles Wilder Smoothing";
      case TASdk.WeightedMovingAverage:
        return "WMA";
      case TASdk.WilliamsPctR:
        return "Williams %R";
      case TASdk.WilliamsAccumulationDistribution:
        return "Williams Accumulation Distribution";
      case TASdk.VolumeOscillator:
        return "Volume Oscillator";
      case TASdk.VerticalHorizontalFilter:
        return "Vertical Horizontal Filter";
      case TASdk.UltimateOscillator:
        return "Ultimate Oscillator";
      case TASdk.TrueRange:
        return "True Range";
      case TASdk.AverageTrueRange:
        return "ATR";
      case TASdk.TRIX:
        return "TRIX";
      case TASdk.RainbowOscillator:
        return "Rainbow Oscillator";
      case TASdk.PriceOscillator:
        return "Price Oscillator";
      case TASdk.ParabolicSAR:
        return "PSAR";
      case TASdk.MomentumOscillator:
        return "Momentum Oscillator";
      case TASdk.MACD:
        return "MACD";
      case TASdk.EaseOfMovement:
        return "Ease of Movement";
      case TASdk.DirectionalMovementSystem:
        return "Directional Movement System";
      case TASdk.DetrendedPriceOscillator:
        return "Detrended Price Oscillator";
      case TASdk.ChandeMomentumOscillator:
        return "Chande Momentum Oscillator";
      case TASdk.ChaikinVolatility:
        return "Chaikin Volatility";
      case TASdk.Aroon:
        return "Aroon";
      case TASdk.AroonOscillator:
        return "Aroon Oscillator";
      case TASdk.LinearRegressionRSquared:
        return "Linear Regression R2";
      case TASdk.LinearRegressionForecast:
        return "Linear Regression Forecast";
      case TASdk.LinearRegressionSlope:
        return "Linear Regression Slope";
      case TASdk.LinearRegressionIntercept:
        return "Linear Regression Intercept";
      case TASdk.PriceVolumeTrend:
        return "Price Volume Trend";
      case TASdk.PerformanceIndex:
        return "Performance Index";
      case TASdk.CommodityChannelIndex:
        return "Commodity Channel Index";
      case TASdk.ChaikinMoneyFlow:
        return "Chaikin Money Flow";
      case TASdk.WeightedClose:
        return "Weighted Close";
      case TASdk.VolumeROC:
        return "Volume ROC";
      case TASdk.TypicalPrice:
        return "Typical Price";
      case TASdk.StandardDeviation:
        return "Standard Deviation";
      case TASdk.PriceROC:
        return "Price ROC";
      case TASdk.MedianPrice:
        return "Median Price";
      case TASdk.HighMinusLow:
        return "High Minus Low";
      case TASdk.BollingerBands:
        return "Bollinger";
      case TASdk.FractalChaosBands:
        return "Fractal Chaos Bands";
      case TASdk.HighLowBands:
        return "High Low Bands";
      case TASdk.MovingAverageEnvelope:
        return "MA Env";
      case TASdk.SwingIndex:
        return "Swing Index";
      case TASdk.AccumulativeSwingIndex:
        return "Accumulative Swing Index";
      case TASdk.ComparativeRelativeStrength:
        return "Comparative Relative Strength";
      case TASdk.MassIndex:
        return "Mass Index";
      case TASdk.MoneyFlowIndex:
        return "Money Flow Index";
      case TASdk.NegativeVolumeIndex:
        return "Negative Volume Index";
      case TASdk.OnBalanceVolume:
        return "On Balance Volume";
      case TASdk.PositiveVolumeIndex:
        return "Positive Volume Index";
      case TASdk.RelativeStrengthIndex:
        return "RSI";
      case TASdk.TradeVolumeIndex:
        return "Trade Volume Index";
      case TASdk.StochasticOscillator:
        return "Stochastic Oscillator";
      case TASdk.StochasticMomentumIndex:
        return "Stochastic Momentum Index";
      case TASdk.FractalChaosOscillator:
        return "Fractal Chaos Oscillator";
      case TASdk.PrimeNumberOscillator:
        return "Prime Number Oscillator";
      case TASdk.PrimeNumberBands:
        return "Prime Number Bands";
      case TASdk.HistoricalVolatility:
        return "Historical Volatility";
      case TASdk.MACDHistogram:
        return "MACD Histogram";
      case TASdk.HHV:
        return "Highest High Value";
      case TASdk.LLV:
        return "Lowest Low Value";
      case TASdk.TimeSeriesForecast:
        return "TSF";
      case TASdk.ElderRay:
        return "Elder Ray";
      case TASdk.ElderForceIndex:
        return "Elder Force Index";
      case TASdk.ElderThermometer:
        return "Elder Thermometer";
      case TASdk.EhlerFisherTransform:
        return "Ehler Fisher Transform";
      case TASdk.KeltnerChannel:
        return "Keltner Channel";
      case TASdk.MarketFacilitationIndex:
        return "Market Facilitation Index";
      case TASdk.SchaffTrendCycle:
        return "Schaff Trend Cycle";
      case TASdk.QStick:
        return "QStick";
      case TASdk.STARC:
        return "STARC";
      case TASdk.CenterOfGravity:
        return "Center Of Gravity";
      case TASdk.CoppockCurve:
        return "Coppock Curve";
      case TASdk.ChandeForecastOscillator:
        return "Chande Forecast Oscillator";
      case TASdk.GopalakrishnanRangeIndex:
        return "Gopalakrishnan Range Index";
      case TASdk.IntradayMomentumIndex:
        return "Intraday Momentum Index";
      case TASdk.KlingerVolumeOscillator:
        return "Klinger Volume Oscillator";
      case TASdk.PrettyGoodOscillator:
        return "Pretty Good Oscillator";
      case TASdk.RAVI:
        return "RAVI";
      case TASdk.RandomWalkIndex:
        return "Random Walk Index";
      case TASdk.TwiggsMoneyFlow:
        return "Twiggs Money Flow";
      case TASdk.Volume:
        return "Volume";
      case TASdk.ColoredVolume:
        return "Colored Volume";
      case TASdk.McGinleysDynamic:
        return "McGinleys Dynamic";
      case TASdk.SuperTrendOscillator:
        return "Supertrend Oscillator";
      case TASdk.VolumeWeightedAveragePrice:
        return "Volume Weighted Average Price";
      case TASdk.PivotPoints:
        return "Pivot Points";
      default:
        return "";
    }
  }

  /**
   * Returns plot's name. E.g. 'Top', 'Bottom', 'Median', ...
   * @method getPlotName
   * @param {string} fieldName the TA field name.
   * @returns {string}
   * @memberOf StockChartX.Indicator#
   */
  getPlotName(fieldName: string): string {
    switch (fieldName) {
      case IndicatorField.INDICATOR_HIGH:
      case IndicatorField.FRACTAL_HIGH:
        return "High";
      case IndicatorField.INDICATOR_LOW:
      case IndicatorField.FRACTAL_LOW:
        return "Low";
      case IndicatorField.INDICATOR_SIGNAL:
      case IndicatorField.INDICATORSIGNAL:
        return "Signal";
      case IndicatorField.INDICATOR_HISTOGRAM_HIGH:
        return "Histogram High";
      case IndicatorField.INDICATOR_HISTOGRAM_LOW:
        return "Histogram Low";
      case IndicatorField.BOLLINGER_BAND_TOP:
      case IndicatorField.ENVELOPE_TOP:
      case IndicatorField.HIGH_LOW_BANDS_TOP:
      case IndicatorField.PRIME_BANDS_TOP:
      case IndicatorField.KELTNER_CHANNEL_TOP:
      case IndicatorField.STARC_CHANNEL_TOP:
        return "Top";
      case IndicatorField.BOLLINGER_BAND_MEDIAN:
      case IndicatorField.ENVELOPE_MEDIAN:
      case IndicatorField.HIGH_LOW_BANDS_MEDIAN:
      case IndicatorField.KELTNER_CHANNEL_MEDIAN:
      case IndicatorField.STARC_CHANNEL_MEDIAN:
        return "Median";
      case IndicatorField.BOLLINGER_BAND_BOTTOM:
      case IndicatorField.ENVELOPE_BOTTOM:
      case IndicatorField.HIGH_LOW_BANDS_BOTTOM:
      case IndicatorField.PRIME_BANDS_BOTTOM:
      case IndicatorField.KELTNER_CHANNEL_BOTTOM:
      case IndicatorField.STARC_CHANNEL_BOTTOM:
        return "Bottom";
      case IndicatorField.PCT_D:
      case IndicatorField.PCT_K:
      case IndicatorField.ADX:
      case IndicatorField.DI_PLUS:
      case IndicatorField.DI_MINUS:
        return fieldName;
      case IndicatorField.AROON_UP:
        return "Up";
      case IndicatorField.AROON_DOWN:
        return "Down";
      case IndicatorField.BULL_POWER:
        return "Bull Power";
      case IndicatorField.BEAR_POWER:
        return "Bear Power";
      case IndicatorField.TRIGGER:
        return "Trigger";
      case IndicatorField.VOLUME:
        return "Volume";
      default:
        return "";
    }
  }

  /**
   * @internal
   */
  _initIndicator(config: ITAIndicatorConfig) {
    super._initIndicator(config);
    
    let params = this._options.parameters,
      dsSuffix = DataSeriesSuffix,
      paramName = IndicatorParam,
      fieldName = IndicatorField;

    (<ITAIndicatorOptions>this._options).taIndicator =
      config.taIndicator != null ? config.taIndicator : TASdk.Unknown;
    switch (this.taIndicator) {
      // Bands
      // @if SCX_LICENSE != 'free'
      case TASdk.BollingerBands:
        this._isOverlay = true;
        this._fieldNames = [
          fieldName.BOLLINGER_BAND_TOP,
          fieldName.BOLLINGER_BAND_MEDIAN,
          fieldName.BOLLINGER_BAND_BOTTOM
        ];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.PERIODS] = 14;
        params[paramName.STANDARD_DEVIATIONS] = 2;
        params[paramName.MA_TYPE] = TASdk.Const.simpleMovingAverage;
        break;
      // @endif
      // @if SCX_LICENSE = 'full'
      case TASdk.MovingAverageEnvelope:
        this._isOverlay = true;
        this._fieldNames = [
          fieldName.ENVELOPE_TOP,
          fieldName.ENVELOPE_MEDIAN,
          fieldName.ENVELOPE_BOTTOM
        ];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.PERIODS] = 14;
        params[paramName.SHIFT] = 5;
        params[paramName.MA_TYPE] = TASdk.Const.simpleMovingAverage;
        break;
      case TASdk.HighLowBands:
        this._isOverlay = true;
        this._fieldNames = [
          fieldName.HIGH_LOW_BANDS_TOP,
          fieldName.HIGH_LOW_BANDS_MEDIAN,
          fieldName.HIGH_LOW_BANDS_BOTTOM
        ];
        params[paramName.PERIODS] = 14;
        break;
      case TASdk.FractalChaosBands:
        this._isOverlay = true;
        this._fieldNames = [fieldName.FRACTAL_HIGH, fieldName.FRACTAL_LOW];
        params[paramName.PERIODS] = 14;
        break;
      case TASdk.PrimeNumberBands:
        this._isOverlay = true;
        this._fieldNames = [
          fieldName.PRIME_BANDS_TOP,
          fieldName.PRIME_BANDS_BOTTOM
        ];
        break;
      case TASdk.KeltnerChannel:
        this._isOverlay = true;
        this._fieldNames = [
          fieldName.KELTNER_CHANNEL_TOP,
          fieldName.KELTNER_CHANNEL_MEDIAN,
          fieldName.KELTNER_CHANNEL_BOTTOM
        ];
        params[paramName.PERIODS] = 14;
        params[paramName.SHIFT] = 5;
        params[paramName.MA_TYPE] = TASdk.Const.simpleMovingAverage;
        break;
      case TASdk.STARC:
        this._isOverlay = true;
        this._fieldNames = [
          fieldName.STARC_CHANNEL_TOP,
          fieldName.STARC_CHANNEL_MEDIAN,
          fieldName.STARC_CHANNEL_BOTTOM
        ];
        params[paramName.PERIODS] = 14;
        params[paramName.SHIFT] = 5;
        params[paramName.MA_TYPE] = TASdk.Const.simpleMovingAverage;
        break;
      // @endif

      // General
      // @if SCX_LICENSE = 'full'
      case TASdk.HighMinusLow:
        this._fieldNames = [fieldName.INDICATOR];
        break;
      case TASdk.MedianPrice:
      case TASdk.TypicalPrice:
      case TASdk.WeightedClose:
        this._isOverlay = true;
        this._fieldNames = [fieldName.INDICATOR];
        break;
      case TASdk.VolumeROC:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.SOURCE] = dsSuffix.VOLUME;
        params[paramName.PERIODS] = 14;
        break;
      case TASdk.PriceROC:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.PERIODS] = 14;
        break;
      case TASdk.StandardDeviation:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.PERIODS] = 14;
        params[paramName.STANDARD_DEVIATIONS] = 2;
        params[paramName.MA_TYPE] = TASdk.Const.simpleMovingAverage;
        break;
      case TASdk.HHV:
      case TASdk.LLV:
        this._isOverlay = true;
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.PERIODS] = 14;
        break;
      // @endif

      // Index
      // @if SCX_LICENSE = 'full'
      case TASdk.MoneyFlowIndex:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.PERIODS] = 14;
        break;
      case TASdk.TradeVolumeIndex:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.MIN_TICK] = 0.5;
        break;
      case TASdk.SwingIndex:
      case TASdk.AccumulativeSwingIndex:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.LIMIT_MOVE] = 0.5;
        break;
      // @endif
      case TASdk.RelativeStrengthIndex:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.PERIODS] = 14;
        break;
      // @if SCX_LICENSE = 'full'
      case TASdk.ComparativeRelativeStrength:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.SOURCE2] = dsSuffix.OPEN;
        break;
      case TASdk.PriceVolumeTrend:
      case TASdk.PositiveVolumeIndex:
      case TASdk.NegativeVolumeIndex:
      case TASdk.PerformanceIndex:
      // @endif
      // @if SCX_LICENSE != 'free'
      case TASdk.OnBalanceVolume:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        break;
      // @endif
      // @if SCX_LICENSE = 'full'
      case TASdk.MassIndex:
      case TASdk.ChaikinMoneyFlow:
      case TASdk.CommodityChannelIndex:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.PERIODS] = 14;
        break;
      case TASdk.StochasticMomentumIndex:
        this._fieldNames = [fieldName.PCT_D, fieldName.PCT_K];
        params[paramName.PCT_K_PERIODS] = 13;
        params[paramName.PCT_K_SMOOTHING] = 25;
        params[paramName.PCT_K_DOUBLE_SMOOTHING] = 2;
        params[paramName.PCT_D_PERIODS] = 9;
        params[paramName.MA_TYPE] = TASdk.Const.simpleMovingAverage;
        params[paramName.PCT_D_MA_TYPE] = TASdk.Const.VIDYA;
        break;
      // @endif
      // @if SCX_LICENSE != 'free'
      case TASdk.HistoricalVolatility:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.PERIODS] = 14;
        params[paramName.BAR_HISTORY] = 10;
        params[paramName.STANDARD_DEVIATIONS] = 2;
        break;
      // @endif
      // @if SCX_LICENSE = 'full'
      case TASdk.ElderForceIndex:
        this._fieldNames = [fieldName.INDICATOR, fieldName.INDICATOR_SIGNAL];
        break;
      case TASdk.ElderThermometer:
      case TASdk.MarketFacilitationIndex:
        this._fieldNames = [fieldName.INDICATOR];
        break;
      case TASdk.QStick:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.PERIODS] = 14;
        params[paramName.MA_TYPE] = TASdk.Const.simpleMovingAverage;
        break;
      case TASdk.GopalakrishnanRangeIndex:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.PERIODS] = 14;
        break;
      case TASdk.IntradayMomentumIndex:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.PERIODS] = 14;
        break;
      case TASdk.RAVI:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.SHORT_CYCLE] = 9;
        params[paramName.LONG_CYCLE] = 14;
        break;
      case TASdk.RandomWalkIndex:
        this._fieldNames = [fieldName.INDICATOR_HIGH, fieldName.INDICATOR_LOW];
        params[paramName.PERIODS] = 14;
        break;
      case TASdk.TwiggsMoneyFlow:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.PERIODS] = 14;
        break;
      // @endif

      // Regression
      // @if SCX_LICENSE = 'full'
      case TASdk.LinearRegressionRSquared:
        this._fieldNames = [fieldName.RSQUARED];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.PERIODS] = 14;
        break;
      case TASdk.LinearRegressionForecast:
        this._isOverlay = true;
        this._fieldNames = [fieldName.FORECAST];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.PERIODS] = 14;
        break;
      case TASdk.LinearRegressionSlope:
        this._fieldNames = [fieldName.SLOPE];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.PERIODS] = 14;
        break;
      case TASdk.LinearRegressionIntercept:
        this._isOverlay = true;
        this._fieldNames = [fieldName.INTERCEPT];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.PERIODS] = 14;
        break;
      case TASdk.TimeSeriesForecast:
        this._isOverlay = true;
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.PERIODS] = 14;
        break;
      // @endif

      // Moving Average
      case TASdk.SimpleMovingAverage:
      // @if SCX_LICENSE != 'free'
      case TASdk.ExponentialMovingAverage:
      // @endif
      // @if SCX_LICENSE = 'full'
      case TASdk.TimeSeriesMovingAverage:
      case TASdk.VariableMovingAverage:
      case TASdk.TriangularMovingAverage:
      case TASdk.WeightedMovingAverage:
      case TASdk.WellesWilderSmoothing:
        // @endif
        this._isOverlay = true;
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.PERIODS] = 14;
        break;
      // @if SCX_LICENSE = 'full'
      case TASdk.VIDYA:
        this._isOverlay = true;
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.PERIODS] = 14;
        params[paramName.R2_SCALE] = 0.65;
        break;
      // @endif

      // Oscillator
      // @if SCX_LICENSE != 'free'
      case TASdk.SuperTrendOscillator:
        this._isOverlay = true;
        this._fieldNames = [fieldName.SUPERTREND];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.PERIODS] = 14;
        params[paramName.MULTIPLIER] = 3;
        params[paramName.LINE_COLOR] = "#ADFF2F";
        params[paramName.LINE2_COLOR] = "red";
        params[paramName.LINE_WIDTH] = 1;
        params[paramName.LINE2_WIDTH] = 1;
        break;
      case TASdk.VolumeWeightedAveragePrice:
        this._isOverlay = true;
        this._fieldNames = [fieldName.INDICATOR];
        break;
      case TASdk.MomentumOscillator:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.PERIODS] = 14;
        break;
      // @endif
      // @if SCX_LICENSE = 'full'
      case TASdk.ChandeMomentumOscillator:
      case TASdk.TRIX:
      case TASdk.VerticalHorizontalFilter:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.PERIODS] = 14;
        break;
      case TASdk.UltimateOscillator:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.CYCLE_1] = 3;
        params[paramName.CYCLE_2] = 8;
        params[paramName.CYCLE_3] = 14;
        break;
      // @endif
      // @if SCX_LICENSE != 'free'
      case TASdk.AverageTrueRange:
      // @if SCX_LICENSE = 'full'
      case TASdk.FractalChaosOscillator:
      case TASdk.PrettyGoodOscillator:
      case TASdk.WilliamsPctR:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.PERIODS] = 14;
        break;
      // @endif
      // @endif
      // @if SCX_LICENSE = 'full'
      case TASdk.WilliamsAccumulationDistribution:
        this._fieldNames = [fieldName.INDICATOR];
        break;
      case TASdk.VolumeOscillator:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.SHORT_TERM] = 8;
        params[paramName.LONG_TERM] = 14;
        params[paramName.POINTS_OR_PERCENT] = IndicatorParamValue.PERCENT;
        break;
      case TASdk.ChaikinVolatility:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.PERIODS] = 14;
        params[paramName.RATE_OF_CHANGE] = 2;
        params[paramName.MA_TYPE] = TASdk.Const.simpleMovingAverage;
        break;
      case TASdk.StochasticOscillator:
        this._fieldNames = [fieldName.PCT_K, fieldName.PCT_D];
        params[paramName.PCT_K_PERIODS] = 13;
        params[paramName.PCT_K_SMOOTHING] = 25;
        params[paramName.PCT_D_PERIODS] = 9;
        params[paramName.MA_TYPE] = TASdk.Const.simpleMovingAverage;
        break;
      case TASdk.PriceOscillator:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.SHORT_CYCLE] = 3;
        params[paramName.LONG_CYCLE] = 8;
        params[paramName.MA_TYPE] = TASdk.Const.simpleMovingAverage;
        break;
      // @endif
      case TASdk.MACD:
        this._fieldNames = [
          fieldName.INDICATOR,
          fieldName.INDICATORSIGNAL,
          fieldName.INDICATOR_HISTOGRAM
        ];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.SIGNAL_PERIODS] = 3;
        params[paramName.LONG_CYCLE] = 25;
        params[paramName.SHORT_CYCLE] = 13;
        params[paramName.MA_TYPE] = TASdk.Const.simpleMovingAverage;
        break;
      // @if SCX_LICENSE = 'full'
      case TASdk.MACDHistogram:
        this._fieldNames = [fieldName.INDICATOR_HISTOGRAM];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.SIGNAL_PERIODS] = 3;
        params[paramName.LONG_CYCLE] = 25;
        params[paramName.SHORT_CYCLE] = 13;
        params[paramName.MA_TYPE] = TASdk.Const.simpleMovingAverage;
        break;
      case TASdk.EaseOfMovement:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.PERIODS] = 14;
        params[paramName.MA_TYPE] = TASdk.Const.simpleMovingAverage;
        break;
      case TASdk.DetrendedPriceOscillator:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.PERIODS] = 14;
        params[paramName.MA_TYPE] = TASdk.Const.simpleMovingAverage;
        break;
      case TASdk.ParabolicSAR:
        this._isOverlay = true;
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.MIN_AF] = 0.02;
        params[paramName.MAX_AF] = 3;
        break;
      case TASdk.DirectionalMovementSystem:
        this._fieldNames = [
          fieldName.ADX,
          fieldName.DI_PLUS,
          fieldName.DI_MINUS
        ];
        params[paramName.PERIODS] = 14;
        break;
      case TASdk.TrueRange:
        this._fieldNames = [fieldName.INDICATOR];
        break;
      // @endif
      // @if SCX_LICENSE != 'free'
      case TASdk.Aroon:
        this._fieldNames = [fieldName.AROON_UP, fieldName.AROON_DOWN];
        params[paramName.PERIODS] = 14;
        break;
      // @endif
      // @if SCX_LICENSE = 'full'
      case TASdk.AroonOscillator:
        this._fieldNames = [fieldName.AROON_OSCILLATOR];
        params[paramName.PERIODS] = 14;
        break;
      case TASdk.RainbowOscillator:
        this._fieldNames = [
          fieldName.INDICATOR_HIGH,
          fieldName.INDICATOR_LOW,
          fieldName.INDICATOR,
          fieldName.INDICATOR_HISTOGRAM_HIGH,
          fieldName.INDICATOR_HISTOGRAM_LOW
        ];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.LEVELS] = 2;
        params[paramName.PERIODS] = 10;
        params[paramName.MA_TYPE] = TASdk.Const.simpleMovingAverage;
        params[paramName.LINE_COLOR] = "#ADFF2F";
        params[paramName.LINE2_COLOR] = "#FF0000";
        params[paramName.HISTOGRAM_HIGH_COLOR] = "#ADFF2F";
        params[paramName.HISTOGRAM_LOW_COLOR] = "#FF0000";
        break;
      case TASdk.PrimeNumberOscillator:
        this._fieldNames = [fieldName.INDICATOR];
        break;
      case TASdk.ElderRay:
        this._fieldNames = [fieldName.BULL_POWER, fieldName.BEAR_POWER];
        params[paramName.PERIODS] = 14;
        params[paramName.MA_TYPE] = TASdk.Const.simpleMovingAverage;
        break;
      case TASdk.EhlerFisherTransform:
        this._fieldNames = [fieldName.INDICATOR, fieldName.TRIGGER];
        params[paramName.PERIODS] = 14;
        break;
      case TASdk.SchaffTrendCycle:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.PERIODS] = 14;
        params[paramName.SHORT_CYCLE] = 13;
        params[paramName.LONG_CYCLE] = 25;
        params[paramName.MA_TYPE] = TASdk.Const.simpleMovingAverage;
        break;
      case TASdk.CenterOfGravity:
      case TASdk.ChandeForecastOscillator:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.PERIODS] = 14;
        break;
      case TASdk.CoppockCurve:
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        break;
      case TASdk.KlingerVolumeOscillator:
        this._fieldNames = [fieldName.INDICATOR, fieldName.INDICATORSIGNAL];
        params[paramName.PERIODS] = 13;
        params[paramName.LONG_CYCLE] = 55;
        params[paramName.SHORT_CYCLE] = 34;
        params[paramName.MA_TYPE] = TASdk.Const.simpleMovingAverage;
        break;
      // @endif
      case TASdk.Volume:
      case TASdk.ColoredVolume:
        this._fieldNames = [fieldName.VOLUME];
        break;
      case TASdk.McGinleysDynamic:
        this._isOverlay = true;
        this._fieldNames = [fieldName.INDICATOR];
        params[paramName.SOURCE] = dsSuffix.CLOSE;
        params[paramName.PERIODS] = 14;
        break;
      case TASdk.PivotPoints:
        this._isOverlay = true;
        this._fieldNames = [
          IndicatorField.PIVOTPOINTS,
          IndicatorField.S1,
          IndicatorField.R1,
          IndicatorField.S2,
          IndicatorField.R2,
          IndicatorField.S3,
          IndicatorField.R3
        ];
        params[paramName.DURATION] = "auto";
        params[paramName.LINE_COLOR] = "#FF7F50";
        params[paramName.LINE2_COLOR] = "#FF8C00";
        params[paramName.LINE3_COLOR] = "#FFFF00";
        break;
      default:
        throw new Error("Unknown indicator: " + this.taIndicator);
    }

    if (this._fieldNames.length > 0) {
      params[paramName.LINE_WIDTH] = 1;
      params[paramName.LINE_STYLE] = LineStyle.SOLID;
    }
    if (this._fieldNames.length > 1) {
      params[paramName.LINE2_WIDTH] = 1;
      params[paramName.LINE2_STYLE] = LineStyle.SOLID;
    }
    if (this._fieldNames.length > 2) {
      params[paramName.LINE3_WIDTH] = 1;
      params[paramName.LINE3_STYLE] = LineStyle.SOLID;
    }
  }

  /**
   * @internal
   */
  protected _initPanel() {
    if (
      this.taIndicator === TASdk.Volume ||
      this.taIndicator === TASdk.ColoredVolume
    ) {
      let formatter = this._panel.valueScale.formatter;
      if (formatter instanceof IntlNumberFormat)
        (<IntlNumberFormat>formatter).setDecimalDigits(0);

      this._panel.valueScale.calibrator.divider = 1000000;
      this._panel.valueScale.calibrator.suffix = "M";
    } else {
      let formatter = this._panel.valueScale.formatter;
      if (formatter instanceof IntlNumberFormat)
        (<IntlNumberFormat>formatter).setDecimalDigits(3);

      this._panel.valueScale.calibrator.divider = null;
      this._panel.valueScale.calibrator.suffix = null;
    }
  }

  calculate() {
    let sourceSuffix = <string>this.getParameterValue(IndicatorParam.SOURCE),
      sourceField = this._createField(sourceSuffix),
      periods = this.getParameterValue(IndicatorParam.PERIODS),
      indicatorName = IndicatorField.INDICATOR,
      maType = this.getParameterValue(IndicatorParam.MA_TYPE),
      startIndex = periods + 1,
      multiplier = this.getParameterValue(IndicatorParam.MULTIPLIER),
      // @if SCX_LICENSE != 'free'
      bands = Bands.prototype,
      // @endif
      // @if SCX_LICENSE = 'full'
      general = General.prototype,
      regression = LinearRegression.prototype,
      // @endif
      oscillator = Oscillator.prototype,
      index = Index.prototype,
      title,
      recordSet;
    switch (this.taIndicator) {
      // Bands
      // @if SCX_LICENSE != 'free'
      case TASdk.BollingerBands:
        {
          let stdev = this.getParameterValue(
            IndicatorParam.STANDARD_DEVIATIONS
          );

          title = [
            sourceField.name,
            periods,
            stdev,
            this._getMaTypeString(maType)
          ];
          recordSet = bands.bollingerBands(sourceField, periods, stdev, maType);
        }
        break;
      // @endif
      // @if SCX_LICENSE = 'full'
      case TASdk.MovingAverageEnvelope:
        {
          let shift = this.getParameterValue(IndicatorParam.SHIFT);

          title = [
            sourceField.name,
            periods,
            shift,
            this._getMaTypeString(maType)
          ];
          recordSet = bands.movingAverageEnvelope(
            sourceField,
            periods,
            maType,
            shift
          );
        }
        break;
      case TASdk.HighLowBands:
        title = [periods];
        recordSet = bands.highLowBands(
          this._createHighField(),
          this._createLowField(),
          this._createCloseField(),
          periods
        );
        break;
      case TASdk.FractalChaosBands:
        title = [periods];
        recordSet = bands.fractalChaosBands(this._createRecordset(), periods);
        break;
      case TASdk.PrimeNumberBands:
        startIndex = 1;
        recordSet = bands.primeNumberBands(
          this._createHighField(),
          this._createLowField()
        );
        break;
      case TASdk.KeltnerChannel:
        {
          let shift = this.getParameterValue(IndicatorParam.SHIFT);

          title = [periods, shift, this._getMaTypeString(maType)];
          recordSet = bands.keltner(
            this._createRecordset(),
            periods,
            shift,
            maType,
            "Keltner"
          );
        }
        break;
      case TASdk.STARC:
        {
          let shift = this.getParameterValue(IndicatorParam.SHIFT);

          title = [periods, shift, this._getMaTypeString(maType)];
          recordSet = bands.keltner(
            this._createRecordset(),
            periods,
            shift,
            maType,
            "STARC"
          );
        }
        break;
      // @endif

      // General
      // @if SCX_LICENSE = 'full'
      case TASdk.HighMinusLow:
        startIndex = 1;
        recordSet = general.highMinusLow(
          this._createRecordset(),
          indicatorName
        );
        break;
      case TASdk.MedianPrice:
        startIndex = 1;
        recordSet = general.medianPrice(this._createRecordset(), indicatorName);
        break;
      case TASdk.TypicalPrice:
        startIndex = 1;
        recordSet = general.typicalPrice(
          this._createRecordset(),
          indicatorName
        );
        break;
      case TASdk.WeightedClose:
        startIndex = 1;
        recordSet = general.weightedClose(
          this._createRecordset(),
          indicatorName
        );
        break;
      case TASdk.VolumeROC:
        title = [sourceField.name, periods];
        recordSet = general.volumeROC(sourceField, periods, indicatorName);
        break;
      case TASdk.PriceROC:
        title = [sourceField.name, periods];
        recordSet = general.priceROC(sourceField, periods, indicatorName);
        break;
      case TASdk.StandardDeviation:
        {
          let stdev = this.getParameterValue(
            IndicatorParam.STANDARD_DEVIATIONS
          );

          title = [
            sourceField.name,
            periods,
            stdev,
            this._getMaTypeString(maType)
          ];
          recordSet = general.standardDeviation(
            sourceField,
            periods,
            stdev,
            maType,
            indicatorName
          );
        }
        break;
      case TASdk.HHV:
        title = [periods];
        recordSet = general.HHV(
          this._createHighField(),
          periods,
          indicatorName
        );
        break;
      case TASdk.LLV:
        title = [periods];
        recordSet = general.LLV(this._createLowField(), periods, indicatorName);
        break;
      // @endif

      // Index
      // @if SCX_LICENSE = 'full'
      case TASdk.MoneyFlowIndex:
        title = [periods];
        recordSet = index.moneyFlowIndex(
          this._createRecordset(),
          periods,
          indicatorName
        );
        break;
      case TASdk.TradeVolumeIndex:
        {
          let minTick = this.getParameterValue(IndicatorParam.MIN_TICK);

          startIndex = 1;
          title = [sourceField.name, minTick];
          recordSet = index.tradeVolumeIndex(
            sourceField,
            this._createVolumeField(),
            minTick,
            indicatorName
          );
        }
        break;
      case TASdk.SwingIndex:
        {
          let limitMove = this.getParameterValue(IndicatorParam.LIMIT_MOVE);

          startIndex = 1;
          title = [limitMove];
          recordSet = index.swingIndex(
            this._createRecordset(),
            limitMove,
            indicatorName
          );
        }
        break;
      case TASdk.AccumulativeSwingIndex:
        {
          let limitMove = this.getParameterValue(IndicatorParam.LIMIT_MOVE);

          startIndex = 1;
          title = [limitMove];
          recordSet = index.accumulativeSwingIndex(
            this._createRecordset(),
            limitMove,
            indicatorName
          );
        }
        break;
      // @endif
      case TASdk.RelativeStrengthIndex:
        startIndex = <number>periods + 2;
        title = [sourceField.name, periods];
        recordSet = index.relativeStrengthIndex(
          sourceField,
          periods,
          indicatorName
        );
        break;
      // @if SCX_LICENSE = 'full'
      case TASdk.ComparativeRelativeStrength:
        {
          let source2Field = this._createField(
            this.getParameterValue(IndicatorParam.SOURCE2)
          );

          startIndex = 1;
          title = [sourceField.name, source2Field.name];
          recordSet = index.comparativeRelativeStrength(
            sourceField,
            source2Field,
            indicatorName
          );
        }
        break;
      case TASdk.PriceVolumeTrend:
        startIndex = 1;
        title = [sourceField.name];
        recordSet = index.priceVolumeTrend(
          sourceField,
          this._createVolumeField(),
          indicatorName
        );
        break;
      case TASdk.PositiveVolumeIndex:
        startIndex = 1;
        title = [sourceField.name];
        recordSet = index.positiveVolumeIndex(
          sourceField,
          this._createVolumeField(),
          indicatorName
        );
        break;
      case TASdk.NegativeVolumeIndex:
        startIndex = 1;
        title = [sourceField.name];
        recordSet = index.negativeVolumeIndex(
          sourceField,
          this._createVolumeField(),
          indicatorName
        );
        break;
      case TASdk.PerformanceIndex:
        startIndex = 1;
        title = [sourceField.name];
        recordSet = index.performance(sourceField, indicatorName);
        break;
      // @endif
      // @if SCX_LICENSE != 'free'
      case TASdk.OnBalanceVolume:
        startIndex = 1;
        title = [sourceField.name];
        recordSet = index.onBalanceVolume(
          sourceField,
          this._createVolumeField(),
          indicatorName
        );
        break;
      // @endif
      // @if SCX_LICENSE = 'full'
      case TASdk.MassIndex:
        startIndex = Math.floor(periods * 3);
        title = [periods];
        recordSet = index.massIndex(
          this._createRecordset(),
          periods,
          indicatorName
        );
        break;
      case TASdk.ChaikinMoneyFlow:
        title = [periods];
        recordSet = index.chaikinMoneyFlow(
          this._createRecordset(),
          periods,
          indicatorName
        );
        break;
      case TASdk.CommodityChannelIndex:
        startIndex = Math.floor(periods * 2);
        title = [periods];
        recordSet = index.commodityChannelIndex(
          this._createRecordset(),
          periods,
          indicatorName
        );
        break;
      case TASdk.StochasticMomentumIndex:
        {
          let kPeriods = this.getParameterValue(IndicatorParam.PCT_K_PERIODS),
            kSmoothing = this.getParameterValue(IndicatorParam.PCT_K_SMOOTHING),
            kDoubleSmoothing = this.getParameterValue(
              IndicatorParam.PCT_K_DOUBLE_SMOOTHING
            ),
            dPeriods = this.getParameterValue(IndicatorParam.PCT_D_PERIODS),
            dMaType = this.getParameterValue(IndicatorParam.PCT_D_MA_TYPE);

          startIndex = <number>kPeriods + <number>kSmoothing + <number>dPeriods;
          title = [
            kPeriods,
            kSmoothing,
            kDoubleSmoothing,
            dPeriods,
            this._getMaTypeString(maType),
            this._getMaTypeString(dMaType)
          ];
          recordSet = index.stochasticMomentumIndex(
            this._createRecordset(),
            kPeriods,
            kSmoothing,
            kDoubleSmoothing,
            dPeriods,
            maType,
            dMaType
          );
        }
        break;
      // @endif
      // @if SCX_LICENSE != 'free'
      case TASdk.HistoricalVolatility:
        {
          let barHistory = this.getParameterValue(IndicatorParam.BAR_HISTORY);
          let stdev = this.getParameterValue(
            IndicatorParam.STANDARD_DEVIATIONS
          );

          title = [sourceField.name, periods, barHistory, stdev];
          recordSet = index.historicalVolatility(
            sourceField,
            periods,
            barHistory,
            stdev,
            indicatorName
          );
        }
        break;
      // @endif
      // @if SCX_LICENSE = 'full'
      case TASdk.ElderForceIndex:
        {
          startIndex = 7;
          recordSet = index.elderForceIndex(
            this._createRecordset(),
            indicatorName
          );
          let ema = MovingAverage.prototype
            .exponentialMovingAverage(
              recordSet.getField(indicatorName),
              2,
              indicatorName + " Signal"
            )
            .getField(indicatorName + " Signal");
          recordSet.addField(ema);
        }
        break;
      case TASdk.ElderThermometer:
        startIndex = 2;
        recordSet = index.elderThermometer(
          this._createRecordset(),
          indicatorName
        );
        break;
      case TASdk.MarketFacilitationIndex:
        startIndex = 2;
        recordSet = index.marketFacilitationIndex(
          this._createRecordset(),
          indicatorName
        );
        break;
      case TASdk.QStick:
        title = [periods, this._getMaTypeString(maType)];
        recordSet = index.qStick(
          this._createRecordset(),
          periods,
          maType,
          indicatorName
        );
        break;
      case TASdk.GopalakrishnanRangeIndex:
        title = [periods];
        recordSet = index.gopalakrishnanRangeIndex(
          this._createRecordset(),
          periods,
          indicatorName
        );
        break;
      case TASdk.IntradayMomentumIndex:
        title = [sourceField.name, periods];
        startIndex = 3;
        recordSet = index.intradayMomentumIndex(
          this._createRecordset(),
          indicatorName
        );
        break;
      case TASdk.RAVI:
        {
          let shortCycle = this.getParameterValue(IndicatorParam.SHORT_CYCLE),
            longCycle = this.getParameterValue(IndicatorParam.LONG_CYCLE);

          startIndex = <number>longCycle + 2;
          title = [sourceField.name, shortCycle, longCycle];
          recordSet = index.RAVI(
            sourceField,
            shortCycle,
            longCycle,
            indicatorName
          );
        }
        break;
      case TASdk.RandomWalkIndex:
        startIndex = periods * 2;
        title = [periods];
        recordSet = index.randomWalkIndex(
          this._createRecordset(),
          periods,
          indicatorName
        );
        break;
      case TASdk.TwiggsMoneyFlow:
        title = [periods];
        recordSet = index.twiggsMoneyFlow(
          this._createRecordset(),
          periods,
          indicatorName
        );
        break;
      // @endif

      // Linear regression
      // @if SCX_LICENSE = 'full'
      case TASdk.LinearRegressionRSquared:
        title = [sourceField.name, periods];
        recordSet = regression.regression(sourceField, periods);
        break;
      case TASdk.LinearRegressionForecast:
        title = [sourceField.name, periods];
        recordSet = regression.regression(sourceField, periods);
        break;
      case TASdk.LinearRegressionSlope:
        title = [sourceField.name, periods];
        recordSet = regression.regression(sourceField, periods);
        break;
      case TASdk.LinearRegressionIntercept:
        title = [sourceField.name, periods];
        recordSet = regression.regression(sourceField, periods);
        break;
      case TASdk.TimeSeriesForecast:
        title = [sourceField.name, periods];
        recordSet = regression.timeSeriesForecast(
          sourceField,
          periods,
          indicatorName
        );
        break;
      // @endif

      // Moving Average
      case TASdk.SimpleMovingAverage:
        title = [sourceField.name, periods];
        recordSet = MovingAverage.prototype.simpleMovingAverage(
          sourceField,
          periods,
          indicatorName
        );
        break;
      // @if SCX_LICENSE != 'free'
      case TASdk.ExponentialMovingAverage:
        title = [sourceField.name, periods];
        recordSet = MovingAverage.prototype.exponentialMovingAverage(
          sourceField,
          periods,
          indicatorName
        );
        break;
      // @endif
      // @if SCX_LICENSE = 'full'
      case TASdk.TimeSeriesMovingAverage:
        title = [sourceField.name, periods];
        recordSet = MovingAverage.prototype.timeSeriesMovingAverage(
          sourceField,
          periods,
          indicatorName
        );
        break;
      case TASdk.VariableMovingAverage:
        startIndex = Math.floor(periods * 2);
        title = [sourceField.name, periods];
        recordSet = MovingAverage.prototype.variableMovingAverage(
          sourceField,
          periods,
          indicatorName
        );
        break;
      case TASdk.TriangularMovingAverage:
        startIndex = Math.floor(periods * 2);
        title = [sourceField.name, periods];
        recordSet = MovingAverage.prototype.triangularMovingAverage(
          sourceField,
          periods,
          indicatorName
        );
        break;
      case TASdk.WeightedMovingAverage:
        title = [sourceField.name, periods];
        recordSet = MovingAverage.prototype.weightedMovingAverage(
          sourceField,
          periods,
          indicatorName
        );
        break;
      case TASdk.VIDYA:
        {
          let r2scale = this.getParameterValue(IndicatorParam.R2_SCALE);

          startIndex = 2;
          title = [sourceField.name, periods, r2scale];
          recordSet = MovingAverage.prototype.VIDYA(
            sourceField,
            periods,
            r2scale,
            indicatorName
          );
        }
        break;
      case TASdk.WellesWilderSmoothing:
        startIndex = Math.floor(periods * 2);
        title = [sourceField.name, periods];
        recordSet = MovingAverage.prototype.wellesWilderSmoothing(
          sourceField,
          periods,
          indicatorName
        );
        break;
      // @endif

      // Oscillator
      // @if SCX_LICENSE = 'full'
      case TASdk.ChandeMomentumOscillator:
        title = [sourceField.name, periods];
        recordSet = oscillator.chandeMomentumOscillator(
          sourceField,
          periods,
          indicatorName
        );
        break;
      // @endif
      // @if SCX_LICENSE != 'free'
      case TASdk.MomentumOscillator:
        startIndex = periods + 2;
        title = [sourceField.name, periods];
        recordSet = oscillator.momentum(sourceField, periods, indicatorName);
        break;
      // @endif
      // @if SCX_LICENSE = 'full'
      case TASdk.TRIX:
        startIndex = Math.floor(periods * 2);
        title = [sourceField.name, periods];
        recordSet = oscillator.TRIX(sourceField, periods, indicatorName);
        break;
      case TASdk.UltimateOscillator:
        {
          let cycle1 = this.getParameterValue(IndicatorParam.CYCLE_1),
            cycle2 = this.getParameterValue(IndicatorParam.CYCLE_2),
            cycle3 = this.getParameterValue(IndicatorParam.CYCLE_3);

          startIndex = Math.max(cycle1, cycle2, cycle3) + 1;
          title = [cycle1, cycle2, cycle3];
          recordSet = oscillator.ultimateOscillator(
            this._createRecordset(),
            cycle1,
            cycle2,
            cycle3,
            indicatorName
          );
        }
        break;
      case TASdk.VerticalHorizontalFilter:
        title = [sourceField.name, periods];
        recordSet = oscillator.verticalHorizontalFilter(
          sourceField,
          periods,
          indicatorName
        );
        break;
      case TASdk.WilliamsPctR:
        startIndex = Math.floor(periods * 2);
        title = [periods];
        recordSet = oscillator.williamsPctR(
          this._createRecordset(),
          periods,
          indicatorName
        );
        break;
      case TASdk.WilliamsAccumulationDistribution:
        startIndex = 1;
        recordSet = oscillator.williamsAccumulationDistribution(
          this._createRecordset(),
          indicatorName
        );
        break;
      case TASdk.VolumeOscillator:
        {
          let shortTerm = this.getParameterValue(IndicatorParam.SHORT_TERM),
            longTerm = this.getParameterValue(IndicatorParam.LONG_TERM),
            pointsOrPercent = this.getParameterValue(
              IndicatorParam.POINTS_OR_PERCENT
            );

          startIndex = Math.max(shortTerm, longTerm) + 1;
          title = [shortTerm, longTerm];
          recordSet = oscillator.volumeOscillator(
            this._createVolumeField(),
            shortTerm,
            longTerm,
            pointsOrPercent,
            indicatorName
          );
        }
        break;
      case TASdk.ChaikinVolatility:
        {
          let roc = this.getParameterValue(IndicatorParam.RATE_OF_CHANGE);

          startIndex = Math.floor(periods * 1.5);
          title = [periods, roc, this._getMaTypeString(maType)];
          recordSet = oscillator.chaikinVolatility(
            this._createRecordset(),
            periods,
            roc,
            maType,
            indicatorName
          );
        }
        break;
      case TASdk.StochasticOscillator:
        {
          let kSlowing = this.getParameterValue(IndicatorParam.PCT_K_SMOOTHING);
          let kPeriods = this.getParameterValue(IndicatorParam.PCT_K_PERIODS);
          let dPeriods = this.getParameterValue(IndicatorParam.PCT_D_PERIODS);

          startIndex = Math.max(kPeriods, dPeriods, kSlowing) + 1;
          title = [kPeriods, kSlowing, dPeriods, this._getMaTypeString(maType)];
          recordSet = oscillator.stochasticOscillator(
            this._createRecordset(),
            kPeriods,
            kSlowing,
            dPeriods,
            maType
          );
        }
        break;
      case TASdk.PriceOscillator:
        {
          let longCycle = this.getParameterValue(IndicatorParam.LONG_CYCLE);
          let shortCycle = this.getParameterValue(IndicatorParam.SHORT_CYCLE);

          startIndex = Math.max(longCycle, shortCycle) + 1;
          title = [
            sourceField.name,
            longCycle,
            shortCycle,
            this._getMaTypeString(maType)
          ];
          recordSet = oscillator.priceOscillator(
            sourceField,
            longCycle,
            shortCycle,
            maType,
            indicatorName
          );
        }
        break;
      // @endif
      case TASdk.MACD:
        {
          let signalPeriods = this.getParameterValue(
            IndicatorParam.SIGNAL_PERIODS
          );
          let longCycle = this.getParameterValue(IndicatorParam.LONG_CYCLE);
          let shortCycle = this.getParameterValue(IndicatorParam.SHORT_CYCLE);

          startIndex = Math.trunc(Math.max(longCycle, shortCycle) * 2.25);
          title = [
            sourceField.name,
            signalPeriods,
            shortCycle,
            longCycle,
            this._getMaTypeString(maType)
          ];
          recordSet = oscillator.MACD(
            sourceField,
            signalPeriods,
            longCycle,
            shortCycle,
            maType,
            indicatorName
          );
          let recordSet2 = oscillator.macdHistogram(
            sourceField,
            signalPeriods,
            longCycle,
            shortCycle,
            maType,
            `${indicatorName} Histogram`
          );
          let field = recordSet2.getField(`${indicatorName} Histogram`);
          recordSet.addField(field);
        }
        break;
      // @if SCX_LICENSE = 'full'
      case TASdk.MACDHistogram:
        {
          let signalPeriods = this.getParameterValue(
            IndicatorParam.SIGNAL_PERIODS
          );
          let longCycle = this.getParameterValue(IndicatorParam.LONG_CYCLE);
          let shortCycle = this.getParameterValue(IndicatorParam.SHORT_CYCLE);

          startIndex = Math.trunc(Math.max(longCycle, shortCycle) * 2.25);
          title = [
            sourceField.name,
            signalPeriods,
            shortCycle,
            longCycle,
            this._getMaTypeString(maType)
          ];
          recordSet = oscillator.macdHistogram(
            sourceField,
            signalPeriods,
            longCycle,
            shortCycle,
            maType,
            indicatorName + " Histogram"
          );
        }
        break;
      case TASdk.EaseOfMovement:
        title = [periods, this._getMaTypeString(maType)];
        recordSet = oscillator.easeOfMovement(
          this._createRecordset(),
          periods,
          maType,
          indicatorName
        );
        break;
      case TASdk.DetrendedPriceOscillator:
        startIndex = periods * 2;
        title = [sourceField.name, periods, this._getMaTypeString(maType)];
        recordSet = oscillator.detrendedPriceOscillator(
          sourceField,
          periods,
          maType,
          indicatorName
        );
        break;
      case TASdk.ParabolicSAR:
        {
          let minAf = this.getParameterValue(IndicatorParam.MIN_AF),
            maxAf = this.getParameterValue(IndicatorParam.MAX_AF);

          startIndex = 2;
          title = [minAf, maxAf];
          recordSet = oscillator.parabolicSAR(
            this._createHighField(),
            this._createLowField(),
            minAf,
            maxAf,
            indicatorName
          );
        }
        break;
      case TASdk.DirectionalMovementSystem:
        title = [periods];
        recordSet = oscillator.directionalMovementSystem(
          this._createRecordset(),
          periods
        );
        break;
      case TASdk.TrueRange:
        startIndex = 2;
        recordSet = oscillator.trueRange(
          this._createRecordset(),
          indicatorName
        );
        break;
      // @endif
      // @if SCX_LICENSE != 'free'
      case TASdk.AverageTrueRange:
        {
          title = [periods];
          recordSet = oscillator.trueRange(
            this._createRecordset(),
            indicatorName
          );
          let tr = recordSet.getField(indicatorName);
          recordSet = MovingAverage.prototype.simpleMovingAverage(
            tr,
            periods,
            indicatorName
          );
        }
        break;
      case TASdk.Aroon:
        title = [periods];
        recordSet = oscillator.aroon(this._createRecordset(), periods);
        break;
      // @endif
      // @if SCX_LICENSE = 'full'
      case TASdk.AroonOscillator:
        title = [periods];
        recordSet = oscillator.aroon(this._createRecordset(), periods);
        break;
      case TASdk.RainbowOscillator:
        {
          let levels = this.getParameterValue(IndicatorParam.LEVELS);
          let periods = this.getParameterValue(IndicatorParam.PERIODS);
          let indicatorHighName = IndicatorField.INDICATOR_HIGH;
          let indicatorLowName = IndicatorField.INDICATOR_LOW;
          startIndex = levels + 1;
          title = [
            sourceField.name,
            levels,
            periods,
            this._getMaTypeString(maType)
          ];
          recordSet = oscillator.rainbowOscillator(
            sourceField,
            levels,
            maType,
            periods,
            indicatorHighName,
            indicatorLowName
          );
        }
        break;
      case TASdk.FractalChaosOscillator:
        title = [periods];
        recordSet = oscillator.fractalChaosOscillator(
          this._createRecordset(),
          periods,
          indicatorName
        );
        break;
      case TASdk.PrimeNumberOscillator:
        startIndex = 1;
        recordSet = oscillator.primeNumberOscillator(
          this._createCloseField(),
          indicatorName
        );
        break;
      case TASdk.ElderRay:
        title = [periods, this._getMaTypeString(maType)];
        recordSet = oscillator.elderRay(
          this._createRecordset(),
          periods,
          maType,
          indicatorName
        );
        break;
      case TASdk.EhlerFisherTransform:
        startIndex = <number>periods + 2;
        title = [periods];
        recordSet = oscillator.ehlerFisherTransform(
          this._createRecordset(),
          periods,
          indicatorName
        );
        break;
      case TASdk.SchaffTrendCycle:
        {
          let shortCycle = this.getParameterValue(IndicatorParam.SHORT_CYCLE);
          let longCycle = this.getParameterValue(IndicatorParam.LONG_CYCLE);

          title = [
            sourceField.name,
            periods,
            shortCycle,
            longCycle,
            this._getMaTypeString(maType)
          ];
          recordSet = oscillator.schaffTrendCycle(
            sourceField,
            periods,
            shortCycle,
            longCycle,
            maType,
            indicatorName
          );
        }
        break;
      case TASdk.CenterOfGravity:
        title = [sourceField.name, periods];
        recordSet = oscillator.centerOfGravity(
          sourceField,
          periods,
          indicatorName
        );
        break;
      case TASdk.CoppockCurve:
        startIndex = 12;
        title = [sourceField.name];
        recordSet = oscillator.coppockCurve(sourceField, indicatorName);
        break;
      case TASdk.ChandeForecastOscillator:
        title = [sourceField.name, periods];
        recordSet = oscillator.chandeForecastOscillator(
          sourceField,
          periods,
          indicatorName
        );
        break;
      case TASdk.KlingerVolumeOscillator:
        {
          let longCycle = this.getParameterValue(IndicatorParam.LONG_CYCLE);
          let shortCycle = this.getParameterValue(IndicatorParam.SHORT_CYCLE);

          startIndex = Math.max(periods, shortCycle) + 1;
          title = [
            periods,
            shortCycle,
            longCycle,
            this._getMaTypeString(maType)
          ];
          recordSet = oscillator.klingerVolumeOscillator(
            this._createRecordset(),
            periods,
            longCycle,
            shortCycle,
            maType,
            indicatorName
          );
        }
        break;
      case TASdk.PrettyGoodOscillator:
        title = [periods];
        recordSet = oscillator.prettyGoodOscillator(
          this._createRecordset(),
          periods,
          indicatorName
        );
        break;
      // @endif
      case TASdk.Volume:
      case TASdk.ColoredVolume:
        break;
      case TASdk.McGinleysDynamic:
        title = [sourceField.name, periods];
        recordSet = MovingAverage.prototype.mcGinleysDynamic(
          sourceField,
          periods,
          indicatorName
        );
        break;
      case TASdk.SuperTrendOscillator:
        title = [sourceField.name, periods, multiplier];
        recordSet = oscillator.trueRange(
          this._createRecordset(),
          indicatorName
        );
        let tr = recordSet.getField(indicatorName);
        let indicatorAlias = IndicatorField.SUPERTREND;
        recordSet = oscillator.SuperTrendOscillator(
          sourceField,
          tr,
          periods,
          indicatorAlias,
          multiplier,
          this._createHighField(),
          this._createLowField()
        );
        break;
      case TASdk.VolumeWeightedAveragePrice:
        let typicalPrice = general.typicalPrice(
          this._createRecordset(),
          indicatorName
        );
        let volumeField = this._createVolumeField();
        let dateField = this._createDateField();
        startIndex = 1;
        recordSet = general.VWAP(
          typicalPrice,
          volumeField,
          indicatorName,
          dateField
        );
        break;
      case TASdk.PivotPoints:
        {
          let duration = this.getParameterValue(IndicatorParam.DURATION);
          const timeInterval = this.chart.timeInterval;
          let records = this._createRecordset();
          let numberOfPivotsBack = 15;
          startIndex = 1;
          let dateField = this._createDateField();
          title = ["Pivot Point", duration];
          recordSet = general.pivotPoints(
            records,
            dateField,
            numberOfPivotsBack,
            duration,
            timeInterval
          );
        }
        break;
      default:
        throw new Error(`Unsupported indicator: ${this.taIndicator}`);
    }

    this._parameters = title ? `(${title.join(", ")})` : "";

    return {
      parameters: title ? title.join(", ") : "",
      recordSet: recordSet,
      startIndex: startIndex
    };
  }

  /**
   * @internal
   */
  _createField(nameSuffix: string, fieldName?: string): Field {
    if (!nameSuffix) return null;
    if (fieldName === undefined) {
      switch (nameSuffix) {
        case DataSeriesSuffix.OPEN:
          fieldName = IndicatorField.OPEN;
          break;
        case DataSeriesSuffix.HIGH:
          fieldName = IndicatorField.HIGH;
          break;
        case DataSeriesSuffix.LOW:
          fieldName = IndicatorField.LOW;
          break;
        case DataSeriesSuffix.CLOSE:
          fieldName = IndicatorField.CLOSE;
          break;
        case DataSeriesSuffix.VOLUME:
          fieldName = IndicatorField.VOLUME;
          break;
        case DataSeriesSuffix.DATE:
          fieldName = IndicatorField.VOLUME;
          break;
        default:
          break;
      }
    }

    const seriesName = this.getDataSeriesPrefix() + nameSuffix;
    let dataSeries = this._usePrimaryDataSeries
      ? this._chart.primaryDataSeries(seriesName)
      : this._chart.getDataSeries(seriesName);

    return dataSeries ? dataSeries.toField(fieldName) : null;
  }

  getDataSeriesPrefix() {
    if (this.chartPanel && this.chartPanel.symbol) {
      return this.chartPanel.getDataSeriesPrefix();
    }
    return "";
  }

  /**
   * @internal
   */
  _createOpenField(): Field {
    return this._createField(DataSeriesSuffix.OPEN, IndicatorField.OPEN);
  }

  /**
   * @internal
   */
  _createHighField(): Field {
    return this._createField(DataSeriesSuffix.HIGH, IndicatorField.HIGH);
  }

  /**
   * @internal
   */
  _createLowField(): Field {
    return this._createField(DataSeriesSuffix.LOW, IndicatorField.LOW);
  }

  /**
   * @internal
   */
  _createCloseField(): Field {
    return this._createField(DataSeriesSuffix.CLOSE, IndicatorField.CLOSE);
  }

  /**
   * @internal
   */
  _createVolumeField(): Field {
    return this._createField(DataSeriesSuffix.VOLUME, IndicatorField.VOLUME);
  }

  /**
   * @internal
   */
  _createRecordset(): Recordset {
    let recordSet = new Recordset();
    recordSet.addField(this._createOpenField());
    recordSet.addField(this._createHighField());
    recordSet.addField(this._createLowField());
    recordSet.addField(this._createCloseField());

    return recordSet;
  }
  /**
   * @internal
   */
  _createDateField(): Field {
    return this._createField(DataSeriesSuffix.DATE);
  }

  /**
   * @internal
   */
  protected _updatePlotItem(index: number): boolean {
    if (this.taIndicator === TASdk.Volume) {
      this._updateVolumeIndicator(this._plotItems[index]);
      return true;
    }
    if (this.taIndicator === TASdk.ColoredVolume) {
      this._updateColoredVolumeIndicator(this._plotItems[index]);
      return true;
    }

    return false;
  }

  /**
   * @internal
   */
  private setAutoScaleMultiplier(valueScale: ValueScale) {
    if (valueScale) {
      this._panel.getValueScale(
        valueScale
      ).autoScaleMultiplier = AutoScaleMultiplierValue;
    }
  }

  /**
   * @internal
   */
  protected _needsCustomScale(): boolean {
    return (
      this.taIndicator === TASdk.Volume ||
      this.taIndicator === TASdk.ColoredVolume
    );
  }

  /**
   * @internal
   */
  _updateVolumeIndicator(plotItem: any) {
    let theme = this._getLineTheme(0),
      chartBackgroundColor = this.chart.theme.chart.background;
      const seriesName = this.getDataSeriesPrefix() + DataSeriesSuffix.VOLUME;
       plotItem.dataSeries = this._usePrimaryDataSeries
        ? this._chart.primaryDataSeries(seriesName)
        : this._chart.getDataSeries(seriesName);
    plotItem.plot = new HistogramPlot({
      dataSeries: plotItem.dataSeries,
      theme: theme,
      plotStyle: HistogramPlot.Style.LINE
    });

    plotItem.color = chartBackgroundColor.some(HtmlUtil.isDarkColor)
      ? "white"
      : "rgba(51, 51, 51, 0.8)"; // theme.strokeColor;
    this.setAutoScaleMultiplier(this.valueScale);
  }

  /**
   * @internal
   */
  _updateColoredVolumeIndicator(plotItem: any) {
    let theme =
        this.coloredVolumeTheme != null
          ? this.coloredVolumeTheme
          : JsUtil.clone(this.chart.theme.plot.bar.candle),
      chartBackgroundColor = this.chart.theme.chart.background;

    if (!this.coloredVolumeTheme) {
      let upColor = HtmlUtil.toRgba(theme.upCandle.fill.fillColor),
        downColor = HtmlUtil.toRgba(theme.downCandle.fill.fillColor);
      upColor.a = 0.9;
      downColor.a = 0.9;
      theme.upCandle.fill.fillColor = HtmlUtil.toRgbString(upColor);
      theme.downCandle.fill.fillColor = HtmlUtil.toRgbString(downColor);
    }
    this.coloredVolumeTheme = theme;

    const dataSeriesPrefix = this.getDataSeriesPrefix();

    const openkey = dataSeriesPrefix + DataSeriesSuffix.OPEN ;
    let open = this._usePrimaryDataSeries
      ? this._chart.primaryDataSeries(openkey)
      : this._chart.getDataSeries(openkey);
    
    const closekey = dataSeriesPrefix + DataSeriesSuffix.CLOSE ;
    let close = this._usePrimaryDataSeries
      ? this._chart.primaryDataSeries(closekey)
      : this._chart.getDataSeries(closekey);
      
    const volumekey = dataSeriesPrefix + DataSeriesSuffix.VOLUME ;
    plotItem.dataSeries = this._usePrimaryDataSeries
      ? this._chart.primaryDataSeries(volumekey)
      : this._chart.getDataSeries(volumekey);

    plotItem.plot = new HistogramPlot({
      dataSeries: [plotItem.dataSeries, open, close],
      theme: theme,
      plotStyle: HistogramPlot.Style.COLORED_COLUMN
    });

    plotItem.color = chartBackgroundColor.some(HtmlUtil.isDarkColor)
      ? "white"
      : "rgba(51, 51, 51, 0.8)"; // theme.strokeColor;
    this.setAutoScaleMultiplier(this.valueScale);
  }
}
