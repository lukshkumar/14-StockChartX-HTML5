import { Recordset } from "./Recordset";
import { Field } from "./Field";
import { Const } from "./TASdk";
import { General } from "./General";
import { MovingAverage } from "./MovingAverage";
import { Oscillator } from "./Oscillator";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

export class Index {
  // @if SCX_LICENSE = 'full'

  moneyFlowIndex(pOHLCV: Recordset, Periods: number, Alias: string): Recordset {
    let Results = new Recordset();
    let Field1;
    let RecordCount = 0;
    let Record = 0;
    let Period = 0;
    let Start = 0;
    let Price1 = 0;
    let Price2 = 0;
    let V = 0;
    let PosFlow = 0;
    let NegFlow = 0;
    let MoneyIndex = 0;
    let MoneyRatio = 0;
    RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    if (Periods < 1 || Periods > RecordCount) {
      return null;
    }
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    Start = Periods + 2;
    let nav = Start;
    for (Record = Start; Record < RecordCount + 2; Record++) {
      PosFlow = 0;
      NegFlow = 0;
      nav = Record - Periods;
      for (Period = 1; Period < Periods + 1; Period++) {
        nav--;
        let high = pOHLCV.getField("High").value(nav),
          low = pOHLCV.getField("Low").value(nav),
          close = pOHLCV.getField("Close").value(nav);
        Price1 = (high + low + close) / 3;
        nav++;
        V = pOHLCV.getField("Volume").value(nav);
        if (V < 1) {
          V = 1;
        }

        high = pOHLCV.getField("High").value(nav);
        low = pOHLCV.getField("Low").value(nav);
        close = pOHLCV.getField("Close").value(nav);
        Price2 = (high + low + close) / 3;
        if (Price2 > Price1) {
          PosFlow += Price2 * V;
        } else if (Price2 < Price1) {
          NegFlow += Price2 * V;
        }
        nav++;
      }
      nav--;
      if (!!PosFlow && !!NegFlow) {
        MoneyRatio = PosFlow / NegFlow;
        MoneyIndex = 100 - 100 / (1 + MoneyRatio);
        Field1.setValue(nav, MoneyIndex);
      }
    }
    Results.addField(Field1);
    return Results;
  }

  tradeVolumeIndex(
    pSource: Field,
    Volume: Field,
    MinTickValue: number,
    Alias: string
  ): Recordset {
    let Results = new Recordset();
    let Field1;
    let RecordCount = 0;
    let Record = 0;
    let Start = 0;
    let Direction = 0;
    let LastDirection = 0;
    let Change = 0;
    let TVI = 0;
    RecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    Start = 2;
    let nav = Start;
    for (Record = Start; Record < RecordCount + 1; Record++) {
      Change = pSource.value(nav) - pSource.value(nav - 1);
      if (Change > MinTickValue) {
        Direction = 1;
      } else if (Change < -MinTickValue) {
        Direction = -1;
      }
      if (Change <= MinTickValue && Change >= -MinTickValue) {
        Direction = LastDirection;
      }
      LastDirection = Direction;
      if (Direction === 1) {
        TVI = TVI + Volume.value(nav);
      } else if (Direction === -1) {
        TVI = TVI - Volume.value(nav);
      }
      TVI /= 10000;
      Field1.setValue(nav, TVI);
      nav++;
    }
    Results.addField(Field1);
    return Results;
  }

