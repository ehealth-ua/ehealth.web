const testImage = require("../../lib/image/test");

exports.command = "test";

exports.describe = "Test the package Docker image";

exports.builder = {};

exports.handler = argv => testImage(argv);
