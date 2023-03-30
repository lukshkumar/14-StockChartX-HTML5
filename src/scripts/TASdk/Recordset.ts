/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */
import { Field } from "./Field";
export class Recordset {
    private _m_FieldNav = [];

    addField(newField: Field) {
        this._m_FieldNav.push(newField);
    }

    getIndex(sFieldName: string): number {
        for (let i = 0; i < this._m_FieldNav.length; i++) {
            if (this._m_FieldNav[i].name === sFieldName) {
                return i;
            }
        }

        return -1;
    }

    renameField(sOldFieldName: string, sNewFieldName: string) {
        let iIndex = this.getIndex(sOldFieldName);
        if (iIndex !== -1) {
            this._m_FieldNav[iIndex].name = sNewFieldName;
        }
    }

    removeField(sFieldName: string) {
        let iIndex = this.getIndex(sFieldName);
        if (iIndex !== -1) {
            this._m_FieldNav.splice(iIndex, 1);
        }
    }

    value(sFieldName: string, iRowIndex: number): number {
        let iIndex = this.getIndex(sFieldName);
        if (iIndex !== -1) {
            return this._m_FieldNav[iIndex].value(iRowIndex);
        }

        return -1;
    }

    getField(sFieldName: string): Field {
        let iIndex = this.getIndex(sFieldName);
        if (iIndex !== -1) {
            return this._m_FieldNav[iIndex];
        }

        return new Field();
    }

    getFieldByIndex(iIndex: number): Field {
        if (iIndex !== -1 && iIndex < this._m_FieldNav.length) {
            return this._m_FieldNav[iIndex];
        }

        return new Field();
    }

    copyField(f: Field, sFieldName: string) {
        let iIndex = this.getIndex(sFieldName);
        if (iIndex === -1) {
            return;
        }

        let src = this._m_FieldNav[iIndex];
        let iRecordCount = src.recordCount;
        for (let iRec = 1; iRec < iRecordCount + 1; iRec++) {
            f.setValue(iRec, src.value(iRec));
        }
    }

    getName(iFieldIndex: number): string {
        if (iFieldIndex >= 0 && iFieldIndex < this._m_FieldNav.length) {
            return this._m_FieldNav[iFieldIndex].name;
        }

        return "";
    }
}
