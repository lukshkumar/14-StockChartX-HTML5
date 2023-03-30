/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { ArrowDrawingBase } from "../../index";
import { IRect } from "../../index";
import { Drawing } from "../../index";
import { DrawingClassNames } from "../utils";
// @if SCX_LICENSE != 'free'

"use strict";

/**
 * Represents down arrow drawing.
 * @constructor StockChartX.ArrowDownDrawing
 * @augments StockChartX.GeometricMarkerDrawingBase
 * @example
 *  // Create arrow down drawing at point (10, 20).
 *  var arrowDown1 = new StockChartX.ArrowDownDrawing({
 *      point: {x: 10, y: 20}
 *  });
 *
 *  // Create arrow down drawing at record 10 and value 20.0.
 *  var arrowDown2 = new StockChartX.ArrowDownDrawing({
 *      point: {record: 10, value: 20.0}
 *  });
 *
 *  // Create red arrow down drawing at point (10, 20).
 *  var arrowDown3 = new StockChartX.ArrowDownDrawing({
 *      point: {x: 10, y: 20},
 *      theme: {
 *          fill: {
 *              fillColor: '#FF0000'
 *          }
 *      }
 *  });
 */
export class ArrowDownDrawing extends ArrowDrawingBase {
  static get className(): string {
    return DrawingClassNames.ArrowDownDrawing;
  }

  /**
   * @inheritdoc
   */
  bounds(): IRect {
    let bottomPoint = this.cartesianPoint(0);
    if (!bottomPoint) return null;

    let size = this.size;

    return {
      left: Math.round(bottomPoint.x - size.width / 2),
      top: Math.round(bottomPoint.y - size.height),
      width: size.width,
      height: size.height
    };
  }
}

Drawing.register(ArrowDownDrawing);

// @endif
