const { execSync } = require("child_process");

const exec = (cmd, env) =>
  execSync(cmd, {
    stdio: "inherit",
    env: Object.assign({}, process.env, env)
  });

module.exports = exec;
