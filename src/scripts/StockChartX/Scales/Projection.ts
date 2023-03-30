/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */
import { DateScale, ScaleKind } from "../index";
import { ChartPanelValueScale } from "../index";
"use strict";

/**
 * Represent projection. Converts records to pixels, pixels to records, etc...
 * @param {StockChartX.DateScale} [dateScale] The corresponding date scale.
 * @param {StockChartX.ChartPanelValueScale} [valueScale] The corresponding value scale.
 * @constructor StockChartX.Projection
 */
export class Projection {
  /**
   * @internal
   */
  private _dateScale: DateScale;
  /**
   * Gets corresponding date scale.
   * @name dateScale
   * @returns {StockChartX.DateScale}
   * @readonly
   * @memberOf StockChartX.Projection#
   */
  get dateScale(): DateScale {
    return this._dateScale;
  }

  /**
   * @internal
   */
  private _valueScale: ChartPanelValueScale;
  /**
   * Gets corresponding value scale.
   * @name valueScale
   * @returns {StockChartX.ChartPanelValueScale}
   * @readonly
   * @memberOf StockChartX.Projection#
   */
  get valueScale(): ChartPanelValueScale {
    return this._valueScale;
  }

  /**
   * Determines if X coordinate can be resolved. X coordinate can be resolved if date scale is specified.
   * @name canResolveX
   * @type {Boolean}
   * @memberOf StockChartX.Projection#
   * @see [canResolveY]{@linkcode StockChartX.Projection#canResolveY}
   */
  get canResolveX(): boolean {
    return !!this._dateScale;
  }

  /**
   * Determines if Y coordinate can be resolved. Y coordinate can be resolved if value scale is specified.
   * @name canResolveY
   * @type {Boolean}
   * @memberOf StockChartX.Projection#
   * * @see [canResolveX]{@linkcode StockChartX.Projection#canResolveX}
   */
  get canResolveY(): boolean {
    return !!this._valueScale;
  }

  constructor(dateScale: DateScale, valueScale?: ChartPanelValueScale) {
    this._dateScale = dateScale;
    this._valueScale = valueScale;
  }

  /**
   * Returns column number by record.
   * @method columnByRecord
   * @param {Number} record The record.
   * @param {boolean} [isIntegral=true] The flag that indicates whether resulting column should be integral number.
   * @returns {number} Column number.
   * @memberOf StockChartX.Projection#
   * @see [recordByColumn]{@linkcode StockChartX.Projection#recordByColumn}
   * @see [columnByX]{@linkcode StockChartX.Projection#columnByX}
   * @see [columnByDate]{@linkcode StockChartX.Projection#columnByDate}
   */
  columnByRecord(record: number, isIntegral?: boolean): number {
    let column = record - Math.trunc(this._dateScale.firstVisibleRecord);
    if (isIntegral !== false) column = Math.trunc(column);

    return column;
  }

  /**
   * Returns record index by column number.
   * @method recordByColumn
   * @param {Number} column The column number.
   * @param {boolean} [isIntegral = true] The flag that indicates whether resulting record should be an integral number.
   * @returns {Number}
   * @memberOf StockChartX.Projection#
   * @see [columnByRecord]{@linkcode StockChartX.Projection#columnByRecord}
   * @see [recordByX]{@linkcode StockChartX.Projection#recordByX}
   * @see [recordByDate]{@linkcode StockChartX.Projection#recordByDate}
   */
  recordByColumn(column: number, isIntegral?: boolean): number {
    let record = column + Math.trunc(this._dateScale.firstVisibleRecord);
    if (isIntegral !== false) record = Math.trunc(record);

    return record;
  }

