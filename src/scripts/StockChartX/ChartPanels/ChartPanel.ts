import { InstrumentWatermark } from "../index";
import { ChartPanelOptionControls } from "../index";
import { OrderBar, PositionBar } from "../index";
import { PanelState, Chart } from "../index";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import {
  MouseEvent,
  IWindowEvent,
  GestureState,
  PointerKind
} from "../index";
import { PriceStyleSettingsDialog } from "../../StockChartX.UI/index";
import { ChartContextMenu } from "../../StockChartX.UI/index";
import { IPadding, Rect } from "../index";
import { ChartPanelsContainer } from "../index";
import { IStrokeTheme, ITextTheme } from "../index";
import { HtmlControl } from "../index";
import { IChartPanelWatermarkTheme } from "../index";
import { ChartState } from "../index";

import { ChartPanelValueScale } from "../index";
import { INumberFormat } from "../index";
import { Layer } from "../index";
import { IChartPanelHtmlComponent } from "../index";
import { JsUtil } from "../index";
import { ChartPanelObject } from "../index";
import { Drawing } from "../index";
import { Projection } from "../index";
import { Plot } from "../index";
import { Indicator } from "../index";
import { ValueScale } from "../index";
import { Animation } from "../index";
// import { $ } from "../../external/typescript/jquery";
import { IMinMaxValues, DataSeriesSuffix } from "../index";
import { IPoint } from "../index";
import { IValueChangedEvent } from "../index";
import { GestureArray } from "../index";
import { PanGesture } from "../index";
import { MouseWheelGesture } from "../index";
import { ClickGesture } from "../index";
import { DoubleClickGesture } from "../index";
import { MouseHoverGesture } from "../index";
import { ContextMenuGesture } from "../index";
import { CrossHairType } from "../index";
import { Environment } from "../index";
import { DummyCanvasContext } from "../index";
import { ViewLoader } from "../../StockChartX.UI/index";
import { ChartEvent, IInstrument } from "../index";
import { StockSymbol } from "../Indicators";

"use strict";
const $ = window.jQuery;

// region Interfaces
declare global {
  export interface IChartPanelOptions {
    panelPadding: IPadding;
    heightRatio: number;
    minHeightRatio: number;
    maxHeightRatio: number;
    moveDirection: string;
    moveKind: string;
    showXGrid: boolean;
    showYGrid: boolean;
    showIndicatorTitles: boolean;
    theme: IChartPanelTheme;
    state: number;
    visible: boolean;
  }
}

export interface IChartPanelConfig {
  chartPanelsContainer: ChartPanelsContainer;
  options?: any;
}

export interface IChartPanelTheme {
  grid: IStrokeTheme;
  title: ITextTheme;
  watermark: IChartPanelWatermarkTheme;
}

// endregion

// region Declarations

/**
 * Chart panel move direction enum values.
 * @name PanelMoveDirection
 * @readonly
 * @enum {string}
 * @memberOf StockChartX
 */
export const PanelMoveDirection = {
  /** Move is disabled. */
  NONE: "none",
  /** Horizontal move is enabled. */
  HORIZONTAL: "horizontal",
  /** Vertical move is enabled. */
  VERTICAL: "vertical",
  /** Panel can be moved in any direction. */
  ANY: "any"
};
Object.freeze(PanelMoveDirection);

/**
 * Chart panel move kind enum values.
 * @name PanelMoveKind
 * @readonly
 * @enum {string}
 * @memberOf StockChartX
 */
export const PanelMoveKind = {
  /** Normal move. */
  NORMAL: "normal",
  /** Auto-scale value scales on move. */
  AUTOSCALED: "autoscaled"
};
Object.freeze(PanelMoveKind);

/**
 * Chart panel events enumeration values.
 * @enum {string}
 * @readonly
 * @memberOf StockChartX
 */
export const PanelEvent = {
  /** Theme changed. */
  THEME_CHANGED: "panelThemeChanged",

  /** X grid lines visibility changed (visible | invisible). */
  X_GRID_VISIBLE_CHANGED: "panelXGridVisibleChanged",

  /** Y grid lines visibility changed (visible | invisible). */
  Y_GRID_VISIBLE_CHANGED: "panelYGridVisibleChanged",

  /** New plot added. */
  PLOT_ADDED: "panelPlotAdded",

  /** Plot removed. */
  PLOT_REMOVED: "panelPlotRemoved",

  /** New drawing added */
  DRAWING_ADDED: "panelDrawingAdded",

  /** New object added */
  OBJECT_ADDED: "panelObjectAdded",

  /** Drawing removed. */
  DRAWING_REMOVED: "panelDrawingRemoved",

  /** Object removed. */
  OBJECT_REMOVED: "panelObjectRemoved",

  /** Panel double clicked. */
  DOUBLE_CLICKED: "panelDoubleClicked",

  /** Panel context menu. */
  CONTEXT_MENU: "panelContextMenu"
};
Object.freeze(PanelEvent);

const Class = {
  CONTAINER: "scxChartPanel",
  SCROLL: "scxPanelScroll",
  TITLE: "scxPanelTitle",
  SYMBOL_TITLE: "scxSymbolTitle",
  TITLE_CAPTION: "scxPanelTitleCaption",
  TITLE_VALUE: "scxPanelTitleValue",
  OPTIONS: "scxPanelOptions",
  OPTIONS_ICON: "scxPanelTitleIcon",
  NAVIGATION: ".scxNavigation",
  PANEL_TITLE: ".scxPanelTitle",
  TOGGLE_INDICATOR_TITLES: "scxToggleIndicatorTitles",
  INDICATOR_TITLE_SHOW: "scxIndicatorCollapseShow",
  INDICATOR_TITLE_HIDE: "scxIndicatorCollapseHide"
};

const EventSuffix = ".scxPanel";

// endregion

/**
 * Describes chart panel.
 * @param {Object} config The configuration object.
 * @param {StockChartX.ChartPanelsContainer} config.chartPanelsContainer The parent chart panels container.
 * @param {Number} [config.minHeightRatio] The min allowed height ratio.
 * @param {Number} [config.maxHeightRatio] The max allowed height ratio.
 * @param {Number} [config.heightRatio] The height ratio.
 * @param {StockChartX.PanelMoveDirection} [config.moveDirection] The allowed move direction.
 * @param {StockChartX.PanelMoveKind} [config.moveKind] The move kind.
 * @constructor StockChartX.ChartPanel
 * @augments StockChartX.Control
 */
export class ChartPanel extends HtmlControl {
  // region Properties

  /**
   * @internal
   */
  private _optionControls: ChartPanelOptionControls;

  /**
   * @internal
   */
  private chartContextMenu: ChartContextMenu;

  /**
   * @internal
   */
  private _panelsContainer;

  /**
   * @internal
   */
  private _symbol: StockSymbol;

