/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { Dictionary } from "../StockChartX/index";
import { HtmlLoader } from "./index";
import { HtmlContainer } from "./index";
import { JsUtil } from "../StockChartX/index";
import { DrawingSettingsDialog } from "./index";
import { FibonacciDrawingSettingsDialog } from "./index";
import { IchimokuIndicatorSettingsDialog } from "./index";
import { DarvasBoxSettingsDialog } from "./index";
import { IndicatorInfoDialog } from "./index";
import { IndicatorsDialog } from "./index";
import { IndicatorSettingsDialog } from "./index";
import { PriceStyleSettingsDialog } from "./index";
import { ThemeDialog } from "./index";
import { TooltipView } from "./index";
import { OrderDialog } from "../StockChartX/index";

"use strict";

export type IViewCallback<T> = (instance: T) => void;
export interface IViewClass<T> {
  new (element: JQuery): T;
}

const HtmlFileName = {
  DRAWING_DIALOG: "DrawingSettingsDialog.html",
  FIBONACCI_DRAWING_DIALOG: "FibonacciDrawingSettingsDialog.html",
  ICHIMOKU_INDICATOR_DIALOG: "IchimokuIndicatorSettingsDialog.html",
  INDICATOR_INFO_DIALOG: "IndicatorInfoDialog.html",
  INDICATORS_DIALOG: "IndicatorsDialog.html",
  INDICATOR_DIALOG: "IndicatorSettingsDialog.html",
  PRICE_STYLE_DIALOG: "PriceStyleSettingsDialog.html",
  DARVAS_BOX_DIALOG: "DarvasBoxSettingsDialog.html",
  THEME_DIALOG: "ThemeDialog.html",
  TOOLTIP_VIEW: "TooltipView.html",
  ORDER_DIALOG: "OrderDialog.html"
};
Object.freeze(HtmlFileName);

export class ViewLoader {
  /**
   * @internal
   */
  private static _views = new Dictionary<string, any>();

  /**
   * @internal
   */
  private static _initView<T>(
    viewName: string,
    ViewClass: IViewClass<T>,
    onLoad: IViewCallback<T>
  ) {
    HtmlLoader.loadHtml(viewName, (html: string) => {
      let element = HtmlContainer.instance.register(viewName, html),
        viewElement = new ViewClass(element);

      this._views.add(viewName, viewElement);
      this._invokeOnLoad(onLoad, viewElement);
    });
  }

  /**
   * @internal
   */
  private static _loadView<T>(
    viewName: string,
    viewClass: IViewClass<T>,
    onLoad: IViewCallback<T>
  ) {
    let view = <T>this._views.get(viewName);

    if (view) this._invokeOnLoad(onLoad, view);
    else this._initView(viewName, viewClass, onLoad);
  }

  /**
   * @internal
   */
  private static _invokeOnLoad<T>(onLoad: IViewCallback<T>, dialog: T): void {
    if (JsUtil.isFunction(onLoad)) onLoad(dialog);
  }

  static drawingSettingsDialog(
    onLoad: IViewCallback<DrawingSettingsDialog>
  ): void {
    this._loadView(HtmlFileName.DRAWING_DIALOG, DrawingSettingsDialog, onLoad);
  }

  static fibonacciDrawingSettingsDialog(
    onLoad: IViewCallback<FibonacciDrawingSettingsDialog>
  ): void {
    this._loadView(
      HtmlFileName.FIBONACCI_DRAWING_DIALOG,
      FibonacciDrawingSettingsDialog,
      onLoad
    );
  }

  static ichimokuIndicatorSettingsDialog(
    onLoad: IViewCallback<IchimokuIndicatorSettingsDialog>
  ): void {
    this._loadView(
      HtmlFileName.ICHIMOKU_INDICATOR_DIALOG,
      IchimokuIndicatorSettingsDialog,
      onLoad
    );
  }

  static darvasBoxSettingsDialog(
    onLoad: IViewCallback<DarvasBoxSettingsDialog>
  ): void {
    this._loadView(
      HtmlFileName.DARVAS_BOX_DIALOG,
      DarvasBoxSettingsDialog,
      onLoad
    );
  }

  static indicatorInfoDialog(onLoad: IViewCallback<IndicatorInfoDialog>): void {
    this._loadView(
      HtmlFileName.INDICATOR_INFO_DIALOG,
      IndicatorInfoDialog,
      onLoad
    );
  }

  static indicatorsDialog(onLoad: IViewCallback<IndicatorsDialog>): void {
    this._loadView(HtmlFileName.INDICATORS_DIALOG, IndicatorsDialog, onLoad);
  }

  static indicatorSettingsDialog(
    onLoad: IViewCallback<IndicatorSettingsDialog>
  ): void {
    this._loadView(
      HtmlFileName.INDICATOR_DIALOG,
      IndicatorSettingsDialog,
      onLoad
    );
  }

  static priceStyleSettingsDialog(
    onLoad: IViewCallback<PriceStyleSettingsDialog>
  ): void {
    this._loadView(
      HtmlFileName.PRICE_STYLE_DIALOG,
      PriceStyleSettingsDialog,
      onLoad
    );
  }

  static themeDialog(onLoad: IViewCallback<ThemeDialog>): void {
    this._loadView(HtmlFileName.THEME_DIALOG, ThemeDialog, onLoad);
  }

  static tooltipView(onLoad: IViewCallback<TooltipView>): void {
    this._loadView(HtmlFileName.TOOLTIP_VIEW, TooltipView, onLoad);
  }

  static orderDialog(onLoad: IViewCallback<OrderDialog>): void {
    this._loadView(HtmlFileName.ORDER_DIALOG, OrderDialog, onLoad);
  }
}
