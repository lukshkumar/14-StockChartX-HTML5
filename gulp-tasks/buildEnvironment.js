/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

// region Build configurations

const Configuration = {
    DEBUG: 'debug',
    RELEASE: 'release'
};

let configuration = Configuration.DEBUG;

// endregion

// region Build license

const LicenseKind = {
    FULL: 'full',
    FREE: 'free',
    LITE: 'lite'
};

/**
 * @typedef {Object} License
 * @property {string} kind The license kind.
 * @property {string} [client] The client name.
 * @property {string} [domain] The domain name.
 * @property {string} [vrcode] The VR code value.
 * @property {number} [expirationInDays] The number of days license expires after.
 */
/**
 * @type {License}
 */
const license = {
    kind: LicenseKind.FULL,
    client: null,
    domain: null,
    vrcode: null,
    expirationInDays: null,
    trustedDomains: null
};

// endregion

/**
 * Configures build properties
 * @param {string} buildConfiguration The build configuration.
 * @param {string} licenseKind The build license kind.
 * @returns {void}
 */
function configure(buildConfiguration, licenseKind) {
    configuration = buildConfiguration || Configuration.DEBUG;
    license.kind = licenseKind || LicenseKind.FULL;
}

// region Exports

module.exports = {
    Configuration,
    LicenseKind,
    configure
};

Object.defineProperty(module.exports, "configuration", {
    get: () => configuration,
    set: value => {
        configuration = value;
    }
});

Object.defineProperty(module.exports, "license", {
    get: () => license
});

// endregion
