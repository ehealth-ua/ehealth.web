module.exports = {
  globalSetup: "jest-environment-puppeteer/setup",
  globalTeardown: "jest-environment-puppeteer/teardown",
  projects: [
    {
      displayName: "unit",
      testRegex: "(/__tests__/(?!e2e/).*|(\\.|/)(test|spec))\\.jsx?$"
    },
    {
      displayName: "e2e",
      testRegex: "/__tests__/e2e/.*\\.jsx?$",
      testEnvironment: "jest-environment-puppeteer",
      setupTestFrameworkScriptFile: "expect-puppeteer"
    }
  ]
};
