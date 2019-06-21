//@flow
import React from "react";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import { Query } from "react-apollo";
import { Trans } from "@lingui/macro";
import debounce from "lodash/debounce";

import * as Field from "../Field";

const SearchMedicationField = ({ name }: { name: string }) => (
  <Trans
    id="Choose medication name"
    render={({ translation }) => (
      <Query
        query={MedicationsQuery}
        fetchPolicy="cache-first"
        variables={{
          skip: true
        }}
      >
        {({
          data: { medications: { nodes: medications = [] } = {} } = {},
          refetch: refetchMedications
        }) => (
          <Field.Select
            name="filter.medication.name"
            label={<Trans>Medication name</Trans>}
            placeholder={translation}
            items={medications.map(({ name }) => name)}
            filter={items => items}
            onInputValueChange={debounce(
              (name, { selectedItem, inputValue }) =>
                !isEmpty(name) &&
                selectedItem !== inputValue &&
                refetchMedications({
                  skip: false,
                  first: 20,
                  filter: { name: name }
                }),
              1000
            )}
          />
        )}
      </Query>
    )}
  />
);

const MedicationsQuery = gql`
  query MedicationsQuery(
    $first: Int
    $filter: MedicationFilter
    $skip: Boolean! = false
  ) {
    medications(first: $first, filter: $filter) @skip(if: $skip) {
      nodes {
        id
        databaseId
        name
      }
    }
  }
`;

export default SearchMedicationField;
