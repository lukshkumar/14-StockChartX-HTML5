import { ChartPanelSplitter } from "../index";

import { JsUtil } from "../index";
import { IStateProvider } from "../index";
import { PanelState, IRect } from "../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { IPadding, Rect } from "../index";
import { IChartHtmlControlConfig, ChartHtmlControl } from "../index";
import { ChartPanel } from "../index";
import { GestureArray } from "../index";
import { MouseHoverGesture } from "../index";
import { ChartEvent } from "../index";

import { IWindowEvent, Gesture } from "../index";
import { IPoint } from "../index";
import { Drawing } from "../index";
"use strict";

// region Interfaces

interface IChartPanelsContainerOptions {
  newPanelHeightRatio: number;
  panelPadding: IPadding;
}

export interface IChartPanelsContainerConfig extends IChartHtmlControlConfig {}

export interface IChartPanelsContainerState {
  newPanelHeightRatio?: number;
  panelPadding?: IPadding;
  panels?: any[];
}

// endregion

// region Declarations

const $ = window.jQuery;
const CLASS_CONTAINER = "scxPanelsContainer";
const EVENTS_SUFFIX = ".scxPanelsContainer";

// endregion

/**
 * Represents container for chart panels.
 * @param {Object} config The configuration object.
 * @param {StockChartX.chart} config.chart The parent chart.
 * @constructor StockChartX.ChartPanelsContainer
 * @augments StockChartX.Control
 */
