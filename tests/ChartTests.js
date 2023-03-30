/**
 * Copyright Modulus Financial Engineering, Inc. Scottsdale, AZ http://www.modulusfe.com
 */

/* global StockChartX, assertEquals, assertException, assertNoException, assertSame, assertNotNull, assertInstanceOf */

//noinspection JSUnusedGlobalSymbols,JSHint
ChartConstructorTestCase = TestCase('ChartConstructorTestCase', {
    setUp: function() {
        "use strict";

        $.fn.scxToolbar = function(){};
    },

    testInvalidConstructors: function() {
        "use strict";

        assertException("An exception should be thrown on attempt to create chart without configuration.", function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.Chart();
        });
        assertException("An exception should be thrown on attempt to create chart with invalid configuration.", function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.Chart('');
        });
        assertException("An exception should be thrown if container is not specified.", function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.Chart({
                width: 10,
                height: 10
            });
        });
        assertException("An exception should be thrown if container is not found.", function() {
            new StockChartX.Chart({ // jshint ignore:line
                width: 10,
                height: 10,
                container: 'unknown'
            });
        });
        assertException("An exception should be thrown if width is negative number.", function() {
            new StockChartX.Chart({ // jshint ignore:line
                width: -10,
                height: 10,
                container: 'body'
            });
        });
        assertException("An exception should be thrown if height is negative number.", function() {
            new StockChartX.Chart({ // jshint ignore:line
                width: 10,
                height: -10,
                container: 'body'
            });
        });
    },

    testMinimalConstructor: function() {
        "use strict";

        var target = new StockChartX.Chart({
            container: 'body'
        });

        assertEquals('Width is not initialized properly.', 800, target.size.width);
        assertEquals('Height is not initialized properly.', 600, target.size.height);
        assertEquals("Time interval is not initialized properly.", StockChartX.TimeSpan.MILLISECONDS_IN_MINUTE, target.timeInterval);
    }
});

