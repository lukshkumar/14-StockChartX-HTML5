import { Recordset } from "./Recordset";
import { Field } from "./Field";
import { MovingAverage } from "./MovingAverage";
import { TimeSpan } from "../StockChartX/index";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

export class General {
  // @if SCX_LICENSE = 'full'

  highMinusLow(pOHLCV: Recordset, Alias: string): Recordset {
    let Field1;
    let Results = new Recordset();
    let Record = 0;
    let RecordCount = 0;
    let Value = 0;
    RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    for (Record = 1; Record < RecordCount + 1; Record++) {
      Value =
        pOHLCV.getField("High").value(Record) -
        pOHLCV.getField("Low").value(Record);
      Field1.setValue(Record, Value);
    }
    Results.addField(Field1);
    return Results;
  }

  medianPrice(pOHLCV: Recordset, Alias: string): Recordset {
    let Field1;
    let Results = new Recordset();
    let Record = 0;
    let RecordCount = 0;
    let Value = 0;
    RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    for (Record = 1; Record < RecordCount + 1; Record++) {
      Value =
        (pOHLCV.getField("High").value(Record) +
          pOHLCV.getField("Low").value(Record)) /
        2;
      Field1.setValue(Record, Value);
    }
    Results.addField(Field1);
    return Results;
  }

  typicalPrice(pOHLCV: Recordset, Alias: string): Recordset {
    let Field1;
    let Results = new Recordset();
    let Record = 0;
    let RecordCount = 0;
    let Value = 0;
    RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    for (Record = 1; Record < RecordCount + 1; Record++) {
      let high = pOHLCV.getField("High").value(Record),
        low = pOHLCV.getField("Low").value(Record),
        close = pOHLCV.getField("Close").value(Record);

      Value = (high + low + close) / 3;
      Field1.setValue(Record, Value);
    }
    Results.addField(Field1);
    return Results;
  }

  weightedClose(pOHLCV: Recordset, Alias: string): Recordset {
    let Field1;
    let Results = new Recordset();
    let Record = 0;
    let RecordCount = 0;
    let Value = 0;
    RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    for (Record = 1; Record < RecordCount + 1; Record++) {
      let high = pOHLCV.getField("High").value(Record),
        low = pOHLCV.getField("Low").value(Record),
        close = pOHLCV.getField("Close").value(Record);

      Value = (high + low + close * 2) / 4;
      Field1.setValue(Record, Value);
    }
    Results.addField(Field1);
    return Results;
  }

  volumeROC(Volume: Field, Periods: number, Alias: string): Recordset {
    let Field1;
    let Results = new Recordset();
    let Record = 0;
    let RecordCount = 0;
    let Value = 0;
    let Start = 0;
    let PrevVolume = 0;
    RecordCount = Volume.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    Start = Periods + 1;
    let nav = Start;
    for (Record = Start; Record < RecordCount + 1; Record++) {
      PrevVolume = Volume.value(nav - Periods);
      if (!!PrevVolume) {
        Value = ((Volume.value(nav) - PrevVolume) / PrevVolume) * 100;
      }
      Field1.setValue(Record, Value);
      nav++;
    }
    Results.addField(Field1);
    return Results;
  }

  priceROC(pSource: Field, Periods: number, Alias: string): Recordset {
    let Field1;
    let Results = new Recordset();
    let Record = 0;
    let RecordCount = 0;
    let Value = 0;
    let Start = 0;
    let PrevPrice = 0;
    RecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    Start = Periods + 1;
    let nav = Start;
    for (Record = Start; Record < RecordCount + 1; Record++) {
      PrevPrice = pSource.value(nav - Periods);
      Value = ((pSource.value(nav) - PrevPrice) / PrevPrice) * 100;
      Field1.setValue(Record, Value);
      nav++;
    }
    Results.addField(Field1);
    return Results;
  }

  correlationAnalysis(pSource1: Field, pSource2: Field) {
    let Record = 0;
    let RecordCount = 0;
    let Total = 0;
    let A = 0;
    let B = 0;
    RecordCount = pSource1.recordCount;
    for (Record = 2; Record < RecordCount + 1; Record++) {
      A = pSource1.value(Record) - pSource1.value(Record - 1);
      B = pSource2.value(Record) - pSource2.value(Record - 1);
      if (A < 0) {
        A = -1 * A;
      }
      if (B < 0) {
        B = -1 * B;
      }
      Total += A * B;
    }
    Total = Total / (RecordCount - 2);
    return 1 - Total;
  }

