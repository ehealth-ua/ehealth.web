//@flow

import React from "react";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import { Query } from "react-apollo";
import { Box } from "@rebass/emotion";
import { LocationParams } from "@ehealth/components";

import LoadingOverlay from "../../../../components/LoadingOverlay";
import Pagination from "../../../../components/Pagination";
import SearchForm from "../../../../components/SearchForm";
import { ITEMS_PER_PAGE } from "../../../../constants/pagination";
import contractFormFilteredParams from "../../../../helpers/contractFormFilteredParams";

import { PrimarySearchFields, SecondarySearchFields } from "./SearchFields";
import ContractTable from "./ContractsTable";
import ContractsNav from "../../ContractsNav";

const CapitationContractsSearch = () => (
  <Box p={6}>
    <ContractsNav />
    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const { filter, first, last, after, before, orderBy } = locationParams;
        return (
          <>
            <SearchForm
              initialValues={locationParams}
              onSubmit={setLocationParams}
              renderPrimary={PrimarySearchFields}
              renderSecondary={SecondarySearchFields}
            />
            <Query
              query={SearchCapitationContractsQuery}
              fetchPolicy="network-only"
              variables={{
                first:
                  !first && !last
                    ? ITEMS_PER_PAGE[0]
                    : first
                      ? parseInt(first)
                      : undefined,
                last: last ? parseInt(last) : undefined,
                after,
                before,
                orderBy,
                filter: contractFormFilteredParams(filter)
              }}
            >
              {({
                loading,
                data: {
                  capitationContracts: {
                    nodes: capitationContracts = [],
                    pageInfo
                  } = {}
                }
              }) => {
                if (isEmpty(capitationContracts)) return null;
                return (
                  <LoadingOverlay loading={loading}>
                    {capitationContracts.length > 0 && (
                      <>
                        <ContractTable
                          capitationContracts={capitationContracts}
                          locationParams={locationParams}
                          setLocationParams={setLocationParams}
                        />
                        <Pagination {...pageInfo} />
                      </>
                    )}
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

const SearchCapitationContractsQuery = gql`
  query SearchCapitationContractsQuery(
    $filter: CapitationContractFilter
    $orderBy: CapitationContractOrderBy
    $before: String
    $after: String
    $first: Int
    $last: Int
  ) {
    capitationContracts(
      first: $first
      filter: $filter
      orderBy: $orderBy
      before: $before
      after: $after
      last: $last
    ) {
      nodes {
        ...CapitationContracts
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${ContractTable.fragments.entry}
  ${Pagination.fragments.entry}
`;

export default CapitationContractsSearch;
