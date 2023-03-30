import { JQueryEventObject } from '../external/typescript/jquery';
import { Chart } from "../StockChartX/index";
import { TimeFrame, Periodicity, TimeSpan } from "../StockChartX/index";
import { HtmlContainer } from "./index";
import { MouseEvent } from "../StockChartX/index";
import { Environment } from "../StockChartX/index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

"use strict";
const $ = window.jQuery;
export interface ITimeFramePickerConfig {
  chart?: Chart;
  timeInterval?: number;
  selectionChanged: (timeFrame: any) => void;
}

interface IHeadObjectConfig {
  activator: JQuery;
  dropdownToggler: JQuery;
  labelInterval: JQuery;
  labelPeriodicity: JQuery;
}

interface IDropdownObjecConfig {
  wrapper: JQuery;
  container: JQuery;
  customValueWrapper: JQuery;
  btnPlus: JQuery;
  btnMinus: JQuery;
  inputInterval: JQuery;
  inputPeriodicity: JQuery;
}

interface IDomObjectsConfig {
  head: IHeadObjectConfig;
  dropdown: IDropdownObjecConfig;
  predefinedItems: JQuery;
}

const CLASS_ACTIVE = "active";
const CLASS_ACTIVATED = "activated";
const CLASS_HOVER = "hover";
const CLASS_LEFT = "scxLeft";
const CLASS_RIGHT = "scxRight";

const DATA_INTERVAL = "data-scxValue";
const DATA_PERIODICITY = "data-scxUnits";

const Orientation = {
  LEFT: 0,
  RIGHT: 1
};
Object.freeze(Orientation);
const EventSuffix = ".scxTimeFramePicker";

export class TimeFramePicker {
  private _config: ITimeFramePickerConfig;
  private _rootDomElement: JQuery;
  private _domObjects: IDomObjectsConfig;
  private _isActive: boolean = false;
  private _hasCustomPicker: boolean = false;
  private _btnWrapper: JQuery;

  private _last: TimeFrame = new TimeFrame(Periodicity.MINUTE, 1);

  get chart(): Chart {
    return this._config.chart;
  }
  set chart(value: Chart) {
    this._config.chart = value;
  }

  constructor(rootContainer: JQuery, config: ITimeFramePickerConfig) {
    if (!config.timeInterval) {
      config.timeInterval =
        (config.chart && config.chart.timeInterval) ||
        TimeSpan.MILLISECONDS_IN_MINUTE;
    }

    this._rootDomElement = rootContainer;
    this._config = config;
    this._init();
  }

  public set(timeInterval: any): void {
    this._setValue(TimeFrame.timeIntervalToTimeFrame(timeInterval));
  }

