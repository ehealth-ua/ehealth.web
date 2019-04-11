import React from "react";
import { Router, Redirect } from "@reach/router";

import CapitationContractRequestsDetails from "./Capitation/Details";
import CapitationContractRequestsSearch from "./Capitation/Search";
import ReimbursementContractRequestDetails from "./Reimbursement/Details";
import ReimbursementContractRequestsSearch from "./Reimbursement/Search";
import CreateCapitationContractRequest from "./Capitation/Create";

const ContractRequests = ({ uri }) => (
  <Router>
    <Redirect from="/" to={`${uri}/capitation`} />
    <CapitationContractRequestsSearch path="capitation/" />
    <CreateCapitationContractRequest path="capitation/create/:id/*" />
    <CapitationContractRequestsDetails path="capitation/*" />
    <ReimbursementContractRequestsSearch path="reimbursement/" />
    <ReimbursementContractRequestDetails path="reimbursement/*" />
  </Router>
);

export default ContractRequests;
