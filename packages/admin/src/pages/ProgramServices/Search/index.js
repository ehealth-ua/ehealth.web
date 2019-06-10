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

import { PrimarySearchFields, SecondarySearchFields } from "./SearchFields";
import ProgramServicesTable from "./ProgramServicesTable";

const Search = () => (
  <Box p={6}>
    <LocationParams>
      {({ locationParams, setLocationParams }) => (
        <>
          <Flex justifyContent="space-between" alignItems="flex-start" mb={6}>
            <Box>
              <Heading as="h1" fontWeight="normal" mb={4}>
                <Trans>Program services</Trans>
              </Heading>
            </Box>
            {
              //TODO: Add `create program service` popup with ability checking here
            }
          </Flex>
          <SearchForm
            initialValues={locationParams}
            onSubmit={setLocationParams}
            renderPrimary={PrimarySearchFields}
            renderSecondary={SecondarySearchFields}
          />
          <Query
            query={SearchProgramServicesQuery}
            fetchPolicy="network-only"
            variables={filteredLocationParams(locationParams)}
          >
            {({
              loading,
              error,
              data: {
                programServices: { nodes: programServices, pageInfo } = {}
              }
            }) => {
              if (isEmpty(programServices)) return null;
              return (
                <LoadingOverlay loading={loading}>
                  <ProgramServicesTable
                    locationParams={locationParams}
                    setLocationParams={setLocationParams}
                    programServices={programServices}
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

const SearchProgramServicesQuery = gql`
  query SearchProgramServicesQuery(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $filter: ProgramServiceFilter
    $orderBy: ProgramServiceOrderBy
  ) {
    programServices(
      first: $first
      filter: $filter
      orderBy: $orderBy
      before: $before
      after: $after
      last: $last
    ) {
      nodes {
        ...ProgramServices
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${ProgramServicesTable.fragments.entry}
  ${Pagination.fragments.entry}
`;

export default Search;
