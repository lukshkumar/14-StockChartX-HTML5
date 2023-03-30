import { Geometry } from "../../index";
import {
  Drawing,
  IDrawingConfig,
  IDrawingOptions,
  IDrawingState
} from "../../index";
import { ITextTheme } from "../../index";
import { IRect } from "../../index";
import { DummyCanvasContext } from "../../index";
import { DrawingSettingsDialog } from "../../../StockChartX.UI/index";
import { IPoint } from "../../index";
import { ViewLoader } from "../../../StockChartX.UI/index";
import { DrawingClassNames } from "../utils";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

// @if SCX_LICENSE != 'free'

"use strict";

export interface ITextDrawingConfig extends IDrawingConfig {
  text: string;
  theme?: ITextDrawingTheme;
}

export interface ITextDrawingOptions extends IDrawingOptions {
  text: string;
}

export interface ITextDrawingTheme {
  text: ITextTheme;
}

/**
 * Drawing events enumeration values.
 * @name DrawingEvent
 * @enum {string}
 * @property {string} TEXT_CHANGED Text changed
 * @readonly
 * @memberOf StockChartX
 */
export const TEXT_CHANGED = "drawingTextChanged";

/**
 * Represent text drawing
 * @param {object} [config] The configuration object.
 * @constructor StockChartX.TextDrawing
 * @augments StockChartX.Drawing
 * @example
 *  // Create text drawing.
 *  var text1 = new StockChartX.TextDrawing({
 *      point: {x: 10, y: 20},
 *      text: 'some text'
 *  });
 *
 *  // Create text drawing.
 *  var text2 = new StockChartX.TextDrawing({
 *      point: {record: 10, value: 20.0},
 *      text: 'some text'
 *  });
 *
 *  // Create text drawing with a custom theme.
 *  var text3 = new StockChartX.TextDrawing({
 *      point: {record: 10, value: 20.0},
 *      theme: {
 *          text: {
 *              fontFamily: 'Arial'
 *              fontSize: 14,
 *              fillColor: 'white'
 *          },
 *      },
 *      text: 'some text'
 *  });
 */
export class TextDrawing extends Drawing {
  static get className(): string {
    return DrawingClassNames.TextDrawing;
  }

  /**
   * @internal
   */
  private _lines = [];

  /**
   * Gets/Sets string value.
   * @name text
   * @type {string}
   * @memberOf StockChartX.TextDrawing#
   */
  get text(): string {
    return (<ITextDrawingOptions>this._options).text || "";
  }

  set text(value: string) {
    value = value || "";
    this._setOption("text", value, TEXT_CHANGED);
    this._updateLines();
  }

  constructor(config?: ITextDrawingConfig) {
    super(config);
    this._updateLines();
  }

  /**
   * @internal
   */
  private _updateLines() {
    this._lines = this.text.split("\n");
  }

  /**
   * @inheritDoc
   */
  pointsLocalizationKeys(): string[] {
    let chartPointsNames = ["drawingSettingDialog.start"];

    return chartPointsNames;
  }

  /**
   * @inheritdoc
   */
  bounds(): IRect {
    let point = this.cartesianPoint(0);
    if (!point) return null;

    let longestLine = this._lines.reduce((left: string, right: string) =>
      left.length >= right.length ? left : right
    );
    let theme: ITextDrawingTheme = this.actualTheme;
    let size = DummyCanvasContext.measureText(longestLine, theme.text);

    return {
      left: point.x,
      top: point.y - size.height / 2,
      width: size.width,
      height: size.height * this._lines.length + this._lines.length
    };
  }

  _finishUserDrawing() {
    Drawing.prototype._finishUserDrawing.call(this);

    ViewLoader.drawingSettingsDialog((dialog: DrawingSettingsDialog) => {
      dialog.show({
        chart: this.chart,
        drawing: this,
        cancel: () => {
          this.chartPanel.removeDrawings(this);
        },
        always: () => {
          if (this.chartPanel) this.chartPanel.setNeedsUpdate();
        }
      });
    });
  }

  /**
   * @inheritdoc
   */
  hitTest(point: IPoint): boolean {
    if (!this.canHandleEvents) return false;

    let bounds = this.bounds();

    return bounds && Geometry.isPointInsideOrNearRect(point, bounds);
  }

  /**
   * inheritdoc
   * @param state
   */
  loadState(state: IDrawingState) {
    super.loadState(state);

    this._updateLines();
  }

  /**
   * @inheritdoc
   */
  draw() {
    if (!this.visible) return;

    let lines = this._lines;
    if (lines.length === 0) return;

    let point = this.cartesianPoint(0);
    if (!point) return;

    let context = this.context,
      theme: ITextDrawingTheme = this.actualTheme,
      textTheme = theme.text;

    context.scxApplyTextTheme(textTheme);
    context.textBaseline = "middle";
    context.textAlign = "left";

    let bounds = this.bounds(),
      lineHeight = DummyCanvasContext.measureText(lines[0], textTheme).height,
      halfLineHeight = Math.round(lineHeight / 2),
      y = point.y;

    for (let line of lines) {
      context.fillText(line, point.x, y);
      y += halfLineHeight;

      if (textTheme.decoration === "underline") {
        context.strokeStyle = textTheme.fillColor;
        context.beginPath();
        context.moveTo(point.x, y);
        context.lineTo(point.x + bounds.width, y);
        context.stroke();
      }
      y += halfLineHeight;
    }

    if (this.selected) {
      y = (point.y + (point.y + bounds.height - lineHeight)) / 2;

      let markers = [
        {
          x: point.x - 5,
          y
        },
        {
          x: point.x + bounds.width + 5,
          y
        }
      ];
      this._drawSelectionMarkers(markers);
    }
  }
}

Drawing.register(TextDrawing);

// @endif
