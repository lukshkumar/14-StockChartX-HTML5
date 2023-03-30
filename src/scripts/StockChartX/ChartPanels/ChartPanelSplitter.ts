import { MouseHoverGesture } from "../index";
import { HtmlControl } from "../index";
import { ChartPanel } from "../index";
import { ChartState } from "../index";
import { GestureArray } from "../index";
import { PanGesture } from "../index";
import { ClickGesture } from "../index";
import { GestureState, IWindowEvent } from "../index";
import { IPoint, Chart, Rect } from "../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

// region Declarations

const Class = {
  CONTAINER: "scxPanelSplitter",
  HOVER: "scxHover",
  MOVE: "scxSplitterMove"
};

// endregion

/**
 * Represents splitter between two chart panels.
 * @constructor StockChartX.ChartPanelSplitter
 * @augments StockChartX.HtmlControl
 */
export class ChartPanelSplitter extends HtmlControl {
  // State of Chart before clicking at splitter
  private _prevChartState: number;

  // region Properties

  /**
   * @internal
   */
  private _topPanel: ChartPanel;

  /**
   * The chart panel.
   * @name topPanel
   * @type {StockChartX.ChartPanel}
   * @readonly
   * @memberOf StockChartX.ChartPanelSplitter#
   */
  get topPanel(): ChartPanel {
    return this._topPanel;
  }

  /**
   * @internal
   */
  private _bottomPanel: ChartPanel;

  /**
   * The bottom chart panel.
   * @name bottomPanel
   * @type {StockChartX.ChartPanel}
   * @readonly
   * @memberOf StockChartX.ChartPanelSplitter#
   */
  get bottomPanel(): ChartPanel {
    return this._bottomPanel;
  }

  /**
   * Returns parent chart.
   * @name chart
   * @type {StockChartX.Chart}
   * @readonly
   * @memberOf StockChartX.ChartPanelSplitter#
   */
  get chart(): Chart {
    return this._topPanel && this._topPanel.chart;
  }

  /**
   * The index of splitter.
   * @name _index
   * @type {Number}
   * @memberOf StockChartX.ChartPanelSplitter#
   * @private
   * @internal
   */
  private _index: number = null;

  /**
   * @internal
   */
  private _isMoving: boolean = false;

  /**
   * @internal
   */
  private _needsTheme: boolean = true;

  // endregion

  static getHeight(): number {
    return 1;
  }

  // region Gestures

  /**
   * @internal
   */
  protected _initGestures(): GestureArray {
    return new GestureArray(
      [
        new MouseHoverGesture({
          handler: this._handleMouseHoverGesture,
          hoverEventEnabled: false
        }),
        new PanGesture({
          handler: this._handlePanGesture,
          horizontalMoveEnabled: false
        }),
        new ClickGesture({
          handler: () => {}
        })
      ],
      this,
      this.hitTest
    );
  }

  /**
   * @internal
   */
  private _handlePanGesture(gesture: PanGesture) {
    let chart = this.chart;

    switch (chart.state) {
      case ChartState.USER_DRAWING:
        chart.cancelUserDrawing();
        break;
      case ChartState.RESIZING_PANELS:
      case ChartState.NORMAL:
        break;
      case ChartState.ZOOM_IN:
        return;
      default:
        throw new Error("Unable to start user drawing in this chart state.");
    }

    switch (gesture.state) {
      case GestureState.STARTED:
        this._prevChartState = chart.state;
        this._isMoving = true;
        chart.state = ChartState.RESIZING_PANELS;
        this._startMove();
        break;
      case GestureState.CONTINUED:
        if (this.move(gesture.moveOffset.y)) {
          chart.updateSplitter(this);
        }
        break;
      case GestureState.FINISHED:
        this._isMoving = false;
        chart.state = this._prevChartState;
        break;
      default:
        break;
    }
  }

  /**
   * @internal
   */
  private _handleMouseHoverGesture(
    gesture: MouseHoverGesture,
    event: IWindowEvent
  ) {
    switch (gesture.state) {
      case GestureState.STARTED:
        this._startMove();
        break;
      case GestureState.FINISHED:
        this._stopMove();
        this.chart.crossHair.setPosition(event.pointerPosition);
        break;
      default:
        break;
    }
  }

  /**
   * @internal
   */
  private _startMove() {
    this.chart.rootDiv.addClass(Class.MOVE);
    this.container.addClass(Class.HOVER);
    this._applyTheme(true);

    this.chart.crossHair.hide();
  }

  /**
   * @internal
   */
  private _stopMove() {
    this.chart.rootDiv.removeClass(Class.MOVE);
    this.container.removeClass(Class.HOVER);
    this._applyTheme(false);

    this.chart.crossHair.show();
  }

  // endregion

  setPanels(splitterIndex: number, top: ChartPanel, bottom: ChartPanel) {
    this._index = splitterIndex;
    this._topPanel = top;
    this._bottomPanel = bottom;
  }

  invalidateTheme() {
    this._needsTheme = true;
  }

  /**
   * @internal
   */
  private _applyTheme(isHovered: boolean) {
    let theme = this.chart.theme.splitter,
      color = isHovered ? theme.hoverFillColor : theme.fillColor;

    this.container.css("background-color", color);
    this._needsTheme = false;
  }

  /**
   * Moves splitter onto a given offset.
   * @method move
   * @param {Number} offset The offset in pixels.
   * @returns True if move was applied, otherwise false.
   * @memberOf StockChartX.ChartPanelSplitter#
   */
  move(offset: number): boolean {
    if (offset === 0) return false;

    let topPanel = this._topPanel,
      bottomPanel = this._bottomPanel,
      chart = topPanel.chart,
      topPanelNewHeight = topPanel.frame.height + offset,
      panelsHeight = chart.chartPanelsContainer.totalPanelsHeight(),
      topPanelNewRatio = topPanelNewHeight / panelsHeight,
      ratioDiff = topPanel.heightRatio - topPanelNewRatio,
      bottomPanelNewRatio = bottomPanel.heightRatio + ratioDiff;

    if (
      topPanelNewRatio < topPanel.minHeightRatio ||
      topPanelNewRatio > topPanel.maxHeightRatio ||
      bottomPanelNewRatio < bottomPanel.minHeightRatio ||
      bottomPanelNewRatio > bottomPanel.maxHeightRatio
    )
      return false;

    topPanel.heightRatio = topPanelNewRatio;
    bottomPanel.heightRatio = bottomPanelNewRatio;

    return true;
  }

  /**
   * @inheritDoc
   */
  hitTest(point: IPoint): boolean {
    return this._isMoving ? true : super.hitTest(point);
  }

  /**
   * @internal
   */
  protected _createContainer(): JQuery {
    let parent = this.chart.chartPanelsContainer.container;

    return parent.scxAppend("div", Class.CONTAINER);
  }

  /**
   * @inheritDoc
   */
  layout(frame: Rect) {
    super.layout(frame);

    this.frame.top += this._topPanel.chartPanelsContainer.frame.top;

    if (this._needsTheme) this._applyTheme(false);
  }
}
