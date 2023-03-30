import { WindowMode, Chart } from "../StockChartX/index";

// import { Chart } from "../StockChartX/index";
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

export interface IViewElement {
  name: string;
  element: JQuery;
}

const Class = {
  COMPONENTS_CONTAINER: "scxComponentsContainer"
};

export class HtmlContainer {
  private _componentsContainer: JQuery;
  get componentsContainer(): JQuery {
    return this._componentsContainer;
  }

  private _elements: IViewElement[];
  get elements(): IViewElement[] {
    return this._elements;
  }

  private static _instance: HtmlContainer = null;
  static get instance(): HtmlContainer {
    if (HtmlContainer._instance == null) {
      HtmlContainer._instance = new HtmlContainer();
    }

    return HtmlContainer._instance;
  }

  constructor() {
    this._componentsContainer = $(
      `<div class="${Class.COMPONENTS_CONTAINER}"></div>`
    ).appendTo($("body"));
    this._elements = [];
    $(window).on("scxFullscreenChanged", this, this._onBrowserFullScreenChange);
  }

  register(
    name: string,
    element: JQuery | string,
    isAppend: boolean = true
  ): JQuery {
    let container: JQuery = null;
    if (element) {
      container = <JQuery>(
        (isAppend ? $(element).appendTo(this.componentsContainer) : $(element))
      );

      this._elements.push({
        name,
        element: container
      });
    }

    return container;
  }

  resetSelf(chart: Chart) {
    if (!chart) return;

    if (chart.windowMode === WindowMode.FULL_SCREEN) {
      this.reset(chart.container);
    } else {
      this.reset();
    }
  }

  reset(container?: JQuery) {
    container = container || $("body");

    if ($.contains(container.get(0), this._componentsContainer.get(0))) {
      this._componentsContainer.detach();
    }

    this._componentsContainer.appendTo(container);
  }

  private _onBrowserFullScreenChange(event: JQueryEventObject, chart: Chart) {
    if (!chart) return;

    let self = event.data;

    // if (Environment.browser === Browser.Edge || Environment.browser === Browser.Firefox) {
    if (chart.windowMode === WindowMode.FULL_SCREEN) {
      self.reset(chart.container);
    } else {
      self.reset();
    }
    // }
  }
}