  /**
   * Gets symbol associated with Chart panel.
   * @name symbol
   * @type StockChartX.IInstrument
   * @readonly
   * @memberOf StockChartX.ChartPanel#
   */
  get symbol(): StockSymbol {
    return this._symbol;
  }
  set symbol(symbol: StockSymbol) {
    this._symbol = symbol;
  }

  /**
   * @internal
   */
  public getDataSeriesPrefix(): string {
    if (!this.symbol) {
      return "";
    }
    return this.symbol.getSymbolName();
  }
  /**
   * Gets parent chart panels container.
   * @name chartPanelsContainer
   * @type StockChartX.ChartPanelsContainer
   * @readonly
   * @memberOf StockChartX.ChartPanel#
   */
  get chartPanelsContainer(): ChartPanelsContainer {
    return this._panelsContainer;
  }

  /**
   * Gets parent chart.
   * @name chart
   * @type {StockChartX.Chart}
   * @readonly
   * @memberOf StockChartX.ChartPanel#
   */
  get chart(): Chart {
    return this._panelsContainer._chart;
  }

  /**
   * @internal
   */
  private _valueScales: ChartPanelValueScale[] = [];

  /**
   * Gets array of value scales.
   * @name valueScales
   * @type {StockChartX.ChartPanelValueScale[]}
   * @readonly
   * @memberOf StockChartX.ChartPanel#
   */
  get valueScales(): ChartPanelValueScale[] {
    return this._valueScales;
  }

  /**
   * Gets value scale.
   * @name valueScale
   * @type {StockChartX.ChartPanelValueScale}
   * @readonly
   * @memberOf StockChartX.ChartPanel#
   */
  get valueScale(): ChartPanelValueScale {
    return this._valueScales[0];
  }

  /**
   * Gets/Sets value formatter.
   * @name formatter
   * @type {StockChartX.IntlNumberFormat | StockChartX.CustomNumberFormat}
   * @memberOf StockChartX.ChartPanel#
   */
  get formatter(): INumberFormat {
    return this.valueScale.formatter;
  }

  set formatter(value: INumberFormat) {
    this.valueScale.formatter = value;
  }

  /**
   * @internal
   */
  private _layer: Layer;

  /**
   * Gets layer - an abstraction over canvas.
   * @name layer
   * @type StockChartX.Layer
   * @readonly
   * @memberOf StockChartX.ChartPanel#
   */
  get layer(): Layer {
    return this._layer;
  }

  /**
   * @internal
   */
  private _components: IChartPanelHtmlComponent[] = [];

  /**
   *  An array of html components.
   *  @name components
   *  @type {StockChartX.ChartPanelHtmlComponent[]}
   *  @memberOf StockChartX.ChartPanel#
   */
  get components(): IChartPanelHtmlComponent[] {
    return this._components;
  }

  /**
   * The panel's options.
   * @type {Object}
   * @private
   * @internal
   */
  private _options: IChartPanelOptions;

  /**
   * Gets/Sets current height ratio. The value must be in range [minHeightRatio..maxHeightRatio].
   * @name heightRatio
   * @type {Number}
   * @memberOf StockChartX.ChartPanel#
   */
  get heightRatio(): number {
    return this._options.heightRatio;
  }

  set heightRatio(ratio: number) {
    if (
      !JsUtil.isFiniteNumber(ratio) ||
      ratio < this._options.minHeightRatio ||
      ratio > this._options.maxHeightRatio
    )
      throw new Error(
        "Height ratio must be a number in range [minHeightRatio..maxHeightRatio]"
      );

    this._options.heightRatio = ratio;
  }

  /**
   * Gets/Sets minimum allowed height ratio. The value must be in range [0..maxHeightRatio].
   * @name minHeightRatio
   * @type {number}
   * @memberOf StockChartX.ChartPanel#
   */
  get minHeightRatio(): number {
    return this._options.minHeightRatio;
  }

  set minHeightRatio(ratio: number) {
    if (
      !JsUtil.isFiniteNumber(ratio) ||
      ratio < 0 ||
      ratio > this._options.maxHeightRatio
    )
      throw new Error(
        "Min height ratio must be a number in range [0..maxHeightRatio]."
      );

    this._options.minHeightRatio = ratio;
    if (this._options.heightRatio < ratio) this._options.heightRatio = ratio;
  }

  /**
   * Gets/Sets maximum allowed height ratio. The value must be in range [minHeightRatio..1].
   * @name maxHeightRatio
   * @type {number}
   * @memberOf StockChartX.ChartPanel#
   */
  get maxHeightRatio(): number {
    return this._options.maxHeightRatio;
  }

  set maxHeightRatio(ratio: number) {
    if (
      !JsUtil.isFiniteNumber(ratio) ||
      ratio < this.minHeightRatio ||
      ratio > 1
    )
      throw new Error(
        "Max height ratio must be a number in range [minHeightRatio..1]"
      );

    this._options.maxHeightRatio = ratio;
    if (this.heightRatio > ratio) this._options.heightRatio = ratio;
  }

  /**
   * Gets/Sets allowed move direction.
   * @name moveDirection
   * @type {StockChartX.PanelMoveDirection}
   * @memberOf StockChartX.ChartPanel#
   */
  get moveDirection(): string {
    return this._options.moveDirection;
  }

  set moveDirection(direction: string) {
    this._options.moveDirection = direction;
  }

  /**
   * Gets/Sets panel's move kind.
   * @name moveKind
   * @type {StockChartX.PanelMoveKind}
   * @memberOf StockChartX.ChartPanel#
   */
  get moveKind(): string {
    return this._options.moveKind;
  }

  set moveKind(value: string) {
    this._options.moveKind = value;
  }

  /**
   * Gets/Sets flag that indicates whether X grid is visible.
   * @name xGridVisible
   * @type {boolean}
   * @memberOf StockChartX.ChartPanel#
   */
  get xGridVisible(): boolean {
    return this._options.showXGrid;
  }

  set xGridVisible(visible: boolean) {
    let newValue = visible,
      oldValue = this._options.showXGrid;

    if (oldValue !== newValue) {
      this._options.showXGrid = newValue;
      this._fire(PanelEvent.X_GRID_VISIBLE_CHANGED, newValue, oldValue);
    }
  }

  /**
   * Gets/Sets flag that indicates whether Y grid is visible.
   * @name yGridVisible
   * @type {boolean}
   * @memberOf StockChartX.ChartPanel#
   */
  get yGridVisible(): boolean {
    return this._options.showYGrid;
  }

  set yGridVisible(visible: boolean) {
    let newValue = visible,
      oldValue = this._options.showYGrid;

    if (oldValue !== newValue) {
      this._options.showYGrid = newValue;
      this._fire(PanelEvent.Y_GRID_VISIBLE_CHANGED, newValue, oldValue);
    }
  }

  get state(): PanelState {
    return this._options.state;
  }

  set state(value: PanelState) {
    this._options.state = value;
  }

  get visible(): boolean {
    return this._options.visible;
  }

