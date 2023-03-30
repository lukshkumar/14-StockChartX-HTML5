import { IDrawingDefaults } from "../index";
import { IFibonacciLevel } from "../index";

export const FibonacciLevelTextHorPosition = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right"
};

export const FibonacciLevelTextVerPosition = {
  TOP: "top",
  MIDDLE: "middle",
  BOTTOM: "bottom"
};

export const FibonacciLevelLineExtension = {
  NONE: "none",
  LEFT: "left",
  RIGHT: "right",
  TOP: "top",
  BOTTOM: "bottom",
  BOTH: "both"
};

export const DrawingCursorClass = {
  CREATE: "scxDrawingCreate",
  MOVE: "scxDrawingMove",
  RESIZE: "scxDrawingResize",
  RESIZE_EW: "scxDrawingResizeEW",
  RESIZE_NS: "scxDrawingResizeNS",
  RESIZE_NESW: "scxDrawingResizeNESW",
  RESIZE_NWSE: "scxDrawingResizeNWSE"
};
export const MagnetMode = {
  NONE: "none",
  ALWAYS: "always",
  NEAR: "near"
};
export const MagnetPoint = {
  BAR: "bar",
  HIGH: "high",
  LOW: "low",
  OPEN: "open",
  CLOSE: "close"
};

export const DrawingClassNames = {
  LineSegmentDrawing: "lineSegment",
  HorizontalLineDrawing: "horizontalLine",
  VerticalLineDrawing: "verticalLine",
  TrendChannelDrawing: "trendChannel",
  ErrorChannelDrawing: "errorChannel",
  TironeLevelsDrawing: "tironeLevels",
  QuadrantLinesDrawing: "quadrantLines",
  RaffRegressionDrawing: "raffRegression",
  SpeedLinesDrawing: "speedLines",
  GannFanDrawing: "gannFan",
  PolylineDrawing: "polyline",
  AndrewsPitchforkDrawing: "andrewsPitchfork",
  CyclicLinesDrawing: "cyclicLines",
  RectangleDrawing: "rectangle",
  TriangleDrawing: "triangle",
  CircleDrawing: "circle",
  EllipseDrawing: "ellipse",
  PolygonDrawing: "polygon",
  MeasureDrawing: "measure",
  FreeHandDrawing: "freeHand",
  TrendAngleDrawing: "trendAngle",
  FibonacciEllipsesDrawing: "fibonacciEllipses",
  FibonacciArcsDrawing: "fibonacciArcs",
  FibonacciRetracementsDrawing: "fibonacciRetracements",
  FibonacciFanDrawing: "fibonacciFan",
  FibonacciExtensionsDrawing: "fibonacciExtensions",
  FibonacciTimeZonesDrawing: "fibonacciTimeZones",
  NoteDrawing: "note",
  ImageDrawing: "image",
  TextDrawing: "text",
  BalloonDrawing: "balloon",
  DotDrawing: "dot",
  SquareDrawing: "square",
  DiamondDrawing: "diamond",
  ArrowUpDrawing: "arrowUp",
  ArrowDownDrawing: "arrowDown",
  ArrowLeftDrawing: "arrowLeft",
  ArrowRightDrawing: "arrowRight",
  Arrow: "arrow"
};

