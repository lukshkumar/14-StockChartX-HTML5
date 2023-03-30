/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

/* global StockChartX, assertEquals, assertSame, assertNotNull, assertNull, assertUndefined, assertInstanceOf, assertException */

//noinspection JSUnusedGlobalSymbols,JSHint,JSUnresolvedFunction
PriceStyleTestCase = TestCase('PriceStyleTestCase', {
    setUp: function() {
        "use strict";
        /*:DOC += <div id="chart"></div> */

        this.chart = new StockChartX.Chart({
            container: '#chart',
            width: 100,
            height: 100,
            timeInterval: StockChartX.TimeSpan.MILLISECONDS_IN_DAY,
            showToolbar: false
        });
        this.target = new StockChartX.PriceStyle({
            chart: this.chart
        });
    },

    tearDown: function() {
        "use strict";

        this.chart.destroy();
    },

    testClassName: function() {
        "use strict";

        assertEquals("Class name is not initialized properly.", "", StockChartX.PriceStyle.className);
    },

    testRegisteredPriceStyles: function() {
        "use strict";

        var actual = StockChartX.PriceStyle.registeredPriceStyles;

        assertInstanceOf("Bar price style is not registered", StockChartX.BarPriceStyle.constructor, actual.bar);
        assertInstanceOf("Candle price style is not registered", StockChartX.CandlePriceStyle.constructor, actual.candle);
        //noinspection JSUnresolvedVariable
        assertInstanceOf("Colored bar price style is not registered", StockChartX.ColoredBarPriceStyle.constructor, actual.coloredBar);
        assertInstanceOf("Heikin ashi price style is not registered", StockChartX.HeikinAshiPriceStyle.constructor, actual.heikinAshi);
        assertInstanceOf("Hollow candle price style is not registered", StockChartX.HollowCandlePriceStyle.constructor, actual.hollowCandle);
        assertInstanceOf("Kagi price style is not registered", StockChartX.KagiPriceStyle.constructor, actual.kagi);
        assertInstanceOf("Line break price style is not registered", StockChartX.LineBreakPriceStyle.constructor, actual.lineBreak);
        assertInstanceOf("Mountain line price style is not registered", StockChartX.MountainPriceStyle.constructor, actual.mountain);
        assertInstanceOf("Point and figure price style is not registered", StockChartX.PointAndFigurePriceStyle.constructor, actual.pointAndFigure);
        assertInstanceOf("Renko price style is not registered", StockChartX.RenkoPriceStyle.constructor, actual.renko);
    },

    testCreate: function() {
        "use strict";

        var actual = StockChartX.PriceStyle.create('bar');

        assertNotNull("Price style is not instantiated.", actual);
        assertInstanceOf("Incorrect price style instance.", StockChartX.BarPriceStyle, actual);
    },

    testDeserialize: function() {
        "use strict";

        var expected = {
            className: "lineBreak",
            lines: 5
        };
        var actual = StockChartX.PriceStyle.deserialize(expected);

        assertNotNull("Price style is not deserialized.", actual);
        assertInstanceOf("Price style is not deserialized properly.", StockChartX.LineBreakPriceStyle, actual);
        assertEquals("Price style is not deserialized properly.", expected.lines, actual.lines);
    },

    testConstructor: function() {
        "use strict";

        assertUndefined("Plot is not initialized properly.", this.target.plot);
        assertSame("Chart is not initialized properly.", this.chart, this.target.chart);
        assertUndefined("Chart panel is not initialized properly.", this.target.chartPanel);
    },

    testConstructorWithoutChart: function() {
        "use strict";

        var target = new StockChartX.PriceStyle();

        assertUndefined("Chart is not initialized properly.", target.chart);
        assertUndefined("Chart panel is not initialized properly.", target.chartPanel);
    },

    testSaveState: function() {
        "use strict";

        var expected = {
            className: ''
        };
        var actual = this.target.saveState();

        assertEquals("State is not saved properly.", expected, actual);
    },

    testCreatePlot: function() {
        "use strict";

        //noinspection JSAccessibilityCheck
        var actual = this.target.createPlot();

        assertNull("Plot is not created properly.", actual);
    },

    testDataSeriesSuffix: function() {
        "use strict";

        assertEquals("Data series suffix is not returned properly.", "", this.target.dataSeriesSuffix());
    },

    testPrimaryDataSeriesSuffix: function() {
        "use strict";

        var actual = this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.DATE);
        assertEquals("Incorrect primary data series suffix.", "", actual);

        this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.OPEN);
        assertEquals("Incorrect primary data series suffix.", "", actual);

        this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.HIGH);
        assertEquals("Incorrect primary data series suffix.", "", actual);

        this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.LOW);
        assertEquals("Incorrect primary data series suffix.", "", actual);

        this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.CLOSE);
        assertEquals("Incorrect primary data series suffix.", "", actual);

        this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.VOLUME);
        assertEquals("Incorrect primary data series suffix.", "", actual);
    },

    testApplyWithoutPlot: function() {
        "use strict";

        var target = this.target;
        assertException("An exception must be thrown on attempt to apply without plot.", function() {
            target.apply();
        });
    },

    testApply: function() {
        "use strict";

        var plot = new StockChartX.BarPlot();
        //noinspection JSAccessibilityCheck
        this.target.prototype.createPlot = function() {
            return plot;
        };

        this.target.apply();

        assertSame("Plot is not set properly.", plot, this.target.plot);
        assertSame("Invalid chart panel.", this.chart.mainPanel, this.target.chartPanel);
        assertEquals("Plot is not added into the panel", [plot], this.chart.mainPanel.plots);

        var series = this.chart.barDataSeries()
        var expectedDataSeries = [series.close, series.open, series.high, series.low, series.close];
        assertEquals("Plot data series are not set properly.", expectedDataSeries, this.target.plot.dataSeries);
    }
});