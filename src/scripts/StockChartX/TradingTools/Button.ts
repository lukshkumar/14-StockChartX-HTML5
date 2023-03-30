import { Geometry } from "../index";
// import { $ } from "../../external/typescript/jquery";
import { IPoint } from "../index";
import { Control } from "../index";
import { ICheckBoxTheme } from "../index";
import { GestureArray } from "../index";
import { PanGesture } from "../index";
import {
  MouseButton,
  GestureState,
  IWindowEvent
} from "../index";
import { MouseHoverGesture } from "../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
const $ = window.jQuery;

"use strict";

/**
 * Enum of possible types checkbox presentation.
 * @readonly
 * @enum {ButtonType}
 * @memberOf StockChartX
 */
export const ButtonType = {
  ACCEPT: <ButtonType>"accept",
  CANCEL: <ButtonType>"cancel",
  NONE: <ButtonType>"none"
};
export type ButtonType = "accept" | "denied" | "none";
Object.freeze(ButtonType);

export interface IButtonConfig {
  context: CanvasRenderingContext2D;
  chartTheme: any;
  type?: ButtonType;
  options(): IButtonOptions;
  onClick?(): void;
}

export interface IButtonOptions {
  size: number;
  position: IPoint;
}

export class Button extends Control {
  /**
   * @internal
   */
  private _context: CanvasRenderingContext2D;

  /**
   * @internal
   */
  private _onClick: () => void;

  /**
   * @internal
   */
  private _options: () => IButtonOptions;

  /**
   * Gets options of current object.
   * @name options
   * @type {IButtonOptions}
   * @memberOf StockChartX.Button#
   */
  get options(): IButtonOptions {
    return this._options();
  }

  /**
   * @internal
   */
  private _type: ButtonType;

  /**
   * Gets/Sets type of checkbox.
   * @name type
   * @type {ButtonType}
   * @memberOf StockChartX.Button#
   */
  get type(): ButtonType {
    return this._type;
  }

  set type(value: ButtonType) {
    this._type = value;
  }

  /**
   * @internal
   */
  private _theme: ICheckBoxTheme;

  /**
   * Gets/sets actual theme.
   * @name theme
   * @type {ICheckBoxTheme}
   * @memberOf StockChartX.Button#
   */
  get theme(): ICheckBoxTheme {
    return this._theme || this.defaultTheme;
  }

  set theme(value: ICheckBoxTheme) {
    this._theme = value;
  }

  /**
   * @internal
   */
  private _chartTheme: any;

  /**
   * @name chartTheme
   * Sets chart theme.
   * @name chartTheme
   * @type {Object}
   * @memberOf StockChartX.Button#
   */
  set chartTheme(value: any) {
    this._chartTheme = value;
  }

  /**
   * Gets actual theme.
   * @name theme
   * @type {ICheckBoxTheme}
   * @memberOf StockChartX.Button#
   */
  get defaultTheme(): ICheckBoxTheme {
    return this._chartTheme.button[this.type];
  }

  constructor(config: IButtonConfig) {
    super();
    this._context = config.context;
    this._options = config.options;
    this.type = config.type || ButtonType.NONE;
    this.chartTheme = config.chartTheme;
    this._onClick = config.onClick;
  }

  /**
   * @internal
   */
  protected _initGestures(): GestureArray {
    return new GestureArray(
      [
        new PanGesture({
          handler: this._handlePanGesture,
          button: MouseButton.LEFT
        }),
        new MouseHoverGesture({
          handler: this._handleOnMouseHover
        })
      ],
      this,
      this._hitTest
    );
  }

  /**
   * @internal
   */
  private _hitTest(mousePoint: IPoint): boolean {
    let options = this.options;
    if (!options) return false;

    let position = options.position,
      delta = options.size / 2,
      point1 = { x: position.x - delta, y: position.y + delta },
      point2 = { x: position.x + delta, y: position.y - delta };

    return Geometry.isPointInsideOrNearRectPoints(mousePoint, point1, point2);
  }

  /**
   * @internal
   */
  private _handleOnMouseHover(gesture: MouseHoverGesture) {
    this.changeCursor(gesture.state !== GestureState.FINISHED);
  }

  /**
   * @internal
   */
  private _handlePanGesture(gesture: PanGesture, event: IWindowEvent) {
    if (
      gesture.state === GestureState.FINISHED &&
      this._hitTest(event.pointerPosition)
    ) {
      if (this._onClick) this._onClick();
    }
  }

  draw() {
    let options = this.options;
    if (!options) return;

    let context = this._context,
      size = options.size,
      halfSize = size / 2,
      position = options.position;

    context.beginPath();
    context.rect(position.x - halfSize, position.y - halfSize, size, size);
    context.scxFill(this.theme.fill, false);

    context.beginPath();
    halfSize -= 0.1 * size;
    switch (this.type) {
      case ButtonType.ACCEPT:
        context.moveTo(position.x - halfSize, position.y);
        context.lineTo(position.x, position.y + halfSize);
        context.lineTo(position.x + halfSize, position.y - halfSize);
        break;
      case ButtonType.CANCEL:
        context.moveTo(position.x - halfSize, position.y - halfSize);
        context.lineTo(position.x + halfSize, position.y + halfSize);

        context.moveTo(position.x - halfSize, position.y + halfSize);
        context.lineTo(position.x + halfSize, position.y - halfSize);
        break;
      default:
        break;
    }
    context.scxStroke(this.theme.line);
  }

  destroy() {
    this.changeCursor();
  }

  /**
   * @internal
   */
  private changeCursor(change?: boolean) {
    let scxContainer = $(".scxContainer");

    if (change) scxContainer.addClass("scxCursorPointer");
    else scxContainer.removeClass("scxCursorPointer");
  }
}