  HHV(High: Field, Periods: number, Alias: string): Recordset {
    let Results = new Recordset();
    let Field1;
    let Max = 0;
    let RecordCount = High.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    for (let Record = Periods + 1; Record <= RecordCount; ++Record) {
      Max = High.value(Record);
      for (let N = Record; N > Record - Periods - 1; --N) {
        if (High.value(N) > Max) {
          Max = High.value(N);
        }
      }
      Field1.setValue(Record, Max);
    }
    Results.addField(Field1);
    return Results;
  }

  LLV(Low: Field, Periods: number, Alias: string): Recordset {
    let Results = new Recordset();
    let Min = 0;
    let RecordCount = Low.recordCount;
    let Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    for (let Record = Periods + 1; Record <= RecordCount; ++Record) {
      Min = Low.value(Record);
      for (let N = Record; N > Record - Periods - 1; --N) {
        if (Low.value(N) < Min) {
          Min = Low.value(N);
        }
      }
      Field1.setValue(Record, Min);
    }
    Results.addField(Field1);
    return Results;
  }

  isPrime(value: number): boolean {
    let divisor = 0;
    let increment = 0;
    let maxDivisor = 0;
    if (value > 3) {
      if (!(value % 2)) {
        return false;
      }
      if (!(value % 3)) {
        return false;
      }
    }
    divisor = 5;
    increment = 2;
    maxDivisor = Math.sqrt(value) + 1;
    while (divisor <= maxDivisor) {
      if (!(value % divisor)) {
        return false;
      }
      divisor += increment;
      increment = 6 - increment;
    }
    return true;
  }

  // @endif

