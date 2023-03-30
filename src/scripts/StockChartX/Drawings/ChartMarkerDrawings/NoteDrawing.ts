/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import {
  Drawing,
  IDrawingConfig,
  IDrawingOptions,
  IDrawingDefaults
} from "../../index";
import { IRect } from "../../index";
import { IPoint } from "../../index";
import { Geometry } from "../../index";
import { DummyCanvasContext } from "../../index";
import { DrawingClassNames, DrawingDefaults } from "../utils";

// @if SCX_LICENSE != 'free'

"use strict";

// region Interfaces

export interface INoteDrawingConfig extends IDrawingConfig {
  label: string;
}

export interface INoteDrawingOptions extends IDrawingOptions {
  label: string;
}

export interface INoteDrawingDefaults extends IDrawingDefaults {
  label: string;
}

// endregion

export class NoteDrawing extends Drawing {
  // region Static members

  static get className(): string {
    return DrawingClassNames.NoteDrawing;
  }

  static defaults: INoteDrawingDefaults = DrawingDefaults.NoteDrawing;

  // endregion

  // region Private members

  /**
   * @internal
   */
  private _radius = 12;

  // endregion

  // region Properties

  get label(): string {
    return (
      (<INoteDrawingOptions>this._options).label ||
      (<INoteDrawingDefaults>this._defaults).label ||
      ""
    );
  }

  set label(value: string) {
    if (value.length === 0) return;

    (<INoteDrawingOptions>this._options).label = value[0];
  }

  // endregion

  constructor(config?: INoteDrawingConfig) {
    super(config);
  }

  /**
   * @inheritDoc
   */
  pointsLocalizationKeys(): string[] {
    let chartPointsNames = ["drawingSettingDialog.start"];

    return chartPointsNames;
  }

  /**
   * @inheritdoc
   */
  bounds(): IRect {
    let center = this.cartesianPoint(0);
    if (!center) return null;

    let radius = this._radius;

    return {
      left: center.x - radius,
      top: center.y - radius * 2.7,
      width: 2 * radius,
      height: 2 * radius + 7
    };
  }

  /**
   * @inheritdoc
   */
  hitTest(point: IPoint): boolean {
    if (!this.canHandleEvents) return false;

    let center = this.cartesianPoint(0);
    if (!center) return false;

    return (
      Geometry.isPointInsideOrNearCircle(
        point,
        { x: center.x, y: center.y - 20 },
        this._radius
      ) || Geometry.isPointNearPoint(point, center)
    );
  }

  // protected _handleMouseHoverGesture(gesture:MouseHoverGesture, event:IWindowEvent): boolean {
  //     if (!this.selected) {
  //         switch (gesture.state) {
  //             case GestureState.STARTED:
  //                 this.tooltip.show();
  //                 break;
  //             case GestureState.FINISHED:
  //                 this.tooltip.hide();
  //                 break;
  //         }
  //     }
  // }

  /**
   * @inheritdoc
   */
  draw() {
    if (!this.visible) return;

    let center = this.cartesianPoint(0);
    if (!center) return;

    let textWidth = DummyCanvasContext.textWidth(
      this.label,
      this.actualTheme.text
    );
    this._radius = 12 + textWidth / 3;
    let ctx = this.context,
      theme = this.actualTheme,
      x = center.x,
      bezierCurveHeight = 18 + textWidth,
      y = center.y - bezierCurveHeight,
      bezierCurveWidth = 6 + textWidth / 9,
      bezierCurveY = 12 + textWidth,
      bezierCurveX = 10;

    ctx.beginPath();
    ctx.moveTo(x - this._radius / 2, y);
    ctx.lineTo(x + this._radius / 2, y);
    ctx.arc(x, y, this._radius, 0, 2 * Math.PI);
    ctx.moveTo(x + this._radius / 2 + bezierCurveWidth, y + 2);
    ctx.bezierCurveTo(
      x + this._radius / 2 + bezierCurveWidth,
      y,
      x + bezierCurveX,
      y + bezierCurveY,
      x,
      y + bezierCurveHeight
    );
    ctx.bezierCurveTo(
      x,
      y + bezierCurveHeight,
      x - bezierCurveX,
      y + bezierCurveY,
      x - this._radius / 2 - bezierCurveWidth,
      y
    );
    ctx.scxFillStroke(theme.fill, theme.stroke);
    ctx.beginPath();
    ctx.moveTo(x - (this._radius - 3 / 2), y);
    ctx.lineTo(x + (this._radius - 3 / 2), y);
    ctx.arc(x, y, this._radius - 3, 0, 2 * Math.PI);
    ctx.scxFillStroke(theme.centerPointFill, theme.stroke);

    ctx.scxApplyTextTheme(theme.text);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.label, x, y);

    if (this.selected) {
      this._drawSelectionMarkers(center);
    }
  }
}

Drawing.register(NoteDrawing);

// @endif
