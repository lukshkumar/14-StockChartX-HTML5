import { Geometry } from "../index";
import { OrderDialog } from "../../StockChartX/index";
import { TradingTool, TradingToolState } from "../index";
import { IOrderBarTheme } from "../index";
import { IButtonOptions, Button, ButtonType } from "../index";
import { ViewLoader } from "../../StockChartX.UI/index";
import { PanGesture } from "../index";
import { IWindowEvent, GestureState } from "../index";
import { JsUtil } from "../index";
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

export interface IOrder {
  id: number | string;
  price: number;
  stopPrice?: number;
  action?: OrderAction;
  kind: OrderKind;
  quantity: number;
  state: OrderState;
  timeInForce: OrderTimeInForce;
  date?: Date;
}

export interface IOrderBarConfig {
  order: IOrder;
}

export const OrderAction = {
  BUY: <OrderAction>"buy",
  SELL: <OrderAction>"sell"
};
export type OrderAction = "buy" | "sell";
Object.freeze(OrderAction);

export const OrderKind = {
  MARKET: <OrderKind>"market",
  STOP: <OrderKind>"stop",
  LIMIT: <OrderKind>"limit",
  STOP_LIMIT: <OrderKind>"stopLimit"
};
export type OrderKind = "market" | "stop" | "limit" | "stopLimit";
Object.freeze(OrderKind);

export const OrderState = {
  PENDING_SUBMIT: <OrderState>"pendingSubmit",
  PENDING_CANCEL: <OrderState>"pendingCancel",
  PENDING_REPLACE: <OrderState>"pendingReplace",
  SUBMITTED: <OrderState>"submitted",
  ACCEPTED: <OrderState>"accepted"
};
export type OrderState =
  | "pendingSubmit"
  | "pendingCancel"
  | "pendingReplace"
  | "submitted"
  | "accepted";
Object.freeze(OrderState);

export const OrderTimeInForce = {
  GOOD_TILL_DATE: <OrderTimeInForce>"goodTillDate",
  DAY: <OrderTimeInForce>"day",
  GOOD_TILL_CANCEL: <OrderTimeInForce>"goodTillCanceled"
};
export type OrderTimeInForce = "goodTillDate" | "day" | "goodTillCanceled";
Object.freeze(OrderTimeInForce);

export const OrderBarEvents = {
  ORDER_SETTINGS_CLICKED: "orderSettingsClicked",
  ACCEPT_ORDER_CLICKED: "acceptOrderClicked",
  CANCEL_ORDER_CLICKED: "cancelOrderClicked",
  ORDER_PRICE_CHANGED: "orderPriceChanged"
};

/**
 * The with of order bar kind. Global value for all orders.
 * @name kindTextWidth
 * @type {number}
 */
let kindTextWidth = 0;

/**
 * The with of order bar quantity. Global value for all orders.
 * @name quantityTextWidth
 * @type {number}
 */
let quantityTextWidth = 0;

export class OrderBar extends TradingTool {
  /**
   * @internal
   */
  private _order: IOrder;

  /**
   * @internal
   */
  private _oldOrder: IOrder;

  /**
   * @internal
   */
  private _localizedKind: string;

  /**
   * Gets/Sets the order.
   * @name order
   * @type {IOrder}
   * @memberOf StockChartX.OrderBar#
   */
  get order(): IOrder {
    return this._order;
  }

  set order(value: IOrder) {
    this._order = value;
  }

  /**
   * @internal
   */
  private _theme: IOrderBarTheme;

  /**
   * Gets/Sets theme of order bar.
   * @name  theme
   * @type {IOrderBarTheme}
   * @memberOf StockChartX.OrderBar#
   */
  get theme(): IOrderBarTheme {
    return this._theme;
  }

  set theme(value: IOrderBarTheme) {
    this._theme = value;
  }

  /**
   * Gets current theme of order bar.
   * @name actualTheme
   * @type {IOrderBarTheme}
   * @memberOf StockChartX.OrderBar#
   */
  get actualTheme(): IOrderBarTheme {
    return this.theme || this.defaultTheme;
  }

  /**
   * Gets default theme of order bar.
   * @name defaultTheme
   * @type {IOrderBarTheme}
   * @memberOf StockChartX.OrderBar#
   */
  get defaultTheme(): IOrderBarTheme {
    let order = this.order;

    return this.chart.theme.orderBar[order.action][order.kind][order.state];
  }

  private _cancelButtonOptions: IButtonOptions;
  private _acceptedButtonOptions: IButtonOptions;

  constructor(config: IOrderBarConfig) {
    super();
    let order = config.order;

    if (!order) {
      this.remove();
      throw new Error("Order is not assigned.");
    }

    this.order = order;
  }

  private _getCancelButtonOptions(): IButtonOptions {
    return this._cancelButtonOptions;
  }

  private _getAcceptedButtonOptions(): IButtonOptions {
    return this._acceptedButtonOptions;
  }

  private _onCancelButtonClick() {
    this.fire(OrderBarEvents.CANCEL_ORDER_CLICKED);
    this.remove();
  }

  private _onAcceptButtonClick() {
    this.fire(OrderBarEvents.ACCEPT_ORDER_CLICKED);
  }

