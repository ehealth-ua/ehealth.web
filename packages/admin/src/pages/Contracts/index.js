import React from "react";
import { Router, Redirect } from "@reach/router";
import CapitationContractDetails from "./Capitation/Details";
import CapitationContractSearch from "./Capitation/Search";
import ReimbursementContractDetails from "./Reimbursement/Details";
import ReimbursementContractSearch from "./Reimbursement/Search";

const Contracts = ({ uri }) => (
  <Router>
    <Redirect from="/" to={`${uri}/capitation`} />
    <CapitationContractSearch path="capitation/" />
    <CapitationContractDetails path="capitation/*" />
    <ReimbursementContractSearch path="reimbursement/" />
    <ReimbursementContractDetails path="reimbursement/*" />
  </Router>
);

export default Contracts;
