/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

/////////////////////////////////////////////////////////////////////////////////////////////////
/* !!! WARNING TO NEFARIOUS COMPANYS AND DEVELOPERS !!!

 Your license agreement requires the use of the Modulus LicensePing.com licensing mechanism.
 The mechanism monitors the usage and distribution patterns of our intellectual property.
 If the usage or distribution patterns indicate that our licensing mechanism has either
 been removed, altered, tampered with or that our intellectual property may be misused in
 any form, our legal team may initiate contact with you to investigate the matter further.

 Removal or modification of this license mechanism by any means whatsoever (editing the code,
 removing the LicensePing.com URL reference, etc.) constitutes willful and criminal copyright
 infringement in addition to giving rise to claims by Modulus Financial Engineering, Inc.
 against you, as the developer, and your company as a whole for, among others:

 (1) Copyright Infringement;
 (2) False Designation of Origin;
 (3) Breach of Contract;
 (4) Misappropriation of Trade Secrets;
 (5) Interference with Contract; and
 (6) Interference with Prospective Business Relations.

 17 USC � 506 - Criminal offenses
 (a) Criminal Infringement.
 Any person who willfully infringes a copyright shall be punished as provided under section
 2319 of title 18, if the infringement was committed for purposes of commercial advantage
 or private financial gain.

 18 USC � 2319 - Criminal infringement of a copyright
 (a) Any person who commits an offense under section 506 (a)(1)(A) of title 17 shall be imprisoned
 not more than 5 years, or fined in the amount set forth in this title (up to $150,000), or both,
 if the offense consists of the reproduction or distribution, including by electronic means, during
 any 180-day period, of at least 10 copies, of 1 or more copyrighted works, which have a total retail
 value of more than $2,500.

 For more information, review the license agreement associated with this software and source
 code at http://www.modulusfe.com/support/license.pdf or contact us at legal@modulusfe.com */
/////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @internal
 */

export const Const = {
  nullValue: -987653421,
  mA_START: 0,
  mA_END: 7,
  simpleMovingAverage: 0,
  exponentialMovingAverage: 1,
  timeSeriesMovingAverage: 2,
  triangularMovingAverage: 3,
  variableMovingAverage: 4,
  VIDYA: 5,
  wellesWilderSmoothing: 6,
  weightedMovingAverage: 7
};

