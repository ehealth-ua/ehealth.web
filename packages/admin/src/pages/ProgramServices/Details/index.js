//@flow
import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import isEmpty from "lodash/isEmpty";
import { Trans } from "@lingui/macro";
import { Box } from "@rebass/emotion";
import { Router } from "@reach/router";
import { LocationParams } from "@ehealth/components";

import type { Scalars } from "@ehealth-ua/schema";

import Tabs from "../../../components/Tabs";
import Breadcrumbs from "../../../components/Breadcrumbs";
import LoadingOverlay from "../../../components/LoadingOverlay";
import filteredLocationParams from "../../../helpers/filteredLocationParams";

import Header from "./Header";
import GeneralInfo from "./GeneralInfo";
import ServiceConnections from "./ServiceConnections";

const Details = ({ id }: { id: Scalars.ID }) => (
  <LocationParams>
    {({ locationParams }) => {
      const filteredParams = filteredLocationParams(locationParams);
      return (
        <Query
          query={ProgramServiceDetailsQuery}
          variables={{ id, ...filteredParams }}
        >
          {({ loading, data: { programService } }) => {
            if (isEmpty(programService)) return null;
            const {
              databaseId,
              isActive,
              requestAllowed,
              service,
              serviceGroup,
              consumerPrice,
              description,
              medicalProgram
            } = programService;
            return (
              <LoadingOverlay loading={loading}>
                <Box p={6}>
                  <Box py={10}>
                    <Breadcrumbs.List>
                      <Breadcrumbs.Item to="/program-services">
                        <Trans>Program services</Trans>
                      </Breadcrumbs.Item>
                      <Breadcrumbs.Item>
                        <Trans>Program service details</Trans>
                      </Breadcrumbs.Item>
                    </Breadcrumbs.List>
                  </Box>
                  <Header
                    id={id}
                    databaseId={databaseId}
                    isActive={isActive}
                    requestAllowed={requestAllowed}
                  />
                </Box>
                <Tabs.Nav>
                  <Tabs.NavItem to="./">
                    <Trans>General info</Trans>
                  </Tabs.NavItem>
                  <Tabs.NavItem to="./connections">
                    {service.databaseId ? (
                      <Trans>Service</Trans>
                    ) : (
                      <Trans>Service group</Trans>
                    )}
                  </Tabs.NavItem>
                </Tabs.Nav>
                <Tabs.Content>
                  <Router>
                    <GeneralInfo
                      path="/"
                      consumerPrice={consumerPrice}
                      description={description}
                      medicalProgram={medicalProgram}
                    />
                    <ServiceConnections
                      path="/connections"
                      service={service}
                      serviceGroup={serviceGroup}
                    />
                  </Router>
                </Tabs.Content>
              </LoadingOverlay>
            );
          }}
        </Query>
      );
    }}
  </LocationParams>
);

const ProgramServiceDetailsQuery = gql`
  query ProgramServiceDetailsQuery($id: ID!) {
    programService(id: $id) {
      ...Header
      ...GeneralInfo
      ...ServiceConnections
    }
  }
  ${Header.fragments.entry}
  ${GeneralInfo.fragments.entry}
  ${ServiceConnections.fragments.entry}
`;

export default Details;
