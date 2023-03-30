import { JQueryEventObject } from '../external/typescript/jquery.d';
import { Chart } from "../StockChartX/index";
// import { $ } from "../external/typescript/jquery";
import { HtmlContainer } from "./index";
const $ = window.jQuery;

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */


"use strict";

const EVENT_CONTEXT_MENU_OPEN = "scxContextMenuOpen";
const EVENT_ANOTHER_BTN_ACTIVATED = "scxToolbarButton-anotherButtonActivated";
const EVENT_ANOTHER_DROP_DOWN_ACTIVATE =
  "scxToolbarButton-anotherDropdownActivated";

const DATA_VALUE = "data-scxValue";
const DATA_TYPE = "data-type";

const CLASS_ACTIVE = "active";
const CLASS_ACTIVATED = "activated";
const CLASS_HOVER = "hover";
const CLASS_LEFT = "scxLeft";
const CLASS_RIGHT = "scxRight";

const Orientation = {
  LEFT: 0,
  RIGHT: 1
};
Object.freeze(Orientation);

export interface IToolbarDropDownButtonConfig {
  chart?: Chart;
  selectedItem?: string;
  selectionChanged(dataValue: string, isActivated?: boolean);
}

export class ToolbarDropDownButton {
  private _config: IToolbarDropDownButtonConfig;
  private _rootElement: JQuery;
  private _btnWrapper: JQuery;
  private _btnActivate: JQuery;
  private _body: JQuery;
  private _canToggle = true;
  private _canFireFromHead: boolean;
  private _hasChildren = false;
  private _isActivated = false;
  private _isActive = false;
  private _btn_toggleDropDown: JQuery;
  private _itemsWrapper: JQuery;
  private _itemsContainer: JQuery;
  private _items: JQuery;

  get chart(): Chart {
    return this._config.chart;
  }
  set chart(value: Chart) {
    this._config.chart = value;
  }

  constructor(rootElement: JQuery, config: IToolbarDropDownButtonConfig) {
    this._config = config;
    this._rootElement = rootElement;
    this._body = $("body");
    this._init();
  }

  public selectItem(val: string, fire: boolean): void {
    this._setValue(val, fire);
  }

  public deactivate(): void {
    this._deactivateButton();
  }

  public activate(): void {
    this._activateButton();
  }

