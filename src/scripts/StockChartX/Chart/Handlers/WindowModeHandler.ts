import { Environment } from "../../index";
import { Browser } from "../../index";
import { HtmlUtil } from "../../index";
import { JQueryEventObject } from "../../../external/typescript/jquery";
// import { Chart, ICssSize, ChartEvent } from "../../index";
import { ChartHandler, ICssSize, Chart } from "../../index";
import { Notification } from "../../../StockChartX.UI/index";
import { ChartEvent } from "../../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

// region Declarations

const Class = {
  FULL_WINDOW: "scxFullWindow",
  FULL_SCREEN: "scxFullScreen"
};

const EventSuffix = ".scxWindowModeHandler";

const Event = {
  FullscreenChanged: "scxFullscreenChanged",
  FullWindowChanged: "scxFullWindowChanged"
};
Object.freeze(Event);

/**
 * Window mode enumeration values.
 * @enum {string}
 * @readonly
 * @memberOf StockChartX
 */
export const WindowMode = {
  /** Normal window mode. */
  NORMAL: <WindowMode>"normal",

  /** Fullscreen mode. */
  FULL_SCREEN: <WindowMode>"full-screen",

  /** Full window mode. */
  FULL_WINDOW: <WindowMode>"full-window"
};
export type WindowMode = "normal" | "full-screen" | "full-window";
Object.freeze(WindowMode);

// endregion

/**
 *  Handles chart window mode changes.
 *  @constructor StockChartX.WindowModeHandler
 *  @augments StockChartX.ChartHandler
 */
export class WindowModeHandler extends ChartHandler {
  /**
   * @internal
   */
  private _isSelfRaisedEvent: boolean;

  /**
   * @internal
   */
  private _preFullWindowSize: ICssSize;

  // region Properties

  /**
   * @internal
   */
  private _mode: WindowMode = WindowMode.NORMAL;

  /**
   * Current window mode.
   * @name mode
   * @type {StockChartX.WindowMode}
   * @readonly
   * @memberOf StockChartX.WindowModeHandler#
   */
  get mode(): WindowMode {
    return this._mode;
  }

  /**
   * @internal
   */
  private _prevMode: WindowMode;

  /**
   * Previous window mode.
   * @name prevMode
   * @type {StockChartX.WindowMode}
   * @readonly
   * @memberOf StockChartX.WindowModeHandler#
   */
  get prevMode(): WindowMode {
    return this._prevMode;
  }

  /**
   * The flag that indicates if chart is in full window mode.
   * It returns true if chart is in full window or full screen mode.
   * @name isInFullWindowMode
   * @type {boolean}
   * @readonly
   * @memberOf StockChartX.WindowModeHandler#
   */
  get isInFullWindowMode(): boolean {
    let mode = this._mode;

    return mode === WindowMode.FULL_WINDOW || mode === WindowMode.FULL_SCREEN;
  }

  // endregion

  constructor(chart: Chart) {
    super(chart);

    this._subscribe();
  }

  // region Events handling

  /**
   * @internal
   * @inheritDoc
   */
  protected _subscribe() {
    let fullscreenEvents = [
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "fullscreenchange",
      "MSFullscreenChange",
      ""
    ].join(`${EventSuffix}, `);
    $(document).on(fullscreenEvents, this, this._onFullScreenChanged);

    $(window).on(`resize${EventSuffix}`, this, this._onWindowResize);
  }

