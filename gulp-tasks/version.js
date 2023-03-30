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
const merge = require('merge-stream');
const replace = require('gulp-replace');

const pkg = require('../package.json');

// endregion

/**
 * @typedef {Object} Version
 * @property {number} major The version major number.
 * @property {number} minor The version minor number.
 * @property {number} hotfix The hotfix number.
 */

/**
 * Parses version information from package.json.
 * @returns {Version} The version information.
 */
function parseVersion() {
    const parts = pkg.version.split('.');

    return {
        major: parseInt(parts[0], 10),
        minor: parseInt(parts[1], 10),
        hotfix: parseInt(parts[2], 10)
    };
}

/**
 * Converts version to string representation.
 * @param {Version} version The version information.
 * @returns {string} The string representation of version.
 */
function toVersionString(version) {
    return `${version.major}.${version.minor}.${version.hotfix}`;
}

/**
 * Updates version information in files.
 * @param {Version} version The version.
 * @returns {IMergedStream} The merged stream.
 */
function updateVersion(version) {
    let regex = /^(\s*"version"\s*:\s*")(\d+\.\d+\.\d+)("\s*,\s*)$/m;
    const packageJson = gulp.src('package.json')
        .pipe(replace(regex, `$1${toVersionString(version)}$3`))
        .pipe(gulp.dest('./'));

    regex = /^(\s*export\s+const\s+version\s*=\s*")(\d+\.\d+\.\d+)("\s*;\s*)$/m;
    const scx = gulp.src('src/scripts/StockChartX/Chart.ts')
        .pipe(replace(regex, `$1${toVersionString(version)}$3`))
        .pipe(gulp.dest('src/scripts/StockChartX'));

    return merge(packageJson, scx);
}

/**
 * Increments major version.
 */
gulp.task('version:next-major', () => {
    const version = parseVersion();
    version.major++;
    version.minor = 0;
    version.hotfix = 0;

    return updateVersion(version);
});

/**
 * Increments minor version.
 */
gulp.task('version:next-minor', () => {
    const version = parseVersion();
    version.minor++;
    version.hotfix = 0;

    return updateVersion(version);
});

/**
 * Increments hotfix version.
 */
gulp.task('version:next-hotfix', () => {
    const version = parseVersion();
    version.hotfix++;

    return updateVersion(version);
});
