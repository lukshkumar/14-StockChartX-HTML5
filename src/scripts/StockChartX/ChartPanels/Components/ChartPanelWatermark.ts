/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */
import { ITextTheme } from "../../index";
import {
  IChartPanelHtmlComponent,
  ChartPanelHtmlComponent
} from "../../index";
"use strict";

// region Interfaces

export interface IChartPanelWatermarkTheme {
  text: ITextTheme;
}

export interface IChartPanelWatermark extends IChartPanelHtmlComponent {}

// endregion

// region Declarations

const Class = {
  WATERMARK: "scxWatermark"
};

// endregion

/**
 * Represents abstract chart panel watermark.
 * @constructor StockChartX.ChartPanelWatermark
 * @augments StockChartX.ChartPanelHtmlComponent
 * @abstract
 */
export abstract class ChartPanelWatermark extends ChartPanelHtmlComponent
  implements IChartPanelWatermark {
  /**
   * @inheritDoc
   */
  protected _createContainer(): JQuery {
    return this.chartPanel.container.scxAppend("div", Class.WATERMARK);
  }
}
