const deployChart = require("../../lib/chart/deploy");

exports.command = "deploy";

exports.describe = "Deploy Helm chart";

exports.builder = {};

exports.handler = argv => deployChart(argv);
