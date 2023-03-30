/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

var MyIndicator;    // eslint-disable-line no-implicit-globals, init-declarations
var MyCustomMACD;   // eslint-disable-line no-implicit-globals, init-declarations

$(function() {
    "use strict";

    // region Register custom indicators
    // TODO: uncomment the next line if you need to register custom indicators in the Indicators dialog
    // registerCustomIndicators();
    // endregion Register custom indicators

    // region Simple custom indicator sample

    MyIndicator = function(config) {
        config = config || {};  // eslint-disable-line no-param-reassign
        config.isCustomIndicator = true;

        StockChartX.Indicator.call(this, config);

        this.allowSettingsDialog = false;

        this._fieldNames = ["Value 1", "Value 2"];
        this.value1DataSeries = null;
        this.value2DataSeries = null;

        this._options.parameters = {};
        this.setParameterValue(StockChartX.IndicatorParam.LINE_COLOR, "yellow");
        this.setParameterValue(StockChartX.IndicatorParam.LINE_WIDTH, 1);
        this.setParameterValue(StockChartX.IndicatorParam.LINE_STYLE, "solid");
        this.setParameterValue(StockChartX.IndicatorParam.LINE2_COLOR, "green");
        this.setParameterValue(StockChartX.IndicatorParam.LINE2_WIDTH, 1);
        this.setParameterValue(StockChartX.IndicatorParam.LINE2_STYLE, "solid");

        if (config.panelIndex != null)
            this._panel = this._chart.chartPanelsContainer.panels[config.panelIndex];
    };

    MyIndicator.prototype = {
        /**
         * Returns indicator name (e.g. 'Simple Moving Average').
         * @returns {string} The indicator name.
         */
        getName: function() {
            return "My Indicator";
        },

        /**
         * Returns short indicator name (e.g. 'SMA').
         * @returns {string} The indicator short name.
         */
        getShortName: function() {
            return "My Indicator";
        },

        getParametersString: function() {
            return '(params)';
        },

        /**
         * Returns indicator description.
         * @returns {string} HTML
         */
        getInfoAbout: function() {
            return '';
        },

        /**
         * Serializes indicator state.
         * @returns {object} The serialized state.
         */
        serialize: function() {
            var state = StockChartX.Indicator.prototype.serialize.call(this);

            // Serialize your additional properties
            state.isMyIndicator = true;

            return state;
        },

        _initIndicator: function() {

        },

        /**
         * Updates indicator.
         * @returns {void}
         */
        update: function() {
            // Calculate your indicator values
            if (!this.isInitialized)
                this.initialize();

            this._plotItems[0].color = this.getParameterValue(StockChartX.IndicatorParam.LINE_COLOR);
            this._plotItems[1].color = this.getParameterValue(StockChartX.IndicatorParam.LINE2_COLOR);

            this._updatePanelTitle();

            this._plotItems[0].plot.theme = {
                strokeColor: this.getParameterValue(StockChartX.IndicatorParam.LINE_COLOR),
                lineStyle: this.getParameterValue(StockChartX.IndicatorParam.LINE_STYLE),
                width: this.getParameterValue(StockChartX.IndicatorParam.LINE_WIDTH)
            };

            this._plotItems[1].plot.theme = {
                strokeColor: this.getParameterValue(StockChartX.IndicatorParam.LINE2_COLOR),
                lineStyle: this.getParameterValue(StockChartX.IndicatorParam.LINE2_STYLE),
                width: this.getParameterValue(StockChartX.IndicatorParam.LINE2_WIDTH)
            };

            this.value1DataSeries.clear();
            this.value2DataSeries.clear();

            // Calculate indicator values.
            var barSeries = this.chart.primaryBarDataSeries();
            for (var i = 0; i < barSeries.open.length; i++) {
                var value1 = (barSeries.open.valueAtIndex(i) + barSeries.close.valueAtIndex(i)) / 2;
                var value2 = (barSeries.high.valueAtIndex(i) + barSeries.low.valueAtIndex(i)) / 2;

                this.value1DataSeries.add(value1);
                this.value2DataSeries.add(value2);
            }

            this.updateHoverRecord();
        },

        initialize: function() {
            this.value1DataSeries = new StockChartX.DataSeries(this.getName() + " Value 1");
            this.value2DataSeries = new StockChartX.DataSeries(this.getName() + " Value 2");

            if (!this._panel) {
                this._panel = this.chart.addChartPanel();
                this.chart.layout();
                this._panel.setNeedsAutoScale();
            }

            var plot1 = new StockChartX.LinePlot({
                dataSeries: this.value1DataSeries,
                theme: {
                    strokeColor: this.getParameterValue(StockChartX.IndicatorParam.LINE_COLOR),
                    width: this.getParameterValue(StockChartX.IndicatorParam.LINE_WIDTH)
                }
            });

            var plot2 = new StockChartX.LinePlot({
                dataSeries: this.value2DataSeries,
                theme: {
                    strokeColor: this.getParameterValue(StockChartX.IndicatorParam.LINE2_COLOR),
                    width: this.getParameterValue(StockChartX.IndicatorParam.LINE2_WIDTH)
                }
            });

            this._addPlot(plot1, 'yellow');
            this._addPlot(plot2, 'green');
        },

        /**
         * Destroy indicator (remove drawings, html elements, ...)
         * @returns {void}
         */
        destroy: function() {
            // TODO: Add code to destroy indicator and call default implementation.
            StockChartX.Indicator.prototype.destroy.call(this);
        },

        /**
         * Shows indicator properties dialog.
         * @returns {void}
         */
        showPropertiesDialog: function() {
            // TODO: Add code to show your own properties dialog
            StockChartX.Indicator.prototype.showPropertiesDialog.call(this);
        }
    };

    StockChartX.JsUtil.extend(MyIndicator, StockChartX.Indicator);

    var origIndicatorDeserialize1 = StockChartX.Indicator.deserialize;
    StockChartX.Indicator.deserialize = function(state) {
        if (state.isMyIndicator)
            return new MyIndicator(state);

        return origIndicatorDeserialize1(state);
    };

    // endregion Simple custom indicator sample


// region Custom indicator sample with TASdk usage

    MyCustomMACD = function(config) {
        config = config || {};  // eslint-disable-line no-param-reassign
        config.isCustomIndicator = true;

        StockChartX.Indicator.call(this, config);

        this.allowSettingsDialog = true;

        this._fieldNames = ["MACD Histogram", "MACD", "MACD Signal"];

        this.value1DataSeries = null;
        this.value2DataSeries = null;
        this.value3DataSeries = null;

        if (config.parameters) {
            this._options.parameters = config.parameters;
        } else {
            this._options.parameters = {};
            this.setParameterValue(StockChartX.IndicatorParam.SOURCE, ".close");
            this.setParameterValue(StockChartX.IndicatorParam.PERIODS, 9);
            this.setParameterValue(StockChartX.IndicatorParam.SHORT_CYCLE, 12);
            this.setParameterValue(StockChartX.IndicatorParam.LONG_CYCLE, 26);
            this.setParameterValue(StockChartX.IndicatorParam.MA_TYPE, 0);
            this.setParameterValue(StockChartX.IndicatorParam.LINE_COLOR, "#CCCC99");
            this.setParameterValue(StockChartX.IndicatorParam.LINE_WIDTH, 1);
            this.setParameterValue(StockChartX.IndicatorParam.LINE_STYLE, "solid");
            this.setParameterValue(StockChartX.IndicatorParam.LINE2_COLOR, "#FE251D");
            this.setParameterValue(StockChartX.IndicatorParam.LINE2_WIDTH, 1);
            this.setParameterValue(StockChartX.IndicatorParam.LINE2_STYLE, "solid");
            this.setParameterValue(StockChartX.IndicatorParam.LINE3_COLOR, "#E0E0E0");
            this.setParameterValue(StockChartX.IndicatorParam.LINE3_WIDTH, 1);
            this.setParameterValue(StockChartX.IndicatorParam.LINE3_STYLE, "solid");
        }

        if (config.panelIndex != null)
            this._panel = this._chart.chartPanelsContainer.panels[config.panelIndex];
    };

    MyCustomMACD.prototype = {
        /**
         * Returns indicator name (e.g. 'Simple Moving Average').
         * @returns {string} The indicator name.
         */
        getName: function() {
            return "My Custom MACD";
        },

        /**
         * Returns short indicator name (e.g. 'SMA').
         * @returns {string} The indicator short name.
         */
        getShortName: function() {
            return "My MACD";
        },

        getParametersString: function() {
            var periods = this.getParameterValue(StockChartX.IndicatorParam.PERIODS);
            var short = this.getParameterValue(StockChartX.IndicatorParam.SHORT_CYCLE);
            var long = this.getParameterValue(StockChartX.IndicatorParam.LONG_CYCLE);

            return '(' + [periods, short, long].join(', ') + ')';
        },

        /**
         * Returns indicator description.
         * @returns {string} HTML
         */
        getInfoAbout: function() {
            return '<div class="scxIndicatorHelp">Overview</div>' +
                '<p>' +
                'The MACD is a moving average oscillator that shows potential overbought/oversold phases ' +
                'of market fluctuation. ' +
                'The calculation is based on two different moving averages of the price data.' +
                '</p>' +
                '<div class="scxIndicatorHelp">Interpretation</div>' +
                '<p>Buy and sell signals are generated whenever MACD crosses a signal line, ' +
                'the zero mark line or when the MACD line diverges from price.</p>' +
                '<div class="scxIndicatorHelp">Parameters</div>' +
                '<p>Signal Periods<br>' +
                'Short Cycle<br>' +
                'Long Cycle<br>' +
                'Moving Average Type</p>' +
                '<center>' +
                'Also see <a href="http://en.wikipedia.org/wiki/MACD" target="_blank">Wikipedia - MACD</a>' +
                '</center>';
        },

        /**
         * Serializes indicator state.
         * @returns {object} The serialized state.
         */
        serialize: function() {
            var state = StockChartX.Indicator.prototype.serialize.call(this);

            // Serialize your additional properties
            state.isMyCustomMACD = true;

            return state;
        },

        /**
         * Show plot item
         * @param {Plot} plotItem PlotItem to show
         * @returns {void}
         */
        showPlotItem: function(plotItem) {
            plotItem.plot.visible = true;

            if (this.showValuesInTitle) {
                plotItem.titlePlotSpan.show();
                plotItem.titleValueSpan.show();
            }
        },

        /**
         * Hide plot item
         * @param {Plot} plotItem PlotItem to hide
         * @returns {void}
         */
        hidePlotItem: function(plotItem) {
            plotItem.plot.visible = false;

            if (!this.showValuesInTitle) {
                plotItem.titlePlotSpan.hide();
                plotItem.titleValueSpan.hide();
            }
        },

        _initPanel: function() {
            var formatter = this._panel.valueScale.formatter;
            if (formatter)
                formatter.setDecimalDigits(3);

            this._panel.valueScale.calibrator.divider = null;
            this._panel.valueScale.calibrator.suffix = null;
        },

        /**
         * Updates indicator.
         * @returns {void}
         */
        update: function() {
            // Calculate your indicator values
            if (!this.isInitialized) {
                this.value1DataSeries = new StockChartX.DataSeries(this.getName() + " Value 1");
                this.value2DataSeries = new StockChartX.DataSeries(this.getName() + " Value 2");
                this.value3DataSeries = new StockChartX.DataSeries(this.getName() + " Value 3");

                if (!this._panel) {
                    this._panel = this.chart.addChartPanel();
                    this.chart.layout();
                    this._panel.setNeedsAutoScale();

                    if (this.isInitialized)
                        return;
                }

                if (!this._panel.visible)
                    return;

                var plot1 = new StockChartX.HistogramPlot({
                    dataSeries: this.value1DataSeries,
                    theme: {
                        strokeColor: this.getParameterValue(StockChartX.IndicatorParam.LINE_COLOR),
                        width: this.getParameterValue(StockChartX.IndicatorParam.LINE_WIDTH)
                    }
                });

                var plot2 = new StockChartX.LinePlot({
                    dataSeries: this.value2DataSeries,
                    theme: {
                        strokeColor: this.getParameterValue(StockChartX.IndicatorParam.LINE2_COLOR),
                        width: this.getParameterValue(StockChartX.IndicatorParam.LINE2_WIDTH)
                    }
                });

                var plot3 = new StockChartX.LinePlot({
                    dataSeries: this.value3DataSeries,
                    theme: {
                        strokeColor: this.getParameterValue(StockChartX.IndicatorParam.LINE3_COLOR),
                        width: this.getParameterValue(StockChartX.IndicatorParam.LINE3_WIDTH)
                    }
                });

                this._addPlot(plot1, '#CCCC99');
                this._addPlot(plot2, '#FE251D');
                this._addPlot(plot3, '#E0E0E0');
            }

            this._plotItems[0].plot.theme = {
                strokeColor: this.getParameterValue(StockChartX.IndicatorParam.LINE_COLOR),
                lineStyle: this.getParameterValue(StockChartX.IndicatorParam.LINE_STYLE),
                width: this.getParameterValue(StockChartX.IndicatorParam.LINE_WIDTH)
            };

            this._plotItems[1].plot.theme = {
                strokeColor: this.getParameterValue(StockChartX.IndicatorParam.LINE2_COLOR),
                lineStyle: this.getParameterValue(StockChartX.IndicatorParam.LINE2_STYLE),
                width: this.getParameterValue(StockChartX.IndicatorParam.LINE2_WIDTH)
            };

            this._plotItems[2].plot.theme = {
                strokeColor: this.getParameterValue(StockChartX.IndicatorParam.LINE3_COLOR),
                lineStyle: this.getParameterValue(StockChartX.IndicatorParam.LINE3_STYLE),
                width: this.getParameterValue(StockChartX.IndicatorParam.LINE3_WIDTH)
            };

            this._plotItems[0].color = this.getParameterValue(StockChartX.IndicatorParam.LINE_COLOR);
            this._plotItems[1].color = this.getParameterValue(StockChartX.IndicatorParam.LINE2_COLOR);
            this._plotItems[2].color = this.getParameterValue(StockChartX.IndicatorParam.LINE3_COLOR);

            this._plotItems.forEach(function(plotItem) {
                if (this.visible)
                    this.showPlotItem(plotItem);
                else
                    this.hidePlotItem(plotItem);

                plotItem.plot.showValueMarkers = this.showValueMarkers;
            }.bind(this));

            this._updatePanelTitle();

            this.value1DataSeries.clear();
            this.value2DataSeries.clear();
            this.value3DataSeries.clear();

            // Calculate indicator values.
            var barSeries = this.chart.primaryBarDataSeries();

            if (barSeries.close.length > 0) {
                var setBarSeriesSource = function(source) {
                    switch (source) {
                        case '.open':
                            return barSeries.open.toField(source);
                        case '.low':
                            return barSeries.low.toField(source);
                        case '.close':
                            return barSeries.close.toField(source);
                        case '.high':
                            return barSeries.high.toField(source);
                        case '.volume':
                            return barSeries.volume.toField(source);
                        default:
                            return barSeries.close.toField('close');

                    }
                };
                var field = setBarSeriesSource(this.getParameterValue(StockChartX.IndicatorParam.SOURCE));
                var oscillator = new TASdk.Oscillator();
                var dataSource = oscillator.MACD(   // eslint-disable-line new-cap
                    field,
                    this.getParameterValue(StockChartX.IndicatorParam.SHORT_CYCLE),
                    this.getParameterValue(StockChartX.IndicatorParam.LONG_CYCLE),
                    this.getParameterValue(StockChartX.IndicatorParam.PERIODS),
                    this.getParameterValue(StockChartX.IndicatorParam.MA_TYPE),
                    'MyCustomMACD');
                var recordSet2 = oscillator.macdHistogram(
                    field,
                    this.getParameterValue(StockChartX.IndicatorParam.SHORT_CYCLE),
                    this.getParameterValue(StockChartX.IndicatorParam.LONG_CYCLE),
                    this.getParameterValue(StockChartX.IndicatorParam.PERIODS),
                    this.getParameterValue(StockChartX.IndicatorParam.MA_TYPE),
                    "MyCustomMACD Histogram");

                if (dataSource != null) {
                    this.value1DataSeries.fromField(recordSet2.getField("MyCustomMACD Histogram"), 13 * 3);
                    this.value2DataSeries.fromField(dataSource.getField("MyCustomMACD"), 13 * 3);
                    this.value3DataSeries.fromField(dataSource.getField("MyCustomMACDSignal"), 13 * 3);
                }
            }

            this.updateHoverRecord();
        },

        /**
         * Destroy indicator (remove drawings, html elements, ...)
         * @returns {void}
         */
        destroy: function() {
            // TODO: Add code to destroy indicator and call default implementation.
            StockChartX.Indicator.prototype.destroy.call(this);
        },

        /**
         * Shows indicator properties dialog.
         * @returns {void}
         */
        showPropertiesDialog: function() {
            // TODO: Add code to show your own properties dialog
            StockChartX.Indicator.prototype.showPropertiesDialog.call(this);
        }
    };

    StockChartX.JsUtil.extend(MyCustomMACD, StockChartX.Indicator);

    var origIndicatorDeserialize2 = StockChartX.Indicator.deserialize;
    StockChartX.Indicator.deserialize = function(state) {
        if (state.isMyCustomMACD)
            return new MyCustomMACD(state);

        return origIndicatorDeserialize2(state);
    };

    // endregion Custom indicator sample with TASdk usage

    /**
     * Registers custom indicator.
     * @returns {void}
     */
    function registerCustomIndicators() {   // eslint-disable-line no-unused-vars
        TASdk.MyIndicator = 10000;
        TASdk.MyCustomMACD = 10001;

        var indicatorIDs = StockChartX.Indicator.general();
        StockChartX.Indicator.general = function() {
            return indicatorIDs.concat([
                TASdk.MyIndicator,
                TASdk.MyCustomMACD
            ]);
        };

        var indToStrFn = TASdk.indicatorToString;
        TASdk.indicatorToString = function(indicator) {
            switch (indicator) {
                case TASdk.MyIndicator:
                    return "My Indicator";
                case TASdk.MyCustomMACD:
                    return "My Custom MACD";
                default:
                    return indToStrFn(indicator);
            }
        };

        var addIndicatorsFn = StockChartX.Chart.prototype.addIndicators;
        StockChartX.Chart.prototype.addIndicators = function(indicators) {
            if (Array.isArray(indicators)) {
                // An array of indicators passed. Add indicators one by one.
                var addedIndicators = [];
                for (var i = 0; i < indicators.length; i++)
                    addedIndicators.push(StockChartX.Chart.prototype.addIndicators.call(this, indicators[i]));

                return addedIndicators;
            }

            var newIndicator = indicators;

            if (StockChartX.JsUtil.isNumber(newIndicator)) {
                switch (newIndicator) {
                    case TASdk.MyIndicator:
                        return addIndicatorsFn.call(this, new MyIndicator());
                    case TASdk.MyCustomMACD:
                        return addIndicatorsFn.call(this, new MyCustomMACD());
                    default:
                        break;
                }
            }

            return addIndicatorsFn.call(this, newIndicator);
        };
    }
});
