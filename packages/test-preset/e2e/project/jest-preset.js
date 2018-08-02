const cucumberPreset = require("jest-preset-cucumber");

module.exports = {
  setupTestFrameworkScriptFile: "expect-puppeteer",
  testEnvironment: "@ehealth/test-preset/e2e/environment",
  ...cucumberPreset
};
