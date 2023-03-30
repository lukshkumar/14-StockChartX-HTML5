/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

/* global TestCase, StockChartX, assertEquals, assertNull, assertNotNull, assertTrue, assertFalse, assertSame,
          assertException, assertNoException, assertInstanceOf, assertObject, assertUndefined, assertNotUndefined */

//noinspection JSUnusedGlobalSymbols,JSHint
DataManagerTestCase = TestCase('DataManagerTestCase', {
    setUp: function() {
        "use strict";

        /**
         * @type {StockChartX.DataManager}
         */
        this.target = new StockChartX.DataManager();
    },

    testDateDataSeries: function() {
        "use strict";

        assertNull('Incorrect date data series found.', this.target.dateDataSeries);

        var expected = this.target.addDataSeries(StockChartX.DataSeriesSuffix.DATE);
        var actual = this.target.dateDataSeries;
        assertSame('Date data series not found', expected, actual);
    },

    testConstructor: function() {
        "use strict";

        //noinspection JSAccessibilityCheck
        assertObject('Data series object is not initialized properly.', this.target._dataSeries);
    },

    testAddDataSeries: function() {
        "use strict";

        var target = this.target;
        assertException('An exception must be thrown on attempt to add data series without name.', function() {
            //noinspection JSCheckFunctionSignatures
            target.addDataSeries();
        });
        assertException('An exception must be thrown on attempt to add data series with empty name.', function() {
            target.addDataSeries('');
        });
        assertException('An exception must be thrown on attempt to add data series with non-string name.', function() {
            //noinspection JSCheckFunctionSignatures
            target.addDataSeries(1);
        });

        var actual = null;
        assertNoException('An exception should not be thrown - name is valid.', function() {
            actual = target.addDataSeries('open');
        });
        assertNotNull('Created data series is not returned.', actual);
        assertInstanceOf('Data series must be an instance of StockChartX.DataSeries.', StockChartX.DataSeries, actual);
        assertNotNull('Data series is not added properly.', this.target.getDataSeries(actual.name));
    },

    testGetDataSeries: function() {
        "use strict";

        assertNull('Non-existing data series should not be found.', this.target.getDataSeries('unknown'));

        var expected = this.target.addDataSeries('aapl.sma(14)');
        assertSame('Incorrect data series found.', expected, this.target.getDataSeries('aapl.sma(14)'));

        var actual = this.target.getDataSeries('unknown', true);
        assertNotNull('Data series not added', actual);
        assertInstanceOf('Incorrect data series returned', StockChartX.DataSeries, actual);
        assertEquals('Incorrect data series returned', 'unknown', actual.name);
    },

    testCreateCommonDataSeries: function() {
        "use strict";

        var actual = this.target.addBarDataSeries();

        ['date', 'open', 'high', 'low', 'close', 'volume'].forEach(function(prop) {
            var name = '.' + prop;
            var actualSeries = actual[prop];

            assertNotNull(name + ' data series is not initialized properly.', actualSeries);
            assertNotUndefined(name + ' data series is not initialized properly.', actualSeries);
            assertInstanceOf(name + ' data series is not initialized properly.', StockChartX.DataSeries, actualSeries);
            assertEquals(name + ' is not a correct data series.', name, actualSeries.name);
        });
    },

    testCreateCommonDataSeriesForSymbol: function() {
        "use strict";

        var actual = this.target.addBarDataSeries('aapl');

        ['date', 'open', 'high', 'low', 'close', 'volume'].forEach(function(prop) {
            var name = 'aapl.' + prop;
            var actualSeries = actual[prop];

            assertNotNull('Common data series are not initialized properly.', actualSeries);
            assertNotUndefined('Common data series are not initialized properly.', actualSeries);
            assertInstanceOf('Common data series are not initialized properly.', StockChartX.DataSeries, actualSeries);
            assertEquals(name + ' is not a correct data series.', name, actualSeries.name);
        });
    },

    testCommonDataSeries: function() {
        "use strict";

        var actual = this.target.barDataSeries();
        ['date', 'open', 'high', 'low', 'close', 'volume'].forEach(function(prop) {
            var name = '.' + prop;

            assertUndefined('Common data series should not be found.', actual[name]);
        });

        this.target.addBarDataSeries();
        actual = this.target.barDataSeries();
        ['date', 'open', 'high', 'low', 'close', 'volume'].forEach(function(prop) {
            var name = '.' + prop;
            var actualSeries = actual[prop];

            assertNotNull(name + ' data series not found.', actualSeries);
            assertNotUndefined(name + ' data series not found.', actualSeries);
            assertInstanceOf(name + ' data series is not initialized properly.', StockChartX.DataSeries, actualSeries);
            assertEquals(name + ' is not a correct data series.', name, actualSeries.name);
        });
    },

    testCommonDataSeriesForSymbol: function() {
        "use strict";

        var actual = this.target.barDataSeries('aapl');
        ['date', 'open', 'high', 'low', 'close', 'volume'].forEach(function(prop) {
            var name = '.' + prop;

            assertUndefined('Common data series should not be found.', actual[name]);
        });

        this.target.addBarDataSeries('aapl');
        actual = this.target.barDataSeries('aapl');
        ['date', 'open', 'high', 'low', 'close', 'volume'].forEach(function(prop) {
            var name = 'aapl.' + prop;
            var actualSeries = actual[prop];

            assertNotNull(name + ' data series not found.', actualSeries);
            assertNotUndefined(name + ' data series not found.', actualSeries);
            assertInstanceOf(name + ' data series is not initialized properly.', StockChartX.DataSeries, actualSeries);
            assertEquals(name + ' is not a correct data series.', name, actualSeries.name);
        });
    },

    testGetOHLCDataSeries: function() {
        "use strict";

        var actual = this.target.ohlcDataSeries();
        ['open', 'high', 'low', 'close'].forEach(function(prop) {
            var name = '.' + prop;

            assertNull(name + ' data series should not be found.', actual[prop]);
        });

        this.target.addBarDataSeries();
        actual = this.target.ohlcDataSeries();
        ['open', 'high', 'low', 'close'].forEach(function(prop) {
            var name = '.' + prop;
            var actualSeries = actual[prop];

            assertNotNull(name + ' data series not found.', actualSeries);
            assertNotUndefined(name + ' data series not found.', actualSeries);
            assertInstanceOf(name + ' data series is not initialized properly.', StockChartX.DataSeries, actualSeries);
            assertEquals(name + ' is not a correct data series.', name, actualSeries.name);
        });
    },

    testGetOHLCDataSeriesForSymbol: function() {
        "use strict";

        var actual = this.target.ohlcDataSeries();
        ['open', 'high', 'low', 'close'].forEach(function(prop) {
            var name = 'aapl.' + prop;

            assertNull(name + ' data series should not be found.', actual[prop]);
        });

        this.target.addBarDataSeries();
        actual = this.target.ohlcDataSeries();

        ['open', 'high', 'low', 'close'].forEach(function(prop) {
            var name = 'aapl.' + prop;

            assertUndefined(name + ' data series should not be found.', actual[name]);
        });

        this.target.addBarDataSeries('aapl');
        actual = this.target.ohlcDataSeries('aapl');
        ['open', 'high', 'low', 'close'].forEach(function(prop) {
            var name = 'aapl.' + prop;
            var actualSeries = actual[prop];

            assertNotNull(name + ' data series not found.', actualSeries);
            assertNotUndefined(name + ' data series not found.', actualSeries);
            assertInstanceOf(name + ' data series is not initialized properly.', StockChartX.DataSeries, actualSeries);
            assertEquals(name + ' is not a correct data series.', name, actualSeries.name);
        });
    }
});


