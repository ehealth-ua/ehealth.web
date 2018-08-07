const buildEnv = process.env;
const { env: runtimeEnv } = global.process || {};

module.exports = { ...buildEnv, ...runtimeEnv };
