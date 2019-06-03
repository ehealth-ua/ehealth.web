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

import ContractRequestsNav from "../../ContractRequestsNav";
import { PrimarySearchFields, SecondarySearchFields } from "./SearchFields";
import ContractTable from "./ContractsTable";

const CapitationContractRequestsSearch = () => (
  <Box p={6}>
    <ContractRequestsNav />
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
              query={SearchCapitationContractRequestsQuery}
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
                error,
                data: {
                  capitationContractRequests: {
                    nodes: capitationContractRequests = [],
                    pageInfo
                  } = {}
                }
              }) => {
                if (isEmpty(capitationContractRequests)) return null;
                return (
                  <LoadingOverlay loading={loading}>
                    {capitationContractRequests.length > 0 && (
                      <>
                        <ContractTable
                          capitationContractRequests={
                            capitationContractRequests
                          }
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

const SearchCapitationContractRequestsQuery = gql`
  query SearchCapitationContractRequestsQuery(
    $filter: CapitationContractRequestFilter
    $orderBy: CapitationContractRequestOrderBy
    $before: String
    $after: String
    $first: Int
    $last: Int
  ) {
    capitationContractRequests(
      first: $first
      filter: $filter
      orderBy: $orderBy
      before: $before
      after: $after
      last: $last
    ) {
      nodes {
        ...CapitationContractRequests
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${ContractTable.fragments.entry}
  ${Pagination.fragments.entry}
`;

export default CapitationContractRequestsSearch;
