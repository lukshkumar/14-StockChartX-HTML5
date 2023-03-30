/**
 * Copyright Modulus Financial Engineering, Inc. Scottsdale, AZ http://www.modulusfe.com
 */

/* global StockChartX, SimpleMovingAverage, TASDKConst, assertEquals, assertNotNull, assertTrue, assertFalse, assertException, assertNoException, assertNull, assertSame */

//noinspection JSUnusedGlobalSymbols,JSHint
IndicatorTestCase = TestCase('IndicatorTestCase', {
    setUp: function() {
        "use strict";

        this.chart = new StockChartX.Chart({container: 'body', showToolbar: false});
        this.target = new StockChartX.Indicator({
            taIndicator: SimpleMovingAverage
        });
    },

    testInvalidConfig: function() {
        "use strict";

        assertException("An exception should be thrown if config is not specified.", function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.Indicator();
        });
        assertException("An exception should be thrown if TA indicator is not specified.", function() {
            //noinspection JSCheckFunctionSignatures,JSHint
            new StockChartX.Indicator({});
        });
    },

    testConstructor: function() {
        "use strict";

        var expectedParameters = {
            Source: "High",
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        var target = new StockChartX.Indicator({
            chart: this.chart,
            taIndicator: SimpleMovingAverage,
            panelHeightRatio: 0.2,
            parameters: {
                Source: 'High'
            }
        });

        assertSame("Chart is not initialized properly.", this.chart, target.chart);
        assertEquals("TA indicator is not initialized properly.", SimpleMovingAverage, target.taIndicator);
        assertEquals("Panel's height ratio is not initialized properly.", 0.2, target.panelHeightRatio);
        assertEquals("Parameters are not initialized properly.", expectedParameters, target.parameters);
    },

    testChart: function() {
        "use strict";

        this.target.chart = null;
        assertNull("Chart is not set properly.", this.target.chart);

        this.target.chart = this.chart;
        assertSame("Chart is not set properly.", this.chart, this.target.chart);
    },

    testParameterValue: function() {
        "use strict";

        var param = "some parameter";
        var expected = "some value";

        this.target.setParameterValue(param, expected);
        assertEquals("Parameter value is not set properly.", expected, this.target.getParameterValue(param));
    },

    testBollingerBands: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: BollingerBands}); // jshint ignore:line

        var expectedFields = ["Bollinger Band Top", "Bollinger Band Median", "Bollinger Band Bottom"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: ".close",
            Periods: 14,
            'Standard Deviations': 2,
            'Moving Average Type': TASDKConst.simpleMovingAverage,
            'Line Color': '#FF0000',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID,
            'Line 2 Color': '#FFFFFF',
            'Line 2 Width': 1,
            'Line 2 Style': StockChartX.LineStyle.SOLID,
            'Line 3 Color': '#00FF00',
            'Line 3 Width': 1,
            'Line 3 Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertTrue("IsOverlay must be true.", target.isOverlay);
    },

    testMovingAverageEnvelope: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: MovingAverageEnvelope}); // jshint ignore:line

        var expectedFields = ["Envelope Top", "Envelope Median", "Envelope Bottom"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: ".close",
            Periods: 14,
            Shift: 5,
            'Moving Average Type': TASDKConst.simpleMovingAverage,
            'Line Color': '#FF0000',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID,
            'Line 2 Color': '#FFFFFF',
            'Line 2 Width': 1,
            'Line 2 Style': StockChartX.LineStyle.SOLID,
            'Line 3 Color': '#00FF00',
            'Line 3 Width': 1,
            'Line 3 Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertTrue("IsOverlay must be true.", target.isOverlay);
    },

    testHighLowBands: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: HighLowBands}); // jshint ignore:line

        var expectedFields = ["High Low Bands Top", "High Low Bands Median", "High Low Bands Bottom"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            'Line Color': '#FF0000',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID,
            'Line 2 Color': '#FFFFFF',
            'Line 2 Width': 1,
            'Line 2 Style': StockChartX.LineStyle.SOLID,
            'Line 3 Color': '#00FF00',
            'Line 3 Width': 1,
            'Line 3 Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertTrue("IsOverlay must be true.", target.isOverlay);
    },

    testFractalChaosBands: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: FractalChaosBands}); // jshint ignore:line

        var expectedFields = ["Fractal High", "Fractal Low"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            'Line Color': '#FF0000',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID,
            'Line 2 Color': '#00FF00',
            'Line 2 Width': 1,
            'Line 2 Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertTrue("IsOverlay must be true.", target.isOverlay);
    },

    testPrimeNumberBands: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: PrimeNumberBands}); // jshint ignore:line

        var expectedFields = ["Prime Bands Top", "Prime Bands Bottom"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            'Line Color': '#FF0000',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID,
            'Line 2 Color': '#00FF00',
            'Line 2 Width': 1,
            'Line 2 Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertTrue("IsOverlay must be true.", target.isOverlay);
    },

    testKeltnerChannel: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: KeltnerChannel}); // jshint ignore:line

        var expectedFields = ["Keltner Top", "Keltner Median", "Keltner Bottom"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            Shift: 5,
            'Moving Average Type': TASDKConst.simpleMovingAverage,
            'Line Color': '#FF0000',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID,
            'Line 2 Color': '#FFFFFF',
            'Line 2 Width': 1,
            'Line 2 Style': StockChartX.LineStyle.SOLID,
            'Line 3 Color': '#00FF00',
            'Line 3 Width': 1,
            'Line 3 Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testSTARC: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: STARC}); // jshint ignore:line

        var expectedFields = ["STARC Top", "STARC Median", "STARC Bottom"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            Shift: 5,
            'Moving Average Type': TASDKConst.simpleMovingAverage,
            'Line Color': '#FF0000',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID,
            'Line 2 Color': '#FFFFFF',
            'Line 2 Width': 1,
            'Line 2 Style': StockChartX.LineStyle.SOLID,
            'Line 3 Color': '#00FF00',
            'Line 3 Width': 1,
            'Line 3 Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testHighMinusLow: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: HighMinusLow}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertTrue("IsOverlay must be true.", target.isOverlay);
    },

    testMedianPrice: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: MedianPrice}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertTrue("IsOverlay must be true.", target.isOverlay);
    },

    testTypicalPrice: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: TypicalPrice}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertTrue("IsOverlay must be true.", target.isOverlay);
    },

    testWeightedClose: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: WeightedClose}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertTrue("IsOverlay must be true.", target.isOverlay);
    },

    testVolumeROC: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: VolumeROC}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.VOLUME,
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testPriceROC: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: PriceROC}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testStandardDeviations: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: StandardDeviation}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Standard Deviations': 2,
            'Moving Average Type': TASDKConst.simpleMovingAverage,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testHHV: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: HHV}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testLLV: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: LLV}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testMoneyFlowIndex: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: MoneyFlowIndex}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testTradeVolumeIndex: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: TradeVolumeIndex}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            'Min Tick Value': 0.5,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testSwingIndex: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: SwingIndex}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            'Limit Move Value': 0.5,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testAccumulativeSwingIndex: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: AccumulativeSwingIndex}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            'Limit Move Value': 0.5,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testRelativeStrengthIndex: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: RelativeStrengthIndex}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testComparativeRelativeStrengthIndex: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: ComparativeRelativeStrength}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            'Source 2': StockChartX.DataSeriesSuffix.OPEN,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testPriceVolumeTrend: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: PriceVolumeTrend}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testPositiveVolumeIndex: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: PositiveVolumeIndex}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testNegativeVolumeIndex: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: NegativeVolumeIndex}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testPerformanceIndex: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: PerformanceIndex}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testOnBalanceVolume: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: OnBalanceVolume}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testMassIndex: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: MassIndex}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testChaikinMoneyFlow: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: ChaikinMoneyFlow}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testCommodityChannelIndex: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: CommodityChannelIndex}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testStochasticMomentumIndex: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: StochasticMomentumIndex}); // jshint ignore:line

        var expectedFields = ["%D", "%K"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            '%K Periods': 13,
            '%K Smoothing': 25,
            '%K Double Smoothing': 2,
            '%D Periods': 9,
            'Moving Average Type': TASDKConst.simpleMovingAverage,
            '%D Moving Average Type': TASDKConst.simpleMovingAverage,
            'Line Color': '#FF0000',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID,
            'Line 2 Color': '#00FF00',
            'Line 2 Width': 1,
            'Line 2 Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testHistoricalVolatility: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: HistoricalVolatility}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Bar History': 10,
            'Standard Deviations': 2,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testElderForceIndex: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: ElderForceIndex}); // jshint ignore:line

        var expectedFields = ["Indicator", "Indicator Signal"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            'Line Color': '#FF0000',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID,
            'Line 2 Color': '#00FF00',
            'Line 2 Width': 1,
            'Line 2 Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testElderThermometer: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: ElderThermometer}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testMarketFacilitationIndex: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: MarketFacilitationIndex}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testQStick: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: QStick}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            'Moving Average Type': TASDKConst.simpleMovingAverage,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testGopalakrishnanRangeIndex: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: GopalakrishnanRangeIndex}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testIntradayMomentumIndex: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: IntradayMomentumIndex}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testRAVI: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: RAVI}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            'Short Cycle': 9,
            'Long Cycle': 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testRandomWalkIndex: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: RandomWalkIndex}); // jshint ignore:line

        var expectedFields = ["Indicator High", "Indicator Low"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            'Line Color': '#FF0000',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID,
            'Line 2 Color': '#00FF00',
            'Line 2 Width': 1,
            'Line 2 Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testTwiggsMoneyFlow: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: TwiggsMoneyFlow}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testLinearRegressionRSquared: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: LinearRegressionRSquared}); // jshint ignore:line

        var expectedFields = ["RSquared"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testLinearRegressionForecast: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: LinearRegressionForecast}); // jshint ignore:line

        var expectedFields = ["Forecast"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertTrue("IsOverlay must be true.", target.isOverlay);
    },

    testLinearRegressionSlope: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: LinearRegressionSlope}); // jshint ignore:line

        var expectedFields = ["Slope"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testLinearRegressionIntercept: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: LinearRegressionIntercept}); // jshint ignore:line

        var expectedFields = ["Intercept"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertTrue("IsOverlay must be true.", target.isOverlay);
    },

    testTimeSeriesForecast: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: TimeSeriesForecast}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertTrue("IsOverlay must be true.", target.isOverlay);
    },

    testSimpleMovingAverage: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: SimpleMovingAverage});

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertTrue("IsOverlay must be true.", target.isOverlay);
    },

    testExponentialMovingAverage: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: ExponentialMovingAverage}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertTrue("IsOverlay must be true.", target.isOverlay);
    },

    testTimeSeriesMovingAverage: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: TimeSeriesMovingAverage}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertTrue("IsOverlay must be true.", target.isOverlay);
    },

    testVariableMovingAverage: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: VariableMovingAverage}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertTrue("IsOverlay must be true.", target.isOverlay);
    },

    testTriangularMovingAverage: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: TriangularMovingAverage}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertTrue("IsOverlay must be true.", target.isOverlay);
    },

    testWeightedMovingAverage: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: WeightedMovingAverage}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertTrue("IsOverlay must be true.", target.isOverlay);
    },

    testWellesWilderSmoothing: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: WellesWilderSmoothing}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertTrue("IsOverlay must be true.", target.isOverlay);
    },

    testVIDYA: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: VIDYA}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'R2 Scale': 0.65,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertTrue("IsOverlay must be true.", target.isOverlay);
    },

    testChandeMomentumOscillator: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: ChandeMomentumOscillator}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testMomentumOscillator: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: MomentumOscillator}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testTRIX: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: TRIX}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testVerticalHorizontalFilter: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: VerticalHorizontalFilter}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testUltimateOscillator: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: UltimateOscillator}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            'Cycle 1': 3,
            'Cycle 2': 8,
            'Cycle 3': 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testAverageTrueRange: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: AverageTrueRange}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testFractalChaosOscillator: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: FractalChaosOscillator}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testPrettyGoodOscillator: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: PrettyGoodOscillator}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testWilliamsPctR: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: AverageTrueRange}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testWilliamsAccumulationDistribution: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: WilliamsAccumulationDistribution}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testVolumeOscillator: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: VolumeOscillator}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            'Short Term': 8,
            'Long Term': 14,
            'Points or Percent': 2,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testChaikinVolatility: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: ChaikinVolatility}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            'Rate of Change': 2,
            'Moving Average Type': TASDKConst.simpleMovingAverage,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testStochasticOscillator: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: StochasticOscillator}); // jshint ignore:line

        var expectedFields = ["%K", "%D"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            '%K Periods': 13,
            '%K Smoothing': 25,
            '%D Periods': 9,
            'Moving Average Type': TASDKConst.simpleMovingAverage,
            'Line Color': '#FF0000',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID,
            'Line 2 Color': '#00FF00',
            'Line 2 Width': 1,
            'Line 2 Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testPriceOscillator: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: PriceOscillator}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            'Short Cycle': 3,
            'Long Cycle': 8,
            'Moving Average Type': TASDKConst.simpleMovingAverage,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testMACD: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: MACD}); // jshint ignore:line

        var expectedFields = ["Indicator", "IndicatorSignal", "Indicator Histogram"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            'Signal Periods': 3,
            'Long Cycle': 25,
            'Short Cycle': 13,
            'Moving Average Type': TASDKConst.simpleMovingAverage,
            'Line Color': '#FF0000',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID,
            'Line 2 Color': '#FFFFFF',
            'Line 2 Width': 1,
            'Line 2 Style': StockChartX.LineStyle.SOLID,
            'Line 3 Color': '#00FF00',
            'Line 3 Width': 1,
            'Line 3 Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testMACDHistogram: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: MACDHistogram}); // jshint ignore:line

        var expectedFields = ["Indicator Histogram"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            'Signal Periods': 3,
            'Long Cycle': 25,
            'Short Cycle': 13,
            'Moving Average Type': TASDKConst.simpleMovingAverage,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testEaseOfMovement: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: EaseOfMovement}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            'Moving Average Type': TASDKConst.simpleMovingAverage,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testDetrendedPriceOscillator: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: DetrendedPriceOscillator}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Moving Average Type': TASDKConst.simpleMovingAverage,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testParabolicSAR: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: ParabolicSAR}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            'Min AF': 0.02,
            'Max AF': 3,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertTrue("IsOverlay must be true.", target.isOverlay);
    },

    testDirectionalMovementSystem: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: DirectionalMovementSystem}); // jshint ignore:line

        var expectedFields = ["ADX", "DI+", "DI-"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            'Line Color': '#FF0000',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID,
            'Line 2 Color': '#FFFFFF',
            'Line 2 Width': 1,
            'Line 2 Style': StockChartX.LineStyle.SOLID,
            'Line 3 Color': '#00FF00',
            'Line 3 Width': 1,
            'Line 3 Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testTrueRange: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: TrueRange}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testAroon: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: Aroon}); // jshint ignore:line

        var expectedFields = ["Aroon Up", "Aroon Down"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            'Line Color': '#FF0000',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID,
            'Line 2 Color': '#00FF00',
            'Line 2 Width': 1,
            'Line 2 Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testAroonOscillator: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: AroonOscillator}); // jshint ignore:line

        var expectedFields = ["Aroon Oscillator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testRainbowOscillator: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: RainbowOscillator}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Levels: 3,
            'Moving Average Type': TASDKConst.simpleMovingAverage,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testPrimeNumberOscillator: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: PrimeNumberOscillator}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testElderRay: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: ElderRay}); // jshint ignore:line

        var expectedFields = ["Indicator Bull Power", "Indicator Bear Power"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            'Moving Average Type': TASDKConst.simpleMovingAverage,
            'Line Color': '#FF0000',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID,
            'Line 2 Color': '#00FF00',
            'Line 2 Width': 1,
            'Line 2 Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testEhlerFisherTransform: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: EhlerFisherTransform}); // jshint ignore:line

        var expectedFields = ["Indicator", "Indicator Trigger"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 14,
            'Line Color': '#FF0000',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID,
            'Line 2 Color': '#00FF00',
            'Line 2 Width': 1,
            'Line 2 Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testSchaffTrendCycle: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: SchaffTrendCycle}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Short Cycle': 13,
            'Moving Average Type': TASDKConst.simpleMovingAverage,
            'Long Cycle': 25,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testCenterOfGravity: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: CenterOfGravity}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertTrue("IsOverlay must be true.", target.isOverlay);
    },

    testChandeForecastOscillator: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: ChandeForecastOscillator}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            Periods: 14,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertTrue("IsOverlay must be true.", target.isOverlay);
    },

    testCoppockCurve: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: CoppockCurve}); // jshint ignore:line

        var expectedFields = ["Indicator"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Source: StockChartX.DataSeriesSuffix.CLOSE,
            'Line Color': '#FFFFFF',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testKlingerVolumeOscillator: function() {
        "use strict";

        var target = new StockChartX.Indicator({taIndicator: KlingerVolumeOscillator}); // jshint ignore:line

        var expectedFields = ["Indicator", "IndicatorSignal"];
        assertEquals("Field names are not initialized properly.", expectedFields, target.fieldNames);

        var expectedParams = {
            Periods: 13,
            'Long Cycle': 55,
            'Short Cycle': 34,
            'Moving Average Type': TASDKConst.simpleMovingAverage,
            'Line Color': '#FF0000',
            'Line Width': 1,
            'Line Style': StockChartX.LineStyle.SOLID,
            'Line 2 Color': '#00FF00',
            'Line 2 Width': 1,
            'Line 2 Style': StockChartX.LineStyle.SOLID
        };
        assertEquals("Indicator parameters are not initialized properly.", expectedParams, target.parameters);
        assertFalse("IsOverlay must be false.", target.isOverlay);
    },

    testCalculate: function() {
        "use strict";

        for (var i = 0; i < 100; i++) {
            //noinspection JSCheckFunctionSignatures
            this.chart.appendBars({
                date: new Date(),
                open: i + 1,
                high: i + 2,
                low: i - 1,
                close: i
            });
        }
        var indicators = StockChartX.Indicator.allIndicators();
        for (i = 0; i < indicators.length; i++) {
            var target = new StockChartX.Indicator({
                taIndicator: indicators[i],
                chart: this.chart
            });
            var actual = null;
            var indicatorName = indicatorToString(indicators[i]); // jshint ignore:line
            assertNoException("An exception should not be thrown on attempt to calculate indicator '" + indicatorName + "'", function() {
                actual = target.calculate();
            }); // jshint ignore:line
            assertNotNull("Title is not set for indicator " + indicatorName, actual.title);
            assertTrue("Start index is not set for indicator " + indicatorName, actual.startIndex >= 0);
            assertNotNull("Recordset is not set for indicator " + indicatorName, actual.recordSet);
            assertTrue("Recordset does not contain fields for indicator " + indicatorName, actual.recordSet._m_FieldNav.length > 0);
            actual.recordSet._m_FieldNav.forEach(function(field) {
                assertTrue("Field '" + field.name + "' does not contain records in indicator " + indicatorName, field.recordCount > 0);
            }); // jshint ignore:line
        }
    }
});