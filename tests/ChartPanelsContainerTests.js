/**
 * Copyright Modulus Financial Engineering, Inc. Scottsdale, AZ http://www.modulusfe.com
 */

/* global StockChartX, assertEquals, assertNotNull, assertException, assertNoException, assertSame, assertArray */

//noinspection JSUnusedGlobalSymbols,JSHint
ChartPanelsContainerTestCase = TestCase('ChartPanelsContainerTestCase', {
    setUp: function () {
        "use strict";

        this.expectedChart = new StockChartX.Chart({container: 'body', showToolbar: false});
        this.target = this.expectedChart.chartPanelsContainer;
    },

    testInvalidConstructor: function () {
        "use strict";

        assertException("An exception must be thrown on attempt to create ChartPanelsContainer without configuration object.", function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.ChartPanelsContainer();
        });
        assertException("An exception must be thrown on attempt to create ChartPanelsContainer without configuration object.", function() {
            new StockChartX.ChartPanelsContainer(null); // jshint ignore:line
        });
        assertException("An exception must be thrown on attempt to create ChartPanelsContainer without chart.", function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.ChartPanelsContainer({});
        });
        assertException("An exception must be thrown on attempt to create ChartPanelsContainer with non-chart.", function() {
            new StockChartX.ChartPanelsContainer({chart: null}); // jshint ignore:line
        });
        assertException("An exception must be thrown on attempt to create ChartPanelsContainer with non-chart.", function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.ChartPanelsContainer({chart: ''});
        });

        var chart = this.expectedChart;
        assertNoException("An exception must not be thrown on attempt to create ChartPanelsContainer with valid config.", function() {
            new StockChartX.ChartPanelsContainer({ // jshint ignore:line
                chart: chart
            });
        });
    },

    testConstructor: function() {
        "use strict";

        this.target = new StockChartX.ChartPanelsContainer({
            chart: this.expectedChart
        });
        assertSame("Chart is not initialized properly.", this.expectedChart, this.target.chart);
        assertArray("Panels must be an array.", this.target.panels);
        assertEquals("An array of panels must contain 1 panel.", 1, this.target.panels.length);
        assertEquals("Chart panel's height ratio must be 1.", 1, this.target.panels[0].heightRatio);
        //noinspection JSAccessibilityCheck
        assertNotNull("An array of chart panel splitters must be created.", this.target._splitters);
        //noinspection JSAccessibilityCheck
        assertEquals("An array of chart panel splitters must be empty.", 0, this.target._splitters.length);
        assertEquals("New panel height ratio is not initialized properly.", 0.2, this.target.newPanelHeightRatio);
    },

    testNewPanelHeightRatio: function() {
        "use strict";

        var target = this.target;
        assertException("An exception should be thrown on attempt to set height ratio to a non-number.", function() {
            target.newPanelHeightRatio = null;
        });
        assertException("An exception should be thrown on attempt to set height ratio to a non-number.", function() {
            target.newPanelHeightRatio = 'abc';
        });
        assertException("An exception should be thrown on attempt to set height ratio to a NaN.", function() {
            target.newPanelHeightRatio = NaN;
        });
        assertException("An exception should be thrown on attempt to set height ratio to an Infinity.", function() {
            target.newPanelHeightRatio = Infinity;
        });
        assertException("An exception should be thrown on attempt to set height ratio to a a negative number.", function() {
            target.newPanelHeightRatio = -1;
        });
        assertException("An exception should be thrown on attempt to set height ratio to a number greater than maxHeightRatio.", function() {
            target.newPanelHeightRatio = 1.1;
        });

        this.target.newPanelHeightRatio = 0.5;
        assertEquals("NewPanelHeightRatio is not set properly.", 0.5, this.target.newPanelHeightRatio);
    },

    testRemovePanel: function() {
        "use strict";

        var target = this.target;
        assertException("An exception should be thrown on attempt to remove main panel", function() {
            target.removePanel(0);
        });
        assertException("An exception should be thrown on attempt to remove main panel", function() {
            target.removePanel(target.chart.mainPanel);
        });

        target.addPanel();
        target.removePanel(1);
        assertEquals("Panel is not removed properly.", 1, target.panels.length);

        var panel = target.addPanel();
        target.removePanel(panel);
        assertEquals("Panel is not removed properly.", 1, target.panels.length);
    },

    testIncorrectMovePanel: function() {
        "use strict";

        var pnl1 = this.target.panels[0];
        var pnl2 = this.target.addPanel();

        var target = this.target;
        assertException("An exception should be thrown if offset is not specified.", function() {
            //noinspection JSCheckFunctionSignatures
            target.movePanel(pnl1);
        });
        assertException("An exception should be thrown if offset is not a number.", function() {
            //noinspection JSCheckFunctionSignatures
            target.movePanel(pnl1, 'abc');
        });
        assertException("An exception should be thrown if offset is not a finite number.", function() {
            target.movePanel(pnl1, Infinity);
        });
        assertException("An exception should be thrown if offset is not a finite number.", function() {
            target.movePanel(pnl1, -Infinity);
        });
        assertException("An exception should be thrown if offset is not a finite number.", function() {
            target.movePanel(pnl1, NaN);
        });

        this.target.movePanel(pnl1, 0);
        assertEquals("Panel should not be moved if offset is 0.", [pnl1, pnl2], this.target.panels);
    },

    testMovePanelUp: function() {
        "use strict";

        var pnl1 = this.target.panels[0];
        var pnl2 = this.target.addPanel();
        var pnl3 = this.target.addPanel();

        this.target.movePanel(pnl1, 1);
        assertEquals("Panel is not moved properly.", [pnl1, pnl2, pnl3], this.target.panels);

        this.target.movePanel(pnl2, 1);
        assertEquals("Panel is not moved properly.", [pnl2, pnl1, pnl3], this.target.panels);

        this.target.movePanel(pnl1, 3);
        assertEquals("Panel is not moved properly.", [pnl1, pnl2, pnl3], this.target.panels);

        this.target.movePanel(pnl3, 2);
        assertEquals("Panel is not moved properly.", [pnl3, pnl1, pnl2], this.target.panels);
    },

    testMovePanelDown: function() {
        "use strict";

        var pnl1 = this.target.panels[0];
        var pnl2 = this.target.addPanel();
        var pnl3 = this.target.addPanel();

        this.target.movePanel(pnl3, -1);
        assertEquals("Panel is not moved properly.", [pnl1, pnl2, pnl3], this.target.panels);

        this.target.movePanel(pnl2, -1);
        assertEquals("Panel is not moved properly.", [pnl1, pnl3, pnl2], this.target.panels);

        this.target.movePanel(pnl1, -2);
        assertEquals("Panel is not moved properly.", [pnl3, pnl2, pnl1], this.target.panels);
    }
});