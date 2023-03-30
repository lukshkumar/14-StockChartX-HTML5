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

const exec = require("gulp-exec");
const gulp = require("gulp");
const inject = require("gulp-inject");
const lazypipe = require("lazypipe");
const merge = require("merge-stream");
const path = require("path");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const runSequence = require("run-sequence");
const sass = require("gulp-sass");
const series = require("stream-series");
const sourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");

const build = require("./buildEnvironment.js");

const project = require("../project.json");

// endregion

/**
 * Compiles *.scss files into *.css.
 */
gulp.task("compile:sass", () => {
  const options = {
    stopOnError: true,
    noCache: true
  };

  // noinspection JSUnresolvedFunction
  return gulp.src('src/css/*.scss', options)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/css'))
});

/**
 * Generates src/scripts/references.ts file.
 */
gulp.task("compile:typescript-references", () => {
  const { js } = project.configuration.debug;
  const fileGroups = [js.external, js.scx.core, js.scx.ui, js.scx.external];
  const files = [].concat(...fileGroups);
  const streams = files.map(jsPath => {
    const external = "src/scripts/external/";
    const scxExternal = "src/scripts/StockChartX.External/";
    const isExternal = jsPath.startsWith(external);
    const isScxExternal = jsPath.startsWith(scxExternal);

    let startIndex = 0;
    if (isExternal) startIndex = external.length;
    else if (isScxExternal) startIndex = scxExternal.length;

    const extLength = jsPath.endsWith(".min.js")
      ? 6 // eslint-disable-line no-magic-numbers
      : 2; // eslint-disable-line no-magic-numbers
    const endIndex = jsPath.length - extLength;
    const prefix =
      isExternal || isScxExternal ? "src/scripts/external/typescript/" : "";
    const suffix = isExternal || isScxExternal ? "d.ts" : "ts";
    const tsPath = prefix + jsPath.substring(startIndex, endIndex) + suffix;

    return gulp.src("gulpfile.js", { read: false }).pipe(rename(tsPath));
  });

  const injectArgs = {
    addRootSlash: false,
    removeTags: true,
    ignorePath: "/src/scripts",
    starttag: "/// inject:{{ext}}",
    endtag: "/// endinject",
    transform: filePath => `/// <reference path="${filePath}" />`
  };

  return gulp
    .src("src/scripts/templates/references.ts")
    .pipe(inject(series(streams), injectArgs))
    .pipe(gulp.dest("src/scripts/"));
});

/**
 * Compiles typescript files.
 * @param {string} src The typescript source path.
 * @param {string} dst The destination path.
 * @returns {NodeJS.ReadWriteStream} The output stream.
 */
function compileTypescript(src, dst) {
  const tsProject = ts.createProject("tsconfig.json");
  let hasErrors = false;
  const tsResult = gulp
    .src([src, "!**/*.d.ts"])
    .pipe(sourcemaps.init())
    .pipe(tsProject(ts.reporter.fullReporter()))
    .on("error", () => {
      hasErrors = true;
    });

  return tsResult.js
    .pipe(gulp.dest(dst))
    .pipe(
      sourcemaps.write(".", {
        includeContent: false,
        mapSources: (filePath, file) => {
          file.sourceRoot = "";

          return `${path.basename(file.path, ".js")}.ts`;
        }
      })
    )
    .pipe(gulp.dest(dst))
    .on("end", () => {
      // if (hasErrors)
      // throw new Error('Typescript emit failed.');
    });
}

/**
 * Compiles typescript files.
 */
gulp.task("compile:typescript", ["compile:typescript-references"], () => {
  const src = compileTypescript("src/scripts/**/*.ts", "src/scripts");
  const tests = compileTypescript("test/**/*.ts", "test");

  return merge(src, tests);
});

const injectSourceFilesIntoTest = lazypipe().pipe(() => {
  const { js } = project.configuration.debug;
  const fileGroups = [js.external, js.scx.core, js.scx.ui, js.scx.external];
  const files = [].concat(...fileGroups);
  const streams = files.map(filePath =>
    gulp.src("gulpfile.js", { read: false }).pipe(rename(filePath))
  );

  const injectArgs = {
    addPrefix: "..",
    addRootSlash: false,
    starttag: "<!-- inject:src:js -->",
    removeTags: true
  };

  return inject(series(streams), injectArgs);
});

