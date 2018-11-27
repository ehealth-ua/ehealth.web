const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(proxy("/auth", { target: "http://localhost:4000/" }));

  app.use(
    proxy("/polyfill?(.min).js", {
      target: "http://localhost:4001/"
    })
  );

  app.use(
    proxy(["/api", "/reports"], {
      target: "http://api.dev.asclepius.com.ua/"
    })
  );
};
