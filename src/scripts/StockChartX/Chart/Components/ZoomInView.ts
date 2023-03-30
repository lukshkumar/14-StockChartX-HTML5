import { IStrokeTheme, IFillTheme } from "../../index";
import { IPoint } from "../../index";
import { Control } from "../../index";
import { Animation } from "../../index";
import { ChartPanel, Chart } from "../../index";
import { ChartState } from "../../index";
import { GestureArray } from "../../index";
import { ClickGesture } from "../../index";
import { MouseHoverGesture } from "../../index";
import { IWindowEvent, Gesture } from "../../index";
import { HtmlUtil } from "../../index";
import { ChartEvent } from "../../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

// region Interfaces

export interface IZoomInControls {
  rectangle: JQuery;
}

export interface IZoomInTheme {
  border: IStrokeTheme;
  fill: IFillTheme;
}

// endregion

// region Declarations

export const ZoomInMode = {
  DATE_RANGE: <ZoomInMode>"dateRange",
  RECT: <ZoomInMode>"rect"
};
Object.freeze(ZoomInMode);
export type ZoomInMode = "dateRange" | "rect";

const Class = {
  ZOOM_RECTANGLE: "scxZoomRectangle",
  ZOOM_IN: "scxZoomIn"
};
Object.freeze(Class);

// endregion

/**
 * Represents chart's zoom in component.
 * @param {StockChartX.Chart} config.chart The parent chart.
 * @constructor StockChartX.ZoomInView
 * @augments Control
 * @requires JQuery
 * @internal
 */
export class ZoomInView extends Control {
  // region Properties

  private _startPoint: IPoint;
  private _movePoint: IPoint;
  private _controls: IZoomInControls;
  private _points: IPoint[];
  private _positionAnimation = new Animation({
    callback: this.draw
  });

  /**
   * Gets/Sets zoom in mode.
   * @name zoomMode
   * @type {StockChartX.ZoomInView}
   * @default {@linkcode StockChartX.ZoomInMode.DATE_RANGE}
   * @memberOf StockChartX.ZoomInView#
   * @example
   *  zoomIn.zoomMode = StockChartX.ZoomInMode.RECT;
   */
  zoomMode = ZoomInMode.DATE_RANGE;

  panel: ChartPanel;

  /**
   * @internal
   */
  private _theme: IZoomInTheme;

  /**
   * Gets/sets theme for zoom in component.
   * @name theme
   * @type {StockChartX.ZoomInView}
   * @memberOf StockChartX.ZoomInView#
   */
  get theme(): IZoomInTheme {
    return this._theme || this.chart.theme.zoomIn;
  }

  set theme(value: IZoomInTheme) {
    this._theme = value;
  }

  /**
   * @internal
   */
  private get container(): JQuery {
    return this.panel.container;
  }

  private get chart(): Chart {
    return this.panel.chart;
  }

  /**
   * @internal
   */
  private _panelTop: number = 0;

  /**
   * @internal
   */
  private _panelHeight: number = 0;

  // endregion

  /**
   * @internal
   */
  protected _initGestures(): GestureArray {
    return new GestureArray(
      [
        new ClickGesture({
          handler: this._handleMouseClickGesture,
          hitTest: this.hitTest
        }),
        new MouseHoverGesture({
          handler: this._handleMouseMoveGesture,
          hitTest: this.hitTest
        })
      ],
      this
    );
  }

  /**
   * @internal
   */
  // noinspection JSUnusedLocalSymbols
  private _handleMouseClickGesture(gesture: ClickGesture, event: IWindowEvent) {
    if (this.chart.state !== ChartState.ZOOM_IN) return;

    this._panelTop = this.panel.frame.top;
    this._panelHeight = this.panel.frame.height;

    let top = this._panelTop;
    this._addPoint({
      x: event.pointerPosition.x,
      y: event.pointerPosition.y - top
    });
    if (this._points.length === 1) {
      this._createControls();
    } else if (this._points.length === 2) {
      this.finishDraw();

      return;
    }
    this.updateVisibility(true);
    this.setPosition();
  }

  /**
   * @internal
   */
  // noinspection JSUnusedLocalSymbols
  private _handleMouseMoveGesture(gesture: Gesture, event: IWindowEvent) {
    if (this._startPoint != null)
      this.movePosition({
        x: event.pointerPosition.x,
        y: event.pointerPosition.y - this._panelTop
      });
  }

  hitTest(point: IPoint) {
    return this.panel.contentFrame.containsPoint(point);
  }

