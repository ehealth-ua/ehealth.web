import React from "react";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import { Router } from "@reach/router";
import { Flex, Box } from "@rebass/emotion";
import { PositiveIcon, NegativeIcon } from "@ehealth/icons";
import { Query } from "react-apollo";
import { Trans } from "@lingui/macro";
import { LocationParams } from "@ehealth/components";

import Pagination from "../../../components/Pagination";
import EmptyData from "../../../components/EmptyData";
import Tabs from "../../../components/Tabs";
import Badge from "../../../components/Badge";
import Breadcrumbs from "../../../components/Breadcrumbs";
import LoadingOverlay from "../../../components/LoadingOverlay";
import DefinitionListView from "../../../components/DefinitionListView";
import filteredLocationParams from "../../../helpers/filteredLocationParams";

import ParentGroupsTable from "./ParentGroupsTable";

const Details = ({ id }) => {
  //TODO: use state for handling `deactivate` popup visibility
  return (
    <LocationParams>
      {({ locationParams, setLocationParams }) => (
        <Query
          query={ServiceDetailsQuery}
          variables={{ id, ...filteredLocationParams(locationParams) }}
        >
          {({ loading, error, data: { service } }) => {
            if (isEmpty(service)) return null;
            const {
              databaseId,
              name,
              isActive,
              requestAllowed,
              parentGroups
            } = service;
            return (
              <LoadingOverlay loading={loading}>
                <Box p={6}>
                  <Box py={10}>
                    <Breadcrumbs.List>
                      <Breadcrumbs.Item to="/services">
                        <Trans>Services</Trans>
                      </Breadcrumbs.Item>
                      <Breadcrumbs.Item>
                        <Trans>Service details</Trans>
                      </Breadcrumbs.Item>
                    </Breadcrumbs.List>
                  </Box>
                  <Flex justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <DefinitionListView
                        labels={{
                          name: <Trans>Service name</Trans>,
                          databaseId: <Trans>ID</Trans>,
                          isActive: <Trans>Status</Trans>,
                          requestAllowed: <Trans>Is request allowed</Trans>
                        }}
                        data={{
                          databaseId,
                          name,
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
                      />
                    </Box>
                    {
                      //TODO: Add `Deactivate` button with Ability checking
                    }
                  </Flex>
                </Box>
                <Tabs.Nav>
                  <Tabs.NavItem to="./">
                    <Trans>Service groups</Trans>
                  </Tabs.NavItem>
                </Tabs.Nav>
                <Tabs.Content>
                  <Router>
                    <ParentGroups
                      path="/"
                      parentGroups={parentGroups}
                      locationParams={locationParams}
                      setLocationParams={setLocationParams}
                    />
                  </Router>
                </Tabs.Content>
              </LoadingOverlay>
            );
          }}
        </Query>
      )}
    </LocationParams>
  );
};

const ParentGroups = ({ parentGroups, locationParams, setLocationParams }) => {
  const { nodes, pageInfo } = parentGroups || {};
  if (isEmpty(nodes)) return <EmptyData />;

  return (
    <>
      <ParentGroupsTable
        locationParams={locationParams}
        setLocationParams={setLocationParams}
        parentGroups={nodes}
      />
      <Pagination {...pageInfo} />
    </>
  );
};

const ServiceDetailsQuery = gql`
  query ServiceDetailsQuery(
    $id: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $orderBy: ServiceGroupOrderBy
  ) {
    service(id: $id) {
      databaseId
      name
      isActive
      requestAllowed
      parentGroups(
        first: $first
        orderBy: $orderBy
        before: $before
        after: $after
        last: $last
      ) {
        nodes {
          ...ParentGroups
        }
        pageInfo {
          ...PageInfo
        }
      }
    }
  }
  ${ParentGroupsTable.fragments.entry}
  ${Pagination.fragments.entry}
`;

export default Details;
