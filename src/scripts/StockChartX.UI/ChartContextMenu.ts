/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import { HtmlLoader } from "./index";
import { ContextMenu, IContextMenuConfig } from "./index";
import { Chart, ChartPanel } from "../StockChartX/index";
import { HtmlContainer } from "./index";
import { PriceStyleClassNames } from "../StockChartX/Utils/PriceStyleClassNames";

"use strict";

export interface IChartContextMenuConfig extends IContextMenuConfig {
  chart: Chart;
  chartPanel?: ChartPanel;
}

// endregion

// region Declarations

const CLASS_DISABLED = "disabled";
const SEARCH_PATTERN_FORMAT = "[data-id=format]";

const ChartContextMenuItem = {
  FORMAT: "format"
};
Object.freeze(ChartContextMenuItem);

// endregion

export class ChartContextMenu extends ContextMenu {
  private static _container: JQuery;
  public static MenuItem = ChartContextMenuItem;

  private _chartContextMenuConfig: IChartContextMenuConfig;

  constructor(targetDomObject: JQuery, config: IChartContextMenuConfig) {
    super(config, targetDomObject);

    this._chartContextMenuConfig = config;

    HtmlLoader.loadHtml("ChartContextMenu.html", (html: string) => {
      if (!ChartContextMenu._container) {
        ChartContextMenu._container = HtmlContainer.instance.register(
          "ChartContextMenu",
          html
        );
      }

      this._initMenu(this._chartContextMenuConfig);
    });
  }

  private _initMenu(config: IChartContextMenuConfig): void {
    config.onShow = () => {
      this._onShow();
    };
  }

  private _onShow() {
    let config = <IChartContextMenuConfig>this._config;
    let container = (config.menuContainer = ChartContextMenu._container);
    let formatElement = container.find(SEARCH_PATTERN_FORMAT);
    if (config.chartPanel && config.chartPanel.symbol) {
      formatElement.removeClass(CLASS_DISABLED);
      return;
    }
    switch (config.chart.priceStyleKind) {
      // @if SCX_LICENSE != 'free'
      case PriceStyleClassNames.BarPriceStyle:
      case PriceStyleClassNames.HLBarPriceStyle:
      case PriceStyleClassNames.HLCBarPriceStyle:
      case PriceStyleClassNames.ColoredHLBarPriceStyle:
      case PriceStyleClassNames.ColoredHLCBarPriceStyle:
      case PriceStyleClassNames.ColoredBarPriceStyle:
      // @endif
      // @if SCX_LICENSE = 'full'
      case PriceStyleClassNames.KagiPriceStyle:
      case PriceStyleClassNames.LineBreakPriceStyle:
      case PriceStyleClassNames.PointAndFigurePriceStyle:
      case PriceStyleClassNames.RenkoPriceStyle:
        formatElement.removeClass(CLASS_DISABLED);
        break;
      // @endif
      default:
        formatElement.addClass(CLASS_DISABLED);
        break;
    }
  }

  // region IDestroyable

  destroy() {
    this._chartContextMenuConfig.chart = null;

    super.destroy();
  }

  // endregion
}
