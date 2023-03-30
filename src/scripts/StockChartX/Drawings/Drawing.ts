import { PanGesture } from "../index";
import { DoubleClickGesture } from "../index";
import { ValueScale } from "../index";
import { MagnetMode, MagnetPoint } from "./utils";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import { JsUtil } from "../index";
import {
  DrawingContextMenu,
  DrawingSettingsDialog
} from "../../StockChartX.UI/index";
import {
  ChartPanelObject,
  IChartPanelObjectConfig,
  IChartPanelObjectOptions,
  IChartPanelObjectState
} from "../index";
import { ICloneable } from "../index";
import {
  IPoint,
  IPointBehavior,
  ChartPoint,
  XPointBehavior,
  YPointBehavior,
  IChartPoint
} from "../index";
import { ClassRegistrar, IConstructor } from "../index";
import { GestureArray } from "../index";
import { ClickGesture } from "../index";
import { MouseHoverGesture } from "../index";
import { ChartPanel } from "../index";
import { ContextMenuGesture } from "../index";
import {
  MouseButton,
  IWindowEvent,
  GestureState,
  Gesture
} from "../index";
import { Geometry } from "../index";
import { IRect } from "../index";
import { DrawingCursorClass } from "./utils";
import { ViewLoader } from "../../StockChartX.UI/index";
"use strict";

// import DrawingSettingsDialog = UI.DrawingSettingsDialog;
// const DrawingContextMenu = window.StockChartX.UI.DrawingContextMenu;

// region Interfaces

export interface IDrawingConfig extends IChartPanelObjectConfig {
  points?: IPoint[];
  locked?: boolean;
  resizable?: boolean;
  selectable?: boolean;
  theme?: any;
  createPointBehavior: IPointBehavior;
  magnetMode: string;
  magnetPoint: string;
}

export interface IDrawingOptions extends IChartPanelObjectOptions {
  points: ChartPoint[];
  locked: boolean;
  resizable: boolean;
  selectable: boolean;
  removable: boolean;
  radius: number;
  theme: any;
  createPointBehavior: IPointBehavior;
  magnetMode: string;
  magnetPoint: string;
}

export interface IDrawingState extends IChartPanelObjectState {
  className: string;
}

export interface IDrawingDefaults {
  createPointBehavior?: IPointBehavior;
  zIndex?: number;
  radius?: number;
}

// endregion

// region Declarations

/**
 * Drawing events enumeration values.
 * @name DrawingEvent
 * @enum {string}
 * @property {string} PANEL_CHANGED Drawing panel changed
 * @property {string} VALUE_SCALE_CHANGED Drawing value scale changed
 * @property {string} VISIBLE_CHANGED Drawing visibility changed (visible | invisible)
 * @property {string} POINTS_CHANGED Drawing points changed
 * @property {string} LOCKED_CHANGED When drawing locked or unlocked
 * @property {string} RESIZABLE_CHANGED When drawing becomes resizable or not
 * @property {string} SELECTABLE_CHANGED When drawing becomes selectable or not
 * @property {string} SELECTED_CHANGED Indicates whether drawing is selected or unselected
 * @property {string} THEME_CHANGED Drawing theme changed
 * @property {string} DRAG_STARTED On drawing drag finished (by user)
 * @property {string} DRAG_FINISHED On drawing drag started (by user)
 * @property {string} DOUBLE_CLICK Mouse double click on chart drawing
 * @property {string} CONTEXT_MENU On context menu called (right mouse click)
 * @readonly
 * @memberOf StockChartX
 */
const PANEL_CHANGED = "drawingPanelChanged";
const VALUE_SCALE_CHANGED = "drawingValueScaleChanged";
const VISIBLE_CHANGED = "drawingVisibleChanged";
const POINTS_CHANGED = "drawingPointsChanged";
const LOCKED_CHANGED = "drawingLockedChanged";
const RESIZABLE_CHANGED = "drawingResizableChanged";
const SELECTABLE_CHANGED = "drawingSelectableChanged";
const SELECTED_CHANGED = "drawingSelectedChanged";
const THEME_CHANGED = "drawingThemeChanged";
const DRAG_STARTED = "drawingDragStarted";
const DRAG_FINISHED = "chartUserDrawingDragFinished";
const DOUBLE_CLICK = "chartDrawingDoubleClick";
const CONTEXT_MENU = "chartDrawingContextMenu";

