/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

export interface ILinearRegressionResult {
  slope: number;
  firstValue: number;
}

/**
 * @internal
 */
export class DrawingCalculationUtil {
  public static calculateLinearRegression(
    values: number[]
  ): ILinearRegressionResult {
    let xAvg = 0,
      yAvg = 0,
      count = values.length;

    for (let i = 0; i < count; i++) {
      xAvg += i;
      yAvg += values[i];
    }
    xAvg = count === 0 ? 0 : xAvg / count;
    yAvg = count === 0 ? 0 : yAvg / count;

    let v1 = 0,
      v2 = 0;
    for (let i = 0; i < count; i++) {
      v1 += (i - xAvg) * (values[i] - yAvg);
      v2 += Math.pow(i - xAvg, 2);
    }

    let slope = v2 === 0 ? 0 : v1 / v2;
    let firstValue = yAvg - slope * xAvg;

    return {
      slope,
      firstValue
    };
  }
}
