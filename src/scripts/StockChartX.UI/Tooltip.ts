import { IRect } from "../StockChartX/index";
import { ISize } from "../StockChartX/index";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { HtmlContainer } from "./index";
import { ChartPanelObject } from "../StockChartX/index";
import { IDestroyable } from "../StockChartX/index";
import { IStateProvider } from "../StockChartX/index";
import { JsUtil } from "../StockChartX/index";
import { HtmlUtil } from "../StockChartX/index";
import { IPoint } from "../StockChartX/index";
import { LineStyle } from "../StockChartX/index";

"use strict";

// region Interfaces

export interface ITooltipState {
  text: string;
  kind: string;
  position: string;
  theme?: any;
}

export interface ITooltipConfig {
  parent: ChartPanelObject;
  options?: ITooltipOptions;
}

export interface ITooltipOptions {
  text: string;
  kind?: string;
  position: string;
  theme?: any;
}

export interface ITooltipDefaults {
  text: string;
  kind: string;
  theme?: any;
}

// endregion

// Declarations

export const TooltipPosition = {
  AUTO: "auto",
  TOP: "top",
  BOTTOM: "bottom"
};

export const TooltipContentKind = {
  TEXT: "text",
  IMAGE: "image",
  HTML: "html"
};
Object.freeze(TooltipContentKind);

const $ = window.jQuery;
const Y_CURSOR_OFFSET = 15;
const Class = {
  NOTE: "scxTooltip",
  ARROW_BOX: "scxArrowBox",
  ARROW_TOP: "scxArrowBoxTop",
  ARROW_RIGHT: "scxArrowBoxRight",
  ARROW_BOTTOM: "scxArrowBoxBottom",
  ARROW_LEFT: "scxArrowBoxLeft",
  ARROW: "scxTooltipArrow",
  ARROW_STYLE_AFTER: "scxTooltipArrowStyleAfter",
  ARROW_STYLE_BEFORE: "scxTooltipArrowStyleBefore",
  THEME_ARROW_STYLE_AFTER: "scxTooltipThemeArrowStyleAfter",
  THEME_ARROW_STYLE_BEFORE: "scxTooltipThemeArrowStyleBefore",
  CONTENT: "scxTooltipContent"
};

// endregion

export class Tooltip implements IDestroyable, IStateProvider<ITooltipOptions> {
  _arrowMainAfter: any;
  static defaults: ITooltipDefaults = {
    text: "",
    kind: TooltipContentKind.TEXT
  };

  private _tooltipElement: JQuery;
  private _arrowAfter: JQuery;
  private _arrowBefore: JQuery;
  // private _arrowMainAfter: JQuery;
  private _arrowMainBefore: JQuery;
  private _contentElement: JQuery;
  private _parent: ChartPanelObject;
  private _options: ITooltipOptions;
  private _visible: boolean;
  private _id: string;
  private _maxContentWidth = 270;
  private _minSize: ISize = {
    width: 280,
    height: 29
  };
  private _isInDom = false;

  layoutRect: IRect;

  get UID(): string {
    return `0000${((Math.random() * Math.pow(36, 4)) << 0).toString(36)}`.slice(
      -4
    );
  }

  get size(): ISize {
    if (!this._isInDom) return this._minSize;

    return {
      width: this._tooltipElement.outerWidth(),
      height: this._tooltipElement.outerHeight()
    };
  }

  get theme(): any {
    return this._options.theme;
  }

  set theme(value: any) {
    this._options.theme = value;
    this.applyTheme();
  }

  /**
   * Returns actual theme.
   * @name actualTheme
   * @type {object}
   * @memberOf StockChartX.UI.Tooltip#
   */
  get actualTheme(): any {
    let theme = this.theme;
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
    let chart = this._parent.chart;
    if (!chart) return null;

    return JsUtil.clone(chart.theme.tooltip);
  }

  get visible(): boolean {
    return this._visible;
  }

  get contentKind(): string {
    return this._options.kind;
  }

  set contentKind(value: string) {
    this._options.kind = value;
  }

  get position(): string {
    return this._options.position;
  }

  set position(value: string) {
    this._options.position = value;
  }

  get text(): string {
    return this._options.text;
  }

  set text(value: string) {
    this._options.text = value;
    this._applyText();
  }

