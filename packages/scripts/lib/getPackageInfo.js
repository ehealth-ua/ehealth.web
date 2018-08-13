const path = require("path");
const { existsSync } = require("fs");

const SCOPED_PACKAGE_NAME_REGEX = /^@([\w-]+)\/([\w-]+)$/;

const getPackageInfo = () => {
  const packageJsonPath = path.join(process.cwd(), "package.json");

  if (!existsSync(packageJsonPath))
    throw new Error("Unable to find package.json file");

  const { name, version } = require(packageJsonPath);

  if (!name || !version)
    throw new Error("Unable to parse package name or version");

  const [_match, scope, unscopedName] = SCOPED_PACKAGE_NAME_REGEX.exec(name);
  const deploymentInfo = getDeploymentInfo(scope, unscopedName);

  return { name, scope, unscopedName, version, ...deploymentInfo };
};

const getDeploymentInfo = (scope, unscopedName) => {
  const dockerfilePath = path.join(process.cwd(), "Dockerfile");

  if (existsSync(dockerfilePath)) {
    const imageName = `${scope}.${unscopedName}-web`;
    const chartName = [...unscopedName.split("-"), "web"].join("_");

    return { dockerfilePath, imageName, chartName };
  } else {
    return {};
  }
};

module.exports = getPackageInfo;
