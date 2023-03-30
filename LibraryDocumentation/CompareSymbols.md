## Compare Symbols

### About

- This feature enables comparing multiple symbols on a single chart.
- The newly added symbol/instrument will be visible in the new chart panel.

### API

- To add a new symbol,

```
const newSymbol = chart.addSymbol({
                    symbol:"MYSYM",
                    exchange:"MyEXC",
                    company:"MyCOM"
                });
```

Here, `chart` is the chart's instance.

- To append a new bar to the newly added symbol.

```
const newBar = {
    open: parseFloat(bar.open),
    high: parseFloat(bar.high),
    low: parseFloat(bar.low),
    close: parseFloat(bar.close),
    volume: parseFloat(bar.volume),
    date: new Date(bar.date)
};
newSymbol.appendBar(bar);

// Sets chart.setNeedsAutoScale();
// chart.update();
chart.setNeedsUpdate(true);
```

- To update the last bar.

```
const newSymbolDataSeries = newSymbol.getBarDataSeries();
const newBar = {
    // New bar data;
};
newSymbolDataSeries.open.updateLast(newBar.open);
newSymbolDataSeries.close.updateLast(newBar.close);
newSymbolDataSeries.high.updateLast(newBar.high);
newSymbolDataSeries.low.updateLast(newBar.low);
newSymbolDataSeries.volume.updateLast(newBar.volume);

// Sets chart.setNeedsAutoScale();
// chart.update();
chart.setNeedsUpdate(true);
```

- To subscribe to an event of symbol removal. i.e When the user removes a symbol from the chart. This can be used for cleanup and unsubscribing APIs respective to the symbol.

```
newSymbol.on("unsubscribe", ()=>{
    // Clean up resources linked to this symbol.
})
```

Here, returned newSymbol is of type StockSymbol which has the following methods.

- appendBars.
- prependBars.
- getBarDataSeries.
- priceStyleKind.
- changePriceStyle.

## Example

- To preview the example, just run npm start.
- In source code, example code can be found in demo/compare-symbol-crypto.js.

`Note`: The Chart DateScale (x-axis) is plotted as per the main symbol, so it is important that date stays consistent between main and new symbols.
