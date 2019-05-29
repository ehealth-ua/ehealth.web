const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(proxy("/polyfill?(.min).js", { target: "http://localhost:4001/" }));

  app.use(proxy("/api", { target: "http://api.dev.edenlab.com.ua/" }));
  app.use(proxy("/auth", { target: "http://api.dev.edenlab.com.ua/" }));
  app.use(proxy("/oauth", { target: "http://api.dev.edenlab.com.ua/" }));
  app.use(proxy("/admin", { target: "http://api.dev.edenlab.com.ua/" }));
  app.use(proxy("/user", { target: "http://api.dev.edenlab.com.ua/" }));
  app.use(proxy("/users", { target: "http://api.dev.edenlab.com.ua/" }));
};
