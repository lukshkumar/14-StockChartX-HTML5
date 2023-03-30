/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";
import { IDestroyable } from "../StockChartX/index";
import { JQueryEventObject } from "../external/typescript/jquery";
// region Interfaces

export interface IContextMenuConfig {
  menuContainer?: JQuery;
  showOnClick?: boolean;

  onItemSelected(selectedMenu: JQuery, isChecked?: boolean);
  onShow?();
}

// endregion

// region Declarations

const $ = window.jQuery;

const Class = {
  CHECKABLE: "scxMenuItemCheckable",
  CHECKED: "scxMenuItemChecked",
  DISABLED: "disabled",
  SUB_MENU: "scxSubMenu",
  WITH_SUB_MENU: "scxMenuItemWithSubMenu"
};

const EVENT_CONTEXT_MENU_OPEN = "scxContextMenuOpen";

// endregion

export class ContextMenu implements IDestroyable {
  private static Id = 0;
  private _eventSuffix = `.scxContentMenu_${++ContextMenu.Id}`;
  protected _config: IContextMenuConfig;

  private _isShown = false;

  get container(): JQuery {
    return this._config.menuContainer;
  }

  constructor(config: IContextMenuConfig, targetDomObject?: JQuery) {
    this._config = config;

    if (targetDomObject) {
      targetDomObject.on("contextmenu", (e: JQueryEventObject) => {
        $("body").trigger(EVENT_CONTEXT_MENU_OPEN);
        this.show(e);

        return false;
      });

      if (config.showOnClick) {
        targetDomObject.on("click", (e: JQueryEventObject) => {
          $("body").trigger(EVENT_CONTEXT_MENU_OPEN);
          this.show(e);

          return false;
        });
      }
    }

    this._subscribeEvents();
  }

  private _subscribeEvents() {
    let docEvents = ["click", "touchstart", ""];
    $(document).on(
      docEvents.join(`${this._eventSuffix} `),
      (e: JQueryEventObject) => {
        if (e.button === 2)
          // workaround for click event right after contextmenu when doing right click
          return null;

        if (this._isShown) {
          this.hide();
        }
      }
    );

    let windowEvents = ["scroll", "resize", ""];
    $(window).on(windowEvents.join(`${this._eventSuffix} `), () => {
      if (this._isShown) this.hide();
    });

    $("body").on(EVENT_CONTEXT_MENU_OPEN + this._eventSuffix, () => {
      if (this._isShown) this.hide();
    });
  }

  private _unsubscribeEvents() {
    $(document).off(this._eventSuffix);
    $(window).off(this._eventSuffix);
    $("body").off(this._eventSuffix);
  }

  hide(): void {
    this._isShown = false;
    this._config.menuContainer.hide();
  }

  show(event: JQueryEventObject): void {
    if (this._config.onShow) {
      $("body")
        .trigger("click")
        .trigger("localize", [this.container]);
      this._config.onShow();
    }
    if (!this._config.menuContainer) return;

    this._config.menuContainer
      .data("target", $(event.target))
      .show()
      .css(
        this._calculateMenuPosition(
          this._getLeftLocation(event),
          this._getTopLocation(event)
        )
      )
      .off("click")
      .on("click", (e: JQueryEventObject) => {
        e.preventDefault();

        if (
          !$(e.target)
            .parent()
            .attr("data-id")
        )
          return false;

        this.hide();

        if (!this._config.onItemSelected) return false;

        let selectedMenuItem = $(e.target)
          .blur()
          .parent();
        if (selectedMenuItem.hasClass(Class.DISABLED)) return false;

        if (selectedMenuItem.hasClass(Class.CHECKABLE)) {
          let isChecked = selectedMenuItem.hasClass(Class.CHECKED);
          if (isChecked) selectedMenuItem.removeClass(Class.CHECKED);
          else selectedMenuItem.addClass(Class.CHECKED);

          this._config.onItemSelected(selectedMenuItem, !isChecked);
        } else {
          this._config.onItemSelected(selectedMenuItem);
        }

        return false;
      })
      .find(`.${Class.WITH_SUB_MENU}`)
      .each(function() {
        ContextMenu._getSubMenuTopLocation($(this));
      });

    this._isShown = true;
  }

  private _getLeftLocation(e: JQueryEventObject): number {
    let mouseWidth =
      e.pageX ||
      (e.originalEvent && (<JQueryEventObject>e.originalEvent).pageX);
    let pageWidth = $(window).width();
    let menuWidth = this._config.menuContainer.width();

    if (mouseWidth + menuWidth > pageWidth && menuWidth < mouseWidth)
      return mouseWidth - menuWidth;

    return mouseWidth;
  }

  private _getTopLocation(e: JQueryEventObject): number {
    let mouseHeight =
      e.pageY ||
      (e.originalEvent && (<JQueryEventObject>e.originalEvent).pageY);
    let pageHeight = $(window).height();
    let menuHeight = this._config.menuContainer.height();

    if (mouseHeight + menuHeight > pageHeight && menuHeight < mouseHeight)
      return mouseHeight - menuHeight;

    return mouseHeight;
  }

  private _calculateMenuPosition(left: number, top: number) {
    let contextMenu = this._config.menuContainer;

    contextMenu.css({
      width: "auto",
      height: "auto"
    });

    let pageHeight = $(window).height();
    let menuHeight = contextMenu.outerHeight(true);
    let topPosition = top;

    // if contextMenu height higher than allocated space
    if (menuHeight > pageHeight) {
      contextMenu.height(pageHeight - 20);
      menuHeight = pageHeight;
    }

    // if on page can fit one context menu, than centered them
    if (pageHeight / menuHeight < 2) {
      topPosition = pageHeight / 2 - menuHeight / 2;
    }

    let menuPosition = {
      position: "fixed",
      top: topPosition,
      left: left - $(window).scrollLeft()
    };

    return menuPosition;
  }

  private static _getSubMenuTopLocation(subMenuElement: JQuery): void {
    let parentOffset = subMenuElement.parent().offset().top;
    let subMenuOffset = subMenuElement.offset().top;

    subMenuElement.find(`.${Class.SUB_MENU}`).css({
      top: `${subMenuOffset - parentOffset - 5}px`
    });
  }

  // region IDestroyable

  destroy() {
    if (this._isShown) this.hide();

    this._unsubscribeEvents();
  }

  // endregion
}