  constructor(config: ITooltipConfig) {
    this._options = config.options || $.extend(true, {}, Tooltip.defaults);
    this._parent = config.parent;
    this.initDomObjects();
  }

  initDomObjects() {
    this._id = `tooltip-${this.UID}`;

    let html =
      // tslint:disable prefer-template
      `<div id="${this._id}">` +
      `<style class="${Class.ARROW_STYLE_AFTER}"></style>` +
      `<style class="${Class.ARROW_STYLE_BEFORE}"></style>` +
      `<style class="${Class.THEME_ARROW_STYLE_AFTER}"></style>` +
      `<style class="${Class.THEME_ARROW_STYLE_BEFORE}"></style>` +
      `<div class="${Class.CONTENT}"></div>` +
      "</div>";
    // tslint:enable

    let tooltipElement = (this._tooltipElement = $(html));
    tooltipElement.addClass(Class.NOTE).addClass(Class.ARROW_BOX);

    this._arrowAfter = tooltipElement.find(`.${Class.ARROW_STYLE_AFTER}`);
    this._arrowBefore = tooltipElement.find(`.${Class.ARROW_STYLE_BEFORE}`);
    this._arrowMainAfter = tooltipElement.find(
      `.${Class.THEME_ARROW_STYLE_AFTER}`
    );
    this._arrowMainBefore = tooltipElement.find(
      `.${Class.THEME_ARROW_STYLE_BEFORE}`
    );
    this._contentElement = tooltipElement.find(`.${Class.CONTENT}`);

    this._applyText();
  }

  _applyText() {
    let value = this.text;
    let theme = this.actualTheme;
    let borderWidth = 1;
    if (theme) {
      if (theme.border.enabled) borderWidth = theme.border.width;
      else borderWidth = 0;
    }
    this._contentElement.empty();
    try {
      switch (this.contentKind) {
        case TooltipContentKind.TEXT:
          this._contentElement.text(value).css("white-space", "pre-wrap");
          this._tooltipElement.css("pointer-events", "none");
          break;
        case TooltipContentKind.IMAGE:
          let maxImgWidth = this._maxContentWidth - borderWidth * 2;
          let imgHtml = `<img src="${value}" style="max-width: ${maxImgWidth}px">`;
          $(imgHtml).appendTo(this._contentElement);
          this._tooltipElement.css("pointer-events", "none");
          break;
        case TooltipContentKind.HTML:
          this._contentElement.css("white-space", "normal");
          this._tooltipElement.css("width", "auto");
          this._tooltipElement.css("height", "auto");
          // Prevent XSS attack
          let element = HtmlUtil.removeUnsecureTags(value);

          element.appendTo(this._contentElement);
          this._tooltipElement.css("pointer-events", "auto");
          break;
        default:
          break;
      }
    } catch (ex) {
      // console.log(ex);
    }
  }

  // region IStateProvider

  saveState(): ITooltipState {
    return JsUtil.clone<ITooltipState>(<ITooltipState>this._options);
  }

  loadState(state: ITooltipState) {
    this._options = state || $.extend(true, {}, Tooltip.defaults);
    if (!this._options.kind) this._options.kind = TooltipContentKind.TEXT;

    this.applyTheme();
    this._applyText();
  }

  // endregion

  show(point: IPoint) {
    if (!this.text) return;

    this._visible = true;
    if (!this._isInDom) {
      this._tooltipElement = HtmlContainer.instance.register(
        this._id,
        this._tooltipElement
      );
      this._isInDom = true;
    }
    this.moveTo(point);
    HtmlUtil.setVisibility(this._tooltipElement, true);
  }

  hide() {
    this._visible = false;
    HtmlUtil.setVisibility(this._tooltipElement, false);
  }

  private _actualPosition(point: IPoint): string {
    let rect = this.layoutRect;
    if (!rect) return TooltipPosition.TOP;

    let height = this.size.height + Y_CURSOR_OFFSET;
    if (point.y - height >= rect.top) return TooltipPosition.TOP;
    if (point.y + height <= rect.top + rect.height)
      return TooltipPosition.BOTTOM;

    return TooltipPosition.TOP;
  }

