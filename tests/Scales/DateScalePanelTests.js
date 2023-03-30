/**
 * Copyright Modulus Financial Engineering, Inc. Scottsdale, AZ http://www.modulusfe.com
 */

/* global StockChartX, assertEquals, assertTrue, assertSame, assertNull, assertUndefined, assertException, assertNoException */

//noinspection JSUnusedGlobalSymbols,JSHint
DateScalePanelConstructorTestCase = TestCase('DateScalePanelConstructorTestCase', {
    setUp: function() {
        "use strict";

        this.chart = new StockChartX.Chart({
            container: 'body',
            showToolbar: false
        });
        this.expectedDateScale = new StockChartX.DateScale({
            chart: this.chart
        });
    },

    testWithoutConfig: function() {
        "use strict";

        assertException("An exception should be thrown on attempt to create date scale panel without configuration.", function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.DateScalePanel();
        });
    },

    testWithoutDateScale: function() {
        "use strict";

        assertException("An exception should be thrown on attempt to create date scale panel without parent date scale", function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.DateScalePanel({
                cssClass: 'scxDateScale'
            });
        });
    },

    testWithIncorrectDateScale: function() {
        "use strict";

        assertException("An exception should be thrown on attempt to create date scale panel with non- date scale object.", function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.DateScalePanel({
                dateScale: "",
                cssClass: 'dateScale'
            });
        });
    },

    testWithoutCssName: function() {
        "use strict";

        var self = this;
        assertException("An exception should be thrown on attempt to create date scale panel without css class name.", function() {
            new StockChartX.DateScalePanel({ // jshint ignore:line
                dateScale: self.expectedDateScale
            });
        });
    },

    testConstructor: function() {
        "use strict";

        var target = null;
        var dateScale = this.expectedDateScale;

        assertNoException("An exception should not be thrown on attempt to create date scale panel with valid configuration.", function() {
            //noinspection JSCheckFunctionSignatures
            target = new StockChartX.DateScalePanel({
                chart: this.chart,
                dateScale: dateScale,
                cssClass: 'scxDateScale'
            });
        });
        assertSame("Date scale is not initialized properly.", this.expectedDateScale, target.dateScale);
        assertUndefined("Root div element must be null", target._rootDiv);
        assertTrue("Panel must be visible by default.", target.visible);
        assertEquals("Css class is not initialized properly.", 'scxDateScale', target.cssClass);
    }
});
