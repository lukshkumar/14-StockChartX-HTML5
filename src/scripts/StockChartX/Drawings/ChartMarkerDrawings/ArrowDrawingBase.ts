import {
  IGeometricMarkerDrawingBaseConfig,
  IGeometricMarkerDrawingBaseOptions,
  IGeometricMarkerDrawingBaseDefaults,
  GeometricMarkerDrawingBase
} from "../../index";
import { JsUtil } from "../../index";
import { CanvasOffset } from "../../index";

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

// region Interfaces

export interface IArrowDrawingBaseConfig
  extends IGeometricMarkerDrawingBaseConfig {
  headRatio?: number;
  tailRatio?: number;
}

export interface IArrowDrawingBaseOptions
  extends IGeometricMarkerDrawingBaseOptions {
  headRatio?: number;
  tailRatio?: number;
}

export interface IArrowDrawingBaseDefaults
  extends IGeometricMarkerDrawingBaseDefaults {
  headRatio: number;
  tailRatio: number;
}

// endregion

// region Declarations

/**
 * Drawing events enumeration values.
 * @name DrawingEvent
 * @enum {string}
 * @property {string} ARROW_HEAD_RATIO_CHANGED Arrow head ratio changed
 * @property {string} ARROW_TAIL_RATIO_CHANGED Arrow tail ratio changed
 * @readonly
 * @memberOf StockChartX
 */
const ARROW_HEAD_RATIO_CHANGED = "drawingArrowHeadRatioChanged";
const ARROW_TAIL_RATIO_CHANGED = "drawingArrowTailRatioChanged";

// endregion

/**
 * Represents abstract arrow drawing.
 * @param {object} [config] The configuration object.
 * @param {StockChartX~Point | StockChartX.ChartPoint} [config.point] The point.
 * @param {StockChartX~Size} [config.size] The size.
 * @param {number} [config.headRatio]
 * @param {number} [config.tailRatio]
 * @param {number} [config.height] The height.
 * @abstract
 * @constructor StockChartX.ArrowDrawingBase
 * @augments StockChartX.GeometricMarkerDrawingBase
 */
export class ArrowDrawingBase extends GeometricMarkerDrawingBase {
  static defaults: IArrowDrawingBaseDefaults = {
    size: null,
    headRatio: 0.5,
    tailRatio: 0.5
  };

  // region Protected members

  /**
   * @internal
   */
  protected _angle = 0; // angle in degrees

  // endregion

  // region Properties

  get headRatio(): number {
    return (
      (<IArrowDrawingBaseOptions>this._options).headRatio ||
      (<IArrowDrawingBaseDefaults>this._defaults).headRatio ||
      ArrowDrawingBase.defaults.headRatio
    );
  }

  set headRatio(value: number) {
    if (!JsUtil.isPositiveNumber(value) || value >= 1)
      throw new Error("Value must be in range (0..1).");

    this._setOption("headRatio", value, ARROW_HEAD_RATIO_CHANGED);
  }

  get tailRatio(): number {
    return (
      (<IArrowDrawingBaseOptions>this._options).tailRatio ||
      (<IArrowDrawingBaseDefaults>this._defaults).tailRatio ||
      ArrowDrawingBase.defaults.tailRatio
    );
  }

  set tailRatio(value: number) {
    if (!JsUtil.isPositiveNumber(value) || value >= 1)
      throw new Error("Value must be in range (0..1).");

    this._setOption("tailRatio", value, ARROW_TAIL_RATIO_CHANGED);
  }

  // endregion

  constructor(config?: IArrowDrawingBaseConfig) {
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
  draw() {
    if (!this.visible) return;

    let refPoint = this.cartesianPoint(0);
    if (!refPoint) return;

    let context = this.context,
      theme = this.actualTheme,
      size = this.size,
      halfWidth = size.width / 2,
      halfTailWidth = (size.width * this.tailRatio) / 2,
      triangleHeight = size.height * this.headRatio;

    context.save();

    context.translate(refPoint.x, refPoint.y);
    context.rotate((this._angle * Math.PI) / 180);

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(-halfWidth, -triangleHeight + CanvasOffset);
    context.lineTo(-halfTailWidth, -triangleHeight + CanvasOffset);
    context.lineTo(-halfTailWidth, -size.height + CanvasOffset);
    context.lineTo(halfTailWidth, -size.height + CanvasOffset);
    context.lineTo(halfTailWidth, -triangleHeight + CanvasOffset);
    context.lineTo(halfWidth, -triangleHeight + CanvasOffset);
    context.closePath();
    context.scxFillStroke(theme.fill, theme.stroke);

    if (this.selected) {
      let point = {
        x: 0,
        y: 0
      };
      this._drawSelectionMarkers(point);
    }

    context.restore();
  }
}

// @endif
