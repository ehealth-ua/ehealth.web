module.exports = {
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      { test: /\.js$/, include: /src/, use: "babel-loader" },
      { test: /\.js$/, include: /vendor/, use: "raw-loader" }
    ]
  },
  output: {
    libraryTarget: "commonjs2"
  }
};
