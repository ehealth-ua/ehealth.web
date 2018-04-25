module.exports =
  process.env.NODE_ENV === "test"
    ? { plugins: ["@babel/transform-modules-commonjs"] }
    : { ignore: ["**/__tests__/**/*.js?(x)", "**/?(*.)(spec|test).js?(x)"] };