  swingIndex(
    pOHLCV: Recordset,
    LimitMoveValue: number,
    Alias: string
  ): Recordset {
    let Results = new Recordset();
    let Field1;
    let RecordCount = 0;
    let Record = 0;
    let Start = 0;
    let Cy = 0;
    let Ct = 0;
    let Oy = 0;
    let Ot = 0;
    let Ht = 0;
    let Lt = 0;
    let K = 0;
    let R = 0;
    let A = 0;
    let B = 0;
    let C = 0;
    let Value = 0;
    RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    if (LimitMoveValue <= 0) {
      return null;
    }
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    Start = 2;
    let nav = Start;
    for (Record = Start; Record < RecordCount + 1; Record++) {
      Oy = pOHLCV.getField("Open").value(nav - 1);
      Ot = pOHLCV.getField("Open").value(nav);
      Ht = pOHLCV.getField("High").value(nav);
      Lt = pOHLCV.getField("Low").value(nav);
      Cy = pOHLCV.getField("Close").value(nav - 1);
      Ct = pOHLCV.getField("Close").value(nav);
      if (Math.abs(Ht - Cy) > Math.abs(Lt - Cy)) {
        K = Math.abs(Ht - Cy);
      } else if (Math.abs(Lt - Cy) > Math.abs(Ht - Cy)) {
        K = Math.abs(Lt - Cy);
      } else {
        K = Math.abs(Ht - Cy);
      }
      A = Math.abs(Ht - Cy);
      B = Math.abs(Lt - Cy);
      C = Math.abs(Ht - Lt);
      if (A > B && A > C) {
        R =
          Math.abs(Ht - Cy) -
          0.5 * Math.abs(Lt - Cy) +
          0.25 * Math.abs(Cy - Oy);
      } else if (B > A && B > C) {
        R =
          Math.abs(Lt - Cy) -
          0.5 * Math.abs(Ht - Cy) +
          0.25 * Math.abs(Cy - Oy);
      } else if (C > A && C > B) {
        R = Math.abs(Ht - Lt) + 0.25 * Math.abs(Cy - Oy);
      }
      if (R > 0 && LimitMoveValue > 0) {
        Value =
          (((50 * (Ct - Cy + 0.5 * (Ct - Ot) + 0.25 * (Cy - Oy))) / R) * K) /
          LimitMoveValue;
      } else {
        Value = 0;
      }
      Field1.setValue(nav, Value);
      nav++;
    }
    Results.addField(Field1);
    return Results;
  }

  accumulativeSwingIndex(
    pOHLCV: Recordset,
    LimitMoveValue: number,
    Alias: string
  ): Recordset {
    let Results = new Recordset();
    let RawSI;
    let Field1;
    let SI = new Index();
    let RecordCount = 0;
    let Record = 0;
    let Start = 0;
    let Value = 0;
    RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    RawSI = SI.swingIndex(pOHLCV, LimitMoveValue, "SI");
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    Start = 2;
    let nav = Start;
    for (Record = Start; Record < RecordCount + 1; Record++) {
      Value = RawSI.value("SI", nav) + Field1.value(nav - 1);
      Field1.setValue(nav, Value);
      nav++;
    }
    Results.addField(Field1);
    return Results;
  }

  comparativeRelativeStrength(
    pSource1: Field,
    pSource2: Field,
    Alias: string
  ): Recordset {
    let Results = new Recordset();
    let Field1;
    let RecordCount = 0;
    let Record = 0;
    let Value = 0;
    RecordCount = pSource1.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    let nav = 1;
    for (Record = 1; Record < RecordCount + 1; Record++) {
      Value = pSource1.value(nav) / pSource2.value(nav);
      if (Value === 1) {
        Value = Const.nullValue;
      }
      Field1.setValue(nav, Value);
      nav++;
    }
    Results.addField(Field1);
    return Results;
  }

  priceVolumeTrend(pSource: Field, Volume: Field, Alias: string): Recordset {
    let Results = new Recordset();
    let Field1;
    let RecordCount = 0;
    let Record = 0;
    let Start = 0;
    let Value = 0;
    RecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    Start = 2;
    let nav = Start;
    for (Record = Start; Record < RecordCount + 1; Record++) {
      let prev = pSource.value(nav - 1);
      Value =
        ((pSource.value(nav) - prev) / prev) * Volume.value(nav) +
        Field1.value(nav - 1);
      Value /= 10000;
      Field1.setValue(nav, Value);
      nav++;
    }
    Results.addField(Field1);
    return Results;
  }

