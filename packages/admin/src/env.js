const buildEnv = process.env;
const { env: runtimeEnv } = global.process || {};

export default { ...buildEnv, ...runtimeEnv };
