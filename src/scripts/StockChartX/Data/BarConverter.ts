import { IOHLCDataSeries, IBarDataSeries } from "../index";
import { DataSeriesSuffix, DataSeries } from "../index";
import { PointAndFigureSource } from "../index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

/**
 * @internal
 */
export class BarConverter {
  /**
   * @internal
   */
  private static _setupOhlcDataSeries(
    suffix: string,
    dataSeries?: IOHLCDataSeries
  ): IOHLCDataSeries {
    let dsSuffix = DataSeriesSuffix;

    dataSeries = dataSeries || {
      open: new DataSeries(suffix + dsSuffix.OPEN),
      high: new DataSeries(suffix + dsSuffix.HIGH),
      low: new DataSeries(suffix + dsSuffix.LOW),
      close: new DataSeries(suffix + dsSuffix.CLOSE)
    };
    dataSeries.open.clear();
    dataSeries.high.clear();
    dataSeries.low.clear();
    dataSeries.close.clear();

    return dataSeries;
  }

  private static _setupBarDataSeries(
    suffix: string,
    dataSeries?: IBarDataSeries
  ): IBarDataSeries {
    let dsSuffix = DataSeriesSuffix;

    dataSeries = <IBarDataSeries>this._setupOhlcDataSeries(suffix, dataSeries);
    if (dataSeries.date) dataSeries.date.clear();
    else dataSeries.date = new DataSeries(suffix + dsSuffix.DATE);

    if (dataSeries.volume) dataSeries.volume.clear();
    else dataSeries.volume = new DataSeries(suffix + dsSuffix.VOLUME);

    return dataSeries;
  }

  static convertToHeikinAshi(
    inDataSeries: IOHLCDataSeries,
    outDataSeries?: IOHLCDataSeries
  ): IOHLCDataSeries {
    let dsSuffix = DataSeriesSuffix;

    outDataSeries = this._setupOhlcDataSeries(
      dsSuffix.HEIKIN_ASHI,
      outDataSeries
    );

    let inOpen = <number[]>inDataSeries.open.values,
      inHigh = <number[]>inDataSeries.high.values,
      inLow = <number[]>inDataSeries.low.values,
      inClose = <number[]>inDataSeries.close.values,
      count = inClose.length,
      outOpen = <number[]>outDataSeries.open.values,
      outHigh = <number[]>outDataSeries.high.values,
      outLow = <number[]>outDataSeries.low.values,
      outClose = <number[]>outDataSeries.close.values;

    for (let i = 0; i < count; i++) {
      let open = i > 0 ? (outOpen[i - 1] + outClose[i - 1]) / 2 : inOpen[i],
        close = (inOpen[i] + inHigh[i] + inLow[i] + inClose[i]) / 4,
        high = Math.max(open, close, inHigh[i]),
        low = Math.min(open, close, inLow[i]);

      outOpen.push(open);
      outHigh.push(high);
      outLow.push(low);
      outClose.push(close);
    }

    return outDataSeries;
  }

  // private static _calculateRenkoBoxSize(barDataSeries: IBarDataSeries, settings: IRenkoSettings): number {
  //    switch (settings.boxKind) {
  //        case RenkoBoxKind.FIXED:
  //            return (<IRenkoFixedBoxSettings> <IRenkoBoxSettings> settings).boxSize;
  //        case RenkoBoxKind.ATR:
  //            let atr = new StockChartX.Indicator({
  //                taIndicator: AverageTrueRange,
  //                chart: this
  //            });
  //            atr.setParameterValue(StockChartX.IndicatorParam.PERIODS, 20);
  //            atr._usePrimaryDataSeries = false;
  //
  //            let res = atr.calculate();
  //            if (!res.recordSet)
  //                return;
  //            let field = res.recordSet.getField(StockChartX.IndicatorField.INDICATOR);
  //            if (!field)
  //                return;
  //            let atrDataSeries = DataSeries.fromField(field, res.startIndex);
  //            let boxSize = atrDataSeries.lastValue;
  //            break;
  //        default:
  //            throw new Error("Unknown renko box kind: " + settings.boxKind);
  //    }
  // }

