const ChartEvent = {
  /** Window mode changed (default | fullscreen). */
  WINDOW_MODE_CHANGED: "chartWindowModeChanged",

  /** Chart toolbar loaded. */
  TOOLBAR_LOADED: "chartToolbarLoaded",

  /** Chart scrollbar loaded. */
  SCROLLBAR_LOADED: "chartScrollbarLoaded",

  /** Chart state changed. */
  STATE_CHANGED: "chartStateChanged",

  /** Chart time interval changed (gChart.timeInterval). */
  TIME_INTERVAL_CHANGED: "chartTimeIntervalChanged",

  /** New indicator added. */
  INDICATOR_ADDED: "chartIndicatorAdded",

  /** Indicator removed. */
  INDICATOR_REMOVED: "chartIndicatorRemoved",

  /** Chart theme changed. */
  THEME_CHANGED: "chartThemeChanged",

  /** Chart global theme changed. */
  GLOBAL_THEME_CHANGED: "chartGlobalThemeChanged",

  /** Chart price style changed. */
  PRICE_STYLE_CHANGED: "chartPriceStyleChanged",

  /** Chart hover record changed. */
  HOVER_RECORD_CHANGED: "chartHoverRecordChanged",

  /** Chart instrument changed (object gChart.instrument). */
  INSTRUMENT_CHANGED: "chartInstrumentChanged",

  /** Symbol changed in the toolbar's Instrument selector. */
  SYMBOL_ENTERED: "chartSymbolEntered",

  /** Time frame changed in the toolbar. */
  TIME_FRAME_CHANGED: "chartTimeFrameChanged",

  /** Crosshair type changed. */
  CROSS_HAIR_CHANGED: "chartCrossHairChanged",

  /** Chart state loaded (after gChart.loadState). */
  STATE_LOADED: "chartStateLoaded",

  /** Chart locale changed. */
  LOCALE_CHANGED: "chartLocaleChanged",

  /** Chart keyboard events availability changed. */
  ENABLE_KEYBOARD_EVENTS_CHANGED: "chartEnableKeyboardEventsChanged",

  /** Chart keyboard events availability changed. */
  ENABLE_MOUSE_EVENTS_CHANGED: "chartEnableMouseEventsChanged",

  /** Chart value scale added. */
  VALUE_SCALE_ADDED: "chartValueScaleAdded",

  /** Chart value scale removed. */
  VALUE_SCALE_REMOVED: "chartValueScaleRemoved",

  /** Drawing started (by user). */
  USER_DRAWING_STARTED: "chartUserDrawingStarted",

  /** Drawing finished (by user). */
  USER_DRAWING_FINISHED: "chartUserDrawingFinished",

  /** Drawing cancelled (by user). */
  USER_DRAWING_CANCELLED: "chartUserDrawingCancelled",

  /** New chart panel added. */
  PANEL_ADDED: "chartPanelAdded",

  /** Chart panel removed. */
  PANEL_REMOVED: "chartPanelRemoved",

  /** Date scale theme changed. */
  DATE_SCALE_THEME_CHANGED: "dateScaleThemeChanged",

  /** First visible record changed. */
  FIRST_VISIBLE_RECORD_CHANGED: "firstVisibleRecordChanged",

  /** Last visible record changed. */
  LAST_VISIBLE_RECORD_CHANGED: "lastVisibleRecordChanged",

  /**
   * More historical data requested. Can be used to dynamically load historical data gradually.
   * Fired when user scrolls chart to the beginning.
   */
  MORE_HISTORY_REQUESTED: "chartMoreHistoryRequested",

  /** Zoom In started */
  ZOOM_IN_STARTED: "chartZoomInStarted",

  /** Zoom In finished */
  ZOOM_IN_FINISHED: "chartZoomInFinished",

  /** Zoom In cancelled */
  ZOOM_IN_CANCELLED: "chartZoomInCancelled",

  /** 'showInstrumentWatermark' property changed. */
  SHOW_INSTRUMENT_WATERMARK_CHANGED: "chartShowInstrumentWatermarkChanged",

  /** Highlighted column added */
  HIGHLIGHTED_COLUMN_ADDED: "highlightedColumnAdded",

  /** Highlighted column removed */
  HIGHLIGHTED_COLUMN_REMOVED: "highlightedColumnRemoved"
};
Object.freeze(ChartEvent);
export { ChartEvent };
