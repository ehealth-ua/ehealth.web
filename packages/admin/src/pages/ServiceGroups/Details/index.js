//@flow
import React from "react";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import { Query } from "react-apollo";
import { Trans } from "@lingui/macro";
import { Router } from "@reach/router";
import { Flex, Box } from "@rebass/emotion";
import {
  LocationParams,
  SetLocationParamsProp,
  URLSearchParams
} from "@ehealth/components";
import { PositiveIcon, NegativeIcon } from "@ehealth/icons";
import type {
  ServiceGroup,
  ServiceGroupConnection,
  ServiceConnection
} from "@ehealth-ua/schema";

import Tabs from "../../../components/Tabs";
import Link from "../../../components/Link";
import Badge from "../../../components/Badge";
import Ability from "../../../components/Ability";
import EmptyData from "../../../components/EmptyData";
import Pagination from "../../../components/Pagination";
import Breadcrumbs from "../../../components/Breadcrumbs";
import LoadingOverlay from "../../../components/LoadingOverlay";
import DefinitionListView from "../../../components/DefinitionListView";
import filteredLocationParams from "../../../helpers/filteredLocationParams";

import ServiceGroupsTable from "../Search/ServiceGroupsTable";
import AddServiceToGroupPopup from "./AddServiceToGroupPopup";
import DeleteServiceFromGroup from "./DeleteServiceFromGroup";
import ServicesTable from "../../Services/Search/ServicesTable";
import UpdateServiceGroupPopup from "./UpdateServiceGroupPopup";
import DeactivateServiceGroupPopup from "./DeactivateServiceGroupPopup";