  set visible(value: boolean) {
    this._options.visible = value;
    if (this.container) {
      if (value) this.container.show();
      else this.container.hide();
    }
  }

  /**
   * @internal
   */
  private _objects: ChartPanelObject[] = [];

  /**
   * Gets array of objects on the panel.
   * @name plots
   * @type {StockChartX.ChartPanelObject[]}
   * @readonly
   * @memberOf StockChartX.ChartPanel#
   */

  get objects(): ChartPanelObject[] {
    return this._objects;
  }

  /**
   * Gets array of plots on the panel.
   * @name plots
   * @type {StockChartX.Plot[]}
   * @readonly
   * @memberOf StockChartX.ChartPanel#
   */
  get plots(): Plot[] {
    return <Plot[]>(
      this._objects.filter((value: ChartPanelObject) => value instanceof Plot)
    );
  }

  /**
   * Gets array of drawings on the panel.
   * @name drawings
   * @type {StockChartX.Drawing[]}
   * @readonly
   * @memberOf StockChartX.ChartPanel#
   */
  get drawings(): Drawing[] {
    return <Drawing[]>(
      this._objects.filter(
        (value: ChartPanelObject) => value instanceof Drawing
      )
    );
  }

  /**
   * Gets array of order bars on the panel.
   * @name orders
   * @type {StockChartX.OrderBar[]}
   * @readonly
   * @memberOf StockChartX.ChartPanel#
   */
  get orders(): OrderBar[] {
    return <OrderBar[]>(
      this._objects.filter(
        (value: ChartPanelObject) => value instanceof OrderBar
      )
    );
  }

  /**
   * Gets array of position bars on the panel.
   * @name positions
   * @type {StockChartX.PositionBar[]}
   * @readonly
   * @memberOf StockChartX.ChartPanel#
   */
  get positions(): PositionBar[] {
    return <PositionBar[]>(
      this._objects.filter(
        (value: ChartPanelObject) => value instanceof PositionBar
      )
    );
  }

  /**
   * Gets/Sets theme.
   * @name theme
   * @type {object}
   * @memberOf StockChartX.ChartPanel#
   */
  get theme(): IChartPanelTheme {
    return this._options.theme;
  }

  set theme(value: IChartPanelTheme) {
    let oldValue = this._options.theme;
    this._options.theme = value;
    this._fire(PanelEvent.THEME_CHANGED, value, oldValue);
  }

  /**
   * The actual theme.
   * @type {Object}
   * @readonly
   * @memberOf StockChartX.ChartPanel#
   */
  get actualTheme(): IChartPanelTheme {
    return this._options.theme || this.chart.theme.chartPanel;
  }

  /**
   * Gets projection object to convert coordinates.
   * @name projection
   * @type {StockChartX.Projection}
   * @readonly
   * @memberOf StockChartX.ChartPanel#
   */
  get projection(): Projection {
    return this.valueScale.projection;
  }

  /**
   * Gets title div element.
   * @name titleDiv
   * @type {jQuery}
   * @readonly
   * @memberOf StockChartX.ChartPanel#
   */
  get titleDiv() {
    return this._controls.title;
  }

  /**
   * Gets array of indicators on the chart panel.
   * @name indicators
   * @type {StockChartX.Indicator[]}
   * @readonly
   * @memberOf StockChartX.ChartPanel#
   */
  get indicators(): Indicator[] {
    return this.chart.indicators.filter(
      (indicator: Indicator) => indicator.chartPanel === this
    );
  }

  /**
   * @internal
   */
  private _contentFrame = new Rect();

  /**
   * Gets content frame rectangle.
   * @name contentFrame
   * @type {StockChartX.Rect}
   * @readonly
   * @memberOf StockChartX.ChartPanel#
   */
  get contentFrame(): Rect {
    return this._contentFrame;
  }

  /**
   * @internal
   */
  private _controls = {
    title: null,
    options: null
  };

  /**
   * @internal
   */
  private _barInfoControls = null;

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
  private _titleNeedsUpdate: boolean;

  /**
   * @internal
   */
  private _toggleIndicatorTitles: JQuery;

  get showIndicatorTitles(): boolean {
    return this._options.showIndicatorTitles;
  }

  set showIndicatorTitles(value: boolean) {
    if (this._options.showIndicatorTitles === value) return;

    let toggleElement = this._toggleIndicatorTitles;
    this._options.showIndicatorTitles = value;

    if (!toggleElement) return;

    if (value)
      toggleElement
        .addClass(Class.INDICATOR_TITLE_HIDE)
        .removeClass(Class.INDICATOR_TITLE_SHOW);
    else
      toggleElement
        .addClass(Class.INDICATOR_TITLE_SHOW)
        .removeClass(Class.INDICATOR_TITLE_HIDE);
  }

  /**
   * Gets/Sets panel content padding.
   * @name panelPadding
   * @type {StockChartX~Padding}
   * @memberOf StockChartX.ChartPanel#
   */
  get panelPadding(): IPadding {
    let chartPanelsContainer = this.chartPanelsContainer;

    return this._options.panelPadding || chartPanelsContainer.panelPadding;
  }

  set panelPadding(value: IPadding) {
    let chartPanelsContainerPadding = this.chartPanelsContainer.panelPadding;

    this._options.panelPadding = {
      left: chartPanelsContainerPadding.left,
      top: value.top,
      right: chartPanelsContainerPadding.right,
      bottom: value.bottom
    };
  }

  // endregion

  constructor(config: IChartPanelConfig) {
    super();

    if (!(config.chartPanelsContainer instanceof ChartPanelsContainer))
      throw new TypeError("Invalid chart panels container.");
    this._panelsContainer = config.chartPanelsContainer;

    this._optionControls = new ChartPanelOptionControls(this);

    this.loadState(config);
  }

  /**
   * @internal
   */
  private _fire(event: string, newValue: any, oldValue?: any) {
    let chart = this.chart;
    if (chart) chart.fireTargetValueChanged(this, event, newValue, oldValue);
  }

  /**
   * Returns 0-based panel index (from top).
   * @returns {number}
   * @memberOf StockChartX.ChartPanel#
   * @private
   * @internal
   */
  getIndex(): number {
    return this._panelsContainer.panels.indexOf(this);
  }

  getProjection(chartValueScale: ValueScale): Projection {
    let index = chartValueScale ? chartValueScale.index : 0;

    return this.valueScales[index].projection;
  }

