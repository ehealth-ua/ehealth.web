import React from "react";
import isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";
import { Query } from "react-apollo";
import { loader } from "graphql.macro";
import { Trans } from "@lingui/macro";

import { getFullName } from "@ehealth/utils";

import * as Field from "./Field";

const GetAssignEmployeeQuery = loader(
  "../graphql/GetAssignEmployeeQuery.graphql"
);

const AssigneeSearch = () => (
  <Trans
    id="Choose assignee"
    render={({ translation }) => (
      <Query query={GetAssignEmployeeQuery} variables={{ skip: true }}>
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

export default AssigneeSearch;
