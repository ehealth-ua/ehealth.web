//@flow
import React from "react";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import { Query } from "react-apollo";
import { Trans } from "@lingui/macro";
import debounce from "lodash/debounce";

import * as Field from "../Field";

const SearchServiceGroupField = ({ name }: { name: string }) => (
  <Trans
    id="Choose service group"
    render={({ translation }) => (
      <Query
        query={GetServiceGroupsQuery}
        fetchPolicy="cache-first"
        variables={{
          skip: true
        }}
      >
        {({
          data: { serviceGroups: { nodes: serviceGroups = [] } = {} } = {},
          refetch: refetchServiceGroups
        }) => (
          <Field.Select
            name={name}
            label={<Trans>Service group name</Trans>}
            placeholder={translation}
            items={serviceGroups.map(({ id, databaseId, name }) => ({
              id,
              databaseId,
              name
            }))}
            itemToString={item => item && item.name}
            filter={serviceGroups => serviceGroups}
            onInputValueChange={debounce(
              (name, { selectedItem, inputValue }) =>
                !isEmpty(name) &&
                (selectedItem && selectedItem.name) !== inputValue &&
                refetchServiceGroups({
                  skip: false,
                  first: 20,
                  filter: {
                    name,
                    isActive: true
                  }
                }),
              1000
            )}
          />
        )}
      </Query>
    )}
  />
);

const GetServiceGroupsQuery = gql`
  query GetServiceGroupsQuery(
    $first: Int
    $filter: ServiceGroupFilter
    $skip: Boolean! = false
  ) {
    serviceGroups(first: $first, filter: $filter) @skip(if: $skip) {
      nodes {
        id
        databaseId
        name
      }
    }
  }
`;

export default SearchServiceGroupField;
