/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { HtmlControl, Rect, IPoint } from "../index";
import { Chart } from "../index";
import { HtmlUtil } from "../index";
import { ChartEvent } from "../index";
import { GestureArray } from "../index";
import { PanGesture } from "../index";
import { DateScale } from "../index";
import { MouseWheelGesture } from "../index";
import { Layer } from "../index";
import { DoubleClickGesture } from "../index";
import { DateScaleScrollKind, DateScaleZoomKind } from "../index";
import { GestureState, IWindowEvent } from "../index";
import { Geometry } from "../index";
"use strict";

// region Declarations

const Class = {
  CONTAINER: "scxDateScale",
  SCROLL: "scxDateScaleScroll"
};

// endregion

/**
 * Represent date scale panel on the chart.
 * @param {Object}                  config  The configuration object.
 * @param {StockChartX.DateScale}   config.dateScale The parent date scale.
 * @param {String}                  config.cssClass The css class name of div element that holds date scale panel.
 * @param {Boolean}                 config.visible The flag that indicates whether panel is visible.
 * @constructor StockChartX.DateScalePanel
 */
export class DateScalePanel extends HtmlControl {
  // region Properties
  private static TRANSPARENT = "transparent";

  /**
   * @internal
   */
  private _dateScale;

  /**
   * Parent date scale.
   * @name dateScale
   * @type {StockChartX.DateScale}
   * @readonly
   * @memberOf StockChartX.DateScalePanel#
   */
  get dateScale(): DateScale {
    return this._dateScale;
  }

  /**
   * Returns parent chart.
   * @name chart
   * @type {StockChartX.Chart}
   * @readonly
   * @memberOf StockChartX.DateScalePanel#
   */
  get chart(): Chart {
    return this._dateScale && this._dateScale.chart;
  }

  /**
   * @internal
   */
  private _cssClass;

  /**
   * The css class name of div element that holds date scale panel.
   * @name cssClass
   * @type {String}
   * @readonly
   * @memberOf StockChartX.DateScalePanel#
   */
  get cssClass(): string {
    return this._cssClass;
  }

  /**
   * @internal
   */
  private _isVisible = true;

  /**
   * The flag that indicates whether panel is visible.
   * @name visible
   * @type {boolean}
   * @readonly
   * @memberOf StockChartX.DateScalePanel#
   */
  get visible(): boolean {
    return this._isVisible;
  }

  /**
   * @internal
   */
  private _layer: Layer;

  /**
   * Gets layer - an abstraction over canvas.
   * @name layer
   * @type StockChartX.Layer
   * @readonly
   * @memberOf StockChartX.DateScalePanel#
   */
  get layer(): Layer {
    return this._layer;
  }

  // endregion

  constructor(config: any) {
    super();

    if (!(config.dateScale instanceof DateScale))
      throw new TypeError(
        "'config.dateScale' must be an instance of StockChartX.DateScale."
      );
    this._dateScale = config.dateScale;

    if (config.cssClass == null)
      throw new Error("'config.cssClass' is not specified.");
    this._cssClass = config.cssClass;

    this._isVisible = config.visible != null ? !!config.visible : true;

    this._initGestures();

    this.chart.on(`${ChartEvent.THEME_CHANGED}.scxDateScalePanel`, () => {
      this.applyTheme();
    });
  }

  /**
   * @internal
   */
  protected _initGestures(): GestureArray {
    return new GestureArray(
      [
        new DoubleClickGesture({
          handler: this._handleDoubleClickGesture
        }),
        new PanGesture({
          handler: this._handlePanGesture,
          verticalMoveEnabled: false
        }),
        new MouseWheelGesture({
          handler: this._handleMouseWheel
        })
      ],
      this,
      this.hitTest
    );
  }

  /**
   * @internal
   */
  private _handleDoubleClickGesture() {
    this.chart.setNeedsUpdate();
    this.chart.setNeedsAutoScaleAll();
  }

  /**
   * @internal
   */
  private _handlePanGesture(gesture: PanGesture, event: IWindowEvent) {
    let chart = this.chart,
      isScroll = event.evt.which === 1;

    if (isScroll && !chart.scrollEnabled) return;
    if (!isScroll && !chart.zoomEnabled) return;

    switch (gesture.state) {
      case GestureState.STARTED:
        chart.rootDiv.addClass(Class.SCROLL);
        break;
      case GestureState.FINISHED:
        chart.rootDiv.removeClass(Class.SCROLL);
        break;
      case GestureState.CONTINUED:
        let offset = gesture.moveOffset.x,
          isUpdated = false,
          autoscale = false;

        if (isScroll) {
          isUpdated = this._dateScale.scrollOnPixels(offset);
          autoscale =
            isUpdated &&
            this._dateScale.scrollKind === DateScaleScrollKind.AUTOSCALED;
        } else {
          isUpdated = this._dateScale.zoomOnPixels(offset);
          autoscale =
            isUpdated &&
            this._dateScale.zoomKind === DateScaleZoomKind.AUTOSCALED;
        }
        if (isUpdated) {
          chart.setNeedsUpdate(autoscale);
        }
        break;
      default:
        break;
    }
  }

