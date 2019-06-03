import React from "react";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import { Trans } from "@lingui/macro";
import { SearchIcon } from "@ehealth/icons";
import { Flex, Box } from "@rebass/emotion";
import { Query } from "react-apollo";
import debounce from "lodash/debounce";

import STATUSES from "../../../helpers/statuses";
import * as Field from "../../../components/Field";

const PrimarySearchFields = () => (
  <Flex mx={-1}>
    <Box px={1} width={1 / 3}>
      <Trans
        id="Medical program ID"
        render={({ translation }) => (
          <Field.Text
            name="filter.databaseId"
            label={<Trans>Find medical program</Trans>}
            placeholder={translation}
            postfix={<SearchIcon color="silverCity" />}
          />
        )}
      />
    </Box>
    <Box px={1} width={1 / 3}>
      <Trans
        id="Choose medical program"
        render={({ translation }) => (
          <Query
            query={SearchMedicalProgramsQuery}
            fetchPolicy="cache-first"
            variables={{
              skip: true
            }}
          >
            {({
              loading,
              error,
              data: {
                medicalPrograms: { nodes: medicalPrograms = [] } = {}
              } = {},
              refetch: refetchMedicalProgram
            }) => {
              return (
                <Field.Select
                  name="filter.name"
                  label={<Trans>Medical program</Trans>}
                  placeholder={translation}
                  items={medicalPrograms.map(({ name }) => name)}
                  onInputValueChange={debounce(
                    (program, { selectedItem, inputValue }) =>
                      !isEmpty(program) &&
                      selectedItem !== inputValue &&
                      refetchMedicalProgram({
                        skip: false,
                        first: 20,
                        filter: { name: program }
                      }),
                    1000
                  )}
                />
              );
            }}
          </Query>
        )}
      />
    </Box>
    <Box px={1} width={1 / 3}>
      <Trans
        id="All statuses"
        render={({ translation }) => (
          <Field.Select
            name="filter.isActive"
            label={<Trans>Program status</Trans>}
            items={Object.keys(STATUSES.MEDICAL_PROGRAM_STATUS)}
            itemToString={item =>
              STATUSES.MEDICAL_PROGRAM_STATUS[item] || translation
            }
            variant="select"
            emptyOption
          />
        )}
      />
    </Box>
  </Flex>
);

const SearchMedicalProgramsQuery = gql`
  query SearchMedicalProgramsQuery(
    $first: Int
    $filter: MedicalProgramFilter
    $skip: Boolean! = false
  ) {
    medicalPrograms(first: $first, filter: $filter) @skip(if: $skip) {
      nodes {
        id
        name
      }
    }
  }
`;

export { PrimarySearchFields };