  _adjustArrow(xPct: number, tooltipPosition: string) {
    let theme = this.theme,
      borderColor = theme
        ? theme.border.strokeColor || theme.border.color
        : "transparent",
      fillEnabled = theme ? theme.fill.enabled : "transparent",
      fillColor = fillEnabled && theme ? theme.fill.color : "transparent",
      isArrowOnTop = tooltipPosition === TooltipPosition.BOTTOM;

    let location = isArrowOnTop
        ? "bottom: 100%; top: auto;"
        : "top: 100%; bottom: auto;",
      color = isArrowOnTop
        ? "border-top-color: transparent;"
        : "border-bottom-color: transparent;",
      display = xPct < 5 || xPct > 95 ? "display: none;" : "display: block;",
      afterBorderColor = isArrowOnTop
        ? `border-bottom-color: ${fillColor};`
        : `border-top-color: ${fillColor};`,
      beforeBorderColor = isArrowOnTop
        ? `border-bottom-color: ${borderColor};`
        : `border-top-color: ${borderColor};`,
      after = `#${
        this._id
      }:after {left: ${xPct}%; ${afterBorderColor} ${location} ${color} ${display} }`,
      before = `#${
        this._id
      }:before {left: ${xPct}%; ${beforeBorderColor} ${location} ${color} ${display} }`;

    this._arrowAfter.text(after);
    this._arrowBefore.text(before);
  }

  applyTheme() {
    if (!this._tooltipElement) return;

    let theme = this.actualTheme;
    if (!theme) return;

    let borderEnabled = theme.border.enabled;
    let borderWidth = borderEnabled ? theme.border.width : 0;
    let borderStyle = "solid";
    let borderColor = theme.border.strokeColor || theme.border.color;
    let fillEnabled = theme.fill.enabled;
    let fillColor = fillEnabled ? theme.fill.color : "transparent";
    let textColor = theme.text.fillColor;
    let fontSize = theme.text.fontSize;
    let fontFamily = theme.text.fontFamily;
    let fontWeight = theme.text.fontWeight;
    let fontStyle = theme.text.fontStyle;
    let decoration = theme.text.decoration;

    switch (theme.border.lineStyle) {
      case LineStyle.DOT:
        borderStyle = "dotted";
        break;
      case LineStyle.DASH_DOT:
        borderStyle = "dashed"; // DATSH-DOT - Not supported in css line style
        break;
      case LineStyle.DASH:
        borderStyle = "dashed";
        break;
      default:
        break;
    }

    this._tooltipElement.css({
      background: fillColor,
      "border-color": borderColor,
      "border-width": borderWidth,
      "border-style": borderStyle
    });

    this._contentElement.css({
      color: textColor,
      "font-family": fontFamily,
      "font-size": `${fontSize}px`,
      "font-weight": fontWeight,
      "font-style": fontStyle,
      "text-decoration": decoration,
      "word-wrap": "break-word"
    });

    this._applyText();
    this._arrowMainBefore.text(
      `#${this._id}:before { border-width: ${borderWidth} }`
    );
  }

  moveTo(point: IPoint) {
    let position = this._actualPosition(point),
      location = this._calculateLocation(position, point),
      xArrow = ((point.x - location.x) / this.size.width) * 100;

    this._adjustArrow(xArrow, position);
    this._tooltipElement.css("left", location.x).css("top", location.y);
  }

  private _calculateLocation(tooltipPosition: string, point: IPoint) {
    let size = this.size,
      left = point.x - size.width / 2,
      height = size.height + Y_CURSOR_OFFSET,
      top;

    switch (tooltipPosition) {
      case TooltipPosition.TOP:
        top = point.y - height;
        break;
      case TooltipPosition.BOTTOM:
        top = point.y + Y_CURSOR_OFFSET * 2;
        break;
      default:
        throw new Error(`Unknown tooltip position: ${tooltipPosition}`);
    }

    let rect = this.layoutRect;
    if (rect) {
      if (left < rect.left) left = rect.left;

      let right = rect.left + rect.width;
      if (left + size.width > right) left = right - size.width;
    }

    return {
      x: left,
      y: top
    };
  }

  // region IDestroyable

  destroy() {
    if (this._tooltipElement) {
      this._tooltipElement.remove();
      this._tooltipElement = null;
      this._isInDom = false;
    }
  }

  // endregion
}
