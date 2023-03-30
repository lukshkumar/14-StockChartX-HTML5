/**
 * Copyright Modulus Financial Engineering, Inc. Scottsdale, AZ http://www.modulusfe.com
 */

/* global StockChartX, assertEquals, assertTrue, assertException, assertNull, assertSame */

//noinspection JSUnusedGlobalSymbols,JSHint
PlotTestCase = TestCase('PlotTestCase', {
    setUp: function() {
        "use strict";

        this.chart = new StockChartX.Chart({container: 'body', showToolbar: false});
        this.panel = new StockChartX.ChartPanel({
            chartPanelsContainer: this.chart.chartPanelsContainer
        });
        this.target = new StockChartX.Plot({
            chartPanel: this.panel
        });
    },

    testConstructor: function() {
        "use strict";

        var target = new StockChartX.Plot();

        assertEquals("Data series are not initialized properly.", [], target.dataSeries);
        assertNull("Chart panel is not initialized properly.", target.chartPanel);
        assertNull("Theme is not initialized properly.", target.theme);
        assertEquals("Options are not initialized properly.", {}, target.options);
    },

    testConfig: function() {
        "use strict";

        var config = {
            dataSeries: new StockChartX.DataSeries(),
            theme: {border: 1},
            options: {style: 'none'}
        };
        //noinspection JSCheckFunctionSignatures
        var target = new StockChartX.Plot(config);

        assertEquals("Data series are not initialized properly.", [config.dataSeries], target.dataSeries);
        assertSame("Theme is not initialized properly.", config.theme, target.theme);
        assertSame("Options are not initialized properly.", config.options, target.options);
    },

    testInvalidConfig: function() {
        "use strict";

        assertException("An exception should be thrown if data series is incorrect.", function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.Plot({dataSeries: 1});
        });
        assertException("An exception should be thrown if parent panel is incorrect.", function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.Plot({chartPanel: 1});
        });
    },

    testDataSeries: function() {
        "use strict";

        var expected = new StockChartX.DataSeries(),
            isEventRaised = false;

        this.chart.on(StockChartX.PlotEvent.DATA_SERIES_CHANGED, function() {
            isEventRaised = true;
        });

        this.target.dataSeries = expected;
        assertEquals("Data series is not set properly.", [expected], this.target.dataSeries);
        assertTrue("DataSeriesChanged event is not fired.", isEventRaised);

        expected = [new StockChartX.DataSeries(), new StockChartX.DataSeries()];
        this.target.dataSeries = expected;
        assertEquals("Data series is not set properly.", expected, this.target.dataSeries);

        var target = this.target;
        assertException("An exception should be thrown if data series is not valid.", function() {
            //noinspection JSCheckFunctionSignatures
            target.dataSeries = 1;
        });
    },

    testPanel: function() {
        "use strict";

        var isEventRaised = false;

        this.chart.on(StockChartX.PlotEvent.PANEL_CHANGED, function() {
            isEventRaised = true;
        });

        this.target._chartPanel = null;
        this.target.chartPanel = this.panel;
        assertSame("Panel is not set properly.", this.panel, this.target.chartPanel);
        assertTrue("PanelChanged event is not fired.", isEventRaised);

        var target = this.target;
        assertException("An exception should be thrown if panel is not valid.", function() {
            target.chartPanel = 1;
        });
    },

    testGetChart: function() {
        "use strict";

        assertSame("Chart is not returned properly.", this.chart, this.target.chart);
    },

    testTheme: function() {
        "use strict";

        var expected = {width: 1},
            isEventRaised = false;

        this.chart.on(StockChartX.PlotEvent.THEME_CHANGED, function() {
            isEventRaised = true;
        });
        this.target.theme = expected;

        assertSame("Theme is not set properly.", expected, this.target.theme);
        assertTrue("ThemeChanged event is not fired.", isEventRaised);
    },

    testOptions: function() {
        "use strict";

        var expected = {width: 1},
            isEventRaised = false;

        this.chart.on(StockChartX.PlotEvent.OPTIONS_CHANGED, function() {
            isEventRaised = true;
        });
        this.target.options = expected;

        assertSame("Options are not set properly.", expected, this.target.options);
        assertTrue("OptionsChanged event is not fired.", isEventRaised);
    },

    testGetDateDataSeries: function() {
        "use strict";

        var expected = new StockChartX.DataSeries(StockChartX.DataSeriesSuffix.DATE);
        this.target.dataSeries = [new StockChartX.DataSeries(), expected];
        assertSame("Date data series is not returned properly.", expected, this.target.getDateDataSeries());
    }
});