export const DrawingDefaults = {
  FibonacciDrawingBase: {
    createPointBehavior: null,
    levels: [
      { value: 0.382 },
      { value: 0.5 },
      { value: 0.618 },
      { value: 1.0 }
    ],
    showTrendLine: true,
    showLevelLines: true,
    showLevelBackgrounds: true,
    showLevelValues: true,
    showLevelPrices: true,
    showLevelPercents: true,
    levelTextHorPosition: FibonacciLevelTextHorPosition.RIGHT,
    levelTextVerPosition: FibonacciLevelTextVerPosition.BOTTOM
  },
  FibonacciArcsDrawing: {
    createPointBehavior: null,
    levels: [
      { value: 0.382 },
      { value: 0.5 },
      { value: 0.618 },
      { value: 1.0 }
    ],
    showTrendLine: true,
    showLevelLines: true,
    showLevelBackgrounds: true,
    showLevelValues: true,
    showLevelPrices: true,
    showLevelPercents: true,
    levelTextHorPosition: FibonacciLevelTextHorPosition.RIGHT,
    levelTextVerPosition: FibonacciLevelTextVerPosition.BOTTOM
  },
  FibonacciEllipsesDrawing: {
    createPointBehavior: null,
    levels: [
      { value: 0.382 },
      { value: 0.5 },
      { value: 0.618 },
      { value: 1.0 }
    ],
    showTrendLine: true,
    showLevelLines: true,
    showLevelBackgrounds: true,
    showLevelValues: true,
    showLevelPrices: true,
    showLevelPercents: true,
    levelTextHorPosition: FibonacciLevelTextHorPosition.RIGHT,
    levelTextVerPosition: FibonacciLevelTextVerPosition.BOTTOM
  },
  FibonacciRetracementsDrawing: {
    levels: [
      { value: 0 },
      { value: 0.2361 },
      { value: 0.382 },
      { value: 0.5 },
      { value: 0.618 },
      { value: 0.764 },
      { value: 1.0 }
    ],
    reverse: false,
    levelTextVerPosition: FibonacciLevelTextVerPosition.MIDDLE,
    levelLinesExtension: FibonacciLevelLineExtension.NONE
  },
  FibonacciFanDrawing: {
    levels: [{ value: 0.382 }, { value: 0.5 }, { value: 0.618 }],
    levelTextVerPosition: FibonacciLevelTextVerPosition.MIDDLE
  },
  FibonacciExtensionsDrawing: {
    levels: [
      { value: 0 },
      { value: 0.2361 },
      { value: 0.382 },
      { value: 0.5 },
      { value: 0.618 },
      { value: 0.764 },
      { value: 1.0 },
      { value: 1.618 },
      { value: 2.618 },
      { value: 3.618 },
      { value: 4.236 }
    ],
    reverse: false,
    levelTextVerPosition: FibonacciLevelTextVerPosition.MIDDLE,
    levelLinesExtension: FibonacciLevelLineExtension.NONE
  },
  FibonacciTimeZonesDrawing: {
    levels: [
      { value: 0 },
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 5 },
      { value: 8 },
      { value: 13 },
      { value: 21 },
      { value: 34 },
      { value: 55 },
      { value: 89 }
    ],
    levelLinesExtension: FibonacciLevelLineExtension.BOTH
  },
  NoteDrawing: {
    label: "N"
  }
};

export interface IFibonacciDrawingBaseDefaults extends IDrawingDefaults {
  levels?: IFibonacciLevel[];
  showTrendLine?: boolean;
  showLevelLines?: boolean;
  showLevelBackgrounds?: boolean;
  showLevelValues?: boolean;
  showLevelPrices?: boolean;
  showLevelPercents?: boolean;
  levelTextHorPosition?: string;
  levelTextVerPosition?: string;
}

/**
 * Drawing events enumeration values.
 * @name DrawingEvent
 * @enum {string}
 * @property {string} LEVELS_CHANGED Levels changed
 * @property {string} SHOW_TREND_LINE_CHANGED Trend line was shown or hidden
 * @property {string} SHOW_LEVEL_LINES_CHANGED Level lines were shown or hidden
 * @property {string} SHOW_LEVEL_BACKGROUNDS_CHANGED Level backgrounds were shown or hidden
 * @property {string} SHOW_LEVEL_VALUES_CHANGED Level values were shown or hidden
 * @property {string} SHOW_LEVEL_PRICES_CHANGED Level prices were shown or hidden
 * @property {string} SHOW_LEVEL_PERCENTS_CHANGED Level percents were shown or hidden
 * @property {string} LEVEL_TEXT_HOR_POSITION_CHANGED Level text horizontal position was changed
 * @property {string} LEVEL_TEXT_VER_POSITION_CHANGED Level text vertical position was changed
 * @property {string} LEVEL_LINES_EXTENSION_CHANGED Level lines extension was enabled or disabled
 * @property {string} REVERSE_CHANGED Fibonacci drawing was reversed
 * @readonly
 * @memberOf StockChartX
 */

export const LEVELS_CHANGED = "drawingLevelsChanged";
export const SHOW_TREND_LINE_CHANGED = "drawingShowTrendLineChanged";
export const SHOW_LEVEL_LINES_CHANGED = "drawingShowLevelLinesChanged";
export const SHOW_LEVEL_BACKGROUNDS_CHANGED =
  "drawingShowLevelBackgroundsChanged";
export const SHOW_LEVEL_VALUES_CHANGED = "drawingShowLevelValuesChanged";
export const SHOW_LEVEL_PRICES_CHANGED = "drawingShowLevelPricesChanged";
export const SHOW_LEVEL_PERCENTS_CHANGED = "drawingShowLevelPercentsChanged";
export const LEVEL_TEXT_HOR_POSITION_CHANGED =
  "drawingLevelTextHorPositionChanged";
export const LEVEL_TEXT_VER_POSITION_CHANGED =
  "drawingLevelTextVerPositionChanged";
export const LEVEL_LINES_EXTENSION_CHANGED =
  "drawingLevelLinesExtensionChanged";
export const REVERSE_CHANGED = "drawingReverseChanged";
