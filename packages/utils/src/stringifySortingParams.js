import isEmpty from "lodash/isEmpty";
import snakeCase from "lodash/snakeCase";

const stringifySortingParams = (params = {}) => {
  const { name, order } = params;
  if (isEmpty(params)) return;
  return [snakeCase(name), order].join("_").toUpperCase();
};

export default stringifySortingParams;