export const DrawingDragPoint = {
  NONE: null,
  ALL: -1,
  MOVE_POINT1: 1,
  MOVE_POINT2: 2
};

const DrawingState = {
  NONE: 0,
  MOVING: 1
};

export const minPointsDistance = 5;

// endregion

class DrawingRegistrar {
  /**
   * @internal
   */
  private static _drawings = new ClassRegistrar<Drawing>();

  /**
   * Gets object with information about registered drawings. Key is class name and value is drawing's constructor.
   * @name registeredDrawings.
   * @type {Object}
   * @memberOf StockChartX.Drawing
   */
  static get registeredDrawings(): object {
    return this._drawings.registeredItems;
  }

  /**
   * Registers new drawing.
   * @method register
   * @param {Function} type The constructor.
   * @memberOf StockChartX.Drawing
   */
  static register(type: typeof Drawing) {
    this._drawings.register(type.className, <IConstructor<Drawing>>(<any>type));
  }

  /**
   * Deserializes drawing.
   * @method deserialize
   * @param {string|Object} state The drawing's state.
   * @returns {StockChartX.Drawing}
   * @memberOf StockChartX.Drawing
   */
  static deserialize(state: string | IDrawingState): Drawing {
    if (!state) return null;

    let drawingState: IDrawingState =
      typeof state === "string" ? <IDrawingState>JSON.parse(state) : state;

    let drawing = this._drawings.createInstance(drawingState.className);
    drawing.loadState(drawingState);

    return drawing;
  }
}

/**
 * Represents abstract chart drawing.
 * @param {object} [config] The configuration object.
 * @param {StockChartX~Point | StockChartX~Point[] | StockChartX.ChartPoint | StockChartX.ChartPoint[]} [config.points] The point(s).
 * @param {StockChartX~Point | StockChartX.ChartPoint} [config.point] The point.
 * @param {boolean} [config.visible] The flag that indicates whether drawing is visible.
 * @param {boolean} [config.selectable] The flag that indicates whether drawing can be selected.
 * @param {boolean} [config.locked] The flag that indicates whether drawing is locked.
 * @param {boolean} [config.resizable] The flag that indicates whether drawing is resizable.
 * @param {object} [config.theme] The theme.
 * @constructor StockChartX.Drawing
 * @abstract
 */
