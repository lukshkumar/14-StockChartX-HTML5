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

const Concat = require('concat-with-sourcemaps');
const fs = require('fs');
const path = require('path');
const request = require('request');
const stream = require('stream');
const through = require('through2');
const util = require('gulp-util');

const pkg = require('../package.json');

// endregion

// region File header

/**
 * Adds header into the file.
 * @param {Object} file The file.
 * @param {string} header The header.
 * @returns {void}
 */
function addHeader(file, header) {
    const filename = path.basename(file.path);
    const opt = {
        file,
        filename
    };
    const template = util.template(header, opt);
    const concat = new Concat(true, filename);

    concat.add(null, new Buffer(template));
    concat.add(file.relative, file.contents, file.sourceMap);
    if (file.contents && !(file.contents instanceof stream.Stream))
        file.contents = concat.content;
    if (concat.sourceMapping)
        file.sourceMap = JSON.parse(concat.sourceMap);
}

/**
 * Creates transformation function to insert package header
 * @returns {stream.Transform} Stream transformation object.
 */
function packageHeader() {
    /**
     * Inserts package header.
     * @param {any} file The input file.
     * @param {string} encoding The file's encoding.
     * @param {stream.TransformCallback} callback The callback function.
     * @returns {void}
     */
    function transform(file, encoding, callback) {
        fs.readFile('license.txt', 'utf8', (error, data) => {
            if (error) {
                callback(error, file);

                return;
            }

            const licenseComment = data.split('\n').join('\n * ');
            const header = [
                '/**',
                ` * ${pkg.description}`,
                ` * @version v${pkg.version}`,
                ` * @link ${pkg.homepage}`,
                ` * @license ${licenseComment}`,
                ' */',
                ''
            ].join('\n');

            addHeader(file, header);
            callback(null, file);
        });
    }

    return through.obj(transform);
}

// endregion

// region Bananascript

const BANANA_URL = process.env.BANANA_URL || 'https://defatted-banana.magnise.com/api/';
// 'http://bananascript.com/api/';

/**
 * Creates transformation function to obfuscate javascript file using bananascript.
 * @returns {stream.Transform} Stream transformation object.
 */
function obfuscate() {
    /**
     * Obfuscates javascript file using bananascript service.
     * @param {any} file The input file.
     * @param {string} encoding The file's encoding.
     * @param {stream.TransformCallback} callback The callback function.
     * @returns {void}
     */
    function transform(file, encoding, callback) {
        const data = {
            url: BANANA_URL,
            form: {
                js: file.contents.toString()
            },
            encoding: null
        };
        const statusCodeOk = 200;

        request.post(data, (error, response, body) => {
            if (error)
                return callback(error, file);
            if (response.statusCode !== statusCodeOk)
                return callback(`Unexpected status code:${response.statusCode}.`, file);

            file.contents = body;

            return callback(null, file);
        });
    }

    return through.obj(transform);
}

// endregion

module.exports = {
    packageHeader,
    obfuscate
};
