import React from "react";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";
import { Query } from "react-apollo";
import { Trans } from "@lingui/macro";
import { getFullName } from "@ehealth/utils";
import * as Field from "./Field";
import FullName from "./FullName";

const AssigneeSearch = () => (
  <Trans
    id="Choose assignee"
    render={({ translation }) => (
      <Query query={GetEmployeeNameQuery} variables={{ skip: true }}>
        {({ data, refetch: refetchEmployees }) => {
          const { employees } = data || {};

          return (
            <Field.Select
              name="filter.assignee"
              label={<Trans>Performer</Trans>}
              placeholder={translation}
              items={
                employees &&
                employees.nodes.map(({ databaseId, party }) => ({
                  databaseId,
                  name: getFullName(party)
                }))
              }
              onInputValueChange={debounce(
                name =>
                  !isEmpty(name) &&
                  refetchEmployees({
                    skip: false,
                    first: 50,
                    filter: {
                      employeeType: ["NHS ADMIN SIGNER"],
                      status: "APPROVED",
                      party: { fullName: name }
                    }
                  }),
                1000
              )}
              itemToString={item => item && item.name}
              filterOptions={{ keys: ["name"] }}
            />
          );
        }}
      </Query>
    )}
  />
);

const GetEmployeeNameQuery = gql`
  query EmployeesQuery(
    $first: Int!
    $filter: EmployeeFilter
    $skip: Boolean! = false
  ) {
    employees(first: $first, filter: $filter) @skip(if: $skip) {
      nodes {
        id
        databaseId
        party {
          id
          ...FullName
        }
      }
    }
  }
  ${FullName.fragments.entry}
`;

export default AssigneeSearch;
