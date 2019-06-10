//@flow
import React from "react";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import { Query } from "react-apollo";
import { Trans } from "@lingui/macro";
import debounce from "lodash/debounce";
import { SearchIcon } from "@ehealth/icons";
import { Flex, Box } from "@rebass/emotion";

import * as Field from "../Field";

const SearchServiceField = ({ name }: { name: string }) => (
  <Trans
    id="Choose service"
    render={({ translation }) => (
      <Query
        query={GetServicesQuery}
        fetchPolicy="cache-first"
        variables={{
          skip: true
        }}
      >
        {({
          data: { services: { nodes: services = [] } = {} } = {},
          refetch: refetchServices
        }) => {
          const stringifyItem = item => item && `${item.name} (${item.code})`;

          return (
            <Field.Select
              name={name}
              label={<Trans>Service name</Trans>}
              placeholder={translation}
              items={services.map(({ id, databaseId, name, code }) => ({
                id,
                databaseId,
                name,
                code
              }))}
              itemToString={item => stringifyItem(item)}
              filter={services => services}
              onInputValueChange={debounce(
                (name, { selectedItem, inputValue }) =>
                  !isEmpty(name) &&
                  stringifyItem(selectedItem) !== inputValue &&
                  refetchServices({
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
          );
        }}
      </Query>
    )}
  />
);

const GetServicesQuery = gql`
  query GetServicesQuery(
    $first: Int
    $filter: ServiceFilter
    $skip: Boolean! = false
  ) {
    services(first: $first, filter: $filter) @skip(if: $skip) {
      nodes {
        id
        databaseId
        name
        code
      }
    }
  }
`;

export default SearchServiceField;