export const Unknown = -1;
export const FirstIndicator = -1;
export const SimpleMovingAverage = 0;
export const ExponentialMovingAverage = 1;
export const TimeSeriesMovingAverage = 2;
export const TriangularMovingAverage = 3;
export const VariableMovingAverage = 4;
export const VIDYA = 5;
export const WellesWilderSmoothing = 6;
export const WeightedMovingAverage = 7;
export const WilliamsPctR = 8;
export const WilliamsAccumulationDistribution = 9;
export const VolumeOscillator = 10;
export const VerticalHorizontalFilter = 11;
export const UltimateOscillator = 12;
export const TrueRange = 13;
export const AverageTrueRange = 14;
export const RainbowOscillator = 15;
export const PriceOscillator = 16;
export const ParabolicSAR = 17;
export const MomentumOscillator = 18;
export const MACD = 19;
export const EaseOfMovement = 20;
export const DirectionalMovementSystem = 21;
export const DetrendedPriceOscillator = 22;
export const ChandeMomentumOscillator = 23;
export const ChaikinVolatility = 24;
export const Aroon = 25;
export const AroonOscillator = 26;
export const LinearRegressionRSquared = 27;
export const LinearRegressionForecast = 28;
export const LinearRegressionSlope = 29;
export const LinearRegressionIntercept = 30;
export const PriceVolumeTrend = 31;
export const PerformanceIndex = 32;
export const CommodityChannelIndex = 33;
export const ChaikinMoneyFlow = 34;
export const WeightedClose = 35;
export const VolumeROC = 36;
export const TypicalPrice = 37;
export const StandardDeviation = 38;
export const PriceROC = 39;
export const MedianPrice = 40;
export const HighMinusLow = 41;
export const BollingerBands = 42;
export const FractalChaosBands = 43;
export const HighLowBands = 44;
export const MovingAverageEnvelope = 45;
export const SwingIndex = 46;
export const AccumulativeSwingIndex = 47;
export const ComparativeRelativeStrength = 48;
export const MassIndex = 49;
export const MoneyFlowIndex = 50;
export const NegativeVolumeIndex = 51;
export const OnBalanceVolume = 52;
export const PositiveVolumeIndex = 53;
export const RelativeStrengthIndex = 54;
export const TradeVolumeIndex = 55;
export const StochasticOscillator = 56;
export const StochasticMomentumIndex = 57;
export const FractalChaosOscillator = 58;
export const PrimeNumberOscillator = 59;
export const PrimeNumberBands = 60;
export const HistoricalVolatility = 61;
export const MACDHistogram = 62;
export const HHV = 63;
export const LLV = 64;
export const TimeSeriesForecast = 65;
export const TRIX = 66;
export const ElderRay = 67;
export const ElderForceIndex = 68;
export const ElderThermometer = 69;
export const EhlerFisherTransform = 70;
export const KeltnerChannel = 71;
export const MarketFacilitationIndex = 72;
export const SchaffTrendCycle = 73;
export const QStick = 74;
export const STARC = 75;
export const CenterOfGravity = 76;
export const CoppockCurve = 77;
export const ChandeForecastOscillator = 78;
export const GopalakrishnanRangeIndex = 79;
export const IntradayMomentumIndex = 80;
export const KlingerVolumeOscillator = 81;
export const PrettyGoodOscillator = 82;
export const RAVI = 83;
export const RandomWalkIndex = 84;
export const TwiggsMoneyFlow = 85;
export const LastIndicator = 86;
export const IchimokuCloud = 87;
export const DBox = 88;
export const McGinleysDynamic = 89;
export const SuperTrendOscillator = 90;
export const VolumeWeightedAveragePrice = 91;
export const PivotPoints = 92;
export const Volume = 1000;
export const ColoredVolume = 1001;
export const indicatorAlias = {
  [SimpleMovingAverage]: "SMA",
  [ExponentialMovingAverage]: "EMA",
  [TimeSeriesMovingAverage]: "TSMA",
  [TriangularMovingAverage]: "TMA",
  [VariableMovingAverage]: "VMA",
  [VIDYA]: "VIDYA",
  [WellesWilderSmoothing]: "WWS",
  [WeightedMovingAverage]: "WMS",
  [WilliamsPctR]: "WPR",
  [WilliamsAccumulationDistribution]: "WAD",
  [VolumeOscillator]: "V0",
  [VerticalHorizontalFilter]: "VHF",
  [UltimateOscillator]: "UO",
  [TrueRange]: "TR",
  [AverageTrueRange]: "ATR",
  [TRIX]: "TRIX",
  [RainbowOscillator]: "RO",
  [PriceOscillator]: "PO",
  [ParabolicSAR]: "PSAR",
  [MomentumOscillator]: "MO",
  [MACD]: "MACD",
  [EaseOfMovement]: "EOM",
  [DirectionalMovementSystem]: "DMS",
  [DetrendedPriceOscillator]: "DPO",
  [ChandeMomentumOscillator]: "CMO",
  [ChaikinVolatility]: "CV",
  [Aroon]: "AROON",
  [AroonOscillator]: "AO",
  [LinearRegressionRSquared]: "LRR2",
  [LinearRegressionForecast]: "LRF",
  [LinearRegressionSlope]: "LRS",
  [LinearRegressionIntercept]: "LRI",
  [PriceVolumeTrend]: "PVT",
  [PerformanceIndex]: "PI",
  [CommodityChannelIndex]: "CCI",
  [ChaikinMoneyFlow]: "CMF",
  [WeightedClose]: "WC",
  [VolumeROC]: "VROC",
  [TypicalPrice]: "TP",
  [StandardDeviation]: "SD",
  [PriceROC]: "PROC",
  [MedianPrice]: "MP",
  [HighMinusLow]: "HML",
  [BollingerBands]: "BB",
  [FractalChaosBands]: "FCB",
  [HighLowBands]: "HLB",
  [MovingAverageEnvelope]: "MAE",
  [SwingIndex]: "SI",
  [AccumulativeSwingIndex]: "ASI",
  [ComparativeRelativeStrength]: "CRS",
  [MassIndex]: "MI",
  [MoneyFlowIndex]: "MFI",
  [NegativeVolumeIndex]: "NVI",
  [OnBalanceVolume]: "OBV",
  [PositiveVolumeIndex]: "PVI",
  [RelativeStrengthIndex]: "RSI",
  [TradeVolumeIndex]: "TVI",
  [StochasticOscillator]: "SO",
  [StochasticMomentumIndex]: "SMI",
  [FractalChaosOscillator]: "FCO",
  [PrimeNumberOscillator]: "PNO",
  [PrimeNumberBands]: "PNB",
  [HistoricalVolatility]: "HV",
  [MACDHistogram]: "MACDH",
  [HHV]: "HHV",
  [LLV]: "LLV",
  [TimeSeriesForecast]: "TSF",
  [ElderRay]: "ER",
  [ElderForceIndex]: "EFI",
  [ElderThermometer]: "ET",
  [EhlerFisherTransform]: "EFT",
  [KeltnerChannel]: "KC",
  [MarketFacilitationIndex]: "MFI",
  [SchaffTrendCycle]: "STC",
  [QStick]: "QST",
  [STARC]: "STARC",
  [CenterOfGravity]: "COG",
  [CoppockCurve]: "CC",
  [ChandeForecastOscillator]: "CFO",
  [GopalakrishnanRangeIndex]: "GRI",
  [IntradayMomentumIndex]: "IMI",
  [KlingerVolumeOscillator]: "KVO",
  [PrettyGoodOscillator]: "PGO",
  [RAVI]: "RAVI",
  [RandomWalkIndex]: "RWI",
  [TwiggsMoneyFlow]: "TMF",
  [IchimokuCloud]: "IC",
  [DBox]: "DBOX",
  [McGinleysDynamic]: "MGD",
  [SuperTrendOscillator]: "STO",
  [ColoredVolume]: "CVO",
  [Volume]: "VO",
  [VolumeWeightedAveragePrice]: "VWAP",
  [PivotPoints]: "PP",
  [Unknown]: ""
};
export const indicatorName = {
  [SimpleMovingAverage]: "Simple Moving Average",
  [ExponentialMovingAverage]: "Exponential Moving Average",
  [TimeSeriesMovingAverage]: "Time Series Moving Average",
  [TriangularMovingAverage]: "Triangular Moving Average",
  [VariableMovingAverage]: "Variable Moving Average",
  [VIDYA]: "Volatility Index Dynamic Average",
  [WellesWilderSmoothing]: "Welles Wilder Smoothing",
  [WeightedMovingAverage]: "Weighted Moving Average",
  [WilliamsPctR]: "Williams %R",
  [WilliamsAccumulationDistribution]: "Williams Accumulation Distribution",
  [VolumeOscillator]: "Volume Oscillator",
  [VerticalHorizontalFilter]: "Vertical Horizontal Filter",
  [UltimateOscillator]: "Ultimate Oscillator",
  [TrueRange]: "True Range",
  [AverageTrueRange]: "Average True Range",
  [TRIX]: "TRIX",
  [RainbowOscillator]: "Rainbow Oscillator",
  [PriceOscillator]: "Price Oscillator",
  [ParabolicSAR]: "Parabolic SAR",
  [MomentumOscillator]: "Momentum Oscillator",
  [MACD]: "MACD",
  [EaseOfMovement]: "Ease of Movement",
  [DirectionalMovementSystem]: "Directional Movement System",
  [DetrendedPriceOscillator]: "Detrended Price Oscillator",
  [ChandeMomentumOscillator]: "Chande Momentum Oscillator",
  [ChaikinVolatility]: "Chaikin Volatility",
  [Aroon]: "Aroon",
  [AroonOscillator]: "Aroon Oscillator",
  [LinearRegressionRSquared]: "Linear Regression R2",
  [LinearRegressionForecast]: "Linear Regression Forecast",
  [LinearRegressionSlope]: "Linear Regression Slope",
  [LinearRegressionIntercept]: "Linear Regression Intercept",
  [PriceVolumeTrend]: "Price Volume Trend",
  [PerformanceIndex]: "Performance Index",
  [CommodityChannelIndex]: "Commodity Channel Index",
  [ChaikinMoneyFlow]: "Chaikin Money Flow",
  [WeightedClose]: "Weighted Close",
  [VolumeROC]: "Volume Rate of Change",
  [TypicalPrice]: "Typical Price",
  [StandardDeviation]: "Standard Deviation",
  [PriceROC]: "Price Rate of Change",
  [MedianPrice]: "Median Price",
  [HighMinusLow]: "High Minus Low",
  [BollingerBands]: "Bollinger Bands",
  [FractalChaosBands]: "Fractal Chaos Bands",
  [HighLowBands]: "High Low Bands",
  [MovingAverageEnvelope]: "Moving Average Envelope",
  [SwingIndex]: "Swing Index",
  [AccumulativeSwingIndex]: "Accumulative Swing Index",
  [ComparativeRelativeStrength]: "Comparative Relative Strength",
  [MassIndex]: "Mass Index",
  [MoneyFlowIndex]: "Money Flow Index",
  [NegativeVolumeIndex]: "Negative Volume Index",
  [OnBalanceVolume]: "On Balance Volume",
  [PositiveVolumeIndex]: "Positive Volume Index",
  [RelativeStrengthIndex]: "Relative Strength Index",
  [TradeVolumeIndex]: "Trade Volume Index",
  [StochasticOscillator]: "Stochastic Oscillator",
  [StochasticMomentumIndex]: "Stochastic Momentum Index",
  [FractalChaosOscillator]: "Fractal Chaos Oscillator",
  [PrimeNumberOscillator]: "Prime Number Oscillator",
  [PrimeNumberBands]: "Prime Number Bands",
  [HistoricalVolatility]: "Historical Volatility",
  [MACDHistogram]: "MACD Histogram",
  [HHV]: "Highest High Value",
  [LLV]: "Lowest Low Value",
  [TimeSeriesForecast]: "Time Series Forecast",
  [ElderRay]: "Elder Ray",
  [ElderForceIndex]: "Elder Force Index",
  [ElderThermometer]: "Elder Thermometer",
  [EhlerFisherTransform]: "Ehler Fisher Transform",
  [KeltnerChannel]: "Keltner Channel",
  [MarketFacilitationIndex]: "Market Facilitation Index",
  [SchaffTrendCycle]: "Schaff Trend Cycle",
  [QStick]: "QStick",
  [STARC]: "Stoller Average Range Channel",
  [CenterOfGravity]: "Center Of Gravity",
  [CoppockCurve]: "Coppock Curve",
  [ChandeForecastOscillator]: "Chande Forecast Oscillator",
  [GopalakrishnanRangeIndex]: "Gopalakrishnan Range Index",
  [IntradayMomentumIndex]: "Intraday Momentum Index",
  [KlingerVolumeOscillator]: "Klinger Volume Oscillator",
  [PrettyGoodOscillator]: "Pretty Good Oscillator",
  [RAVI]: "RAVI",
  [RandomWalkIndex]: "Random Walk Index",
  [TwiggsMoneyFlow]: "Twiggs Money Flow",
  [IchimokuCloud]: "Ichimoku Cloud",
  [DBox]: "Darvas Box",
  [McGinleysDynamic]: "McGinleys Dynamic",
  [SuperTrendOscillator]: "Supertrend Oscillator",
  [VolumeWeightedAveragePrice]: "Volume Weighted Average Price",
  [PivotPoints]: "Pivot Points",
  [Unknown]: ""
};