  getValueScale(chartValueScale: ValueScale): ChartPanelValueScale {
    let index = chartValueScale ? chartValueScale.index : 0;

    return this.valueScales[index];
  }
  /**
   * Removes one or more drawings.
   * @method removeDrawings
   * @param {StockChartX.Drawing | StockChartX.Drawing[]} [drawings] The drawing or an array of drawings to remove.
   * All drawings are removed if omitted.
   * @see [addDrawings]{@linkcode StockChartX.ChartPanel#addDrawings} to add drawings.
   * @memberOf StockChartX.ChartPanel#
   */
  //  @ts-ignore
  removeDrawings(drawings?: Drawing | Drawing[]);
  //  @ts-ignore
  removeDrawings(...drawings: Drawing[]) {
    let drawingsToRemove =
      drawings && drawings.length > 0
        ? JsUtil.flattenArray(drawings)
        : this.drawings.slice(0);
    let filteredDrawings = drawingsToRemove.filter(item => item.canRemove);

    this.forceRemoveDrawings(filteredDrawings);
  }
  //  @ts-ignore
  removeSelectDrawings(selected: boolean, ...drawings: Drawing[]) {
    let drawingsToRemove =
      drawings && drawings.length > 0
        ? JsUtil.flattenArray(drawings)
        : this.drawings.slice(0);
    let filteredDrawings = drawingsToRemove.filter(
      item => item.canSelect == selected
    );
    this.forceRemoveDrawings(filteredDrawings);
  }

  /**
   * Sets panel height ratio. Unlike heightRatio property this method updates height ratio of the main panel.
   * So if you increase height ratio by 0.1, height ratio of the main panel will be decreased by 0.1.
   * @method setHeightRatio
   * @param {number} ratio The new height ratio.
   * @memberOf StockChartX.ChartPanel#
   */
  setHeightRatio(ratio: number) {
    this._panelsContainer.setPanelHeightRatio(this, ratio);
  }

  /**
   * Marks that value scale needs to be auto-scaled on next layout.
   * @method setNeedsAutoScale
   * @memberOf StockChartX.ChartPanel#
   */
  setNeedsAutoScale() {
    for (let scale of this._valueScales) scale.setNeedsAutoScale();
  }

  // region Plot routines

  containsPlot(plot: Plot): boolean {
    return this.plots.indexOf(plot) >= 0;
  }

  /**
   * Adds new plot.
   * @method addPlot
   * @param {StockChartX.Plot | StockChartX.Plot[]} plots The plot or an array of plots to add.
   * @see [removePlot]{@linkcode StockChartX.ChartPanel#removePlot} to remove plot.
   * @memberOf StockChartX.ChartPanel#
   */
  addPlot(plots: Plot | Plot[]);
  addPlot(...plots: Plot[]) {
    let plotsToAdd = JsUtil.flattenArray(plots);

    for (let plot of plotsToAdd) {
      if (!(plot instanceof Plot))
        throw new TypeError("Plot must be an instance of StockChartX.Plot.");

      if (this.containsPlot(plot)) continue;

      plot.chartPanel = this;
      this._objects.push(plot);

      this._fire(PanelEvent.PLOT_ADDED, plot);
    }
  }

  /**
   * Removes given plot or an array of plots.
   * @method removePlot
   * @param {StockChartX.Plot | StockChartX.Plot[]} plots The plot or an array of plots to remove.
   * @see [addPlot]{@linkcode StockChartX.ChartPanel#addPlot} to add plot.
   * @memberOf StockChartX.ChartPanel#
   */
  removePlot(plots: Plot | Plot[]);
  removePlot(...plots: Plot[]) {
    let plotsToRemove: Plot[];
    if (plots && plots.length > 0) plotsToRemove = JsUtil.flattenArray(plots);
    else plotsToRemove = this.plots.slice(0);

    for (let plot of plotsToRemove) {
      let idx = this._objects.indexOf(plot);
      if (idx >= 0) {
        this._objects.splice(idx, 1);
        this._fire(PanelEvent.PLOT_REMOVED, plot);
      }
    }
  }

  // endregion

  // region Drawing routines

  containsDrawing(drawing: Drawing): boolean {
    return this.drawings.indexOf(drawing) >= 0;
  }

  /**
   * Adds drawings.
   * @method addDrawings
   * @param {StockChartX.Drawing | StockChartX.Drawing[]} drawings The drawing or an array of drawings to add.
   * @see [removeDrawings]{@linkcode StockChartX.ChartPanel#removeDrawings} to remove drawings.
   * @memberOf StockChartX.ChartPanel#
   */
  addDrawings(drawings: Drawing | Drawing[]);
  addDrawings(...drawings: Drawing[]) {
    let drawingsToAdd: Drawing[] = JsUtil.flattenArray(drawings);

    for (let drawing of drawingsToAdd) {
      if (!(drawing instanceof Drawing))
        throw new TypeError(
          "Drawing is not an instance of StockChartX.Drawing."
        );

      if (this.containsDrawing(drawing)) {
        throw new Error("Drawing already added.");
      }

      drawing.chartPanel = this;
      this._objects.push(drawing);

      this._fire(PanelEvent.DRAWING_ADDED, drawing);
    }
  }

  /**
   * Removes one or more drawings.
   * @method removeDrawings
   * @param {StockChartX.Drawing | StockChartX.Drawing[]} [drawings] The drawing or an array of drawings to remove.
   * All drawings are removed if omitted.
   * @see [addDrawings]{@linkcode StockChartX.ChartPanel#addDrawings} to add drawings.
   * @memberOf StockChartX.ChartPanel#
   */

  //  @ts-ignore
  removeDrawings(drawings?: Drawing | Drawing[]): void;
  //  @ts-ignore
  removeDrawings(...drawings: Drawing[]) {
    let drawingsToRemove =
      drawings && drawings.length > 0
        ? JsUtil.flattenArray(drawings)
        : this.drawings.slice(0);
    let filteredDrawings = drawingsToRemove.filter(
      (item: Drawing) => item.canRemove
    );

    this.forceRemoveDrawings(filteredDrawings);
  }

  /**
   * Force removes one or more drawings (ignores removable flag).
   * @method forceRemoveDrawings
   * @param {StockChartX.Drawing | StockChartX.Drawing[]} [drawings] The drawing or an array of drawings to remove.
   * All drawings are removed if omitted.
   * @see [addDrawings]{@linkcode StockChartX.ChartPanel#addDrawings} to add drawings.
   * @memberOf StockChartX.ChartPanel#
   */
  forceRemoveDrawings(drawings?: Drawing | Drawing[]);
  forceRemoveDrawings(...drawings: Drawing[]) {
    let drawingsToRemove,
      chart = this.chart,
      userDrawingToCancel = null;

    if (drawings && drawings.length > 0)
      drawingsToRemove = JsUtil.flattenArray(drawings);
    else drawingsToRemove = this.drawings.slice(0);

    for (let drawing of drawingsToRemove) {
      let idx = this._objects.indexOf(drawing);
      if (idx < 0) continue;

      if (chart.selectedObject === drawing) {
        if (chart.state === ChartState.USER_DRAWING)
          userDrawingToCancel = chart.selectedObject;
        else chart.selectObject(null);
      }

      drawing.destroy();
      this._objects.splice(idx, 1);
      this._fire(PanelEvent.DRAWING_REMOVED, drawing);
    }

    if (userDrawingToCancel) chart.cancelUserDrawing();
  }

