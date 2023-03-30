/* eslint-disable global-require */

const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const filesTobeCopied = require("./build-utils/filesTobeCopied");
const path = require("path");
const loadPresets = require("./build-utils/presets/loadPresets");
const webpackMerge = require("webpack-merge");
const modeConfig = env => require(`./build-utils/webpack.${env}`)(env);
const globalExports = require("./build-utils/globalExports");
const { srcPath } = require("./build-utils/utils");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const pathsToClean = ["dist"];

module.exports = ({ mode, presets } = { mode: "production", presets: [] }) =>
  webpackMerge(
    {
      mode,
      resolve: {
        alias: {
          src: path.resolve(__dirname, `src`),
          StockChartX: srcPath("scripts/StockChartX/"),
          "StockChartX.UI": srcPath("scripts/StockChartX.UI/"),
          "StockChartX.External": srcPath("scripts/StockChartX.External/"),
          external: srcPath("scripts/external/"),
          TASdk: srcPath("scripts/TASdk/"),
          css: srcPath("css"),
          scx: srcPath("css/scx")
        },
        extensions: [".tsx", ".ts", ".js"]
      },
      entry: {
        StockChartX: "./src/scripts/index"
      },
      module: {
        rules: [
          {
            test: /\.(scss|css)$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
          },
          {
            test: /\.(woff|woff2|eot|ttf|svg)$/,
            loader: "file-loader",
            options: {
              context: path.resolve(__dirname, "./src"),
              name: "[path][name].[ext]",
              publicPath: "../"
            }
          },
          {
            test: /\.(png|gif|cur)$/,
            loader: "file-loader",
            options: {
              context: path.resolve(__dirname, "./src"),
              name: "[path][name].[ext]",
              publicPath: "../"
            }
          },
          ...globalExports
        ]
      },
      plugins: [
        new CleanWebpackPlugin(pathsToClean),
        ...filesTobeCopied,
        new MiniCssExtractPlugin({
          filename: "css/styles.css",
          chunkFilename: "[id].css",
          path: path.resolve(__dirname, "dist")
        }),
        new webpack.ProgressPlugin()
      ],
      output: {
        filename: "scripts/[name].js",
        path: path.resolve(__dirname, "dist/site")
      }
    },
    modeConfig(mode),
    loadPresets({ mode, presets })
  );
