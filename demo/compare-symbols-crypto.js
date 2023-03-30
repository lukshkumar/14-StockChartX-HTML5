// Here Chart can be directly imported or can be used from chart = $(container).StockChartX(configs)
import {
  Chart,
  Notification,
  Theme,
  ChartEvent,
  TimeSpan
} from "../src/scripts/exporter";
const API_KEY = "e97177f0-f788-11e7-b11b-397212b32cdf";
const getHistoryURL = ({ symbol, exchange }) => {
  return `https://feed.cryptoquote.io/bars/minutes/${interval}/${symbol}.${exchange}.internal/now`;
};
const WEBSOCKET_URL = "wss://ws-feed.pro.coinbase.com/";
let newSymbols = {};
let instruments = [
  {
    symbol: "BTCUSD",
    company: "BITCOIN",
    exchange: "Binance",
    idForCoinbase: "BTC-USD",
    isMainPanel: true
  }
];

let COINBASE_API_SPECIFIC_CONFIG = {
  "BTC-USD": instruments[0]
};

const interval = 1;
const config = {
  width: 768,
  height: 460,
  theme: Theme.Dark,
  container: "#chartContainer",
  instrument: instruments[0]
};
const chart = new Chart(config);

const getDataForSymbol = async instrument => {
  try {
    const response = await fetch(getHistoryURL(instrument));
    const jsonResponse = await response.json();
    if (jsonResponse.NOTE) throw new Error("API limit reached.");
    return jsonResponse;
  } catch (error) {
    console.log(error);
    Notification.error("Something went wrong!");
  }
};

const convertBars = bars => {
  var result = [];
  for (let i = bars.length - 1; i >= 0; i--) {
    const bar = bars[i];
    result.push({
      open: parseFloat(bar.open),
      high: parseFloat(bar.high),
      low: parseFloat(bar.low),
      close: parseFloat(bar.close),
      volume: parseFloat(bar.volume),
      date: new Date(bar.time)
    });
  }

  return result;
};

const compareWith = async instrument => {
  instruments.push(instrument);

  const newSymbol = chart.addSymbol(instrument);
  window.newSymbol = newSymbol;

  // Storing returned instance for append/prepend functionalities.
  newSymbols[instrument.idForCoinbase] = newSymbol;

  // Subscribing symbol removal event on newSymbol.
  newSymbol.on("unsubscribe", () => {
    // Mocking unsubscription
    COINBASE_API_SPECIFIC_CONFIG[instrument.idForCoinbase] = undefined;
    console.log("unsubscribed ", newSymbol.name);
  });

  chart.showWaitingBar();
  const data = await getDataForSymbol(instrument);

  chart.hideWaitingBar();

  const bars = convertBars(data.bars.bars);

  newSymbol.appendBars(bars);
};

const main = async () => {
  chart.showWaitingBar();
  const data = await getDataForSymbol(instruments[0]);

  chart.hideWaitingBar();

  const bars = convertBars(data.bars.bars);

  chart.appendBars(bars);

  const etherium = {
    company: "ETHERIUM",
    symbol: "ETHUSD",
    exchange: "Binance",
    idForCoinbase: "ETH-USD"
  };
  await compareWith(etherium);

  COINBASE_API_SPECIFIC_CONFIG["ETH-USD"] = etherium;

  setupRealTimeData();

  chart.setNeedsUpdate(true);
  chart.updateIndicators();
};

const updateOrAppend = (newBar, instrument) => {
  const lastBar = getLastBar(instrument);
  const lastBarTimeStamp = lastBar.date;
  const currentBarTimeStamp = newBar.date.getTime();
  if (currentBarTimeStamp < lastBarTimeStamp) {
    return;
  }
  const nextBarTimeStamp = lastBarTimeStamp + TimeSpan.MILLISECONDS_IN_MINUTE;

  if (currentBarTimeStamp < nextBarTimeStamp) {
    lastBar.close = newBar.close;
    // Temporary workaround
    lastBar.volume += newBar.volume / 1000;

    if (lastBar.high < newBar.close) lastBar.high = newBar.close;

    if (lastBar.low > newBar.close) lastBar.low = newBar.close;

    updateLastBar(instrument, lastBar);
  } else {
    appendBar(instrument, newBar);
  }
};

