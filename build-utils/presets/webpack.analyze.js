const WebpackBundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = () => ({
  plugins: [new WebpackBundleAnalyzerPlugin()]
});
