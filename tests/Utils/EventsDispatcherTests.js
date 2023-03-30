/**
 * Copyright Modulus Financial Engineering, Inc. Scottsdale, AZ http://www.modulusfe.com
 */

/* global StockChartX, assertEquals, assertTrue, assertNoException */

//noinspection JSUnusedGlobalSymbols,JSHint
EventsDispatcherTestCase = TestCase('EventsDispatcherTestCase', {
    setUp: function() {
        "use strict";

        this.target = new StockChartX.EventsDispatcher();
    },

    testConstructor: function() {
        "use strict";

        assertEquals("Listeners are not initialized properly.", {}, this.target._listeners);
    },

    testOnEmpty: function() {
        "use strict";

        this.target.on("          ", function(){});

        assertEquals("It should be no listeners for string with spaces.", {}, this.target._listeners);
    },

    testOnSingle: function() {
        "use strict";

        var handler = function(){};
        var expected = {
            mouseMove: [{name: '', handler: handler, target: undefined}]
        };
        this.target.on("  mouseMove         ", handler);
        assertEquals("Subscribe to single event failed.", expected, this.target._listeners);
    },

    testOnSingleWithName: function() {
        "use strict";

        var handler = function(){};
        var expected = {
            mouseMove: [{name: 'test', handler: handler, target: undefined}]
        };
        this.target.on("  mouseMove.test         ", handler);
        assertEquals("Subscribe to single event with name failed.", expected, this.target._listeners);
    },

    testOnSameTwice: function() {
        "use strict";

        var handler = function(){};
        var expected = {
            mouseMove: [{name: 'test', handler: handler, target: undefined}, {name: 'test', handler: handler, target: undefined}]
        };
        this.target.on("  mouseMove.test mouseMove.test         ", handler);
        assertEquals("Subscribe to the same event twice failed.", expected, this.target._listeners);
    },

    testOnMultiple: function() {
        "use strict";

        var handler = function(){};
        var expected = {
            mouseMove: [{name: 'test', handler: handler, target: undefined}],
            click: [{name: '', handler: handler, target: undefined}]
        };
        this.target.on("  mouseMove.test click         ", handler);
        assertEquals("Subscribe to multiple events at once failed..", expected, this.target._listeners);
    },

    testOnTarget: function() {
        "use strict";

        var handler = function(){};
        var target = {field: '1'};
        var expected = {
            click: [{name: 'test', handler: handler, target: target}]
        };
        this.target.on("click.test", handler, target);

        assertEquals("Subscribe with target failed.", expected, this.target._listeners);
    },

    testOffEmpty: function() {
        "use strict";

        var target = this.target;
        assertNoException("An exception should not be thrown if there are no listeners.", function() {
            target.off("click");
        });
        assertEquals("Off without listeners failed.", {}, this.target._listeners);
    },

    testOffSoleEvent: function() {
        "use strict";

        this.target.on("click", function(){});
        this.target.off("click");

        assertEquals("Unsubscribe from single event failed.", {}, this.target._listeners);
    },

    testOffSingle: function() {
        "use strict";

        var handler = function() {};

        this.target.on("click move", handler);
        this.target.off(" click  ");

        var expected = {
            move: [{name: '', handler: handler, target: undefined}]
        };
        assertEquals("Unsubscribe single event failed.", expected, this.target._listeners);
    },

    testOffSingleWithName: function() {
        "use strict";

        var handler = function() {};

        this.target.on("click.app click.test", handler);
        this.target.off("  click.test   ");

        var expected = {
            click: [{name: "app", handler: handler, target: undefined}]
        };
        assertEquals("Unsubscribe single event with name failed.", expected, this.target._listeners);
    },

    testOffMultiple: function() {
        "use strict";

        var handler = function() {};

        this.target.on("click.app click.test move", handler);
        this.target.off("click.test click.app");

        var expected = {
            move: [{name: '', handler: handler, target: undefined}]
        };
        assertEquals("Unsubscribe multiple events at once failed.", expected, this.target._listeners);
    },

    testOffByEventType: function() {
        "use strict";

        var handler = function() {};

        this.target.on("click.app click move", handler);
        this.target.off("click");

        var expected = {
            move: [{name: '', handler: handler, target: undefined}],
            click: [{name: 'app', handler: handler, target: undefined}]
        };
        assertEquals("Unsubscribe all event with a given type failed.", expected, this.target._listeners);
    },

    testOffByNamespace: function() {
        "use strict";

        var handler = function() {};

        this.target.on("click.app click move", handler);
        this.target.off(".app");

        var expected = {
            move: [{name: '', handler: handler, target: undefined}],
            click: [{name: '', handler: handler, target: undefined}]
        };
        assertEquals("Unsubscribe from events by namespace failed.", expected, this.target._listeners);
    },

    testOffByName: function() {
        "use strict";

        var handler = function() {};

        this.target.on("click.app click.test", handler);
        this.target.off(".test");

        var expected = {
            click: [{name: 'app', handler: handler, target: undefined}]
        };
        assertEquals("Unsubscribe all events with a given name failed.", expected, this.target._listeners);
    },

    testOffByTarget: function() {
        "use strict";

        var handler = function(){};
        var target = {field: '1'};

        this.target.on("click", handler);
        this.target.on("click.test", handler, target);
        this.target.off("click.test", target);

        var expected = {
            click: [{name: '', handler: handler, target: undefined}]
        };
        assertEquals("Unsubscribe by target failed.", expected, this.target._listeners);
    },

    testFire: function() {
        "use strict";

        var expectedEvent = {},
            expectedEventType = "click",
            isHandled = false;
        var handler = function(event) {
            isHandled = true;
            assertEquals("Invalid event type.", expectedEventType, event.type);
        };

        this.target.on(expectedEventType, handler);
        this.target.fire(expectedEventType, expectedEvent);

        assertTrue("Event is not fired.", isHandled);
    }
});