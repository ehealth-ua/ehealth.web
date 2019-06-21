import React from "react";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import { Trans } from "@lingui/macro";
import { Router } from "@reach/router";
import { Query } from "react-apollo";
import { Box } from "@rebass/emotion";

import Tabs from "../../../components/Tabs";
import Breadcrumbs from "../../../components/Breadcrumbs";
import LoadingOverlay from "../../../components/LoadingOverlay";

import Header from "./Header";
import GeneralInfo from "./GeneralInfo";

const Details = ({ id }) => (
  <Query query={ProgramMedicationQuery} variables={{ id }}>
    {({ loading, data: { programMedication = {} } }) => {
      if (isEmpty(programMedication)) return null;
      const {
        databaseId,
        medicationRequestAllowed,
        isActive,
        ...details
      } = programMedication;

      return (
        <LoadingOverlay loading={loading}>
          <Box p={6}>
            <Box py={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/program-medications">
                  <Trans>Search program medications</Trans>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                  <Trans>Program medication details</Trans>
                </Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Box>
            <Header
              id={id}
              databaseId={databaseId}
              isActive={isActive}
              medicationRequestAllowed={medicationRequestAllowed}
            />
          </Box>

          <Tabs.Nav>
            <Tabs.NavItem to="./">
              <Trans>General info</Trans>
            </Tabs.NavItem>
          </Tabs.Nav>
          <Tabs.Content>
            <Router>
              <GeneralInfo path="/" isActive={isActive} details={details} />
            </Router>
          </Tabs.Content>
        </LoadingOverlay>
      );
    }}
  </Query>
);

const ProgramMedicationQuery = gql`
  query ProgramMedicationQuery($id: ID!) {
    programMedication(id: $id) {
      ...ProgramMedicationHeader
      ...ProgramMedicationGeneralInfo
    }
  }
  ${Header.fragments.entry}
  ${GeneralInfo.fragments.entry}
`;

export default Details;
