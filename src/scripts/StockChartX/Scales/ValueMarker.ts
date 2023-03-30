import { JsUtil } from "../index";
import { IFillTheme } from "../index";
import { IStrokeTheme } from "../index";
import { ITextTheme } from "../index";
import { ChartPoint } from "../index";
import { ChartPanelValueScale } from "../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

/**
 * The value marker theme structure.
 * @typedef {object} ValueMarkerTheme
 * @type {object}
 * @property {StockChartX.StrokeTheme} [line] The border line theme.
 * @property {StockChartX.FillTheme} fill The fill theme.
 * @property {StockChartX.TextTheme} text The text theme.
 * @memberOf StockChartX
 * @example
 * // Value marker with white background
 * var theme = {
 *   fill: {
 *     fillColor: 'white'
 *   },
 *   text: {
 *     fontFamily: 'Calibri',
 *     fontSize: 12,
 *     fillColor: 'red'
 *   }
 * };
 */
"use strict";

// region Interfaces

export interface IValueMarker {
  textOffset: number;
  theme: IValueMarkerTheme;

  draw(
    value: number | ChartPoint,
    panelValueScale: ChartPanelValueScale,
    theme?: IValueMarkerTheme
  );
}

export interface IValueMarkerTheme {
  text: ITextTheme;
  line?: IStrokeTheme;
  fill: IFillTheme;
}

export interface IValueMarkerDefaults {
  textOffset: number;
}

// endregion

/**
 * Represents value marker on the value scale.
 * @constructor StockChartX.ValueMarker
 * @memberOf StockChartX
 */
export class ValueMarker implements IValueMarker {
  static defaults: IValueMarkerDefaults = {
    textOffset: 8
  };

  /**
   * @internal
   */
  private _textOffset: number;
  /**
   * The horizontal text offset.
   * @name textOffset
   * @type {number}
   * @memberOf StockChartX.ValueMarker#
   */
  get textOffset(): number {
    let offset = this._textOffset;

    return offset != null ? offset : ValueMarker.defaults.textOffset;
  }

  set textOffset(value: number) {
    if (value != null && JsUtil.isNegativeNumber(value))
      throw new Error("Text offset must be greater or equal to 0.");

    this._textOffset = value;
  }

  /**
   * @internal
   */
  private _theme: IValueMarkerTheme;
  /**
   * The value marker theme.
   * @name theme
   * @type {StockChartX.ValueMarkerTheme}
   * @memberOf StockChartX.ValueMarker#
   */
  get theme(): IValueMarkerTheme {
    return this._theme;
  }

  set theme(value: IValueMarkerTheme) {
    this._theme = value;
  }

  /**
   * Draws value marker.
   * @method draw
   * @param {number} value The value to draw.
   * @param {StockChartX.ChartPanelValueScale} panelValueScale The value scale to draw on.
   * @param {StockChartX.ValueMarkerTheme} [theme] The custom theme.
   * @memberOf StockChartX.ValueMarker#
   */
  draw(
    value: number,
    panelValueScale: ChartPanelValueScale,
    theme?: IValueMarkerTheme
  ) {
    let leftFrame = panelValueScale.leftFrame,
      rightFrame = panelValueScale.rightFrame;
    if (!leftFrame && !rightFrame) return;

    if (!theme) theme = this.theme;

    let context = panelValueScale.chartPanel.layer.context,
      text = panelValueScale.formatValue(value),
      y = panelValueScale.projection.yByValue(value),
      xTextOffset = this.textOffset,
      yOffset = theme.text.fontSize / 2 + 1;

    context.save();
    panelValueScale.clip();
    context.textBaseline = "middle";
    context.beginPath();

    if (leftFrame) {
      let right = leftFrame.right - 1;

      context.moveTo(right, y);
      context.lineTo(right - yOffset, y + yOffset);
      context.lineTo(leftFrame.left, y + yOffset);
      context.lineTo(leftFrame.left, y - yOffset);
      context.lineTo(right - yOffset, y - yOffset);
      context.closePath();
      context.scxFillStroke(theme.fill, theme.line);

      context.scxApplyTextTheme(theme.text);
      context.textAlign = "right";
      context.fillText(text, leftFrame.right - xTextOffset, y);
    }
    if (rightFrame) {
      let right = rightFrame.right - 1;

      context.moveTo(rightFrame.left, y);
      context.lineTo(rightFrame.left + yOffset, y - yOffset);
      context.lineTo(right, y - yOffset);
      context.lineTo(right, y + yOffset);
      context.lineTo(rightFrame.left + yOffset, y + yOffset);
      context.closePath();
      context.scxFillStroke(theme.fill, theme.line);

      context.scxApplyTextTheme(theme.text);
      context.textAlign = "left";
      context.fillText(text, rightFrame.left + xTextOffset, y);
    }

    context.restore();
  }
}
