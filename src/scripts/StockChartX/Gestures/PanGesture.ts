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

export interface IPanGestureConfig extends IGestureConfig {
  minMoveDistance?: number;
  horizontalMoveEnabled?: boolean;
  verticalMoveEnabled?: boolean;
}

// endregion

/**
 * Represents pan gesture.
 * @param {Object} [config] The configuration object.
 * @param {Number} [config.minMoveDistance = 1] The min move distance.
 * Gesture raises move events only if pointer moved more than this distance.
 * @param {Boolean} [config.horizontalMoveEnabled = true] The flag that indicates whether horizontal move is enabled.
 * @param {Boolean} [config.verticalMoveEnabled = true] The flag that indicates whether vertical move is enabled.
 * @constructor StockChartX.PanGesture
 * @augments StockChartX.Gesture
 */
export class PanGesture extends Gesture {
  // region Properties

  /**
   * The current move offset in pixels.
   * @name moveOffset
   * @type {StockChartX~Point}
   * @readonly
   * @memberOf StockChartX.PanGesture#
   */
  moveOffset: IPoint = {
    x: 0,
    y: 0
  };

  /**
   * @internal
   */
  private _minMoveDistance: number = 1;

  /**
   * Gets/Sets min move distance. Move events are raised only if pointer moved more than this value.
   * @name minMoveDistance
   * @type {number}
   * @memberOf StockChartX.PanGesture#
   */
  get minMoveDistance(): number {
    return this._minMoveDistance;
  }

  set minMoveDistance(value: number) {
    if (!JsUtil.isPositiveNumber(value))
      throw new Error("minMoveDistance must be a positive number.");

    this._minMoveDistance = value;
  }

  /**
   * Gets/Sets flag that indicates whether horizontal move is enabled.
   * @name horizontalMoveEnabled
   * @type {boolean}
   * @memberOf StockChartX.PanGesture#
   * @see [verticalMoveEnabled]{@linkcode StockChartX.PanGesture#verticalMoveEnabled}
   */
  public horizontalMoveEnabled: boolean = true;

  /**
   * Gets/Sets flag that indicates whether vertical move is enabled.
   * @name verticalMoveEnabled
   * @type {boolean}
   * @memberOf StockChartX.PanGesture#
   * @see [horizontalMoveEnabled]{@linkcode StockChartX.PanGesture#horizontalMoveEnabled}
   */
  public verticalMoveEnabled: boolean = true;

  /**
   * The previously handled point.
   * @name _prevPoint
   * @type {StockChartX~Point}
   * @memberOf StockChartX.PanGesture#
   * @private
   * @internal
   */
  private _prevPoint: IPoint = null;

  /**
   * The last received point.
   * @name _lastPoint
   * @type {StockChartX~Point}
   * @memberOf StockChartX.PanGesture#
   * @private
   * @internal
   */
  private _lastPoint: IPoint = null;

  /**
   * @internal
   */
  private readonly _animation: Animation = new Animation({
    context: this,
    recurring: false
  });

  /**
   * @internal
   */
  private _which: number = 0;

  // endregion

  constructor(config?: IPanGestureConfig) {
    super(config);

    if (config) {
      if (config.minMoveDistance != null)
        this.minMoveDistance = config.minMoveDistance;
      if (config.horizontalMoveEnabled != null)
        this.horizontalMoveEnabled = config.horizontalMoveEnabled;
      if (config.verticalMoveEnabled)
        this.verticalMoveEnabled = config.verticalMoveEnabled;
    }
  }

  /**
   * @inheritDoc
   */
  handleEvent(event: IWindowEvent): boolean {
    super.handleEvent(event);
    let pos = (this._lastPoint = {
      x: event.pointerPosition.x,
      y: event.pointerPosition.y
    });

    switch (event.evt.type) {
      case MouseEvent.DOWN:
      case TouchEvent.START:
        if (this._checkButton(event) && this._checkHit(event)) {
          this._prevPoint = { x: pos.x, y: pos.y };
          this._which =
            event.evt.type === TouchEvent.START ? 1 : event.evt.which;
          this._state = GestureState.STARTED;
          this._invokeHandler(event);

          return true;
        }
        break;
      case MouseEvent.MOVE:
      case TouchEvent.MOVE:
        let offset = this.moveOffset;
        if (this.isActive()) {
          offset.x = pos.x - this._prevPoint.x;
          offset.y = pos.y - this._prevPoint.y;

          let minMoveDistance = this.minMoveDistance;
          // noinspection JSSuspiciousNameCombination
          if (
            (this.horizontalMoveEnabled &&
              Math.abs(offset.x) >= minMoveDistance) ||
            (this.verticalMoveEnabled && Math.abs(offset.y) >= minMoveDistance)
          ) {
            let animation = this._animation;

            this._state = GestureState.CONTINUED;
            if (!animation.started) {
              let e = JsUtil.shallowClone(event);
              animation.callback = function() {
                this._prevPoint = this._lastPoint;
                e.evt.which = this._which;
                this._invokeHandler(e);
              };
              animation.start();
            }
          }

          return true;
        }
        break;
      case MouseEvent.UP:
      case MouseEvent.LEAVE:
      case TouchEvent.END:
        if (this.isActive()) {
          this._animation.stop();

          this._state = GestureState.FINISHED;
          this._invokeHandler(event);

          return true;
        }
        break;
      default:
        break;
    }

    return false;
  }
}
