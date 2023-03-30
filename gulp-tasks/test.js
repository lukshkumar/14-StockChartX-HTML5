// /*
//  *   WARNING! This program and source code is owned and licensed by
//  *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
//  *   Viewing or use this code requires your acceptance of the license
//  *   agreement found at http://www.modulusfe.com/support/license.pdf
//  *   Removal of this comment is a violation of the license agreement.
//  *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
//  */

// "use strict";

// // region Imports

// const connect = require("connect");
// const gulp = require("gulp");
// const http = require("http");
// const mocha = require("gulp-mocha-phantomjs");
// const runSequence = require("run-sequence");
// const serveStatic = require("serve-static");
// const util = require("gulp-util");
// // const phantom = require("phantom");
// const project = require("../project.json");

// // endregion

// let listener = null;

// /**
//  * Starts http server listening on random port to run tests.
//  */
// gulp.task("test:start-server", callback => {
//   const app = connect().use(serveStatic("."));
//   const server = http.createServer(app);
//   const port = 0;

//   listener = server.listen(port, () => {
//     util.log(`Server started on port: ${listener.address().port}`);
//     callback();
//   });
// });

// /**
//  * Stops http server started by task 'test:start-server'.
//  */
// gulp.task("test:stop-server", callback => {
//   if (listener) {
//     listener.close();
//     listener = null;
//   }

//   callback();
// });

// /**
//  * Runs tests by using mocha test runner.
//  */
// gulp.task("test:mocha", () => {
//   const stream = mocha({
//     reporter: "dot"
//   });
//   stream.write({
//     path: `http://localhost:${listener.address().port}/test/index.html`
//   });
//   stream.end();

//   return stream;
// });

// /**
//  * Runs tests by using PhantomJS.
//  */
// gulp.task("test:phantom", () => {
//   const fileName = "simple-chart.html",
//     path = `${project.deploy.site}/${fileName}`;

//   let pageInstance = null;

//   return phantom
//     .create()
//     .then(instance => {
//       pageInstance = instance;

//       return instance.createPage();
//     })
//     .then(page => {
//       page.on("onError", error => {
//         throw new Error(`An error has been thrown on the page: ${error}`);
//       });

//       return page.open(path);
//     })
//     .then(status => {
//       if (status !== "success") throw new Error("Can't open file!");
//     })
//     .then(() => pageInstance.exit())
//     .catch(error => {
//       pageInstance.exit(1); // eslint-disable-line no-magic-numbers
//       throw error;
//     });
// });

// /**
//  * Compiles and runs tests.
//  */
// gulp.task("test", callback => {
//   runSequence("test:start-server", "test:mocha", "test:stop-server", error => {
//     if (error) return runSequence("test:stop-server", callback);

//     return callback();
//   });
// });
const { runner } = require("mocha-headless-chrome");

const options = {
  file: "../test/index.html", // test page path
  reporter: "dot", // mocha reporter name
  width: 800, // viewport width
  height: 600, // viewport height
  timeout: 120000, // timeout in ms
  executablePath: "/usr/bin/chrome", // chrome executable path
  visible: true, // show chrome window
  args: ["no-sandbox"] // chrome arguments
};

runner(options).then(result => {
  let json = JSON.stringify(result);
  console.log(json);
});
