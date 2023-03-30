import {
  IHtmlComponent,
  HtmlComponent
} from "../../index";
import { ChartPanel } from "../../index";
import { Chart } from "../../index";

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

export interface IChartPanelHtmlComponent extends IHtmlComponent {
  chartPanel: ChartPanel;
}

export interface IChartPanelHtmlComponentConfig {
  chartPanel?: ChartPanel;
}

// endregion

/**
 * Represents html container component on the chart panel.
 * @constructor StockChartX.ChartPanelHtmlComponent
 * @augments StockChartX.HtmlComponent
 * @abstract
 */
export abstract class ChartPanelHtmlComponent extends HtmlComponent
  implements IChartPanelHtmlComponent {
  // region Properties

  /**
   * @internal
   */
  private _panel: ChartPanel;

  /**
   * Gets/Sets parent chart panel.
   * @name chartPanel
   * @type {StockChartX.ChartPanel}
   * @memberOf StockChartX.ChartPanelHtmlComponent#
   */
  get chartPanel(): ChartPanel {
    return this._panel;
  }

  set chartPanel(value: ChartPanel) {
    if (this._panel !== value) {
      this._onChartPanelChanging();
      this._panel = value;
      this._onChartPanelChanged();
    }
  }

  /**
   * Gets parent chart.
   * @name chart
   * @type {StockChartX.Chart}
   * @readonly
   * @memberOf StockChartX.ChartPanelHtmlComponent#
   */
  get chart(): Chart {
    return this._panel && this._panel.chart;
  }

  // endregion

  constructor(config?: IChartPanelHtmlComponentConfig) {
    super();

    if (config) this.chartPanel = config.chartPanel;
  }

  protected _subscribe?();

  protected _unsubscribe?();

  protected _onChartPanelChanging() {
    if (this._unsubscribe) this._unsubscribe();

    this._removeContainer();
  }

  protected _onChartPanelChanged() {
    if (this._subscribe) this._subscribe();
  }

  // region IDestroyable

  /**
   * @inheritDoc
   */
  destroy() {
    if (this._unsubscribe) this._unsubscribe();

    super.destroy();
  }

  // endregion
}
