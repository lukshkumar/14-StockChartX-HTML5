/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { HtmlUtil } from "../index";
import { ITextTheme } from "../index";

"use strict";

const $ = window.jQuery;

/**
 * @internal
 */
let _context: CanvasRenderingContext2D;

/**
 * Represents dummy canvas context.
 * @namespace
 * @memberOf StockChartX
 */
export class DummyCanvasContext {
  /**
   * Canvas rendering context.
   * @name context
   * @type {CanvasRenderingContext2D}
   * @memberOf StockChartX.DummyCanvasContext
   */
  static get context(): CanvasRenderingContext2D {
    if (!_context)
      _context = (<HTMLCanvasElement>$("<canvas></canvas>")[0]).getContext(
        "2d"
      );

    return _context;
  }

  /**
   * Applies text theme to the context.
   * @method applyTextTheme
   * @param {StockChartX.TextTheme} theme The text theme.
   * @memberOf StockChartX.DummyCanvasContext
   */
  static applyTextTheme(theme: ITextTheme) {
    this.context.scxApplyTextTheme(theme);
  }

  /**
   * Returns width that is necessary to render given text.
   * @method textWidth
   * @param {string} text The text to be measured.
   * @param {StockChartX.TextTheme} [textTheme] The text theme.
   * @returns {Number}
   * @memberOf StockChartX.DummyCanvasContext
   */
  static textWidth(text: string, textTheme?: ITextTheme): number {
    let context = this.context;

    if (textTheme) context.scxApplyTextTheme(textTheme);

    return context.measureText(text).width;
  }

  /**
   * Returns text size that is required to render text using a given theme.
   * @method measureText
   * @param {String} text The text to be measured.
   * @param {StockChartX.TextTheme} [textTheme] The text theme.
   * @returns {StockChartX~Size}
   * @memberOf StockChartX.DummyCanvasContext
   */
  static measureText(text: string, textTheme: ITextTheme) {
    return {
      width: this.textWidth(text, textTheme),
      height: HtmlUtil.getFontSize(textTheme) + 1
    };
  }
}
