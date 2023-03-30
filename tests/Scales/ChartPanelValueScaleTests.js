/**
 * Copyright Modulus Financial Engineering, Inc. Scottsdale, AZ http://www.modulusfe.com
 */

/* global StockChartX, assertEquals, assertException, assertNotNull, assertNaN */

//noinspection JSUnusedGlobalSymbols,JSHint
ChartPanelValueScaleTestCase = TestCase('ChartPanelValueScaleTestCase', {
    setUp: function() {
        "use strict";

        var chart = new StockChartX.Chart({container: 'body', showToolbar: false});
        this.target = new StockChartX.ChartPanelValueScale({
            chartPanel: chart.chartPanelsContainer.panels[0]
        });
    },

    testInvalidConfig: function() {
        "use strict";

        assertException("An exception must be thrown if config is not specified.", function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.ChartPanelValueScale();
        });
        assertException("An exception must be thrown if panel is not specified.", function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.ChartPanelValueScale({});
        });
        assertException("An exception must be thrown if panel is not specified.", function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.ChartPanelValueScale({
                chartPanel: 1
            });
        });
    },

    testConstructor: function() {
        "use strict";

        assertNotNull("Panel is not initialized.", this.target.chartPanel);
        assertNaN("Min visible value is not initialized properly.", this.target.minVisibleValue);
        assertNaN("Max visible value is not initialized properly.", this.target.maxVisibleValue);
    },

    testMinVisibleValue: function() {
        "use strict";

        var expected = 10;
        this.target.minVisibleValue = expected;

        assertEquals("Min visible value is not set properly.", expected, this.target.minVisibleValue);

        var target = this.target;
        assertException("An exception should be thrown if value is not a number.", function() {
            target.minVisibleValue = null;
        });
        assertException("An exception should be thrown if value is not a number.", function() {
            target.minVisibleValue = '';
        });
    },

    testMaxVisibleValue: function() {
        "use strict";

        var expected = 10;
        this.target.maxVisibleValue = expected;

        assertEquals("Max visible value is not set properly.", expected, this.target.maxVisibleValue);

        var target = this.target;
        assertException("An exception should be thrown if value is not a number.", function() {
            target.maxVisibleValue = null;
        });
        assertException("An exception should be thrown if value is not a number.", function() {
            target.maxVisibleValue = '';
        });
    },

    testMinAllowedValue: function() {
        "use strict";

        var expected = 150;
        this.target.minAllowedValue = expected;

        assertEquals("Min allowed value is not set properly.", expected, this.target.minAllowedValue);

        var target = this.target;
        assertException("An exception should be thrown if value is not a number.", function() {
            target.minAllowedValue = null;
        });
        assertException("An exception should be thrown if value is not a number.", function() {
            target.minAllowedValue = '1';
        });
    },

    testMaxAllowedValue: function() {
        "use strict";

        var expected = 150;
        this.target.maxAllowedValue = expected;

        assertEquals("Max allowed value is not set properly.", expected, this.target.maxAllowedValue);

        var target = this.target;
        assertException("An exception should be thrown if value is not a number.", function() {
            target.maxAllowedValue = null;
        });
        assertException("An exception should be thrown if value is not a number.", function() {
            target.maxAllowedValue = '1';
        });
    },

    testMinAllowedValueRatio: function() {
        "use strict";

        var expected = 1.5;
        this.target.minAllowedValueRatio = expected;

        assertEquals("Min allowed value ratio is not set properly.", expected, this.target.minAllowedValueRatio);

        var target = this.target;
        assertException("An exception should be thrown if value is not a number.", function() {
            target.minAllowedValueRatio = null;
        });
        assertException("An exception should be thrown if value is not a number.", function() {
            target.minAllowedValueRatio = '1';
        });
        assertException("An exception should be thrown if value is infinity.", function() {
            target.minAllowedValueRatio = Infinity;
        });
        assertException("An exception should be thrown if value is infinity.", function() {
            target.minAllowedValueRatio = -Infinity;
        });
        assertException("An exception should be thrown if value is negative number.", function() {
            target.minAllowedValueRatio = -1;
        });
    },

    testMaxAllowedValueRatio: function() {
        "use strict";

        var expected = 1.5;
        this.target.maxAllowedValueRatio = expected;

        assertEquals("Max allowed value ratio is not set properly.", expected, this.target.maxAllowedValueRatio);

        var target = this.target;
        assertException("An exception should be thrown if value is not a number.", function() {
            target.maxAllowedValueRatio = null;
        });
        assertException("An exception should be thrown if value is not a number.", function() {
            target.maxAllowedValueRatio = '1';
        });
        assertException("An exception should be thrown if value is infinity.", function() {
            target.maxAllowedValueRatio = Infinity;
        });
        assertException("An exception should be thrown if value is infinity.", function() {
            target.maxAllowedValueRatio = -Infinity;
        });
        assertException("An exception should be thrown if value is negative number.", function() {
            target.maxAllowedValueRatio = -1;
        });
    },

    testMinValueRangeRatio: function() {
        "use strict";

        var expected = 0.5;
        this.target.minValueRangeRatio = expected;

        assertEquals("Min value range ratio is not set properly.", expected, this.target.minValueRangeRatio);

        var target = this.target;
        assertException("An exception should be thrown if value is not a number.", function() {
            target.minValueRangeRatio = null;
        });
        assertException("An exception should be thrown if value is not a number.", function() {
            target.minValueRangeRatio = '';
        });
        assertException("An exception should be thrown if value is 0.", function() {
            target.minValueRangeRatio = 0;
        });
        assertException("An exception should be thrown if value is negative number.", function() {
            target.minValueRangeRatio = -1;
        });
        assertException("An exception should be thrown if value is greater than 1.", function() {
            target.minValueRangeRatio = 1.1;
        });
    },

    testMaxValueRangeRatio: function() {
        "use strict";

        var expected = 1.5;
        this.target.maxValueRangeRatio = expected;

        assertEquals("Max value range ratio is not set properly.", expected, this.target.maxValueRangeRatio);

        var target = this.target;
        assertException("An exception should be thrown if value is not a number.", function() {
            target.maxValueRangeRatio = null;
        });
        assertException("An exception should be thrown if value is not a number.", function() {
            target.maxValueRangeRatio = '';
        });
        assertException("An exception should be thrown if value is infinity.", function() {
            target.maxValueRangeRatio = Infinity;
        });
        assertException("An exception should be thrown if value is less than 1.", function() {
            target.maxValueRangeRatio = 0.8;
        });
    },

    testNeedsAutoScale: function() {
        "use strict";

        this.target.setNeedsAutoScale();

        assertNaN("Min value is not set to NaN for auto scale.", this.target.minVisibleValue);
        assertNaN("Max value is not set to NaN for auto scale.", this.target.maxVisibleValue);
    }
});