exports.command = "chart <command>";

exports.describe = "Update package versions and deploy Helm charts";

exports.builder = yargs =>
  yargs
    .commandDir("chart")
    .option("chart", { description: "Name of the chart", default: "fe" })
    .env("HELM");

exports.handler = () => {};
