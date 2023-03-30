/**
 * Copyright Modulus Financial Engineering, Inc. Scottsdale, AZ http://www.modulusfe.com
 */

/* global StockChartX, assertEquals */

//noinspection JSUnusedGlobalSymbols,JSHint
HtmlUtilTestCase = TestCase('HtmlUtilTestCase', {
    testGetCanvasFont: function() {
        "use strict";

        var expected = "12px Arial";
        assertEquals("Incorrect canvas font.", expected, StockChartX.HtmlUtil.getCanvasFont());

        var theme = {
            fontFamily: "Arial",
            fontSize: 10,
            fontStyle: "italic",
            fontVariant: "small-caps",
            fontWeight: "bold"
        };
        expected = "italic small-caps bold 10px Arial";
        assertEquals("Incorrect canvas font.", expected, StockChartX.HtmlUtil.getCanvasFont(theme));

        theme = {
            fontFamily: "Verdana",
            fontSize: 10
        };
        expected = "normal normal normal 10px Verdana";
        assertEquals("Incorrect canvas font.", expected, StockChartX.HtmlUtil.getCanvasFont(theme));
    },

    testNormalizeEmptyFontTheme: function() {
        "use strict";

        var expected = {
            fontFamily: "Arial",
            fontSize: 10,
            fontStyle: "normal",
            fontVariant: "normal",
            fontWeight: "normal"
        };

        assertEquals("font theme is not normalized properly.", expected, StockChartX.HtmlUtil.normalizeFontTheme());
    },

    testNormalizeFontTheme: function() {
        "use strict";

        var expected = {
            fontFamily: "Arial",
            fontSize: 12,
            fontStyle: "bold",
            fontVariant: "normal",
            fontWeight: "normal"
        };
        var theme = {
            fontSize: 12,
            fontStyle: "bold"
        };

        assertEquals("font theme is not normalized properly.", expected, StockChartX.HtmlUtil.normalizeFontTheme(theme));
    }
});