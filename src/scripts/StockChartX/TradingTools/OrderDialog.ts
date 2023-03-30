import { IDialogConfig, Dialog } from "../../StockChartX.UI/index";
import { Chart } from "../index";
import {
  OrderBar,
  OrderAction,
  OrderState,
  OrderKind,
  OrderTimeInForce,
  OrderBarEvents
} from "../index";
// import { $ } from "../../external/typescript/jquery";
import { JsUtil } from "../index";
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

export interface IOrderDialogConfig extends IDialogConfig {
  chart: Chart;
  orderBar: OrderBar;
}

const ORDER_DIALOG = {
  DIALOG: "#scxOrderDialog_",
  INPUT: "#scxOrderDialog_input_",
  SELECT: "#scxOrderDialog_select_",
  BUTTON: "#scxOrderDialog_btn_",
  REGION: "#scxOrderDialog_region_"
};

export class OrderDialog extends Dialog {
  protected _config: IOrderDialogConfig;

  private _submitButton: JQuery;
  private _replaceButton: JQuery;
  private _sellButton: JQuery;
  private _buyButton: JQuery;
  private _kindSelect: JQuery;
  private _price: JQuery;
  private _priceRow: JQuery;
  private _stopPrice: JQuery;
  private _stopPriceRow: JQuery;
  private _timeInForceDateRow: JQuery;
  private _quantityInput: JQuery;
  private _timeInForceSelect: JQuery;
  private _timeInForceDatePicker: JQuery;

  /**
   * @internal
   */
  private _orderBar: OrderBar;

  /**
   * @internal
   */
  private _modifyOrderMode: boolean = false;

  /**
   * @internal
   */
  private _wasApplied: boolean = false;

  private static _quantityInputConfig = {
    showArrows: false,
    minValue: 1,
    maxValue: 100000000000,
    value: 0
  };

  private static _priceInputConfig = {
    showArrows: false,
    minValue: 0.00001,
    value: 0,
    maxValue: 10000000,
    priceDecimals: 5
  };

  constructor(container: JQuery) {
    super(container);

    this._initFields();
    this._init();
  }

  public show(config: IOrderDialogConfig): void {
    if (!this.initDialog(config)) return;

    if (config.orderBar.order.action) this._modifyOrderMode = true;

    this._orderBar = config.orderBar;

    this._setValues();
    super.show(config);
  }

  public hide(): void {
    if (!this._modifyOrderMode && !this._wasApplied)
      this._config.orderBar.remove();

    this._wasApplied = false;
    this._modifyOrderMode = false;
    super.hide();
  }

  /**
   * @internal
   */
  private _init(): void {
    this._sellButton.on("click", () => {
      this._orderBar.order.action = OrderAction.SELL;
      this._save();
    });

    this._buyButton.on("click", () => {
      this._orderBar.order.action = OrderAction.BUY;
      this._save();
    });

    this._submitButton.on("click", () => {
      this._save();
    });

    this._replaceButton.on("click", () => {
      this._save();
    });

    this._kindSelect.selectpicker({ container: "body" }).on("change", () => {
      this._changeType(this._kindSelect.val());
    });

    this._timeInForceSelect
      .selectpicker({ container: "body" })
      .on("change", () => {
        this._changeTimeInForce(this._timeInForceSelect.val());
      });

    this._timeInForceSelect.selectpicker({ container: "body" });
    this._quantityInput.scxNumericField(OrderDialog._quantityInputConfig);
    this._price.scxNumericField(OrderDialog._priceInputConfig);
    this._stopPrice.scxNumericField(OrderDialog._priceInputConfig);
    this._initDatePicker(this._timeInForceDatePicker);
  }

  private _initDatePicker(datePicker: JQuery) {
    datePicker.datetimepicker({
      widgetPositioning: {
        vertical: "top"
      },
      widgetParent: $(".modal-content", this._dialog)
    });

    datePicker
      .on("dp.change", (event: DatePickerChangeEvent) => {
        if (event.date == null) {
          datePicker
            .data("DateTimePicker")
            .date((<moment.Moment>event.oldDate).toDate());
        }
      })
      .on("dp.hide", (event: DatePickerEvent) => {
        if (datePicker.val() === "")
          datePicker.data("DateTimePicker").date(event.date.toDate());
      });
  }

