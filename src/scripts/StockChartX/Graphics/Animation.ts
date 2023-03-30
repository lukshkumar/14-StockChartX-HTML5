/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

/**
 * The callback to handle next animation frame.
 * @callback Animation~AnimationFrameCallback
 * @memberOf StockChartX
 */
import { IDestroyable } from "../index";
import { JsUtil } from "../index";
import { AnimationController } from "../index";
"use strict";

// region Interfaces

export type IAnimationFrameCallback = () => void;

export interface IAnimationConfig {
  context?: object;
  recurring?: boolean;
  callback?: IAnimationFrameCallback;
}

// endregion

/**
 * Represents basic animation.
 * @param {object} [config] The configuration object
 * @param {Object} [config.context] 'This' context.
 * @param {boolean} [config.recurring = true] The flag that indicates whether this is a recurring animation.
 * @param {StockChartX.Animation~AnimationFrameCallback} [config.callback] The animation frame callback.
 * @constructor StockChartX.Animation
 * @example
 * var animation = new StockChartX.Animation({
 *  context: this,
 *  callback: function() {}
 * });
 */
export class Animation implements IDestroyable {
  // region Properties

  /**
   * @internal
   */
  private _callback: IAnimationFrameCallback;

  /**
   * The animation frame callback.
   * @name callback
   * @type {StockChartX.Animation~AnimationFrameCallback}
   * @this context
   * @memberOf StockChartX.Animation#
   */
  get callback(): IAnimationFrameCallback {
    return this._callback;
  }

  set callback(value: IAnimationFrameCallback) {
    if (value != null && !JsUtil.isFunction(value))
      throw new TypeError("Callback must be a function.");

    this._callback = value;
  }

  /**
   * @internal
   */
  private _isStarted = false;

  /**
   * The flag that indicates whether animation is started.
   * @name started
   * @type {boolean}
   * @readonly
   * @memberOf StockChartX.Animation#
   */
  get started(): boolean {
    return this._isStarted;
  }

  /**
   * 'This' context object.
   * @name context
   * @type {Object}
   * @memberOf StockChartX.Animation#
   */
  context: object = null;

  /**
   * The flag that indicates whether this is a recurring animation.
   * @name recurring
   * @type {boolean}
   * @memberOf StockChartX.Animation#
   */
  recurring = true;

  // endregion

  constructor(config?: IAnimationConfig) {
    if (config) {
      this.context = config.context;
      if (config.recurring != null) this.recurring = config.recurring;
      this.callback = config.callback;
    }
  }

  /**
   * Starts animation.
   * @method start
   * @returns {boolean} True if animation was started, false otherwise.
   * @memberOf StockChartX.Animation#
   * @see [stop]{@linkcode StockChartX.Animation#stop}
   */
  start(): boolean {
    if (!this.callback) throw new Error("Callback is not assigned.");
    if (this._isStarted) return false;

    if (AnimationController.add(this)) {
      this._isStarted = true;

      return true;
    }

    return false;
  }

  /**
   * Stops animation.
   * @method stop
   * @memberOf StockChartX.Animation#
   * @see [start]{@linkcode StockChartX.Animation#start}
   */
  stop() {
    AnimationController.remove(this);
    this._isStarted = false;
  }

  /**
   * Handles next animation frame.
   * For internal use only. It is called by AnimationController.
   * @method handleAnimationFrame
   * @memberOf StockChartX.Animation#
   */
  handleAnimationFrame() {
    this.callback.call(this.context);
  }

  /**
   * Stops and destroys animation object.
   * @method destroy
   * @memberOf StockChartX.Animation#
   */
  destroy() {
    this.stop();
    this.context = null;
  }
}
