const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const expand = require("./expand");

const { NODE_ENV } = process.env;

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  `.env.${NODE_ENV}.local`,
  `.env.${NODE_ENV}`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== "test" && ".env.local",
  ".env"
].filter(Boolean);

const parse = (basePath, environment) =>
  dotenvFiles.reduce((config, filename) => {
    const dotenvPath = path.resolve(basePath, filename);

    if (fs.existsSync(dotenvPath)) {
      const raw = fs.readFileSync(dotenvPath, { encoding: "utf8" });
      const parsed = dotenv.parse(raw);
      const expanded = expand(parsed, environment);

      return { ...expanded, ...config };
    }

    return config;
  }, {});

module.exports = parse;
