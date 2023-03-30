import { Field } from "./Field";
import { Recordset } from "./Recordset";
import { MovingAverage } from "./MovingAverage";
import { Const } from "./TASdk";
import { General } from "./General";
import { Oscillator } from "./Oscillator";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


// @if SCX_LICENSE != 'free'

export class Bands {
  // @if SCX_LICENSE = 'full'

  movingAverageEnvelope(
    pSource: Field,
    Periods: number,
    MAType: number,
    Shift: number
  ): Recordset {
    let MA = new MovingAverage();
    let Results = null;
    let Field1 = null;
    let Field2 = null;
    let RecordCount = 0;
    let Record = 0;
    let Value = 0;
    RecordCount = pSource.recordCount;
    if (MAType < Const.mA_START || MAType > Const.mA_END) {
      return null;
    }
    if (Periods < 1 || Periods > RecordCount) {
      return null;
    }
    if (Shift < 0 || Shift > 100) {
      return null;
    }
    Field1 = new Field();
    Field1.initialize(RecordCount, "Envelope Top");
    Field2 = new Field();
    Field2.initialize(RecordCount, "Envelope Bottom");
    Results = MA.movingAverageSwitch(
      pSource,
      Periods,
      MAType,
      "Envelope Median"
    );
    let nav = 1;
    Shift = Shift / 100;
    for (Record = 1; Record < RecordCount + 1; Record++) {
      Value = Results.value("Envelope Median", nav);
      Field1.setValue(nav, Value + Value * Shift);
      Value = Results.value("Envelope Median", nav);
      Field2.setValue(nav, Value - Value * Shift);
      nav++;
    }
    if (Results != null) {
      Results.addField(Field1);
      Results.addField(Field2);
    }
    return Results;
  }

  highLowBands(
    HighPrice: Field,
    LowPrice: Field,
    ClosePrice: Field,
    Periods: number
  ): Recordset {
    let MA = new MovingAverage();
    let Results = new Recordset();
    let RS1;
    let RS2;
    let RS3;
    if (Periods < 6 || Periods > HighPrice.recordCount) {
      return null;
    }
    RS1 = MA.VIDYA(HighPrice, Periods, 0.8, "High Low Bands Top");
    RS2 = MA.VIDYA(
      ClosePrice,
      parseInt(<any>(Periods / 2), 10),
      0.8,
      "High Low Bands Median"
    );
    RS3 = MA.VIDYA(LowPrice, Periods, 0.8, "High Low Bands Bottom");
    Results.addField(RS1.getField("High Low Bands Top"));
    Results.addField(RS2.getField("High Low Bands Median"));
    Results.addField(RS3.getField("High Low Bands Bottom"));
    RS1.removeField("High Low Bands Top");
    RS2.removeField("High Low Bands Median");
    RS3.removeField("High Low Bands Bottom");
    return Results;
  }

