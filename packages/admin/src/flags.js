import fromPairs from "lodash/fromPairs";

import { REACT_APP_FEATURES } from "./env";

const features = fromPairs(REACT_APP_FEATURES.split(",").map(f => [f, true]));

const flags = {
  features
};

export default flags;