  private _showOrderDialog() {
    ViewLoader.orderDialog((dialog: OrderDialog) => {
      dialog.show({
        chart: this.chart,
        orderBar: this
      });
    });
  }

  protected _handleDoubleClickGesture(): boolean {
    this._showOrderDialog();
    this.fire(OrderBarEvents.ORDER_SETTINGS_CLICKED);

    return super._handleDoubleClickGesture();
  }

  protected _handlePanGesture(gesture: PanGesture, event: IWindowEvent) {
    switch (gesture.state) {
      case GestureState.STARTED:
        this._oldOrder = JsUtil.clone(this._order);
        break;
      case GestureState.CONTINUED:
        this.order.price = this.projection.valueByY(event.pointerPosition.y);
        break;
      case GestureState.FINISHED:
        if (this._oldOrder.price !== this.order.price)
          this.fire(
            OrderBarEvents.ORDER_PRICE_CHANGED,
            this.order,
            this._oldOrder
          );
        break;
      default:
        break;
    }

    return true;
  }

  /**
   * @inheritdoc
   */
  initButtons(): Button[] {
    let chartTheme = this.chart.theme,
      context = this.context;

    return [
      new Button({
        context,
        type: ButtonType.ACCEPT,
        chartTheme,
        options: this._getAcceptedButtonOptions.bind(this),
        onClick: this._onAcceptButtonClick.bind(this)
      }),
      new Button({
        context,
        type: ButtonType.CANCEL,
        chartTheme,
        options: this._getCancelButtonOptions.bind(this),
        onClick: this._onCancelButtonClick.bind(this)
      })
    ];
  }

  /**
   * @inheritdoc
   */
  hitTest(point: IPoint): boolean {
    if (!this.canHandleEvents) return false;

    let y = this.projection.yByValue(this.order.price);

    return Geometry.isValueNearValue(point.y, y);
  }

  /**
   * @inheritdoc
   */
  draw() {
    if (!this.visible || !this.order) return;

    let context = this.context,
      frame = this.chartPanel.contentFrame,
      rightLineWidth = Math.round(frame.width * 0.1),
      freeSpace = frame.width * 0.04,
      order = this.order,
      endPoint = frame.width,
      theme = this.actualTheme,
      value = this.projection.yByValue(order.price),
      kind = this._localizedKind || this.order.kind,
      checkBoxSize = 10;

    if (this._tradingToolState === TradingToolState.NONE) {
      // this is draw from right to left
      this._cancelButtonOptions = {
        position: { x: endPoint - checkBoxSize / 2, y: value },
        size: checkBoxSize
      };
      endPoint = Math.round(endPoint);
      endPoint -= checkBoxSize;
      rightLineWidth -= checkBoxSize;

      context.beginPath();
      context.moveTo(endPoint, value);
      endPoint -= rightLineWidth;
      context.lineTo(endPoint, value);
      context.scxStroke(theme.line);

      endPoint -= freeSpace;

      context.textBaseline = "middle";
      context.textAlign = "center";
      context.scxApplyTextTheme(theme.quantity.text);
      context.fillText(
        order.quantity.toString(),
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

      if (order.state === OrderState.PENDING_SUBMIT) {
        this._acceptedButtonOptions = {
          position: { x: endPoint - checkBoxSize / 2, y: value },
          size: checkBoxSize
        };
        endPoint -= checkBoxSize;
      } else this._acceptedButtonOptions = null;

      // this._settingsButtonOptions = {
      //     position: {x: endPoint - checkBoxSize / 2, y: value},
      //     size: checkBoxSize
      // };
      // endPoint -= checkBoxSize;
    } else {
      this._acceptedButtonOptions = null;
      this._cancelButtonOptions = null;
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
    if (!this.order) return;

    let marker = this.chart.valueMarker,
      scale = this.panelValueScale;

    marker.draw(this.order.price, scale, this.actualTheme.price);
  }

  public async update(localize: boolean = true) {
    if (localize) await this._localizeValues();

    this._updateTextWidth();
    this.setNeedsUpdatePanel();
  }

  private _updateTextWidth() {
    let context = this.context,
      kind = this._localizedKind || this.order.kind,
      calculatedKindTextWidth = Math.round(context.measureText(kind).width),
      calculatedQuantityTextWidth = Math.round(
        context.measureText(this.order.quantity.toString()).width
      );

    if (calculatedQuantityTextWidth > quantityTextWidth)
      quantityTextWidth = calculatedQuantityTextWidth;

    if (calculatedKindTextWidth > kindTextWidth)
      kindTextWidth = calculatedKindTextWidth;
  }

  private async _localizeValues() {
    let kindKey = `tradingTool.order.kind.${this.order.kind}`,
      localizedKind = <string>await this.chart.localizeText(kindKey);

    this._localizedKind =
      localizedKind !== kindKey ? localizedKind : this.order.kind;
  }

  // region IDestroyable

  destroy() {
    kindTextWidth = 0;
    quantityTextWidth = 0;
    this.chartPanel.orders.forEach(async (order: OrderBar) =>
      order.update(false)
    );

    super.destroy();
  }

  // endregion
}
