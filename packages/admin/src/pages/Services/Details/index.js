//@flow
import React from "react";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import { Router } from "@reach/router";
import { Flex, Box } from "@rebass/emotion";
import { PositiveIcon, NegativeIcon } from "@ehealth/icons";
import { Query } from "react-apollo";
import { Trans } from "@lingui/macro";
import { LocationParams } from "@ehealth/components";

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

import ParentGroupsTable from "./ParentGroupsTable";
import UpdateServicePopup from "./UpdateServicePopup";
import DeactivateServicePopup from "./DeactivateServicePopup";

const Details = ({ id }: { id: Scalars.ID }) => (
  <LocationParams>
    {({ locationParams, setLocationParams }) => {
      const filteredParams = filteredLocationParams(locationParams);
      return (
        <Query
          query={ServiceDetailsQuery}
          fetchPolicy="network-only"
          variables={{ id, ...filteredParams }}
        >
          {({ loading, error, data: { service } }) => {
            if (isEmpty(service)) return null;
            const {
              databaseId,
              name,
              isActive,
              requestAllowed,
              serviceGroups
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
                  <Flex justifyContent="space-between" alignItems="flex-end">
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
                    {isActive && (
                      <Ability action="write" resource="service_catalog">
                        <Flex justifyContent="flex-end" flexWrap="wrap">
                          <Box mt={2}>
                            <UpdateServicePopup
                              id={id}
                              name={name}
                              requestAllowed={requestAllowed}
                              serviceDetailsQuery={ServiceDetailsQuery}
                              locationParams={filteredParams}
                            />
                          </Box>
                          <Box mt={2} ml={2}>
                            <DeactivateServicePopup
                              id={id}
                              name={name}
                              serviceDetailsQuery={ServiceDetailsQuery}
                              locationParams={filteredParams}
                            />
                          </Box>
                        </Flex>
                      </Ability>
                    )}
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
                      serviceGroups={serviceGroups}
                      locationParams={locationParams}
                      setLocationParams={setLocationParams}
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

const ParentGroups = ({
  serviceGroups,
  locationParams,
  setLocationParams
}: {
  serviceGroups: { nodes: Array<ServiceGroup>, pageInfo: PageInfo },
  locationParams: URLSearchParams,
  setLocationParams: SetLocationParamsProp
}) => {
  const { nodes, pageInfo } = serviceGroups || {};
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
      id
      databaseId
      name
      isActive
      requestAllowed
      serviceGroups(
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
