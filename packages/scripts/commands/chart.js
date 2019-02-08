exports.command = "chart <command>";

exports.describe = "Update package versions and deploy Helm charts";

exports.builder = yargs =>
  yargs
    .commandDir("chart")
    .option("chart", { description: "Name of the chart", default: "fe" })
    .option("env", { description: "Deployment environment", default: "dev" })
    .env("HELM");

exports.handler = () => {};
