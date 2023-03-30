/// <reference path="jquery.d.ts"/>

/* tslint:disable */

interface JQuery {
    autocolumnlist(options:AutoColumnList.Options): JQuery;
}

declare module AutoColumnList {

    export interface Options {
        min?: number;
        max?: number;
        columns?: number;
        classname?: string;
    }
}