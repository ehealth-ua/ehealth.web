const JSDOMEnvironment = require("jest-environment-jsdom");
const { load, unload } = require("@ehealth/env");

class UnitTestEnvironment extends JSDOMEnvironment {
  constructor(config, options) {
    super(config, options);
    this.config = config;
  }

  async setup() {
    await super.setup();
    load(this.config.rootDir, this.global.process.env);
  }

  async teardown() {
    unload(this.config.rootDir, this.global.process.env);
    await super.teardown();
  }
}

module.exports = UnitTestEnvironment;
