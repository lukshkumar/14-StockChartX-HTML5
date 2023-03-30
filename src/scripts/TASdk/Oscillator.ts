import { Field } from "./Field";
import { Recordset } from "./Recordset";
import { Const } from "./TASdk";
import { MovingAverage } from "./MovingAverage";
import { General } from "./General";
import { LinearRegression } from "./LinearRegression";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


export class Oscillator {
  // @if SCX_LICENSE = 'full'

  chandeMomentumOscillator(pSource: Field, iPeriods: number, sAlias: string): Recordset {
    let Field1;
    let Results = new Recordset();
    let iRecord = 0;
    let iRecordCount = 0;
    let iPeriod = 0;
    let dToday = 0;
    let dYesterday = 0;
    let dUpSum = 0;
    let dDownSum = 0;
    let dValue = 0;
    iRecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(iRecordCount, sAlias);
    let nav = 1;
    for (iRecord = iPeriods + 2; iRecord < iRecordCount + 2; iRecord++) {
      nav = iRecord - iPeriods;
      dUpSum = 0;
      dDownSum = 0;
      for (iPeriod = 1; iPeriod < iPeriods + 1; iPeriod++) {
        dYesterday = pSource.value(nav - 1);
        dToday = pSource.value(nav);
        if (dToday > dYesterday) {
          dUpSum += (dToday - dYesterday);
        }
        else if (dToday < dYesterday) {
          dDownSum += (dYesterday - dToday);
        }
        nav++;
      }
      if (!!(dUpSum + dDownSum)) {
        dValue = 100 * (dUpSum - dDownSum) / (dUpSum + dDownSum);
      }
      else {
        dValue = Const.nullValue;
      }
      Field1.setValue(nav - 1, dValue);
    }
    Results.addField(Field1);
    return Results;
  }

  TRIX(pSource: Field, iPeriods: number, sAlias: string): Recordset {
    let MA = new MovingAverage();
    let Results = new Recordset();
    let RS;
    let EMA;
    let Field1;
    let iRecordCount = 0;
    let iRecord = 0;
    let iStart = 0;
    let dValue = 0;
    RS = MA.exponentialMovingAverage(pSource, iPeriods, 'EMA1');
    EMA = RS.getField('EMA1');
    RS.removeField('EMA1');
    RS = MA.exponentialMovingAverage(EMA, iPeriods, 'EMA2');
    EMA = RS.getField('EMA2');
    RS.removeField('EMA2');
    RS = MA.exponentialMovingAverage(EMA, iPeriods, 'EMA3');
    EMA = RS.getField('EMA3');
    RS.removeField('EMA3');
    iRecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(iRecordCount, sAlias);
    iStart = 2;
    let nav = iStart;
    for (iRecord = iStart; iRecord < iRecordCount + 1; iRecord++) {
      dValue = EMA.value(nav - 1);
      if (!!dValue) {
        dValue = ((EMA.value(nav) - dValue) / dValue) * 100;
        Field1.setValue(nav, dValue);
      }
      nav++;
    }
    Results.addField(Field1);
    return Results;
  }

  ultimateOscillator(pOHLCV: Recordset, iCycle1: number, iCycle2: number, iCycle3: number, sAlias: string): Recordset {
    let Results = new Recordset();
    let Field1;
    let iRecordCount = 0;
    let iRecord = 0;
    let iPeriod = 0;
    let iPeriods = 0;
    let iStart = 0;
    let dValue = 0;
    let TL = 0;
    let BP = 0;
    let TR = 0;
    let BPSum1 = 0;
    let BPSum2 = 0;
    let BPSum3 = 0;
    let TRSum1 = 0;
    let TRSum2 = 0;
    let TRSum3 = 0;
    iRecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    Field1 = new Field();
    Field1.initialize(iRecordCount, sAlias);
    iPeriods = iCycle1;
    if (iCycle2 > iPeriods) {
      iPeriods = iCycle2;
    }
    if (iCycle3 > iPeriods) {
      iPeriods = iCycle3;
    }
    iStart = iPeriods + 2;
    let nav = iStart;
    for (iRecord = iStart; iRecord < iRecordCount + 2; iRecord++) {
      BPSum1 = 0;
      BPSum2 = 0;
      BPSum3 = 0;
      TRSum1 = 0;
      TRSum2 = 0;
      TRSum3 = 0;
      nav = iRecord - iCycle1;
      for (iPeriod = 1; iPeriod < iCycle1 + 1; iPeriod++) {
        if (pOHLCV.getField('Low').value(nav) < pOHLCV.getField('Close').value(nav - 1)) {
          TL = pOHLCV.getField('Low').value(nav);
        }
        else {
          TL = pOHLCV.getField('Close').value(nav - 1);
        }
        BP = pOHLCV.getField('Close').value(nav) - TL;
        TR = pOHLCV.getField('High').value(nav) - pOHLCV.getField('Low').value(nav);
        if (TR < pOHLCV.getField('High').value(nav) - pOHLCV.getField('Close').value(nav - 1)) {
          TR = pOHLCV.getField('High').value(nav) - pOHLCV.getField('Close').value(nav - 1);
        }
        if (TR < pOHLCV.getField('Close').value(nav - 1) - pOHLCV.getField('Low').value(nav)) {
          TR = pOHLCV.getField('Close').value(nav - 1) - pOHLCV.getField('Low').value(nav);
        }
        BPSum1 += BP;
        TRSum1 += TR;
        nav++;
      }
      nav = nav - iCycle2;
      for (iPeriod = 1; iPeriod < iCycle2 + 1; iPeriod++) {
        if (pOHLCV.getField('Low').value(nav) < pOHLCV.getField('Close').value(nav - 1)) {
          TL = pOHLCV.getField('Low').value(nav);
        }
        else {
          TL = pOHLCV.getField('Close').value(nav - 1);
        }
        BP = pOHLCV.getField('Close').value(nav) - TL;
        TR = pOHLCV.getField('High').value(nav) - pOHLCV.getField('Low').value(nav);
        if (TR < pOHLCV.getField('High').value(nav) - pOHLCV.getField('Close').value(nav - 1)) {
          TR = pOHLCV.getField('High').value(nav) - pOHLCV.getField('Close').value(nav - 1);
        }
        if (TR < pOHLCV.getField('Close').value(nav - 1) - pOHLCV.getField('Low').value(nav)) {
          TR = pOHLCV.getField('Close').value(nav - 1) - pOHLCV.getField('Low').value(nav);
        }
        BPSum2 += BP;
        TRSum2 += TR;
        nav++;
      }
      nav = nav - iCycle3;
      for (iPeriod = 1; iPeriod < iCycle3 + 1; iPeriod++) {
        if (pOHLCV.getField('Low').value(nav) < pOHLCV.getField('Close').value(nav - 1)) {
          TL = pOHLCV.getField('Low').value(nav);
        }
        else {
          TL = pOHLCV.getField('Close').value(nav - 1);
        }
        BP = pOHLCV.getField('Close').value(nav) - TL;
        TR = pOHLCV.getField('High').value(nav) - pOHLCV.getField('Low').value(nav);
        if (TR < pOHLCV.getField('High').value(nav) - pOHLCV.getField('Close').value(nav - 1)) {
          TR = pOHLCV.getField('High').value(nav) - pOHLCV.getField('Close').value(nav - 1);
        }
        if (TR < pOHLCV.getField('Close').value(nav - 1) - pOHLCV.getField('Low').value(nav)) {
          TR = pOHLCV.getField('Close').value(nav - 1) - pOHLCV.getField('Low').value(nav);
        }
        BPSum3 += BP;
        TRSum3 += TR;
        nav++;
      }
      dValue = (4 * (BPSum1 / TRSum1) + 2 * (BPSum2 / TRSum2) + (BPSum3 / TRSum3)) / (4 + 2 + 1) * 100;
      Field1.setValue(nav - 1, dValue);
    }
    Results.addField(Field1);
    return Results;
  }

