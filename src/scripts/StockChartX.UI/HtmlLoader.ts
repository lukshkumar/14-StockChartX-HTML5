import { Notification } from "./index";
import { Environment } from "../StockChartX/index";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { Dictionary } from "../StockChartX/index";

/**
 * The callback to handle html content.
 * @callback StockChartX.UI~HtmlCallback
 * @memberOf StockChartX.UI
 */

"use strict";

const $ = window.jQuery;

export type IHtmlCallback = (html: string) => void;

/**
 * Represents cached html content.
 * @constructor StockChartX.UI.CachedHtml
 * @internal
 */
class CachedHtml {
  /**
   * @internal
   */
  private _html: string;

  /**
   * @internal
   */
  private _subscribers: IHtmlCallback[] = [];

  constructor(subscriber?: IHtmlCallback) {
    if (subscriber) this._subscribers.push(subscriber);
  }

  /**
   * Returns the flag that indicates whether html content is loaded.
   * @method _isLoaded
   * @returns {boolean} The flag that indicates whether html content is loaded.
   * @memberOf StockChartX.UI.CachedHtml#
   * @internal
   */
  private _isLoaded(): boolean {
    return !!this._html;
  }

  /**
   * Sets html content.
   * @method setHtml
   * @param {string} html The html content.
   * @memberOf StockChartX.UI.CachedHtml#
   */
  public setHtml(html: string): void {
    this._html = html;

    for (let i = this._subscribers.length - 1; i >= 0; i--)
      this._subscribers[i](html);

    this._subscribers = [];
  }

  /**
   * Adds callback to be executed when load completed.
   * @method subscribe
   * @param {StockChartX.UI~HtmlCallback} callback
   * @memberOf StockChartX.UI.CachedHtml#
   */
  public subscribe(callback: IHtmlCallback): void {
    if (this._isLoaded()) callback(this._html);
    else this._subscribers.push(callback);
  }
}

/**
 * Represents html loader.
 * It loads html view asynchronously and executes callback on completion.
 * @constructor StockChartX.HtmlLoader
 */
export class HtmlLoader {
  /**
   * @internal
   */
  private static _fileName2Html = new Dictionary<string, CachedHtml>();

  /**
   * Loads html content.
   * @method loadHtml
   * @param {string} fileName The name of the html file to load.
   * @param {StockChartX.UI~HtmlCallback} callback The callback to be executed when load completed.
   * @memberOf StockChartX.UI.HtmlLoader
   */
  public static loadHtml(fileName: string, callback: IHtmlCallback): void {
    let dataItem = this._fileName2Html.get(fileName);

    if (dataItem) {
      dataItem.subscribe(callback);
    } else {
      this._fileName2Html.add(fileName, new CachedHtml(callback));
      this._loadContent(fileName);
    }
  }

  /**
   * Returns absolute path to a given file.
   * @method _expandPath
   * @param {string} fileName The name of the file.
   * @returns {string} The absolute path to a given file.
   * @memberOf StockChartX.HtmlLoader
   * @internal
   */
  private static _expandPath(fileName: string): string {
    return Environment.Path.view + fileName;
  }

  /**
   * @internal
   */
  private static _loadContent(fileName: string): void {
    $.get(this._expandPath(fileName), (html: string) => {
      this._onContentLoaded(fileName, html);
    }).fail(() => {
      Notification.error(`Load ${fileName} failed.`);
    });
  }

  /**
   * @internal
   */
  private static _onContentLoaded(fileName: string, html: string): void {
    let dataItem = this._fileName2Html.get(fileName);

    if (dataItem) dataItem.setHtml(html);
  }
}