  static convertToRenko(
    inDataSeries: IBarDataSeries,
    boxSize: number,
    outDataSeries?: IBarDataSeries
  ): IBarDataSeries {
    let dsSuffix = DataSeriesSuffix;

    outDataSeries = this._setupBarDataSeries(dsSuffix.RENKO, outDataSeries);

    let inDate = <Date[]>inDataSeries.date.values,
      inOpen = <number[]>inDataSeries.open.values,
      inClose = <number[]>inDataSeries.close.values,
      inVolume = <number[]>inDataSeries.volume.values,
      count = inClose.length,
      outDate = <Date[]>outDataSeries.date.values,
      outOpen = <number[]>outDataSeries.open.values,
      outHigh = <number[]>outDataSeries.high.values,
      outLow = <number[]>outDataSeries.low.values,
      outClose = <number[]>outDataSeries.close.values,
      outVolume = <number[]>outDataSeries.volume.values;

    if (count === 0) return outDataSeries;

    let time = null,
      startPrice = Math.floor(inOpen[0] / boxSize) * boxSize,
      lowBound = startPrice + boxSize,
      highBound = lowBound - boxSize,
      volume = 0;

    for (let i = 0; i < count; i++) {
      volume += inVolume[i];

      if (!time) {
        time = new Date(inDate[i].getTime());
      }

      let price = inClose[i];

      if (price - highBound >= boxSize) {
        let bricksCount = Math.trunc((price - highBound) / boxSize);
        for (let j = 0; j < bricksCount; j++) {
          lowBound = highBound;
          highBound += boxSize;

          outDate.push(time);
          outOpen.push(lowBound);
          outHigh.push(highBound);
          outLow.push(lowBound);
          outClose.push(highBound);
          outVolume.push(volume);

          time = new Date(<number>time.getTime() + 1000);
        }
        volume = 0;
        time = null;
      } else if (lowBound - price >= boxSize) {
        let bricksCount = Math.trunc((lowBound - price) / boxSize);
        for (let j = 0; j < bricksCount; j++) {
          highBound = lowBound;
          lowBound -= boxSize;

          outDate.push(time);
          outOpen.push(highBound);
          outHigh.push(highBound);
          outLow.push(lowBound);
          outClose.push(lowBound);
          outVolume.push(volume);

          time = new Date(<number>time.getTime() + 1000);
        }
        volume = 0;
        time = null;
      }
    }

    return outDataSeries;
  }

  static convertToLineBreak(
    inDataSeries: IBarDataSeries,
    lines: number,
    outDataSeries?: IBarDataSeries
  ): IBarDataSeries {
    let dsSuffix = DataSeriesSuffix;

    outDataSeries = this._setupBarDataSeries(
      dsSuffix.LINE_BREAK,
      outDataSeries
    );

    let inDate = <Date[]>inDataSeries.date.values,
      inOpen = <number[]>inDataSeries.open.values,
      inClose = <number[]>inDataSeries.close.values,
      inVolume = <number[]>inDataSeries.volume.values,
      count = inClose.length,
      outDate = <Date[]>outDataSeries.date.values,
      outOpen = <number[]>outDataSeries.open.values,
      outHigh = <number[]>outDataSeries.high.values,
      outLow = <number[]>outDataSeries.low.values,
      outClose = <number[]>outDataSeries.close.values,
      outVolume = <number[]>outDataSeries.volume.values;

    if (count === 0) return outDataSeries;

    let time = null,
      min = inOpen[0],
      max = inOpen[0],
      volume = 0;

    for (let i = 0; i < count; i++) {
      volume += inVolume[i];

      if (time == null) {
        time = new Date(inDate[i].getTime());
      }

      let price = inClose[i],
        isNewMax = price > max,
        isNewMin = price < min;

      if (!isNewMax && !isNewMin) continue;

      let openPrice = min,
        outBarsCount = outClose.length;
      if (outBarsCount > 0) {
        openPrice = isNewMax
          ? outHigh[outBarsCount - 1]
          : outLow[outBarsCount - 1];
      }

      outOpen.push(openPrice);
      outHigh.push(Math.max(openPrice, price));
      outLow.push(Math.min(openPrice, price));
      outClose.push(price);
      outDate.push(time);
      outVolume.push(volume);

      if (isNewMax) {
        max = price;
        for (let j = outBarsCount - 1; j >= outBarsCount - lines; j--) {
          if (outClose[j] > outOpen[j]) {
            min = outLow[j];
          } else {
            break;
          }
        }
      }
      if (isNewMin) {
        min = price;
        for (let j = outBarsCount - 1; j >= outBarsCount - lines; j--) {
          if (outClose[j] < outOpen[j]) {
            max = outHigh[j];
          } else {
            break;
          }
        }
      }

      time = volume = null;
    }

    return outDataSeries;
  }

