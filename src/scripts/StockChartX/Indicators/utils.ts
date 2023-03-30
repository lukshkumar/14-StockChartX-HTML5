import * as TASdk from "../../TASdk/exporter";
export const VolumeIndicator = TASdk.Volume;
export const ColoredVolumeIndicator = TASdk.ColoredVolume;
export const ZIndexVolume = 29;

export const IndicatorDefaults = {
  bands: () => {
    let indicators;
    // @if SCX_LICENSE = 'lite'
    indicators = [TASdk.BollingerBands];
    // @endif
    // @if SCX_LICENSE = 'full'
    indicators = [
      TASdk.BollingerBands,
      TASdk.MovingAverageEnvelope,
      TASdk.HighLowBands,
      TASdk.FractalChaosBands,
      TASdk.PrimeNumberBands,
      TASdk.KeltnerChannel,
      TASdk.STARC,
      TASdk.DBox,
      TASdk.IchimokuCloud
    ];
    // @endif
    return indicators || [];
  },
  general: () => {
    return [
      // @if SCX_LICENSE = 'full'
      TASdk.HighMinusLow,
      TASdk.MedianPrice,
      TASdk.TypicalPrice,
      TASdk.WeightedClose,
      TASdk.VolumeROC,
      TASdk.PriceROC,
      TASdk.StandardDeviation,
      TASdk.HHV,
      TASdk.LLV,
      TASdk.VolumeWeightedAveragePrice,
      TASdk.PivotPoints,
      ColoredVolumeIndicator,
      // @endif
      VolumeIndicator
    ];
  },
  indices: () => {
    return [
      // @if SCX_LICENSE != 'free'
      TASdk.HistoricalVolatility,
      TASdk.OnBalanceVolume,
      // @endif
      // @if SCX_LICENSE = 'full'
      TASdk.MoneyFlowIndex,
      TASdk.TradeVolumeIndex,
      TASdk.SwingIndex,
      TASdk.AccumulativeSwingIndex,
      TASdk.ComparativeRelativeStrength,
      TASdk.PriceVolumeTrend,
      TASdk.PositiveVolumeIndex,
      TASdk.NegativeVolumeIndex,
      TASdk.PerformanceIndex,
      TASdk.MassIndex,
      TASdk.ChaikinMoneyFlow,
      TASdk.CommodityChannelIndex,
      TASdk.StochasticMomentumIndex,
      TASdk.ElderForceIndex,
      TASdk.ElderThermometer,
      TASdk.MarketFacilitationIndex,
      TASdk.QStick,
      TASdk.GopalakrishnanRangeIndex,
      TASdk.IntradayMomentumIndex,
      TASdk.RAVI,
      TASdk.RandomWalkIndex,
      TASdk.TwiggsMoneyFlow,
      // @endif
      TASdk.RelativeStrengthIndex
    ];
  },
  regressions: () => {
    let indicators;

    // @if SCX_LICENSE = 'full'
    indicators = [
      TASdk.LinearRegressionRSquared,
      TASdk.LinearRegressionForecast,
      TASdk.LinearRegressionSlope,
      TASdk.LinearRegressionIntercept,
      TASdk.TimeSeriesForecast
    ];
    // @endif

    return indicators || [];
  },
  movingAverages: () => {
    return [
      // @if SCX_LICENSE != 'free'
      TASdk.ExponentialMovingAverage,
      // @endif
      // @if SCX_LICENSE = 'full'
      TASdk.TimeSeriesMovingAverage,
      TASdk.VariableMovingAverage,
      TASdk.TriangularMovingAverage,
      TASdk.WeightedMovingAverage,
      TASdk.VIDYA,
      TASdk.WellesWilderSmoothing,
      TASdk.McGinleysDynamic,
      // @endif
      TASdk.SimpleMovingAverage
    ];
  },
  oscillators: () => {
    return [
      // @if SCX_LICENSE != 'free'
      TASdk.Aroon,
      TASdk.MomentumOscillator,
      TASdk.AverageTrueRange,
      // @endif
      // @if SCX_LICENSE = 'full'
      TASdk.ChandeMomentumOscillator,
      TASdk.TRIX,
      TASdk.UltimateOscillator,
      TASdk.VerticalHorizontalFilter,
      TASdk.WilliamsPctR,
      TASdk.WilliamsAccumulationDistribution,
      TASdk.VolumeOscillator,
      TASdk.ChaikinVolatility,
      TASdk.StochasticOscillator,
      TASdk.PriceOscillator,
      TASdk.MACDHistogram,
      TASdk.EaseOfMovement,
      TASdk.DetrendedPriceOscillator,
      TASdk.ParabolicSAR,
      TASdk.DirectionalMovementSystem,
      TASdk.TrueRange,
      TASdk.AroonOscillator,
      TASdk.RainbowOscillator,
      TASdk.FractalChaosOscillator,
      TASdk.PrimeNumberOscillator,
      TASdk.ElderRay,
      TASdk.EhlerFisherTransform,
      TASdk.SchaffTrendCycle,
      TASdk.CenterOfGravity,
      TASdk.CoppockCurve,
      TASdk.ChandeForecastOscillator,
      TASdk.KlingerVolumeOscillator,
      TASdk.PrettyGoodOscillator,
      /* @endif */
      TASdk.MACD,
      TASdk.SuperTrendOscillator
    ];
  }
};
export const IndicatorParam = {
  HISTOGRAM_HIGH_COLOR: "Histogram High Color",
  HISTOGRAM_LOW_COLOR: "Histogram Low Color",
  SOURCE: "Source",
  SOURCE2: "Source 2",
  PERIODS: "Periods",
  STANDARD_DEVIATIONS: "Standard Deviations",
  MA_TYPE: "Moving Average Type",
  SHIFT: "Shift",
  MULTIPLIER: "Multiplier",
  MIN_TICK: "Min Tick Value",
  LIMIT_MOVE: "Limit Move Value",
  PCT_K_PERIODS: "%K Periods",
  PCT_K_SMOOTHING: "%K Smoothing",
  PCT_K_DOUBLE_SMOOTHING: "%K Double Smoothing",
  PCT_D_PERIODS: "%D Periods",
  PCT_D_MA_TYPE: "%D Moving Average Type",
  BAR_HISTORY: "Bar History",
  R2_SCALE: "R2 Scale",
  CYCLE_1: "Cycle 1",
  CYCLE_2: "Cycle 2",
  CYCLE_3: "Cycle 3",
  SHORT_TERM: "Short Term",
  LONG_TERM: "Long Term",
  POINTS_OR_PERCENT: "Points or Percent",
  RATE_OF_CHANGE: "Rate of Change",
  SHORT_CYCLE: "Short Cycle",
  LONG_CYCLE: "Long Cycle",
  SIGNAL_PERIODS: "Signal Periods",
  MIN_AF: "Min AF",
  MAX_AF: "Max AF",
  LEVELS: "Levels",
  LINE_WIDTH: "Line Width",
  LINE_STYLE: "Line Style",
  LINE_COLOR: "Line Color",
  LINE2_WIDTH: "Line 2 Width",
  LINE2_STYLE: "Line 2 Style",
  LINE2_COLOR: "Line 2 Color",
  LINE3_WIDTH: "Line 3 Width",
  LINE3_STYLE: "Line 3 Style",
  LINE3_COLOR: "Line 3 Color",
  DURATION: "duration"
};
Object.freeze(IndicatorParam);
export const Class = {
  TITLE_CAPTION: "scxPanelTitleCaption",
  TITLE_ICON: "scxPanelTitleIcon",
  TITLE_REMOVE_ICON: "scxIndicatorRemoveIcon",
  TITLE_VALUE: "scxPanelTitleValue",
  TITLE_HIDE: "scxIndicatorCollapseHide",
  TITLE_SHOW: "scxIndicatorCollapseShow",
  TITLE: "scxIndicatorTitle"
};
