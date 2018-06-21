import snakeCase from "lodash/snakeCase";

const CAMEL_CASE_REGEX = /^[a-z0-9]+([A-Z][a-z0-9]*)*$/;

const fieldNameDenormalizer = name =>
  CAMEL_CASE_REGEX.test(name) ? snakeCase(name) : name;

export default fieldNameDenormalizer;
