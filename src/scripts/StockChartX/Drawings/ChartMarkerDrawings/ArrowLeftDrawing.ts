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
 * Represents left arrow drawing.
 * @constructor StockChartX.ArrowLeftDrawing
 * @augments StockChartX.ArrowDrawingBase
 * @example
 *  // Create arrow left drawing at point (10, 20).
 *  var arrowLeft1 = new StockChartX.ArrowLeftDrawing({
 *      point: {x: 10, y: 20}
 *  });
 *
 *  // Create arrow left drawing at record 10 and value 20.0.
 *  var arrowLeft2 = new StockChartX.ArrowLeftDrawing({
 *      point: {record: 10, value: 20.0}
 *  });
 *
 *  // Create red arrow left drawing at point (10, 20).
 *  var arrowLeft3 = new StockChartX.ArrowLeftDrawing({
 *      point: {x: 10, y: 20},
 *      theme: {
 *          fill: {
 *              fillColor: '#FF0000'
 *          }
 *      }
 *  });
 */
export class ArrowLeftDrawing extends ArrowDrawingBase {
  static get className(): string {
    return DrawingClassNames.ArrowLeftDrawing;
  }

  constructor(config?: IArrowDrawingBaseConfig) {
    super(config);

    this._angle = 90;
  }

  /**
   * @inheritdoc
   */
  bounds(): IRect {
    let leftPoint = this.cartesianPoint(0);
    if (!leftPoint) return null;

    let size = this.size;

    return {
      left: leftPoint.x,
      top: Math.round(leftPoint.y - size.height / 2),
      width: size.width,
      height: size.height
    };
  }
}

Drawing.register(ArrowLeftDrawing);

// @endif
