module.exports = [
  {
    test: require.resolve("jquery"),
    use: [
      {
        loader: "expose-loader",
        options: "jQuery"
      },
      {
        loader: "expose-loader",
        options: "$"
      }
    ]
  },
  {
    test: require.resolve("moment"),
    use: [
      {
        loader: "expose-loader",
        options: "moment"
      }
    ]
  },
  {
    test: require.resolve("i18next-xhr-backend"),
    use: [
      {
        loader: "expose-loader",
        options: "i18nextXHRBackend"
      }
    ]
  },
  {
    test: require.resolve("jquery-i18next"),
    use: [
      {
        loader: "expose-loader",
        options: "jqueryI18next"
      }
    ]
  }
];
