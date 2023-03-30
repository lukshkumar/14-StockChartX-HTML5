import { Field } from "./Field";
import { Recordset } from "./Recordset";
import { LinearRegression } from "./LinearRegression";
import { Oscillator } from "./Oscillator";
/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

export class MovingAverage {
  simpleMovingAverage(
    pSource: Field,
    iPeriods: number,
    sAlias: string
  ): Recordset {
    let dAvg = 0;
    let iPeriod = 0;
    let Field1;
    let Results = new Recordset();
    let iRecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(iRecordCount, sAlias);
    let iStart = iPeriods + 1;
    let nav = iStart;
    for (let iRecord = iStart; iRecord < iRecordCount + 1; iRecord++) {
      dAvg = 0;
      for (iPeriod = 1; iPeriod < iPeriods + 1; iPeriod++) {
        dAvg += pSource.value(nav);
        nav--;
      }
      nav += iPeriods;
      dAvg /= iPeriods;
      Field1.setValue(nav, dAvg);
      nav++;
    }
    Results.addField(Field1);
    return Results;
  }

  // @if SCX_LICENSE != 'free'

  exponentialMovingAverage(
    pSource: Field,
    iPeriods: number,
    sAlias: string
  ): Recordset {
    let dPrime = 0;
    let iRecord = 0;
    let Field1;
    let Results = new Recordset();
    let iRecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(iRecordCount, sAlias);
    let dExp = 2 / (iPeriods + 1);
    for (iRecord = 1; iRecord < iPeriods + 1; iRecord++) {
      dPrime += pSource.value(iRecord);
    }
    dPrime /= iPeriods;
    let dValue = pSource.value(iRecord) * (1 - dExp) + dPrime * dExp;
    Field1.setValue(iPeriods, dValue);
    for (iRecord = iPeriods + 1; iRecord < iRecordCount + 1; iRecord++) {
      dValue =
        Field1.value(iRecord - 1) * (1 - dExp) + pSource.value(iRecord) * dExp;
      Field1.setValue(iRecord, dValue);
    }
    Results.addField(Field1);
    return Results;
  }

  // @endif

  // @if SCX_LICENSE = 'full'

