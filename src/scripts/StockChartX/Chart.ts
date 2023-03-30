/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { TAIndicator } from "./index";
import { LocalChartStateHandler } from "./index";
import { ChartPoint, IChartPoint } from "./index";
import { PanelState } from "./index";
import { HtmlContainer } from "../StockChartX.UI/index";
import { IWindowEvent } from "./index";
import { HtmlUtil,StockSymbol } from "./index";
import {
  SmartPriceStyleHandler,
  ISmartPriceStyleHandler
} from "./index";
import { ChartPanelSplitter } from "./index";
import { ZoomInView, ZoomInMode } from "./index";
import { SaveImageHandler } from "./index";
import { ChartNavigation } from "../StockChartX.UI/index";
import { Animation } from "./index";
import { ChartPanel } from "./index";
import { WindowMode } from "./index";
import { SelectionMarker } from "./index";
import { IChartPanelObject } from "./index";
import { WindowModeHandler } from "./index";
import { HighlightedColumnHandler } from "./index";
import { SpreadHandler } from "./index";
import { CandlePriceStyle } from "./index";
import { BreakLinesHandler } from "./index";
import { CrossHair } from "./index";
import { IPriceStyle, PriceStyle } from "./index";
import { IDateMarker, DateMarker } from "./index";
import { IValueMarker, ValueMarker } from "./index";

import { Localization } from "./index";
import { IBarDataSeries, IBar } from "./index";
import { EventableObject } from "./index";
import { Toolbar } from "../StockChartX.UI/index";
import { IWaitingBarConfig } from "../StockChartX.UI/index";
import { Scrollbar } from "../StockChartX.UI/index";
import { IDatafeed, Datafeed } from "./index";
import { IPoint } from "./index";
import { TimeSpan, ITimeFrame } from "./index";
import { IChartStateHandler } from "./index";
import { IDestroyable } from "./index";
import { DateScale } from "./index";
import { ValueScale } from "./index";
import { Drawing } from "./index";
import { DrawingCursorClass } from "./Drawings/utils";
import { ChartPanelsContainer } from "./index";
import { RequestKind, IBarsRequest } from "./index";
import { Rect, ISize } from "./index";
import { DataManager } from "./index";
import { Indicator } from "./index";
import { ScaleKind } from "./index";
import { Theme } from "./index";
import { KeyboardHandler } from "./index";
import { JsUtil } from "./index";
import { DataSeries, DataSeriesSuffix } from "./index";
import { ChartEvent } from "./index";
import {
  ChartState,
  IIndicatorOptions,
  CompareSymbol
} from "./index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

/**
 * The event handler callback.
 * @callback IEventHandler
 * @param {Object} event The event object.
 * @memberOf StockChartX
 */

/**
 * The save image callback function.
 * @callback CanvasImageCallback
 * @param {HTMLCanvasElement} canvas The rendering canvas.
 * @memberOf StockChartX
 */

/**
 * The css-size structure.
 * @typedef {} StockChartX~CssSize
 * @type {Object}
 * @property {number | string} width The width.
 * @property {number | string} height The height.
 * @memberOf StockChartX
 * @example
 * chart.cssSize = {
 *  width: '75%',
 *  height: 20
 * };
 */

/**
 * The instrument structure.
 * @typedef {} Instrument
 * @type {object}
 * @property {string} symbol The symbol name. E.g. 'AAPL'.
 * @property {string} [company] The company name. E.g. 'Apple Inc.'.
 * @property {string} [exchange] The exchange. E.g. 'NSDQ'.
 * @property {number} [tickSize] The tick size value.
 * @memberOf StockChartX
 */

// tslint:disable-next-line:interface-name
export interface JQueryEventObject {
  toElement: HTMLElement;
  data: any;
  originalEvent: any;
  pageX: any;
  pageY: any;
  currentTarget: any;
  type: any;
  stopPropagation: any;
  preventDefault: any;
}

"use strict";

export interface IInstrument {
  symbol: string;
  company?: string;
  exchange?: string;
  tickSize?: number;
  type?: string;
}

export interface IChartConfig {
  datafeed?: IDatafeed;
  barsCount?: number;
  container?: JQuery;
  width?: number;
  height?: number;
  timeInterval?: number;
  timeFrame?: ITimeFrame;
  theme?: any;
  instrument?: IInstrument;
  priceStyle?: string;
  crossHair?: string;
  showToolbar?: boolean;
  showNavigation?: boolean;
  showScrollbar?: boolean;
  fullWindowMode?: boolean;
  onToolbarLoaded?: any;
  onScrollbarLoaded?: any;
  autoSave?: boolean;
  stateHandler?: IChartStateHandler;
  valueScaleKind?: string;
}

export interface IChartOptions {
  locale: string;
  enableKeyboardEvents: boolean;
  enableMouseEvents: boolean;
  scrollEnabled: boolean;
  zoomEnabled: boolean;
  theme: any;
  showBarInfoInTitle: boolean;
  showInstrumentWatermark: boolean;
  priceStyle: string;
  xGridVisible: boolean;
  yGridVisible: boolean;
  valueScaleKind: string;
}

export type ICanvasImageCallback = (canvas: HTMLCanvasElement) => void;

export interface ICssSize {
  width: number | string;
  height: number | string;
}

const $ = window.jQuery;
const clonedDrawingOffset: IPoint = { x: 30, y: 0 };

/**
 * Path to the folder which contains UI views (dialogs, menus, etc.).
 * @type {string}
 * @default 'view/'
 */
export let ViewsPath = "view/";

export let getAllInstruments = (): IInstrument[] => [];

const DEFAULT_WIDTH = "100%";
const DEFAULT_HEIGHT = "100%";
const Class = {
  ROOT_CONTAINER: "scxRootContainer",
  CONTAINER: "scxContainer",
  BACKGROUND: "scxBackground",
  UN_SELECTIVE: "scxUnSelective",
  LOGO: "scxLogo",
  THEME: "scxTheme"
};
const DEFAULT_TIME_INTERVAL = TimeSpan.MILLISECONDS_IN_MINUTE;
const DEFAULT_BARS_COUNT = 500;
const EventSuffix = ".scxChart";
const LOCALIZE_EVENT = "localize";
export const version = "2.25.5";

/**
 * Describes chart component.
 * @param {Object} config              The configuration object.
 * @param {String} config.container    The jQuery selector of html element to hold the chart.
 * @param {Number} [config.width]        The width of chart.
 * @param {Number} [config.height]       The height of chart.
 * @param {Number} [config.timeInterval] The bars time interval in milliseconds. See {@link StockChartX.TimeSpan} for predefined values.
 * @param {Object} [config.theme] The theme.
 * @param {StockChartX.Instrument} [config.instrument] The instrument.
 * @param {String} [config.priceStyle] The price style.
 * @param {String} [config.crossHair] The cross hair.
 * @param {Boolean} [config.showToolbar = true] Toolbar will be visible if true.
 * @param {Boolean} [config.showNavigation = true] Navigation bar will be visible if true.
 * @param {Boolean} [config.fullWindowMode = false] Tha chart will be ran in full window mode if true.
 * @constructor StockChartX.Chart
 * @example <caption>Add div element into the html.</caption>
 *  <div id="chartContainer"></div>
 * @example <caption>Instantiate chart object.</caption>
 *  var chart = new StockChartX.Chart({
 *      container: '#chartContainer',
 *      width: 800,
 *      height: 600
 *  });
 *
 *  @example <caption>Also it is possible to use it as jQuery plugin.</caption>
 *  var chart = $('#chartContainer').StockChartX({
 *      width: 800,
 *      height: 600
 *  });
 */
export class Chart extends EventableObject implements IDestroyable {
  public timeFrame;
  /**
   * Gets chart version.
   * @name version
   * @type {string}
   * @readonly
   * @memberOf StockChartX.Chart
   * @deprecated since version 2.15.5
   * @see {@linkcode StockChartX.version}
   */
  static get version(): string {
    return version;
  }

  /**
   * @internal
   */
  private _copyBuffer: Drawing;

  /**
   * @internal
   */
  private _container: JQuery;
  /**
   * The chart's parent container.
   * @name container
   * @type {jQuery}
   * @readonly
   * @memberOf StockChartX.Chart#
   */
  get container(): JQuery {
    return this._container;
  }

  /**
   * @internal
   */
  private _rootDiv: JQuery;
  get rootDiv(): JQuery {
    return this._rootDiv;
  }

  /**
   * @internal
   */
  private _dateScale: DateScale;
  /**
   * The date scale.
   * @name dateScale
   * @type {StockChartX.DateScale}
   * @readonly
   * @memberOf StockChartX.Chart#
   */
  get dateScale(): DateScale {
    return this._dateScale;
  }

  /**
   * @internal
   */
  private _valueScales: ValueScale[] = [];
  get valueScales(): ValueScale[] {
    return this._valueScales;
  }

  /**
   * The value scale.
   * @name valueScale
   * @type {StockChartX.ValueScale}
   * @readonly
   * @memberOf StockChartX.Chart#
   */
  get valueScale(): ValueScale {
    return this._valueScales[0];
  }

  /**
   * @internal
   */
  private _chartPanelsContainer: ChartPanelsContainer;
  /**
   * The chart panels container.
   * @name chartPanelsContainer
   * @type {StockChartX.ChartPanelsContainer}
   * @readonly
   * @memberOf StockChartX.Chart#
   */
  get chartPanelsContainer(): ChartPanelsContainer {
    return this._chartPanelsContainer;
  }

  /**
   * @internal
   */
  private _dataManager: DataManager;
  /**
   * The data manager (manages data series).
   * @name dataManager
   * @type {StockChartX.DataManager}
   * @readonly
   * @memberOf StockChartX.Chart#
   */
  get dataManager(): DataManager {
    return this._dataManager;
  }

