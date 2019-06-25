import fromPairs from "lodash/fromPairs";

import env from "./env";

const features = env.REACT_APP_FEATURES
  ? fromPairs(env.REACT_APP_FEATURES.split(",").map(f => [f, true]))
  : {};

const flags = {
  features,
  computed: {
    personNavSection: () =>
      features.person || features.reset_authentication_method
  }
};

export default flags;