  standardDeviation(
    pSource: Field,
    Periods: number,
    StandardDeviations: number,
    MAType: number,
    Alias: string
  ): Recordset {
    let Results = null;
    let MA = new MovingAverage();
    let Field1;
    let Period = 0;
    let RecordCount = 0;
    let Record = 0;
    let Start = 0;
    let Sum = 0;
    let Value = 0;
    RecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    Results = MA.movingAverageSwitch(pSource, Periods, MAType, "Temp");
    Start = Periods + 1;
    let nav = Start;
    for (Record = Start; Record < RecordCount + 1; Record++) {
      Sum = 0;
      Value = Results.value("Temp", nav);
      for (Period = 1; Period < Periods + 1; Period++) {
        Sum += (pSource.value(nav) - Value) * (pSource.value(nav) - Value);
        nav--;
      }
      nav += Periods;
      Value = StandardDeviations * Math.sqrt(Sum / Periods);
      Field1.setValue(nav, Value);
      nav++;
    }
    if (Results != null) {
      Results.addField(Field1);
    }
    Results.removeField("Temp");
    return Results;
  }
  VWAP(
    typicalPrice: Recordset,
    volumeField: Field,
    Alias: string,
    dateField: Field
  ): Recordset {
    let Results = new Recordset();
    let Field1 = new Field();
    let typicalPriceField = typicalPrice.getField(Alias);
    let RecordCount = typicalPriceField.recordCount;
    Field1.initialize(RecordCount, Alias);
    let CumulativeVolumePrice = 0;
    let CumulativeVolume = 0;
    let previousDate = moment(dateField.value(0));

    for (let Record = 1; Record < RecordCount + 1; Record++) {
      const nextDate = moment(dateField.value(Record));
      if (nextDate.day() !== previousDate.day()) {
        CumulativeVolumePrice = 0;
        CumulativeVolume = 0;
        previousDate = nextDate;
      }
      let VolumePrice =
        typicalPriceField.value(Record) * volumeField.value(Record);
      CumulativeVolumePrice += VolumePrice;
      CumulativeVolume += volumeField.value(Record);
      let Result = CumulativeVolumePrice / CumulativeVolume;
      Field1.setValue(Record, Result);
    }
    Results.addField(Field1);
    return Results;
  }
  pivotPoints(
    pOHLCV: Recordset,
    dateField: Field,
    numberOfPivotsBack,
    duration: string,
    timeInterval: number
  ): Recordset {
    let daysDiffMap = {
      daily: (d1, d2) => d1.day() !== d2.day(),
      monthly: (d1, d2) => d1.month() !== d2.month(),
      weekly: (d1, d2) => d1.week() !== d2.week(),
      yearly: (d1, d2) => d1.year() !== d2.year(),
      auto: null
    };

    if (duration === "auto") {
      if (timeInterval < 30 * TimeSpan.MILLISECONDS_IN_MINUTE) {
        daysDiffMap.auto = daysDiffMap.daily;
      } else if (timeInterval < TimeSpan.MILLISECONDS_IN_DAY) {
        daysDiffMap.auto = daysDiffMap.weekly;
      } else if (timeInterval < TimeSpan.MILLISECONDS_IN_WEEK) {
        daysDiffMap.auto = daysDiffMap.monthly;
      } else {
        daysDiffMap.auto = daysDiffMap.yearly;
      }
    }
    let pivotField = new Field();
    let s1Field = new Field();
    let s2Field = new Field();
    let s3Field = new Field();
    let r1Field = new Field();
    let r2Field = new Field();
    let r3Field = new Field();

    let Results = new Recordset();

    const highField = pOHLCV.getField("High");
    const lowField = pOHLCV.getField("Low");
    const openField = pOHLCV.getField("Open");
    const closeField = pOHLCV.getField("Close");
    let RecordCount = dateField.recordCount;

    pivotField.initialize(RecordCount, "Pivot Points");
    s1Field.initialize(RecordCount, "S1");
    s2Field.initialize(RecordCount, "S2");
    s3Field.initialize(RecordCount, "S3");
    r1Field.initialize(RecordCount, "R1");
    r2Field.initialize(RecordCount, "R2");
    r3Field.initialize(RecordCount, "R3");

    let prevDate = moment(dateField._m_values[1]);
    let high = highField._m_values[1],
    close = closeField._m_values[1],
    low = lowField._m_values[1];

    pivotField.setValue(0, null);
    s1Field.setValue(0, null);
    r1Field.setValue(0, null);
    s2Field.setValue(0, null);
    r2Field.setValue(0, null);
    s3Field.setValue(0, null);
    r3Field.setValue(0, null);

    pivotField.setValue(1, null);
    s1Field.setValue(1, null);
    r1Field.setValue(1, null);
    s2Field.setValue(1, null);
    r2Field.setValue(1, null);
    s3Field.setValue(1, null);
    r3Field.setValue(1, null);

    for (let i = 2; i <= RecordCount; i++) {
      let nextDate = moment(dateField._m_values[i]);
      if (daysDiffMap[duration](nextDate, prevDate)) {
     
        const pp = (high + low + close) / 3;
        prevDate = moment(dateField._m_values[i]);
        const s1 = 2 * pp - high;
        const r1 = 2 * pp - low;
        const s2 = pp - (high - low);
        const r2 = pp + (high - low);
        const s3 = low - 2 * (high - pp);
        const r3 = high + 2 * (pp - low);
        pivotField.setValue(i, pp);
        s1Field.setValue(i, s1);
        r1Field.setValue(i, r1);
        s2Field.setValue(i, s2);
        r2Field.setValue(i, r2);
        s3Field.setValue(i, s3);
        r3Field.setValue(i, r3);

        high = highField._m_values[i],
        close = closeField._m_values[i],
        low = lowField._m_values[i];

      } else {
        pivotField.setValue(i, pivotField.value(i - 1));
        s1Field.setValue(i, s1Field.value(i - 1));
        r1Field.setValue(i, r1Field.value(i - 1));
        s2Field.setValue(i, s2Field.value(i - 1));
        r2Field.setValue(i, r2Field.value(i - 1));
        s3Field.setValue(i, s3Field.value(i - 1));
        r3Field.setValue(i, r3Field.value(i - 1));

        if(highField._m_values[i] > high) {
          high = highField._m_values[i];
        }
        if(lowField._m_values[i] < low ){
          low = lowField._m_values[i];
        }
        close = closeField._m_values[i];
    
      }
    }

    Results.addField(pivotField);
    Results.addField(s1Field);
    Results.addField(r1Field);
    Results.addField(s2Field);
    Results.addField(r2Field);
    Results.addField(s3Field);
    Results.addField(r3Field);
    return Results;
  }
}