  /**
   * @internal
   */
  private _timeInterval: number;
  /**
   * The bars time interval in milliseconds.
   * @name timeInterval
   * @returns {Number}
   * @see {@linkcode StockChartX.TimeSpan}
   * @memberOf StockChartX.Chart#
   * @example
   *  chart.timeInterval = StockChartX.TimeSpan.MILLISECONDS_IN_DAY;      // set 1 day time interval
   *  chart.timeInterval = StockChartX.TimeSpan.MILLISECONDS_IN_HOUR * 4; // set 4 hours time interval
   */
  get timeInterval(): number {
    return this._timeInterval;
  }
  set timeInterval(value: number) {
    let interval = parseInt(<string>(<any>value), 10),
      oldInterval = this._timeInterval;

    if (oldInterval !== interval) {
      if (!isFinite(interval) || interval <= 0)
        throw new Error("Time interval must be greater than 0.");

      this._timeInterval = interval;
      this.fireValueChanged(
        ChartEvent.TIME_INTERVAL_CHANGED,
        interval,
        oldInterval
      );
    }
  }

  /**
   * @internal
   */
  private _chartPanelsFrame: Rect = new Rect();
  get chartPanelsFrame(): Rect {
    return this._chartPanelsFrame;
  }

  /**
   * @internal
   */
  private _instrument: IInstrument;
  /**
   * The instrument.
   * @name instrument
   * @type {StockChartX.Instrument}
   * @memberOf StockChartX.Chart#
   * @example
   *  chart.instrument = {
   *      symbol: 'GOOG',
   *      company: 'Google Inc.'
   *      exchange: 'NSDQ'
   *  };
   */
  get instrument(): IInstrument {
    return this._instrument;
  }
  set instrument(value: IInstrument) {
    let oldInstrument = this._instrument;
    if (oldInstrument !== value) {
      this._instrument = value;

      this._newBarsRequest = {
        kind: RequestKind.BARS,
        count: DEFAULT_BARS_COUNT
      };
      this.fireValueChanged(
        ChartEvent.INSTRUMENT_CHANGED,
        value,
        oldInstrument
      );
    }
  }

  /**
   * @internal
   */
  private _indicators: Indicator[] = [];
  /**
   * The array of chart indicators.
   * @name indicators
   * @type {StockChartX.Indicator[]}
   * @readonly
   * @memberOf StockChartX.Chart#
   */
  get indicators(): Indicator[] {
    return this._indicators;
  }

  /**
   * @internal
   */
  private _valueMarker: IValueMarker;
  get valueMarker(): IValueMarker {
    return this._valueMarker;
  }

  /**
   * @internal
   */
  private _dateMarker: IDateMarker;
  get dateMarker(): IDateMarker {
    return this._dateMarker;
  }

  /**
   * @internal
   */
  private _options: IChartOptions = <IChartOptions>{};
  /**
   * The locale string (e.g. 'en-US').
   * @name locale
   * @type {string}
   * @default 'en-US'
   * @memberOf StockChartX.Chart#
   * @example
   *  chart.locale = 'uk-UA';
   */
  get locale(): string {
    return this._options.locale;
  }
  set locale(value: string) {
    let oldLocale = this._options.locale;
    if (oldLocale !== value) {
      this._options.locale = value;
      this.localize();

      this.fireValueChanged(ChartEvent.LOCALE_CHANGED, value, oldLocale);
    }
  }

  /**
   * The flag that indicates whether keyboard events should be processed.
   * @name keyboardEventsEnabled
   * @type {boolean}
   * @default true
   * @memberOf StockChartX.Chart#
   * @example
   *  chart.keyboardEventsEnabled = true;     // enable keyboard events
   *  chart.keyboardEventsEnabled = false;    // disable keyboard events.
   */
  get keyboardEventsEnabled(): boolean {
    return this._options.enableKeyboardEvents;
  }
  set keyboardEventsEnabled(value: boolean) {
    this._options.enableKeyboardEvents = value;
    this.fireValueChanged(
      ChartEvent.ENABLE_KEYBOARD_EVENTS_CHANGED,
      this._options.enableKeyboardEvents
    );
  }

  /**
   * The flag that indicates whether mouse events should be processed.
   * @name mouseEventsEnabled
   * @type {boolean}
   * @default true
   * @memberOf StockChartX.Chart#
   * @example
   *  chart.mouseEventsEnabled = true;     // enable mouse events
   *  chart.mouseEventsEnabled = false;    // disable mouse events.
   */
  get mouseEventsEnabled(): boolean {
    return this._options.enableMouseEvents;
  }
  set mouseEventsEnabled(value: boolean) {
    this._options.enableMouseEvents = value;
    this.fireValueChanged(
      ChartEvent.ENABLE_MOUSE_EVENTS_CHANGED,
      this._options.enableMouseEvents
    );
  }

  /**
   * The flag that indicates whether scrolling is enabled.
   * @name scrollEnabled
   * @type {boolean}
   * @memberOf StockChartX.Chart#
   * @since 2.16.1
   */
  get scrollEnabled(): boolean {
    return this._options.scrollEnabled;
  }
  set scrollEnabled(value: boolean) {
    this._options.scrollEnabled = value;
  }

  /**
   * The flag that indicates whether zooming is enabled.
   * @name zoomEnabled
   * @type {boolean}
   * @memberOf StockChartX.Chart#
   * @since 2.16.1
   */
  get zoomEnabled(): boolean {
    return this._options.zoomEnabled;
  }
  set zoomEnabled(value: boolean) {
    this._options.zoomEnabled = value;
  }

  /**
   * ScaleKind of the ValueScale.
   * @name valueScaleKind
   * @type {string}
   * @memberOf StockChartX.Chart#
   * @since 2.19.1
   */
  get valueScaleKind(): string {
    return this._options.valueScaleKind;
  }
  set valueScaleKind(value: string) {
    if (value && Object.values(ScaleKind).includes(value)) {
      this._options.valueScaleKind = value;
    } else {
      this._options.valueScaleKind = ScaleKind.LINEAR;
    }
  }

  /**
   * The chart theme.
   * @name theme
   * @type {Object}
   * @memberOf StockChartX.Chart#
   */
  get theme(): any {
    return this._options.theme;
  }
  set theme(value: any) {
    let oldTheme = this._options.theme;
    this._options.theme = value;
    if (oldTheme) $("body").removeClass(Class.THEME + oldTheme.name);

    if (value && value.name && !Theme[value.name]) Theme[value.name] = value;
    this.applyTheme();
    this.updateIndicators();
    this.fireValueChanged(ChartEvent.THEME_CHANGED, value, oldTheme);
  }

  get showBarInfoInTitle(): boolean {
    return this._options.showBarInfoInTitle;
  }
  set showBarInfoInTitle(value: boolean) {
    this._options.showBarInfoInTitle = value;
  }

  /**
   * The flag that indicates whether instrument watermark should be visible.
   * @name showInstrumentWatermark
   * @type {boolean}
   * @memberOf StockChartX.Chart#
   * @since 2.16.1
   */
  get showInstrumentWatermark(): boolean {
    return this._options.showInstrumentWatermark;
  }
  set showInstrumentWatermark(value: boolean) {
    let oldValue = this.showInstrumentWatermark;
    if (value !== oldValue) {
      this._options.showInstrumentWatermark = value;
      this.fireValueChanged(
        ChartEvent.SHOW_INSTRUMENT_WATERMARK_CHANGED,
        value,
        oldValue
      );
    }
  }

  /**
   * @internal
   */
  private _priceStyle: IPriceStyle;
  /**
   * The price style.
   * @name priceStyle
   * @type {StockChartX.PriceStyle}
   * @see {@linkcode StockChartX.PriceStyle}
   * @memberOf StockChartX.Chart#
   * @example
   *  chart.priceStyle = StockChartX.PriceStyle.BAR; // set 'bars' price style.
   */
  get priceStyle(): IPriceStyle {
    return this._priceStyle;
  }
  set priceStyle(value: IPriceStyle) {
    let oldPriceStyle = this.priceStyle;
    if (oldPriceStyle !== value) {
      let dateRange = this.dateRange();

      this._priceStyle.destroy();

      value.chart = this;
      this._priceStyle = value;
      this._priceStyle.apply();

      let dateScale = this.dateScale,
        projection = dateScale.projection,
        firstRecord = projection.recordByX(
          projection.xByDate(dateRange.startDate, false),
          false
        ),
        lastRecord = projection.recordByX(
          projection.xByDate(dateRange.endDate, false),
          false
        ),
        smartPriceStyleHandler = this.smartPriceStyleHandler,
        smartPriceStyleHandlerEnable =
          smartPriceStyleHandler && smartPriceStyleHandler.enabled;

      if (!smartPriceStyleHandlerEnable)
        if (
          !dateScale.canSetVisibleRecord(firstRecord) ||
          !dateScale.canSetVisibleRecord(lastRecord)
        ) {
          this.setNeedsAutoScaleAll();
        } else {
          this.firstVisibleRecord = firstRecord;
          this.lastVisibleRecord = lastRecord - 1;

          // this._chart.dateRange(dateRange.startDate, dateRange.endDate);
          if (
            this.lastVisibleRecord - this.firstVisibleRecord <
            dateScale.minVisibleRecords
          )
            this.setNeedsAutoScaleAll();
          else this.setNeedsAutoScale();
        }

      this.fireValueChanged(
        ChartEvent.PRICE_STYLE_CHANGED,
        value,
        oldPriceStyle
      );
    }
  }

  get priceStyleKind(): string {
    let priceStyle = this.priceStyle;

    return priceStyle && (<any>priceStyle.constructor).className;
  }

  set priceStyleKind(value: string) {
    let oldPriceStyle = this.priceStyle;
    let newPriceStyle = (this.priceStyle = PriceStyle.create(value));

    if (oldPriceStyle) {
      newPriceStyle.showValueLines = oldPriceStyle.showValueLines;
      newPriceStyle.extendValueLines = oldPriceStyle.extendValueLines;
    }
  }

  /**
   * @internal
   */
  private _hoverRecord: number;
  get hoveredRecord(): number {
    return this._hoverRecord;
  }

