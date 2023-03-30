/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { Dialog, IDialogConfig } from "./index";
import { Indicator } from "../StockChartX/index";
import { WaitingBar, IWaitingBarConfig } from "./index";
import { TAIndicator } from "../StockChartX/index";
import * as TASdk from "../TASdk/TASdk";
import { HtmlLoader } from "./index";
// import { $ } from "../external/typescript/jquery";
const $ = window.jQuery;

/**
 * @internal
 */
"use strict";

export interface IIndicatorInfoDialogConfig extends IDialogConfig {
  indicator: Indicator;
}

const HELP_FILE_NAME = "IndicatorsHelp.html";
const DEFAULT_TITLE = "IndicatorHelp";
const CLASS_DIALOG = "scxIndicatorInfoDialog";

export class IndicatorInfoDialog extends Dialog {
  private _title: JQuery;
  private _helpContainer: JQuery;
  private _waitingBar: WaitingBar;

  private _waitingBarConfig: IWaitingBarConfig = {
    dotsCount: 5
  };

  constructor(container: JQuery) {
    super(container);

    this._title = this._dialog.find(`.${CLASS_DIALOG}__title`);
    this._helpContainer = this._dialog.find(`.${CLASS_DIALOG}__help-content`);
    this._waitingBar = this._dialogContent.body.scx().waitingBar();
  }

  public show(config: IIndicatorInfoDialogConfig): void {
    if (!this.initDialog(config)) return;

    this._clear();
    this._showWaitingBar();
    super.show(config);

    // native indicator
    if (
      typeof config.indicator === "object" &&
      config.indicator instanceof TAIndicator
    ) {
      let id = (<TAIndicator>config.indicator).taIndicator,
        titleKey = TASdk.indicatorToString(id);

      this._setTitle(titleKey);

      HtmlLoader.loadHtml(HELP_FILE_NAME, (html: string) => {
        this._config.chart.localize(this._dialog);
        let info = $(html)
          .find(`#scxIndicatorTooltip_id${id}`)
          .clone()
          .show();
        info.find("> h1").remove();
        info = info.length
          ? info
          : IndicatorInfoDialog._generateHelpDoesntExistContent();
        this._insertContent(info);
      });
    }
    // custom indicator
    else {
      let title = config.indicator.getName() || DEFAULT_TITLE;
      let info =
        IndicatorInfoDialog._getIndicatorOwnAbout(config.indicator) ||
        IndicatorInfoDialog._generateHelpDoesntExistContent();

      this._setTitle(title);
      this._insertContent(info);
    }
  }

  private _setTitle(name: string): void {
    this._title.scxLocalize(`indicators.${name}`, name);
  }

  private _insertContent(content: JQuery): void {
    this._hideWaitingBar();
    this._helpContainer.append(content);
    this.resize();

    this._config.chart.localize(this._helpContainer);
  }

  private _clear(): void {
    this._helpContainer.empty();
  }

  private static _getIndicatorOwnAbout(indicator: Indicator): JQuery {
    let about = indicator.getInfoAbout();
    if (!about) return null;

    return $(about);
  }

  private static _generateHelpDoesntExistContent(): JQuery {
    return $(
      `<p class="${CLASS_DIALOG}__noInfo" data-i18n="indicatorInfoDialog.noInfo"></p>`
    );
  }

  private _showWaitingBar(): void {
    this._waitingBar.show(this._waitingBarConfig);
  }

  private _hideWaitingBar(): void {
    this._waitingBar.hide();
  }
}
