import { IntervalValueScaleCalibrator } from "../index";
import { Geometry } from "../index";
import {
  IValueScaleCalibratorState,
  IValueScaleCalibrator,
  ValueScaleCalibrator
} from "../index";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import { ChartPanel } from "../index";
import { IPadding, Rect } from "../index";
import {
  INumberFormatState,
  INumberFormat,
  NumberFormat
} from "../index";
import { Control } from "../index";
import { ChartEvent } from "../index";
import { IStateProvider } from "../index";
import { Chart } from "../index";
import { Projection } from "../index";
import { IMinMaxValues } from "../index";
import { JsUtil } from "../index";
import { ValueScale } from "../index";
import { GestureArray } from "../index";
import { DoubleClickGesture } from "../index";
import { PanGesture } from "../index";
import { MouseWheelGesture } from "../index";
import { IntlNumberFormat } from "../index";
import { DummyCanvasContext } from "../index";
import { IPoint } from "../index";
import { GestureState, IWindowEvent } from "../index";
"use strict";

// region Interfaces

export interface IChartPanelValueScaleConfig {
  chartPanel: ChartPanel;
  minVisibleValue?: number;
  maxVisibleValue?: number;
  minAllowedValue?: number;
  maxAllowedValue?: number;
  minAllowedValueRatio?: number;
  maxAllowedValueRatio?: number;
  minValueRangeRatio?: number;
  maxValueRangeRatio?: number;
  padding?: IPadding;
  minValueOffset?: number;
  decimalDigits?: number;
  customFormat?: string;
  range?: Object;
  majorTickMarkLength?: number;
  minorTickMarkLength?: number;
  kind?: string;
}

export interface IChartPanelValueScaleState {
  options: any;
  formatter: INumberFormatState;
  calibrator: IValueScaleCalibratorState;
}

// endregion

// region Declarations

const MIN_VALUE_RANGE = 1e-1;
const CLASS_SCROLL = "scxValueScaleScroll";
export const ScaleKind = {
  LINEAR: "linear",
  LOGARITHMIC: "logarithmic"
};
Object.freeze(ScaleKind);
// endregion

/**
 * Represents value scale on the chart panel.
 * @param {Object} config The configuration object.
 * @param {StockChartX.ChartPanel} config.chartPanel The parent chart panel.
 * @constructor StockChartX.ChartPanelValueScale
 */