  /**
   * @internal
   */
  private _crossHair: CrossHair;
  /**
   * The cross hair object.
   * @name crossHair
   * @type {StockChartX.CrossHair}
   * @readonly
   * @memberOf StockChartX.Chart#
   */
  get crossHair(): CrossHair {
    return this._crossHair;
  }

  /**
   * @internal
   */
  private _sessionBreakLines: BreakLinesHandler;

  /**
   * The break line object.
   * @name break line
   * @type {StockChartX.BreakLinesHandler}
   * @readonly
   * @memberOf StockChartX.Chart#
   */
  get sessionBreakLines(): BreakLinesHandler {
    return this._sessionBreakLines;
  }

  /**
   * @internal
   */
  private _selectedObject;
  /**
   * The currently selected object.
   * @name selectedObject
   * @type {StockChartX.Drawing}
   * @memberOf StockChartX.Chart#
   */
  get selectedObject(): IChartPanelObject {
    return this._selectedObject;
  }
  set selectedObject(value: IChartPanelObject) {
    this._selectedObject = value;
  }

  /**
   * @internal
   */
  private _selectionMarker: SelectionMarker;
  get selectionMarker(): SelectionMarker {
    return this._selectionMarker;
  }

  /**
   * @internal
   */
  private _showDrawings = true;
  /**
   * The flag that indicates whether drawings should be drawn.
   * @name showDrawings
   * @type {boolean}
   * @default true
   * @memberOf StockChartX.Chart#
   */
  get showDrawings(): boolean {
    return this._showDrawings;
  }
  set showDrawings(value: boolean) {
    this._showDrawings = !!value;
  }

  /**
   * @internal
   */
  private _showDrawingTooltips = true;

  get showDrawingTooltips(): boolean {
    return this._showDrawingTooltips;
  }

  set showDrawingTooltips(value: boolean) {
    this._showDrawingTooltips = value;
  }

  /**
   * @internal
   */
  private _stayInDrawingMode: boolean = false;
  /**
   * Drawing Mode
   * @name stayInDrawingMode
   * @type {boolean}
   * @memberOf StockChartX.Chart#
   */
  get stayInDrawingMode(): boolean {
    return this._stayInDrawingMode;
  }

  set stayInDrawingMode(value: boolean) {
    this._stayInDrawingMode = value;
  }

  /**
   * The flag that indicates whether X grid lines are visible.
   * @name xGridVisible
   * @type {boolean}
   * @memberOf StockChartX.Chart#
   * @since 2.16.1
   */
  get xGridVisible(): boolean {
    return this._options.xGridVisible;
  }

  set xGridVisible(value: boolean) {
    this._options.xGridVisible = value;
  }

  /**
   * The flag that indicates whether Y grid lines are visible.
   * @name yGridVisible
   * @type {boolean}
   * @memberOf StockChartX.Chart#
   * @since 2.16.1
   */
  get yGridVisible(): boolean {
    return this._options.yGridVisible;
  }

  set yGridVisible(value: boolean) {
    this._options.yGridVisible = value;
  }

  /**
   * @internal
   */
  private _state = ChartState.NORMAL;
  get state(): number {
    return this._state;
  }
  set state(value: number) {
    let oldState = this._state;

    if (oldState !== value) {
      this._state = value;

      this.fireValueChanged(ChartEvent.STATE_CHANGED, value, oldState);
    }
  }

  /**
   * @internal
   */
  private _windowModeHandler: WindowModeHandler;

  /**
   * Gets window mode handler.
   * @name windowModeHandler
   * @type {StockChartX.WindowModeHandler}
   * @readonly
   * @memberOf StockChartX.Chart#
   */
  get windowModeHandler(): WindowModeHandler {
    return this._windowModeHandler;
  }

  /**
   * Gets current window mode.
   * @name windowMode
   * @type {StockChartX.WindowMode}
   * @readonly
   * @memberOf StockChartX.Chart#
   */
  get windowMode(): WindowMode {
    return this._windowModeHandler.mode;
  }

  /**
   * @internal
   */
  private _keyboardHandler: KeyboardHandler;

  get keyboardHandler(): KeyboardHandler {
    return this._keyboardHandler;
  }

  /**
   * The size of chart.
   * @name size
   * @type {StockChartX~Size}
   * @memberOf StockChartX.Chart#
   */
  get size(): ISize {
    return {
      width: this._rootDiv.width(),
      height: this._rootDiv.height()
    };
  }
  set size(value: ISize) {
    this._container.css("width", "auto").css("height", "auto");
    this._rootDiv.width(value.width).height(value.height);
  }

  /**
   * @internal
   */
  private _cssSize: ICssSize;
  /**
   * The css-size of chart.
   * @name cssSize
   * @type {StockChartX~CssSize}
   * @memberOf StockChartX.Chart#
   */
  get cssSize(): ICssSize {
    return this._cssSize;
  }

  set cssSize(value: ICssSize) {
    this._cssSize = value;

    if (this.windowMode === WindowMode.NORMAL) {
      this._rootDiv.css(this._cssSize);
      this._container.css("width", "").css("height", "");
    }
  }

  /**
   * The main chart panel.
   * @name mainPanel
   * @type {StockChartX.ChartPanel}
   * @readonly
   * @memberOf StockChartX.Chart#
   */
  get mainPanel(): ChartPanel {
    return this._priceStyle.chartPanel || this._chartPanelsContainer.panels[0];
  }

  /**
   * The number of records on the chart.
   * @name recordCount
   * @type {number}
   * @readonly
   * @memberOf StockChartX.Chart#
   */
  get recordCount(): number {
    return this.primaryDataSeries(DataSeriesSuffix.DATE).length;
  }

  /**
   * The first visible record.
   * @name firstVisibleRecord
   * @type {number}
   * @memberOf StockChartX.Chart#
   */
  get firstVisibleRecord(): number {
    return this._dateScale.firstVisibleRecord;
  }
  set firstVisibleRecord(value: number) {
    this._dateScale.firstVisibleRecord = value;
  }

  /**
   * The last visible record.
   * @name lastVisibleRecord
   * @type {number}
   * @memberOf StockChartX.Chart#
   */
  get lastVisibleRecord(): number {
    return this._dateScale.lastVisibleRecord;
  }
  set lastVisibleRecord(value: number) {
    this._dateScale.lastVisibleRecord = value;
  }

  /**
   * Gets index of first visible record.
   * @name firstVisibleIndex
   * @type {number}
   * @readonly
   * @memberOf StockChartX.Chart#
   */
  get firstVisibleIndex(): number {
    return this._dateScale.firstVisibleIndex;
  }

  /**
   * Gets index of last visible record.
   * @name lastVisibleIndex
   * @type {number}
   * @readonly
   * @memberOf StockChartX.Chart#
   */
  get lastVisibleIndex(): number {
    return this._dateScale.lastVisibleIndex;
  }

  /**
   * An array of chart panels.
   * @name chartPanels
   * @type {StockChartX.ChartPanel[]}
   * @readonly
   * @memberOf StockChartX.Chart#
   */
  get chartPanels(): ChartPanel[] {
    return this._chartPanelsContainer.panels;
  }

  private _spread: SpreadHandler;

  get spread(): SpreadHandler {
    return this._spread;
  }

  /**
   * @internal
   */
  private _highlightedColumns: HighlightedColumnHandler;

  get highlightedColumns(): HighlightedColumnHandler {
    return this._highlightedColumns;
  }

  /**
   * The cross hair type.
   * @name crossHairType
   * @type {StockChartX.CrossHairType}
   * @memberOf StockChartX.Chart#
   */
  get crossHairType(): string {
    return this._crossHair.crossHairType;
  }
  set crossHairType(value: string) {
    this._crossHair.crossHairType = value;
  }

  /**
   * @internal
   */
  private _waitingBar: any;

  /**
   * @internal
   */
  private _updateAnimation = new Animation({
    context: this,
    recurring: false,
    callback: this._onUpdateAnimationCallback
  });

  /**
   * @internal
   */
  private _zoomInView: ZoomInView;

  get zoomInView(): ZoomInView {
    return this._zoomInView;
  }

  set zoomInView(value: ZoomInView) {
    this._zoomInView = value;
  }

  /**
   * @internal
   */
  private _datafeed: IDatafeed;

  /**
   * Gets/Sets datafeed.
   * @name datafeed
   * @type {StockChartX.IDatafeed}
   * @memberOf StockChartX.Chart#
   */
  get datafeed(): IDatafeed {
    return this._datafeed;
  }

  set datafeed(value: IDatafeed) {
    this._datafeed = value;
  }

  /**
   * @internal
   */
  private _currentBarsRequest: IBarsRequest;

  /**
   * @internal
   */
  private _newBarsRequest: IBarsRequest;

  /**
   * @internal
   */
  private _navigation: ChartNavigation;

  get navigation(): ChartNavigation {
    return this._navigation;
  }

  /**
   * @internal
   */
  private _toolbar;

  get toolbar() {
    return this._toolbar;
  }

  set toolbar(toolbar: Toolbar) {
    this._toolbar = toolbar;
  }

  /**
   * @internal
   */
  private _scrollbar;

  get scrollbar() {
    return this._scrollbar;
  }

  set scrollbar(scrollbar: Scrollbar) {
    this._scrollbar = scrollbar;
  }

  stateHandler: IChartStateHandler;

  saveImageHandler: SaveImageHandler = new SaveImageHandler();

  /**
   * @internal
   */
  private _smartPriceStyleHandler: ISmartPriceStyleHandler;

  get smartPriceStyleHandler(): ISmartPriceStyleHandler {
    return this._smartPriceStyleHandler;
  }
  /**
   * @internal
   */
  private _compareSymbol: CompareSymbol;

  get compareSymbol(): CompareSymbol {
    return this._compareSymbol;
  }

  set compareSymbol(compareSymbol: CompareSymbol) {
    this.compareSymbol = compareSymbol;
  }

  constructor(config: IChartConfig) {
    super();
    this._initChart(config);
    this._compareSymbol = new CompareSymbol({
      chart: this
    });
  }
  
