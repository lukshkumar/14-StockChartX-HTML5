/// <reference path="jquery.d.ts" />
/// <reference path="i18next.d.ts" />

interface JQuery {
    localize();
}

declare module jQueryI18next{
    interface JQueryI18Next {
        init: (i18next: I18next.I18n, $:JQueryStatic, options:any) => void;
    }
}

declare var jqueryI18next: jQueryI18next.JQueryI18Next;