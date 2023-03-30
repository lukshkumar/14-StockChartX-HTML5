/*
 * Copyright Modulus Financial Engineering, Inc. Scottsdale, AZ http://www.modulusfe.com
 */

/* global StockChartX, assertEquals, assertSame, assertUndefined, assertException */

//noinspection JSUnusedGlobalSymbols,JSHint
ClassRegistrarTestCase = TestCase('ClassRegistrarTestCase', {
    setUp: function () {
        "use strict";

        /**
         * @type {StockChartX.ClassRegistrar}
         */
        this.target = new StockChartX.ClassRegistrar();
    },

    testConstructor: function() {
        "use strict";

        assertEquals('_constructors is not initialized properly.', {}, this.target.registeredItems);
    },

    testRegisterWithIncorrectParameters: function() {
        "use strict";

        var target = this.target;

        assertException('An exception must be thrown if class name is not specified.', function() {
            //noinspection JSUnresolvedFunction
            target.register(null, function(){});
        });

        assertException('An exception must be thrown if class name is not specified.', function() {
            //noinspection JSUnresolvedFunction
            target.register(undefined, function(){});
        });

        assertException('An exception must be thrown if class name is not specified.', function() {
            //noinspection JSUnresolvedFunction
            target.register("", function(){});
        });

        assertException('An exception must be thrown if constructor is not specified.', function() {
            //noinspection JSUnresolvedFunction
            target.register('MyClass', null);
        });

        assertException('An exception must be thrown if constructor is not specified.', function() {
            //noinspection JSUnresolvedFunction
            target.register('MyClass', undefined);
        });
    },

    testRegister: function() {
        "use strict";

        var expected = function(){};

        //noinspection JSUnresolvedFunction
        this.target.register('MyClass', expected);

        assertEquals('Class not registered.', {MyClass: expected}, this.target.registeredItems);
    },

    testResolve: function() {
        "use strict";

        var target = this.target;
        assertException('An exception must be thrown if class name is not specified.', function() {
            target.resolve();
        });
        assertException('An exception must be thrown if class name is not specified.', function() {
            target.resolve(null);
        });
        assertException('An exception must be thrown if class name is not specified.', function() {
            target.resolve('');
        });

        var actual = this.target.resolve('MyClass');
        assertUndefined('Constructor not resolved properly.', actual);

        var expected = function(){};
        //noinspection JSUnresolvedFunction
        this.target.register('MyClass', expected);
        //noinspection JSUnresolvedFunction
        actual = this.target.resolve('MyClass');
        assertSame('Constructor not resolved properly.', expected, actual);
    },

    testRegisteredItems: function() {
        "use strict";

        var expected = function(){};

        //noinspection JSUnresolvedFunction
        this.target.register('MyClass', expected);

        assertEquals('Class not registered.', {MyClass: expected}, this.target.registeredItems);
    },

    testCreateInstance: function() {
        "use strict";

        var target = this.target;
        assertException('An exception must be thrown if constructor is not found.', function() {
            target.createInstance();
        });
        assertException('An exception must be thrown if constructor is not found.', function() {
            target.createInstance(null);
        });
        assertException('An exception must be thrown if constructor is not found.', function() {
            target.createInstance(null);
        });
        assertException('An exception must be thrown if constructor is not found.', function() {
            target.createInstance('SomeClass');
        });

        var expected = {
            value: "Test class instance"
        };
        var TestClass = function() {
            return expected;
        };
        this.target.register('TestClass', TestClass);
        var actual = this.target.createInstance('TestClass');
        assertSame('Instance is not created properly.', expected, actual);
    }
});