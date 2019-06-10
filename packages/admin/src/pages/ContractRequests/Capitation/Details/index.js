//@flow

import React from "react";
import gql from "graphql-tag";
import { Router } from "@reach/router";
import { Query } from "react-apollo";
import { Box } from "@rebass/emotion";

import { Trans } from "@lingui/macro";
import { Switch } from "@ehealth/components";

import isEmpty from "lodash/isEmpty";
import Update from "./Mutations/Update";
import Approve from "./Mutations/Approve";
import Decline from "./Mutations/Decline";
import PrintOutContent from "./Mutations/PrintOutContent";

import Tabs from "../../../../components/Tabs";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import LoadingOverlay from "../../../../components/LoadingOverlay";

import Header from "./Header";
import GeneralInfo from "./GeneralInfo";
import LegalEntity from "./LegalEntity";
import Employees from "./Employees";
import Divisions from "./Divisions";
import Documents from "./Documents";
import ExternalContractors from "./ExternalContractors";

const CapitationContractRequestsDetails = () => (
  <Router>
    <Details path=":id/*" />
    <Update path=":id/update/*" />
    <Approve path=":id/approve/*" />
    <Decline path=":id/decline/*" />
    <PrintOutContent path=":id/print-out-content/*" />
  </Router>
);

const Details = ({ id }: { id?: string }) => (
  <Query
    query={CapitationContractRequestQuery}
    fetchPolicy="network-only"
    variables={{ id }}
  >
    {({ loading, error, data: { capitationContractRequest = {} } = {} }) => {
      if (isEmpty(capitationContractRequest)) return null;
      const {
        databaseId,
        status,
        assignee,
        printoutContent,
        startDate,
        endDate,
        nhsSigner,
        nhsSignerBase,
        nhsContractPrice,
        nhsPaymentMethod,
        issueCity,
        contractorRmspAmount,
        contractorLegalEntity,
        contractorOwner,
        contractorBase,
        contractorPaymentDetails,
        contractorDivisions,
        contractorEmployeeDivisions,
        externalContractors,
        attachedDocuments,
        previousRequest,
        statusReason
      } = capitationContractRequest;

      return (
        <LoadingOverlay loading={loading}>
          <Box p={6}>
            <Box py={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/contract-requests">
                  <Trans>Contract requests list</Trans>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                  <Trans>Contract request details</Trans>
                </Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Box>
            <Header
              id={id}
              databaseId={databaseId}
              status={status}
              printoutContent={printoutContent}
              assignee={assignee}
              previousRequest={previousRequest}
            />
          </Box>

          <Tabs.Nav>
            <Tabs.NavItem to="./">
              <Trans>General information</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./legal-entity">
              <Trans>Legal entity</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./divisions">
              <Trans>Division</Trans>
            </Tabs.NavItem>
            {contractorEmployeeDivisions && (
              <Tabs.NavItem to="./employees">
                <Trans>Doctors</Trans>
              </Tabs.NavItem>
            )}
            <Tabs.NavItem to="./external-contractors">
              <Trans>Contractors</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./documents">
              <Trans>Documents</Trans>
            </Tabs.NavItem>
          </Tabs.Nav>
          <Tabs.Content>
            <Router>
              <GeneralInfo
                path="/"
                startDate={startDate}
                endDate={endDate}
                nhsSigner={nhsSigner}
                nhsSignerBase={nhsSignerBase}
                nhsContractPrice={nhsContractPrice}
                nhsPaymentMethod={nhsPaymentMethod}
                issueCity={issueCity}
                contractorRmspAmount={contractorRmspAmount}
                statusReason={statusReason}
              />
              <LegalEntity
                path="/legal-entity"
                contractorOwner={contractorOwner}
                contractorBase={contractorBase}
                contractorLegalEntity={contractorLegalEntity}
                contractorPaymentDetails={contractorPaymentDetails}
              />
              <Divisions
                path="/divisions"
                contractorDivisions={contractorDivisions}
              />
              <Employees
                path="/employees"
                contractorEmployeeDivisions={contractorEmployeeDivisions}
              />
              <ExternalContractors
                path="/external-contractors"
                externalContractors={externalContractors}
              />
              <Documents
                path="/documents"
                attachedDocuments={attachedDocuments}
              />
            </Router>
          </Tabs.Content>
        </LoadingOverlay>
      );
    }}
  </Query>
);

export const CapitationContractRequestQuery = gql`
  query CapitationContractRequestQuery($id: ID!) {
    capitationContractRequest(id: $id) {
      ...Header
      ...GeneralInfo
      ...LegalEntity
      ...Divisions
      ...Employees
      ...ExternalContractors
      ...Documents
      miscellaneous
      toApproveContent
      toDeclineContent
      toSignContent
    }
  }
  ${Header.fragments.entry}
  ${GeneralInfo.fragments.entry}
  ${LegalEntity.fragments.entry}
  ${Divisions.fragments.entry}
  ${Employees.fragments.entry}
  ${ExternalContractors.fragments.entry}
  ${Documents.fragments.entry}
`;

export default CapitationContractRequestsDetails;
