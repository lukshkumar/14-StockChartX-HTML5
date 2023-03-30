/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { IDestroyable } from "../../index";
"use strict";

export interface IComponent extends IDestroyable {}

/**
 * Represents abstract chart component (non-visual control).
 * @constructor StockChartX.Component
 * @abstract
 */
/**
 * Destroys and removes control from the parent element.
 * @method destroy
 * @memberOf StockChartX.Component#
 */
export abstract class Component implements IComponent {
  abstract destroy();
}
