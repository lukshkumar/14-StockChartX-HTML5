/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { Gesture, IGestureHitTestHandler } from "../index";
import { JsUtil } from "../index";
import { IWindowEvent } from "../index";
import { MouseHoverGesture } from "../index";
import { MouseEvent } from "../index";
"use strict";

/**
 * Represents a collection of gestures
 * @param {StockChartX.Gesture | StockChartX.Gesture[]} gestures The gesture or array of gestures to add into the collection.
 * @param {Object} [context] Function's 'this' context.
 * @param {StockChartX.Gesture~GestureHitTestHandler} [hitTestFunc] The hit test function.
 * @constructor StockChartX.GestureArray
 */
export class GestureArray {
  /**
   * An array of gestures.
   * @name gestures
   * @type {StockChartX.Gesture[]}
   * @memberOf StockChartX.GestureArray#
   */
  readonly gestures: Gesture[] = [];

  constructor(
    gestures?: Gesture | Gesture[],
    context?: object,
    hitTestFunc?: IGestureHitTestHandler
  ) {
    if (!gestures) return;

    this.add(gestures);

    if (context || hitTestFunc) {
      for (let gesture of this.gestures) {
        if (!gesture.context) gesture.context = context;
        if (!gesture.hitTest) gesture.hitTest = hitTestFunc;
      }
    }
  }

  /**
   * Adds gesture(s) into the collection.
   * @method add
   * @param {StockChartX.Gesture | StockChartX.Gesture[]} gestures The gesture or an array of gestures to add into the collection.
   * @memberOf StockChartX.GestureArray#
   * @see [remove]{@linkcode StockChartX.GestureArray#remove}
   */
  add(gestures: Gesture | Gesture[]);
  add(...gestures: Gesture[]) {
    let gesturesToAdd = JsUtil.flattenArray(gestures);

    for (let gesture of gesturesToAdd) {
      if (!this.contains(gesture)) this.gestures.push(gesture);
    }
  }

  /**
   * Removes gesture(s) from the collection.
   * @method remove
   * @param {StockChartX.Gesture | StockChartX.Gesture[]} gestures The gesture or an array of gestures to remove.
   * @memberOf StockChartX.GestureArray#
   * @see [add]{@linkcode StockChartX.GestureArray#add}
   */
  remove(gestures: Gesture | Gesture[]);
  remove(...gestures: Gesture[]) {
    let gesturesToRemove = JsUtil.flattenArray(gestures),
      existingGestures = this.gestures;

    for (let item of gesturesToRemove) {
      let index = existingGestures.indexOf(item);

      if (index >= 0) {
        existingGestures.splice(index, 1);
      }
    }
  }

  /**
   * Checks if a given gesture is present in the collection.
   * @method contains
   * @param {StockChartX.Gesture} gesture The search gesture.
   * @returns {boolean}
   * @memberOf StockChartX.GestureArray#
   */
  contains(gesture: Gesture): boolean {
    return this.gestures.indexOf(gesture) >= 0;
  }

  /**
   * Iterates through inner gestures and passes event to it. Breaks if event is handled by gesture.
   * @method handleEvent
   * @param {StockChartX~WindowEvent} event The event object.
   * @param {boolean} [inBounds = true] The flag that indicates if cursor is located in the object's bounds rectangle.
   * @returns {boolean} True if event was handled by some gesture, false otherwise.
   * @memberOf StockChartX.GestureArray#
   */
  handleEvent(event: IWindowEvent, inBounds: boolean = true): boolean {
    let isHandled = false;

    for (let gesture of this.gestures) {
      if (inBounds) {
        if (
          gesture.handleEvent(event) &&
          !(gesture instanceof MouseHoverGesture)
        )
          isHandled = true;
      } else {
        if (
          gesture instanceof MouseHoverGesture ||
          event.evt.type === MouseEvent.LEAVE ||
          event.evt.type === MouseEvent.UP
        )
          gesture.handleEvent(event);
      }
    }

    return isHandled;
  }
}
