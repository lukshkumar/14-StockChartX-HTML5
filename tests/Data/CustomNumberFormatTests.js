/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

/* global TestCase, StockChartX, assertException, assertEquals, assertTrue, assertFalse, assertNotNull,
          assertNotUndefined, assertInstanceOf */

//noinspection JSUnusedGlobalSymbols, JSHint
CustomNumberFormatTestCase = TestCase('CustomNumberFormatTestCase', {
    testClassName: function() {
        "use strict";

        //noinspection JSUnresolvedVariable
        assertEquals('Incorrect class name.', 'StockChartX.CustomNumberFormat', StockChartX.CustomNumberFormat.className);
    },

    testFormatString: function() {
        "use strict";

        var target = new StockChartX.CustomNumberFormat();
        var expected = "%f";
        target.formatString = expected;
        assertEquals('Format string is not set properly.', expected, target.formatString);
    },

    testConstructor: function() {
        "use strict";

        var target = new StockChartX.CustomNumberFormat();
        assertEquals('Format is not initialized properly.', '%f', target.formatString);

        //noinspection JSCheckFunctionSignatures
        target = new StockChartX.CustomNumberFormat(null);
        assertEquals('Format is not initialized properly.', '%f', target.formatString);

        target = new StockChartX.CustomNumberFormat(undefined);
        assertEquals('Format is not initialized properly.', '%f', target.formatString);

        target = new StockChartX.CustomNumberFormat('%d');
        assertEquals('Format is not initialized properly.', '%d', target.formatString);
    },

    testConstructorFail: function() {
        "use strict";

        assertException("An exception should be thrown on attempt to create formatter with incorrect format.", function() {
            //noinspection JSUnusedLocalSymbols,JSHint,JSCheckFunctionSignatures
            var actual = new StockChartX.CustomNumberFormat(12);
        });
        assertException("An exception should be thrown on attempt to create formatter with incorrect format.", function() {
            //noinspection JSUnusedLocalSymbols,JSHint,JSCheckFunctionSignatures
            var actual = new StockChartX.CustomNumberFormat({});
        });
        assertException("An exception should be thrown on attempt to create formatter with incorrect format.", function() {
            //noinspection JSUnusedLocalSymbols,JSHint
            var actual = new StockChartX.CustomNumberFormat("abc");
        });
    },

    testNumberFormatParser: function() {
        "use strict";

        var target = new StockChartX.CustomNumberFormat("%d");
        //noinspection JSAccessibilityCheck
        var actual = target._options;

        assertFalse("Sign is not parsed properly.", actual.sign);
        assertEquals("Padding is not parsed properly.", " ", actual.padding);
        assertFalse("Left alignment is not parsed properly.", actual.alignLeft);
        assertFalse("Width is not parsed properly.", actual.width);
        assertFalse("Precision is not parsed properly.", actual.precision);
        assertEquals("Type is not parsed properly.", "d", actual.type);
    },

    testNumberFormatWithSignParser: function() {
        "use strict";

        var target = new StockChartX.CustomNumberFormat("%+d");
        //noinspection JSAccessibilityCheck
        var actual = target._options;

        assertTrue("Sign is not parsed properly.", actual.sign);
        assertEquals("Padding is not parsed properly.", " ", actual.padding);
        assertFalse("Left alignment is not parsed properly.", actual.alignLeft);
        assertFalse("Width is not parsed properly.", actual.width);
        assertFalse("Precision is not parsed properly.", actual.precision);
        assertEquals("Type is not parsed properly.", "d", actual.type);
    },

    testFloatFormatWithWidthParser: function() {
        "use strict";

        var target = new StockChartX.CustomNumberFormat("%4f");
        //noinspection JSAccessibilityCheck
        var actual = target._options;

        assertFalse("Sign is not parsed properly.", actual.sign);
        assertEquals("Padding is not parsed properly.", " ", actual.padding);
        assertFalse("Left alignment is not parsed properly.", actual.alignLeft);
        assertEquals("Width is not parsed properly.", 4, actual.width);
        assertFalse("Precision is not parsed properly.", actual.precision);
        assertEquals("Type is not parsed properly.", "f", actual.type);
    },

    testFloatFormatWithPaddingParser: function() {
        "use strict";

        var target = new StockChartX.CustomNumberFormat("%04d");
        //noinspection JSAccessibilityCheck
        var actual = target._options;

        assertFalse("Sign is not parsed properly.", actual.sign);
        assertEquals("Padding is not parsed properly.", "0", actual.padding);
        assertFalse("Left alignment is not parsed properly.", actual.alignLeft);
        assertEquals("Width is not parsed properly.", 4, actual.width);
        assertFalse("Precision is not parsed properly.", actual.precision);
        assertEquals("Type is not parsed properly.", "d", actual.type);
    },

    testFloatFormatWithPrecisionParser: function() {
        "use strict";

        var target = new StockChartX.CustomNumberFormat("%5.2f");
        //noinspection JSAccessibilityCheck
        var actual = target._options;

        assertFalse("Sign is not parsed properly.", actual.sign);
        assertEquals("Padding is not parsed properly.", " ", actual.padding);
        assertFalse("Left alignment is not parsed properly.", actual.alignLeft);
        assertEquals("Width is not parsed properly.", 5, actual.width);
        assertEquals("Precision is not parsed properly.", 2, actual.precision);
        assertEquals("Type is not parsed properly.", "f", actual.type);
    },

    testDecimalFormat: function() {
        "use strict";

        var target = new StockChartX.CustomNumberFormat("%d");
        var actual = target.format(2);
        assertEquals("%d format failed.", "2", actual);

        target.formatString = "%3d";
        actual = target.format(2);
        assertEquals("%3d format failed.", "  2", actual);

        target.formatString = "%-3d";
        actual = target.format(2);
        assertEquals("%-3d format failed.", "2  ", actual);

        target.formatString = "%03d";
        actual = target.format(2);
        assertEquals("%03d format failed.", "002", actual);

        target.formatString = "%+03d";
        actual = target.format(2);
        assertEquals("%+03d format failed.", "+002", actual);

        target.formatString = "%+3d";
        actual = target.format(2);
        assertEquals("%+3d format failed.", " +2", actual);

        target.formatString = "%+-3d";
        actual = target.format(2);
        assertEquals("%+-3d format failed.", "+2 ", actual);
    },

    testBinaryFormat: function() {
        "use strict";

        var target = new StockChartX.CustomNumberFormat("%b");
        var actual = target.format(2);
        assertEquals("%b format failed.", "10", actual);

        target.formatString = "%4b";
        actual = target.format(2);
        assertEquals("%4b format failed.", "  10", actual);

        target.formatString = "%-4b";
        actual = target.format(2);
        assertEquals("%-4b format failed.", "10  ", actual);

        target.formatString = "%04b";
        actual = target.format(2);
        assertEquals("%04b format failed.", "0010", actual);

        target.formatString = "%b";
        actual = target.format(-2);
        assertEquals("%b format failed.", "-10", actual);
    },

    testCharacterFormat: function() {
        "use strict";

        var target = new StockChartX.CustomNumberFormat("%c");
        var actual = target.format(65);
        assertEquals("%c format failed.", "A", actual);
    },

    testFloatFormat: function() {
        "use strict";

        var target = new StockChartX.CustomNumberFormat("%f");
        var actual = target.format(2.5);
        assertEquals("%f format failed.", "2.5", actual);

        target.formatString = "%4f";
        actual = target.format(2.5);
        assertEquals("%4f format failed.", " 2.5", actual);

        target.formatString = "%5.2f";
        actual = target.format(2.5);
        assertEquals("%4f format failed.", " 2.50", actual);
    },

    testHexFormat: function() {
        "use strict";

        var target = new StockChartX.CustomNumberFormat("%x");
        var actual = target.format(4);
        assertEquals("%x format failed.", "4", actual);

        target.formatString = "%x";
        actual = target.format(26);
        assertEquals("%x format failed.", "1a", actual);

        target.formatString = "%4x";
        actual = target.format(26);
        assertEquals("%4x format failed.", "  1a", actual);

        target.formatString = "%-4x";
        actual = target.format(26);
        assertEquals("%-4x format failed.", "1a  ", actual);
    },

    testHexUpperCaseFormat: function() {
        "use strict";

        var target = new StockChartX.CustomNumberFormat("%X");
        var actual = target.format(4);
        assertEquals("%X format failed.", "4", actual);

        target.formatString = "%X";
        actual = target.format(26);
        assertEquals("%X format failed.", "1A", actual);

        target.formatString = "%4X";
        actual = target.format(26);
        assertEquals("%4X format failed.", "  1A", actual);

        target.formatString = "%-4X";
        actual = target.format(26);
        assertEquals("%-4X format failed.", "1A  ", actual);
    },

    testExponentialFormat: function() {
        "use strict";

        var target = new StockChartX.CustomNumberFormat("%e");
        var actual = target.format(4);
        assertEquals("%e format failed.", "4e+0", actual);

        target.formatString = "%e";
        actual = target.format(0.126);
        assertEquals("%e format failed.", "1.26e-1", actual);

        target.formatString = "%8e";
        actual = target.format(12.6);
        assertEquals("%8e format failed.", " 1.26e+1", actual);
    },

    testExponentialUpperCaseFormat: function() {
        "use strict";

        var target = new StockChartX.CustomNumberFormat("%E");
        var actual = target.format(4);
        assertEquals("%E format failed.", "4E+0", actual);

        target.formatString = "%E";
        actual = target.format(0.126);
        assertEquals("%E format failed.", "1.26E-1", actual);

        target.formatString = "%8E";
        actual = target.format(12.6);
        assertEquals("%8E format failed.", " 1.26E+1", actual);
    },

    testFloatOrExponentialFormat: function() {
        "use strict";

        var target = new StockChartX.CustomNumberFormat("%g");
        var actual = target.format(4);
        assertEquals("%g format failed.", "4", actual);

        target.formatString = "%5.3g";
        actual = target.format(12345.67);
        assertEquals("%5.3g format failed.", "1.235e+4", actual);
    },

    testSaveState: function() {
        "use strict";

        var expected = "%5.2f";
        var target = new StockChartX.CustomNumberFormat(expected);
        target.locale = 'uk';
        var actual = target.saveState();

        assertNotNull("State not saved.", actual);
        assertEquals("Locale not saved.", 'uk', actual.locale);
        assertEquals("Format string not saved.", expected, actual.formatString);
    },

    testLoadState: function() {
        "use strict";

        var target = new StockChartX.CustomNumberFormat("%5.2f");
        var expected = target.saveState();

        target.formatString = "%d";
        target.locale = 'uk';
        target.loadState(expected);

        assertEquals("State not saved/loaded properly.", expected, target.saveState());
    },

    testIsRegistered: function() {
        "use strict";

        var target = StockChartX.NumberFormat.registeredFormatters[StockChartX.CustomNumberFormat.className];

        assertNotNull('Formatter is not registered', target);
        assertNotUndefined('Formatter is not registered', target);
        assertInstanceOf('Formatter is not registered properly.', StockChartX.CustomNumberFormat.constructor, target);
    }
});