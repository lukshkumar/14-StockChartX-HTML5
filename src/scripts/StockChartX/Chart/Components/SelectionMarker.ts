import {
  IChartComponent,
  ChartComponent
} from "../../index";
import { IPoint } from "../../index";
import { Chart } from "../../index";
import { IStrokeTheme, IFillTheme } from "../../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

/**
 * The selection marker theme structure.
 * @typedef {object} StockChartX~SelectionMarkerTheme
 * @type {object}
 * @property {StockChartX.StrokeTheme} line The border line theme.
 * @property {StockChartX.FillTheme} fill The fill theme.
 * @memberOf StockChartX
 * @example
 * // Selection marker with black border and white background.
 * var theme = {
 *  line: {
 *      strokeColor: 'black'
 *  },
 *  fill: {
 *      fillColor: 'white'
 *  }
 * };
 */

"use strict";

// region Interfaces

export interface ISelectionMarker extends IChartComponent {
  width: number;
  theme: ISelectionMarkerTheme;
  readonly actualTheme: ISelectionMarkerTheme;

  draw(context: CanvasRenderingContext2D, point: IPoint | IPoint[]);
}

export interface ISelectionMarkerConfig {
  chart: Chart;
  theme?: ISelectionMarkerTheme;
  width?: number;
}

export interface ISelectionMarkerTheme {
  line: IStrokeTheme;
  fill: IFillTheme;
}

// endregion

/**
 * Represents object's selection marker.
 * @constructor StockChartX.SelectionMarker
 * @augments StockChartX.ChartComponent
 */
export class SelectionMarker extends ChartComponent
  implements ISelectionMarker {
  // region Properties

  /**
   * Gets/Sets marker's width.
   * @name width
   * @type {number}
   * @memberOf StockChartX.SelectionMarker#
   */
  public width: number = null;

  /**
   * Gets/Sets theme.
   * @name theme
   * @type {StockChartX~SelectionMarkerTheme}
   * @memberOf StockChartX.SelectionMarker#
   */
  public theme: ISelectionMarkerTheme = null;

  /**
   * Returns actual theme.
   * @name actualTheme
   * @type {StockChartX~SelectionMarkerTheme}
   * @memberOf StockChartX.SelectionMarker#
   */
  get actualTheme(): ISelectionMarkerTheme {
    return this.theme || this.chart.theme.selectionMarker;
  }

  // endregion

  constructor(config: ISelectionMarkerConfig) {
    super(config);

    if (config) {
      this.theme = config.theme;
      this.width = config.width;
    }
  }

  /**
   * Draws marker at a given position(s).
   * @method draw
   * @param {CanvasRenderingContext2D} context The drawing context.
   * @param {StockChartX~Point | StockChartX~Point[]} point
   * @memberOf StockChartX.SelectionMarker#
   * @example
   * // draw marker at a given position
   * marker.draw(context, {x: 10, y: 20});
   *
   * // draw 2 markers at a given positions.
   * marker.draw(context, [{x: 10, y: 20}, {x: 100, y: 100}]);
   */
  draw(context: CanvasRenderingContext2D, point: IPoint | IPoint[]) {
    let theme = this.actualTheme;

    context.scxApplyFillTheme(theme.fill).scxApplyStrokeTheme(theme.line);

    if (Array.isArray(point)) {
      for (let item of point) {
        this._drawMarker(context, item);
      }
    } else {
      this._drawMarker(context, point);
    }
  }

  private _drawMarker(context: CanvasRenderingContext2D, point: IPoint) {
    context.beginPath();
    context.arc(point.x, point.y, this.width, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
  }
}