  timeSeriesMovingAverage(
    pSource: Field,
    iPeriods: number,
    sAlias: string
  ): Recordset {
    let LR = new LinearRegression();
    let Value = 0;
    let Field1;
    let RecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, sAlias);
    let Results = LR.regression(pSource, iPeriods);
    for (let Record = 1; Record < RecordCount + 1; Record++) {
      Value = Results.value("Forecast", Record);
      Field1.setValue(Record, Value);
    }
    Results.addField(Field1);
    return Results;
  }

  variableMovingAverage(
    pSource: Field,
    iPeriods: number,
    sAlias: string
  ): Recordset {
    let OS = new Oscillator();
    let CMO = 0;
    let VMA = 0;
    let PrevVMA = 0;
    let Price = 0;
    let Field1;
    let Results;
    let RecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, sAlias);
    Results = OS.chandeMomentumOscillator(pSource, iPeriods, "CMO");
    let Start = 2;
    for (let Record = Start; Record < RecordCount + 1; Record++) {
      PrevVMA = Field1.value(Record - 1);
      CMO = Results.value("CMO", Record) / 100;
      Price = pSource.value(Record);
      if (CMO < 0) {
        CMO = -1 * CMO;
      }
      VMA = CMO * Price + (1 - CMO) * PrevVMA;
      Field1.setValue(Record, VMA);
    }
    Results.addField(Field1);
    return Results;
  }

  triangularMovingAverage(
    pSource: Field,
    Periods: number,
    Alias: string
  ): Recordset {
    let Record = 0;
    let RecordCount = 0;
    let Start = 0;
    let Period = 0;
    let MA1 = 0;
    let MA2 = 0;
    let Avg = 0;
    let Field1;
    let Field2;
    let Results = new Recordset();
    RecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, "MA1");
    Field2 = new Field();
    Field2.initialize(RecordCount, Alias);
    if (Periods % 2 > 0) {
      MA1 = parseInt(<any>(Periods / 2), 10) + 1;
      MA2 = MA1;
    } else {
      MA1 = Periods / 2;
      MA2 = MA1 + 1;
    }
    Start = Periods + 1;
    let nav = Start;
    for (Record = Start; Record < RecordCount + 1; Record++) {
      Avg = 0;
      for (Period = 1; Period < MA1 + 1; Period++) {
        Avg += pSource.value(nav);
        nav--;
      }
      nav += parseInt(<any>MA1, 10);
      Avg = Avg / MA1;
      Field1.setValue(nav, Avg);
      nav++;
    }
    nav = Start;
    for (Record = Start; Record < RecordCount + 1; Record++) {
      Avg = 0;
      for (Period = 1; Period < MA2 + 1; Period++) {
        Avg += Field1.value(nav);
        nav--;
      }
      nav += parseInt(<any>MA2, 10);
      Avg = Avg / MA2;
      Field2.setValue(nav, Avg);
      nav++;
    }
    Results.addField(Field2);
    return Results;
  }

  weightedMovingAverage(
    pSource: Field,
    Periods: number,
    Alias: string
  ): Recordset {
    let Total = 0;
    let Weight = 0;
    let Period = 0;
    let Start = 0;
    let Record = 0;
    let RecordCount = 0;
    let Field1;
    let Results = new Recordset();
    RecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    for (Period = 1; Period < Periods + 1; Period++) {
      Weight += Period;
    }
    Start = Periods + 1;
    let nav = Start;
    for (Record = Start; Record < RecordCount + 1; Record++) {
      Total = 0;
      for (Period = Periods; Period > 0; Period--) {
        Total += Period * pSource.value(nav);
        nav--;
      }
      nav += Periods;
      Total = Total / Weight;
      Field1.setValue(nav, Total);
      nav++;
    }
    Results.addField(Field1);
    return Results;
  }

  VIDYA(
    pSource: Field,
    Periods: number,
    R2Scale: number,
    Alias: string
  ): Recordset {
    let Record = 0;
    let RecordCount = 0;
    let Start = 0;
    let R2Scaled = 0;
    let PreviousValue = 0;
    let Field1;
    let LR = new LinearRegression();
    let Results;
    RecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    Results = LR.regression(pSource, Periods);
    Start = 2;
    let nav = Start;
    for (Record = Start; Record < RecordCount + 1; Record++) {
      PreviousValue = pSource.value(nav - 1);
      R2Scaled = Results.value("RSquared", nav) * R2Scale;
      Field1.setValue(
        nav,
        R2Scaled * pSource.value(nav) + (1 - R2Scaled) * PreviousValue
      );
      nav++;
    }
    Results.addField(Field1);
    return Results;
  }

  wellesWilderSmoothing(
    pSource: Field,
    Periods: number,
    Alias: string
  ): Recordset {
    let Field1;
    let Results = new Recordset();
    let Record = 0;
    let RecordCount = 0;
    let Value = 0;
    RecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    for (Record = 2; Record < RecordCount + 1; ++Record) {
      Value =
        Field1.value(Record - 1) +
        (1 / Periods) * (pSource.value(Record) - Field1.value(Record - 1));
      Field1.setValue(Record, Value);
    }
    Results.addField(Field1);
    return Results;
  }

  mcGinleysDynamic(pSource: Field, Periods: number, Alias: string): Recordset {
    let Results = new Recordset();
    let MA = new MovingAverage();
    let EMA = null;
    let RecordCount = pSource.recordCount;
    let Record = 0;
    let Field1;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    EMA = MA.exponentialMovingAverage(pSource, Periods, "MA");
    for (Record = 2; Record <= RecordCount; Record++) {
      let value =
        EMA.value("MA", Record - 1) +
        (pSource.value(Record) - EMA.value("MA", Record - 1)) /
          ((pSource.value(Record) / EMA.value("MA", Record - 1)) * 125);
      Field1.setValue(Record, value);
    }
    Results.addField(Field1);
    return Results;
  }

  // @endif

  movingAverageSwitch(
    field: Field,
    periods: number,
    maType: number,
    alias: string
  ): Recordset {
    let ret = null;
    switch (maType) {
      case 0:
        ret = this.simpleMovingAverage(field, periods, alias);
        break;
      // @if SCX_LICENSE != 'free'
      case 1:
        ret = this.exponentialMovingAverage(field, periods, alias);
        break;
      // @endif
      // @if SCX_LICENSE = 'full'
      case 2:
        ret = this.timeSeriesMovingAverage(field, periods, alias);
        break;
      case 3:
        ret = this.triangularMovingAverage(field, periods, alias);
        break;
      case 4:
        ret = this.variableMovingAverage(field, periods, alias);
        break;
      case 7:
        ret = this.weightedMovingAverage(field, periods, alias);
        break;
      case 5:
        ret = this.VIDYA(field, periods, 0.65, alias);
        break;
      case 6:
        ret = this.wellesWilderSmoothing(field, periods, alias);
        break;
      // @endif
      default:
        break;
    }
    return ret;
  }
}
