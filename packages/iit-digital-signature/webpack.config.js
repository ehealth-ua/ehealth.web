module.exports = {
  mode: process.env.NODE_ENV,
  module: {
    rules: [{ test: /vendor/, use: "raw-loader" }]
  },
  output: {
    libraryTarget: "commonjs2"
  }
};
