import React from "react";
import { Router } from "@reach/router";

import List from "./List";
import Details from "./Details";

const PatientsPage = () => (
  <Router>
    <List path="/" />
    <Details path=":id/*" />
  </Router>
);

export default PatientsPage;
