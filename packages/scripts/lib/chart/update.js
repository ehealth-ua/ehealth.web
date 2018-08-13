const path = require("path");
const { existsSync, readFileSync, writeFileSync } = require("fs");
const Project = require("@lerna/project");
const YAWN = require("yawn-yaml/cjs");

const getPackageInfo = require("../getPackageInfo");

const updateChart = ({ chart }) => {
  const { rootPath } = new Project();
  const { chartName, version } = getPackageInfo();

  if (!chartName) return;

  const valuesPath = path.join(rootPath, "charts", chart, "values-dev.yaml");

  if (!existsSync(valuesPath))
    throw new Error("Unable to update chart: values file not found");

  const yawn = new YAWN(readFileSync(valuesPath, { encoding: "utf8" }));
  const values = yawn.json;

  values[`image_${chartName}`]["tag"] = `"${version}"`;

  yawn.json = values;
  writeFileSync(valuesPath, yawn.yaml);
};

module.exports = updateChart;
