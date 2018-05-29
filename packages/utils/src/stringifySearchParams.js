import isNil from "lodash/isNil";

const stringifySearchParams = params =>
  new URLSearchParams(
    Object.entries(params).filter(([key, value]) => !isNil(value))
  ).toString();

export default stringifySearchParams;
