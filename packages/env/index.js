// This source code are based on react-scripts/config/env

const fromPairs = require("lodash/fromPairs");

const parse = require("./lib/parse");

if (process.env.NODE_ENV === undefined) {
  process.env.NODE_ENV = "development";
}

const configRegistry = new Map();

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
const load = (basePath, environment) => {
  const parsedVars = parse(basePath, environment);

  const safeVars = fromPairs(
    Object.entries(parsedVars).filter(
      ([key]) => !Object.keys(environment).includes(key)
    )
  );

  Object.assign(environment, safeVars);

  configRegistry.set(basePath, Object.keys(safeVars));
};

const unload = (basePath, environment) => {
  const loadedVars = configRegistry.get(basePath);

  if (!loadedVars) return;

  loadedVars.forEach(key => {
    delete environment[key];
  });
};

module.exports = { load, unload };
