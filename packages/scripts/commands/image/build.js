const buildImage = require("../../lib/image/build");

exports.command = "build";

exports.describe = "Build Docker image for the package";

exports.builder = {};

exports.handler = argv => buildImage(argv);
