/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */
import { DataServer } from "../StockChartX/index";
/// <reference path="../StockChartX/Utils/jQueryExtensions.ts" />
/// <reference path="../dataServer/DataFeedSelectWindow.ts"/>
/// <reference path="../dataServer/DataServer.ts"/>

"use strict";

interface IData {
  Success: boolean;
}

export class LoginWindow {
  private callback;
  private btnStart = $("#loginDialog_start");
  private container = $("#scxLogInDialog");
  private form = $("#scxLogInDialog");
  private inputLogin = this.container.find("#scxLogInUsername");
  private inputPassword = this.container.find("#scxLogInPassword");
  private btnLogin = this.container.find("#scxLogInConnect");
  private errorMessage = this.container.find("#scxLogInError");
  private server: DataServer;

  constructor(server: DataServer) {
    this.server = server;
    this.init();
  }

  private init() {
    this.form.show();

    this.btnLogin.on("click", () => {
      this.doLogin();
    });
  }

  show(fn: any) {
    this.callback = fn;
    this.btnStart.trigger("click");
  }

  private hide() {
    this.form.hide();
    this.inputLogin.val("");
    this.inputPassword.val("");
  }

  private enable() {
    this.btnLogin.removeAttr("disabled");
    this.inputLogin.removeAttr("disabled");
    this.inputPassword.removeAttr("disabled");
  }

  private disable() {
    this.btnLogin.attr("disabled", "disabled");
    this.inputLogin.attr("disabled", "disabled");
    this.inputPassword.attr("disabled", "disabled");
  }

  private onResponce(data: IData) {
    this.enable();
    if (data.Success) {
      this.hide();

      if (this.callback) this.callback();

      this.callback = null;
    } else {
      this.inputLogin.trigger("focus");
      this.errorMessage.text("Incorrect login or paswword");
    }
  }

  private doLogin(): void {
    if (!this.inputLogin.val().length || !this.inputPassword.val().length)
      return;

    this.disable();

    let loginData = {
      Login: this.inputLogin.val(),
      Password: this.inputPassword.val()
    };

    this.server.doLogin(
      responseData => this.onResponce(responseData),
      loginData
    );
  }
}
