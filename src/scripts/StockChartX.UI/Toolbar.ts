import { IValueChangedEvent } from "../StockChartX/index";
import { JQueryEventObject } from "../external/typescript/jquery.d";
// import { Chart, IInstrument } from "../StockChartX/index";
import { ChartEvent, IInstrument } from "../StockChartX/index";
import { InstrumentSearch } from "./index";
import { TimeFramePicker } from "./index";
import { ToolbarDropDownButton } from "./index";
import { HtmlLoader } from "./index";
import { Environment } from "../StockChartX/index";
// import { $ } from "../external/typescript/jquery";
import { TimeFrame } from "../StockChartX/index";
import { WindowMode } from "../StockChartX/index";
import { ScaleKind, Chart } from "../StockChartX/index";
import { HLBarPriceStyle } from "../StockChartX/index";
import { HLCBarPriceStyle } from "../StockChartX/index";
import { ColoredHLBarPriceStyle } from "../StockChartX/index";
import { ColoredHLCBarPriceStyle } from "../StockChartX/index";
import { ViewLoader } from "./index";
import { IndicatorsDialog } from "./index";
import { IchimokuIndicator } from "../StockChartX/index";
import { DarvasBox } from "../StockChartX/index";
import { TAIndicator } from "../StockChartX/index";
import { ThemeDialog } from "./index";
import { Theme } from "../StockChartX/index";
import { Drawing } from "../StockChartX/index";
import { ZoomInMode } from "../StockChartX/index";
const $ = window.jQuery;

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

// region Interfaces

export interface IToolbarConfig {
  parent: JQuery;
  chart?: Chart;
  showViewMode?: boolean;
}

interface IToolbarControls {
  instrument: InstrumentSearch;
  timeFrame: TimeFramePicker;
  priceStyle: ToolbarDropDownButton;
  crossHair: ToolbarDropDownButton;
  markerDrawings: ToolbarDropDownButton;
  geometricDrawings: ToolbarDropDownButton;
  fibonacciDrawings: ToolbarDropDownButton;
  trendDrawings: ToolbarDropDownButton;
  generalDrawings: ToolbarDropDownButton;
  zoomIn: ToolbarDropDownButton;
  hideDrawings: ToolbarDropDownButton;
  showDrawingTooltip: ToolbarDropDownButton;
  deleteObject: ToolbarDropDownButton;
  stayInDrawingMode: ToolbarDropDownButton;
}

// endregion

const EVENTS_SUFFIX = ".scxToolbar";
const CLASS_IS_PHONE = "scxPhone";

const DataValue = {
  ToggleFullWindow: "toggleFullWindow",
  ToggleFullscreen: "toggleFullScreen"
};

export class Toolbar {
  private _controls: IToolbarControls;
  private _container: JQuery;

  // region Properties

  private _chart: Chart;
  get chart(): Chart {
    return this._chart;
  }

  set chart(value: Chart) {
    if (this._chart !== value) {
      this._unsubscribeEvents();
      this._chart = value;
      this._subscribeEvents();
      this._updateForNewChart();
      if (this._chart) this._chart.localize();
    }
  }

  // endregion

  constructor(config: IToolbarConfig) {
    HtmlLoader.loadHtml("Toolbar.html", (html: string) => {
      this._init(html, config);
    });
  }

