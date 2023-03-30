/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { JQueryEventObject } from "../../../external/typescript/jquery";
import { ChartHandler } from "../../index";
import { Chart } from "../../index";
import { Drawing } from "../../index";
"use strict";

// region Declarations

export const Key = {
  SHIFT: 16,
  CTRL: 17,
  ALT: 18
};

const EventSuffix = ".scxKeyboardHandler";

// endregion

/**
 * Handles chart keyboard events.
 * @constructor StockChartX.KeyboardHandler
 * @augments ChartHandler
 * @private
 * @internal
 */
export class KeyboardHandler extends ChartHandler {
  constructor(chart: Chart) {
    super(chart);

    this._subscribe();
  }

  /**
   * @inheritDoc
   * @internal
   */
  protected _subscribe() {
    $(window).on(`keydown${EventSuffix}`, this, this._handleKeyDown);
  }

  /**
   * @inheritDoc
   * @internal
   */
  protected _unsubscribe() {
    $(window).off(EventSuffix, this._handleKeyDown);
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @internal
   */
  private _handleKeyDown(event: JQueryEventObject) {
    let self = <KeyboardHandler>event.data;

    if (!self.chart.keyboardEventsEnabled) return;

    if (
      event.target !== document.activeElement ||
      $(event.target).hasClass("modal-open") ||
      $(event.target).hasClass("form-control")
    )
      return;

    self._handleKey(event);
  }

  /**
   * @internal
   */
  private _handleKey(event: JQueryEventObject) {
    let ctrlKey = event.ctrlKey || event.metaKey, // Mac support;
      chart = this.chart;

    switch (event.keyCode) {
      case 107: // +
        if (chart.zoomEnabled) {
          chart.zoomOnPixels(0.05 * chart.size.width);
          chart.setNeedsUpdate(true);
        }
        break;
      case 109: // -
        if (chart.zoomEnabled) {
          chart.zoomOnPixels(-0.05 * chart.size.width);
          chart.setNeedsUpdate(true);
        }
        break;
      case 37: // Arrow Left
        if (chart.scrollEnabled) {
          chart.scrollOnPixels(0.05 * chart.size.width);
          chart.setNeedsUpdate(true);
        }
        break;
      case 39: // Arrow Right
        if (chart.scrollEnabled) {
          chart.scrollOnPixels(-0.05 * chart.size.width);
          chart.setNeedsUpdate(true);
        }
        break;
      case 46: // Delete
        let selectedObj = chart.selectedObject;
        let panel = selectedObj && selectedObj.chartPanel;
        if (!panel) return;

        selectedObj.tooltip.hide();
        panel.removeDrawings(<Drawing>selectedObj);

        break;
      case 67: // C Key
        if (!ctrlKey) {
          return;
        }
        chart._copyDrawing();
        break;
      case 86: // V Key
        if (!ctrlKey) {
          return;
        }
        chart._pasteDrawing();
        break;
      default:
        return;
    }

    event.preventDefault();
  }
}