  /**
   * Adds new Symbol on chart.
   * @name addSymbol
   * @type {StockChartX.StockSymbol}
   * @memberOf StockChartX.Chart#
   * @public
   */
  addSymbol(instrument:IInstrument):StockSymbol {
    return this.compareSymbol.addSymbol(instrument);
  }
  private _initChart(config: IChartConfig) {
    if (typeof config !== "object")
      throw new Error("Config must be an object.");

    if (!config.container) throw new Error("Chart container is not specified.");
    this._container = $(config.container);
    if (this._container.length === 0)
      throw new Error(
        `Unable to find HTML element by selector ${config.container}.`
      );
    this._cssSize = {
      width: config.width || DEFAULT_WIDTH,
      height: config.height || DEFAULT_HEIGHT
    };

    let width = config.width || DEFAULT_WIDTH;
    if (width <= 0) throw new Error("Width must be a positive number.");

    let height = config.height || DEFAULT_HEIGHT;
    if (height <= 0) throw new Error("Height must be a positive number.");

    this.instrument = config.instrument;
    this.timeInterval = config.timeInterval || DEFAULT_TIME_INTERVAL;
    this.valueScaleKind = config.valueScaleKind;
    if (config.datafeed) {
      this._datafeed = config.datafeed;
    }
    this._loadOptionsState(config);

    this._valueMarker = new ValueMarker();
    this._dateMarker = new DateMarker();
    this._selectionMarker = new SelectionMarker({ chart: this });

    this._layoutHtmlElements();
    this.applyTheme();

    this._dataManager = new DataManager();
    this._dataManager.addBarDataSeries();

    this._dateScale = new DateScale({ chart: this });
    this.valueScales.push(new ValueScale({ chart: this }));
    this._chartPanelsContainer = new ChartPanelsContainer({ chart: this });
    this._crossHair = new CrossHair({ chart: this });
    if (config.crossHair != null) {
      this.crossHairType = config.crossHair;
    }
    this._sessionBreakLines = new BreakLinesHandler({ chart: this });
    this._priceStyle = new CandlePriceStyle({ chart: this });
    this._priceStyle.apply();
    if (config.priceStyle != null) {
      this.priceStyleKind = config.priceStyle;
    }
    this._subscribeEvents();

    this._spread = new SpreadHandler({ chart: this });
    this._highlightedColumns = new HighlightedColumnHandler(this);
    this._windowModeHandler = new WindowModeHandler(this);

    this.layout();

    if (config.showToolbar !== false) {
      if (JsUtil.isFunction(config.onToolbarLoaded))
        this.on(ChartEvent.TOOLBAR_LOADED, config.onToolbarLoaded);

      this.toolbar = this._container.scx().toolbar(this);
    }

    if (config.showScrollbar !== false) {
      if (JsUtil.isFunction(config.onScrollbarLoaded))
        this.on(ChartEvent.SCROLLBAR_LOADED, config.onScrollbarLoaded);

      this.scrollbar = this._container.scx().scrollbar(this);
    }

    this._windowModeHandler = new WindowModeHandler(this);
    if (config.fullWindowMode)
      this._windowModeHandler.setMode(WindowMode.FULL_WINDOW);
    this._keyboardHandler = new KeyboardHandler(this);

    this._smartPriceStyleHandler = new SmartPriceStyleHandler(this);

    if (config.showNavigation !== false)
      this._navigation = this._rootDiv.scx().chartNavigation(this);

    this.localize(this._container);

    if (config.stateHandler) {
      this.stateHandler = config.stateHandler;
    } else {
      this.stateHandler = new LocalChartStateHandler({
        chart: this,
        autoSave: config.autoSave === true
      });
    }
    this.sendBarsRequest();
  }
  /**
   * @internal
   */
  private _handleLocalizeEvent(event: JQueryEventObject, target: JQuery): void {
    event.data.localize(target);
  }

  /**
   * @internal
   */
  private _handleWindowResizeEvent(event: JQueryEventObject, target: JQuery) {
    let self = event.data,
      cssSize = self.cssSize;

    if (typeof cssSize.width === "string" || typeof cssSize.height === "string")
      event.data.setNeedsUpdate(true);
  }

  localize(element?: JQuery) {
    Localization.localize(this, element);
  }

  async localizeText(key: string, replace?: object): Promise<string> {
    return Localization.localizeText(this, key, { replace });
  }

  /**
   * Send bars request.
   * @method sendBarsRequest
   * @memberOf StockChartX.Chart#
   */
  sendBarsRequest() {
    let newRequest = this._newBarsRequest;

    if (!this._datafeed || !newRequest) return;

    if (this._currentBarsRequest) {
      this._datafeed.cancel(this._currentBarsRequest);
      this._currentBarsRequest = null;
    }
    if (!newRequest.id) {
      newRequest.id = Datafeed.nextRequestId();
    }
    newRequest.chart = this;
    this._currentBarsRequest = newRequest;
    this._datafeed.send(newRequest);
    this._newBarsRequest = null;
  }

  //   requestMoreBars() {
  //     this._newBarsRequest = {
  //       kind: RequestKind.MORE_BARS,
  //       count: DEFAULT_BARS_COUNT,
  //       endDate: <Date>this._dataManager.dateDataSeries.firstValue
  //     };

  //     this.sendBarsRequest();
  //     this.fireValueChanged(ChartEvent.MORE_HISTORY_REQUESTED);
  //   }

  /**
   * Returns chart bounds rectangle.
   * @method getBounds
   * @returns {StockChartX.Rect}
   * @memberOf StockChartX.Chart#
   */
  getBounds(): Rect {
    return new Rect({
      left: 0,
      top: 0,
      width: this._rootDiv.width(),
      height: this._rootDiv.height()
    });
  }

  /**
   * Selects new chart object. E.g. drawing.
   * @method selectObject
   * @param {StockChartX.Drawing} obj
   * @returns {boolean} True if selection is changed, false otherwise.
   * @memberOf StockChartX.Chart#
   */
  selectObject(obj: Drawing): boolean {
    let oldSelectedObj = this._selectedObject;
    if (!oldSelectedObj && !obj) return false;
    if (oldSelectedObj === obj && obj.selected) return false;

    if (oldSelectedObj) oldSelectedObj.selected = false;
    if (obj) obj.selected = true;
    this.selectedObject = obj;

    this.setNeedsUpdate();

    return true;
  }

  /**
   * Adds new value scale.
   * @method addValueScale
   * @param {StockChartX.ValueScale} [valueScale] The value scale.
   * @returns StockChartX.ValueScale
   * @memberOf StockChartX.Chart#
   */
  addValueScale(valueScale?: ValueScale) {
    let scales = this.valueScales;
    if (valueScale) {
      for (let scale of scales) {
        if (scale === valueScale)
          throw new Error("Value scale has been added already.");
      }
    } else {
      valueScale = new ValueScale({ chart: this });
    }

    scales.push(valueScale);
    this.fireValueChanged(ChartEvent.VALUE_SCALE_ADDED, valueScale);

    return valueScale;
  }

  removeValueScale(valueScale: ValueScale | ValueScale[]) {
    let i;

    if (Array.isArray(valueScale)) {
      for (let scale of valueScale) {
        this.removeValueScale(scale);
      }

      return;
    }

    let scales = this.valueScales;
    for (i = 0; i < scales.length; i++) {
      if (scales[i] === valueScale) {
        if (i === 0) throw new Error("Cannot remove main scale.");

        scales.splice(i, 1);
        this.fireValueChanged(ChartEvent.VALUE_SCALE_REMOVED, i);

        break;
      }
    }
  }