  fractalChaosBands(pOHLCV: Recordset, Periods: number): Recordset {
    let MA = new MovingAverage();
    let Results = new Recordset();
    let RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    let Record = 0;
    if (Periods < 1) {
      Periods = 100;
    }
    let rsFractals = null;
    let fHiFractal = new Field();
    fHiFractal.initialize(RecordCount, "Fractal High");
    let fLoFractal = new Field();
    fLoFractal.initialize(RecordCount, "Low High");
    let fHLM = new Field();
    fHLM.initialize(RecordCount, "HLM");
    let fH = pOHLCV.getField("High");
    let fL = pOHLCV.getField("Low");
    let fFR = new Field();
    fFR.initialize(RecordCount, "FR");
    let fH1 = new Field();
    fH1.initialize(RecordCount, "High 1");
    let fH2 = new Field();
    fH2.initialize(RecordCount, "High 2");
    let fH3 = new Field();
    fH3.initialize(RecordCount, "High 3");
    let fH4 = new Field();
    fH4.initialize(RecordCount, "High 4");
    let fL1 = new Field();
    fL1.initialize(RecordCount, "Low 1");
    let fL2 = new Field();
    fL2.initialize(RecordCount, "Low 2");
    let fL3 = new Field();
    fL3.initialize(RecordCount, "Low 3");
    let fL4 = new Field();
    fL4.initialize(RecordCount, "Low 4");
    for (Record = 5; Record < RecordCount + 1; ++Record) {
      fH1.setValue(Record, fH.value(Record - 4));
      fL1.setValue(Record, fL.value(Record - 4));
      fH2.setValue(Record, fH.value(Record - 3));
      fL2.setValue(Record, fL.value(Record - 3));
      fH3.setValue(Record, fH.value(Record - 2));
      fL3.setValue(Record, fL.value(Record - 2));
      fH4.setValue(Record, fH.value(Record - 1));
      fL4.setValue(Record, fL.value(Record - 1));
    }
    for (Record = 1; Record < RecordCount + 1; ++Record) {
      fHiFractal.setValue(Record, (fH.value(Record) + fL.value(Record)) / 3);
    }
    rsFractals = MA.simpleMovingAverage(fHiFractal, Periods, "Fractal High");
    fHiFractal = rsFractals.getField("Fractal High");
    rsFractals.removeField("Fractal High");
    rsFractals = MA.simpleMovingAverage(fLoFractal, Periods, "Fractal Low");
    fLoFractal = rsFractals.getField("Fractal Low");
    rsFractals.removeField("Fractal Low");
    for (Record = 1; Record < RecordCount + 1; ++Record) {
      fHiFractal.setValue(Record, fH3.value(Record) + fHiFractal.value(Record));
      fLoFractal.setValue(Record, fL3.value(Record) - fLoFractal.value(Record));
    }
    for (Record = 2; Record < RecordCount + 1; ++Record) {
      if (
        fH3.value(Record) > fH1.value(Record) &&
        fH3.value(Record) > fH2.value(Record) &&
        fH3.value(Record) >= fH4.value(Record) &&
        fH3.value(Record) >= fH.value(Record)
      ) {
        fFR.setValue(Record, fHiFractal.value(Record));
      } else {
        fFR.setValue(Record, 0);
      }
      if (!fFR.value(Record)) {
        if (
          fL3.value(Record) < fL1.value(Record) &&
          fL3.value(Record) < fL2.value(Record) &&
          fL3.value(Record) <= fL4.value(Record) &&
          fL3.value(Record) <= fL.value(Record)
        ) {
          fFR.setValue(Record, fLoFractal.value(Record));
        } else {
          fFR.setValue(Record, 0);
        }
      }
      if (fHiFractal.value(Record) === fFR.value(Record)) {
        fHiFractal.setValue(Record, fH3.value(Record));
      } else {
        fHiFractal.setValue(Record, fHiFractal.value(Record - 1));
      }
      if (fLoFractal.value(Record) === fFR.value(Record)) {
        fLoFractal.setValue(Record, fL3.value(Record));
      } else {
        fLoFractal.setValue(Record, fLoFractal.value(Record - 1));
      }
    }
    for (Record = 2; Record < RecordCount + 1; ++Record) {
      if (!fLoFractal.value(Record)) {
        fLoFractal.setValue(Record, Const.nullValue);
      }
      if (!fHiFractal.value(Record)) {
        fHiFractal.setValue(Record, Const.nullValue);
      }
    }
    Results.addField(fHiFractal);
    Results.addField(fLoFractal);
    return Results;
  }

  primeNumberBands(HighPrice: Field, LowPrice: Field): Recordset {
    let Results = new Recordset();
    let RecordCount = HighPrice.recordCount;
    let Record = 0;
    let fTop = new Field();
    fTop.initialize(RecordCount, "Prime Bands Top");
    let fBottom = new Field();
    fBottom.initialize(RecordCount, "Prime Bands Bottom");
    let GN = new General();
    let N = 0;
    let Value = 0;
    let Top = 0,
      Bottom = 0;
    for (Record = 1; Record <= RecordCount; ++Record) {
      Value = LowPrice.value(Record);
      for (N = Value; N > 1; --N) {
        if (GN.isPrime(N)) {
          Bottom = N;
          break;
        }
      }
      fBottom.setValue(Record, Bottom);
      Value = HighPrice.value(Record);
      for (N = Value; N < Value * 2; ++N) {
        if (GN.isPrime(N)) {
          Top = N;
          break;
        }
      }
      fTop.setValue(Record, Top);
    }
    Results.addField(fTop);
    Results.addField(fBottom);
    return Results;
  }