  positiveVolumeIndex(pSource: Field, Volume: Field, Alias: string): Recordset {
    let Results = new Recordset();
    let Field1;
    let RecordCount = 0;
    let Record = 0;
    let Start = 0;
    let Value = 0;
    RecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    Start = 2;
    let nav = Start;
    Field1.setValue(1, 1);
    for (Record = Start; Record < RecordCount + 1; Record++) {
      if (Volume.value(nav) > Volume.value(nav - 1)) {
        let prev = pSource.value(nav - 1);
        Value =
          Field1.value(nav - 1) +
          ((pSource.value(nav) - prev) / prev) * Field1.value(nav - 1);
      } else {
        Value = Field1.value(nav - 1);
      }
      Field1.setValue(nav, Value);
      nav++;
    }
    Results.addField(Field1);
    return Results;
  }

  negativeVolumeIndex(pSource: Field, Volume: Field, Alias: string): Recordset {
    let Results = new Recordset();
    let Field1;
    let RecordCount = 0;
    let Record = 0;
    let Start = 0;
    let Value = 0;
    RecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    Start = 2;
    let nav = Start;
    Field1.setValue(1, 1);
    for (Record = Start; Record < RecordCount + 1; Record++) {
      if (Volume.value(nav) < Volume.value(nav - 1)) {
        let prev = pSource.value(nav - 1);
        Value =
          Field1.value(nav - 1) +
          ((pSource.value(nav) - prev) / prev) * Field1.value(nav - 1);
      } else {
        Value = Field1.value(nav - 1);
      }
      Field1.setValue(nav, Value);
      nav++;
    }
    Results.addField(Field1);
    return Results;
  }

  performance(pSource: Field, Alias: string): Recordset {
    let Results = new Recordset();
    let Field1;
    let RecordCount = 0;
    let Record = 0;
    let Start = 0;
    let FirstPrice = 0;
    let Value = 0;
    RecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    Start = 2;
    let nav = Start;
    FirstPrice = pSource.value(1);
    for (Record = Start; Record < RecordCount + 1; Record++) {
      Value = ((pSource.value(nav) - FirstPrice) / FirstPrice) * 100;
      Field1.setValue(nav, Value);
      nav++;
    }
    Results.addField(Field1);
    return Results;
  }

  massIndex(pOHLCV: Recordset, Periods: number, Alias: string): Recordset {
    let Results = new Recordset();
    let Field1;
    let GE = new General();
    let MA = new MovingAverage();
    let Temp;
    let HML;
    let EMA1;
    let EMA2;
    let RecordCount = 0;
    let Record = 0;
    let Start = 0;
    let Period = 0;
    let Sum = 0;
    RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    if (Periods < 1 || Periods > RecordCount) {
      return null;
    }
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    HML = GE.highMinusLow(pOHLCV, "HML");
    Temp = HML.getField("HML");
    EMA1 = MA.exponentialMovingAverage(Temp, 9, "EMA");
    Temp = EMA1.getField("EMA");
    EMA2 = MA.exponentialMovingAverage(Temp, 9, "EMA");
    Start = Periods * 2 + 1;
    let nav = Start;
    for (Record = Start; Record < RecordCount + 2; Record++) {
      Sum = 0;
      nav = Record - Periods;
      for (Period = 1; Period < Periods + 1; Period++) {
        let EMA2val = EMA2.value("EMA", nav);
        if (EMA2val !== 0) {
          Sum = Sum + EMA1.value("EMA", nav) / EMA2val;
        }
        nav++;
      }
      nav--;
      Field1.setValue(nav, Sum);
      nav++;
    }
    Results.addField(Field1);
    return Results;
  }

