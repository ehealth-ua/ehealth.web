const cucumberPreset = require("jest-preset-cucumber");

const transforms = require("../../transforms");

module.exports = {
  setupTestFrameworkScriptFile: "expect-puppeteer",
  testEnvironment: "@ehealth/test-preset/e2e/environment",
  ...cucumberPreset,
  ...transforms
};
