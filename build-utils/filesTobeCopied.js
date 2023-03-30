const CopyWebpackPlugin = require("copy-webpack-plugin");
const filesTobeCopied = [
  new CopyWebpackPlugin([
    {
      from: "./src/data/**",
      to: "data/[name].[ext]"
    }
  ]),
  new CopyWebpackPlugin([
    {
      from: "./src/view/*.html",
      to: "view/[name].[ext]"
    }
  ]),
  new CopyWebpackPlugin([
    {
      from: "./src/locales/*.json",
      to: "locales/[name].[ext]"
    }
  ]),
  new CopyWebpackPlugin([
    {
      from: "./src/css/site.css",
      to: "css/[name].[ext]"
    }
  ]),
  new CopyWebpackPlugin([
    {
      from: "./src/img/scx-logo-*.png",
      to: "img/[name].[ext]"
    }
  ]),
  new CopyWebpackPlugin([
    {
      from: "./src/scripts/*.js",
      to: "scripts/[name].[ext]"
    }
  ])
];
module.exports = filesTobeCopied;
