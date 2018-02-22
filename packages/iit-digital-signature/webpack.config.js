const { NODE_ENV = "development" } = process.env;

module.exports = {
  mode: NODE_ENV,
  module: {
    rules: [
      { test: /vendor/, use: "raw-loader" }
    ]
  },
  output: {
    libraryTarget: "commonjs2"
  }
};
