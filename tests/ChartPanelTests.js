/**
 * Copyright Modulus Financial Engineering, Inc. Scottsdale, AZ http://www.modulusfe.com
 */

/* global StockChartX, assertEquals, assertException, assertNoException, assertSame, assertTrue */

//noinspection JSUnusedGlobalSymbols,JSHint
ChartPanelTestCase = TestCase('ChartPanelTestCase', {
    setUp: function() {
        "use strict";

        this.expectedChart = new StockChartX.Chart({container: 'body', showToolbar: false});
        this.target = new StockChartX.ChartPanel({
            chartPanelsContainer: this.expectedChart.chartPanelsContainer
        });
    },

    testInvalidConstructors: function() {
        "use strict";

        assertException("An exception should be thrown on attempt to create chart panel without configuration.", function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.ChartPanel();
        });
        assertException("An exception should be thrown on attempt to create chart panel with invalid configuration.", function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.ChartPanel('');
        });
        assertException("An exception should be thrown on attempt to create chart panel without panels container.", function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.ChartPanel({});
        });
        assertException("An exception should be thrown on attempt to create date scale with non-panels container.", function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.ChartPanel({chartPanelsContainer: ""});
        });
    },

    testConstructor: function() {
        "use strict";

        var chart = this.expectedChart;
        assertNoException("An exception should not be thrown on attempt to create chart panel with valid configuration", function() {
            new StockChartX.ChartPanel({ // jshint ignore:line
                chartPanelsContainer: chart.chartPanelsContainer
            });
        });

        assertSame("Chart panels container is not initialized properly.", this.expectedChart.chartPanelsContainer, this.target.chartPanelsContainer);
        assertEquals("MinHeightRatio is not initialized properly.", 0.05, this.target.minHeightRatio);
        assertEquals("MaxHeightRatio is not initialized properly.", 1, this.target.maxHeightRatio);
        assertEquals("HeightRatio is not initialized properly.", 1, this.target.heightRatio);
        assertEquals("Move direction is not initialized properly.", StockChartX.PanelMoveDirection.HORIZONTAL, this.target.moveDirection);
        assertEquals("Move kind is not initialized properly.", StockChartX.PanelMoveKind.AUTOSCALED, this.target.moveKind);
    },

    testExtendedConstructor: function() {
        "use strict";

        var target = null;
        var chart = this.expectedChart;
        assertNoException("An exception should not be thrown on attempt to create chart panel with valid configuration", function() {
            //noinspection JSCheckFunctionSignatures
            target = new StockChartX.ChartPanel({
                chartPanelsContainer: chart.chartPanelsContainer,
                minHeightRatio: 0.1,
                maxHeightRatio: 0.9,
                heightRatio: 0.5,
                moveDirection: "any",
                moveKind: "normal"
            });
        });

        assertEquals('MinHeightRatio is not initialized properly.', 0.1, target.minHeightRatio);
        assertEquals('MaxHeightRatio is not initialized properly.', 0.9, target.maxHeightRatio);
        assertEquals('HeightRatio is not initialized properly.', 0.5, target.heightRatio);
        assertEquals('Move direction is not initialized properly.', 'any', target.moveDirection);
        assertEquals('Move kind is not initialized properly.', 'normal', target.moveKind);
    },

    testMinHeightRatio: function() {
        "use strict";

        var target = this.target;
        assertException("An exception should be thrown on attempt to set min height ratio to a non-number.", function() {
            //noinspection JSCheckFunctionSignatures
            target.minHeightRatio = null;
        });
        assertException("An exception should be thrown on attempt to set min height ratio to a non-number.", function() {
            //noinspection JSCheckFunctionSignatures
            target.minHeightRatio = '';
        });
        assertException("An exception should be thrown on attempt to set min height ratio to a NaN.", function() {
            target.minHeightRatio = NaN;
        });
        assertException("An exception should be thrown on attempt to set min height ratio to an Infinity.", function() {
            target.minHeightRatio = Infinity;
        });
        assertException("An exception should be thrown on attempt to set min height ratio to a a negative number.", function() {
            target.minHeightRatio = -1;
        });
        assertException("An exception should be thrown on attempt to set min height ratio to a number greater than maxHeightRatio.", function() {
            target.minHeightRatio = 1.1;
        });

        var expectedMinRatio = 0.5;
        this.target.heightRatio = 0.3;
        this.target.minHeightRatio = expectedMinRatio;
        assertEquals("MinHeightRatio is not set properly.", expectedMinRatio, this.target.minHeightRatio);
        assertEquals("Height ratio is not updated to min height ratio.", expectedMinRatio, this.target.heightRatio);
    },

    testMaxHeightRatio: function() {
        "use strict";

        var target = this.target;
        assertException("An exception should be thrown on attempt to set max height ratio to a non-number.", function() {
            //noinspection JSCheckFunctionSignatures
            target.maxHeightRatio = null;
        });
        assertException("An exception should be thrown on attempt to set max height ratio to a non-number.", function() {
            //noinspection JSCheckFunctionSignatures
            target.maxHeightRatio = '';
        });
        assertException("An exception should be thrown on attempt to set max height ratio to a NaN.", function() {
            target.maxHeightRatio = NaN;
        });
        assertException("An exception should be thrown on attempt to set max height ratio to an Infinity.", function() {
            target.maxHeightRatio = Infinity;
        });
        assertException("An exception should be thrown on attempt to set max height ratio to a a negative number.", function() {
            target.maxHeightRatio = -1;
        });
        assertException("An exception should be thrown on attempt to set max height ratio to a number less than minHeightRatio.", function() {
            target.maxHeightRatio = 0.04;
        });

        var expectedMaxRatio = 0.5;
        this.target._heightRatio = 1;
        this.target.maxHeightRatio = expectedMaxRatio;
        assertEquals("MaxHeightRatio is not set properly.", expectedMaxRatio, this.target.maxHeightRatio);
        assertEquals("Height ratio is not updated to max height ratio.", expectedMaxRatio, this.target.heightRatio);
    },

    testHeightRatio: function() {
        "use strict";

        var target = this.target;
        assertException("An exception should be thrown on attempt to set height ratio to a non-number.", function() {
            //noinspection JSCheckFunctionSignatures
            target.heightRatio = null;
        });
        assertException("An exception should be thrown on attempt to set height ratio to a non-number.", function() {
            //noinspection JSCheckFunctionSignatures
            target.heightRatio = '';
        });
        assertException("An exception should be thrown on attempt to set height ratio to a NaN.", function() {
            target.heightRatio = NaN;
        });
        assertException("An exception should be thrown on attempt to set height ratio to an Infinity.", function() {
            target.heightRatio = Infinity;
        });
        assertException("An exception should be thrown on attempt to set height ratio to a a negative number.", function() {
            target.heightRatio = -1;
        });
        assertException("An exception should be thrown on attempt to set height ratio to a number greater than maxHeightRatio.", function() {
            target.heightRatio = 1.1;
        });
        assertException("An exception should be thrown on attempt to set height ratio to a number less than minHeightRatio.", function() {
            target.heightRatio = 0.04;
        });

        this.target.heightRatio = 0.5;
        assertEquals("HeightRatio is not set properly.", 0.5, this.target.heightRatio);
    },

    testMoveDirection: function() {
        "use strict";

        var expected = "vertical";
        this.target.moveDirection = expected;

        assertEquals("Move direction is not set properly.", expected, this.target.moveDirection);
    },

    testMoveKind: function() {
        "use strict";

        var expected = "normal";
        this.target.moveKind = expected;

        assertEquals("Move kind is not set properly.", expected, this.target.moveKind);
    },

    testTheme: function() {
        "use strict";

        var expected = {line: 1},
            isEventRaised = false;

        this.expectedChart.on(StockChartX.PanelEvent.THEME_CHANGED, function() {
            isEventRaised = true;
        });
        this.target.theme = expected;

        assertSame("Theme is not set properly.", expected, this.target.theme);
        assertTrue("ThemeChanged event is not raised.", isEventRaised);
    },

    testXGrid: function() {
        "use strict";

        var isEventRaised = false;

        this.target.xGridVisible = false;
        this.expectedChart.on(StockChartX.PanelEvent.X_GRID_VISIBLE_CHANGED, function() {
            isEventRaised = true;
        });
        this.target.xGridVisible = true;

        assertTrue("XGridVisible is not set properly.", this.target.xGridVisible);
        assertTrue("XGridVisibleChanged event is not raised.", isEventRaised);
    },

    testYGrid: function() {
        "use strict";

        var isEventRaised = false;

        this.target.yGridVisible = false;
        this.expectedChart.on(StockChartX.PanelEvent.Y_GRID_VISIBLE_CHANGED, function() {
            isEventRaised = true;
        });
        this.target.yGridVisible = true;

        assertTrue("YGridVisible is not set properly.", this.target.yGridVisible);
        assertTrue("YGridVisibleChanged event is not raised.", isEventRaised);
    },

    testAddPlot: function() {
        "use strict";

        var target = this.target;
        assertException("An exception must be thrown on attempt to add non-plot.", function() {
            //noinspection JSCheckFunctionSignatures
            target.addPlot();
        });

        var plot = new StockChartX.LinePlot();
        //noinspection JSCheckFunctionSignatures
        target.addPlot(plot);

        assertEquals("Plot is not added properly.", [plot], target.plots);
        assertSame("Chart panel is not assigned to the plot.", target, plot.chartPanel);
    },

    testAddPlots: function() {
        "use strict";

        var plot1 = new StockChartX.LinePlot(),
            plot2 = new StockChartX.LinePlot();

        this.target.addPlot([plot1, plot2, plot1]);

        assertEquals("Plots are not added properly.", [plot1, plot2], this.target.plots);
        assertSame("Chart panel is not assigned to the plot.", this.target, plot1.chartPanel);
        assertSame("Chart panel is not assigned to the plot.", this.target, plot2.chartPanel);
    },

    testRemovePlot: function() {
        "use strict";

        var plot1 = new StockChartX.LinePlot(),
            plot2 = new StockChartX.LinePlot();

        //noinspection JSCheckFunctionSignatures
        this.target.addPlot(plot1);
        //noinspection JSCheckFunctionSignatures
        this.target.addPlot(plot2);

        //noinspection JSCheckFunctionSignatures
        this.target.removePlot(plot2);
        assertEquals("Plot is not removed properly.", [plot1], this.target.plots);

        //noinspection JSCheckFunctionSignatures
        this.target.removePlot(plot1);
        assertEquals("Plot is not removed properly.", [], this.target.plots);
    },

    testRemovePlots: function() {
        "use strict";

        var plot1 = new StockChartX.LinePlot(),
            plot2 = new StockChartX.LinePlot();

        //noinspection JSCheckFunctionSignatures
        this.target.addPlot(plot1);
        //noinspection JSCheckFunctionSignatures
        this.target.addPlot(plot2);

        this.target.removePlot([plot1, plot2]);

        assertEquals("Plots are not removed properly.", [], this.target.plots);
    }
});