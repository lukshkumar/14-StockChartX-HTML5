module.exports = {
  mode: "development",
  entry: {
    testCases: "./test/index.ts"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  devtool: "source-map",
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
  output: {
    filename: "[name].js",
    path: __dirname
  }
};
