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
MountainLinePriceStyleTestCase = TestCase('MountainLinePriceStyleTestCase', {
    setUp: function() {
        "use strict";

        this.target = new StockChartX.MountainPriceStyle();
    },

    testClassName: function() {
        "use strict";

        assertEquals("Class name is not set properly.", "mountain", StockChartX.MountainPriceStyle.className);
    },

    testCreatePlot: function() {
        "use strict";

        var actual = this.target.createPlot();

        assertNotNull("Plot is not created.", actual);
        assertInstanceOf("Invalid plot instance.", StockChartX.LinePlot, actual);
        assertEquals("Plot style is not set properly.", StockChartX.LinePlot.Style.MOUNTAIN, actual.plotStyle);
        assertEquals("Plot type is not set properly.", StockChartX.PlotType.PRICE_STYLE, actual.plotType);
    }
});