  /**
   * Adds one or more indicators.
   * @method addIndicators
   * @param {number | StockChartX.Indicator | number[] | StockChartX.Indicator[]} indicators The indicator(s) to be added.
   * It can be TA indicator number or StockChartX.Indicator instance.
   * @returns {StockChartX.Indicator|StockChartX.Indicator[]} Added indicators.
   * @memberOf StockChartX.Chart#
   * @see [removeIndicators]{@linkcode StockChartX.Chart#removeIndicators} to remove indicators.
   * @example <caption>Add bollinger bands indicator</caption>
   *  var bollingerBandsIndicator = chart.addIndicators(BollingerBands);
   * @example <caption>Add RSI and Bollinger bands indicators.</caption>
   *  var indicators = chart.addIndicators([RelativeStrengthIndex, BollingerBands]);
   *  @example <caption>Configure and add indicator.</caption>
   *  var rsi = new StockChartX.TAIndicator({taIndicator: RelativeStrengthIndex});
   *  rsi.setParameterValue(StockChartX.IndicatorParam.PERIODS, 20);
   *  chart.addIndicators(rsi);
   */
  addIndicators(
    indicators: number | number[] | Indicator | Indicator[] | IIndicatorOptions,
  ) {
    if (Array.isArray(indicators)) {
      // An array of indicators passed. Add indicators one by one.
      let addedIndicators = [];
      for (let item of indicators)
        addedIndicators.push(this.addIndicators(item));

      return addedIndicators;
    }

    let newIndicator = indicators;

    // Check if it's a TA indicator number.
    if (JsUtil.isNumber(newIndicator)) {
      return this.addIndicators(
        new TAIndicator({ taIndicator: <number>(<any>newIndicator)})
      );
    }

    // Check if it's an indicator object.
    if (newIndicator instanceof Indicator) {
      let chartIndicators = this._indicators;

      // Do nothing if indicator already added.
      for (let item of chartIndicators) {
        if (item === newIndicator) return newIndicator;
      }

      newIndicator.chart = this;
      chartIndicators.push(newIndicator);
      newIndicator.update();

      this.fireValueChanged(ChartEvent.INDICATOR_ADDED, newIndicator);

      return newIndicator;
    }

    // Check
    if (typeof newIndicator === "object") {
      let state = $.extend(true, { chart: this }, newIndicator);

      newIndicator = Indicator.deserialize(state);
      return this.addIndicators(newIndicator);
    }

    throw new TypeError("Unknown indicator.");
  }
  requestMoreBars() {
    this._newBarsRequest = {
      kind: RequestKind.MORE_BARS,
      count: DEFAULT_BARS_COUNT,
      endDate: <Date>this._dataManager.dateDataSeries.firstValue
    };

    this.sendBarsRequest();
    this.fireValueChanged(ChartEvent.MORE_HISTORY_REQUESTED);
  }
  /**
   * Removes one or more indicators.
   * @method removeIndicators
   * @param {StockChartX.Indicator | StockChartX.Indicator[]} [indicators] Indicator(s) to remove.
   * All indicators are removed if omitted.
   * @param {boolean} [removePanelIfNoPlots] The flag that indicates if panel should be removed
   * if there are no plots on it any more. True by default.
   * @memberOf StockChartX.Chart#
   * @see [addIndicators]{@linkcode StockChartX.Chart#addIndicators} to add indicators.
   * @example <caption>Remove all indicators from the chart.</caption>
   * chart.removeIndicators();
   *
   * @example <caption>Remove RSI indicator</caption>
   * // Assume that rsi indicator was added already.
   * // var rsi = chart.addIndicators(RelativeStrengthIndex);
   *
   * chart.removeIndicators(rsi);
   * @example <caption>Remove all indicators</caption>
   * chart.removeIndicators();
   */
  removeIndicators(
    indicators?: Indicator | Indicator[],
    removePanelIfNoPlots?: boolean
  ) {
    if (removePanelIfNoPlots === undefined) removePanelIfNoPlots = true;

    if (Array.isArray(indicators)) {
      // Argument is an array of indicators. Remove indicators one by one.
      for (let item of indicators) {
        if (item) this.removeIndicators(item, removePanelIfNoPlots);
      }

      return;
    }

    let chartIndicators = this._indicators,
      indicator = indicators;

    let removeIndicator = (indicatorToRemove: Indicator) => {
      let panel = indicatorToRemove.chartPanel;
      if (panel) {
        panel.removePlot(indicatorToRemove.plots);

        // Remove panel if there are no plots on it.
        if (
          removePanelIfNoPlots &&
          panel.plots.length === 0 &&
          panel !== this.mainPanel
        )
          this._chartPanelsContainer.removePanel(panel);
      }
      if (indicatorToRemove.getShortName() === "Supertrend Oscillator") {
        panel.removeSelectDrawings(false);
      }

      let isMainPanel = panel === this.mainPanel;
      if (
        (isMainPanel && panel.indicators.length === 0) ||
        (!isMainPanel && panel.indicators.length === 1)
      )
        panel.showIndicatorTitles = true;
      indicatorToRemove.destroy();

      this.fireValueChanged(ChartEvent.INDICATOR_REMOVED, indicatorToRemove);
    };

    for (let i = 0; i < chartIndicators.length; i++) {
      if (indicator) {
        // Indicator is specified. Remove it.
        if (chartIndicators[i] === indicator) {
          chartIndicators.splice(i, 1);
          removeIndicator(<Indicator>indicator);

          break;
        }
      } else {
        // Indicator is not specified. Remove all indicators.
        let item = chartIndicators[i];

        chartIndicators.splice(i, 1);
        removeIndicator(item);
        i--;
      }
    }
  }

  /**
   * Updates all indicators. It needs to be called after data series values are changed.
   * @method updateIndicators
   * @memberOf StockChartX.Chart#
   * @see [addIndicators]{@linkcode StockChartX.Chart#addIndicators} to add indicators.
   * @see [removeIndicators]{@linkcode StockChartX.Chart#removeIndicators} to remove indicators.
   * @example
   *  chart.updateIndicators();
   */
  updateIndicators() {
    for (let indicator of this._indicators) {
      indicator.update();
    }
  }

  /**
   * Saves indicators state.
   * @method saveIndicatorsState
   * @returns {Object[]} An array of indicator states.
   * @memberOf StockChartX.Chart#
   * @see [loadIndicatorsState]{@linkcode StockChartX.Chart#loadIndicatorsState} to load indicators.
   * @example
   *  var state = chart.saveIndicatorsState();
   */
  saveIndicatorsState() {
    let states = [],
      panels = this.chartPanels,
      indicators = this._indicators;

    for (let panel of panels) {
      for (let indicator of indicators) {
        if (indicator.chartPanel === panel) states.push(indicator.serialize());
      }
    }

    return states;
  }

  /**
   * Loads indicators state.
   * @method loadIndicatorsState
   * @param {String | Object} state The indicators state serialized by saveIndicatorsState function.
   * @memberOf StockChartX.Chart#
   * @see [saveIndicatorsState]{@linkcode StockChartX.Chart#saveIndicatorsState} to save indicators.
   * @example <caption>Save and load indicators state</caption
   *  var state = chart.saveIndicatorsState();
   *  chart.loadIndicatorsState(state);
   */
  loadIndicatorsState(state: any) {
    if (typeof state === "string") state = JSON.parse(state);

    this.removeIndicators();
    if (state) this.addIndicators(state);
  }

  /**
   * Saves all drawings.
   * @method saveDrawingsState
   * @returns {Object[]} The array of drawing states.
   * @memberOf StockChartX.Chart#
   * @see [loadDrawingsState]{@linkcode StockChartX.Chart#loadDrawingsState} to load drawings.
   * @example
   *  var state = chart.saveDrawingsState();
   */
  saveDrawingsState() {
    let state = [];

    let panels = this._chartPanelsContainer.panels;
    for (let panel of panels) {
      for (let drawing of panel.drawings) {
        state.push(drawing.saveState());
      }
    }

    return state;
  }

  /**
   * Loads drawings.
   * @method loadDrawingsState
   * @param {String | Object} state The drawings state serialized by saveDrawingsState function.
   * @memberOf StockChartX.Chart#
   * @see [saveDrawingsState]{@linkcode StockChartX.Chart#saveDrawingsState} to save drawings.
   * @example
   *  var state = chart.saveDrawingsState();
   *  chart.loadDrawingsState(state);
   */
  loadDrawingsState(state: any) {
    if (typeof state === "string") state = JSON.parse(state);

    this.removeDrawings();

    if (!state) return;

    let panels = this._chartPanelsContainer.panels;
    for (let stateItem of state) {
      let panel = panels[stateItem.panelIndex];
      if (!panel) continue;
      let drawing = Drawing.deserialize(stateItem);
      if (drawing) panel.addDrawings(drawing);
    }
  }

  /**
   * Removes all drawings.
   * @method removeDrawings
   * @memberOf StockChartX.Chart#
   * @see [saveDrawingsState]{@linkcode StockChartX.Chart#saveDrawingsState} to save drawings.
   * @see [loadDrawingsState]{@linkcode StockChartX.Chart#loadDrawingsState} to load drawings.
   * @example
   *  chart.removeDrawings();
   */
  removeDrawings() {
    for (let panel of this._chartPanelsContainer.panels) {
      panel.removeDrawings();
    }
  }

  /**
   * Saves chart state (including indicators and drawings).
   * @method saveState
   * @returns {Object} The chart state.
   * @memberOf StockChartX.Chart#
   * @see [loadState]{@linkcode StockChartX.Chart#loadState} to load state.
   * @example
   *  var state = chart.saveState();
   */
  saveState(): any {
    let scalesState = [];
    for (let scale of this.valueScales) {
      scalesState.push(scale.saveState());
    }

    return {
      chart: $.extend(true, {}, this._options),
      priceStyle: this._priceStyle.saveState(),
      dateScale: this._dateScale.saveState(),
      valueScales: scalesState,
      crossHair: this._crossHair.saveState(),
      chartPanelsContainer: this._chartPanelsContainer.saveState(),
      indicators: this.saveIndicatorsState(),
      drawings: this.saveDrawingsState()
    };
  }

  /**
   * Loads chart state.
   * @method loadState
   * @param {String | Object} state The chart state serialized by saveState function.
   * @memberOf StockChartX.Chart#
   * @see [saveState]{@linkcode StockChartX.Chart#saveState} to save state.
   * @example
   *  var state = chart.saveState();
   *  chart.loadState(state);
   */
  loadState(state: any) {
    if (typeof state === "string") state = JSON.parse(state);

    state = state || {};

    this.suppressEvents();

    this.removeIndicators();

    this._loadOptionsState(state.chart);
    this._dateScale.loadState(state.dateScale);

    this._restoreValueScales(state);

    this._crossHair.loadState(state.crossHair);
    this._chartPanelsContainer.loadState(state.chartPanelsContainer);
    if (state.priceStyle)
      this._priceStyle = PriceStyle.deserialize(state.priceStyle);
    this._priceStyle.chart = this;
    this._priceStyle.apply(false);
    this.layout();

    this.loadIndicatorsState(state.indicators);
    this.loadDrawingsState(state.drawings);

    this.suppressEvents(false);

    this.theme = this.theme;

    this.fireValueChanged(ChartEvent.STATE_LOADED);
  }

  _restoreValueScales(state: any) {
    let valueScales = this.valueScales,
      i;
    for (let valueScale of valueScales) {
      valueScale.destroy();
    }

    let scalesState = state.valueScales || [state.valueScale];
    valueScales.length = 0;
    for (i = 0; i < scalesState.length; i++) {
      let scale = new ValueScale({ chart: this });

      valueScales.push(scale);
      scale.loadState(scalesState[i]);
    }
    if (valueScales.length === 0)
      valueScales.push(new ValueScale({ chart: this }));
  }

