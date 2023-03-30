/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

/* global TestCase, StockChartX, assertEquals, assertNull, assertNotNull, assertTrue, assertFalse, assertSame,
 assertException, assertNoException, assertInstanceOf, assertObject, assertUndefined, assertNotUndefined */

//noinspection JSUnusedGlobalSymbols,JSHint
DictionaryTestCase = TestCase('DictionaryTestCase', {
    setUp: function() {
        "use strict";

        this.target = new StockChartX.Dictionary();
    },

    testCount: function() {
        "use strict";

        assertEquals('Invalid count', 0, this.target.count);

        this.target.add('key', 'value');
        assertEquals('Invalid count', 1, this.target.count);
    },

    testEmptyConstructor: function() {
        "use strict";

        assertEquals('Dictionary is not initialized properly.', 0, this.target.count);
    },

    testConstructorWithPair: function() {
        "use strict";

        var expected = {
            key: 'test',
            value: 5
        };
        this.target = new StockChartX.Dictionary(expected);

        assertEquals('Dictionary is not initialized properly', 1, this.target.count);
        assertEquals('Pair is not added on initialization', expected.value, this.target.get(expected.key));
    },

    testConstructorWithManyPairs: function() {
        "use strict";

        var expected = [
            {
                key: 'key 1',
                value: 'value 1'
            },
            {
                key: 'key 2',
                value: 'value 2'
            }
        ];
        var target = new StockChartX.Dictionary(expected);

        assertEquals('Pairs are not added on initialization', expected.length, target.count);
        expected.forEach(function(pair) {
            assertEquals('Pair is not added properly', pair.value, target.get(pair.key));
        });
    },

    testAdd: function() {
        "use strict";

        var expected = {
            key: 'key 1',
            value: 'value 1'
        };
        var target = this.target;
        target.add(expected.key, expected.value);

        assertEquals('Pair is not added properly', 1, target.count);
        assertEquals('Pair is not added properly', expected.value, target.get(expected.key));

        assertException('An exception should be thrown on attempt to add the same key twice', function() {
            target.add(expected.key, expected.value);
        });
    },

    testRemove: function() {
        "use strict";

        var actual = this.target.remove('key 1');
        assertFalse('False should be returned on attempt to remove non-existing key', actual);

        this.target.add('key 1', 'value 1');
        actual = this.target.remove('key 1');
        assertTrue('True should be returned on successful remove', actual);
        assertEquals('Item is not removed properly', 0, this.target.count);
        assertNull('Item is not removed properly', this.target.get('item 1'));
    },

    testContainsKey: function() {
        "use strict";

        assertFalse('False should be returned if key does not exist', this.target.containsKey('test'));

        this.target.add('key 1', 1);
        assertTrue('True should be returned if key exists', this.target.containsKey('key 1'));
    },

    testGet: function() {
        "use strict";

        assertNull('Null should be returned for non-existing key.', this.target.get('key'));

        var expected = {
            key: 'key 1',
            value: 'value 1'
        };
        this.target.add(expected.key, expected.value);
        assertEquals('Invalid value returned', expected.value, this.target.get(expected.key));
    }
});