module.exports = {
  globalSetup: "jest-environment-puppeteer/setup",
  globalTeardown: "jest-environment-puppeteer/teardown",
  projects: [
    {
      displayName: "unit",
      testMatch: ["**/__tests__/!e2e/**/*.js?(x)", "**/?(*.)(spec|test).js?(x)"]
    },
    {
      displayName: "e2e",
      testMatch: ["**/__tests__/e2e/**/*.js?(x)"],
      testEnvironment: "jest-environment-puppeteer",
      setupTestFrameworkScriptFile: "expect-puppeteer"
    }
  ]
};
