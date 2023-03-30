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
import { Animation } from "../index";
import { JsUtil } from "../index";
import { IPoint } from "../index";

"use strict";

// region Interfaces

export interface IMouseWheelGestureConfig extends IGestureConfig {}

// endregion

/**
 * Represents mouse wheel gesture.
 * @param {Object} [config] The configuration object
 * @constructor StockChartX.MouseWheelGesture
 * @augments StockChartX.Gesture
 */
export class MouseWheelGesture extends Gesture {
  /**
   * The wheel delta.
   * @name delta
   * @type {number}
   * @readonly
   * @memberOf StockChartX.MouseWheelGesture#
   */
  public delta: number = 0;

  /**
   * @internal
   */
  private _prevScale: number = 0;

  /**
   * @internal
   */
  private _lastScale: number = 0;

  /**
   * @internal
   */
  private _scaleThreshold: number = 0.005;

  /**
   * @internal
   */
  private _animation: Animation = new Animation({
    context: this,
    recurring: false
  });

  constructor(config?: IMouseWheelGestureConfig) {
    super(config);
  }

  /**
   * @inheritDoc
   */
  handleEvent(event: IWindowEvent): boolean {
    let evt = event.evt,
      origEvent = evt.originalEvent;

    switch (evt.type) {
      case MouseEvent.WHEEL:
      case MouseEvent.SCROLL:
        if (this._checkHit(event)) {
          if (evt.type === MouseEvent.SCROLL)
            this.delta = origEvent.detail > 0 ? 1 : -1;
          else this.delta = origEvent.wheelDelta < 0 ? 1 : -1;
          this._state = GestureState.FINISHED;
          this._invokeHandler(event);

          return true;
        }
        break;
      case TouchEvent.START:
        if (!this.isActive() && origEvent.touches.length === 2) {
          this._prevScale = this._lastScale = origEvent.scale;
          if (this._prevScale === undefined) {
            this._prevScale = this._lastScale = MouseWheelGesture._calculateScale(
              origEvent.touches
            );
            if (this._prevScale === undefined) return false;
          }
          this._state = GestureState.STARTED;

          return true;
        }
        break;
      case TouchEvent.MOVE:
        if (this.isActive()) {
          let scale = (this._lastScale = origEvent.scale),
            pointerPosition = event.pointerPosition;

          if (scale === undefined) {
            let touches = origEvent.touches;
            if (touches.length !== 2) return true;

            scale = this._lastScale = MouseWheelGesture._calculateScale(
              touches
            );
            pointerPosition = MouseWheelGesture._zoomPoint(touches);
          }
          let offset = scale - this._prevScale,
            isSignChanged =
              (this._prevScale > 0 && scale < 0) ||
              (this._prevScale < 0 && scale > 0),
            threshold = (isSignChanged ? 2 : 1) * this._scaleThreshold;
          if (Math.abs(offset) >= threshold) {
            this.delta = offset < 0 ? 1 : -1;
            this._state = GestureState.CONTINUED;

            let animation = this._animation;
            if (!animation.started) {
              let e = JsUtil.shallowClone(event);
              animation.callback = function() {
                this._prevScale = this._lastScale;
                e.pointerPosition = pointerPosition;
                this._invokeHandler(e);
              };
              animation.start();
            }
          }

          return true;
        }
        break;
      case TouchEvent.END:
        if (this.isActive()) {
          this._state = GestureState.FINISHED;

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
  private static _calculateScale(touches: TouchList) {
    let dx = touches[0].pageX - touches[1].pageX,
      dy = touches[0].pageY - touches[1].pageY,
      len = Math.sqrt(dx * dx + dy * dy);

    return len / Math.max(window.innerWidth, window.innerHeight);
  }

  /**
   * @internal
   */
  private static _zoomPoint(touches: TouchList): IPoint {
    let x = (touches[0].pageX + touches[1].pageX) / 2,
      y = (touches[0].pageY + touches[1].pageY) / 2;

    return { x, y };
  }
}
