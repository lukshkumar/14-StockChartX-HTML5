import { HtmlComponent } from "../../index";
import {
  CrossHair,
  ICrossHairTheme,
  CrossHairType
} from "../../index";
import { IPoint } from "../../index";
import { Animation } from "../../index";
import { Chart } from "../../index";
import { HtmlUtil } from "../../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

"use strict";

// region Interfaces

interface ICrossHairValueMarker {
  visible: boolean;
  halfHeight: number;
  $control: JQuery;
}

interface ICrossHairDateMarker {
  visible: boolean;
  halfWidth: number;
  $control: JQuery;
}

interface ICrossHairLines {
  visible: boolean;
  $horLine: JQuery;
  $verLine: JQuery;
}

interface ICrossHairControls {
  lines: ICrossHairLines;
  leftMarkers: ICrossHairValueMarker[];
  rightMarkers: ICrossHairValueMarker[];
  topMarker: ICrossHairDateMarker;
  bottomMarker: ICrossHairDateMarker;
}

// endregion

// region Declarations

const Class = {
  HOR_LINE: "scxCrossHairHorLine",
  VER_LINE: "scxCrossHairVerLine",
  NOTE: "scxCrossHairMarker",
  DATE_MARKER: "scxCrossHairDateMarker",
  VALUE_MARKER: "scxCrossHairValueMarker",
  CROSS_HAIR: "scxCrossHair",
  CROSS_HAIR_CONTAINER: "scxCrossHairContainer"
};
Object.freeze(Class);

// endregion

export class CrossHairView extends HtmlComponent {
  // region Properties

  /**
   * @internal
   */
  private _crossHair: CrossHair;

  /**
   * @internal
   */
  private _controls: ICrossHairControls;

  /**
   * @internal
   */
  private _position: IPoint = null;

  /**
   * @internal
   */
  private _prevPosition: IPoint = <IPoint>{};

  /**
   * @internal
   */
  private _positionAnimation: Animation = new Animation({
    callback: this.updatePosition
  });

  /**
   * @internal
   */
  private get chart(): Chart {
    return this._crossHair.chart;
  }

  // endregion

  constructor(crossHair: CrossHair) {
    super();

    this._crossHair = crossHair;
  }

  /**
   * @inheritDoc
   * @internal
   */
  protected _createContainer(): JQuery {
    return this.chart.rootDiv.scxAppend("div", Class.CROSS_HAIR_CONTAINER);
  }

  /**
   * @internal
   */
  private static _applyMarkerTheme(control: JQuery, theme: ICrossHairTheme) {
    control.scxTextStyle(theme.text).scxFill(theme.fill);
  }

  /**
   * @internal
   */
  private static _updateValueMarkerMetrics(marker: ICrossHairValueMarker) {
    let $control = marker.$control;

    if (!$control.text()) $control.text("1");
    marker.halfHeight = $control.height() / 2;
  }

  /**
   * @internal
   */
  private static _updateDateMarkerMetrics(
    marker: ICrossHairDateMarker,
    formattedDate: string
  ) {
    let $control = marker.$control;

    $control.text(formattedDate).width("auto");
    let width = Math.round($control.width() * 1.2);
    marker.halfWidth = Math.round(width / 2);
    $control.width(width);
  }

  /**
   * @internal
   */
  private _createValueMarker(): ICrossHairValueMarker {
    return {
      visible: true,
      halfHeight: 0,
      $control: this.container.scxAppend("span", [
        Class.NOTE,
        Class.VALUE_MARKER
      ])
    };
  }

  /**
   * @internal
   */
  private _createDateMarker(): ICrossHairDateMarker {
    return {
      visible: true,
      halfWidth: 0,
      $control: this.container.scxAppend("span", [
        Class.NOTE,
        Class.DATE_MARKER
      ])
    };
  }

  /**
   * @internal
   */
  private _createControls() {
    let parent = this.container;

    this._controls = {
      lines: {
        visible: true,
        $horLine: parent.scxAppend("div", Class.HOR_LINE),
        $verLine: parent.scxAppend("div", Class.VER_LINE)
      },
      leftMarkers: [],
      rightMarkers: [],
      topMarker: this._createDateMarker(),
      bottomMarker: this._createDateMarker()
    };

    this.applyTheme();
    this.updateVisibility(false);
  }

