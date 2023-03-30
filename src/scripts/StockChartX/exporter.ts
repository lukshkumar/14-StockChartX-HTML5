import * as StockChartX from "./index";
import * as UI from "../StockChartX.UI/index";
import Selectpicker from "../StockChartX.External/index";
import * as TASdk from "../TASdk/exporter";
window.StockChartX = {
  ...window.StockChartX,
  ...StockChartX
};

window.TASdk = { ...TASdk };
window.StockChartX.External = {
  Selectpicker
};

window.StockChartX.UI = {
  ...UI
};