export class ChartPanelValueScale extends Control
  implements IStateProvider<IChartPanelValueScaleState> {
  autoScaleMultiplier: any;
  // region Properties

  /**
   * @internal
   */
  private _panel: ChartPanel;

  /**
   * The parent chart panel.
   * @name chartPanel
   * @type {StockChartX.ChartPanel}
   * @readonly
   * @memberOf StockChartX.ChartPanelValueScale#
   */
  get chartPanel(): ChartPanel {
    return this._panel;
  }

  /**
   * The parent chart.
   * @name chart
   * @type {StockChartX.Chart}
   * @readonly
   * @memberOf StockChartX.ChartPanelValueScale#
   */
  get chart(): Chart {
    return this._panel.chart;
  }

  /**
   * @internal
   */
  private _projectionFrame: Rect = new Rect();

  /**
   * The projection frame rectangle.
   * @name projectionFrame
   * @type {StockChartX.Rect}
   * @memberOf StockChartX.ChartPanelValueScale#
   */
  get projectionFrame(): Rect {
    return this._projectionFrame;
  }

  /**
   * The value scale options.
   * @type {Object}
   * @memberOf StockChartX.ChartPanelValueScale#
   * @private
   * @internal
   */
  private _options;

  /**
   * The projection to convert x coordinate to value and vise versa.
   * @type {StockChartX.Projection}
   * @memberOf StockChartX.ChartPanelValueScale#
   * @private
   * @internal
   */
  private _projection: Projection;

  /**
   * @internal
   */
  private _leftFrame: Rect;

  get leftFrame(): Rect {
    return this._leftFrame;
  }

  /**
   * @internal
   */
  private _rightFrame: Rect;

  get rightFrame(): Rect {
    return this._rightFrame;
  }

  /**
   * @internal
   */
  private _leftContentFrame: Rect;

  /**
   * @internal
   */
  private _rightContentFrame: Rect;

  /**
   * @internal
   */
  private range = <IMinMaxValues<number>>{};

  /**
   * @internal
   */
  private _formatter: INumberFormat;
  /**
   * The value formatter that is used to convert values to text.
   * @name formatter
   * @type {IntlPolyfill.NumberFormat | StockChartX.NumberFormat}
   * @memberOf StockChartX.ChartPanelValueScale#
   */
  get formatter(): INumberFormat {
    return this._formatter;
  }
  set formatter(value: INumberFormat) {
    if (!value || !JsUtil.isFunction(value.format))
      throw new TypeError("Invalid formatter.");

    this._formatter = value;
  }

  /**
   * Scale kind
   * @name kind
   * @type {string}
   * @memberOf StockChartX.ChartPanelValueScale#
   */
  get kind(): string {
    return this._options.kind || ScaleKind.LINEAR;
  }
  set kind(value: string) {
    this._options.kind = value || ScaleKind.LINEAR;
  }

  /**
   * Gets/Sets minimum visible value.
   * @name minVisibleValue
   * @type {Number}
   * @memberOf StockChartX.ChartPanelValueScale#
   * @see [maxVisibleValue]{@linkcode StockChartX.ChartPanelValueScale#maxVisibleValue} to get/set max visible value.
   * @throws TypeError if value is not a finite number or NaN.
   */
  get minVisibleValue(): number {
    return this._options.minVisibleValue;
  }
  set minVisibleValue(value: number) {
    if (!JsUtil.isFiniteNumberOrNaN(value))
      throw new TypeError("Value must be a number." + value);

    this._setMinVisibleValue(value);
  }

  /**
   * Gets/Sets maximum visible value.
   * @name maxVisibleValue
   * @type {Number}
   * @memberOf StockChartX.ChartPanelValueScale#
   * @see [minVisibleValue]{@linkcode StockChartX.ChartPanelValueScale#minVisibleValue} to get/set min visible value.
   * @throws TypeError if value is not a finite number or NaN.
   */
  get maxVisibleValue(): number {
    return this._options.maxVisibleValue;
  }
  set maxVisibleValue(value: number) {
    if (!JsUtil.isFiniteNumberOrNaN(value))
      throw new TypeError("Value must be a number.");

    this._setMaxVisibleValue(value);
  }

  /**
   * Gets/Sets the minimum allowed value on the scale.
   * @name minAllowedValue
   * @type {Number}
   * @memberOf StockChartX.ChartPanelValueScale#
   * @see [maxAllowedValue]{@linkcode StockChartX.ChartPanelValueScale#maxAllowedValue} to get/set max allowed value.
   * @throws TypeError if value is not a number.
   */
  get minAllowedValue(): number {
    return this._options.minAllowedValue;
  }
  set minAllowedValue(value: number) {
    if (!JsUtil.isNumber(value)) throw new TypeError("Value must be a number.");

    this._options.minAllowedValue = value;
  }

  /**
   * Gets/Sets the maximum allowed value on the scale.
   * @name maxAllowedValue
   * @type {Number}
   * @memberOf StockChartX.ChartPanelValueScale#
   * @see [minAllowedValue]{@linkcode StockChartX.ChartPanelValueScale#minAllowedValue} to get/set min allowed value.
   * @throws TypeError if value is not a number.
   */
  get maxAllowedValue(): number {
    return this._options.maxAllowedValue;
  }
  set maxAllowedValue(value: number) {
    if (!JsUtil.isNumber(value)) throw new TypeError("Value must be a number.");

    this._options.maxAllowedValue = value;
  }

  get minAllowedValueRatio(): number {
    return this._options.minAllowedValueRatio;
  }
  set minAllowedValueRatio(value: number) {
    if (!JsUtil.isPositiveNumberOrNaN(value))
      throw new Error("Ratio must be a positive number.");

    this._options.minAllowedValueRatio = value;
  }

  get maxAllowedValueRatio(): number {
    return this._options.maxAllowedValueRatio;
  }
  set maxAllowedValueRatio(value: number) {
    if (!JsUtil.isPositiveNumberOrNaN(value))
      throw new Error("Ratio must be a positive number or NaN.");

    this._options.maxAllowedValueRatio = value;
  }

  get minValueRangeRatio(): number {
    return this._options.minValueRangeRatio;
  }
  set minValueRangeRatio(value: number) {
    if (!JsUtil.isPositiveNumberOrNaN(value) || value > 1)
      throw new Error("Ratio must be in range (0..1]");

    this._options.minValueRangeRatio = value;
  }

  get maxValueRangeRatio(): number {
    return this._options.maxValueRangeRatio;
  }
  set maxValueRangeRatio(value: number) {
    if (!JsUtil.isPositiveNumberOrNaN(value) || value < 1)
      throw new Error("Ratio must be greater or equal to 1.");

    this._options.maxValueRangeRatio = value;
  }

  /**
   * Gets/Sets theme.
   * @name theme
   * @type {object}
   * @memberOf StockChartX.ChartPanelValueScale#
   */
  get theme(): any {
    return this._options.theme;
  }
  set theme(value: any) {
    this._options.theme = value;
  }

  get majorTickMarkLength(): number {
    return this._options.majorTickMarkLength;
  }
  set majorTickMarkLength(value: number) {
    this._options.majorTickMarkLength = value;
  }

  get minorTickMarkLength(): number {
    return this._options.minorTickMarkLength;
  }
  set minorTickMarkLength(value: number) {
    this._options.minorTickMarkLength = value;
  }

  /**
   * Gets projection object to convert Y coordinate into value and vise versa.
   * @name projection
   * @type {StockChartX.Projection}
   * @readonly
   * @memberOf StockChartX.ChartPanelValueScale#
   */
  get projection(): Projection {
    return this._projection;
  }

  get padding(): IPadding {
    return this._options.padding;
  }

  /**
   * @internal
   */
  private _calibrator: IValueScaleCalibrator;

  get calibrator(): IValueScaleCalibrator {
    return this._calibrator;
  }
  set calibrator(value: IValueScaleCalibrator) {
    this._calibrator = value;
  }

  /**
   * Returns actual theme.
   * @name actualTheme
   * @type {Object}
   * @readonly
   * @memberOf StockChartX.ChartPanelValueScale#
   */
  get actualTheme() {
    return this._options.theme || this.chart.theme.valueScale;
  }

  get chartValueScale(): ValueScale {
    let index = this._index();

    return index >= 0 ? this.chart.valueScales[index] : null;
  }

  // endregion

  constructor(config: IChartPanelValueScaleConfig) {
    super();

    if (!config) throw new Error("Config is not specified.");

    if (!(config.chartPanel instanceof ChartPanel))
      throw new TypeError(
        "Config.chartPanel must be an instance of StockChartX.ChartPanel."
      );
    this._panel = config.chartPanel;

    this._projection = new Projection(this.chart.dateScale, this);

    this.loadState(<IChartPanelValueScaleState>(<any>config));

    this._updateFormatter();
    this._initGestures();

    this.chart.on(
      ChartEvent.LOCALE_CHANGED + ".scxValueScale",
      () => {
        this._updateFormatter();
      },
      this
    );
  }

  /**
   * @internal
   */
  protected _initGestures(): GestureArray {
    return new GestureArray(
      [
        new DoubleClickGesture({
          handler: this._handleDoubleClickGesture
        }),
        new PanGesture({
          handler: this._handlePanGesture,
          horizontalMoveEnabled: false
        }),
        new MouseWheelGesture({
          handler: this._handleMouseWheelGesture
        })
      ],
      this,
      this.hitTest
    );
  }

  /**
   * @internal
   */
  private _updateFormatter() {
    let locale = this.chart.locale,
      formatter = this.formatter;

    if (!formatter) {
      let options = {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
      };
      this.formatter = new IntlNumberFormat(locale, options);
    } else {
      formatter.locale = locale;
    }
  }

  /**
   * @internal
   */
  private _setMinVisibleValue(value: number) {
    this._options.minVisibleValue = value;
  }

  /**
   * @internal
   */
  private _setMaxVisibleValue(value: number) {
    this._options.maxVisibleValue = value;
  }

  /**
   * @internal
   */
  private _index(): number {
    let scales = this._panel.valueScales;

    for (let i = 0; i < scales.length; i++) {
      if (scales[i] === this) return i;
    }

    return -1;
  }

  /**
   * Determines whether auto-scaling needs to be performed.
   * @method needsAutoScale
   * @returns {boolean}
   * @memberOf StockChartX.ChartPanelValueScale#
   */
  needsAutoScale() {
    return (
      isNaN(this._options.minVisibleValue) ||
      isNaN(this._options.maxVisibleValue)
    );
  }

  /**
   * Marks that auto-scaling needs to be performed on next layout.
   * @method setNeedsAutoScale
   * @memberOf StockChartX.ChartPanelValueScale#
   */
  setNeedsAutoScale() {
    this.minVisibleValue = NaN;
    this.maxVisibleValue = NaN;
  }

  /**
   * Auto-scales value scale.
   * @name autoScale
   * @memberOf StockChartX.ChartPanelValueScale#
   */
  autoScale() {
    let dateScale = this.chart.dateScale,
      startIndex = dateScale.firstVisibleIndex,
      count = dateScale.lastVisibleIndex - startIndex + 1,
      min = Infinity,
      max = -Infinity,
      chartScale = this.chartValueScale;

    for (let plot of this._panel.plots) {
      if (plot.valueScale !== chartScale) continue;

      let res = plot.minMaxValues(startIndex, count);
      if (res.min < min) min = res.min;
      if (res.max > max) max = res.max;
    }

    if (!isFinite(min)) min = -1;
    if (!isFinite(max)) max = 1;
    if (min === max) {
      min--;
      max++;
    }

    let range = this.range;
    if (range) {
      if (range.min != null && min > range.min) min = range.min;
      if (range.max != null && max < range.max) max = range.max;
    }

    this._setMinVisibleValue(min);
    this._setMaxVisibleValue(max);
  }

  /**
   * Returns string representation of a given value.
   * @method formatValue
   * @param {number} value The value
   * @returns {string}
   * @memberOf StockChartX.ChartPanelValueScale#
   */
  formatValue(value: number): string {
    return this.formatter.format(value);
  }

  /**
   * Returns preferred with of the scale.
   * @method preferredWidth
   * @returns {number}
   * @memberOf StockChartX.ChartPanelValueScale#
   */
  preferredWidth(): number {
    if (this.needsAutoScale()) this.autoScale();

    let options = this._options,
      theme = this.actualTheme.text,
      minText = this.formatValue(options.minVisibleValue),
      maxText = this.formatValue(options.maxVisibleValue),
      minTextWidth = DummyCanvasContext.measureText(minText, theme).width,
      maxTextWidth = DummyCanvasContext.measureText(maxText, theme).width,
      padding = options.padding;

    return Math.max(minTextWidth, maxTextWidth) + padding.left + padding.right;
  }

  /**
   * @inheritdoc
   */
  hitTest(point: IPoint) {
    let leftFrame = this._leftContentFrame,
      rightFrame = this._rightContentFrame;

    return (
      (leftFrame && Geometry.isPointInsideOrNearRect(point, leftFrame)) ||
      (rightFrame && Geometry.isPointInsideOrNearRect(point, rightFrame))
    );
  }

  /**
   * Scrolls scale on a given number of pixels.
   * @method scrollOnPixels
   * @param {Number} pixels The number of pixels to scroll.
   * @returns {Boolean} True if scroll was performed, false otherwise.
   * @memberOf StockChartX.ChartPanelValueScale#
   */
  scrollOnPixels(pixels: number) {
    if (!isFinite(pixels)) throw new Error("Finite number expected.");
    if (!pixels) return false;

    let valueOffset = this._valueOffset(pixels);

    return this.scrollOnValue(valueOffset);
  }

  /**
   * Scrolls scale on a given value offset.
   * @method scrollOnValue
   * @param {Number} valueOffset The value offset to scroll.
   * @returns {boolean} True if scroll was performed, false otherwise.
   * @memberOf StockChartX.ChartPanelValueScale#
   */
  scrollOnValue(valueOffset: number) {
    if (!valueOffset) return false;

    let newMinValue = this.minVisibleValue + valueOffset,
      newMaxValue = this.maxVisibleValue + valueOffset;

    let range = this.range;
    if (range) {
      if (range.min != null && newMinValue > range.min) newMinValue = range.min;
      if (range.max != null && newMaxValue < range.max) newMaxValue = range.max;
    }

    if (!this._canSetVisibleValueRange(newMinValue, newMaxValue)) return false;

    this._setMinVisibleValue(newMinValue);
    this._setMaxVisibleValue(newMaxValue);

    return true;
  }

  /**
   * Zooms scale on a given number of pixels.
   * @method zoomOnPixels
   * @param {Number} pixels The number of pixels to zoom.
   * @returns {Boolean} True if zoom was performed, false otherwise.
   * @memberOf StockChartX.ChartPanelValueScale#
   */
  zoomOnPixels(pixels: number) {
    if (!isFinite(pixels)) throw new Error("Finite number expected.");
    if (!pixels) return false;

    let valueOffset = this._valueOffset(pixels);

    return this.zoomOnValue(valueOffset);
  }

  /**
   * Zooms scale on a given value offset.
   * @method zoomOnValue
   * @param {Number} valueOffset The value offset to zoom.
   * @returns {boolean} True if zoom was performed, false otherwise.
   * @memberOf StockChartX.ChartPanelValueScale#
   */
  zoomOnValue(valueOffset: number) {
    if (!valueOffset) return false;

    let oldMinValue = this.minVisibleValue,
      oldMaxValue = this.maxVisibleValue,
      newMinValue = oldMinValue - valueOffset,
      newMaxValue = oldMaxValue + valueOffset;

    let range = this.range;
    if (!this._canSetVisibleValueRange(newMinValue, newMaxValue)) {
      if (this._canSetVisibleValueRange(oldMinValue, newMaxValue)) {
        newMinValue = oldMinValue;
      } else if (this._canSetVisibleValueRange(newMinValue, oldMaxValue)) {
        newMaxValue = oldMaxValue;
      } else if (!range) {
        return false;
      }
    }

    if (range) {
      if (range.min != null && newMinValue > range.min) newMinValue = range.min;
      if (range.max != null && newMaxValue < range.max) newMaxValue = range.max;
    }

    if (
      (newMinValue !== oldMinValue || newMaxValue !== oldMaxValue) &&
      newMaxValue - newMinValue >= MIN_VALUE_RANGE
    ) {
      this._setMinVisibleValue(newMinValue);
      this._setMaxVisibleValue(newMaxValue);

      return true;
    }

    return false;
  }

  /**
   * @internal
   */
  public _zoomOrScrollWithUpdate(
    offset: number,
    func: (value: number) => void
  ) {
    let useManualWidth = this.chartValueScale.useManualWidth,
      prevWidth = useManualWidth || this.preferredWidth(),
      isUpdated = func.call(this, offset),
      newWidth = useManualWidth || this.preferredWidth();

    if (isUpdated) {
      if (prevWidth === newWidth) this._panel.setNeedsUpdate();
      else this.chart.setNeedsUpdate();
    }

    return isUpdated;
  }

  // region IStateProvider

  /**
   * Save state.
   * @method saveState
   * @returns {Object}
   * @see [loadState]{@linkcode StockChartX.ChartPanelValueScale#loadState} to load state.
   * @memberOf StockChartX.ChartPanelValueScale#
   */
  saveState(): IChartPanelValueScaleState {
    return {
      options: JsUtil.clone(this._options),
      formatter: this.formatter.saveState(),
      calibrator: this.calibrator.saveState()
    };
  }

  /**
   * Loads state.
   * @method loadState
   * @param {object} state The state.
   * @memberOf StockChartX.ChartPanelValueScale#
   * @see [saveState]{@linkcode StockChartX.ChartPanelValueScale#saveState} to save state.
   */
  loadState(state: IChartPanelValueScaleState) {
    state = state || <IChartPanelValueScaleState>{};
    let optionsState = state.options || {};

    this._options = {};
    this._options.minVisibleValue =
      optionsState.minVisibleValue != null ? optionsState.minVisibleValue : NaN;
    this._options.maxVisibleValue =
      optionsState.maxVisibleValue != null ? optionsState.maxVisibleValue : NaN;
    this.minAllowedValue =
      optionsState.minAllowedValue != null ? optionsState.minAllowedValue : NaN;
    this.maxAllowedValue =
      optionsState.maxAllowedValue != null ? optionsState.maxAllowedValue : NaN;
    this.minAllowedValueRatio = optionsState.minAllowedValue || 0.8;
    this.maxAllowedValueRatio = optionsState.maxAllowedValueRatio || 0.8;
    this.minValueRangeRatio = optionsState.minValueRangeRatio || 0.1;
    this.maxValueRangeRatio = optionsState.maxValueRangeRatio || 5.0;
    this.majorTickMarkLength = optionsState.majorTickMarkLength || 3;
    this.minorTickMarkLength = optionsState.minorTickMarkLength || 3;
    this._options.padding = optionsState.padding || {
      left: 6,
      top: 3,
      right: 3,
      bottom: 3
    };
    this.range = optionsState.range || {};
    if (state.formatter)
      this.formatter = NumberFormat.deserialize(state.formatter);
    else {
      this.formatter = new IntlNumberFormat();
      (<IntlNumberFormat>this.formatter).setDecimalDigits(3);
    }
    this.calibrator = state.calibrator
      ? ValueScaleCalibrator.deserialize(state.calibrator)
      : new IntervalValueScaleCalibrator();
  }

  // endregion

  /**
   * @inheritdoc
   */
  layout(frame: Rect) {
    if (this.needsAutoScale()) this.autoScale();
    else {
      if (this.maxVisibleValue - this.minVisibleValue < MIN_VALUE_RANGE)
        this.autoScale();
    }

    let projectionFrame = this._projectionFrame;
    projectionFrame.left = 0;
    projectionFrame.top = 0;
    projectionFrame.width = this._panel.layer.size.width;
    projectionFrame.height = this._panel.layer.size.height;
    projectionFrame.applyPadding(this._panel.chartPanelsContainer.panelPadding);

    this._calibrator.calibrate(this);
    this._layoutContentFrames();
  }

  /**
   * @internal
   */
  private _layoutContentFrames() {
    let panel = this._panel,
      chartValueScale = this.chartValueScale,
      drawLeft = chartValueScale.leftPanelVisible,
      drawRight = chartValueScale.rightPanelVisible,
      padding = this._options.padding;

    if (drawLeft) {
      let leftPanel = chartValueScale.leftPanel,
        leftScaleLeftBorder = parseFloat(
          leftPanel.container.css("border-left-width")
        ),
        panelLeftBorder = parseFloat(panel.container.css("border-left-width")),
        leftScaleWidth = leftPanel.contentSize.width,
        startLeftX = Math.round(
          Math.max(leftScaleLeftBorder - panelLeftBorder, 0)
        );

      let leftFrame = this._leftFrame;
      if (!leftFrame) leftFrame = this._leftFrame = new Rect();
      leftFrame.left = startLeftX;
      leftFrame.top = 0;
      leftFrame.width =
        leftScaleWidth - Math.max(panelLeftBorder - leftScaleLeftBorder);
      leftFrame.height = panel.container.height();

      let leftContentFrame = this._leftContentFrame;
      if (!leftContentFrame)
        leftContentFrame = this._leftContentFrame = new Rect();
      leftContentFrame.left = leftFrame.left + padding.right;
      leftContentFrame.top = leftFrame.top;
      leftContentFrame.width = leftFrame.width - padding.left - padding.right;
      leftContentFrame.height = leftFrame.height;
    } else {
      this._leftFrame = this._leftContentFrame = null;
    }

    if (drawRight) {
      let rightPanel = chartValueScale.rightPanel,
        rightScaleLeftBorder = parseFloat(
          rightPanel.container.css("border-left-width")
        ),
        rightScaleWidth = rightPanel.contentSize.width,
        startRightX = rightPanel.frame.left + rightScaleLeftBorder;

      let rightFrame = this._rightFrame;
      if (!rightFrame) rightFrame = this._rightFrame = new Rect();
      rightFrame.left = startRightX;
      rightFrame.top = 0;
      rightFrame.width = rightScaleWidth;
      rightFrame.height = panel.container.height();

      let rightContentFrame = this._rightContentFrame;
      if (!rightContentFrame)
        rightContentFrame = this._rightContentFrame = new Rect();
      rightContentFrame.left = rightFrame.left + padding.left;
      rightContentFrame.top = rightFrame.top;
      rightContentFrame.width = rightFrame.width - padding.left - padding.right;
      rightContentFrame.height = rightFrame.height;
    } else {
      this._rightFrame = this._rightContentFrame = null;
    }
  }

  /**
   * @internal
   */
  clip() {
    let leftFrame = this._leftFrame,
      rightFrame = this._rightFrame;

    if (!leftFrame && !rightFrame) return false;

    let context = this._panel.layer.context;

    if (leftFrame) {
      context.rect(
        leftFrame.left,
        leftFrame.top,
        leftFrame.width,
        leftFrame.height
      );
    }
    if (rightFrame) {
      context.rect(
        rightFrame.left,
        rightFrame.top,
        rightFrame.width,
        rightFrame.height
      );
    }
    context.clip();

    return true;
  }

  /**
   * @inheritdoc
   */
  draw() {
    let context = this._panel.layer.context;

    context.save();

    if (this.clip()) {
      let theme = this.actualTheme,
        leftContentFrame = this._leftContentFrame,
        rightContentFrame = this._rightContentFrame,
        leftFrame = this._leftFrame,
        rightFrame = this._rightFrame,
        leftFrameRight = leftFrame && leftFrame.right - 1,
        majorTickLen = this.majorTickMarkLength,
        minorTickLen = this.minorTickMarkLength;

      context.scxApplyTextTheme(theme.text);
      context.textBaseline = "middle";
      context.beginPath();

      for (let tick of this.calibrator.majorTicks) {
        if (leftContentFrame) {
          context.moveTo(leftFrameRight, tick.y);
          context.lineTo(leftFrameRight - majorTickLen, tick.y);

          context.textAlign = "right";
          context.fillText(tick.text, leftContentFrame.right, tick.y);
        }
        if (rightContentFrame) {
          context.moveTo(rightFrame.left, tick.y);
          context.lineTo(rightFrame.left + majorTickLen, tick.y);

          context.textAlign = "left";
          context.fillText(tick.text, rightContentFrame.left, tick.y);
        }
      }
      for (let tick of this.calibrator.minorTicks) {
        if (leftFrame) {
          context.moveTo(leftFrameRight, tick.y);
          context.lineTo(leftFrameRight - minorTickLen, tick.y);
        }
        if (rightFrame) {
          context.moveTo(rightFrame.left, tick.y);
          context.lineTo(rightFrame.left + minorTickLen, tick.y);
        }
      }

      context.scxApplyStrokeTheme(theme.line);
      context.stroke();
    }

    context.restore();
  }

  /**
   * @internal
   */
  private _handleDoubleClickGesture() {
    let useManualWidth = this.chartValueScale.useManualWidth,
      prevWidth = useManualWidth || this.preferredWidth();

    this.autoScale();

    let newWidth = useManualWidth || this.preferredWidth();
    if (prevWidth === newWidth) this._panel.setNeedsUpdate();
    else this.chart.setNeedsUpdate();
  }

  /**
   * @internal
   */
  private _handlePanGesture(gesture: PanGesture, event: IWindowEvent) {
    let chart = this.chart,
      isScroll = event.evt.which === 1;

    if (isScroll && !chart.scrollEnabled) return;
    if (!isScroll && !chart.zoomEnabled) return;

    switch (gesture.state) {
      case GestureState.STARTED:
        chart.rootDiv.addClass(CLASS_SCROLL);
        break;
      case GestureState.FINISHED:
        chart.rootDiv.removeClass(CLASS_SCROLL);
        break;
      case GestureState.CONTINUED:
        let offset = gesture.moveOffset.y,
          func = isScroll ? this.scrollOnPixels : this.zoomOnPixels;

        this._zoomOrScrollWithUpdate(offset, func);
        break;
      default:
        break;
    }
  }

  /**
   * @internal
   */
  private _handleMouseWheelGesture(gesture: MouseWheelGesture) {
    if (!this.chart.zoomEnabled) return;

    let frame = this._panel.frame,
      pixels = 0.05 * frame.height;

    this._zoomOrScrollWithUpdate(gesture.delta * pixels, this.zoomOnPixels);
  }

  /**
   * @internal
   */
  private _valueOffset(pixels: number): number {
    let frame = this._panel.contentFrame,
      factor = (this.maxVisibleValue - this.minVisibleValue) / frame.height;

    return factor * pixels;
  }

  /**
   * @internal
   */
  private _canSetVisibleValueRange(
    newMinValue: number,
    newMaxValue: number
  ): boolean {
    // Check if min/max are almost equal
    let newRange = newMaxValue - newMinValue;
    if (newRange < MIN_VALUE_RANGE) return false;

    // Check if new min/max values are in allowed range.
    let minAllowedValue = this.minAllowedValue;
    if (!isNaN(minAllowedValue) && newMinValue < minAllowedValue) return false;

    let maxAllowedValue = this.maxAllowedValue;
    if (!isNaN(maxAllowedValue) && newMaxValue > maxAllowedValue) return false;

    // Check min/max allowed value ratio
    let minMaxRange = this._panel.autoScaledMinMaxValues(this.chartValueScale),
      minRatio = this.minAllowedValueRatio,
      maxRatio = this.maxAllowedValueRatio,
      ratio;
    if (!isNaN(minRatio)) {
      ratio = (minMaxRange.min - newMinValue) / newRange;
      if (ratio > minRatio) return false;
    }
    if (!isNaN(maxRatio)) {
      ratio = (newMaxValue - minMaxRange.max) / newRange;
      if (ratio > maxRatio) return false;
    }

    // Check value range ratio
    let valueRangeRatio = this.minValueRangeRatio;

    ratio = (minMaxRange.max - minMaxRange.min) / newRange;
    if (!isNaN(valueRangeRatio) && ratio < valueRangeRatio) return false;

    valueRangeRatio = this.maxValueRangeRatio;
    if (!isNaN(valueRangeRatio) && ratio > valueRangeRatio) return false;

    return true;
  }

  // region IDestroyable

  destroy() {}

  // endregion
}