//noinspection JSUnusedGlobalSymbols,JSHint
DataManagerWithCommonDataSeriesTestCase = TestCase('DataManagerWithCommonDataSeriesTestCase', {
    setUp: function() {
        "use strict";

        this.target = new StockChartX.DataManager();
        this.target.addBarDataSeries();
    },

    testDateDataSeries: function() {
        "use strict";

        var actual = this.target.dateDataSeries;

        assertNotNull('Date data series must be found.', actual);
        assertTrue('Incorrect data series found.', actual.isDateDataSeries);
    },

    testFindDataSeries: function() {
        "use strict";

        assertNull('Incorrect data series found.', this.target.findDataSeries('unknown'));

        var actual = this.target.findDataSeries(StockChartX.DataSeriesSuffix.HIGH);
        assertNotNull('Data series must be found.', actual);
        assertEquals('Incorrect data series found.', StockChartX.DataSeriesSuffix.HIGH, actual.name);
    },

    testCommonDataSeries: function() {
        "use strict";

        var actual = this.target.barDataSeries();

        ['date', 'open', 'high', 'low', 'close', 'volume'].forEach(function(prop) {
            assertNotNull('Common data series are not found properly.', actual[prop]);
            assertInstanceOf('Common data series are not found properly.', StockChartX.DataSeries, actual[prop]);
        });
    },

    testOHLCDataSeries: function() {
        "use strict";

        var actual = this.target.ohlcDataSeries();

        ['open', 'high', 'low', 'close'].forEach(function(prop) {
            assertNotNull('Common data series are not found properly.', actual[prop]);
            assertInstanceOf('Common data series are not found properly.', StockChartX.DataSeries, actual[prop]);
        });
    },

    testAddDataSeriesTwice: function() {
        "use strict";

        var target = this.target;

        assertException('An exception should be thrown if data series with the same name already exists.', function() {
            target.addDataSeries(StockChartX.DataSeriesSuffix.OPEN  );
        });
        assertException('An exception should be thrown if data series with the same name already exists.', function() {
            target.addDataSeries(StockChartX.DataSeriesSuffix.OPEN, false);
        });
        assertException('An exception should be thrown if data series with the same name already exists.', function() {
            target.addDataSeries(target.dateDataSeries);
        });
        assertException('An exception should be thrown if data series with the same name already exists.', function() {
            target.addDataSeries(target.dateDataSeries, false);
        });
    },

    testReplaceDataSeries: function() {
        "use strict";

        var target = this.target;
        //noinspection JSCheckFunctionSignatures
        var expected = new StockChartX.DataSeries(StockChartX.DataSeriesSuffix.OPEN);
        var actual = null;

        assertNoException('An exception should not be thrown on attempt to replace data series.', function() {
            actual = target.addDataSeries(expected, true);
        });
        assertSame('Data series is not replaced properly.', expected, target.getDataSeries(StockChartX.DataSeriesSuffix.OPEN));
        assertSame('Incorrect result data series.', expected, actual);

        assertNoException('An exception should not be thrown on attempt to replace data series.', function() {
            actual = target.addDataSeries(StockChartX.DataSeriesSuffix.HIGH, true);
        });
        assertInstanceOf('Data series is not created properly.', StockChartX.DataSeries, actual);
        assertSame('Data series is not replaced properly.', target.getDataSeries(StockChartX.DataSeriesSuffix.HIGH), actual);
    },

    testRemoveDataSeries: function() {
        "use strict";

        this.target.removeDataSeries(StockChartX.DataSeriesSuffix.OPEN);
        assertNull('Data series is not deleted properly.', this.target.findDataSeries(StockChartX.DataSeriesSuffix.OPEN));

        var target = this.target;
        assertNoException('An exception should not be thrown on attempt to remove non-existing data series.', function() {
            target.removeDataSeries('open');
            //noinspection JSCheckFunctionSignatures
            target.removeDataSeries(1);
        });
    },

    testRemoveAllDataSeries: function() {
        "use strict";

        this.target.removeDataSeries();

        //noinspection JSAccessibilityCheck,JSUnusedLocalSymbols,LoopStatementThatDoesntLoopJS,JSHint
        for (var prop in this.target._dataSeries) {
            assertFalse("Data series are not removed properly.", true);
            break;
        }
    },

    testClearDataSeries: function() {
        "use strict";

        var target = this.target;

        assertNoException('An exception should not be thrown if data series does not exist.', function() {
            target.clearDataSeries('unknown');
        });

        var dsObj = this.target.barDataSeries();
        dsObj.date.add(1);
        dsObj.open.add(2);
        this.target.clearDataSeries(dsObj.open);
        assertEquals('Data series is not cleared properly.', 0, dsObj.open.length);
        assertEquals('Too many data series are cleared.', 1, dsObj.date.length);

        dsObj.open.add(1);
        this.target.clearDataSeries(dsObj.open.name);
        assertEquals('Data series is not cleared properly.', 0, dsObj.open.length);
        assertEquals('Too many data series are cleared.', 1, dsObj.date.length);

        dsObj.open.add(1);
        this.target.clearDataSeries();
        assertEquals('Data series is not cleared properly.', 0, dsObj.date.length);
        assertEquals('Data series is not cleared properly.', 0, dsObj.open.length);
    },

    testAppendBar: function() {
        "use strict";

        var bar = {
            date: 1,
            open: 2,
            high: 3,
            low: 4,
            close: 5,
            volume: 6
        };
        //noinspection JSCheckFunctionSignatures
        this.target.appendBars(bar);

        var actual = this.target.barDataSeries();
        assertEquals('Bar is not added properly.', [1], actual.date.values);
        assertEquals('Bar is not added properly.', [2], actual.open.values);
        assertEquals('Bar is not added properly.', [3], actual.high.values);
        assertEquals('Bar is not added properly.', [4], actual.low.values);
        assertEquals('Bar is not added properly.', [5], actual.close.values);
        assertEquals('Bar is not added properly.', [6], actual.volume.values);
    },

    testAppendBars: function() {
        "use strict";

        var bars = [
            {
                date: 1,
                open: 2,
                high: 3,
                low: 4,
                close: 5,
                volume: 6
            },
            {
                date: 7,
                open: 8,
                high: 9,
                low: 10,
                close: 11,
                volume: 12
            }
        ];
        //noinspection JSCheckFunctionSignatures
        this.target.appendBars(bars);

        var actual = this.target.barDataSeries();
        assertEquals('Bar is not added properly.', [1, 7], actual.date.values);
        assertEquals('Bar is not added properly.', [2, 8], actual.open.values);
        assertEquals('Bar is not added properly.', [3, 9], actual.high.values);
        assertEquals('Bar is not added properly.', [4, 10], actual.low.values);
        assertEquals('Bar is not added properly.', [5, 11], actual.close.values);
        assertEquals('Bar is not added properly.', [6, 12], actual.volume.values);
    },

    testGetBar: function() {
        "use strict";

        var expected = [
            {
                date: 1,
                open: 2,
                high: 3,
                low: 4,
                close: 5,
                volume: 6
            },
            {
                date: 7,
                open: 8,
                high: 9,
                low: 10,
                close: 11,
                volume: 12
            }
        ];
        //noinspection JSCheckFunctionSignatures
        this.target.appendBars(expected);

        assertEquals('Incorrect bar returned.', expected[0], this.target.bar(0));
        assertEquals('Incorrect bar returned.', expected[1], this.target.bar(1));

        expected = {
            date: null,
            open: null,
            high: null,
            low: null,
            close: null,
            volume: null
        };
        assertEquals('Incorrect bar returned.', expected, this.target.bar(2));
    },

    testTrim: function() {
        "use strict";

        var bar = {
            date: 1,
            open: 2,
            high: 3,
            low: 4,
            close: 5,
            volume: 6
        };
        //noinspection JSCheckFunctionSignatures
        this.target.appendBars(bar);
        this.target.trimDataSeries(2);

        var series = this.target.barDataSeries();
        assertEquals("Trim is not performed properly.", 1, series.date.length);
        assertEquals("Trim is not performed properly.", 1, series.open.length);
        assertEquals("Trim is not performed properly.", 1, series.high.length);
        assertEquals("Trim is not performed properly.", 1, series.low.length);
        assertEquals("Trim is not performed properly.", 1, series.close.length);
        assertEquals("Trim is not performed properly.", 1, series.volume.length);

        bar = {
            date: 7,
                open: 8,
            high: 9,
            low: 10,
            close: 11,
            volume: 12
        };
        //noinspection JSCheckFunctionSignatures
        this.target.appendBars(bar);
        this.target.trimDataSeries(1);
        series = this.target.barDataSeries();
        assertEquals("Trim is not performed properly.", 1, series.date.length);
        assertEquals("Trim is not performed properly.", 1, series.open.length);
        assertEquals("Trim is not performed properly.", 1, series.high.length);
        assertEquals("Trim is not performed properly.", 1, series.low.length);
        assertEquals("Trim is not performed properly.", 1, series.close.length);
        assertEquals("Trim is not performed properly.", 1, series.volume.length);
        assertEquals('Trim is not performed properly', bar, this.target.bar(0));
    }
});