/// <reference path="jquery.d.ts"/>

/* tslint:disable */

interface JQuery {
    selectpicker(): JQuery;
    selectpicker(options: BootstrapSelect.Options);
    selectpicker(method: 'val'): number|string;
    selectpicker(method: 'val', val?: number|string): JQuery;
    selectpicker(method: 'refresh');
    selectpicker(method: string): any;
}

declare module BootstrapSelect {
    interface Options {
        container: string;
    }
}