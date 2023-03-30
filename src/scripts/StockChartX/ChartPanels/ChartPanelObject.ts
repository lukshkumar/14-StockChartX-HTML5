import { IPoint } from "../index";
import { ChartPanelValueScale } from "../index";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { Tooltip, ITooltipState } from "../../StockChartX.UI/index";
import { IDestroyable } from "../index";
import { IStateProvider } from "../index";
import { ChartPanel } from "../index";
// import { Chart } from "../index";
import { ValueScale, Chart } from "../index";
import { ChartEventsExtender } from "../index";
import { Projection } from "../index";
import { JsUtil } from "../index";

"use strict";

// region Interfaces

export interface IChartPanelObject
  extends IDestroyable,
    IStateProvider<IChartPanelObjectState> {
  chartPanel: ChartPanel;
  chart: Chart;
  valueScale: ValueScale;
  projection: Projection;
  tooltip: Tooltip;
}

export interface IChartPanelObjectConfig {
  options?: IChartPanelObjectOptions;
}

export interface IChartPanelObjectOptions {
  visible: boolean;
  valueScaleIndex: number;
  zIndex: number;
}

export interface IChartPanelObjectState {
  options?: IChartPanelObjectOptions;
  panelIndex?: number;
  valueScaleIndex?: number;
  tooltip?: ITooltipState;
}

// endregion

/**
 *  The base class for all objects on the chart panel (drawings, plots, ...).
 *  @constructor StockChartX.ChartPanelObject
 *  @augments StockChartX.ChartEventsExtender
 *  @abstract
 */