  private _init(html: string, config: IToolbarConfig): void {
    let chart = (this.chart = config.chart);
    if (!chart.container) return;

    this._container = $(html).prependTo(config.parent);
    let toolbar = this._container;
    let controls = (this._controls = <IToolbarControls>{});

    if (Environment.isPhone) {
      this._container.addClass(CLASS_IS_PHONE);
    }

    // Search instrument
    controls.instrument = toolbar
      .find(".symbolSearch")
      .scx()
      .instrumentSearch({
        onChange: (instrument: IInstrument) => {
          this._handleInstrumentChange(instrument);
        }
      });

    // Time frame
    controls.timeFrame = toolbar
      .find(".scxTimeFramePicker")
      .scx()
      .timeFramePicker({
        selectionChanged: (timeFrame: TimeFrame) => {
          this._handleTimeFrameChange(timeFrame);
        }
      });

    // Indicators
    toolbar
      .find(".scxToolbar-btn-indicators")
      .on("click", (e: JQueryEventObject) => {
        $(e.target).removeClass("hover");

        this._handleIndicatorsClick();
      });
    //Temporary Workaround
    $(document).ready(() => {
      if (this.chart.valueScaleKind === ScaleKind.LOGARITHMIC) {
        toolbar
          .find(".scxToolbarButton-scaleBtn")
          .closest(".scxToolbarButton")
          .addClass("activated");
      }
    });
    //Scale
    toolbar
      .find(".scxToolbarButton-scaleBtn")
      .on("click", (e: JQueryEventObject) => {
        $(e.target).removeClass("hover");
        $(e.target)
          .closest(".scxToolbarButton")
          .toggleClass("activated");

        this._handleScaleClick();
      });

    // Theme
    toolbar
      .find(".scxToolbar-btn-theme")
      .on("click", (e: JQueryEventObject) => {
        $(e.target).removeClass("hover");

        this._handleThemeClick();
      });

    // Price style
    controls.priceStyle = toolbar
      .find(".scxToolbarBarStyle")
      .scx()
      .toolbarDropDownButton({
        selectionChanged: (dataValue: string, isActivated: boolean) => {
          this._handlePriceStyleChange(dataValue, isActivated);
        }
      });

    // Cross hair
    controls.crossHair = toolbar
      .find(".scxToolbarCrossHair")
      .scx()
      .toolbarDropDownButton({
        selectionChanged: (dataValue: string, isActivated: boolean) => {
          this._handleCrossHairChange(dataValue, isActivated);
        }
      });

    // region Drawings

    controls.markerDrawings = toolbar
      .find(".scxToolbarMarkerDrawings")
      .scx()
      .toolbarDropDownButton({
        selectionChanged: (dataValue: string, isActivated: boolean) => {
          this._handleDrawingClick(dataValue, isActivated);
        }
      });

    controls.geometricDrawings = toolbar
      .find(".scxToolbarGeometricDrawings")
      .scx()
      .toolbarDropDownButton({
        selectionChanged: (dataValue: string, isActivated: boolean) => {
          this._handleDrawingClick(dataValue, isActivated);
        }
      });

    controls.fibonacciDrawings = toolbar
      .find(".scxToolbarFibonacciDrawings")
      .scx()
      .toolbarDropDownButton({
        selectionChanged: (dataValue: string, isActivated: boolean) => {
          this._handleDrawingClick(dataValue, isActivated);
        }
      });

    controls.trendDrawings = toolbar
      .find(".scxToolbarTrendDrawings")
      .scx()
      .toolbarDropDownButton({
        selectionChanged: (dataValue: string, isActivated: boolean) => {
          this._handleDrawingClick(dataValue, isActivated);
        }
      });

    controls.generalDrawings = toolbar
      .find(".scxToolbarGeneralDrawings")
      .scx()
      .toolbarDropDownButton({
        selectionChanged: (dataValue: string, isActivated: boolean) => {
          this._handleDrawingClick(dataValue, isActivated);
        }
      });

    // endregion

    controls.zoomIn = toolbar
      .find(".scxToolbarZoomIn")
      .scx()
      .toolbarDropDownButton({
        selectionChanged: (dataValue: string, isActivated: boolean) => {
          this._handleZoomInClick(dataValue, isActivated);
        }
      });

    controls.hideDrawings = toolbar
      .find(".scxToolbar-btn-hideDrawings")
      .scx()
      .toolbarDropDownButton({
        selectionChanged: (dataValue: string, isActivated: boolean) => {
          this._handleHideDrawingsClick(isActivated);
        }
      });

    /*controls.showDrawingTooltip = toolbar.find('.scxToolbar-btn-enableDrawingsTooltip').scx().toolbarDropDownButton({
                selectionChanged: (dataValue: string, isActivated: boolean) => {
                    this._handleDrawingsTooltipClick(isActivated);
                }
            });*/

    controls.stayInDrawingMode = toolbar
      .find(".scxToolbar-btn-stayInDrawingMode")
      .scx()
      .toolbarDropDownButton({
        selectionChanged: (dataValue: string, isActivated: boolean) => {
          this._handleDrawingModeClick(isActivated);
        }
      });

    controls.deleteObject = toolbar
      .find(".scxToolbarDelete")
      .scx()
      .toolbarDropDownButton({
        selectionChanged: (dataValue: string, isActivated: boolean) => {
          this._handleDeleteClick(dataValue, isActivated);
        }
      });

    // Save as image
    toolbar.find(".scxToolbarSaveImage").on("click", (e: JQueryEventObject) => {
      $(e.target).removeClass("hover");

      this._handleSaveImageClick();
    });

    // Full window / full screen
    // Disallow full screen on mobile devices
    let btnViewMode = toolbar.find(".scxToolbarViewMode");
    if (config.showViewMode === false) {
      btnViewMode.remove();
    } else if (Environment.isMobile || Environment.isPhone) {
      btnViewMode
        .on("click", () => {
          this._handleViewModeChange("toggleFullWindow", false);
        })
        .removeClass("scxToolbarButtonWithDropdown");
    } else {
      btnViewMode.scx().toolbarDropDownButton({
        chart: this.chart,
        selectionChanged: (dataValue: string, isActivated: boolean) => {
          this._handleViewModeChange(dataValue, isActivated);
        }
      });
    }

    if (chart) chart.fireValueChanged(ChartEvent.TOOLBAR_LOADED, this);

    this._updateForNewChart();
  }