export class ChartPanelsContainer extends ChartHtmlControl
  implements IStateProvider<IChartPanelsContainerState> {
  // region Properties

  /**
   * @internal
   */
  private _panels: ChartPanel[] = [];

  /**
   * Gets array of chart panels.
   * @name panels
   * @type {StockChartX.ChartPanel[]}
   * @readonly
   * @memberOf StockChartX.ChartPanelsContainer#
   */
  get panels(): ChartPanel[] {
    return this._panels;
  }

  /**
   * Gets/Sets default height ratio of new chart panels. The value must be in range (0..1).
   * @name newPanelHeightRatio
   * @type {Number}
   * @default 0.2
   * @memberOf StockChartX.ChartPanelsContainer#
   */
  get newPanelHeightRatio(): number {
    return this._options.newPanelHeightRatio;
  }

  set newPanelHeightRatio(value: number) {
    if (!JsUtil.isPositiveNumber(value) || value >= 1)
      throw new Error("Ratio must be a number in range (0..1)");

    this._options.newPanelHeightRatio = value;
  }

  /**
   * Gets/Sets content padding of each panel.
   * @name panelPadding
   * @type {StockChartX~Padding}
   * @memberOf StockChartX.ChartPanelsContainer#
   * @private
   * @internal
   */
  get panelPadding(): IPadding {
    return this._options.panelPadding;
  }

  set panelPadding(value: IPadding) {
    this._options.panelPadding = value;
  }

  // noinspection JSMismatchedCollectionQueryUpdate
  /**
   * The array of chart panel splitters.
   * @name _splitters
   * @type {Array}
   * @memberOf StockChartX.ChartPanelsContainer#
   * @private
   * @internal
   */
  private _splitters: ChartPanelSplitter[] = [];

  /**
   * @internal
   */
  private _options: IChartPanelsContainerOptions = <
    IChartPanelsContainerOptions
  >{};

  /**
   * @internal
   */
  private _panelsContentFrame = new Rect();

  /**
   * Gets panels content frame rectangle (excluding value scales).
   * @name panelsContentFrame
   * @type {StockChartX.Rect}
   * @readonly
   * @memberOf StockChartX.ChartPanelsContainer#
   */
  get panelsContentFrame(): Rect {
    return this._panelsContentFrame;
  }

  // endregion

  constructor(config: IChartPanelsContainerConfig) {
    super(config);

    this.loadState(config as any);
    if (this._panels.length === 0) {
      this._panels.push(
        new ChartPanel({
          chartPanelsContainer: this
        })
      );
    }
  }

  // region Events and Gestures

  /**
   * @internal
   */
  protected _initGestures(): GestureArray {
    return new GestureArray(
      [
        new MouseHoverGesture({
          handler: this._handleMouseHoverGesture,
          hitTest: this._mouseHoverHitTest
        })
      ],
      this
    );
  }

  /**
   * @internal
   */
  protected _subscribe() {
    this.chart.on(ChartEvent.THEME_CHANGED + EVENTS_SUFFIX, () => {
      for (let splitter of this._splitters) {
        splitter.invalidateTheme();
      }
    });
  }

  /**
   * @internal
   */
  protected _unsubscribe() {
    this.chart.off(EVENTS_SUFFIX, this);
  }

  /**
   * @inheritDoc
   */
  handleEvent(event: IWindowEvent): boolean {
    for (let splitter of this._splitters) {
      if (splitter.handleEvent(event)) return true;
    }

    super.handleEvent(event);

    // Convert point to chart panels container coordinate system.
    event.pointerPosition.x -= this.frame.left;
    event.pointerPosition.y -= this.frame.top;

    for (let panel of this._panels) {
      if (panel.handleEvent(event)) return true;
    }

    return false;
  }

  /**
   * @internal
   */
  private _handleMouseHoverGesture(gesture: Gesture, event: IWindowEvent) {
    this.chart.crossHair.handleMouseHoverGesture(gesture, event);
  }

  /**
   * @internal
   */
  private _mouseHoverHitTest(point: IPoint) {
    return this._panelsContentFrame.containsPoint(point);
  }

  // endregion

  // region Panels routines

  /**
   * Adds new chart panel.
   * @method addPanel
   * @param {Number} [index] The index to insert panel at.
   * @param {Number} [heightRatio] The height ratio of new panel.
   * @param {Boolean} [shrinkMainPanel] True to shrink main panel, false to shrink all panels.
   * @returns {StockChartX.ChartPanel} The newly created chart panel.
   * @throws An error is thrown on lack of free space.
   * @memberOf StockChartX.ChartPanelsContainer#
   * @see [removePanel]{@linkcode StockChartX.ChartPanelsContainer#removePanel}
   */
  addPanel(
    index?: number,
    heightRatio?: number,
    shrinkMainPanel?: boolean
  ): ChartPanel {
    let panels = this._panels;
    let newHeightRatio = heightRatio || this.newPanelHeightRatio;
    let panel = new ChartPanel({
      chartPanelsContainer: this,
      options: {
        heightRatio: newHeightRatio
      }
    });

    try {
      if (shrinkMainPanel && panels.length > 0) {
        let mainPanel = this.chart.mainPanel,
          mainPanelRatio = mainPanel.heightRatio - newHeightRatio;

        if (mainPanelRatio >= mainPanel.minHeightRatio)
          mainPanel.heightRatio = mainPanelRatio;
        else this._adjustHeightRatiosToEncloseNewRatio(newHeightRatio);
      } else {
        this._adjustHeightRatiosToEncloseNewRatio(newHeightRatio);
      }
    } catch (exception) {
      let availableHeightRatio = this._availableHeightRatio();

      if (
        availableHeightRatio > 0 &&
        availableHeightRatio >= panel.minHeightRatio
      )
        panel.heightRatio = availableHeightRatio;
      else throw exception;
    }

    if (index == null) panels.push(panel);
    else panels.splice(index, 0, panel);
    this._updateSplitters();

    this.chart.fireValueChanged(ChartEvent.PANEL_ADDED, panel);

    return panel;
  }

  /**
   * Removes given chart panel.
   * @method removePanel
   * @param {number | StockChartX.ChartPanel} panel The index of chart panel or chart panel object to be removed.
   * @throws An error is thrown on attempt to remove main panel.
   * @memberOf StockChartX.ChartPanelsContainer#
   * @see [addPanel]{@linkcode StockChartX.ChartPanelsContainer#addPanel}
   */
  removePanel(panel: number | ChartPanel) {
    let chartPanel: ChartPanel;

    if (typeof panel === "number") {
      // It's an index of panel. Need to find panel object.
      chartPanel = this._panels[panel];
    } else {
      chartPanel = panel;
    }

    // Main panel must not be removed.
    let chart = this.chart,
      mainPanel = chart.mainPanel;
    if (chartPanel === mainPanel)
      throw new Error("Main panel cannot be removed.");

    let panels = this._panels;
    for (let i = 0; i < panels.length; i++) {
      if (panels[i] === chartPanel) {
        let selectedDrawing = <Drawing>chart.selectedObject;
        if (selectedDrawing && selectedDrawing.chartPanel === chartPanel)
          chart.selectObject(null);

        // Indicators are stored in chart. Remove all indicators from this panel.
        chart.removeIndicators(chartPanel.indicators, false);

        let newMainRatio = mainPanel.heightRatio + chartPanel.heightRatio;
        mainPanel.heightRatio = Math.min(
          Math.roundToDecimals(newMainRatio, 8),
          1
        );
        panels.splice(i, 1);
        chartPanel.destroy();
        this._updateSplitters();

        chart.fireValueChanged(ChartEvent.PANEL_REMOVED, chartPanel);

        break;
      }
    }

    this.chart.setNeedsUpdate(true);
  }

  /**
   * Moves panel up/down.
   * @method movePanel
   * @param {StockChartX.ChartPanel} panel The panel to move.
   * @param {number} offset The panel index offset (positive number to move up, negative to move down).
   * @memberOf StockChartX.ChartPanelsContainer#
   */
  movePanel(panel: ChartPanel, offset: number) {
    if (!JsUtil.isFiniteNumber(offset))
      throw new TypeError("Offset must be a number.");

    let panels = this._panels;
    for (let i = 0; i < panels.length; i++) {
      if (panels[i] === panel) {
        let newIndex = Math.min(Math.max(i - offset, 0), panels.length - 1);
        if (newIndex !== i) {
          panels.splice(i, 1);
          panels.splice(newIndex, 0, panel);
        }

        break;
      }
    }
    this._updateSplitters();
  }

  /**
   * @internal
   */
  totalPanelsHeight(): number {
    let size = this.container.scxContentSize(),
      splitterHeight = ChartPanelSplitter.getHeight();

    return size.height - splitterHeight * (this._panels.length - 1);
  }

  /**
   * Gets chart panel at a given Y coordinate.
   * @method findPanelAt
   * @param {number} y The Y coordinate.
   * @returns {StockChartX.ChartPanel}
   * @memberOf StockChartX.ChartPanelsContainer#
   */
  findPanelAt(y: number): ChartPanel {
    y -= this.frame.top;

    for (let panel of this._panels) {
      let frame = panel.frame;
      if (y >= frame.top && y <= frame.bottom) return panel;
    }

    return null;
  }

  /**
   * Sets panel height ratio. Unlike heightRatio property of the chart panel this method updates height ratio of the main panel.
   * So if you increase panel height ratio by 0.1, height ratio of the main panel will be decreased by 0.1.
   * @method setPanelHeightRatio
   * @param {StockChartX.ChartPanel} panel The chart panel to set height ratio to.
   * @param {number} ratio The new height ratio.
   * @memberOf StockChartX.ChartPanelsContainer#
   */
  setPanelHeightRatio(panel: ChartPanel, ratio: number) {
    let mainPanel = this.chart.mainPanel;
    if (panel === mainPanel) {
      panel.heightRatio = ratio;
    } else {
      let oldRatio = panel.heightRatio;
      panel.heightRatio = ratio;
      mainPanel.heightRatio -= panel.heightRatio - oldRatio;
    }
  }

  /**
   * @internal
   */
  private _availableHeightRatio(): number {
    return (
      1 -
      this._panels.reduce(
        (sum: number, panel: ChartPanel) => sum + panel.heightRatio,
        0
      )
    );
  }

  /**
   * @internal
   */
  private _adjustHeightRatiosToEncloseNewRatio(newRatio: number) {
    let panels = this._panels,
      origHeightRatios = panels.map((item: ChartPanel) => item.heightRatio);

    while (true) {
      let excess = newRatio - this._availableHeightRatio();
      if (excess <= 1e-5) break;

      let isUpdated = false;
      for (let panel of panels) {
        let decreasedRatio = panel.heightRatio - excess * panel.heightRatio;

        if (decreasedRatio >= panel.minHeightRatio) {
          panel.heightRatio = decreasedRatio;
          isUpdated = true;
        }
      }

      if (!isUpdated) {
        // Restore height ratios.
        for (let i = 0; i < origHeightRatios.length; i++)
          panels[i].heightRatio = origHeightRatios[i];

        throw new Error(
          "Insufficient height. Other panels use too much height. " +
            "You have to update minimum height weight of existing panels to free some space."
        );
      }
    }
  }

  // endregion

  // region Splitters

  /**
   * @internal
   */
  private _updateSplitters() {
    let panels = this._panels,
      splitters = this._splitters,
      newSplittersCount = panels.length - 1,
      removeStartIndex = splitters.length - 1 - newSplittersCount;

    if (removeStartIndex >= 0) {
      for (let item of splitters) item.destroy();
      splitters.splice(removeStartIndex, splitters.length - removeStartIndex);
    }

    for (let i = 0; i < newSplittersCount; i++) {
      let isNewObj = i >= splitters.length,
        splitter = isNewObj ? new ChartPanelSplitter() : splitters[i];

      splitter.setPanels(i, panels[i], panels[i + 1]);
      if (isNewObj) splitters.push(splitter);
    }
  }

  // endregion

  // region State management

  /**
   * Save all chart panels state.
   * @method saveState
   * @returns {Object[]}
   * @memberOf StockChartX.ChartPanelsContainer#
   * @see [loadState]{@linkcode StockChartX.ChartPanelsContainer#loadState} to load state.
   */
  saveState(): IChartPanelsContainerState {
    let state = <IChartPanelsContainerState>JsUtil.clone(this._options);
    state.panels = [];

    for (let panel of this._panels) {
      state.panels.push(panel.saveState());
    }

    return state;
  }

  /**
   * Loads state.
   * @method loadState
   * @param {Object[]} state The state saved by saveState method.
   * @memberOf StockChartX.ChartPanelsContainer#
   * @see [saveState]{@linkcode StockChartX.ChartPanelsContainer#saveState} to save state.
   */
  loadState(state: IChartPanelsContainerState) {
    state = state || <IChartPanelsContainerState>{};

    this._options = <IChartPanelsContainerOptions>{};
    this.newPanelHeightRatio = state.newPanelHeightRatio || 0.2;
    this.panelPadding = state.panelPadding || {
      left: 5,
      top: 10,
      right: 5,
      bottom: 10
    };

    let panels = this._panels;
    for (let panel of panels) {
      panel.destroy();
    }
    panels.length = 0;

    if (state.panels) {
      for (let panelState of state.panels) {
        let config = $.extend({ chartPanelsContainer: this }, panelState);
        let panel = new ChartPanel(config);

        panels.push(panel);
      }
    }
    this._updateSplitters();
  }

  // endregion

  // region Layout

  /**
   * @internal
   */
  protected _createContainer(): JQuery {
    return this.chart.rootDiv.scxAppend("div", CLASS_CONTAINER);
  }

  /**
   * Marks that value scales needs to be auto-scaled on next layout.
   * @method setNeedsAutoScale
   * @memberOf StockChartX.ChartPanelsContainer#
   */
  setNeedsAutoScale() {
    for (let panel of this._panels) panel.setNeedsAutoScale();
  }

  /**
   * Layouts chart panels container only.
   * @method layoutScalePanel
   * @param {StockChartX.Rect} chartPanelsFrame The chart panels container frame rectangle
   * @memberOf StockChartX.ChartPanelsContainer#
   */
  layoutScalePanel(chartPanelsFrame: Rect) {
    super.layout(chartPanelsFrame);

    // Layout value scales
    let size = this.container.scxContentSize();
    let contentFrame = this._panelsContentFrame;
    contentFrame.left = chartPanelsFrame.left;
    contentFrame.top = chartPanelsFrame.top;
    contentFrame.width = size.width;
    contentFrame.height = size.height;

    let scales = this.chart.valueScales;
    for (let i = scales.length - 1; i >= 0; i--) {
      contentFrame = scales[i].layout(contentFrame);
    }
    this._panelsContentFrame = contentFrame;

    return new Rect({
      left: contentFrame.left,
      top: contentFrame.top,
      width: contentFrame.width,
      height: chartPanelsFrame.height
    });
  }

  /**
   * @inheritdoc
   */
  layout(frame: IRect) {
    let maxPanel;

    for (let panel of this.panels) {
      if (panel.state === PanelState.MAXIMIZED) {
        maxPanel = panel;
        break;
      }
    }
    if (maxPanel) this.layoutMaxPanel(maxPanel);
    else this.layoutNormalPanels();
  }

  private layoutMaxPanel(maxPanel: ChartPanel) {
    for (let panel of this.panels) panel.visible = panel === maxPanel;

    let top = 0;
    let contentHeight = this.totalPanelsHeight();
    let size = this.container.scxContentSize();
    let panelFrame = new Rect({
      left: 0,
      top,
      width: size.width,
      height: contentHeight
    });
    maxPanel.layout(panelFrame);

    for (let splitter of this._splitters) {
      splitter.destroy();
    }
    this._splitters = [];
  }

  private layoutNormalPanels() {
    this._updateSplitters();
    for (let panel of this.panels) panel.visible = true;

    let size = this.container.scxContentSize();
    let splitterHeight = ChartPanelSplitter.getHeight();
    let panelsCount = this._panels.length;
    let contentHeight = this.totalPanelsHeight();
    let top = 0;
    for (let i = 0; i < panelsCount; i++) {
      let panel = this._panels[i];
      let height = Math.round(contentHeight * panel.heightRatio);

      let panelFrame = new Rect({
        left: 0,
        top,
        width: size.width,
        height
      });

      top += height;
      panel.layout(panelFrame);

      if (i < panelsCount - 1) {
        let splitterFrame = new Rect({
          left: 0,
          top,
          width: size.width,
          height: splitterHeight
        });
        this._splitters[i].layout(splitterFrame);
        top += splitterHeight;
      }
    }
  }

  /**
   * @internal
   */
  layoutSplitterPanels(splitter: ChartPanelSplitter) {
    let contentHeight = this.totalPanelsHeight(),
      updatePanelFunc = (panel: ChartPanel) => {
        panel.frame.height = Math.round(contentHeight * panel.heightRatio);
        panel.setNeedsUpdate();
      };

    let topPanel = splitter.topPanel;
    updatePanelFunc(topPanel);

    let splitterFrame = splitter.frame;
    splitterFrame.top = topPanel.frame.bottom;
    splitter.layout(splitterFrame);

    let bottomPanel = splitter.bottomPanel;
    bottomPanel.frame.top = splitterFrame.top + ChartPanelSplitter.getHeight();
    updatePanelFunc(bottomPanel);
  }

  // endregion

  /**
   * @inheritdoc
   */
  draw() {
    for (let panel of this._panels) if (panel.visible) panel.draw();
  }

  // region IDestroyable

  /**
   * @inheritdoc
   */
  destroy() {
    for (let panel of this._panels) panel.destroy();
    for (let splitter of this._splitters) splitter.destroy();

    super.destroy();
  }

  // endregion
}
