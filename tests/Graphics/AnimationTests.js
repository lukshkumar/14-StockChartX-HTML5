/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

/* global TestCase, StockChartX, assertEquals, assertTrue, assertFalse, assertNull, assertUndefined, assertSame, assertException */
//noinspection JSUnusedGlobalSymbols,JSHint
AnimationTestCase = TestCase('AnimationTestCase', {
    setUp: function() {
        "use strict";

        this.target = new StockChartX.Animation();
    },

    testEmptyConstructor: function() {
        "use strict";

        var target = new StockChartX.Animation();

        assertUndefined('Callback is not initialized properly.', target.callback);
        assertFalse('Started flag is not initialized properly.', target.started);
        assertNull('Context is not initialized properly.', target.context);
        assertTrue('Recurring flag is not initialized properly.', target.recurring);
    },

    testConstructor: function() {
        "use strict";

        var config = {
            callback: function() {},
            context: this,
            recurring: false
        };
        var target = new StockChartX.Animation(config);

        assertSame('Callback is not initialized properly.', config.callback, target.callback);
        assertFalse('Started flag is not initialized properly.', target.started);
        assertSame('Context is not initialized proeprly.', config.context, target.context);
        assertFalse('Recurring flag is not initialized properly.', target.recurring);
    },

    testCallback: function() {
        "use strict";

        var expected = function() {};
        this.target.callback = expected;
        assertSame('Callback is not set properly.', expected, this.target.callback);
    },

    testContext: function() {
        "use strict";

        var expected = this;
        this.target.context = expected;
        assertSame('Context is not set properly.', expected, this.target.context);
    },

    testRecurring: function() {
        "use strict";

        this.target.recurring = false;
        assertFalse('Recurring is not set properly.', this.target.recurring);
    },

    testStartWithoutCallback: function() {
        "use strict";

        var target = this.target;
        assertException('An exception should be raised on attempt to start animation without callback.', function() {
            target.start();
        });
    },

    testStartAlreadyStartedAnimation: function() {
        "use strict";

        this.target.callback = function() {};

        var actual = this.target.start();
        assertTrue('True must be returned on successfull start.', actual);
        assertTrue('Invalid started flag', this.target.started);

        actual = this.target.start();
        assertFalse('False must be returned on attempt to start already started animation.', actual);
        assertTrue('Invalid started flag.', this.target.started);
    },

    testStop: function() {
        "use strict";

        this.target.callback = function() {};

        this.target.start();
        this.target.stop();

        assertFalse('Invalid started flag.', this.target.started);
    },

    testHandleAnimationFrame: function() {
        "use strict";

        var isExecuted = false;

        this.target.callback = function() {
            isExecuted = true;
        };
        this.target.handleAnimationFrame();

        assertTrue('Callback is not executed.', isExecuted);
    }
});