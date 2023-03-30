/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import {
  IComponent,
  Component
} from "../../index";
import { Rect } from "../../index";
"use strict";

// region Interfaces

export interface IVisualComponent extends IComponent {
  layout(frame?: Rect);
  applyTheme();
}

// endregion

/**
 * Represents abstract visual component.
 * @constructor StockChartX.VisualComponent
 * @augments StockChartX.Component
 * @abstract
 */
export abstract class VisualComponent extends Component
  implements IVisualComponent {
  /**
   * Layouts elements in a given frame.
   * @method layout
   * @param {StockChartX.IRect} [frame] The frame rectangle.
   * @memberOf StockChartX.VisualComponent#
   */
  abstract layout(frame?: Rect);

  /**
   * Applies theme to the component.
   * @method applyTheme
   * @memberOf StockChartX.VisualComponent#
   */
  abstract applyTheme();
}