  /**
   * @internal
   * @inheritDoc
   */
  protected _unsubscribe() {
    $(document).off(EventSuffix, this._onFullScreenChanged);
    $(window).off(EventSuffix, this._onWindowResize);
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @internal
   */
  private _onWindowResize(event: JQueryEventObject) {
    let self = <WindowModeHandler>event.data;
    if (self.isInFullWindowMode) {
      self.adjustFullWindowSize();
    }
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @internal
   */
  private _onFullScreenChanged(event: JQueryEventObject) {
    let self = <WindowModeHandler>event.data;

    self._handleFullscreenChange(event);
  }

  // endregion

  /**
   * Sets new window mode.
   * @method setMode
   * @param {StockChartX.WindowMode} mode The new window mode.
   * @memberOf StockChartX.WindowModeHandler#
   */
  setMode(mode: WindowMode) {
    if (this._mode === mode) return;

    this._prevMode = this._mode;
    this._mode = mode;

    try {
      switch (mode) {
        case WindowMode.NORMAL:
          this._exitFullscreen();
          this._exitFullWindow();
          break;
        case WindowMode.FULL_SCREEN:
          this._enterFullWindow();
          this._enterFullscreen();
          break;
        case WindowMode.FULL_WINDOW:
          this._exitFullscreen();
          this._enterFullWindow();
          break;
        default:
          // noinspection ExceptionCaughtLocallyJS
          throw new Error(`$Unknown window mode: ${mode}`);
      }

      this.chart.fireValueChanged(
        ChartEvent.WINDOW_MODE_CHANGED,
        mode,
        this._prevMode
      );
    } catch (error) {
      Notification.error(error);
    }
  }

  // region Fullscreen routines

  /**
   * @internal
   */
  private _enterFullscreen() {
    if (!HtmlUtil.isFullscreenEnabled())
      throw new Error("Fullscreen mode is not enabled.");

    this._isSelfRaisedEvent = true;
    HtmlUtil.enterFullscreen(this.chart.container[0]);
    $(document).trigger(Event.FullscreenChanged, this.chart);
  }

  /**
   * @internal
   */
  private _exitFullscreen() {
    this._isSelfRaisedEvent = true;
    HtmlUtil.exitFullscreen();
    $(document).trigger(Event.FullscreenChanged, this.chart);
    $("body").removeClass(Class.FULL_SCREEN);
    $("body").trigger("click");
  }

  /**
   * @internal
   */
  private _handleFullscreenChange(event: JQueryEventObject) {
    // Check if event was triggered by code. We just need to update UI in this case.
    if (this._isSelfRaisedEvent) {
      this._isSelfRaisedEvent = false;

      let $body = $("body");
      if (this.mode === WindowMode.FULL_SCREEN) {
        $body.addClass(Class.FULL_SCREEN);
        this.adjustFullWindowSize();
      }
      $(window).trigger(Event.FullscreenChanged, this.chart);

      return;
    }

    // Otherwise event was triggered by browser. E.g. we clicked 'Exit Fullscreen' or pressed F11.
    // We have to restore previous window mode in this case.
    if (this.mode !== WindowMode.FULL_SCREEN) return;

    let shouldExitFullscreen = false;

    // Check if this is our element was in fullscreen mode
    let container = $(event.target);
    if (container && $(container).is(this.chart.container)) {
      shouldExitFullscreen = true;
    } else {
      let browser = Environment.browser;
      if (browser === Browser.firefox || browser === Browser.ie) {
        container =
          browser === Browser.firefox
            ? event.target.mozFullScreenElement
            : event.target.msFullscreenElement;

        shouldExitFullscreen = !container;
      }
    }

    if (shouldExitFullscreen) {
      this.setMode(this._prevMode || WindowMode.NORMAL);
    }
  }

  // endregion

  // region Fullwindow routines

  /**
   * @internal
   */
  private _enterFullWindow() {
    let chart = this.chart;

    if (!this._preFullWindowSize) this._preFullWindowSize = chart.cssSize;
    chart.container.addClass(Class.FULL_WINDOW);
    this.adjustFullWindowSize();
    $(window).trigger(Event.FullWindowChanged, chart);
  }

  /**
   * @internal
   */
  private _exitFullWindow() {
    let chart = this.chart;

    chart.container.removeClass(Class.FULL_WINDOW);
    chart.cssSize = this._preFullWindowSize;
    this._preFullWindowSize = null;
    $(window).trigger(Event.FullWindowChanged, chart);
    chart.setNeedsUpdate();
  }

  adjustFullWindowSize() {
    let chart = this.chart,
      container = chart.container,
      scrollbarHeight =
        chart.scrollEnabled && chart.scrollbar != null
          ? chart.scrollbar.outerHeight
          : 0;

    container
      .outerWidth(window.innerWidth - 3)
      .outerHeight(window.innerHeight - 3);

    chart.size = {
      width: container.innerWidth() - 1,
      height:
        container.innerHeight() -
        chart.rootDiv.position().top -
        1 -
        scrollbarHeight
    };
    chart.setNeedsUpdate();
  }

  // endregion
}
