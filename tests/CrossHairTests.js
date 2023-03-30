/**
 * Copyright Modulus Financial Engineering, Inc. Scottsdale, AZ http://www.modulusfe.com
 */

/* global StockChartX, assertEquals, assertSame, assertTrue, assertFalse */

//noinspection JSUnusedGlobalSymbols,JSHint
CrossHairTestCase = TestCase('CrossHairTestCase', {
    setUp: function() {
        "use strict";

        this.chart = new StockChartX.Chart({
            container: 'body',
            width: 100,
            height: 100,
            showToolbar: false
        });

        this.target = new StockChartX.CrossHair({chart: this.chart});
    },

    testConstructor: function() {
        "use strict";

        assertSame("Chart is not initialized properly.", this.chart, this.target.chart);
        assertEquals("Cross hair type is not initialized properly.", StockChartX.CrossHairType.NONE, this.target.crossHairType);
        assertTrue("Visible must be true by default", this.target.visible);
    },

    testCrossHairType: function() {
        "use strict";

        var expected = StockChartX.CrossHairType.MARKERS;
        this.target.crossHairType = expected;
        assertEquals("Cross hair type is not set properly.", expected, this.target.crossHairType);
    },

    testVisible: function() {
        "use strict";

        this.target.visible = false;
        assertFalse("Visible is not set properly.", this.target.visible);

        this.target.visible = true;
        assertTrue("Visible is not set properly.", this.target.visible);
    },

    testSaveState: function() {
        "use strict";

        var expected = {
            crossHairType: StockChartX.CrossHairType
        };
        this.target.crossHairType = expected.crossHairType;

        var actual = this.target.saveState();

        assertEquals("State is not saved properly.", expected, actual);
    },

    testLoadState: function() {
        "use strict";

        var expected = {
            crossHairType: StockChartX.CrossHairType.MARKERS
        };
        this.target.loadState(expected);

        assertEquals("Cross hair type is not loaded properly.", expected.crossHairType, this.target.crossHairType);
    }
});