export const indicatorVisiblity = {
  [SimpleMovingAverage]: true,
  [ExponentialMovingAverage]: true,
  [TimeSeriesMovingAverage]: true,
  [TriangularMovingAverage]: true,
  [VariableMovingAverage]: true,
  [VIDYA]: true,
  [WellesWilderSmoothing]: true,
  [WeightedMovingAverage]: true,
  [WilliamsPctR]: true,
  [WilliamsAccumulationDistribution]: true,
  [VolumeOscillator]: true,
  [VerticalHorizontalFilter]: true,
  [UltimateOscillator]: true,
  [TrueRange]: true,
  [AverageTrueRange]: true,
  [TRIX]: true,
  [RainbowOscillator]: true,
  [PriceOscillator]: true,
  [ParabolicSAR]: true,
  [MomentumOscillator]: true,
  [MACD]: true,
  [EaseOfMovement]: true,
  [DirectionalMovementSystem]: true,
  [DetrendedPriceOscillator]: true,
  [ChandeMomentumOscillator]: true,
  [ChaikinVolatility]: true,
  [Aroon]: true,
  [AroonOscillator]: true,
  [LinearRegressionRSquared]: true,
  [LinearRegressionForecast]: true,
  [LinearRegressionSlope]: true,
  [LinearRegressionIntercept]: true,
  [PriceVolumeTrend]: true,
  [PerformanceIndex]: true,
  [CommodityChannelIndex]: true,
  [ChaikinMoneyFlow]: true,
  [WeightedClose]: true,
  [VolumeROC]: true,
  [TypicalPrice]: true,
  [StandardDeviation]: true,
  [PriceROC]: true,
  [MedianPrice]: true,
  [HighMinusLow]: true,
  [BollingerBands]: true,
  [FractalChaosBands]: true,
  [HighLowBands]: true,
  [MovingAverageEnvelope]: true,
  [SwingIndex]: true,
  [AccumulativeSwingIndex]: true,
  [ComparativeRelativeStrength]: true,
  [MassIndex]: true,
  [MoneyFlowIndex]: true,
  [NegativeVolumeIndex]: true,
  [OnBalanceVolume]: true,
  [PositiveVolumeIndex]: true,
  [RelativeStrengthIndex]: true,
  [TradeVolumeIndex]: true,
  [StochasticOscillator]: true,
  [StochasticMomentumIndex]: true,
  [FractalChaosOscillator]: true,
  [PrimeNumberOscillator]: true,
  [PrimeNumberBands]: true,
  [HistoricalVolatility]: true,
  [MACDHistogram]: true,
  [HHV]: true,
  [LLV]: true,
  [TimeSeriesForecast]: true,
  [ElderRay]: true,
  [ElderForceIndex]: true,
  [ElderThermometer]: true,
  [EhlerFisherTransform]: true,
  [KeltnerChannel]: true,
  [MarketFacilitationIndex]: true,
  [SchaffTrendCycle]: true,
  [QStick]: true,
  [STARC]: true,
  [CenterOfGravity]: true,
  [CoppockCurve]: true,
  [ChandeForecastOscillator]: true,
  [GopalakrishnanRangeIndex]: true,
  [IntradayMomentumIndex]: true,
  [KlingerVolumeOscillator]: true,
  [PrettyGoodOscillator]: true,
  [RAVI]: true,
  [RandomWalkIndex]: true,
  [TwiggsMoneyFlow]: true,
  [IchimokuCloud]: true,
  [DBox]: true,
  [McGinleysDynamic]: true,
  [SuperTrendOscillator]: true,
  [Volume]: true,
  [ColoredVolume]: true,
  [VolumeWeightedAveragePrice]: true,
  [PivotPoints]: true,
  [Unknown]: false
};

