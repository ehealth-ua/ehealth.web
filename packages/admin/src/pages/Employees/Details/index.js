//@flow
import React from "react";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import { Router } from "@reach/router";
import { Query } from "react-apollo";
import { Trans } from "@lingui/macro";
import { Box } from "@rebass/emotion";

import type { Scalars } from "@ehealth-ua/schema";

import Tabs from "../../../components/Tabs";
import Breadcrumbs from "../../../components/Breadcrumbs";
import LoadingOverlay from "../../../components/LoadingOverlay";

import Header from "./Header";
import GeneralInfo from "./GeneralInfo";
import Education from "./Education";

const Details = ({
  id,
  navigate
}: {
  id: Scalars.ID,
  navigate: any => mixed
}) => {
  return (
    <Query query={EmployeeQuery} variables={{ id }} fetchPolicy="network-only">
      {({ loading, data: { employee = {} } = {} }) => {
        if (isEmpty(employee)) return null;
        const {
          databaseId,
          party,
          position,
          employeeType,
          startDate,
          endDate,
          legalEntity,
          division,
          status,
          isActive,
          additionalInfo: {
            specialities,
            educations,
            qualifications,
            scienceDegree
          } = {}
        } = employee;

        return (
          <LoadingOverlay loading={loading}>
            <Box p={6}>
              <Box py={10}>
                <Breadcrumbs.List>
                  <Breadcrumbs.Item to="/employees">
                    <Trans>Employees</Trans>
                  </Breadcrumbs.Item>
                  <Breadcrumbs.Item>
                    <Trans>Employee details</Trans>
                  </Breadcrumbs.Item>
                </Breadcrumbs.List>
              </Box>
              <Header
                id={id}
                databaseId={databaseId}
                party={party}
                legalEntityType={legalEntity.type}
                status={status}
                employeeType={employeeType}
                navigate={navigate}
              />
            </Box>
            <Tabs.Nav>
              <Tabs.NavItem to="./">
                <Trans>General info</Trans>
              </Tabs.NavItem>
              <Tabs.NavItem to="./education">
                <Trans>Education and Qualification</Trans>
              </Tabs.NavItem>
            </Tabs.Nav>
            <Tabs.Content>
              <Router>
                <GeneralInfo
                  path="/"
                  party={party}
                  startDate={startDate}
                  endDate={endDate}
                  position={position}
                  employeeType={employeeType}
                  division={division}
                  legalEntity={legalEntity}
                  isActive={isActive}
                />
                <Education
                  path="education"
                  specialities={specialities}
                  educations={educations}
                  qualifications={qualifications}
                  scienceDegree={scienceDegree}
                />
              </Router>
            </Tabs.Content>
          </LoadingOverlay>
        );
      }}
    </Query>
  );
};

const EmployeeQuery = gql`
  query EmployeeQuery($id: ID!) {
    employee(id: $id) {
      id
      ...Header
      ...GeneralInfo
      ...Education
    }
  }
  ${Header.fragments.entry}
  ${GeneralInfo.fragments.entry}
  ${Education.fragments.entry}
`;

export default Details;