  /**
   * Starts new user drawing.
   * @method startUserDrawing
   * @param {StockChartX.Drawing} drawing The new user drawing object.
   * @memberOf StockChartX.Chart#
   * @see [cancelUserDrawing]{@linkcode StockChartX.Chart#cancelUserDrawing} to cancel user drawing.
   * @example
   *  var line = new StockChartX.LineSegmentDrawing();
   *  chart.startUserDrawing(line);
   */
  startUserDrawing(drawing: Drawing) {
    switch (this.state) {
      case ChartState.USER_DRAWING:
      case ChartState.RESIZING_PANELS:
        this.cancelUserDrawing();
        break;
      case ChartState.NORMAL:
        break;
      default:
        throw new Error("Unable to start user drawing in this chart state.");
    }

    this.state = ChartState.USER_DRAWING;
    this.selectObject(null);
    this.addCssClass(DrawingCursorClass.CREATE);
    drawing.startUserDrawing();
    this.selectedObject = drawing;

    this.fireValueChanged(ChartEvent.USER_DRAWING_STARTED, drawing);
  }

  /**
   * Cancels user drawing.
   * @method cancelUserDrawing
   * @memberOf StockChartX.Chart#
   * @see [startUserDrawing]{@linkcode StockChartX.Chart#startUserDrawing} to start user drawing.
   * @example
   *  chart.cancelUserDrawing();
   */
  cancelUserDrawing() {
    if (this.state === ChartState.USER_DRAWING) {
      let panel = this._selectedObject.chartPanel;
      if (panel) panel.removeDrawings(this._selectedObject);

      this.selectObject(null);
      this.removeCssClass(DrawingCursorClass.CREATE);
      this.state = ChartState.NORMAL;

      this.fireValueChanged(ChartEvent.USER_DRAWING_CANCELLED);
    }
  }

  _finishUserDrawing() {
    this.removeCssClass(DrawingCursorClass.CREATE);
    this.state = ChartState.NORMAL;
    this.fireValueChanged(
      ChartEvent.USER_DRAWING_FINISHED,
      this._selectedObject
    );

    if (this.stayInDrawingMode) {
      let drawing = Drawing.deserialize({
        className: this._selectedObject.className
      });
      this.startUserDrawing(drawing);
    }
  }

  /**
   * Starts zooming.
   * @method startZoomIn
   * @param {StockChartX.Drawing} zoomMode Zoom mode.
   * @memberOf StockChartX.Chart#
   * @see [cancelZoomIn]{@linkcode StockChartX.Chart#cancelZoomIn} to cancel zooming.
   * @example
   *  chart.startZoomIn(ZoomInMode.DATE_RANGE);
   */
  startZoomIn(zoomMode: ZoomInMode) {
    this.zoomInView = new ZoomInView();
    this.zoomInView.zoomMode = zoomMode;
    this.state = ChartState.ZOOM_IN;
    this.fireValueChanged(ChartEvent.ZOOM_IN_STARTED);
  }

  /**
   * Cancels zooming.
   * @method cancelUserDrawing
   * @memberOf StockChartX.Chart#
   * @see [startZoomIn]{@linkcode StockChartX.Chart#startZoomIn} to start zooming.
   * @example
   *  chart.cancelZoomIn();
   */
  cancelZoomIn() {
    if (!this.zoomInView || this.state !== ChartState.ZOOM_IN) return;

    this.state = ChartState.NORMAL;
    this.fireValueChanged(ChartEvent.ZOOM_IN_CANCELLED);
    this.zoomInView.cancelDraw();
  }

  /**
   * Marks that auto-scaling needs to be performed on next layout (affects all scales, including date scale).
   * @method setNeedsAutoScaleAll
   * @memberOf StockChartX.Chart#
   */
  setNeedsAutoScaleAll() {
    this._dateScale.setNeedsAutoScale();
    this._chartPanelsContainer.setNeedsAutoScale();
  }

  setWindowMode(mode: WindowMode) {
    this._windowModeHandler.setMode(mode);
  }

  setNeedsLayout() {
    // TODO: to be implemented.
    this.layout();
  }

  /**
   * Layouts chart elements.
   * @method layout
   * @memberOf StockChartX.Chart#
   */
  layout() {
    let frame = this.getBounds();

    // Calculate chart panels frame.
    let panelsFrame = this._dateScale.layoutScalePanel(frame);
    this._chartPanelsFrame = this._chartPanelsContainer.layoutScalePanel(
      panelsFrame
    );

    // Layout date scales
    let dateScaleFrame = new Rect({
      left: panelsFrame.left,
      top: frame.top,
      width: panelsFrame.width,
      height: frame.height
    });
    let dateScaleProjectionFrame = new Rect({
      left: this._chartPanelsFrame.left,
      top: frame.top,
      width: this._chartPanelsFrame.width,
      height: frame.height
    });
    this._dateScale.layout(dateScaleFrame, dateScaleProjectionFrame);

    // Layout chart panels, value scales, etc..
    this._chartPanelsContainer.layout(this._chartPanelsFrame);

    this._crossHair.layout();

    this.spread.layout();
    this._sessionBreakLines.layout();

    let hasMaximizedPanel = false;

    for (let panel of this.chartPanels) {
      if (panel.state === PanelState.MAXIMIZED) {
        hasMaximizedPanel = true;
        break;
      }
    }

    if (!hasMaximizedPanel) {
      for (let indicator of this.indicators) {
        if (!indicator.isInitialized) {
          this.updateIndicators();
          this.setNeedsAutoScale();
          this.layout();

          break;
        }
      }
    }
  }

  /**
   * Draws chart.
   * @method draw
   * @memberOf StockChartX.Chart#
   */
  draw() {
    // @if SCX_LICENSE = 'free'
    this._drawLogo();
    // @endif

    this._dateScale.draw();
    this._navigation.draw();
    this._chartPanelsContainer.draw();
  }

  // @if SCX_LICENSE = 'free'
  _drawLogo() {
    let logo = this.container.find("." + Class.LOGO);
    if (!logo.length) {
      let url =
        "http://www.modulusfe.com/products/web-mobile-stock-chart-library/stockchartx-html5-web-mobile/";
      let link = $(`<a href="${url}" target="_blank"></a>`);

      logo = $("<div></div>")
        .addClass(Class.LOGO)
        .appendTo(link);
      link.appendTo(this.rootDiv);
    }

    let left = this.chartPanelsContainer.panelsContentFrame.left + 3,
      top = -this._dateScale.bottomPanel.layer.size.height - logo.height() - 3;
    logo.scxPosition(left, top);
  }
  // @endif

  /**
   * Layouts and draws chart.
   * @method update
   * @memberOf StockChartX.Chart#
   */
  update() {
    this.layout();
    this.draw();

    if (this.scrollEnabled && this.scrollbar != null) {
      this.scrollbar.adjustDimensions();
    }
  }

  setNeedsUpdate(needsAutoScale?: boolean) {
    if (needsAutoScale) this.setNeedsAutoScale();

    this._updateAnimation.start();
  }

  /**
   * @internal
   */
  private _onUpdateAnimationCallback() {
    this.update();
  }

  updateSplitter(splitter: ChartPanelSplitter) {
    this._chartPanelsContainer.layoutSplitterPanels(splitter);
  }

  destroy(removeContainer: boolean = true) {
    this._unsubscribeEvents();

    HtmlContainer.instance.reset();
    this._windowModeHandler.destroy();
    if (this.stateHandler) this.stateHandler.destroy();
    if (this._datafeed) this._datafeed.destroy();
    this._priceStyle.destroy();
    this._crossHair.destroy();
    this._selectionMarker.destroy();
    this._chartPanelsContainer.destroy();
    this.valueScale.destroy();
    this.dateScale.destroy();
    this._navigation.destroy();
    this._updateAnimation.destroy();
    this._highlightedColumns.destroy();
    this.scrollbar.chart = null;

    for (let indicator of this._indicators) indicator.destroy();

    if (this._container) {
      if (removeContainer) this._container.remove();
      else this._container.empty();
      this._container = null;
    }
  }

  showWaitingBar(config: IWaitingBarConfig) {
    if (!this._waitingBar) {
      this._waitingBar = this._container.scx().waitingBar();
    }
    this._waitingBar.show(config);
  }

  hideWaitingBar(hideAnyway?: boolean) {
    if (this._waitingBar) {
      this._waitingBar.hide(hideAnyway);
    }
  }

  _copyDrawing(): void {
    let selectedDrawing: Drawing;

    for (let panel of this.chartPanels) {
      for (let drawing of panel.drawings) {
        if (drawing.selected) {
          selectedDrawing = drawing;
          break;
        }
      }

      if (selectedDrawing) break;
    }
    if (selectedDrawing && selectedDrawing.chart) {
      this._copyBuffer = selectedDrawing.clone();
    }
  }

  _pasteDrawing(): void {
    if (!this._copyBuffer) return;

    let panel = this._copyBuffer.chartPanel;
    for (let p of this.chartPanels) {
      if (p !== panel) continue;

      let drawing = this._copyBuffer.clone();
      panel.addDrawings(drawing);
      drawing.translate(0, -30);
      panel.setNeedsUpdate();

      return;
    }
    this._copyBuffer = null;
  }

  //   /**
  //    * @internal
  //    */
  //   private _translateClonedDrawing(drawing: Drawing): void {
  //     let bounds = drawing.bounds(),
  //       dx = clonedDrawingOffset.x,
  //       dy = clonedDrawingOffset.y;

  //     if (!bounds) {
  //       drawing.translate(dx, dy);

  //       return;
  //     }

  //     let right = bounds.left + bounds.width,
  //       panelContentWidth = this._copyBuffer.chartPanel.contentFrame.width;

  //     if (right + Math.abs(dx) < panelContentWidth) drawing.translate(dx, dy);
  //     else drawing.translate(-dx, dy);
  //   }