  keltner(
    pOHLCV: Recordset,
    Periods: number,
    Factor: number,
    MAType: number,
    Alias: string
  ): Recordset {
    let Results = new Recordset();
    let recordCount = pOHLCV.getFieldByIndex(0).recordCount;
    let top = new Field();
    top.initialize(recordCount, Alias + " Top");
    let bottom = new Field();
    bottom.initialize(recordCount, Alias + " Bottom");
    let os = new Oscillator();
    let tr = os.trueRange(pOHLCV, "atr").getField("atr");
    let ma = new MovingAverage();
    let atr = ma.simpleMovingAverage(tr, Periods, "atr").getField("atr");
    let median = ma
      .movingAverageSwitch(
        pOHLCV.getField("Close"),
        Periods,
        MAType,
        Alias + " Median"
      )
      .getField(Alias + " Median");
    for (let record = 1; record < recordCount + 1; record++) {
      let shift = Factor * atr.value(record);
      top.setValue(record, median.value(record) + shift);
      bottom.setValue(record, median.value(record) - shift);
    }
    Results.addField(top);
    Results.addField(median);
    Results.addField(bottom);
    return Results;
  }

  // Conversion Line Periods/Tenkan Sen, default period value = 9
  // Base Line Periods/Kijun Sen, default period value = 26
  // Logging Span 2 Periods/Senkou Span B, default period value = 52
  ichimoku(
    pOHLCV: Recordset,
    ConversionLinePeriods: number,
    BaseLinePeriods: number,
    LoggingSpan2Periods: number
  ): Recordset {
    let Results = new Recordset(),
      recordCount = pOHLCV.getFieldByIndex(0).recordCount,
      tenkanSen = new Field(), // Conversion Line Periods/Tenkan Sen, default priod value = 9
      kijunSen = new Field(), // Base Line Periods/Kijun Sen, default period value = 26
      chikouSpan = new Field(), // OHLC Close/Chikou Span
      senkouSpanB = new Field(), // Logging Span 2 Periods/Senkou Span B, default period value = 52
      senkouSpanA = new Field(), // Logging Span 1 Periods/Senkou Span A
      fH = pOHLCV.getField("High"),
      fL = pOHLCV.getField("Low"),
      fC = pOHLCV.getField("Close");

    tenkanSen.initialize(recordCount, "Ichimoku Tenkan Sen");
    kijunSen.initialize(recordCount, "Ichimoku Kijun Sen");
    chikouSpan.initialize(recordCount, "Ichimoku Chikou Span");
    senkouSpanB.initialize(recordCount, "Ichimoku Senkou Span B");
    senkouSpanA.initialize(recordCount, "Ichimoku Senkou Span A");

    let parameters = {
      tenkanSen: ConversionLinePeriods,
      kijunSen: BaseLinePeriods,
      senkouSpanB: LoggingSpan2Periods
    };

    // Iterate backwards
    for (let record = recordCount + 1; record >= 0; record--) {
      let min = fL.value(record); // low
      let max = fH.value(record); // high
      let currentParameters = {
        chikouSpan: fC.value(record), // close
        tenkanSen: null,
        kijunSen: null,
        senkouSpanB: null,
        senkouSpanA: null
      };

      for (let i = 0; i < parameters.senkouSpanB && record - i >= 0; i++) {
        let position = i + 1;

        min = Math.min(min, fL.value(record - i));
        max = Math.max(max, fH.value(record - i));

        currentParameters.tenkanSen =
          position === parameters.tenkanSen
            ? (min + max) / 2
            : currentParameters.tenkanSen;
        currentParameters.kijunSen =
          position === parameters.kijunSen
            ? (min + max) / 2
            : currentParameters.kijunSen;
        currentParameters.senkouSpanB =
          position === parameters.senkouSpanB
            ? (min + max) / 2
            : currentParameters.senkouSpanB;
      }

      // Initialize if enough data
      currentParameters.senkouSpanA =
        currentParameters.tenkanSen !== null &&
          currentParameters.kijunSen !== null
          ? (currentParameters.tenkanSen + currentParameters.kijunSen) / 2
          : null;

      tenkanSen.setValue(record, currentParameters.tenkanSen);
      kijunSen.setValue(record, currentParameters.kijunSen);
      chikouSpan.setValue(record, currentParameters.chikouSpan);
      senkouSpanB.setValue(record, currentParameters.senkouSpanB);
      senkouSpanA.setValue(record, currentParameters.senkouSpanA);
    }

    Results.addField(tenkanSen);
    Results.addField(kijunSen);
    Results.addField(chikouSpan);
    Results.addField(senkouSpanB);
    Results.addField(senkouSpanA);

    return Results;
  }

