/* global Promise, MyCustomMACD */

const milliseconds = require("mocha/lib/ms");

$(function() {
  "use strict";

  var isDebugMode = window.location.port === "63342";
  var isMobile =
    StockChartX.Environment.isMobile || StockChartX.Environment.isPhone;
  var isFullWindowMode = isDebugMode || isMobile;
  
  var datafeed = new StockChartX.CsvDatafeed({
    urlBuilder: function(request) {
       var timeIntervalMinutes = 1;
      
       TimeSelectedInMilliseconds = request.chart.timeInterval;
       // Yearly
       if(TimeSelectedInMilliseconds == 31556926000){
          timeIntervalMinutes = 0;
        }
        // Monthly
        else if(TimeSelectedInMilliseconds == 2629743830)
        {
          timeIntervalMinutes = 0;
        }
        else{
          //Time Interval is in milliseconds - we have converted it to minutes  
         timeIntervalMinutes = (TimeSelectedInMilliseconds/1000)/60;
      
        }
        var instrument = request.instrument || request.chart.instrument;
        return [instrument.symbol, timeIntervalMinutes];
    },
    dateFormat: function() {
        return 'YYYY-MM-DD hh:mm:ss';
    }
  });

  window.createChart = function(config) {
    setupInstruments();

    return createChart(config);
  };

  window.createMultiCharts = function(config) {
    setupInstruments();

    return createMultiCharts(config);
  };

  function setupInstruments() {
    var symbolsFilePath = isMobile
      ? "data/symbols.mobile.json"
      : "data/symbols.json";

    $.get(symbolsFilePath, function(symbols) {
      var allSymbols =
        typeof symbols === "string" ? JSON.parse(symbols) : symbols;

      StockChartX.getAllInstruments = function() {
        return allSymbols;
      };
    }).fail(function() {
      StockChartX.UI.Notification.error("Load symbols failed.");
    });
  }

  function createChart(config) {
    if (config.datafeed) datafeed = config.datafeed;
    var mergedConfig = $.extend(config, {
      width: 768,
      height: 460,
      theme: StockChartX.Theme.Dark,
      fullWindowMode: isFullWindowMode,
      datafeed: datafeed,
      instrument: {
        symbol: "AAPL",
        company: "Apple Computer Inc",
        exchange: "NASDAQ",
        tickSize: 0.01
      }
    });
    var chart = $(config.chartContainer).StockChartX(mergedConfig); // eslint-disable-line new-cap

    return setupChart(chart, config);
  }

  function createMultiCharts(config) {
    var mergedConfig = $.extend(config, {
      theme: StockChartX.Theme.Dark,
      datafeed: datafeed,
      instrument: {
        symbol: "GOOG",
        company: "Google Inc.",
        exchange: "NASDAQ",
        tickSize: 0.01
      }
    });
    mergedConfig.showToolbar = false;

    var chartsContainer = new StockChartX.ChartsContainer(
      $("#chartsContainer")
    );
    for (var i = 0; i < 4; i++) {
      var chart = chartsContainer.addChart(mergedConfig);
      if (config.indicators !== false) setupIndicators(chart);
    }
    chartsContainer.resizeCharts();

    return chartsContainer;
  }

  function setupChart(chart, config) {
    return config.autoSave
      ? setupChartWithState(chart, config)
      : setupChartWithoutState(chart, config);
  }

  function setupChartWithoutState(chart, config) {
    return new Promise(function(resolve) {
      if (config.indicators !== false) setupIndicators(chart);

      resolve(chart);
    });
  }

  function setupChartWithState(chart, config) {
    return new Promise(function(resolve) {
      chart.stateHandler
        .load()
        .then(function(isLoaded) {
          if (!isLoaded && config.indicators !== false) setupIndicators(chart);

          resolve(chart);
        })
        .catch(function(error) {
          StockChartX.UI.Notification.error(error.message);

          chart.stateHandler.clear().then(function() {
            chart.destroy(false);

            createChart(config);
          });
        });
    });
  }

  function setupIndicators(chart) {
    if (!StockChartX.Environment.isPhone) {
      var indicators = null;
      // @if SCX_LICENSE = 'free'
      // noinspection JSUnusedAssignment
      indicators = [
        TASdk.SimpleMovingAverage,
        TASdk.MACD,
        TASdk.RelativeStrengthIndex
      ];
      // @endif

      // @if SCX_LICENSE != 'free'
      var myIndicator = new MyCustomMACD();
      indicators = [
        myIndicator,
        TASdk.RelativeStrengthIndex,
        TASdk.BollingerBands
      ];
      // @endif

      chart.addIndicators(indicators);
    }

    var volume = chart.addIndicators(StockChartX.VolumeIndicator);
    volume.setParameterValue(StockChartX.IndicatorParam.LINE_WIDTH, 5);
  }

  function returnUrl(name, period)
  {
    var symbol = 'AAPL';
    var time = StockChartX.Periodicity.DAY;

    switch(name){
      case 'AAPL':
      case 'MSFT':
      case 'GOOG':
      case 'NQ':
      case 'SGX':
        symbol = name;
      default:
        break;
    }

    switch(period){
      case StockChartX.Periodicity.DAY:
      case StockChartX.Periodicity.WEEK:
      case StockChartX.Periodicity.MONTH:
        time = period;
        break;
      case StockChartX.Periodicity.MINUTE:
        time = '';
        break;
      default:
        break;
    }
    
    return 'data/' + symbol + '-' + time + '.csv';
  }

});

