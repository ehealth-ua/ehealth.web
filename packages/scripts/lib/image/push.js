const getPackageInfo = require("../getPackageInfo");
const exec = require("../exec");

const pushImage = ({ repository, latest }) => {
  const { imageName, version } = getPackageInfo();
  if (!imageName) throw new Error("Unable to push image: Dockerfile not found");

  const remoteName = `${repository}/${imageName}`;

  exec(`docker tag ${imageName}:${version} ${remoteName}:${version}`);
  if (latest) exec(`docker tag ${imageName}:${version} ${remoteName}:latest`);

  exec(`docker push ${remoteName}`);
};

module.exports = pushImage;
