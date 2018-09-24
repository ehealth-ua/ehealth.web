import snakeCase from "lodash/snakeCase";

const stringifySortingParams = ({ name, order }) =>
  [snakeCase(name), order].join("_").toUpperCase();

export default stringifySortingParams;
