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

const concat = require("gulp-concat");
const cssnano = require("gulp-cssnano");
const del = require("del");
const git = require("gulp-git");
const gulp = require("gulp");
const gulpif = require("gulp-if");
const lazypipe = require("lazypipe");
const merge = require("merge-stream");
const preprocess = require("gulp-preprocess");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const uglify = require("gulp-uglify");
const util = require("gulp-util");

const buildEnv = require("./buildEnvironment.js");
const helper = require("./helper.js");

const project = require("../project.json");
const javascriptObfuscator = require("gulp-javascript-obfuscator");

const clientIdTemplate = "INSERT MODULUS CLIENT ID HERE";
const domainTemplate = "INSERT DOMAIN NAME HERE";
const vrCodeTemplate = "INSERT VR CODE HERE";
const expirationTemplate = '"INSERT EXPIRATION DATE HERE"';
const trustedDomainsTemplate = "INSERT TRUSTED DOMAINS HERE";

// endregion

/**
 * Copies *.html into deploy folder.
 * @returns {NodeJS.ReadWriteStream} The stream.
 */
function deployHtml() {
  const args = {
    context: {
      SCX_LICENSE: buildEnv.license.kind
    }
  };

  return gulp
    .src(["src/*.html", "src/view/*"], { base: "src" })
    .pipe(preprocess(args))
    .pipe(gulp.dest(project.deploy.site));
}

/**
 * Copies documentation into deploy folder.
 * @returns {NodeJS.ReadWriteStream} The stream.
 */
function deployDocs() {
  return gulp.src("doc/FAQ.pdf").pipe(gulp.dest(project.deploy.root));
}

/**
 * Copies fonts, images and other resources into deploy folder.
 * @returns {NodeJS.ReadWriteStream[]} The stream.
 */
function deployResources() {
  const files = ["src/fonts/**", "src/img/**", "src/data/*", "src/locales/*"];

  return gulp.src(files, { base: "src" }).pipe(gulp.dest(project.deploy.site));
}

/**
 * Copies css into deploy folder.
 * @returns {NodeJS.ReadWriteStream[]} The stream.
 */
function deployCss() {
  return [
    gulp
      .src(
        [
          "src/css/site.css",
          "src/css/multi-charts.css",
          "src/css/two-charts.css",
          "src/css/cdn/**/*.*"
        ],
        { base: "src/css" }
      )
      .pipe(gulp.dest(project.deploy.css)),

    gulp
      .src(project.configuration.all.css.scx.external)
      .pipe(concat("StockChartX.External.min.css"))
      .pipe(cssnano({ safe: true }))
      .pipe(gulp.dest(project.deploy.css)),

    gulp
      .src(["src/css/StockChartX.css", "src/css/StockChartX.UI.css"])
      .pipe(cssnano({ safe: true }))
      .pipe(rename({ suffix: ".min" }))
      .pipe(gulp.dest(project.deploy.css))
  ];
}

/**
 * Copies javascript files into deploy folder.
 * @returns {NodeJS.ReadWriteStream[]} The stream.
 */
function deployJs() {
  const preprocessArgs = {
    context: {
      SCX_LICENSE: buildEnv.license.kind
    }
  };

  return [
    gulp
      .src(["src/scripts/*.js", "!src/scripts/references.js"])
      .pipe(preprocess(preprocessArgs))
      .pipe(gulp.dest(project.deploy.js)),

    gulp.src("src/scripts/external/*.js").pipe(gulp.dest(project.deploy.js)),

    gulp
      .src("src/scripts/external/cdn/*.js", { base: "src/scripts/external" })
      .pipe(gulp.dest(project.deploy.js)),
    gulp
      .src(["src/scripts/dataServer/*.js"])
      .pipe(gulp.dest(`${project.deploy.js}/dataServer`))
  ];
}

/**
 * Converts days count number to JavaScript date creation string.
 * @param {number} days The days count.
 * @returns {string} JavaScript date creation string.
 */
function daysToDateConstruct(days) {
  // eslint-disable-next-line no-magic-numbers
  if (days <= 0) return "null";

  const currDate = new Date(),
    currYear = currDate.getFullYear(),
    currMonth = currDate.getMonth(),
    currDay = currDate.getDate();

  return `new Date(${currYear}, ${currMonth}, ${currDay + days})`;
}

