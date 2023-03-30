const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const { srcPath } = require("./utils");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackIncludeAssetsPlugin = require("html-webpack-include-assets-plugin");
const { licenseComment } = require("./licenseInfo");
module.exports = () => ({
  devtool: "cheap-module-eval-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              happyPackMode: true,
              transpileOnly: true
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new webpack.BannerPlugin(licenseComment),
    new HtmlWebpackPlugin({
      inject: true,
      template: srcPath("page-templates/dist-index.html")
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: ["scripts/chart-constructor.js", "scripts/simple-chart.js"],
      append: true
    })
  ]
});