  /**
   * Returns X coordinate by column number.
   * @method xByColumn
   * @param {Number} column The column number.
   * @param {boolean} [isColumnIntegral = true] If true then column is integral value and half-column width is added to the result.
   * For internal use.
   * @param {boolean} [isXIntegral=true] The flag that indicates whether resulting X should be rounded to integral value.
   * @returns {number} X coordinate.
   * @memberOf StockChartX.Projection#
   * @see [columnByX]{@linkcode StockChartX.Projection#columnByX}
   * @see [xByRecord]{@linkcode StockChartX.Projection#xByRecord}
   * @see [xByDate]{@linkcode StockChartX.Projection#xByDate}
   */
  xByColumn(
    column: number,
    isColumnIntegral?: boolean,
    isXIntegral?: boolean
  ): number {
    let dateScale = this._dateScale,
      columnWidth = dateScale.columnWidth,
      firstRecord = dateScale.firstVisibleRecord,
      firstColumnOffset = (firstRecord - Math.trunc(firstRecord)) * columnWidth,
      frame = dateScale.projectionFrame,
      x = frame.left - firstColumnOffset + column * columnWidth;

    if (isColumnIntegral !== false) x += columnWidth / 2;

    return isXIntegral !== false ? Math.round(x) : x;
  }

  /**
   * Returns column number by X coordinate.
   * @method columnByX
   * @param {Number} x The X coordinate.
   * @param {Boolean} [isIntegral = true] The flag that indicates whether resulting column should be an integral number.
   * @returns {number}
   * @memberOf StockChartX.Projection#
   * @see [xByColumn]{@linkcode StockChartX.Projection#xByColumn}
   * @see [columnByRecord]{@linkcode StockChartX.Projection#columnByRecord}
   * @see [columnByDate]{@linkcode StockChartX.Projection#columnByDate}
   */
  columnByX(x: number, isIntegral?: boolean): number {
    let dateScale = this._dateScale,
      frame = dateScale.projectionFrame,
      firstRecord = dateScale.firstVisibleRecord,
      columnWidth = dateScale.columnWidth,
      firstColumnOffset = (firstRecord - Math.trunc(firstRecord)) * columnWidth,
      column = (x - frame.left + firstColumnOffset) / columnWidth;

    return isIntegral !== false ? Math.floor(column) : column;
  }

  /**
   * Returns X coordinate by record number.
   * @method xByRecord
   * @param {Number} record The record number.
   * @param {boolean} [isIntegral = true] For internal use.
   * @param {boolean} [isXIntegral=true] The flag that indicates whether resulting X should be rounded to integral value.
   * @returns {number}
   * @memberOf StockChartX.Projection#
   * @see [recordByX]{@linkcode StockChartX.Projection#recordByX}
   * @see [xByColumn]{@linkcode StockChartX.Projection#xByColumn}
   * @see [xByDate]{@linkcode StockChartX.Projection#xByDate}
   */
  xByRecord(
    record: number,
    isIntegral?: boolean,
    isXIntegral?: boolean
  ): number {
    return this.xByColumn(
      this.columnByRecord(record, isIntegral),
      isIntegral,
      isXIntegral
    );
  }

  /**
   * Returns record number by X coordinate.
   * @method recordByX
   * @param {Number} x The X coordinate
   * @param {Boolean} [isIntegral=true] The flag that indicates whether resulting record should be integral number.
   * @returns {Number}
   * @memberOf StockChartX.Projection#
   * @see [xByRecord]{@linkcode StockChartX.Projection#xByRecord}
   * @see [recordByColumn]{@linkcode StockChartX.Projection#recordByColumn}
   * @see [recordByDate]{@linkcode StockChartX.Projection#recordByDate}
   */
  recordByX(x: number, isIntegral?: boolean): number {
    return this.recordByColumn(this.columnByX(x, isIntegral), isIntegral);
  }

  /**
   * Returns date value by record number. It does not support float number records.
   * @method dateByRecord
   * @param {Number} record The record number
   * @returns {Date}
   * @memberOf StockChartX.Projection#
   * @see [recordByDate]{@linkcode StockChartX.Projection#recordByDate}
   * @see [dateByColumn]{@linkcode StockChartX.Projection#dateByColumn}
   * @see [dateByX]{@linkcode StockChartX.Projection#dateByX}
   */
  dateByRecord(record: number): Date {
    let dates = this._dateScale.getDateDataSeries().values,
      recordTime;

    if (dates.length === 0) return new Date(0);

    if (record < 0) {
      let firstTime = (<Date>dates[0]).getTime();

      recordTime = firstTime + record * this._dateScale.chart.timeInterval;

      return new Date(recordTime);
    }

    if (record >= dates.length) {
      let lastTime = (<Date>dates[dates.length - 1]).getTime();

      recordTime =
        lastTime +
        (record - dates.length + 1) * this._dateScale.chart.timeInterval;

      return new Date(recordTime);
    }

    return <Date>dates[record];
  }

