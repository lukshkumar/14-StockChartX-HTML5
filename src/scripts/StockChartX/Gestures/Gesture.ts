/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

/* tslint:disable:interface-name */
/**
 * @internal
 */
import { JQueryEventObject } from "../../external/typescript/jquery";
import { ChartPanel } from "../index";
import { IPoint } from "../index";
import { Environment } from "../index";
import { Key } from "../index";

declare global {
  interface Event {
    detail: number;
    wheelDelta: number;
    scale: number;
    touches: any;
  }
}

/* tslint:enable:interface-name */

"use strict";

// region Interfaces

export interface IWindowEvent {
  pointerPosition: IPoint;
  evt: JQueryEventObject;
  stopPropagation?: boolean;
  chartPanel?: ChartPanel;
}

export interface IGestureConfig {
  handler?: IGestureHandler;
  hitTest?: IGestureHitTestHandler;
  context?: object;
  keys?: number[];
  button?: number;
}

export type IGestureHandler = (gesture: Gesture, event: IWindowEvent) => void;

export type IGestureHitTestHandler = (position: IPoint) => boolean;

// endregion

// region Declarations

export enum MouseButton {
  LEFT = 1,
  SCROLL = 2,
  RIGHT = 3
}

export const MouseEvent = {
  ENTER: "mouseenter",
  LEAVE: "mouseleave",
  MOVE: "mousemove",
  DOWN: "mousedown",
  UP: "mouseup",
  CLICK: "click",
  DOUBLE_CLICK: "dblclick",
  CONTEXT_MENU: "contextmenu",
  WHEEL: "mousewheel",
  SCROLL: "DOMMouseScroll",
  OVER: "mouseover"
};
Object.freeze(MouseEvent);

export const TouchEvent = {
  START: "touchstart",
  MOVE: "touchmove",
  END: "touchend"
};
Object.freeze(TouchEvent);

/**
 * The window mouse/touch event.
 * @typedef {Object} StockChartX~WindowEvent
 * @type {Object}
 * @property {StockChartX~Point} pointerPosition The current pointer position.
 * @property {JQueryEventObject} evt The jQuery event object.
 * @property {boolean} [stopPropagation] The flag that indicates whether bubbling of an event to parent elements should be stopped.
 * @memberOf StockChartX
 */

/**
 * Gesture state enumeration.
 * @enum {number}
 * @readonly
 * @memberOf StockChartX
 */
export const GestureState = {
  /** Gesture is not recognized. */
  NONE: <GestureState>0,

  /** Gesture started. */
  STARTED: <GestureState>1,

  /** Gesture continued. */
  CONTINUED: <GestureState>2,

  /** Gesture finished. */
  FINISHED: <GestureState>3
};
export type GestureState = 0 | 1 | 2 | 3;
Object.freeze(GestureState);

export const enum PointerKind {
  NONE,
  MOUSE,
  TOUCH
}

// endregion

/**
 * The gesture handler function.
 * @callback Gesture~GestureHandler
 * @param {StockChartX.Gesture} gesture The gesture.
 * @param {StockChartX~WindowEvent} event The current event.
 * @memberOf StockChartX
 * @example
 *  var handler = function(gesture, event) {};
 */

/**
 * The gesture hit test function.
 * @callback Gesture~GestureHitTestHandler
 * @param {StockChartX~Point} position The pointer position.
 * @returns {boolean} The flag that indicates whether gesture should be processed.
 * @memberOf StockChartX
 * @example
 *  var hitTest = function(position) {
 *      return true;
 *  }
 */

/**
 * Represents abstract gesture.
 * @param {Object} [config] The configuration object.
 * @param {StockChartX.Gesture~GestureHandler} [config.handler] The function to handle gesture events.
 * @param {StockChartX.Gesture~GestureHitTestHandler} [config.hitTest] The hit test function.
 * @param {Object} [config.context] The execution context.
 * @param {Number} [config.button] The button to be used in gesture.
 * @constructor StockChartX.Gesture
 */
export class Gesture {
  // region Properties

  /**
   * Gesture event handler
   * @name handler
   * @type {StockChartX.Gesture~GestureHandler}
   * @memberOf StockChartX.Gesture#
   */
  public handler: IGestureHandler = null;

  /**
   * Hit test function.
   * @name hitTest
   * @type {StockChartX.Gesture~GestureHitTestHandler}
   * @memberOf StockChartX.Gesture#
   */
  public hitTest: IGestureHitTestHandler = null;

  /**
   * The execution context.
   * @name context
   * @type {Object}
   * @memberOf StockChartX.Gesture#
   */
  public context: object = null;

