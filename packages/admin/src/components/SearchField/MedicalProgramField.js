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

const SearchMedicalProgramField = ({ name }: { name: string }) => (
  <Trans
    id="Choose medical program"
    render={({ translation }) => (
      <Query
        query={MedicalProgramsQuery}
        fetchPolicy="cache-first"
        variables={{
          skip: true
        }}
      >
        {({
          data: { medicalPrograms: { nodes: medicalPrograms = [] } = {} } = {},
          refetch: refetchMedicalPrograms
        }) => (
          <Field.Select
            name={name}
            label={<Trans>Medical program</Trans>}
            placeholder={translation}
            items={medicalPrograms.map(({ databaseId, name }) => ({
              databaseId,
              name
            }))}
            itemToString={item => item && item.name}
            filter={medicalPrograms => medicalPrograms}
            onInputValueChange={debounce(
              (name, { selectedItem, inputValue }) =>
                !isEmpty(name) &&
                (selectedItem && selectedItem.name) !== inputValue &&
                refetchMedicalPrograms({
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

const MedicalProgramsQuery = gql`
  query MedicalProgramsQuery(
    $first: Int
    $filter: MedicalProgramFilter
    $skip: Boolean! = false
  ) {
    medicalPrograms(first: $first, filter: $filter) @skip(if: $skip) {
      nodes {
        id
        databaseId
        name
      }
    }
  }
`;

export default SearchMedicalProgramField;