  /**
   * Adds objects.
   * @method addObjects
   * @param {StockChartX.ChartPanelObject | StockChartX.ChartPanelObject[]} objects The object or an array of objects to add.
   * @see [removeObjects]{@linkcode StockChartX.ChartPanel#removeObjects} to remove objects.
   * @memberOf StockChartX.ChartPanel#
   */
  addObjects(objects: ChartPanelObject | ChartPanelObject[]);
  addObjects(...objects: ChartPanelObject[]) {
    let objectsToAdd: ChartPanelObject[] = JsUtil.flattenArray(objects);

    for (let object of objectsToAdd) {
      if (!(object instanceof ChartPanelObject))
        throw new TypeError(
          "Object is not an instance of StockChartX.ChartPanelObject."
        );

      if (this.containsObject(object)) {
        throw new Error("Object already added.");
      }

      object.chartPanel = this;
      this._objects.push(object);

      this._fire(PanelEvent.OBJECT_ADDED, object);
    }
  }

  /**
   * Removes one or more objects.
   * @method removeDrawings
   * @param {StockChartX.ChartPanelObject | StockChartX.ChartPanelObject[]} [objects] The object or an array of objects to remove.
   * All objects are removed if omitted.
   * @see [addObjects]{@linkcode StockChartX.ChartPanel#addObjects} to add objects.
   * @memberOf StockChartX.ChartPanel#
   */
  removeObjects(objects?: ChartPanelObject | ChartPanelObject[]);
  removeObjects(...objects: ChartPanelObject[]) {
    let objectsToRemove =
      objects && objects.length > 0
        ? JsUtil.flattenArray(objects)
        : this.objects.slice(0);

    let chart = this.chart;
    for (let object of objectsToRemove) {
      let idx = this._objects.indexOf(object);
      if (idx < 0) continue;

      if (chart.selectedObject === object) {
        chart.selectObject(null);
      }

      // object.destroy();
      this._objects.splice(idx, 1);
      this._fire(PanelEvent.OBJECT_REMOVED, object);
    }
  }

  // region Chart panel objects routines

  containsObject(object: ChartPanelObject): boolean {
    return this.objects.indexOf(object) >= 0;
  }

  // endregion

  handleEvent(event: IWindowEvent): boolean {
    if (!this.visible) return false;

    let origPos = event.pointerPosition;
    let chart = this.chart;

    if (chart.state === ChartState.ZOOM_IN) {
      chart.zoomInView.panel = this;

      return chart.zoomInView.handleEvent(event);
    }

    let localPos = {
      x: origPos.x - this.frame.left,
      y: origPos.y - this.frame.top
    };
    event.pointerPosition = localPos;

    for (let scale of this._valueScales) {
      if (scale.handleEvent(event)) return true;
    }

    let isPointerInPanel = this.hitTest(origPos);

    try {
      if (chart.state === ChartState.USER_DRAWING) {
        if (!isPointerInPanel) return false;

        let drawing = chart.selectedObject,
          drawingPanel = drawing.chartPanel;

        if (drawingPanel && drawingPanel !== this) return false;

        event.pointerPosition = localPos;
        event.chartPanel = this;
        (<Drawing>drawing).handleEvent(event);
        $(Class.PANEL_TITLE).css("pointer-events", "none");
        $(Class.NAVIGATION).css("pointer-events", "none");

        return true;
      }

      $(Class.PANEL_TITLE).css("pointer-events", "all");
      $(Class.NAVIGATION).css("pointer-events", "all");
      let drawings = this.drawings,
        orders = this.orders,
        positions = this.positions,
        drawing = <Drawing>chart.selectedObject;

      if (!isPointerInPanel) {
        for (let i = drawings.length - 1; i >= 0; i--)
          drawings[i].hideTooltip();

        event.pointerPosition = origPos;

        if (drawing && event.evt.type !== MouseEvent.MOVE)
          drawing.handleEvent(event);

        this.orders.forEach((order: OrderBar) => order.handleEvent(event));

        super.handleEvent(event, false);

        return false;
      }

      for (let i = drawings.length - 1; i >= 0; i--) {
        if (drawings[i].handleEvent(event)) return true;
      }

      for (let i = orders.length - 1; i >= 0; i--) {
        if (orders[i].handleEvent(event)) return true;
      }

      for (let i = positions.length - 1; i >= 0; i--) {
        if (positions[i].handleEvent(event)) return true;
      }
    } finally {
      event.pointerPosition = origPos;
    }

    return super.handleEvent(event);
  }

  /**
   * Returns minimum and maximum plot's values.
   * @method minMaxValues
   * @param {number} [startIndex] The starting index of the range to search.
   * @param {number} [count] The length of the range to search.
   * @param {StockChartX.ValueScale} [valueScale] The value scale.
   * @returns {{min: number, max: number}} An object that contains min and max values.
   * @see [autoScaledMinMaxValues]{@linkcode StockChartX.ChartPanel#autoScaledMinMaxValues} to min/max values in visible range.
   * @memberOf StockChartX.ChartPanel#
   */
  minMaxValues(
    startIndex: number,
    count: number,
    valueScale: ValueScale
  ): IMinMaxValues<number> {
    let min = Infinity,
      max = -Infinity;

    for (let plot of this.plots) {
      if (valueScale && plot.valueScale !== valueScale) continue;

      let customDateDataSeries = plot.findDataSeries(DataSeriesSuffix.DATE),
        res = null;

      if (customDateDataSeries) {
        let projection = this.projection,
          startIndexDate = projection.dateByRecord(startIndex),
          endIndexDate = projection.dateByRecord(startIndex + count);

        let customStartIndex = customDateDataSeries.binaryIndexOf(
            startIndexDate
          ),
          customEndIndex = customDateDataSeries.binaryIndexOf(endIndexDate);

        if (customStartIndex < 0) customStartIndex = ~customStartIndex;

        if (customEndIndex < 0) customEndIndex = ~customEndIndex;

        res = plot.minMaxValues(
          customStartIndex,
          customEndIndex - customStartIndex
        );
      } else {
        res = plot.minMaxValues(startIndex, count);
      }

      res = plot.minMaxValues(startIndex, count);
      if (res.min < min) min = res.min;
      if (res.max > max) max = res.max;
    }

    if (!isFinite(min)) min = -1;
    if (!isFinite(max)) max = 1;
    if (min === max) {
      min--;
      max++;
    }

    return {
      min,
      max
    };
  }

  /**
   * Returns min/max values for auto-scaling.
   * @method autoScaledMinMaxValues
   * @param {StockChartX.ChartValueScale} [valueScale] The value scale.
   * @returns {{min: number, max: number}}
   * @memberOf StockChartX.ChartPanel#
   */
  autoScaledMinMaxValues(valueScale: ValueScale): IMinMaxValues<number> {
    let dateScale = this.chart.dateScale,
      startIndex = dateScale.firstVisibleIndex,
      count = dateScale.lastVisibleIndex - startIndex + 1;

    return this.minMaxValues(startIndex, count, valueScale);
  }

