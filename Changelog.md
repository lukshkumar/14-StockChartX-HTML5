##v2.25.5
- Bug fix - Pivot Points, Supertrend formula correction
- Prepend Licence information on generated build.

##v2.25.4
-  Bug fix - Instrument Search not working.

##v2.25.3
- Bug fix - PointAndFigure Reversal issue fixed.
- Test cases Migration.

##v2.25.2

- Bug fix - PointAndFigure Price style Format dialog not opening.
- IntervalValueScaleCalibrator changed to default 0.005 interval.
- Update Chart.timeInterval value when time frame is changed from the toolbar.
- Chart's WaitingBar z-index increased to 10.

##v2.25.1

- Chrome 71+ issue due to document.fullScreen fixed.
- Compare symbol production example drawing disappearing on live data fix.
- Log scale font invisible issue fixed.
- Production assets public path changed to relative.

##v2.25

- Added a new feature of compare symbols in separate chart panels.
- New `symbol` property in ChartPanel.ts.
- Add indicators functionality to newly added symbols.
- Change pricestyle functionality of newly added symbols.
- Added New example showing multiple symbol functionality.

##v2.24.2

- Bug fix - Removed deprecated syntax from HighlightedColumnHandler.ts leading to unexpected token after parsing.

##v2.24.1

- Removed License validation.
- Webpack dev server optimizations.
- Single bundle file for JS and CSS.
- CSS duplication removal and minification.

##v2.24

- Migrated namespaces to ES6 module system.
- Migrated build process from gulp to Webpack.
- Updated TypeScript to v3.2.1.
- Added Pivot Points indicator.

##v2.23.1

- Fixed MACD Indicator to show histogram.

##v2.23

- Merged 2.22 while still keeping the changes of StockChartX 2.19
- Added Volume Weighted Average Price Indicator.
- Jquery(2.x => 3.x) and Bootstrap(2.x => 3.x) were further updated.

## 2.22.2

- Removed fullscreen mode button on mobile devices.
- Draw candles improvements
- Fixed text rendering on fibonacci drawings.
- Added tooltip to the fibonacci drawings.
- Fixed blured border on candles.
- Added ability to show/hide indicator titles.
- Added ability to set rightAdditionalSpaceRatio property to 0.
- Added ability to save themes into the local storage.
- Added abilty to set indicator parameters on adding indicator from indicator list dialog.
- Fixed license checking in Cordova applications.

## 2.22.1

- Gradient fill support in mountain plot.
- Ability to control session break dates.
- Typescript updated to 2.3.2.
- Added new events: HIGHLIGHTED_COLUMN_ADDED, HIGHLIGHTED_COLUMN_REMOVED.
- Minor GUI fixes.

## 2.22

- Isolate i18next library to prevent conflicts with the site.
- Fixed an exception in text and balloon drawing object.
- Added ability to configure price line in price styles.
- Added ability to show volume indicator on the main panel.
- Added typescript definitions of external libraries.
- Added ability to enter drawing coordinates in drawing settings dialog.
- Use datafeeds in demos.
- Added ability to autoscroll chart on new bar/tick.
- Fixed issue with localization when it sends too many requests to the server.
- Added order and position trading tools.
- Other minor bug fixes and improvements.

## 2.21.1

- Use typescript 2.2.2 due to compilation issues with typescript 2.3.
- Fixed autoscaling issue if plot uses custom date data series.
- Added localization for OHLC labels on main panel.

## 2.21

- Added datafeed abstraction layer.
- Added ability to merge indicator into upper/lower panel.
- Added PIN_MOUSE zoom option.
- Added simple chart example.
- Select all text in instrument search control on focus.
- Added ability to specify NTB price style parameters in points (e.g. renko with 5 points box size).
- Added ability to maximize chart panel.
- Fixed bug when save as image throws exception on iOS devices.
- Added ability to hide text for virtual dates on date scale.
- Fixed autoscaling bug with plots which use custom date data series.
- Added smart price style switching according to the current zoom factor (candles -> bars -> line).
- Added button that shows whether hidden bars are available with ability to scroll to the latest bars.
- Added ability to show/hide bars in FixedDateScaleCalibrator.
- Added ability to set custom date format/formatter for the date scale calibrator.
- Move chart's border theme into the css.
- Fixed bug with changing background color. It was not possible to switch from solid color to the gradient and vise versa on the fly.
- Added ability to setup custom path to the views and locales.
- Fixed indicator title color.
- Other minor bug fixes and improvements.

## 2.20

- Fixed toolbar icon inconsistencies.
- Fixed fibonacci fan text displaying issue (text is not visible if drawing crosses top border).
- Fixed issue when cloned drawing appears outside of visible view.
- Added ability to hide indicator title programmatically.
- Fixed autocomplete issue with instrument search control (regression since 2.19).
- Upgraded to the latest jquery and bootstrap libraries.
- Source code package is generated as git repository now.
- Added ability to set padding to the panel.
- Prevent user from creating very small drawings by accidence.
- Added ability to specify value divider for the scale (it is usefull for volume panel to show e.g. 1M instead of 1 000 000).
- Fixed darvas boxes indicator.
- Reorganized demo pages (e.g. data server sample moved to index.html).
- Fixed guru meditation when you delete drawing immediately after creation.
- Localization improvements (some parts of dialogs were not localized).
- Updated gulp task to generate source maps in proper way.
- Other minor bug fixes.

