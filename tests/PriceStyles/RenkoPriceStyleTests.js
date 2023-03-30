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
RenkoPriceStyleTestCase = TestCase('RenkoPriceStyleTestCase', {
    setUp: function() {
        "use strict";

        this.target = new StockChartX.RenkoPriceStyle();
    },

    testClassName: function() {
        "use strict";

        assertEquals("Class name is not set properly.", "renko", StockChartX.RenkoPriceStyle.className);
    },

    testConstructor: function() {
        "use strict";

        var expectedBoxSize = {
            kind: StockChartX.RenkoBoxSizeKind.ATR,
            value: 20
        };
        assertEquals("Box size is not initialized properly.", expectedBoxSize, this.target.boxSize);
    },

    testConstructorWithConfig: function() {
        "use strict";

        var expected = {
            boxSize: {
                kind: StockChartX.RenkoBoxSizeKind.FIXED,
                value: 14
            }
        };
        var target = new StockChartX.RenkoPriceStyle(expected);

        assertEquals("Box size is not initialized properly.", expected.boxSize, target.boxSize);
    },

    testCreatePlot: function() {
        "use strict";

        var actual = this.target.createPlot();

        assertNotNull("Plot is not created.", actual);
        assertInstanceOf("Invalid plot instance.", StockChartX.BarPlot, actual);
        assertEquals("Plot style is not set properly.", StockChartX.BarPlot.Style.RENKO, actual.plotStyle);
        assertEquals("Plot type is not set properly.", StockChartX.PlotType.PRICE_STYLE, actual.plotType);
    },

    testDataSeriesSuffix: function() {
        "use strict";

        assertEquals("Data series suffix is incorrect.", StockChartX.DataSeriesSuffix.RENKO, this.target.dataSeriesSuffix());
    },

    testSaveState: function() {
        "use strict";

        var expected = {
            className: "renko",
            boxSize: {
                kind: StockChartX.RenkoBoxSizeKind.FIXED,
                value: 14
            }
        };
        this.target.boxSize = expected.boxSize;
        var actual = this.target.saveState();

        assertEquals("State is not saved properly.", expected, actual);
    },

    testLoadState: function() {
        "use strict";

        var expected = {
            className: "renko",
            boxSize: {
                kind: StockChartX.RenkoBoxSizeKind.FIXED,
                value: 14
            }
        };
        this.target.loadState(expected);

        assertEquals("Box size is not loaded properly.", expected.boxSize, this.target.boxSize);
    },

    testPrimaryDataSeriesSuffix: function() {
        "use strict";

        var actual = this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.DATE);
        assertEquals('Incorrect primary data series suffix for date data series.', StockChartX.DataSeriesSuffix.RENKO, actual);

        actual = this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.OPEN);
        assertEquals('Incorrect primary data series suffix for open data series.', StockChartX.DataSeriesSuffix.RENKO, actual);

        actual = this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.HIGH);
        assertEquals('Incorrect primary data series suffix for high data series.', StockChartX.DataSeriesSuffix.RENKO, actual);

        actual = this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.LOW);
        assertEquals('Incorrect primary data series suffix for low data series.', StockChartX.DataSeriesSuffix.RENKO, actual);

        actual = this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.CLOSE);
        assertEquals('Incorrect primary data series suffix for close data series.', StockChartX.DataSeriesSuffix.RENKO, actual);

        actual = this.target.primaryDataSeriesSuffix(StockChartX.DataSeriesSuffix.VOLUME);
        assertEquals('Incorrect primary data series suffix for volume data series.', StockChartX.DataSeriesSuffix.RENKO, actual);
    }
});