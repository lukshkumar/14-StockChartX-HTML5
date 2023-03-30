import { TEXT_CHANGED } from "../../index";
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

import {
  Drawing,
  IDrawingConfig,
  IDrawingOptions,
  IDrawingDefaults,
  IDrawingState
} from "../../index";
import { ISize, IRect } from "../../index";
import { ITextTheme, IFillTheme, IStrokeTheme } from "../../index";
import { IPoint } from "../../index";
import { JsUtil } from "../../index";
import { ViewLoader } from "../../../StockChartX.UI/index";
import { DrawingSettingsDialog } from "../../../StockChartX.UI/index";
import { Geometry } from "../../index";
import { DummyCanvasContext } from "../../index";
import { DrawingClassNames } from "../utils";

export interface IBalloonDrawingConfig extends IDrawingConfig {
  text: string;
  corderRadius?: number;
  anchorSize?: number;
  theme?: IBalloonDrawingTheme;
}

export interface IBalloonDrawingOptions extends IDrawingOptions {
  text: string;
  cornerRadius: number;
  anchorSize: ISize;
}

export interface IBalloonDrawingTheme {
  text: ITextTheme;
  fill: IFillTheme;
  line: IStrokeTheme;
}

export interface IBalloonDrawingDefaults extends IDrawingDefaults {
  corderRadius: number;
  anchorSize: ISize;
}

/**
 * Represent balloon drawing
 * @param {object} [config] The configuration object.
 * @constructor StockChartX.BalloonDrawing
 * @augments StockChartX.Drawing
 * @example
 *  // Create balloon drawing.
 *  var balloon1 = new StockChartX.BalloonDrawing({
 *      point: {x: 10, y: 20},
 *      text: 'some text'
 *  });
 *
 *  // Create balloon drawing.
 *  var balloon2 = new StockChartX.BalloonDrawing({
 *      point: {record: 10, value: 20.0},
 *      text: 'some text'
 *  });
 *
 *  // Create balloon drawing with a custom theme.
 *  var balloon3 = new StockChartX.BalloonDrawing({
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
export class BalloonDrawing extends Drawing {
  static get className(): string {
    return DrawingClassNames.BalloonDrawing;
  }

  static defaults: IBalloonDrawingDefaults = {
    corderRadius: 5,
    anchorSize: { width: 10, height: 10 }
  };

  /**
   * @internal
   */
  private _lines = [];

  /**
   * @internal
   */
  private _leftTopPoint: IPoint;

  /**
   * @internal
   */
  private _rightBottomPoint: IPoint;

  /**
   * Gets/Sets string value.
   * @name text
   * @type {string}
   * @memberOf StockChartX.BalloonDrawing#
   */
  get text(): string {
    return (<IBalloonDrawingOptions>this._options).text || "";
  }

  set text(value: string) {
    value = value || "";
    this._setOption("text", value, TEXT_CHANGED);
    this._updateLines();
  }

  get cornerRadius(): number {
    return (
      (<IBalloonDrawingOptions>this._options).cornerRadius ||
      (<IBalloonDrawingDefaults>this._defaults).corderRadius ||
      BalloonDrawing.defaults.corderRadius
    );
  }

  set cornerRadius(value: number) {
    if (value && !JsUtil.isPositiveNumber(value))
      throw new Error("Corder radius must be a positive number.");

    (<IBalloonDrawingOptions>this._options).cornerRadius = value;
  }

  get anchorSize(): ISize {
    return (
      (<IBalloonDrawingOptions>this._options).anchorSize ||
      (<IBalloonDrawingDefaults>this._defaults).anchorSize ||
      BalloonDrawing.defaults.anchorSize
    );
  }

  set anchorSize(value: ISize) {
    (<IBalloonDrawingOptions>this._options).anchorSize = value;
  }

  constructor(config?: IBalloonDrawingConfig) {
    super(config);
    this._updateLines();
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
    if (!this._leftTopPoint) return null;

    let point = this.cartesianPoint(0);
    if (!point) return null;

    let left = this._leftTopPoint.x,
      top = this._leftTopPoint.y,
      width = Math.abs(this._rightBottomPoint.x - left),
      height = Math.abs(this._rightBottomPoint.y - top);

    return {
      left,
      top,
      width,
      height
    };
  }

  _finishUserDrawing() {
    super._finishUserDrawing();

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

    let point = this.cartesianPoint(0);
    if (!point) return;

    let lines = this._lines;

    let longestLine = lines.reduce((left: string, right: string) =>
      left.length >= right.length ? left : right
    );
    let context = this.context,
      theme: IBalloonDrawingTheme = this.actualTheme,
      textTheme = theme.text,
      textSize = DummyCanvasContext.measureText(longestLine, theme.text),
      textHalfWidth = Math.ceil(textSize.width / 2),
      cornerRadius = this.cornerRadius,
      rectHalfWidth = textHalfWidth + cornerRadius,
      anchorWidth = Math.ceil(this.anchorSize.width / 2),
      anchorHeight = this.anchorSize.height,
      rectBottom = point.y - anchorHeight,
      rectTop = rectBottom - textSize.height * lines.length - anchorHeight;

    context.beginPath();

    context.moveTo(point.x, point.y);
    context.lineTo(point.x - anchorWidth, rectBottom);

    // bottom line
    context.lineTo(point.x - textHalfWidth, rectBottom);
    // bottom left corner
    let leftX = point.x - rectHalfWidth;
    context.quadraticCurveTo(
      leftX,
      rectBottom,
      leftX,
      rectBottom - cornerRadius
    );
    // left line
    context.lineTo(leftX, rectTop + cornerRadius);
    // top left corner
    context.quadraticCurveTo(leftX, rectTop, point.x - textHalfWidth, rectTop);
    // top line
    context.lineTo(point.x + textHalfWidth, rectTop);
    // top right corner
    let rightX = point.x + rectHalfWidth;
    context.quadraticCurveTo(rightX, rectTop, rightX, rectTop + cornerRadius);
    // right line
    context.lineTo(rightX, rectBottom - cornerRadius);
    // bottom right corner
    context.quadraticCurveTo(
      rightX,
      rectBottom,
      point.x + textHalfWidth,
      rectBottom
    );
    // bottom line
    context.lineTo(point.x + anchorWidth, rectBottom);
    context.closePath();
    context.scxFillStroke(theme.fill, theme.line);

    this._leftTopPoint = { x: leftX, y: rectTop };
    this._rightBottomPoint = { x: rightX, y: point.y };

    context.scxApplyTextTheme(theme.text);
    context.textBaseline = "middle";
    context.textAlign = "left";

    let y = Math.round(rectTop + (textSize.height * 2) / 3 + 1);
    for (let line of lines) {
      context.fillText(line, point.x - textHalfWidth, y);
      if (textTheme.decoration === "underline") {
        context.strokeStyle = textTheme.fillColor;
        context.beginPath();
        context.moveTo(
          point.x - textHalfWidth,
          y + (textSize.height * 5) / 9 - 1
        );
        context.lineTo(
          point.x + textHalfWidth,
          y + (textSize.height * 5) / 9 - 1
        );
        context.stroke();
      }
      y += textSize.height;
    }
    if (this.selected) {
      this._drawSelectionMarkers(point);
    }
  }

  /**
   * @internal
   */
  private _updateLines() {
    this._lines = this.text.split("\n");
  }
}

Drawing.register(BalloonDrawing);

// @endif
