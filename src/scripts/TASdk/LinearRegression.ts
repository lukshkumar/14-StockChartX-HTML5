import { Field } from "./Field";
import { Recordset } from "./Recordset";

/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


// @if SCX_LICENSE = 'full'

export class LinearRegression {
  regression(pSource: Field, iPeriods: number): Recordset {
    let X = 0;
    let Y = [];
    let N = 0;
    let q1 = 0;
    let q2 = 0;
    let q3 = 0;
    let XSum = 0;
    let YSum = 0;
    let XSquaredSum = 0;
    let YSquaredSum = 0;
    let XYSum = 0;
    let dSlope = 0;
    let dIntercept = 0;
    let dForecast = 0;
    let dRSquared = 0;
    let Results = new Recordset();
    let dValue = 0;
    let iPeriod = 0;
    let iPosition = 0;
    let iRecordCount = pSource.recordCount;
    let Field1 = new Field();
    Field1.initialize(iRecordCount, "Slope");
    let Field2 = new Field();
    Field2.initialize(iRecordCount, "Intercept");
    let Field3 = new Field();
    Field3.initialize(iRecordCount, "Forecast");
    let Field4 = new Field();
    Field4.initialize(iRecordCount, "RSquared");
    let nav = 1;
    for (let iRecord = iPeriods; iRecord < iRecordCount + 1; iRecord++) {
      X = iPeriods;
      Y = new Array(X + 1);
      iPosition = iRecord;
      nav = iRecord - iPeriods + 1;
      for (iPeriod = 1; iPeriod < iPeriods + 1; iPeriod++) {
        dValue = pSource.value(nav);
        Y[iPeriod] = dValue;
        nav++;
      }
      nav = iPosition;
      XSum = 0;
      YSum = 0;
      XSquaredSum = 0;
      YSquaredSum = 0;
      XYSum = 0;
      for (N = 1; N < X + 1; N++) {
        XSum += N;
        YSum += Y[N];
        XSquaredSum += N * N;
        YSquaredSum += Y[N] * Y[N];
        XYSum += Y[N] * N;
      }
      N = X;
      q1 = XYSum - (XSum * YSum) / N;
      q2 = XSquaredSum - (XSum * XSum) / N;
      q3 = YSquaredSum - (YSum * YSum) / N;
      dSlope = q1 / q2;
      dIntercept =
        (1 / N) * YSum - parseInt(<string>(<any>(N / 2)), 10) * dSlope;
      dForecast = N * dSlope + dIntercept;
      if (!!(q1 * q1) && !!(q2 * q3)) {
        dRSquared = (q1 * q1) / (q2 * q3);
      }
      if (iRecord > iPeriods) {
        Field1.setValue(iRecord, dSlope);
        Field2.setValue(iRecord, dIntercept);
        Field3.setValue(iRecord, dForecast);
        Field4.setValue(iRecord, dRSquared);
      }
      nav++;
    }
    Results.addField(Field1);
    Results.addField(Field2);
    Results.addField(Field3);
    Results.addField(Field4);
    return Results;
  }

  timeSeriesForecast(
    pSource: Field,
    iPeriods: number,
    sAlias: string
  ): Recordset {
    let Results;
    Results = this.regression(pSource, iPeriods);
    Results.renameField("Forecast", sAlias);
    Results.removeField("Slope");
    Results.removeField("Intercept");
    Results.removeField("RSquared");
    return Results;
  }
}

// @endif
