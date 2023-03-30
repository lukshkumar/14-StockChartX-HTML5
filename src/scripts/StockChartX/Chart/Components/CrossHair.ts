import { CrossHairView } from "../../index";
import {
  IChartComponentConfig,
  ChartComponent
} from "../../index";
import { IStrokeTheme, IFillTheme, ITextTheme } from "../../index";
import { IVisualComponent } from "../../index";
import { ChartEvent } from "../../index";
import { JsUtil } from "../../index";
import { IPoint } from "../../index";
import {
  GestureState,
  Gesture,
  IWindowEvent
} from "../../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

/**
 * The cross hair theme structure.
 * @typedef {object} CrossHairTheme
 * @type {object}
 * @property {StockChartX.StrokeTheme} line The border line theme.
 * @property {StockChartX.FillTheme} fill The fill theme.
 * @property {StockChartX.TextTheme} text The text theme.
 * @memberOf StockChartX
 * @example
 * var theme = {
 *   line: {
 *     strokeColor: 'black'
 *   },
 *   fill: {
 *     fillColor: 'white'
 *   },
 *   text: {
 *     fontFamily: 'Calibri',
 *     fontSize: 12,
 *     fillColor: 'red'
 *   }
 * };
 */

"use strict";

// region Interfaces

interface ICrossHairOptions {
  crossHairType: string;
}

export interface ICrossHairState {
  crossHairType: string;
}

export interface ICrossHairConfig extends IChartComponentConfig {
  crossHairType?: string;
}

export interface ICrossHairTheme {
  line: IStrokeTheme;
  fill: IFillTheme;
  text: ITextTheme;
}

// endregion

// region Declarations

/**
 * Cross hair type enum values.
 * @readonly
 * @enum {string}
 * @memberOf StockChartX
 */
export const CrossHairType = {
  /** Cross hair is not shown. Use regular cursor. */
  NONE: "none",
  /** Show date and value markers. Cross hair lines are hidden. */
  MARKERS: "markers",
  /** Show cross hair lines and markers. */
  CROSS: "cross",
  /** Show cross hair lines and markers. Vertical line set by bars */
  CROSS_BARS: "crossBars"
};
Object.freeze(CrossHairType);

const EVENTS_SUFFIX = ".scxCrossHair";

// endregion

/**
 * Represents chart's cross hair cursor.
 * @param {Object} config The configuration object.
 * @param {StockChartX.Chart} config.chart The parent chart.
 * @constructor StockChartX.CrossHair
 * @requires JQuery
 */
export class CrossHair extends ChartComponent implements IVisualComponent {
  // region Properties

  /**
   * @internal
   */
  private _view: CrossHairView = new CrossHairView(this);

  /**
   * @internal
   */
  private _options: ICrossHairOptions;

  /**
   * Gets/Sets cross hair type.
   * @name crossHairType
   * @type {StockChartX.CrossHairType}
   * @default {@linkcode StockChartX.CrossHairType.NONE}
   * @memberOf StockChartX.CrossHair#
   * @example
   *  crossHair.crossHairType = StockChartX.CrossHairType.MARKERS;
   */
  get crossHairType(): string {
    return this._options.crossHairType;
  }

  set crossHairType(type: string) {
    let oldType = this._options.crossHairType;

    if (oldType !== type) {
      this._options.crossHairType = type;
      this._view.updateVisibility();

      this.chart.fireValueChanged(ChartEvent.CROSS_HAIR_CHANGED, type, oldType);
    }
  }

  /**
   * The flag that indicates whether cross hair is visible.
   * It does not change cross hair type.
   * @name visible
   * @type {boolean}
   * @memberOf StockChartX.CrossHair#
   */
  visible = true;

  // endregion

  constructor(config: ICrossHairConfig) {
    super(config);

    this.loadState(<ICrossHairState>(<any>config));

    if (this.chart) this._subscribe();
  }

  /**
   * @inheritDoc
   * @internal
   */
  protected _subscribe() {
    if (super._subscribe) super._subscribe();

    this.chart
      .on(
        ChartEvent.THEME_CHANGED + EVENTS_SUFFIX,
        () => {
          this.applyTheme();
        },
        this
      )
      .on(
        ChartEvent.LOCALE_CHANGED + EVENTS_SUFFIX,
        () => {
          this.update();
        },
        this
      )
      .on(
        ChartEvent.TIME_INTERVAL_CHANGED + EVENTS_SUFFIX,
        () => {
          this.update();
        },
        this
      );
  }

  /**
   * @inheritDoc
   * @internal
   */
  protected _unsubscribe() {
    this.chart.off(EVENTS_SUFFIX, this);

    if (super._unsubscribe) super._unsubscribe();
  }

  /**
   * Layouts elements.
   * @method layout
   * @memberOf StockChartX.CrossHair#
   */
  layout() {
    this._view.layout();
  }

  /**
   * Applies theme to the HTML controls.
   * @method applyTheme
   * @memberOf StockChartX.CrossHair#
   */
  applyTheme() {
    this._view.applyTheme();
  }

  /**
   * Updates markers text and size.
   * @method update
   * @memberOf StockChartX.CrossHair#
   */
  update() {
    this._view.updateMarkers();
    this._view.updatePosition(true);
  }

  /**
   * Shows cross hair (if cross hair type is not set to NONE).
   * @method show
   * @memberOf StockChartX.CrossHair#
   */
  show() {
    this.visible = true;
    this._view.updatePosition(true);
    this._view.updateVisibility(true);
  }

  /**
   * Hides cross hair.
   * @method hide
   * @memberOf StockChartX.CrossHair#
   */
  hide() {
    this.visible = false;
    this._view.updateVisibility(false);
  }

  // region IStateProvider

  /**
   * @inheritdoc
   */
  saveState(): ICrossHairState {
    return JsUtil.clone(this._options);
  }

  /**
   * @inheritdoc
   */
  loadState(state: ICrossHairState) {
    this._options = <ICrossHairOptions>{};
    this.crossHairType = (state && state.crossHairType) || CrossHairType.NONE;
  }

  // endregion

  /**
   * Moves cross hair into a given position.
   * @method setPosition
   * @param {StockChartX~Point} point The destination point.
   * @param {Boolean} [animated = true] The flag that indicates whether animation frame should be requested to set the position.
   * @memberOf StockChartX.CrossHair#
   * @example
   *  crossHair.setPosition({x: 100, y: 200});
   */
  setPosition(point: IPoint, animated?: boolean) {
    this._view.setPosition(point, animated);
  }

  /**
   * Handles mouse hover gesture event.
   * @method handleMouseHoverGesture
   * @param {StockChartX.Gesture} gesture The mouse hover gesture.
   * @param {Object} event The event object.
   * @memberOf StockChartX.CrossHair#
   * @private
   * @internal
   */
  handleMouseHoverGesture(gesture: Gesture, event: IWindowEvent) {
    switch (gesture.state) {
      case GestureState.STARTED:
        this._view.updateVisibility(true);
        break;
      case GestureState.FINISHED:
        this._view.updateVisibility(false);
        break;
      case GestureState.CONTINUED:
        if (this.crossHairType !== CrossHairType.NONE)
          this.setPosition(event.pointerPosition);
        break;
      default:
        break;
    }
  }

  // region IDestroyable

  /**
   * @inheritdoc
   */
  destroy() {
    this._view.destroy();

    super.destroy();
  }

  // endregion
}
