/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

/* tslint:disable:interface-name */
/**
 * @internal
 */
import {
  IStrokeTheme,
  IFillTheme,
  ITextTheme,
  StrokeDefaults,
  StrokePriority,
  LineStyle,
  DashArray,
  FontDefaults,
  ILinearGradientFillTheme
} from "../index";
import { IPoint } from "../index";
declare global {
  interface CanvasRenderingContext2D {
    scxApplyStrokeTheme(theme: IStrokeTheme): CanvasRenderingContext2D;
    scxApplyFillTheme(theme: IFillTheme): CanvasRenderingContext2D;
    scxApplyTextTheme(theme: ITextTheme): CanvasRenderingContext2D;
    scxFill(theme: IFillTheme, force?: boolean): CanvasRenderingContext2D;
    scxStroke(theme: IStrokeTheme, force?: boolean): CanvasRenderingContext2D;
    scxFillStroke(
      fillTheme: IFillTheme,
      strokeTheme: IStrokeTheme
    ): CanvasRenderingContext2D;
    scxStrokePolyline(
      points: IPoint[],
      theme: IStrokeTheme
    ): CanvasRenderingContext2D;
  }
}

/* tslint:enable:interface-name */

"use strict";

const $ = window.jQuery;
let _lineDashFunc;

// tslint:disable:no-invalid-this
$.extend(CanvasRenderingContext2D.prototype, {
  /**
   * Applies specified stroke theme to the rendering context.
   * @param {StockChartX.StrokeTheme} [theme] The stroke theme.
   * @returns {CanvasRenderingContext2D}
   * @private
   */
  scxApplyStrokeTheme(theme: IStrokeTheme): CanvasRenderingContext2D {
    if (!theme || theme.strokeEnabled === false) return this;

    switch (theme.strokePriority || StrokeDefaults.strokePriority) {
      case StrokePriority.COLOR:
        this.strokeStyle = theme.strokeColor || StrokeDefaults.strokeColor;
        break;
      default:
        break;
    }
    this.lineCap = theme.lineCap || StrokeDefaults.lineCap;
    this.lineJoin = theme.lineJoin || StrokeDefaults.lineJoin;
    this.lineWidth = theme.width || StrokeDefaults.width;

    // Set dash style
    let dashArray;
    switch (theme.lineStyle || StrokeDefaults.lineStyle) {
      case LineStyle.DASH:
        dashArray = DashArray.DASH;
        break;
      case LineStyle.DOT:
        dashArray = DashArray.DOT;
        break;
      case LineStyle.DASH_DOT:
        dashArray = DashArray.DASH_DOT;
        break;
      default:
        dashArray = [];
        break;
    }
    getLineDashFunc.call(this).call(this, dashArray);

    return this;
  },

  /**
   * Applies fill theme to the rendering context.
   * @param {StockChartX.FillTheme} [theme] The fill theme.
   * @returns {CanvasRenderingContext2D}
   * @private
   */
  scxApplyFillTheme(theme: IFillTheme): CanvasRenderingContext2D {
    if (theme) {
      switch (theme.fillPriority) {
        default:
          let fillStyle = theme.fillColor || "black",
            gradient: CanvasGradient = null;

          if (theme.linearGradient) {
            gradient = this.createLinearGradient(0, 0, 0, this.canvas.height);

            if (typeof theme.linearGradient[0] === "object") {
              for (let gradientItem of <ILinearGradientFillTheme[]>(
                theme.linearGradient
              )) {
                gradient.addColorStop(gradientItem.stop, gradientItem.color);
              }
            } else {
              for (
                let i = 0, stop = 1 / theme.linearGradient.length, step = stop;
                i < theme.linearGradient.length;
                i++
              ) {
                if (i === theme.linearGradient.length - 1) stop = 1;

                gradient.addColorStop(stop, <string>theme.linearGradient[i]);
                stop += step;
              }
            }
          } else if (theme.radialGradient) {
            let {
                center: cPoint,
                radius: r,
                stop = 0.5,
                color
              } = theme.radialGradient[0],
              {
                center: cPoint2,
                radius: r2,
                stop: stop2 = 1,
                color: color2
              } = theme.radialGradient[1];

            gradient = this.createRadialGradient(
              cPoint.x,
              cPoint.y,
              r,
              cPoint2.x,
              cPoint2.y,
              r2
            );
            gradient.addColorStop(stop, color);
            gradient.addColorStop(stop2, color2);
          }

          this.fillStyle = gradient || fillStyle;
          break;
      }
    }

    return this;
  },

  /**
   * Applies text theme to the rendering context.
   * @param {StockChartX.TextTheme} [theme] The theme.
   * @returns {CanvasRenderingContext2D}
   * @private
   */
  scxApplyTextTheme(theme: ITextTheme): CanvasRenderingContext2D {
    this.font = getFont(theme);
    if (!theme || theme.fillEnabled !== false) this.scxApplyFillTheme(theme);
    if (!theme || theme.strokeEnabled !== false)
      this.scxApplyStrokeTheme(theme);

    return this;
  },

  scxFill(theme: IFillTheme, force?: boolean): CanvasRenderingContext2D {
    if (force || (theme && theme.fillEnabled !== false)) {
      this.scxApplyFillTheme(theme);
      this.fill();
    }

    return this;
  },

  scxStroke(theme: IStrokeTheme, force?: boolean): CanvasRenderingContext2D {
    if (force || (theme && theme.strokeEnabled !== false)) {
      this.scxApplyStrokeTheme(theme);
      this.stroke();
    }

    return this;
  },

  scxFillStroke(
    fillTheme: IFillTheme,
    strokeTheme: IStrokeTheme
  ): CanvasRenderingContext2D {
    this.scxFill(fillTheme);
    this.scxStroke(strokeTheme);

    return this;
  },

  scxStrokePolyline(
    points: IPoint[],
    theme: IStrokeTheme
  ): CanvasRenderingContext2D {
    let count = points.length;
    if (count < 2) throw new Error("Not enough points.");

    this.beginPath();

    this.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < count; i++) {
      this.lineTo(points[i].x, points[i].y);
    }

    this.scxStroke(theme);

    return this;
  }
});

function getFont(theme: ITextTheme): string {
  if (!theme) {
    return `${FontDefaults.fontSize}px ${FontDefaults.fontFamily}`;
  }

  let fontStyle = theme.fontStyle || FontDefaults.fontStyle,
    fontVariant = theme.fontVariant || FontDefaults.fontVariant,
    fontWeight = theme.fontWeight || FontDefaults.fontWeight,
    fontSize = theme.fontSize || FontDefaults.fontSize,
    fontFamily = theme.fontFamily || FontDefaults.fontFamily;

  return `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize}px ${fontFamily}`;
}

function getLineDashFunc() {
  if (!_lineDashFunc) {
    // works for Chrome and IE11
    if (this.setLineDash) {
      _lineDashFunc = function(dashArray: number[]) {
        // noinspection JSPotentiallyInvalidUsageOfThis
        this.setLineDash(dashArray);
      };
    }
    // verified that this works in firefox
    else if ("mozDash" in this) {
      _lineDashFunc = function(dashArray: number[]) {
        this.mozDash = dashArray;
      };
    }
    // does not currently work for Safari
    else if ("webkitLineDash" in this) {
      _lineDashFunc = function(dashArray: number[]) {
        this.webkitLineDash = dashArray;
      };
    }
    // no support for IE9 and IE10
    else {
      // noinspection JSUnusedLocalSymbols
      _lineDashFunc = (dashArray: number[]) => {};
    }
  }

  return _lineDashFunc;
}
// tslint:enable:no-invalid-this
