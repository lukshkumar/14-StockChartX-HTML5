/// <reference path="jquery.d.ts"/>

/* tslint:disable */

interface JQuery {
    resizable(options:Resizable.Options): JQuery;
}

declare module Resizable {

    export interface Options {
        container: JQuery;
        minWidth?: number;
        minHeight?: number;
        direction: string | string[];
        start?: (any) => void;
        resize?: (any) => void;
        stop?: (any) => void;
    }
}