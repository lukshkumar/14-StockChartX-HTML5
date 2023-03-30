const { execSync, exec } = require("child_process");
const path = require("path");
const CJSBundle = path.resolve(__dirname, "../lib");
const ESBundle = path.resolve(__dirname, "../lib-esm");
const srcDir = path.resolve(__dirname, "../src");
const distDir = path.resolve(__dirname, "../dist");

const nonTSAndStaticAssetsCopyCommands = bundle => [
  `cp -R ${srcDir}/scripts/StockChartX.External ${bundle}/src/scripts`,
  `cp -R ${srcDir}/scripts/external ${bundle}/src/scripts`,
  `rsync -r ${distDir}/site/ ${bundle}/src/`
];
// Removes lib and lib-esm
execSync(`sudo rm -rf ${CJSBundle} ${ESBundle}`);
execSync(`npm run dev`);

// Generate CJS module compatible build, refer tsconfig.json
exec(`tsc --outDir ${CJSBundle}/src/scripts`, (err, stdout) => {
  if (!err) {
    nonTSAndStaticAssetsCopyCommands(CJSBundle).forEach(c => {
      exec(c, (err, stdout) => {
        if (!err) {
          console.log("completed ", c);
        }
        console.log(stdout);
      });
    });
  }
  console.log(stdout);
});

// Generate ES module compatible build, refer tsconfig.json
exec(`tsc -m es6 --outDir ${ESBundle}/src/scripts`, err => {
  if (!err) {
    nonTSAndStaticAssetsCopyCommands(ESBundle).forEach(c => {
      exec(c, (err, stdout) => {
        console.log(stdout);
      });
    });
  }
});