const appendBar = (instrument, bar) => {
  if (instrument.isMainPanel) {
    chart.appendBars(bar);
  } else {
    const newSymbol = newSymbols[instrument.idForCoinbase];
    newSymbol.appendBars(bar);
  }
};

const updateLastBar = (instrument, bar) => {
  let dataSeries;
  if (instrument.isMainPanel) {
    dataSeries = chart.getCommonDataSeries();
  } else {
    dataSeries = newSymbols[instrument.idForCoinbase].getBarDataSeries();
  }

  let index = dataSeries.open.values.length - 1;

  dataSeries.open.values[index] = bar.open;
  dataSeries.high.values[index] = bar.high;
  dataSeries.low.values[index] = bar.low;
  dataSeries.close.values[index] = bar.close;
  dataSeries.volume.values[index] = bar.volume;
  dataSeries.date.values[index] = new Date(bar.date);
};
const getLastBar = instrument => {
  let dataSeries;
  if (instrument.isMainPanel) {
    dataSeries = chart.getCommonDataSeries();
  } else {
    dataSeries = newSymbols[instrument.idForCoinbase].getBarDataSeries();
  }
  if (dataSeries.open.values.length === 0) return null;

  const index = dataSeries.open.values.length - 1;

  return {
    open: dataSeries.open.values[index],
    high: dataSeries.high.values[index],
    low: dataSeries.low.values[index],
    close: dataSeries.close.values[index],
    volume: dataSeries.volume.values[index],
    date: dataSeries.date.values[index].getTime()
  };
};

// const onHistoryRequest = () => {
//   instruments.forEach(async ({ symbol }) => {
//     chart.showWaitingBar();
//     const data = await getDataForSymbol(symbol);

//     chart.hideWaitingBar();

//     const bars = convertBars(data);

//     if (symbol !== "MSFT") chart.prependBars(bars, symbol);
//     else chart.prependBars(bars);
//   });
// };
main();
window.chart = chart;

chart.on(ChartEvent.TIME_FRAME_CHANGED, e => {
  console.log(e);
});

chart.on(ChartEvent.MORE_HISTORY_REQUESTED, e => {
  console.log(e);
});

const setupRealTimeData = () => {
  const socket = new WebSocket(WEBSOCKET_URL);
  socket.onopen = function() {
    console.log("Connected to Coinbase");
    socket.send(
      JSON.stringify({
        type: "subscribe",
        product_ids: Object.keys(COINBASE_API_SPECIFIC_CONFIG),
        channels: [
          {
            name: "ticker",
            product_ids: Object.keys(COINBASE_API_SPECIFIC_CONFIG)
          }
        ]
      })
    );
  };

  socket.onclose = function() {
    console.log("Disconnected to Coinbase");
  };
  socket.onerror = function() {
    console.error("Error!");
  };
  socket.onmessage = function(event) {
    var message = JSON.parse(event.data);
    if (
      message.type === "ticker" &&
      COINBASE_API_SPECIFIC_CONFIG[message.product_id]
    ) {
      if (message.time) {
        // console.log("Stock Quote ", message);
        const bar = {
          open: parseFloat(message.price),
          high: parseFloat(message.price),
          low: parseFloat(message.price),
          close: parseFloat(message.price),
          volume: parseFloat(message.last_size),
          date: new Date(message.time)
        };
        updateOrAppend(bar, COINBASE_API_SPECIFIC_CONFIG[message.product_id]);
        chart.update();
        chart.updateIndicators();
      }
    }
  };
  $(window).on("unload", function() {
    if (socket) {
      socket.close();
    }
    socket = null;
  });
};

setupInstruments();
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