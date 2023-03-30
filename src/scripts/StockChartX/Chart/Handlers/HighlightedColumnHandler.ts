import {
  IHighlightedColumnTheme,
  HighlightedColumn,
  IHighlightedColumnConfig
} from "../../index";
import { IBar } from "../../index";
import { Control } from "../../index";
import { Chart } from "../../index";
import { ChartPanel } from "../../index";
import { GestureArray } from "../../index";
import { ClickGesture } from "../../index";
import { Key } from "../../index";
import { IWindowEvent } from "../../index";
import { JsUtil } from "../../index";
import { IPoint } from "../../index";
import { ChartEvent } from "../../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

export type TBarColumn = number | Date | IBar;

export interface IHighlightedColumnItem {
  column: TBarColumn;
  theme?: IHighlightedColumnTheme;
}

export type THighlightedColumn = TBarColumn | IHighlightedColumnItem;

/**
 * Represents HighlightedColumnHandler
 * @param {Chart} chart
 * @constructor StockChartX.HighlightedColumnHandler
 * @augments StockChartX.Control
 */
export class HighlightedColumnHandler extends Control {
  /**
   * @internal
   */
  private _highlightedColumns: HighlightedColumn[] = [];

  get highlightedColumns(): HighlightedColumn[] {
    return this._highlightedColumns;
  }

  /**
   * @internal
   */
  private _chart: Chart;

  get chart(): Chart {
    return this._chart;
  }

  /**
   * @internal
   */
  private _visible: boolean = true;

  set visible(value: boolean) {
    this._visible = value;
  }

  get visible(): boolean {
    return this._visible;
  }

  get chartPanel(): ChartPanel {
    return this._chart.mainPanel;
  }

  constructor(chart: Chart) {
    super();

    this._chart = chart;
  }

  /**
   * @internal
   */
  protected _initGestures() {
    return new GestureArray(
      [
        new ClickGesture({
          handler: this._handleClickGesture,
          hitTest: this._hitTest,
          keys: [Key.CTRL]
        })
      ],
      this
    );
  }

  /**
   * @internal
   */
  private _handleClickGesture(gesture: ClickGesture, event: IWindowEvent) {
    let x = event.pointerPosition.x,
      chart = this.chart,
      record = this.chartPanel.projection.recordByX(x),
      bar = chart.primaryBar(record);

    if (!bar) return;

    this._processBarDate(bar.date);
    this.chartPanel.setNeedsUpdate();
  }

  /**
   * @internal
   */
  private _processBarDate(barDate: Date) {
    let _index = this._innerColumnIndex(barDate);

    if (_index === -1) this._add({ date: barDate });
    else this._remove(_index);
  }

  /**
   * Adds column to bar
   * @method add
   * @param {THighlightedColumn | THighlightedColumn[]} columns The column or an array of columns to add
   * @memberOf StockChartX.HighlightedColumnHandler#
   */
  add(...columns: THighlightedColumn[]) {
    let chart = this.chart,
      barsToAddColumn = JsUtil.flattenArray(columns);

    for (let columnItem of barsToAddColumn) {
      let bar: IBar = null;

      if (JsUtil.isNumber(columnItem) || columnItem instanceof Date) {
        bar = chart.primaryBar(<number | Date>columnItem);
      } else if (typeof columnItem === "object") {
        if ((<IBar>columnItem).date) {
          bar = <IBar>columnItem;
        } else {
          let col = (<IHighlightedColumnItem>columnItem).column;
          if (typeof col === "object" && (<IBar>col).date) {
            bar = <IBar>col;
          } else {
            bar = chart.primaryBar(<number>col);
          }
        }
      }

      if (bar && this._innerColumnIndex(bar.date) === -1) {
        this._add({
          date: bar.date,
          theme: JsUtil.isNumber(columnItem)
            ? null
            : (<IHighlightedColumnItem>columnItem).theme
        });
      }
    }
  }

  /**
   * Removes column of bar
   * @method remove
   * @param {TBarColumn | TBarColumn[]} columns The column or an array of columns to remove
   * @memberOf StockChartX.HighlightedColumnHandler#
   */
  remove(...columns: TBarColumn[]) {
    if (columns.length === 0) {
      this.chartPanel.removeObjects(this._highlightedColumns);
      this._highlightedColumns = [];

      return;
    }

    let chart = this.chart,
      columnsToRemove = JsUtil.flattenArray(columns);

    for (let columnItem of columnsToRemove) {
      let bar: IBar =
        typeof columnItem === "object" && (<IBar>columnItem).date
          ? <IBar>columnItem
          : chart.primaryBar(<number | Date>columnItem);

      if (!bar) return;

      let _index = this._innerColumnIndex(bar.date);

      if (_index !== -1) this._remove(_index);
    }
  }

  /**
   * @internal
   */
  private _add(column: IHighlightedColumnConfig) {
    let newBarColumn = new HighlightedColumn(column);

    this._highlightedColumns.push(newBarColumn);
    this.chartPanel.addObjects(newBarColumn);

    this.chart.fireValueChanged(
      ChartEvent.HIGHLIGHTED_COLUMN_ADDED,
      column.date
    );
  }

  /**
   * @internal
   */
  private _remove(index: number) {
    let barColumn = this._highlightedColumns.splice(index, 1)[0];
    this.chartPanel.removeObjects(barColumn);

    this.chart.fireValueChanged(
      ChartEvent.HIGHLIGHTED_COLUMN_REMOVED,
      barColumn.date
    );
  }

  /**
   * @internal
   */
  private _innerColumnIndex(date: Date) {
    for (let i = 0; i < this._highlightedColumns.length; i++) {
      if (this._highlightedColumns[i].checkDate(date)) return i;
    }

    return -1;
  }

  /**
   * @internal
   */
  private _hitTest(point: IPoint): boolean {
    return this.chartPanel.hitTest(point);
  }

  /**
   * @inheritdoc
   */
  destroy() {
    for (let highlightedColumn of this._highlightedColumns) {
      highlightedColumn.destroy();
    }

    this._highlightedColumns = [];
  }
}
