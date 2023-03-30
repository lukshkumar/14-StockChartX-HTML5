/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

/* global TestCase, StockChartX, assertEquals, assertTrue, assertFalse, assertNull, assertNotNull, assertNotUndefined, assertSame */

//noinspection JSUnusedGlobalSymbols,JSHint
LayerTestCase = TestCase('LayerTestCase', {
    setUp: function () {
        "use strict";

        this.div = $('<div></div>');
        $('body').append(this.div);

        this.target = new StockChartX.Layer({
            parent: this.div,
            size: {
                width: 100,
                height: 200
            }
        });
    },

    testConstructor: function() {
        "use strict";

        var size = {
            width: 100,
            height: 200
        };
        this.target = new StockChartX.Layer({
            parent: this.div,
            size: size
        });

        assertSame('Parent is not initialized properly.', this.div, this.target.parent);
        assertEquals('Size is not initialized properly.', size, this.target.size);
        assertNotNull('Canvas is not initialized properly.', this.target.canvas);
        assertNotUndefined('Canvas is not initialized properly.', this.target.canvas);
        assertNotNull('Context is not initialized properly.', this.target.context);
        assertNotUndefined('Context is not initialized properly.', this.target.context);
    },

    testCanvas: function() {
        "use strict";

        assertNotNull('Canvas is not returned properly.', this.target.canvas);
        assertNotUndefined('Canvas is not returned properly.', this.target.canvas);
    },

    testContext: function() {
        "use strict";

        assertNotNull('Context is not returned properly.', this.target.context);
        assertNotUndefined('Context is not returned properly.', this.target.context);
    },

    testParent: function() {
        "use strict";

        assertNotNull('Parent is not returned properly.', this.target.parent);
        assertNotUndefined('Parent is not returned properly.', this.target.parent);
    },

    testSize: function() {
        "use strict";

        var expected = {
            width: 230,
            height: 140
        };
        this.target.size = expected;

        assertEquals('Size is not set properly.', expected, this.target.size);
    },

    testDestroy: function() {
        "use strict";

        this.target.destroy();

        assertNull('Parent is not destroyed.', this.target.parent);
        assertNull('Canvas is not destroyed.', this.target.canvas);
        assertNull('Context is not destroyed.', this.target.context);
    }
});