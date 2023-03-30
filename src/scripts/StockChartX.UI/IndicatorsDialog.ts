import * as TASdk from "../TASdk/TASdk";
import { Notification } from "./index";
import { Localization } from "../StockChartX/index";
import { Environment } from "../StockChartX/index";
import { IIndicatorsDialogConfig } from "./index";
import { IDialogConfig } from "./index";
import Switchery from "../StockChartX.External/switchery";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */
import { Dialog } from "./index";
// import { $ } from "../external/typescript/jquery";
import { HtmlLoader } from "./index";
import { IndicatorDefaults } from "../StockChartX/Indicators/utils";
import { HtmlContainer } from "./index";
const ColoredVolumeIndicator = TASdk.ColoredVolume;
const VolumeIndicator = TASdk.Volume;
const $ = window.jQuery;

/* tslint:disable:interface-name */
/**
 * @internal
 */
export interface ISortHandlerFunction {
  (left: HTMLElement, right: HTMLElement): number;
}

/**
 * @internal
 */
declare global {
  export interface JQuery {
    sort(fn: ISortHandlerFunction): number;
  }
}

/* tslint:enable:interface-name */
"use strict";

export interface IIndicatorsDialogConfig extends IDialogConfig {
  done(taIndicator: number): void;
}

const IndicatorGroups = {
  Bands: 1,
  General: 2,
  Index: 3,
  MovingAverage: 4,
  Oscillator: 5,
  Regression: 6
};

const groups = {
  Bands: {},
  General: {},
  Index: {},
  MovingAverage: {},
  Oscillator: {},
  Regression: {}
};

const SHOW_TOOLTIP_DELAY = 500;
const CLASS_INDICATOR_ITEM = "scxIndicatorItem";
const CLASS_INDICATOR_COLUMN = "scxIndicatorColumn";
const CLASS_HAS_TOOLTIP = "scxHasTooltip";

export class IndicatorsDialog extends Dialog {
  protected _config: IIndicatorsDialogConfig;

  private _inp_search: JQuery;
  private _title: JQuery;
  private _resultContainer: JQuery;
  private _noResultObj: JQuery;
  private _tooltipSwitcher: JQuery;
  private _tooltipDownloading: JQuery;
  private _tooltipLabel: JQuery;
  private _btnClearInput: JQuery;

  private _helpDownloaded: boolean = false;
  private _helpEnabled: boolean = false;
  private _tooltipHoverTimer: number = null;
  private _tooltipBodyHovered: boolean = false;
  private _lastHoveredLi: JQuery = null;
  private _tooltipHTMLObj: JQuery = null;
  private _helpPanel: JQuery;

  /**
   * The flag that indicates whether the need to show indicator settings dialog.
   * @name showSettingsBeforeAdding
   * @type {boolean}
   * @default false
   * @memberOf StockChartX.UI.IndicatorsDialog
   */
  static showSettingsBeforeAdding: boolean = false;

  constructor(container: JQuery) {
    super(container);

    this._initFields();
    this._init();
  }

  public show(config: IIndicatorsDialogConfig): void {
    if (!this.initDialog(config)) return;

    this._inp_search.val("");
    this._setDialogTitle();
    this._filterIndicators("");
    super.show(config);
    if (!Environment.isPhone) this._inp_search.focus();
  }

  public hide(): void {
    this._dialogContent.body.find(`.${CLASS_HAS_TOOLTIP}`).popover("hide");

    super.hide();
  }