  verticalHorizontalFilter(pSource: Field, iPeriods: number, sAlias: string): Recordset {
    let Field1;
    let Results = new Recordset();
    let iRecord = 0;
    let iRecordCount = 0;
    let iPeriod = 0;
    let iStart = 0;
    let HCP = 0;
    let LCP = 0;
    let Sum = 0;
    let Abs = 0;
    iRecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(iRecordCount, sAlias);
    iStart = iPeriods + 2;
    let nav = iStart;
    for (iRecord = iStart; iRecord < iRecordCount + 2; iRecord++) {
      HCP = 0;
      LCP = pSource.value(nav);
      nav = iRecord - iPeriods;
      for (iPeriod = 1; iPeriod < iPeriods + 1; iPeriod++) {
        if (pSource.value(nav) < LCP) {
          LCP = pSource.value(nav);
        }
        else if (pSource.value(nav) > HCP) {
          HCP = pSource.value(nav);
        }
        nav++;
      }
      Sum = 0;
      nav = iRecord - iPeriods;
      for (iPeriod = 1; iPeriod < iPeriods + 1; iPeriod++) {
        Abs = (pSource.value(nav) - pSource.value(nav - 1));
        if (Abs < 0) {
          Abs = -1 * Abs;
        }
        Sum += Abs;
        nav++;
      }
      Abs = (HCP - LCP) / Sum;
      if (Abs < 0) {
        Abs = -1 * Abs;
      }
      Field1.setValue(nav - 1, Abs);
    }
    Results.addField(Field1);
    return Results;
  }

