// This source code was extracted from react-scripts/config/env

const fs = require("fs");
const path = require("path");

const expand = require("dotenv-expand");
const { config } = require("dotenv");

if (process.env.NODE_ENV === undefined) {
  process.env.NODE_ENV = "development";
}

const { NODE_ENV } = process.env;
const dotenvPath = path.resolve(process.cwd(), ".env");

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  `${dotenvPath}.${NODE_ENV}.local`,
  `${dotenvPath}.${NODE_ENV}`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== "test" && `${dotenvPath}.local`,
  dotenvPath
].filter(Boolean);

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
dotenvFiles.forEach(path => {
  if (fs.existsSync(path)) {
    expand(config({ path }));
  }
});