  /**
   * @internal
   */
  private _createControls() {
    let panel = this.panel;
    if (!panel) return;

    this._controls = {
      rectangle: this.container.scxAppend("div", Class.ZOOM_RECTANGLE)
    };

    this.applyTheme();
    this.updateVisibility(false);
  }

  /**
   * @internal
   */
  private _addPoint(point: IPoint) {
    if (this._points == null) this._points = [];

    this._points.push(point);
  }

  finishDraw() {
    let chart = this.chart,
      projection = chart.dateScale.projection,
      points = this._points;

    chart.state = ChartState.NORMAL;
    this.updateVisibility(false);
    let firstRecord = projection.recordByX(Math.min(points[0].x, points[1].x)),
      lastRecord = projection.recordByX(Math.max(points[0].x, points[1].x));
    if (firstRecord >= chart.recordCount) {
      chart.fireValueChanged(ChartEvent.ZOOM_IN_FINISHED);

      return;
    }
    if (lastRecord > firstRecord) {
      if (firstRecord < 0) {
        firstRecord = 0;
        if (lastRecord <= firstRecord) {
          return;
        }
      }
      chart.recordRange(firstRecord, lastRecord);
      chart.setNeedsUpdate();
      if (this.zoomMode === ZoomInMode.RECT) {
        this._setScalesValues(points[0].y, points[1].y);
      } else {
        chart.setNeedsAutoScale();
      }
    }
    this._points = null;
    this.container.find(`.${Class.ZOOM_RECTANGLE}`).remove();
    chart.fireValueChanged(ChartEvent.ZOOM_IN_FINISHED);
  }

  cancelDraw() {
    this._points = null;
    if (!this.panel) return;

    this.updateVisibility(false);
    this.container.find(`.${Class.ZOOM_RECTANGLE}`).remove();
  }

  applyTheme() {
    let theme = this.theme;

    this._controls.rectangle
      .scxBorder("border", theme.border)
      .scxFill(theme.fill);
  }

  updateVisibility(isVisible?: boolean) {
    let controls = this._controls;
    if (!this._controls) return;

    if (isVisible) {
      this.container.addClass(Class.ZOOM_IN);
    } else {
      this.container.removeClass(Class.ZOOM_IN);
    }

    HtmlUtil.setVisibility(controls.rectangle, isVisible);
  }

  setPosition(animated?: boolean) {
    this._startPoint = this._points[0];

    if (animated) {
      this._positionAnimation.start();
    } else {
      this.draw();
    }
  }

  movePosition(point: IPoint, animated?: boolean) {
    this._movePoint = point;

    if (animated) {
      this._positionAnimation.start();
    } else {
      this.draw();
    }
  }

  draw() {
    if (!this._positionAnimation) return;
    this._positionAnimation.stop();

    let startPoint = this._startPoint;
    if (!startPoint) return;

    let movePoint = this._movePoint == null ? startPoint : this._movePoint;
    if (movePoint.x > this.panel.contentFrame.width) {
      movePoint.x = this.panel.contentFrame.width;
    }
    let left = 0,
      top = 0,
      width = 0,
      height = 0;

    if (this.zoomMode === ZoomInMode.DATE_RANGE) {
      top = 0;
      width = Math.abs(movePoint.x - startPoint.x);
      height = this._panelHeight;
      if (startPoint.x > movePoint.x) {
        left = movePoint.x;
      } else {
        left = startPoint.x;
      }
    } else {
      width = Math.abs(movePoint.x - startPoint.x);
      height = Math.abs(movePoint.y - startPoint.y);
      if (startPoint.x <= movePoint.x) {
        left = startPoint.x;
        if (startPoint.y <= movePoint.y) {
          top = startPoint.y;
        } else {
          top = movePoint.y;
        }
      } else {
        left = movePoint.x;
        if (startPoint.y <= movePoint.y) {
          top = movePoint.y - height;
        } else {
          top = movePoint.y;
        }
      }
    }

    let rect = this._controls.rectangle;
    rect.scxFrame({
      left,
      top,
      width,
      height
    });
    rect.css("position", "absolute");
  }

  /**
   * @internal
   */
  private _setScalesValues(y1: number, y2: number) {
    let chart = this.chart;
    for (let panel of chart.chartPanels) {
      for (let scale of panel.valueScales) {
        let value1 = scale.projection.valueByY(y1),
          value2 = scale.projection.valueByY(y2);
        scale.minVisibleValue = Math.min(value1, value2);
        scale.maxVisibleValue = Math.max(value1, value2);
      }
    }
  }

  destroy() {
    this._controls.rectangle.remove();
    this._controls = null;
  }
}