  private _init(): void {
    let body = $("body");

    this._noResultObj.hide();
    this._generateObjects();

    for (let group in groups) {
      if (groups.hasOwnProperty(group)) {
        this._resultContainer.append(groups[group].group.root);
      }
    }

    this._inp_search.on("keyup", (e: JQueryEventObject) => {
      this._filterIndicators($(e.currentTarget).val());
    });

    this._btnClearInput.on("click", () => {
      if (this._inp_search.val().length) this._clearInput();
    });

    this._resultContainer.on(
      "click",
      `.${CLASS_INDICATOR_ITEM}`,
      (e: JQueryEventObject) => {
        let item = $(e.currentTarget);

        item.addClass("active");
        setTimeout(() => {
          item.removeClass("active");
        }, 200);

        try {
          if (this._config.done) {
            let taIndicator = parseInt(<string>item.attr("data-scx_id"), 10);
            this._config.done(taIndicator);
          }
        } catch (exeption) {
          console.log(exeption);
          Localization.localizeText(
            this._config.chart,
            "notification.indicators.msg.noMoreSpace"
          ).then((text: string) => {
            Notification.warning(text);
          });
        }
      }
    );

    this._resultContainer.on(
      "mouseover",
      `.${CLASS_INDICATOR_ITEM}`,
      (e: JQueryEventObject) => {
        if (this._helpEnabled) {
          let self = $(e.currentTarget);

          this._tooltipBodyHovered = false;
          this._tooltipHoverTimer = setTimeout(() => {
            this._lastHoveredLi = self;
            this._lastHoveredLi.popover("show");
            this._tooltipHoverTimer = null;
          }, SHOW_TOOLTIP_DELAY) as any;
        }
      }
    );

    this._resultContainer.on("mouseout", `.${CLASS_INDICATOR_ITEM}`, () => {
      if (this._helpEnabled) {
        if (this._tooltipHoverTimer) {
          clearTimeout(this._tooltipHoverTimer);
          this._tooltipHoverTimer = null;
        }
        setTimeout(() => {
          if (!this._tooltipBodyHovered) {
            if (this._lastHoveredLi) {
              this._lastHoveredLi.popover("hide");
            }
          }
        }, 100);
      }
    });

    body.on("mouseover", "div.popover", () => {
      if (this._helpEnabled) {
        this._tooltipBodyHovered = true;
      }
    });

    body.on("mouseleave", "div.popover", () => {
      if (this._helpEnabled) {
        if (this._lastHoveredLi) {
          this._lastHoveredLi.popover("hide");
        }
        this._tooltipBodyHovered = false;
      }
    });

    if (Environment.isMobile) {
      this._helpPanel.remove();
    } else {
      let switchery = new Switchery(
        document.querySelector("#scxIndicators_chkHelpSwitcher"),
        {
          color: "#64bd63",
          secondaryColor: "#ddd",
          className: "scx_switchery",
          disabled: false,
          disabledOpacity: 0.5,
          speed: "0.4s"
        }
      );

      body.bind("scxSwitcherChanged", (evtData: any) => {
        if (!$(evtData.target).is(this._tooltipSwitcher)) return;
        if (this._helpDownloaded === false) {
          this._tooltipLabel.hide();
          this._tooltipDownloading.show();
          switchery.disable();

          HtmlLoader.loadHtml("IndicatorsHelp.html", (html: string) => {
            this._helpDownloaded = true;
            this._tooltipDownloading.hide();
            this._tooltipLabel.show();
            switchery.enable();
            this._tooltipHTMLObj = $(html);
            this._helpEnabled = true;
            this._switchHelpTooltips();
          });
        } else {
          this._helpEnabled = evtData.checked;
          this._switchHelpTooltips();
        }
      });
    }
  }

  private _generateObjects(): void {
    let indicatorIDs = {
      Bands: IndicatorDefaults.bands(),
      General: IndicatorDefaults.general(),
      Index: IndicatorDefaults.indices(),
      MovingAverage: IndicatorDefaults.movingAverages(),
      Oscillator: IndicatorDefaults.oscillators(),
      Regression: IndicatorDefaults.regressions()
    };

    for (let groupName in indicatorIDs) {
      if (indicatorIDs.hasOwnProperty(groupName)) {
        let group = this._generateIndicatorGroup(IndicatorGroups[groupName]);
        let indicators = (() => {
          let items = [];
          for (let id of indicatorIDs[groupName]) {
            items.push(this._generateIndicatorItem(id));
          }
          return items;
        })();

        group.itemsContainer.append(indicators);
        this._sortItems(group.itemsContainer);
        this._applyColumns(group.itemsContainer);

        groups[groupName] = {
          indicators: indicators,
          group: group
        };
      }
    }
  }

  private _filterIndicators(searchText: string): void {
    searchText = searchText
      .toString()
      .trim()
      .toLowerCase();

    let group,
      indicator,
      matchedCount = 0,
      totalMatchedCount = 0;

    for (let i in groups) {
      if (groups.hasOwnProperty(i)) {
        for (let groupIndicator of groups[i].indicators) {
          groupIndicator.detach();
        }

        group = groups[i].group;
        group.itemsContainer.empty();
        matchedCount = 0;

        for (let j = 0; j < groups[i].indicators.length; j++) {
          indicator = groups[i].indicators[j];
          let indicatorId = indicator.attr("data-scx_id");
          let indicatorAliasName = TASdk.getIndicatorAliasName(indicatorId);
          let shouldDisplayIndicator = TASdk.indicatorVisiblity[indicatorId];
          if (!shouldDisplayIndicator) {
            continue;
          }
          if (
            indicator
              .text()
              .toLowerCase()
              .indexOf(searchText) >= 0
          ) {
            matchedCount++;
            totalMatchedCount++;
            group.itemsContainer.append(indicator);
          } else if (
            indicatorAliasName.indexOf(searchText.toUpperCase()) >= 0
          ) {
            matchedCount++;
            totalMatchedCount++;
            group.itemsContainer.append(indicator);
          }
        }

        if (matchedCount) {
          this._sortItems(group.itemsContainer);
          this._applyColumns(group.itemsContainer);
          group.root.show();
        } else {
          group.root.hide();
        }
      }
    }

    if (totalMatchedCount) {
      this._noResultObj.hide();
    } else {
      this._noResultObj.show();
    }
  }

