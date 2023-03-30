/**
 * Copyright Modulus Financial Engineering, Inc. Scottsdale, AZ http://www.modulusfe.com
 */

/* global StockChartX, assertEquals, assertException */

//noinspection JSUnusedGlobalSymbols, JSHint
AutoDateScaleCalibratorTestCase = TestCase('AutoDateScaleCalibratorTestCase', {
    setUp: function() {
        "use strict";

        /**
         * @type {StockChartX.AutoDateScaleCalibrator}
         */
        this.target = new StockChartX.AutoDateScaleCalibrator();
    },

    testClassName: function() {
        "use strict";

        //noinspection JSUnresolvedVariable
        assertEquals('Class name is not valid.', 'StockChartX.AutoDateScaleCalibrator', StockChartX.AutoDateScaleCalibrator.className);
    },

    testConstructor: function() {
        "use strict";

        assertEquals('Min labels offset is not initialized properly.', 30, this.target.minLabelsOffset);
    },

    testMinLabelsOffset: function() {
        "use strict";

        var expected = 3;
        this.target.minLabelsOffset = expected;

        assertEquals("Min labels offset is not set properly.", expected, this.target.minLabelsOffset);

        var target = this.target;
        assertException("An exception should be thrown if min labels offset is incorrect.", function() {
            target.minLabelsOffset = null;
        });
        assertException("An exception should be thrown if min labels offset is incorrect.", function() {
            target.minLabelsOffset = '';
        });
        assertException("An exception should be thrown if min labels offset is incorrect.", function() {
            target.minLabelsOffset = -1;
        });
    },

    testSaveState: function() {
        "use strict";

        this.target.minLabelsOffset = 10;

        var expected = {
            className: 'StockChartX.AutoDateScaleCalibrator',
            options: {
                minLabelsOffset: 10
            }
        };
        var actual = this.target.saveState();

        assertEquals('State is not saved properly.', expected, actual);
    },

    testLoadState: function() {
        "use strict";

        var expected = {
            className: 'StockChartX.AutoDateScaleCalibrator',
            options: {
                minLabelsOffset: 10
            }
        };
        this.target.loadState(expected);

        assertEquals('State is not loaded properly.', expected.options.minLabelsOffset, this.target.minLabelsOffset);
    }
});