##2.19.2

- Added ability to change colors of both Up and Down Wick in a candlestick individulally
- Added Supertrend Indicator
- Added Rainbow Oscillator
- Added the ability for developers to toggle visibility of an indicator with a property.
- Added retina support for big devices.
- Added support to include realtime data from a finance API to integrate accurate data.
- Added the ability for user to toggle between logarithmic and arithmetic scale.

## 2.19.1

- Fixed issue in InstrumentSearch : Input text getting replaced while typing.
- Dev: Added nvmrc for node version management.

## 2.19

- Added ability to show/hide navigation bar.
- Added cyclic lines drawing.
- Added chart scrollbar.
- Added McGinleys dynamic indicator.
- Added demo with 2 charts.
- Added ask/bid lines.
- Use icon fonts instead of images.
- Added DataServer integration sample.
- Added trading day breaks.
- Added trend angle drawing.
- Added ability to resize image drawing proptionally.
- Reorganized gulp tasks.
- Minor bug fixes and stability improvements.

## 2.18.1

- Fixed issue with switching chart background from gradient to solid color.
- Fixed issue with multiple charts on the same page (some toolbar buttons affect other charts).
- Toolbar buttons layout fixes.
- Updated 'compile:typescript' gulp task. Added functionality to generate source map files.
- Fixed tooltips with large images.
- Added DRAWING_ADDED and DRAWING_REMOVED events to the chart panel.
- Adde ability to change price style label theme for up and down candles.

## v 2.18

- Ability to handle context menu event on chart panel.
- Stay in drawing mode fixed on Safari (iOS).
- Added ability to remove chart state from the local storage.
- Date formatter changes (use moment library instead of Intl).
- Added ability to omit unnecessary point coordinates. E.g. x coordinate is not required for horizontal line drawing.
- Ability to change price style label theme.
- Added compilation guide.
- Fixed issue with saving/restoring ichimoku cloud indicator properties.

## v 2.17.3

- Added favicon.
- Improved toolbar icons.
- Fix: tooltip does not change colors.
- Fix: instruments data is not parsed if server returns data as 'text/plain' MIME type.
- Fix: 'Clone' drawing menu item does not work if drawing is not selected.
- Fix: Demo crashes in Android application.

## v 2.17.2

- Fixed z-index issue with drawings.

## v 2.17.1

- Fixed themes in full-screen mode.
- Added ability to change price line theme.
- Ability to save chart state in the local storage.
- Fixed issue with drawing tooltips (tooltips should not be shown if drawing is not visible).

## v 2.17

- Added z-index to chart panel objects.
- Added ability to show/hide grid lines (on chart level).
- Added vagrant support.
- Added ability to show/hide instrument watermark.
- Added ability to enable/disable scrolling/zooming.
- Added ability to set indicator colors in theme.

## v 2.16

- Added new themes.
- Improved validation of indicator parameters.
- Added magnet mode for drawings.
- Different UI improvement.
- Fixed issue with variable moving average in indicators.
- Fixed issue with drop downs in dialogs (hide drop download on dialog move).
- Fixed issue when tooltips are not shown in full-screen mode.
- Minor bug fixes.

## v 2.15.5

- Added new themes.
- Localization improvements.
- Recreate chart demo.

## v 2.15.4

- Added localization support.
- Added ability to generate multi-domain package.
- Minor bug fixing

## v 2.15.3

- Added arrow drawing.
- Added ability to select source data to calculate Point & Figure: Close or High/Low prices.

## v 2.15.2

- Fixed guru meditation in interval value scale calibrator.

## v 2.15

- Added ability to clone drawings.
- Added polygon, polyline, balloon, measure, note drawings.
- Added marker on the date scale for vertical line drawing.
- Added 'zoom in' button onto the toolbar. Zoom in supports 2 modes: date range and rectangle.
- Added tooltips for drawings.
- Added ability to use 3 kinds of tooltips: text, image and html.
- Added ability to disable settings dialog for custom indicators.
- Added ability to use settings dialog properly in custom indicators.
- Added 'collapse indicator title' button
- Added stay in drawing mode option.
- Added multi-charts demo.
- Added ability to disable mouse events.
- Waiting bar improvement. Now you are supposed to call "hide" as many times as "show" before previous "hide" call. It allows you to use Waiting bar more effectively. Pass "true" as parameter when calling "hide" if you want to hide Waiting bar anyway.
- Great improvements of displaying on mobile devices.
- Bug fixes and stability improvements.

## v 2.14.18

- Added error channel, raff regression, quadrant lines, tirone levels, speed lines drawings.
- Added missing indicator help.
- Updated OHLC values in the panel title to use different color for up/down bars.
- Added "Apply" button into the fibonacci setting dialog.
- Added "About" menu item into the indicator context menu.
- Changed manual drawing creation behavior. Draw partially created drawing on mouse move.
- Added drawing context menu.
- Added full screen mode.
- Bug fixing.