  /**
   * @internal
   */
  private _handleMouseWheel(gesture: MouseWheelGesture, event: IWindowEvent) {
    if (!this.chart.zoomEnabled) return;

    let width = this.frame.width,
      pixels = width * 0.05,
      multiplier = event.pointerPosition.x / width;

    this.chart.dateScale._handleZoom(-gesture.delta * pixels, multiplier);
  }

  applyTheme() {
    let container = this.container;
    if (!container) return;

    let theme = this._dateScale.actualTheme,
      border = theme.border,
      strokeEnabled = border.strokeEnabled !== false,
      cssKey =
        this._cssClass === this._dateScale.topPanelCssClass
          ? "border-bottom"
          : "border-top";

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
        : DateScalePanel.TRANSPARENT
    );
  }

  /**
   * Return client area height
   * @method _getClientHeight
   * @returns {Number}
   * @memberOf StockChartX.DateScalePanel#
   * @private
   * @internal
   */
  private _getClientHeight() {
    let dateScale = this._dateScale;

    if (dateScale.useManualHeight) return dateScale.manualHeight;

    let textHeight = HtmlUtil.getFontSize(dateScale.actualTheme);

    return (
      textHeight +
      <number>dateScale.textPadding.bottom +
      <number>dateScale.majorTickMarkLength +
      1
    );
  }

  /**
   * @inheritdoc
   */
  hitTest(point: IPoint): boolean {
    let frame = this.frame;

    if (frame) return Geometry.isPointInsideOrNearRect(point, frame);

    return false;
  }

  protected _createContainer(): JQuery {
    return this.chart.rootDiv
      .scxAppend("div", Class.CONTAINER)
      .addClass(this._cssClass);
  }

  /**
   * Layouts just root div element without children.
   * @method layoutPanel
   * @param {StockChartX.Rect} frameInChart The frame rectangle in chart coordinate system.
   * @param {Boolean} isTopPanel True if it is a top panel, false if it is a bottom panel.
   * @returns {StockChartX.Rect} The date scale frame rectangle.
   * @memberOf StockChartX.DateScalePanel#
   * @private
   * @internal
   */
  layoutPanel(frameInChart: Rect, isTopPanel: boolean) {
    let div = this.container,
      frame = null,
      strokeEnabled =
        this._dateScale.actualTheme.border.strokeEnabled !== false;

    if (this._isVisible) {
      if (!div) {
        this._container = div = this._createContainer();
        this.applyTheme();
      }
      div.outerWidth(frameInChart.width).innerHeight(this._getClientHeight());

      frame = this.frame;
      frame.left = frameInChart.left;
      frame.width = frameInChart.width;
      frame.height = div.outerHeight();
      frame.top = isTopPanel ? 0 : frameInChart.bottom - frame.height;

      if (!isTopPanel && !strokeEnabled) frame.top -= 1; // minus border offset

      div.css("left", frame.left).css("top", frame.top);
    } else {
      this._removeContainer();
    }

    return frame;
  }

  /**
   * Layouts date scale panel elements
   * @method layout
   * @param {StockChartX.Rect} frameInChart The content frame rectangle.
   * @param {Boolean} isTopPanel True if it is a top panel, false if it is a bottom panel.
   * @memberOf StockChartX.DateScalePanel#
   */
  layout(frameInChart: Rect, isTopPanel?: boolean) {
    this.layoutPanel(frameInChart, isTopPanel);

    if (this._isVisible) {
      let container = this.container;

      if (!this._layer) {
        this._layer = new Layer({ parent: container });
      }

      this._layer.size = {
        width: container.width(),
        height: container.height()
      };
    } else {
      let layer = this._layer;

      if (layer) {
        layer.destroy();
        this._layer = null;
      }
    }
  }

  clearPanel() {
    if (!this._layer || !this._layer.canvas) return;
    let width = this._layer.size.width,
      height = this._layer.size.height;

    this._layer.context.clearRect(0, 0, width, height);
  }

  /**
   * @inheritdoc
   */
  draw() {
    if (!this._isVisible) return;

    let context = this._layer.context,
      dateScale = this._dateScale,
      theme = dateScale.actualTheme,
      height = this._layer.size.height,
      yText = height - dateScale.textPadding.bottom;

    this.clearPanel();
    context.save();
    context.translate(0.5, 0.5);

    context.scxApplyTextTheme(theme.text);
    context.textBaseline = "bottom";

    context.beginPath();

    for (let majorTick of dateScale.calibrator.majorTicks) {
      if (!majorTick.text) continue;

      context.moveTo(majorTick.x, 0);
      context.lineTo(majorTick.x, dateScale.majorTickMarkLength);
      context.textAlign = majorTick.textAlign;
      context.fillText(majorTick.text, majorTick.textX, yText);
    }
    for (let minorTick of dateScale.calibrator.minorTicks) {
      context.moveTo(minorTick.x, 0);
      context.lineTo(minorTick.x, dateScale.minorTickMarkLength);
    }

    context.scxApplyStrokeTheme(theme.line);
    context.stroke();

    context.restore();
  }
}
