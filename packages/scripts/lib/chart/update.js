const path = require("path");
const { existsSync, readFileSync, writeFileSync } = require("fs");
const Project = require("@lerna/project");
const YAWN = require("yawn-yaml/cjs");

const getPackageInfo = require("../getPackageInfo");

const updateChart = ({ chart, env }) => {
  const { rootPath } = new Project();
  const { chartName, version } = getPackageInfo();

  if (!chartName) return;

  const valuesPath = path.join(rootPath, "charts", chart, `values-${env}.yaml`);

  if (!existsSync(valuesPath))
    throw new Error(
      `Unable to update chart "${chart}": values file for environment "${env}" not found`
    );

  const yawn = new YAWN(readFileSync(valuesPath, { encoding: "utf8" }));
  const values = yawn.json;

  values[`image_${chartName}`]["tag"] = `"${version}"`;

  yawn.json = values;
  writeFileSync(valuesPath, yawn.yaml);
};

module.exports = updateChart;
