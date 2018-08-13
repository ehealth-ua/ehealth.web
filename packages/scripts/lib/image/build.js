const Project = require("@lerna/project");

const getPackageInfo = require("../getPackageInfo");
const exec = require("../exec");

const buildImage = () => {
  const { rootPath } = new Project();
  const { imageName, version, name, dockerfilePath } = getPackageInfo();

  if (!dockerfilePath)
    throw new Error("Unable to build image: Dockerfile not found");

  exec(`
docker build \
  --tag ${imageName}:${version} \
  --build-arg SCOPE=${name} \
  --file ${dockerfilePath} \
  ${rootPath}
`);
};

module.exports = buildImage;
