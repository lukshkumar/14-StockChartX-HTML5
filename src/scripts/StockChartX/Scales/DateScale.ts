import { CustomDateScaleCalibrator } from "../index";
import { IDrawableChartComponent } from "../index";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { IStateProvider } from "../index";
import { ChartState } from "../index";
import {
  IDateTimeFormatState,
  IDateTimeFormat,
  DateTimeFormat
} from "../index";
import {
  IDateScaleCalibratorState,
  IDateScaleCalibrator,
  DateScaleCalibrator
} from "../index";
import { IPadding, Rect, IRect } from "../index";
import { ChartEvent } from "../index";
import { DateScalePanel } from "../index";
import { ChartComponent } from "../index";
import { Animation } from "../index";
import { Projection } from "../index";
import { CustomTimeIntervalDateTimeFormat } from "../index";
import {
  IMinMaxValues,
  DataSeries,
  DataSeriesSuffix
} from "../index";
import { JsUtil } from "../index";
import { IValueChangedEvent } from "../index";
import { IWindowEvent } from "../index";
"use strict";

// region Interfaces

export interface IDateScaleState {
  formatter: IDateTimeFormatState;
  calibrator: IDateScaleCalibratorState;
  firstVisibleRecord: number;
  lastVisibleRecord: number;
  minVisibleRecords: number;
  textPadding: IPadding;
  height: number;
  useManualHeight: boolean;
  scrollKind: string;
  zoomKind: string;
  zoomMode: string;
  autoScrollKind: DateScaleAutoScrollKind;
  scrollMode: DateScaleAutoScrollMode;
  rightAdditionalSpaceRatio: number;
  majorTickMarkLength: number;
  minorTickMarkLength: number;
  allowPartialRecords: boolean;
  theme: any;
}

// endregion

// region Declarations

/**
 * Date scale scroll kind enum values.
 * @readonly
 * @enum {string}
 * @memberOf StockChartX
 */
export const DateScaleScrollKind = {
  /** Normal scroll. */
  NORMAL: "normal",
  /** Auto-scale value scales on scroll. */
  AUTOSCALED: "autoscaled"
};
Object.freeze(DateScaleScrollKind);

/**
 * Date scale zoom kind enum values.
 * @readonly
 * @enum {string}
 * @memberOf StockChartX
 */
export const DateScaleZoomKind = {
  /** Normal zoom. */
  NORMAL: "normal",
  /** Auto-scale value scales on zoom. */
  AUTOSCALED: "autoscaled"
};
Object.freeze(DateScaleZoomKind);

/**
 * Date scale zoom mode enum values.
 * @readonly
 * @type {string}
 * @memberOf StockChartX
 */
export const DateScaleZoomMode = {
  /** Pin center of chart and zoom left and right sides evenly */
  PIN_CENTER: "pin_center",
  /** Pin left side and zoom right side only. */
  PIN_LEFT: "pin_left",
  /** Pin right side and zoom left side only. */
  PIN_RIGHT: "pin_right",
  /** Pin current mouse position. */
  PIN_MOUSE: "pin_mouse"
};
Object.freeze(DateScaleZoomMode);

/**
 * Enum kind of bar actions.
 * @readonly
 * @type {enum}
 * @memberOf StockChartX
 */
export enum BarsUpdateKind {
  TICK,
  NEW_BAR
}

/**
 * Date scale auto-scroll kind enum values.
 * @readonly
 * @type {string}
 * @memberOf StockChartX
 */
export const DateScaleAutoScrollKind = {
  /** None auto-scroll. */
  NONE: <DateScaleAutoScrollKind>"none",
  /** Auto-scroll when last bar is hidden. */
  HIDDEN_BAR: <DateScaleAutoScrollKind>"hidden_bar",
  /** Always auto-scrolling. */
  ALWAYS: <DateScaleAutoScrollKind>"always"
};
export type DateScaleAutoScrollKind = "none" | "hidden_bar" | "always";
Object.freeze(DateScaleAutoScrollKind);

/**
 * Date scale scroll mode enum values.
 * @readonly
 * @type {string}
 * @memberOf StockChartX
 */
