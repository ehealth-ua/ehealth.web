const pushImage = require("../../lib/image/push");

exports.command = "push";

exports.describe = "Push the package Docker image to the registry";

exports.builder = yargs =>
  yargs
    .option("repository", {
      alias: ["repo", "r"],
      description: "Name of the Docker registry repository",
      demandOption: true,
      type: "string"
    })
    .option("latest", {
      alias: "l",
      description: 'Publish image with "latest" tag',
      type: "boolean"
    })
    .env("DOCKER");

exports.handler = argv => pushImage(argv);
