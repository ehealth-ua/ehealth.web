import React from "react";
import { Router, Redirect } from "@reach/router";

import Search from "./Search";
import Details from "./Details";
import Add from "./Add";

const LegalEntities = ({ uri }) => (
  <Router>
    <Redirect from="/" to={`${uri}/search`} />
    <Search path="search/*" />
    <Details path=":id/*" />
    <Add path=":id/add/*" />
  </Router>
);

export default LegalEntities;
