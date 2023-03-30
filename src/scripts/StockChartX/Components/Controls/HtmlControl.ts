import { IPoint } from "../../index";
import { Rect } from "../../index";
import { IControl, Control } from "../../index";
import { Geometry } from "../../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

// region Interfaces

export interface IHtmlControl extends IControl {
  container: JQuery;
  frame: Rect;
}

// endregion

/**
 * Represents abstract control with frame.
 * @constructor StockChartX.HtmlControl
 * @augments StockChartX.Control
 * @abstract
 */
export abstract class HtmlControl extends Control implements IHtmlControl {
  // region Properties

  /**
   * @internal
   */
  protected _container: JQuery;

  /**
   * The root div element.
   * @name rootDiv
   * @type {jQuery}
   * @readonly
   * @memberOf StockChartX.HtmlControl#
   */
  get container(): JQuery {
    return this._container;
  }

  /**
   * @internal
   */
  private _frame = new Rect();

  /**
   * Returns frame rectangle.
   * @name frame
   * @type {StockChartX.Rect}
   * @readonly
   * @memberOf StockChartX.HtmlControl#
   */
  get frame(): Rect {
    return this._frame;
  }

  // endregion

  /**
   * @inheritdoc
   */
  hitTest(point: IPoint): boolean {
    return Geometry.isPointInsideOrNearRect(point, this._frame);
  }

  /**
   * @inheritdoc
   */
  layout(frame: Rect) {
    if (!this._container) {
      this._container = this._createContainer();
    }

    this._container.scxFrame(frame);
    this._frame.copyFrom(frame);
  }

  /**
   * @internal
   */
  protected abstract _createContainer(): JQuery;

  /**
   * @internal
   */
  protected _removeContainer() {
    if (this._container) {
      this._container.remove();
      this._container = null;
    }
  }

  /**
   * @inheritdoc
   */
  destroy() {
    this._removeContainer();
  }
}
