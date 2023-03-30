# Developer documentation.

Documentation that helps developer get started with StockChartX development.

## General

- Development files and code contains under directory: `src/`.
- `build-utils/` contains environment specific build configs.

## Prerequisite

- `Node`, `npm`
- `Gulp` - globally installed via npm OR you can use npm scripts to use local gulp to execute its commands check package.json 's scripts section.
- `vscode` editor for better development experience. Application code is written in `TypeScript` and `vscode` has the best support for it.
  - `ESLint` installed globally via npm.
  - `ESLint` extension for vscode.

## Getting started

- `npm` install / `yarn` install

## Versioning

- Firstly check the version that you're having. you can find that in `package.json`.

```javascript

"version": "2.23.1"

```

Note: Don't update that manually cause there's a gulp-task to manage versioning which we'll cover further.

- Different customers will be having different versions so be sure check which version they're on and what all version's development source code we're having.

- The version number in the `package.json` gets pasted to the placeholders in the code where version number variables are defined.

- To update the version(Major.Minor.HotFix) there's a gulp task for it.
  `../gulp-tasks/version.js`

## Webpack

- Webpack is used to
  - Build release files with minification.
  - Compile TS code to JS
  - Bundle static assets, styles and JS.

### Webpack Entry points

- ./src/scripts/StockChartX

### Webpack Configs

- Root config - webpack.config.js file.
- Production - build-utils/webpack.production.js.
- Development - build-utils/webpack.development.js.

## Build Development

- Dev build can be built using 2 approaches
  - Using webpack dev server (Recommended)
    - `npm start`
  - Creating Dev Build.
    - `npm run dev`
- Development config can be found in `/build-utils/webpack.development.js`.

`Note` : Development build doesn't output declaration files. It runs ts-loader in [happyPackMode](https://github.com/TypeStrong/ts-loader#happypackmode-boolean-defaultfalse) along with [fork-ts-checker-webpack-plugin](https://github.com/Realytics/fork-ts-checker-webpack-plugin) to support faster build time.

## Build Production

- `npm run prod`
- Production config can be found in `/build-utils/webpack.production.js`.
- The above command will clean and rebuild the dist/ directory using build-utils/webpack.production.js file and webpack.config.js as base configuration.
- Serve production build using `serve dist/site`

- Main files that customers will consume from the `../dist/site/` are :

  - CSS :
    - `../dist/site/css/styles.css`
  - JS :
    - `../dist/site/scripts/StockChartX.js`

- Styles from production examples can be found in `css/site.css`.
- Here,
- These all files mentioned above may internally consume the files in `../dist/site/`
  - for ex: It uses the `html` files inside `../dist/site/views/` to render the view and `fonts` files inside `../dist/site/fonts` for fonts.
- There are few demo pages inside `../dist/site/` which can be used by customer to refer the implementation code. ex: `index.html`.

## Obfuscation Guide :

- When you run `npm run prod`, all the generated JS files are obfuscated using [webpack-obfuscator](https://github.com/javascript-obfuscator/webpack-obfuscator#readme) which uses [javascript-obfuscator](https://javascriptobfuscator.com/).

## Custom release :

- Case where we don't have the development source code version of StockChartX which customer has the build relase of it and we are suppose to update the licence detatils in their version. Updating licence details may also have adding new domains.

- Example of the above case:
  - Customer has the build release copy of StockChartX version 2.22.2 and we have the development source code of StockChartX v 2.19.
  - Here we need development source code of StockChartX version 2.22.2 to generate the build release.
  - So in order to update licence details in the customer's build copy we'll do the following.
- Process :
  - Take the build copy from the customer.
  - Copy the content of `StockChartX.min.js` file from their folder.
  - Open `../custom-release/extract-obfuscated-script.js` and
  - Paste the copied content into the placeholder as mentioned in the `extract-obfuscated-script.js`.
  - As mentioned in the `extract-obfuscated-script.js` remove the code from the last line.
  - The code to remove is `eval(i)`.
  - Then run the `extract-obfuscated-script.js` file using node in command promt
  - ex: `node extract-obfuscated-script.js`.
  - Running it would output us the extracted `StockChartX.js` file.
  - Now beautify the `StockChartX.js` file cause it'd be minified.
  - Now find the licence details registration code in it.
  - Add new licence details or modify existing licence details whatever the requirment is.
  - Test the `StockChartX.js` in the customer's version.
  - if it is working follow the further process or figure out where you messed up.
  - Now we need to obfuscate the `StockChartX.js`.
  - We've defined a custom gulp task in `../gulp-tasks/deploy.js` named `custom-release-stockchartx.min.js`
  - which will obfuscate the `StockChartX.js` and output the `StockChartX.min.js` in `../custom-release/`
  - Now test the `StockChartX.min.js` in the customer's version. It should be working.
  - Now update the version number `StockChartX.min.js` same as the customer's version.
  - Zip the file `StockChartX.min.js` and give the release to the customer.
  - The End.

### Indicators

- `../src/scripts/TASdk/TASdk.ts` contains indicators defination and config code.
