const getPackageInfo = require("../utils/getPackageInfo");
const exec = require("../utils/exec");

const testImage = require("./testImage");

const { LERNA_ROOT_PATH } = process.env;

const buildImage = () => {
  const [_node, _file, ...args] = process.argv;

  const { imageName, version, name, dockerfilePath } = getPackageInfo();
  if (!imageName) return;

  exec(`
docker build \
  --tag ${imageName}:${version} \
  --build-arg SCOPE=${name} \
  --file ${dockerfilePath} \
  ${LERNA_ROOT_PATH}
`);

  if (args.includes("--test")) testImage();
};

module.exports = buildImage;

if (require.main === module) buildImage();
