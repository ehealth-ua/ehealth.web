import React from "react";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import { Query } from "react-apollo";
import { Trans } from "@lingui/macro";
import { Flex, Box, Heading } from "@rebass/emotion";
import { LocationParams } from "@ehealth/components";

import Ability from "../../../components/Ability";
import Pagination from "../../../components/Pagination";
import SearchForm from "../../../components/SearchForm";
import LoadingOverlay from "../../../components/LoadingOverlay";
import filteredLocationParams from "../../../helpers/filteredLocationParams";

import INNMsTable from "./INNMsTable";
import CreateINNMPopup from "./Mutations/Create";
import { PrimarySearchFields } from "./SearchFields";

const Search = () => (
  <Box p={6}>
    <LocationParams>
      {({ locationParams, setLocationParams }) => (
        <>
          <Flex justifyContent="space-between" alignItems="flex-start" mb={6}>
            <Box>
              <Heading as="h1" fontWeight="normal" mb={4}>
                <Trans>INNMs</Trans>
              </Heading>
            </Box>
            <Ability action="write" resource="innm">
              <CreateINNMPopup
                locationParams={filteredLocationParams(locationParams)}
                searchINNMsQuery={SearchINNMsQuery}
              />
            </Ability>
          </Flex>
          <SearchForm
            initialValues={locationParams}
            onSubmit={setLocationParams}
            renderPrimary={PrimarySearchFields}
          />
          <Query
            query={SearchINNMsQuery}
            fetchPolicy="network-only"
            variables={filteredLocationParams(locationParams)}
          >
            {({
              loading,
              error,
              data: { innms: { nodes: innms = [], pageInfo } = {} }
            }) => {
              if (isEmpty(innms)) return null;
              return (
                <LoadingOverlay loading={loading}>
                  <>
                    <INNMsTable
                      locationParams={locationParams}
                      setLocationParams={setLocationParams}
                      innms={innms}
                    />
                    <Pagination {...pageInfo} />
                  </>
                </LoadingOverlay>
              );
            }}
          </Query>
        </>
      )}
    </LocationParams>
  </Box>
);

export const SearchINNMsQuery = gql`
  query SearchINNMsQuery(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $filter: INNMFilter
    $orderBy: INNMOrderBy
    $skip: Boolean! = false
  ) {
    innms(
      first: $first
      filter: $filter
      orderBy: $orderBy
      before: $before
      after: $after
      last: $last
    ) @skip(if: $skip) {
      nodes {
        ...INNMs
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${INNMsTable.fragments.entry}
  ${Pagination.fragments.entry}
`;

export default Search;
