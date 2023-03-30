/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

// region Interfaces
import { IStrokeTheme, ITextTheme } from "../index";
import { ColorFormats } from "../../external/typescript/tinycolor";
/* tslint:disable:interface-name */
const tinycolor = require("tinycolor2");
declare global {
  interface Document {
    mozFullScreenEnabled?: boolean;
    msFullscreenEnabled?: boolean;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
    msExitFullscreen();
    mozCancelFullScreen();
    webkitExitFullscreen: () => void;
    // @ts-ignore
    webkitFullscreenEnabled: boolean;
  }
}
declare global {
  interface Element {
    ALLOW_KEYBOARD_INPUT?: number;
    msFullscreenElement: any;
    mozFullScreenElement: any;
    msRequestFullscreen();
    mozRequestFullScreen();
    webkitRequestFullscreen(flag?: number);
  }
}
/* tslint:enable:interface-name */

// endregion
"use strict";

const DEFAULT_LINE_WIDTH = 1;
const DEFAULT_FONT_SIZE = 12;

/**
 * HTML utilities.
 * @class
 * @memberOf StockChartX
 * @private
 * @internal
 */
export class HtmlUtil {
  static getLineWidth(theme: IStrokeTheme): number {
    if (theme && theme.strokeEnabled === false) return 0;

    return (theme && theme.width) || DEFAULT_LINE_WIDTH;
  }

  static getFontSize(theme: ITextTheme): number {
    return (theme && theme.fontSize) || DEFAULT_FONT_SIZE;
  }

  static isDarkColor(color: string): boolean {
    return tinycolor(color).isDark();
  }

  static toRgbString(color: string | ColorFormats.RGBA): string {
    return tinycolor(<string>color).toRgbString();
  }

  static toRgba(color: string): ColorFormats.RGBA {
    return tinycolor(color).toRgb();
  }

  static toHexString(color: string): string {
    return tinycolor(color).toHexString();
  }

  static lighten(colorString: string, luminosity: number = 0): string {
    let colorHex = HtmlUtil.toRgbString(colorString);
    let color = colorHex.replace(/[^0-9a-f]/gi, "");
    if (color.length < 6) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }

    let newColor = "#",
      c,
      black = 0,
      white = 255;
    for (let i = 0; i < 3; i++) {
      c = parseInt(color.substr(i * 2, 2), 16);
      c = Math.round(
        Math.min(Math.max(black, <number>c + luminosity * white), white)
      ).toString(16);
      newColor += `00${c}`.substr(c.length);
    }

    return newColor;
  }

  static setVisibility(control: JQuery, visible: boolean) {
    if (control) control.css("visibility", visible ? "visible" : "hidden");
  }

  static setBackground(
    control: JQuery,
    backgroundColors: string[] | string
  ): void {
    if (Array.isArray(backgroundColors)) {
      if (backgroundColors.length === 0)
        throw new Error(
          "Invalid theme: 'background' must be a color or array of colors."
        );
      if (backgroundColors.length === 1)
        HtmlUtil.setBackgroundColor(control, backgroundColors[0]);
      else HtmlUtil.setGradientBackground(control, backgroundColors);
    } else HtmlUtil.setBackgroundColor(control, backgroundColors);
  }

  static isFullscreenEnabled(): boolean {
    return (
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );
  }

  static enterFullscreen(element?: HTMLElement) {
    let elem = element || document.body;

    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
    else if (elem.webkitRequestFullscreen)
      elem.webkitRequestFullscreen((<any>Element).ALLOW_KEYBOARD_INPUT);
    else throw new Error("Fullscreen mode is not supported.");
  }

  static exitFullscreen(): void {
    if (
      // @ts-ignore
      document.fullscreenElement ||
      // @ts-ignore
      document.webkitFullscreenElement ||
      // @ts-ignore
      document.mozFullScreenElement
    ) {
      // can use exitFullscreen
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  }

  static setGradientBackground(control: JQuery, colors: string[]) {
    let startColor = `startColorstr=${HtmlUtil.toHexString(colors[1])}`,
      endColor = `endColorstr=${HtmlUtil.toHexString(colors[0])}`;

    control
      .css(
        "background",
        "-webkit-gradient(linear,left bottom,left top," +
          `color-stop(0, ${colors[0]}), color-stop(1, ${colors[1]}))`
      )
      .css("background", `linear-gradient(to top, ${colors[0]}, ${colors[1]})`)
      .css(
        "filter",
        "progid:DXImageTransform.Microsoft.gradient" +
          `(GradientType=0, ${startColor}, ${endColor})`
      );
  }

  static setBackgroundColor(control: JQuery, color: string) {
    control.css("background", color);
  }

  static removeUnsecureTags(value: string | JQuery): JQuery {
    let tags = [
      "script",
      "embed",
      "object",
      "applet",
      "iframe",
      "frame",
      "frameset"
    ];
    let element = $(value);

    for (let tag of tags) {
      element.find(tag).remove();
    }

    return element;
  }
}
