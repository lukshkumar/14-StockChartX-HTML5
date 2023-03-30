/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { ContextMenu, IContextMenuConfig } from "./index";
import { HtmlLoader } from "./index";
import { HtmlContainer } from "./index";


"use strict";

// region Interfaces

export interface IIndicatorContextMenuConfig extends IContextMenuConfig {
  indicator: any;
}

// endregion

// region Declarations

const CLASS_ITEM_CHECKED = "scxMenuItemChecked";
const CLASS_DISABLED = "disabled";

const IndicatorContextMenuItem = {
  ABOUT: "about",
  SETTINGS: "settings",
  SHOW_PARAMS: "showParams",
  SHOW_MARKERS: "showMarkers",
  SHOW_VALUES: "showTitleValues",
  VISIBLE: "visible",
  DELETE: "delete",
  MERGE_UP: "mergeUp",
  MERGE_DOWN: "mergeDown",
  UNMERGE_UP: "unmergeUp",
  UNMERGE_DOWN: "unmergeDown"
};
Object.freeze(IndicatorContextMenuItem);

// endregion

export class IndicatorContextMenu extends ContextMenu {
  private static _container: JQuery = null;

  public static MenuItem = IndicatorContextMenuItem;

  constructor(targetDomObject: JQuery, config: IIndicatorContextMenuConfig) {
    super(config, targetDomObject);

    HtmlLoader.loadHtml("IndicatorContextMenu.html", (html: string) => {
      if (!IndicatorContextMenu._container) {
        IndicatorContextMenu._container = HtmlContainer.instance.register(
          "IndicatorContextMenu",
          html
        );
      }

      this._initMenu(config);
    });
  }

  private _initMenu(config: IIndicatorContextMenuConfig): void {
    config.menuContainer = IndicatorContextMenu._container;

    config.onShow = () => {
      let settings = config.indicator;

      this._toggleClass(
        "settings",
        CLASS_DISABLED,
        !settings.allowSettingsDialog
      );
      this._toggleClass(
        "showParams",
        CLASS_ITEM_CHECKED,
        settings.showParamsInTitle
      );
      this._toggleClass(
        "showMarkers",
        CLASS_ITEM_CHECKED,
        settings.showValueMarkers
      );
      this._toggleClass(
        "showTitleValues",
        CLASS_ITEM_CHECKED,
        settings.showValuesInTitle
      );
      this._toggleClass("visible", CLASS_ITEM_CHECKED, settings.visible);
      this._toggleClass("mergeUp", CLASS_DISABLED, !settings.canMergeUp);
      this._toggleClass("mergeDown", CLASS_DISABLED, !settings.canMergeDown);
      this._toggleClass("unmergeUp", CLASS_DISABLED, !settings.canUnmergeUp);
      this._toggleClass(
        "unmergeDown",
        CLASS_DISABLED,
        !settings.canUnmergeDown
      );
    };
  }

  private _toggleClass(id: string, className: string, addClass: boolean) {
    let element = IndicatorContextMenu._container.find(`[data-id=${id}]`);

    if (addClass) element.addClass(className);
    else element.removeClass(className);
  }
}
