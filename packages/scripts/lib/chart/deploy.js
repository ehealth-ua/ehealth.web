const path = require("path");
const { existsSync } = require("fs");
const Project = require("@lerna/project");

const exec = require("../exec");

const deployChart = ({ chart, env }) => {
  const { config, rootPath } = new Project();

  const chartsPath = path.join(rootPath, "charts");
  const chartPath = path.join(chartsPath, chart);

  if (!existsSync(chartPath))
    throw new Error(
      `Unable to deploy chart "${chart}": chart directory not found`
    );

  const valuesPath = path.join(chartPath, `values-${env}.yaml`);

  if (!existsSync(valuesPath))
    throw new Error(
      `Unable to deploy chart "${chart}": values file for environment "${env}" not found`
    );

  exec("helm init --upgrade --wait");

  try {
    exec(
      `helm upgrade --wait --timeout 180 --values ${valuesPath} ${chart} ${chartPath}`
    );
  } catch (error) {
    exec(
      `helm rollback ${chart} $(helm list --deployed fe | awk 'FNR==2 {print $2}')`
    );

    throw error;
  }

  process.chdir(chartsPath);
  exec("git add .");
  exec(`git commit -m "Bump ${chart} to ${config.version}"`);
  exec("git pull");
  exec("git push");
};

module.exports = deployChart;
