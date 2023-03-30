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

export interface IClickGestureConfig extends IGestureConfig {
  maxTouchOffset?: number;
  maxTouchInterval?: number;
}

// endregion

/**
 * Represents click gesture.
 * @param {Object} [config] The configuration object.
 * @constructor StockChartX.ClickGesture
 * @augments StockChartX.Gesture
 */
export class ClickGesture extends Gesture {
  /**
   * @internal
   */
  private static _isTouch: boolean;

  /**
   * @internal
   */
  private _startPoint: IPoint;

  /**
   * @internal
   */
  private _startDate: Date;

  /**
   * @internal
   */
  private _maxTouchOffset = 10;

  /**
   * @internal
   */
  private _maxTouchInterval = 500;

  // region Properties

  /**
   * Gets/Sets max touch offset.
   * @name maxTouchOffset
   * @type {number}
   * @memberOf StockChartX.ClickGesture#
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
   * Gets/Sets max touch interval.
   * @name maxTouchInterval
   * @type {number}
   * @memberOf StockChartX.ClickGesture#
   */
  get maxTouchInterval(): number {
    return this._maxTouchInterval;
  }

  set maxTouchInterval(value: number) {
    if (!JsUtil.isPositiveNumber(value))
      throw new Error("Max touch interval must be a number greater than 0.");

    this._maxTouchInterval = value;
  }

  // endregion

  constructor(config?: IClickGestureConfig) {
    super(config);

    if (config) {
      if (config.maxTouchOffset) this.maxTouchOffset = config.maxTouchOffset;
      if (config.maxTouchInterval)
        this.maxTouchInterval = config.maxTouchInterval;
    }
  }

  /**
   * @inheritDoc
   */
  handleEvent(event: IWindowEvent): boolean {
    switch (event.evt.type) {
      case MouseEvent.CLICK:
        if (!ClickGesture._isTouch && this._finishGesture(event)) {
          return true;
        }
        break;
      case TouchEvent.START:
        ClickGesture._isTouch = true;

        if (this._checkHit(event)) {
          this._startPoint = event.pointerPosition;
          this._startDate = new Date();
          this._state = GestureState.STARTED;
        }
        break;
      case TouchEvent.END:
        if (!this.isActive()) break;

        let dx = Math.abs(event.pointerPosition.x - this._startPoint.x),
          dy = Math.abs(event.pointerPosition.y - this._startPoint.y),
          endDate = new Date(),
          isClick =
            dx <= this._maxTouchOffset &&
            dy <= this._maxTouchOffset &&
            <any>endDate - <any>this._startDate <= this._maxTouchInterval;

        if (isClick && this._finishGesture(event)) {
          return true;
        }
        this._state = GestureState.NONE;

        break;
      default:
        break;
    }

    return false;
  }

  /**
   * @internal
   */
  private _finishGesture(event: IWindowEvent): boolean {
    if (
      this._checkButton(event) &&
      this._checkHit(event) &&
      this._checkKeys(event)
    ) {
      this._state = GestureState.FINISHED;
      this._invokeHandler(event);

      return true;
    }
  }
}