  private _init(): void {
    this._btnWrapper = this._rootElement.find(
      ".scxToolbarButton-buttonWrapper"
    );
    this._btnActivate = this._rootElement.find(".scxToolbarButton-activateBtn");
    this._btn_toggleDropDown = this._rootElement.find(
      ".scxToolbarButton-toggleDropdownBtn"
    );
    this._itemsWrapper = this._rootElement.find(
      ".scxToolbarButton-dropdownWrapper"
    );
    this._itemsContainer = this._rootElement.find(
      ".scxToolbarButton-dropdownElementsContainer"
    );
    this._items = this._rootElement.find(".scxToolbarButton-dropdownElement");

    HtmlContainer.instance.register(
      "scxToolbarButton-dropdownWrapper",
      this._itemsWrapper,
      false
    );

    this._canToggle = this._rootElement.hasClass("scxToolbarCanToggle");
    this._canFireFromHead = this._rootElement.hasClass(
      "scxToolbarCanFireFromHead"
    );

    if (
      this._rootElement.hasClass("scxToolbarButtonWithDropdown") &&
      this._btn_toggleDropDown.length > 0 &&
      this._items.length > 0
    ) {
      this._hasChildren = true;
    }

    this._btnWrapper.on("click", (e: JQueryEventObject) => {
      let target = $(e.target);

      if (target.is(this._btnActivate)) {
        this._btnWrapper.removeClass(CLASS_HOVER);
        if (this._canToggle) {
          this._toggleButton(e);
        } else if (this._canFireFromHead) {
          this._fireFromHead();
        } else if (
          this._hasChildren &&
          !this._canToggle &&
          !this._canFireFromHead
        ) {
          this._toggleDropDown();
        }
      } else if (target.is(this._btn_toggleDropDown)) {
        this._toggleDropDown();
      } else if (this._hasChildren) {
        this._toggleDropDown();
      }
    });

    this._btnWrapper.hover(
      () => {
        this._btnWrapper.addClass(CLASS_HOVER);
      },
      () => {
        this._btnWrapper.removeClass(CLASS_HOVER);
      }
    );

    this._btnActivate.focus((e: JQueryEventObject) => {
      $(e.currentTarget).blur();
    });

    this._body.on(
      EVENT_ANOTHER_BTN_ACTIVATED,
      (e: JQueryEventObject, target: any) => {
        this._triggerActiveButton(target.button, target.chart);
        this._hideDropDown();
      }
    );

    if (this._hasChildren) {
      this._itemsWrapper
        .hide()
        .addClass(this._rootElement.attr(DATA_TYPE))
        .appendTo(HtmlContainer.instance.componentsContainer);
      // .appendTo(this._body);

      this._body.bind(
        [EVENT_ANOTHER_DROP_DOWN_ACTIVATE, EVENT_CONTEXT_MENU_OPEN].join(" "),
        () => {
          this._hideDropDown();
          this._deactivateButton();
        }
      );

      if (!this._canFireFromHead) {
        this._btnActivate.attr(
          DATA_VALUE,
          this._items.first().attr(DATA_VALUE)
        );
      }

      this._btn_toggleDropDown.focus((e: JQueryEventObject) => {
        $(e.currentTarget).blur();
      });

      this._body.on("click", (evt: JQueryEventObject) => {
        if (
          this._isActive &&
          !$(evt.target)
            .parents()
            .hasClass(this._rootElement.attr("class"))
        ) {
          this._hideDropDown();
        }
      });

      this._body.on("touchstart", (evt: JQueryEventObject) => {
        if (
          this._isActive &&
          !$(evt.target)
            .parents()
            .hasClass(this._rootElement.attr("class"))
        ) {
          this._hideDropDown();
        }
      });

      this._items.on("click touchstart", (e: JQueryEventObject) => {
        let val = $(e.currentTarget).attr(DATA_VALUE);
        this._setValue(val);
      });

      if (this._config.selectedItem) {
        this._setValue(this._config.selectedItem);
      }

      $(window).on("scroll resize", () => {
        this._hideDropDown();
      });
    }
  }

  private _setValue(val?: string, fire?: boolean): void {
    this._deactivateButton(fire);
    this._items.removeClass(CLASS_ACTIVE);

    if (!this._canFireFromHead) {
      this._items
        .parent()
        .find(`[${DATA_VALUE}="${val}"]`)
        .addClass(CLASS_ACTIVE);
      this._btnActivate.attr(DATA_VALUE, val);
    }

    this._activateButton(fire, val);
    this._hideDropDown();
  }

  private _triggerActiveButton(target: object, chart: Chart): void {
    if (this.chart !== chart) return;

    if ($(target).index(".scxToolbar-btn-stayInDrawingMode") !== -1) return;

    if (this._rootElement.hasClass("scxToolbarButtonManuallySwitchable"))
      return;

    if (!$(target).is(this._btnActivate) && this._canToggle) {
      this._deactivateButton();
    }
  }

  private _activateButton(fire?: boolean, dataValue?: string): void {
    this._isActivated = true;

    if (this._canToggle) {
      this._rootElement.addClass(CLASS_ACTIVATED);
      this._itemsWrapper.addClass(CLASS_ACTIVATED);
      this._body.trigger(EVENT_ANOTHER_BTN_ACTIVATED, {
        button: this._btnActivate,
        chart: this.chart
      });
    }

    if (this._canFireFromHead) {
      this._config.selectionChanged(dataValue, this._isActivated);
    } else if (fire !== false && this._config.selectionChanged) {
      this._config.selectionChanged(
        this._btnActivate.attr(DATA_VALUE),
        this._isActivated
      );
    }
  }

