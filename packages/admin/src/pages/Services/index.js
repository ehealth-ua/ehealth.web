import React from "react";
import { Router, Redirect } from "@reach/router";

import Search from "./Search/";
import Details from "./Details/";

const Services = ({ uri }) => (
  <Router>
    <Redirect from="/" to={`${uri}/search`} />
    <Search path="search/*" />
    <Details path=":id/*" />
  </Router>
);

export default Services;
