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
AnimationControllerTestCase = TestCase('AnimationControllerTestCase', {
    setUp: function() {
        "use strict";

        this.target = StockChartX.AnimationController;
    },

    tearDown: function() {
        "use strict";

        this.target._animations = [];
    },

    testAnimationInterval: function() {
        "use strict";

        var expected = 10;

        this.target.AnimationInterval = expected;

        assertEquals('Animation interval is not set properly.', expected, this.target.AnimationInterval);
    },

    testHasAnimationToRun: function() {
        "use strict";

        assertFalse('Invalid HasAnimationToRun state.', this.target.hasAnimationsToRun());

        var animation = new StockChartX.Animation();
        this.target.add(animation);
        assertTrue('Invalid HasAnimationToRun state.', this.target.hasAnimationsToRun());
    },

    testContains: function() {
        "use strict";

        var animation = new StockChartX.Animation();

        assertFalse('False must be returned for non-existing animation.', this.target.contains(animation));

        this.target.add(animation);
        assertTrue('True must be returned for existing animation.', this.target.contains(animation));
    },

    testAdd: function() {
        "use strict";

        var animation = new StockChartX.Animation();
        var actual = this.target.add(animation);

        assertTrue('True must be returned if animation added successfully.', actual);
        assertTrue('Animation is not added properly.', this.target.contains(animation));

        actual = this.target.add(animation);
        assertFalse('False must be returned on attempt to add animation twice.', actual);
    },

    testRemove: function() {
        "use strict";

        var animation = new StockChartX.Animation();
        var actual = this.target.remove(animation);

        assertFalse('False must be returned on attempt to remove non-existing animation.', actual);

        this.target.add(animation);
        actual = this.target.remove(animation);
        assertTrue('True must be returned on successful remove.', actual);
    }
});