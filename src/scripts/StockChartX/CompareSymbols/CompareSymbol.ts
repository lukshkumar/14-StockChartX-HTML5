/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

import {
  Class,
  Chart,
  IchimokuIndicator,
  DarvasBox,
  TAIndicator,
  IInstrument,
  StockSymbol
} from "../index";
import { ViewLoader, IndicatorsDialog } from "../../StockChartX.UI/index";
export type ICompareSymbolsConfig = {
  chart: Chart;
  isOverlay?: boolean;
};
type ISymbolProperties = any;

/**
 * Describes Compare Symbol which contains new Symbols added on Screen.
 * @param {Object} config The configuration object.
 * @param {StockChartX.chart} config.chart The parent chart.
 * @constructor StockChartX.CompareSymbol
 */
export class CompareSymbol {
  /**
   * @internal
   */
  private _symbols: ISymbolProperties;

  /**
   * @internal
   */
  private _chart: Chart;

  /**
   * @internal
   */
  _initPanel(symbol: string) {
    const div = this._symbols[symbol].chartPanel.titleDiv.scxAppend(
      "span",
      Class.TITLE
    );

    div
      .scxAppend("span", [Class.TITLE_ICON, Class.TITLE_SHOW])
      .attr("title", "Add indicator")
      .on("click", () => {
        this._handleIndicatorsClick(symbol);
      });
  }

  constructor(config: ICompareSymbolsConfig) {
    this._chart = config.chart;
  }

  /**
   * @internal
   */
  private setSymbolPropsByName(name: string, symbol: ISymbolProperties) {
    if (!this._symbols) {
      this._symbols = {};
    }
    this._symbols[name] = symbol;
  }

  /**
   * Adds new Symbol in a separate chart panel.
   * @name panelPadding
   * @type {StockChartX.StockSymbol}
   * @memberOf StockChartX.CompareSymbol
   * @private
   * @internal
   */
  public addSymbol(instrument: IInstrument) {
    if (!instrument.exchange) {
      instrument.exchange = "";
    }
    if (!instrument.symbol) {
      instrument.symbol = "";
    }

    const newSymbol = new StockSymbol({
      instrument,
      chart: this._chart
    });

    const name = newSymbol.getSymbolName();

    this.setSymbolPropsByName(name, newSymbol);
    this._initPanel(name);

    return newSymbol;
  }

  /**
   * @internal
   */
  private _handleIndicatorsClick(symbol: string) {
    ViewLoader.indicatorsDialog((dialog: IndicatorsDialog) => {
      dialog.show({
        chart: this._chart,
        done: (taIndicator: number) => {
          let chart = this._chart,
            showSettingsDialog = IndicatorsDialog.showSettingsBeforeAdding,
            indicator;

          if (!chart) return;
          const defaultConfig = {
            chart,
            symbol
          };

          switch (taIndicator) {
            case 87:
              indicator = new IchimokuIndicator(<any>defaultConfig);
              break;
            case 88:
              indicator = new DarvasBox(<any>defaultConfig);
              break;
            default:
              indicator = new TAIndicator({
                taIndicator: taIndicator as number,
                ...defaultConfig
              });
              break;
          }

          if (indicator.isOverlay) {
            indicator._panel = this._symbols[symbol].chartPanel;
          } else {
            const chartPanel = this._chart.addChartPanel(
              this._chart.chartPanels.length
            );
            chartPanel._createContainer();
            chartPanel.symbol = this._symbols[symbol];
            indicator._panel = chartPanel;
          }
          chart.addIndicators(indicator);
          if (showSettingsDialog) {
            indicator.showSettingsDialog();
          }

          chart.update();
        }
      });
    });
  }
}
