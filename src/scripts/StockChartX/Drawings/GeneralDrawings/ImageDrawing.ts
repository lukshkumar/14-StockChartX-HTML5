/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

// @if SCX_LICENSE != 'free'

"use strict";

import {
  Drawing,
  IDrawingConfig,
  IDrawingOptions,
  IDrawingState
} from "../../index";
import { ISize, IRect } from "../../index";
import { SIZE_CHANGED } from "../../index";
import { IPoint } from "../../index";
import { DrawingSettingsDialog } from "../../../StockChartX.UI/index";
import { Geometry } from "../../index";
import { PanGesture } from "../../index";
import { IWindowEvent, GestureState } from "../../index";
import { ViewLoader } from "../../../StockChartX.UI/index";
import {
  DrawingCursorClass,
  DrawingClassNames
} from "../utils";

// region Interfaces

export interface IImageDrawingConfig extends IDrawingConfig {
  url: string;
  size?: ISize;
}

export interface IImageDrawingOptions extends IDrawingOptions {
  url: string;
  size: ISize;
}

// endregion

// region Declarations

/**
 * Drawing events enumeration values.
 * @name DrawingEvent
 * @enum {string}
 * @property {string} URL_CHANGED Image URL changed
 * @readonly
 * @memberOf StockChartX
 */
const URL_CHANGED = "drawingUrlChanged";

const NoImageSize = {
  width: 10,
  height: 10
};

// endregion

/**
 * Represents image drawing.
 * @param {object} [config] The configuration object.
 * @param {string} [config.url] The image url.
 * @constructor StockChartX.ImageDrawing
 * @augments StockChartX.Drawing
 * @example
 *  // Create image drawing.
 *  var image1 = new StockChartX.ImageDrawing({
 *      point: {x: 10, y: 20},
 *      url: 'img/image.png'
 *  });
 *
 *  // Create image drawing.
 *  var image2 = new StockChartX.ImageDrawing({
 *      point: {record: 10, value: 20.0},
 *      url: 'http://wwww.server.com/img/image.png
 *  });
 */
export class ImageDrawing extends Drawing {
  static get className(): string {
    return DrawingClassNames.ImageDrawing;
  }

  /**
   * @internal
   */
  private _image = new Image();

  // region Properties

  /**
   * Gets/Sets image url.
   * @name url
   * @type {string}
   * @memberOf StockChartX.ImageDrawing#
   */
  get url(): string {
    return (<IImageDrawingOptions>this._options).url || "";
  }

  set url(value: string) {
    this._setOption("url", value, URL_CHANGED);
    this._reloadImage();
  }

  /**
   * Gets/Sets image size.
   * @name size
   * @type {StockChartX~Size}
   * @memberOf StockChartX.ImageDrawing#
   */
  get size(): ISize {
    return (<IImageDrawingOptions>this._options).size;
  }

  set size(value: ISize) {
    this._setOption("size", value, SIZE_CHANGED);
  }

  get actualSize(): ISize {
    let size = this.size;
    if (size) return size;

    let image = this._image;
    if (!image) return null;

    return {
      width: image.width,
      height: image.height
    };
  }

  // endregion

  constructor(config?: IImageDrawingConfig) {
    super(config);

    this._image.onload = () => {
      let panel = this.chartPanel;

      if (panel) panel.setNeedsUpdate();
    };
    this.url = config && config.url;
  }

  /**
   * @inheritDoc
   */
  pointsLocalizationKeys(): string[] {
    let chartPointsNames = ["drawingSettingDialog.start"];

    return chartPointsNames;
  }

  /**
   * @internal
   */
  private _reloadImage() {
    if (this._image) {
      this._image.src = this.url;
    }
  }

  /**
   * @inheritdoc
   */
  bounds(): IRect {
    let point = this.cartesianPoint(0);
    if (!point) return null;

    let size = this.actualSize;
    if (!size) return null;

    return {
      left: point.x,
      top: point.y,
      width: size.width || NoImageSize.width,
      height: size.height || NoImageSize.height
    };
  }

  /**
   * @internal
   */
  private _markerPoints(point?: IPoint): IPoint | IPoint[] {
    if (!point) point = this.cartesianPoint(0);

    let image = this._image,
      left = point.x,
      top = point.y;

    if (image.width <= 0) {
      return {
        x: Math.round(left + NoImageSize.width / 2),
        y: Math.round(top + NoImageSize.height / 2)
      };
    }

    let size = this.actualSize,
      right = left + size.width,
      bottom = top + size.height,
      midX = Math.round((left + right) / 2),
      midY = Math.round((top + bottom) / 2);

    return [
      point, // left top
      { x: midX, y: top }, // middle top
      { x: right, y: top }, // right top
      { x: right, y: midY }, // middle right
      { x: right, y: bottom }, // right bottom
      { x: midX, y: bottom }, // middle bottom
      { x: left, y: bottom }, // left bottom
      { x: left, y: midY } // middle left
    ];
  }

