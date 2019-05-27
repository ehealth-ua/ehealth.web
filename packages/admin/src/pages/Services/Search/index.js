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

import PrimarySearchFields from "./SearchFields";
import ServicesTable from "./ServicesTable";

const Search = () => {
  //TODO: use state for handling `create` and `deactivate` popups visibility
  return (
    <Box p={6}>
      <LocationParams>
        {({ locationParams, setLocationParams }) => {
          return (
            <>
              <Flex
                justifyContent="space-between"
                alignItems="flex-start"
                mb={6}
              >
                <Box>
                  <Heading as="h1" fontWeight="normal" mb={4}>
                    <Trans>Services</Trans>
                  </Heading>
                </Box>
                {
                  //TODO: Add `Create` button with Ability checking
                }
              </Flex>
              <SearchForm
                initialValues={locationParams}
                onSubmit={setLocationParams}
                renderPrimary={PrimarySearchFields}
              />
              <Query
                query={SearchServicesQuery}
                fetchPolicy="network-only"
                variables={filteredLocationParams(locationParams)}
              >
                {({
                  loading,
                  error,
                  data: { services: { nodes: services = [], pageInfo } = {} }
                }) => {
                  if (isEmpty(services)) return null;
                  return (
                    <LoadingOverlay loading={loading}>
                      <ServicesTable
                        locationParams={locationParams}
                        setLocationParams={setLocationParams}
                        services={services}
                      />
                      <Pagination {...pageInfo} />
                    </LoadingOverlay>
                  );
                }}
              </Query>
            </>
          );
        }}
      </LocationParams>
    </Box>
  );
};

const SearchServicesQuery = gql`
  query SearchServicesQuery(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $filter: ServiceFilter
    $orderBy: ServiceOrderBy
  ) {
    services(
      first: $first
      filter: $filter
      orderBy: $orderBy
      before: $before
      after: $after
      last: $last
    ) {
      nodes {
        ...Service
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${ServicesTable.fragments.entry}
  ${Pagination.fragments.entry}
`;

export default Search;