  chaikinMoneyFlow(
    pOHLCV: Recordset,
    Periods: number,
    Alias: string
  ): Recordset {
    let Results = new Recordset();
    let Field1;
    let RecordCount = 0;
    let Record = 0;
    let Value = 0;
    let MFM = 0,
      MFV = 0,
      SumV = 0;
    let a = 0,
      b = 0;
    RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    for (Record = Periods + 1; Record < RecordCount + 1; Record++) {
      SumV = 0;
      MFV = 0; // needs to be reset, otherwise values get inflated
      MFM = 0; // needs to be reset because in theory if a & b are both zero value gets carried to next iteration
      // iteration should be up to Periods
      for (let n = 0; n < Periods; ++n) {
        let close = pOHLCV.value("Close", Record - n),
          low = pOHLCV.value("Low", Record - n),
          high = pOHLCV.value("High", Record - n);

        a = close - low - (high - close);
        b = high - low;
        if (a !== 0 && b !== 0) {
          MFM = a / b;
        }
        MFV += MFM * pOHLCV.value("Volume", Record - n);
        SumV += pOHLCV.value("Volume", Record - n);
      }
      Value = MFV / SumV;
      Field1.setValue(Record, Value);
    }
    Results.addField(Field1);
    return Results;
  }

  commodityChannelIndex(
    pOHLCV: Recordset,
    Periods: number,
    Alias: string
  ): Recordset {
    let GN = new General();
    let MA = new MovingAverage();
    let Results = new Recordset();
    let TPrs;
    let MArs;
    let Field1;
    let dMeanDeviation = 0;
    let dTmp = 0;
    let Count = 0;
    let RecordCount = 0;
    let Record = 0;
    RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    TPrs = GN.typicalPrice(pOHLCV, "TP");
    MArs = MA.simpleMovingAverage(TPrs.getField("TP"), Periods, "TPMA");
    for (Record = 1; Record < 2 * Periods + 1; ++Record) {
      Field1.setValue(Record, 0);
    }

    for (Record = 2 * Periods; Record < RecordCount + 1; ++Record) {
      dMeanDeviation = 0;
      for (Count = Record - Periods + 1; Count < Record + 1; ++Count) {
        dTmp = Math.abs(
          TPrs.getField("TP").value(Count) - MArs.getField("TPMA").value(Record)
        );
        dMeanDeviation = dMeanDeviation + dTmp;
      }
      dMeanDeviation = dMeanDeviation / Periods;
      dTmp =
        (TPrs.getField("TP").value(Record) -
          MArs.getField("TPMA").value(Record)) /
        (dMeanDeviation * 0.015);
      Field1.setValue(Record, dTmp);
    }
    Results.addField(Field1);
    return Results;
  }

