/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */
const $ = window.jQuery;
"use strict";

export interface IServer {
  logginIn: boolean;
  logginOut: boolean;
}

interface IInstruments {
  Name: string;
}

export class DataFeedSelectWindow {
  private btnStart = $("#scxDataFeedDialog");
  private select = $("#scxDataFeedDropDown");
  private btnOk = $("#scxDataFeedSelect");
  private callback = null;
  private dataFeeds = [];
  private server;

  constructor(server: IServer) {
    this.server = server;

    this.init();
  }

  private init() {
    this.btnStart.show();

    this.btnOk.on("click", () => {
      this.makeChoise();
    });
  }

  show(fn: string) {
    this.callback = fn;
    this.btnStart.trigger("click");
    this.disable();
    this.server.getDataFeeds(array => this.fillSelect(array));
  }

  hide() {
    this.btnStart.hide();
  }

  disable() {
    this.select.attr("disabled", "disabled");
    this.btnOk.attr("disabled", "disabled");
  }

  enable() {
    this.select.removeAttr("disabled");
    this.btnOk.removeAttr("disabled");
  }

  private fillSelect(array: any) {
    this.dataFeeds = array;
    let items = [];
    this.dataFeeds.forEach(function(item: any, index: any) {
      items.push(
        $('<option value="' + index + '">' + item.Name + " </option>")
      );
    });
    this.select.empty().append(items);
    this.enable();
  }

  private makeChoise() {
    let index = this.select.val();
    this.hide();
    this.callback(
      this.dataFeeds[index],
      this.formatInstruments(this.dataFeeds[index].Exchanges)
    );
  }

  private formatInstruments(instruments: IInstruments) {
    let results = [];
    let symbols = instruments[0].Symbols;
    for (let i of symbols) {
      results.push({
        exchange: instruments[0].Name,
        company: i.Company,
        symbol: i.Symbol,
        type: i.Type
      });
    }

    return results;
  }
}
