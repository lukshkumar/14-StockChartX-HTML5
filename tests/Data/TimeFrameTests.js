/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

/* global TestCase, StockChartX, assertEquals, assertNotSame, assertException */

//noinspection JSUnusedGlobalSymbols
TimeFrameTestCase = TestCase('TimeFrameTestCase', {
    setUp: function() {
        "use strict";

        this.target = new StockChartX.TimeFrame();
    },

    testEmptyConstructor: function() {
        "use strict";

        var target = new StockChartX.TimeFrame();

        assertEquals('Periodicity is not initialized properly.', StockChartX.Periodicity.MINUTE, target.periodicity);
        assertEquals('Interval is not initialized properly.', 1, target.interval);
    },

    testConstructor: function() {
        "use strict";

        var target = new StockChartX.TimeFrame(StockChartX.Periodicity.HOUR, 2);

        assertEquals('Periodicity is not initialized properly.', StockChartX.Periodicity.HOUR, target.periodicity);
        assertEquals('Interval is not initialized properly.', 2, target.interval);
    },

    testPeriodicity: function() {
        "use strict";

        var expected = StockChartX.Periodicity.DAY;
        this.target.periodicity = expected;
        assertEquals('Periodicity is not set properly.', expected, this.target.periodicity);
    },

    testInterval: function() {
        "use strict";

        var expected = 5;
        this.target.interval = expected;
        assertEquals('Interval is not set properly.', expected, this.target.interval);
    },

    testInvalidInterval: function() {
        "use strict";

        var target = this.target;

        assertException('An exception must be thrown on attempt to assign invalid interval', function() {
            target.interval = -1;
        });
        assertException('An exception must be thrown on attempt to assign invalid interval', function() {
            target.interval = 0;
        });
        assertException('An exception must be thrown on attempt to assign invalid interval', function() {
            target.interval = NaN;
        });
        assertException('An exception must be thrown on attempt to assign invalid interval', function() {
            target.interval = Infinity;
        });
    },

    testToString: function() {
        "use strict";

        this.target = new StockChartX.TimeFrame(StockChartX.Periodicity.DAY, 1);
        assertEquals('Incorrect string representation.', '1 day', this.target.toString());

        this.target = new StockChartX.TimeFrame(StockChartX.Periodicity.HOUR, 4);
        assertEquals('Incorrect string representation.', '4 hour', this.target.toString());
    },

    testToShortString: function() {
        "use strict";

        this.target = new StockChartX.TimeFrame(StockChartX.Periodicity.DAY, 1);
        assertEquals('Incorrect short string representation.', '1 day', this.target.toShortString());

        this.target = new StockChartX.TimeFrame(StockChartX.Periodicity.MONTH, 1);
        assertEquals('Incorrect short string representation.', '1 mo', this.target.toShortString());
    },

    testClone: function() {
        "use strict";

        var expected = new StockChartX.TimeFrame(StockChartX.Periodicity.DAY, 5);
        var actual = expected.clone();

        assertNotSame('Time frame is not cloned.', expected, actual);
        assertEquals('Time frame is not cloned properly.', expected, actual);
    }
});