  _handleMouseEvents(event: JQueryEventObject): boolean {
    let self = event.data,
      origEvent = <JQueryEventObject>event.originalEvent,
      clientX = event.pageX !== undefined ? event.pageX : origEvent.pageX,
      clientY = event.pageY !== undefined ? event.pageY : origEvent.pageY,
      changedTouches = origEvent && (<any>origEvent).changedTouches;
    if (!self.mouseEventsEnabled) return;
    if (!clientX && !clientY && changedTouches && changedTouches.length > 0) {
      let lastTouch = changedTouches[changedTouches.length - 1];

      clientX = lastTouch.pageX;
      clientY = lastTouch.pageY;
    }
    let eventObj = <IWindowEvent>(<any>{
      pointerPosition: self._rootDiv.scxClientToLocalPoint(clientX, clientY),
      evt: event
    });

    self._updateHoverRecord.call(self, eventObj.pointerPosition.x);

    // TODO: Quick solution. Needs to be improved.
    if (event.toElement && $(event.toElement).hasClass("scxTooltip")) {
      return;
    }

    if (!self._dateScale.handleEvent(eventObj))
      self._chartPanelsContainer.handleEvent(eventObj);

    self._highlightedColumns.handleEvent(eventObj);

    switch (event.type) {
      case "click":
      case "mousedown":
      case "touchstart":
      case "touchend":
        if (!eventObj.stopPropagation) return;
        break;
      default:
        break;
    }

    event.preventDefault();
    event.stopPropagation();

    return false;
  }

  /**
   * Saves chart as image.
   * @method saveImage
   * @param {CanvasImageCallback} [saveCallback] The callback for custom saving.
   * @memberOf StockChartX.Chart#
   */
  saveImage(saveCallback?: ICanvasImageCallback) {
    this.saveImageHandler.saveImage(this._rootDiv);
  }

  /**
   * @internal
   */
  private _loadOptionsState(options: any) {
    options = options || {};

    this._options = {
      theme: options.theme || Theme.Dark,
      locale: options.locale || "en",
      enableKeyboardEvents:
        options.enableKeyboardEvents !== undefined
          ? !!options.enableKeyboardEvents
          : true,
      enableMouseEvents:
        options.enableMouseEvents !== undefined
          ? !!options.enableMouseEvents
          : true,
      showBarInfoInTitle:
        options.showBarInfoInTitle !== undefined
          ? !!options.showBarInfoInTitle
          : true,
      priceStyle: CandlePriceStyle.className,
      showInstrumentWatermark:
        options.showInstrumentWatermark != null
          ? options.showInstrumentWatermark
          : true,
      xGridVisible: options.xGridVisible != null ? options.xGridVisible : true,
      yGridVisible: options.yGridVisible != null ? options.yGridVisible : true,
      scrollEnabled:
        options.scrollEnabled != null ? options.scrollEnabled : true,
      zoomEnabled: options.zoomEnabled != null ? options.zoomEnabled : true,
      valueScaleKind: options.valueScaleKind || this.valueScaleKind
    };
  }

  /**
   * @internal
   */
  private _layoutHtmlElements(width?: number, height?: number) {
    this._container.addClass(Class.ROOT_CONTAINER);
    this._rootDiv = this._container
      .scxAppend("div", Class.CONTAINER)
      .addClass(Class.UN_SELECTIVE)
      .css(this.cssSize);

    this._rootDiv.scxAppend("div", Class.BACKGROUND);
  }

  public applyTheme() {
    let theme = this.theme,
      chartTheme = theme.chart;

    let themeClass = `${Class.THEME}${theme.name}`;
    if (!$("body").hasClass(themeClass)) $("body").addClass(themeClass);

    // Chart background
    let background = this._container.find(`.${Class.BACKGROUND}`);
    HtmlUtil.setBackground(background, chartTheme.background);

    this._valueMarker.theme = theme.valueScale.valueMarker;
    this._dateMarker.theme = theme.dateScale.dateMarker;

    this.updateIndicators();
  }

  /**
   * @internal
   */
  private _subscribeEvents() {
    let events = [
        "mouseenter",
        "mouseleave",
        "mousedown",
        "mousemove",
        "mouseup",
        "click",
        "dblclick",
        "mousewheel",
        "DOMMouseScroll",
        "contextmenu",
        "touchstart",
        "touchmove",
        "touchend",
        ""
      ],
      localizeEvents = [
        LOCALIZE_EVENT,
        ChartEvent.INDICATOR_ADDED,
        ChartEvent.TOOLBAR_LOADED,
        ChartEvent.LOCALE_CHANGED
      ];

    this._rootDiv.on(
      events.join(`${EventSuffix}, `) as any,
      this as any,
      this._handleMouseEvents
    );
    this.on(localizeEvents.join(`${EventSuffix}, `), () => this.localize());

    // Problem: listener is added every time when chart is creating
    $("body").on(LOCALIZE_EVENT + EventSuffix, this, this._handleLocalizeEvent);

    $(window).on(`resize${EventSuffix}`, this, this._handleWindowResizeEvent);
  }

  /**
   * @internal
   */
  private _unsubscribeEvents() {
    if (this._rootDiv) this._rootDiv.off(EventSuffix);

    this.off(EventSuffix);

    $("body").off(LOCALIZE_EVENT + EventSuffix, this._handleLocalizeEvent);
    $(window).off(`resize${EventSuffix}`, this._handleWindowResizeEvent);
  }

  _updateHoverRecord(x: number) {
    let record = this._dateScale.projection.recordByX(x);

    if (record !== this._hoverRecord) {
      this._hoverRecord = record;
      this.fireValueChanged(ChartEvent.HOVER_RECORD_CHANGED, record);
    }
  }

  /**
   * Returns bar data series.
   * @method barDataSeries
   * @returns {StockChartX~BarDataSeries} An object with date, open, high, low, close, volume properties.
   * @memberOf StockChartX.Chart#
   * @example
   *  var obj = chart.barDataSeries();
   *  var dates = obj.date;       // Date data series
   *  var opens = obj.open;       // Open data series
   *  var highs = obj.high;       // High data series
   *  var lows = obj.low;         // Low data series
   *  var closes = obj.close;     // Close data series
   *  var volumes = obj.volume;   // Volume data series
   */
  barDataSeries(prefix?: string): IBarDataSeries {
    return this._dataManager.barDataSeries(prefix);
  }

  /**
   * Returns bar data series.
   * @method getCommonDataSeries
   * @returns {StockChartX~BarDataSeries}
   * @memberOf StockChartX.Chart#
   * @deprecated since version 2.12.4
   */
  getCommonDataSeries(prefix: string = ""): IBarDataSeries {
    return this.barDataSeries(prefix);
  }

  /**
   * Returns bar data series.
   * @method getBarDataSeries
   * @returns {StockChartX~BarDataSeries}
   * @memberOf StockChartX.Chart
   */
  getBarDataSeries(prefix: string = ""): IBarDataSeries {
    return this.barDataSeries(prefix);
  }

  /**
   * Adds data series into the data manager.
   * @method addDataSeries
   * If you specify data series name a new data series will be created and added.
   * @param {String | StockChartX.DataSeries} dataSeries The data series name or data series object.
   * @param {Boolean} [replaceIfExists = false] Determines whether existing data series with the same name
   * should be replace or an exception should be thrown.
   * @returns {StockChartX.DataSeries} The data series that has been added.
   * @memberOf StockChartX.Chart#
   * @example
   *  // Add existing data series.
   *  chart.addDataSeries(new StockChartX.DataSeries("OpenInterest"));
   *
   *  // Add new data series with a given name.
   *  chart.addDataSeries("OpenInterest2");
   *
   *  // Add/Replace data series.
   *  chart.addDataSeries("OpenInterest", true);
   */
  addDataSeries(
    dataSeries: string | DataSeries,
    replaceIfExists?: boolean
  ): DataSeries {
    return this._dataManager.addDataSeries(dataSeries, replaceIfExists);
  }

  /**
   * Removes given data series. Removes all data series if parameter is omitted.
   * @method removeDataSeries
   * @param {String | StockChartX.DataSeries} [dataSeries] The data series object or data series name.
   * @memberOf StockChartX.Chart#
   * @example
   *  chart.removeDataSeries('OpenInterest'); // Removes 'OpenInterest' data series.
   *  chart.removeDataSeries();               // Removes all data series.
   */
  removeDataSeries(dataSeries: string | DataSeries) {
    this._dataManager.removeDataSeries(dataSeries);
  }

  /**
   * Removes all values from a given data series. Clears all values in all data series if parameter is omitted.
   * @method clearDataSeries
   * @param {String | StockChartX.DataSeries} [dataSeries] The data series name or data series object.
   * @memberOf StockChartX.Chart#
   */
  clearDataSeries(dataSeries: string | DataSeries) {
    this._dataManager.clearDataSeries(dataSeries);
    for (let indicator of this._indicators)
      indicator.clearDataSeries(dataSeries);
  }

  /**
   * Trims all data series to a given maximum length.
   * @method trimDataSeries
   * @param {number} maxLength The new maximum length of data series.
   * @memberOf StockChartX.Chart#
   */
  trimDataSeries(maxLength: number) {
    this.dataManager.trimDataSeries(maxLength);
  }

  /**
   * Returns data series with a given name.
   * @method getDataSeries
   * @param {String} name The data series name.
   * @returns {StockChartX.DataSeries}
   * @memberOf StockChartX.Chart#
   * @example
   *  var dataSeries = chart.getDataSeries("OpenInterest");
   */
  getDataSeries(name: string): DataSeries {
    return this._dataManager.getDataSeries(name);
  }

  primaryDataSeries(suffix: string, symbol: string = ""): DataSeries {
    let priceStyleSuffix = this.priceStyle.primaryDataSeriesSuffix(suffix),
      dsName = symbol + priceStyleSuffix + suffix;
    return this.getDataSeries(dsName);
  }

  primaryBarDataSeries(symbol?: string): IBarDataSeries {
    let dsSuffix = DataSeriesSuffix;

    return {
      date: this.primaryDataSeries(dsSuffix.DATE, symbol),
      open: this.primaryDataSeries(dsSuffix.OPEN, symbol),
      high: this.primaryDataSeries(dsSuffix.HIGH, symbol),
      low: this.primaryDataSeries(dsSuffix.LOW, symbol),
      close: this.primaryDataSeries(dsSuffix.CLOSE, symbol),
      volume: this.primaryDataSeries(dsSuffix.VOLUME, symbol)
    };
  }

