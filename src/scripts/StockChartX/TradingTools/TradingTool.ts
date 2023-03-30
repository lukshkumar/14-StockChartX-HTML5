import { Button } from "../index";
import { HandlersEvents } from "../index";
import { ChartPanelObject } from "../index";
import { GestureArray } from "../index";
import { ChartPanel } from "../index";
// import { ChartEvent } from "../index";
import { ChartEvent } from "../index";
import { DoubleClickGesture } from "../index";
import { PanGesture } from "../index";
import { MouseButton, GestureState, IWindowEvent } from "../index";
import { IPoint } from "../index";
import { DrawingCursorClass } from "../Drawings/utils";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";
export enum TradingToolState {
  NONE,
  MOVING
}

//Extends ChartPanelObject

export abstract class TradingTool extends ChartPanelObject {
  /**
   * @internal
   */
  private _locked: boolean;

  /**
   * Gets/Sets flag that indicates whether tool is locked.
   * @name locked
   * @type {boolean}
   * @memberOf StockChartX.TradingTool#
   */
  get locked(): boolean {
    return this._locked;
  }

  set locked(value: boolean) {
    this._locked = value;
  }

  protected get canHandleEvents(): boolean {
    return this.visible;
  }

  private _eventHandlers: HandlersEvents<Button>;

  /**
   * @internal
   */
  private _gestures: GestureArray;

  /**
   * @internal
   */
  protected _tradingToolState: TradingToolState = TradingToolState.NONE;

  /**
   * Returns true if trading tool can be moved, false otherwise.
   * @name canMove
   * @type {boolean}
   * @readonly
   * @memberOf StockChartX.TradingTool#
   */
  get canMove(): boolean {
    return !this.locked;
  }

  constructor() {
    super({});

    this._initGestures();
    this.visible = true;
    this.locked = false;
    this.zIndex = 300;
  }

  protected _onChartPanelChanged(oldValue: ChartPanel) {
    if (!this.chartPanel) return;

    this._initButtonsInternal();
    this.chart.on(
      ChartEvent.THEME_CHANGED,
      () => this._changeButtonsTheme(),
      this
    );
    this.update();

    super._onChartPanelChanged(oldValue);
  }

  /**
   * Update trading tool.
   * First call when trading tool was added to panel.
   * @method update
   * @memberOf StockChartX.TradingTool#
   */
  public update() {}

  /**
   * Draws markers on the value scale.
   * @method drawValueMarkers
   * @memberOf StockChartX.TradingTool#
   */
  abstract drawValueMarkers();

  /**
   * Returns array of IControl objects which will be handle events.
   * @method initButtons
   * @returns {Button[]}
   * @memberOf StockChartX.TradingTool#
   */
  initButtons(): Button[] {
    return null;
  }

  /**
   * @internal
   */
  private _initButtonsInternal() {
    let handlers = this.initButtons();
    if (handlers) this._eventHandlers = new HandlersEvents(handlers);
  }

  private _changeButtonsTheme() {
    this._eventHandlers.handlers.forEach(
      (value: Button) => (value.chartTheme = this.chart.theme)
    );
  }

  /**
   * @internal
   */
  private _initGestures() {
    this._gestures = new GestureArray(
      [
        new DoubleClickGesture({
          handler: this._handleDoubleClickGesture,
          hitTest: this.hitTest
        }),
        new PanGesture({
          handler: this._handlePanGestureInternal,
          hitTest: this._panGestureHitTest,
          button: MouseButton.LEFT
        })
      ],
      this
    );
  }

  protected _handleDoubleClickGesture(): boolean {
    return false;
  }

  /**
   * @internal
   */
  private _panGestureHitTest(point: IPoint): boolean {
    return this.visible && this.canMove && this.hitTest(point);
  }

  /**
   * @internal
   */
  private _handlePanGestureInternal(gesture: PanGesture, event: IWindowEvent) {
    if (this._handlePanGesture(gesture, event)) {
      switch (gesture.state) {
        case GestureState.STARTED:
          this.changeCursor(DrawingCursorClass.RESIZE_NS);
          break;
        case GestureState.CONTINUED:
          this._tradingToolState = TradingToolState.MOVING;
          break;
        case GestureState.FINISHED:
          this._tradingToolState = TradingToolState.NONE;
          this.changeCursor();
          break;
        default:
          break;
      }
    }

    this.setNeedsUpdatePanel();
  }

  hitTest(point: IPoint): boolean {
    return false;
  }

  handleEvent(event: IWindowEvent): boolean {
    if (this._eventHandlers && this._eventHandlers.handleEvent(event))
      return true;

    return this._gestures.handleEvent(event);
  }

  /**
   * @internal
   */
  protected _handlePanGesture(
    gesture: PanGesture,
    event: IWindowEvent
  ): boolean {
    return false;
  }

  remove(): boolean {
    let panel = this.chartPanel;
    if (!panel) return false;

    this.chart.off(ChartEvent.THEME_CHANGED, this);
    panel.removeObjects(this);
    this.setNeedsUpdatePanel();
    this.destroy();

    return true;
  }

  draw() {
    if (this._eventHandlers) this._eventHandlers.draw();
    super.draw();
  }

  setNeedsUpdatePanel() {
    let panel = this.chartPanel;
    if (panel) panel.setNeedsUpdate();
  }

  // region IDestroyable

  /**
   * @inheritdoc
   */
  destroy() {
    if (this._eventHandlers) this._eventHandlers.destroy();
    super.destroy();
  }

  // endregion
}
