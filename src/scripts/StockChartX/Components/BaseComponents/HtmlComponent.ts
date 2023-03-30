/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { VisualComponent, IVisualComponent } from "../../index";
"use strict";

// region Interfaces

export interface IHtmlComponent extends IVisualComponent {
  readonly container: JQuery;

  update();
}

// endregion

/**
 * Represents abstract component that acts as html container.
 * @constructor StockChartX.HtmlComponent
 * @augments StockChartX.VisualComponent
 * @abstract
 */
export abstract class HtmlComponent extends VisualComponent
  implements IHtmlComponent {
  // region Properties

  /**
   * @internal
   */
  private _container: JQuery;

  /**
   * HTML container.
   * @name container
   * @returns {JQuery}
   * @readonly
   * @memberOf StockChartX.HtmlComponent#
   */
  get container(): JQuery {
    return this._container;
  }

  // endregion

  /**
   * @inheritDoc
   */
  layout() {
    if (!this._container) {
      this._container = this._createContainer();
      this.update();
    }
  }

  /**
   * Updates component's content.
   * @method update
   * @memberOf StockChartX.HtmlComponent#
   */
  update() {
    this.applyTheme();
  }

  // region Container routines

  protected abstract _createContainer(): JQuery;

  protected _removeContainer() {
    if (this._container) {
      this._container.remove();
      this._container = null;
    }
  }

  // endregion

  // region IDestroyable

  /**
   * @inheritDoc
   */
  destroy() {
    this._removeContainer();
  }

  // endregion
}
