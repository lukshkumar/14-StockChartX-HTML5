/**
 * Created by Tolya on 09.07.2014.
 */

/* global StockChartX, assertEquals, assertNull, assertNotNull, assertException, assertNoException, assertSame, assertInstanceOf */

//noinspection JSUnusedGlobalSymbols,JSHint
ChartExtensionsTestCase = TestCase('ChartExtensionsTestCase', {
    setUp: function() {
        "use strict";

        this.target = new StockChartX.Chart({
            container: 'body',
            width: 100,
            height: 100,
            showToolbar: false
        });
    },

    testGetCommonDataSeries: function() {
        "use strict";

        var actual = this.target.barDataSeries();
        ['date', 'open', 'high', 'low', 'close', 'volume'].forEach(function(prop) {
            assertNotNull('Common data series are not found properly.', actual[prop]);
            assertInstanceOf('Common data series are not found properly.', StockChartX.DataSeries, actual[prop]);
        });
    },

    testAddDataSeriesTwice: function() {
        "use strict";

        var target = this.target;

        assertException('An exception should be thrown if data series with the same name already exists.', function() {
            target.addDataSeries(StockChartX.DataSeriesSuffix.OPEN);
        });
        assertException('An exception should be thrown if data series with the same name already exists.', function() {
            target.addDataSeries(StockChartX.DataSeriesSuffix.OPEN, false);
        });
        assertException('An exception should be thrown if data series with the same name already exists.', function() {
            target.addDataSeries(target.dataManager.dateDataSeries);
        });
        assertException('An exception should be thrown if data series with the same name already exists.', function() {
            target.addDataSeries(target.dataManager.dateDataSeries, false);
        });
    },

    testReplaceDataSeries: function() {
        "use strict";

        var target = this.target;
        var expected = new StockChartX.DataSeries(StockChartX.DataSeriesSuffix.OPEN);
        var actual = null;

        assertNoException('An exception should not be thrown on attempt to replace data series.', function() {
            actual = target.addDataSeries(expected, true);
        });
        assertSame('Data series is not replaced properly.', expected, target.dataManager.getDataSeries(StockChartX.DataSeriesSuffix.OPEN));
        assertSame('Incorrect result data series.', expected, actual);

        assertNoException('An exception should not be thrown on attempt to replace data series.', function() {
            actual = target.addDataSeries(StockChartX.DataSeriesSuffix.HIGH, true);
        });
        assertInstanceOf('Data series is not created properly.', StockChartX.DataSeries, actual);
        assertSame('Data series is not replaced properly.', target.dataManager.getDataSeries(StockChartX.DataSeriesSuffix.HIGH), actual);
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
            //noinspection JSCheckFunctionSignatures
            actual = target.addDataSeries('sma');
        });
        assertNotNull('Created data series is not returned.', actual);
        assertInstanceOf('Data series must be an instance of StockChartX.DataSeries.', StockChartX.DataSeries, actual);
        assertSame('Data series is not added properly.', this.target.dataManager.getDataSeries(actual.name), actual);
    },

    testGetDataSeries: function() {
        "use strict";

        assertNull('Non-existing data series should not be found.', this.target.getDataSeries('unknown'));

        assertNotNull('Incorrect data series found.', this.target.getDataSeries('.date'));
        assertEquals('Incorrect data series found.', '.date', this.target.getDataSeries('.date').name);
    },

    testFindDataSeries: function() {
        "use strict";

        assertNull('Incorrect data series found.', this.target.findDataSeries('unknown'));

        var actual = this.target.findDataSeries(StockChartX.DataSeriesSuffix.HIGH);
        assertNotNull('Data series must be found.', actual);
        assertEquals('Incorrect data series found.', StockChartX.DataSeriesSuffix.HIGH, actual.name);
    }
});