/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

/* global TestCase, StockChartX, assertEquals, assertNotNull, assertUndefined, assertInstanceOf */

//noinspection JSUnusedGlobalSymbols,JSHint
TimeIntervalDateTimeFormatTestCase = TestCase('TimeIntervalDateTimeFormatTestCase', {
    setUp: function() {
        "use strict";

        this.target = new StockChartX.TimeIntervalDateTimeFormat();
        this.target.timeInterval = StockChartX.TimeSpan.MILLISECONDS_IN_MINUTE;
        this.target.locale = 'en-US';
    },

    testConstructor: function() {
        "use strict";

        var target = new StockChartX.TimeIntervalDateTimeFormat();

        assertUndefined('Time interval is not initialized properly.', target.timeInterval);
        assertUndefined('Locale is not initialized properly.', target.locale);
    },

    testConstructorWithTimeInterval: function() {
        "use strict";

        var expected = StockChartX.TimeSpan.MILLISECONDS_IN_HOUR;
        var target = new StockChartX.TimeIntervalDateTimeFormat(expected);

        assertUndefined('Locale is not initialized properly.', target.locale);
        assertEquals('Time interval is not initialized properly.', expected, target.timeInterval);
    },

    testLocale: function() {
        "use strict";

        var expected = 'de';

        this.target.locale = expected;
        assertEquals('Locale is not set properly.', expected, this.target.locale);
    },

    testTimeInterval: function() {
        "use strict";

        var expected = StockChartX.TimeSpan.MILLISECONDS_IN_HOUR;
        this.target.timeInterval = expected;

        assertEquals('Time interval is not set properly.', expected, this.target.timeInterval);
    },

    testCreateFormatter: function() {
        "use strict";

        //noinspection JSAccessibilityCheck
        var actual = this.target._createFormatter({year: 'numeric', month: 'short'});

        assertNotNull("Formatter is not created properly.", actual);
        assertInstanceOf("Incorrect formatter instance.", IntlPolyfill.DateTimeFormat, actual);
        assertEquals('Incorrect formatter options.', 'February 2014', actual.format(new Date(2014, 1, 1)));
    },

    testGetFormatter: function() {
        "use strict";

        var date = new Date(2014, 1, 1, 2, 3, 5);

        var actual = this.target.formatter(StockChartX.DateTimeFormatName.YEAR_MONTH);
        assertNotNull("'Year-month' formatter is not returned.", actual);
        assertEquals("Incorrect options in 'Year-month' formatter.", "February 2014", actual.format(date));

        actual = this.target.formatter(StockChartX.DateTimeFormatName.MONTH_DAY);
        assertNotNull("'month-day' formatter is not returned.", actual);
        assertEquals("Incorrect options in 'month-day' formatter.", "February 1", actual.format(date));

        actual = this.target.formatter(StockChartX.DateTimeFormatName.DATE);
        assertNotNull("'date' formatter is not returned.", actual);
        assertEquals("Incorrect options in 'date' formatter.", "February 1, 2014", actual.format(date));

        actual = this.target.formatter(StockChartX.DateTimeFormatName.SHORT_DATE_TIME);
        assertNotNull("'short date time' formatter is not returned.", actual);
        assertEquals("Incorrect options in 'short date time' formatter.",
            "Saturday, February 1, 2014, 2:03:05", actual.format(date));

        actual = this.target.formatter(StockChartX.DateTimeFormatName.LONG_DATE_TIME);
        assertNotNull("'long date time' formatter is not returned.", actual);
        assertEquals("Incorrect options in 'long date time' formatter.",
            "Saturday, February 1, 2014, 2:03:05", actual.format(date));

        actual = this.target.formatter(StockChartX.DateTimeFormatName.SHORT_TIME);
        assertNotNull("'short time' formatter is not returned.", actual);
        assertEquals("Incorrect options in 'short time' formatter.", "2:03", actual.format(date));

        actual = this.target.formatter(StockChartX.DateTimeFormatName.LONG_TIME);
        assertNotNull("'long time' formatter is not returned.", actual);
        assertEquals("Incorrect options in 'long time' formatter.", "2:03:05", actual.format(date));
    },

    testFormat: function() {
        "use strict";

        var date = new Date(2014, 1, 2, 3, 4, 5);

        this.target.timeInterval = 1;
        var actual = this.target.format(date);
        assertEquals("Date is not formatted properly for 1 ms time span.", "Sunday, February 2, 2014, 3:04:05", actual);

        this.target.timeInterval = StockChartX.TimeSpan.MILLISECONDS_IN_SECOND;
        actual = this.target.format(date);
        assertEquals("Date is not formatted properly for 1 sec time span.", "Sunday, February 2, 2014, 3:04:05", actual);

        this.target.timeInterval = StockChartX.TimeSpan.MILLISECONDS_IN_MINUTE;
        actual = this.target.format(date);
        assertEquals("Date is not formatted properly for 1 min time span.", "Sunday, February 2, 2014, 3:04:05", actual);

        this.target.timeInterval = StockChartX.TimeSpan.MILLISECONDS_IN_HOUR;
        actual = this.target.format(date);
        assertEquals("Date is not formatted properly for 1 h time span.", "Sunday, February 2, 2014, 3:04:05", actual);

        this.target.timeInterval = StockChartX.TimeSpan.MILLISECONDS_IN_DAY;
        actual = this.target.format(date);
        assertEquals("Date is not formatted properly for 1 day time span.", "February 2, 2014", actual);

        this.target.timeInterval = StockChartX.TimeSpan.MILLISECONDS_IN_WEEK;
        actual = this.target.format(date);
        assertEquals("Date is not formatted properly for 1 week time span.", "February 2, 2014", actual);

        this.target.timeInterval = StockChartX.TimeSpan.MILLISECONDS_IN_MONTH;
        actual = this.target.format(date);
        assertEquals("Date is not formatted properly for 1 month time span.", "February 2014", actual);

        this.target.timeInterval = StockChartX.TimeSpan.MILLISECONDS_IN_YEAR;
        actual = this.target.format(date);
        assertEquals("Date is not formatted properly for 1 year time span.", "2014", actual);
    },

    testFormatWithFormatter: function() {
        "use strict";

        var date = new Date(2014, 1, 2, 3, 4, 5);

        var actual = this.target.formatWithFormatter(date, StockChartX.DateTimeFormatName.YEAR_MONTH);
        assertEquals("Incorrect 'year-month' formatted value.", "February 2014", actual);

        actual = this.target.formatWithFormatter(date, StockChartX.DateTimeFormatName.MONTH_DAY);
        assertEquals("Incorrect 'month-day' formatted value.", "February 2", actual);

        actual = this.target.formatWithFormatter(date, StockChartX.DateTimeFormatName.DATE);
        assertEquals("Incorrect 'date' formatted value.", "February 2, 2014", actual);

        actual = this.target.formatWithFormatter(date, StockChartX.DateTimeFormatName.SHORT_DATE_TIME);
        assertEquals("Incorrect 'short date time' formatted value.", "Sunday, February 2, 2014, 3:04:05", actual);

        actual = this.target.formatWithFormatter(date, StockChartX.DateTimeFormatName.LONG_DATE_TIME);
        assertEquals("Incorrect 'long date time' formatted value.", "Sunday, February 2, 2014, 3:04:05", actual);

        actual = this.target.formatWithFormatter(date, StockChartX.DateTimeFormatName.SHORT_TIME);
        assertEquals("Incorrect 'short time' formatted value.", "3:04", actual);

        actual = this.target.formatWithFormatter(date, StockChartX.DateTimeFormatName.LONG_TIME);
        assertEquals("Incorrect 'long time' formatted value.", "3:04:05", actual);
    },

    testSaveState: function() {
        "use strict";

        var expected = {
            className: 'StockChartX.TimeIntervalDateTimeFormat',
            timeInterval: 60000,
            locale: 'en-US'
        };
        var actual = this.target.saveState();

        assertEquals('State is not saved properly.', expected, actual);
    },

    testLoadState: function() {
        "use strict";

        var expected = {
            className: 'StockChartX.TimeIntervalDateTimeFormat',
            timeInterval: 70000,
            locale: 'uk'
        };
        //noinspection JSCheckFunctionSignatures
        this.target.loadState(expected);
        var actual = this.target.saveState();

        assertEquals('State is not loaded properly', expected, actual);
    }
});