  static convertToPointAndFigure(
    inDataSeries: IBarDataSeries,
    boxSize: number,
    reversalAmount: number,
    source: string,
    outDataSeries?: IBarDataSeries
  ): IBarDataSeries {
    outDataSeries = this._setupBarDataSeries(
      DataSeriesSuffix.LINE_BREAK,
      outDataSeries
    );

    let inDate = <Date[]>inDataSeries.date.values,
      inHigh = <number[]>inDataSeries.high.values,
      inLow = <number[]>inDataSeries.low.values,
      inClose = <number[]>inDataSeries.close.values,
      inVolume = <number[]>inDataSeries.volume.values,
      count = inClose.length,
      outDate = <Date[]>outDataSeries.date.values,
      outOpen = <number[]>outDataSeries.open.values,
      outHigh = <number[]>outDataSeries.high.values,
      outLow = <number[]>outDataSeries.low.values,
      outClose = <number[]>outDataSeries.close.values,
      outVolume = <number[]>outDataSeries.volume.values;

    if (count === 0) return outDataSeries;

    let time = null,
      startPrice = inClose[0],
      reversal = boxSize * reversalAmount,
      isRaising = false,
      highBound = startPrice + boxSize / 2,
      lowBound = highBound - boxSize,
      volume = 0,
      useHighLow = source === PointAndFigureSource.HIGH_LOW,
      i;

    for (i = 0; i < count; i++) {
      let high = useHighLow ? inHigh[i] : inClose[i];
      if (high > highBound) {
        isRaising = true;
        break;
      }

      let low = useHighLow ? inLow[i] : inClose[i];
      if (low < lowBound) {
        isRaising = false;
        break;
      }

      volume += inVolume[i];
    }

    for (; i < count; i++) {
      volume += inVolume[i];

      if (time == null) {
        time = new Date(inDate[i].getTime());
      }

      let high = useHighLow ? inHigh[i] : inClose[i];
      let low = useHighLow ? inLow[i] : inClose[i];

      if (isRaising) {
        // It's X column
        if (high > highBound) {
          highBound += Math.round((high - highBound) / boxSize) * boxSize;
        } else if (low < highBound - reversal) {
          let newHighBound = highBound - boxSize,
            newLowBound =
              lowBound - Math.round((lowBound - low) / boxSize) * boxSize;
          if (Math.abs(newHighBound - newLowBound) > 1e-4) {
            outOpen.push(lowBound);
            outHigh.push(highBound);
            outLow.push(lowBound);
            outClose.push(highBound);
            outVolume.push(volume);
            outDate.push(time);

            lowBound = newLowBound;
            highBound = newHighBound;

            volume = 0;
            time = null;
            isRaising = false;
          }
        }
      } else {
        // It's O column
        if (low < lowBound) {
          lowBound -= Math.round((lowBound - low) / boxSize) * boxSize;
        } else if (high > lowBound + reversal) {
          let newLowBound = lowBound + boxSize,
            newHighBound =
              highBound + Math.round((high - highBound) / boxSize) * boxSize;

          if (Math.abs(newHighBound - newLowBound) > 1e-4) {
            outOpen.push(highBound);
            outHigh.push(highBound);
            outLow.push(lowBound);
            outClose.push(lowBound);
            outVolume.push(volume);
            outDate.push(time);

            lowBound = newLowBound;
            highBound = newHighBound;

            volume = 0;
            time = null;
            isRaising = true;
          }
        }
      }
    }

    if (time) {
      outDate.push(time);
      outOpen.push(isRaising ? lowBound : highBound);
      outHigh.push(highBound);
      outLow.push(lowBound);
      outClose.push(isRaising ? highBound : lowBound);
      outVolume.push(volume);
    }

    return outDataSeries;
  }

  static convertToKagi(
    inDataSeries: IBarDataSeries,
    reversal: number,
    outDataSeries?: IBarDataSeries
  ): IBarDataSeries {
    let dsSuffix = DataSeriesSuffix;

    outDataSeries = this._setupBarDataSeries(
      dsSuffix.LINE_BREAK,
      outDataSeries
    );

    let inDate = <Date[]>inDataSeries.date.values,
      inOpen = <number[]>inDataSeries.open.values,
      inClose = <number[]>inDataSeries.close.values,
      inVolume = <number[]>inDataSeries.volume.values,
      count = inClose.length,
      outDate = <Date[]>outDataSeries.date.values,
      outOpen = <number[]>outDataSeries.open.values,
      outHigh = <number[]>outDataSeries.high.values,
      outLow = <number[]>outDataSeries.low.values,
      outClose = <number[]>outDataSeries.close.values,
      outVolume = <number[]>outDataSeries.volume.values;

    if (count === 0) return outDataSeries;

    let time = null,
      volume = 0,
      checkPrice = inClose[0],
      prevCheckPrice = inOpen[0],
      isRaising = checkPrice >= prevCheckPrice;

    for (let i = 0; i < count; i++) {
      if (!time) {
        time = new Date(inDate[i].getTime());
      }

      let price = inClose[i],
        delta = price - checkPrice,
        isReversal = isRaising !== delta >= 0;

      if (isReversal && Math.abs(delta) >= reversal) {
        outDate.push(time);
        outOpen.push(prevCheckPrice);
        outHigh.push(Math.max(prevCheckPrice, checkPrice));
        outLow.push(Math.min(prevCheckPrice, checkPrice));
        outClose.push(checkPrice);
        outVolume.push(volume);

        prevCheckPrice = checkPrice;
        checkPrice = price;
        isRaising = !isRaising;
        time = null;
        volume = 0;
      } else {
        checkPrice = isRaising
          ? Math.max(checkPrice, price)
          : Math.min(checkPrice, price);
        volume += inVolume[0];
      }
    }

    return outDataSeries;
  }
}
