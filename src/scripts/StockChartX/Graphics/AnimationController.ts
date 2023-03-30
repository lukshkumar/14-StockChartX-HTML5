/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

/* tslint:disable:interface-name */
// noinspection JSUnusedGlobalSymbols
/**
 *  @internal
 */
import { Environment } from "../index";
import { Animation } from "../index";
declare global {
  interface Window {
    tinycolor: any;
    jQuery: any;
    Theme: any;
    mozRequestAnimationFrame?(callback: FrameRequestCallback): number;
    oRequestAnimationFrame?(callback: FrameRequestCallback): number;
    msRequestAnimationFrame?(callback: FrameRequestCallback): number;
  }
}
/* tslint:enable:interface-name */

"use strict";

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  requestAnimationFramePolyfill;

/**
 * Represents global animations controller.
 * @namespace StockChartX.AnimationController
 * @internal
 */
export class AnimationController {
  /**
   * The animation interval.
   * @name AnimationInterval
   * @type {number}
   * @memberOf StockChartX.AnimationController
   */
  static AnimationInterval = 1000 / (Environment.isMobile ? 20 : 40);

  /**
   * The array of animations to run.
   * @name _animations
   * @type StockChartX.Animation[]
   * @memberOf StockChartX.AnimationController
   * @private
   */
  static _animations: Animation[] = [];

  /**
   * The previous animation start time.
   * @name _prevStartTime
   * @type number
   * @memberOf StockChartX.AnimationController
   * @private
   */
  static _prevStartTime: number = Date.now();

  /**
   * Checks if there is at least one animation to run.
   * @method hasAnimationsToRun
   * @returns {boolean}
   * @memberOf StockChartX.AnimationController
   */
  static hasAnimationsToRun(): boolean {
    return this._animations.length > 0;
  }

  /**
   * Checks if a given animation exists in the list of animations.
   * @method contains
   * @param {StockChartX.Animation} animation The animation.
   * @returns {boolean}
   * @memberOf StockChartX.AnimationController
   */
  static contains(animation: Animation): boolean {
    return this._animations.indexOf(animation) >= 0;
  }

  /**
   * Adds animation.
   * @method add
   * @param {StockChartX.Animation} animation The animation to be added.
   * @returns {boolean} True if animation has been added, false otherwise.
   * @memberOf StockChartX.AnimationController
   */
  static add(animation: Animation): boolean {
    if (this.contains(animation)) return false;

    let isStarted = this.hasAnimationsToRun();

    this._animations.push(animation);
    if (!isStarted) this._runAnimation();

    return true;
  }

  /**
   * Removes animation.
   * @method remove
   * @param {StockChartX.Animation} animation The animation to be removed.
   * @returns {boolean} True if animation has been removed, false otherwise.
   * @memberOf StockChartX.AnimationController
   */
  static remove(animation: Animation): boolean {
    let animations = this._animations,
      index = animations.indexOf(animation);

    if (index < 0) return false;

    animations.splice(index, 1);

    return true;
  }

  /**
   * @internal
   */
  private static _runAnimation() {
    requestAnimationFrame(() => this._handleAnimationFrame());
  }

  /**
   * @internal
   */
  private static _handleAnimationFrame() {
    if (Date.now() - this._prevStartTime >= this.AnimationInterval) {
      let animations = this._animations;
      for (let i = 0; i < animations.length; i++) {
        let animation = animations[i];

        animation.handleAnimationFrame();
        if (!animation.recurring) {
          animation.stop();
          i--;
        }
      }
      this._prevStartTime = Date.now();
    }
    if (this.hasAnimationsToRun()) this._runAnimation();
  }
}

/**
 * @internal
 */
function requestAnimationFramePolyfill(callback: FrameRequestCallback): number {
  return setTimeout(callback, AnimationController.AnimationInterval) as any;
}