  stochasticMomentumIndex(
    pOHLCV: Recordset,
    KPeriods: number,
    KSmooth: number,
    KDoubleSmooth: number,
    DPeriods: number,
    MAType: number,
    PctD_MAType: number
  ): Recordset {
    let MA = new MovingAverage();
    let Results = new Recordset();
    let Temp = null;
    let GN = new General();
    let Record = 0;
    let RecordCount = 0;
    let Value = 0;
    let LLV = null;
    let HHV = null;
    let CHHLL = null;
    let HHLL = null;
    let Field1 = null;
    let Field2 = null;
    KSmooth += 1;
    RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, "%K");
    Temp = GN.HHV(pOHLCV.getField("High"), KPeriods, "HHV");
    HHV = new Field();
    HHV.initialize(RecordCount, "HHV");
    Temp.copyField(HHV, "HHV");
    Temp = GN.LLV(pOHLCV.getField("Low"), KPeriods, "LLV");
    LLV = new Field();
    LLV.initialize(RecordCount, "LLV");
    Temp.copyField(LLV, "LLV");
    HHLL = new Field();
    HHLL.initialize(RecordCount, "HHLL");
    for (Record = 1; Record < RecordCount + 1; ++Record) {
      Value = HHV.value(Record) - LLV.value(Record);
      HHLL.setValue(Record, Value);
    }
    CHHLL = new Field();
    CHHLL.initialize(RecordCount, "CHHLL");
    for (Record = 1; Record < RecordCount + 1; ++Record) {
      Value =
        pOHLCV.value("Close", Record) -
        0.5 * (HHV.value(Record) + LLV.value(Record));
      CHHLL.setValue(Record, Value);
    }
    if (KSmooth > 1) {
      Temp = MA.movingAverageSwitch(CHHLL, KSmooth, MAType, "CHHLL");
      Temp.copyField(CHHLL, "CHHLL");
    }
    if (KDoubleSmooth > 1) {
      Temp = MA.movingAverageSwitch(CHHLL, KDoubleSmooth, MAType, "CHHLL");
      Temp.copyField(CHHLL, "CHHLL");
    }
    if (KSmooth > 1) {
      Temp = MA.movingAverageSwitch(HHLL, KSmooth, MAType, "HHLL");
      Temp.copyField(HHLL, "HHLL");
    }
    if (KDoubleSmooth > 1) {
      Temp = MA.movingAverageSwitch(HHLL, KDoubleSmooth, MAType, "HHLL");
      Temp.copyField(HHLL, "HHLL");
    }
    for (Record = KPeriods + 1; Record < RecordCount + 1; ++Record) {
      let a = CHHLL.value(Record);
      let b = 0.5 * HHLL.value(Record);
      if (a !== b && !!b) {
        Value = 100 * (a / b);
      }
      Field1.setValue(Record, Value);
    }
    if (DPeriods > 1) {
      Temp = MA.movingAverageSwitch(Field1, DPeriods, MAType, "%D");
      Field2 = new Field();
      Field2.initialize(RecordCount, "%D");
      Temp.copyField(Field2, "%D");
      Results.addField(Field2);
    }
    Results.addField(Field1);
    return Results;
  }

  elderForceIndex(pOHLCV: Recordset, Alias: string): Recordset {
    let Results = new Recordset();
    let RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    let field1 = new Field();
    field1.initialize(RecordCount, Alias);
    let pClose = pOHLCV.getField("Close");
    let pVolume = pOHLCV.getField("Volume");
    for (let record = 2; record < RecordCount + 1; record++) {
      field1.setValue(
        record,
        (pClose.value(record - 1) - pClose.value(record)) *
        pVolume.value(record)
      );
    }
    Results.addField(field1);
    return Results;
  }

  elderThermometer(pOHLCV: Recordset, Alias: string): Recordset {
    let Results = new Recordset();
    let RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    let field1 = new Field();
    field1.initialize(RecordCount, Alias);
    let pHigh = pOHLCV.getField("High");
    let pLow = pOHLCV.getField("Low");
    for (let record = 2; record < RecordCount + 1; record++) {
      let hmh = Math.abs(pHigh.value(record) - pHigh.value(record - 1));
      let lml = Math.abs(pLow.value(record - 1) - pLow.value(record));
      let value = Math.max(hmh, lml);
      field1.setValue(record, value);
    }
    Results.addField(field1);
    return Results;
  }

  marketFacilitationIndex(pOHLCV: Recordset, Alias: string): Recordset {
    let Results = new Recordset();
    let RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    let field1 = new Field();
    field1.initialize(RecordCount, Alias);
    let pHigh = pOHLCV.getField("High");
    let pLow = pOHLCV.getField("Low");
    let pVolume = pOHLCV.getField("Volume");
    for (let record = 2; record < RecordCount + 1; record++) {
      field1.setValue(
        record,
        (pHigh.value(record) - pLow.value(record)) /
        (pVolume.value(record) / 100000000)
      );
    }
    Results.addField(field1);
    return Results;
  }

  qStick(
    pOHLCV: Recordset,
    Periods: number,
    MAType: number,
    Alias: string
  ): Recordset {
    let RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    let field1 = new Field();
    field1.initialize(RecordCount, Alias);
    let pHigh = pOHLCV.getField("High");
    let pLow = pOHLCV.getField("Low");
    for (let record = 1; record < RecordCount + 1; record++) {
      field1.setValue(record, pHigh.value(record) - pLow.value(record));
    }
    let ma = new MovingAverage();
    return ma.movingAverageSwitch(field1, Periods, MAType, Alias);
  }

  gopalakrishnanRangeIndex(
    pOHLCV: Recordset,
    Periods: number,
    Alias: string
  ): Recordset {
    let Results = new Recordset();
    let recordCount = pOHLCV.getFieldByIndex(0).recordCount;
    let field1 = new Field();
    field1.initialize(recordCount, Alias);
    let g = new General();
    let hhv = g.HHV(pOHLCV.getField("High"), Periods, "x").getField("x");
    let llv = g.LLV(pOHLCV.getField("Low"), Periods, "x").getField("x");
    for (let record = 1; record < recordCount + 1; record++) {
      field1.setValue(
        record,
        Math.log(hhv.value(record) - llv.value(record)) / Math.log(Periods)
      );
    }
    for (let record = 1; record < Periods + 1; record++) {
      field1.setValue(record, 0);
    }
    Results.addField(field1);
    return Results;
  }

  intradayMomentumIndex(pOHLCV: Recordset, Alias: string): Recordset {
    let Results = new Recordset();
    let recordCount = pOHLCV.getFieldByIndex(0).recordCount;
    let field1 = new Field();
    field1.initialize(recordCount, Alias);
    let pOpen = pOHLCV.getField("Open");
    let pClose = pOHLCV.getField("Close");
    let upSum = 0,
      dnSum = 0,
      prevUpSum = 0,
      prevDnSum = 0;
    for (let record = 2; record < recordCount + 1; record++) {
      if (pClose.value(record) > pOpen.value(record)) {
        upSum = prevUpSum + (pClose.value(record) - pOpen.value(record));
      } else {
        dnSum = prevDnSum + (pOpen.value(record) - pClose.value(record));
      }
      field1.setValue(record, 100 * (upSum / (upSum + dnSum)));
      prevUpSum = upSum;
      prevDnSum = dnSum;
    }
    Results.addField(field1);
    return Results;
  }

  RAVI(
    pSource: Field,
    ShortCycle: number,
    LongCycle: number,
    Alias: string
  ): Recordset {
    let Results = new Recordset();
    let recordCount = pSource.recordCount;
    let field1 = new Field();
    field1.initialize(recordCount, Alias);
    let ma = new MovingAverage();
    let sc = ma.VIDYA(pSource, ShortCycle, 0.65, "x").getField("x");
    let lc = ma.VIDYA(pSource, LongCycle, 0.65, "x").getField("x");
    for (let record = 1; record < recordCount + 1; record++) {
      field1.setValue(
        record,
        100 * (Math.abs(sc.value(record) - lc.value(record)) / lc.value(record))
      );
    }
    for (let record = 1; record < LongCycle + 1; record++) {
      field1.setValue(record, 0);
    }
    Results.addField(field1);
    return Results;
  }

  randomWalkIndex(
    pOHLCV: Recordset,
    Periods: number,
    Alias: string
  ): Recordset {
    let Results = new Recordset();
    let recordCount = pOHLCV.getFieldByIndex(0).recordCount;
    let hirwi = new Field();
    hirwi.initialize(recordCount, Alias + " High");
    let lowrwi = new Field();
    lowrwi.initialize(recordCount, Alias + " Low");
    let pHigh = pOHLCV.getField("High");
    let pLow = pOHLCV.getField("Low");
    let ma = new MovingAverage();
    let o = new Oscillator();
    let atr = ma
      .simpleMovingAverage(o.trueRange(pOHLCV, "x").getField("x"), Periods, "x")
      .getField("x");
    for (let record = Periods; record < recordCount + 1; record++) {
      for (let n = record - 1; n > record - Periods; --n) {
        hirwi.setValue(
          record,
          (pHigh.value(record) - pLow.value(n)) / (atr.value(n) * Math.sqrt(n))
        );
        lowrwi.setValue(
          record,
          (pHigh.value(n) - pLow.value(record)) / (atr.value(n) * Math.sqrt(n))
        );
      }
    }
    for (let record = 1; record < Periods * 2; record++) {
      hirwi.setValue(record, 0);
      lowrwi.setValue(record, 0);
    }
    Results.addField(hirwi);
    Results.addField(lowrwi);
    return Results;
  }

  trendIntensityIndex(
    pSource: Field,
    ShortCycle: number,
    LongCycle: number,
    Alias: string
  ): Recordset {
    let Results = new Recordset();
    let recordCount = pSource.recordCount;
    let field1 = new Field();
    field1.initialize(recordCount, Alias);
    let ma = new MovingAverage();
    let sc = ma.VIDYA(pSource, ShortCycle, 0.65, "x").getField("x");
    let lc = ma.VIDYA(pSource, LongCycle, 0.65, "x").getField("x");
    for (let record = 1; record < recordCount + 1; record++) {
      field1.setValue(
        record,
        100 * (Math.abs(sc.value(record) - lc.value(record)) / lc.value(record))
      );
    }
    for (let record = 1; record < LongCycle + 1; record++) {
      field1.setValue(record, 0);
    }
    Results.addField(field1);
    return Results;
  }

  twiggsMoneyFlow(
    pOHLCV: Recordset,
    Periods: number,
    Alias: string
  ): Recordset {
    let Results = new Recordset();
    let recordCount = pOHLCV.getFieldByIndex(0).recordCount;
    let field1 = new Field();
    field1.initialize(recordCount, Alias);
    let pHigh = pOHLCV.getField("High");
    let pLow = pOHLCV.getField("Low");
    let pClose = pOHLCV.getField("Close");
    let pVolume = pOHLCV.getField("Volume");
    let ma = new MovingAverage();
    let ema = ma
      .exponentialMovingAverage(pOHLCV.getField("Volume"), Periods, "x")
      .getField("x");
    let th = new Field();
    let tl = new Field();
    tl.initialize(recordCount, "x");
    th.initialize(recordCount, "x");
    for (let record = 2; record < recordCount + 1; record++) {
      th.setValue(
        record,
        Math.max(pHigh.value(record), pClose.value(record - 1))
      );
      tl.setValue(
        record,
        Math.min(pLow.value(record), pClose.value(record - 1))
      );
    }
    for (let record = 2; record < recordCount + 1; record++) {
      field1.setValue(
        record,
        ((pClose.value(record) -
          tl.value(record) -
          (th.value(record) - pClose.value(record))) /
          (th.value(record) - tl.value(record))) *
        pVolume.value(record)
      );
    }
    field1 = ma
      .exponentialMovingAverage(field1, Periods, Alias)
      .getField(Alias);
    for (let record = 2; record < recordCount + 1; record++) {
      field1.setValue(record, field1.value(record) / ema.value(record));
    }
    for (let record = 1; record < Periods + 1; record++) {
      field1.setValue(record, 0);
    }
    Results.addField(field1);
    return Results;
  }

  // @endif

  // @if SCX_LICENSE != 'free'

  onBalanceVolume(pSource: Field, Volume: Field, Alias: string): Recordset {
    let Results = new Recordset();
    let Field1;
    let RecordCount = 0;
    let Record = 0;
    let Start = 0;
    let Value = 0;
    RecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    Start = 2;
    let nav = Start;
    for (Record = Start; Record < RecordCount + 1; Record++) {
      if (pSource.value(nav - 1) < pSource.value(nav)) {
        Value = Field1.value(nav - 1) + Volume.value(nav);
      } else if (pSource.value(nav) < pSource.value(nav - 1)) {
        Value = Field1.value(nav - 1) - Volume.value(nav);
      } else {
        Value = Field1.value(nav - 1);
      }
      Field1.setValue(nav, Value);
      nav++;
    }
    Results.addField(Field1);
    return Results;
  }

  historicalVolatility(
    pSource: Field,
    Periods: number,
    BarHistory: number,
    StandardDeviations: number,
    Alias: string
  ): Recordset {
    let Results = new Recordset();
    let Stdv = new General();
    let Field1;
    let Field2;
    let RecordCount = 0;
    let Record = 0;
    let Start = 0;
    let Value = 0;
    RecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, "TEMP");
    Start = 2;
    for (Record = Start; Record < RecordCount + 1; Record++) {
      Value = Math.log(pSource.value(Record) / pSource.value(Record - 1));
      Field1.setValue(Record, Value);
    }
    Field2 = Stdv.standardDeviation(
      Field1,
      Periods,
      StandardDeviations,
      0,
      "STDV"
    );
    for (Record = Start; Record < RecordCount + 1; Record++) {
      Value = Field2.value("STDV", Record) * Math.sqrt(BarHistory);
      Field1.setValue(Record, Value);
    }
    Field1.name = Alias;
    Results.addField(Field1);
    return Results;
  }

  // @endif

  relativeStrengthIndex(
    pSource: Field,
    Periods: number,
    Alias: string
  ): Recordset {
    let Results = new Recordset();
    let Field1;
    let AU;
    let AD;
    let RecordCount = 0;
    let Record = 0;
    let Period = 0;
    let Start = 0;
    let UT = 0;
    let DT = 0;
    let UpSum = 0;
    let DownSum = 0;
    let RS = 0;
    let RSI = 0;
    let value = 0;
    RecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    AU = new Field();
    AU.initialize(RecordCount, "AU");
    AD = new Field();
    AD.initialize(RecordCount, "AD");
    let nav = 2;
    for (Period = 1; Period < Periods + 1; Period++) {
      UT = 0;
      DT = 0;
      if (value !== Const.nullValue) {
        if (value > pSource.value(nav - 1)) {
          UT = pSource.value(nav) - pSource.value(nav - 1);
          UpSum += UT;
        } else if (pSource.value(nav) < pSource.value(nav - 1)) {
          DT = pSource.value(nav - 1) - pSource.value(nav);
          DownSum += DT;
        }
      }
      nav++;
    }
    nav--;
    UpSum = UpSum / Periods;
    AU.setValue(nav, UpSum);
    DownSum = DownSum / Periods;
    AD.setValue(nav, DownSum);
    RS = UpSum / DownSum;
    RSI = 100 - 100 / (1 + RS);
    Start = Periods + 3;
    for (Record = Start; Record < RecordCount + 2; Record++) {
      nav = Record - Periods;
      UpSum = 0;
      DownSum = 0;
      for (Period = 1; Period < Periods + 1; Period++) {
        UT = 0;
        DT = 0;
        value = pSource.value(nav);
        if (value !== Const.nullValue) {
          if (value > pSource.value(nav - 1)) {
            UT = pSource.value(nav) - pSource.value(nav - 1);
            UpSum += UT;
          } else if (pSource.value(nav) < pSource.value(nav - 1)) {
            DT = pSource.value(nav - 1) - pSource.value(nav);
            DownSum += DT;
          }
        }
        nav++;
      }
      nav--;
      UpSum = (AU.value(nav - 1) * (Periods - 1) + UT) / Periods;
      DownSum = (AD.value(nav - 1) * (Periods - 1) + DT) / Periods;
      AU.setValue(nav, UpSum);
      AD.setValue(nav, DownSum);
      if (!DownSum) {
        DownSum = UpSum;
      }
      if (!UpSum) {
        RS = 0;
      } else {
        RS = UpSum / DownSum;
      }
      RS = UpSum / DownSum;
      RSI = 100 - 100 / (1 + RS);
      Field1.setValue(nav, RSI);
    }
    Results.addField(Field1);
    return Results;
  }
}
