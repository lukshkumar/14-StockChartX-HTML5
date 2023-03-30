
import { IDestroyable } from "../StockChartX/index";

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
const i18AttrLoading = "waitingBar.loading";

export interface IWaitingBarConfig {
  dotsCount: number;
}

const Class = {
  CONTAINER: "scxWaitingBarContainer",
  LOADING_TEXT: "scxWaitingBarText",
  DOTS_CONTAINER: "scxDotsContainer",
  DOT: "scxWaitingBarDot"
};

export class WaitingBar implements IDestroyable {
  /**
   * @internal
   */
  private _config: IWaitingBarConfig;

  /**
   * @internal
   */
  private _parentContainer: JQuery;

  /**
   * @internal
   */
  private _container: JQuery;

  /**
   * @internal
   */
  private _isShown: boolean = false;

  constructor(container: JQuery) {
    this._parentContainer = container;
  }

  /**
   * Appends waiting bar's HTML to the DOM.
   * @method show
   * @param {StockChartX.UI.IWaitingBarConfig} config Waiting bar configuration.
   * @memberOf StockChartX.UI.WaitingBar#
   */
  show(config: IWaitingBarConfig): void {
    if (this._isShown) return;

    this._isShown = true;
    this._config = $.extend(
      {
        dotsCount: 7
      },
      config
    );

    this._createDom();
    this._container.show();
  }

  /**
   * Removes waiting bar html from the DOM.
   * @method hide
   * @param {boolean} [hideAnyway = false] Usually you have to call "hide" as many times as you called "show".
   * Set this parameter to true if you want to hide Waiting Bar anyway.
   * @memberOf StockChartX.UI.WaitingBar#
   */
  hide(hideAnyway?: boolean): void {
    if (!hideAnyway) if (!this._isShown) return;

    this._isShown = false;
    this.destroy();
  }

  /**
   * @internal
   */
  private _createDom(): void {
    this._container = $(`<div class="${Class.CONTAINER}"></div>`).appendTo(
      this._parentContainer
    );

    $(
      `<span class="${
      Class.LOADING_TEXT
      }" data-i18n="${i18AttrLoading}">Loading...</span>`
    ).appendTo(this._container);

    let dotsContainer = $(
      `<div class="${Class.DOTS_CONTAINER}"></div>`
    ).appendTo(this._container);

    for (let i = 0; i < this._config.dotsCount; i++)
      dotsContainer.append($(`<div class="${Class.DOT}"></div>`));
  }

  // region IDestroyable

  destroy() {
    if (!this._container) return;
    this._container.remove();
    this._container = null;
  }

  // endregion
}