/**
 * Injects license information into the stream.
 * @returns {NodeJS.ReadWriteStream} The stream.
 */
function injectLicense() {
  const { license } = buildEnv;

  return lazypipe()
    .pipe(() =>
      gulpif(license.client != null, replace(clientIdTemplate, license.client))
    )
    .pipe(() =>
      gulpif(license.domain != null, replace(domainTemplate, license.domain))
    )
    .pipe(() =>
      gulpif(license.vrcode != null, replace(vrCodeTemplate, license.vrcode))
    )
    .pipe(() =>
      replace(
        expirationTemplate,
        (license.days && daysToDateConstruct(license.days)) || '""'
      )
    )
    .pipe(() => replace(trustedDomainsTemplate, license.trustedDomains || ""));
}

/**
 * Creates StockChartX.*.js files in deploy folder.
 * @returns {NodeJS.ReadWriteStream[]} The stream.
 */
function deployScx() {
  const preprocessArgs = {
    context: {
      SCX_LICENSE: buildEnv.license.kind
    }
  };
  const processScxJs = lazypipe()
    .pipe(() => preprocess(preprocessArgs))
    .pipe(injectLicense())
    // .pipe(uglify)
    // .pipe(javascriptObfuscator)
    // .pipe(helper.obfuscate)
    .pipe(helper.packageHeader)
    .pipe(() => gulp.dest(project.deploy.js));

  return [
    gulp
      .src(project.configuration.debug.js.scx.core)
      .pipe(concat("StockChartX.min.js"))
      .pipe(processScxJs()),

    gulp
      .src(project.configuration.debug.js.scx.ui)
      .pipe(concat("StockChartX.UI.min.js"))
      .pipe(processScxJs()),

    gulp
      .src(project.configuration.debug.js.scx.external)
      .pipe(concat("StockChartX.External.min.js"))
      // .pipe(uglify())
      .pipe(gulp.dest(project.deploy.js))
  ];
}

/**
 * Setups repository.
 * @param {Function} callback The callback function.
 * @returns {void}
 */
function setupRepository(callback) {
  const dest = project.deploy.root;

  const gitExec = execArgs =>
    new Promise((resolve, reject) => {
      git.exec(
        {
          args: execArgs,
          cwd: dest,
          quiet: true
        },
        userError => {
          if (userError) reject(userError);
          else resolve();
        }
      );
    });
  const gitUser = () => gitExec("config user.name Modulus");
  const gitEmail = () => gitExec("config user.email developer@modulusfe.com");
  const gitCommit = () =>
    gulp
      .src([`${dest}/*`, `!${dest}/.git`], { dot: true })
      .pipe(
        git.add({
          args: "-f --all",
          cwd: project.deploy.root
        })
      )
      .pipe(
        git.commit("Initial commit", {
          cwd: dest,
          quiet: true
        })
      )
      .on("end", () => callback());

  const gitInit = () => {
    git.init({ cwd: dest }, error => {
      if (error) {
        callback(error);

        return;
      }

      Promise.all([gitUser(), gitEmail()])
        .then(() => gitCommit())
        .catch(configError => callback(configError));
    });
  };

  del(`${dest}/.git`)
    .then(() => gitInit())
    .catch(error => callback(error));
}

/**
 * Copies source code files into deploy folder.
 */
gulp.task("deploy:source-code", ["clean:deploy"], callback => {
  const { license } = buildEnv;

  if (license.domain) {
    let message = `Building source code package for the domain "${
      license.domain
    }".`;
    if (license.days > 0)
      // eslint-disable-line no-magic-numbers
      message += ` Expires after ${license.days} day(s).`;
    util.log(message);
  }

  // noinspection JSUnresolvedFunction
  const cloneOptions = {
    args: project.deploy.root,
    quiet: true
  };
  git.clone(".", cloneOptions, () =>
    gulp
      .src(`${project.deploy.root}/src/scripts/StockChartX/License.ts`)
      .pipe(injectLicense()())
      .pipe(gulp.dest(`${project.deploy.root}/src/scripts/StockChartX`))
      .on("end", () => setupRepository(callback))
  );
});

gulp.task("deploy", ["compile:rebuild"], () =>
  merge(
    deployDocs(),
    deployHtml(),
    deployResources(),
    deployCss(),
    deployJs(),
    deployScx()
  )
);