  _finishUserDrawing() {
    super._finishUserDrawing();

    ViewLoader.drawingSettingsDialog((dialog: DrawingSettingsDialog) => {
      dialog.show({
        chart: this.chart,
        drawing: this,
        cancel: () => {
          this.chartPanel.removeDrawings(this);
        },
        always: () => {
          if (this.chartPanel) this.chartPanel.setNeedsUpdate();
        }
      });
    });
  }

  /**
   * @inheritdoc
   */
  hitTest(point: IPoint): boolean {
    if (!this.canHandleEvents) return false;

    let bounds = this.bounds();

    return bounds && Geometry.isPointInsideOrNearRect(point, bounds);
  }

  /**
   * @inheritdoc
   */
  loadState(state: IDrawingState) {
    super.loadState(state);

    this._reloadImage();
  }

  /**
   * @internal
   */
  protected _handlePanGesture(
    gesture: PanGesture,
    event: IWindowEvent
  ): boolean {
    switch (gesture.state) {
      case GestureState.STARTED:
        let markerPoints = <IPoint[]>this._markerPoints();
        if (markerPoints && markerPoints.length > 1) {
          for (let i = 0; i < markerPoints.length; i++) {
            if (
              Geometry.isPointNearPoint(event.pointerPosition, markerPoints[i])
            ) {
              this._setDragPoint(i);
              this._updateCursor();

              return true;
            }
          }
        }
        break;
      case GestureState.CONTINUED:
        if (this._dragPoint < 0) break;

        let projection = this.projection,
          point = this.chartPoints[0],
          pos = event.pointerPosition,
          size = this.actualSize,
          offset = gesture.moveOffset,
          oldPoint = point.toPoint(projection);

        switch (this._dragPoint) {
          case 0: // left top point
            if (size) {
              let startWidth = size.width;
              let startHeight = size.height;
              let scale = size.width / size.height;
              size.width -= offset.x;
              size.height = size.width / scale;
              point.moveTo(
                oldPoint.x + (startWidth - size.width),
                oldPoint.y + (startHeight - size.height),
                projection
              );
            }
            break;
          case 1: // middle top point
            point.moveToY(pos.y, projection);
            if (size) {
              size.height -= point.getY(projection) - oldPoint.y;
            }
            break;
          case 2: // right top point
            if (size) {
              let startHeight = size.height;
              let scale = size.width / size.height;
              size.height -= offset.y;
              size.width = size.height * scale;
              point.moveToY(
                oldPoint.y + (startHeight - size.height),
                projection
              );
            }

            break;
          case 3: // middle right point
            if (size) {
              size.width += offset.x;
            }
            break;
          case 4: // right bottom point
            if (size) {
              let scale = size.width / size.height;
              size.width += offset.x;
              size.height = size.width / scale;
            }
            break;
          case 5: // middle bottom point
            if (size) {
              size.height += offset.y;
            }
            break;
          case 6: // left bottom point
            if (size) {
              let startWidth = size.width;
              let scale = size.width / size.height;
              size.width -= offset.x;
              size.height = size.width / scale;
              point.moveToX(oldPoint.x + (startWidth - size.width), projection);
            }
            break;
          case 7: // left middle point
            point.moveToX(pos.x, projection);
            if (size) {
              size.width -= point.getX(projection) - oldPoint.x;
            }
            break;
          default:
            return true;
        }
        this.size = size;

        return true;
      default:
        break;
    }

    return false;
  }

  /**
   * @internal
   */
  private _updateCursor() {
    let cursorClass;

    switch (this._dragPoint) {
      case 0: // left top point
      case 4: // right bottom point
        cursorClass = DrawingCursorClass.RESIZE_NWSE;
        break;
      case 1: // middle top point
      case 5: // middle bottom point
        cursorClass = DrawingCursorClass.RESIZE_NS;
        break;
      case 2: // right top point
      case 6: // left bottom point
        cursorClass = DrawingCursorClass.RESIZE_NESW;
        break;
      case 3: // middle right point
      case 7: // left middle point
        cursorClass = DrawingCursorClass.RESIZE_EW;
        break;
      default:
        break;
    }

    if (cursorClass) this.changeCursor(cursorClass);
  }

  /**
   * @inheritdoc
   */
  draw() {
    if (!this.visible) return;

    let point = this.cartesianPoint(0);
    if (!point) return;

    let context = this.context,
      left = point.x,
      top = point.y;

    if (this._image.width > 0) {
      let size = this.size;

      if (size) {
        if (size.width < 0) left += size.width;
        if (size.height < 0) top += size.height;
        context.drawImage(
          this._image,
          left,
          top,
          Math.abs(size.width),
          Math.abs(size.height)
        );
      } else {
        context.drawImage(this._image, left, top);
      }
    } else {
      context.beginPath();

      context.rect(left, top, NoImageSize.width, NoImageSize.height);

      context.moveTo(left, top);
      context.lineTo(left + NoImageSize.width, top + NoImageSize.height);

      context.moveTo(left, top + NoImageSize.height);
      context.lineTo(left + NoImageSize.width, top);

      context.scxStroke({ strokeColor: "red", width: 1 });
    }

    if (this.selected) this._drawSelectionMarkers(this._markerPoints(point));
  }
}

Drawing.register(ImageDrawing);

// @endif