export const DateScaleAutoScrollMode = {
  /** Auto-scroll on new bar. */
  NEW_BAR: <DateScaleAutoScrollMode>"new_bar",
  /** Auto-scroll on tick. */
  TICK: <DateScaleAutoScrollMode>"tick"
};
export type DateScaleAutoScrollMode = "new_bar" | "tick";
Object.freeze(DateScaleAutoScrollMode);

const Class = {
  TOP_SCALE: "scxTopDateScale",
  BOTTOM_SCALE: "scxBottomDateScale"
};

const MIN_SCROLL_PIXELS = 3;
const MIN_ZOOM_PIXELS = 3;
const EVENT_SUFFIX = ".scxDateScale";

// endregion

/**
 * Represents date scale on the chart.
 * @param {Object} config The configuration object.
 * @param {StockChartX.Chart} config.chart The parent chart.
 * @param {Number} [config.firstVisibleRecord] The first visible record.
 * @param {Number} [config.lastVisibleRecord] The last visible record.
 * @param {Number} [config.minVisibleRecords] The minimum visible records count.
 * @param {Boolean} [config.useManualHeight] The flag that indicates if manual height value should be used.
 * Otherwise height is calculated automatically.
 * @param {Number} [config.height] The manual panel height.
 * @param {Number} [config.theme] The theme.
 * @constructor StockChartX.DateScale
 * @augments StockChartX.ChartComponent
 */
