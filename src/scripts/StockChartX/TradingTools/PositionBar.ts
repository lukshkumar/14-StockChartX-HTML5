import { Geometry } from "../index";
import { IPositionBarTheme } from "../index";
import {
  TradingTool,
  TradingToolState
} from "../index";
import {
  IButtonOptions,
  Button,
  ButtonType
} from "../index";
import { IPoint } from "../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

export interface IPosition {
  id: number | string;
  price: number;
  kind: PositionKind;
  quantity: number;
}

export interface IPositionBarConfig {
  position: IPosition;
}

export const PositionKind = {
  SHORT: <PositionKind>"short",
  LONG: <PositionKind>"long"
};
export type PositionKind = "short" | "long";
Object.freeze(PositionKind);

export const PositionBarEvents = {
  CLOSE_POSITION_CLICKED: "closePositionClicked"
};

/**
 * The with of position bar kind. Global value for all positions.
 * @name kindTextWidth
 * @type {number}
 */
let kindTextWidth = 0;

/**
 * The with of position bar quantity. Global value for all positions.
 * @name quantityTextWidth
 * @type {number}
 */
let quantityTextWidth = 0;

export class PositionBar extends TradingTool {
  /**
   * @internal
   */
  private _position: IPosition;

  /**
   * @internal
   */
  private _localizedKind: string;

  /**
   * Gets/Sets the position.
   * @name position
   * @type {IPosition}
   * @memberOf StockChartX.PositionBar#
   */
  get position(): IPosition {
    return this._position;
  }

  set position(value: IPosition) {
    this._position = value;
  }

  /**
   * @internal
   */
  private _theme: IPositionBarTheme;

  /**
   * Gets/Sets theme of position bar.
   * @name  theme
   * @type {IPositionBarTheme}
   * @memberOf StockChartX.OrderBar#
   */
  get theme(): IPositionBarTheme {
    return this._theme;
  }

  set theme(value: IPositionBarTheme) {
    this._theme = value;
  }

  /**
   * Gets current theme of position tool.
   * @name actualTheme
   * @type {IPositionBarTheme}
   * @memberOf StockChartX.PositionBar#
   */
  get actualTheme(): IPositionBarTheme {
    return this.theme || this.defaultTheme;
  }

  /**
   * Gets default theme of position tool.
   * @name defaultTheme
   * @type {IPositionBarTheme}
   * @memberOf StockChartX.PositionBar#
   */
  get defaultTheme(): IPositionBarTheme {
    return this.chart.theme.positionBar[this.position.kind];
  }

  private _closeButtonOptions: IButtonOptions;

  constructor(config: IPositionBarConfig) {
    super();
    let position = config.position;

    if (!position) {
      this.remove();
      throw new Error("Position is not assigned.");
    }

    this.position = position;
  }

  private _getCloseButtonOptions(): IButtonOptions {
    return this._closeButtonOptions;
  }

  private _onCloseButtonClick() {
    this.fire(PositionBarEvents.CLOSE_POSITION_CLICKED);
    this.remove();
  }

  /**
   * @inheritdoc
   */
  initButtons(): Button[] {
    return [
      new Button({
        context: this.context,
        type: ButtonType.CANCEL,
        chartTheme: this.chart.theme,
        options: this._getCloseButtonOptions.bind(this),
        onClick: this._onCloseButtonClick.bind(this)
      })
    ];
  }

  /**
   * @inheritdoc
   */
  hitTest(point: IPoint): boolean {
    if (!this.canHandleEvents) return false;

    let y = this.projection.yByValue(this.position.price);

    return Geometry.isValueNearValue(point.y, y);
  }

  /**
   * @inheritdoc
   */
  draw() {
    if (!this.visible) return;

    let context = this.context,
      frame = this.chartPanel.contentFrame,
      rightLineWidth = frame.width * 0.1,
      freeSpace = frame.width * 0.04,
      position = this.position,
      endPoint = frame.width,
      theme = this.actualTheme,
      value = this.projection.yByValue(position.price),
      kind = this._localizedKind || this.position.kind,
      checkBoxSize = 10;

    if (this._tradingToolState === TradingToolState.NONE) {
      // this is draw from right to left
      context.beginPath();
      context.moveTo(endPoint, value);
      context.lineTo((endPoint -= rightLineWidth), value);
      context.scxStroke(theme.line);

      endPoint -= freeSpace;

      context.textBaseline = "middle";
      context.textAlign = "center";
      context.scxApplyTextTheme(theme.quantity.text);
      context.fillText(
        position.quantity.toString(),
        endPoint - quantityTextWidth / 2,
        value
      );

      endPoint -= quantityTextWidth;
      endPoint -= freeSpace;

      context.textBaseline = "middle";
      context.textAlign = "center";
      context.scxApplyTextTheme(theme.kind.text);
      context.fillText(kind, endPoint - kindTextWidth / 2, value);

      endPoint -= kindTextWidth;
      endPoint -= freeSpace;

      this._closeButtonOptions = {
        position: { x: endPoint - checkBoxSize / 2, y: value },
        size: checkBoxSize
      };
      endPoint -= checkBoxSize;
    } else {
      this._closeButtonOptions = null;
    }

    context.beginPath();
    context.moveTo(frame.left, value);
    context.lineTo(endPoint, value);
    context.scxStroke(theme.line);
    super.draw();
  }

  /**
   * @inheritdoc
   */
  drawValueMarkers() {
    let marker = this.chart.valueMarker,
      scale = this.panelValueScale;

    marker.draw(this.position.price, scale, this.actualTheme.price);
  }

  public async update(localize: boolean = true) {
    if (localize) await this._localizeValues();

    this._updateTextWidth();
    this.setNeedsUpdatePanel();
  }

  private _updateTextWidth() {
    let context = this.context,
      kind = this._localizedKind || this.position.kind,
      calculatedKindTextWidth = Math.round(context.measureText(kind).width),
      calculatedQuantityTextWidth = Math.round(
        context.measureText(this.position.quantity.toString()).width
      );

    if (calculatedQuantityTextWidth > quantityTextWidth)
      quantityTextWidth = calculatedQuantityTextWidth;

    if (calculatedKindTextWidth > kindTextWidth)
      kindTextWidth = calculatedKindTextWidth;
  }

  private async _localizeValues() {
    let kindKey = `tradingTool.position.kind.${this.position.kind}`,
      localizedKind = <string>await this.chart.localizeText(kindKey);

    this._localizedKind =
      localizedKind !== kindKey ? localizedKind : this.position.kind;
  }

  // region IDestroyable

  destroy() {
    kindTextWidth = 0;
    quantityTextWidth = 0;
    this.chartPanel.positions.forEach(async (position: PositionBar) =>
      position.update(false)
    );

    super.destroy();
  }

  // endregion
}
