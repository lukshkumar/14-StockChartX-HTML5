/**
 * Copyright Modulus Financial Engineering, Inc. Scottsdale, AZ http://www.modulusfe.com
 */

/* global StockChartX, assertSame, assertEquals, assertNull, assertNotNull, assertTrue, assertFalse, assertException, assertNoException */
//noinspection JSUnusedGlobalSymbols,JSHint
DateScaleTestCase = TestCase('DateScaleTestCase', {
    setUp: function() {
        "use strict";

        this.expectedChart = new StockChartX.Chart({
            container: 'body',
            showToolbar: false
        });
        this.target = new StockChartX.DateScale({
            chart: this.expectedChart
        });
    },

    testInvalidConstructors: function() {
        "use strict";

        assertException("An exception should be thrown on attempt to create date scale without configuration.", function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.DateScale();
        });
        assertException("An exception should be thrown on attempt to create date scale without chart.", function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.DateScale({});
        });
        assertException("An exception should be thrown on attempt to create date scale with non-chart.", function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.DateScale({chart: ""});
        });
    },

    testConstructor: function() {
        "use strict";

        var chart = this.expectedChart;
        assertNoException("An exception should not be thrown on attempt to create date scale with valid config.", function() {
            new StockChartX.DateScale({chart: chart}); // jshint ignore:line
        });

        assertSame("Chart is not initialized properly.", this.expectedChart, this.target.chart);
        assertNotNull("Top panel is not initialized properly.", this.target.topPanel);
        assertNotNull("Bottom panel is not initialized properly.", this.target.bottomPanel);
        assertEquals("Top panel's css class name is not initialized properly.", "scxTopDateScale", this.target.topPanelCssClass);
        assertEquals("Bottom panel's css class name is not initialized properly.", "scxBottomDateScale", this.target.bottomPanelCssClass);
        assertNull("First visible record is not initialized properly", this.target.firstVisibleRecord);
        assertNull("Last visible record is not initialized properly.", this.target.lastVisibleRecord);
        assertNotNull("Projection is not initialized.", this.target.projection);
        assertNotNull("Date scale is not initialized to projection.", this.target.projection.dateScale);
        //noinspection JSAccessibilityCheck
        assertEquals("Visible dates is not initialized properly.", [], this.target._visibleDates);
        assertEquals("Min labels offset is not initialized properly.", 30, this.target.minLabelsOffset);
        assertEquals("Min visible records is not initialized properly.", 5, this.target.minVisibleRecords);
        assertEquals("Zoom kind is not initialized properly.", StockChartX.DateScaleZoomKind.AUTOSCALED, this.target.zoomKind);
        assertEquals("Zoom mode is not initialized properly.", StockChartX.DateScaleZoomMode.PIN_CENTER, this.target.zoomMode);
    },

    testFirstVisibleRecord: function() {
        "use strict";

        var expected = 3;
        this.target.firstVisibleRecord = expected;

        assertEquals("First visible record is not set properly.", expected, this.target.firstVisibleRecord);
    },

    testLastVisibleRecord: function() {
        "use strict";

        var expected = 3;
        this.target.lastVisibleRecord = expected;

        assertEquals("Last visible record is not set properly.", expected, this.target.lastVisibleRecord);
    },

    testGetColumnsCount: function() {
        "use strict";

        assertEquals("Invalid columns count.", 0, this.target.columnsCount);

        this.target.firstVisibleRecord = 0;
        this.target.lastVisibleRecord = 0;
        assertEquals("Invalid columns count.", 1, this.target.columnsCount);

        this.target.lastVisibleRecord = 1;
        assertEquals("Invalid columns count.", 2, this.target.columnsCount);
    },

    testNeedsAutoScale: function() {
        "use strict";

        this.target.firstVisibleRecord = 0;
        this.target.lastVisibleRecord = 1;
        assertFalse("Incorrect needs auto-scale state.", this.target.needsAutoScale());

        this.target.firstVisibleRecord = null;
        assertTrue("Incorrect needs auto-scale state.", this.target.needsAutoScale());

        this.target.firstVisibleRecord = 0;
        this.target.lastVisibleRecord = null;
        assertTrue("Incorrect needs auto-scale state.", this.target.needsAutoScale());

        this.target.firstVisibleRecord = null;
        assertTrue("Incorrect needs auto-scale state.", this.target.needsAutoScale());
    },

    testAutoScale: function() {
        "use strict";

        this.target.autoScale();
        assertNull("Date scale is not auto-scaled properly.", this.target.firstVisibleRecord);
        assertNull("Date scale is not auto-scaled properly.", this.target.lastVisibleRecord);
    },

    testMinVisibleRecords: function() {
        "use strict";

        var expected = 3;
        this.target.minVisibleRecords = expected;

        assertEquals("Min visible records is not set properly.", expected, this.target.minVisibleRecords);

        var target = this.target;
        assertException("An exception should be thrown if min visible records is incorrect.", function() {
            target.minVisibleRecords = null;
        });
        assertException("An exception should be thrown if min visible records is incorrect.", function() {
            target.minVisibleRecords = '';
        });
        assertException("An exception should be thrown if min visible records is incorrect.", function() {
            target.minVisibleRecords = -1;
        });
        assertException("An exception should be thrown if min visible records is incorrect.", function() {
            target.minVisibleRecords = 0;
        });
    },

    testZoomMode: function() {
        "use strict";

        var expected = StockChartX.DateScaleZoomMode.PIN_LEFT;
        this.target.zoomMode = expected;

        assertEquals("Zoom mode is not set properly.", expected, this.target.zoomMode);
    },

    testZoomKind: function() {
        "use strict";

        var expected = StockChartX.DateScaleZoomKind.NORMAL;
        this.target.zoomKind = expected;

        assertEquals("Zoom kind is not set properly.", expected, this.target.zoomKind);
    }
});