  private _sortItems(container: JQuery): void {
    let tmp = container.children().detach();
    tmp.sort((a, b) => {
      return $(a).text() < $(b).text() ? -1 : 1;
    });
    container.append(tmp);
  }

  // noinspection JSMethodCanBeStatic
  private _applyColumns(container: JQuery): void {
    container.autocolumnlist({
      columns: 3,
      classname: CLASS_INDICATOR_COLUMN
    });
  }

  private _switchHelpTooltips(): void {
    for (let i in groups) {
      if (!groups.hasOwnProperty(i)) continue;

      for (let groupIndicator of groups[i].indicators) {
        if (this._helpEnabled) this._enableItemHelpTooltip(groupIndicator);
        else this._disableItemHelpTooltip(groupIndicator);
      }
    }
  }

  private _enableItemHelpTooltip(indicatorItem: JQuery): void {
    if (!this._helpEnabled) return;

    let tooltipHTML = this._tooltipHTMLObj
      .find("#scxIndicatorTooltip_id" + indicatorItem.attr("data-scx_id"))
      .clone();
    if (!tooltipHTML.length)
      tooltipHTML = $(
        '<p style="margin-bottom: 0;">Sorry. There is no help for this indicator yet</p>'
      );
    tooltipHTML
      .css({ display: "block" })
      .addClass("scxIndicators_tooltipWrapper");

    this._config.chart.localize(tooltipHTML);
    indicatorItem.addClass(CLASS_HAS_TOOLTIP).popover({
      trigger: "manual",
      placement: "auto left",
      delay: { show: 500, hide: 100 },
      container: <string>(<any>HtmlContainer.instance.componentsContainer),
      viewport: { selector: "body", padding: 0 },
      html: true,
      content: () => {
        return $("<div></div>")
          .append(tooltipHTML)
          .html();
      }
    });
  }

  // noinspection JSMethodCanBeStatic
  private _disableItemHelpTooltip(indicatorItem: JQuery): void {
    indicatorItem.removeClass(CLASS_HAS_TOOLTIP).popover("destroy");
  }

  private _generateIndicatorGroup(id: number) {
    let indicatorGroupHTMLTemplate =
      '<div class="scxIndicatorsGroup">' +
      '<h4 class="scxIndicatorsGroup_header"></h4>' +
      '<div class="scxIndicatorsGroup_indicators"><ul></ul></div>' +
      "</div>";

    let obj = $(indicatorGroupHTMLTemplate);
    obj
      .find(".scxIndicatorsGroup_header")
      .text(this._indicatorGroupToString(id));

    return {
      root: obj,
      itemsContainer: obj.find(".scxIndicatorsGroup_indicators ul")
    };
  }

  // noinspection JSMethodCanBeStatic
  private _generateIndicatorItem(id: number): JQuery {
    let indicatorHTMLTemplate =
      '<li class="scxIndicatorItem" data-scx_id=""></li>';
    let name, aliasName;
    switch (id) {
      case VolumeIndicator:
        name = "Volume";
        aliasName = "Volume";
        break;
      case ColoredVolumeIndicator:
        name = "Colored Volume";
        aliasName = "Colored Volume";
        break;
      default:
        name = TASdk.indicatorToString(id);
        aliasName = TASdk.getIndicatorAliasName(id);
    }

    return $(indicatorHTMLTemplate)
      .attr("data-scx_id", id)
      .attr("data-scx_indicator_alias", aliasName)
      .text(name);
  }

  private _clearInput(): void {
    this._inp_search.val("");
    this._filterIndicators("");
    this._inp_search.focus();
  }

  // noinspection JSMethodCanBeStatic
  private _indicatorGroupToString(group: number | string): string {
    switch (parseInt(<string>group, 10)) {
      case IndicatorGroups.Bands:
        return "Bands";
      case IndicatorGroups.General:
        return "General";
      case IndicatorGroups.Index:
        return "Index";
      case IndicatorGroups.MovingAverage:
        return "Moving Average";
      case IndicatorGroups.Oscillator:
        return "Oscillator";
      case IndicatorGroups.Regression:
        return "Regression";
      default:
        return "";
    }
  }

  private _setDialogTitle() {
    this._title.scxLocalize("indicatorDialog.title");
  }

  private _initFields(): void {
    this._inp_search = this._dialog.find("#scxIndicators_inp_search");
    this._title = this._dialog.find("#scxIndicatorsDialog_title");
    this._resultContainer = this._dialog.find("#scxIndicatorsResult");
    this._noResultObj = this._dialog.find(".scxNoResult");
    this._tooltipSwitcher = this._dialog.find("#scxIndicators_chkHelpSwitcher");
    this._tooltipDownloading = this._dialog.find(".scxLabel_downloading");
    this._tooltipLabel = this._dialog.find(
      'label[for="scxIndicators_chkHelpSwitcher"]'
    );
    this._btnClearInput = this._dialog.find("#scxIndicators_btn_clearInput");
    this._helpPanel = this._dialog.find(".scxIndicators_helpControlPanel");
  }
}
