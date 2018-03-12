const getPackageInfo = require("../utils/getPackageInfo");
const exec = require("../utils/exec");

const {
  DOCKER_HUB_ACCOUNT,
  TRAVIS_BRANCH,
  TRUNK_BRANCH,
  LATEST = TRAVIS_BRANCH && TRUNK_BRANCH && TRAVIS_BRANCH === TRUNK_BRANCH
} = process.env;

const pushImage = () => {
  const { imageName, version } = getPackageInfo();
  if (!imageName) return;

  const remoteName = `${DOCKER_HUB_ACCOUNT}/${imageName}`;

  exec(`docker tag ${imageName}:${version} ${remoteName}:${version}`);
  if (LATEST) exec(`docker tag ${imageName}:${version} ${remoteName}:latest`);

  exec(`docker push ${remoteName}`);
};

module.exports = pushImage;

if (require.main === module) pushImage();