  /**
   * Returns the string representation of a given value.
   * @method formatValue
   * @param {number} value The value.
   * @returns {string}
   * @memberOf StockChartX.ChartPanel#
   */
  formatValue(value: number): string {
    return this.valueScale.formatValue(value);
  }

  /**
   * @inheritdoc
   */
  hitTest(point: IPoint): boolean {
    return this._contentFrame.containsPoint(point);
  }

  /**
   * Saves state.
   * @method saveState
   * @returns {object}
   * @see [loadState]{@linkcode StockChartX.ChartPanel#loadState} to load state.
   * @memberOf StockChartX.ChartPanel#
   */
  saveState() {
    let state = {
      options: JsUtil.clone(this._options),
      valueScales: []
    };

    for (let scale of this._valueScales) {
      state.valueScales.push(scale.saveState());
    }

    return state;
  }

  /**
   * Loads state.
   * @method loadState
   * @param {object} state The state saved by saveState function.
   * @see [saveState]{@linkcode StockChartX.ChartPanel#saveState} to save state.
   * @memberOf StockChartX.ChartPanel#
   */
  loadState(state: any) {
    state = state || {};
    let optionsState = state.options || {};

    this._options = <IChartPanelOptions>{};
    this._options.panelPadding = optionsState.panelPadding;
    this.minHeightRatio =
      optionsState.minHeightRatio !== undefined
        ? optionsState.minHeightRatio
        : 0.05;
    this.maxHeightRatio = optionsState.maxHeightRatio || 1;
    this.heightRatio = optionsState.heightRatio || 1;

    this.xGridVisible =
      optionsState.showXGrid !== undefined ? !!optionsState.showXGrid : true;
    this.yGridVisible =
      optionsState.showYGrid !== undefined ? !!optionsState.showYGrid : true;
    this.moveDirection =
      optionsState.moveDirection || PanelMoveDirection.HORIZONTAL;
    this.moveKind = optionsState.moveKind || PanelMoveKind.AUTOSCALED;

    this.state = optionsState.state || PanelState.NORMAL;
    this.visible = optionsState.visible == null ? true : optionsState.visible;
    this.showIndicatorTitles =
      optionsState.showIndicatorTitles != null
        ? optionsState.showIndicatorTitles
        : true;

    let scales = (this._valueScales = []),
      scalesState = state.valueScales || [state.valueScale];
    for (let i = 0, count = this.chart.valueScales.length; i < count; i++) {
      let scale = new ChartPanelValueScale({
        chartPanel: this
      });
      scales.push(scale);
      scale.loadState(scalesState[i]);
    }
  }

  preferredValueScaleWidth(chartScale: ValueScale): number {
    let maxWidth = 0;

    for (let scale of this._valueScales) {
      if (scale.chartValueScale === chartScale)
        maxWidth = Math.max(maxWidth, scale.preferredWidth());
    }

    return maxWidth;
  }

  /**
   * @inheritdoc
   */
  layout(frame: Rect) {
    this._layoutHtmlElements(frame);

    for (let scale of this._valueScales) scale.layout(frame);

    JsUtil.sort(
      this._objects,
      (left: ChartPanelObject, right: ChartPanelObject) =>
        Math.roundToDecimals(left.zIndex - right.zIndex, 5)
    );
  }

  /**
   * @inheritdoc
   */
  draw() {
    let context = this._layer.context,
      width = this._layer.size.width,
      height = this._layer.size.height;

    context.save();

    context.clearRect(0, 0, width, height);
    context.translate(0.5, 0.5);

    this.drawGridLines();

    for (let scale of this._valueScales) scale.draw();

    for (let obj of this._objects) {
      obj.drawValueMarkers();
    }

    let clipFrame = this._contentFrame;
    context.beginPath();
    context.rect(clipFrame.left, 0, clipFrame.width, clipFrame.height);
    context.clip();

    for (let obj of this._objects) {
      if (obj instanceof Drawing) {
        let drawing = <Drawing>obj;
        if (this.chart.showDrawings) {
          drawing.draw();
          if (drawing.selected) drawing.drawDateMarkers();
        } else {
          drawing.tooltip.hide(); // TODO: To review
        }
      } else {
        obj.draw();
      }
    }

    for (let indicator of this.indicators) {
      indicator.draw();

      if (this !== this.chart.mainPanel) {
        if (indicator === this.indicators[0]) {
          indicator.showTitle = true;
          continue;
        }
      }
      indicator.showTitle = this.showIndicatorTitles;
    }

    context.restore();

    this.updateHoverRecord();
  }

  drawGridLines() {
    let xGrid = this.chart.xGridVisible && this.xGridVisible,
      yGrid = this.chart.yGridVisible && this.yGridVisible;
    if (!xGrid && !yGrid) return;

    let theme = this.actualTheme,
      frame = this._contentFrame,
      context = this._layer.context;

    context.scxApplyStrokeTheme(theme.grid);
    context.beginPath();
    if (xGrid) {
      let majorTicks = this.chart.dateScale.calibrator.majorTicks;

      for (let tick of majorTicks) {
        context.moveTo(tick.x, 0);
        context.lineTo(tick.x, frame.height);
      }
    }
    if (yGrid) {
      let majorTicks = this.valueScale.calibrator.majorTicks;

      for (let tick of majorTicks) {
        context.moveTo(frame.left, tick.y);
        context.lineTo(frame.left + frame.width, tick.y);
      }
    }
    context.stroke();
  }

  /**
   * Layouts and draws chart panel.
   * @method update
   * @memberOf StockChartX.ChartPanel#
   */
  update() {
    this.layout(this.frame);
    this.draw();
  }

  setNeedsUpdate(needsAutoScale?: boolean) {
    if (needsAutoScale) this.setNeedsAutoScale();
    this._updateAnimation.start();
  }

  /**
   * @internal
   */
  _onUpdateAnimationCallback() {
    this.update();
  }

  // region IDestroyable

  /**
   * @inheritDoc
   */
  destroy() {
    this._unsubscribe();

    if (this.chartContextMenu) this.chartContextMenu.destroy();

    this._updateAnimation.destroy();
    for (let obj of this._objects) obj.destroy();
    for (let component of this._components) component.destroy();

    super.destroy();
  }

  // endregion

