//@flow
import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import isEmpty from "lodash/isEmpty";
import { Trans } from "@lingui/macro";
import { Router } from "@reach/router";
import { Flex, Box } from "@rebass/emotion";
import { LocationParams } from "@ehealth/components";
import { PositiveIcon, NegativeIcon } from "@ehealth/icons";

import type { Scalars, ServiceGroup, PageInfo } from "@ehealth-ua/schema";
import type {
  URLSearchParams,
  SetLocationParamsProp
} from "@ehealth/components";

import Tabs from "../../../components/Tabs";
import Badge from "../../../components/Badge";
import Ability from "../../../components/Ability";
import EmptyData from "../../../components/EmptyData";
import Pagination from "../../../components/Pagination";
import Breadcrumbs from "../../../components/Breadcrumbs";
import LoadingOverlay from "../../../components/LoadingOverlay";
import DefinitionListView from "../../../components/DefinitionListView";
import filteredLocationParams from "../../../helpers/filteredLocationParams";

import GeneralInfo from "./GeneralInfo";
import ServiceConnections from "./ServiceConnections";

const Details = ({ id }: { id: Scalars.ID }) => (
  <LocationParams>
    {({ locationParams }) => {
      const filteredParams = filteredLocationParams(locationParams);
      return (
        <Query
          query={ProgramServiceDetailsQuery}
          fetchPolicy="network-only"
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
                  <Flex justifyContent="space-between" alignItems="flex-end">
                    <Box>
                      <DefinitionListView
                        labels={{
                          databaseId: <Trans>ID</Trans>,
                          isActive: <Trans>Status</Trans>,
                          requestAllowed: <Trans>Is request allowed</Trans>
                        }}
                        data={{
                          databaseId,
                          isActive: (
                            <Badge
                              type="ACTIVE_STATUS_M"
                              name={isActive}
                              variant={!isActive}
                              minWidth={100}
                            />
                          ),
                          requestAllowed: requestAllowed ? (
                            <PositiveIcon />
                          ) : (
                            <NegativeIcon />
                          )
                        }}
                        color="#7F8FA4"
                        labelWidth="120px"
                        marginBetween="auto"
                      />
                    </Box>
                    {
                      //TODO: add `Update` and `Deactivate` mutations with Ability checking
                    }
                  </Flex>
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
      databaseId
      isActive
      requestAllowed
      ...GeneralInfo
      ...ServiceConnections
    }
  }
  ${GeneralInfo.fragments.entry}
  ${ServiceConnections.fragments.entry}
`;

export default Details;
