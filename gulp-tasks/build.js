/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/tos
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2012-2017 by Modulus Financial Engineering, Inc., Scottsdale, AZ USA
 */

"use strict";

// region Imports

const gulp = require('gulp');
const prompt = require('gulp-prompt');
const runSequence = require('run-sequence');
const util = require('gulp-util');

const buildEnv = require('./buildEnvironment.js');

const {LicenseKind} = buildEnv;
const BuildConfiguration = buildEnv.Configuration;

// endregion

// region Helper functions

/**
 * Parses number of days value into number.
 * @param {string} days The days count value to parse.
 * @returns {number} Days count as number or 0 if value is not a finite number.
 */
function parseDays(days) {
    if (!isFinite(days) || !(/^\d+/).test(days)) {
        // eslint-disable-next-line no-magic-numbers
        return 0;
    }

    // eslint-disable-next-line no-magic-numbers
    return parseInt(days, 10) + 1;
}

/**
 * Parses license parameters from command line arguments into 'license' variable.
 * @returns {License} The license object.
 */
function parseLicenseFromCommandLine() {
    buildEnv.license.kind = util.env.license;
    buildEnv.license.client = util.env.client;
    buildEnv.license.domain = util.env.domain;
    buildEnv.license.vrcode = util.env.vrcode;
    buildEnv.license.expirationInDays = parseDays(util.env.days);
    buildEnv.license.trustedDomains = util.env['trusted-domains'];

    return buildEnv.license;
}

// endregion


gulp.task('helper:release-prompt', () =>
    // noinspection JSUnusedGlobalSymbols
    gulp.src('gulpfile.js')
        .pipe(prompt.prompt([
            {
                type: 'list',
                name: 'license',
                message: 'License:',
                choices: [LicenseKind.FREE, LicenseKind.LITE, LicenseKind.FULL],
                default: LicenseKind.FULL
            },
            {
                type: 'input',
                name: 'client',
                message: 'Client:'
            },
            {
                type: 'input',
                name: 'domain',
                message: 'Domain:'
            },
            {
                type: 'input',
                name: 'vrcode',
                message: 'VR Code:'
            },
            {
                type: 'input',
                name: 'days',
                message: 'Expires after # days:',
                validate: days => {
                    if (!days)
                        return true;

                    if (!isFinite(days))
                        return false;

                    const value = parseInt(days, 10);

                    return value >= 0;  // eslint-disable-line no-magic-numbers
                }
            },
            {
                type: 'input',
                name: 'trusted-domains',
                message: 'Trusted Domains:'
            }
        ], res => {
            buildEnv.license.kind = res.license;
            buildEnv.license.client = res.client;
            buildEnv.license.domain = res.domain;
            buildEnv.license.vrcode = res.vrcode;
            buildEnv.license.expirationInDays = parseDays(res.days);
            buildEnv.license.trustedDomains = res['trusted-domains'];
        }))
);

/**
 * Prompts license information and builds release version of the package.
 */
gulp.task('build:release-prompt', callback => {
    buildEnv.configure(BuildConfiguration.RELEASE, LicenseKind.FULL);

    runSequence(
        'helper:release-prompt',
        'deploy',
        callback
    );
});

/**
 * Builds release version of the package. License information is provided via command line arguments.
 * Syntax:
 *  gulp build:release-cmd --client CLIENT_NAME --domain DOMAIN_NAME --vrcode VRCODE [--trusted-domains TRUSTED_DOMAINS]
 */
gulp.task('build:release-cmd', callback => {
    const license = parseLicenseFromCommandLine();

    buildEnv.configure(BuildConfiguration.RELEASE, license.kind);

    let message = `Building release package for the domain "${license.domain}".`;
    if (license.days > 0)   // eslint-disable-line no-magic-numbers
        message += ` Expires after ${license.expirationInDays} day(s).`;
    util.log(message);

    runSequence(
        'deploy',
        callback
    );
});

/**
 * Builds package.
 * @param {Object} options The build options.
 * @param {string} options.configuration The build configuration.
 * @param {string} options.license The build license kind.
 * @param {Function} options.callback The task callback.
 * @returns {void}
 */
function build(options) {
    buildEnv.configure(options.configuration, options.license);

    runSequence(
        'deploy',
        options.callback
    );
}

/**
 * Builds free version of the package.
 */
gulp.task('build:release-free', callback => {
    build({
        configuration: BuildConfiguration.RELEASE,
        license: LicenseKind.FREE,
        callback
    });
});

/**
 * Builds lite version of the package.
 */
gulp.task('build:release-lite', callback => {
    build({
        configuration: BuildConfiguration.RELEASE,
        license: LicenseKind.LITE,
        callback
    });
});

/**
 * Builds full version of the package.
 */
gulp.task('build:release-full', callback => {
    build({
        configuration: BuildConfiguration.RELEASE,
        license: LicenseKind.FULL,
        callback
    });
});

/**
 * Builds source code version of the package.
 */
gulp.task('build:release-source-code', callback => {
    const license = parseLicenseFromCommandLine();

    if (license.domain) {
        const days = parseDays(license.days);
        let message = `Building source code package for the domain "${license.domain}".`;
        if (days > 0)   // eslint-disable-line no-magic-numbers
            message += ` Expires after ${days} day(s).`;
        util.log(message);
    }

    runSequence(
        'deploy:source-code',
        callback
    );
});
