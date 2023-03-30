/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

// @if SCX_LICENSE != 'free'
import { IRect } from "../../index";
import { Drawing } from "../../index";
import {
  GeometricMarkerDrawingBase,
  IGeometricMarkerDrawingBaseDefaults
} from "../../index";
import { CanvasOffset } from "../../index";
import { DrawingClassNames } from "../utils";

"use strict";

/**
 * Represents square drawing.
 * @constructor StockChartX.SquareDrawing
 * @augments StockChartX.GeometricMarkerDrawingBase
 * @example
 *  // Create square drawing at point (10, 20).
 *  var square1 = new StockChartX.SquareDrawing({
 *      point: {x: 10, y: 20}
 *  });
 *
 *  // Create square drawing at record 10 and value 20.0.
 *  var square2 = new StockChartX.SquareDrawing({
 *      point: {record: 10, value: 20.0}
 *  });
 *
 *  // Create a red square drawing at point (10, 20).
 *  var square3 = new StockChartX.SquareDrawing({
 *      point: {x: 10, y: 20},
 *      theme: {
 *          fill: {
 *              fillColor: '#FF0000'
 *          }
 *      }
 *  });
 */
export class SquareDrawing extends GeometricMarkerDrawingBase {
  // region Static members

  static get className(): string {
    return DrawingClassNames.SquareDrawing;
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
    let center = this.cartesianPoint(0),
      size = this.size;

    if (!center) return null;

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

    let rect = this.bounds();
    if (!rect) return;

    let context = this.context,
      theme = this.actualTheme;

    context.beginPath();
    context.rect(
      rect.left + CanvasOffset,
      rect.top + CanvasOffset,
      rect.width,
      rect.height
    );
    context.scxFillStroke(theme.fill, theme.stroke);

    if (this.selected) {
      this._drawSelectionMarkers(this.cartesianPoint(0));
    }
  }
}

Drawing.register(SquareDrawing);

// @endif
