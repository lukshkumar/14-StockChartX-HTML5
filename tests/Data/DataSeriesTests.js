/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

/* global TestCase, StockChartX, assertEquals, assertTrue, assertFalse, assertNull, assertUndefined, assertSame,
          assertException, assertArray */

//noinspection JSUnusedGlobalSymbols,JSHint
DataSeriesTestCase = TestCase('DataSeriesTestCase', {
    setUp: function() {
        "use strict";

        /**
         * @type {StockChartX.DataSeries}
         */
        this.target = new StockChartX.DataSeries({
            name: 'AAPL' + StockChartX.DataSeriesSuffix.OPEN,
            values: [1, null, 3, null, 7, 5, 4]
        });
    },

    testName: function() {
        "use strict";

        var expected = "new name";
        this.target.name = expected;

        assertEquals('Name is not set properly.', expected, this.target.name);

        this.target.name = null;
        assertEquals('Name is not set properly.', '', this.target.name);

        this.target.name = undefined;
        assertEquals('Name is not set properly.', '', this.target.name);
    },

    testValues: function() {
        "use strict";

        var expected = [1, 2, 3];
        var target = this.target;
        target.values = expected;
        assertSame('Values are not set properly.', expected, target.values);
        
        assertException('An exception is not thrown on attempt to assign non-array value.', function() {
            target.values = null;
        });
        assertException('An exception is not thrown on attempt to assign non-array value.', function() {
            target.values = 2;
        });
    },

    testEmptyConstructor: function() {
        "use strict";

        var target = new StockChartX.DataSeries();

        assertEquals('Name is not an empty string after creating.', '', target.name);
        assertArray('Values array is not initialized properly.', target.values);
        assertEquals('Values array must be empty.', 0, target.length);
    },

    testInvalidConstructor: function() {
        "use strict";

        assertException('An exception must be thrown on attempt to create DataSeries with invalid config.', function() {
            //noinspection JSCheckFunctionSignatures
            new StockChartX.DataSeries(1);
        });
    },

    testConstructor: function() {
        "use strict";

        assertEquals('Name is not initialized properly.', 'AAPL.open', this.target.name);
        assertEquals('Values are not initialized properly.', 7, this.target.length);
    },

    testLength: function() {
        "use strict";

        assertEquals('Incorrect length.', 7, this.target.length);
    },

    testNameSuffix: function() {
        "use strict";

        assertEquals('Name suffix is not extracted properly.', '.open', this.target.nameSuffix);

        this.target.name = '';
        assertNull('Name suffix is not extracted properly.', this.target.nameSuffix);

        this.target.name = 'test';
        assertNull('Name suffix is not extracted properly.', this.target.nameSuffix);

        this.target.name = 'aapl.cfd.open';
        assertEquals('Name suffix is not extracted properly.', '.open', this.target.nameSuffix);
    },

    testIsValueDataSeries: function() {
        "use strict";

        assertTrue('Open is a value data series.', this.target.isValueDataSeries);

        this.target.name = StockChartX.DataSeriesSuffix.DATE;
        assertFalse('Date is not a value data series.', this.target.isValueDataSeries);
    },

    testIsDateDataSeries: function() {
        "use strict";

        assertFalse('Open is not a date data series.', this.target.isDateDataSeries);

        this.target.name = StockChartX.DataSeriesSuffix.DATE;
        assertTrue('Date is a date data series.', this.target.isDateDataSeries);
    },
    
    testFirstValue: function() {
        "use strict";

        assertEquals('First value is not extracted properly.', 1, this.target.firstValue);

        this.target.values = [];
        assertUndefined('First value is not extracted properly.', this.target.firstValue);
    },

    testLastValue: function() {
        "use strict";
        assertEquals('Last value is not extracted properly.', 4, this.target.lastValue);

        this.target.values = [];
        assertNull('Last value is not extracted properly.', this.target.lastValue);
    },

    testGetValueAtIndex: function() {
        "use strict";

        assertEquals('Value at index is not extracted properly.', 1, this.target.valueAtIndex(0));
        assertEquals('Value at index is not extracted properly.', 3, this.target.valueAtIndex(2));
        assertEquals('Value at index is not extracted properly.', 5, this.target.valueAtIndex(5));
        assertUndefined('Value at index is not extracted properly.', this.target.valueAtIndex(10));
    },

    testSetValueAtIndex: function() {
        "use strict";

        this.target.valueAtIndex(0, 2);
        assertEquals('Value is not set properly.', 2, this.target.valueAtIndex(0));
    },

    testItemsCountBetweenValues: function() {
        "use strict";

        assertEquals('Incorrect items count value.', 1, this.target.itemsCountBetweenValues(0, 2));
        assertEquals('Incorrect items count value.', 4, this.target.itemsCountBetweenValues(1, 5));
        assertEquals('Incorrect items count value.', 3, this.target.itemsCountBetweenValues(4, 10));
    },

    testAdd: function() {
        "use strict";

        this.target.add(12);
        assertEquals('Value is not added properly.', 12, this.target.lastValue);

        this.target.values = [1];
        this.target.add([9, 10]);
        assertEquals('Values are not added properly.', [1, 9, 10], this.target.values);
    },

    testUpdateLast: function() {
        "use strict";

        this.target.updateLast(13);
        assertEquals('Last value is not updated.', 13, this.target.lastValue);
    },

    testClear: function() {
        "use strict";

        this.target.clear();

        assertEquals('Values are not cleared.', 0, this.target.length);
    },

    testMinMaxValues: function() {
        "use strict";

        var expected = {
            min: 1,
            max: 7
        };
        assertEquals('Incorrect min/max values.', expected, this.target.minMaxValues());

        expected = {
            min: 1,
            max: 1
        };
        assertEquals('Incorrect min/max values.', expected, this.target.minMaxValues(-1, 1));

        expected = {
            min: 4,
            max: 7
        };
        assertEquals('Incorrect min/max values.', expected, this.target.minMaxValues(3, 7));
    },

    testFloorIndex: function() {
        "use strict";

        this.target.values = [1, 2, 3, 5, 7, 8, 12];
        assertEquals('Incorrect floor index.', -1, this.target.floorIndex(0));
        assertEquals('Incorrect floor index.', 0, this.target.floorIndex(1));
        assertEquals('Incorrect floor index.', 1, this.target.floorIndex(2));
        assertEquals('Incorrect floor index.', 2, this.target.floorIndex(4));
        assertEquals('Incorrect floor index.', 6, this.target.floorIndex(14));
    },

    testCeilIndex: function() {
        "use strict";

        this.target.values = [1, 2, 3, 5, 7, 8, 12];
        assertEquals('Incorrect ceil index.', 0, this.target.ceilIndex(0));
        assertEquals('Incorrect ceil index.', 0, this.target.ceilIndex(1));
        assertEquals('Incorrect ceil index.', 1, this.target.ceilIndex(2));
        assertEquals('Incorrect ceil index.', 3, this.target.ceilIndex(4));
        assertEquals('Incorrect ceil index.', 7, this.target.ceilIndex(14));
    },

    testLeftNearestVisibleValueIndex: function() {
        "use strict";

        assertEquals('Incorrect left nearest visible value index.', 0, this.target.leftNearestVisibleValueIndex(0));
        assertEquals('Incorrect left nearest visible value index.', 0, this.target.leftNearestVisibleValueIndex(1));
        assertEquals('Incorrect left nearest visible value index.', 2, this.target.leftNearestVisibleValueIndex(2));
        assertEquals('Incorrect left nearest visible value index.', 6, this.target.leftNearestVisibleValueIndex(10));
    },

    testToField: function() {
        "use strict";

        this.target.values = [1, 2, 3];
        var field = this.target.toField('open');

        assertEquals('Field name is not set properly.', 'open', field.name);
        assertEquals('Field values are not set properly.', 3, field.recordCount);
        assertEquals('Field values are not set properly.', [0, 1, 2, 3, 0], field._m_values);
    },

    testFromField: function() {
        "use strict";

        this.target.values = [1, 2, 3];
        var field = this.target.toField('Open');
        this.target.values = [];
        this.target.fromField(field, 1);

        assertEquals('Values are not copied properly from field.', [1, 2, 3], this.target.values);
    },

    testTrim: function() {
        "use strict";

        var expected = [1];
        this.target.values = [].concat(expected);
        this.target.trim(5);
        assertEquals('Trim should not be performed if number of values is less than maximum count.',
            expected, this.target.values);

        expected = [1, 2];
        this.target.values = [].concat(expected);
        this.target.trim(2);
        assertEquals('Trim should not be performed if number of values equals to maximum count.',
            expected, this.target.values);

        this.target.values = [1, 2, 3];
        this.target.trim(2);
        assertEquals('Values are not trimmed properly.', [2, 3], this.target.values);

        this.target.values = [1, 2, 3, 4];
        this.target.trim(2);
        assertEquals('Values are not trimmed properly.', [3, 4], this.target.values);
    }
});