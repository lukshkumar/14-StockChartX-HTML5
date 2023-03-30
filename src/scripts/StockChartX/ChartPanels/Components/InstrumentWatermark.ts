import { ITextTheme } from "../../index";
import { ChartPanelWatermark } from "../../index";
import { HtmlUtil } from "../../index";
import { ChartEvent } from "../../index";

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

export interface IInstrumentWatermarkTheme {
  symbol: ITextTheme;
  details: ITextTheme;
}

// endregion

// region Declarations

const Class = {
  WATERMARK: "scxWatermark",
  WATERMARK_CONTENT: "scxWatermarkContent",
  WATERMARK_SYMBOL: "scxWatermarkSymbol",
  WATERMARK_INFO: "scxWatermarkInfo"
};

const EventSuffix = ".scxInstrumentWatermark";

// endregion

export class InstrumentWatermark extends ChartPanelWatermark {
  // region Properties

  theme: IInstrumentWatermarkTheme;

  actualTheme(): IInstrumentWatermarkTheme {
    return this.theme || this.chart.theme.chart.instrumentWatermark;
  }

  // endregion

  /**
   * @inheritDoc
   */
  protected _subscribe() {
    this.chart
      .on(
        ChartEvent.INSTRUMENT_CHANGED + EventSuffix,
        () => {
          this.applyText();
        },
        this
      )
      .on(
        ChartEvent.SHOW_INSTRUMENT_WATERMARK_CHANGED + EventSuffix,
        () => {
          this.update();
        },
        this
      );
  }

  /**
   * @inheritDoc
   */
  protected _unsubscribe() {
    let chart = this.chart;
    if (chart) chart.off(EventSuffix, this);
  }

  /**
   * @inheritDoc
   */
  protected _createContainer(): JQuery {
    let container = super._createContainer();

    let contentDiv = container.scxAppend("div", Class.WATERMARK_CONTENT);
    contentDiv.scxAppend("div", Class.WATERMARK_SYMBOL);
    contentDiv.scxAppend("div", Class.WATERMARK_INFO);

    return container;
  }

  /**
   * @inheritDoc
   */
  update() {
    let isVisible = this.chart.showInstrumentWatermark;

    HtmlUtil.setVisibility(this.container, isVisible);
    if (isVisible) {
      this.applyText();

      super.update();
    }
  }

  /**
   * @inheritDoc
   */
  applyText() {
    let container = this.container;
    if (!container) return;

    let instrument = this.chart.instrument;
    if (!instrument) return;

    container.find("." + Class.WATERMARK_SYMBOL).text(instrument.symbol);

    let info = instrument.company;
    if (instrument.exchange) info += " - " + instrument.exchange;
    container.find("." + Class.WATERMARK_INFO).text(info);
  }

  /**
   * @inheritDoc
   */
  applyTheme() {
    let container = this.container;
    if (!container) return;

    let theme = this.chart.theme.chart.instrumentWatermark;

    container.find("." + Class.WATERMARK_SYMBOL).scxTextStyle(theme.symbol);
    container.find("." + Class.WATERMARK_INFO).scxTextStyle(theme.details);
  }
}
