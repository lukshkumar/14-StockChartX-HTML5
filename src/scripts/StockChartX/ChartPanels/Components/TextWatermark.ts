import {
  IChartPanelHtmlComponentConfig,
  IChartPanelWatermarkTheme,
  ChartPanelWatermark
} from "../../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

"use strict";

// region Interfaces

export interface ITextWatermarkConfig extends IChartPanelHtmlComponentConfig {
  text?: string;
  theme?: ITextWatermarkTheme;
}

export interface ITextWatermarkTheme extends IChartPanelWatermarkTheme {}

// endregion

export class TextWatermark extends ChartPanelWatermark {
  // region Properties

  text: string;
  theme: ITextWatermarkTheme;

  get actualTheme(): ITextWatermarkTheme {
    return this.theme || this.chartPanel.actualTheme.watermark;
  }

  // endregion

  constructor(config?: ITextWatermarkConfig) {
    super(config);

    if (config) {
      this.text = config.text;
      this.theme = config.theme;
    }
  }

  /**
   * @inheritDoc
   */
  update() {
    this.applyText();

    super.update();
  }

  /**
   * @inheritDoc
   */
  applyText() {
    let container = this.container;
    if (!container) return;

    container.text(this.text);
  }

  /**
   * @inheritDoc
   */
  applyTheme() {
    let container = this.container;
    if (container) {
      container.scxTextStyle(this.actualTheme.text);
    }
  }
}
