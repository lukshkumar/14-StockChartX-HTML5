import {
  IPriceStyleDefaults,
  IPriceStyleConfig,
  IPriceStyleOptions,
  IPriceStyleState
} from "../index";
import { PriceStyle } from "../index";
import { BarConverter } from "../index";
import { DataSeriesSuffix } from "../index";
import { JsUtil } from "../index";
import { Plot } from "../index";
import { BarPlot } from "../index";
import { PlotType } from "../Utils/PlotType";
import { PriceStyleClassNames } from "../Utils/PriceStyleClassNames";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

// @if SCX_LICENSE = 'full'

"use strict";

// region Interfaces

export interface ILineBreakPriceStyleDefaults extends IPriceStyleDefaults {
  lines: number;
}

export interface ILineBreakPriceStyleConfig extends IPriceStyleConfig {
  options?: ILineBreakPriceStyleOptions;
}

export interface ILineBreakPriceStyleOptions extends IPriceStyleOptions {
  lines?: number;
}

export interface ILineBreakPriceStyleState extends IPriceStyleState {
  options: ILineBreakPriceStyleOptions;
}

// endregion

/**
 * Represents line break price style.
 * @constructor StockChartX.LineBreakPriceStyle
 * @augments StockChartX.PriceStyle
 * @memberOf StockChartX
 */
export class LineBreakPriceStyle extends PriceStyle {
  // region Static properties

  static readonly defaults: ILineBreakPriceStyleDefaults = {
    lines: 3
  };

  static get className(): string {
    return PriceStyleClassNames.LineBreakPriceStyle;
  }

  // endregion

  /**
   * The number of lines.
   * @name lines
   * @type {number}
   * @memberOf StockChartX.LineBreakPriceStyle#
   */
  get lines(): number {
    return (
      (<ILineBreakPriceStyleOptions>this._options).lines ||
      LineBreakPriceStyle.defaults.lines
    );
  }

  set lines(value: number) {
    if (!JsUtil.isFiniteNumber(value) || value <= 0)
      throw new Error("Lines count must be a number greater than 0.");

    (<ILineBreakPriceStyleOptions>this._options).lines = value;
  }

  constructor(config?: ILineBreakPriceStyleConfig) {
    super(config);
  }

  // endregion

  /**
   * @inheritDoc
   */
  createPlot(): Plot {
    return new BarPlot({
      plotStyle: BarPlot.Style.LINE_BREAK,
      plotType: PlotType.PRICE_STYLE
    });
  }

  /**
   * @inheritDoc
   */
  dataSeriesSuffix(): string {
    return DataSeriesSuffix.LINE_BREAK;
  }

  /**
   * @inheritDoc
   */
  primaryDataSeriesSuffix(suffix: string): string {
    let psSuffix = super.primaryDataSeriesSuffix(suffix);
    if (psSuffix) return psSuffix;

    switch (suffix) {
      case DataSeriesSuffix.DATE:
      case DataSeriesSuffix.VOLUME:
        return this.dataSeriesSuffix();
      default:
        return "";
    }
  }

  /**
   * @inheritDoc
   */
  updateComputedDataSeries() {
    let dataManager = this.chart.dataManager,
      lineBreak = dataManager.barDataSeries(DataSeriesSuffix.LINE_BREAK, true);

    BarConverter.convertToLineBreak(
      dataManager.barDataSeries(),
      this.lines,
      lineBreak
    );
  }
}

PriceStyle.register(LineBreakPriceStyle);

// @endif
