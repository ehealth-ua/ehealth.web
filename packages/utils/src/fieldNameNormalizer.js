import camelCase from "lodash/camelCase";

const SNAKE_CASE_REGEX = /^[a-z0-9]+(_[a-z0-9]+)*$/;

const fieldNameNormalizer = name =>
  SNAKE_CASE_REGEX.test(name) ? camelCase(name) : name;

export default fieldNameNormalizer;
