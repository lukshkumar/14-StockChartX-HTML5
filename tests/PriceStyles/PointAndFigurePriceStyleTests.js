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
PointAndFigurePriceStyleTestCase = TestCase('PointAndFigurePriceStyleTestCase', {
    setUp: function() {
        "use strict";

        this.target = new StockChartX.PointAndFigurePriceStyle();
    },

    testClassName: function() {
        "use strict";

        assertEquals("Class name is not set properly.", "pointAndFigure", StockChartX.PointAndFigurePriceStyle.className);
    },

    testConstructor: function() {
        "use strict";

        var expectedBoxSize = {
            kind: StockChartX.PointAndFigureBoxSizeKind.ATR,
            value: 20
        };
        assertEquals("Box size is not initialized properly.", expectedBoxSize, this.target.boxSize);
        assertEquals("Reversal is not initialized properly.", 3, this.target.reversal);
    },

    testConstructorWithConfig: function() {
        "use strict";

        var expected = {
            boxSize: {
                kind: StockChartX.PointAndFigureBoxSizeKind.FIXED,
                value: 14
            },
            reversal: 5
        };
        var target = new StockChartX.PointAndFigurePriceStyle(expected);

        assertEquals("Box size is not initialized properly.", expected.boxSize, target.boxSize);
        assertEquals("Reversal is not initialized properly.", expected.reversal, target.reversal);
    },

    testCreatePlot: function() {
        "use strict";

        var actual = this.target.createPlot();

        assertNotNull("Plot is not created.", actual);
        assertInstanceOf("Invalid plot instance.", StockChartX.BarPlot, actual);
        assertEquals("Plot style is not set properly.", StockChartX.BarPlot.Style.POINT_AND_FIGURE, actual.plotStyle);
        assertEquals("Plot type is not set properly.", StockChartX.PlotType.PRICE_STYLE, actual.plotType);
    },

    testDataSeriesSuffix: function() {
        "use strict";

        assertEquals("Data series suffix is incorrect.", StockChartX.DataSeriesSuffix.POINT_AND_FIGURE, this.target.dataSeriesSuffix());
    },

    testSaveState: function() {
        "use strict";

        var expected = {
            className: "pointAndFigure",
            boxSize: {
                kind: StockChartX.PointAndFigureBoxSizeKind.FIXED,
                value: 14
            },
            reversal: 5
        };
        this.target.boxSize = expected.boxSize;
        this.target.reversal = expected.reversal;
        var actual = this.target.saveState();

        assertEquals("State is not saved properly.", expected, actual);
    },

    testLoadState: function() {
        "use strict";

        var expected = {
            className: "pointAndFigure",
            boxSize: {
                kind: StockChartX.PointAndFigureBoxSizeKind.FIXED,
                value: 14
            },
            reversal: 5
        };
        this.target.loadState(expected);

        assertEquals("Box size is not loaded properly.", expected.boxSize, this.target.boxSize);
        assertEquals("Reversal is not loaded properly.", expected.reversal, this.target.reversal);
    },

    testPrimaryDataSeriesSuffix: function() {
        "use strict";

        var actual = this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.DATE);
        assertEquals('Incorrect primary data series suffix for date data series.', StockChartX.DataSeriesSuffix.POINT_AND_FIGURE, actual);

        actual = this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.OPEN);
        assertEquals('Incorrect primary data series suffix for open data series.', StockChartX.DataSeriesSuffix.POINT_AND_FIGURE, actual);

        actual = this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.HIGH);
        assertEquals('Incorrect primary data series suffix for high data series.', StockChartX.DataSeriesSuffix.POINT_AND_FIGURE, actual);

        actual = this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.LOW);
        assertEquals('Incorrect primary data series suffix for low data series.', StockChartX.DataSeriesSuffix.POINT_AND_FIGURE, actual);

        actual = this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.CLOSE);
        assertEquals('Incorrect primary data series suffix for close data series.', StockChartX.DataSeriesSuffix.POINT_AND_FIGURE, actual);

        actual = this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.VOLUME);
        assertEquals('Incorrect primary data series suffix for volume data series.', StockChartX.DataSeriesSuffix.POINT_AND_FIGURE, actual);
    }
});