import React from "react";
import { Router, Redirect } from "@reach/router";

import Search from "./Search";
import Details from "./Details";
import Approve from "./Approve";
import Decline from "./Decline";
import PrintOutContent from "./PrintOutContent";

const ContractRequests = ({ uri }) => (
  <Router>
    <Redirect from="/" to={`${uri}/search`} />
    <Search path="search/*" />
    <Details path=":id/*" />
    <Approve path=":id/approve/*" />
    <Decline path=":id/decline/*" />
    <PrintOutContent path=":id/print-out-content/*" />
  </Router>
);

export default ContractRequests;
