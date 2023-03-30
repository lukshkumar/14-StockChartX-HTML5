 /**
  * Copyright Modulus Financial Engineering, Inc. Scottsdale, AZ http://www.modulusfe.com
  */

 /* global StockChartX, assertEquals, assertNull, assertNotNull, assertTrue, assertFalse, assertException, assertNoException, assertSame, assertArray */

 //noinspection JSUnusedGlobalSymbols,JSHint
 GestureArrayTestCase = TestCase('GestureArrayTestCase', {
    setUp: function() {
        "use strict";

        //noinspection JSCheckFunctionSignatures
        this.target = new StockChartX.GestureArray();
    },

    testEmptyConstructor: function() {
        "use strict";

        assertNotNull('Gestures array is not created.', this.target.gestures);
        assertArray('Gestures must be an array.', this.target.gestures);
        assertEquals('Gestures array is not empty.', 0, this.target.gestures.length);
    },

    testGestureConstructor: function() {
        "use strict";

        var expected = new StockChartX.PanGesture();
        var target = null;

        assertNoException('An exception should not be thrown on attempt to call constructor with single gesture.', function() {
            //noinspection JSCheckFunctionSignatures
            target = new StockChartX.GestureArray(expected);
        });
        assertEquals('Gesture is not added properly.', 1, target.gestures.length);
        assertSame('Gesture is not added properly.', expected, target.gestures[0]);
    },

    testGestureArrayConstructor: function() {
        "use strict";

        var expected = [new StockChartX.Gesture(), new StockChartX.PanGesture()];
        var target = null;

        assertNoException('An exception should not be thrown on attempt to call constructor with gesture array.', function() {
            target = new StockChartX.GestureArray(expected);
        });
        assertEquals('Gestures are not added properly.', 2, target.gestures.length);
        assertSame('Gestures are not added properly.', expected[0], target.gestures[0]);
        assertSame('Gestures are not added properly.', expected[1], target.gestures[1]);
    },

    testAddGesture: function() {
        "use strict";

        var expected = new StockChartX.PanGesture();
        //noinspection JSCheckFunctionSignatures
        this.target.add(expected);

        assertEquals('Gesture is not added properly.', 1, this.target.gestures.length);
        assertSame('Gesture is not added properly.', expected, this.target.gestures[0]);
    },

    testAddGestures: function() {
        "use strict";

        var expected = [new StockChartX.Gesture(), new StockChartX.PanGesture()];

        this.target.add(expected);

        assertEquals('Gestures are not added properly.', 2, this.target.gestures.length);
        assertSame('Gestures are not added properly.', expected[0], this.target.gestures[0]);
        assertSame('Gestures are not added properly.', expected[1], this.target.gestures[1]);
    }
});


 //noinspection JSUnusedGlobalSymbols,JSHint
 GestureTestCase = TestCase('GestureTestCase', {
    setUp: function() {
        "use strict";

        this.target = new StockChartX.Gesture();
    },

    testConstructorWithoutConfig: function() {
        "use strict";

        var target = null;
        assertNoException('An exception should not be thrown on attempty to create gesture without config.', function() {
            target = new StockChartX.Gesture();
        });
        assertNull('Handler is not initialized properly.', target.handler);
        assertNull('Hit test is not initialized properly.', target.hitTest);
        assertNull('Context is not initialized properly.', target.context);
    },

    testInvalidConfig: function() {
        "use strict";

        assertException('An exception should be thrown on attempt to create with invalid handler function.', function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.Gesture({handler: {}});
        });
        assertException('An exception should be thrown on attempt to create with invalid hit test function.', function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.Gesture({hitTest: {}});
        });
        assertException('An exception should be thrown on attempt to create with invalid context.', function() {
            new StockChartX.Gesture({context: 0}); // jshint ignore:line
        });
    },

    testConstructor: function() {
        "use strict";

        var target = null;
        var expectedHandler = function(){};
        var expectedHitTest = function(){};
        var expectedContext = {};
        assertNoException('Gesture is not created properly.', function() {
            target = new StockChartX.Gesture({
                handler: expectedHandler,
                hitTest: expectedHitTest,
                context: expectedContext
            });
        });
        assertSame('Handler is not initialized properly.', expectedHandler, target.handler);
        assertSame('Hit test is not initialized properly.', expectedHitTest, target.hitTest);
        assertSame('Context is not initialized properly.', expectedContext, target.context);
    },

    testHandler: function() {
        "use strict";

        var expected = function(){};
        this.target.handler = expected;

        assertSame('Handler is not set properly.', expected, this.target.handler);
    },

    testHitTest: function() {
        "use strict";

        var expected = function() {};
        this.target.hitTest = expected;

        assertSame('Hit test is not set properly.', expected, this.target.hitTest);
    },

    testContext: function() {
        "use strict";

        var expected = {};
        this.target.context = expected;

        assertSame('Context is not set properly.', expected, this.target.context);
    }
});


 //noinspection JSUnusedGlobalSymbols,JSHint
 PanGestureTestCase = TestCase('PanGestureTestCase', {
    setUp: function() {
        "use strict";

        this.target = new StockChartX.PanGesture();
    },

    testInvalidConfig: function() {
        "use strict";

        assertException('An exception must be thrown on attempt to create pan gesture with invalid config', function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.PanGesture({minMoveDistance: ''});
        });
        assertException('An exception must be thrown on attempt to create pan gesture with invalid config', function() {
            new StockChartX.PanGesture({minMoveDistance: 0}); // jshint ignore:line
        });
        assertException('An exception must be thrown on attempt to create pan gesture with invalid config', function() {
            new StockChartX.PanGesture({minMoveDistance: -1}); // jshint ignore:line
        });
        assertException('An exception should be thrown on attempt to create with invalid button.', function() {
            new StockChartX.PanGesture({button: ''}); // jshint ignore:line
        });
        assertException('An exception should be thrown on attempt to create with invalid button.', function() {
            new StockChartX.PanGesture({button: -1}); // jshint ignore:line
        });
    },

    testConstructor: function() {
        "use strict";

        var target = null;
        assertNoException('Gesture is not created properly.', function() {
            target = new StockChartX.PanGesture();
        });
        assertNull('Handler is not initialized properly.', target.handler);
        assertNull('Hit test is not initialized properly.', target.hitTest);
        assertEquals('MinMoveDistance is not initialized properly.', 3, target.minMoveDistance);
        assertTrue('Horizontal move must be enabled by default', target.horizontalMoveEnabled);
        assertTrue('Vertical move must be enabled by default.', target.verticalMoveEnabled);
        assertEquals('Move offset is not initialized properly.', {x: 0, y: 0}, target.moveOffset);
        assertNull('Prev point is not initialized properly.', target._prevPoint);
        assertEquals('Button is not initialized properly.', 0, target.button);
    },

    testExtendedConstructor: function() {
        "use strict";

        var target = null;
        var expectedHandler = function(){};
        var expectedHitTest = function(){};
        assertNoException('Gesture is not created properly.', function() {
            target = new StockChartX.PanGesture({
                handler: expectedHandler,
                hitTest: expectedHitTest,
                horizontalMoveEnabled: false,
                verticalMoveEnabled: false,
                button: 1
            });
        });
        assertSame('Handler is not initialized properly.', expectedHandler, target.handler);
        assertSame('Hit test is not initialized properly.', expectedHitTest, target.hitTest);
        assertEquals('MinMoveDistance is not initialized properly.', 3, target.minMoveDistance);
        assertFalse('IsHorizontalMoveEnabled is not initialized properly', target.horizontalMoveEnabled);
        assertFalse('IsVerticalMoveEnabled is not initialized properly.', target.verticalMoveEnabled);
        assertEquals('Button is not initialized properly.', 1, target.button);
    },

    testMinMoveDistance: function() {
        "use strict";

        var expected = 5;
        var target = this.target;
        this.target.minMoveDistance = expected;

        assertEquals('MinMoveDistance is not set properly.', expected, this.target.minMoveDistance);
        assertException('An exception must be thrown on attempt to set incorrect min move distance.', function() {
            target.minMoveDistance = null;
        });
        assertException('An exception must be thrown on attempt to set incorrect min move distance.', function() {
            target.minMoveDistance = '';
        });
        assertException('An exception must be thrown on attempt to set incorrect min move distance.', function() {
            target.minMoveDistance = 0;
        });
        assertException('An exception must be thrown on attempt to set incorrect min move distance.', function() {
            target.minMoveDistance = -1;
        });
    },

    testHorizontalMoveEnabled: function() {
        "use strict";

        this.target.horizontalMoveEnabled = true;
        assertTrue('IsHorizontalMoveEnabled is not set properly.', this.target.horizontalMoveEnabled);

        this.target.horizontalMoveEnabled = false;
        assertFalse('IsHorizontalMoveEnabled is not set properly.', this.target.horizontalMoveEnabled);

        this.target.horizontalMoveEnabled = null;
        assertTrue('IsHorizontalMoveEnabled is not set properly.', this.target.horizontalMoveEnabled);
    },

    testVerticalMoveEnabled: function() {
        "use strict";

        this.target.verticalMoveEnabled = true;
        assertTrue('IsVerticalMoveEnabled is not set properly.', this.target.verticalMoveEnabled);

        this.target.verticalMoveEnabled = false;
        assertFalse('IsVerticalMoveEnabled is not set properly.', this.target.verticalMoveEnabled);

        this.target.verticalMoveEnabled = null;
        assertTrue('IsVerticalMoveEnabled is not set properly.', this.target.verticalMoveEnabled);
    },

    testButton: function() {
        "use strict";

        var expected = 2;
        var target = this.target;
        this.target.button = expected;

        assertEquals('Button is not set properly.', expected, this.target.button);

        assertException('An exception must be thrown on attempt to set non-number to button.', function() {
            //noinspection JSCheckFunctionSignatures
            target.button = '';
        });
        assertException('An exception must be thrown on attempt to set negative number to button.', function() {
            target.button = -1;
        });
    }
});


 //noinspection JSUnusedGlobalSymbols,JSHint
 MouseHoverGestureTestCase = TestCase('MouseHoverGestureTestCase', {
    setUp: function() {
        "use strict";

        this.target = new StockChartX.MouseHoverGesture();
    },

    testConstructor: function() {
        "use strict";

        var target = new StockChartX.MouseHoverGesture();

        assertTrue('Enter event must be enabled by default.', target.enterEventEnabled);
        assertTrue('Hover event must be enabled by default.', target.hoverEventEnabled);
        assertTrue('Leave event must be enabled by default.', target.leaveEventEnabled);
    },

    testExtendedConstructor: function() {
        "use strict";

        var target = new StockChartX.MouseHoverGesture({
            enterEventEnabled: false,
            hoverEventEnabled: false,
            leaveEventEnabled: false
        });

        assertFalse('Enter event is not initialized properly.', target.enterEventEnabled);
        assertFalse('Hover event is not initialized properly.', target.hoverEventEnabled);
        assertFalse('Leave event is not initialized properly.', target.leaveEventEnabled);
    },

    testEnterEventEnabled: function() {
        "use strict";

        this.target.enterEventEnabled = true;
        assertTrue('EnterEventEnabled is not set properly.', this.target.enterEventEnabled);

        this.target.enterEventEnabled = false;
        assertFalse('EnterEventEnabled is not set properly.', this.target.enterEventEnabled);

        this.target.enterEventEnabled = true;
        assertTrue('EnterEventEnabled is not set properly.', this.target.enterEventEnabled);
    },

    testHoverEventEnabled: function() {
        "use strict";

        this.target.hoverEventEnabled = true;
        assertTrue('HoverEventEnabled is not set properly.', this.target.hoverEventEnabled);

        this.target.hoverEventEnabled = false;
        assertFalse('HoverEventEnabled is not set properly.', this.target.hoverEventEnabled);

        this.target.hoverEventEnabled = true;
        assertTrue('HoverEventEnabled is not set properly.', this.target.hoverEventEnabled);
    },

    testLeaveEventEnabled: function() {
        "use strict";

        this.target.leaveEventEnabled = true;
        assertTrue('LeaveEventEnabled is not set properly.', this.target.leaveEventEnabled);

        this.target.leaveEventEnabled = false;
        assertFalse('LeaveEventEnabled is not set properly.', this.target.leaveEventEnabled);

        this.target.leaveEventEnabled = true;
        assertTrue('LeaveEventEnabled is not set properly.', this.target.leaveEventEnabled);
    }
});