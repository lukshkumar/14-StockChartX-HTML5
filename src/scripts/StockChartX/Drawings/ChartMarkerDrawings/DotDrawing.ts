/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { IRect } from "../../index";
import {
  Drawing,
  IDrawingConfig,
  IDrawingOptions,
  IDrawingDefaults
} from "../../index";
import { JsUtil } from "../../index";
import { IPoint } from "../../index";
import { Geometry } from "../../index";
import { DrawingClassNames } from "../utils";

// @if SCX_LICENSE != 'free'

"use strict";

// region Interfaces

export interface IDotDrawingConfig extends IDrawingConfig {
  radius: number;
}

export interface IDotDrawingOptions extends IDrawingOptions {
  radius: number;
}

export interface IDotDrawingDefaults extends IDrawingDefaults {
  radius: number;
}

// endregion

// region Declarations

/**
 * Drawing events enumeration values.
 * @name DrawingEvent
 * @enum {string}
 * @property {string} DOT_RADIUS_CHANGED Dot radius changed
 * @readonly
 * @memberOf StockChartX
 */
const DOT_RADIUS_CHANGED = "drawingDotRadiusChanged";

// endregion

/**
 * Represents dot drawing.
 * @param {object} [config] The configuration object.
 * @param {StockChartX~Point | StockChartX.ChartPoint} [config.point] The center point.
 * @param {number} [config.radius] The radius of dot.
 * @constructor StockChartX.DotDrawing
 * @augments StockChartX.Drawing
 * @example
 *  // Create dot drawing at point (10, 20).
 *  var dot1 = new StockChartX.DotDrawing({
 *      point: {x: 10, y: 20}
 *  });
 *
 *  // Create dot drawing at record 10 and value 20.0.
 *  var dot2 = new StockChartX.DotDrawing({
 *      point: {record: 10, value: 20.0}
 *  });
 *
 *  // Create red dot drawing at point (10, 20).
 *  var dot3 = new StockChartX.DotDrawing({
 *      point: {x: 10, y: 20},
 *      theme: {
 *          fill: {
 *              fillColor: '#FF0000'
 *          }
 *      }
 *  });
 */
export class DotDrawing extends Drawing {
  // region Static members

  static get className(): string {
    return DrawingClassNames.DotDrawing;
  }

  static get subClassName(): string {
    return "abstractMarker";
  }

  static defaults: IDotDrawingDefaults = {
    radius: 5
  };

  // endregion

  // region Properties

  /**
   * Gets/Sets dot radius.
   * @name radius
   * @type {number}
   * @memberOf StockChartX.DotDrawing#
   */
  get radius(): number {
    return (
      (<IDotDrawingOptions>this._options).radius ||
      (<IDotDrawingDefaults>this._defaults).radius ||
      DotDrawing.defaults.radius
    );
  }

  set radius(value: number) {
    if (JsUtil.isNegativeNumber(value))
      throw new TypeError("Radius must be a positive number.");

    this._setOption("radius", value, DOT_RADIUS_CHANGED);
  }

  // endregion

  constructor(config?: IDotDrawingConfig) {
    super(config);
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
    let center = this.cartesianPoint(0);
    if (!center) return null;

    let radius = this.radius;

    return {
      left: center.x - radius,
      top: center.y - radius,
      width: 2 * radius,
      height: 2 * radius
    };
  }

  /**
   * @inheritdoc
   */
  hitTest(point: IPoint): boolean {
    if (!this.canHandleEvents) return false;

    let center = this.cartesianPoint(0);
    if (!center) return false;

    return Geometry.isPointInsideOrNearCircle(point, center, this.radius);
  }

  /**
   * @inheritdoc
   */
  draw() {
    if (!this.visible) return;

    let center = this.cartesianPoint(0);
    if (!center) return;

    let context = this.context,
      theme = this.actualTheme;

    context.beginPath();
    context.arc(center.x, center.y, this.radius, 0, 2 * Math.PI);
    context.scxFillStroke(theme.fill, theme.stroke);

    if (this.selected) {
      this._drawSelectionMarkers(center);
    }
  }
}

Drawing.register(DotDrawing);

// @endif