export abstract class Drawing extends ChartPanelObject
  implements ICloneable<Drawing> {
  size: any;
  // region Static properties

  static get subClassName(): string {
    return "abstract";
  }

  static get className(): string {
    return "";
  }

  static defaults: IDrawingDefaults = {
    createPointBehavior: {
      x: XPointBehavior.DATE,
      y: YPointBehavior.VALUE
    },
    zIndex: 200
  };

  // endregion

  // region DrawingRegistrar mixin

  static registeredDrawings: object;
  static register: (type: typeof Drawing) => void;
  static deserialize: (state: IDrawingState) => Drawing;

  // endregion

  // region Properties

  /**
   * @internal
   */
  private _drawingState = DrawingState.NONE;

  /**
   * @internal
   */
  protected get _defaults(): IDrawingDefaults {
    return (<any>this.constructor).defaults;
  }

  get className(): string {
    return (<any>this.constructor).className;
  }

  /**
   * Gets/Sets array of chart points.
   * @name chartPoints
   * @type {StockChartX.ChartPoint[]}
   * @memberOf StockChartX.Drawing#
   */
  get chartPoints(): ChartPoint[] {
    let points = (<IDrawingOptions>this._options).points;

    return this._lastCreatePoint
      ? points.concat(this._lastCreatePoint)
      : points;
  }

  set chartPoints(value: ChartPoint[]) {
    this.setChartPoints(value);
  }

  /**
   * Gets/Sets flag that indicates whether drawing is locked.
   * @name locked
   * @type {boolean}
   * @memberOf StockChartX.Drawing#
   */
  get locked(): boolean {
    return (<IDrawingOptions>this._options).locked;
  }

  set locked(value: boolean) {
    this._setOption("locked", value, LOCKED_CHANGED);
  }

  /**
   * Gets/Sets flag that indicates whether drawing is resizable.
   * @name resizable
   * @type {boolean}
   * @memberOf StockChartX.Drawing#
   */
  get resizable(): boolean {
    return (<IDrawingOptions>this._options).resizable;
  }

  set resizable(value: boolean) {
    this._setOption("resizable", value, RESIZABLE_CHANGED);
  }

  /**
   * Gets/Sets flag that indicates whether drawing is selectable.
   * @name selectable
   * @type {boolean}
   * @memberOf StockChartX.Drawing#
   */
  get selectable(): boolean {
    return (<IDrawingOptions>this._options).selectable;
  }

  set selectable(value: boolean) {
    this._setOption("selectable", value, SELECTABLE_CHANGED);
  }

  get removable(): boolean {
    let flag = (<IDrawingOptions>this._options).removable;

    return flag != null ? flag : true;
  }

  set removable(value: boolean) {
    this._setOption("removable", value);
  }

  get canRemove(): boolean {
    return this.selectable && this.removable && !this.isMoving();
  }

  /**
   * Gets/Sets theme.
   * @name theme
   * @type {object}
   * @memberOf StockChartX.Drawing#
   */
  get theme() {
    return (<IDrawingOptions>this._options).theme;
  }

  set theme(value: object) {
    (<IDrawingOptions>this._options).theme = value;
    this.fire(THEME_CHANGED, value);
  }

  /**
   * Returns actual theme.
   * @name actualTheme
   * @type {object}
   * @memberOf StockChartX.Drawing#
   */
  get actualTheme(): any {
    let theme = (<IDrawingOptions>this._options).theme;
    if (theme) return theme;

    return this.defaultTheme;
  }

  /**
   * Returns default theme.
   * @name defaultTheme
   * @type {any}
   * @memberOf StockChartX.Drawing#
   */
  get defaultTheme(): any {
    let chart = this.chart;
    if (!chart) return null;

    let drawingThemes = chart.theme.drawing;

    return (
      drawingThemes[this.className] ||
      drawingThemes[(<any>this.constructor).subClassName]
    );
  }

  get createPointBehavior(): IPointBehavior {
    return (<IDrawingOptions>this._options).createPointBehavior;
  }

  set createPointBehavior(value: IPointBehavior) {
    (<IDrawingOptions>this._options).createPointBehavior = value;
  }

  get magnetMode(): string {
    return (<IDrawingOptions>this._options).magnetMode;
  }

  set magnetMode(value: string) {
    (<IDrawingOptions>this._options).magnetMode = value;
  }

  get magnetPoint(): string {
    return (<IDrawingOptions>this._options).magnetPoint;
  }

  set magnetPoint(value: string) {
    (<IDrawingOptions>this._options).magnetPoint = value;
  }

  /**
   * @internal
   */
  protected _selected: boolean = false;
  /**
   * Gets/Sets flag that indicates whether drawing is selected.
   * @name selected
   * @type {boolean}
   * @memberOf StockChartX.Drawing#
   */
  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    value = !!value;

    let oldValue = this._selected,
      isChanged = oldValue !== value;
    if (isChanged) {
      this._selected = value;

      let chart = this.chart;
      if (chart) {
        if (value) chart.selectedObject = this;
        else if (this === chart.selectedObject) chart.selectedObject = null;
      }
      this._onSelectedChanged();
      this.fire(SELECTED_CHANGED, value, oldValue);
    }
  }

  protected get canHandleEvents(): boolean {
    return this.visible && this.chart.showDrawings;
  }

  /**
   * @internal
   */
  private _gestures: GestureArray;

  /**
   * @internal
   */
  private _createClickGesture: ClickGesture;

  /**
   * @internal
   */
  private _createMoveGesture: MouseHoverGesture;

  /**
   * @internal
   */
  private _lastCreatePoint: ChartPoint;

  /**
   * @internal
   */
  protected _dragPoint: number = DrawingDragPoint.NONE;

  /**
   * Returns true if drawing can be selected, false otherwise.
   * @name canSelect
   * @type {boolean}
   * @readonly
   * @memberOf StockChartX.Drawing#
   */
  get canSelect(): boolean {
    return this.selectable;
  }

  /**
   * Returns true if drawing can be moved, false otherwise.
   * @name canMove
   * @type {boolean}
   * @readonly
   * @memberOf StockChartX.Drawing#
   */
  get canMove(): boolean {
    return this.selectable && !this.locked;
  }

  /**
   * Returns true if drawing can be resized, false otherwise.
   * @name canResize
   * @type {boolean}
   * @readonly
   * @memberOf StockChartX.Drawing#
   */
  get canResize(): boolean {
    return this.selectable && this.resizable && !this.locked;
  }

  /**
   * Returns number of required points for the drawing.
   * @name pointsNeeded
   * @type {number}
   * @readonly
   * @memberOf StockChartX.Drawing#
   */
  get pointsNeeded(): number {
    return 1;
  }

  /**
   * @internal
   */
  private _contextMenu: DrawingContextMenu;

  // endregion

  constructor(config?: IDrawingConfig) {
    super(config);

    this.loadState(<IDrawingState>(<any>config));
    this._initGestures();

    this._contextMenu = new DrawingContextMenu({
      drawing: this,
      onShow: () => {
        this.select();
      },
      onItemSelected: (menuItem: JQuery, checked: boolean) => {
        let id = menuItem.data("id");

        if (!this.chart) return undefined;

        switch (id) {
          case DrawingContextMenu.MenuItem.SETTINGS:
            this._showSettingsDialog();
            break;
          case DrawingContextMenu.MenuItem.CLONE:
            this.chart._copyDrawing();
            this.chart._pasteDrawing();
            break;
          case DrawingContextMenu.MenuItem.DELETE:
            if (this.canRemove) this.remove();
            break;
          default:
            throw new Error(`Unknown menu item ${id}`);
        }
      }
    });
  }

  // region On property changed

  /**
   * Returns localization keys for drawing's points
   * @method pointsLocalizationKeys
   * @returns {string[]} Array of points localization keys
   * @memberOf StockChartX.Drawing#
   */
  pointsLocalizationKeys(): string[] {
    return null;
  }

  /**
   * @internal
   */
  protected _onSelectedChanged() {}

  /**
   * @internal
   */
  protected _onChartPanelChanged(oldValue: ChartPanel) {
    this.tooltip.applyTheme();
    this.fire(PANEL_CHANGED, this.chartPanel, oldValue);
  }

  /**
   * @internal
   */
  protected _onValueScaleChanged(oldValue: ValueScale) {
    this.fire(VALUE_SCALE_CHANGED, this.valueScale, oldValue);
  }

  /**
   * @internal
   */
  protected _onVisibleChanged(oldValue: boolean) {
    this.fire(VISIBLE_CHANGED, this.visible, oldValue);
  }

  // endregion

  /**
   * @internal
   */
  protected _optionValue(key: string): any {
    let value = this._options[key];
    if (value != null) return value;

    return this._defaults[key];
  }

  /**
   * @internal
   */
  protected _isLargeEnough(): boolean {
    let points = this.cartesianPoints();

    if (points.length === 1) return true;

    for (let i = 1; i < points.length; i++) {
      let prevPoint = points[i - 1],
        currPoint = points[i];

      if (
        Math.abs(prevPoint.x - currPoint.x) > minPointsDistance ||
        Math.abs(prevPoint.y - currPoint.y) > minPointsDistance
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * @internal
   */
  private _initGestures() {
    this._gestures = new GestureArray(
      [
        new ClickGesture({
          handler: this._handleClickGesture,
          hitTest: this._clickGestureHitTest
        }),
        new DoubleClickGesture({
          handler: this._handleDoubleClickGesture,
          hitTest: this.hitTest
        }),
        new ContextMenuGesture({
          handler: this._handleContextMenuGesture,
          hitTest: this._clickGestureHitTest
        }),
        new PanGesture({
          handler: this._handlePanGestureInternal,
          hitTest: this._panGestureHitTest,
          button: MouseButton.LEFT
        }),
        new MouseHoverGesture({
          handler: this._handleMouseHoverGestureInternal,
          enterEventEnabled: true,
          hoverEventEnabled: true,
          leaveEventEnabled: true,
          hitTest: this.hitTest
        })
      ],
      this
    );
  }

  /**
   * @internal
   */
  private _handleMouseHoverGestureInternal(
    gesture: MouseHoverGesture,
    event: IWindowEvent
  ) {
    let tooltip = this.tooltip;

    if (
      !this.chart.showDrawingTooltips ||
      this._drawingState === DrawingState.MOVING
    ) {
      tooltip.hide();

      return;
    }

    if (this._handleMouseHoverGesture(gesture, event)) return;

    switch (gesture.state) {
      case GestureState.STARTED:
      case GestureState.CONTINUED:
        this.showTooltip(event.pointerPosition);
        break;
      case GestureState.FINISHED:
        this.hideTooltip();
        break;
      default:
        break;
    }
  }

  /**
   * @internal
   */
  //noinspection JSUnusedLocalSymbols
  protected _handleMouseHoverGesture(
    gesture: MouseHoverGesture,
    event: IWindowEvent
  ): boolean {
    return false;
  }

  /**
   * @internal
   */
  private _clickGestureHitTest(point: IPoint): boolean {
    return this.visible && this.canSelect && this.hitTest(point);
  }

  /**
   * @internal
   */
  private _panGestureHitTest(point: IPoint): boolean {
    return this.visible && this.canMove && this.hitTest(point);
  }

  /**
   * @internal
   */
  private _handlePanGestureInternal(gesture: PanGesture, event: IWindowEvent) {
    this._drawingState =
      gesture.state !== GestureState.FINISHED
        ? DrawingState.MOVING
        : DrawingState.NONE;

    if (this._contextMenu && gesture.state === GestureState.CONTINUED) {
      this._contextMenu.hide();
    }

    this.tooltip.hide();

    if (gesture.state === GestureState.CONTINUED) {
      if (this.magnetMode !== MagnetMode.NONE)
        event.pointerPosition = this._magnetizePoint(event.pointerPosition);
    }

    if (!this.canResize || !this._handlePanGesture(gesture, event)) {
      switch (gesture.state) {
        case GestureState.STARTED:
          let oldSelectedObject = this.chart.selectedObject;

          this._setDragPoint(DrawingDragPoint.ALL);
          this.changeCursor(DrawingCursorClass.MOVE);
          if (oldSelectedObject !== this) {
            this.setNeedsUpdateChart();

            return;
          }

          break;
        case GestureState.FINISHED:
          this._setDragPoint(DrawingDragPoint.NONE);
          break;
        case GestureState.CONTINUED:
          if (this._dragPoint === DrawingDragPoint.ALL) {
            if (
              this.magnetMode !== MagnetMode.NONE &&
              this.chartPoints.length === 1
            ) {
              let magnetPoint = this._magnetizePoint(event.pointerPosition);
              this.chartPoints[0].moveToPoint(magnetPoint, this.projection);
            } else {
              let projection = this.projection,
                offset = gesture.moveOffset;

              for (let point of this.chartPoints) {
                point.translate(offset.x, offset.y, projection);
              }
            }
          }
          break;
        default:
          break;
      }
    }
    if (gesture.state === GestureState.FINISHED) this.changeCursor();

    this.setNeedsUpdatePanel();
  }

  /**
   * @internal
   */
  protected _magnetizePoint(point: IPoint): IPoint {
    let magnetMode = this.magnetMode;
    if (magnetMode === MagnetMode.NONE) return point;

    let projection = this.projection,
      record = projection.recordByX(point.x);
    if (record < 0 || record >= this.chart.recordCount) return point;

    let bar = this.chart.primaryBar(record);
    if (!bar) return point;

    let magnetPoint = {
      x: projection.xByRecord(record),
      y: 0
    };

    switch (this.magnetPoint) {
      case MagnetPoint.OPEN:
        magnetPoint.y = projection.yByValue(bar.open);
        break;
      case MagnetPoint.HIGH:
        magnetPoint.y = projection.yByValue(bar.high);
        break;
      case MagnetPoint.LOW:
        magnetPoint.y = projection.yByValue(bar.low);
        break;
      case MagnetPoint.CLOSE:
        magnetPoint.y = projection.yByValue(bar.close);
        break;
      case MagnetPoint.BAR:
        switch (this.magnetMode) {
          case MagnetMode.NEAR:
            magnetPoint.y = projection.yByValue(bar.high);
            if (this._canMagnetizeToPoint(point, magnetPoint))
              return magnetPoint;

            magnetPoint.y = projection.yByValue(bar.low);
            if (this._canMagnetizeToPoint(point, magnetPoint))
              return magnetPoint;

            magnetPoint.y = projection.yByValue(bar.open);
            if (this._canMagnetizeToPoint(point, magnetPoint))
              return magnetPoint;

            magnetPoint.y = projection.yByValue(bar.close);
            if (this._canMagnetizeToPoint(point, magnetPoint))
              return magnetPoint;

            return point;
          case MagnetMode.ALWAYS:
            let yHigh = projection.yByValue(bar.high),
              yLow = projection.yByValue(bar.low),
              yOpen = projection.yByValue(bar.open),
              yClose = projection.yByValue(bar.close);

            let points = [
              { y: yHigh, distance: Math.abs(yHigh - point.y) },
              { y: yLow, distance: Math.abs(yLow - point.y) },
              { y: yOpen, distance: Math.abs(yOpen - point.y) },
              { y: yClose, distance: Math.abs(yClose - point.y) }
            ];
            let min = points.reduce(
              (
                prev: { y: number; distance: number },
                cur: { y: number; distance: number }
              ) => (cur.distance < prev.distance ? cur : prev),
              points[0]
            );
            magnetPoint.y = min.y;

            return magnetPoint;
          default:
            break;
        }
        break;
      default:
        break;
    }

    return this._canMagnetizeToPoint(point, magnetPoint) ? magnetPoint : point;
  }

  /**
   * @internal
   */
  private _canMagnetizeToPoint(
    sourcePoint: IPoint,
    magnetPoint: IPoint
  ): boolean {
    switch (this.magnetMode) {
      case MagnetMode.NONE:
        return false;
      case MagnetMode.ALWAYS:
        return true;
      case MagnetMode.NEAR:
        let prevDeviation = Geometry.DEVIATION,
          isNear;

        Geometry.DEVIATION = Geometry.MAGNET_DEVIATION;
        try {
          isNear = Geometry.isPointNearPoint(sourcePoint, magnetPoint);
        } finally {
          Geometry.DEVIATION = prevDeviation;
        }

        return isNear;
      default:
        throw new Error(`Unknown magnet mode: ${this.magnetMode}`);
    }
  }

  /**
   * @internal
   */
  private _handleClickGesture() {
    if (!this.selected && this.canSelect) {
      this.select();
      this.setNeedsUpdateChart();
    }
  }

  /**
   * @internal
   */
  protected _handleDoubleClickGesture() {
    this.fire(DOUBLE_CLICK, this);

    if (this.selectable) {
      this._showSettingsDialog();
    }
  }

  /**
   * @internal
   */
  protected _handleContextMenuGesture(gesture: Gesture, event: IWindowEvent) {
    this.fire(CONTEXT_MENU, this);

    if (this.selectable) {
      this.chart.localize(this._contextMenu.container);
      this._contextMenu.show(event.evt);
    }
  }

  /**
   * @internal
   */
  // noinspection JSMethodCanBeStatic, JSUnusedLocalSymbols
  protected _handleUserDrawingPoint(point: IChartPoint): boolean {
    return false;
  }

  /**
   * @internal
   */
  // noinspection JSUnusedLocalSymbols
  private _handleUserDrawingClickGesture(
    gesture: ClickGesture,
    event: IWindowEvent
  ) {
    if (!this.chartPanel) {
      event.chartPanel.addDrawings(this);
    }

    let point = this._normalizeUserDrawingPoint(event.pointerPosition);

    this._lastCreatePoint = null;
    if (!this._handleUserDrawingPoint(point)) {
      this.appendChartPoint(point);
    }
    if (this.chartPoints.length >= this.pointsNeeded) {
      if (this._isLargeEnough()) this._finishUserDrawing();
      else {
        this.chartPoints.pop();

        return;
      }
    }

    this.setNeedsUpdatePanel();
  }

  /**
   * @internal
   */
  // noinspection JSUnusedLocalSymbols
  protected _handleUserDrawingMoveGesture(
    gesture: MouseHoverGesture,
    event: IWindowEvent
  ) {
    if (this.chartPoints.length > 0) {
      this._lastCreatePoint = this._normalizeUserDrawingPoint(
        event.pointerPosition
      );

      this.setNeedsUpdatePanel();
    }
  }

  /**
   * @internal
   */
  protected _normalizeUserDrawingPoint(point: IPoint): ChartPoint {
    return ChartPoint.convert(point, this.createPointBehavior, this.projection);
  }

  /**
   * @internal
   */
  protected _showSettingsDialog(): void {
    if (!this.chart) return;

    ViewLoader.drawingSettingsDialog((dialog: DrawingSettingsDialog) => {
      dialog.show({
        chart: this.chart,
        drawing: this
      });
    });
  }

  // region Point routines

  setChartPoints(points: IChartPoint | IChartPoint[]) {
    let chartPoints: IChartPoint[];

    if (!points) {
      chartPoints = [];
    }
    if (points instanceof ChartPoint) {
      chartPoints = [points];
    } else if (Array.isArray(points)) {
      chartPoints = [];
      for (let point of points) chartPoints.push(new ChartPoint(point));
    } else {
      chartPoints = [new ChartPoint(points)];
    }

    this._setOption("points", chartPoints, POINTS_CHANGED);
  }

  /**
   * Sets chartPoints with normalization
   * @method setChartPointsWithNormalize
   * @param {IPoint[]} points
   * @memberOf StockChartX.Drawing#
   */
  setChartPointsWithNormalize(points: IPoint[]) {
    let chartPoints = points.map(this._normalizeUserDrawingPoint.bind(this));

    this.setChartPoints(chartPoints);
  }

  /**
   * Appends new chart point.
   * @method appendChartPoint
   * @param {StockChartX~Point | StockChartX.ChartPoint} point The point to append.
   * @returns {StockChartX.ChartPoint[]} The array of drawing's points.
   * @memberOf StockChartX.Drawing#
   * @example
   *  var drawing = new StockChartX.DotDrawing();
   *  drawing.appendChartPoint({record: 10, value: 20.0});
   */
  appendChartPoint(point: IChartPoint) {
    let points = (<IDrawingOptions>this._options).points;

    points.push(new ChartPoint(point));

    return points;
  }

  /**
   * Converts chart point to cartesian point.
   * @method cartesianPoint
   * @param {number} index The index of point.
   * @returns {StockChartX~Point}
   * @memberOf StockChartX.Drawing#
   * @example
   *  var point = drawing.getCartesianPoint(0);
   *  var x = point.x;
   *  var y = point.y;
   */
  cartesianPoint(index: number): IPoint {
    let point = this.chartPoints[index];

    return point && point.toPoint(this.projection);
  }

  /**
   * Converts all chart points to cartesian points.
   * @method cartesianPoints
   * @returns {StockChartX~Point[]}
   * @memberOf StockChartX.Drawing#
   */
  cartesianPoints(): IPoint[] {
    let projection = this.projection;

    return this.chartPoints.map((item: ChartPoint) => item.toPoint(projection));
  }

  // endregion

  /**
   * Makes drawing selected.
   * @method select
   * @memberOf StockChartX.Drawing#
   */
  select() {
    if (!this.selected && this.canSelect) this.chart.selectObject(this);
  }

  /**
   * Translates drawing onto a given distance.
   * @method translate
   * @param {number} dx The X offset.
   * @param {number} dy The Y offset.
   * @memberOf StockChartX.Drawing#
   * @example
   *  drawing.translate(5, 5);
   */
  translate(dx: number, dy: number) {
    let projection = this.projection;

    for (let chartPoint of this.chartPoints) {
      chartPoint.translate(dx, dy, projection);
    }
  }

  /**
   * Returns bounds rectangle.
   * @method bounds
   * @returns {StockChartX~Rect}
   * @memberOf StockChartX.Drawing#
   */
  bounds(): IRect {
    return null;
  }

  startUserDrawing() {
    this._createClickGesture = new ClickGesture({
      hitTest: () => true,
      handler: this._handleUserDrawingClickGesture,
      context: this
    });
    this._createMoveGesture = new MouseHoverGesture({
      enterEventEnabled: false,
      leaveEventEnabled: false,
      hitTest: () => true,
      handler: this._handleUserDrawingMoveGesture,
      context: this
    });

    this.chartPoints = [];
    this.selected = true;
    this.remove();
  }

  _finishUserDrawing() {
    this._createClickGesture = null;
    this._createMoveGesture = null;
    this._lastCreatePoint = null;

    this.tooltip.applyTheme();
    this.chart._finishUserDrawing();
  }

  hitTest(point: IPoint): boolean {
    return false;
  }

  handleEvent(event: IWindowEvent): boolean {
    if (this._createClickGesture) {
      return (
        this._createClickGesture.handleEvent(event) ||
        this._createMoveGesture.handleEvent(event)
      );
    }

    return this._gestures.handleEvent(event);
  }

  /**
   * @internal
   */
  protected _handlePanGesture(
    gesture: PanGesture,
    event: IWindowEvent
  ): boolean {
    return false;
  }

  _setDragPoint(dragPoint: number) {
    if (this._dragPoint !== dragPoint) {
      this._dragPoint = dragPoint;

      if (this._dragPoint === DrawingDragPoint.NONE) this.fire(DRAG_FINISHED);
      else {
        this.fire(DRAG_STARTED);
        this.select();
      }
    }
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @internal
   */
  protected _getSelectionMarkerWidth(theme: any): number {
    return (
      ((<number>theme && <number>theme.line && <number>theme.line.width) || 1) +
      2
    );
  }

  /**
   * @internal
   */
  protected _drawSelectionMarkers(points: IPoint | IPoint[]) {
    if (!points) return;

    let marker = this.chart.selectionMarker;

    marker.width = this._getSelectionMarkerWidth(this.actualTheme);
    if (Array.isArray(points)) {
      for (let point of points) marker.draw(this.context, point);
    } else {
      marker.draw(this.context, points);
    }
  }

  // region State management

  /**
   * @inheritdoc
   */
  saveState(): IDrawingState {
    let state = <IDrawingState>super.saveState();
    state.className = this.className;

    return state;
  }

  /**
   * @inheritdoc
   */
  loadState(state: IDrawingState) {
    state = state || <IDrawingState>{};

    super.loadState(state);

    let altState: any = state,
      options = <IDrawingOptions>(state.options || {}),
      suppress = this.suppressEvents(true);

    if (!this.createPointBehavior) {
      this.createPointBehavior =
        altState.createPointBehavior ||
        this._defaults.createPointBehavior ||
        Drawing.defaults.createPointBehavior;
    }

    this.chartPoints =
      altState.point || altState.points || (options && options.points);
    if (options.visible == null)
      this.visible = altState.visible != null ? altState.visible : true;
    if (options.selectable == null)
      this.selectable =
        altState.selectable != null ? altState.selectable : true;
    if (options.locked == null)
      this.locked = altState.locked != null ? altState.locked : false;
    if (options.resizable == null)
      this.resizable = altState.resizable != null ? altState.resizable : true;
    if (options.theme == null) this.theme = altState.theme;

    if (!options.magnetMode)
      this.magnetMode = altState.magnetMode || MagnetMode.NONE;
    if (!options.magnetPoint)
      this.magnetPoint = altState.magnetPoint || MagnetPoint.BAR;
    if (this.zIndex == null)
      this.zIndex =
        altState.zIndex || this._defaults.zIndex || Drawing.defaults.zIndex;

    this.suppressEvents(suppress);
  }

  // endregion

  /**
   * Draws markers on the value scale.
   * @method drawValueMarkers
   * @memberOf StockChartX.Drawing#
   */
  drawValueMarkers() {}

  /**
   * Draws markers on the date scale.
   * @method drawDateMarkers
   * @memberOf StockChartX.Drawing#
   */
  drawDateMarkers() {}

  clone(): Drawing {
    let drawing = Drawing.deserialize(this.saveState());
    drawing.chartPanel = this.chartPanel;

    return drawing;
  }

  remove(): boolean {
    let panel = this.chartPanel;
    if (!panel) return false;

    panel.forceRemoveDrawings(this);
    this.setNeedsUpdatePanel();
    this.chartPanel = null;

    return true;
  }

  setNeedsUpdateChart() {
    let chart = this.chart;
    if (chart) chart.setNeedsUpdate();
  }

  setNeedsUpdatePanel() {
    let panel = this.chartPanel;
    if (panel) panel.setNeedsUpdate();
  }

  private isMoving(): boolean {
    return this._drawingState === DrawingState.MOVING;
  }

  // region IDestroyable

  /**
   * @inheritdoc
   */
  destroy() {
    this.chart.rootDiv.removeClass(DrawingCursorClass.MOVE);
    super.destroy();
  }

  // endregion
}

JsUtil.applyMixins(Drawing, [DrawingRegistrar]);
