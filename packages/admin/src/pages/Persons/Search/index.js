import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import isEmpty from "lodash/isEmpty";
import { Box, Heading } from "@rebass/emotion";
import { Trans, DateFormat } from "@lingui/macro";
import { LocationParams } from "@ehealth/components";
import { cleanDeep } from "@ehealth/utils";

import Pagination from "../../../components/Pagination";
import SearchForm from "../../../components/SearchForm";
import LoadingOverlay from "../../../components/LoadingOverlay";
import filteredLocationParams from "../../../helpers/filteredLocationParams";

import PersonsTable from "./PersonsTable";
import {
  PrimarySearchFields,
  SecondarySearchFields,
  SearchButton
} from "./SearchFields";

const Search = () => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={6}>
      <Trans>Patient Search</Trans>
    </Heading>
    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const {
          filter: { taxId, databaseId, identity, personal, status } = {}
        } = locationParams;
        const { number, type, ...documents } = identity || {};

        const filterPersonsParams = cleanDeep({
          taxId,
          databaseId,
          identity: {
            ...documents,
            document: number && {
              type: type,
              number
            }
          },
          personal,
          status
        });
        return (
          <>
            <SearchForm
              initialValues={locationParams}
              onSubmit={setLocationParams}
              renderPrimary={PrimarySearchFields}
              renderSecondary={SecondarySearchFields}
              searchButton={SearchButton}
            />
            <Query
              skip={
                isEmpty(taxId) &&
                isEmpty(databaseId) &&
                (isEmpty(identity) || isEmpty(personal))
              }
              fetchPolicy="network-only"
              query={SearchPersonsQuery}
              variables={{
                ...filteredLocationParams(locationParams),
                filter: filterPersonsParams
              }}
            >
              {({
                loading,
                data: { persons: { nodes: persons = [], pageInfo } = {} } = {}
              }) => {
                if (isEmpty(persons)) return null;
                return (
                  <LoadingOverlay loading={loading}>
                    <PersonsTable
                      locationParams={locationParams}
                      setLocationParams={setLocationParams}
                      persons={persons}
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

const SearchPersonsQuery = gql`
  query SearchPersonsQuery(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $filter: PersonFilter
    $orderBy: PersonOrderBy
  ) {
    persons(
      first: $first
      filter: $filter
      orderBy: $orderBy
      before: $before
      after: $after
      last: $last
    ) {
      nodes {
        ...Persons
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${PersonsTable.fragments.entry}
  ${Pagination.fragments.entry}
`;

export default Search;
