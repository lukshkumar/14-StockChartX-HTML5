import { Chart, Notification } from "../src/scripts/exporter";
let instruments = [
  {
    symbol: "MSFT",
    company: "Microsoft",
    exchange: "NASDAQ"
  }
];
const socket = require("socket.io-client")(
  "https://ws-api.iextrading.com/1.0/tops"
);

socket.on("message", message => console.log(message));

socket.on("connect", () => {
  console.log("socked connected!");
  socket.emit("subscribe", "msft, aapl, amzn");
});

// Disconnect from the channel
socket.on("disconnect", () => console.log("Disconnected."));

const interval = "6m";
const getFetchURL = symbol => {
  return `https://api.iextrading.com/1.0/stock/${symbol}/chart/${interval}`;
};
const config = {
  width: 768,
  height: 460,
  theme: StockChartX.Theme.Dark,
  container: "#chartContainer",
  instrument: instruments[0]
};
const chart = new Chart(config);

const getDataForSymbol = async symbol => {
  try {
    const response = await fetch(getFetchURL(symbol));
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
  bars.forEach(bar => {
    result.push({
      open: parseFloat(bar.open),
      high: parseFloat(bar.high),
      low: parseFloat(bar.low),
      close: parseFloat(bar.close),
      volume: parseFloat(bar.volume),
      date: new Date(bar.date)
    });
  });

  return result;
};

const compareWith = async instrument => {
  instruments.push({
    instrument
  });
  const newSymbol = chart.addSymbol(instrument);
  window.newSymbol = newSymbol;

  chart.showWaitingBar();
  const data = await getDataForSymbol(instrument.symbol);

  chart.hideWaitingBar();

  const bars = convertBars(data);

  console.log("new symbol bars ", bars);
  newSymbol.appendBars(bars);
};

const main = async () => {
  chart.showWaitingBar();
  const data = await getDataForSymbol(instruments[0].symbol);

  chart.hideWaitingBar();

  const bars = convertBars(data);

  chart.appendBars(bars);

  await compareWith({ company: "AMZN", symbol: "AMZN", exchange: "NASDAQ" });

  chart.setNeedsAutoScale();
  chart.update();
  chart.updateIndicators();
};

const onHistoryRequest = () => {
  instruments.forEach(async ({ symbol }) => {
    chart.showWaitingBar();
    const data = await getDataForSymbol(symbol);

    chart.hideWaitingBar();

    const bars = convertBars(data);

    // if (symbol !== "MSFT") chart.prependBars(bars, symbol);
    // else chart.prependBars(bars);
  });
};
main();
window.chart = chart;

chart.on(StockChartX.ChartEvent.TIME_FRAME_CHANGED, e => {
  console.log(e);
});

chart.on(StockChartX.ChartEvent.MORE_HISTORY_REQUESTED, e => {
  console.log(e);
});

StockChartX.getAllInstruments = function() {
  return [
    {
      symbol: "GOOG",
      exchange: "NASDAQ",
      company: "Google"
    },
    {
      symbol: "MSFT",
      exchange: "NASDAQ",
      company: "Microsoft"
    },
    {
      symbol: "AMZN",
      exchange: "NASDAQ",
      company: "Amazon"
    }
  ];
};
