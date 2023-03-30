/**
 * Copyright Modulus Financial Engineering, Inc. Scottsdale, AZ http://www.modulusfe.com
 */

/* global StockChartX, assertEquals, assertTrue, assertFalse */

//noinspection JSUnusedGlobalSymbols,JSHint
GeometryTestCase = TestCase('GeometryTestCase', {
    testDeviation: function() {
        "use strict";

        assertEquals('Deviation is not initialized properly.', 5, StockChartX.Geometry.DEVIATION);
    },

    testIsValueNearValue: function() {
        "use strict";

        assertTrue('isValueNearValue check failed.', StockChartX.Geometry.isValueNearValue(0, 0));
        assertTrue('isValueNearValue check failed.', StockChartX.Geometry.isValueNearValue(4, 0));
        assertTrue('isValueNearValue check failed.', StockChartX.Geometry.isValueNearValue(5, 0));
        assertTrue('isValueNearValue check failed.', StockChartX.Geometry.isValueNearValue(-5, 0));
        assertFalse('isValueNearValue check failed.', StockChartX.Geometry.isValueNearValue(6, 0));
    },

    testIsValueBetweenOrNearValues: function() {
        "use strict";

        assertTrue('isValueBetweenOrNearValues check failed.', StockChartX.Geometry.isValueBetweenOrNearValues(5, 0, 5));
        assertTrue('isValueBetweenOrNearValues check failed.', StockChartX.Geometry.isValueBetweenOrNearValues(0, 0, 5));
        assertTrue('isValueBetweenOrNearValues check failed.', StockChartX.Geometry.isValueBetweenOrNearValues(2, 0, 5));
        assertTrue('isValueBetweenOrNearValues check failed.', StockChartX.Geometry.isValueBetweenOrNearValues(10, 0, 5));
        assertTrue('isValueBetweenOrNearValues check failed.', StockChartX.Geometry.isValueBetweenOrNearValues(-5, 0, 5));
        assertFalse('isValueBetweenOrNearValues check failed.', StockChartX.Geometry.isValueBetweenOrNearValues(11, 0, 5));
        assertFalse('isValueBetweenOrNearValues check failed.', StockChartX.Geometry.isValueBetweenOrNearValues(-6, 0, 5));
    },

    testIsPointInsideOrNearRect: function() {
        "use strict";

        var rect = {
            left: 0,
            top: 0,
            width: 10,
            height: 10
        };

        //noinspection JSCheckFunctionSignatures
        assertFalse('isPointInsideOrNearRect check failed.', StockChartX.Geometry.isPointInsideOrNearRect({x: -6, y: 0}, rect));
        //noinspection JSCheckFunctionSignatures
        assertFalse('isPointInsideOrNearRect check failed.', StockChartX.Geometry.isPointInsideOrNearRect({x: 0, y: -6}, rect));
        //noinspection JSCheckFunctionSignatures
        assertFalse('isPointInsideOrNearRect check failed.', StockChartX.Geometry.isPointInsideOrNearRect({x: 16, y: 0}, rect));
        //noinspection JSCheckFunctionSignatures
        assertFalse('isPointInsideOrNearRect check failed.', StockChartX.Geometry.isPointInsideOrNearRect({x: 0, y: 16}, rect));
        //noinspection JSCheckFunctionSignatures
        assertTrue('isPointInsideOrNearRect check failed.', StockChartX.Geometry.isPointInsideOrNearRect({x: 0, y: 0}, rect));
        //noinspection JSCheckFunctionSignatures
        assertTrue('isPointInsideOrNearRect check failed.', StockChartX.Geometry.isPointInsideOrNearRect({x: 10, y: 0}, rect));
        //noinspection JSCheckFunctionSignatures
        assertTrue('isPointInsideOrNearRect check failed.', StockChartX.Geometry.isPointInsideOrNearRect({x: 0, y: 10}, rect));
        //noinspection JSCheckFunctionSignatures
        assertTrue('isPointInsideOrNearRect check failed.', StockChartX.Geometry.isPointInsideOrNearRect({x: 10, y: 10}, rect));
        //noinspection JSCheckFunctionSignatures
        assertTrue('isPointInsideOrNearRect check failed.', StockChartX.Geometry.isPointInsideOrNearRect({x: 5, y: 0}, rect));
        //noinspection JSCheckFunctionSignatures
        assertTrue('isPointInsideOrNearRect check failed.', StockChartX.Geometry.isPointInsideOrNearRect({x: 0, y: 5}, rect));
        //noinspection JSCheckFunctionSignatures
        assertTrue('isPointInsideOrNearRect check failed.', StockChartX.Geometry.isPointInsideOrNearRect({x: 5, y: 5}, rect));
    }
});