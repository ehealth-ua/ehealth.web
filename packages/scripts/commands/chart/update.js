const updateChart = require("../../lib/chart/update");

exports.command = "update";

exports.describe = "Update package version in the Helm chart values";

exports.builder = {};

exports.handler = argv => updateChart(argv);
