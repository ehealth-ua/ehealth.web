import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import isEmpty from "lodash/isEmpty";
import { Trans } from "@lingui/macro";
import { Flex, Box, Heading } from "@rebass/emotion";
import { LocationParams } from "@ehealth/components";

import Button from "../../../components/Button";
import Pagination from "../../../components/Pagination";
import SearchForm from "../../../components/SearchForm";
import LoadingOverlay from "../../../components/LoadingOverlay";
import filteredLocationParams from "../../../helpers/filteredLocationParams";

import EmployeesTable from "./EmployeesTable";
import { PrimarySearchFields, SecondarySearchFields } from "./SearchFields";

const Search = ({ navigate }) => (
  <Box p={6}>
    <LocationParams>
      {({ locationParams, setLocationParams }) => (
        <>
          <Flex justifyContent="space-between" alignItems="flex-start" mb={6}>
            <Box>
              <Heading as="h1" fontWeight="normal" mb={4}>
                <Trans>Employees</Trans>
              </Heading>
            </Box>
            <Box>
              <Button onClick={() => navigate("../create")} variant="green">
                <Trans>Create employee</Trans>
              </Button>
            </Box>
          </Flex>

          <SearchForm
            initialValues={locationParams}
            onSubmit={setLocationParams}
            renderPrimary={PrimarySearchFields}
            renderSecondary={SecondarySearchFields}
          />
          <Query
            query={SearchEmployeesQuery}
            fetchPolicy="network-only"
            variables={filteredLocationParams(locationParams)}
          >
            {({ loading, data }) => {
              if (isEmpty(data)) return null;
              const { nodes: employees = [], pageInfo } = data.employees;
              return (
                <LoadingOverlay loading={loading}>
                  {employees.length > 0 && (
                    <>
                      <EmployeesTable
                        employees={employees}
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
      )}
    </LocationParams>
  </Box>
);

const SearchEmployeesQuery = gql`
  query SearchEmployeesQuery(
    $filter: EmployeeFilter
    $orderBy: EmployeeOrderBy
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    employees(
      first: $first
      filter: $filter
      orderBy: $orderBy
      before: $before
      after: $after
      last: $last
    ) {
      nodes {
        ...Employees
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${EmployeesTable.fragments.entry}
  ${Pagination.fragments.entry}
`;

export default Search;
