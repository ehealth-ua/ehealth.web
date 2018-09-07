require("@ehealth/env/load");
const http = require("http");

const { NODE_ENV, PORT } = process.env;

const { createApplication } = require("./lib/app");
const { runSchemaReloader } = require("./lib/reloader");

let app = createApplication();
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Listening on http://0.0.0.0:${PORT}`);

  if (NODE_ENV === "development") runSchemaReloader({ server, app });
});