  /**
   * Returns record number by date value.
   * @method recordByDate
   * @param {Date} date The date.
   * @returns {Number}
   * @memberOf StockChartX.Projection#
   * @see [dateByRecord]{@linkcode StockChartX.Projection#dateByRecord}
   * @see [recordByColumn]{@linkcode StockChartX.Projection#recordByColumn}
   * @see [recordByX]{@linkcode StockChartX.Projection#recordByX}
   */
  recordByDate(date: Date): number {
    let dateScale = this._dateScale,
      dateDataSeries = dateScale.getDateDataSeries();

    if (dateDataSeries.length === 0) return -1;

    let index = dateDataSeries.floorIndex(date);
    if (index < 0) {
      let leftTimeDiff =
        date.getTime() - (<Date>dateDataSeries.firstValue).getTime();
      index = Math.floor(leftTimeDiff / dateScale.chart.timeInterval);
    } else if (index >= dateDataSeries.length) {
      let rightTimeDiff =
        date.getTime() - (<Date>dateDataSeries.lastValue).getTime();
      index =
        dateDataSeries.length -
        1 +
        Math.floor(rightTimeDiff / dateScale.chart.timeInterval);
    }

    return index;
  }

  /**
   * Returns date value by column number. It does not support float number columns.
   * @method dateByColumn
   * @param {Number} column The column number.
   * @returns {Date}
   * @memberOf StockChartX.Projection#
   * @see [columnByDate]{@linkcode StockChartX.Projection#columnByDate}
   * @see [dateByRecord]{@linkcode StockChartX.Projection#dateByRecord}
   * @see [dateByX]{@linkcode StockChartX.Projection#dateByX}
   */
  dateByColumn(column: number): Date {
    let record = this.recordByColumn(column);

    return this.dateByRecord(record);
  }

  /**
   * Returns column number by date value.
   * @method columnByDate
   * @param {Date} date The date.
   * @returns {number}
   * @memberOf StockChartX.Projection#
   * @see [dateByColumn]{@linkcode StockChartX.Projection#dateByColumn}
   * @see [columnByRecord]{@linkcode StockChartX.Projection#columnByRecord}
   * @see [columnByX]{@linkcode StockChartX.Projection#columnByX}
   */
  columnByDate(date: Date): number {
    let x = this.xByDate(date, false);

    return this.columnByX(x);
  }

  /**
   * Returns date value by X coordinate.
   * @method dateByX
   * @param {Number} x The X coordinate.
   * @returns {Date}
   * @memberOf StockChartX.Projection#
   * @see [xByDate]{@linkcode StockChartX.Projection#xByDate}
   * @see [dateByColumn]{@linkcode StockChartX.Projection#dateByColumn}
   * @see [dateByRecord]{@linkcode StockChartX.Projection#dateByRecord}
   */
  dateByX(x: number): Date {
    x = Math.round(x);

    let column = this.columnByX(x),
      columnX = this.xByColumn(column, true, false),
      columnDate = this.dateByColumn(column);

    if (x === columnX) return columnDate;

    let nearestColumn = x < columnX ? column - 1 : column + 1,
      nearestColumnX = this.xByColumn(nearestColumn, true, false),
      nearestColumnDate = this.dateByColumn(nearestColumn),
      width = columnX - nearestColumnX,
      columnTime = columnDate.getTime(),
      time = columnTime;

    if (width !== 0) {
      let ratio = (x - columnX) / width;

      time += (columnTime - nearestColumnDate.getTime()) * ratio;
    }

    return new Date(time);
  }

