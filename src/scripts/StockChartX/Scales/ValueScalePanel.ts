/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { ValueScale } from "../index";
import { HtmlControl } from "../index";
import { Chart } from "../index";
import { ChartEvent } from "../index";
import { ISize, Rect } from "../index";
import { HtmlUtil } from "../index";
"use strict";

// region Interfaces

export interface IValueScalePanelConfig {
  valueScale: ValueScale;
  cssClass: string;
  visible?: boolean;
}

// endregion

// region Declarations

const CLASS_CONTAINER = "scxValueScale";

// endregion

/**
 * Describes value scale panel on the chart.
 * @param {Object} config The configuration object.
 * @param {StockChartX.ValueScale} config.valueScale The parent value scale.
 * @param {String} config.cssClass The css class name of div element that holds value scale panel.
 * @param {Boolean} [config.visible] The flag that indicates whether panel is visible.
 * @constructor StockChartX.ValueScalePanel
 * @augments StockChartX.HtmlControl
 */
export class ValueScalePanel extends HtmlControl {
  // region Properties
  private static TRANSPARENT = "transparent";

  /**
   * @internal
   */
  private _valueScale: ValueScale;

  /**
   * The parent value scale.
   * @name valueScale
   * @type {StockChartX.ValueScale}
   * @readonly
   * @memberOf StockChartX.ValueScalePanel#
   */
  get valueScale(): ValueScale {
    return this._valueScale;
  }

  /**
   * @internal
   */
  private _cssClass: string;

  /**
   * The css class name of div element that holds value scale panel.
   * @name cssClass
   * @type {String}
   * @readonly
   * @memberOf StockChartX.ValueScalePanel#
   */
  get cssClass(): string {
    return this._cssClass;
  }

  /**
   * @internal
   */
  private _isVisible: boolean = true;

  /**
   * The flag that indicates whether panel is visible.
   * @name visible
   * @type {boolean}
   * @memberOf StockChartX.ValueScalePanel#
   */
  get visible(): boolean {
    return this._isVisible;
  }

  set visible(value: boolean) {
    this._isVisible = value;
  }

  /**
   * Return parent chart.
   * @name chart
   * @type {StockChartX.Chart}
   * @readonly
   * @memberOf StockChartX.ValueScalePanel#
   */
  get chart(): Chart {
    return this._valueScale && this._valueScale.chart;
  }

  get size(): ISize {
    let div = this.container;

    return div && div.scxSize();
  }

  get contentSize(): ISize {
    let div = this.container;

    return div && div.scxContentSize();
  }

  // endregion

  constructor(config: IValueScalePanelConfig) {
    super();

    if (!config) throw new Error("Config is not specified.");

    if (!(config.valueScale instanceof ValueScale))
      throw new TypeError(
        "Config.valueScale must be an instance of StockChartX.ValueScale"
      );
    this._valueScale = config.valueScale;

    if (!config.cssClass)
      throw new Error("'config.cssClass' is not specified.");
    this._cssClass = config.cssClass;

    this._isVisible = config.visible != null ? config.visible : true;

    this.chart.on(`${ChartEvent.THEME_CHANGED}.scxValueScalePanel`, () => {
      this.applyTheme();
    });
  }

  /**
   * @internal
   */
  protected _createContainer(): JQuery {
    let parentDiv = this.chart.chartPanelsContainer.container;

    return parentDiv
      .scxPrepend("div", CLASS_CONTAINER)
      .addClass(this._cssClass);
  }

  /**
   * Layouts value scale panel elements
   * @method layout
   * @param {StockChartX.Rect} frame The chart panels container frame rectangle.
   * @param {Boolean} isLeftPanel True if it is a left panel, false if it is a right panel.
   * @memberOf StockChartX.ValueScalePanel#
   */
  layout(frame: Rect, isLeftPanel?: boolean) {
    let div = this.container,
      scaleFrame = null;

    if (this._isVisible) {
      if (!div) {
        this._container = div = this._createContainer();
        this.applyTheme();
      }

      div.width(this.getWidth()).outerHeight(frame.height);

      scaleFrame = this.frame;
      scaleFrame.width = div.outerWidth();
      scaleFrame.left = isLeftPanel
        ? frame.left
        : frame.right - scaleFrame.width;
      scaleFrame.height = frame.height;

      div.css("left", scaleFrame.left);
    } else {
      this._removeContainer();
    }

    return scaleFrame;
  }

  getWidth(): number {
    let valueScale = this._valueScale;

    if (valueScale.useManualWidth) return valueScale.manualWidth;

    let maxWidth = 0;
    for (let panel of this.chart.chartPanels) {
      maxWidth = Math.max(
        panel.preferredValueScaleWidth(this._valueScale),
        maxWidth
      );
    }

    return maxWidth;
  }

  applyTheme() {
    let container = this.container;
    if (!container) return;

    let theme = this.chart.theme.valueScale,
      border = theme.border,
      strokeEnabled = border.strokeEnabled !== false,
      cssKey =
        this._cssClass === this._valueScale.leftPanelCssClass
          ? "border-right"
          : "border-left";

    if (strokeEnabled)
      container.css(
        cssKey,
        `${border.width}px ${border.lineStyle} ${border.strokeColor}`
      );
    else container.css(cssKey, "none");

    HtmlUtil.setBackground(
      container,
      theme.fill.fillEnabled !== false
        ? theme.fill.fillColor
        : ValueScalePanel.TRANSPARENT
    );
  }
}
