
import { Chart } from "../StockChartX/index";
import { IDestroyable } from "../StockChartX/index";
import { HtmlLoader } from "./index";
import { HtmlUtil } from "../StockChartX/index";

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

export interface IChartNavigationConfig {
  target: JQuery;
  chart: Chart;
}

export class ChartNavigation implements IDestroyable {
  // region Properties

  private container: JQuery;
  private chart: Chart;
  private dateScaleContainer: JQuery;

  private _visible = true;

  get visible(): boolean {
    return this._visible;
  }
  set visible(value: boolean) {
    this._visible = value;
    this._updateVisibility();
  }

  // endregion

  constructor(config: IChartNavigationConfig) {
    HtmlLoader.loadHtml("Navigation.html", (html: string) => {
      this._init(html, config);
    });
  }

  private _init(html: string, config: IChartNavigationConfig): void {
    this.container = $(html).appendTo(config.target);
    let chart = (this.chart = config.chart);

    this.container.find(".scxNavigation-btn-scrollLeft").on("click", () => {
      chart.scrollOnPixels(chart.size.width / 5);
      chart.setNeedsUpdate(true);
    });
    this.container.find(".scxNavigation-btn-scrollRight").on("click", () => {
      chart.scrollOnPixels(-chart.size.width / 5);
      chart.setNeedsUpdate(true);
    });
    this.container.find(".scxNavigation-btn-zoomIn").on("click", () => {
      chart.zoomOnPixels(chart.size.width / 5);
      chart.setNeedsUpdate(true);
    });
    this.container.find(".scxNavigation-btn-zoomOut").on("click", () => {
      chart.zoomOnPixels(-chart.size.width / 5);
      chart.setNeedsUpdate(true);
    });
    this.container.find(".scxNavigation-btn-scrollToFirst").on("click", () => {
      let records = this.chart.lastVisibleRecord - chart.firstVisibleRecord;
      if (records > 1) {
        chart.firstVisibleRecord = 0;
        chart.lastVisibleRecord = Math.min(records, chart.recordCount - 1);
        chart.setNeedsUpdate(true);
      }
    });
    this.container.find(".scxNavigation-btn-scrollToLast").on("click", () => {
      let recordCount = chart.recordCount;
      if (recordCount > 0) {
        let firstRec = chart.firstVisibleRecord;
        let lastRec = chart.lastVisibleRecord;

        chart.lastVisibleRecord = recordCount - 1;
        chart.firstVisibleRecord = Math.max(
          recordCount - (lastRec - firstRec + 1),
          0
        );
        chart.setNeedsUpdate(true);
      }
    });
    this._updateVisibility();
  }

  private _updateVisibility() {
    if (this.container) HtmlUtil.setVisibility(this.container, this.visible);
  }

  public draw() {
    if (!this.dateScaleContainer) {
      this.dateScaleContainer =
        this.chart && this.chart.rootDiv.find(".scxBottomDateScale");
    }

    if (!this.dateScaleContainer) return;

    this.container.css("bottom", this.dateScaleContainer.outerHeight(true));
  }

  // region IDestroyable members

  destroy() {
    this.chart = null;
  }

  // endregion
}