  prependTo(container: JQuery) {
    if (!container) return;
    this._container.detach();
    this._container = this._container.prependTo(container);
  }

  private _subscribeEvents() {
    let chart = this.chart;
    if (!chart) return;

    chart
      .on(
        ChartEvent.INSTRUMENT_CHANGED + EVENTS_SUFFIX,
        (event: IValueChangedEvent) => {
          this._controls.instrument.set(<IInstrument>event.value);
        }
      )
      .on(
        ChartEvent.TIME_INTERVAL_CHANGED + EVENTS_SUFFIX,
        (event: IValueChangedEvent) => {
          this._controls.timeFrame.set(event.value);
        }
      )
      .on(ChartEvent.PRICE_STYLE_CHANGED + EVENTS_SUFFIX, () => {
        let priceStyle = this.chart && this.chart.priceStyle;
        if (!priceStyle) return;
        // @if SCX_LICENSE != 'free'
        if (
          priceStyle instanceof HLBarPriceStyle ||
          priceStyle instanceof HLCBarPriceStyle ||
          priceStyle instanceof ColoredHLBarPriceStyle ||
          priceStyle instanceof ColoredHLCBarPriceStyle
        )
          return;
        // @endif
        this._controls.priceStyle.selectItem(this.chart.priceStyleKind, false);
      })
      .on(ChartEvent.CROSS_HAIR_CHANGED + EVENTS_SUFFIX, () => {
        this._controls.crossHair.selectItem(this.chart.crossHairType, false);
      })
      .on(
        `${ChartEvent.ZOOM_IN_FINISHED}${EVENTS_SUFFIX} ${
          ChartEvent.ZOOM_IN_CANCELLED
        }${EVENTS_SUFFIX}`,
        () => {
          this._controls.zoomIn.deactivate();
        }
      )
      .on(
        [
          ChartEvent.USER_DRAWING_FINISHED,
          ChartEvent.USER_DRAWING_CANCELLED,
          ""
        ].join(`${EVENTS_SUFFIX} `),
        () => {
          let controls = this._controls;

          if (!chart.stayInDrawingMode) {
            controls.markerDrawings.deactivate();
            controls.geometricDrawings.deactivate();
            controls.fibonacciDrawings.deactivate();
            controls.trendDrawings.deactivate();
            controls.generalDrawings.deactivate();
          }
        }
      )
      .on(ChartEvent.STATE_LOADED + EVENTS_SUFFIX, () => {
        this._controls.priceStyle.selectItem(this.chart.priceStyleKind, false);
        this._controls.crossHair.selectItem(this.chart.crossHairType, false);
      });
  }

