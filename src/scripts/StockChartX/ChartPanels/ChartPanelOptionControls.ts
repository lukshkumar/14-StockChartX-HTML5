import { ChartPanel } from "../index";
import { PanelState } from "../index";
// import { $ } from "../../external/typescript/jquery";
import { MouseHoverGesture } from "../index";
import { GestureState } from "../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
const $ = window.jQuery;

"use strict";

const Class = {
  OPTIONS: "scxPanelOptions",
  OPTIONS_ICON: "scxPanelTitleIcon",
  OPTIONS_CLOSE: "scxPanelClose",
  OPTIONS_MOVE_UP: "scxPanelMoveUp",
  OPTIONS_MOVE_DOWN: "scxPanelMoveDown",
  OPTIONS_MAXIMIZE: "scxPanelMaximize",
  OPTIONS_RESTORE: "scxPanelRestore",
  OPTIONS_SCROLL_LAST: "scxPanelScrollToLast"
};

export class ChartPanelOptionControls {
  /**
   * @internal
   */
  private _panel: ChartPanel;

  /**
   * @internal
   */
  private _options: JQuery;

  /**
   * @internal
   */
  private _moveUp: JQuery;

  /**
   * @internal
   */
  private _moveDown: JQuery;

  /**
   * @internal
   */
  private _close: JQuery;

  /**
   * @internal
   */
  private _maximize: JQuery;

  /**
   * @internal
   */
  private _restore: JQuery;

  /**
   * @internal
   */
  private _scrollToLast: JQuery;

  constructor(panel: ChartPanel) {
    this._panel = panel;
  }

  layout(title: JQuery) {
    let panel = this._panel;
    let panelsCount = panel.chart.chartPanels.length;
    if (!this._options) {
      this._createControls(title);
    }
    let isPanelMax = panel.state === PanelState.MAXIMIZED,
      isMainPanel = panel === panel.chart.mainPanel,
      index = panel.getIndex();

    if (isMainPanel) {
      let recordCount = panel.chart.recordCount,
        displayKind =
          panel.chart.lastVisibleRecord < recordCount - 1 ? "inline" : "none";

      this._scrollToLast.css("display", displayKind);
    }

    this._moveUp.css("display", isMainPanel || index < 2 ? "none" : "inline");
    this._moveDown.css(
      "display",
      isMainPanel || index === panelsCount - 1 ? "none" : "inline"
    );
    this._close.css("display", isMainPanel ? "none" : "inline");
    this._restore.css(
      "display",
      isPanelMax && panelsCount > 1 ? "inline" : "none"
    );
    this._maximize.css(
      "display",
      isPanelMax || panelsCount < 2 ? "none" : "inline"
    );
  }

  /**
   * @internal
   */
  private _createControls(title: JQuery) {
    let panel = this._panel,
      chart = panel.chart,
      optionsDiv = (this._options = title.scxAppend("div", Class.OPTIONS));

    optionsDiv.hide();
    this._restore = $(`<span class="${Class.OPTIONS_ICON} ${
      Class.OPTIONS_RESTORE
    }"
             data-i18n="[title]chartPanelOptionControls.restore"></span>`)
      .appendTo(optionsDiv)
      .on("click", () => {
        panel.state = PanelState.NORMAL;
        chart.setNeedsUpdate(true);
      });

    this._maximize = $(`<span class="${Class.OPTIONS_ICON} ${
      Class.OPTIONS_MAXIMIZE
    }"
             data-i18n="[title]chartPanelOptionControls.maximize"></span>`)
      .appendTo(optionsDiv)
      .on("click", () => {
        panel.state = PanelState.MAXIMIZED;
        panel.chart.setNeedsUpdate();
      });

    this._moveUp = $(`<span class="${Class.OPTIONS_ICON} ${
      Class.OPTIONS_MOVE_UP
    }"
             data-i18n="[title]chartPanelOptionControls.moveUp"></span>`)
      .appendTo(optionsDiv)
      .on("click", () => {
        if (panel.getIndex() > 1) {
          panel.chartPanelsContainer.movePanel(panel, 1);
          panel.chart.setNeedsUpdate();
        }
      });

    this._moveDown = $(`<span class="${Class.OPTIONS_ICON} ${
      Class.OPTIONS_MOVE_DOWN
    }"
             data-i18n="[title]chartPanelOptionControls.moveDown"></span>`)
      .appendTo(optionsDiv)
      .on("click", () => {
        panel.chartPanelsContainer.movePanel(panel, -1);
        panel.chart.setNeedsUpdate();
      });

    this._close = $(`<span class="${Class.OPTIONS_ICON} ${Class.OPTIONS_CLOSE}"
             data-i18n="[title]chartPanelOptionControls.close"></span>`)
      .appendTo(optionsDiv)
      .on("click", () => {
        panel.chartPanelsContainer.removePanel(panel);
        panel.chart.setNeedsUpdate();
      });

    if (chart.mainPanel === this._panel) {
      this._scrollToLast = $(`<span class="${Class.OPTIONS_ICON} ${
        Class.OPTIONS_SCROLL_LAST
      }"
                data-i18n="[title]chartNavigation.scrollToLast"></span>`)
        .appendTo(optionsDiv)
        .on("click", () => {
          let visibleRecordsCount =
            chart.lastVisibleRecord - chart.firstVisibleRecord;

          chart.dateScale.firstVisibleRecord = Math.max(
            chart.recordCount - visibleRecordsCount - 1,
            0
          );
          chart.dateScale.lastVisibleRecord = chart.recordCount - 1;

          chart.setNeedsUpdate(true);
        });
    }
  }

  handleMouseHoverGesture(gesture: MouseHoverGesture) {
    switch (gesture.state) {
      case GestureState.STARTED:
      case GestureState.CONTINUED:
        this._panel.container.find(".scxPanelOptions").show();
        break;
      case GestureState.NONE:
      case GestureState.FINISHED:
        this._panel.container.find(".scxPanelOptions").hide();
        break;
      default:
        break;
    }
  }
}