  private _init(): void {
    this._domObjects = TimeFramePicker._getDomObjects(this._rootDomElement);
    this._btnWrapper = this._rootDomElement.find(
      ".scxToolbarButton-buttonWrapper"
    );

    HtmlContainer.instance.register(
      "TimeFramePicker",
      this._domObjects.dropdown.wrapper
    );

    this._hasCustomPicker =
      this._domObjects.dropdown.customValueWrapper.length > 0;

    this._rootDomElement.addClass(CLASS_ACTIVATED);
    this._rootDomElement.hover(
      () => {
        this._btnWrapper.addClass(CLASS_HOVER);
      },
      () => {
        this._btnWrapper.removeClass(CLASS_HOVER);
      }
    );

    this._domObjects.dropdown.inputInterval
      .scxNumericField({
        showArrows: false,
        minValue: 1,
        value: 1
      })
      .keyup((e: JQueryEventObject) => {
        if (e.which === 13) {
          if (
            this._getPickerIntervalValue() === 0 ||
            !this._getPickerIntervalValue()
          ) {
            return;
          }
          this._hideDropDown();
        }
      });

    if (!this._domObjects.dropdown.inputPeriodicity.children().length) {
      let periodicities = this._selectDistinctPredefinedPeriodicities();
      let items = [];
      for (let i in Periodicity) {
        if (Periodicity.hasOwnProperty(i)) {
          if (periodicities.indexOf(Periodicity[i]) >= 0) {
            let value = TimeFrame.periodicityToString(Periodicity[i]);

            items.push(
              $(`<option value="${Periodicity[i]}">${value}</option>`)
            );
          }
        }
      }
      this._domObjects.dropdown.inputPeriodicity.empty().append(items);
    }

    this._domObjects.dropdown.inputPeriodicity.selectpicker({
      container: "body"
    });

    this._domObjects.head.dropdownToggler.click((e: JQueryEventObject) => {
      this._toggleDropDown();
      $(e.currentTarget).blur();
    });

    this._domObjects.head.activator.click(() => {
      this._domObjects.head.dropdownToggler.click();
    });

    $(window).on("scroll resize", () => {
      this._hideDropDown();
    });
    let body = $("body");
    body.on(`${MouseEvent.CLICK}${EventSuffix}`, (evt: JQueryEventObject) => {
      if (
        this._isActive &&
        !$(evt.target)
          .parents()
          .hasClass(this._rootDomElement.attr("class")) &&
        $(evt.target).parents(".scxTimeFramePickerDropDown").length === 0 &&
        $(evt.target).parents(".scxTimeFramePicker-CustomValueUnits").length ===
          0
      ) {
        this._hideDropDown();
      }
    });
    this._domObjects.predefinedItems.click((e: JQueryEventObject) => {
      this._setPredefinedValue($(e.currentTarget).index());
    });

    if (this._hasCustomPicker) {
      if (Environment.isMobile) {
        this._hasCustomPicker = false;
        this._domObjects.dropdown.customValueWrapper.remove();
      } else {
        this._domObjects.dropdown.btnPlus.click((e: JQueryEventObject) => {
          this._domObjects.predefinedItems.removeClass(CLASS_ACTIVE);
          $(e.currentTarget).blur();
          this._domObjects.dropdown.inputInterval.scxNumericField(
            "setValue",
            this._getPickerIntervalValue() + 1
          );
        });

        this._domObjects.dropdown.btnMinus.click((e: JQueryEventObject) => {
          this._domObjects.predefinedItems.removeClass(CLASS_ACTIVE);
          $(e.currentTarget).blur();
          let val = this._getPickerIntervalValue();
          if (val > 1) {
            this._domObjects.dropdown.inputInterval.scxNumericField(
              "setValue",
              val - 1
            );
          }
        });
      }
    }

    this._setValue(
      TimeFrame.timeIntervalToTimeFrame(this._config.timeInterval)
    );
  }

  private _setValue(timeFrame: TimeFrame): void {
    this._domObjects.predefinedItems.removeClass(CLASS_ACTIVE);

    this._last = timeFrame;

    this._setCustomPickerValues();
    this._setLabels();
    this._hideDropDown();
  }

  private _setPredefinedValue(index: number) {
    let item = this._domObjects.predefinedItems.eq(index);

    this._activateItem(item);

    this._last = TimeFramePicker._extractDataFromItem(item);

    this._setCustomPickerValues();
    this._setLabels();
    this._hideDropDown();

    this._fire();
  }

  private static _extractDataFromItem(item: JQuery): TimeFrame {
    return new TimeFrame(
      item.attr(DATA_PERIODICITY),
      parseInt(item.attr(DATA_INTERVAL), 10)
    );
  }

  private _activateItem(item: JQuery): void {
    this._domObjects.predefinedItems.removeClass(CLASS_ACTIVE);
    item.addClass(CLASS_ACTIVE);
  }

  private _setLabels(): void {
    this._domObjects.head.labelInterval.text(this._last.interval);
    this._domObjects.head.labelPeriodicity.text(this._last.periodicity);
  }

  private _setCustomPickerValues(): void {
    if (this._hasCustomPicker) {
      this._domObjects.dropdown.inputInterval.scxNumericField(
        "setValue",
        this._last.interval
      );
      this._domObjects.dropdown.inputPeriodicity
        .selectpicker("val", this._last.periodicity)
        .selectpicker("refresh");
    }
  }

  private _toggleDropDown(): void {
    this._isActive ? this._hideDropDown() : this._showDropDown();
  }

