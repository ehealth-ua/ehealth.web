const transforms = require("../transforms");

module.exports = {
  setupFiles: ["@ehealth/test-preset/polyfills"],
  testEnvironment: "@ehealth/test-preset/unit/environment",
  testURL: "http://localhost", // temporary work around facebook/jest#6766
  ...transforms
};
