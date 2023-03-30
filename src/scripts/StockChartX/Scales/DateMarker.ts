import { ITextTheme, IFillTheme, IStrokeTheme } from "../index";
import { DateScale } from "../index";
import { DummyCanvasContext } from "../index";
import { DateScalePanel } from "../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

/**
 * The date marker theme structure.
 * @typedef {object} DateMarkerTheme
 * @type {object}
 * @property {StockChartX.StrokeTheme} [line] The border line theme.
 * @property {StockChartX.FillTheme} fill The fill theme.
 * @property {StockChartX.TextTheme} text The text theme.
 * @memberOf StockChartX
 * @example
 * // Date marker with white background
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

export interface IDateMarker {
  theme: IDateMarkerTheme;

  draw(date: Date, scale: DateScale);
}

export interface IDateMarkerTheme {
  text: ITextTheme;
  fill: IFillTheme;
  stroke: IStrokeTheme;
}

// endregion

/**
 * Represents marker on the date scale.
 * @constructor StockChartX.DateMarker
 * @memberOf StockChartX
 */
export class DateMarker implements IDateMarker {
  // region Properties

  /**
   * @internal
   */
  private _theme: IDateMarkerTheme;

  /**
   * The date marker theme.
   * @name theme
   * @type {StockChartX.DateMarkerTheme}
   * @memberOf StockChartX.DateMarker#
   */
  get theme(): IDateMarkerTheme {
    return this._theme;
  }

  set theme(value: IDateMarkerTheme) {
    this._theme = value;
  }

  // endregion

  draw(date: Date, scale: DateScale) {
    let dateText = scale.formatDate(date),
      theme = this.theme,
      size = DummyCanvasContext.measureText(dateText, theme.text),
      x = scale.projection.xByDate(date),
      xTextOffset = 5,
      xTextPoint = x - size.width / 2,
      xRectPoint = xTextPoint - xTextOffset,
      rectWidth = size.width + xTextOffset * 2;

    let drawMarkers = (scalePanel: DateScalePanel) => {
      let context = scalePanel.layer.context;

      context.textBaseline = "middle";
      context.beginPath();
      context.rect(xRectPoint, 0, rectWidth, scalePanel.frame.height);

      context.scxFillStroke(theme.fill, theme.stroke);
      context.scxFill(this.theme.fill);

      context.scxApplyTextTheme(theme.text);
      context.textAlign = "left";
      context.fillText(
        dateText,
        xTextPoint,
        scalePanel.frame.height - size.height
      );
    };

    if (scale.bottomPanelVisible) {
      drawMarkers(scale.bottomPanel);
    }
    if (scale.topPanelVisible) {
      drawMarkers(scale.topPanel);
    }
  }
}
