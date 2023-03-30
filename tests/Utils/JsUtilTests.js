/**
 * Copyright Modulus Financial Engineering, Inc. Scottsdale, AZ http://www.modulusfe.com
 */

/* global StockChartX, assertTrue, assertFalse */

//noinspection JSUnusedGlobalSymbols,JSHint
JsUtilTestCase = TestCase('JsUtilTestCase', {
    testIsObject: function () {
        "use strict";

        assertTrue('isObject check failed.', StockChartX.JsUtil.isObject({}));
        assertFalse('isObject check failed.', StockChartX.JsUtil.isObject(1));
        //noinspection JSCheckFunctionSignatures
        assertFalse('isObject check failed.', StockChartX.JsUtil.isObject());
        assertFalse('isObject check failed.', StockChartX.JsUtil.isObject(""));
        assertFalse('isObject check failed.', StockChartX.JsUtil.isObject([]));
        assertFalse('isObject check failed.', StockChartX.JsUtil.isObject(true));
        assertFalse('isObject check failed.', StockChartX.JsUtil.isObject(undefined));
        assertFalse('isObject check failed.', StockChartX.JsUtil.isObject(null));
        assertFalse('isObject check failed.', StockChartX.JsUtil.isObject(function(){}));
    },

    testIsNumber: function() {
        "use strict";

        //noinspection JSCheckFunctionSignatures
        assertFalse('isNumber check failed.', StockChartX.JsUtil.isNumber());
        assertFalse('isNumber check failed.', StockChartX.JsUtil.isNumber(''));
        assertFalse('isNumber check failed.', StockChartX.JsUtil.isNumber('1'));
        assertFalse('isNumber check failed.', StockChartX.JsUtil.isNumber({}));
        assertFalse('isNumber check failed.', StockChartX.JsUtil.isNumber([]));
        assertFalse('isNumber check failed.', StockChartX.JsUtil.isNumber(null));
        assertFalse('isNumber check failed.', StockChartX.JsUtil.isNumber(function(){}));
        assertTrue('isNumber check failed.', StockChartX.JsUtil.isNumber(1));
    },

    testIsFunction: function() {
        "use strict";

        //noinspection JSCheckFunctionSignatures
        assertFalse('isFunction check failed.', StockChartX.JsUtil.isFunction());
        assertFalse('isFunction check failed.', StockChartX.JsUtil.isFunction(''));
        assertFalse('isFunction check failed.', StockChartX.JsUtil.isFunction(1));
        assertFalse('isFunction check failed.', StockChartX.JsUtil.isFunction({}));
        assertFalse('isFunction check failed.', StockChartX.JsUtil.isFunction([]));
        assertFalse('isFunction check failed.', StockChartX.JsUtil.isFunction(null));
        assertTrue('isFunction check failed.', StockChartX.JsUtil.isFunction(function(){}));
    },

    testIsArray: function() {
        "use strict";

        //noinspection JSCheckFunctionSignatures
        assertFalse('isFunction check failed.', StockChartX.JsUtil.isArray());
        assertFalse('isFunction check failed.', StockChartX.JsUtil.isArray(''));
        assertFalse('isFunction check failed.', StockChartX.JsUtil.isArray(1));
        assertFalse('isFunction check failed.', StockChartX.JsUtil.isArray({}));
        assertTrue('isFunction check failed.', StockChartX.JsUtil.isArray([]));
        assertFalse('isFunction check failed.', StockChartX.JsUtil.isArray(null));
        assertFalse('isFunction check failed.', StockChartX.JsUtil.isArray(function(){}));
    }
});