  private _deactivateButton(fire?: boolean): void {
    if (this._isActivated) {
      this._isActivated = false;

      if (this._canToggle) {
        this._rootElement.removeClass(CLASS_ACTIVATED);
        this._itemsWrapper.removeClass(CLASS_ACTIVATED);
      }

      if (
        fire !== false &&
        this._config.selectionChanged &&
        !this._canFireFromHead
      ) {
        this._config.selectionChanged(
          this._btnActivate.attr(DATA_VALUE),
          this._isActivated
        );
      }
    }
  }

  private _toggleButton(e: JQueryEventObject): void {
    if (this._isActivated) this._deactivateButton();
    else this._activateButton();
  }

  private _fireFromHead(): void {
    if (this._isActive) {
      this._hideDropDown();
    } else {
      let val = this._btnActivate.attr(DATA_VALUE);
      this._config.selectionChanged(val);
    }
  }

  private _showDropDown(): void {
    this._body.trigger(EVENT_ANOTHER_DROP_DOWN_ACTIVATE);
    this._isActive = true;

    // TODO: there are some magic numbers here need to be refactored

    let btn = this._rootElement.addClass(CLASS_ACTIVE);
    let dropDown = this._itemsWrapper;
    let itemsContainer = this._itemsContainer;

    // get dimensions
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight - 1;
    let btnPosition = {
      top: btn.offset().top - $(window).scrollTop(),
      left: btn.offset().left - $(window).scrollLeft()
    };

    // get drop-down's actual width
    itemsContainer.css({ width: "auto", height: "auto" });
    dropDown
      .css({ top: 0, left: 0 })
      .removeClass("visible")
      .show();
    let dropDownWidth = dropDown.outerWidth(true) + 10; // 10 instead of right padding - prevents text overflow triggering
    let dropDownHeight = dropDown.outerHeight(true);
    dropDown.hide().addClass("visible");

    // set orientation: left | right
    // if space on the right side less than on the left, then choose LEFT orientation
    let orientation =
      btnPosition.left + dropDownWidth > viewportWidth &&
        viewportWidth - btnPosition.left < btnPosition.left + btn.outerWidth(true)
        ? Orientation.LEFT
        : Orientation.RIGHT;

    let dropDownPosition = {
      top:
        btnPosition.top +
        btn.outerHeight(true) -
        parseInt(btn.css("margin-bottom"), 10),
      left: null
    };

    // if dropDownHeight higher than allocated space
    if (dropDownHeight > viewportHeight - dropDownPosition.top)
      dropDownHeight = viewportHeight - dropDownPosition.top;

    // set horizontal position and width
    switch (orientation) {
      case Orientation.RIGHT:
        dropDownPosition.left = btnPosition.left;
        dropDown.removeClass(CLASS_LEFT).addClass(CLASS_RIGHT);

        // if dropDownWidth higher than allocated space
        if (dropDownWidth > viewportWidth - dropDownPosition.left)
          dropDownWidth = viewportWidth - dropDownPosition.left;

        break;

      case Orientation.LEFT:
        let btnRightCornerPosition = btnPosition.left + btn.outerWidth(true);

        dropDownPosition.left = btnRightCornerPosition - dropDownWidth - 2;
        dropDown.removeClass(CLASS_RIGHT).addClass(CLASS_LEFT);

        // if dropDownWidth higher than allocated space
        if (dropDownWidth > btnRightCornerPosition) {
          dropDownWidth = btnRightCornerPosition - 2;
          dropDownPosition.left = 0;
        }

        break;
      default:
        break;
    }

    itemsContainer.outerWidth(dropDownWidth).outerHeight(dropDownHeight);
    dropDown.css(dropDownPosition).show();
  }

  private _hideDropDown(): void {
    this._itemsWrapper.hide();
    this._rootElement.removeClass(CLASS_ACTIVE);
    this._btnWrapper.removeClass(CLASS_HOVER);
    this._isActive = false;
  }

  private _toggleDropDown(): void {
    if (this._isActive) this._hideDropDown();
    else this._showDropDown();
  }
}
