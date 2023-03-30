import { JQueryEventObject } from "../external/typescript/jquery.d";
import { HtmlContainer } from "./index";

import { Chart, ChartPanel } from "../StockChartX/index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

const $ = window.jQuery;

export interface IDialogConfig {
  chart: Chart;
  chartPanel?: ChartPanel;
}

export interface IDialog {
  show(config: IDialogConfig): void;
  hide(): void;
  resize(): void;
  destroy(): void;
}

export interface IDialogContent {
  dialog: JQuery;
  root: JQuery;
  header: JQuery;
  body: JQuery;
  footer: JQuery;
}

export class Dialog implements IDialog {
  protected _isShown: boolean;
  protected _config: IDialogConfig;
  protected _dialog: JQuery;
  protected _dialogContent: IDialogContent;
  private _keyboardEnabledState: boolean;

  constructor(container: JQuery) {
    this._isShown = false;
    this._dialog = container;
    this._dialog.attr("tabindex", -1);
    this._dialog.modal({ backdrop: true, keyboard: true, show: false });
    this._dialog.on("hidden.bs.modal", () => {
      if (this._isShown) this.hide();
    });
    this._initDialogContentObj();
    this._dialogContent.dialog.draggable({
      handle: ".modal-header",
      containment: "window"
    });
    $(window).on("resize", this, this._onWindowResize);

    this._dialog.on("hide.bs.modal", () => {
      this._dialogContent.body.trigger("click");
    });

    this._dialogContent.header.on("mousedown", () => {
      this._dialogContent.body.trigger("click");
    });
  }

  public show(config: IDialogConfig): void {
    config.chart.localize(this._dialog);
    this._isShown = true;
    this._dialog.attr("style", "");
    this._dialog.modal("show");
    this.resize();
    this._centralize();
  }

  public hide(): void {
    if (!this._isShown) return;

    this._isShown = false;
    this._dialog.modal("hide");

    // Fix Firefox Copy/Paste bug after showing settings window
    $(document.activeElement).blur();
    this._config.chart.keyboardEventsEnabled = this._keyboardEnabledState;
    this._config = null;
  }

  public resetToDefault(): void {}

  public resize(): void {
    this._adjustHeight();
  }

  public destroy(): void {
    $(window).off("resize", this._onWindowResize);
  }

  protected initDialog(config: IDialogConfig): boolean {
    if (!config || !config.chart || this._config || this._isShown) return false;

    this._config = config;

    this._keyboardEnabledState = config.chart.keyboardEventsEnabled;
    config.chart.keyboardEventsEnabled = false;

    HtmlContainer.instance.resetSelf(config.chart);

    return true;
  }

  private _initDialogContentObj(): void {
    let dialog = this._dialog.find("> .modal-dialog");
    let root = dialog.find("> .modal-content");

    this._dialogContent = {
      dialog,
      root,
      header: root.find("> .modal-header"),
      body: root.find("> .modal-body"),
      footer: root.find("> .modal-footer")
    };
  }

  private _onWindowResize(event: JQueryEventObject): void {
    let self = event.data;
    if (self._isShown) self.resize();
  }

  private _adjustHeight(): void {
    this._dialogContent.body.css("height", "auto");
    this._dialogContent.dialog.css("height", "auto");

    let windowHeight = 0.9 * window.innerHeight;
    let dialogHeight = this._dialogContent.dialog.outerHeight(true);

    if (windowHeight < dialogHeight) {
      let dialogVerticalIndent =
        dialogHeight - this._dialogContent.dialog.height();
      let bodyVerticalIndent =
        this._dialogContent.body.outerHeight(true) -
        this._dialogContent.body.height();

      let headerHeight = this._dialogContent.header.outerHeight(true);
      let footerHeight = this._dialogContent.footer.outerHeight(true) || 0;

      let height =
        windowHeight -
        headerHeight -
        footerHeight -
        bodyVerticalIndent -
        dialogVerticalIndent;
      $(this._dialogContent.body).height(height);
    }
  }

  private _centralize(): void {
    let left = (window.innerWidth - this._dialogContent.dialog.width()) / 2;
    this._dialogContent.dialog.css("margin", "0");
    this._dialogContent.dialog.css("left", left);
    this._dialogContent.dialog.css("top", 20);
  }
}