//noinspection JSUnusedGlobalSymbols,JSHint
ChartTestCase = TestCase('ChartTestCase', {
    setUp: function() {
        "use strict";

        this.target = new StockChartX.Chart({
            container: 'body',
            width: 100,
            height: 100,
            timeInterval: StockChartX.MILLISECONDS_IN_DAY
        });
    },

    testConstructor: function() {
        "use strict";

        assertEquals("Chart container is not initialized properly.", $('body'), this.target.container);
        assertEquals("Size is not initialized properly.", {width: 100, height: 100}, this.target.size);
        assertNotNull("Data manager is not initialized properly.", this.target.dataManager);
        assertInstanceOf("Data manager is not initialized properly.", StockChartX.DataManager, this.target.dataManager);
        assertNotNull("Date scale is not initialized properly.", this.target.dateScale);
        assertInstanceOf("Date scale is not initialized properly.", StockChartX.DateScale, this.target.dateScale);
        assertNotNull("Value scale is not initialized properly.", this.target.valueScale);
        assertInstanceOf("Value scale is not initialized properly.", StockChartX.ValueScale, this.target.valueScale);
        assertNotNull("Chart panels container is not initialized properly.", this.target.chartPanelsContainer);
        assertInstanceOf("Chart panels container is not initialized properly.", StockChartX.ChartPanelsContainer, this.target.chartPanelsContainer);
        assertEquals("Time interval is not initialized properly.", StockChartX.TimeSpan.MILLISECONDS_IN_MINUTE, this.target.timeInterval);
        assertEquals("Indicators are not initialized properly.", [], this.target.indicators);

        var actual = this.target.barDataSeries();
        ['date', 'open', 'high', 'low', 'close', 'volume'].forEach(function(prop) {
            assertNotNull('Common data series are not initialized properly.', actual[prop]);
            assertInstanceOf('Date is not a data series.', StockChartX.DataSeries, actual[prop]);
        });
    },

    testTimeInterval: function() {
        "use strict";

        var expected = 15;
        this.target.timeInterval = expected;

        assertEquals("Time interval is not set properly.", expected, this.target.timeInterval);

        var target = this.target;
        assertException("An exception must be thrown if time interval is negative.", function() {
            target.timeInterval = -1;
        });
        assertException("An exception must be thrown if time interval is not a number.", function() {
            target.timeInterval = {};
        });
    },

    testInstrument: function() {
        "use strict";

        var expected = {
            symbol: "QQQ"
        };
        this.target.instrument = expected;

        assertSame("Instrument is not set properly.", expected, this.target.instrument);
    },

    testAddTAIndicator: function() {
        "use strict";

        var expected = RelativeStrengthIndex; // jshint ignore:line
        var target = this.target;
        var actual = null;

        assertNoException("An exception should not be thrown on attempt to add TA indicator.", function() {
            actual = target.addIndicators(expected);
        });
        assertEquals("Indicator is not added properly.", 1, target.indicators.length);
        assertInstanceOf("Indicator is not added properly.", StockChartX.Indicator, target.indicators[0]);
        assertEquals("Indicator is not added properly.", expected, target.indicators[0].taIndicator);
        assertSame("Added indicator is not returned.", target.indicators[0], actual);
    },

    testAddTAIndicators: function() {
        "use strict";

        var expected = [RelativeStrengthIndex, SimpleMovingAverage]; // jshint ignore:line
        var target = this.target;
        var actual = null;

        assertNoException("An exception should not be thrown on attempt to add several TA indicators.", function() {
            actual = target.addIndicators(expected);
        });
        assertEquals("Indicators are not added properly.", expected.length, target.indicators.length);
        target.indicators.forEach(function(item) {
            assertInstanceOf("Indicators are not added properly.", StockChartX.Indicator, item);
        });
        for (var i = 0; i < expected.length; i++) {
            assertEquals("Indicators are not added properly.", expected[i], target.indicators[i].taIndicator);
        }
        assertEquals("Added indicators are not returned properly.", target.indicators, actual);
    },

    testAddIndicator: function() {
        "use strict";

        var expected = new StockChartX.Indicator({taIndicator: RelativeStrengthIndex}); // jshint ignore:line
        var target = this.target;
        var actual = null;

        assertNoException("An exception should not be thrown on attempt to add indicator.", function() {
            actual = target.addIndicators(expected);
        });
        assertEquals("Indicator is not added properly.", [expected], target.indicators);
        assertSame("Added indicator is not returned properly.", expected, actual);
    },

    testAddIndicators: function() {
        "use strict";

        var expected = [
            new StockChartX.Indicator({taIndicator: RelativeStrengthIndex}), // jshint ignore:line
            new StockChartX.Indicator({taIndicator: SimpleMovingAverage}) // jshint ignore:line
        ];
        var target = this.target;
        var actual = null;

        assertNoException("An exception should not be thrown on attempt to add indicator.", function() {
            actual = target.addIndicators(expected);
        });
        assertEquals("Indicator is not added properly.", expected, target.indicators);
        assertEquals("Added indicators are not returned properly.", expected, actual);
    },

    testRemoveIndicator: function() {
        "use strict";

        var indicators = this.target.addIndicators([RelativeStrengthIndex, SimpleMovingAverage]); // jshint ignore:line

        this.target.removeIndicators(indicators[0]);
        assertEquals("Indicator is not removed properly.", [indicators[1]], this.target.indicators);

        this.target.removeIndicators(indicators[1]);
        assertEquals("Indicator is not removed properly.", [], this.target.indicators);
    },

    testRemoveIndicators: function() {
        "use strict";

        this.target.addIndicators([RelativeStrengthIndex, SimpleMovingAverage]); // jshint ignore:line
        this.target.removeIndicators();
        assertEquals("Indicators are not removed properly.", [], this.target.indicators);
    }
});