  williamsPctR(pOHLCV: Recordset, iPeriods: number, sAlias: string): Recordset {
    let Field1;
    let Results = new Recordset();
    let Record = 0;
    let RecordCount = 0;
    let Period = 0;
    let Start = 0;
    let HH = 0;
    let LL = 0;
    RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, sAlias);
    Start = iPeriods + 2;
    let nav = Start;
    for (Record = Start; Record < RecordCount + 2; Record++) {
      HH = 0;
      LL = pOHLCV.getField('Low').value(nav);
      nav = Record - iPeriods;
      for (Period = 1; Period < iPeriods + 1; Period++) {
        if (pOHLCV.getField('High').value(nav) > HH) {
          HH = pOHLCV.getField('High').value(nav);
        }
        if (pOHLCV.getField('Low').value(nav) < LL) {
          LL = pOHLCV.getField('Low').value(nav);
        }
        nav++;
      }
      Field1.setValue(nav - 1, ((HH - pOHLCV.getField('Close').value(nav - 1)) / (HH - LL)) * -100);
    }
    Results.addField(Field1);
    return Results;
  }

  williamsAccumulationDistribution(pOHLCV: Recordset, Alias: string): Recordset {
    let Results = new Recordset();
    let Field1;
    let RecordCount = 0;
    let Record = 0;
    let Start = 0;
    let TRH = 0;
    let TRL = 0;
    let Value = 0;
    RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    Start = 2;
    let nav = Start;
    for (Record = 1; Record < RecordCount; Record++) {
      TRH = pOHLCV.getField('Close').value(nav - 1);
      if (pOHLCV.getField('High').value(nav) > TRH) {
        TRH = pOHLCV.getField('High').value(nav);
      }
      TRL = pOHLCV.getField('Close').value(nav - 1);
      if (pOHLCV.getField('Low').value(nav) < TRL) {
        TRL = pOHLCV.getField('Low').value(nav);
      }
      if (pOHLCV.getField('Close').value(nav) > pOHLCV.getField('Close').value(nav - 1)) {
        Value = pOHLCV.getField('Close').value(nav) - TRL;
      }
      else if (pOHLCV.getField('Close').value(nav) < pOHLCV.getField('Close').value(nav - 1)) {
        Value = pOHLCV.getField('Close').value(nav) - TRH;
      }
      else {
        Value = 0;
      }
      Field1.setValue(nav, Value + Field1.value(nav - 1));
      nav++;
    }
    Results.addField(Field1);
    return Results;
  }

  volumeOscillator(Volume: Field, ShortTerm: number, LongTerm: number, PointsOrPercent: number, Alias: string): Recordset {
    let Field1;
    let MA = new MovingAverage();
    let Results = new Recordset();
    let MA1;
    let MA2;
    let Record = 0;
    let RecordCount = 0;
    let Value = 0;
    RecordCount = Volume.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    MA1 = MA.simpleMovingAverage(Volume, ShortTerm, 'MA1');
    MA2 = MA.simpleMovingAverage(Volume, LongTerm, 'MA2');
    let nav = 1;
    for (Record = 1; Record < RecordCount + 1; Record++) {
      if (PointsOrPercent === 1) {
        Value = MA1.getField('MA1').value(nav) - MA2.getField('MA2').value(nav);
      }
      else if (PointsOrPercent === 2) {
        if (MA2.getField('MA2').value(nav) > 0) {
          Value = ((MA1.getField('MA1').value(nav) - MA2.getField('MA2').value(nav)) / MA2.getField('MA2').value(nav)) * 100;
        }
      }
      Field1.setValue(Record, Value);
      nav++;
    }
    Results.addField(Field1);
    return Results;
  }

  chaikinVolatility(pOHLCV: Recordset, Periods: number, ROC: number, MAType: number, Alias: string): Recordset {
    let Field1;
    let MA = new MovingAverage();
    let Results = new Recordset();
    let HLMA = null;
    let HL;
    let Record = 0;
    let RecordCount = 0;
    let Start = 0;
    let Value = 0;
    let MA1 = 0;
    let MA2 = 0;
    RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    HL = new Field();
    HL.initialize(RecordCount, 'HL');
    let nav = 1;
    for (Record = 1; Record < RecordCount + 1; Record++) {
      HL.setValue(nav, pOHLCV.getField('High').value(nav) - pOHLCV.getField('Low').value(nav));
      nav++;
    }
    HLMA = MA.movingAverageSwitch(HL, Periods, MAType, 'HLMA');
    Start = ROC + 1;
    nav = Start;
    for (Record = Start; Record < RecordCount + 1; Record++) {
      MA1 = HLMA.getField('HLMA').value(nav - ROC);
      MA2 = HLMA.getField('HLMA').value(nav);
      if (!!MA1 && !!MA2) {
        Value = ((MA1 - MA2) / MA1) * -100;
      }
      Field1.setValue(Record, Value);
      nav++;
    }
    Results.addField(Field1);
    return Results;
  }

  stochasticOscillator(pOHLCV: Recordset, KPeriods: number, KSlowingPeriods: number, DPeriods: number, MAType: number): Recordset {
    let MA = new MovingAverage();
    let Field1 = null;
    let PctD = null;
    let Results = new Recordset();
    let Record = 0;
    let RecordCount = 0;
    let Period = 0;
    let Start = 0;
    let LL = 0;
    let HH = 0;
    let Value = 0;
    RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, '%K');
    Start = KPeriods + 2;
    let nav = Start;
    for (Record = Start; Record < RecordCount + 2; Record++) {
      nav = Record - KPeriods;
      HH = pOHLCV.getField('High').value(nav);
      LL = pOHLCV.getField('Low').value(nav);
      for (Period = 1; Period < KPeriods + 1; Period++) {
        if (pOHLCV.getField('High').value(nav) > HH) {
          HH = pOHLCV.getField('High').value(nav);
        }
        if (pOHLCV.getField('Low').value(nav) < LL) {
          LL = pOHLCV.getField('Low').value(nav);
        }
        nav++;
      }
      Value = (pOHLCV.getField('Close').value(nav - 1) - LL) / (HH - LL) * 100;
      Field1.setValue(nav - 1, Value);
    }
    if (KSlowingPeriods > 1) {
      Results = null;
      Results = MA.movingAverageSwitch(Field1, KSlowingPeriods, MAType, '%K');
    }
    else {
      Results.addField(Field1);
    }
    Field1 = Results.getField('%K');
    PctD = MA.movingAverageSwitch(Field1, DPeriods, MAType, '%D');
    if (PctD != null) {
      Results.addField(PctD.getField('%D'));
      PctD.removeField('%D');
    }
    return Results;
  }

  priceOscillator(pSource: Field, LongCycle: number, ShortCycle: number, MAType: number, Alias: string): Recordset {
    let Results = new Recordset();
    let Field1;
    let MA = new MovingAverage();
    let LongMA = null;
    let ShortMA = null;
    let RecordCount = 0;
    let Record = 0;
    let Start = 0;
    let Value = 0;
    if (LongCycle <= ShortCycle) {
      return Results;
    }
    RecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    LongMA = MA.movingAverageSwitch(pSource, LongCycle, MAType, 'MA');
    ShortMA = MA.movingAverageSwitch(pSource, ShortCycle, MAType, 'MA');
    if (LongCycle > ShortCycle) {
      Start = LongCycle;
    }
    else if (ShortCycle > LongCycle) {
      Start = ShortCycle;
    }
    else {
      Start = LongCycle;
    }
    let nav = Start;
    for (Record = Start; Record < RecordCount + 1; Record++) {
      let longMA = LongMA.value('MA', nav);
      if (longMA === 0) {
        Value = 0;
      } else {
        Value = ((ShortMA.value('MA', nav) - LongMA.value('MA', nav)) / longMA) * 100;
      }
      Field1.setValue(nav, Value);
      nav++;
    }
    Results.addField(Field1);
    return Results;
  }

  easeOfMovement(pOHLCV: Recordset, Periods: number, MAType: number, Alias: string): Recordset {
    let MA = new MovingAverage();
    let Results = new Recordset();
    let EMVMA = null;
    let Field1 = null;
    let RecordCount = 0;
    let Record = 0;
    let Start = 0;
    let MPM = 0;
    let EMV = 0;
    let BoxRatio = 0;
    let bd = 0;
    RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    Start = 2;
    let nav = Start;
    for (Record = Start; Record < RecordCount + 1; Record++) {
      let high = pOHLCV.value('High', nav),
        low = pOHLCV.value('Low', nav);

      MPM = ((high + low) / 2) - ((pOHLCV.value('High', nav - 1) + pOHLCV.value('Low', nav - 1)) / 2);
      bd = high - low;
      if (!!bd) {
        BoxRatio = pOHLCV.value('Volume', nav) / bd;
      }
      EMV = MPM / BoxRatio;
      Field1.setValue(nav, EMV * 10000);
      nav++;
    }
    EMVMA = MA.movingAverageSwitch(Field1, Periods, MAType, 'MA');
    if (EMVMA != null) {
      Field1 = EMVMA.getField('MA');
      Field1.name = Alias;
      EMVMA.removeField(Alias);
    }
    Results.addField(Field1);
    return Results;
  }

  detrendedPriceOscillator(pSource: Field, Periods: number, MAType: number, Alias: string): Recordset {
    let MA = new MovingAverage();
    let Results = new Recordset();
    let DPOMA = null;
    let Field1 = null;
    let RecordCount = 0;
    let Record = 0;
    let Start = 0;
    RecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    DPOMA = MA.movingAverageSwitch(pSource, Periods, MAType, 'MA');
    Start = Periods + 1;
    let nav = Start;
    for (Record = Start; Record < RecordCount + 1; Record++) {
      Field1.setValue(nav, pSource.value(nav) - DPOMA.value('MA', nav - ((Periods / 2) + 1)));
      nav++;
    }
    Results.addField(Field1);
    return Results;
  }

  parabolicSAR(HighPrice: Field, LowPrice: Field, MinAF: number, MaxAF: number, Alias: string): Recordset {
    let Results = new Recordset();
    let Field1;
    let RecordCount = 0;
    let Record = 0;
    let Start = 0;
    let Position = 0;
    let Max = 0;
    let Min = 0;
    let pSAR = 0;
    let pAF = 0;
    let SAR = 0;
    let AF = 0;
    let Hi = 0;
    let Lo = 0;
    let pHi = 0;
    let pLo = 0;
    RecordCount = HighPrice.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    Start = 2;
    Max = HighPrice.value(1);
    Min = LowPrice.value(1);
    if (HighPrice.value(2) - HighPrice.value(1) < LowPrice.value(2) - LowPrice.value(1)) {
      pSAR = Max;
      Position = -1;
    }
    else {
      pSAR = Min;
      Position = 1;
    }
    pAF = MinAF;
    SAR = pSAR;
    Hi = Max;
    Lo = Min;
    pHi = Hi;
    pLo = Lo;
    AF = MinAF;
    for (Record = Start; Record < RecordCount + 1; ++Record) {
      if (Position === 1) {
        if (HighPrice.value(Record) > Hi) {
          Hi = HighPrice.value(Record);
          if (AF < MaxAF) {
            AF = AF + MinAF;
          }
        }
        SAR = pSAR + pAF * (pHi - pSAR);
        if (LowPrice.value(Record) < SAR) {
          Position = -1;
          AF = MinAF;
          SAR = pHi;
          Hi = 0;
          Lo = LowPrice.value(Record);
        }
      }
      else if (Position === -1) {
        if (LowPrice.value(Record) < Lo) {
          Lo = LowPrice.value(Record);
          if (AF < MaxAF) {
            AF = AF + MinAF;
          }
        }
        SAR = pSAR + pAF * (pLo - pSAR);
        if (HighPrice.value(Record) > SAR) {
          Position = 1;
          AF = MinAF;
          SAR = pLo;
          Lo = 0;
          Hi = HighPrice.value(Record);
        }
      }
      pHi = Hi;
      pLo = Lo;
      pSAR = SAR;
      pAF = AF;
      Field1.setValue(Record, SAR);
    }
    Results.addField(Field1);
    return Results;
  }

  directionalMovementSystem(pOHLCV: Recordset, Periods: number): Recordset {
    let MA = new MovingAverage();
    let Results = new Recordset();
    let ADX = new Recordset();
    let DX;
    let ADXR;
    let ADXF;
    let UpDMI;
    let DnDMI;
    let DIN;
    let DIP;
    let TR;
    let wSumTR;
    let wSumUpDMI;
    let wSumDnDMI;
    let rsTemp;
    let HDIF = 0;
    let LDIF = 0;
    let RecordCount = 0;
    let Record = 0;
    RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    rsTemp = this.trueRange(pOHLCV, 'TR');
    TR = rsTemp.getField('TR');
    rsTemp.removeField('TR');
    wSumTR = MA.wellesWilderSmoothing(TR, Periods, 'TRSum');
    UpDMI = new Field();
    UpDMI.initialize(RecordCount, 'UpDMI');
    DnDMI = new Field();
    DnDMI.initialize(RecordCount, 'DnDMI');
    DIN = new Field();
    DIN.initialize(RecordCount, 'DI-');
    DIP = new Field();
    DIP.initialize(RecordCount, 'DI+');
    for (Record = 2; Record < RecordCount + 1; ++Record) {
      HDIF = pOHLCV.value('High', Record) - pOHLCV.value('High', Record - 1);
      LDIF = pOHLCV.value('Low', Record - 1) - pOHLCV.value('Low', Record);
      if ((HDIF < 0 && LDIF < 0) || (HDIF === LDIF)) {
        UpDMI.setValue(Record, 0);
        DnDMI.setValue(Record, 0);
      }
      else if (HDIF > LDIF) {
        UpDMI.setValue(Record, HDIF);
        DnDMI.setValue(Record, 0);
      }
      else if (HDIF < LDIF) {
        UpDMI.setValue(Record, 0);
        DnDMI.setValue(Record, LDIF);
      }
    }
    wSumUpDMI = MA.wellesWilderSmoothing(UpDMI, Periods, 'DM+Sum');
    wSumDnDMI = MA.wellesWilderSmoothing(DnDMI, Periods, 'DM-Sum');
    for (Record = 2; Record < RecordCount + 1; ++Record) {
      DIP.setValue(Record, 100 * wSumUpDMI.value('DM+Sum', Record) / wSumTR.value('TRSum', Record));
      DIN.setValue(Record, 100 * wSumDnDMI.value('DM-Sum', Record) / wSumTR.value('TRSum', Record));
    }
    DX = new Field();
    DX.initialize(RecordCount, 'DX');
    for (Record = 2; Record < RecordCount + 1; ++Record) {
      let a = Math.abs(parseInt(<any>(DIP.value(Record) - DIN.value(Record)), 10));
      let b = DIP.value(Record) + DIN.value(Record);
      if (a > 0 && b > 0) {
        DX.setValue(Record, 100 * (a / b));
      }
    }
    ADXF = new Field();
    ADXF.initialize(RecordCount, 'ADX');
    ADX.addField(ADXF);

    let sum = 0;
    for (Record = Periods + 1; Record < RecordCount + 1 && Record <= Periods * 2; ++Record) {
      sum += DX.value(Record);
    }
    ADXF.setValue(Periods * 2, sum / Periods);

    for (Record = Periods * 2 + 1; Record < RecordCount + 1; ++Record) {
      let value = (ADXF.value(Record - 1) * (Periods - 1) + DX.value(Record)) / Periods;

      ADXF.setValue(Record, value);
    }

    ADXR = new Field();
    ADXR.initialize(RecordCount, 'ADXR');
    for (Record = Periods * 2 + 1; Record < RecordCount + 1; ++Record) {
      ADXR.setValue(Record, ((ADX.value('ADX', Record) + ADX.value('ADX', Record - 1)) / 2));
    }
    Results.addField(ADX.getField('ADX'));
    Results.addField(ADXR);
    Results.addField(DX);
    Results.addField(wSumTR.getField('TRSum'));
    Results.addField(DIN);
    Results.addField(DIP);
    ADX.removeField('ADX');
    ADX.removeField('ADXF');
    wSumTR.removeField('TRSum');
    return Results;
  }

  rainbowOscillator(pSource: Field, Levels: number, MAType: number, periods: number, highAlias: string, lowAlias: string): Recordset {
    let sourceValues = pSource._m_values;
    let RecordCount = 0;
    let nav = 0;
    RecordCount = pSource.recordCount;
    let sourceHigh = new Field();
    let sourceLow = new Field();
    sourceHigh.initialize(RecordCount, 'HH');
    sourceLow.initialize(RecordCount, 'LL');
    for (let i = periods; i < sourceValues.length; i++) {
      let periodsourceValues = sourceValues.slice(i - 10, i);
      sourceHigh.setValue(i, Math.max(...periodsourceValues));
      sourceLow.setValue(i, Math.min(...periodsourceValues));
    }
    let maximumValueArray = [];
    let minimumValueArray = [];
    let MA = new MovingAverage();
    let Results = new Recordset();
    let rsMA = null;
    let Field1, Field2, Field3, Field4;
    let FinalResult = [];
    Field1 = new Field();
    Field1.initialize(RecordCount, highAlias);
    Field2 = new Field();
    Field2.initialize(RecordCount, lowAlias);
    Field3 = new Field();
    Field3.initialize(RecordCount, 'Indicator Histogram High');
    Field4 = new Field();
    Field4.initialize(RecordCount, 'Indicator Histogram Low');
    let xma = {};
    rsMA = MA.simpleMovingAverage(pSource, Levels, 'MA').getField('MA');
    for (let Level = 0; Level < periods; Level++) {
      const currentXma = "xma" + Level;
      if (Level == 0) {
        xma[currentXma] = rsMA
      }
      else {
        xma[currentXma] = MA.movingAverageSwitch(xma["xma" + (Level - 1)], Levels
          , MAType, 'MA').getField('MA')
      }
    }
    for (let Record = periods; Record < RecordCount + 1; Record++) {

      let currentMaxArrayValue = [];
      let xmaSum = 0;
      let xmaAverage = 0;
      for (const key in xma) {
        xmaSum = xmaSum + (xma[key].value(Record));
        currentMaxArrayValue.push(xma[key].value(Record));
      }
      xmaAverage = xmaSum / periods;
      maximumValueArray.push(Math.max(...currentMaxArrayValue));
      minimumValueArray.push(Math.min(...currentMaxArrayValue));
      FinalResult.push(100 * ((maximumValueArray[nav] - minimumValueArray[nav]) / (sourceHigh.value(Record) - sourceLow.value(Record))))
      Field1.setValue(Record, FinalResult[nav]);
      Field2.setValue(Record, -FinalResult[nav]);
      let HistogramValue = 100 * (pSource.value(Record) - xmaAverage) / (sourceHigh.value(Record) - sourceLow.value(Record));
      if (HistogramValue >= 0) {
        Field3.setValue(Record, HistogramValue);
      }
      else {
        Field4.setValue(Record, HistogramValue);
      }
      nav++;
    }
    Results.addField(Field1);
    Results.addField(Field2);
    Results.addField(Field3);
    Results.addField(Field4);
    return Results;
  }

  fractalChaosOscillator(pOHLCV: Recordset, Periods: number, Alias: string): Recordset {
    let Results = new Recordset();
    let RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    let Record = 0;
    if (Periods < 1) {
      Periods = 100;
    }
    let fH = pOHLCV.getField('High');
    let fL = pOHLCV.getField('Low');
    let fFR = new Field();
    fFR.initialize(RecordCount, 'FR');
    let fH1 = new Field();
    fH1.initialize(RecordCount, 'High 1');
    let fH2 = new Field();
    fH2.initialize(RecordCount, 'High 2');
    let fH3 = new Field();
    fH3.initialize(RecordCount, 'High 3');
    let fH4 = new Field();
    fH4.initialize(RecordCount, 'High 4');
    let fL1 = new Field();
    fL1.initialize(RecordCount, 'Low 1');
    let fL2 = new Field();
    fL2.initialize(RecordCount, 'Low 2');
    let fL3 = new Field();
    fL3.initialize(RecordCount, 'Low 3');
    let fL4 = new Field();
    fL4.initialize(RecordCount, 'Low 4');
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
    for (Record = 2; Record < RecordCount + 1; ++Record) {
      if ((fH3.value(Record) > fH1.value(Record)) &&
        (fH3.value(Record) > fH2.value(Record)) &&
        (fH3.value(Record) >= fH4.value(Record)) &&
        (fH3.value(Record) >= fH.value(Record))) {
        fFR.setValue(Record, 1);
      }
      if ((fL3.value(Record) < fL1.value(Record)) &&
        (fL3.value(Record) < fL2.value(Record)) &&
        (fL3.value(Record) <= fL4.value(Record)) &&
        (fL3.value(Record) <= fL.value(Record))) {
        fFR.setValue(Record, -1);
      }
    }
    fFR.name = Alias;
    Results.addField(fFR);
    return Results;
  }

  primeNumberOscillator(pSource: Field, Alias: string): Recordset {
    let Results = new Recordset();
    let RecordCount = pSource.recordCount;
    let Record = 0;
    let fPrime = new Field();
    fPrime.initialize(RecordCount, Alias);
    let GN = new General();
    let N = 0;
    let Value = 0;
    let Top = 0, Bottom = 0;
    for (Record = 1; Record < RecordCount + 1; ++Record) {
      Value = pSource.value(Record);
      if (Value < 10) {
        Value = Value * 10;
      }
      for (N = Value; N > 1; --N) {
        if (GN.isPrime(N)) {
          Bottom = N;
          break;
        }
      }
      for (N = Value; N < Value * 2; ++N) {
        if (GN.isPrime(N)) {
          Top = N;
          break;
        }
      }
      if (Math.abs((Value - Top)) < Math.abs((Value - Bottom))) {
        fPrime.setValue(Record, Value - Top);
      }
      else {
        fPrime.setValue(Record, Value - Bottom);
      }
    }
    Results.addField(fPrime);
    return Results;
  }

  elderRay(pOHLCV: Recordset, Periods: number, MAType: number, Alias: string): Recordset {
    let Results = new Recordset();
    let RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    if (Periods < 1) {
      Periods = 13;
    }
    let fBullPower = new Field(), fBearPower = new Field();
    fBullPower.initialize(RecordCount, Alias + ' Bull Power');
    fBearPower.initialize(RecordCount, Alias + ' Bear Power');
    let pClose = pOHLCV.getField('Close');
    let pHigh = pOHLCV.getField('High');
    let pLow = pOHLCV.getField('Low');
    let ma = new MovingAverage();
    let ema = ma.movingAverageSwitch(pClose, Periods, MAType, 'ema').getField('ema');
    for (let record = Periods + 1; record < RecordCount + 1; record++) {
      fBullPower.setValue(record, pHigh.value(record) - ema.value(record));
      fBearPower.setValue(record, ema.value(record) - pLow.value(record));
    }
    Results.addField(fBullPower);
    Results.addField(fBearPower);
    return Results;
  }

  ehlerFisherTransform(pOHLCV: Recordset, Periods: number, Alias: string): Recordset {
    let Results = new Recordset();
    if (Periods < 1) {
      Periods = 10;
    }
    let RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    let fish = new Field();
    fish.initialize(RecordCount, Alias);
    let trigger = new Field();
    trigger.initialize(RecordCount, Alias + ' Trigger');
    let g = new General();
    let price = g.medianPrice(pOHLCV, 'price').getField('price');
    let maxh = g.HHV(price, Periods, 'maxh').getField('maxh');
    let minl = g.LLV(price, Periods, 'minl').getField('minl');
    let value1 = 0, prevValue1 = 0, prevFish = 0;
    for (let record = 1; record < RecordCount + 1; record++) {
      let mh = maxh.value(record);
      let ml = minl.value(record);
      if (mh !== ml) {
        value1 = 0.33 * 2 * ((price.value(record) - ml) / (mh - ml) - 0.5) + 0.67 * prevValue1;
      }
      else {
        value1 = 0;
      }
      if (value1 > 0.99) {
        value1 = 0.999;
      }
      if (value1 < -0.99) {
        value1 = -0.999;
      }
      let fishValue = 0.5 * Math.log((1 + value1) / (1 - value1)) + 0.5 * prevFish;
      fish.setValue(record, fishValue);
      trigger.setValue(record, prevFish);
      prevValue1 = value1;
      prevFish = fishValue;
    }
    Results.addField(fish);
    Results.addField(trigger);
    return Results;
  }

  schaffTrendCycle(pSource: Field, Periods: number, ShortCycle: number, LongCycle: number, MAType: number, Alias: string): Recordset {
    let results = new Recordset();
    let recordCount = pSource.recordCount;
    let Factor = 0.5;
    let Frac1 = new Field();
    Frac1.initialize(recordCount, 'x');
    let Frac2 = new Field();
    Frac2.initialize(recordCount, 'x');
    let PF = new Field();
    PF.initialize(recordCount, 'x');
    let PFF = new Field();
    PFF.initialize(recordCount, Alias);
    let g = new General();
    let o = new Oscillator();
    let XMac = o.MACD(pSource, 2, LongCycle, ShortCycle, MAType, 'x').getField('x');
    let Value1 = g.LLV(XMac, Periods, 'x').getField('x');
    let Value2 = g.HHV(XMac, Periods, 'x').getField('x');
    for (let record = 1; record < recordCount + 1; ++record) {
      Value2.setValue(record, Value2.value(record) - Value1.value(record));
    }
    for (let record = 2; record < recordCount + 1; ++record) {
      if (Value2.value(record) > 0) {
        Frac1.setValue(record, ((XMac.value(record) - Value1.value(record)) / Value2.value(record)) * 100);
      }
      else {
        Frac1.setValue(record, Frac1.value(record - 1));
      }
      PF.setValue(record, PF.value(record - 1) + (Factor * (Frac1.value(record) - PF.value(record - 1))));
    }
    let Value3 = g.LLV(PF, Periods, 'x').getField('x');
    let Value4 = g.HHV(PF, Periods, 'x').getField('x');
    for (let record = 1; record < recordCount + 1; ++record) {
      Value4.setValue(record, Value4.value(record) - Value3.value(record));
    }
    for (let record = 2; record < recordCount + 1; ++record) {
      if (Value2.value(record) > 0) {
        Frac2.setValue(record, ((PF.value(record) - Value3.value(record)) / Value4.value(record)) * 100);
      }
      else {
        Frac2.setValue(record, Frac2.value(record - 1));
      }
      PFF.setValue(record, PFF.value(record - 1) + (Factor * (Frac2.value(record) - PFF.value(record - 1))));
    }
    results.addField(PFF);
    return results;
  }

  centerOfGravity(pSource: Field, Periods: number, Alias: string): Recordset {
    let results = new Recordset();
    let recordCount = pSource.recordCount;
    let field1 = new Field();
    field1.initialize(recordCount, Alias);
    for (let record = Periods + 1; record < recordCount + 1; ++record) {
      let num = 0, den = 0;
      let count = 1;
      for (let n = record - 1; n > record - Periods; --n) {
        num += (pSource.value(n) * (count + 1));
        den += pSource.value(n);
        count++;
      }
      field1.setValue(record, -1 * num / den);
    }
    results.addField(field1);
    return results;
  }

  coppockCurve(pSource: Field, Alias: string): Recordset {
    let recordCount = pSource.recordCount;
    let field1 = new Field();
    field1.initialize(recordCount, Alias);
    let g = new General();
    let roc14 = g.priceROC(pSource, 14, 'x').getField('x');
    let roc11 = g.priceROC(pSource, 11, 'x').getField('x');
    for (let record = 1; record < recordCount + 1; ++record) {
      field1.setValue(record, roc14.value(record) + roc11.value(record));
    }
    let ma = new MovingAverage();
    return ma.weightedMovingAverage(field1, 10, Alias);
  }

  chandeForecastOscillator(pSource: Field, Periods: number, Alias: string): Recordset {
    let results = new Recordset();
    let recordCount = pSource.recordCount;
    let field1 = new Field();
    field1.initialize(recordCount, Alias);
    let r = new LinearRegression();
    let f = r.timeSeriesForecast(pSource, Periods, 'x').getField('x');
    for (let record = 1; record < recordCount + 1; ++record) {
      field1.setValue(record, ((pSource.value(record) - f.value(record)) / pSource.value(record)) * 100);
    }
    for (let record = 1; record < Periods + 1; ++record) {
      field1.setValue(record, 0);
    }
    results.addField(field1);
    return results;
  }

  klingerVolumeOscillator(pOHLCV: Recordset, SignalPeriods: number, LongCycle: number, ShortCycle: number,
    MAType: number, Alias: string): Recordset {
    let recordCount = pOHLCV.getFieldByIndex(0).recordCount;
    let field1 = new Field();
    field1.initialize(recordCount, Alias);
    let pVolume = pOHLCV.getField('Volume');
    let g = new General();
    let tp = g.typicalPrice(pOHLCV, 'x').getField('x');
    let sv = new Field();
    sv.initialize(recordCount, 'sv');
    for (let record = 2; record < recordCount + 1; record++) {
      if (tp.value(record) >= tp.value(record - 1)) {
        sv.setValue(record, pVolume.value(record));
      }
      else {
        sv.setValue(record, -1 * pVolume.value(record));
      }
    }
    let o = new Oscillator();
    return o.MACD(sv, SignalPeriods, LongCycle, ShortCycle, MAType, Alias);
  }

  prettyGoodOscillator(pOHLCV: Recordset, Periods: number, Alias: string): Recordset {
    let Results = new Recordset();
    let recordCount = pOHLCV.getFieldByIndex(0).recordCount;
    let field1 = new Field();
    field1.initialize(recordCount, Alias);
    let pClose = pOHLCV.getField('Close');
    let sv = new Field();
    sv.initialize(recordCount, 'sv');
    let ma = new MovingAverage();
    let sma = ma.simpleMovingAverage(pOHLCV.getField('Close'), Periods, 'x').getField('x');
    let tr = this.trueRange(pOHLCV, 'x').getField('x');
    let ema = ma.exponentialMovingAverage(tr, Periods, 'x').getField('x');
    for (let record = 2; record < recordCount + 1; record++) {
      if (ema.value(record) !== 0) {
        field1.setValue(record, (pClose.value(record) - sma.value(record)) / ema.value(record));
      } else {
        field1.setValue(0, null);
      }
    }
    for (let record = 1; record < Periods + 1; ++record) {
      field1.setValue(record, 0);
    }
    Results.addField(field1);
    return Results;
  }

  // @endif

  // @if SCX_LICENSE != 'free'

  momentum(pSource: Field, iPeriods: number, sAlias: string): Recordset {
    let Results = new Recordset();
    let Field1;
    let iRecordCount = 0;
    let iRecord = 0;
    let iStart = 0;
    let dValue = 0;
    iRecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(iRecordCount, sAlias);
    iStart = iPeriods + 2;
    let nav = iStart;
    for (iRecord = iStart; iRecord < iRecordCount + 1; iRecord++) {
      dValue = pSource.value(nav - iPeriods);
      dValue = 100 + ((pSource.value(nav) - dValue) / dValue) * 100;
      Field1.setValue(nav, dValue);
      nav++;
    }
    Results.addField(Field1);
    return Results;
  }

  aroon(pOHLCV: Recordset, Periods: number): Recordset {
    let Results = new Recordset();
    let AUp;
    let ADn;
    let AOs;
    let RecordCount = 0;
    let Record = 0;
    let Period = 0;
    let HighestHigh = 0;
    let LowestLow = 0;
    let HighPeriod = 0;
    let LowPeriod = 0;
    RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    AUp = new Field();
    AUp.initialize(RecordCount, 'Aroon Up');
    ADn = new Field();
    ADn.initialize(RecordCount, 'Aroon Down');
    AOs = new Field();
    AOs.initialize(RecordCount, 'Aroon Oscillator');
    for (Record = Periods + 1; Record < RecordCount + 1; ++Record) {
      HighestHigh = pOHLCV.value('High', Record);
      LowestLow = pOHLCV.value('Low', Record);
      HighPeriod = Record;
      LowPeriod = Record;
      for (Period = Record - Periods; Period < Record; ++Period) {
        if (pOHLCV.value('High', Period) > HighestHigh) {
          HighestHigh = pOHLCV.value('High', Period);
          HighPeriod = Period;
        }
        if (pOHLCV.value('Low', Period) < LowestLow) {
          LowestLow = pOHLCV.value('Low', Period);
          LowPeriod = Period;
        }
      }
      AUp.setValue(Record, ((Periods - (Record - HighPeriod)) / Periods) * 100);
      ADn.setValue(Record, ((Periods - (Record - LowPeriod)) / Periods) * 100);
      AOs.setValue(Record, (AUp.value(Record) - ADn.value(Record)));
    }
    Results.addField(AUp);
    Results.addField(ADn);
    Results.addField(AOs);
    return Results;
  }

  trueRange(pOHLCV: Recordset, Alias: string): Recordset {
    let Results = new Recordset();
    let Field1;
    let RecordCount = 0;
    let Record = 0;
    let T1 = 0;
    let T2 = 0;
    let T3 = 0;
    let Value = 0;
    RecordCount = pOHLCV.getFieldByIndex(0).recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    for (Record = 2; Record < RecordCount + 1; ++Record) {
      T1 = pOHLCV.value('High', Record) - pOHLCV.value('Low', Record);
      T2 = Math.abs((pOHLCV.value('High', Record) - pOHLCV.value('Close', Record - 1)));
      T3 = Math.abs((pOHLCV.value('Close', Record - 1) - pOHLCV.value('Low', Record)));
      Value = 0;
      if (T1 > Value) {
        Value = T1;
      }
      if (T2 > Value) {
        Value = T2;
      }
      if (T3 > Value) {
        Value = T3;
      }
      Field1.setValue(Record, Value);
    }
    Field1.name = Alias;
    Results.addField(Field1);
    return Results;
  }

  // @endif

  MACD(pSource: Field, SignalPeriods: number, LongCycle: number, ShortCycle: number, MAType: number, Alias: string): Recordset {
    let Results = new Recordset();
    let Field1;
    let Field2;
    let MA = new MovingAverage();
    let EMA1;
    let EMA2;
    let RecordCount = 0;
    let Record = 0;
    let Value = 0;
    let a = Alias;
    RecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    EMA1 = MA.movingAverageSwitch(pSource, LongCycle, MAType, 'MA');
    EMA2 = MA.movingAverageSwitch(pSource, ShortCycle, MAType, 'MA');
    for (Record = 1; Record < RecordCount + 1; Record++) {
      Value = EMA2.value('MA', Record) - EMA1.value('MA', Record);
      Field1.setValue(Record, Value);
    }
    EMA1 = null;
    EMA1 = MA.movingAverageSwitch(Field1, SignalPeriods, MAType, 'MA');
    Field2 = EMA1.getField('MA');
    Field2.name = a + 'Signal';
    Results.addField(Field1);
    Results.addField(Field2);
    EMA1.removeField(a + 'Signal');
    return Results;
  }

  macdHistogram(pSource: Field, SignalPeriods: number, LongCycle: number, ShortCycle: number, MAType: number, Alias: string): Recordset {
    let Results = new Recordset();
    let Field1;
    let Field2;
    let MA = new MovingAverage();
    let MA1;
    let MA2;
    let RecordCount = 0;
    let Record = 0;
    let Value = 0;
    let a = Alias;
    RecordCount = pSource.recordCount;
    Field1 = new Field();
    Field1.initialize(RecordCount, Alias);
    MA1 = MA.movingAverageSwitch(pSource, LongCycle, MAType, 'MA');
    MA2 = MA.movingAverageSwitch(pSource, ShortCycle, MAType, 'MA');
    for (Record = 1; Record < RecordCount + 1; Record++) {
      Value = MA2.value('MA', Record) - MA1.value('MA', Record);
      Field1.setValue(Record, Value);
    }
    MA1 = null;
    MA1 = MA.movingAverageSwitch(Field1, SignalPeriods, MAType, 'MA');
    Field2 = MA1.getField('MA');
    Field2.name = a + 'Signal';
    let histogram = new Field();
    histogram.initialize(RecordCount, Alias);
    for (Record = 1; Record < RecordCount + 1; Record++) {
      Value = Field1.value(Record) - Field2.value(Record);
      histogram.setValue(Record, Value);
    }
    Results.addField(histogram);
    MA1.removeField(a + 'Signal');
    return Results;
  }
  SuperTrendOscillator(pSource: Field, averageTrueRange: Field, Periods: number, Alias: string, multiplier: number, HighField: Field, LowField: Field): Recordset {
    let Results = new Recordset();
    let RecordCount = averageTrueRange.recordCount;
    let BasicUpperBand = new Field();
    let BasicLowerBand = new Field();
    let FinalUpperBand = new Field();
    let FinalLowerBand = new Field();
    let Supertrend = new Field();
    let ColorField = new Field();
    BasicUpperBand.initialize(RecordCount, "UB");
    BasicLowerBand.initialize(RecordCount, "LB");
    FinalUpperBand.initialize(RecordCount, "FUB");
    FinalLowerBand.initialize(RecordCount, "FLB");
    Supertrend.initialize(RecordCount, Alias);
    ColorField.initialize(RecordCount, "CF");
    let Start = Periods;
    for (let Period = Start; Period <= RecordCount; Period++) {
      let HF = HighField.value(Period);
      let LF = LowField.value(Period);
      let ATR = averageTrueRange.value(Period);
      let CurrentUpperBand = (HF + LF) / 2 + multiplier * ATR;
      let CurrentLowerBand = (HF + LF) / 2 - multiplier * ATR
      BasicUpperBand.setValue(Period, CurrentUpperBand);
      BasicLowerBand.setValue(Period, CurrentLowerBand);
      //Setting the Final Upper Band Value
      if (BasicUpperBand.value(Period) < FinalUpperBand.value(Period - 1)
        || pSource.value(Period - 1) > FinalUpperBand.value(Period - 1)) {
        FinalUpperBand.setValue(Period, CurrentUpperBand);
      }
      else {
        FinalUpperBand.setValue(Period, FinalUpperBand.value(Period - 1))
      }
      //Setting the Final Lower Band Value
      if (BasicLowerBand.value(Period) > FinalLowerBand.value(Period - 1)
        || pSource.value(Period - 1) < FinalLowerBand.value(Period - 1)) {
        FinalLowerBand.setValue(Period, CurrentLowerBand);
      }
      else {
        FinalLowerBand.setValue(Period, FinalLowerBand.value(Period - 1))
      }


      if (Supertrend.value(Period - 1) == FinalLowerBand.value(Period - 1)) {
        if (FinalLowerBand.value(Period) >= pSource.value(Period)) {
          Supertrend.setValue(Period, FinalUpperBand.value(Period));
        } else {
          Supertrend.setValue(Period, FinalLowerBand.value(Period));
        }
      } else if (Supertrend.value(Period - 1) == FinalUpperBand.value(Period - 1)) {

        if (FinalUpperBand.value(Period) <= pSource.value(Period)) {
          Supertrend.setValue(Period, FinalLowerBand.value(Period));
        } else {
          Supertrend.setValue(Period, FinalUpperBand.value(Period));
        }
      } else {
        if (FinalLowerBand.value(Period) >= pSource.value(Period)) {
          Supertrend.setValue(Period, FinalUpperBand.value(Period));
        } else {
          Supertrend.setValue(Period, FinalLowerBand.value(Period));

        }
      }
      if (Supertrend.value(Period) >= pSource.value(Period)) {
        ColorField.setValue(Period, 0)
      }
      else {
        ColorField.setValue(Period, 1)
      }
    }
    Results.addField(Supertrend);
    Results.addField(ColorField);
    return Results;
  }

}
