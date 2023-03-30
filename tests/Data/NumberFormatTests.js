/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

/* global TestCase, StockChartX, assertException, assertEquals, assertNull, assertNotNull, assertUndefined,
          assertInstanceOf */

//noinspection JSUnusedGlobalSymbols, JSHint
NumberFormatTestCase = TestCase('NumberFormatTestCase', {
    setUp: function () {
        "use strict";

        /**
         * @type {StockChartX.NumberFormat}
         */
        this.target = new StockChartX.NumberFormat();
    },

    testClassName: function() {
        "use strict";

        assertEquals('Incorrect class name.', '', StockChartX.NumberFormat.className);
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

        this.target = new StockChartX.NumberFormat('uk');
        assertEquals('Locale is not initialized properly', 'uk', this.target.locale);
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

        this.target = new StockChartX.NumberFormat();
        this.target.loadState(expected);

        assertEquals('Locale is not loaded properly.', expected.locale, this.target.locale);
    },

    testRegister: function() {
        "use strict";

        var expected = {
            'StockChartX.CustomNumberFormat': StockChartX.CustomNumberFormat,
            'StockChartX.IntlNumberFormat': StockChartX.IntlNumberFormat
        };

        assertEquals('Formatters are not registered properly.', expected, StockChartX.NumberFormat.registeredFormatters);
    },

    testDeserializeNullState: function() {
        "use strict";

        assertNull('Deserialize failed.', StockChartX.NumberFormat.deserialize());
        assertNull('Deserialize failed.', StockChartX.NumberFormat.deserialize(null));
    },

    testDeserializeIncorrectState: function() {
        "use strict";

        var target = StockChartX.NumberFormat;

        assertException('An exception must be thrown if class name is not specified.', function() {
            target.deserialize({});
        });
        assertException('An exception must be thrown if class name is not specified.', function() {
            target.deserialize({className: null});
        });
        assertException('An exception must be thrown if class name is not registered.', function() {
            target.deserialize({className: 'MyClass'});
        });
    },

    testDeserializeCustomNumberFormat: function() {
        "use strict";

        var state = {
            className: 'StockChartX.CustomNumberFormat',
            formatString: '%3d',
            locale: 'uk'
        };
        var actual = StockChartX.NumberFormat.deserialize(state);

        assertNotNull('Number format is not deserialized.', actual);
        assertInstanceOf('Custom number format is not deserialized properly.', StockChartX.CustomNumberFormat, actual);
    },

    testDeserializeIntlNumberFormat: function() {
        "use strict";

        var state = {
            className: 'StockChartX.IntlNumberFormat',
            locale: 'uk',
            options: {
                mininumFractionDigits: 3,
                maximumFractionDigits: 5
            }
        };
        var actual = StockChartX.NumberFormat.deserialize(state);

        assertNotNull('InltNumberFormat is not deserialized', actual);
        assertInstanceOf('Intl number format is not deserialized properly.', StockChartX.IntlNumberFormat, actual);
    }
});