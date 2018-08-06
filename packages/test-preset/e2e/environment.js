const path = require("path");
const PuppeteerEnvironment = require("jest-environment-puppeteer");
const { load, unload } = require("@ehealth/env");

class E2eEnvironment extends PuppeteerEnvironment {
  constructor(config, options) {
    super(config, options);
    this.config = config;
  }

  async setup() {
    await super.setup();
    load(this.projectRoot, this.global.process.env);
  }

  async teardown() {
    unload(this.projectRoot, this.global.process.env);
    await super.teardown();
  }

  get projectRoot() {
    return path.resolve(this.config.rootDir, "..");
  }
}

module.exports = E2eEnvironment;
