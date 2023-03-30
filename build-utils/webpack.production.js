// const CompressionWebpackPlugin = require("compression-webpack-plugin");
const JavaScriptObfuscator = require("webpack-obfuscator");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackExcludeAssetsPlugin = require("html-webpack-exclude-assets-plugin");
const { srcPath, pageTemplatesIncluder } = require("./utils");
const OptimizeCssnanoPlugin = require("@intervolga/optimize-cssnano-plugin");
const DeclarationBundlerPlugin = require("declaration-bundler-webpack-plugin");
const { licenseComment } = require("./licenseInfo");

/*eslint-disable */
let buggyFunc = DeclarationBundlerPlugin.prototype.generateCombinedDeclaration;
DeclarationBundlerPlugin.prototype.generateCombinedDeclaration = function(
  declarationFiles
) {
  for (var fileName in declarationFiles) {
    let declarationFile = declarationFiles[fileName];
    declarationFile._value = declarationFile._value || declarationFile.source();
  }
  return buggyFunc.call(this, declarationFiles);
};

module.exports = () => ({
  devtool: "none",
  // New Examples entry point
  entry: {
    compareSymbols: "./demo/compare-symbols-crypto.js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader"
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new DeclarationBundlerPlugin({
      moduleName: "StockChartX",
      out: "../TypeScriptDefinitions/StockChartX.d.ts"
    }),
    new HtmlWebpackPlugin({
      excludeAssets: [/.*.js/],
      template: srcPath("page-templates/index.html")
    }),
    ...pageTemplatesIncluder(),
    new CopyWebpackPlugin([
      {
        from: "./src/css/demo/*.css",
        to: "css/[name].[ext]"
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: "./LibraryDocumentation/FAQ.pdf",
        to: "../[name].[ext]"
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: "./src/scripts/external/typescript/*.d.ts",
        to: "../TypeScriptDefinitions/external/[name].[ext]"
      }
    ]),
    new OptimizeCssnanoPlugin({
      cssnanoOptions: {
        preset: [
          "default",
          {
            discardComments: {
              removeAll: true
            }
          }
        ]
      }
    }),
    new HtmlWebpackExcludeAssetsPlugin(),
    new JavaScriptObfuscator(),
    new webpack.BannerPlugin(licenseComment),
  ]
});
