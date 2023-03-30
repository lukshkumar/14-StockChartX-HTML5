import { WaitingBar } from "./index";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */
import {
  ChartContextMenu,
  IChartContextMenuConfig
} from "./index";
import { ChartNavigation } from "./index";
import { Chart } from "../StockChartX/index";
import { Spectrum } from "../external/typescript/spectrum";
import { ColorPicker } from "./index";
import {
  IIndicatorContextMenuConfig,
  IndicatorContextMenu
} from "./index";
import {
  IInstrumentSearchConfig,
  InstrumentSearch
} from "./index";
import { INumericFieldConfig } from "./index";
import { ITimeFramePickerConfig, TimeFramePicker } from "./index";
import { Toolbar } from "./index";
import { Scrollbar } from "./index";
import {
  IToolbarDropDownButtonConfig,
  ToolbarDropDownButton
} from "./index";

const jQuery = window.jQuery;

/* tslint:disable:interface-name */
/**
 * @internal
 */
declare global {
  interface JQuery {
    scx(): IScxJQuery;
  }
}

/* tslint:enable */

/**
 * @internal
 */
"use strict";

export interface IScxJQuery {
  chartContextMenu(config: IChartContextMenuConfig): ChartContextMenu;
  chartNavigation(chart: Chart): ChartNavigation;
  colorPicker(config: Spectrum.Options): ColorPicker;
  indicatorContextMenu(
    config: IIndicatorContextMenuConfig
  ): IndicatorContextMenu;
  instrumentSearch(config: IInstrumentSearchConfig): InstrumentSearch;
  numericField(config: INumericFieldConfig): JQuery;
  timeFramePicker(config: ITimeFramePickerConfig): TimeFramePicker;
  toolbar(chart?: Chart): Toolbar;
  scrollbar(chart?: Chart): Scrollbar;
  toolbarDropDownButton(
    config: IToolbarDropDownButtonConfig
  ): ToolbarDropDownButton;
  waitingBar(): WaitingBar;
}

// tslint:disable:no-invalid-this
jQuery.fn.scx = function(): IScxJQuery {
  return {
    chartContextMenu: (config: IChartContextMenuConfig): ChartContextMenu =>
      new ChartContextMenu(this, config),

    chartNavigation: (chart: Chart): ChartNavigation =>
      new ChartNavigation({ target: this, chart }),

    colorPicker: (config: Spectrum.Options): ColorPicker =>
      new ColorPicker(this, config),

    indicatorContextMenu: (
      config: IIndicatorContextMenuConfig
    ): IndicatorContextMenu => new IndicatorContextMenu(this, config),

    instrumentSearch: (config: IInstrumentSearchConfig) =>
      new InstrumentSearch(this, config),

    numericField: (config: INumericFieldConfig) => this.scxNumericField(config),

    timeFramePicker: (config: ITimeFramePickerConfig) =>
      new TimeFramePicker(this, config),

    toolbar: (chart?: Chart): Toolbar => new Toolbar({ parent: this, chart }),

    scrollbar: (chart?: Chart): Scrollbar =>
      new Scrollbar({ parent: this, chart }),

    toolbarDropDownButton: (
      config: IToolbarDropDownButtonConfig
    ): ToolbarDropDownButton => new ToolbarDropDownButton(this, config),

    waitingBar: (): WaitingBar => new WaitingBar(this)
  };
};
// tslint:enable:no-invalid-this
