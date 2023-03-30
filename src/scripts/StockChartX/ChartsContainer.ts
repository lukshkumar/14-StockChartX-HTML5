import { Chart, IChartConfig, IValueChangedEvent } from "./index";
import { ChartEvent } from "./index";
import { WindowMode } from "./index";
import { Toolbar } from "../StockChartX.UI/index";
import { Scrollbar } from "../StockChartX.UI/index";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

export interface IChartsContainerItem {
  container: JQuery;
  chart: Chart;
  keyboardEventsEnabled?: boolean;
  mouseEventsEnabled?: boolean;
}

export interface IContainerDisplacement {
  width: number;
  height: number;
}

const EVENT_SUFFIX = ".chartsContainer";

const Class = {
  CHART_CONTAINER: "scxChartContainer",
  NON_ACTIVE_BORDER: "scxNonActiveBorder",
  ACTIVE_BORDER: "scxActiveBorder"
};

/**
 * @internal
 */
export class ChartsContainer {
  private _maxChartsCountX = 1;
  private _maxChartsCountY = 1;
  private _chartsItems: IChartsContainerItem[] = [];
  private _displacement: IContainerDisplacement = {
    width: 2, // displacement for border
    height: 20 // displacement for toolbar
  };

  private _isFullWindowMode = false;
  private _isFullScreenMode = false;

  // region Properties

  private _parent: JQuery;
  get parent(): JQuery {
    return this._parent;
  }

  private _toolbar: Toolbar;
  get toolbar(): Toolbar {
    return this._toolbar;
  }

  private _scrollbar: Scrollbar;
  get scrollbar(): Scrollbar {
    return this._scrollbar;
  }

  get containerDisplacement(): IContainerDisplacement {
    return this._displacement;
  }

  set containerDisplacement(value: IContainerDisplacement) {
    this._displacement = value;
  }

  get charts(): Chart[] {
    return this._chartsItems.map((item: IChartsContainerItem) => item.chart);
  }

  // endregion

  constructor(parent: JQuery) {
    this._parent = parent;

    $(window).resize(() => this.resizeCharts());
    $(window).on(
      "scxFullscreenChanged",
      this,
      (e: JQueryEventObject, c: Chart) => this._fullScreenChange(e, c)
    );
    $(window).on(
      "scxFullWindowChanged",
      this,
      (e: JQueryEventObject, c: Chart) => this._fullWindowChange(e, c)
    );
  }

  addChart(config?: IChartConfig): Chart {
    let self = this;
    let chart;
    let chartContainer = $(
      `<div class="${Class.CHART_CONTAINER} ${Class.NON_ACTIVE_BORDER}"></div>`
    ).appendTo(this._parent);
    if (config) {
      chart = chartContainer.StockChartX(config);
    } else {
      chart = chartContainer.StockChartX({
        width: 0,
        height: 0,
        showToolbar: false
      });
    }

    let defaultKeyboardEvents = chart.keyboardEventsEnabled,
      defaultMouseEvents = chart.mouseEventsEnabled,
      chartKeyboardEventTarget: object,
      keyboardEventValue: boolean,
      chartMouseEventTarget: object,
      mouseEventValue: boolean;

    chart.keyboardEventsEnabled = false;
    chart.mouseEventsEnabled = false;

    chart
      .on(
        ChartEvent.ENABLE_KEYBOARD_EVENTS_CHANGED + EVENT_SUFFIX,
        (event: IValueChangedEvent) => {
          chartKeyboardEventTarget = event.target;
          keyboardEventValue = event.value;
        }
      )
      .on(
        ChartEvent.ENABLE_MOUSE_EVENTS_CHANGED + EVENT_SUFFIX,
        (event: IValueChangedEvent) => {
          chartMouseEventTarget = event.target;
          mouseEventValue = event.value;
        }
      );

    if (!this._toolbar) {
      this._toolbar = new Toolbar({
        parent: this._parent.parent(),
        chart
      });
      chartContainer.removeClass(Class.NON_ACTIVE_BORDER);
      chartContainer.addClass(Class.ACTIVE_BORDER);
      if (chart === chartKeyboardEventTarget)
        defaultKeyboardEvents = keyboardEventValue;
      if (defaultKeyboardEvents) chart.keyboardEventsEnabled = true;

      if (chart === chartMouseEventTarget) defaultMouseEvents = mouseEventValue;
      if (defaultMouseEvents) chart.mouseEventsEnabled = true;
    }

    chartContainer.mousedown((event: JQueryEventObject) => {
      let target = $(event.currentTarget);

      for (let item of this._chartsItems) {
        item.chart.off(EVENT_SUFFIX);
        if (target.is(item.container)) {
          item.container.addClass(Class.ACTIVE_BORDER);
          item.container.removeClass(Class.NON_ACTIVE_BORDER);
          if (item.chart === chartKeyboardEventTarget)
            item.keyboardEventsEnabled = keyboardEventValue;
          if (item.keyboardEventsEnabled)
            item.chart.keyboardEventsEnabled = true;

          if (item.chart === chartMouseEventTarget)
            item.mouseEventsEnabled = mouseEventValue;
          if (item.mouseEventsEnabled) item.chart.mouseEventsEnabled = true;
          self._toolbar.chart = item.chart;
        } else {
          item.container.removeClass(Class.ACTIVE_BORDER);
          item.container.addClass(Class.NON_ACTIVE_BORDER);
          if (item.chart === chartKeyboardEventTarget)
            item.keyboardEventsEnabled = keyboardEventValue;
          if (item.keyboardEventsEnabled)
            item.chart.keyboardEventsEnabled = false;

          if (item.chart === chartMouseEventTarget)
            item.mouseEventsEnabled = mouseEventValue;
          if (item.mouseEventsEnabled) item.chart.mouseEventsEnabled = false;
        }
        item.chart
          .on(
            ChartEvent.ENABLE_KEYBOARD_EVENTS_CHANGED + EVENT_SUFFIX,
            (evt: IValueChangedEvent) => {
              chartKeyboardEventTarget = evt.target;
              keyboardEventValue = evt.value;
            }
          )
          .on(
            ChartEvent.ENABLE_MOUSE_EVENTS_CHANGED + EVENT_SUFFIX,
            (evt: IValueChangedEvent) => {
              chartMouseEventTarget = evt.target;
              mouseEventValue = evt.value;
            }
          );
      }
    });

    this._chartsItems.push({
      container: chartContainer,
      chart,
      keyboardEventsEnabled: defaultKeyboardEvents,
      mouseEventsEnabled: defaultMouseEvents
    });

    chartContainer.css("z-index", "0");
    chartContainer.css("float", "left");
    this._parent.css({
      top: 0,
      left: 0,
      height: "100%",
      width: "100%",
      display: "block",
      clear: "both",
      overflow: "hidden"
    });
    this._parent.parent().css({
      height: "100%",
      width: "100%",
      clear: "both",
      overflow: "hidden"
    });

    return chart;
  }