  /**
   * Returns X coordinate by date value.
   * @method xByDate
   * @param {Date} date The date.
   * @param {boolean} [isIntegral = true] The flag that indicates whether resulting x should be rounded to integral value.
   * @returns {number}
   * @memberOf StockChartX.Projection#
   * @see [dateByX]{@linkcode StockChartX.Projection#dateByX}
   * @see [xByColumn]{@linkcode StockChartX.Projection#xByColumn}
   * @see [xByRecord]{@linkcode StockChartX.Projection#xByRecord}
   */
  xByDate(date: Date, isIntegral?: boolean): number {
    let record = this.recordByDate(date),
      recordX = this.xByRecord(record, true, false),
      recordDate = this.dateByRecord(record),
      nextRecord = record + 1,
      nextRecordX = this.xByRecord(nextRecord, true, false),
      nextRecordDate = this.dateByRecord(nextRecord),
      recordTime = recordDate.getTime(),
      timeDiff = nextRecordDate.getTime() - recordDate.getTime(),
      x = recordX;

    if (timeDiff !== 0) {
      let ratio = (date.getTime() - recordTime) / timeDiff;

      x += (nextRecordX - recordX) * ratio;
    }

    return isIntegral !== false ? Math.round(x) : x;
  }

  _logarithmfromValue(value) {
    return value < 0 ? -Math.log(Math.abs(value) + 1) : Math.log(value + 1);
  }

  /**
   * Returns Y coordinate by value.
   * @method yByValue
   * @param {Number} value The value.
   * @returns {number}
   * @memberOf StockChartX.Projection#
   * @see [valueByY]{@linkcode StockChartX.Projection#valueByY}
   */
  yByValue(value: number): number {
    const valueScale = this._valueScale,
      frame = valueScale.projectionFrame,
      maxValue = valueScale.maxVisibleValue,
      minValue = valueScale.minVisibleValue;
    let kind = valueScale.chart.valueScaleKind;
    if (isIndicator(valueScale.chartPanel)) {
      kind = ScaleKind.LINEAR;
    }
    switch (kind) {
      case ScaleKind.LINEAR:
        const factor = frame.height / (maxValue - minValue);
        return Math.round(frame.top + (maxValue - value) * factor);
      case ScaleKind.LOGARITHMIC:
        const bottom = frame.bottom,
          top = frame.top,
          logMin = this._logarithmfromValue(minValue),
          logMax = this._logarithmfromValue(maxValue),
          u = (logMax - logMin) / (top - bottom);
        return Math.round(
          (this._logarithmfromValue(value) - logMin) / u + bottom
        );
      default:
        throw new Error("Unknown value scale kind: " + kind);
    }
  }

  /**
   * Returns value by Y coordinate.
   * @method valueByY
   * @param {Number} y The Y coordinate.
   * @returns {number}
   * @memberOf StockChartX.Projection#
   * @see [yByValue]{@linkcode StockChartX.Projection#yByValue}
   */
  valueByY(y: number): number {
    const valueScale = this._valueScale,
      frame = valueScale.projectionFrame,
      maxValue = valueScale.maxVisibleValue,
      minValue = valueScale.minVisibleValue;
    let kind = valueScale.chart.valueScaleKind;
    if (isIndicator(valueScale.chartPanel)) {
      kind = ScaleKind.LINEAR;
    }
    switch (kind) {
      case ScaleKind.LINEAR:
        const a = (maxValue - minValue) / frame.height;
        return maxValue - (y - frame.top) * a;
      case ScaleKind.LOGARITHMIC:
        const height = frame.height,
          top = frame.top,
          logMin = this._logarithmfromValue(minValue),
          logMax = this._logarithmfromValue(maxValue),
          u = (logMax - logMin) / (top - height);
        return Math.exp(logMin + u * (y - height)) - 1;
      default:
        throw new Error("Unknown value scale kind: " + kind);
    }
  }
}
function isIndicator(chartPanel): boolean {
  if (chartPanel.chart.mainPanel !== chartPanel) {
    return true;
  }
}