//noinspection JSUnusedGlobalSymbols,JSHint
LinePlotTestCase = TestCase('LinePlotTestCase', {
    setUp: function() {
        "use strict";

        this.chart = new StockChartX.Chart({container: 'body'});
        this.panel = new StockChartX.ChartPanel({
            chartPanelsContainer: this.chart.chartPanelsContainer
        });
        this.target = new StockChartX.LinePlot({
            chartPanel: this.panel
        });
    },

    testConstructor: function() {
        "use strict";

        assertEquals("Plot style is not initialized properly.", StockChartX.Plot.Style.LINE, this.target.plotStyle);
    },

    testPlotStyle: function() {
        "use strict";

        var expected = StockChartX.LinePlot.Style.MOUNTAIN,
            isEventRaised = false;

        this.chart.on(StockChartX.PlotEvent.STYLE_CHANGED, function() {
            isEventRaised = true;
        });
        this.target.plotStyle = expected;

        assertEquals("Plot style is not set properly.", expected, this.target.plotStyle);
        assertTrue("StyleChanged event is not fired.", isEventRaised);
    }
});


//noinspection JSUnusedGlobalSymbols,JSHint
HistogramPlotTestCase = TestCase('HistogramPlotTestCase', {
    setUp: function() {
        "use strict";

        this.chart = new StockChartX.Chart({container: 'body'});
        this.panel = new StockChartX.ChartPanel({
            chartPanelsContainer: this.chart.chartPanelsContainer
        });
        this.target = new StockChartX.HistogramPlot({
            chartPanel: this.panel
        });
    },

    testConstructor: function() {
        "use strict";

        assertEquals("Plot style is not initialized properly.", StockChartX.HistogramPlot.Style.LINE, this.target.plotStyle);
        assertEquals("Base value is not initialized properly.", 0, this.target.baseValue);
        assertEquals("Width ratio is not initialized properly.", 0.5, this.target.columnWidthRatio);
    },

    testPlotStyle: function() {
        "use strict";

        var expected = StockChartX.HistogramPlot.Style.COLUMN,
            isEventRaised = false;
        this.chart.on(StockChartX.PlotEvent.STYLE_CHANGED, function() {
            isEventRaised = true;
        });
        this.target.plotStyle = expected;
        assertTrue("StyleChanged event is not fired.", isEventRaised);

        assertEquals("Plot style is not set properly.", expected, this.target.plotStyle);

    },

    testBaseValue: function() {
        "use strict";

        var expected = 5,
            isEventRaised = false;
        this.chart.on(StockChartX.PlotEvent.BASE_VALUE_CHANGED, function() {
            isEventRaised = true;
        });
        this.target.baseValue = expected;
        assertTrue("BaseValueChanged event is not fired.", isEventRaised);
        assertEquals("Base value is not set properly.", expected, this.target.baseValue);

        var target = this.target;
        assertException("An exception should be thrown if base value is not a number.", function() {
            target.baseValue = null;
        });
        assertException("An exception should be thrown if base value is not a number.", function() {
            target.baseValue = '1';
        });
        assertException("An exception should be thrown if base value is not finite.", function() {
            target.baseValue = NaN;
        });
        assertException("An exception should be thrown if base value is not finite.", function() {
            target.baseValue = Infinity;
        });
        assertException("An exception should be thrown if base value is not finite.", function() {
            target.baseValue = -Infinity;
        });
    },

    testWidthRatio: function() {
        "use strict";

        var expected = 0.75,
            isEventRaised = false;
        this.chart.on(StockChartX.PlotEvent.COLUMN_WIDTH_RATIO_CHANGED, function() {
            isEventRaised = true;
        });
        this.target.columnWidthRatio = expected;
        assertTrue("ColumnWidthRatioChanged event is not fired.", isEventRaised);
        assertEquals("Width ratio is not set properly.", expected, this.target.columnWidthRatio);

        var target = this.target;
        assertException("An exception should be thrown if ratio is not a number.", function() {
            target.columnWidthRatio = null;
        });
        assertException("An exception should be thrown if ratio is not a number.", function() {
            target.columnWidthRatio = '1';
        });
        assertException("An exception should be thrown if ratio is out of range.", function() {
            target.columnWidthRatio = -1;
        });
        assertException("An exception should be thrown if ratio is out of range.", function() {
            target.columnWidthRatio = 0;
        });
        assertException("An exception should be thrown if ratio is out of range.", function() {
            target.columnWidthRatio = 1.2;
        });
    }
});