  /**
   * @internal
   */
  private _syncValueMarkers() {
    let leftMarkers = this._controls.leftMarkers,
      rightMarkers = this._controls.rightMarkers,
      scales = this.chart.valueScales,
      overhead = leftMarkers.length - scales.length;

    if (overhead > 0) {
      leftMarkers.splice(-overhead, overhead);
      rightMarkers.splice(-overhead, overhead);
    } else if (overhead < 0) {
      for (let i = 0; i < -overhead; i++) {
        leftMarkers.push(this._createValueMarker());
        rightMarkers.push(this._createValueMarker());
      }

      this.applyTheme();
      this.updateVisibility(false);
    }
  }

  layout() {
    super.layout();

    if (!this._controls) {
      this._createControls();
    }

    this._syncValueMarkers();

    let chart = this.chart,
      controls = this._controls,
      panelsFrame = chart.chartPanelsContainer.panelsContentFrame;

    controls.lines.$horLine
      .css("left", panelsFrame.left)
      .width(panelsFrame.width);
    controls.lines.$verLine
      .css("top", panelsFrame.top)
      .height(panelsFrame.height);

    let valueScales = chart.valueScales;
    for (let i = 0; i < valueScales.length; i++) {
      let leftFrame = valueScales[i].leftPanel.frame;
      if (leftFrame) {
        controls.leftMarkers[i].$control
          .css("left", leftFrame.left + 1)
          .outerWidth(leftFrame.width - 2);
      }

      let rightFrame = valueScales[i].rightPanel.frame;
      if (rightFrame) {
        controls.rightMarkers[i].$control
          .css("left", rightFrame.left + 1)
          .outerWidth(rightFrame.width - 2);
      }
    }

    let dateScale = chart.dateScale,
      topFrame = dateScale.topPanel.frame;

    if (topFrame) {
      controls.topMarker.$control
        .css("top", topFrame.top + 1)
        .outerHeight(topFrame.height - 2)
        .css("line-height", topFrame.height - 2 + "px");
    }

    let bottomFrame = dateScale.bottomPanel.frame;
    if (bottomFrame) {
      controls.bottomMarker.$control
        .css("top", bottomFrame.top + 1)
        .outerHeight(bottomFrame.height - 2)
        .css("line-height", bottomFrame.height - 2 + "px");
    }
  }

  applyTheme() {
    let theme = this.chart.theme.crossHair,
      controls = this._controls;

    controls.lines.$horLine.scxBorder("border-top", theme.line);
    controls.lines.$verLine.scxBorder("border-left", theme.line);
    for (let marker of controls.leftMarkers)
      CrossHairView._applyMarkerTheme(marker.$control, theme);
    for (let marker of controls.rightMarkers)
      CrossHairView._applyMarkerTheme(marker.$control, theme);
    CrossHairView._applyMarkerTheme(controls.topMarker.$control, theme);
    CrossHairView._applyMarkerTheme(controls.bottomMarker.$control, theme);

    this.updateMarkers();
  }

  update() {}

  updateVisibility(isVisible?: boolean) {
    let controls = this._controls;
    if (!controls) return;

    let crossHairType = this._crossHair.crossHairType,
      chartContainer = this.chart.rootDiv;
    isVisible =
      this._crossHair.visible &&
      isVisible &&
      crossHairType !== CrossHairType.NONE;

    if (
      isVisible &&
      (crossHairType === CrossHairType.CROSS ||
        crossHairType === CrossHairType.CROSS_BARS)
    )
      chartContainer.addClass(Class.CROSS_HAIR);
    else chartContainer.removeClass(Class.CROSS_HAIR);

    let isMarkerVisible = isVisible && crossHairType !== CrossHairType.NONE,
      valueScales = this.chart.valueScales;

    for (let i = 0; i < valueScales.length; i++) {
      if (i >= controls.leftMarkers.length) break;

      let showLeft = isMarkerVisible && valueScales[i].leftPanelVisible,
        showRight = isMarkerVisible && valueScales[i].rightPanelVisible;

      controls.leftMarkers[i].visible = showLeft;
      controls.rightMarkers[i].visible = showRight;
      HtmlUtil.setVisibility(controls.leftMarkers[i].$control, showLeft);
      HtmlUtil.setVisibility(controls.rightMarkers[i].$control, showRight);
    }

    let isCross =
      crossHairType === CrossHairType.CROSS ||
      crossHairType === CrossHairType.CROSS_BARS;
    let showLines = (controls.lines.visible = isVisible && isCross);
    HtmlUtil.setVisibility(controls.lines.$horLine, showLines);
    HtmlUtil.setVisibility(controls.lines.$verLine, showLines);

    let dateScale = this.chart.dateScale,
      showTop = (controls.topMarker.visible =
        isMarkerVisible && dateScale.topPanelVisible),
      showBottom = (controls.bottomMarker.visible =
        isMarkerVisible && dateScale.bottomPanelVisible);
    HtmlUtil.setVisibility(controls.topMarker.$control, showTop);
    HtmlUtil.setVisibility(controls.bottomMarker.$control, showBottom);
  }

