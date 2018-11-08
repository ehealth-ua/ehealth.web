import fromPairs from "lodash/fromPairs";

import { REACT_APP_FEATURES } from "./env";

const features = REACT_APP_FEATURES.length
  ? REACT_APP_FEATURES.split(",").reduce((result, item) => {
      result[item] = true;
      return result;
    }, {})
  : {};

const flags = {
  features
};

export default flags;
