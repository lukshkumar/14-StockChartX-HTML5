/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { Component, IComponent } from "../../index";
import { IPoint } from "../../index";
import { Rect } from "../../index";
import { IWindowEvent } from "../../index";
import { GestureArray } from "../../index";
"use strict";

// region Interfaces

export interface IControl extends IComponent {
  hitTest(point: IPoint): boolean;
  layout(frame: Rect);
  handleEvent(event: IWindowEvent): boolean;
  draw?();
}

// endregion

/**
 * Represents abstract chart control.
 * @constructor StockChartX.Control
 * @abstract
 * @augments StockChartX.Component
 */
export abstract class Control extends Component implements IControl {
  // region Properties

  /**
   * The collection of gestures.
   * @name _gestures
   * @type {StockChartX.GestureArray}
   * @memberOf StockChartX.Control#
   * @private
   * @internal
   */
  private _gestures: GestureArray;

  // endregion

  constructor() {
    super();

    this._gestures =
      (this._initGestures && this._initGestures()) || new GestureArray();
  }

  /**
   * @internal
   */
  protected _initGestures?(): GestureArray;

  /**
   * Checks if a given point belongs to a frame rectangle.
   * @method hitTest
   * @param {StockChartX~Point} point The point.
   * @returns {boolean}
   * @memberOf StockChartX.Control#
   */
  hitTest(point: IPoint): boolean {
    return false;
  }

  /**
   * Layouts controls.
   * @method layout
   * @param {StockChartX.Rect} frame The frame rectangle related to parent container.
   * @memberOf StockChartX.Control#
   */
  layout(frame: Rect) {}

  /**
   * Handles event.
   * @method handleEvent
   * @param {StockChartX.WindowEvent} event The event object.
   * @param {boolean} [inBounds = true] The flag that indicates if cursor is located in object's bounds rectangle.
   * @returns {boolean}
   * @memberOf StockChartX.Control#
   */
  handleEvent(event: IWindowEvent, inBounds: boolean = true): boolean {
    return this._gestures.handleEvent(event, inBounds);
  }

  /**
   * Draws control.
   * @method draw
   * @memberOf StockChartX.Control#
   */
  draw?();
}
