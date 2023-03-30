/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import {
  IGestureConfig,
  Gesture,
  IWindowEvent,
  MouseEvent,
  TouchEvent,
  GestureState
} from "../index";

"use strict";

// region Interfaces

export interface IMouseHoverGestureConfig extends IGestureConfig {
  enterEventEnabled?: boolean;
  hoverEventEnabled?: boolean;
  leaveEventEnabled?: boolean;
}

// endregion

/**
 * Represents mouse hover gesture.
 * @param {Object} [config] The configuration object.
 * @param {Boolean} [config.enterEventEnabled = true] The flag that indicates whether mouse enter event should be raised.
 * @param {Boolean} [config.hoverEventEnabled = true] The flag that indicates whether mouse hover event should be raised.
 * @param {Boolean} [config.leaveEventEnabled = true] The flag that indicates whether mouse leave event should be raise.
 * @constructor StockChartX.MouseHoverGesture
 * @augments StockChartX.Gesture
 */
export class MouseHoverGesture extends Gesture {
  // region Properties

  /**
   * The flag that indicates whether mouse enter event should be raised.
   * @name enterEnabled
   * @type {boolean}
   * @memberOf StockChartX.MouseHoverGesture#
   * @see [hoverEnabled]{@linkcode StockChartX.MouseHoverGesture#hoverEnabled}
   * @see [leaveEnabled]{@linkcode StockChartX.MouseHoverGesture#leaveEnabled}
   */
  public enterEnabled = true;

  /**
   * The flag that indicates whether mouse hover event should be raised.
   * @name hoverEnabled
   * @type {boolean}
   * @memberOf StockChartX.MouseHoverGesture#
   * @see [enterEnabled]{@linkcode StockChartX.MouseHoverGesture#enterEnabled}
   * @see [leaveEnabled]{@linkcode StockChartX.MouseHoverGesture#leaveEnabled}
   */
  public hoverEnabled = true;

  /**
   * The flag that indicates whether mouse leave event should be raised.
   * @name leaveEnabled
   * @type {boolean}
   * @memberOf StockChartX.MouseHoverGesture#
   * @see [enterEnabled]{@linkcode StockChartX.MouseHoverGesture#enterEnabled}
   * @see [hoverEnabled]{@linkcode StockChartX.MouseHoverGesture#hoverEnabled}
   */
  public leaveEnabled = true;

  // endregion

  constructor(config: IMouseHoverGestureConfig) {
    super(config);

    if (config) {
      if (config.enterEventEnabled != null)
        this.enterEnabled = config.enterEventEnabled;
      if (config.hoverEventEnabled != null)
        this.hoverEnabled = config.hoverEventEnabled;
      if (config.leaveEventEnabled != null)
        this.leaveEnabled = config.leaveEventEnabled;
    }
  }

  /**
   * @inheritDoc
   */
  handleEvent(event: IWindowEvent): boolean {
    switch (event.evt.type) {
      case MouseEvent.ENTER:
      case MouseEvent.MOVE:
      case TouchEvent.START:
      case TouchEvent.MOVE:
        if (this._checkHit(event)) {
          if (this.isActive()) {
            this._state = GestureState.CONTINUED;
            if (this.hoverEnabled) this._invokeHandler(event);
          } else {
            this._state = GestureState.STARTED;
            if (this.enterEnabled) this._invokeHandler(event);
          }

          return true;
        } else if (this.isActive()) {
          // let origDeviation = Geometry.DEVIATION;
          // Geometry.DEVIATION *= 2;

          if (!this._checkHit(event)) {
            this._state = GestureState.FINISHED;
            if (this.leaveEnabled) this._invokeHandler(event);
          }

          // Geometry.DEVIATION = origDeviation;

          return true;
        }
        break;
      case MouseEvent.LEAVE:
      case TouchEvent.END:
        if (this.isActive()) {
          this._state = GestureState.FINISHED;
          if (this.leaveEnabled) this._invokeHandler(event);

          return true;
        }
        break;
      default:
        break;
    }

    return false;
  }
}
