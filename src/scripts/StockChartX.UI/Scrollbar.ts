import { IValueChangedEvent } from "../StockChartX/index";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

import DraggableEventUIParams = JQueryUI.DraggableEventUIParams;
// import { Chart } from "../StockChartX/index";
import { ChartEvent } from "../StockChartX/index";
import { HtmlLoader } from "./index";
import { Chart } from "../StockChartX/index";
// import { $ } from "../external/typescript/jquery";
const $ = window.jQuery;

// region Interfaces

export interface IScrollbarConfig {
  parent: JQuery;
  chart?: Chart;
}

const Classes = {
  SCX_SCROLLBAR: ".scxScrollbar",
  SCX_SCROLLING_PANEL: ".scxScrollingPanel",
  SCX_LEFT_DELIMITER: ".scxLeftSideDelimiter",
  SCX_RIGHT_DELIMITER: ".scxRightSideDelimiter",
  SCX_LEFT_RESIZE_DELIMITER: ".scxLeftSideResizeDelimiter",
  SCX_RIGHT_RESIZE_DELIMITER: ".scxRightSideResizeDelimiter"
};

export class Scrollbar {
  private _scrollbar: JQuery;
  private _scrollingPanel: JQuery;
  private _scrollingPanelMinWidth = 20;
  private _scrollingPanelWidth = 0;

  private _chart: Chart;
  get chart(): Chart {
    return this._chart;
  }

  set chart(value: Chart) {
    if (this._chart !== value) {
      this._unsubscribeEvents();
      this._chart = value;
      this._subscribeEvents();
    }
  }

  get outerHeight(): number {
    return this._scrollbar ? this._scrollbar.outerHeight() : 0;
  }

  // endregion

  constructor(config: IScrollbarConfig) {
    HtmlLoader.loadHtml("Scrollbar.html", (html: string) => {
      this._init(html, config);
    });
  }

  private _init(html: string, config: IScrollbarConfig): void {
    let chart = (this._chart = config.chart);
    if (chart == null || !chart.container) return;

    this._scrollbar = $(html).insertAfter(chart.rootDiv);
    this._scrollingPanel = this._scrollbar.find(Classes.SCX_SCROLLING_PANEL);

    this._scrollingPanel.draggable({
      drag: (event: Event, params: DraggableEventUIParams) =>
        this._update(params.position.left),
      stop: (event: Event, params: DraggableEventUIParams) =>
        this._update(params.position.left),
      axis: "x",
      containment: this._scrollingPanel.parent()
    });

    this._scrollingPanel.resizable(<Resizable.Options>{
      container: chart.container,
      minWidth: this._scrollingPanelMinWidth,
      direction: "horizontal",
      start: () => {
        this._scrollingPanel.draggable({ disabled: true });
      },
      resize: () => {
        this._update(this._scrollingPanel.position().left);
      },
      stop: () => {
        this._scrollingPanel.draggable({ disabled: false });
      }
    });

    this._subscribeEvents();

    if (chart) chart.fireValueChanged(ChartEvent.SCROLLBAR_LOADED, this);
  }

  private _subscribeEvents() {
    let chart = this.chart;
    if (!chart) return;

    chart.on(ChartEvent.WINDOW_MODE_CHANGED, (event: IValueChangedEvent) => {
      this.adjustDimensions();
    });
  }

  private _unsubscribeEvents() {
    if (this._chart) {
      this._chart.off(ChartEvent.WINDOW_MODE_CHANGED);
    }
  }

  adjustDimensions() {
    if (this._chart == null) return;

    let dataRange = this._chart.visibleDataRange();
    let firstVisibleDataRecord = dataRange.firstVisibleDataRecord;
    let lastVisibleDataRecord = dataRange.lastVisibleDataRecord;

    let recordsCount = this._chart.recordCount;
    let scrollbarWidth = this._scrollbar.width(); // this._scrollbar.width();

    let widthRatio =
      ((lastVisibleDataRecord - firstVisibleDataRecord) / recordsCount) * 100;
    this._scrollingPanelWidth = (scrollbarWidth * widthRatio) / 100;

    let leftPositionRatio =
      (this._chart.firstVisibleRecord / recordsCount) * 100;
    let panelLeftPosition = (scrollbarWidth * leftPositionRatio) / 100;

    if (
      panelLeftPosition + this._scrollingPanelMinWidth >=
      this._scrollbar.width()
    ) {
      panelLeftPosition = scrollbarWidth - this._scrollingPanelMinWidth;
    }

    this._scrollingPanel.css({
      left: panelLeftPosition,
      maxWidth: this._scrollbar.width()
    });
    // WARNING: Don't using .css('width') to change of size the element!
    this._scrollingPanel.width(
      Math.max(this._scrollingPanelWidth, this._scrollingPanelMinWidth)
    );
  }

  private _update(leftPosition: number) {
    if (this._chart == null) return undefined;

    let scrollbarWidth = this._scrollbar.width();
    // let rightPosition = leftPosition + this._scrollingPanelWidth;
    let rightPosition = leftPosition + this._scrollingPanel.width();

    let firstRecordRatio = (leftPosition / scrollbarWidth) * 100;
    let lastRecordRatio = (rightPosition / scrollbarWidth) * 100;

    let recordsCount = this._chart.recordCount;

    let newFirstRecord = (firstRecordRatio * recordsCount) / 100;
    let newLastRecord = (lastRecordRatio * recordsCount) / 100;

    if (newFirstRecord >= newLastRecord) return false;

    this._chart.recordRange(newFirstRecord, newLastRecord);

    this.chart.dateScale.requestMoreHistoryIfNeed();

    this._chartUpdate();
  }

  private _chartUpdate() {
    this._chart.setNeedsUpdate(true);
  }

  appendTo(container: JQuery) {
    if (!container) return;

    this._scrollbar.detach();
    this._scrollbar = this._scrollbar.insertAfter(this.chart.rootDiv);
  }
}
