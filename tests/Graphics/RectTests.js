/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

/* global TestCase, StockChartX, assertEquals, assertTrue, assertFalse */

//noinspection JSUnusedGlobalSymbols,JSHint
RectTestCase = TestCase('RectTestCase', {
    setUp: function() {
        "use strict";

        this.target = new StockChartX.Rect({
            left: 10,
            top: 20,
            width: 30,
            height: 40
        });
    },

    testEmptyRect: function() {
        "use strict";

        var target = new StockChartX.Rect();

        assertEquals("Left is not initialized properly.", 0, target.left);
        assertEquals("Top is not initialized properly.", 0, target.top);
        assertEquals("Width is not initialized properly.", 0, target.width);
        assertEquals("Height is not initialized properly.", 0, target.height);
    },

    testConstructor: function() {
        "use strict";

        assertEquals("Left is not initialized properly.", 10, this.target.left);
        assertEquals("Top is not initialized properly.", 20, this.target.top);
        assertEquals("Width is not initialized properly.", 30, this.target.width);
        assertEquals("Height is not initialized properly.", 40, this.target.height);
    },

    testClone: function() {
        "use strict";

        var rect = this.target.clone();

        assertEquals("Left is not initialized properly.", this.target.left, rect.left);
        assertEquals("Top is not initialized properly.", this.target.top, rect.top);
        assertEquals("Width is not initialized properly.", this.target.width, rect.width);
        assertEquals("Height is not initialized properly.", this.target.height, rect.height);
    },

    testEquals: function() {
        "use strict";

        var rect = {
            left: 10,
            top: 20,
            width: 30,
            height: 40
        };

        assertTrue("Rectangles are not compared properly.", this.target.equals(rect));

        rect = this.target.clone();
        rect.left = 1;
        assertFalse("Rectangles are not compared properly.", this.target.equals(rect));

        rect = this.target.clone();
        rect.top = 1;
        assertFalse("Rectangles are not compared properly.", this.target.equals(rect));

        rect = this.target.clone();
        rect.width = 1;
        assertFalse("Rectangles are not compared properly.", this.target.equals(rect));

        rect = this.target.clone();
        rect.height = 1;
        assertFalse("Rectangles are not compared properly.", this.target.equals(rect));
    },

    testToString: function() {
        "use strict";

        var expected = "[left: 10, top: 20, width: 30, height: 40]";

        assertEquals("Incorrect string representation", expected, this.target.toString());
    },

    testGetBottom: function() {
        "use strict";

        assertEquals("Incorrect bottom coordinate.", 60, this.target.bottom);
    },

    testGetRight: function() {
        "use strict";

        assertEquals("Incorrect right coordinate.", 40, this.target.right);
    },

    testContainsPoint: function() {
        "use strict";

        assertFalse("Check if rect contains point failed.", this.target.containsPoint({x: 0, y: 30}));
        assertFalse("Check if rect contains point failed.", this.target.containsPoint({x: 3, y: 0}));
        assertFalse("Check if rect contains point failed.", this.target.containsPoint({x: 50, y: 30}));
        assertFalse("Check if rect contains point failed.", this.target.containsPoint({x: 50, y: 70}));
        assertTrue("Check if rect contains point failed.", this.target.containsPoint({x: 10, y: 20}));
        assertTrue("Check if rect contains point failed.", this.target.containsPoint({x: 10, y: 60}));
        assertTrue("Check if rect contains point failed.", this.target.containsPoint({x: 40, y: 20}));
        assertTrue("Check if rect contains point failed.", this.target.containsPoint({x: 40, y: 60}));
        assertTrue("Check if rect contains point failed.", this.target.containsPoint({x: 11, y: 21}));
    },

    testCropLeft: function() {
        "use strict";

        var expected = {
            left: 15,
            top: 20,
            width: 25,
            height: 40
        };
        this.target.cropLeft(new StockChartX.Rect({
            left: 10,
            top: 20,
            width: 5,
            height: 40
        }));

        assertEquals("CropLeft failed.", expected, this.target);
    },

    testCropRight: function() {
        "use strict";

        var expected = {
            left: 10,
            top: 20,
            width: 24,
            height: 40
        };
        this.target.cropRight(new StockChartX.Rect({
            left: 35,
            top: 20,
            width: 5,
            height: 40
        }));

        assertEquals("cropRight failed.", expected, this.target);
    },

    testCropTop: function() {
        "use strict";

        var expected = {
            left: 10,
            top: 25,
            width: 30,
            height: 35
        };
        this.target.cropTop(new StockChartX.Rect({
            left: 10,
            top: 20,
            width: 30,
            height: 5
        }));

        assertEquals("cropTop failed", expected, this.target);
    },

    testCropBottom: function() {
        "use strict";

        var expected = {
            left: 10,
            top: 20,
            width: 30,
            height: 35
        };
        this.target.cropBottom(new StockChartX.Rect({
            left: 10,
            top: 55,
            width: 30,
            height: 5
        }));

        assertEquals("cropBottom failed", expected, this.target);
    },

    testApplyPadding: function() {
        "use strict";

        var expected = new StockChartX.Rect({
            left: 10,
            top: 20,
            width: 30,
            height: 35
        });
        var actual = expected.clone();

        //noinspection JSCheckFunctionSignatures
        actual.applyPadding({});

        assertEquals("Padding is not applied properly.", expected, actual);

        actual = expected.clone();
        actual.applyPadding({
            left: 1,
            top: 2,
            right: 3,
            bottom: 4
        });
        expected = {
            left: 11,
            top: 22,
            width: 26,
            height: 29
        };
        assertEquals("Padding is not applied properly.", expected, actual);
    }
});