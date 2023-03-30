/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import {
  IComponent,
  Component
} from "../../index";
// import { IComponent, Component } from "../../index";
"use strict";

export interface IHandler extends IComponent {}

/**
 * Represents abstract handler.
 * @constructor StockChartX.Handler
 * @abstract
 */
export abstract class Handler extends Component {
  /**
   * @internal
   */
  /** Subscribes to events.
   * @method _subscribe
   * @memberOf StockChartX.Handler#
   * @protected
   */
  protected _subscribe?();

  /**
   * @internal
   */
  /** Unsubscribe from events.
   * @method _unsubscribe
   * @memberOf StockChartX.Handler#
   * @protected
   */
  protected _unsubscribe?();

  // region IDestroyable

  /**
   * Destroys handler.
   * @method destroy
   * @memberOf StockChartX.Handler#
   */
  destroy() {
    if (this._unsubscribe) this._unsubscribe();
  }

  // endregion
}