  /**
   * @internal
   */
  private _initInstrumentPanelTitle() {
    let menuConfig = {
      chart: this.chart,
      showOnClick: true,
      chartPanel: this,
      onItemSelected: (menuItem: any) => {
        switch (menuItem.data("id")) {
          case ChartContextMenu.MenuItem.FORMAT:
            this.showPriceStyleFormatDialog();
            break;
          default:
            break;
        }
      }
    };

    let symbolTitle = this._controls.title.scxAppend("div", Class.SYMBOL_TITLE),
      symbol = symbolTitle.scxAppend("span", Class.TITLE_CAPTION),
      date = symbolTitle.scxAppend("span", Class.TITLE_VALUE);

    symbolTitle
      .scxAppend("span", Class.TITLE_VALUE)
      .scxLocalize("chartPanel.title.abbreviations.open");
    let open = symbolTitle.scxAppend("span", Class.TITLE_VALUE);

    symbolTitle
      .scxAppend("span", Class.TITLE_VALUE)
      .scxLocalize("chartPanel.title.abbreviations.height");
    let high = symbolTitle.scxAppend("span", Class.TITLE_VALUE);

    symbolTitle
      .scxAppend("span", Class.TITLE_VALUE)
      .scxLocalize("chartPanel.title.abbreviations.low");
    let low = symbolTitle.scxAppend("span", Class.TITLE_VALUE);

    symbolTitle
      .scxAppend("span", Class.TITLE_VALUE)
      .scxLocalize("chartPanel.title.abbreviations.close");
    let close = symbolTitle.scxAppend("span", Class.TITLE_VALUE);

    this._barInfoControls = {
      rootDiv: symbolTitle,
      symbol,
      date,
      open,
      high,
      low,
      close,
      series: this.chart.barDataSeries(this.getDataSeriesPrefix())
    };
    this._titleNeedsUpdate = true;
    this._updateInstrument();
    this.updateHoverRecord();

    this.chartContextMenu = symbol.scx().chartContextMenu(menuConfig);
  }

  showPriceStyleFormatDialog() {
    ViewLoader.priceStyleSettingsDialog((dialog: PriceStyleSettingsDialog) => {
      dialog.show({
        chart: this.chart,
        priceStyle: this.chart.priceStyle,
        chartPanel : this
      });
    });
  }

  /**
   * Update values in the title.
   * @method updateHoverRecord
   * @param {Number} [record] The currently hover record number.
   * @memberOf StockChartX.ChartPanel#
   * @private
   * @internal
   */
  updateHoverRecord(record?: number) {
    if (!this._barInfoControls) return;

    let series = this._barInfoControls.series,
      recordCount = series.close.length;
    if (recordCount <= 0) return;

    if (record == null) record = this.chart.hoveredRecord;
    if (record == null || record < 0 || record >= recordCount || isNaN(record))
      record = recordCount - 1;

    let controls = this._barInfoControls,
      openPrice = series.open.valueAtIndex(record),
      closePrice = series.close.valueAtIndex(record),
      isRaising = closePrice >= openPrice,
      theme = this.chart.theme,
      candleTheme = theme.plot.bar.candle,
      properCandleTheme = isRaising
        ? candleTheme.upCandle
        : candleTheme.downCandle,
      color = properCandleTheme.fill.fillColor,
      dateText = this.chart.dateScale.formatDate(
        series.date.valueAtIndex(record)
      );

    controls.date.text(dateText);
    controls.open.text(this.formatValue(openPrice)).css("color", color);
    controls.high
      .text(this.formatValue(series.high.valueAtIndex(record)))
      .css("color", color);
    controls.low
      .text(this.formatValue(series.low.valueAtIndex(record)))
      .css("color", color);
    controls.close.text(this.formatValue(closePrice)).css("color", color);
    if (!(Environment.isMobile || Environment.isPhone)) {
      if (this._titleNeedsUpdate) {
        let textWidth =
            DummyCanvasContext.textWidth(dateText, theme.valueScale.text) + 20,
          controlWidth = controls.date.width();
        if (controlWidth < textWidth || controlWidth > 1.3 * textWidth)
          controls.date.width("auto").width(textWidth);
        this._titleNeedsUpdate = false;
      }
    }
  }

  /**
   * @internal
   */
  protected _subscribe() {
    let chart = this.chart;

    chart.on(
      ChartEvent.THEME_CHANGED + EventSuffix,
      () => {
        this._applyTheme();
      },
      this
    );
    if (chart.mainPanel === this || this.symbol) {
      chart.on(
        ChartEvent.HOVER_RECORD_CHANGED + EventSuffix,
        (event: IValueChangedEvent) => {
          this.updateHoverRecord(event.value);
        },
        this
      );
      chart.on(
        ChartEvent.INSTRUMENT_CHANGED + EventSuffix,
        () => {
          this._updateInstrument();
        },
        this
      );
    }
    chart.on(
      ChartEvent.VALUE_SCALE_ADDED + EventSuffix,
      () => {
        this._valueScales.push(new ChartPanelValueScale({ chartPanel: this }));
      },
      this
    );
    chart.on(
      ChartEvent.VALUE_SCALE_REMOVED + EventSuffix,
      (event: IValueChangedEvent) => {
        this._valueScales.splice(event.value, 1);
      },
      this
    );
    chart.on(
      ChartEvent.PRICE_STYLE_CHANGED + EventSuffix,
      (event: IValueChangedEvent) => {
        if (this._barInfoControls)
          this._barInfoControls.series = this.chart.primaryBarDataSeries();
      },
      this
    );
  }

  /**
   * @internal
   */
  protected _unsubscribe() {
    let chart = this.chart;
    const symbol = this.symbol;
    if(symbol){
      symbol.unsubscribe();
    }
    if (chart) {
    chart.off(EventSuffix, this);
    }
  }

  /**
   * @internal
   */
  protected _initGestures(): GestureArray {
    return new GestureArray(
      [
        new PanGesture({
          handler: this._handlePanGesture,
          hitTest: this._panGestureHitTest
        }),
        new MouseWheelGesture({
          handler: this._handleMouseWheel,
          hitTest: this.hitTest
        }),
        new ClickGesture({
          handler: this._handleClickGesture,
          hitTest: this.hitTest
        }),
        new DoubleClickGesture({
          handler: this._handleDoubleClickGesture,
          hitTest: this.hitTest
        }),
        new MouseHoverGesture({
          handler: this._handleMouseHoverGesture,
          hitTest: this.hitTest,
          hoverEventEnabled: false
        }),
        new ContextMenuGesture({
          handler: this._handleContextMenuGesture,
          hitTest: this.hitTest
        })
      ],
      this
    );
  }

  /**
   * @internal
   */
  private _panGestureHitTest(point: IPoint) {
    if (this.moveDirection === PanelMoveDirection.NONE) return false;

    return this.hitTest(point);
  }

