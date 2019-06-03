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

const ReimbursementContractRequestsSearch = () => (
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
              query={SearchReimbursementContractRequestsQuery}
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
                  reimbursementContractRequests: {
                    nodes: reimbursementContractRequests = [],
                    pageInfo
                  } = {}
                }
              }) => {
                if (isEmpty(reimbursementContractRequests)) return null;
                return (
                  <LoadingOverlay loading={loading}>
                    {reimbursementContractRequests.length > 0 && (
                      <>
                        <ContractTable
                          reimbursementContractRequests={
                            reimbursementContractRequests
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

const SearchReimbursementContractRequestsQuery = gql`
  query SearchReimbursementContractRequestsQuery(
    $filter: ReimbursementContractRequestFilter
    $orderBy: ReimbursementContractRequestOrderBy
    $before: String
    $after: String
    $first: Int
    $last: Int
  ) {
    reimbursementContractRequests(
      first: $first
      filter: $filter
      orderBy: $orderBy
      before: $before
      after: $after
      last: $last
    ) {
      nodes {
        ...ReimbursementContractRequests
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${ContractTable.fragments.entry}
  ${Pagination.fragments.entry}
`;

export default ReimbursementContractRequestsSearch;