  private _unsubscribeEvents() {
    if (this._chart) {
      this._chart.cancelUserDrawing();
      this._chart.cancelZoomIn();
      this._chart.off(EVENTS_SUFFIX);
    }
  }

  private _updateForNewChart() {
    let chart = this.chart,
      controls = this._controls;
    if (!controls) return;

    for (let prop in controls) {
      if (
        controls.hasOwnProperty(prop) &&
        controls[prop] instanceof ToolbarDropDownButton
      ) {
        controls[prop].chart = chart;
        if (!(prop === "hideDrawings" || prop === "stayInDrawingMode"))
          controls[prop].deactivate();
      }
    }

    controls.timeFrame.chart = chart;

    if (!chart) return;

    controls.instrument.set(chart.instrument);
    controls.timeFrame.chart = chart;
    controls.timeFrame.set(chart.timeInterval);
    controls.priceStyle.selectItem(chart.priceStyleKind, false);
    controls.crossHair.selectItem(chart.crossHairType, false);

    if (chart.showDrawings) controls.hideDrawings.deactivate();
    else controls.hideDrawings.activate();
    if (!chart.stayInDrawingMode) controls.stayInDrawingMode.deactivate();
    else controls.stayInDrawingMode.activate();

    if (
      chart.windowMode === WindowMode.FULL_WINDOW ||
      chart.windowMode === WindowMode.FULL_SCREEN
    ) {
      chart.windowModeHandler.adjustFullWindowSize();
    }
  }

  // region Handlers

  private _handleInstrumentChange(instrument: IInstrument) {
    if (!instrument) return;

    let chart = this.chart;
    if (!chart) return;
    let oldSymbol = chart.instrument && chart.instrument.symbol.toUpperCase();
    let newSymbol = instrument.symbol.toUpperCase();
    if (newSymbol !== chart.instrument.symbol) {
      chart.fireValueChanged(ChartEvent.SYMBOL_ENTERED, instrument);
      if (newSymbol !== oldSymbol) {
        chart.instrument = instrument;
        chart.sendBarsRequest();
      }
    }
  }

  private _handleTimeFrameChange(timeFrame: TimeFrame) {
    let chart = this.chart;
    if (chart) {
      chart.timeFrame = timeFrame;
      chart.sendBarsRequest();
      chart.timeInterval = TimeFrame.timeFrameToTimeInterval(timeFrame);
      chart.fireValueChanged(ChartEvent.TIME_FRAME_CHANGED, timeFrame);
    }
  }

