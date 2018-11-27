const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(proxy("/polyfill?(.min).js", { target: "http://localhost:4001/" }));
};
