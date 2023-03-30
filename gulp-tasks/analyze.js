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
const eslint = require('gulp-eslint');
const gulpTslint = require('gulp-tslint');
const tslint = require("tslint");


// endregion

/**
 * Analyzes *.ts files with tslint utility
 */
gulp.task('analyze:tslint', ['compile:typescript'], () => {
    const options = {
        program: tslint.Linter.createProgram("./tsconfig.json"),
        formatter: 'verbose'
    };

    return gulp.src(['src/**/*.ts', '!**/*.d.ts'], {base: '.'})
            .pipe(gulpTslint(options))
            .pipe(gulpTslint.report());
});

/**
 * Analyzes *.js files with eslint utility
 */
gulp.task('analyze:eslint', () =>
    gulp.src(['gulp-tasks/**/*.js', 'src/scripts/*.js', '!src/scripts/references.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError())
);

gulp.task('analyze', ['analyze:tslint', 'analyze:eslint']);
