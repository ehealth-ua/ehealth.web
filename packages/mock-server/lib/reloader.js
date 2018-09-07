const path = require("path");
const chokidar = require("chokidar");

const { createApplication } = require("./app");

const schemaPath = path.resolve(__dirname, "..", "__schema__");

const runSchemaReloader = ({ server, app }) => {
  const watcher = chokidar.watch(`${schemaPath}/**/*.graphql`);

  watcher.on("change", filePath => {
    console.log(`Changed ${path.relative(schemaPath, filePath)}`);

    try {
      server.removeListener("request", app);

      app = createApplication();
      server.on("request", app);
    } catch (error) {
      console.error(error);
    }
  });

  return watcher;
};

module.exports = { runSchemaReloader };
