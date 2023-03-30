/**
 * Copyright Modulus Financial Engineering, Inc. Scottsdale, AZ http://www.modulusfe.com
 */

/* global StockChartX, assertEquals, assertNotSame */

//noinspection JSUnusedGlobalSymbols, JSHint
DateScaleCalibratorTestCase = TestCase('DateScaleCalibratorTestCase', {
    setUp: function() {
        "use strict";

        /**
         * @type {StockChartX.DateScaleCalibrator}
         */
        this.target = new StockChartX.DateScaleCalibrator();
    },

    testClassName: function() {
        "use strict";

        //noinspection JSUnresolvedVariable
        assertEquals('Class name is not valid.', '', StockChartX.DateScaleCalibrator.className);
    },

    testConstructor: function() {
        "use strict";

        assertEquals('Labels are not initialized properly.', [], this.target.labels);
        //noinspection JSAccessibilityCheck
        assertEquals('Options are not initialized properly.', {}, this.target._options);
    },

    testCalibrate: function() {
        "use strict";

        this.target.labels.push({x: 1});
        this.target.calibrate(null);

        assertEquals('Labels not cleared.', [], this.target.labels);
    },

    testSaveState: function() {
        "use strict";

        var expected = {
            className: '',
            options: {
                prop: 'value',
                num: 2
            }
        };
        //noinspection JSAccessibilityCheck
        this.target._options = expected.options;
        var actual = this.target.saveState();

        assertEquals('State is not saved properly.', expected, actual);
        //noinspection JSAccessibilityCheck
        assertNotSame('Options are not copied into state.', this.target._options, actual.options);
    },

    testLoadState: function() {
        "use strict";

        var expected = {
            className: '',
            options: {
                prop: 'value',
                num: 2
            }
        };
        this.target.loadState(expected);

        //noinspection JSAccessibilityCheck
        assertEquals('State is not loaded properly.', expected.options, this.target._options);
        //noinspection JSAccessibilityCheck
        assertNotSame('Options are not copied from state.', this.target._options, expected.options);
    }
});