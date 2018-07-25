import isNil from "lodash/isNil";
import flatten from "flat";

const stringifySearchParams = params => {
  return new URLSearchParams(
    Object.entries(flatten(params)).filter(([key, value]) => !isNil(value))
  ).toString();
};

export default stringifySearchParams;
