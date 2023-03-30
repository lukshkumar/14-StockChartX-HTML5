/**
 * Copyright Modulus Financial Engineering, Inc. Scottsdale, AZ http://www.modulusfe.com
 */

/* global StockChartX, assertNull, assertInstanceOf */

ChartPanelSplitterTestCase = TestCase('ChartPanelSplitterTestCase', { // jshint ignore:line
    setUp: function() {
        "use strict";

        this.target = new StockChartX.ChartPanelSplitter();
    },

    testConstructor: function() {
        "use strict";

        var target = new StockChartX.ChartPanelSplitter();

        assertNull("Top panel is not initialized properly.", target.topPanel);
        assertNull("Bottom panel is not initialized properly.", target.bottomPanel);
        //noinspection JSAccessibilityCheck
        assertNull("Index is not initialized properly.", target._index);
        //noinspection JSAccessibilityCheck
        assertNull("Root div is not initialized properly.", target._rootDiv);
        //noinspection JSAccessibilityCheck
        assertInstanceOf("Gestures are not initialized properly.", StockChartX.GestureArray, target._gestures);
        assertInstanceOf("Frame is not initialized properly.", StockChartX.Rect, target.frame);
    }
});