  /**
   * @internal
   */
  private _handlePanGesture(gesture: PanGesture) {
    let chart = this.chart;
    if (!chart.scrollEnabled) return;

    switch (gesture.state) {
      case GestureState.STARTED:
        chart.rootDiv.addClass(Class.SCROLL);
        break;
      case GestureState.FINISHED:
        chart.rootDiv.removeClass(Class.SCROLL);
        break;
      case GestureState.CONTINUED:
        let offset = gesture.moveOffset,
          i,
          valueScales;

        switch (this.moveDirection) {
          case PanelMoveDirection.HORIZONTAL:
            if (
              (chart.crossHairType === CrossHairType.NONE ||
                gesture.pointerKind === PointerKind.MOUSE) &&
              chart.dateScale.scrollOnPixels(offset.x)
            ) {
              let autoscale = this.moveKind === PanelMoveKind.AUTOSCALED;
              chart.setNeedsUpdate(autoscale);
            }
            break;
          case PanelMoveDirection.VERTICAL:
            for (
              i = 0, valueScales = this.valueScales;
              i < valueScales.length;
              i++
            )
              valueScales[i]._zoomOrScrollWithUpdate(
                offset.y,
                this.valueScale.scrollOnPixels
              );
            break;
          case PanelMoveDirection.ANY:
            // If date scale is updated then we have to redraw whole chart.
            if (
              chart.dateScale.scrollOnPixels(offset.x) ||
              this.moveKind === PanelMoveKind.AUTOSCALED
            ) {
              for (
                i = 0, valueScales = this.valueScales;
                i < valueScales.length;
                i++
              )
                valueScales[i].scrollOnPixels(offset.y);

              let autoscale = this.moveKind === PanelMoveKind.AUTOSCALED;
              chart.setNeedsUpdate(autoscale);
            } else {
              // Otherwise we can just redraw panel to increase performance.
              for (
                i = 0, valueScales = this.valueScales;
                i < valueScales.length;
                i++
              )
                valueScales[i]._zoomOrScrollWithUpdate(
                  offset.y,
                  this.valueScale.scrollOnPixels
                );
            }
            break;
          default:
            return;
        }
        break;
      default:
        break;
    }
  }

  /**
   * @internal
   */
  private _handleMouseHoverGesture(gesture: MouseHoverGesture) {
    this._optionControls.handleMouseHoverGesture(gesture);
  }

  /**
   * @internal
   */
  private _handleMouseWheel(gesture: MouseWheelGesture, event: IWindowEvent) {
    if (!this.chart.zoomEnabled) return;

    let width = this.contentFrame.width,
      pixels = width * 0.05,
      multiplier = event.pointerPosition.x / width;

    this.chart.dateScale._handleZoom(-gesture.delta * pixels, multiplier);
  }

  /**
   * @internal
   */
  private _handleClickGesture() {
    let chart = this.chart,
      selectedObject = chart.selectedObject;

    if (selectedObject) {
      chart.selectObject(null);
      if (this.containsDrawing(<Drawing>selectedObject)) this.setNeedsUpdate();
      else chart.setNeedsUpdate();
    }
  }

  /**
   * @internal
   */
  private _handleDoubleClickGesture() {
    this._fire(PanelEvent.DOUBLE_CLICKED, this);
  }

  private _handleContextMenuGesture() {
    this._fire(PanelEvent.CONTEXT_MENU, this);
  }

  /**
   * @internal
   */
   _createContainer(): JQuery {
    let div = this.chartPanelsContainer.container.scxAppend(
        "div",
        Class.CONTAINER
      ),
      isMainPanel = this === this.chart.mainPanel;

    this._container = div;
    this._layer = new Layer({ parent: div });
    let title = (this._controls.title = div.scxAppend("div", Class.TITLE));

    let toggleElement = $(
      `<span class="${Class.TOGGLE_INDICATOR_TITLES} ${Class.OPTIONS_ICON}"/>`
    )
      .attr("data-i18n", "[title]chartPanel.title.showHideTitles")
      .on(MouseEvent.CLICK, () => {
        this.showIndicatorTitles = !this.showIndicatorTitles;
        this.setNeedsUpdate();
      });

    toggleElement.addClass(
      this.showIndicatorTitles
        ? Class.INDICATOR_TITLE_HIDE
        : Class.INDICATOR_TITLE_SHOW
    );
    title.append(toggleElement);

    this._toggleIndicatorTitles = toggleElement;

    if (isMainPanel) {
      this.addComponent(new InstrumentWatermark());
      this._initInstrumentPanelTitle();
    } else if (this.symbol) {
      this._initInstrumentPanelTitle();
    }

    this._applyTheme();
    this._subscribe();

    return div;
  }

  /**
   * @internal
   */
  private _layoutHtmlElements(frame: Rect) {
    super.layout(frame);

    let containerFrame = this._panelsContainer.panelsContentFrame;
    this._contentFrame.copyFrom(frame);
    this._contentFrame.left = containerFrame.left;
    this._contentFrame.width = containerFrame.width;

    this._layer.size = {
      width: this.container.width(),
      height: this.container.height()
    };

    let isMainPanel = this === this.chart.mainPanel;
    if (isMainPanel) {
      this._barInfoControls.rootDiv.css(
        "display",
        this.chart.showBarInfoInTitle ? "block" : "none"
      );
      this._toggleIndicatorTitles.css(
        "display",
        this.indicators.length > 0 ? "block" : "none"
      );
    } else {
      this._toggleIndicatorTitles.css(
        "display",
        this.indicators.length > 1 ? "block" : "none"
      );
    }

    for (let component of this._components) component.layout(frame);

    let titleDiv = this._controls.title;
    titleDiv
      .scxPosition(this._contentFrame.left, 0)
      .outerWidth(this._contentFrame.width);
    this._optionControls.layout(titleDiv);
  }

  /**
   * @internal
   */
  private _updateInstrument() {
    if (this._barInfoControls) {
      this._barInfoControls.symbol.text(this.getInstrumentTitle());
    }
  }

  /**
   * @internal
   */
  private getInstrumentTitle() {
    const isMainPanel = this === this.chart.mainPanel;
    if (isMainPanel) {
      let instrument = this.chart.instrument;
      if (instrument) return instrument.symbol;
    } else if (this.symbol) {
      return this.symbol.getSymbolName();
    }
  }

  /**
   * @internal
   */
  private _applyTheme() {
    let title = this.titleDiv;
    if (!title) return;
    this._titleNeedsUpdate = true;

    let theme = this.actualTheme;

    title.scxTextStyle(theme.title);

    for (let component of this._components) component.applyTheme();
  }

  // region Watermarks routines

  /**
   * Adds html component (e.g. watermark).
   * @method addComponent
   * @param {StockChartX.ChartPanelHtmlComponent} component The component.
   * @memberOf StockChartX.ChartPanel#
   * @since 2.16.1
   */
  addComponent(component: IChartPanelHtmlComponent) {
    if (this._components.indexOf(component) >= 0) {
      throw new Error("An item already exists.");
    }

    component.chartPanel = this;
    this._components.push(component);
  }

  /**
   * Removes html component.
   * @method removeComponent
   * @param {StockChartX.ChartPanelHtmlComponent} component The component.
   * @memberOf StockChartX.ChartPanel#
   * @since 2.16.1
   */
  removeComponent(component: IChartPanelHtmlComponent) {
    let components = this._components;
    let index = components.indexOf(component);
    if (index >= 0) {
      components[index].destroy();
      components.splice(index, 1);
    }
  }

  // endregion
}
