import React from "react";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import { Query } from "react-apollo";
import { Trans } from "@lingui/macro";
import { Flex, Box, Heading } from "@rebass/emotion";
import { LocationParams } from "@ehealth/components";

import Pagination from "../../../components/Pagination";
import SearchForm from "../../../components/SearchForm";
import LoadingOverlay from "../../../components/LoadingOverlay";
import filteredLocationParams from "../../../helpers/filteredLocationParams";

import ServiceGroupsTable from "./ServiceGroupsTable";
import { PrimarySearchFields } from "./SearchFields";

const Search = () => (
  <Box p={6}>
    <LocationParams>
      {({ locationParams, setLocationParams }) => (
        <>
          <Flex justifyContent="space-between" alignItems="flex-start" mb={6}>
            <Box>
              <Heading as="h1" fontWeight="normal" mb={4}>
                <Trans>Service groups</Trans>
              </Heading>
            </Box>
            {
              //TODO: add Create Service Group mutation with Ability checking
            }
          </Flex>
          <SearchForm
            initialValues={locationParams}
            onSubmit={setLocationParams}
            renderPrimary={PrimarySearchFields}
          />
          <Query
            query={SearchServiceGroupsQuery}
            fetchPolicy="network-only"
            variables={filteredLocationParams(locationParams)}
          >
            {({
              loading,
              error,
              data: {
                serviceGroups: { nodes: serviceGroups = [], pageInfo } = {}
              }
            }) => {
              if (isEmpty(serviceGroups)) return null;
              return (
                <LoadingOverlay loading={loading}>
                  <ServiceGroupsTable
                    locationParams={locationParams}
                    setLocationParams={setLocationParams}
                    serviceGroups={serviceGroups}
                  />
                  <Pagination {...pageInfo} />
                </LoadingOverlay>
              );
            }}
          </Query>
        </>
      )}
    </LocationParams>
  </Box>
);

const SearchServiceGroupsQuery = gql`
  query SearchServiceGroupsQuery(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $filter: ServiceGroupFilter
    $orderBy: ServiceGroupOrderBy
  ) {
    serviceGroups(
      first: $first
      filter: $filter
      orderBy: $orderBy
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
  ${ServiceGroupsTable.fragments.entry}
  ${Pagination.fragments.entry}
`;

export default Search;
