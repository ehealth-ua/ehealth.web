const path = require("path");
const { existsSync, readFileSync, writeFileSync } = require("fs");
const YAWN = require("yawn-yaml/cjs");

const getPackageInfo = require("../utils/getPackageInfo");

const { LERNA_ROOT_PATH, CHART } = process.env;

const updateChart = () => {
  const { chartName, version } = getPackageInfo();
  if (!chartName) return;

  const valuesPath = path.join(LERNA_ROOT_PATH, "charts", CHART, "values.yaml");

  if (!existsSync(valuesPath)) {
    throw new Error("Cannot find chart values file");
  }

  const yawn = new YAWN(readFileSync(valuesPath, { encoding: "utf8" }));
  const values = yawn.json;

  values[`image_${chartName}`]["tag"] = `"${version}"`;

  yawn.json = values;
  writeFileSync(valuesPath, yawn.yaml);
};

module.exports = updateChart;

if (require.main === module) updateChart();