const injectTestFilesIntoTest = lazypipe().pipe(() => {
  const streams = gulp.src("test/**/*.js", { read: false });
  const injectArgs = {
    addRootSlash: false,
    ignorePath: "test/",
    starttag: "<!-- inject:test:js -->",
    removeTags: true
  };

  return inject(series(streams), injectArgs);
});

/**
 * Compiles tests.
 */
gulp.task("compile:tests", ["compile:typescript"], () =>
  gulp
    .src("test/templates/*.html")
    .pipe(injectSourceFilesIntoTest())
    .pipe(injectTestFilesIntoTest())
    .pipe(gulp.dest("test/"))
);

/**
 * Generates typescript definitions file.
 */
gulp.task(
  "compile:typescript-definitions",
  ["compile:typescript-references"],
  () => {
    const tsProject = ts.createProject("tsconfig.json", {
      module: "system",
      sourceMap: false,
      declaration: true,
      stripInternal: true,
      outFile: "StockChartX.js"
    });

    const scx = gulp
      .src(["src/scripts/StockChartX/**/*.ts", "!**/*.d.ts"])
      .pipe(tsProject())
      .dts.pipe(replace("src/scripts/external/typescript/", "./external/"))
      .pipe(gulp.dest(project.deploy.definitions));
    const external = gulp
      .src("src/scripts/external/typescript/*.d.ts")
      .pipe(gulp.dest(project.deploy.externalDefinitions));

    return merge(scx, external);
  }
);

/**
 * Generates documentation with jsdoc.
 */
gulp.task("compile:jsdoc", ["compile:typescript"], () => {
  const jsDocArgs = `-c jsdoc.conf.json -t ./node_modules/ink-docstrap/template -d ${
    project.deploy.doc
  }`;

  return gulp
    .src("jsdoc.conf.json")
    .pipe(exec(`node ./node_modules/jsdoc/jsdoc.js ${jsDocArgs}`));
});

/**
 * Generates html files from templates.
 */
gulp.task("compile:html", () => {
  const allConfig = project.configuration.all;
  const curConfig = project.configuration[build.configuration];
  const fileGroups = [
    allConfig.css.external,
    curConfig.css.scx.core,
    curConfig.css.scx.ui,
    curConfig.css.scx.external,
    curConfig.js.external,
    curConfig.js.scx.core,
    curConfig.js.scx.ui,
    curConfig.js.scx.external,
    allConfig.js.site
  ];
  const files = [].concat(...fileGroups);
  const streams = files.map(filePath =>
    gulp.src("gulpfile.js", { read: false }).pipe(rename(filePath))
  );

  const injectArgs = {
    addRootSlash: false,
    removeTags: true,
    ignorePath: "/src",
    transform: (filePath, file, index, length, targetFile) => {
      // eslint-disable-line max-params
      if (
        filePath.endsWith("StockChartX.min.js") ||
        filePath.endsWith("StockChartX.UI.min.js")
      ) {
        // This is obfuscated version of js files. We have to use a bit different inject template.
        return `<script src="${filePath}" charset="iso-8859-1"></script>`;
      }

      return inject.transform(filePath, file, index, length, targetFile);
    }
  };

  return gulp
    .src("src/page-templates/*.html")
    .pipe(inject(series(streams), injectArgs))
    .pipe(gulp.dest("src/"));
});

/**
 * Compiles test configuration file from template.
 */
gulp.task("compile:tests-config", () => {
  const { js } = project.configuration.debug;
  const fileGroups = [js.external, js.scx.core, js.scx.ui, js.scx.external];
  const files = [].concat(...fileGroups);
  const streams = files.map(filePath =>
    gulp.src("gulpfile.js", { read: false }).pipe(rename(filePath))
  );

  const injectArgs = {
    addRootSlash: false,
    removeTags: true,
    starttag: "# inject:js",
    endtag: "# endinject",
    transform: filePath => `    - ${filePath}`
  };

  return gulp
    .src("templates/StockChartXTests.jstd")
    .pipe(inject(series(streams), injectArgs))
    .pipe(gulp.dest("./"));
});

/**
 * Clean and recompile everything
 */
gulp.task("compile:rebuild", callback =>
  runSequence("clean", "compile", callback)
);

/**
 * Compiles everything
 */
gulp.task("compile", [
  "compile:sass",
  "compile:typescript",
  "compile:typescript-definitions",
  "compile:jsdoc",
  "compile:html",
  "compile:tests",
  "compile:tests-config"
]);