export abstract class ChartPanelObject extends ChartEventsExtender
  implements IChartPanelObject {
  // region Protected members

  /**
   * @internal
   */
  protected _options = <IChartPanelObjectOptions>{};

  // endregion

  // region Private members

  /**
   * @internal
   */
  private _panel: ChartPanel;

  /**
   * @internal
   */
  private _prevCursor: string;

  // endregion

  // region Properties

  /**
   * @internal
   */
  private _tooltip: Tooltip;

  get tooltip(): Tooltip {
    return this._tooltip;
  }

  set tooltip(tooltip: Tooltip) {
    if (tooltip == null) return;

    this._tooltip = tooltip;
  }

  /**
   * Gets/Sets parent chart panel.
   * @name chartPanel
   * @type StockChartX.ChartPanel
   * @memberOf StockChartX.ChartPanelObject#
   */
  get chartPanel(): ChartPanel {
    return this._panel;
  }

  set chartPanel(value: ChartPanel) {
    let oldValue = this._panel;
    if (oldValue === value) return;
    if (value && !(value instanceof ChartPanel))
      throw new TypeError(
        "Panel must be an instance of StockChartX.ChartPanel."
      );

    this._panel = value;
    this._onChartPanelChanged(oldValue);

    if (value && !this._valueScale) {
      let index = this._options.valueScaleIndex;
      if (index) this.valueScale = this.chart.valueScales[index];
    }
  }

  /**
   * @internal
   */
  protected get context(): CanvasRenderingContext2D {
    return this._panel.layer.context;
  }

  /**
   * Gets parent chart.
   * @name chart
   * @type StockChartX.Chart
   * @readonly
   * @memberOf StockChartX.ChartPanelObject#
   */
  get chart(): Chart {
    let panel = this._panel;

    return panel && panel.chart;
  }

  /**
   * @internal
   */
  private _valueScale: ValueScale;

  get valueScale(): ValueScale {
    return this._valueScale || this.chart.valueScale;
  }

  set valueScale(value: ValueScale) {
    let oldValue = this._valueScale;
    if (oldValue !== value) {
      this._valueScale = value;
      this._onValueScaleChanged(oldValue);
    }
  }

  /**
   * Gets chart panel value scale.
   * @name panelValueScale
   * @type {StockChartX.ChartPanelValueScale}
   * @readonly
   * @memberOf StockChartX.ChartPanelObject#
   */
  get panelValueScale(): ChartPanelValueScale {
    return this._panel.getValueScale(this.valueScale);
  }

  /**
   * Gets projection object to convert coordinates.
   * @name projection
   * @type StockChartX.Projection
   * @readonly
   * @memberOf StockChartX.ChartPanelObject#
   */
  get projection(): Projection {
    return this._panel && this._panel.getProjection(this.valueScale);
  }

  /**
   * Gets/Sets flag that indicates whether drawing is visible.
   * @name visible
   * @type {boolean}
   * @memberOf StockChartX.ChartPanelObject#
   */
  get visible(): boolean {
    return this._options.visible;
  }

  set visible(value: boolean) {
    let oldValue = this.visible;
    if (oldValue !== value) {
      this._options.visible = value;
      this._onVisibleChanged(oldValue);
    }
  }

  get zIndex(): number {
    return this._options.zIndex;
  }

  set zIndex(value: number) {
    if (!JsUtil.isFiniteNumber(value))
      throw new Error("Z-index must be a finite number.");

    this._options.zIndex = value;
  }

  // endregion

  constructor(config: IChartPanelObjectConfig) {
    super();

    this._tooltip = new Tooltip({ parent: this });
    this.loadState(<IChartPanelObjectState>config);
  }

  /**
   * @internal
   */
  protected _setOption(
    key: string,
    value: any,
    valueChangedEventName?: string
  ) {
    let options = this._options,
      oldValue = options[key];

    if (oldValue !== value) {
      options[key] = value;

      if (valueChangedEventName)
        this.fire(valueChangedEventName, value, oldValue);
    }
  }

  // region OnPropertyChanged

  /**
   * @internal
   */
  protected _onChartPanelChanged(oldValue: ChartPanel) {}

  /**
   * @internal
   */
  protected _onValueScaleChanged(oldValue: ValueScale) {}

  /**
   * @internal
   */
  protected _onVisibleChanged(oldValue: boolean) {}

  // endregion

  // region Css routines

  /**
   *
   * @param cssClass
   */
  addChartCssClass(cssClass: string) {
    let chart = this.chart;
    if (chart) chart.addCssClass(cssClass);
  }

  removeChartCssClass(cssClass: string) {
    let chart = this.chart;
    if (chart) chart.removeCssClass(cssClass);
  }

  // endregion

  // region Cursor routines

  changeCursor(cursorCssClass?: string) {
    if (this._prevCursor) this.removeChartCssClass(this._prevCursor);
    if (cursorCssClass) this.addChartCssClass(cursorCssClass);
    this._prevCursor = cursorCssClass;
  }

  // endregion

  // region State management

  /**
   * Saves chart panel object state.
   * @method saveState
   * @returns {object}
   * @memberOf StockChartX.ChartPanelObject#
   */
  saveState(): IChartPanelObjectState {
    let state = <IChartPanelObjectState>{
      options: JsUtil.clone(this._options),
      tooltip: this.tooltip.saveState()
    };

    if (this.chartPanel) state.panelIndex = this.chartPanel.getIndex();
    if (this.valueScale) state.valueScaleIndex = this.valueScale.index;

    return state;
  }

  /**
   * Loads chart panel object state.
   * @method saveState
   * @returns {object}
   * @memberOf StockChartX.ChartPanelObject#
   */
  loadState(state: IChartPanelObjectState) {
    let suppress = this.suppressEvents();

    state = state || <IChartPanelObjectState>{};
    this._options = state.options || <IChartPanelObjectOptions>{};
    this.tooltip.loadState(state.tooltip);

    this.suppressEvents(suppress);
  }

  // endregion

  /**
   * Draws object.
   * @method draw
   * @memberOf StockChartX.ChartPanelObject#
   */
  draw() {}

  drawValueMarkers() {}

  showTooltip(point: IPoint) {
    if (!point) return;

    let panel = this.chartPanel,
      clientPoint = panel.container.scxLocalToClientPoint(point.x, point.y),
      tooltip = this.tooltip;

    tooltip.layoutRect = {
      top: this.chart.rootDiv.offset().top,
      left: panel.container.offset().left + panel.contentFrame.left,
      width: panel.contentFrame.width,
      height: this.chart.getBounds().height
    };

    if (tooltip.visible) tooltip.moveTo(clientPoint);
    else tooltip.show(clientPoint);
  }

  hideTooltip() {
    this.tooltip.hide();
  }

  // region IDestroyable

  /**
   * @inheritdoc
   */
  destroy() {
    if (this.tooltip) {
      this.tooltip.destroy();
    }

    this.chartPanel = null;
  }

  // endregion
}
