/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { ISize } from "../index";
import { Component } from "../index";
"use strict";

// region Interfaces

export interface ILayerConfig {
  parent: JQuery;
  size?: ISize;
}

export const CanvasOffset = 0.5;

// endregion

/**
 * Represents graphics layer - an abstraction over canvas.
 * @param {JQuery} parent The parent jquery element.
 * @param {StockChartX~Size} [size] The size of the layer.
 * @constructor StockChartX.Layer
 * @example
 * var layer = new StockChartX.Layer({
 *  parent: $('#layerParent'),
 *  size: {
 *      width: 100,
 *      height: 100
 *  }
 * });
 */
export class Layer extends Component {
  // region Properties

  /**
   * @internal
   */
  private _canvas: JQuery;
  /**
   * Gets canvas element.
   * @name canvas
   * @type {jQuery}
   * @readonly
   * @memberOf StockChartX.Layer#
   */
  get canvas(): JQuery {
    return this._canvas;
  }

  /**
   * @internal
   */
  private _context: CanvasRenderingContext2D;
  /**
   * Gets canvas rendering context.
   * @name context
   * @type {CanvasRenderingContext2D}
   * @readonly
   * @memberOf StockChartX.Layer#
   */
  get context(): CanvasRenderingContext2D {
    return this._context;
  }

  /**
   * @internal
   */
  private _parent: JQuery;
  /**
   * The parent container.
   * @name parent
   * @type {jQuery}
   * @readonly
   * @memberOf StockChartX.Layer#
   */
  get parent(): JQuery {
    return this._parent;
  }

  /**
   * The size of the layer.
   * @name size
   * @type {StockChartX~Size}
   * @memberOf StockChartX.Layer#
   */
  get size(): ISize {
    return {
      width: this._canvas.width(),
      height: this._canvas.height()
    };
  }

  set size(value: ISize) {
    let canvas = this._canvas;

    if (canvas.width() !== value.width) canvas.attr("width", value.width);
    if (canvas.height() !== value.height) canvas.attr("height", value.height);
  }

  // endregion

  constructor(config: ILayerConfig) {
    super();

    this._parent = config.parent;
    this._setup(this._parent);
    if (config.size) this.size = config.size;
  }

  // region Component members

  /**
   * @inheritDoc
   */
  destroy() {
    if (this._parent) {
      this._parent.remove();
      this._parent = null;
    }
    this._canvas = null;
    this._context = null;
  }

  // endregion

  /**
   * @internal
   */
  private _setup(parent: JQuery) {
    this._canvas = parent.scxAppendCanvas();
    this._context = (<HTMLCanvasElement>this._canvas.get(0)).getContext("2d");
  }
}
