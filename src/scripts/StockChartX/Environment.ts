/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
const platform = require("platform");

// import Detectizr from "detectizr";
/**
 * The path to the folder.
 * @typedef {} StockChartX~EnvironmentPath
 * @type {Object}
 * @property {string} root The path to the root folder.
 * @property {string} view The path to the view folder.
 * @property {string} locales The path to the locales folder.
 * @memberOf StockChartX.Environment
 */

"use strict";

export enum Browser {
  UNKNOWN,
  ie,
  firefox,
  opera,
  konqueror,
  iron,
  safari,
  chrome,
  edge
}

export interface IEnvironment {
  isMobile: boolean;
  isPhone: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  osVersion: string;
  browser: Browser;
  browserVersion: string;
  Path: IEnvironmentPath;
}

export interface IEnvironmentPath {
  root: string;
  view: string;
  locales: string;
}

const DEFAULT_PATH = {
  root: "",
  view: "view/",
  locales: "locales/"
};

/**
 * @internal
 */
class Path implements IEnvironmentPath {
  private _root: string;

  get root() {
    return this._root || DEFAULT_PATH.root;
  }

  set root(value: string) {
    this._root = value;
  }

  private _view: string;

  get view() {
    return this._view || this.root + DEFAULT_PATH.view;
  }

  set view(value: string) {
    this._view = value;
  }

  private _locales: string;

  get locales() {
    return this._locales || this.root + DEFAULT_PATH.locales;
  }

  set locales(value: string) {
    this._locales = value;
  }
}

export let Environment: IEnvironment = {
  isMobile: false,
  isPhone: false,
  isIOS: false,
  isAndroid: false,
  osVersion: "0",
  browser: Browser.UNKNOWN,
  browserVersion: "0",
  Path: new Path()
};

detectEnvironment();
Object.freeze(Environment);

function detectEnvironment() {
  // Detectizr.detect({
  //   detectDeviceMode: false,
  //   detectScreen: false,
  //   detectOS: true,
  //   detectBrowser: true,
  //   detectPlugins: false
  // });

  // switch (platform.os.name) {
  //   console.log("platform ")
  //   case "ios":
  //     Environment.isIOS = true;
  //     break;
  //   case "android":
  //     Environment.isAndroid = true;
  //     break;
  //   default:
  //     break;
  // }

  Environment.osVersion = platform.os.version;

  Environment.browserVersion = platform.version;

  switch (platform.name) {
    case "IE":
      Environment.browser = Browser.ie;
      break;
    case "Firefox":
      Environment.browser = Browser.firefox;
      break;
    case "Opera":
      Environment.browser = Browser.opera;
      break;
    case "Konqueror":
      Environment.browser = Browser.konqueror;
      break;
    case "Iron":
      Environment.browser = Browser.iron;
      break;
    case "Safari":
      Environment.browser = Browser.safari;
      break;
    case "Chrome":
      Environment.browser = Browser.chrome;
      break;
    case "Microsoft Edge":
      Environment.browser = Browser.edge;
      break;
    default:
      break;
  }

  switch (platform.os.family) {
    case "Android":
      Environment.isAndroid = true;
      Environment.isPhone = true;
      Environment.isMobile = true;
      break;
    case "iOS":
      Environment.isIOS = true;
      Environment.isPhone = true;
      Environment.isMobile = true;
      break;
    case "Windows Phone":
      Environment.isPhone = true;
      Environment.isMobile = true;
      break;
    default:
      Environment.isMobile = false;
      break;
  }
}