const Details = ({ id }: { [string]: string }) => (
  <LocationParams>
    {({
      locationParams,
      setLocationParams
    }: {
      locationParams: URLSearchParams,
      setLocationParams: SetLocationParamsProp
    }) => {
      const filteredParams = filteredLocationParams(locationParams);
      return (
        <Query
          fetchPolicy="network-only"
          query={ServiceGroupDetailsQuery}
          variables={{ id, ...filteredParams }}
        >
          {({
            loading,
            data: { serviceGroup }
          }: {
            loading: boolean,
            data: {
              serviceGroup: ServiceGroup
            }
          }) => {
            if (isEmpty(serviceGroup)) return null;
            const {
              databaseId,
              name,
              isActive,
              requestAllowed,
              parentGroup,
              services,
              subGroups
            } = serviceGroup;

            const { id: parentGroupId, name: parentGroupName } =
              parentGroup || {};

            return (
              <LoadingOverlay loading={loading}>
                <Box p={6}>
                  <Box py={10}>
                    <Breadcrumbs.List>
                      <Breadcrumbs.Item to="/service-groups">
                        <Trans>Service groups</Trans>
                      </Breadcrumbs.Item>
                      <Breadcrumbs.Item>
                        <Trans>Service group details</Trans>
                      </Breadcrumbs.Item>
                    </Breadcrumbs.List>
                  </Box>
                  <Flex justifyContent="space-between" alignItems="flex-end">
                    <Box>
                      <DefinitionListView
                        labels={{
                          name: <Trans>Group name</Trans>,
                          databaseId: <Trans>ID</Trans>,
                          isActive: <Trans>Status</Trans>,
                          requestAllowed: <Trans>Is request allowed</Trans>,
                          parentGroup: <Trans>Parent group</Trans>
                        }}
                        data={{
                          databaseId,
                          name,
                          isActive: (
                            <Badge
                              type="ACTIVE_STATUS_F"
                              name={isActive}
                              variant={!isActive}
                              minWidth={100}
                            />
                          ),
                          requestAllowed: requestAllowed ? (
                            <PositiveIcon />
                          ) : (
                            <NegativeIcon />
                          ),
                          parentGroup: parentGroupId && (
                            <Link to={`../${parentGroupId}`} fontWeight="bold">
                              {parentGroupName}
                            </Link>
                          )
                        }}
                        color="#7F8FA4"
                        labelWidth="135px"
                        marginBetween="auto"
                      />
                    </Box>
                    {isActive && (
                      <Ability action="write" resource="service_catalog">
                        <Flex justifyContent="flex-end" flexWrap="wrap">
                          <Box mt={2}>
                            <UpdateServiceGroupPopup
                              id={id}
                              name={name}
                              requestAllowed={requestAllowed}
                              serviceGroupDetailsQuery={
                                ServiceGroupDetailsQuery
                              }
                              locationParams={filteredParams}
                            />
                          </Box>
                          <Box mt={2} ml={2}>
                            <DeactivateServiceGroupPopup
                              id={id}
                              name={name}
                              serviceGroupDetailsQuery={
                                ServiceGroupDetailsQuery
                              }
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
                    <Trans>Services</Trans>
                  </Tabs.NavItem>
                  <Tabs.NavItem to="./subgroups">
                    <Trans>Subgroups</Trans>
                  </Tabs.NavItem>
                </Tabs.Nav>
                <Tabs.Content>
                  <Router>
                    <Services
                      path="/"
                      id={id}
                      groupName={name}
                      isActive={isActive}
                      services={services}
                      locationParams={filteredParams}
                      setLocationParams={setLocationParams}
                    />
                    <SubGroups
                      path="/subgroups"
                      subGroups={subGroups}
                      locationParams={filteredParams}
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

const SubGroups = ({
  subGroups,
  locationParams,
  setLocationParams
}: {
  subGroups?: ServiceGroupConnection,
  locationParams: URLSearchParams,
  setLocationParams: SetLocationParamsProp
}) => {
  const { nodes, pageInfo } = subGroups || {};
  if (isEmpty(nodes)) return <EmptyData />;

  return (
    <>
      <ServiceGroupsTable
        serviceGroups={nodes}
        locationParams={locationParams}
        setLocationParams={setLocationParams}
        tableName="service-group-details/subgroups-table"
      />
      <Pagination {...pageInfo} />
    </>
  );
};

const Services = ({
  id,
  services,
  isActive,
  groupName,
  locationParams,
  setLocationParams
}: {
  id: string,
  services?: ServiceConnection,
  isActive: boolean,
  groupName: string,
  locationParams: URLSearchParams,
  setLocationParams: SetLocationParamsProp
}) => {
  const { nodes, pageInfo } = services || {};

  return (
    <>
      {isActive && (
        <Ability action="write" resource="service_catalog">
          <AddServiceToGroupPopup
            serviceGroupId={id}
            serviceGroupName={groupName}
            locationParams={locationParams}
            serviceGroupDetailsQuery={ServiceGroupDetailsQuery}
          />
        </Ability>
      )}
      {!isEmpty(nodes) ? (
        <>
          <ServicesTable
            services={nodes}
            locationParams={locationParams}
            setLocationParams={setLocationParams}
            deleteServiceHeader={{ action: <Trans>Action</Trans> }}
            deleteServiceFromGroup={({ serviceId, serviceName }) => (
              <DeleteServiceFromGroup
                serviceId={serviceId}
                serviceName={serviceName}
                serviceGroupId={id}
                serviceGroupName={groupName}
                locationParams={locationParams}
                serviceGroupDetailsQuery={ServiceGroupDetailsQuery}
              />
            )}
            tableName="service-group-details/services-table"
          />
          <Pagination {...pageInfo} />
        </>
      ) : (
        <EmptyData mx={0} my={5} />
      )}
    </>
  );
};

const ServiceGroupDetailsQuery = gql`
  query ServiceGroupDetailsQuery(
    $id: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $orderBy: ServiceOrderBy
    $orderGroupBy: ServiceGroupOrderBy
  ) {
    serviceGroup(id: $id) {
      id
      databaseId
      name
      isActive
      requestAllowed
      parentGroup {
        id
        name
      }
      services(
        first: $first
        orderBy: $orderBy
        before: $before
        after: $after
        last: $last
      ) {
        nodes {
          ...Services
        }
        pageInfo {
          ...PageInfo
        }
      }
      subGroups(
        first: $first
        orderBy: $orderGroupBy
        before: $before
        after: $after
        last: $last
      ) {
        nodes {
          ...ServiceGroups
        }
        pageInfo {
          ...PageInfo
        }
      }
    }
  }
  ${ServicesTable.fragments.entry}
  ${ServiceGroupsTable.fragments.entry}
  ${Pagination.fragments.entry}
`;

export default Details;
