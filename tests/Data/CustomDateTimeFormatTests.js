/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

/* global TestCase, StockChartX, assertEquals, assertSame, assertUndefined, assertNotNull, assertNotUndefined,
          assertInstanceOf */

//noinspection JSUnusedGlobalSymbols, JSHint
CustomDateTimeFormatTestCase = TestCase('CustomDateTimeFormatTestCase', {
    setUp: function() {
        "use strict";

        /**
         * @type {StockChartX.CustomDateTimeFormat}
         */
        this.target = new StockChartX.CustomDateTimeFormat();
    },

    testClassName: function() {
        "use strict";

        assertEquals('Incorrect class name.', 'StockChartX.CustomDateTimeFormat', StockChartX.CustomDateTimeFormat.className);
    },

    testFormatString: function() {
        "use strict";

        var expected = 'YYYY-MM-dd';
        this.target.formatString = expected;

        assertSame('Format string is not set properly.', expected, this.target.formatString);
    },

    testConstructor: function() {
        "use strict";

        assertUndefined('Format string is not initialized properly.', this.target.formatString);
        assertUndefined('Locale is not initialized properly.', this.target.locale);
    },

    testConstructorWithFormatString: function() {
        "use strict";

        var expected = "YYYY-MM-DD";
        this.target = new StockChartX.CustomDateTimeFormat(expected);

        assertSame('Format string is not initialized properly.', expected, this.target.formatString);
        assertUndefined('Locale is not initialized properly.', this.target.locale);
    },

    testLocale: function() {
        "use strict";

        var expected = 'uk';
        this.target.locale = expected;

        assertSame('Locale is not set properly.', expected, this.target.locale);
    },

    testFormat: function() {
        "use strict";

        this.target.formatString = "YYYY-MM-DD";

        var expected = '2015-05-10';
        var actual = this.target.format(new Date(2015, 4, 10, 11, 12));

        assertEquals('Incorrect formatted value.', expected, actual);
    },

    testSaveState: function() {
        "use strict";

        this.target.formatString = "YYYY-MM-DD";
        this.target.locale = 'uk';

        var expected = {
            className: 'StockChartX.CustomDateTimeFormat',
            formatString: 'YYYY-MM-DD',
            locale: 'uk'
        };
        var actual = this.target.saveState();

        assertEquals("State is not saved properly.", expected, actual);
    },

    testLoadState: function() {
        "use strict";

        this.target.formatString = "YYYY-MM-DD";
        this.target.locale = 'uk';

        var state = this.target.saveState();
        this.target = new StockChartX.CustomDateTimeFormat();
        this.target.loadState(state);

        assertEquals('Format string is not loaded properly.', 'YYYY-MM-DD', this.target.formatString);
        assertEquals('Locale is not loaded properly.', 'uk', this.target.locale);
    },

    testIsRegistered: function() {
        "use strict";

        var target = StockChartX.DateTimeFormat.registeredFormatters[StockChartX.CustomDateTimeFormat.className];

        assertNotNull('Formatter is not registered', target);
        assertNotUndefined('Formatter is not registered', target);
        assertInstanceOf('Formatter is not registered properly.', StockChartX.CustomDateTimeFormat.constructor, target);
    }
});