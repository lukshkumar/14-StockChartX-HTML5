import { JQueryCoordinates } from "../../external/typescript/jquery";
import { IStrokeTheme, IFillTheme } from "../index";
import { ITextTheme } from "../index";
import { ISize, IRect } from "../index";
import { Rect } from "../index";
import { IPoint } from "../index";
import { Chart } from "../index";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

// tslint:disable:object-literal-shorthand

/**
 * @internal
 */
declare global {
  interface JQuery {
    // tslint:disable-line:interface-name
    scxGetFrame(relativeElement: JQuery): Rect;
    scxSize(): ISize;
    scxContentSize(): ISize;
    scxAppendCanvas(): JQuery;
    scxAppend(tag: string, className?: string | string[]): JQuery;
    scxPrepend(tag: string, className?: string | string[]): JQuery;
    scxFrame(frame: IRect): void;
    scxPosition(left: number, top: number): JQuery;
    scxClientToLocalPoint(clientX: number, clientY: number): IPoint;
    scxLocalToClientPoint(clientX: number, clientY: number): IPoint;
    scxTextStyle(theme: ITextTheme): JQuery;
    scxBorder(border: string, theme: IStrokeTheme): JQuery;
    scxFill(theme: IFillTheme): JQuery;
    StockChartX(config: any): Chart;
    pseudoStyle(selector: string, name: string, value: string): JQuery;
    scxLocalize(key: string, defaultValue?: string): JQuery;
  }
}
"use strict";

const $ = window.jQuery;

// tslint:disable:no-invalid-this
$.fn.extend({
  /**
   * Returns element's frame rectangle relative to a given element.
   * If relativeElement is not specified it returns frame rectangle relative to a parent.
   * @param {jQuery} [relativeElement] The relative element.
   * @returns {StockChartX.Rect}
   * @private
   */
  scxGetFrame: function(relativeElement: JQuery): Rect {
    let width = this.outerWidth(),
      height = this.outerHeight(),
      pos: JQueryCoordinates;

    if (relativeElement) {
      let parentPos = relativeElement.offset();

      pos = this.offset();
      pos.left -= parentPos.left;
      pos.top -= parentPos.top;
    } else {
      pos = this.position();
    }

    return new Rect({
      left: pos.left,
      top: pos.top,
      width: width,
      height: height
    });
  },

  /**
   * Returns size of HTML element (including border).
   * @returns {StockChartX~Size}
   * @private
   */
  scxSize: function(): ISize {
    return {
      width: this.outerWidth(),
      height: this.outerHeight()
    };
  },

  /**
   * Returns content size of HTML element (excluding border).
   * @returns {StockChartX~Size}
   * @private
   */
  scxContentSize: function(): ISize {
    return {
      width: this.innerWidth(),
      height: this.innerHeight()
    };
  },

  /**
   * Create canvas element absolutely positioned in the parent container.
   * @returns {jQuery}
   * @private
   */
  scxAppendCanvas: function(): JQuery {
    return $("<canvas></canvas>")
      .css("position", "absolute")
      .appendTo(this);
  },

  /**
   * Creates HTML element with a given tag and class name and attaches it into the parent element.
   * @param {String} tag The tag name.
   * @param {String | String[]} [className] The class name of div element.
   * @returns {jQuery} The created div element.
   * @private
   */
  scxAppend: function(tag: string, className?: string | string[]): JQuery {
    let elem = $(`<${tag}></${tag}>`).appendTo(this);
    if (className) {
      if (typeof className === "string") {
        elem.addClass(className);
      } else {
        for (let item of <string[]>className) elem.addClass(item);
      }
    }

    return elem;
  },

  scxPrepend: function(tag: string, className?: string | string[]): JQuery {
    let elem = $(`<${tag}></${tag}>`).prependTo(this);
    if (className) {
      if (typeof className === "string") {
        elem.addClass(className);
      } else {
        for (let item of <string[]>className) elem.addClass(item);
      }
    }

    return elem;
  },

  /**
   * Sets element's frame.
   * @param {StockChartX~Rect} frame The frame rectangle.
   * @private
   */
  scxFrame: function(frame: IRect) {
    this.css("left", frame.left)
      .css("top", frame.top)
      .outerWidth(frame.width)
      .outerHeight(frame.height);
  },

  scxPosition: function(left: number, top: number): JQuery {
    this.css("left", left).css("top", top);

    return this;
  },

  /**
   * Converts point from client coordinates system to element's coordinate system.
   * @param {Number} clientX The x coordinate.
   * @param {Number} clientY The y coordinate.
   * @return {{x: Number, y: Number}}
   * @private
   */
  scxClientToLocalPoint: function(clientX: number, clientY: number): IPoint {
    let pos = this.offset();

    return {
      x: Math.round(clientX - pos.left),
      y: Math.round(clientY - pos.top)
    };
  },

  scxLocalToClientPoint: function(clientX: number, clientY: number): IPoint {
    let pos = this.offset();

    // debugger;

    return {
      x: Math.round(clientX + <number>pos.left),
      y: Math.round(clientY + <number>pos.top)
    };
  },

  scxTextStyle: function(theme: ITextTheme): JQuery {
    return this.css("color", theme.fillColor)
      .css("font-size", `${theme.fontSize}px`)
      .css("font-family", theme.fontFamily)
      .css("font-style", theme.fontStyle);
  },

  scxBorder: function(border: string, theme: IStrokeTheme): JQuery {
    return this.css(
      border,
      `${theme.width}px ${theme.lineStyle} ${theme.strokeColor}`
    );
  },

  scxFill: function(theme: IFillTheme): JQuery {
    if (theme.fillEnabled === false) return this;

    return this.css("background-color", theme.fillColor);
  },

  scxLocalize(key: string, defaultValue?: string): JQuery {
    if (defaultValue) this.text(defaultValue);

    return this.attr("data-i18n", key);
  }
});
// tslint:enable:no-invalid-this

// tslint:enable:object-literal-shorthand
