/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { IRect } from "../../index";
import { Drawing } from "../../index";
import {
  GeometricMarkerDrawingBase,
  IGeometricMarkerDrawingBaseDefaults
} from "../../index";
import { DrawingClassNames } from "../utils";

// @if SCX_LICENSE != 'free'

"use strict";

/**
 * Represents diamond drawing.
 * @constructor StockChartX.DiamondDrawing
 * @augments StockChartX.GeometricMarkerDrawingBase
 * @example
 *  // Create diamond drawing at point (10, 20).
 *  var diamond1 = new StockChartX.DiamondDrawing({
 *      point: {x: 10, y: 20}
 *  });
 *
 *  // Create diamond drawing at record 10 and value 20.0.
 *  var diamond2 = new StockChartX.DiamondDrawing({
 *      point: {record: 10, value: 20.0}
 *  });
 *
 *  // Create red diamond drawing at point (10, 20).
 *  var diamond3 = new StockChartX.DiamondDrawing({
 *      point: {x: 10, y: 20},
 *      theme: {
 *          fill: {
 *              fillColor: '#FF0000'
 *          }
 *      }
 *  });
 */
export class DiamondDrawing extends GeometricMarkerDrawingBase {
  // region Static members

  static get className(): string {
    return DrawingClassNames.DiamondDrawing;
  }

  static defaults: IGeometricMarkerDrawingBaseDefaults = {
    size: {
      width: 10,
      height: 10
    }
  };

  // endregion

  /**
   * @inheritdoc
   */
  bounds(): IRect {
    let center = this.cartesianPoint(0);
    if (!center) return null;

    let size = this.size;

    return {
      left: Math.round(center.x - size.width / 2),
      top: Math.round(center.y - size.height / 2),
      width: size.width,
      height: size.height
    };
  }

  /**
   * @inheritdoc
   */
  draw() {
    if (!this.visible) return;

    let center = this.cartesianPoint(0);
    if (!center) return;

    let context = this.context,
      theme = this.actualTheme,
      size = this.size,
      halfWidth = Math.round(size.width / 2),
      halfHeight = Math.round(size.height / 2);

    context.beginPath();
    context.moveTo(center.x - halfWidth, center.y);
    context.lineTo(center.x, center.y - halfHeight);
    context.lineTo(center.x + halfWidth, center.y);
    context.lineTo(center.x, center.y + halfHeight);
    context.closePath();
    context.scxFillStroke(theme.fill, theme.stroke);

    if (this.selected) {
      this._drawSelectionMarkers(center);
    }
  }
}

Drawing.register(DiamondDrawing);

// @endif
