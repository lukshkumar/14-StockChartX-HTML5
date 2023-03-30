import { Handler } from "../../index";
import html2canvas from "html2canvas";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

// region Declarations

const FileName = "Chart.png";

// endregion

/**
 * Handles save image action.
 * @constructor StockChartX.SaveImageHandler
 * @augments ChartHandler
 */
export class SaveImageHandler extends Handler {
  /**
   * Saves container as image.
   * @method saveImage
   * @param {JQuery} container The container element.
   * @memberOf StockChartX.SaveImageHandler#
   */
  saveImage(container: JQuery) {
    html2canvas(container[0]).then(function(canvas) {
      //  @ts-ignore
      if (canvas.msToBlob) {
        // works for IE 10-11, Edge
        navigator.msSaveBlob(canvas.msToBlob(), FileName);
      } else {
        saveAs(canvas.toDataURL(), FileName);
      }
    });
  }
}
function saveAs(uri, filename) {
  var link = document.createElement("a");

  if (typeof link.download === "string") {
    link.href = uri;
    link.download = filename;

    //Firefox requires the link to be in the body
    document.body.appendChild(link);

    //simulate click
    link.click();

    //remove the link when done
    document.body.removeChild(link);
  } else {
    window.open(uri);
  }
}
