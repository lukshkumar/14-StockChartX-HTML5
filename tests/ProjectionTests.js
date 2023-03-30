/**
 * Copyright Modulus Financial Engineering, Inc. Scottsdale, AZ http://www.modulusfe.com
 */

/* global StockChartX, assertEquals, assertEqualsDelta, assertNotNull, assertTrue, assertFalse */

Date.prototype.addMinutes = function(minutes) {
    "use strict";

    var date = new Date(this.valueOf());
    date.setMinutes(date.getMinutes() + minutes);

    return date;
};

Date.prototype.addSeconds = function(seconds) {
    "use strict";

    var date = new Date(this.valueOf());
    date.setSeconds(date.getSeconds() + seconds);

    return date;
};

//noinspection JSUnusedGlobalSymbols,JSHint
ProjectionTestCase = TestCase('ProjectionTestCase', {
    setUp: function() {
        "use strict";

        var chart = new StockChartX.Chart({
            container: 'body',
            width: 100,
            height: 100,
            showToolbar: false
        });
        this.dates = chart.dataManager.dateDataSeries.values;
        var date = new Date(2014, 1, 1);
        for (var i = 0; i < 10; i++) {
            date.setMinutes(date.getMinutes() + 1);
            this.dates.push(new Date(date));
        }

        var valueScale = chart.chartPanelsContainer.panels[0].valueScale;
        valueScale.minVisibleValue = 0;
        valueScale.maxVisibleValue = 100;

        this.target = new StockChartX.Projection(chart.dateScale, valueScale);
        this.dateScale = this.target.dateScale;
        chart.layout();

        this.dateScale._projectionFrame = new StockChartX.Rect({
            left: 0,
            top: 0,
            width: 100,
            height: 100
        });
        this.dateScale._calculateProjectionMetrics();
        valueScale._projectionFrame = new StockChartX.Rect({
            left: 0,
            top: 0,
            width: 100,
            height: 100
        });
        valueScale.minVisibleValue = 0;
        valueScale.maxVisibleValue = 100;
    },

    testConstructor: function() {
        "use strict";

        assertNotNull('Date scale is not initialized properly.', this.target.dateScale);
        assertNotNull('Value scale is not initialized properly.', this.target.valueScale);
    },

    testCanResolveX: function() {
        "use strict";

        assertTrue('Must return true because X can be resolved.', this.target.canResolveX());
        assertFalse('Must return false because X cannot be resolved.', new StockChartX.Projection().canResolveX());
    },

    testCanResolveY: function() {
        "use strict";

        assertTrue('Must return true because Y can be resolved.', this.target.canResolveY());
        assertFalse('Must return false because Y cannot be resolved.', new StockChartX.Projection().canResolveY());
    },

    testColumnByRecord: function() {
        "use strict";

        this.dateScale.firstVisibleRecord = 0;
        assertEquals("ColumnByRecord failed.", 0, this.target.columnByRecord(0));
        assertEquals("ColumnByRecord failed.", -1, this.target.columnByRecord(-1));
        assertEquals("ColumnByRecord failed.", -2, this.target.columnByRecord(-2));
        assertEquals("ColumnByRecord failed.", 1, this.target.columnByRecord(1));
        assertEquals("ColumnByRecord failed.", 11, this.target.columnByRecord(11));

        assertEquals("ColumnByRecord failed.", 0, this.target.columnByRecord(0.2));
        assertEquals("ColumnByRecord failed.", -1, this.target.columnByRecord(-1.5));
        assertEquals("ColumnByRecord failed.", -2, this.target.columnByRecord(-2.6));
        assertEquals("ColumnByRecord failed.", 1, this.target.columnByRecord(1.7));
        assertEquals("ColumnByRecord failed.", 11, this.target.columnByRecord(11.1));

        assertEqualsDelta("ColumnByRecord failed.", 0.2, this.target.columnByRecord(0.2, false), 1E-5);
        assertEqualsDelta("ColumnByRecord failed.", -1.5, this.target.columnByRecord(-1.5, false), 1E-5);
        assertEqualsDelta("ColumnByRecord failed.", -2.6, this.target.columnByRecord(-2.6, false), 1E-5);
        assertEqualsDelta("ColumnByRecord failed.", 1.7, this.target.columnByRecord(1.7, false), 1E-5);
        assertEqualsDelta("ColumnByRecord failed.", 11.1, this.target.columnByRecord(11.1, false), 1E-5);

        this.dateScale.firstVisibleRecord = 1;
        assertEquals("ColumnByRecord failed.", -1, this.target.columnByRecord(0));
        assertEquals("ColumnByRecord failed.", -2, this.target.columnByRecord(-1));
        assertEquals("ColumnByRecord failed.", 0, this.target.columnByRecord(1));
        assertEquals("ColumnByRecord failed.", 1, this.target.columnByRecord(2));

        assertEqualsDelta("ColumnByRecord failed.", -0.8, this.target.columnByRecord(0.2, false), 1E-5);
        assertEqualsDelta("ColumnByRecord failed.", -2.5, this.target.columnByRecord(-1.5, false), 1E-5);
        assertEqualsDelta("ColumnByRecord failed.", -3.6, this.target.columnByRecord(-2.6, false), 1E-5);
        assertEqualsDelta("ColumnByRecord failed.", 0.7, this.target.columnByRecord(1.7, false), 1E-5);
        assertEqualsDelta("ColumnByRecord failed.", 10.1, this.target.columnByRecord(11.1, false), 1E-5);

        this.dateScale.firstVisibleRecord = 1.4;
        assertEquals("ColumnByRecord failed.", -1, this.target.columnByRecord(0));
        assertEquals("ColumnByRecord failed.", -2, this.target.columnByRecord(-1));
        assertEquals("ColumnByRecord failed.", 0, this.target.columnByRecord(1));
        assertEquals("ColumnByRecord failed.", 1, this.target.columnByRecord(2));
        assertEquals("ColumnByRecord failed.", 2, this.target.columnByRecord(3));

        assertEqualsDelta("ColumnByRecord failed.", -0.8, this.target.columnByRecord(0.2, false), 1E-5);
        assertEqualsDelta("ColumnByRecord failed.", -2.5, this.target.columnByRecord(-1.5, false), 1E-5);
        assertEqualsDelta("ColumnByRecord failed.", -3.6, this.target.columnByRecord(-2.6, false), 1E-5);
        assertEqualsDelta("ColumnByRecord failed.", 0.7, this.target.columnByRecord(1.7, false), 1E-5);
        assertEqualsDelta("ColumnByRecord failed.", 10.1, this.target.columnByRecord(11.1, false), 1E-5);
    },

    testRecordByColumn: function() {
        "use strict";

        this.dateScale.firstVisibleRecord = 0;
        assertEquals("RecordByColumn failed.", -2, this.target.recordByColumn(-2));
        assertEquals("RecordByColumn failed.", -1, this.target.recordByColumn(-1));
        assertEquals("RecordByColumn failed.", 0, this.target.recordByColumn(0));
        assertEquals("RecordByColumn failed.", 1, this.target.recordByColumn(1));
        assertEquals("RecordByColumn failed.", 11, this.target.recordByColumn(11));

        assertEquals("RecordByColumn failed.", 0, this.target.recordByColumn(0.2));
        assertEquals("RecordByColumn failed.", -1, this.target.recordByColumn(-1.5));
        assertEquals("RecordByColumn failed.", -2, this.target.recordByColumn(-2.6));
        assertEquals("RecordByColumn failed.", 1, this.target.recordByColumn(1.7));
        assertEquals("RecordByColumn failed.", 11, this.target.recordByColumn(11.1));

        assertEqualsDelta("RecordByColumn failed.", 0.2, this.target.recordByColumn(0.2, false), 1E-5);
        assertEqualsDelta("RecordByColumn failed.", -1.5, this.target.recordByColumn(-1.5, false), 1E-5);
        assertEqualsDelta("RecordByColumn failed.", -2.6, this.target.recordByColumn(-2.6, false), 1E-5);
        assertEqualsDelta("RecordByColumn failed.", 1.7, this.target.recordByColumn(1.7, false), 1E-5);
        assertEqualsDelta("RecordByColumn failed.", 11.1, this.target.recordByColumn(11.1, false), 1E-5);

        this.dateScale.firstVisibleRecord = 1;
        assertEquals("RecordByColumn failed.", 0, this.target.recordByColumn(-1));
        assertEquals("RecordByColumn failed.", 1, this.target.recordByColumn(0));
        assertEquals("RecordByColumn failed.", 2, this.target.recordByColumn(1));
        assertEquals("RecordByColumn failed.", 3, this.target.recordByColumn(2));

        assertEqualsDelta("RecordByColumn failed.", 0.2, this.target.recordByColumn(-0.8, false), 1E-5);
        assertEqualsDelta("RecordByColumn failed.", -1.5, this.target.recordByColumn(-2.5, false), 1E-5);
        assertEqualsDelta("RecordByColumn failed.", -2.6, this.target.recordByColumn(-3.6, false), 1E-5);
        assertEqualsDelta("RecordByColumn failed.", 1.7, this.target.recordByColumn(0.7, false), 1E-5);
        assertEqualsDelta("RecordByColumn failed.", 11.1, this.target.recordByColumn(10.1, false), 1E-5);
    },

    testColumnRecordRoundRobin: function() {
        "use strict";

        this.dateScale.firstVisibleRecord = 0;

        var target = this.target;
        var iterate = function(isIntegral) {
            for (var i = -10; i < 20; i += 0.2) {
                var expected = isIntegral ? Math.trunc(i) : i;
                assertEquals("Column/Record round robin failed.", expected, target.columnByRecord(target.recordByColumn(i, isIntegral), isIntegral));
            }
        };
        iterate(true);
        iterate(false);
    },

    testXByColumn: function() {
        "use strict";

        assertEquals("XByColumn failed.", -15, this.target.xByColumn(-2));
        assertEquals("XByColumn failed.", -5, this.target.xByColumn(-1));
        assertEquals("XByColumn failed.", 5, this.target.xByColumn(0));
        assertEquals("XByColumn failed.", 15, this.target.xByColumn(1));
        assertEquals("XByColumn failed.", 125, this.target.xByColumn(12));

        assertEquals("XByColumn failed.", -25, this.target.xByColumn(-2.5, false));
        assertEquals("XByColumn failed.", -16, this.target.xByColumn(-1.6, false));
        assertEquals("XByColumn failed.", 1, this.target.xByColumn(0.1, false));
        assertEquals("XByColumn failed.", 18, this.target.xByColumn(1.8, false));
        assertEquals("XByColumn failed.", 122, this.target.xByColumn(12.2, false));

        this.dateScale.firstVisibleRecord = 2;
        assertEquals("XByColumn failed.", -15, this.target.xByColumn(-2));
        assertEquals("XByColumn failed.", -5, this.target.xByColumn(-1));
        assertEquals("XByColumn failed.", 5, this.target.xByColumn(0));
        assertEquals("XByColumn failed.", 15, this.target.xByColumn(1));
        assertEquals("XByColumn failed.", 125, this.target.xByColumn(12));

        assertEquals("XByColumn failed.", -25, this.target.xByColumn(-2.5, false));
        assertEquals("XByColumn failed.", -16, this.target.xByColumn(-1.6, false));
        assertEquals("XByColumn failed.", 1, this.target.xByColumn(0.1, false));
        assertEquals("XByColumn failed.", 18, this.target.xByColumn(1.8, false));
        assertEquals("XByColumn failed.", 122, this.target.xByColumn(12.2, false));

        this.dateScale.firstVisibleRecord = 2.3;
        assertEquals("ByColumn failed.", -18, this.target.xByColumn(-2));
        assertEquals("ByColumn failed.", -8, this.target.xByColumn(-1));
        assertEquals("ByColumn failed.", 2, this.target.xByColumn(0));
        assertEquals("ByColumn failed.", 12, this.target.xByColumn(1));
        assertEquals("ByColumn failed.", 122, this.target.xByColumn(12));

        assertEquals("XByColumn failed.", -28, this.target.xByColumn(-2.5, false));
        assertEquals("XByColumn failed.", -19, this.target.xByColumn(-1.6, false));
        assertEquals("XByColumn failed.", -2, this.target.xByColumn(0.1, false));
        assertEquals("XByColumn failed.", 15, this.target.xByColumn(1.8, false));
        assertEquals("XByColumn failed.", 119, this.target.xByColumn(12.2, false));
    },

    testColumnByX: function() {
        "use strict";

        assertEquals("ColumnByX failed.", -1, this.target.columnByX(-4));
        assertEquals("ColumnByX failed.", -1, this.target.columnByX(-5));
        assertEquals("ColumnByX failed.", -1, this.target.columnByX(-6));
        assertEquals("ColumnByX failed.", -1, this.target.columnByX(-10));
        assertEquals("ColumnByX failed.", -2, this.target.columnByX(-11));
        assertEquals("ColumnByX failed.", 0, this.target.columnByX(0));
        assertEquals("ColumnByX failed.", 0, this.target.columnByX(1));
        assertEquals("ColumnByX failed.", 0, this.target.columnByX(5));
        assertEquals("ColumnByX failed.", 0, this.target.columnByX(6));
        assertEquals("ColumnByX failed.", 1, this.target.columnByX(10));
        assertEquals("ColumnByX failed.", 1, this.target.columnByX(15));
        assertEquals("ColumnByX failed.", 12, this.target.columnByX(125));

        assertEqualsDelta("ColumnByX failed.", -2.5, this.target.columnByX(-25, false), 1E-5);
        assertEqualsDelta("ColumnByX failed.", -1.6, this.target.columnByX(-16, false), 1E-5);
        assertEqualsDelta("ColumnByX failed.", 0.1, this.target.columnByX(1, false), 1E-5);
        assertEqualsDelta("ColumnByX failed.", 1.8, this.target.columnByX(18, false), 1E-5);
        assertEqualsDelta("ColumnByX failed.", 12.2, this.target.columnByX(122, false), 1E-5);

        this.dateScale.firstVisibleRecord = 2;
        assertEquals("ColumnByX failed.", -2, this.target.columnByX(-15));
        assertEquals("ColumnByX failed.", -1, this.target.columnByX(-5));
        assertEquals("ColumnByX failed.", 0, this.target.columnByX(5));
        assertEquals("ColumnByX failed.", 1, this.target.columnByX(15));
        assertEquals("ColumnByX failed.", 12, this.target.columnByX(125));

        assertEqualsDelta("ColumnByX failed.", -2.5, this.target.columnByX(-25, false), 1E-5);
        assertEqualsDelta("ColumnByX failed.", -1.6, this.target.columnByX(-16, false), 1E-5);
        assertEqualsDelta("ColumnByX failed.", 0.1, this.target.columnByX(1, false), 1E-5);
        assertEqualsDelta("ColumnByX failed.", 1.8, this.target.columnByX(18, false), 1E-5);
        assertEqualsDelta("ColumnByX failed.", 12.2, this.target.columnByX(122, false), 1E-5);

        this.dateScale.firstVisibleRecord = 2.3;
        assertEquals("ColumnByX failed.", -2, this.target.columnByX(-18));
        assertEquals("ColumnByX failed.", -1, this.target.columnByX(-8));
        assertEquals("ColumnByX failed.", 0, this.target.columnByX(2));
        assertEquals("ColumnByX failed.", 1, this.target.columnByX(12));
        assertEquals("ColumnByX failed.", 12, this.target.columnByX(122));

        assertEqualsDelta("ColumnByX failed.", -2.5, this.target.columnByX(-28, false), 1E-5);
        assertEqualsDelta("ColumnByX failed.", -1.6, this.target.columnByX(-19, false), 1E-5);
        assertEqualsDelta("ColumnByX failed.", 0.1, this.target.columnByX(-2, false), 1E-5);
        assertEqualsDelta("ColumnByX failed.", 1.8, this.target.columnByX(15, false), 1E-5);
        assertEqualsDelta("ColumnByX failed.", 12.2, this.target.columnByX(119, false), 1E-5);
    },

    testXColumnRoundRobin: function() {
        "use strict";

        var target = this.target;
        var iterate = function(isIntegral) {
            for (var i = -10; i < 20; i += 0.2) {
                var expected = isIntegral ? Math.round(i) : i;
                assertEqualsDelta("Column/X round robin failed.", expected, target.columnByX(target.xByColumn(i, isIntegral), isIntegral), 1E-5);
            }
        };

        iterate(true);
        iterate(false);
    },

    testXByRecord: function() {
        "use strict";

        this.dateScale.firstVisibleRecord = 0;
        assertEquals("XByRecord failed.", -15, this.target.xByRecord(-2));
        assertEquals("XByRecord failed.", -5, this.target.xByRecord(-1));
        assertEquals("XByRecord failed.", 5, this.target.xByRecord(0));
        assertEquals("XByRecord failed.", 15, this.target.xByRecord(1));
        assertEquals("XByRecord failed.", 25, this.target.xByRecord(2));

        assertEquals("XByRecord failed.", -25, this.target.xByRecord(-2.5, false));
        assertEquals("XByRecord failed.", -16, this.target.xByRecord(-1.6, false));
        assertEquals("XByRecord failed.", 1, this.target.xByRecord(0.1, false));
        assertEquals("XByRecord failed.", 18, this.target.xByRecord(1.8, false));
        assertEquals("XByRecord failed.", 122, this.target.xByRecord(12.2, false));

        this.dateScale.firstVisibleRecord = 1;
        assertEquals("XByRecord failed.", -15, this.target.xByRecord(-1));
        assertEquals("XByRecord failed.", -5, this.target.xByRecord(0));
        assertEquals("XByRecord failed.", 5, this.target.xByRecord(1));

        this.dateScale.firstVisibleRecord = 2.3;
        assertEquals("XByRecord failed.", -38, this.target.xByRecord(-2));
        assertEquals("XByRecord failed.", -28, this.target.xByRecord(-1));
        assertEquals("XByRecord failed.", -18, this.target.xByRecord(0));
        assertEquals("XByRecord failed.", -8, this.target.xByRecord(1));
        assertEquals("XByRecord failed.", 102, this.target.xByRecord(12));

        assertEquals("XByRecord failed.", -48, this.target.xByRecord(-2.5, false));
        assertEquals("XByRecord failed.", -39, this.target.xByRecord(-1.6, false));
        assertEquals("XByRecord failed.", -22, this.target.xByRecord(0.1, false));
        assertEquals("XByRecord failed.", -5, this.target.xByRecord(1.8, false));
        assertEquals("XByRecord failed.", 99, this.target.xByRecord(12.2, false));
    },

    testRecordByX: function() {
        "use strict";

        this.dateScale.firstVisibleRecord = 0;
        assertEquals("RecordByX failed.", -2, this.target.recordByX(-11));
        assertEquals("RecordByX failed.", -1, this.target.recordByX(-10));
        assertEquals("RecordByX failed.", -1, this.target.recordByX(-6));
        assertEquals("RecordByX failed.", -1, this.target.recordByX(-5));
        assertEquals("RecordByX failed.", -1, this.target.recordByX(-4));
        assertEquals("RecordByX failed.", 0, this.target.recordByX(0));
        assertEquals("RecordByX failed.", 0, this.target.recordByX(5));
        assertEquals("RecordByX failed.", 1, this.target.recordByX(10));
        assertEquals("RecordByX failed.", 1, this.target.recordByX(11));

        this.dateScale.firstVisibleRecord = 1;
        assertEquals("RecordByX failed.", -1, this.target.recordByX(-11));
        assertEquals("RecordByX failed.", 0, this.target.recordByX(-5));
        assertEquals("RecordByX failed.", 1, this.target.recordByX(5));
        assertEquals("RecordByX failed.", 2, this.target.recordByX(13));
        assertEquals("RecordByX failed.", 3, this.target.recordByX(21));

        this.dateScale.firstVisibleRecord = 2.3;
        assertEquals("RecordByX failed.", 0, this.target.recordByX(-18));
        assertEquals("RecordByX failed.", 1, this.target.recordByX(-8));
        assertEquals("RecordByX failed.", 2, this.target.recordByX(2));
        assertEquals("RecordByX failed.", 3, this.target.recordByX(12));
        assertEquals("RecordByX failed.", 14, this.target.recordByX(122));

        assertEqualsDelta("RecordByX failed.", -0.5, this.target.recordByX(-28, false), 1E-5);
        assertEqualsDelta("RecordByX failed.", 0.4, this.target.recordByX(-19, false), 1E-5);
        assertEqualsDelta("RecordByX failed.", 2.1, this.target.recordByX(-2, false), 1E-5);
        assertEqualsDelta("RecordByX failed.", 3.8, this.target.recordByX(15, false), 1E-5);
        assertEqualsDelta("RecordByX failed.", 14.2, this.target.recordByX(119, false), 1E-5);
    },

    testXRecordRoundRobin: function() {
        "use strict";

        var target = this.target;
        var iterate = function(isIntegral) {
            for (var i = -10; i < 20; i += 0.2) {
                var expected = isIntegral ? Math.trunc(i) : i;
                assertEqualsDelta("Record/X round robin failed.", expected, target.recordByX(target.xByRecord(i, isIntegral), isIntegral), 1E-5);
            }
        };
        iterate(true);
        iterate(false);
    },

    testDateByRecord: function() {
        "use strict";

        assertEquals("DateByRecord failed.", this.dates[0], this.target.dateByRecord(0));
        assertEquals("DateByRecord failed.", this.dates[0].addMinutes(-1), this.target.dateByRecord(-1));
        assertEquals("DateByRecord failed.", this.dates[0].addMinutes(-2), this.target.dateByRecord(-2));
        assertEquals("DateByRecord failed.", this.dates[1], this.target.dateByRecord(1));
        assertEquals("DateByRecord failed.", this.dates[this.dates.length - 1].addMinutes(1), this.target.dateByRecord(10));
        assertEquals("DateByRecord failed.", this.dates[this.dates.length - 1].addMinutes(2), this.target.dateByRecord(11));
    },

    testRecordByDate: function() {
        "use strict";

        assertEquals("RecordByDate failed.", 0, this.target.recordByDate(this.dates[0]));
        assertEquals("RecordByDate failed.", 1, this.target.recordByDate(this.dates[1]));
        assertEquals("RecordByDate failed.", 0, this.target.recordByDate(this.dates[0].addSeconds(10)));
        assertEquals("RecordByDate failed.", 1, this.target.recordByDate(this.dates[0].addSeconds(61)));
        assertEquals("RecordByDate failed.", -1, this.target.recordByDate(this.dates[0].addMinutes(-1)));
        assertEquals("RecordByDate failed.", -2, this.target.recordByDate(this.dates[0].addMinutes(-2)));
        assertEquals("RecordByDate failed.", 11, this.target.recordByDate(this.dates[9].addMinutes(2)));
    },

    testRecordDateRoundRobin: function() {
        "use strict";

        for (var i = -10; i < 20; i++) {
            assertEquals("Record/Date round robin failed.", i, this.target.recordByDate(this.target.dateByRecord(i)));
        }
    },

    testDateByColumn: function() {
        "use strict";

        this.dateScale.firstVisibleRecord = 0;
        assertEquals("DateByColumn failed.", this.dates[0], this.target.dateByColumn(0));
        assertEquals("DateByColumn failed.", this.dates[1], this.target.dateByColumn(1));
        assertEquals("DateByColumn failed.", this.dates[0].addMinutes(-1), this.target.dateByColumn(-1));
        assertEquals("DateByColumn failed.", this.dates[9].addMinutes(2), this.target.dateByColumn(11));

        this.dateScale.firstVisibleRecord = 1;
        assertEquals("DateByColumn failed.", this.dates[0].addMinutes(-1), this.target.dateByColumn(-2));
        assertEquals("DateByColumn failed.", this.dates[0], this.target.dateByColumn(-1));
        assertEquals("DateByColumn failed.", this.dates[1], this.target.dateByColumn(0));
        assertEquals("DateByColumn failed.", this.dates[3], this.target.dateByColumn(2));
    },

    testColumnByDate: function() {
        "use strict";

        this.dateScale.firstVisibleRecord = 0;
        assertEquals("ColumnByDate failed.", 0, this.target.columnByDate(this.dates[0]));
        assertEquals("ColumnByDate failed.", 1, this.target.columnByDate(this.dates[1]));
        assertEquals("ColumnByDate failed.", 2, this.target.columnByDate(this.dates[2]));
        assertEquals("ColumnByDate failed.", 1, this.target.columnByDate(this.dates[1].addSeconds(10)));
        assertEquals("ColumnByDate failed.", 2, this.target.columnByDate(this.dates[1].addSeconds(31)));
        assertEquals("ColumnByDate failed.", 2, this.target.columnByDate(this.dates[1].addSeconds(59)));
        assertEquals("ColumnByDate failed.", -1, this.target.columnByDate(this.dates[0].addMinutes(-1)));
    },

    testColumnDateRoundRobin: function() {
        "use strict";

        this.dateScale.firstVisibleRecord = 1;
        for (var i = -10; i < 20; i++) {
            assertEquals("Column/Date round robin failed.", i, this.target.columnByDate(this.target.dateByColumn(i)));
        }
    },

    testDateByX: function() {
        "use strict";

        this.dateScale.firstVisibleRecord = 0;
        assertEquals("DateByX failed.", this.dates[0].addSeconds(-30), this.target.dateByX(0));
        assertEquals("DateByX failed.", this.dates[0], this.target.dateByX(5));
        assertEquals("DateByX failed.", this.dates[1], this.target.dateByX(15));
        assertEquals("DateByX failed.", this.dates[1].addSeconds(6), this.target.dateByX(16));
        assertEquals("DateByX failed.", this.dates[1].addSeconds(30), this.target.dateByX(20));


        this.dateScale.firstVisibleRecord = 1;
        assertEquals("DateByX failed.", this.dates[0].addSeconds(30), this.target.dateByX(0));
        assertEquals("DateByX failed.", this.dates[0].addSeconds(36), this.target.dateByX(1));
        assertEquals("DateByX failed.", this.dates[1], this.target.dateByX(5));
        assertEquals("DateByX failed.", this.dates[2], this.target.dateByX(15));
    },

    testXByDate: function() {
        "use strict";

        this.dateScale.firstVisibleRecord = 0;
        assertEquals("XByDate failed.", 0, this.target.xByDate(this.dates[0].addSeconds(-30)));
        assertEquals("XByDate failed.", 5, this.target.xByDate(this.dates[0]));
        assertEquals("XByDate failed.", 15, this.target.xByDate(this.dates[1]));
        assertEquals("XByDate failed.", 16, this.target.xByDate(this.dates[1].addSeconds(6)));
        assertEquals("XByDate failed.", 20, this.target.xByDate(this.dates[1].addSeconds(30)));
        assertEquals("XByDate failed.", 21, this.target.xByDate(this.dates[1].addSeconds(36)));
        assertEquals("XByDate failed.", 25, this.target.xByDate(this.dates[2]));
    },

    testXDateRoundRobin: function() {
        "use strict";

        this.dateScale.firstVisibleRecord = 0;
        for (var i = -10; i < 100; i += 0.5) {
            assertEquals("X/Date round robin failed.", Math.round(i), this.target.xByDate(this.target.dateByX(i)));
        }
    },

    testYByValue: function() {
        "use strict";

        assertEquals("YByValue failed.", 100, this.target.yByValue(0));
        assertEquals("YByValue failed.", 50, this.target.yByValue(50));
        assertEquals("YByValue failed.", 40, this.target.yByValue(60));
        assertEquals("YByValue failed.", 0, this.target.yByValue(100));
        assertEquals("YByValue failed.", -10, this.target.yByValue(110));
        assertEquals("YByValue failed.", 110, this.target.yByValue(-10));
    },

    testValueByY: function() {
        "use strict";

        assertEquals("ValueByY failed.", 0, this.target.valueByY(100));
        assertEquals("ValueByY failed.", 50, this.target.valueByY(50));
        assertEquals("ValueByY failed.", 60, this.target.valueByY(40));
        assertEquals("ValueByY failed.", 100, this.target.valueByY(0));
        assertEquals("ValueByY failed.", 110, this.target.valueByY(-10));
        assertEquals("ValueByY failed.", -10, this.target.valueByY(110));
    }
});