  setPosition(point: IPoint, animated?: boolean) {
    this._position = point;

    if (animated) {
      this._positionAnimation.start();
    } else {
      this.updatePosition();
    }
  }

  updatePosition(force?: boolean) {
    if (!this._positionAnimation) return;
    this._positionAnimation.stop();

    let point = this._position;
    if (!point) return;

    let chart = this.chart,
      panel = chart.findPanelAt(point.y);
    if (!panel) return;

    let controls = this._controls,
      prevPos = this._prevPosition,
      crossHairType = this._crossHair.crossHairType;

    if (prevPos.x !== point.x || force === true) {
      prevPos.x = point.x;

      let dateScale = chart.dateScale,
        projection = dateScale.projection;

      if (crossHairType === CrossHairType.CROSS_BARS)
        point.x = projection.xByRecord(projection.recordByX(point.x, true));

      if (controls.lines.visible) controls.lines.$verLine.css("left", point.x);

      let topMarker = controls.topMarker,
        bottomMarker = controls.bottomMarker;
      if (topMarker.visible || bottomMarker.visible) {
        let date = projection.dateByColumn(projection.columnByX(point.x)),
          dateText = dateScale.formatDate(date);

        this._updateDateMarker(topMarker, dateText);
        this._updateDateMarker(bottomMarker, dateText);
      }
    }
    if (prevPos.y !== point.y || force === true) {
      prevPos.y = point.y;

      if (controls.lines.visible) controls.lines.$horLine.css("top", point.y);

      let valueScales = chart.valueScales,
        y = point.y - panel.frame.top - chart.chartPanelsContainer.frame.top;

      for (let i = 0; i < valueScales.length; i++) {
        let leftMarker = controls.leftMarkers[i],
          rightMarker = controls.rightMarkers[i];

        if (!leftMarker.visible && !rightMarker.visible) continue;

        let scale = panel.valueScales[i],
          value = scale.projection.valueByY(y),
          valueText = scale.formatValue(value);

        this._updateValueMarker(leftMarker, valueText);
        this._updateValueMarker(rightMarker, valueText);
      }
    }
  }

  updateMarkers() {
    let controls = this._controls;
    if (!controls) return;

    for (let marker of controls.leftMarkers) {
      CrossHairView._updateValueMarkerMetrics(marker);
    }
    for (let marker of controls.rightMarkers) {
      CrossHairView._updateValueMarkerMetrics(marker);
    }

    let date = this.chart.dateScale.formatDate(new Date(0));

    CrossHairView._updateDateMarkerMetrics(controls.topMarker, date);
    CrossHairView._updateDateMarkerMetrics(controls.bottomMarker, date);
  }

  /**
   * @internal
   */
  private _updateValueMarker(marker: ICrossHairValueMarker, text: string) {
    if (marker.visible) {
      marker.$control
        .text(text)
        .css("top", this._position.y - marker.halfHeight);
    }
  }

  /**
   * @internal
   */
  private _updateDateMarker(marker: ICrossHairDateMarker, text: string) {
    if (marker.visible) {
      let chartWidth = this.container.width(),
        left =
          this._position.x > chartWidth - marker.halfWidth
            ? chartWidth - 2 * marker.halfWidth
            : this._position.x - marker.halfWidth;

      marker.$control.text(text).css("left", Math.max(left, 0));
    }
  }
}
