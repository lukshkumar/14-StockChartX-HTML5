import { JQueryEventObject } from '../external/typescript/jquery.d';

import { JsUtil } from "../StockChartX/index";

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

export type ITabsCallbackFunction = (activeIndex: number) => any;

export interface ITabsConfig {
  tabsContainer: JQuery;
  panelsContainer: JQuery;
  activeIndex?: number;
  onChange?: ITabsCallbackFunction;
}

const Class = {
  ACTIVE: "active",
  TAB_ITEM: "scxTabItem",
  TABS_CONTENT: "scxTabsContent",
  TAB_PANEL: "scxTabPanel"
};

export class Tabs {
  private _config: ITabsConfig;
  private _tabs: JQuery;
  private _panels: JQuery;
  private _activeIndex: number;

  constructor(config: ITabsConfig) {
    this._config = config;
    this._activeIndex = 0;

    // get items
    this._tabs = config.tabsContainer.children().removeClass(Class.ACTIVE);
    this._panels = config.panelsContainer.children().removeClass(Class.ACTIVE);

    // activate needed item
    if (this._config.activeIndex && JsUtil.isNumber(this._config.activeIndex))
      this._activeIndex = this._config.activeIndex;
    this._tabs.eq(this._activeIndex).addClass(Class.ACTIVE);
    this._panels.eq(this._activeIndex).addClass(Class.ACTIVE);

    // set same width for all items to make them fit all dedicated width
    this._tabs.css("width", `${100 / this._tabs.length}%`);

    // add click handler
    this._tabs.on("click", this, this._onItemClicked);
  }

  public activate(index: number, fire?: boolean): void {
    if (index !== this._activeIndex) {
      this._tabs.eq(this._activeIndex).removeClass(Class.ACTIVE);
      this._panels.eq(this._activeIndex).removeClass(Class.ACTIVE);

      this._tabs.eq(index).addClass(Class.ACTIVE);
      this._panels.eq(index).addClass(Class.ACTIVE);

      this._activeIndex = index;
    }

    if (fire && JsUtil.isFunction(this._config.onChange))
      this._config.onChange(index);
  }

  public activeIndex(): number {
    return this._activeIndex;
  }

  public destroy(): void {
    this._tabs.off("click", this._onItemClicked);
  }

  private _onItemClicked(event: JQueryEventObject): void {
    let self = event.data;
    self.activate($(event.target).index(), true);
  }
}
