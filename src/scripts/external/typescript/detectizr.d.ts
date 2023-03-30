/* tslint:disable */

declare module Detectizr {
    interface Browser {
        name: string;
        major:string;
        engine: string;
    }

    interface Device {
        type: String;
    }

    interface OS {
        addressRegisterSize: String;
        major: String;
        minor: String;
        name: String;
        patch: String;
        version: String;
    }

    function detect(params: any);
    var device: Device;
    var os: OS;
    var browser: Browser;
}