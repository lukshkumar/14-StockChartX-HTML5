/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

/* global TestCase, StockChartX, assertException, assertEquals, assertNull, assertNotNull, assertUndefined, assertInstanceOf */

//noinspection JSUnusedGlobalSymbols, JSHint
DateTimeFormatTestCase = TestCase('DateTimeFormatTestCase', {
    setUp: function () {
        "use strict";

        /**
         * @type {StockChartX.DateTimeFormat}
         */
        this.target = new StockChartX.DateTimeFormat();
    },

    testClassName: function() {
        "use strict";

        assertEquals('Incorrect class name.', '', StockChartX.DateTimeFormat.className);
    },

    testLocale: function() {
        "use strict";

        var expected = 'uk-UA';
        this.target.locale = expected;

        assertEquals('Locale is not set properly.', expected, this.target.locale);
    },

    testConstructor: function() {
        "use strict";

        assertUndefined('Locale is not initialized properly.', this.target.locale);
    },

    testSaveState: function() {
        "use strict";

        this.target.locale = 'uk';

        var expected = {
            className: '',
            locale: 'uk'
        };
        var actual = this.target.saveState();

        assertEquals('State is not saved properly.', expected, actual);
    },

    testLoadState: function() {
        "use strict";

        this.target.locale = 'uk';
        var expected = this.target.saveState();

        this.target = new StockChartX.DateTimeFormat();
        this.target.loadState(expected);

        assertEquals('Locale is not loaded properly.', expected.locale, this.target.locale);
    },

    testRegister: function() {
        "use strict";

        var expected = {
            'StockChartX.CustomDateTimeFormat': StockChartX.CustomDateTimeFormat,
            'StockChartX.TimeIntervalDateTimeFormat': StockChartX.TimeIntervalDateTimeFormat
        };
        assertEquals('Formatters are not registered properly.', expected, StockChartX.DateTimeFormat.registeredFormatters);
    },

    testDeserializeNullState: function() {
        "use strict";

        assertNull('Deserialize failed.', StockChartX.DateTimeFormat.deserialize());
        assertNull('Deserialize failed.', StockChartX.DateTimeFormat.deserialize(null));
    },

    testDeserializeIncorrectState: function() {
        "use strict";

        var target = StockChartX.DateTimeFormat;

        assertException('An exception must be thrown if class name is not specified.', function() {
            //noinspection JSCheckFunctionSignatures
            target.deserialize({});
        });
        assertException('An exception must be thrown if class name is not specified.', function() {
            //noinspection JSCheckFunctionSignatures
            target.deserialize({className: null});
        });
        assertException('An exception must be thrown if class name is not registered.', function() {
            //noinspection JSCheckFunctionSignatures
            target.deserialize({className: 'MyClass'});
        });
    },

    testDeserializeCustomDateTimeFormat: function() {
        "use strict";

        var state = {
            className: 'StockChartX.CustomDateTimeFormat',
            formatString: 'YYYY-MM-DD',
            locale: 'uk'
        };
        var actual = StockChartX.DateTimeFormat.deserialize(state);

        assertNotNull('Custom date time format is not deserialized.', actual);
        assertInstanceOf('Custom date time format is not deserialized properly.', StockChartX.CustomDateTimeFormat, actual);
    },

    testDeserializeTimeIntervalDateTimeFormat: function() {
        "use strict";

        var state = {
            className: 'StockChartX.TimeIntervalDateTimeFormat',
            locale: 'uk',
            timeInterval: 10
        };
        var actual = StockChartX.DateTimeFormat.deserialize(state);

        assertNotNull('TimeIntervalDateTimeFormat is not deserialized', actual);
        assertInstanceOf('TimeIntervalDateTimeFormat is not deserialized properly.', StockChartX.TimeIntervalDateTimeFormat, actual);
    }
});