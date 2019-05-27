import React from "react";
import { Router, Redirect } from "@reach/router";

import Search from "./Search/";
import Details from "./Details";
import Create from "./Create";
import Update from "./Update";

const Employees = ({ uri }) => (
  <Router>
    <Redirect from="/" to={`${uri}/search`} />
    <Create path="create/*" />
    <Update path="update/:id/*" />
    <Search path="search/*" />
    <Details path=":id/*" />
  </Router>
);

export default Employees;
