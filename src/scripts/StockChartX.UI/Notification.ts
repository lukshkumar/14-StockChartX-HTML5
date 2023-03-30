import { Localization } from "../StockChartX/index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

export class Notification {
  private static _options: ToastrOptions = {
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: "toast-top-right",
    preventDuplicates: false,
    onclick: null,
    showDuration: 300,
    hideDuration: 1000,
    timeOut: 5000,
    extendedTimeOut: 1000,
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
  };

  static async warning(msg: string, title?: string) {
    if (!title)
      title = await Localization.localizeText(
        null,
        "notification.title.warning"
      );

    toastr.warning(msg, title, this._options);
  }

  static async error(msg: string, title?: string) {
    if (!title)
      title = await Localization.localizeText(null, "notification.title.error");

    toastr.error(msg, title, this._options);
  }

  static async success(msg: string, title?: string) {
    if (!title)
      title = await Localization.localizeText(
        null,
        "notification.title.success"
      );

    toastr.success(msg, title, this._options);
  }

  static async info(msg: string, title?: string) {
    if (!title)
      title = await Localization.localizeText(null, "notification.title.info");

    toastr.info(msg, title, this._options);
  }
}
