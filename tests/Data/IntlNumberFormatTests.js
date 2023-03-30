/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

/* global TestCase, StockChartX, assertException, assertEquals, assertNotEquals, assertNotNull, assertUndefined,
          assertNotUndefined, assertInstanceOf */

//noinspection JSUnusedGlobalSymbols, JSHint
IntlNumberFormatTestCase = TestCase('IntlNumberFormatTestCase', {
    setUp: function() {
        "use strict";

        /**
         * @type {StockChartX.IntlNumberFormat}
         */
        this.target = new StockChartX.IntlNumberFormat();
    },

    testClassName: function() {
        "use strict";

        assertEquals('Incorrect class name.', 'StockChartX.IntlNumberFormat', StockChartX.IntlNumberFormat.className);
    },

    testDefaultConstructor: function() {
        "use strict";

        assertUndefined('Locale is not initialized properly', this.target.locale);
        //noinspection JSUnresolvedVariable
        assertEquals('Number format is not initialized properly.', 'en', this.target.options.locale);
        //noinspection JSAccessibilityCheck
        assertNotNull('Number format is not initialized properly', this.target._numberFormat);
        //noinspection JSAccessibilityCheck
        assertNotUndefined('Number format is not initialized properly', this.target._numberFormat);
    },

    testConstructorWithLocale: function() {
        "use strict";

        var expected = 'uk';
        var target = new StockChartX.IntlNumberFormat(expected);

        assertEquals('Locale is not initialized properly', expected, target.locale);
        //noinspection JSUnresolvedVariable
        assertEquals('Number format is not initialized properly', expected, target.options.locale);
    },

    testConstructorWithOptions: function() {
        "use strict";

        var expected = {
            minimumFractionDigits: 3,
            maximumFractionDigits: 4
        };
        var target = new StockChartX.IntlNumberFormat('uk-UA', expected);
        var actual = target.options;

        assertEquals('Number format is not initialized properly.', expected.minimumFractionDigits, actual.minimumFractionDigits);
        assertEquals('Number format is not initialized properly.', expected.maximumFractionDigits, actual.maximumFractionDigits);
    },

    testLocale: function() {
        "use strict";

        var expected = 'uk';
        this.target.locale = expected;

        assertEquals('Locale is not set.', expected, this.target.locale);
        //noinspection JSUnresolvedVariable
        assertEquals('Number format is not updated.', expected, this.target.options.locale);
    },

    testDecimalDigits: function() {
        "use strict";

        var expected = 5;
        this.target.setDecimalDigits(expected);
        var actual = this.target.options;

        assertEquals('Minimum fraction digits is not set.', expected, actual.minimumFractionDigits);
        assertEquals('Maximum fraction digits is not set.', expected, actual.maximumFractionDigits);
    },

    testInvalidDecimalDigits: function() {
        "use strict";

        assertException('Exception should be thrown on attempt to set negative value.', function() {
            this.target.setDecimalDigits(-1);
        });
        assertException('Exception should be thrown on attempt to set nan value.', function() {
            this.target.setDecimalDigits(NaN);
        });
        assertException('Exception should be thrown on attempt to set infinite value.', function() {
            this.target.setDecimalDigits(Infinity);
        });
        assertException('Exception should be thrown on attempt to set negative value.', function() {
            this.target.setDecimalDigits(-Infinity);
        });
    },

    testFormat: function() {
        "use strict";

        var actual = this.target.format(123);

        assertEquals('Format failed', '123', actual);
    },

    testFormatWithDecimalDigits: function() {
        "use strict";

        this.target.setDecimalDigits(3);

        var actual = this.target.format(123);
        assertEquals('Format failed', '123.000', actual);

        actual = this.target.format(123.456);
        assertEquals('Format failed', '123.456', actual);

        actual = this.target.format(123.4567);
        assertEquals('Format failed', '123.457', actual);
    },

    testSaveState: function() {
        "use strict";

        this.target.locale = 'uk-UA';
        this.target.setDecimalDigits(3);

        var actual = this.target.saveState();

        assertEquals('Locale not saved.', 'uk-UA', actual.locale);
        //noinspection JSUnresolvedVariable
        assertEquals('Format options not saved', 3, actual.options.minimumFractionDigits);
        //noinspection JSUnresolvedVariable
        assertEquals('Format options not saved', 3, actual.options.maximumFractionDigits);
    },

    testLoadState: function() {
        "use strict";

        this.target.locale = 'uk-UA';
        this.target.setDecimalDigits(3);
        var expected = this.target.saveState();

        this.target = new StockChartX.IntlNumberFormat();
        var actual = this.target.saveState();

        assertNotEquals('State not saved properly.', expected, actual);

        this.target.loadState(expected);
        actual = this.target.saveState();
        assertEquals('State not loaded properly.', expected, actual);
    },

    testIsRegistered: function() {
        "use strict";

        var target = StockChartX.NumberFormat.registeredFormatters[StockChartX.IntlNumberFormat.className];

        assertNotNull('Formatter is not registered', target);
        assertNotUndefined('Formatter is not registered', target);
        assertInstanceOf('Formatter is not registered properly.', StockChartX.IntlNumberFormat.constructor, target);
    }
});