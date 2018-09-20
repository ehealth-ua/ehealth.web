import React from "react";
import { Router } from "@reach/router";

import Details from "./Details";

const Declarations = () => (
  <Router>
    <Details path=":id/*" />
  </Router>
);

export default Declarations;
