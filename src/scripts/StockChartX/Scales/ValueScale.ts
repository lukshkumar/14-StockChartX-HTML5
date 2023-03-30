/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import {
  IChartComponentConfig,
  ChartComponent
} from "../index";
import { IStateProvider } from "../index";
import { ValueScalePanel } from "../index";
import { JsUtil } from "../index";
import { Rect } from "../index";
"use strict";

// region Interfaces

export interface IValueScaleConfig extends IChartComponentConfig {
  showLeftPanel?: boolean;
  showRightPanel?: boolean;
  width?: number;
  useManualWidth?: boolean;
}

// endregion

// region Declarations

const $ = window.jQuery;

const Class = {
  LEFT_SCALE: "scxLeftValueScale",
  RIGHT_SCALE: "scxRightValueScale"
};

// endregion

/**
 * Represents value scale on the chart.
 * @param {Object} config The configuration object.
 * @param {StockChartX.Chart} config.chart The parent chart.
 * @constructor StockChartX.ValueScale
 * @augments StockChartX.ChartComponent
 */
export class ValueScale extends ChartComponent
  implements IStateProvider<object> {
  // region Properties

  /**
   * @internal
   */
  private _leftPanel: ValueScalePanel;
  /**
   * The left value scale panel.
   * @name leftPanel
   * @type {StockChartX.ValueScalePanel}
   * @readonly
   * @memberOf StockChartX.ValueScalePanel#
   */
  get leftPanel(): ValueScalePanel {
    return this._leftPanel;
  }

  /**
   * @internal
   */
  private _rightPanel: ValueScalePanel;
  /**
   * The right value scale panel.
   * @name rightPanel
   * @type {StockChartX.ValueScalePanel}
   * @readonly
   * @memberOf StockChartX.ValueScalePanel#
   */
  get rightPanel(): ValueScalePanel {
    return this._rightPanel;
  }

  /**
   * @internal
   */
  private _options = null;

  // noinspection JSMethodCanBeStatic
  /**
   * Gets CSS class name of the left value scale root div element.
   * @name leftPanelCssClass
   * @type {string}
   * @readonly
   * @memberOf StockChartX.ValueScale#
   * @see [rightPanelCssClass]{@linkcode StockChartX.ValueScale#rightPanelCssClass} to get css class name of the right panel.
   */
  get leftPanelCssClass(): string {
    return Class.LEFT_SCALE;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Gets CSS class name of the right value scale root div element.
   * @name rightPanelCssClass
   * @type {string}
   * @readonly
   * @memberOf StockChartX.ValueScale#
   * @see [leftPanelCssClass]{@linkcode StockChartX.ValueScale#leftPanelCssClass} to get css class name of the left panel.
   */
  get rightPanelCssClass(): string {
    return Class.RIGHT_SCALE;
  }

  /**
   * Gets/Sets flag that indicates whether manual width should be used.
   * @name useManualWidth
   * @type {boolean}
   * @memberOf StockChartX.ValueScale#
   * @see [manualWidth]{@linkcode StockChartX.ValueScale#manualWidth} to set manual width.
   */
  get useManualWidth(): boolean {
    return this._options.useManualWidth;
  }
  set useManualWidth(value: boolean) {
    this._options.useManualWidth = value;
  }

  /**
   * Gets/Sets manual width.
   * @name manualWidth
   * @type {number}
   * @memberOf StockChartX.ValueScale#
   * @see [useManualWidth]{@linkcode StockChartX.ValueScale#useManualWidth} to enable manual width usage.
   */
  get manualWidth(): number {
    return this._options.width;
  }
  set manualWidth(value: number) {
    if (!JsUtil.isFiniteNumber(value) || value <= 0)
      throw new Error("Width must be greater than 0.");

    this._options.width = value;
  }

  get leftPanelVisible(): boolean {
    return this._options.showLeftPanel;
  }
  set leftPanelVisible(value: boolean) {
    this._leftPanel.visible = this._options.showLeftPanel = value;
  }

  get rightPanelVisible(): boolean {
    return this._options.showRightPanel;
  }
  set rightPanelVisible(value: boolean) {
    this._rightPanel.visible = this._options.showRightPanel = value;
  }

  get index(): number {
    return this.chart.valueScales.indexOf(this);
  }

  // endregion

  constructor(config: IValueScaleConfig) {
    super(config);

    this._leftPanel = new ValueScalePanel({
      valueScale: this,
      cssClass: Class.LEFT_SCALE
    });
    this._rightPanel = new ValueScalePanel({
      valueScale: this,
      cssClass: Class.RIGHT_SCALE
    });

    this.loadState(config);
  }

  // region IStateProvider

  /**
   * Saves component state.
   * @method saveState
   * @returns {Object}
   * @see [loadState]{@linkcode StockChartX.ValueScale#loadState} to load state.
   * @memberOf StockChartX.ValueScale#
   */
  saveState() {
    return $.extend(true, {}, this._options);
  }

  /**
   * Loads component state.
   * @method loadState
   * @param {Object} state The state
   * @see [saveState]{@linkcode StockChartX.ValueScale#saveState} to save state.
   * @memberOf StockChartX.ValueScale#
   */
  loadState(state: any) {
    state = state || {};

    this._options = {};

    this.leftPanelVisible =
      state.showLeftPanel !== undefined ? state.showLeftPanel : false;
    this.rightPanelVisible =
      state.showRightPanel !== undefined ? state.showRightPanel : true;
    this.manualWidth = state.width || 100;
    this.useManualWidth =
      state.useManualWidth !== undefined ? state.useManualWidth : false;
  }

  // endregion

  /**
   * Layouts value scale elements.
   * @method layout
   * @param {StockChartX.Rect} frame The chart panels container frame rectangle.
   * @memberOf StockChartX.ValueScale#
   */
  layout(frame: Rect) {
    let leftFrame = this._leftPanel.layout(frame, true);
    let rightFrame = this._rightPanel.layout(frame, false);

    let remainingFrame = frame.clone();
    if (leftFrame) remainingFrame.cropLeft(leftFrame);
    if (rightFrame) remainingFrame.cropRight(rightFrame);

    return remainingFrame;
  }

  // region IDestroyable

  /**
   * @inheritdoc
   */
  destroy() {
    this.leftPanel.destroy();
    this.rightPanel.destroy();

    super.destroy();
  }

  // endregion
}