  private _handleIndicatorsClick() {
    ViewLoader.indicatorsDialog((dialog: IndicatorsDialog) => {
      dialog.show({
        chart: this.chart,
        done: (taIndicator: number) => {
          let chart = this.chart,
            showSettingsDialog = IndicatorsDialog.showSettingsBeforeAdding,
            indicator;

          if (!chart) return;

          switch (taIndicator) {
            case 87:
              indicator = new IchimokuIndicator();
              break;
            case 88:
              indicator = new DarvasBox();
              break;
            default:
              indicator = new TAIndicator({
                taIndicator: <number>(<any>taIndicator)
              });
              break;
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
  private _handleScaleClick() {
    if (this.chart.valueScaleKind === ScaleKind.LOGARITHMIC) {
      this.chart.valueScaleKind = ScaleKind.LINEAR;
    } else {
      this.chart.valueScaleKind = ScaleKind.LOGARITHMIC;
    }
    this.chart.setNeedsUpdate(true);
  }
  private _handleThemeClick() {
    ViewLoader.themeDialog((dialog: ThemeDialog) => {
      dialog.show({
        chart: this.chart,
        theme: this.chart.theme,
        done: (theme: any) => {
          let chart = this.chart;
          if (chart) {
            Theme[theme.name] = chart.theme = theme;
            chart.setNeedsUpdate();
          }
        }
      });
    });
  }

  private _handlePriceStyleChange(dataValue: string, isActivated: boolean) {
    let chart = this.chart;
    if (chart && isActivated && dataValue) {
      chart.priceStyleKind = dataValue;
      chart.setNeedsUpdate();
    }
  }

  private _handleCrossHairChange(dataValue: string, isActivated: boolean) {
    let chart = this.chart;
    if (chart && isActivated && dataValue) {
      chart.crossHairType = dataValue;
    }
  }

  private _handleDrawingClick(dataValue: string, isActivated: boolean): void {
    let chart = this.chart;
    if (!chart) return;

    if (!isActivated) {
      chart.cancelUserDrawing();
    } else if (isActivated && dataValue) {
      let drawing = Drawing.deserialize({ className: dataValue });
      chart.startUserDrawing(drawing);
    }
  }

  private _handleZoomInClick(dataValue: string, isActivated: boolean): void {
    let chart = this.chart;
    if (!chart) return;

    if (!isActivated) {
      chart.cancelZoomIn();
    } else if (dataValue && isActivated) {
      chart.startZoomIn(<ZoomInMode>dataValue);
    }
  }

  private _handleHideDrawingsClick(isActivated: boolean): void {
    let chart = this.chart;
    if (chart) {
      chart.showDrawings = !isActivated;
      chart.setNeedsUpdate();
    }
  }

  // private _handleDrawingsTooltipClick(isActivated: boolean): void {
  //     let chart = this.chart;
  //     if (chart) {
  //         chart.showDrawingTooltips = isActivated;
  //         chart.setNeedsUpdate();
  //     }
  // }

  private _handleDrawingModeClick(isActivated: boolean): void {
    let chart = this.chart;
    if (!chart) return;
    chart.stayInDrawingMode = isActivated;
    if (!isActivated) chart.cancelUserDrawing();
  }

  private _handleDeleteClick(dataValue: string, isActivated: boolean): void {
    let chart = this.chart;
    if (!chart) return;

    if (dataValue === "deleteDrawing") {
      let drawing = chart.selectedObject;
      let panel = drawing instanceof Drawing && drawing.chartPanel;

      if (panel) {
        panel.removeDrawings(<Drawing>drawing);
        panel.update();
      }
    }

    if (isActivated && dataValue === "deleteAllDrawings") {
      chart.removeDrawings();
      chart.setNeedsUpdate(true);
    }

    if (isActivated && dataValue === "deleteAllIndicators") {
      chart.removeIndicators();
      chart.setNeedsUpdate(true);
    }
  }

  private _handleSaveImageClick() {
    let chart = this.chart;
    if (chart) chart.saveImage();
  }

  private _handleViewModeChange(dataValue: string, isActivated: boolean): void {
    let chart = this.chart;
    if (!chart) return;

    let mode = chart.windowMode;
    switch (dataValue) {
      case DataValue.ToggleFullWindow:
        switch (mode) {
          case WindowMode.NORMAL:
          case WindowMode.FULL_SCREEN:
            chart.setWindowMode(WindowMode.FULL_WINDOW);
            break;
          case WindowMode.FULL_WINDOW:
            chart.setWindowMode(WindowMode.NORMAL);
            break;
          default:
            throw new Error("Unknown window mode.");
        }
        break;
      case DataValue.ToggleFullscreen:
        if (isActivated) {
          switch (mode) {
            case WindowMode.NORMAL:
            case WindowMode.FULL_WINDOW:
              chart.setWindowMode(WindowMode.FULL_SCREEN);
              break;
            case WindowMode.FULL_SCREEN:
              chart.setWindowMode(chart.windowModeHandler.prevMode);
              break;
            default:
              throw new Error("Unknown window mode.");
          }
        }
        break;
      default:
        break;
    }
  }

  // endregion
}
