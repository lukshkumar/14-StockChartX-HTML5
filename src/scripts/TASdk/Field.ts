/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */
import { Const } from "./TASdk";
export class Field {
    _m_values: number[] = [];

    recordCount: number = 0;
    name: string;

    initialize(iRecordCount: number, sName: string) {
        this.name = sName;
        this.recordCount = iRecordCount;
        this._m_values = new Array(iRecordCount + 1);
        for (let n = 0; n < this._m_values.length; n++) {
            this._m_values[n] = 0;
        }
    }

    setValue(iIndex: number, value: number) {
        this._m_values[iIndex] = value;
    }

    value(iIndex: number): number {
        if (iIndex > 0 && iIndex < this._m_values.length) {
            return this._m_values[iIndex];
        }

        return Const.nullValue;
    }
}
