/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

/* global StockChartX, assertEquals, assertNotNull, assertInstanceOf */

//noinspection JSUnusedGlobalSymbols,JSHint,JSUnresolvedFunction
LineBreakPriceStyleTestCase = TestCase('LineBreakPriceStyleTestCase', {
    setUp: function() {
        "use strict";

        this.target = new StockChartX.LineBreakPriceStyle();
    },

    testClassName: function() {
        "use strict";

        assertEquals("Class name is not set properly.", "lineBreak", StockChartX.LineBreakPriceStyle.className);
    },

    testConstructor: function() {
        "use strict";

        assertEquals("Line amount is not initialized properly.", 3, this.target.lines);
    },

    testConstructorWithConfig: function() {
        "use strict";

        var expected = {
            lines: 2
        };
        var target = new StockChartX.LineBreakPriceStyle(expected);

        assertEquals("Lines amount is not initialized properly.", expected.lines, target.lines);
    },

    testCreatePlot: function() {
        "use strict";

        var actual = this.target.createPlot();

        assertNotNull("Plot is not created.", actual);
        assertInstanceOf("Invalid plot instance.", StockChartX.BarPlot, actual);
        assertEquals("Plot style is not set properly.", StockChartX.BarPlot.Style.CANDLE, actual.plotStyle);
        assertEquals("Plot type is not set properly.", StockChartX.PlotType.PRICE_STYLE, actual.plotType);
    },

    testDataSeriesSuffix: function() {
        "use strict";

        assertEquals("Data series suffix is incorrect.", StockChartX.DataSeriesSuffix.LINE_BREAK, this.target.dataSeriesSuffix());
    },

    testSaveState: function() {
        "use strict";

        var expected = {
            className: "lineBreak",
            lines: 2
        };
        this.target.lines = expected.lines;
        var actual = this.target.saveState();

        assertEquals("State is not saved properly.", expected, actual);
    },

    testLoadState: function() {
        "use strict";

        var expected = {
            className: 'lineBreak',
            lines: 5
        };
        this.target.loadState(expected);

        assertEquals("Lines value is not loaded properly.", expected.lines, this.target.lines);
    },

    testPrimaryDataSeriesSuffix: function() {
        "use strict";

        var actual = this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.DATE);
        assertEquals('Incorrect primary data series suffix for date data series.', StockChartX.DataSeriesSuffix.LINE_BREAK, actual);

        actual = this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.OPEN);
        assertEquals('Incorrect primary data series suffix for open data series.', StockChartX.DataSeriesSuffix.LINE_BREAK, actual);

        actual = this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.HIGH);
        assertEquals('Incorrect primary data series suffix for high data series.', StockChartX.DataSeriesSuffix.LINE_BREAK, actual);

        actual = this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.LOW);
        assertEquals('Incorrect primary data series suffix for low data series.', StockChartX.DataSeriesSuffix.LINE_BREAK, actual);

        actual = this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.CLOSE);
        assertEquals('Incorrect primary data series suffix for close data series.', StockChartX.DataSeriesSuffix.LINE_BREAK, actual);

        actual = this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.VOLUME);
        assertEquals('Incorrect primary data series suffix for volume data series.', StockChartX.DataSeriesSuffix.LINE_BREAK, actual);
    }
});