  /**
   * @internal
   */
  private _setValues() {
    let order = this._orderBar.order;

    this._price.scxNumericField("setValue", order.price);
    this._stopPrice.scxNumericField("setValue", order.stopPrice || 0);
    this._quantityInput.scxNumericField("setValue", order.quantity);
    this._timeInForceDatePicker
      .data("DateTimePicker")
      .date(order.date || new Date());
    this._kindSelect
      .selectpicker("val", order.kind)
      .prop("disabled", this._modifyOrderMode)
      .selectpicker("refresh");
    this._timeInForceSelect
      .selectpicker("val", order.timeInForce)
      .prop("disabled", this._modifyOrderMode)
      .selectpicker("refresh");

    if (this._modifyOrderMode) {
      this._sellButton.hide();
      this._buyButton.hide();
      if (order.state === OrderState.PENDING_SUBMIT) {
        this._submitButton.show();
        this._replaceButton.hide();
      } else {
        this._submitButton.hide();
        this._replaceButton.show();
      }
    } else {
      this._sellButton.show();
      this._buyButton.show();
      this._submitButton.hide();
      this._replaceButton.hide();
    }
  }

  /**
   * @internal
   */
  private _save(): void {
    this._apply();
    this.hide();
  }

  /**
   * @internal
   */
  private _apply(): void {
    let orderBar = this._orderBar,
      order = orderBar.order,
      oldOrder = JsUtil.clone(order);

    order.price = this._price.scxNumericField("getValue");
    order.stopPrice = this._stopPrice.scxNumericField("getValue");
    order.quantity = this._quantityInput.scxNumericField("getValue");
    order.kind = <OrderKind>this._kindSelect.selectpicker("val");
    order.timeInForce = <OrderTimeInForce>(
      this._timeInForceSelect.selectpicker("val")
    );
    order.date = this._timeInForceDatePicker
      .data("DateTimePicker")
      .date()
      .toDate();

    orderBar.update();

    if (oldOrder.price !== order.price)
      orderBar.fire(OrderBarEvents.ORDER_PRICE_CHANGED, order, oldOrder);

    this._wasApplied = true;
  }

  /**
   * @internal
   */
  private _changeType(type: OrderKind) {
    switch (type) {
      case OrderKind.MARKET:
        this._priceRow.hide();
        this._stopPriceRow.hide();
        break;
      case OrderKind.STOP:
        this._stopPriceRow.show();
        this._priceRow.hide();
        break;
      case OrderKind.LIMIT:
        this._stopPriceRow.hide();
        this._priceRow.show();
        break;
      case OrderKind.STOP_LIMIT:
        this._stopPriceRow.show();
        this._priceRow.show();
        break;
      default:
        throw new Error("Order kind is not valid");
    }
  }

  /**
   * @internal
   */
  private _changeTimeInForce(type: OrderTimeInForce) {
    if (type === OrderTimeInForce.GOOD_TILL_DATE)
      this._timeInForceDateRow.show();
    else this._timeInForceDateRow.hide();
  }

  /**
   * @internal
   */
  private _initFields(): void {
    this._submitButton = this._dialog.find(`${ORDER_DIALOG.BUTTON}submit`);
    this._replaceButton = this._dialog.find(`${ORDER_DIALOG.BUTTON}replace`);
    this._sellButton = this._dialog.find(`${ORDER_DIALOG.BUTTON}sell`);
    this._buyButton = this._dialog.find(`${ORDER_DIALOG.BUTTON}buy`);
    this._kindSelect = this._dialog.find(`${ORDER_DIALOG.SELECT}kind`);
    this._timeInForceSelect = this._dialog.find(
      `${ORDER_DIALOG.SELECT}timeInForce`
    );
    this._timeInForceDatePicker = this._dialog.find(
      `${ORDER_DIALOG.INPUT}timeInForceDate`
    );
    this._price = this._dialog.find(`${ORDER_DIALOG.INPUT}price`);
    this._stopPrice = this._dialog.find(`${ORDER_DIALOG.INPUT}stopPrice`);
    this._quantityInput = this._dialog.find(`${ORDER_DIALOG.INPUT}quantity`);
    this._priceRow = this._dialog.find(`${ORDER_DIALOG.REGION}price`);
    this._stopPriceRow = this._dialog.find(`${ORDER_DIALOG.REGION}stopPrice`);
    this._timeInForceDateRow = this._dialog.find(
      `${ORDER_DIALOG.REGION}timeInForceDate`
    );
  }
}
