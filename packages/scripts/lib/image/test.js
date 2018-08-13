const path = require("path");
const { existsSync } = require("fs");

const getPackageInfo = require("../getPackageInfo");
const exec = require("../exec");

const DOCKER_SOCKET_PATH = "/var/run/docker.sock";
const TEST_CONFIG_NAME = "image_test_config.yaml";
const TEST_RUNTIME_IMAGE = "gcr.io/gcp-runtimes/container-structure-test";
const TEST_RUNTIME_VERSION = "v1.0.0";

const testImage = () => {
  const { imageName, version } = getPackageInfo();

  if (!imageName) throw new Error("Unable to test image: Dockerfile not found");

  const testConfigPath = path.join(process.cwd(), TEST_CONFIG_NAME);

  if (!existsSync(testConfigPath))
    throw new Error("Unable to test image: test config file not found");

  exec(`
docker run \
  --volume ${DOCKER_SOCKET_PATH}:${DOCKER_SOCKET_PATH} \
  --volume ${testConfigPath}:/test_config.yaml \
  ${TEST_RUNTIME_IMAGE}:${TEST_RUNTIME_VERSION} \
    test --image ${imageName}:${version} --config /test_config.yaml
`);
};

module.exports = testImage;
