// /*
//  *   WARNING! This program and source code is owned and licensed by
//  *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
//  *   Viewing or use this code requires your acceptance of the license
//  *   agreement found at http://www.modulusfe.com/support/license.pdf
//  *   Removal of this comment is a violation of the license agreement.
//  *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
//  */

// /* tslint:disable:interface-name */
// // noinspection JSUnusedGlobalSymbols
// /**
//  * @internal
//  */
interface Window {
  StockChartX: any;
  TASdk: Object;
  jqueryI18next: any;
  i18nextXHRBackend: any;
}
// /* tslint:enable:interface-name */

// /**
//  * StockChartX namespace
//  * @namespace StockChartX
//  */
// "use strict";

// /////////////////////////////////////////////////////////////////////////////////////////////////
// /* !!! WARNING TO NEFARIOUS COMPANIES AND DEVELOPERS !!!

//      Your license agreement requires the use of the Modulus LicensePing.com licensing mechanism.
//      The mechanism monitors the usage and distribution patterns of our intellectual property.
//      If the usage or distribution patterns indicate that our licensing mechanism has either
//      been removed, altered, tampered with or that our intellectual property may be misused in
//      any form, our legal team may initiate contact with you to investigate the matter further.

//      Removal or modification of this license mechanism by any means whatsoever (editing the code,
//      removing the LicensePing.com URL reference, etc.) constitutes willful and criminal copyright
//      infringement in addition to giving rise to claims by Modulus Financial Engineering, Inc.
//      against you, as the developer, and your company as a whole for, among others:

//      (1) Copyright Infringement;
//      (2) False Designation of Origin;
//      (3) Breach of Contract;
//      (4) Misappropriation of Trade Secrets;
//      (5) Interference with Contract; and
//      (6) Interference with Prospective Business Relations.

//      17 USC � 506 - Criminal offenses
//      (a) Criminal Infringement.
//      Any person who willfully infringes a copyright shall be punished as provided under section
//      2319 of title 18, if the infringement was committed for purposes of commercial advantage
//      or private financial gain.

//      18 USC � 2319 - Criminal infringement of a copyright
//      (a) Any person who commits an offense under section 506 (a)(1)(A) of title 17 shall be imprisoned
//      not more than 5 years, or fined in the amount set forth in this title (up to $150,000), or both,
//      if the offense consists of the reproduction or distribution, including by electronic means, during
//      any 180-day period, of at least 10 copies, of 1 or more copyrighted works, which have a total retail
//      value of more than $2,500.

//      For more information, review the license agreement associated with this software and source
//      code at http://www.modulusfe.com/support/license.pdf or contact us at legal@modulusfe.com */
// /////////////////////////////////////////////////////////////////////////////////////////////////

// // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// // ---->  THIS CODE *MUST* BE OBFUSCATED VIA BANANASCRIPT.COM BEFORE DEPLOYMENT!  <----	    !! <---- !! <---- !!
// // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// // DO NOT REMOVE THIS CODE - CONTACT SALES@MODULUSFE.COM FOR KEYS!
// //const separator = /\s*[,;]\s*/;
// //const clients = "modulusglobal.com, yourdomainhere.com".split(separator);
// //const domains = "modulusglobal.com, yourdomainhere.com".split(separator);
// //const vrcodes = "4352, 0000".split(separator);
// const clients = [
//   "modulusglobal.com",
//   "stockchartx.herokuapp.com",
//   "stockchartxlogscale.herokuapp.com",
//   "stockchartxfrantz.herokuapp.com"
// ];
// const domains = [
//   "modulusglobal.com",
//   "stockchartx.herokuapp.com",
//   "stockchartxlogscale.herokuapp.com",
//   "stockchartxfrantz.herokuapp.com"
// ];
// const vrcodes = ["4352", "6400", "8448", "7936"];
// const licenseExpiration: Date | string = "INSERT EXPIRATION DATE HERE"; // new Date(2015, 0, 1)
// const trustedHosts: string[] = ["localhost", "127.0.0.1"];
// const allowSubDomains = true;
// const licenseServer = "https://modulusglobal.com/licenseping/ping.ashx";

// checkLicense();

// function checkLicense() {
//   if (isExpired()) {
//     handleInvalidLicense();
//     return;
//   }

//   let host = window.location.hostname;
//   if (isHostInList(host, trustedHosts)) return;

//   if (!isHostInList(host, domains)) {
//     handleInvalidLicense();
//     return;
//   }

//   // validateLicense();
// }

// function isExpired() {
//   return (
//     typeof licenseExpiration !== "string" &&
//     licenseExpiration &&
//     new Date() > licenseExpiration
//   );
// }

// function isHostInList(host: string, hostsList: string[]) {
//   let normalizedHost = host.toUpperCase();

//   for (let item of hostsList) {
//     let normalizedItem = item.toUpperCase();

//     // Check if current host is exactly the same as in the list
//     if (normalizedHost === normalizedItem) return true;

//     // Check if current host is a sub-domain of a host from list.
//     if (allowSubDomains) {
//       let idx = normalizedHost.lastIndexOf("." + normalizedItem);
//       if (idx > 0 && idx === normalizedHost.length - normalizedItem.length - 1)
//         return true;
//     }
//   }

//   return false;
// }

// function validateLicense() {
//   if (!(clients.length === domains.length && clients.length === vrcodes.length))
//     throw new Error("Invalid license data.");

//   let isHandled = false;
//   for (let i = 0; i < clients.length; i++) {
//     let img = new Image();

//     img.onload = () => {
//       if (img.width > 1 && !isHandled) {
//         // Image width is greater than 1 if the domain is
//         // unlicensed or if the license has been revoked.
//         isHandled = true;
//         handleInvalidLicense();
//       }
//     };
//     img.src = `${licenseServer}?&cid=${clients[i]}&asm=${domains[i]}&vr=${
//       vrcodes[i]
//     }&img=1&t=${Math.random()}`;
//   }
// }

// function handleInvalidLicense() {
//   window.StockChartX = undefined;
//   window.TASdk = undefined;
//   alert("Invalid license - contact legal@modulusfe.com");

//   throw new Error("Invalid StockChartX license.");
// }
