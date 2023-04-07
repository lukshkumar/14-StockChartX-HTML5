/* eslint-disable */
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

/* global MyCustomMACD */

var gChart; // eslint-disable-line no-implicit-globals, init-declarations

$(function() {
  var defaultInstrument = {
    company: "BITCOIN",
    exchange: "Binance",
    symbol: "BTCUSD"
  };

  var dataServer = (function() {
    var apiKey = "e97177f0-f788-11e7-b11b-397212b32cdf";
    var wsUrl = "wss://ws-feed.pro.coinbase.com/";
    var socket;
    function getHistory(config) {
      //console.log(config);
      config = config || {};
      var instrument = config.instrument || defaultInstrument;
      var interval = config.interval || 1;
      var url =
        "https://feed.cryptoquote.io/bars/minutes/" +
        interval +
        "/" +
        instrument.symbol +
        "." +
        instrument.exchange +
        ".internal/now";
      return new Promise(function(resolve, reject) {
        $.ajax({
          url: url,
          dataType: "json"
        }).done(function(results) {
          resolve(results);
        });
      });
    }

    function connect(subscribeFn) {
      socket = new WebSocket(wsUrl);
      //console.log(socket);
      socket.onopen = function() {
        console.log("Connected to Coinbase");
        socket.send(
          JSON.stringify({
            type: "subscribe",
            product_ids: ["BTC-USD"],
            channels: [
              {
                name: "ticker",
                product_ids: ["BTC-USD"]
              }
            ]
          })
        );
      };

      socket.onclose = function() {
        console.log("Disconnected to Firehose");
      };
      socket.onerror = function() {
        console.error("Error!");
      };
      socket.onmessage = function(event) {
        var message = JSON.parse(event.data);
        if (message.type === "ticker" && message.product_id === "BTC-USD") {
          //   if (
          //     message.symbol === "BTCUSD" &&
          //     message.updateType === "ticker" &&
          //     message.exchange.name === "Binance"
          //   ) {
          // console.log("message ", message);
          subscribeFn(message);
          //   }
        }
      };
      $(window).on("unload", function() {
        if (socket) {
          socket.close();
        }
        socket = null;
      });
    }

    return {
      getHistory: getHistory,
      connect: connect
    };
  })();

  function chart() {
    var isDebugMode = false;
    var isMobile =
      (StockChartX.Environment.isMobile && $(window).width() < 768) ||
      StockChartX.Environment.isPhone;
    var isFullWindowMode = isDebugMode || isMobile;

    gChart = $("#chartContainer").StockChartX({
      // eslint-disable-line new-cap
      width: 768,
      height: 460,
      theme: StockChartX.Theme.Dark,
      fullWindowMode: isFullWindowMode,
      onToolbarLoaded: function() {
        if (window.innerHeight < gChart.size.height) {
          gChart.size = {
            width: gChart.size.width,
            height: window.innerHeight
          };
          gChart.update();
        }

        if (
          (StockChartX.Environment.isMobile && $(window).width() < 768) ||
          StockChartX.Environment.isPhone
        ) {
          var $toolbar = gChart.container.find(".scxToolbar");
          $toolbar.find(".scxToolbarViewMode").remove();
          var $lastChild = $toolbar.children().last();
          if ($lastChild.hasClass("scxToolbar-delimiter")) $lastChild.remove();
        }
      }
    });

    var ind = gChart.addIndicators(StockChartX.VolumeIndicator);
    ind.setParameterValue(StockChartX.IndicatorParam.LINE_WIDTH, 5);

    gChart.on(StockChartX.ChartEvent.SYMBOL_ENTERED, function(event) {
      // TODO: Load data for the new symbol
      // gChart.showWaitingBar();
      // unsubscribe();
      // gChart.instrument = event.value;
      // subscribe();
    });
    gChart.on(StockChartX.ChartEvent.TIME_FRAME_CHANGED, function(event) {
      // TODO: Process time frame change
      gChart.timeInterval = StockChartX.TimeFrame.timeFrameToTimeInterval(
        event.value.interval,
        event.value.periodicity
      );
      unsubscribe();
      subscribe();
    });
    gChart.on(StockChartX.ChartEvent.MORE_HISTORY_REQUESTED, function() {
      console.log("TODO: Load more history!");
    });

    gChart.instrument = defaultInstrument;
    gChart.timeInterval = StockChartX.TimeSpan.MILLISECONDS_IN_MINUTE;

    subscribe();

    function subscribe() {
      var timeFrame = StockChartX.TimeFrame.timeIntervalToTimeFrame(
        gChart.timeInterval
      );

      gChart.showWaitingBar();
      dataServer
        .getHistory({
          interval: timeFrame.interval,
          periodicity: timeFrame.periodicity,
          barsCount: 800,
          instrument: gChart.instrument
        })
        .then(function(data) {
          //console.log(data);
          onHistoryReceived(data);
          dataServer.connect(onQuoteReceived);
        });
    }

    function unsubscribe() {
      dataStore.unsubscribeQuote(onQuoteReceived, gChart.instrument);
    }

    function onHistoryReceived(data) {
      // gChart.clearDataSeries();

      if (!data || !data.bars || !data.bars.bars || !data.bars.bars.length) {
        gChart.hideWaitingBar();
        StockChartX.UI.Notification.error("Unable to load data.");

        return;
      }

      loadData(convertBars(data.bars.bars));

      updateChart(true);
      gChart.hideWaitingBar(true);
      //dataStore.subscribeQuote(onQuoteReceived, gChart.instrument);
    }

    function convertBars(bars) {
      var result = [];
      var len = bars.length;
      for (var i = len - 1; i >= 0; i--) {
        var bar = bars[i];
        result.push({
          open: parseFloat(bar.open),
          high: parseFloat(bar.high),
          low: parseFloat(bar.low),
          close: parseFloat(bar.close),
          volume: parseFloat(bar.volume),
          date: new Date(bar.time)
        });
      }
      //console.log(result);
      return result;
    }

    function onQuoteReceived(quote) {
      processQuote(convertQuote(quote));
      updateChart();
    }

    function convertQuote(quote) {
      return {
        high: parseFloat(quote.price),
        low: parseFloat(quote.price),
        volume: parseFloat(quote.last_size),
        date: new Date(quote.time).getTime(),
        price: parseFloat(quote.price),
        symbol: quote.product_id
      };
    }

    function processQuote(quote) {
      //   if (quote.symbol !== gChart.instrument.symbol) return;

      var lastBar = getLastChartBar();
      var timeFrame = StockChartX.TimeFrame.timeIntervalToTimeFrame(
        gChart.timeInterval
      );

      var currentBarStartTimestamp = lastBar
        ? normalizeDate(
            lastBar.date,
            gChart.timeInterval / timeFrame.interval,
            timeFrame.interval
          )
        : quote.date;

      var nextBarStartTimestamp =
        currentBarStartTimestamp + gChart.timeInterval;

      if (quote.date < currentBarStartTimestamp) return;
      if (quote.price === 0) return;

      // console.log(
      //   "quote.date: ",
      //   new Date(quote.date),
      //   "next date: ",
      //   new Date(nextBarStartTimestamp)
      // );
      // Make new bar
      if (quote.date >= nextBarStartTimestamp || lastBar === null) {
        // If there were no historical data and timestamp is in range of current time frame
        if (lastBar === null && quote.date < nextBarStartTimestamp)
          nextBarStartTimestamp = currentBarStartTimestamp;

        // If gap is more than one time frame
        while (quote.date >= nextBarStartTimestamp + gChart.timeInterval)
          nextBarStartTimestamp += gChart.timeInterval;

        // Create bar
        var bar = {
          open: quote.price,
          high: quote.price,
          low: quote.price,
          close: quote.price,
          volume: quote.volume,
          date: new Date(nextBarStartTimestamp)
        };

        appendBar(bar);
        // console.log("Append bar");
      } else {
        // Update current bar
        lastBar.close = quote.price;
        // Temporary workaround
        lastBar.volume += quote.volume / 1000;

        if (lastBar.high < quote.price) lastBar.high = quote.price;

        if (lastBar.low > quote.price) lastBar.low = quote.price;

        updateLastBar(lastBar);
        // console.log("UPDATE bar");
      }
    }

    function procssQte(quote) {}

    function normalizeDate(timestamp, periodicityMillis, interval) {
      var d = new Date(timestamp);

      switch (periodicityMillis) {
        case StockChartX.TimeSpan.MILLISECONDS_IN_YEAR:
          var year = parseInt(d.getFullYear() / interval, 10) * interval;

          return new Date(year, 0, 1).getTime();

        case StockChartX.TimeSpan.MILLISECONDS_IN_MONTH:
          var month = parseInt(d.getMonth() / interval, 10) * interval;

          return new Date(d.getFullYear(), month, 1).getTime();

        case StockChartX.TimeSpan.MILLISECONDS_IN_WEEK:
          var week = parseInt(d.getDate() / (interval * 7), 10) * interval * 7;

          return new Date(d.getFullYear(), d.getMonth(), week).getTime();

        case StockChartX.TimeSpan.MILLISECONDS_IN_DAY:
          var day = parseInt(d.getDate() / interval, 10) * interval;

          return new Date(d.getFullYear(), d.getMonth(), day).getTime();

        case StockChartX.TimeSpan.MILLISECONDS_IN_HOUR:
          var hour = parseInt(d.getHours() / interval, 10) * interval;

          return new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate(),
            hour
          ).getTime();

        case StockChartX.TimeSpan.MILLISECONDS_IN_MINUTE:
          var minute = parseInt(d.getMinutes() / interval, 10) * interval;

          return new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate(),
            d.getHours(),
            minute
          ).getTime();

        default:
          break;
      }

      return timestamp;
    }

    function getLastChartBar() {
      var chartData = gChart.getCommonDataSeries();

      if (chartData.open.values.length === 0) return null;

      var index = chartData.open.values.length - 1;

      return {
        open: chartData.open.values[index],
        high: chartData.high.values[index],
        low: chartData.low.values[index],
        close: chartData.close.values[index],
        volume: chartData.volume.values[index],
        date: chartData.date.values[index].getTime()
      };
    }

    function loadData(bars) {
      gChart.appendBars(bars);
      if (!isMobile) gChart.recordRange(1000);
    }

    function appendBar(bar) {
      gChart.appendBars(bar);
      gChart.setNeedsAutoScale();
    }

    function updateLastBar(bar) {
      var chartData = gChart.getCommonDataSeries();
      var index = chartData.open.values.length - 1;

      chartData.open.values[index] = bar.open;
      chartData.high.values[index] = bar.high;
      chartData.low.values[index] = bar.low;
      chartData.close.values[index] = bar.close;
      chartData.volume.values[index] = bar.volume;
      chartData.date.values[index] = new Date(bar.date);

    }

    function updateChart(autoScale, autoScaleAll) {
      if (autoScale && !autoScaleAll) gChart.setNeedsAutoScale();

      if (autoScaleAll) gChart.setNeedsAutoScaleAll();

      gChart.updateIndicators();
      gChart.update();
    }
  }

  chart();
});


function setupInstruments() {
  var symbolsFilePath = "data/symbols.json";

  $.get(symbolsFilePath, (symbols) => {
    var allSymbols =
      typeof symbols === "string" ? JSON.parse(symbols) : symbols;
      window.StockChartX.getAllInstruments = function() {
        return allSymbols;
      };
  }).fail(function() {
    StockChartX.UI.Notification.error("Load symbols failed.");
  });
}
setupInstruments();