  private _showDropDown(): void {
    this._isActive = true;

    // TODO: there are some magic numbers here need to be refactored

    let btn = this._rootDomElement.addClass(CLASS_ACTIVE);
    let dropDown = this._domObjects.dropdown.wrapper;
    let itemsContainer = this._domObjects.dropdown.container;

    // get dimensions
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight - 1;
    let btnPosition = {
      top: btn.offset().top - $(window).scrollTop(),
      left: btn.offset().left - $(window).scrollLeft()
    };

    // get drop-down's actual width
    itemsContainer.css({ width: "auto", height: "auto" });
    dropDown.css({ top: 0, left: 0, right: "auto" }).show();
    let dropDownWidth = dropDown.outerWidth(true);
    let dropDownHeight = dropDown.outerHeight(true);
    dropDown.hide();

    // set orientation: left | right
    // if space on the right side less than on the left, then choose LEFT orientation
    let btnStart_plus_dropDownWidth_px = btnPosition.left + dropDownWidth;
    let orientation =
      btnStart_plus_dropDownWidth_px > viewportWidth &&
      viewportWidth - btnPosition.left < btnPosition.left + btn.outerWidth(true)
        ? Orientation.LEFT
        : Orientation.RIGHT;

    let dropDownPosition = {
      top:
        btnPosition.top +
        btn.outerHeight(true) -
        parseInt(btn.css("margin-bottom"), 10),
      left: null,
      right: null
    };

    // if dropDownHeight higher than allocated space
    if (dropDownHeight > viewportHeight - dropDownHeight) {
      if (dropDownHeight > viewportHeight) dropDownHeight = viewportHeight / 2;
      dropDownHeight = viewportHeight - (viewportHeight - dropDownHeight);
      dropDownWidth = dropDownWidth + 20;
    }

    switch (orientation) {
      case Orientation.RIGHT:
        dropDownPosition.left = btnPosition.left;
        dropDownPosition.right = "auto";
        dropDown.removeClass(CLASS_LEFT).addClass(CLASS_RIGHT);

        // if dropDownWidth higher than allocated space
        if (dropDownWidth > viewportWidth - dropDownPosition.left)
          dropDownWidth = viewportWidth - dropDownPosition.left - 2;

        break;

      case Orientation.LEFT:
        dropDownPosition.left = "auto";
        dropDownPosition.right =
          viewportWidth - btnPosition.left - btn.outerWidth(true);
        dropDown.removeClass(CLASS_RIGHT).addClass(CLASS_LEFT);

        // if dropDownWidth higher than allocated space
        if (dropDownWidth > viewportWidth - dropDownPosition.right) {
          dropDownWidth = viewportWidth - dropDownPosition.right - 2;
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
    this._domObjects.dropdown.wrapper.hide();
    this._rootDomElement.removeClass(CLASS_ACTIVE);
    this._btnWrapper.removeClass(CLASS_HOVER);
    this._isActive = false;

    this._synchronizeWithCustomPicker();
  }

  private _synchronizeWithCustomPicker(): void {
    if (!this._hasCustomPicker) return;

    let pickerInterval = this._getPickerIntervalValue();
    let pickerPeriodicity = <string>(
      this._domObjects.dropdown.inputPeriodicity.selectpicker("val")
    );

    if (
      pickerInterval !== this._last.interval ||
      pickerPeriodicity !== this._last.periodicity
    ) {
      this._last.interval = pickerInterval;
      this._last.periodicity = pickerPeriodicity;

      this._setLabels();
      this._fire();
    }
  }

  private _fire(): void {
    if (typeof this._config.selectionChanged === "function") {
      this._config.selectionChanged(this._last);
    }
  }

  private _getPickerIntervalValue(): number {
    let text = $("<div></div>")
      .text(this._domObjects.dropdown.inputInterval.scxNumericField("getValue"))
      .html();

    return parseInt(text, 10);
  }

  private _selectDistinctPredefinedPeriodicities() {
    let periodicities = [];
    let periodicity: string;

    this._domObjects.predefinedItems.each((index: number, item: Element) => {
      periodicity = $(item)
        .attr(DATA_PERIODICITY)
        .toLowerCase();
      try {
        TimeFrame.periodicityToString(periodicity);
      } catch (ex) {
        periodicity = null;
      }

      if (periodicity !== null && periodicities.indexOf(periodicity) < 0) {
        periodicities.push(periodicity);
      }
    });
    return periodicities;
  }

  private static _getDomObjects(root: JQuery): IDomObjectsConfig {
    return {
      head: {
        activator: root.find(".scxToolbarButton-activateBtn"),
        dropdownToggler: root.find(".scxToolbarButton-toggleDropdownBtn"),
        labelInterval: root.find(".scxTimeFramePicker-button-value"),
        labelPeriodicity: root.find(".scxTimeFramePicker-button-units")
      },
      dropdown: {
        wrapper: root.find(".scxTimeFramePickerDropDown"),
        container: root.find(".scxTimeFramePicker-dropdownContainer"),
        customValueWrapper: root.find(".scxTimeFramePicker-CustomValueWrapper"),
        btnPlus: root.find(".scxTimeFramePicker-CustomValuePlus"),
        btnMinus: root.find(".scxTimeFramePicker-CustomValueMinus"),
        inputInterval: root.find(".scxTimeFramePicker-CustomValueText"),
        inputPeriodicity: root.find(".scxTimeFramePicker-CustomValueUnits")
      },
      predefinedItems: root.find(".scxToolbarButton-dropdownElement")
    };
  }
}