export function indicatorToString(indicator: number): string {
  if (!indicatorName[indicator]) {
    return null;
  }

  return indicatorName[indicator];
}

export function getIndicatorAliasName(indicator: number): string {
  if (!indicatorAlias[indicator]) {
    return null;
  }

  return indicatorAlias[indicator];
}

export type indicatorNameI = string;
export interface indicatorsI {
  [indicatorId: number]: indicatorNameI;
}
export interface indicatorsVisiblityI {
  [indicatorId: number]: boolean;
}

/**
 * @description To update the indicator name pass an object having
 * indicator id as key and indicator name as value
 * @example { 89: "McGinleys Dynamic new name",88:"Dbox"}
 * @param indicators
 */

export function updateIndicatorNames(indicators: indicatorsI): indicatorsI {
  if (typeof indicators === "object") {
    $.extend(indicatorName, indicators);
    return indicatorName;
  }
  throw new TypeError(
    `Expected Object having indicator id as key and indicator name as value to update indicator names.
       example: { 89: "NEW NAME HERE", 88:"Dbox"} `
  );
}

/**
 * @description To update the indicator's visiblity pass an object having
 * indicator id as key and indicator visiblity as value
 * @example { 89: true,88:false}
 * @param indicators
 */
export function updateIndicatorVisiblity(
  indicators: indicatorsVisiblityI
): indicatorsVisiblityI {
  if (typeof indicators === "object") {
    $.extend(indicatorVisiblity, indicators);
    return indicatorVisiblity;
  }
  throw new TypeError(
    `Expected Object having indicator id as key and indicator visiblity as value to update indicator visiblity.
       example: { 89: true, 88: false} `
  );
}

export function updateIndicatorAlias(indicators: indicatorsI): indicatorsI {
  if (typeof indicators === "object") {
    $.extend(indicatorAlias, indicators);
    return indicatorAlias;
  }
  throw new TypeError(
    `Expected Object having indicator id as key and indicator alias as value to update indicator alias.
       example: { 89: 'MGD', 88: 'DBOX'} `
  );
}