export class DateScale extends ChartComponent
  implements IDrawableChartComponent, IStateProvider<IDateScaleState> {
  // region Properties

  /**
   * @internal
   */
  private _topPanel: DateScalePanel;

  /**
   * The top date scale panel.
   * @name topPanel
   * @type {StockChartX.DateScalePanel}
   * @readonly
   * @memberOf StockChartX.DateScale#
   */
  get topPanel(): DateScalePanel {
    return this._topPanel;
  }

  /**
   * @internal
   */
  private _bottomPanel: DateScalePanel;

  /**
   * The bottom date scale panel.
   * @name bottomPanel
   * @type {StockChartX.DateScalePanel}
   * @readonly
   * @memberOf StockChartX.DateScale#
   */
  get bottomPanel(): DateScalePanel {
    return this._bottomPanel;
  }

  /**
   * @internal
   */
  private _updateAnimation = new Animation({
    context: this,
    recurring: false,
    callback: this._onUpdateAnimationCallback
  });

  // noinspection JSMethodCanBeStatic
  /**
   * Gets CSS class name of top date scale root div element.
   * @name topPanelCssClass
   * @type {string}
   * @readonly
   * @memberOf StockChartX.DateScale#
   */
  get topPanelCssClass(): string {
    return Class.TOP_SCALE;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Gets CSS class name of bottom date scale root div element.
   * @name bottomPanelCssClass
   * @type {string}
   * @readonly
   * @memberOf StockChartX.DateScale#
   */
  get bottomPanelCssClass(): string {
    return Class.BOTTOM_SCALE;
  }

  get topPanelVisible(): boolean {
    return this._topPanel.visible;
  }

  get bottomPanelVisible(): boolean {
    return this._bottomPanel.visible;
  }

  /**
   * @internal
   */
  private _projection: Projection;

  /**
   * Gets projection object to convert coordinates.
   * @name projection
   * @type {StockChartX.Projection}
   * @readonly
   * @memberOf StockChartX.DateScale#
   */
  get projection(): Projection {
    return this._projection;
  }

  /**
   * @internal
   */
  private _projectionFrame: Rect = new Rect();

  /**
   * The projection frame rectangle.
   * @name projectionFrame
   * @type {StockChartX.Rect}
   * @readonly
   * @memberOf StockChartX.DateScale#
   * @private
   * @internal
   */
  get projectionFrame(): Rect {
    return this._projectionFrame;
  }

  /**
   * The column width.
   * @type {number}
   * @private
   * @internal
   */
  private _columnWidth: number = 0;

  /**
   * @internal
   */
  private _calibrator: IDateScaleCalibrator;

  get calibrator(): IDateScaleCalibrator {
    return this._calibrator;
  }
  set calibrator(value: IDateScaleCalibrator) {
    this._calibrator = value;
  }

  /**
   * The date & time formatter..
   * @type {StockChartX.DateTimeFormat}
   * @private
   * @internal
   */
  private _formatter: IDateTimeFormat = new CustomTimeIntervalDateTimeFormat();

  /**
   * The date scale options.
   * @type {Object}
   * @private
   * @internal
   */
  private _options;

  /**
   * @internal
   */
  private _firstVisibleIndex: number;

  /**
   * The index of first visible record (it's integral value unlike firstVisibleRecord).
   * @name firstVisibleIndex
   * @type {number}
   * @readonly
   * @memberOf StockChartX.DateScale#
   */
  get firstVisibleIndex(): number {
    return this._firstVisibleIndex;
  }

  /**
   * @internal
   */
  private _lastVisibleIndex: number;

  /**
   * The index of last visible record (it's integral value unlike lastVisibleRecord).
   * @type {number}
   * @readonly
   * @memberOf StockChartX.DateScale#
   */
  get lastVisibleIndex(): number {
    return this._lastVisibleIndex;
  }

  /**
   * Gets/Sets first visible record.
   * @name firstVisibleRecord
   * @type {number}
   * @memberOf StockChartX.DateScale#
   */
  get firstVisibleRecord(): number {
    return this._options.firstVisibleRecord;
  }

  set firstVisibleRecord(record: number) {
    if (!this.allowPartialRecords) record = Math.trunc(record);

    let oldValue = this._options.firstVisibleRecord;
    if (oldValue !== record) {
      this._options.firstVisibleRecord = record;
      this._firstVisibleIndex = Math.floor(record);
      this.chart.fireValueChanged(
        ChartEvent.FIRST_VISIBLE_RECORD_CHANGED,
        oldValue,
        record
      );
    }
  }

  /**
   * Gets/Sets last visible record.
   * @name lastVisibleRecord
   * @type {number}
   * @memberOf StockChartX.DateScale#
   */
  get lastVisibleRecord(): number {
    return this._options.lastVisibleRecord;
  }

  set lastVisibleRecord(value: number) {
    if (!this.allowPartialRecords) value = Math.trunc(value);

    let oldValue = this._options.lastVisibleRecord;
    if (oldValue !== value) {
      this._options.lastVisibleRecord = value;
      this._lastVisibleIndex = Math.ceil(value);
      this.chart.fireValueChanged(
        ChartEvent.LAST_VISIBLE_RECORD_CHANGED,
        oldValue,
        value
      );
    }
  }

  get visibleDateRange(): IMinMaxValues<Date> {
    let frame = this.projectionFrame;

    return {
      min: this.projection.dateByX(frame.left),
      max: this.projection.dateByX(frame.right)
    };
  }

  /**
   * Gets/Sets the flag that indicate whether manual height should be used.
   * @name useManualHeight
   * @type {boolean}
   * @memberOf StockChartX.DateScale#
   */
  get useManualHeight(): boolean {
    return this._options.useManualHeight;
  }

  set useManualHeight(value: boolean) {
    this._options.useManualHeight = !!value;
  }

  /**
   * Gets/Sets manual height of date scale.
   * @name manualHeight
   * @type {Number}
   * @memberOf StockChartX.DateScale#
   */
  get manualHeight(): number {
    return this._options.height;
  }

  set manualHeight(value: number) {
    if (!JsUtil.isPositiveNumber(value))
      throw new Error("Height must be a positive number.");

    this._options.height = value;
  }

  /**
   * Gets/Sets minimum number of visible records.
   * @name minVisibleRecords
   * @type {Number}
   * @memberOf StockChartX.DateScale#
   */
  get minVisibleRecords(): number {
    return this._options.minVisibleRecords;
  }

  set minVisibleRecords(value: number) {
    if (!JsUtil.isPositiveNumber(value))
      throw new Error("Records must be a finite number greater than 0.");

    this._options.minVisibleRecords = value;
  }

  get rightAdditionalSpaceRatio(): number {
    return this._options.rightAdditionalSpaceRatio;
  }

  set rightAdditionalSpaceRatio(value: number) {
    if (JsUtil.isNegativeNumber(value))
      throw new TypeError("Ratio must be a positive number.");

    this._options.rightAdditionalSpaceRatio = value;
  }

  /**
   * Gets/Sets scroll kind.
   * @name scrollKind
   * @type {StockChartX.DateScaleScrollKind}
   * @memberOf StockChartX.DateScale#
   */
  get scrollKind(): string {
    return this._options.scrollKind;
  }

  set scrollKind(value: string) {
    this._options.scrollKind = value;
  }

  /**
   * Gets/Sets auto scroll kind.
   * @name autoScrollKind
   * @type {StockChartX.DateScaleAutoScrollKind}
   * @default {@linkcode StockChartX.DateScaleAutoScrollKind.NONE}
   * @memberOf StockChartX.DateScale#
   */
  get autoScrollKind(): DateScaleAutoScrollKind {
    return this._options.autoScrollKind;
  }

  set autoScrollKind(value: DateScaleAutoScrollKind) {
    this._options.autoScrollKind = value;
  }

  /**
   * Gets/Sets scroll mode.
   * @name autoScrollMode
   * @type {StockChartX.DateScaleAutoScrollMode}
   * @default {@linkcode StockChartX.DateScaleAutoScrollMode.NEW_BAR}
   * @memberOf StockChartX.DateScale#
   */
  get autoScrollMode(): DateScaleAutoScrollMode {
    return this._options.autoScrollMode;
  }

  set autoScrollMode(value: DateScaleAutoScrollMode) {
    this._options.autoScrollMode = value;
  }

  /**
   * Gets/Sets zoom kind.
   * @name zoomKind
   * @type {StockChartX.DateScaleZoomKind}
   * @default {@linkcode StockChartX.DateScaleZoomKind.AUTOSCALED}
   * @memberOf StockChartX.DateScale#
   */
  get zoomKind(): string {
    return this._options.zoomKind;
  }

  set zoomKind(value: string) {
    this._options.zoomKind = value;
  }

  /**
   * Gets/Sets zoom mode.
   * @name zoomMode
   * @type {StockChartX.DateScaleZoomMode}
   * @default {@linkcode StockChartX.DateScaleZoomMode.PIN_CENTER}
   * @memberOf StockChartX.DateScale#
   */
  get zoomMode(): string {
    return this._options.zoomMode;
  }

  set zoomMode(value: string) {
    this._options.zoomMode = value;
  }

  /**
   * Gets/Sets theme.
   * @name theme
   * @type {object}
   * @memberOf StockChartX.DateScale#
   */
  get theme(): any {
    return this._options.theme;
  }

  set theme(value: any) {
    let oldTheme = this._options.theme;
    this._options.theme = value;
    this.chart.fireValueChanged(
      ChartEvent.DATE_SCALE_THEME_CHANGED,
      oldTheme,
      value
    );
  }

  /**
   * Returns actual theme.
   * @name getActualTheme
   * @type {object}
   * @memberOf StockChartX.DateScale#
   */
  get actualTheme() {
    return this._options.theme || this.chart.theme.dateScale;
  }

  /**
   * Gets number of columns in the chart.
   * @name columnsCount
   * @type {number}
   * @readonly
   * @memberOf StockChartX.DateScale#
   */
  get columnsCount(): number {
    if (this.needsAutoScale()) return 0;

    return (
      this._options.lastVisibleRecord - this._options.firstVisibleRecord + 1
    );
  }

  /**
   * Get column width.
   * @name columnWidth
   * @type {number}
   * @readonly
   * @memberOf StockChartX.DateScale#
   */
  get columnWidth(): number {
    return this._columnWidth;
  }

  /**
   * Gets maximum allowed record number that can be set.
   * @name maxAllowedRecord
   * @type {Number}
   * @readonly
   * @memberOf StockChartX.DateScale#
   */
  get maxAllowedRecord(): number {
    let additionalColumns =
      (this._projectionFrame.width * this.rightAdditionalSpaceRatio) /
      this._columnWidth;

    return this.getDateDataSeries().length - 1 + additionalColumns;
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

  get textPadding(): IPadding {
    return this._options.textPadding;
  }
  set textPadding(value: IPadding) {
    this._options.textPadding = value;
  }

  get allowPartialRecords(): boolean {
    return this._options.allowPartialRecords;
  }
  set allowPartialRecords(value: boolean) {
    if (this._options.allowPartialRecords !== value) {
      this._options.allowPartialRecords = value;
      this.firstVisibleRecord = this.firstVisibleRecord;
      this.lastVisibleRecord = this.lastVisibleRecord;
    }
  }

  /**
   * @internal
   */
  private _moreHistoryRequested: boolean = false;

  private _wasAutoscale: boolean;

  // endregion

  constructor(config: any) {
    super(config);

    this._projection = new Projection(this);

    this._topPanel = new DateScalePanel({
      dateScale: this,
      cssClass: Class.TOP_SCALE,
      visible: false
    });
    this._bottomPanel = new DateScalePanel({
      dateScale: this,
      cssClass: Class.BOTTOM_SCALE
    });

    this.loadState(config);
  }

  /**
   * @internal
   */
  protected _subscribe() {
    this.chart.on(
      ChartEvent.LOCALE_CHANGED + EVENT_SUFFIX,
      (event: IValueChangedEvent) => {
        this._formatter.locale = event.value;
      },
      this
    );
  }

  /**
   * @internal
   */
  protected _unsubscribe() {
    this.chart.off(EVENT_SUFFIX, this);
  }

  /**
   * @internal
   */
  _calculateProjectionMetrics() {
    this._columnWidth = this._projectionFrame.width / this.columnsCount;
    if (this.chart.smartPriceStyleHandler)
      this.chart.smartPriceStyleHandler.adopt();
  }

  /**
   * Marks that scale needs to be auto-scaled on next layout.
   * @method setNeedsAutoScale
   * @memberOf StockChartX.DateScale#
   */
  setNeedsAutoScale() {
    this.firstVisibleRecord = null;
    this.lastVisibleRecord = null;
  }

  /**
   * Determines if auto-scaling is needed.
   * @method needsAutoScale
   * @returns {boolean}
   * @memberOf StockChartX.DateScale#
   */
  needsAutoScale(): boolean {
    return this.firstVisibleRecord == null || this.lastVisibleRecord == null;
  }

  /**
   * Auto-scales date scale to show all records.
   * @method autoScale
   * @memberOf StockChartX.DateScale#
   */
  autoScale() {
    let count = this.chart.recordCount;

    this.firstVisibleRecord = count > 0 ? 0 : null;
    this.lastVisibleRecord = count > 0 ? count - 1 : null;
    this._wasAutoscale = true;
  }

  /**
   * Returns date data series.
   * @method getDateDataSeries
   * @returns {StockChartX.DataSeries}
   * @memberOf StockChartX.DateScale#
   */
  getDateDataSeries(): DataSeries {
    return this.chart.primaryDataSeries(DataSeriesSuffix.DATE);
  }

  handleEvent(event: IWindowEvent): boolean {
    return (
      this._bottomPanel.handleEvent(event) || this._topPanel.handleEvent(event)
    );
  }

  /**
   * Returns string representation of a given date according to the chart's time interval.
   * @method formatDate
   * @param {Date} date The date.
   * @returns {string}
   * @memberOf StockChartX.DateScale#
   */
  formatDate(date: Date): string {
    this._formatter.timeInterval = this.chart.timeInterval;

    return this._formatter.format(date);
  }

  /**
   * Scrolls date scale on a given number of pixels.
   * @method scrollOnPixels
   * @param {number} pixels The number of pixels to scroll.
   * @returns {boolean} True if scroll was performed, false otherwise.
   * @memberOf StockChartX.DateScale#
   */
  scrollOnPixels(pixels: number): boolean {
    if (!isFinite(pixels)) throw new Error("Finite number expected.");
    if (Math.abs(pixels) < MIN_SCROLL_PIXELS) return false;

    let records = Math.abs(pixels) / this.columnWidth;
    if (!this.allowPartialRecords) records = Math.ceil(records);

    return this.scrollOnRecords(pixels >= 0 ? records : -records);
  }

  /**
   * Scrolls date scale on a given number of records.
   * @method scrollOnRecords
   * @param {Number} records The number of records to scroll.
   * @returns {boolean} True if scroll was performed, false otherwise.
   * @memberOf StockChartX.DateScale#
   */
  scrollOnRecords(records: number): boolean {
    if (records === 0) return false;

    let allowPartialRecords = this.allowPartialRecords,
      oldFirstRecord = this.firstVisibleRecord,
      oldLastRecord = this.lastVisibleRecord,
      newFirstRecord = oldFirstRecord - records,
      newLastRecord = oldLastRecord - records;
    if (!allowPartialRecords) {
      newFirstRecord = Math.round(newFirstRecord);
      newLastRecord = Math.round(newLastRecord);
    }

    if (
      !this.canSetVisibleRecord(newFirstRecord) ||
      !this.canSetVisibleRecord(newLastRecord)
    ) {
      if (newFirstRecord >= 0) return false;

      newFirstRecord = 0;
      newLastRecord = oldLastRecord - oldFirstRecord;
      if (
        !this.canSetVisibleRecord(newFirstRecord) ||
        !this.canSetVisibleRecord(newLastRecord)
      )
        return false;
    }

    this.firstVisibleRecord = newFirstRecord;
    this.lastVisibleRecord = newLastRecord;

    this.requestMoreHistoryIfNeed();

    return true;
  }

  /**
   * Zooms date scale on a given number of pixels.
   * @method zoomOnPixels
   * @param {Number} leftPixels The number of pixels to zoom from the left side.
   * @param {Number} [rightPixels] The number of pixels to zoom from the right side.
   * @returns {Boolean} True if zoom was performed, false otherwise.
   * @memberOf StockChartX.DateScale#
   */
  zoomOnPixels(leftPixels: number, rightPixels?: number): boolean {
    if (rightPixels == null) rightPixels = leftPixels;

    if (!isFinite(leftPixels) || !isFinite(rightPixels))
      throw new Error("Pixels must be a finite number.");
    if (
      Math.abs(leftPixels) < MIN_ZOOM_PIXELS &&
      Math.abs(rightPixels) < MIN_ZOOM_PIXELS
    )
      return false;

    let columnWidth = this.columnWidth,
      allowPartialRecords = this.allowPartialRecords,
      leftRecords = Math.abs(leftPixels) / columnWidth,
      rightRecords = Math.abs(rightPixels) / columnWidth;
    if (!allowPartialRecords) {
      leftRecords = Math.ceil(leftRecords);
      rightRecords = Math.ceil(rightRecords);
    }

    return this.zoomOnRecords(
      leftPixels > 0 ? leftRecords : -leftRecords,
      rightPixels > 0 ? rightRecords : -rightRecords
    );
  }

  /**
   * Zooms date scale on a given number of records.
   * @method zoomOnRecords
   * @param {Number} leftRecords Number of records to zoom from the left side.
   * @param {Number} [rightRecords] Number of records to zoom from the right side.
   * @returns {boolean} True if zoom was performed, false otherwise.
   * @memberOf StockChartX.DateScale#
   */
  zoomOnRecords(leftRecords: number, rightRecords?: number): boolean {
    if (rightRecords == null) rightRecords = leftRecords;

    if (leftRecords === 0 && rightRecords === 0) return false;

    let allowPartialRecords = this.allowPartialRecords,
      oldFirstRecord = this.firstVisibleRecord,
      oldLastRecord = this.lastVisibleRecord,
      newFirstRecord = oldFirstRecord + leftRecords,
      newLastRecord = oldLastRecord - rightRecords;
    if (!allowPartialRecords) {
      newFirstRecord = Math.round(newFirstRecord);
      newLastRecord = Math.round(newLastRecord);
    }

    if (newFirstRecord > newLastRecord)
      newFirstRecord = newLastRecord = Math.max(newLastRecord, oldLastRecord);

    if (!this.canSetVisibleRecord(newFirstRecord)) {
      this.firstVisibleRecord = 0;
      this.requestMoreHistoryIfNeed();

      return false;
    }
    if (!this.canSetVisibleRecord(newLastRecord))
      newLastRecord = this.maxAllowedRecord;

    let isChanged =
      newFirstRecord !== oldFirstRecord || newLastRecord !== oldLastRecord;
    if (isChanged) {
      let oldVisibleRecords = oldLastRecord - oldFirstRecord + 1,
        newVisibleRecords = newLastRecord - newFirstRecord + 1;
      if (
        newVisibleRecords < oldVisibleRecords &&
        newVisibleRecords < this.minVisibleRecords
      )
        return false;
      if (newVisibleRecords < this.minVisibleRecords) return false;
      if (newFirstRecord >= this.getDateDataSeries().length) return false;

      this.firstVisibleRecord = newFirstRecord;
      this.lastVisibleRecord = newLastRecord;

      this.requestMoreHistoryIfNeed();
    }

    return isChanged;
  }

  /**
   * @internal
   */
  _handleZoom(pixels: number, multiplier?: number) {
    switch (this.zoomMode) {
      case DateScaleZoomMode.PIN_CENTER:
        this.zoomOnPixels(pixels);
        break;
      case DateScaleZoomMode.PIN_LEFT:
        this.zoomOnPixels(0, pixels);
        break;
      case DateScaleZoomMode.PIN_RIGHT:
        this.zoomOnPixels(pixels, 0);
        break;
      case DateScaleZoomMode.PIN_MOUSE:
        this.zoomOnPixels(pixels * multiplier, pixels * (1 - multiplier));
        break;
      default:
        throw new Error(`Unknown zoom mode: ${this.zoomMode}`);
    }

    let needsAutoscale = false;
    if (this.zoomKind === DateScaleZoomKind.AUTOSCALED) needsAutoscale = true;
    this.chart.setNeedsUpdate(needsAutoscale);
  }
  /**
   * @internal
   */
  requestMoreHistoryIfNeed() {
    let chart = this.chart;
    if (chart.firstVisibleIndex > 0) this._moreHistoryRequested = false;
    else if (!this._moreHistoryRequested) {
      chart.requestMoreBars();
      this._moreHistoryRequested = true;
    }
  }

  // region IStateProvider

  /**
   * Saves component state.
   * @method saveState
   * @returns {Object}
   * @see [loadState]{@linkcode StockChartX.DateScale#loadState} to load state.
   * @memberOf StockChartX.DateScale#
   */
  saveState(): IDateScaleState {
    let state = <IDateScaleState>JsUtil.clone(this._options);
    state.formatter = <IDateTimeFormatState>this._formatter.saveState();
    state.calibrator = <IDateScaleCalibratorState>this._calibrator.saveState();

    return state;
  }

  /**
   * Loads component state.
   * @method loadState
   * @param {Object} state The state
   * @see [saveState]{@linkcode StockChartX.DateScale#saveState} to save state.
   * @memberOf StockChartX.DateScale#
   */
  loadState(state: IDateScaleState) {
    state = state || <IDateScaleState>{};

    this._options = {};

    this.theme = state.theme;
    this.allowPartialRecords =
      state.allowPartialRecords != null ? !!state.allowPartialRecords : true;
    this.firstVisibleRecord =
      state.firstVisibleRecord != null ? state.firstVisibleRecord : null;
    this.lastVisibleRecord =
      state.lastVisibleRecord != null ? state.lastVisibleRecord : null;
    this.minVisibleRecords = state.minVisibleRecords || 5;
    this.textPadding = state.textPadding || {
      left: 3,
      top: null,
      right: 3,
      bottom: 3
    };
    this.manualHeight = state.height || 15;
    this.useManualHeight =
      state.useManualHeight != null ? state.useManualHeight : false;
    this.scrollKind = state.scrollKind || DateScaleScrollKind.AUTOSCALED;
    this.zoomKind = state.zoomKind || DateScaleZoomKind.AUTOSCALED;
    this.zoomMode = state.zoomMode || DateScaleZoomMode.PIN_CENTER;
    this.autoScrollKind = state.autoScrollKind || DateScaleAutoScrollKind.NONE;
    this.autoScrollMode = state.scrollMode || DateScaleAutoScrollMode.NEW_BAR;
    this.rightAdditionalSpaceRatio = state.rightAdditionalSpaceRatio || 0.5;
    if (state.formatter)
      this._formatter = DateTimeFormat.deserialize(state.formatter);
    this._formatter.locale = this.chart.locale;
    this.majorTickMarkLength = state.majorTickMarkLength || 5;
    this.minorTickMarkLength = state.minorTickMarkLength || 3;
    if (state.calibrator)
      this._calibrator = DateScaleCalibrator.deserialize(state.calibrator);
    else this._calibrator = new CustomDateScaleCalibrator();
  }

  // endregion

  canSetVisibleRecord(record: number) {
    return record >= 0 && record <= this.maxAllowedRecord;
  }

  /**
   * @internal
   */
  private _onUpdateAnimationCallback() {
    this.layoutScalePanel(this.chart.getBounds());
    this.draw();
  }

  setNeedsUpdate(setNeedsAutoScale?: boolean) {
    if (setNeedsAutoScale) this.setNeedsAutoScale();
    this._updateAnimation.start();
  }

  /**
   * Layouts scale container only.
   * @method layoutScalePanel
   * @param {StockChartX.Rect} chartFrame The chart frame rectangle.
   * @memberOf StockChartX.DateScale#
   */
  layoutScalePanel(chartFrame: Rect) {
    if (this.needsAutoScale()) {
      this.autoScale();
    }
    let topFrame = this._topPanel.layoutPanel(chartFrame, true);
    let bottomFrame = this._bottomPanel.layoutPanel(chartFrame, false);

    let remainingFrame = chartFrame.clone();
    if (topFrame) remainingFrame.cropTop(topFrame);
    if (bottomFrame) remainingFrame.cropBottom(bottomFrame);

    return remainingFrame;
  }

  /**
   * Layouts date scale elements.
   * @method layout
   * @param {StockChartX.Rect} frame The frame rectangle.
   * @param {StockChartX.Rect} projectionFrame The projection frame rectangle.
   * @memberOf StockChartX.DateScale#
   */
  layout(frame: Rect, projectionFrame: Rect) {
    this._projectionFrame.copyFrom(projectionFrame);
    if (this.needsAutoScale() || this._wasAutoscale) {
      this._projectionFrame.applyPadding(
        this.chart.chartPanelsContainer.panelPadding
      );
      if (this.needsAutoScale()) {
        this.autoScale();
      }
      this._wasAutoscale = false;
    }
    this._calculateProjectionMetrics();
    this._calibrator.calibrate(this);

    this._topPanel.layout(frame, true);
    this._bottomPanel.layout(frame, false);
  }

  public _canvasStartX(): number {
    return (
      this._projectionFrame.left -
      this.chart.chartPanelsFrame.left -
      this.chart.chartPanelsContainer.panelPadding.left
    );
  }

  /**
   * @internal
   */
  _textDrawBounds(): IRect {
    return {
      left: this.textPadding.left,
      top: null,
      width: this.chart.chartPanelsContainer.frame.width,
      height: null
    };
  }

  clear() {
    this._topPanel.clearPanel();
    this._bottomPanel.clearPanel();
  }

  /**
   * Draws date scale.
   * @method draw
   * @memberOf StockChartX.DateScale#
   */
  draw() {
    this._topPanel.draw();
    this._bottomPanel.draw();

    if (this.chart.showDrawings) {
      for (let chartPanel of this.chart.chartPanels) {
        for (let drawing of chartPanel.drawings) {
          if (!drawing.selected) drawing.drawDateMarkers();
        }
      }
    }
  }

  /**
   * Scroll, when last bar was updated or added new bar.
   * @method applyAutoScroll
   * @memberOf StockChartX.DateScale#
   */
  applyAutoScroll(kind: BarsUpdateKind) {
    switch (kind) {
      case BarsUpdateKind.NEW_BAR:
        this._autoScroll(DateScaleAutoScrollMode.NEW_BAR);
        break;
      case BarsUpdateKind.TICK:
        this._autoScroll(DateScaleAutoScrollMode.TICK);
        break;
      default:
        break;
    }
  }

  onMoreHistoryRequestCompleted() {
    this._moreHistoryRequested = false;
  }

  /**
   * @internal
   */
  private _autoScroll(mode: DateScaleAutoScrollMode) {
    let chart = this.chart,
      count = chart.recordCount,
      forward = this.lastVisibleRecord - count + 1;

    if (chart.state !== ChartState.NORMAL) return;

    switch (this.autoScrollKind) {
      case DateScaleAutoScrollKind.ALWAYS:
        if (forward < 0 && this.autoScrollMode === mode)
          this.scrollOnRecords(forward);
        break;
      case DateScaleAutoScrollKind.HIDDEN_BAR:
        if (forward < 0) this.scrollOnRecords(forward);
        break;
      default:
        break;
    }
  }
}