  darvasbox(pOHLCV: Recordset, DarvasBoxLinePeriods: number): Recordset {
    let Results = new Recordset(),
      recordCount = pOHLCV.getFieldByIndex(1).recordCount,
      topLine = new Field(),
      bottomLine = new Field(),
      fH = pOHLCV.getField("High"),
      fL = pOHLCV.getField("Low");

    topLine.initialize(recordCount, "Top Line");
    bottomLine.initialize(recordCount, "Bottom Line");

    let parameters = {
      topLine: DarvasBoxLinePeriods,
      bottomLine: DarvasBoxLinePeriods
    };

    // Iterate backwards
    for (let record = recordCount + 1; record >= 0; record--) {
      let min = fL.value(record); // low
      let max = fH.value(record); // high
      let currentParameters = {
        topLine: null,
        bottomLine: null
      };

      for (let i = 0; i < parameters.bottomLine && record - i >= 1; i++) {
        let position = i + 1;

        max = Math.max(max, fH.value(record - i));
        min = Math.min(min, fL.value(record - i));

        currentParameters.topLine =
          position === parameters.topLine ? max : currentParameters.topLine;
        currentParameters.bottomLine = parameters.bottomLine
          ? min
          : currentParameters.bottomLine;
      }
      topLine.setValue(record, currentParameters.topLine);
      bottomLine.setValue(record, currentParameters.bottomLine);
    }

    Results.addField(topLine);
    Results.addField(bottomLine);

    return Results;
  }

  // @endif

  bollingerBands(
    pSource: Field,
    Periods: number,
    StandardDeviations: number,
    MAType: number
  ): Recordset {
    let MA = new MovingAverage();
    let Results = null;
    let Field1 = null;
    let Field2 = null;
    let Period = 0;
    let RecordCount = 0;
    let Record = 0;
    let Start = 0;
    let Sum = 0;
    let Value = 0;
    RecordCount = pSource.recordCount;
    if (MAType < Const.mA_START || MAType > Const.mA_END) {
      return null;
    }
    if (Periods < 1 || Periods > RecordCount) {
      return null;
    }
    if (StandardDeviations < 0 || StandardDeviations > 100) {
      return null;
    }
    Field1 = new Field();
    Field1.initialize(RecordCount, "Bollinger Band Bottom");
    Field2 = new Field();
    Field2.initialize(RecordCount, "Bollinger Band Top");
    Results = MA.movingAverageSwitch(
      pSource,
      Periods,
      MAType,
      "Bollinger Band Median"
    );
    Start = Periods + 1;
    let nav = Start;
    for (Record = Start; Record < RecordCount + 1; Record++) {
      Sum = 0;
      Value = Results.value("Bollinger Band Median", nav);
      for (Period = 1; Period < Periods + 1; Period++) {
        Sum += (pSource.value(nav) - Value) * (pSource.value(nav) - Value);
        nav--;
      }
      nav += Periods;
      Value = StandardDeviations * Math.sqrt(Sum / Periods);
      Field1.setValue(nav, Results.value("Bollinger Band Median", nav) - Value);
      Field2.setValue(nav, Results.value("Bollinger Band Median", nav) + Value);
      nav++;
    }
    if (Results != null) {
      Results.addField(Field1);
      Results.addField(Field2);
    }
    return Results;
  }
}

// @endif
