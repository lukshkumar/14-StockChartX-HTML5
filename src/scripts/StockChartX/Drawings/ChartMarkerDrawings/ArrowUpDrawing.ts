/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { ArrowDrawingBase, IArrowDrawingBaseConfig } from "../../index";
import { IRect } from "../../index";
import { Drawing } from "../../index";
import { DrawingClassNames } from "../utils";

// @if SCX_LICENSE != 'free'

"use strict";

/**
 * Represents up arrow drawing.
 * @constructor StockChartX.ArrowUpDrawing
 * @augments StockChartX.ArrowDrawingBase
 * @example
 *  // Create arrow up drawing at point (10, 20).
 *  var arrowUp1 = new StockChartX.ArrowUpDrawing({
 *      point: {x: 10, y: 20}
 *  });
 *
 *  // Create arrow up drawing at record 10 and value 20.0.
 *  var arrowUp2 = new StockChartX.ArrowUpDrawing({
 *      point: {record: 10, value: 20.0}
 *  });
 *
 *  // Create red arrow up drawing at point (10, 20).
 *  var dot3 = new StockChartX.ArrowUpDrawing({
 *      point: {x: 10, y: 20},
 *      theme: {
 *          fill: {
 *              fillColor: '#FF0000'
 *          }
 *      }
 *  });
 */
export class ArrowUpDrawing extends ArrowDrawingBase {
  static get className(): string {
    return DrawingClassNames.ArrowUpDrawing;
  }

  constructor(config?: IArrowDrawingBaseConfig) {
    super(config);

    this._angle = 180;
  }

  /**
   * @inheritdoc
   */
  bounds(): IRect {
    let topPoint = this.cartesianPoint(0);
    if (!topPoint) return null;

    let size = this.size;

    return {
      left: Math.round(topPoint.x - size.width / 2),
      top: topPoint.y,
      width: size.width,
      height: size.height
    };
  }
}

Drawing.register(ArrowUpDrawing);

// @endif
