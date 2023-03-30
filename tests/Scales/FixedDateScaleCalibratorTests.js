/**
 * Copyright Modulus Financial Engineering, Inc. Scottsdale, AZ http://www.modulusfe.com
 */

/* global StockChartX, assertEquals */

//noinspection JSUnusedGlobalSymbols, JSHint
FixedDateScaleCalibratorTestCase = TestCase('FixedDateScaleCalibratorTestCase', {
    setUp: function() {
        "use strict";

        /**
         * @type {StockChartX.FixedDateScaleCalibrator}
         */
        this.target = new StockChartX.FixedDateScaleCalibrator();
    },

    testClassName: function() {
        "use strict";

        //noinspection JSUnresolvedVariable
        assertEquals('Class name is not valid.', 'StockChartX.FixedDateScaleCalibrator', StockChartX.FixedDateScaleCalibrator.className);
    },

    testConstructor: function() {
        "use strict";

        assertEquals('Labels count is not initialized properly.', 3, this.target.labelsCount);
    },

    testSaveState: function() {
        "use strict";

        this.target.labelsCount = 10;

        var expected = {
            className: 'StockChartX.FixedDateScaleCalibrator',
            options: {
                labelsCount: 10
            }
        };
        var actual = this.target.saveState();

        assertEquals('State is not saved properly.', expected, actual);
    },

    testLoadState: function() {
        "use strict";

        var expected = {
            className: 'StockChartX.FixedDateScaleCalibrator',
            options: {
                labelsCount: 10
            }
        };
        this.target.loadState(expected);

        assertEquals('State is not loaded properly.', expected.options.labelsCount, this.target.labelsCount);
    }
});