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
ChartPointTestCase = TestCase('ChartPointTestCase', {
    setUp: function() {
        "use strict";

        this.projection = new StockChartX.Projection(null);

        this.origRecordByX = StockChartX.Projection.prototype.recordByX;
        this.origDateByX = StockChartX.Projection.prototype.dateByX;
        this.origValueByY = StockChartX.Projection.prototype.valueByY;
        this.origXByDate = StockChartX.Projection.prototype.xByDate;
        this.origXByRecord = StockChartX.Projection.prototype.xByRecord;
        this.origYByValue = StockChartX.Projection.prototype.yByValue;

        StockChartX.Projection.prototype.recordByX = function() {
            return 1;
        };
        StockChartX.Projection.prototype.dateByX = function() {
            return new Date(2);
        };
        StockChartX.Projection.prototype.valueByY = function() {
            return 3;
        };
        StockChartX.Projection.prototype.xByDate = function() {
            return 4;
        };
        StockChartX.Projection.prototype.xByRecord = function() {
            return 5;
        };
        StockChartX.Projection.prototype.yByValue = function() {
            return 6;
        };
    },

    tearDown: function() {
        "use strict";

        StockChartX.Projection.prototype.recordByX = this.origRecordByX;
        StockChartX.Projection.prototype.dateByX = this.origDateByX;
        StockChartX.Projection.prototype.valueByY = this.origValueByY;
        StockChartX.Projection.prototype.xByDate = this.origXByDate;
        StockChartX.Projection.prototype.xByRecord = this.origXByRecord;
        StockChartX.Projection.prototype.yByValue = this.origYByValue;
    },

    testConstructor: function() {
        "use strict";

        var expected = {
            x: 10,
            y: 20
        };
        var actual = new StockChartX.ChartPoint(expected);
        assertEquals('Point is not initialized properly.', expected, actual);

        expected = {
            date: new Date(),
            value: 10
        };
        actual = new StockChartX.ChartPoint(expected);
        assertEquals('Point is not initialized properly.', expected, actual);

        expected = {
            record: 15,
            value: 12
        };
        actual = new StockChartX.ChartPoint(expected);
        assertEquals('Point is not initialized properly.', expected, actual);
    },

    testConvert: function() {
        "use strict";

        var point = {
            x: 10,
            y: 20
        };


        var behavior = {
            x: StockChartX.XPointBehavior.DATE,
            y: StockChartX.YPointBehavior.Y
        };
        var expected = {
            date: new Date(2),
            y: 20
        };
        var actual = StockChartX.ChartPoint.convert(point, behavior, this.projection);
        assertEquals('Point is not converted properly.', expected, actual);

        behavior = {
            x: StockChartX.XPointBehavior.RECORD,
            y: StockChartX.YPointBehavior.VALUE
        };
        expected = {
            record: 1,
            value: 3
        };
        actual = StockChartX.ChartPoint.convert(point, behavior, this.projection);
        assertEquals('Point is not converted properly.', expected, actual);

        behavior = {
            x: StockChartX.XPointBehavior.X,
            y: StockChartX.YPointBehavior.VALUE
        };
        expected = {
            x: 10,
            value: 3
        };
        actual = StockChartX.ChartPoint.convert(point, behavior, this.projection);
        assertEquals('Point is not converted properly.', expected, actual);
    },

    testConvertWithInvalidBehavior: function() {
        "use strict";

        var point = {
            x: 10,
            y: 10
        };
        var projection = this.projection;

        assertException('An exception must be thrown on attempt to convert without proper x behavior.', function() {
            var behavior = {
                x: 'unkknown',
                y: StockChartX.YPointBehavior.Y
            };
            StockChartX.ChartPoint.convert(point, behavior, projection);
        });

        assertException('An exception must be thrown on attempt to convert without proper y behavior', function() {
            var behavior = {
                x: StockChartX.XPointBehavior.X,
                y: 'unkknown'
            };
            StockChartX.ChartPoint.convert(point, behavior, projection);
        });
    },

    testClear: function() {
        "use strict";

        var expected = {
            x: undefined,
            y: undefined,
        };
        var target = new StockChartX.ChartPoint({
            x: 10,
            y: 10
        });
        target.clear();
        assertEquals('Point is not cleared properly.', expected, target);

        target = new StockChartX.ChartPoint({
            date: new Date(),
            value: 10
        });
        target.clear();
        assertEquals('Point is not cleared properly.', expected, target);

        target = new StockChartX.ChartPoint({
            record: 1,
            y: 10
        });
        target.clear();
        assertEquals('Point is not cleared properly.', expected, target);
    },

    testGetX_ByX: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            x: 10,
            y: 20
        });
        var actual = target.getX(this.projection);
        assertEquals('Incorrect x value.', 10, actual);
    },

    testGetX_ByDate: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            date: new Date(),
            y: 20
        });
        var actual = target.getX(this.projection);
        assertEquals('Incorrect x value.', 4, actual);
    },

    testGetX_ByRecord: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            record: 15,
            y: 20
        });
        var actual = target.getX(this.projection);
        assertEquals('Incorrect x value.', 5, actual);
    },

    testGetX_ByUnknown: function() {
        "use strict";

        var target = new StockChartX.ChartPoint();
        assertNull('Incorrect x value.', target.getX(this.projection));
    },

    testGetDate_ByX: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            x: 10,
            y: 20
        });
        var actual = target.getDate(this.projection);

        assertEquals('Invalid date value.', new Date(2), actual);
    },

    testGetDate_ByDate: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            date: new Date(),
            y: 20
        });
        var actual = target.getDate(this.projection);

        assertEquals('Invalid date value.', target.date, actual);
    },

    testGetDate_ByRecord: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            record: 10,
            y: 20
        });
        var actual = target.getDate(this.projection);

        assertEquals('Invalid date value.', new Date(2), actual);
    },

    testGetDate_ByUnknown: function() {
        "use strict";

        var target = new StockChartX.ChartPoint();

        assertNull('Invalid date value.', target.getDate(this.projection));
    },

    testGetRecord_ByX: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            x: 10,
            y: 20
        });
        var actual = target.getRecord(this.projection);

        assertEquals('Invalid record value.', 1, actual);
    },

    testGetRecord_ByDate: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            date: new Date(),
            y: 20
        });
        var actual = target.getRecord(this.projection);

        assertEquals('Invalid record value.', 1, actual);
    },

    testGetRecord_ByRecord: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            record: 10,
            y: 20
        });
        var actual = target.getRecord(this.projection);

        assertEquals('Invalid record value.', 10, actual);
    },

    testGetRecord_ByUnknown: function() {
        "use strict";

        var target = new StockChartX.ChartPoint();

        assertNull('Invalid record value.', target.getRecord(this.projection));
    },

    testGetY_ByY: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            x: 10,
            y: 20
        });
        var actual = target.getY(this.projection);

        assertEquals('Invalid record value.', 20, actual);
    },

    testGetY_ByValue: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            x: 10,
            value: 20
        });
        var actual = target.getY(this.projection);

        assertEquals('Invalid record value.', 6, actual);
    },

    testGetY_ByUnknown: function() {
        "use strict";

        var target = new StockChartX.ChartPoint();

        assertNull('Invalid y value.', target.getY(this.projection));
    },

    testToPoint_FromXY: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            x: 10,
            y: 20
        });
        var actual = target.toPoint(this.projection);

        assertEquals('Invalid resulting point.', target, actual);
    },

    testToPoint_FromDateValue: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            date: new Date(),
            value: 20
        });
        var expected = {
            x: 4,
            y: 6
        };
        var actual = target.toPoint(this.projection);

        assertEquals('Invalid resulting poinit.', expected, actual);
    },

    testMoveTo_FromXY: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            x: 10,
            y: 20
        });
        var expected = {
            x: 30,
            y: 40
        };
        var actual = target.moveTo(expected.x, expected.y, this.projection);

        assertEquals('Invalid resulting point.', expected, actual);
    },

    testMoveTo_FromDateValue: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            date: new Date(),
            value: 20
        });
        var expected = {
            date: new Date(2),
            value: 3
        };
        var actual = target.moveTo(10, 20, this.projection);

        assertEquals('Invalid resulting point.', expected, actual);
    },

    testMoveTo_FromRecordValue: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            record: 10,
            value: 20
        });
        var expected = {
            record: 1,
            value: 3
        };
        var actual = target.moveTo(10, 20, this.projection);

        assertEquals('Invalid resulting point.', expected, actual);
    },

    testMoveToPoint_FromXY: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            x: 10,
            y: 20
        });
        var expected = {
            x: 30,
            y: 40
        };
        var actual = target.moveToPoint(expected, this.projection);

        assertEquals('Invalid resulting point.', expected, actual);
    },

    testMoveToPoint_FromDateValue: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            date: new Date(),
            value: 20
        });
        var expected = {
            date: new Date(2),
            value: 3
        };
        var actual = target.moveToPoint({x: 10, y: 20}, this.projection);

        assertEquals('Invalid resulting point.', expected, actual);
    },

    testMoveToPoint_FromRecordValue: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            record: 10,
            value: 20
        });
        var expected = {
            record: 1,
            value: 3
        };
        var actual = target.moveToPoint({x: 10, y: 20}, this.projection);

        assertEquals('Invalid resulting point.', expected, actual);
    },

    testMoveToX_FromXY: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            x: 10,
            y: 20
        });
        var expected = {
            x: 30,
            y: 20
        };
        var actual = target.moveToX(expected.x, this.projection);

        assertEquals('Invalid resulting point.', expected, actual);
    },

    testMoveToX_FromDateValue: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            date: new Date(),
            value: 20
        });
        var expected = {
            date: new Date(2),
            value: 20
        };
        var actual = target.moveToX(10, this.projection);

        assertEquals('Invalid resulting point.', expected, actual);
    },

    testMoveToX_FromRecordValue: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            record: 10,
            value: 20
        });
        var expected = {
            record: 1,
            value: 20
        };
        var actual = target.moveToX(10, this.projection);

        assertEquals('Invalid resulting point.', expected, actual);
    },

    testMoveToY_FromXY: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            x: 10,
            y: 20
        });
        var expected = {
            x: 30,
            y: 20
        };
        var actual = target.moveToX(expected.x, this.projection);

        assertEquals('Invalid resulting point.', expected, actual);
    },

    testMoveToY_FromDateValue: function() {
        "use strict";

        var target = new StockChartX.ChartPoint({
            date: new Date(5),
            value: 20
        });
        var expected = {
            date: new Date(5),
            value: 3
        };
        var actual = target.moveToY(10, this.projection);

        assertEquals('Invalid resulting point.', expected, actual);
    }
});