//noinspection JSUnusedGlobalSymbols,JSHint
BarPlotTestCase = TestCase('BarPlotTestCase', {
    setUp: function() {
        "use strict";

        this.chart = new StockChartX.Chart({container: 'body'});
        this.panel = new StockChartX.ChartPanel({
            chartPanelsContainer: this.chart.chartPanelsContainer
        });
        this.target = new StockChartX.BarPlot({
            chartPanel: this.panel
        });
    },

    testConstructor: function() {
        "use strict";

        assertEquals("Width ratio is not initialized properly.", 0.8, this.target.columnWidthRatio());
        assertEquals("Min width is not initialized properly.", 3, this.target.minWidth);
        assertEquals("Plot style is not initialized properly.", StockChartX.BarPlot.Style.CANDLE, this.target.plotStyle);
    },

    testWidthRatio: function() {
        "use strict";

        var expected = 0.75,
            isEventRaised = false;
        this.chart.on(StockChartX.PlotEvent.COLUMN_WIDTH_RATIO_CHANGED, function() {
            isEventRaised = true;
        });
        this.target.columnWidthRatio = expected;
        assertTrue("ColumnWidthRatioChanged event is not fired.", isEventRaised);
        assertEquals("Width ratio is not set properly.", expected, this.target.columnWidthRatio);

        var target = this.target;
        assertException("An exception should be thrown if ratio is not a number.", function() {
            target.columnWidthRatio = null;
        });
        assertException("An exception should be thrown if ratio is not a number.", function() {
            target.columnWidthRatio = '1';
        });
        assertException("An exception should be thrown if ratio is out of range.", function() {
            target.columnWidthRatio = -1;
        });
        assertException("An exception should be thrown if ratio is out of range.", function() {
            target.columnWidthRatio = 0;
        });
        assertException("An exception should be thrown if ratio is out of range.", function() {
            target.columnWidthRatio = 1.2;
        });
    },

    testMinWidth: function() {
        "use strict";

        var expected = 5,
            isEventRaised = false;

        this.chart.on(StockChartX.PlotEvent.MIN_WIDTH_CHANGED, function() {
            isEventRaised = true;
        });
        this.target.minWidth = expected;
        assertEquals("Min width is not set properly.", expected, this.target.minWidth);
        assertTrue("MinWidthChanged event is not fired.", isEventRaised);

        var target = this.target;
        assertException("An exception should be thrown if width is not a number.", function() {
            target.minWidth = null;
        });
        assertException("An exception should be thrown if width is not a number.", function() {
            target.minWidth = '1';
        });
        assertException("An exception should be thrown if width is negative number.", function() {
            target.minWidth = -1;
        });
        assertException("An exception should be thrown if width is 0.", function() {
            target.minWidth = 0;
        });
        assertException("An exception should be thrown if min width is not a finite number.", function() {
            target.minWidth = -Infinity;
        });
        assertException("An exception should be thrown if min width is not a finite number.", function() {
            target.minWidth = Infinity;
        });
        assertException("An exception should be thrown if min width is not a finite number.", function() {
            target.minWidth = NaN;
        });
    },

    testPlotStyle: function() {
        "use strict";

        var expected = StockChartX.BarPlot.Style.HOLLOW_CANDLE,
            isEventRaised = false;
        this.chart.on(StockChartX.PlotEvent.STYLE_CHANGED, function() {
            isEventRaised = true;
        });
        this.target.plotStyle = expected;

        assertTrue("StyleChanged event is not fired.", isEventRaised);
        assertEquals("Plot style is not set properly.", expected, this.target.plotStyle);
    }
});