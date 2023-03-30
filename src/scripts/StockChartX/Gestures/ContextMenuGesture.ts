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
import { JsUtil } from "../index";
import { IPoint } from "../index";

"use strict";

// region Interfaces

export interface IContextMenuGestureConfig extends IGestureConfig {
  maxTouchOffset?: number;
  touchInterval?: number;
}

// endregion

/**
 * Represents context menu (right mouse click) gesture.
 * @param {Object} [config] The configuration object.
 * @constructor StockChartX.ContextMenuGesture
 * @augments StockChartX.Gesture
 */
export class ContextMenuGesture extends Gesture {
  /**
   * @internal
   */
  private _isTouch: boolean;

  /**
   * @internal
   */
  private _startPoint: IPoint;

  /**
   * @internal
   */
  private _lastEvent: IWindowEvent;

  /**
   * @internal
   */
  private _maxTouchOffset = 10;

  /**
   * @internal
   */
  private _touchInterval = 2000;

  /**
   * @internal
   */
  private _timeoutId: number;

  // region Properties

  /**
   * Gets/Sets max touch offset.
   * @name maxTouchOffset
   * @type {number}
   * @memberOf StockChartX.ContextMenuGesture#
   */
  get maxTouchOffset(): number {
    return this._maxTouchOffset;
  }

  set maxTouchOffset(value: number) {
    if (!JsUtil.isPositiveNumber(value))
      throw new Error("Max touch offset must be a number greater than 0.");

    this._maxTouchOffset = value;
  }

  /**
   * Gets/Sets touch interval.
   * @name touchInterval
   * @type {number}
   * @memberOf StockChartX.ContextMenuGesture#
   */
  get touchInterval(): number {
    return this._touchInterval;
  }

  set touchInterval(value: number) {
    if (!JsUtil.isPositiveNumber(value))
      throw new Error("Touch interval must be a number greater than 0.");

    this._touchInterval = value;
  }

  // endregion

  constructor(config?: IContextMenuGestureConfig) {
    super(config);

    if (config) {
      if (config.maxTouchOffset) this.maxTouchOffset = config.maxTouchOffset;
      if (config.touchInterval) this.touchInterval = config.touchInterval;
    }
  }

  /**
   * @inheritDoc
   */
  handleEvent(event: IWindowEvent): boolean {
    switch (event.evt.type) {
      case MouseEvent.CONTEXT_MENU:
        this._isTouch = false;

        if (this._finishGesture(event)) {
          return true;
        }
        break;
      case TouchEvent.START:
        this._isTouch = true;

        if (this._checkHit(event)) {
          this._startPoint = event.pointerPosition;
          this._lastEvent = JsUtil.clone(event);
          this._state = GestureState.STARTED;

          this._startTimeout();
        }
        break;
      case TouchEvent.MOVE:
        if (this.isActive()) {
          this._lastEvent = JsUtil.clone(event);
        }
        break;
      case TouchEvent.END:
        this._stopTimeout();
        if (this._lastEvent) {
          this._lastEvent = null;
          event.stopPropagation = true;

          return true;
        }
        break;
      default:
        break;
    }

    return false;
  }

  /**
   * @internal
   */
  private _startTimeout() {
    this._timeoutId = setTimeout(() => {
      let event = this._lastEvent;

      if (!this.isActive() || !event) return;

      let dx = Math.abs(event.pointerPosition.x - this._startPoint.x),
        dy = Math.abs(event.pointerPosition.y - this._startPoint.y),
        isLongTap = dx <= this._maxTouchOffset && dy <= this._maxTouchOffset;

      if (isLongTap && this._finishGesture(event)) return true;

      this._state = GestureState.NONE;
    }, this._touchInterval) as any;
  }

  /**
   * @internal
   */
  private _stopTimeout() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
  }

  /**
   * @internal
   */
  private _finishGesture(event: IWindowEvent): boolean {
    if (this._checkHit(event)) {
      this._state = GestureState.FINISHED;
      this._invokeHandler(event);

      return true;
    }
  }
}