  resizeCharts() {
    if (this._isFullWindowMode || this._isFullScreenMode) return;

    switch (this._chartsItems.length) {
      case 1:
        this._maxChartsCountX = 1;
        this._maxChartsCountY = 1;
        break;
      case 2:
        this._maxChartsCountX = 1;
        this._maxChartsCountY = 2;
        break;
      case 3:
        this._maxChartsCountX = 1;
        this._maxChartsCountY = 3;
        break;
      default:
        this._maxChartsCountX = 2;
        this._maxChartsCountY = 2;
        break;
    }

    let parent = this._parent.parent().parent(), // root container
      height = parent.height() / this._maxChartsCountY - 2, // 2 is margin at each side
      width = parent.width() / this._maxChartsCountX - 2; // 2 is margin at each side

    for (let chartItem of this._chartsItems) {
      chartItem.chart.size = {
        width: width - this.containerDisplacement.width,
        height: height - this.containerDisplacement.height - 25 // minus scrollBar height
      };

      chartItem.chart.setNeedsAutoScale();
      chartItem.chart.setNeedsUpdate();
    }

    this._parent
      .parent()
      .width(parent.width())
      .height(parent.height()); // FIX issue with jump of blocks
  }

  private _fullScreenChange(e: JQueryEventObject, chart: Chart) {
    if (chart.windowMode === WindowMode.FULL_SCREEN) {
      this.toolbar.prependTo(chart.container);

      this.parent
        .parent()
        .parent()
        .css({
          width: window.outerWidth,
          height: window.outerHeight
        });
      this._isFullScreenMode = true;
    } else {
      if (!this._isFullWindowMode) {
        this.toolbar.prependTo(this._parent.parent());
      }
      this.parent
        .parent()
        .parent()
        .css({
          width: "100%",
          height: "100%"
        });
      this._isFullScreenMode = false;
    }

    this.resizeCharts();
  }

  private _fullWindowChange(e: JQueryEventObject, chart: Chart) {
    switch (chart.windowMode) {
      case WindowMode.FULL_WINDOW:
      case WindowMode.FULL_SCREEN:
        this._isFullWindowMode = true;
        this.toolbar.prependTo(chart.container);
        this.containerDisplacement.width = 6;
        this.containerDisplacement.height = 42;
        chart.container.css({
          "z-index": "1",
          position: "absolute",
          "background-color": $("body").css("background-color")
        });

        this._parent.parent().css({ width: "100%", height: "100%" });

        chart.size = {
          width: this._parent.width() - this.containerDisplacement.width,
          height: this._parent.height() - this.containerDisplacement.height - 25 // minus scrollBar height
        };

        chart.setNeedsAutoScale();
        chart.setNeedsUpdate();

        break;
      default:
        this._isFullWindowMode = false;
        if (!this._isFullScreenMode) {
          this.toolbar.prependTo(this._parent.parent());
          chart.container.css("background-color", "transparent");
        }

        this.containerDisplacement.width = 2;
        this.containerDisplacement.height = 20;
        chart.container.css("z-index", "0");
        chart.container.css("position", "relative");

        break;
    }

    this.resizeCharts();
  }
}
