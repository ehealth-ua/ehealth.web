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

const ReimbursementContractsSearch = () => (
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
              query={SearchReimbursementContractsQuery}
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
                  reimbursementContracts: {
                    nodes: reimbursementContracts = [],
                    pageInfo
                  } = {}
                }
              }) => {
                if (isEmpty(reimbursementContracts)) return null;
                return (
                  <LoadingOverlay loading={loading}>
                    {reimbursementContracts.length > 0 && (
                      <>
                        <ContractTable
                          reimbursementContracts={reimbursementContracts}
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

const SearchReimbursementContractsQuery = gql`
  query SearchReimbursementContractsQuery(
    $filter: ReimbursementContractFilter
    $orderBy: ReimbursementContractOrderBy
    $before: String
    $after: String
    $first: Int
    $last: Int
  ) {
    reimbursementContracts(
      first: $first
      filter: $filter
      orderBy: $orderBy
      before: $before
      after: $after
      last: $last
    ) {
      nodes {
        ...ReimbursementContracts
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${ContractTable.fragments.entry}
  ${Pagination.fragments.entry}
`;

export default ReimbursementContractsSearch;