  /**
   * The mouse button that needs to be used in gesture.
   * @name button
   * @type {MouseButton}
   * @memberOf StockChartX.Gesture#
   */
  public button: MouseButton = null;

  /**
   * @internal
   */
  protected _state = GestureState.NONE;

  /**
   * Current gesture state.
   * @name state
   * @type {StockChartX.GestureState}
   * @memberOf StockChartX.Gesture#
   * @readonly
   */
  get state(): GestureState {
    return this._state;
  }

  /**
   * @internal
   */
  protected _pointerType = PointerKind.NONE;

  get pointerKind(): PointerKind {
    return this._pointerType;
  }

  /**
   * @internal
   */
  protected _keys: number[];

  // endregion

  protected constructor(config?: IGestureConfig) {
    if (config) {
      this.handler = config.handler;
      this.hitTest = config.hitTest;
      this.context = config.context;
      this._keys = config.keys;
      this.button = config.button;
    }
  }

  /**
   * Handles event.
   * @method handleEvent
   * @param {StockChartX~WindowEvent} event The event object.
   * @returns {boolean} True if event was handled, false otherwise.
   * @memberOf StockChartX.Gesture#
   */
  handleEvent(event: IWindowEvent): boolean {
    this._updatePointerKind(event);

    return false;
  }

  /**
   * Checks whether event's button conforms to gesture.
   * @method _checkButton
   * @param {StockChartX~WindowEvent} event The event object.
   * @returns {boolean}
   * @memberOf StockChartX.Gesture#
   * @protected
   * @internal
   */
  protected _checkButton(event: IWindowEvent): boolean {
    let button = this.button;

    if (button == null) return true;
    if (
      button === MouseButton.LEFT &&
      (Environment.isPhone || Environment.isMobile)
    )
      return true;

    return event.evt.which === button;
  }

  /**
   * Checks whether specified keys are pressed when gesture handles event.
   * @method _checkKeys
   * @param {StockChartX~WindowEvent} event The event object.
   * @returns {boolean}
   * @memberOf StockChartX.Gesture#
   * @protected
   * @internal
   */
  protected _checkKeys(event: IWindowEvent): boolean {
    if (!this._keys) return true;

    for (let key of this._keys) {
      switch (key) {
        case Key.SHIFT:
          if (!event.evt.shiftKey) return false;
          break;
        case Key.CTRL:
          if (!event.evt.ctrlKey) return false;
          break;
        case Key.ALT:
          if (!event.evt.altKey) return false;
          break;
        default:
          break;
      }
    }

    return true;
  }

  /**
   * Checks whether gesture should process event at the specified pointer position.
   * @method _checkHit
   * @param {StockChartX~WindowEvent} event The event object.
   * @returns {boolean}
   * @memberOf StockChartX.Gesture#
   * @protected
   * @internal
   */
  protected _checkHit(event: IWindowEvent): boolean {
    if (event.evt.type === MouseEvent.LEAVE) return false;

    let hitTest = this.hitTest;
    if (hitTest) {
      return hitTest.call(this.context, event.pointerPosition);
    }

    return false;
  }

  /**
   * Invokes gesture handler.
   * @method _invokeHandler
   * @param {StockChartX~WindowEvent} event The current event.
   * @memberOf StockChartX.Gesture#
   * @protected
   * @internal
   */
  protected _invokeHandler(event: IWindowEvent) {
    let handler = this.handler;

    if (handler) {
      handler.call(this.context, this, event);
    }
  }

  /**
   * @internal
   */
  protected _updatePointerKind(event: IWindowEvent) {
    switch (event.evt.type) {
      case MouseEvent.CLICK:
      case MouseEvent.CONTEXT_MENU:
      case MouseEvent.DOUBLE_CLICK:
      case MouseEvent.DOWN:
      case MouseEvent.LEAVE:
      case MouseEvent.MOVE:
      case MouseEvent.OVER:
      case MouseEvent.SCROLL:
      case MouseEvent.UP:
      case MouseEvent.WHEEL:
        this._pointerType = PointerKind.MOUSE;
        break;
      case TouchEvent.START:
      case TouchEvent.MOVE:
      case TouchEvent.END:
        this._pointerType = PointerKind.TOUCH;
        break;
      default:
        this._pointerType = PointerKind.NONE;
    }
  }

  /**
   * Checks if gesture is active (in STARTED or CONTINUED state).
   * @method isActive
   * @returns {boolean}
   * @memberOf StockChartX.Gesture#
   */
  isActive(): boolean {
    let state = this._state;

    return state === GestureState.STARTED || state === GestureState.CONTINUED;
  }
}
