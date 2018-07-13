const path = require("path");
const { existsSync } = require("fs");

const { version } = require("../lerna.json");
const exec = require("../utils/exec");

const { CHART } = process.env;

const deployChart = () => {
  const chartsPath = path.resolve(__dirname, "..", "charts");
  const chartPath = path.join(chartsPath, CHART);

  if (!existsSync(chartPath)) {
    throw new Error("Cannot find chart directory");
  }

  const valuesPath = path.join(chartPath, "values-dev.yaml");

  if (!existsSync(valuesPath)) {
    throw new Error("Cannot find chart values file");
  }

  exec("helm init --upgrade --wait");

  try {
    exec(
      `helm upgrade --wait --timeout 180 --values ${valuesPath} ${CHART} ${chartPath}`
    );
  } catch (error) {
    exec(
      `helm rollback ${CHART} $(helm list --deployed fe | awk 'FNR==2 {print $2}')`
    );

    throw error;
  }

  process.chdir(chartsPath);
  exec("git add .");
  exec(`git commit -m "Bump ${CHART} to ${version}"`);
  exec("git pull");
  exec("git push");
};

module.exports = deployChart;

if (require.main === module) deployChart();