  /**
   * Returns bar at a given index or date.
   * @param {number | Date} indexOrDate The bar's index or date.
   * @param {string} [symbol] The symbol.
   * @returns {IBar}
   * @since 2.16
   */
  primaryBar(indexOrDate: number | Date, symbol?: string): IBar {
    let dataSeries = this.primaryBarDataSeries(symbol);

    return this.dataManager.bar(indexOrDate, dataSeries);
  }

  /**
   * Finds data series with a given suffix.
   * @method findDataSeries
   * @param {String} suffix The data series suffix.
   * @returns {StockChartX.DataSeries}
   * @memberOf StockChartX.Chart#
   * @example
   *  var dataSeries = chart.findDataSeries(StockChartX.OPEN_DATA_SERIES_SUFFIX);
   */
  findDataSeries(suffix: string): DataSeries {
    return this._dataManager.findDataSeries(suffix);
  }

  /**
   * Appends values from single bar or an array of bars into the corresponding data series.
   * @method appendBars
   * @param {Bar | Bar[]} bars The single bar or an array of bars.
   * @memberOf StockChartX.Chart#
   * @example
   *  // Append 1 bar
   *  chart.appendBars({
   *      date: new Date(),
   *      open: 100.0,
   *      high: 101.0,
   *      low: 99.0,
   *      close: 100.5,
   *      volume: 200
   *  });
   *
   *  // Append 2 bars
   *  chart.appendBars({
   *  [
   *      {
   *          date: new Date(),
   *          open: 100.0,
   *          high: 101.0,
   *          low: 99.0,
   *          close: 100.5,
   *          volume: 200
   *      },
   *      {
   *          date: new Date(),
   *          open: 100.5,
   *          high: 101.0,
   *          low: 100.0,
   *          close: 100.2,
   *          volume: 300
   *      }
   *  ]
   *  });
   */
  appendBars(bars: IBar | IBar[]) {
      this._dataManager.appendBars(bars);
  }

  /**
   * Prepends values from single bar or an array of bars into the corresponding data series.
   * @method prependBars
   * @param {Bar | Bar[]} bars The single bar or an array of bars.
   * @memberOf StockChartX.Chart#
   * @example
   *  // Add 1 bar
   *  chart.prependBars({
   *      date: new Date(),
   *      open: 100.0,
   *      high: 101.0,
   *      low: 99.0,
   *      close: 100.5,
   *      volume: 200
   *  });
   *
   *  // Add 2 bars
   *  chart.prependBars({
   *  [
   *      {
   *          date: new Date(),
   *          open: 100.0,
   *          high: 101.0,
   *          low: 99.0,
   *          close: 100.5,
   *          volume: 200
   *      },
   *      {
   *          date: new Date(),
   *          open: 100.5,
   *          high: 101.0,
   *          low: 100.0,
   *          close: 100.2,
   *          volume: 300
   *      }
   *  ]
   *  });
   */
  prependBars(bars: IBar | IBar[]) {
    this._dataManager.insertBars(0, bars);
  }

  /**
   * Adds new chart panel.
   * @method addChartPanel
   * @param {Number} [index] The index to insert panel at.
   * @param {Number} [heightRatio] The height ratio of new panel. The value in range (0..1).
   * @param {Boolean} [shrinkMainPanel] True to shrink main panel, false to shrink all panels.
   * @returns {StockChartX.ChartPanel} The newly created chart panel.
   * @memberOf StockChartX.Chart#
   * @example
   *  chart.addChartPanel();  // Add new chart panel.
   *  chart.addChartPanel(2); // Insert new chart panel at index 2.
   */
  addChartPanel(
    index?: number,
    heightRatio?: number,
    shrinkMainPanel?: boolean
  ): ChartPanel {
    return this._chartPanelsContainer.addPanel(
      index,
      heightRatio,
      shrinkMainPanel
    );
  }

  /**
   * Returns chart panel at a given Y coordinate.
   * @method findPanelAt
   * @param {number} y The Y coordinate.
   * @returns {StockChartX.ChartPanel}
   * @memberOf StockChartX.Chart#
   */
  findPanelAt(y: number): ChartPanel {
    return this._chartPanelsContainer.findPanelAt(y);
  }

  /**
   * Marks that all value scales need to be auto-scaled on next layout.
   * @method setNeedsAutoScale
   * @memberOf StockChartX.Chart#
   */
  setNeedsAutoScale() {
    this._chartPanelsContainer.setNeedsAutoScale();
  }

  /**
   * Scrolls chart on a given number of pixels.
   * @method scrollOnPixels
   * @param {number} pixels The number of pixels to scroll.
   * @memberOf StockChartX.Chart#
   */
  scrollOnPixels(pixels: number) {
    this._dateScale.scrollOnPixels(pixels);
  }

  /**
   * Scrolls chart on a given number of records.
   * @method scrollOnRecords
   * @param {number} records The number of records to scroll.
   * @memberOf StockChartX.Chart#
   */
  scrollOnRecords(records: number) {
    this._dateScale.scrollOnRecords(records);
  }

  /**
   * Zooms chart on a given number of pixels.
   * @method zoomOnPixels
   * @param {number} pixels The number of pixels to zoom.
   * @memberOf StockChartX.Chart#
   */
  zoomOnPixels(pixels: number) {
    this._dateScale.zoomOnPixels(pixels);
  }

  /**
   * Zooms chart on a given number of records.
   * @method zoomOnRecords
   * @param {number} records The number of records to zoom.
   * @memberOf StockChartX.Chart#
   */
  zoomOnRecords(records: number) {
    this._dateScale.zoomOnRecords(records);
  }

  visibleDataRange() {
    return {
      firstVisibleDataRecord: Math.max(this.firstVisibleRecord, 0),
      lastVisibleDataRecord: Math.min(this.lastVisibleRecord, this.recordCount)
    };
  }

  /**
   * Updates visible range to show records in a given range.
   * @method recordRange
   * @param {number} [firstRecord] The first record to show. Or number of last records to show if second argument is omitted.
   * @param {number} [lastRecord] The last record to show.
   * @memberOf StockChartX.Chart#
   */
  recordRange(firstRecord?: number, lastRecord?: number) {
    if (firstRecord == null && lastRecord == null) {
      return {
        firstVisibleRecord: this.firstVisibleRecord,
        lastVisibleRecord: this.lastVisibleRecord
      };
    }

    let count = this.recordCount;

    if (lastRecord == null) {
      // Show last n records.
      let records = firstRecord;

      if (!JsUtil.isFiniteNumber(records) || records <= 0)
        throw new TypeError("Positive number expected.");

      this.firstVisibleRecord = Math.max(count - records, 0);
      this.lastVisibleRecord = count - 1;
    } else {
      if (!JsUtil.isFiniteNumber(firstRecord) || firstRecord < 0)
        throw new TypeError("First record must be a positive number or 0.");
      if (!JsUtil.isFiniteNumber(lastRecord))
        throw new TypeError("Last record must be a positive number.");
      if (lastRecord <= firstRecord)
        throw new Error("Last record must be greater than first record.");

      this.firstVisibleRecord = firstRecord;
      this.lastVisibleRecord = lastRecord;
    }
  }

  /**
   * Calculate bars count between two points
   * @method barsBetweenPoints
   * @param {IPoint | IChartPoint} startPoint The start point.
   * @param {IPoint | IChartPoint} endPoint The end point.
   * @returns {number} Number of bars
   * @memberOf StockChartX.Chart#
   * @example
   *  recordsCount = chart.barsBetweenPoints(
   *  {
   *      x: 50,
   *      y: 20
   *  },
   *  {
   *      x: 500,
   *      y: 30
   *  });
   */
  barsBetweenPoints(
    startPoint: IPoint | IChartPoint,
    endPoint: IPoint | IChartPoint
  ): number {
    let projection = this.dateScale.projection,
      recordsCount = 0,
      barsCount = this.primaryDataSeries(DataSeriesSuffix.CLOSE).length;

    if (barsCount > 0) {
      let startRecord = new ChartPoint(startPoint).getRecord(projection),
        endRecord = new ChartPoint(endPoint).getRecord(projection);

      let isInBarsRange =
        (startRecord >= 0 && startRecord < barsCount) ||
        (endRecord >= 0 && endRecord < barsCount);

      if (isInBarsRange) {
        let start = Math.min(Math.max(startRecord, 0), barsCount - 1),
          end = Math.min(Math.max(endRecord, 0), barsCount - 1);
        recordsCount =
          Math.trunc(end) -
          Math.trunc(start) +
          (endRecord >= startRecord ? 1 : -1);
      } else
        recordsCount =
          startRecord <= 0 && endRecord >= barsCount
            ? barsCount
            : endRecord <= 0 && startRecord >= barsCount
            ? -barsCount
            : 0;
    }
    return recordsCount;
  }

  /**
   * Updates visible range to show values in a given date range.
   * @method dateRange
   * @param {Date} [startDate] The start date.
   * @param {Date} [endDate] The end date.
   * @memberOf StockChartX.Chart#
   */
  dateRange(startDate?: Date, endDate?: Date) {
    let dateScale = this.dateScale,
      projection = dateScale.projection;

    if (!startDate && !endDate) {
      let frame = dateScale.projectionFrame;

      return {
        startDate: projection.dateByX(frame.left),
        endDate: projection.dateByX(frame.right)
      };
    }

    // noinspection UnnecessaryLocalVariableJS
    let firstRecord = projection.recordByX(
        projection.xByDate(startDate, false),
        false
      ),
      lastRecord = projection.recordByX(
        projection.xByDate(endDate, false),
        false
      );

    this.firstVisibleRecord = firstRecord;
    this.lastVisibleRecord = lastRecord - 1;
  }

  updateComputedDataSeries() {
    this.priceStyle.updateComputedDataSeries();
  }

  addCssClass(cssClass: string) {
    this.rootDiv.addClass(cssClass);
  }

  removeCssClass(cssClass: string) {
    this.rootDiv.removeClass(cssClass);
  }
}
