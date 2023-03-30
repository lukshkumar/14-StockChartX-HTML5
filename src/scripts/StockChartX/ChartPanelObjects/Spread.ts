import { ISpreadTheme } from "../index";
import {
  ChartPanelObject,
  IChartPanelObjectConfig,
  IChartPanelObject,
  IChartPanelObjectOptions
} from "../index";
import { HtmlUtil } from "../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

// region Interfaces

export interface ISpreadConfig extends IChartPanelObjectConfig {
  ask?: number;
  bid?: number;
  theme?: ISpreadTheme;
}

export interface ISpread extends IChartPanelObject {
  ask: number;
  bid: number;
  theme: ISpreadTheme;
}

export interface ISpreadOptions extends IChartPanelObjectOptions {
  ask?: number;
  bid?: number;
  theme?: ISpreadTheme;
}

// endregion

/**
 * Represents spread
 * @constructor StockChartX.Spread
 * @augments StockChartX.ChartPanelObject
 */
export class Spread extends ChartPanelObject implements ISpread {
  // region Properties

  /**
   * Ask line value.
   * @name ask
   * @type {number}
   * @memberOf StockChartX.Spread#
   */
  get ask(): number {
    return (<ISpreadOptions>this._options).ask;
  }

  set ask(value: number) {
    this._setOption("ask", value);
  }

  /**
   * Bid line value.
   * @name ask
   * @type {number}
   * @memberOf StockChartX.Spread#
   */
  get bid(): number {
    return (<ISpreadOptions>this._options).bid;
  }

  set bid(value: number) {
    this._setOption("bid", value);
  }

  /**
   * Gets/Sets theme.
   * @name theme
   * @type {StockChartX.ISpreadTheme}
   * @memberOf StockChartX.Spread#
   */
  get theme(): ISpreadTheme {
    return (<ISpreadOptions>this._options).theme;
  }

  set theme(value: ISpreadTheme) {
    this._setOption("theme", value);
  }

  // endregion

  constructor(config?: ISpreadConfig) {
    super(config && { options: <IChartPanelObjectOptions>config });
  }

  /**
   * @inheritDoc
   */
  draw() {
    let projection = this.projection,
      context = this.context,
      frame = this.chartPanel.contentFrame,
      theme = this.theme || this.chart.theme.spread;

    if (this.ask) {
      let askY = projection.yByValue(this.ask);

      context.beginPath();
      context.moveTo(frame.left, askY);
      context.lineTo(frame.right, askY);
      context.scxStroke(theme.ask.line);
    }

    if (this.bid) {
      let bidY = projection.yByValue(this.bid);

      context.beginPath();
      context.moveTo(frame.left, bidY);
      context.lineTo(frame.right, bidY);
      context.scxStroke(theme.bid.line);
    }
  }

  /**
   * @inheritdoc
   */
  drawValueMarkers() {
    let marker = this.chart.valueMarker,
      theme = this.theme || this.chart.theme.spread;

    let drawMarker = (value: number, color: string) => {
      if (!value) return;

      marker.theme.fill.fillColor = color;
      marker.theme.text.fillColor = HtmlUtil.isDarkColor(color)
        ? "white"
        : "black";
      marker.draw(value, this.panelValueScale);
    };

    drawMarker(this.ask, theme.ask.valueMarker.fill.fillColor);
    drawMarker(this.bid, theme.bid.valueMarker.fill.fillColor);
  }
}
