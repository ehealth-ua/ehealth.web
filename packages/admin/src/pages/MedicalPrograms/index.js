import React from "react";
import { Router, Redirect } from "@reach/router";

import Search from "./Search/";

const MedicalPrograms = ({ uri }) => (
  <Router>
    <Redirect from="/" to={`${uri}/search`} />
    <Search path="search/*" />
  </Router>
);

export default MedicalPrograms;
