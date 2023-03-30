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

const del = require("del");
const git = require("gulp-git");
const gulp = require("gulp");

const project = require("../project.json");

// endregion

/**
 * Cleans source directory Removes all unnecessary files and directories. It omits node_modules and deploy directories.
 */
gulp.task("clean:source", callback => {
  const gitArgs = {
    args: "-dfxq -e node_modules -e deploy"
  };

  // noinspection JSUnresolvedFunction
  return git.clean(gitArgs, error => callback(error));
});

/**
 * Cleans deploy directory
 */
gulp.task("clean:deploy", () => del(`${project.deploy.root}/**`));

/**
 * Cleans source and deploy directories. Be careful! It will remove new uncommitted files.
 */
gulp.task("clean", ["clean:source", "clean:deploy"]);
